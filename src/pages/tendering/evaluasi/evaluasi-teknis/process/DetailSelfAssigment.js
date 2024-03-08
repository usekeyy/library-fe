import React, { Component } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Form from './sub/Form';
import { Panel, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { getEvaluasiTeknisCompare,showProcessEvaluasiTeknis,saveEvaluasiTeknisPublish, saveEvaluasiTeknisScore, storeEvaluasiTeknisKlarifikasi, getEvaluasiTeknisKlarifikasi, getEvaluasiTeknisAttactment, storeEvaluasiTeknisAttactment , deleteEvaluasiTeknisAttactment } from '../../../../../store/actions/tendering/evaluationTechnicalActions'
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import { Modal, ModalHeader, ModalBody , ModalFooter} from 'reactstrap';
import DetailItemPenawaran from "../detail/DetailItemPenawaran";
import { fileUpload } from '../../../../../store/actions/uploadActions';
import SweetAlert from 'react-bootstrap-sweetalert';


class DetailSelfAssigment extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            loading: false,
            isConfirm:false,
            uuidDelete:'',
            loadings: {
                loadingSaveAssignment: false,
                loading_submit_evaluasi: false,
                loading_submit_klasifikasi_btn : false,
                loading_submit_klasifikasi_form: false,
                loading_submit_evaluasi_btn : false,
                loading_submit_evaluasi_form: false,
                loading_modal_form :false
            },
            statusOptions: [
                { value: "self", label: "Self" },
                { value: "evaluator", label: "Assigment To Evaluator" },
            ],
            penilaianOptions: [
                { value: "lolos", label: "Lolos" },
                { value: "tidak lolos", label: "Tidak Lolos" },
            ],
            hasilEvaluasiOptions: [
                { value: "Hasil Evaluasi", label: "Hasil Evaluasi" },
                { value: "Hasil Klarifikasi Manual", label: "Hasil Klarifikasi Manual" },
                { value: "Lainnya", label: "Lainnya" },
            ],
            deviateData :[],
            modalOpen: false,
            assingTo: [],
            listAttactmentHasil :[],
            klarifikasiList : [],
            isMonitoring : this.props.location.pathname.split("/")[2] === 'monitoring-tender-buyer' ? true : false,
            select_item_type : 'barang'
        }
    }

    componentDidMount = () => {
        this._isMounted = true
        if (this._isMounted) {
            if(this.props.match.params.pruuid===undefined){
                this.getUUID()
            }else{
                this.getUUIDItemize()
            }
            this.getKlarifikasi()
            this.getEvaluasiTeknisAttactment()
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
            this.props.showProcessEvaluasiTeknis(this.props.match.params.id, this.props.match.params.uuid)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getUUIDItemize() {
        if (this._isMounted) {           
            this.setState({ loading: true });
            this.props.showProcessEvaluasiTeknis(this.props.match.params.id, this.props.match.params.uuid,{pr_item_uuid : this.props.match.params.pruuid})
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data: datas, loading: false })
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getKlarifikasi() {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings , loading_submit_klasifikasi_form : true}
            }))
            let payload = {}
            if(this.props.match.params.pruuid!==undefined){
                payload = {'pr_item_uuid' : this.props.match.params.pruuid}
            }
            console.log(payload)
            this.props.getEvaluasiTeknisKlarifikasi(this.props.match.params.id, this.props.match.params.uuid, payload)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({loadings})=> ({ 
                        klarifikasiList: datas,
                        loadings : {...loadings, loading_submit_klasifikasi_form : false}
                    }))
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_form : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    getEvaluasiTeknisAttactment() {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings , loading_submit_evaluasi_form : true}
            }))
            this.props.getEvaluasiTeknisAttactment(this.props.match.params.id,this.props.match.params.uuid,{
                pr_item_uuid : this.props.match.params.pruuid
            })
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({loadings})=> ({ 
                        listAttactmentHasil: datas,
                        loadings : {...loadings , loading_submit_evaluasi_form : false}
                    }))
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings , loading_submit_evaluasi_form : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);
                    // this.back('e')
                });
        }
    }

    storeEvaluasiTeknisAttactment(payload) {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings , loading_submit_evaluasi_btn: true}
            }))
            this.props.storeEvaluasiTeknisAttactment({
                uuid: this.props.match.params.id,
                vendor_id: this.props.match.params.uuid,
                tipe_lampiran: payload.tipe_lampiran,
                file: payload.file,
                description: payload.description,
                evaluasi_id: this.state.data.evaluasi_id,
                proposal_tender_id: this.state.data.id,
                pr_item_uuid : this.props.match.params.pruuid
            })
                .then((resp) => {
                    // let datas = resp.data.data;
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings , loading_submit_evaluasi_btn: false}
                    }))
                    this.getEvaluasiTeknisAttactment()

                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings , loading_submit_evaluasi_btn: false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);

                });
        }
    }

    storeEvaluasiTeknisKlarifikasi(payload) {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                loadings : {...loadings, loading_submit_klasifikasi_btn : true}
            }))
            this.props.storeEvaluasiTeknisKlarifikasi({
                uuid: this.props.match.params.id,
                vendor_id: this.props.match.params.uuid,
                note : payload.note,
                file : payload.file,
                due_date : payload.due_date,
                pr_item_uuid : this.props.match.params.pruuid
            })
                .then((resp) => {
                    toastr.success(resp.data.status, resp.data.message);
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_btn : false}
                    }))
                    this.getKlarifikasi()
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        loadings : {...loadings, loading_submit_klasifikasi_btn : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);

                });
        }
    }

    getEvaluasiTeknisCompare(pr_item_id, pr_service_id,tipe) {
        if (this._isMounted) {
            this.setState(({loadings})=> ({ 
                modalOpen:true,
                select_item_type : tipe,
                deviateData:[],
                loadings : {...loadings , loading_modal_form : true}
            }))

            this.props.getEvaluasiTeknisCompare(this.props.match.params.id, pr_item_id, pr_service_id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({loadings})=> ({
                        deviateData : datas,
                        loadings : {...loadings , loading_modal_form : false}
                    }))
                })
                .catch((resp) => {
                    this.setState(({loadings})=> ({ 
                        modalOpen:false,
                        loadings : {...loadings , loading_modal_form : false}
                    }))
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    assignTo() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showListVendorProcessTeknis(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ vendor: datas.vendor })
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
        this.setState(({loadings})=> ({ 
            modalOpen:false,
            deviateData:[],
            loadings : {...loadings , loading_modal_form : true}
        }))
    }
    back(e) {
        this.props.history.push('/tendering/evaluation-technical-assignment/process/'+this.props.match.params.id)
    }

    storeEvaluasiTeknisScore = (payload) => {

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_submit_evaluasi: true }
        }))

        this.props.saveEvaluasiTeknisScore(this.props.match.params.id, {
            vendor_id: this.props.match.params.uuid,
            mekanisme: this.state.data.metode_evaluasi,
            evaluasi_id: this.state.data.evaluasi_id,
            ambang_batas: this.state.data.ambang_batas.ambang_batas,
            pr_item_id : (this.state.data.order_placement==="itemize") ? this.state.data.items[0].pr_item_id : 0 , 
            evaluasi: payload,
        })
            .then((resp) => {
                // let datas = resp.data.data;
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_evaluasi: false }
                }))
                toastr.success(resp.data.message);
                this.props.history.push('/tendering/evaluation-technical-assignment/process/' + this.props.match.params.id)
            })
            .catch((resp) => {
                this.setState({ loading: false });
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_evaluasi: false }
                }))
            });
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    deletePayload = () => {
        if(this._isMounted){
            this.setState({ isConfirm: false });
            this.props.deleteEvaluasiTeknisAttactment(this.state.uuidDelete)
                .then((resp) => {
                    this.setState({ isConfirm: false, uuidDelete :'' });
                    toastr.success(resp.data.message);
                    this.getEvaluasiTeknisAttactment()
                })
                .catch((error) => {
                    if (error !== undefined) {
                        toastr.error(error.data.status,error.data.message)
                        this.setState({ isConfirm: false, uuidDelete : ''})
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    showSweetAlert (uuid) {
        // console.log(uuid)
        this.setState({ isConfirm: true , uuidDelete : uuid });
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Evaluasi</li>
                </ol>
                <h1 className="page-header">Evaluasi Teknis<small></small></h1>

                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loading &&
                    <div>
                        <Form
                            listAttactmentHasil = {this.state.listAttactmentHasil}
                            klarifikasiList = {this.state.klarifikasiList}
                            data={this.state.data}
                            penilaianOptions={this.state.penilaianOptions}
                            hasilEvaluasiOptions={this.state.hasilEvaluasiOptions}
                            vendor_id={this.props.match.params.uuid}
                            storeEvaluasiTeknisScore={(payload) => this.storeEvaluasiTeknisScore(payload)}
                            loadings={this.state.loadings}
                            upload={this.props.fileUpload}
                            storeEvaluasiTeknisAttactment={(payload) => this.storeEvaluasiTeknisAttactment(payload)}
                            storeEvaluasiTeknisKlarifikasi={(payload) => this.storeEvaluasiTeknisKlarifikasi(payload)}
                            saveEvaluasiTeknisPublish={(payload) => this.saveEvaluasiTeknisPublish(payload)}
                            showSweetAlert={(payload) => this.showSweetAlert(payload)}
                            getEvaluasiTeknisCompare={(pr_item_id, pr_service_id, tipe) => this.getEvaluasiTeknisCompare(pr_item_id, pr_service_id, tipe)}
                            back={(payload) => this.back(payload)}
                            has_roles = {this.props.user.has_roles}
                            isMonitoring={this.state.isMonitoring}
                        />
                    </div>
                }

            <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseModal()} className="modal-lg">
                <ModalHeader toggle={() => this.toggleCloseModal()}>Detail Item Penawaran</ModalHeader>
                <ModalBody>

                {this.state.loadings.loading_modal_form &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }

                {!this.state.loadings.loading_modal_form &&
                   <DetailItemPenawaran
                        data={this.state.deviateData}
                        tipe={this.state.select_item_type}
                    />
                }
                    
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" type="button" onClick={() => this.toggleCloseModal()} >{t("currency:button.close")}</button>
                </ModalFooter>
            </Modal>
            
            <SweetAlert
                warning
                show={this.state.isConfirm}
                showCancel
                confirmBtnText={t("common:delete.approve-delete")}
                cancelBtnText={t("common:delete.cancel")}
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="default"
                title={t("common:delete.title-delete")}
                onConfirm={() => this.toggleSweetAlert('confirm')}
                onCancel={() => this.toggleSweetAlert('cancel')}
            />
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
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        showProcessEvaluasiTeknis: (id, vendor_uuid, payload) => dispatch(showProcessEvaluasiTeknis(id, vendor_uuid, payload)),
        saveEvaluasiTeknisScore: (id, payload) => dispatch(saveEvaluasiTeknisScore(id, payload)),
        saveEvaluasiTeknisPublish: (id, payload) => dispatch(saveEvaluasiTeknisPublish(id, payload)),
        getEvaluasiTeknisKlarifikasi: (id, vendor_uuid, payload) => dispatch(getEvaluasiTeknisKlarifikasi(id, vendor_uuid, payload)),
        getEvaluasiTeknisAttactment: (id,vendor_id, payload) => dispatch(getEvaluasiTeknisAttactment(id,vendor_id, payload)),
        storeEvaluasiTeknisAttactment: (id, payload) => dispatch(storeEvaluasiTeknisAttactment(id, payload)),
        storeEvaluasiTeknisKlarifikasi: (payload) => dispatch(storeEvaluasiTeknisKlarifikasi(payload)),
        getEvaluasiTeknisCompare: (id,pr_item_id, pr_service_id) => dispatch(getEvaluasiTeknisCompare(id,pr_item_id, pr_service_id)),
        deleteEvaluasiTeknisAttactment : (id) => dispatch(deleteEvaluasiTeknisAttactment(id))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailSelfAssigment))
