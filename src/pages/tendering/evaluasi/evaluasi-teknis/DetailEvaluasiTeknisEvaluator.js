import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Header from './detail/Header';
import DetailTender from './detail/DetailTender';
import DocumentTenderEvaluator from './detail/DocumentTenderEvaluator';
import KonfigurasiEvaluasi from './evaluator/KonfigurasiEvaluasi';
import FormAddKonfig from './evaluator/FormAddKonfig';
import ListPeserta from './evaluator/ListPeserta';
import ListPesertaItemize from './evaluator/ListPesertaItemize';
import Catatan from './evaluator/Catatan';
// import Process from './detail/Process';
import { Modal, ModalHeader } from 'reactstrap';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ItemsEvaluator from './detail/ItemsEvaluator';
import { saveEvaluasiTeknisPublish, storeEvaluasiTeknisConfig, getEvaluasiTeknisSyarat, storeEvaluasiTeknisSyarat, showEvaluationTeknis, saveEvaluasiTeknisAssignment, showAssignToTeknis, showVendorEvaluasiTeknis, getEvaluasiTeknisCatatan } from '../../../../store/actions/tendering/evaluationTechnicalActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';

class DetailEvaluasiTeknisEvaluator extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: false,
            loadings: {
                loadingSaveAssignment: false,
                loading_button_add_config: false,
                loading_button_save_config: false,
                loading_button_submit_config: false,
                loading_list_point_penilaian: false
            },
            mekanismeOptions: [
                { value: "sistem_gugur", label: "Sistem Gugur" },
                { value: "sistem_nilai", label: "Ambang Batas" },
            ],
            modalOpen: false,
            assingTo: [],
            vendors: [],
            konfigArr: [],
            catatanArr: [],
            modalAddConfig: false,
            listPointPenilaianArr: [],
            KonfigurasiEvaluasiHeader:[],
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            this.getUUID()
            this.assignTo()
            this.getVendorEvaluasiTeknis()
            this.getEvaluasiTeknisCatatan()
            this.getEvaluasiTeknisSyarat()
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
                    this.setState({ vendors: datas.vendor , KonfigurasiEvaluasiHeader:datas.ambang_batas})
                })
                .catch((resp) => {
                    toastr.error(resp.data.status, resp.data.message);

                });
        }
    }

    getEvaluasiTeknisSyarat() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_list_point_penilaian: true },
            }));
            this.props.getEvaluasiTeknisSyarat(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        listPointPenilaianArr: datas,
                        loadings: { ...loadings, loading_list_point_penilaian: false },
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_list_point_penilaian: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);

                });
        }
    }

    getEvaluasiTeknisCatatan() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.getEvaluasiTeknisCatatan(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ catatanArr: datas })
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
        this.state.isMonitoring ? this.props.history.push('/tendering/monitoring-tender-buyer/detail/'+ this.props.match.params.id)
        : this.props.history.push('/tendering/evaluation-technical-assignment')
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

    evaluasiVendor(e, uuid) {
        if (this.state.isMonitoring){
            this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_evaluator/' + this.props.match.params.id + '/vendor/' + uuid)
        }else {
            this.props.history.push('/tendering/evaluation-technical-assignment/evaluator/' + this.props.match.params.id + '/vendor/' + uuid)
        }
    }

    evaluasiVendorItemize(e, uuid,pr_uuid) {
        if (this.state.isMonitoring){
            this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_evaluator/' + this.props.match.params.id + '/vendor/' + uuid+'/'+pr_uuid)
        }else {
            this.props.history.push('/tendering/evaluation-technical-assignment/evaluator/' + this.props.match.params.id + '/vendor/' + uuid+'/'+pr_uuid)
        }
    }
    

    toggleOpenModalRegistration = (e) => {
        this.setState({ modalAddConfig: true })
    }

    toggleCloseModalRegistration = () => {
        this.setState({ modalAddConfig: false })
    }

    storeSyarat(payload) {
        payload.uuid = this.props.match.params.id
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_button_add_config: true },
        }));
        this.props.storeEvaluasiTeknisSyarat(this.props.match.params.id, payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings }) => ({
                    modalAddConfig: false,
                    loadings: { ...loadings, loading_button_add_config: false },
                }));
                this.getEvaluasiTeknisSyarat()
            })
            .catch((resp) => {
                toastr.error("Error", resp.data.message)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_button_add_config: false },
                }));
                this.getEvaluasiTeknisSyarat()
            })
    }

    storeEvaluasiTeknisConfig(payload) {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_button_save_config: true },
        }));
        this.props.storeEvaluasiTeknisConfig(this.props.match.params.id, payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings }) => ({
                    modalAddConfig: false,
                    loadings: { ...loadings, loading_button_save_config: false },
                }));
            })
            .catch((resp) => {
                toastr.error("Error", resp.data.message)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_button_save_config: false },
                }));
            })
    }

    saveEvaluasiTeknisPublish(payload) {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_button_submit_config: true },
        }));
        this.props.saveEvaluasiTeknisPublish(this.props.match.params.id, payload)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings }) => ({
                    modalAddConfig: false,
                    loadings: { ...loadings, loading_button_submit_config: false },
                }));
                this.props.history.push('/tendering/evaluation-technical-assignment')
            })
            .catch((resp) => {
                toastr.error("Error", resp.data.message)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_button_submit_config: false },
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
                            status={this.state.data.status_proses === null ? "Process" : this.state.data.status_proses}
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
                        <DocumentTenderEvaluator
                            data={this.state.data.doc_tender}
                        />
                        <ItemsEvaluator
                            data={this.state.data.items}
                        />
                        <KonfigurasiEvaluasi
                            metode_evaluasi={this.state.data.metode_evaluasi}
                            ambang_batas={(this.state.KonfigurasiEvaluasiHeader.ambang_batas!==undefined) ? this.state.KonfigurasiEvaluasiHeader.ambang_batas:""}
                            bobot_komersil={(this.state.KonfigurasiEvaluasiHeader.bobot_komersil!==undefined) ? this.state.KonfigurasiEvaluasiHeader.bobot_komersil:""}
                            bobot_teknis={(this.state.KonfigurasiEvaluasiHeader.bobot_teknis!==undefined) ? this.state.KonfigurasiEvaluasiHeader.bobot_teknis:""}
                            mekanismeOptions={this.state.mekanismeOptions}
                            data={this.state.listPointPenilaianArr}
                            toggleOpen={(e) => this.toggleOpenModalRegistration(e)}
                            storeEvaluasiTeknisConfig={(payload) => this.storeEvaluasiTeknisConfig(payload)}
                            loadings={this.state.loadings}
                            has_roles={this.props.user.has_roles}
                            assignment={this.state.data.assignment}
                        />
                        {this.state.data.order_placement==="paket" && 
                        <ListPeserta
                            data={this.state.vendors}
                            evaluasiVendor={(e, uuid) => this.evaluasiVendor(e, uuid)}
                        />
                        }

                        {this.state.data.order_placement==="itemize" && 
                        <ListPesertaItemize
                            data={this.state.vendors}
                            evaluasiBtn={true}
                            metode_evaluasi = {this.state.data.metode_evaluasi}
                            evaluasiVendor={(e, uuid,pr_uuid) => this.evaluasiVendorItemize(e, uuid, pr_uuid)}
                        />
                        }
                        <Catatan
                            loadings={this.state.loadings}
                            data={this.state.catatanArr}
                            back={(e) => this.back(e)}
                            proses={this.state.data.status_proses}
                            saveEvaluasiTeknisPublish={(payload) => this.saveEvaluasiTeknisPublish(payload)}
                        />
                    </div>
                }

                <Modal isOpen={this.state.modalAddConfig} toggle={() => this.toggleCloseModalRegistration()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalRegistration()}>Tambah Konfigurasi</ModalHeader>
                    <FormAddKonfig
                        storeSyarat={(payload) => this.storeSyarat(payload)}
                        loadings={this.state.loadings}
                        toggleClose={() => this.toggleCloseModalRegistration()}
                    />
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
        showEvaluationTeknis: (id) => dispatch(showEvaluationTeknis(id)),
        showAssignToTeknis: (id) => dispatch(showAssignToTeknis(id)),
        saveEvaluasiTeknisAssignment: (payload) => dispatch(saveEvaluasiTeknisAssignment(payload)),
        showVendorEvaluasiTeknis: (id) => dispatch(showVendorEvaluasiTeknis(id)),
        getEvaluasiTeknisCatatan: (id) => dispatch(getEvaluasiTeknisCatatan(id)),
        getEvaluasiTeknisSyarat: (id) => dispatch(getEvaluasiTeknisSyarat(id)),
        storeEvaluasiTeknisSyarat: (id, payload) => dispatch(storeEvaluasiTeknisSyarat(id, payload)),
        storeEvaluasiTeknisConfig: (id, payload) => dispatch(storeEvaluasiTeknisConfig(id, payload)),
        saveEvaluasiTeknisPublish: (id, payload) => dispatch(saveEvaluasiTeknisPublish(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailEvaluasiTeknisEvaluator))
