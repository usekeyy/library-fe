import React, { Component } from 'react'
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import MsrFormHeader from "./msr-list-form/MsrForm";
import ModalForm from './msr-list-form/ModalForm'
import ModalFormService from './msr-list-form/ModalFormService'
import ModalReject from './msr-list-form/reject/ModalReject'
import { fileUpload } from '../../../../../store/actions/uploadActions';
import { withTranslation } from 'react-i18next';
import { saveMaterialServices, showMaterialServices, updateMaterialServices, assgnMaterialServices,submitPRManual, approvalPRManual } from '../../../../../store/actions/tendering/materialServiceActions'
import { fetchCurrencies } from '../../../../../store/actions/master/currenciesActions'
import { fetchSpecificPlanner } from '../../../../../store/actions/master/specificPlannerActions'
import { fetchGeneralPlanner } from '../../../../../store/actions/master/generalPlannerActions'

import { toastr } from 'react-redux-toastr';
// import { statusName } from '../../../../../helpers/statusName';
// import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import {
	showPurchasingRequisition
} from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import { saveItem, saveServiceItem, getServiceItem, deleteItemsService, deleteItemsPr , updateItemsServiceLine, updateItemsPr}  from '../../../../../store/actions/tendering/prProcsi';

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
                loading_submit_modal : false,
            },
            loading: false,
            errors: [],
            error_items: [],
            loadingSubmit: false,
            loadingSubmitPRManual: false,
            modalOpen: false,
            modalOpenService: false,
            disableModal: false,
            modalData: [],
            isConfirmReject: false,
            isConfirmApproved: false,
            changeStatusRejectApprove: '',
            isDeleteItem:false,
            uuid_item_delete:'',
            is_type_item_delete:'',
            keyItems: '',
            item_line_id: '',
            isApproval: false,
            is_edit_service_line : '',
            note : '',
            uuid: (this.props.location.pathname.split("/")[4] !== undefined) ? this.props.location.pathname.split("/")[4] : '',
            purchasing_requisition: {
                header: {
                    created_at: '',
                    created_by: '',
                    created_by_name: '',
                    doc_category_bstyp: '',
                    doc_category_vrtyp: '',
                    document_type: '',
                    id: '',
                    number: '',
                    status: '',
                    updated_at: '',
                    updated_by: '',
                    uuid: '',
                    work_unit_id: '',
                    work_unit_name: '',
                },
                items: [],
                service_line: [],
                attachments: [],
                purchasing_orgs: [],
                company_types: [],
                vendor_types: [],
                errors: [],
                loading: true,
                loadingButton: false,
                items_selected :[]
            },
            master: {
                document_type: [],
                tipe: [
                    { value: 'barang', label: 'BARANG' },
                    { value: 'jasa', label: 'JASA' },
                ],
                currency: [],
                plant: [],
                mrp_controller: [],
                storage_location: [],
                material_number: [],
                material_group: [],
                item_category: [],
                account_assignment: [],
                uom: [],
                asset: [],
                gl_account: [],
                cost_center: [],
                profit_center: [],
                wbs: [],
            },
            account: [],
            service_line: [],
            addItem: false,
            showItem: true,
            showServiceLine: false,
            modalType: '',
            modalRejectOpen : false,
            modalRejectData : {
                data : [],
                uuid : ""
            },
            checkAll : false,
            isConfirm:false,
            uuidAttactment:''
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
					this.showPurchasingRequisition(this.state.uuid)
            // if (this.props.user.has_roles.includes("REQ001")) {
            //     this.fetchCurrencies()
            //     this.fetchGeneralPlanner()
            // }
            // if (this.props.match.params.id !== undefined) {
            //     this.getUUID()
            // }
            
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

    toggleFormOpenService = (value) => {
        this.setState({ modalOpenService: true, disableModal: false, item_line_id:value, modalData: [] , is_edit_service_line : false })
    }

    toggleUpdateFormOpenService = (value) => {
        value.uom_id = { value: value.uom, label: value.uom }
        this.setState({ modalOpenService: true, disableModal: false,  modalData: value , is_edit_service_line : true })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, isError: false, errors: {}, loadingSubmit: false, disableModal: false, modalData: [] })
    }

    toggleFormCloseService = () => {
        this.setState({ modalOpenService: false, isError: false, errors: {}, loadingSubmit: false, disableModal: false, modalData: [], is_edit_service_line: false })
    }

    toggleShowModal = (payload) => {
        let data = {
            uuid:this.state.items[payload].uuid,
            item_category_id: { value: this.state.items[payload].item_category, label: this.state.items[payload].symbol + " - " + this.state.items[payload].item_category_name },
            item_id: (this.state.items[payload].material_group_id==="" || this.state.items[payload].material_group_id==="manual") ? {value:"manual", label: "Manual"}  : { value: this.state.items[payload].material_group_id, label: this.state.items[payload].material_group_id + " - " + this.state.items[payload].material_group_name },
            item_description: this.state.items[payload].material_group_name,
            requisitioner: {value : this.state.items[payload].requisitioner, label : this.state.items[payload].requisitioner },
            qty: parseFloat(this.state.items[payload].qty),
            uom_id: { value: this.state.items[payload].uom, label: this.state.items[payload].uom + " - " + this.state.items[payload].uom_name },
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
            valuation_price:this.state.items[payload].valuation_price,
            short_text:this.state.items[payload].short_text,
            long_text:this.state.items[payload].long_text,
            total_value:this.state.items[payload].total_value,
            currency: { value: this.state.items[payload].currency_id, label: this.state.items[payload].currency_name },
            material_group: { value: this.state.items[payload].material_group_id, label: this.state.items[payload].material_group_name },
            status :this.state.sendData.status,
            acc_assignment_category_id: { value: this.state.items[payload].acc_assignment_category_id, label: this.state.items[payload].acc_assignment_category_id + " - " + this.state.items[payload].acc_assignment_category_name },
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
				console.log(arr);
        this.setState({ items: arr })
        this.toggleFormClose()
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

		showPurchasingRequisition = async (id) => {
			this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: true } }));
			this.props.showPurchasingRequisition(id)
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({ purchasing_requisition }) => ({
						purchasing_requisition: { ...purchasing_requisition, loading: false, header: data.header, items: data.items, attachments: data.attachments, isApproval: data.approver === 'y' ? true : false },
						addItem: true,
						items: data.items
					}));
				})
				.catch((resp) => {
					this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
					const errors = resp.data.errors;
					if(errors){
						var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
						const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
						if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
					} else {
						toastr.error(resp.data.message);
					}
				});
		}

		getServiceItem = async (id) => {
			this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: true } ,  item_line_id : id}));
			this.props.getServiceItem(id)
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({ purchasing_requisition }) => ({
						purchasing_requisition: { ...purchasing_requisition, loading: false },
						service_line: data
					}));
				})
				.catch((resp) => {
					this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false }, service_line: [] }));
					const errors = resp.data.errors;
					if(errors){
						var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
						const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
						if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
					} else {
						toastr.error(resp.data.message);
					}
				});
		}

		saveItem = (id, payload) => {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: true },
            }));
			this.props.saveItem(id, payload)
			.then((resp) => {
				toastr.success(resp.data.message);
				this.toggleFormClose();
				this.showPurchasingRequisition(this.state.uuid)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_modal: false },
                }));
			})
			.catch((resp) => {
				const errors = resp.data.errors;
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_modal: false },
                }));
				if(errors){
					this.setState({ errors: errors })
					var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
					const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
					if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
				} else {
					toastr.error(resp.data.message);
				}
			});
		}

		saveServiceItem = (payload) => {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: true },
            }));
			this.props.saveServiceItem(this.state.item_line_id, payload)
			.then((resp) => {
				toastr.success(resp.data.message);
				this.toggleFormCloseService();
				this.showPurchasingRequisition(this.state.uuid)
				this.getServiceItem(this.state.item_line_id)
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_modal: false },
                }));
			})
			.catch((resp) => {
				const errors = resp.data.errors;
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_submit_modal: false },
                }));
				if(errors){
					this.setState({ errors: errors })
					var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
					const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
					if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
				} else {
					toastr.error(resp.data.message);
				}
			});
		}

    savePayload = (payload) => {
        // let data = this.setData(payload);
				// console.log(payload);
				this.saveItem(this.state.uuid, payload);
        // if (this._isMounted) {
        //     if (data.counting === 2) {
        //         this.setState({ loadingSubmit: true, error_items: [], errors: [] });
        //         this.props.saveMaterialServices(data)
        //             .then((resp) => {
        //                 this.setState({ loadingSubmit: false })
        //                 toastr.success(resp.data.message);
        //                 this.props.history.push('/tendering/msr-list')
        //             })
        //             .catch(error => {
        //                 if (error !== undefined) {
        //                     toastr.error(error.data.message)
        //                     let tempItems = []

        //                     // Object.keys(error.data.errors).map((key) => 
        //                     //  (key.includes("items")) ? 
        //                     //  tempItems.push(key)  
        //                     //  : ""
        //                     // )
        //                     // eslint-disable-next-line array-callback-return
        //                     Object.keys(error.data.errors).map(function (key, index) {
        //                         if (key.includes("items")) {
        //                             let split = key.split(".");
        //                             tempItems.push({ "baris": split[1], "item": split[2], "desc_error": error.data.errors[key][0] })
        //                         }
        //                     })

        //                     this.setState({ errors: error.data.errors, loadingSubmit: false, error_items: tempItems })
        //                     if (error.data.errors.items) toastr.error('Items', error.data.errors.items[0])
        //                 } else {
        //                     this.setState({ loadingSubmit: false })
        //                     toastr.error('Opps Somethings Wrong')
        //                 }
        //             })
        //     }
        // }
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
        // var con = 0;
        // datas.work_unit_id=this.props.user.da
        datas.attachment = this.state.attachment.map((data) => {
            // if (data.type === "tor" || data.type === "oe") {
            //     con += 1;
            // }
            return {
                description: data.description,
                type: data.type,
                file: data.file,
            };
        });
        datas.items = this.state.items
        // datas.counting = con
        // if (datas.counting !== 2) toastr.warning("Field Diperlukan", "Lampiran attacmen TOR dan OE diperlukan");
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
                case 'delete':
                    this.setState({ isDeleteItem: false });
                    console.log(this.state.is_type_item_delete)
                    if(this.state.is_type_item_delete==="item"){
                        this.deleteItemsPr(this.state.uuid_item_delete)
                    }else{
                        this.deleteItemService(this.state.uuid_item_delete)
                    }
                    break;
                case 'cancel':
                    this.setState({ isConfirmApproved: false, isConfirmReject: false, isDeleteItem: false });
                    break;
                default:
                    break;
            }
        }
    }

    deleteItems = (e,payload,type) => {
        this.setState({
            isDeleteItem : true,
            uuid_item_delete : payload,
            is_type_item_delete : type
        })
        e.preventDefault()
    }

    deleteItemService = (payload) => {
        this.props.deleteItemsService(payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.getServiceItem(this.state.item_line_id)
        })
        .catch((resp) => {
            const errors = resp.data.errors;
            if(errors){
                this.setState({ errors: errors })
                var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
                const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
                if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
            } else {
                toastr.error(resp.data.message);
            }
        });
    }

    deleteItemsPr = (payload) => {
        this.props.deleteItemsPr(payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.showPurchasingRequisition(this.state.uuid)
        })
        .catch((resp) => {
            const errors = resp.data.errors;
            if(errors){
                this.setState({ errors: errors })
                var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
                const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
                if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
            } else {
                toastr.error(resp.data.message);
            }
        });
    }

    submitPRManualProcsi = (payload={}) => {
        console.log(payload);
        console.log(this.state.uuid)
        this.setState({loadingSubmitPRManual : true});
        this.props.submitPRManual(this.state.uuid, payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.setState({loadingSubmitPRManual : false});
            this.showPurchasingRequisition(this.state.uuid);
        })
        .catch((resp) => {
            this.setState({loadingSubmitPRManual : false})
            toastr.error(resp.data.message);
        });
    }

    approvalPRManualProcsi = (payload={}) => {
        console.log(payload);
        console.log(this.state.uuid)
        this.setState({loadingSubmitPRManual : true});
        this.props.approvalPRManual(this.state.uuid, payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.setState({loadingSubmitPRManual : false});
            this.showPurchasingRequisition(this.state.uuid);
        })
        .catch((resp) => {
            this.setState({loadingSubmitPRManual : false})
            toastr.error(resp.data.message);
        });
    }

    updateServiceItem = (uuid,payload) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_submit_modal: true },
        }));
        this.props.updateItemsServiceLine(uuid, payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.toggleFormCloseService();
            this.showPurchasingRequisition(this.state.uuid)
            this.getServiceItem(this.state.item_line_id)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: false },
            }));
        })
        .catch((resp) => {
            const errors = resp.data.errors;
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: false },
            }));
            if(errors){
                this.setState({ errors: errors })
                var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
                const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
                if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
            } else {
                toastr.error(resp.data.message);
            }
        });
    }

    updateItemsPr = (id, payload) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_submit_modal: true },
        }));
        this.props.updateItemsPr(id, payload)
        .then((resp) => {
            toastr.success(resp.data.message);
            this.toggleFormClose();
            this.showPurchasingRequisition(this.state.uuid)
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: false },
            }));
        })
        .catch((resp) => {
            const errors = resp.data.errors;
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_submit_modal: false },
            }));
            if(errors){
                this.setState({ errors: errors })
                var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
                const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
                if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
            } else {
                toastr.error(resp.data.message);
            }
        });
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
                    modalOpenService={(id) => { this.toggleFormOpenService(id) }}
                    toggleUpdateFormOpenService = {(id)=> this.toggleUpdateFormOpenService(id)}
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
                    deleteItems={(e,payload,type) => this.deleteItems(e,payload,type)}
                    isLoading={this.state.loadings}
                    pageload={this.state.loading}
                    data={this.state.sendData}
                    errors={this.state.errors}
                    error_items={this.state.error_items}
                    approveReject={(payload) => this.approveOrReject(payload)}
                    assingTo={(payload) => this.assingTo(payload)}
                    ConfirmSweetAlert={(payload) => this.confirmReject(payload)}
                    getServiceItem={(id) => this.getServiceItem(id)}
                    parentState={this.state}
                    submitPRManualProcsi = {this.submitPRManualProcsi}
                    approvalPRManualProcsi = {this.approvalPRManualProcsi}
                    loadingSubmitPRManual = {this.state.loadingSubmitPRManual}
                    // deleteItems = {(payload) => this.deleteItems(payload)}
                />
                {/* } */}

                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        updateItemsPr={(id, payload) => this.updateItemsPr(id, payload)}
                        toggleClose={this.toggleFormClose}
                        saveitems={(payload) => this.saveItems(payload)}
                        data={this.state.modalData}
                        parentState={this.state}
                        errors={this.state.errors}
                        disableModal={this.state.disableModal}
                        savePayload={(payload) => this.savePayload(payload)}
                        loadings={this.state.loadings}
                    />
                }
                {this.state.modalOpenService &&
                    <ModalFormService
                        is_edit_service_line = {this.state.is_edit_service_line}
                        toggleAdd={this.state.modalOpenService}
                        toggleClose={this.toggleFormCloseService}
                        saveitems={(payload) => this.saveItems(payload)}
                        data={this.state.modalData}
                        parentState={this.state}
                        errors={this.state.errors}
                        disableModal={this.state.disableModal}
                        savePayload={(payload) => this.saveServiceItem(payload)}
                        updateServiceItem={(uuid, payload) => this.updateServiceItem(uuid, payload)}
                        loadings= {this.state.loadings}
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
                
                {(this.state.isDeleteItem &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.approve-button")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.approve-title")}
                        onConfirm={() => this.toggleSweetAlert('delete')}
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
        saveItem: (id, payload) => dispatch(saveItem(id, payload)),
        saveServiceItem: (id, payload) => dispatch(saveServiceItem(id, payload)),
        updateItemsServiceLine: (id, payload) => dispatch(updateItemsServiceLine(id, payload)),
        updateItemsPr : (id, payload) => dispatch(updateItemsPr(id, payload)),
        getServiceItem: (id, payload) => dispatch(getServiceItem(id, payload)),
        showPurchasingRequisition: (id) => dispatch(showPurchasingRequisition(id)),
        deleteItemsService : (id) => dispatch(deleteItemsService(id)),
        deleteItemsPr : (id) => dispatch(deleteItemsPr(id)),
        submitPRManual: (uuid, payload) => dispatch(submitPRManual(uuid, payload)),
        approvalPRManual: (uuid, payload) => dispatch(approvalPRManual(uuid, payload)),

    }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(MaterialRequestListForm));