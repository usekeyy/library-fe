import React, { Component } from 'react'
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import MsrFormHeader from "./msr-list-form/MsrForm";
import ModalForm from './msr-list-form/ModalForm'
import ModalReject from './msr-list-form/reject/ModalReject'
import { fileUpload } from '../../../store/actions/uploadActions';
import { withTranslation } from 'react-i18next';
import { saveMaterialServices, showMaterialServices, updateMaterialServices, assgnMaterialServices } from '../../../store/actions/tendering/materialServiceActions'
import { fetchCurrencies } from '../../../store/actions/master/currenciesActions'
import { fetchSpecificPlanner } from '../../../store/actions/master/specificPlannerActions'
import { fetchGeneralPlanner } from '../../../store/actions/master/generalPlannerActions'
import { toastr } from 'react-redux-toastr';
// import { statusName } from '../../../helpers/statusName';
// import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
// import { sync } from 'resolve';


class MaterialRequestListForm extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            files: [],
            items: [],
            attachment: [],
            currency: [],
            general_planner: [],
            specific_planner: [],
            sendData: {
                currency: '',
                priority: '',
                assign_to: '',
                created_by: '',
                unit: '',
                paket_number: '',
                description: '',
                status: '',
                status_text: '',
                work_unit_name: '',
            },
            priorities: {

            },
            optionsPrioritas: [
                { value: "low", label: "Low" },
                { value: "normal", label: "Normal" },
                { value: "high", label: "High" }
            ],
            optionsTipeLampiran: [
                { value: "tor", label: "TOR" },
                { value: "oe", label: "OE" },
                { value: "rks", label: "RKS" },
                { value: "lainnya", label: "LAINNYA" }
            ],
            loadings: {
                general_planner: false,
                currency: false,
                specific_planner: false,
            },
            loading: false,
            errors: [],
            error_items: [],
            uuid: '',
            loadingSubmit: false,
            modalOpen: false,
            disableModal: false,
            modalData: [],
            isConfirmReject: false,
            isConfirmApproved: false,
            changeStatusRejectApprove: '',
            keyItems: '',
            note : '',
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.user.has_roles.includes("REQ001")) {
                this.fetchCurrencies()
                this.fetchGeneralPlanner()
            }
            if (this.props.match.params.id !== undefined) {
                this.getUUID()
            }
            
        }
    }

    getUUID() {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showMaterialServices(this.props.match.params.id)
                .then((resp) => {
                    let data = resp.data.data;
                    this.setState(({ sendData }) => ({
                        sendData: {
                            ...sendData,
                            currency: { value: data.currency_id, label: data.currency_id + ' - ' + data.currency_name },
                            priority: { value: data.priority, label: data.priority.toUpperCase() },
                            assign_to: { value: data.assign_to, label: data.assign_to + ' - ' + data.assign_to_name },
                            created_by: data.created_by_name,
                            created_uuid: data.created_by,
                            unit: data.work_unit_id,
                            unit_name: data.work_unit_name,
                            paket_number: data.number,
                            description: data.description,
                            status: data.status,
                            status_text: data.status_text,
                            work_unit_name: data.work_unit_name,
                        },
                    }));
                    this.setState({ items: data.items, attachment: data.attachment, uuid: data.uuid, loading: false })
                    if (this.props.user.has_roles.includes("PLNRGN")) {
                        this.fetchSpecificPlanner("");
                    }
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                });

        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleFormOpen = (e) => {
        // console.log(this.state.keyItems)
        this.setState({ modalOpen: true, disableModal: false, keyItems: '' })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, isError: false, errors: {}, loadingSubmit: false, disableModal: false, modalData: [] })
    }

    toggleShowModal = (payload) => {
        let data = {
            item_category_id: { value: this.state.items[payload].item_category_id, label: this.state.items[payload].item_category_id + " - " + this.state.items[payload].item_category_name },
            item_id: (this.state.items[payload].item_id==="" || this.state.items[payload].item_id==="manual") ? {value:"manual", label: "Manual"}  : { value: this.state.items[payload].item_id, label: this.state.items[payload].item_id + " - " + this.state.items[payload].item_description },
            item_description: this.state.items[payload].item_description,
            qty: parseFloat(this.state.items[payload].qty),
            uom_id: { value: this.state.items[payload].uom_id, label: this.state.items[payload].uom_code + " - " + this.state.items[payload].uom_name },
            per: this.state.items[payload].per,
            unit_price: parseFloat(this.state.items[payload].unit_price),
            delivery_date: this.state.items[payload].delivery_date,
            plant_id: { value: this.state.items[payload].plant_id, label: this.state.items[payload].plant_id + " - " + this.state.items[payload].plant_name },
            storage_location_id: (this.state.items[payload].storage_location_id===null || this.state.items[payload].storage_location_id==="") ? null : { value: this.state.items[payload].storage_location_id, label: this.state.items[payload].storage_location_id + " - " + this.state.items[payload].storage_location_name },
            mrp_controller_id: (this.state.items[payload].mrp_controller_id === null || this.state.items[payload].mrp_controller_id === "") ? null : { value: this.state.items[payload].mrp_controller_id, label: this.state.items[payload].mrp_controller_id + " - " + this.state.items[payload].mrp_controller_name },
            incoterm_id: (this.state.items[payload].incoterm_id  ===null || this.state.items[payload].incoterm_id  ==="") ? null : { value: this.state.items[payload].incoterm_id, label: this.state.items[payload].incoterm_id + " - " + this.state.items[payload].incoterm_name },
            incoterm_description: this.state.items[payload].incoterm_description,
            purchasing_org_id: { value: this.state.items[payload].purchasing_org_id, label: this.state.items[payload].purchasing_org_id + " - " + this.state.items[payload].purchasing_org_name },
            purchasing_group_id: { value: this.state.items[payload].purchasing_group_id, label: this.state.items[payload].purchasing_group_id + " - " + this.state.items[payload].purchasing_group_name },
            account_category_id: this.state.items[payload].account_category_id === "" ? null : { value: this.state.items[payload].account_category_id, label: this.state.items[payload].account_category_id + " - " + this.state.items[payload].account_category_name },
            gl_account_id: this.state.items[payload].gl_account_id === "" ? null : { value: this.state.items[payload].gl_account_id, label: this.state.items[payload].gl_account_id + " - " + this.state.items[payload].gl_account_name },
            asset_no: this.state.items[payload].asset_no===null ? null: { value: this.state.items[payload].asset_no, label: this.state.items[payload].asset_no +" - "+this.state.items[payload].asset_no_description},
            wbs_element:{ value: this.state.items[payload].wbs_element, label: this.state.items[payload].wbs_element+ " - " + this.state.items[payload].wbs_project_description},
            cost_center_id:{ value: this.state.items[payload].cost_center_id, label: this.state.items[payload].cost_center_id+ " - " + this.state.items[payload].cost_center_name},
            order_no:this.state.items[payload].order_no,
            classification : (this.state.items[payload].classification === "" || this.state.items[payload].classification === null) ? null : { value: this.state.items[payload].classification, label: (this.state.items[payload].classification === "jasa") ? "Jasa" : "Barang" },
            year_type: this.state.items[payload].year_type === "" ? null : { value: this.state.items[payload].year_type, label: (this.state.items[payload].year_type === "single_year") ? "Single year" : "Multiple Year" },
            account_assegment: this.state.items[payload].object_account,
            tag_number: this.state.items[payload].tag_number,
            equipment:this.state.items[payload].equipment,
            equipment_type:this.state.items[payload].equipment_type,
            no_wo:this.state.items[payload].no_wo,
            pekerjaan_tambah: this.state.items[payload].pekerjaan_tambah===null ? null : { value: this.state.items[payload].pekerjaan_tambah, label: this.state.items[payload].pekerjaan_tambah},
            manufacturer:this.state.items[payload].manufacturer,
            spesifikasi:this.state.items[payload].spesifikasi,
            serial_number:this.state.items[payload].serial_number,
            drawing_number:this.state.items[payload].drawing_number,
            item_type:{ value: this.state.items[payload].item_type, label: this.state.items[payload].item_type},
            toleransi_harga:this.state.items[payload].toleransi_harga !=="" ? parseFloat(this.state.items[payload].toleransi_harga):this.state.items[payload].toleransi_harga,
            status :this.state.sendData.status
        }
        this.setState({ keyItems: payload, modalOpen: true, disableModal: (((this.state.sendData.status === "d" || this.state.sendData.status === "" || this.state.sendData.status === "r") && this.state.sendData.created_uuid===this.props.user.uuid) || this.state.sendData.created_uuid===undefined) ? false : true, modalData: data })
    }

    saveItems = (payload) => {
        let arr = this.state.items.map((data) => {
            return data;
        });
        
        if (this.state.keyItems === "") {
            arr.push(payload);
        } else {
            arr[this.state.keyItems] = payload
        }

        if(payload.item_id==="manual"){            
            payload.manual_item_no_id=""
            payload.item_no_id=""
        }
        payload.item_no_id=payload.item_id

        this.setState({ items: arr })
        this.toggleFormClose()
        // var calcItem = 0;
        // arr.forEach((element, i) => {
        //     if (payload.plant_id === element.plant_id && payload.item_id === element.item_id) {
        //         calcItem += 1;
        //     }
        // });

        // if(payload.item_id==="manual")
        // {
        //     this.setState({ items: arr })
        //     this.toggleFormClose()
        // }else if (calcItem === 1 && payload.item_id!=="manual") {
        //     this.setState({ items: arr })
        //     this.toggleFormClose()
        // } else {
        //     toastr.error('Item dan Plant Sudah Dipilih')
        // }

    }

    saveAttacment = (payload) => {
        let arr = this.state.attachment;
        arr.push(payload);
        this.setState({ attachment: arr })
    }

    deleteLampiran = (payload) => {
        let data = this.state.attachment;
        let arr = []
        data.forEach((element, i) => {
            if (i !== payload) {
                arr.push(element)
            }
        });
        this.setState({ attachment: arr })
    }

    deleteItems = (payload) => {
        let data = this.state.items;
        let arr = []
        data.forEach((element, i) => {
            if (i !== payload) {
                arr.push(element)
            }
        });
        this.setState({ items: arr })
    }

    fetchCurrencies = (newValue) => {
        if (newValue === undefined || newValue !== "") {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, currency: true },
            }));
            let select_params =
                newValue !== ""
                    ? { start: 0, length: 10, select: newValue }
                    : { start: 0, length: 10 };
            this.props
                .fetchCurrencies(select_params)
                .then((resp) => {
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.id, label: data.id + ' - ' + data.long_text };
                    });
                    this.setState(({ loadings, currency }) => ({
                        loadings: { ...loadings, currency: false },
                        currency: options,
                    }));

                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, currency: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    fetchGeneralPlanner = (newValue) => {
        if (newValue === undefined || newValue !== "") {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, general_planner: true },
            }));
            let select_params =
                newValue !== ""
                    ? { start: 0, length: 10, select: newValue, company_id : this.props.user.company_id }
                    : { start: 0, length: 10, company_id :this.props.user.company_id };
            this.props
                .fetchGeneralPlanner(select_params)
                .then((resp) => {
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.id, label: data.id + ' - ' + data.name };
                    });
                    this.setState(({ loadings, general_planner }) => ({
                        loadings: { ...loadings, general_planner: false },
                        general_planner: options,
                    }));

                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, general_planner: false },
                    }));
                    toastr.error(resp.data.status, resp.data.message);
                });
        }
    }

    fetchSpecificPlanner = (newValue) => {
        if (newValue === undefined || newValue !== "") {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, general_planner: true },
            }));
        }

        let select_params =
            newValue !== "" ? { start: 0, length: 10, select: newValue, general_planner_id: this.state.sendData.assign_to.value }
                : { start: 0, length: 10, general_planner_id: this.state.sendData.assign_to.value};

        this.props
            .fetchSpecificPlanner(select_params)
            .then((resp) => {
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name };
                });
                this.setState(({ loadings, general_planner }) => ({
                    loadings: { ...loadings, specific_planner: false },
                    specific_planner: options,
                }));

            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, specific_planner: false },
                }));
                toastr.error(resp.data.status, resp.data.message);
            });
        // }
    }

    savePayload = (payload) => {
        let data = this.setData(payload);
        if (this._isMounted) {
            if (data.counting === 2) {
                this.setState({ loadingSubmit: true, error_items: [], errors: [] });
                this.props.saveMaterialServices(data)
                    .then((resp) => {
                        this.setState({ loadingSubmit: false })
                        toastr.success(resp.data.message);
                        this.props.history.push('/tendering/msr-list')
                    })
                    .catch(error => {
                        if (error !== undefined) {
                            toastr.error(error.data.message)
                            let tempItems = []

                            // Object.keys(error.data.errors).map((key) => 
                            //  (key.includes("items")) ? 
                            //  tempItems.push(key)  
                            //  : ""
                            // )
                            // eslint-disable-next-line array-callback-return
                            Object.keys(error.data.errors).map(function (key, index) {
                                if (key.includes("items")) {
                                    let split = key.split(".");
                                    tempItems.push({ "baris": split[1], "item": split[2], "desc_error": error.data.errors[key][0] })
                                }
                            })

                            this.setState({ errors: error.data.errors, loadingSubmit: false, error_items: tempItems })
                            if (error.data.errors.items) toastr.error('Items', error.data.errors.items[0])
                        } else {
                            this.setState({ loadingSubmit: false })
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
            }
        }
    }

    updatePayload = (id, payload) => {
        // let data = this.setData(payload);
        // console.log(id)

        // if (this._isMounted) {
        //     this.setState({ loadingSubmit: true });
        //     this.props.updateMaterialServices(id, payload)
        //         .then((resp) => {
        //             this.setState({ loadingSubmit: false })
        //             toastr.success(resp.data.message);
        //             this.props.history.push('/msr-list')
        //         })
        //         .catch(error => {
        //             console.log(error)
        //             if (error !== undefined) {
        //                 toastr.error(error.data.message)
        //                 this.setState({ errors: error.data.errors, loadingSubmit: false })
        //             } else {
        //                 this.setState({ loadingSubmit: false })
        //                 toastr.error('Opps Somethings Wrong')
        //             }
        //         })
        // }
    }

    approveOrReject = (payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            let params = payload.status==="r" ? payload : { status: this.state.changeStatusRejectApprove };
            if(this.props.user.has_roles.includes("PLNRGN")){
                this.props.assgnMaterialServices(this.props.match.params.id, params)
                .then((resp) => {
                    this.setState({ loadingSubmit: false })
                    toastr.success(resp.data.message);
                    this.props.history.push('/tendering/msr-list')
                })
                .catch(error => {
                    // console.log(error)
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        if(error.data.errors!==undefined){
                            this.setState({ errors: error.data.errors, loadingSubmit: false })
                        }else{
                            this.props.history.push('/tendering/msr-list')
                        }                       
                    } else {
                        this.setState({ loadingSubmit: false })
                        toastr.error('Opps Somethings Wrong')
                    }
                })

            }else{
                this.props.updateMaterialServices(this.props.match.params.id, params)
                .then((resp) => {
                    this.setState({ loadingSubmit: false })
                    toastr.success(resp.data.message);
                    this.props.history.push('/tendering/msr-list')
                })
                .catch(error => {
                    // console.log(error)
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        if(error.data.errors!==undefined){
                            this.setState({ errors: error.data.errors, loadingSubmit: false })
                        }else{
                            this.props.history.push('/tendering/msr-list')
                        }
                    } else {
                        this.setState({ loadingSubmit: false })
                        toastr.error('Opps Somethings Wrong')
                    }
                })
            }
                
        }
    }

    assingTo = (payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.assgnMaterialServices(this.props.match.params.id, payload)
                .then((resp) => {
                    this.setState({ loadingSubmit: false })
                    toastr.success(resp.data.message);
                    this.props.history.push('/tendering/msr-list')
                })
                .catch(error => {
                    // console.log(error)
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ errors: error.data.errors, loadingSubmit: false })
                    } else {
                        this.setState({ loadingSubmit: false })
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    setData = (data, e) => {
        let datas = data;
        var con = 0;
        // datas.work_unit_id=this.props.user.da
        datas.attachment = this.state.attachment.map((data) => {
            if (data.type === "tor" || data.type === "oe") {
                con += 1;
            }
            return {
                description: data.description,
                type: data.type,
                file: data.file,
            };
        });
        datas.items = this.state.items
        datas.counting = con
        if (datas.counting !== 2) toastr.warning("Field Diperlukan", "Lampiran attacmen TOR dan OE diperlukan");
        return datas
    }

    confirmReject = (e) => {
        if (this._isMounted) {
            if (e.status === "m") {
                this.setState({ isConfirmApproved: true, changeStatusRejectApprove: e.status })
            } else {
                this.setState({ isConfirmReject: true, changeStatusRejectApprove: e.status })
            }
            // console.log(e)
        }
    }

    toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'approve':
                    this.setState({ isConfirmApproved: false });
                    // this.handleDelete(this.state.uuid)
                    this.approveOrReject({status:"m"})
                    break;
                case 'reject':
                    this.setState({ isConfirmReject: false });
                    this.approveOrReject({status:"r"})
                    break;
                case 'cancel':
                    this.setState({ isConfirmApproved: false, isConfirmReject: false });
                    break;
                default:
                    break;
            }
        }
    }





    // this.props.history.push('/msr-list-form/create')
    render() {
        const { t } = this.props;
        return (
            <div>
                {/* {this.state.loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>} */}
                {/* { !this.state.loading && */}
                <MsrFormHeader
                    modalOpen={this.toggleFormOpen}
                    modalShow={(payload) => this.toggleShowModal(payload)}
                    items={this.state.items}
                    user={this.props.user}
                    uuid={this.state.uuid}
                    attachment={this.state.attachment}
                    optionsCurrency={this.state.currency}
                    optionsGeneralPlanner={this.state.general_planner}
                    optionsPrioritas={this.state.optionsPrioritas}
                    optionsTipeLampiran={this.state.optionsTipeLampiran}
                    optionSpecificPlanner={this.state.specific_planner}
                    upload={this.props.fileUpload}
                    saveAttacment={(payload) => this.saveAttacment(payload)}
                    savePayload={(payload) => this.savePayload(payload)}
                    updatePayload={(id, payload) => this.updatePayload(id, payload)}
                    loadingSubmit={this.state.loadingSubmit}
                    getCurrency={(payload) => this.fetchCurrencies(payload)}
                    deleteLampiran={(payload) => this.deleteLampiran(payload)}
                    deleteItems={(payload) => this.deleteItems(payload)}
                    isLoading={this.state.loadings}
                    pageload={this.state.loading}
                    data={this.state.sendData}
                    errors={this.state.errors}
                    error_items={this.state.error_items}
                    approveReject={(payload) => this.approveOrReject(payload)}
                    assingTo={(payload) => this.assingTo(payload)}
                    ConfirmSweetAlert={(payload) => this.confirmReject(payload)}
                />
                {/* } */}

                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        toggleClose={this.toggleFormClose}
                        saveitems={(payload) => this.saveItems(payload)}
                        data={this.state.modalData}
                        disableModal={this.state.disableModal}
                    />
                }

                {/* {(this.state.isConfirmReject &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.reject-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.reject-title")}
                        onConfirm={() => this.toggleSweetAlert('reject')}
                        onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                    </SweetAlert>
                )} */}

                {(this.state.isConfirmReject &&
                    <ModalReject
                    btnDisabled={this.state.loadingSubmit}
                    reject={(payload) => this.approveOrReject(payload)}
                    toggleClose={()=>this.toggleSweetAlert('cancel')}
                    isConfirmReject={this.state.isConfirmReject}
                    />
                )}

                {(this.state.isConfirmApproved &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.approve-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.approve-title")}
                        onConfirm={() => this.toggleSweetAlert('approve')}
                        onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                    </SweetAlert>
                )}
                

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
        saveMaterialServices: (payload) => dispatch(saveMaterialServices(payload)),
        fetchCurrencies: (payload) => dispatch(fetchCurrencies(payload)),
        fetchGeneralPlanner: (payload) => dispatch(fetchGeneralPlanner(payload)),
        fetchSpecificPlanner: (payload) => dispatch(fetchSpecificPlanner(payload)),
        showMaterialServices: (payload) => dispatch(showMaterialServices(payload)),
        updateMaterialServices: (id, payload) => dispatch(updateMaterialServices(id, payload)),
        assgnMaterialServices: (id, payload) => dispatch(assgnMaterialServices(id, payload)),
    }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(MaterialRequestListForm));