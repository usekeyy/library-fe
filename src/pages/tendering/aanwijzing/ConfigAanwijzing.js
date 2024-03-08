import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { toastr } from 'react-redux-toastr'
import FormConfigAanwijzing from './config-aanwijzing/FormConfigAanwijzing'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { fetchJadwalTender, showMonitoringTenderBuyerDetail, updateProposalTenderJadwal } from '../../../store/actions/tendering/monitoringTenderBuyerActions'
import FormDetail from '../purchasing-requisition/list/detail/FormDetail'
import { Modal , ModalHeader } from 'reactstrap'
import { ShowDetailPurchasingRequisition } from '../../../store/actions/tendering/purchasingRequisitionActions'
import { showDurPersyaratanAdmin, showDurPersyaratanCommercial } from '../../../store/actions/tendering/durActions'
import DetailPersyaratan from '../dur/modal-persyaratan/DetailPersyaratan'
import ListEvaluasiTeknis from '../dur/modal-persyaratan/ListEvaluasiTeknis'
import ListPersyaratan from '../dur/modal-persyaratan/ListPersyaratan'
import FormHistoryJadwal from '../monitoring-tender-buyer/detail/form/FormHistoryJadwal'
import { storeNoteAanwijzingCreate , putAanwijzingConfig } from '../../../store/actions/tendering/aanwijzingActions'
import FormJadwalTender from '../monitoring-tender-buyer/detail/form/FormJadwalTender'
// import QuillEditor from './detail/QuillEditor'
// import ConfigQuillEditor from './config-aanwijzing/ConfigQuillEditor'
import ModalEdoc from './config-aanwijzing/ModalEdoc'


class ConfigAanwijzing extends Component {

    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            data: [],
            header :[],
            notes: "",
            vendors: [],
            vendorSelection: [],
            detail: [],
            attactment: [],
            loadings: {
                loading_vendor: false,
                loadingModal: false,
                loading_modal_history : false,
                loading_aanwijzing_submit_note : false,
                loading_modal_monitoring_tender: false
            },
            loading: false,
            errors: [],
            loadingSubmit: false,
            checkAll: false,
            optionsFilterBy:[
                { value: "sosheader", label: "SoS Header" },
                { value: "sositem", label: "SoS Item" },
            ],
            modalOpen:false,
            modalData : {
                items:[],
                item_potext : [],
                account_assignment : [],
                serviceline:[]
            },
            historyJadwal:[],
            errorsNoteAanwijzing : [],
            modal_edit_jadwal_tender:false,
            jadwalTenderModal : "",
            modal_edoc : false,
            edocData :[],
            indexEdoc:0 ,
            tempEdoc : []
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showMonitoringTenderBuyerDetail(this.props.match.params.id,{aanwijzing_uuid : this.props.match.params.uuid_annwijzing})
                .then((resp) => {
                    let datas = resp.data.data;       
                    this.setState(({ loading: false, data: datas }));
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                });
        }
    }

    modals = async (payload) => {
        this.setState(({ loadings, modalData }) => ({
            loadings: { ...loadings, loadingModal: true },
            modalOpen: true,
            modalData: { ...modalData, items: [], item_potext: [], account_assignment: [] }
        }));
        this.props.ShowDetailPurchasingRequisition(payload)
            .then((resp) => {
                const data = resp.data.data;
                this.setState(({ loadings, modalData }) => ({
                    loadings: { ...loadings, loadingModal: false },
                    modalData: { ...modalData, items: data.items, item_potext: data.item_potext, account_assignment: data.account_assignment, serviceline: data.serviceLine }
                }));
            })
            .catch((resp) => {
                toastr.error(resp.status, resp.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false }
                }));
            });
    }

    toggleClose = () => {
        this.setState({ modalOpen: false })
    }

    modalOpenPersyaratan = async (payload) => {
        console.log(payload)
        this.setState({ modalPersyaratan: true, titleModalPersyaratan: payload })
        if(payload==="administration"){
            this.showDurPersyaratanAdmin();
        }else{
            this.showDurPersyaratanCommercial();
        }
    }

    showDurPersyaratanAdmin () {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingDataModal: true },
        }));
        this.props.showDurPersyaratanAdmin(this.props.match.params.id)
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState(({ loadings ,dataModalPersyaratan}) => ({
                dataModalPersyaratan : {...dataModalPersyaratan, header : resp.data.data.sistem_bobot, evaluasi_admin:resp.data.data.persyaratan_admin, persyaratan: resp.data.data.persyaratan_teknis},
                loadings: { ...loadings, loadingDataModal: false },
            }));
        })
        .catch((resp)=>{
            toastr.error(resp.data.status, resp.data.message);
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingDataModal: false },
            }));
        })
    }

    showDurPersyaratanCommercial () {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingDataModal: true },
        }));
        this.props.showDurPersyaratanCommercial(this.props.match.params.id)
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState(({ loadings ,dataModalPersyaratan}) => ({
                dataModalPersyaratan : {...dataModalPersyaratan, persyaratan:resp.data.data.persyaratan},
                loadings: { ...loadings, loadingDataModal: false },
            }));
        })
        .catch((resp)=>{
            toastr.error(resp.data.status, resp.data.message);
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loadingDataModal: false },
            }));
        })
    }

    fetchJadwalTender () {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_modal_history: true },
            modalHistory : true
        }));
        this.props.fetchJadwalTender(this.props.match.params.id)
        .then((resp)=>{
            toastr.success("Success", resp.data.message)
            this.setState(({ loadings }) => ({
                historyJadwal : resp.data.data,
                loadings: { ...loadings, loading_modal_history: false },
            }));
        })
        .catch((resp)=>{
            toastr.error(resp.data.status, resp.data.message);
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_modal_history: false },
            }));
        })
    }

    toggleClosePersyaratan = () => {
        this.setState({ modalPersyaratan: false })
    }
    
    toggleCloseHistoryJadwal = () => {
        this.setState({ modalHistory: false })
    }
    toggleCloseEditJadwal = () => {
        this.setState({ modal_edit_jadwal_tender : false })
    }

    storeNoteAanwijzingCreate(payload) {
        if (this._isMounted) {
            let arrPayload = []
            this.state.data.e_doc_aanwijzing.forEach((element, i) => {
                element.items.forEach((elementChild, j) => {
                    arrPayload.push(
                        {   uuid : elementChild.uuid,
                            title : elementChild.title,
                            content : elementChild.content,
                            order : j
                        }
                    )
                });
            });
            // payload.edoc_items = this.state.data.e_doc_aanwijzing.map((data, index) => {
            //     return {
            //         uuid : data.document_item_uuid,
            //         title : data.document_item_title,
            //         content : data.document_item_content,
            //         order : index
            //     };
            // });
            payload.edoc_items=arrPayload
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_aanwijzing_submit_note: true},
                errorsNoteAanwijzing: []
            }))
            this.props.putAanwijzingConfig(this.props.match.params.uuid_annwijzing,payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_aanwijzing_submit_note: false},
                }))
                toastr.success(resp.data.status, resp.data.message)
                this.props.history.push('/tendering/aanwijzing-user')
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_aanwijzing_submit_note: false},
                    errorsNoteAanwijzing : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    updateProposalTenderJadwal(uuid,payload) {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_aanwijzing_submit_note: true},
                errorsNoteAanwijzing: []
            }))
            this.props.updateProposalTenderJadwal(uuid,payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    modal_edit_jadwal_tender : false,
                    loadings : {...loadings , loading_aanwijzing_submit_note: false},
                }))
                toastr.success(resp.data.status, resp.data.message)
                this.getUUID()
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_aanwijzing_submit_note: false},
                    errorsNoteAanwijzing : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    openEditJadwal (payload) {
        this.setState({
            jadwalTenderModal : [this.state.data.jadwal_tender[payload]],
            modal_edit_jadwal_tender : true
        })
    }

    modalEdoc (payload) {
        if(this._isMounted){
            // let arr = this.state.data.e_doc_aanwijzing[payload]
            this.setState({ 
                modal_edoc : true,
                edocData : this.state.data.e_doc_aanwijzing[payload],
                indexEdoc : payload
            })
            // this.setState ({
            //     modal_edoc : true,
            //     edocData : arr,
            //     indexEdoc : payload
            // })
        }
    }

    saveModalEdoc (index,payload) {
        // let arr = this.state.data.e_doc_aanwijzing.map((data) => {
        //     return data;
        // });
        // arr[index] = payload
        // this.setState(({data}) => ({ 
        //     data : {...data , e_doc_aanwijzing: arr},
        //     modal_edoc : false,
        // }))
    }

    removeEdoc (payload) {
        // let arr =[]
        // this.state.data.e_doc_aanwijzing.forEach((element, i) => {
        //     if(i!==payload){
        //         arr.push(element)
        //     }
        // });
        // this.setState(({data}) => ({ 
        //     // data : {...data , e_doc_aanwijzing: arr}
        // }))
    }

    toggleCloseEdoc = () =>  {
            this.setState({ modal_edoc : false , edocData : []})
    }

    save (payload) {
        if(this._isMounted){
            let arr = [];

            this.state.data.e_doc_aanwijzing.forEach((element, i) => {
                if(parseInt(payload.index)===i){
                    element.items=payload.items
                } 
                 arr.push(element)
            });
            this.setState(({data})=> ({
                data : {...data, e_doc_aanwijzing: arr}
            }));
            this.toggleCloseEdoc();
        }
    }

    render() {
        return (
            <div>

                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                {!this.state.loading &&
                    <FormConfigAanwijzing
                        data={this.state.data}
                        modals={(payload) => this.modals(payload)}
                        modalOpenPersyaratan={(payload) => this.modalOpenPersyaratan(payload)}
                        fetchJadwalTender={(payload) => this.fetchJadwalTender(payload)}
                        storeNoteAanwijzingCreate={(payload) => this.storeNoteAanwijzingCreate(payload)}
                        loadings = {this.state.loadings}
                        openEditJadwal = {(payload) => this.openEditJadwal(payload)}
                        modalEdoc = {(payload) => this.modalEdoc (payload)}
                        removeEdoc = {(payload) => this.removeEdoc (payload)}
                        addEdoc={()=>this.addEdoc()}
                    />
                }

                {/* Modal Detail Item */}
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>
                    {this.state.loadings.loadingModal && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}
                    {this.state.loadings.loadingModal === false && (
                        <FormDetail
                            disabledForm={true}
                            data={this.state.modalData}
                            toggleClose={this.toggleClose}
                        />
                    )}
                </Modal>
                {/* End Modal Detail item */}

                {/* Modal Persyaratan */}
                <Modal isOpen={this.state.modalPersyaratan} toggle={() => this.toggleClosePersyaratan()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleClosePersyaratan()}>{(this.state.titleModalPersyaratan === "administration") ? "Persyaratan Adminstrasi & Teknis" : "Commercial"}</ModalHeader>
                    {this.state.loadings.loadingDataModal && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}
                    {this.state.loadings.loadingDataModal === false && (
                        <div className="col-lg-12 m-t-10">

                            {this.state.titleModalPersyaratan === "administration" &&
                                <div>
                                    <DetailPersyaratan
                                        metode_evaluasi={this.state.data.metode_evaluasi}
                                        data={this.state.dataModalPersyaratan.header}
                                    />
                                    <ListEvaluasiTeknis
                                        metode_evaluasi={this.state.data.metode_evaluasi}
                                        data={this.state.dataModalPersyaratan.evaluasi_admin}
                                    />
                                </div>
                            }
                            <div>
                                <ListPersyaratan
                                    metode_evaluasi={this.state.data.metode_evaluasi}
                                    data={this.state.dataModalPersyaratan.persyaratan}
                                />
                            </div>
                        </div>
                    )}
                </Modal>
                {/* END Modal Persyaratan */}

                {/* Modal history Jadwal */}
                <Modal isOpen={this.state.modalHistory} toggle={() => this.toggleCloseHistoryJadwal()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseHistoryJadwal()}>Detail Item</ModalHeader>
                    {this.state.loadings.loading_modal_history && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}
                    {this.state.loadings.loading_modal_history === false && (
                        <FormHistoryJadwal
                            data={this.state.historyJadwal}
                        />
                    )}
                </Modal>
                {/* END Modal history Jadwal */}
                
                {/* Modal Monitoring Tender */}
                <Modal isOpen={this.state.modal_edit_jadwal_tender} toggle={() => this.toggleCloseEditJadwal()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseEditJadwal()}>Detail Item</ModalHeader>
                    {this.state.loadings.loading_modal_history && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}
                    {this.state.loadings.loading_modal_monitoring_tender === false && (
                        <FormJadwalTender 
                            data={this.state.jadwalTenderModal} 
                            update={(uuid, payload) => this.updateProposalTenderJadwal (uuid, payload)}
                            loading={this.state.loadings.loading_aanwijzing_submit_note}
                        />
                    )}
                </Modal>
                {/* End Modal Monitoring Tender */}

                {/* Modal Edoc */}
                <Modal isOpen={this.state.modal_edoc} toggle={() => this.toggleCloseEdoc()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseEdoc()}>E-doc</ModalHeader>
                    
                    <ModalEdoc
                        // parentState={this.state}
                        // parentProps={this.props}
                        toggleClose={this.toggleCloseEdoc}
                        edocData = {this.state.edocData}
                        indexEdoc={this.state.indexEdoc}
                        save={(payload)=>this.save(payload)}
                        // deleteEdocItems={this.deleteEdocItems}
                    />
                    
                </Modal>
                {/* End Modal Edoc */}

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
        showMonitoringTenderBuyerDetail: (id, payload) => dispatch(showMonitoringTenderBuyerDetail(id, payload)),
        ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
        showDurPersyaratanAdmin: (id) => dispatch(showDurPersyaratanAdmin(id)),
        showDurPersyaratanCommercial: (id) => dispatch(showDurPersyaratanCommercial(id)),
        fetchJadwalTender: (id) => dispatch(fetchJadwalTender(id)),
        storeNoteAanwijzingCreate: (payload) => dispatch(storeNoteAanwijzingCreate(payload)),
        updateProposalTenderJadwal: (uuid,payload) => dispatch(updateProposalTenderJadwal(uuid,payload)),
        putAanwijzingConfig : (id, payload) => dispatch(putAanwijzingConfig(id, payload))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ConfigAanwijzing));
