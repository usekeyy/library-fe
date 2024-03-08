import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import Form from './detail/Form'
import QuillEditor from './detail/QuillEditor'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import FormDetail from '../purchasing-requisition/list/detail/FormDetail';
import DetailPersyaratan from './modal-persyaratan/DetailPersyaratan'
import ListEvaluasiTeknis from './modal-persyaratan/ListEvaluasiTeknis'
import ListPersyaratan from './modal-persyaratan/ListPersyaratan'
import { syncrnVendorSAP, showDurPersyaratanAdmin, showDurPersyaratanCommercial, showDurDetail, showDurNotes, showDurVendor, showDurVendorSelection, approvalDUR, storeDUR, showEDocDUR } from '../../../store/actions/tendering/durActions'
import { ShowDetailPurchasingRequisition } from '../../../store/actions/tendering/purchasingRequisitionActions'
import TdpExpired from './modal-persyaratan/TdpExpired';
import ModalPOOutstanding from '../monitoring-tender-buyer/detail/form/ModalPOOutstanding';


export class DetailDur extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            data: [],
            notes: "",
            vendors: [],
            vendorSelection: [],
            detail: [],
            attactment: [],
            loadings: {
                loading_vendor: false,
                loadingModal: false,
                loadingDataModal: false,
                loading_syncrn_vendor_sap: false
            },
            loading: true,
            errors: [],
            loadingSubmit: false,
            checkAll: false,
            optionsFilterBy: [
                { value: "sosheader", label: "SoS Header" },
                { value: "sositem", label: "SoS Item" },
            ],
            modalOpen: false,
            modalData: {
                items: [],
                item_potext: [],
                account_assignment: [],
                serviceline: []
            },
            eDoc: [],
            modalOpenEdoc: false,
            edocText: '',
            modalPersyaratan: false,
            modalTDP: false,
            modalPOOutstanding : false,
            titleModalPersyaratan: "",
            dataModalPersyaratan: {
                header: [],
                evaluasi_admin: [],
                persyaratan: []
            },
            temp_data_vendor : ''
        }
    }


    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
                // this.showDurVendor()
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
                .showDurDetail(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    let arrFilter1=[], arrFilter2 = [], arrFilter3 = []
                    let idFilter1=[], idFilter2 = [], idFilter3 = []

                    datas.filter_dur.filter1.forEach(element => {
                        arrFilter1.push({value:element.id, label: element.id+'-'+element.name})
                        idFilter1.push(element.id)
                    });
                    if(datas.filter_dur.tipe_penyedia==="general"){
                        datas.filter_dur.filter2.forEach(element => {
                            arrFilter2.push({value:element.id, label: element.id+'-'+element.name, bidang_usaha_id : element.bidang_usaha_id})
                            idFilter2.push(element.id)
                        });
                    }else if(datas.filter_dur.tipe_penyedia==="siujk"){
                        datas.filter_dur.filter2.forEach(element => {
                            arrFilter2.push({value:element.id, label: element.id+'-'+element.name, vendor_classification_id : element.vendor_classification_id})
                            idFilter2.push(element.id)
                        });
                    }else{
                        datas.filter_dur.filter2.forEach(element => {
                            arrFilter2.push({value:element.id, label: element.id+'-'+element.name})
                            idFilter2.push(element.id)
                        });
                    }
                   
                    datas.filter_dur.filter3.forEach(element => {
                        arrFilter3.push({value:element.id, label: element.id+'-'+element.name})
                        idFilter3.push(element.id)
                    });

                    if(datas.status==="r"){
                        datas.vendor=[];
                    }

                    // this.setState(({ loading: false, data: datas, vendorSelection: datas.vendor, eDoc: datas.e_doc_aanwijzing ,
                    //     filter1 : arrFilter1,
                    //     filter2 : arrFilter2,
                    //     filter3 : arrFilter3,
                    //  }));
                    this.setState(({ arrFilter }) => ({
                        arrFilter: { ...arrFilter, filter1:idFilter1,filter2:idFilter2,filter3:idFilter3, },
                        loading: false, data: datas, vendorSelection: datas.vendor, eDoc: datas.e_doc_aanwijzing ,
                        filter1 : arrFilter1,
                        filter2 : arrFilter2,
                        filter3 : arrFilter3,
                    }));
                    
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                });
        }
    }

    // showDurVendor(payload) {
    //     if (this._isMounted) {
    //         this.setState(({ loadings }) => ({
    //             loadings: { ...loadings, loading_vendor: true }
    //         }));
    //         let arr = ''
    //         if (payload === undefined) {
    //             arr = { sos_type: '', id: '', coi: 0 }
    //         } else {
    //             arr = payload
    //         }
    //         this.props
    //             .showDurVendor(this.props.match.params.id, arr)
    //             .then((resp) => {
    //                 let datas = resp.data.data;
    //                 this.setState(({ loadings, vendors }) => ({
    //                     vendors: datas,
    //                     loadings: { ...loadings, loading_vendor: false },
    //                 }));
    //             })
    //             .catch((resp) => {
    //                 this.setState(({ loadings }) => ({
    //                     loadings: { ...loadings, loading_vendor: false }
    //                 }));
    //                 toastr.error(resp.data.message);
    //             });
    //     }
    // }

    syncrnVendorSAP(payload) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_syncrn_vendor_sap: true }
            }));
            let pr_number_arr = []
            this.state.data.items.forEach((index) => {
                pr_number_arr.push(index.number_pr)
            })
            this.props
                .syncrnVendorSAP(this.props.match.params.id, { pr_number: pr_number_arr })
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings }) => ({
                        vendors: datas,
                        loadings: { ...loadings, loading_syncrn_vendor_sap: false },
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_syncrn_vendor_sap: false }
                    }));
                    toastr.error(resp.data.message);
                });
        }
    }

    handlerCheckList = (uuid) => {
        // console.log(uuid)
        let arr_selected = this.state.vendorSelection;
        let arrTempSelected = []
        if (this.state.vendorSelection.includes(uuid)) {
            this.state.vendorSelection.forEach((element, i) => {
                if (element !== uuid) {
                    arrTempSelected.push(element)
                }
            });
            arr_selected = arrTempSelected
        } else {
            arr_selected.push(uuid)
        }
        this.setState({ vendorSelection: arr_selected });
    }

    handleChecklistAll = (payload) => {
        // console.log(payload)
        let arr_selected = []
        payload.data.forEach((element, i) => {
            if (!arr_selected.includes(element)) {
                arr_selected.push(element)
            }
        });
        if (payload.checked) {
            this.setState({
                vendorSelection: arr_selected
            });
        } else {
            this.setState({
                vendorSelection: []
            });
        }
    }

    changeFiltersTableVendor = () => {
        console.log('changeFiltersTableVendor')
        this.setState({vendorSelection:[]})
    }


    savePayload = (payload) => {
        if (this._isMounted) {
            if (this.state.vendorSelection.length === 0) {
                toastr.warning(this.props.t("dur:warning-vendor-selection"));
            } else if (this.state.vendorSelection.length < this.state.data.kuorum) {
                toastr.error("Validation Kuorum", this.props.t("dur:validation-quorum") + this.state.data.kuorum);
            } else if((!payload.note || payload.note === '') && payload.status !== 'd'){
                toastr.error('Note Wajib Diisi')
                this.setState({errors : ['note']})
            } else {
                // console.log("executed")
                this.setState({ loadingSubmit: true, errors: [] });
                let payloads = {
                    status: payload.status,
                    notes: {
                        note: payload.note,
                        process: "Submit Buyer",
                    },
                    vendor_id: this.state.vendorSelection,
                    uuid: this.props.match.params.id,
                }
                if (payload.status === 'd'){
                    if(this.state.data.status === 'o' || this.state.data.status === 'r'){
                        payloads.approval = true
                    }else{
                        payloads.approval = false
                    }
                }
                this.props.storeDUR(payloads)
                    .then((resp) => {
                        this.setState({ loadingSubmit: false })
                        toastr.success(resp.data.message);
                        if (payload?.status === 'd'){
                            this.getUUID();
                            // window.location.reload();
                        }else{
                            this.props.history.push('/tendering/dur')
                        }
                    })
                    .catch(error => {
                        this.setState({ loadingSubmit: false })
                        if (error !== undefined) {
                            toastr.error(error.data.message)
                        } else {
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
            }
        }
    }

    approvalpayload = (payload) => {
        if (this._isMounted) {
            if(payload.note && payload.note !== ''){
                this.setState({ loadingSubmit: true, errors: [] });
                this.props.approvalDUR(this.props.match.params.id, {
                    status: payload.status,
                    notes: {
                        note: payload.note,
                        process: payload.status === "r" ? "Rejected DUR" : "Approval Dur",
                    },
                    vendor_id: this.state.vendorSelection,
                    uuid: this.props.match.params.id
                })
                .then((resp) => {
                    this.setState({ loadingSubmit: false })
                    toastr.success(resp.data.message);
                                    if(payload.status !== 'd'){
                                        this.props.history.push('/tendering/dur')
                                    }
                })
                .catch(error => {
                    this.setState({ loadingSubmit: false })
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })                
            }else{
                toastr.error('note wajib diisi')
                this.setState({errors : ['note']})
            }
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
        this.setState({ modalOpen: false, edocText: '' })
    }

    modalsEdoc = async (payload) => {
        this.setState(({ loadings, modalData }) => ({
            loadings: { ...loadings, loadingModal: true },
            modalOpenEdoc: true,
            modalData: { ...modalData, items: [], item_potext: [], account_assignment: [] }
        }));
        this.props.showEDocDUR(payload)
            .then((resp) => {
                const data = resp.data.data;
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false },
                    edocText: data.item_document.content
                }));
            })
            .catch((resp) => {
                toastr.error(resp.status, resp.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false },
                    edocText: ''
                }));
            });
    }

    showDurPersyaratanAdmin() {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingDataModal: true },
        }));
        this.props.showDurPersyaratanAdmin(this.props.match.params.id)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings, dataModalPersyaratan }) => ({
                    dataModalPersyaratan: { ...dataModalPersyaratan, header: resp.data.data.sistem_bobot, evaluasi_admin: resp.data.data.persyaratan_admin, persyaratan: resp.data.data.persyaratan_teknis },
                    loadings: { ...loadings, loadingDataModal: false },
                }));
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingDataModal: false },
                }));
            })
    }

    showDurPersyaratanCommercial() {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingDataModal: true },
        }));
        this.props.showDurPersyaratanCommercial(this.props.match.params.id)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings, dataModalPersyaratan }) => ({
                    dataModalPersyaratan: { ...dataModalPersyaratan, persyaratan: resp.data.data.persyaratan },
                    loadings: { ...loadings, loadingDataModal: false },
                }));
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingDataModal: false },
                }));
            })
    }

    modalOpenPersyaratan = async (payload) => {
        this.setState({ modalPersyaratan: true, titleModalPersyaratan: payload })
        if (payload === "administration") {
            this.showDurPersyaratanAdmin();
        } else {
            this.showDurPersyaratanCommercial();
        }
    }

    toggleCloseEDoc = () => {
        this.setState({ modalOpenEdoc: false })
    }

    toggleClosePersyaratan = () => {
        this.setState({ modalPersyaratan: false })
    }

    modalTDP = () => {
        this.setState({ modalTDP: true })
    }

    toggleCloseModalTDP = () => {
        this.setState({ modalTDP: false })
    }

    modalPOOutstanding = (e,data) => {
        e.preventDefault()
        this.setState({ temp_data_vendor : data, modalPOOutstanding: true })
    }
    toggleCloseModalPOOutstanding = () => {
        this.setState({ modalPOOutstanding: false })
    }

    getApprovalGroupBy = (dataApproval) => {
        let dataGroupBy = []
        if (dataApproval.length > 0){
            let dataTemp = {}
            let seq = 0 //1
            dataApproval.forEach((data,index) => {
                if (data.workflow_seq !== seq && seq !== 0){
                    dataGroupBy.push(dataTemp)
                    if(dataApproval.length === (index +1)){
                        dataGroupBy.push(data)
                    }else{
                        dataTemp = data
                    }
                }else{
                    if (seq === 0){
                        if(dataApproval.length === (index +1)){
                            dataGroupBy.push(data)
                        }else{
                            dataTemp = data
                        }
                    }else{
                        dataTemp.user_name = dataTemp.user_name + ', ' + data.user_name;
                        dataTemp.role_name = dataTemp.role_name + ', ' + data.role_name
                    }
                }
                seq = data.workflow_seq;
            });
        }
        console.log(dataGroupBy)
        return dataGroupBy;
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
                { !this.state.loading &&
                    <Form
                        data={this.state.data}
                        vendors={this.state.vendors}
                        vendorSelection={this.state.vendorSelection}
                        loadingSubmit={this.state.loadingSubmit}
                        loadings={this.state.loadings}
                        user={this.props.user}
                        access={this.props.access}
                        handlerCheckList={(payload) => this.handlerCheckList(payload)}
                        savePayload={(payload) => this.savePayload(payload)}
                        approvalpayload={(id, payload) => this.approvalpayload(id, payload)}
                        handleChecklistAll={(payload) => this.handleChecklistAll(payload)}
                        optionsFilterBy={this.state.optionsFilterBy}
                        modals={(payload) => this.modals(payload)}
                        modalsEdoc={(payload) => this.modalsEdoc(payload)}
                        showDurVendor={(payload) => this.showDurVendor(payload)}
                        syncrnVendorSAP={(payload) => this.syncrnVendorSAP(payload)}
                        modalOpenPersyaratan={(payload) => this.modalOpenPersyaratan(payload)}
                        modalTDP={() => this.modalTDP()}
                        uuid={this.props.match.params.id}
                        checkAll={this.state.checkAll}
                        modalPOOutstanding = {(e,data) => this.modalPOOutstanding(e,data)}
                        errors={this.state.errors}
                        filter1 ={this.state.filter1}
                        filter2 ={this.state.filter2}
                        filter3 ={this.state.filter3}
                        arrFilter={this.state.arrFilter}
                        changeFiltersTableVendor={this.changeFiltersTableVendor}
                    />
                }
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

                <Modal isOpen={this.state.modalOpenEdoc} toggle={() => this.toggleCloseEDoc()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseEDoc()}>Detail Item</ModalHeader>
                    {this.state.loadings.loadingModal && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}
                    {this.state.loadings.loadingModal === false && (
                        <div className="col-lg-12">
                            <QuillEditor
                                text={this.state.edocText} />
                        </div>

                    )}
                </Modal>

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

                <Modal isOpen={this.state.modalTDP} toggle={() => this.toggleCloseModalTDP()}>
                    <ModalHeader toggle={() => this.toggleCloseModalTDP()}>TDP Expired</ModalHeader>
                    <div className="col-lg-12 m-t-10">
                        <TdpExpired
                            data={this.state.data.tdp_expired}
                        />
                    </div>
                </Modal>

                <Modal isOpen={this.state.modalPOOutstanding} toggle={() => this.toggleCloseModalPOOutstanding()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalPOOutstanding()}>PO Outstanding</ModalHeader>
                    <div className="col-lg-12 m-t-10">
                        <ModalPOOutstanding 
								purchasing_org_id = {this.props.user.purchasing_org_id}
								data_vendor = {this.state.temp_data_vendor}
							/>
                    </div>
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
        showDurDetail: (payload) => dispatch(showDurDetail(payload)),
        showDurNotes: (payload) => dispatch(showDurNotes(payload)),
        showEDocDUR: (id) => dispatch(showEDocDUR(id)),
        showDurPersyaratanAdmin: (id) => dispatch(showDurPersyaratanAdmin(id)),
        showDurPersyaratanCommercial: (id) => dispatch(showDurPersyaratanCommercial(id)),
        showDurVendor: (id, payload) => dispatch(showDurVendor(id, payload)),
        showDurVendorSelection: (payload) => dispatch(showDurVendorSelection(payload)),
        approvalDUR: (id, payload) => dispatch(approvalDUR(id, payload)),
        syncrnVendorSAP: (id, payload) => dispatch(syncrnVendorSAP(id, payload)),
        ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
        storeDUR: (payload) => dispatch(storeDUR(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailDur));

