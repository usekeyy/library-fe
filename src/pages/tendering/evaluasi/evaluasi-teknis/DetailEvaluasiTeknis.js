import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Header from './detail/Header';
import DetailTender from './detail/DetailTender';
import DocumentTender from './detail/DocumentTender';
import ListPeserta from './detail/ListPeserta';
import ListPesertaItemize from './detail/ListPesertaItemize';
import Process from './detail/Process';
// import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import Items from './detail/ItemsEvaluator';
import { showEvaluationTeknis, saveEvaluasiTeknisAssignment, showAssignToTeknis , showVendorEvaluasiTeknis } from '../../../../store/actions/tendering/evaluationTechnicalActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';

class DetailEvaluasiTeknis extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            documents: [{
                "type": "OE",
                "description": " Lampiran 1",
                "attactment": "file.xls"
            }, {
                "type": "OA",
                "description": " Lampiran 2",
                "attactment": "filekedua.xls"
            }],
            loading: false,
            loadings: {
                loadingSaveAssignment: false
            },
            statusOptions: [
                { value: "self", label: "Self" },
                { value: "evaluator", label: "Assigment To Evaluator" },
            ],
            modalOpen: false,
            assingTo: [],
            vendors : []
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            this.getUUID()
            this.assignTo()
            this.getVendorEvaluasiTeknis()
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showEvaluationTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                    // this.back('e')
                });
        }
    }
    getVendorEvaluasiTeknis() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showVendorEvaluasiTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ vendors: datas.vendor })
                })
                .catch((resp) => {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                    // this.back('e')
                });
        }
    }
    assignTo() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showAssignToTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    let options = datas.map((data) => {
                        return { value: data.id, label: data.company_id + ' - ' + data.description };
                    })
                    this.setState({ assingTo: options })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                    this.back('e')
                });
        }
    }

    toggleOpenModal = (e, original) => {
        this.setState({
            modalOpen: true
        })
    }

    toggleCloseModal = () => {
        this.setState({
            modalOpen: false
        })
    }
    back(e) {
        this.props.history.push('/tendering/evaluation-technical')
    }

    saveAssignment(payload) {
        payload.uuid = this.props.match.params.id
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingSaveAssignment: true },
        }));
        this.props.saveEvaluasiTeknisAssignment(payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                    this.back()
            })
            .catch((resp) => {
                toastr.error("Error", resp.data.message)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingSaveAssignment: false },
                }));
            })
    }


    render() {
        const {t} = this.props
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Evaluasi</li>
                </ol>
                <h1 className="page-header">{t("evaluation:title-technical-evaluation")}<small></small></h1>

                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loading &&
                    <div>
                        <Header
                            proposal_tender_no={this.state.data.proposal_tender_no}
                            description={this.state.data.title}
                            status={this.state.data.proses}
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
                            order_placement={this.state.data.order_placement}
                        />
                        <DocumentTender
                            data={this.state.data.doc_tender}
                        />
                        <Items
                            data={this.state.data.items}
                            />
                        {this.state.data.order_placement==="paket" && 
                        <ListPeserta
                            data={this.state.vendors}
                        />
                        }

                        {this.state.data.order_placement==="itemize" && 
                        <ListPesertaItemize
                            data={this.state.vendors}
                            evaluasiBtn={false}
                            metode_evaluasi = {this.state.data.metode_evaluasi}
                        />
                        }
                        <Process
                            status={this.state.statusOptions}
                            assign={this.state.assingTo}
                            save={(payload) => this.saveAssignment(payload)}
                            loadings={this.state.loadings}
                            back={(e) => this.back(e)}
                        />
                    </div>
                }

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
        showEvaluationTeknis: (id) => dispatch(showEvaluationTeknis(id)),
        showAssignToTeknis: (id) => dispatch(showAssignToTeknis(id)),
        saveEvaluasiTeknisAssignment: (payload) => dispatch(saveEvaluasiTeknisAssignment(payload)),
        showVendorEvaluasiTeknis: (id) => dispatch(showVendorEvaluasiTeknis(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailEvaluasiTeknis))
