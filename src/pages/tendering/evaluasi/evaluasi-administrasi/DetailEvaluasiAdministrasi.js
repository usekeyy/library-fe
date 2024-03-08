import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import DetailTender from './detail/DetailTender';
import DocumentTender from './detail/DocumentTender';
import Header from './detail/Header';
import ListPeserta from './detail/ListPeserta';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import FormModal from './detail/FormModal';
import { showDetailEvaluation, showDetailVendorEvaluation , publishEvaluasiAdmin , prosesEvaluasiAdmin } from '../../../../store/actions/tendering/evaluationAdministrationActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';

class DetailEvaluasiAdministrasi extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            modalOpen: false,
            loading: false,
            loadings: {
                loadingModal: false,
                loadingBtnSubmitOnModal : false,
                loadingPublishBtn : false,
            },
            modalData: {
                vendor_id: '',
                vendor_name: '',
                data :[]
            },
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    toggleOpenModal = (e, uuid_vendor) => {
        this.setState(({ loadings }) => ({
            modalOpen: true,
            loadings: { ...loadings, loadingModal: true },
        }));

        this.props.showDetailVendorEvaluation(this.props.match.params.id, uuid_vendor)
            .then((resp) => {
                let datas = resp.data.data;
                this.setState(({ loadings, modalData }) => ({
                    modalData : {...modalData, vendor_id : datas.vendor_id, vendor_name:datas.vendor_name, data : datas.persyaratan},
                    loadings: { ...loadings, loadingModal: false },
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    modalOpen: false,
                    loadings: { ...loadings, loadingModal: false },
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    toggleCloseModal = () => {
        this.setState({
            modalOpen: false
        })
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showDetailEvaluation(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error("FAILED LOAD DATA", resp.message);
                });
        }
    }

    back(e,type) {
        console.log(type)
        type === 'monitoring' ? this.props.history.push(`/tendering/monitoring-tender-buyer/detail/${this.props.match.params.id}`) : this.props.history.push('/tendering/evaluation-administration')
    }

    publishEvaluasiAdmin(payload) { 
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingPublishBtn: true },
        }));

        this.props.publishEvaluasiAdmin({uuid:this.props.match.params.id, "proses":"teknis"})
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingPublishBtn: false },
            }));
            this.back();
        })
        .catch((resp)=>{
            toastr.error("Error", resp.data.message)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingPublishBtn: false },
            }));
        })
    }

    processEvaluasi (payload) {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingBtnSubmitOnModal: true },
        }));

        this.props.prosesEvaluasiAdmin(payload)
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState(({ loadings ,modalData}) => ({
                modalOpen: false,
                modalData : {...modalData, vendor_id : '', vendor_name:'', data : []},
                loadings: { ...loadings, loadingBtnSubmitOnModal: false },
            }));
            this.getUUID();
        })
        .catch((resp)=>{
            toastr.error("Error", resp.data.message)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingBtnSubmitOnModal: false },
            }));
        })
    }


    render() {
        const {t} = this.props;
        return (
            <div>
                {console.log(this.state.isMonitoring)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Evaluasi</li>
                </ol>
                <h1 className="page-header">{t("evaluation:title-administrative-evaluation")}<small></small></h1>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loading &&
                    <div>
                        <Header
                            proposal_tender_no={this.state.data.number}
                            description={this.state.data.title}
                            oe={this.state.data.total_value}
                        />
                        <DetailTender
                            metode_pengadaan_name={this.state.data.metode_pengadaan_name}
                            pra_qualification={this.state.data.pra_qualification}
                            metode_aanwijzing_name={this.state.data.metode_aanwijzing_name}
                            metode_penyampaian_name={this.state.data.metode_penyampaian_name}
                            metode_evaluasi={this.state.data.metode_evaluasi}
                            metode_negosiasi={this.state.data.metode_negosiasi}
                            multiwinner={this.state.data.multiwinner}
                            bid_bond={this.state.data.bid_bond}
                            bid_bond_value={this.state.data.bid_bond_value}
                        />
                        <DocumentTender
                            data={this.state.data.attachment}
                        />
                        <ListPeserta
                            data={this.state.data.vendor}
                            openModal={(e, uuid) => this.toggleOpenModal(e, uuid)}
                            back={(e,type) => this.back(e,type)}
                            publishEvaluasiAdmin={(payload) => this.publishEvaluasiAdmin(payload)}
                            loadings = {this.state.loadings}
                            isMonitoring = {this.state.isMonitoring}
                        />
                    </div>
                }

                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseModal()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModal()}>Evaluasi Administrasi</ModalHeader>
                    {this.state.loadings.loadingModal &&
                        <Panel>
                            <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                            </PanelBody>
                        </Panel>
                    }
                    {!this.state.loadings.loadingModal &&
                    <ModalBody>
                        <div className="row">
                            <div className="col-sm-12">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <tbody>
                                        <tr>
                                            <td>No Vendor</td>
                                            <td>{this.state.modalData.vendor_id}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Vendor</td>
                                            <td>{this.state.modalData.vendor_name}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Panel >
                                    <PanelHeader noButton={true}>
                                        Header
                                </PanelHeader>
                                    <PanelBody>
                                        <FormModal
                                            data = {this.state.modalData.data}
                                            save = {(payload) => this.processEvaluasi(payload)}
                                            uuid = {this.props.match.params.id}
                                            vendor_id = {this.state.modalData.vendor_id}
                                            loadings = {this.state.loadings}
                                            isMonitoring = {this.state.isMonitoring}
                                        />
                                    </PanelBody>
                                </Panel>
                            </div>
                        </div>
                    </ModalBody>
                }
                </Modal>

            </div>
        )
    }
}
const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        showDetailEvaluation: (id) => dispatch(showDetailEvaluation(id)),
        publishEvaluasiAdmin: (payload) => dispatch(publishEvaluasiAdmin(payload)),
        prosesEvaluasiAdmin: (payload) => dispatch(prosesEvaluasiAdmin(payload)),
        showDetailVendorEvaluation: (uuid, $uuid_vendor) => dispatch(showDetailVendorEvaluation(uuid, $uuid_vendor)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailEvaluasiAdministrasi))
