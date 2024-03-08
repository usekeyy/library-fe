import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { savePurchaseOrder,
        fetchPurchaseOrderItemDetail, 
        updatePurchaseOrderItemDetail, 
        updateAccountAssignment,
        savePurchaseOrderAdditionalCost, 
        deletePurchaseOrderAdditionalCost, 
        approvalVendorPurchaseOrder, 
        approvalPurchaseOrder,
        releasePurchaseOrder,
        fetchDocumentPurchaseOrder,
        saveDocumentPurchaseOrder,
        deleteDocumentPurchaseOrder,
        syncPurchaseOrder,
        updatePurchaseOrderOATemp,
        deletePurchaseOrderOATemp,
        fetchVendorAwarding,
        purchaseOrderCancel,
        purchaseOrderApprovalCancel } from '../../../store/actions/tendering/PurchaseOrderActions';
import { showExpediting } from '../../../store/actions/expediting/ExpeditingActions';
import { fetchTemplateReminder, saveTemplateReminder} from '../../../store/actions/expediting/templateReminderActions';
import { fetchProgress, saveProgress, updateProgress, showProgress, deleteProgress, showProgressLog } from '../../../store/actions/expediting/progressActions';
import { fetchReminder, saveReminder, updateReminder, deleteReminder, showReminder, showLogEmailReminder } from '../../../store/actions/expediting/reminderActions';
import { fetchKonfirmasi, saveKonfirmasi, updateKonfirmasi, showKonfirmasi } from '../../../store/actions/expediting/konfirmasiActions';
import { showUserVendorDetail } from '../../../store/actions/tendering/praQualificationActions';
import { fetchIncoterms } from '../../../store/actions/master/incotermsActions';
import { fetchTax } from '../../../store/actions/master/masterTaxActions';
import { fetchConditionType } from '../../../store/actions/master/conditionTypeActions'
import { fetchUom } from '../../../store/actions/master/uomActions';
import { fetchVendor } from '../../../store/actions/vendor/vendorActions';

import { fetchAccAssignmentCategory } from '../../../store/actions/master/accAssignmentCategoryActions';
import { fetchAssets } from '../../../store/actions/master/assetsActions';
import { fetchCostCenter } from '../../../store/actions/master/costCenterActions';
import { fetchWbsProject } from '../../../store/actions/master/wbsProjectActions';
import { fetchGlAccount } from '../../../store/actions/master/glAccountActions';

import { downloadBeritaAcaraPO } from '../../../store/actions/tendering/monitoringTenderBuyerActions';

import { fileUpload } from '../../../store/actions/uploadActions';
import Form from './detail/Form'
import ItemDetail from './detail/ItemDetail'
import Konfirmasi from './detail/Konfirmasi'
import KonfirmasiOA from './detail/KonfirmasiOA'
import ErrorSAP from './detail/ErrorSAP'
import ModalDokumenPO from './detail/dokumen-po/ModalDokumenPO'
import FormTemplate from './detail/FormTemplate'
import FormBatalPO from './detail/FormBatalPO'
// import ModalAccountAssignment from './detail/account-assiggnment/ModalAccountAssignment'
import ModalForm from './detail/account-assiggnment/ModalForm'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import FormProgress from './detail/FormProgress';
import FormReply from './detail/FormReply';
import HistoryUpdate from './detail/HistoryUpdate';
import HistoryLogEmail from './detail/HistoryLogEmail';

export class DetailOpenPO extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
            data_progress: [],
            temp_lampiran_progress: {
                name: '',
                file: '',
            },
            data_log_email_reminder : [],
            data_reminder: [],
            data_konfirmasi: [],
            m_items: [],
            param_submit_batal_po: [],
            data_document: [],
            data_user_vendor: [],
            data_header: [],
            m_incoterm: [],
            m_tax: [],
            m_type: [],
            m_uom: [],
            m_vendor: [],
            m_acc_assgn_category: [],
            m_gl_account: [],
            m_asset: [],
            m_cost_center: [],
            m_wbs_element: [],
            m_vendor_awarding: [],
            m_tipe_batal_po: [],
            m_template_reminder: [],
            document: [],
            tipe_dokumen: '0',
            param_konfirmasi: {
                po_id: '',
                comment: '',
                attachment: '',
                reply_to: '',
            },
            param_template_reminder: {
                id: '',
                title: '',
                content: '',
                purchasing_org_id: '',
                status: '',
            },
            param_reminder: {
                po_id: '',
                po_item_id: '',
                due_date_days: '',
                task_name: '',
                reminder_template_id: '',
                // status: '',
            },
            param_progress: {
                uuid: '',
                id: '',
                number: '',
                planning: '',
                realitation: '',
                progress_date: '',
                description: '',
                attachment: [],
                attachment_delete: [],
            },
            param_input: {
                po_id:'',
                header_text:'',
                due_date:'',
                incoterm_param:[],
                incoterm_id:'',
                incoterm_name:'',
                incoterm_detail:'',
                notes:'',
                save_draft:'',
            },
            status_additional_cost: {
                type: false,
                amount: false,
                uom_id: false,
                vendor_id: false,
            },
            status_acc_asgnment: {
                acc_assgn_category: false,
                gl_account: false,
                asset: false,
                cost_ecnter: false,
                wbs_element: false,
                order: false,
            },
            status_detail_item: {
                delivery_date: false,
                tax: false,
            },
            data_item: [],
            data_purchase_order: [],
            data_catatan: [],
            param_modal: [],
            loading: true,
            loading_document: true,
            loading_progress:true,
            loading_reminder:true,
            loading_konfirmasi: true,
            loading_konfirmasi_detail: true,
            loading_progress_lampiran: false,
            loadingSubmit: false,
            loadings: {
                loadingModal: false,
                incoterm: true,
                tax: true,
                type: true,
                uom_id: true,
                vendor_id: true,
                acc_assgn_category: true,
                gl_account_id: true,
                asset_id: true,
                cost_center_id: true,
                wbe_element_id: true,
                reminder_template_id: true,
            },
            select_params: {
                start: 0,
                length: 10,
            },
            value_temp: {
                spesifikasi: '',
                delivery_date: '',
                tax: '',
                note: '',
            },
            errors: [],
            isError: false, 
            status_header_text: false,
            status_due_date: false,
            status_catatan: false,
            status_data_incoterm_detail: false,
            status_account_assignmment: false,
            status_data_item: false,
            isConfirm: false,
            loading_dokumen_po: false,
            additional_cost_uuid: '',
            status_dokumen_po: false,
            status_dokumen_confirm: false,
            modalOpen:false,
            modalDokumenPO: false,
            modalAccountAssignment: false,
            tipe_modal: '',
            modalType:'',
            uuid:'',
            code_confirm:'',
            title:'',
            catatan: '',
            status_param: '',
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.state.role_vendor) {
                this.getUserVendor()
            }
            else {
                this.getUUID()
                this.fetchIncoterms()
                this.fetchTemplateReminder()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleClose = () => {
        this.setState(({ value_temp, status_detail_item }) => ({
            value_temp: { ...value_temp, spesifikasi: '', delivery_date: '', tax: '', note: '' },
            status_detail_item: { ...status_detail_item, delivery_date: false, tax: false},
            modalOpen:false, modalType:'', modalDokumenPO: false,
            status_account_assignmment: false,
            isError: false, errors: [], tipe_modal: '', loadingSubmit: false,
        }));
	}

    toggleDelete = (e, value, code) => {
        if (code !== 'approve-cancel' && code !== 'reject-cancel') {
            e.preventDefault();
        }

        let title = ''
        switch (code) {
            case 'additional-cost':
                title = 'Delete Additional Cost, ' + this.props.t("common:delete.title-delete")
                break;
            case 'account-assignment':
                title = 'Delete Account Assignment, ' + this.props.t("common:delete.title-delete")
                break;
            case 'dokumen-po':
                title = 'Delete Dokumen PO, ' + this.props.t("common:delete.title-delete")
                break;
            case 'dokumen-po-confirm':
                title = 'Delete Dokumen PO Confirm, ' + this.props.t("common:delete.title-delete")
                break;
            case 'approve-cancel':
                title = 'Approve Batal PO, ' + this.props.t("common:delete.title-delete")
                break;
            case 'reject-cancel':
                title = 'Reject Batal PO, ' + this.props.t("common:delete.title-delete")
                break;
            case 'progress':
                title = 'Delete Progress, ' + this.props.t("common:delete.title-delete")
                break;
            case 'jadwal-reminder':
                title = 'Delete Jadwal Reminder, ' + this.props.t("common:delete.title-delete")
                break;
            case 'lampiran-progress':
                title = 'Delete Lampiran Progress, ' + this.props.t("common:delete.title-delete")
                break;
            case 'cancel':
                title = this.props.t("common:delete.title-delete")
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code, title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'additional-cost':
                this.deleteAdditionalCost(this.state.uuid)
                break;
            case 'account-assignment':
                this.deleteAccountAssgnment('')
                break;
            case 'dokumen-po':
                this.deleteDokumenPO(this.state.uuid, 'document_po')
                break;
            case 'dokumen-po-confirm':
                break;
            case 'approve-cancel':
                this.purchaseOrderApprovalCancel()
                break;
            case 'reject-cancel':
                this.purchaseOrderApprovalCancel()
                break;
            case 'progress':
                this.deleteProgress(this.state.uuid)
                break;
            case 'jadwal-reminder':
                this.deleteReminder(this.state.uuid)
                break;
            case 'lampiran-progress':
                this.deleteLampiranProgress(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
        return true
    }

    getUserVendor() {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .showUserVendorDetail(this.props.user.uuid)
                .then((resp) => {
                    let datas = resp.data.data;
                    // console.log(datas)
                    this.setState({data_user_vendor: datas}, () => {
                        this.getUUID()
                    });
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
    }

    getUUID = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showExpediting(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    // datas.status = 'd'
                    let param_input = this.state.param_input
                    console.log(datas)
                    let options = datas.items.map((d) => {
                        // return { value: [d.po_item_id], label: d.purchasing_requisition_number + ' - ' + d.item_no + ' - ' + d.description};
                        return { value: [d.po_item_id], label: datas?.purchase_order?.sap_number + ' - ' + d.item_no + ' - ' + d.description};
                    });
                    options.push({ value: ['all'], label: 'SELECT ALL'})

                    param_input.po_id = datas.id
                    // if (param_input.notes === '' && datas.notes !== null && datas.notes !== '' && datas.notes !== undefined) {
                    //     param_input.notes = datas.notes
                    // }
                    if (param_input.header_text === '' && datas.purchase_order.header_text !== null && datas.purchase_order.header_text !== '' && datas.header_text !== undefined) {
                        param_input.header_text = datas.header_text
                    }
                    if (param_input.due_date === '' && datas.due_date !== null && datas.due_date !== '' && datas.due_date !== undefined) {
                        param_input.due_date = datas.due_date
                    }
                    if (param_input.incoterm_id === '' && datas.purchase_order.incoterm_id !== null && datas.purchase_order.incoterm_id !== '' && datas.purchase_order.incoterm_id !== undefined) {
                        param_input.incoterm_param = {
                            value: datas.purchase_order.incoterm_id,
                            label: datas.purchase_order.incoterm_id + ' - ' + datas.purchase_order.incoterm_name,
                        }
                        param_input.incoterm_id = datas.purchase_order.incoterm_id
                        param_input.incoterm_name = datas.purchase_order.incoterm_name
                    }
                    if (param_input.incoterm_detail === '' && datas.purchase_order.incoterm_detail !== null && datas.purchase_order.incoterm_detail !== '' && datas.purchase_order.incoterm_detail !== undefined) {
                        param_input.incoterm_detail = datas.purchase_order.incoterm_detail
                    }
                    this.setState({ loading: false, data: datas, document: datas.document, param_input: param_input, m_items: options }, () => {
                        this.fetchDocumentPurchaseOrder(datas.uuid)
                        this.fetchProgress(datas.id)
                        this.fetchReminder(datas.id)
                        this.fetchKonfirmasi(datas.id)
                    })
                })
                .catch((resp) => {
                    if (resp.data.message === "User does not have the right permissions.") {
                        this.props.history.push('/')
                        toastr.error(resp.data.message);
                    }
                    else {
                        this.setState({ loading: false });
                        toastr.error(resp.data.message);;
                    }
                });
        }
    }

    fetchIncoterms = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, incoterm: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchIncoterms(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, incoterm: false },
                    m_incoterm: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, incoterm: false },
                }));
                toastr.error("FAILED LOAD DATA");
            });
    };
    
    fetchProgress = (id) => {
        if (this._isMounted) {
            this.setState({ loading_progress: true });
            this.props.fetchProgress({po_id: id})
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data_progress: datas, loading_progress: false })
                })
                .catch((resp) => {
                    if (resp.data.message !== undefined) {
                        toastr.error(resp.data.message);
                    }
                    else {
                        toastr.error(resp.data.message);;
                    }
                    this.setState({ loading_progress: false });
                });
        }
    }

    fetchReminder = (id) => {
        if (this._isMounted) {
            this.setState({ loading_reminder: true });
            this.props.fetchReminder({po_id: id, column : 'reminder_date', dir : 'desc'})
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data_reminder: datas, loading_reminder: false })
                })
                .catch((resp) => {
                    if (resp.data.message !== undefined) {
                        toastr.error(resp.data.message);
                    }
                    else {
                        toastr.error(resp.data.message);;
                    }
                    this.setState({ loading_reminder: false });
                });
        }
    }

    fetchKonfirmasi = (id) => {
        if (this._isMounted) {
            this.setState({ loading_konfirmasi: true });
            this.props.fetchKonfirmasi({po_id: id})
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ data_konfirmasi: datas, loading_konfirmasi: false })
                })
                .catch((resp) => {
                    this.setState({ loading_konfirmasi: false });
                    if (resp.data.message !== undefined) {
                        toastr.error(resp.data.message);
                    }
                    else {
                        toastr.error(resp.data.message);;
                    }
                });
        }
    }

    fetchDocumentPurchaseOrder = (uuid) => {
        if (this._isMounted) {
            this.setState({ loading_document: true });
            let param = []
            this.props
                .fetchDocumentPurchaseOrder(uuid, param)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState({ loading_document: false, data_document: datas })
                })
                .catch((resp) => {
                    if (resp.data.message !== undefined) {
                        this.setState({ loading_document: false });
                        toastr.error(resp.data.message);
                    }
                    else {
                        this.setState({ loading_document: false });
                        toastr.error(resp.data.message);;
                    }
                });
        }
    }

    fetchPurchaseOrderItemDetail = (id) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingModal: true },
        }));
        this.props.fetchPurchaseOrderItemDetail(id)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let value_temp = this.state.value_temp
                if (data.tax !== null && data.tax !== '' && value_temp.tax === '') {
                    value_temp.tax = {
                        value: data.tax,
                        label: data.tax_description,
                    }
                }
                if (data.delivery_date !== null && data.delivery_date !== '' && value_temp.delivery_date === '') {
                    value_temp.delivery_date = data.delivery_date
                }
                if (data.spesifikasi !== null && data.spesifikasi !== '' && value_temp.spesifikasi === '') {
                    value_temp.spesifikasi = data.spesifikasi
                }
                if (data.note !== null && data.note !== '' && value_temp.note === '') {
                    value_temp.note = data.note
                }

                let status = false
                if (data.account_assignment[0].acc_assignment_category_id === null) {
                    status = true
                }
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false },
                    data_item: data,
                    value_temp: value_temp,
                    status_account_assignmment: status,
                }), () => {
                    if (this.state.data.created_by === this.props.user.uuid && (this.state.data.status === 'd' || this.state.data.status === 'r' || (this.state.data.status === 'c' && this.state.data.sap_number === null))) {
                        this.fetchTax('')
                        this.fetchConditionType('')
                        this.fetchUom('')
                        this.fetchVendor('')
                        if (data.account_assignment[0].acc_assignment_category_id === 'U') {
                            this.fetchGlAccount('')
                            this.fetchAccAssignmentCategory('')
                            this.fetchAssets('')
                            this.fetchCostCenter('')
                            this.fetchWbsProject('')
                        }
                    }
                });
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchTax = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, tax: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchTax(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.description};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, tax: false },
                    m_tax: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, tax: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchConditionType = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, type: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchConditionType(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.description};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, type: false },
                    m_type: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, type: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchUom = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, uom_id: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchUom(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.code + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, uom_id: false },
                    m_uom: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, uom_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchVendor = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, vendor_id: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, sap_number_not_null: 'y', select: newValue} : {start: 0, length: 10, sap_number_not_null: 'y'};
        this.props.fetchVendor(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.sap_code + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, vendor_id: false },
                    m_vendor: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, vendor_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchAccAssignmentCategory = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, acc_assgn_category: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchAccAssignmentCategory(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, acc_assgn_category: false },
                    m_acc_assgn_category: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, acc_assgn_category: false },
                }));
                toastr.error(resp.data.message);;
            });
    }
    
    fetchAssets = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, asset_id: true },
        }));
        let select_params = (newValue !== '') ?
            { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
            { start: 0, length: 10, company_id: this.props.user.company_id };
        this.props.fetchAssets(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.description};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, asset_id: false },
                    m_asset: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, asset_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchCostCenter = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, cost_center_id: true },
        }));
        let select_params = (newValue !== '') ?
            { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
            { start: 0, length: 10, company_id: this.props.user.company_id };
        this.props.fetchCostCenter(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, cost_center_id: false },
                    m_cost_center: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, cost_center_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchWbsProject = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, wbs_element_id: true },
        }));
        let select_params = (newValue !== '') ?
            { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
            { start: 0, length: 10, company_id: this.props.user.company_id };
        this.props.fetchWbsProject(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.description};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, wbs_element_id: false },
                    m_wbs_element: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, wbs_element_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchGlAccount = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, gl_account_id: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchGlAccount(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                    m_gl_account: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchTemplateReminder = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, reminder_template_id: true },
        }));
        let select_params = (newValue !== '') & { select: newValue };
        this.props.fetchTemplateReminder(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.title};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, reminder_template_id: false },
                    m_template_reminder: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, reminder_template_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    saveTemplateReminder = async (payload) => {
        let param = {
            title: payload.title,
            purchasing_org_id: this.props.user.purchasing_org_id,
            content: this.state.param_template_reminder.content,
            status: payload.status.value,
        };
        // console.log(param)
        // return
        this.props.saveTemplateReminder(param)
            .then((resp) => {
                this.setState({ loadingSubmit: false })
                this.fetchTemplateReminder()
                this.toggleClose()
                toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    saveProgress = async (payload) => {
        payload.attachment = this.state.param_progress.attachment
        payload.po_id = this.state.data.id
        // console.log(payload)
        // return
        this.props.saveProgress(payload)
            .then((resp) => {
                // this.setState(({ param_progress }) => ({
                //     param_progress: { ...param_progress, uuid: '', id: '', number: '', planning: '', realitation: '', progress_date: '', description: '', attachment: [], attachment_delete: [] }
                // }), () => {
                //     this.fetchProgress(this.state.data.id)
                //     this.toggleClose()
                //     toastr.success(resp.data.message);
                // });
                toastr.success(resp.data.message);
                window.location.reload()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    updateProgress = async (payload) => {
        let param_progress = this.state.param_progress
        let new_data = []
        param_progress.attachment.map(function(d, i) {
            if (d.id === undefined) {
                return new_data.push(d)
            }
            else {
                return true
            }
        })

        payload.uuid = param_progress.uuid
        payload.attachment = new_data
        payload.attachment_delete = param_progress.attachment_delete
        payload.po_id = this.state.data.id
        // console.log(payload)
        // return
        this.props.updateProgress(payload.uuid, payload)
            .then((resp) => {
                // this.setState(({ param_progress }) => ({
                //     param_progress: { ...param_progress, uuid: '', id: '', number: '', planning: '', realitation: '', progress_date: '', description: '', attachment: [], attachment_delete: [] }
                // }), () => {
                //     this.fetchProgress(this.state.data.id)
                //     this.toggleClose()
                //     toastr.success(resp.data.message);
                // });
                toastr.success(resp.data.message);
                window.location.reload()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    saveAdditionalCost = async (payload) => {
        this.setState(({ status_additional_cost }) => ({
            status_additional_cost: { ...status_additional_cost, type: false, amount: false, uom_id: false, vendor_id: false}
        }));

        if (payload.type === undefined){
            this.setState(({ status_additional_cost }) => ({
                status_additional_cost: { ...status_additional_cost, type: true}
            }));
            return false
        }
        
        if (payload.amount === ''){
            this.setState(({ status_additional_cost }) => ({
                status_additional_cost: { ...status_additional_cost, amount: true}
            }));
            return false
        }

        if (payload.uom_id === undefined){
            this.setState(({ status_additional_cost }) => ({
                status_additional_cost: { ...status_additional_cost, uom_id: true}
            }));
            return false
        }
        
        if (payload.vendor_id === undefined){
            this.setState(({ status_additional_cost }) => ({
                status_additional_cost: { ...status_additional_cost, vendor_id: true}
            }));    
            return false
        }

        let param = {
            po_item_id: this.state.param_modal.po_item_id,
            type: payload.type.value,
            amount: payload.amount,
            vendor_id: payload.vendor_id.value,
            uom_id: payload.uom_id.value
        };
        this.props.savePurchaseOrderAdditionalCost(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.fetchPurchaseOrderItemDetail(this.state.param_modal.po_item_uuid)
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }
    
    updateItemDetail = async (payload) => {
        let value_temp = this.state.value_temp
        this.setState(({ status_detail_item }) => ({
            status_detail_item: { ...status_detail_item, delivery_date: false, tax: false}
        }));

        if (payload.delivery_date === ''){
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, delivery_date: true}
            }));
            return false
        }
        if (value_temp.delivery_date === null || value_temp.delivery_date === '' || value_temp.delivery_date === "NaN-NaN-NaN") {
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, delivery_date: true}
            }));
            return false
        }

        if (payload.tax === ''){
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, tax: true}
            }));
            return false
        }

        let param = {
            spesifikasi: payload.spesifikasi,
            note: payload.note,
            delivery_date: value_temp.delivery_date,
            tax: payload.tax.value,
        };
        // console.log(payload)
        this.props.updatePurchaseOrderItemDetail(this.state.param_modal.po_item_uuid, param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
                // this.fetchPurchaseOrderItemDetail(this.state.param_modal.po_item_uuid)
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }
    
    updateAccountAssignment = (payload) => {
        // console.log(payload)
        this.setState(({ status_acc_asgnment }) => ({
            status_acc_asgnment: { ...status_acc_asgnment, acc_assgn_category: false, gl_account: false, asset: false, cost_center: false, wbs_element: false, order: false}
        }));

        let param_number = ''
        Object.keys(payload).map(function(key) {
            if (key !== 'account_category_id' && key !== 'account_category_name' && key !== 'gl_account_id') {
                if (payload[key] !== null && payload[key] !== '') {
                    param_number = payload[key]
                }
            }
            return true
        });

        if (this.state.data_item.account_assignment[0].acc_assignment_category_id === 'U') {

            if (payload.account_category_id === '' || payload.account_category_id === 'U'){
                this.setState(({ status_acc_asgnment }) => ({
                    status_acc_asgnment: { ...status_acc_asgnment, acc_assgn_category: true}
                }));
                return false
            }
            if (payload.account_category_id === 'K' && payload.cost_center_id === '') {
                this.setState(({ status_acc_asgnment }) => ({
                    status_acc_asgnment: { ...status_acc_asgnment, cost_center: true}
                }));
                return false
            }
            if (payload.account_category_id === 'A' && payload.asset_no === '') {
                this.setState(({ status_acc_asgnment }) => ({
                    status_acc_asgnment: { ...status_acc_asgnment, asset: true}
                }));
                return false
            }
            if ((payload.account_category_id === 'P' || payload.account_category_id === 'Q') && payload.wbs_element === '') {
                this.setState(({ status_acc_asgnment }) => ({
                    status_acc_asgnment: { ...status_acc_asgnment, wbs_element: true}
                }));
                return false
            }
            if (payload.gl_account_id === ''){
                this.setState(({ status_acc_asgnment }) => ({
                    status_acc_asgnment: { ...status_acc_asgnment, gl_account: true}
                }));
                return false
            }
        }
        
        let param_modal = this.state.param_modal
        // if (payload.account_category_id === 'U'){
        //     param_number = ''
        // }
        // else {
        //     if (param_number === '') {
        //         param_number = param_modal.acc_assignment_category_number
        //     }
        // }

        let param = {
            po_item_id: this.state.param_modal.po_item_id,
            acc_assignment_category_id: (payload.account_category_id !== '' ? payload.account_category_id : param_modal.acc_assignment_category_id),
            acc_assignment_category_name: (payload.account_category_name !== '' ? payload.account_category_name : param_modal.acc_assignment_category_name),
            acc_assignment_category_number: param_number,
            gl_account: (payload.gl_account_id !== '' ? payload.gl_account_id : param_modal.gl_account),
        }
        // console.log(payload)
        // console.log(param)
        // return

        this.props.updateAccountAssignment(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.fetchPurchaseOrderItemDetail(this.state.param_modal.po_item_uuid)
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    deleteAccountAssgnment = (payload) => {
        let param = {
            po_item_id: this.state.param_modal.po_item_id,
            acc_assignment_category_id: '',
            acc_assignment_category_name: '',
            acc_assignment_category_number: '',
            gl_account: '',
        }
        // console.log(param)
        // return

        this.props.updateAccountAssignment(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false }, () => {
                    this.fetchPurchaseOrderItemDetail(this.state.param_modal.po_item_uuid)
                    this.getUUID()
                });
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    deleteAdditionalCost = (uuid) => {
        this.props.deletePurchaseOrderAdditionalCost(uuid)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false }, () => {
                    this.fetchPurchaseOrderItemDetail(this.state.param_modal.po_item_uuid)
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    deleteDokumenPO = (uuid, code) => {
        this.props.deleteDocumentPurchaseOrder(uuid)
            .then((resp) => {
                this.setState({ loading_document: true })
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false }, () => {
                    this.fetchDocumentPurchaseOrder(this.state.data.uuid)
                    this.setState({ loading_document: false })
                });
            })
            .catch((error) => {
                this.setState({ loading_document: false, isConfirm: false })
                console.log(error)
            })
    }

    saveDokumenPO = async (payload) => {
        this.setState({ status_dokumen_po: false })
        if (payload.file_name === '' || payload.file_name === null || payload.file_name === undefined) {
            this.setState({ status_dokumen_po: true })
        }
        else {
            this.setState({ loading_document: true })
            this.setState({ loading_dokumen_po: true })
            let param = {
                po_id: this.state.data.id,
                file: payload.file_name,
                description: payload.description,
                tipe: this.state.tipe_dokumen
            }
            this.props.saveDocumentPurchaseOrder(param)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.fetchDocumentPurchaseOrder(this.state.data.uuid)
                    this.setState({ loading_document: false, modalDokumenPO: false })
                })
                .catch(error => {
                    if (error !== undefined) {
                        this.setState({ loading_document: false })
                        toastr.error(error.data.message)
                    } else {
                        this.setState({ loading_document: false })
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }
    
    savePurchaseOrder = (payload) => {
        this.setState({ status_data_item: false, status_header_text: false, status_due_date: false, status_data_incoterm_detail: false })
        let status = false
        let data_item = this.state.data.items
        data_item.forEach(element => {
            if (element.tax === null || element.delivery_date === null) {
                status = true
                this.setState({ status_data_item: true })
                return
            }
        });
        let param_input = this.state.param_input
        if (param_input.header_text === null || param_input.header_text === '') {
            status = true
            this.setState({ status_header_text: true })
            return
        }
        if (param_input.due_date === null || param_input.due_date === '') {
            status = true
            this.setState({ status_due_date: true })
            return
        }
        if (param_input.incoterm_id !== '' && (param_input.incoterm_detail === null || param_input.incoterm_detail === '')) {
            status = true
            this.setState({ status_data_incoterm_detail: true })
            return
        }
        if (!status) {
            if(payload.status === 'd') {
                let param_input = this.state.param_input
                param_input.save_draft = 'y'
                this.props.savePurchaseOrder(param_input)
                    .then((resp) => {
                        toastr.success(resp.data.message);
                        // this.getUUID()
                        if (this.state.data.tipe === 'oa') {
                            this.props.history.push('/perikatan/purchase-order-oa')
                        }
                        else {
                            this.props.history.push('/perikatan/purchase-order')
                        }
                    })
                    .catch(error => {
                        if (error !== undefined) {
                            this.setState({ errors: error.data.errors })
                        } else {
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
            }
            else {
                this.props.savePurchaseOrder(this.state.param_input)
                    .then((resp) => {
                        toastr.success(resp.data.message);
                        // this.getUUID()
                        if (this.state.data.tipe === 'oa') {
                            this.props.history.push('/perikatan/purchase-order-oa')
                        }
                        else {
                            this.props.history.push('/perikatan/purchase-order')
                        }
                    })
                    .catch(error => {
                        if (error !== undefined) {
                            this.setState({ errors: error.data.errors })
                        } else {
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
            }
        }
    }

    approvalVendorPurchaseOrder = (payload) => {
        this.setState({ status_catatan: false})

        if (payload.status === 'y')
        {
            this.setState({ status_dokumen_confirm: false })
            if (this.state.data_document.some(d => d.tipe === '1' || d.tipe === 1)) {
            }
            else {
                this.setState({ status_dokumen_confirm: true })
                return
            }
        }

        if (payload.status === 'r' && this.state.param_input.notes === '') {
            this.setState({ status_catatan: true})
            return 
        }

        let param = {
            status: payload.status,
            note: this.state.param_input.notes,
        }
        this.props.approvalVendorPurchaseOrder(this.state.data.uuid, param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    approvalPurchaseOrder = (payload) => {
        this.setState({ status_catatan: false})

        if (payload.status === 'r' && this.state.param_input.notes === '') {
            this.setState({ status_catatan: true})
            return 
        }

        let param = {
            status: payload.status,
            note: this.state.param_input.notes,
        }
        this.props.approvalPurchaseOrder(this.state.data.uuid, param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    releasePurchaseOrder = (payload) => {
        let param = {
            status: payload.status,
            notes: payload.note,
        }
        this.props.releasePurchaseOrder(this.state.data.uuid, param)
            .then((resp) => {
                toastr.success(resp.data.message);
                if (this.state.data.tipe === 'oa') {
                    this.props.history.push('/perikatan/purchase-order-oa')
                }
                else {
                    this.props.history.push('/perikatan/purchase-order')
                }
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    syncPurchaseOrder = (payload) => {
        this.props.syncPurchaseOrder(this.state.data.uuid)
            .then((resp) => {
                window.location.reload()
                toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleBatalPO = (payload) => {
        let opsi_batal_po = []
        if (this.state.data.order_placement === 'paket') {
            opsi_batal_po = [
                {
                    label: "Re-Awarding",
                    value: "reawarding",
                }
            ]
        }
        else if (this.state.data.order_placement === 'itemize') {
            opsi_batal_po = [
                {
                    label: "Pilih Pemenang Lain",
                    value: "other_winner",
                },
                {
                    label: "Kembali ke Pra Proposal Tender",
                    value: "retender",
                }
            ]
        }

        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            m_tipe_batal_po: opsi_batal_po,
            param_submit_batal_po: [],
            modalOpen:true,
            modalType:'batal-po',
        }), () => {
            this.fetchVendorAwarding('')
        });
    }

    fetchVendorAwarding = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, vendor_id: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, po_id: this.state.data.id, select: newValue} : {start: 0, length: 10, po_id: this.state.data.id};
        this.props.fetchVendorAwarding(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.vendor_id, label: data.vendor_id + ' - ' + data.vendor_name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, vendor_id: false },
                    m_vendor: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, vendor_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    }

    purchaseOrderCancel = (payload) => {
        console.log(payload)
        this.props.purchaseOrderCancel(payload)
            .then((resp) => {
                window.history.back()
                toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleApprovalCancel = (payload) => {
        this.setState({ status_catatan: false})
        if (this.state.param_input.notes === '') {
            this.setState({ status_catatan: true})
            return 
        }
		this.setState({ param_status: payload.status, catatan: this.state.param_input.notes }, () => {
            if (payload.status === 'n') {
                this.toggleDelete('', this.state.data.uuid, 'reject-cancel')
            }
            else if (payload.status === 'y') {
                this.toggleDelete('', this.state.data.uuid, 'approve-cancel')
            }
        });
	}

    purchaseOrderApprovalCancel = () => {
        let param = {
            purchase_order_id: this.state.data.id,
            status: this.state.param_status,
            approval_note: this.state.catatan,
        }
        // console.log(param)
        // return
        this.props.purchaseOrderApprovalCancel(param)
            .then((resp) => {
                window.history.back()
                toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleDokumenPO = (code) => {
		this.setState({ modalDokumenPO: true, tipe_dokumen: code });
	}

    modalItem = async (payload) => {
        this.fetchPurchaseOrderItemDetail(payload.po_item_uuid)

		this.setState({
            modalOpen:true,
			param_modal: payload,
			modalType:'item-detail',
        });
	}

    toggleAccountAssignment = async (payload) => {
		this.setState({ modalAccountAssignment: true });
	}

    toggleCloseAccountAssignment = () => {
		this.setState({ modalAccountAssignment: false });
	}

    modalConfirm = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
            modalType:'confirm',
            param_modal: payload,
        }));
    }
    
    modalConfirmOA = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
            modalType:'confirm-' + payload,
        }));
    }
    
    modalSap = () => {
		this.setState({
            modalOpen:true,
			param_modal: this.state.data.error_sap,
			modalType:'error-sap',
        });
	}

    modalTemplate = (uuid, type) => {
        this.setState({ loadingSubmit: true })
        let param_template_reminder = this.state.param_template_reminder
        param_template_reminder.id = '';
        param_template_reminder.title = '';
        param_template_reminder.content = '';
        param_template_reminder.purchasing_org_id = '';
        param_template_reminder.status = '';
        if (type === 'template-reminder-detail') {
            this.props.showReminder(uuid)
            .then((resp) => {
                let data = resp.data.data;
                param_template_reminder.id = data.reminder_template.id;
                param_template_reminder.title = data.reminder_template.title;
                param_template_reminder.content = data.reminder_template.content;
                param_template_reminder.purchasing_org_id = data.reminder_template.purchasing_org_id;
                if (data.status === 'y') {
                  param_template_reminder.status = {
                    label: 'Active',
                    value: data.reminder_template.status,
                  };
                }
                else if (data.status === 'n') {
                  param_template_reminder.status = {
                    label: 'Inctive',
                    value: data.reminder_template.status,
                  };
                }
                this.setState({ loading: false })
                this.setState({
                    modalOpen:true,
                    param_template_reminder: param_template_reminder,
                    // param_modal: param_template_reminder,
                    modalType:type,
                    loadingSubmit: false
                });
              })
              .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.message)
              });        
        }else if (type === 'history_jadwal_reminder'){
            this.props.showLogEmailReminder({id : uuid})
            .then((resp) => {
                let datar = resp.data.data;
                this.setState({
                    data_log_email_reminder : datar,
                    modalOpen:true,
                    modalType:type,
                    loading: false,
                    loadingSubmit: false
                });
              })
              .catch((resp) => {
                this.setState({ loading: false })
                toastr.error(resp.data.message)
              });
        }
        else {
            this.setState({
                data_log_email_reminder : [],
                modalOpen:true,
                modalType:type,
                loading: false,
                // loadingSubmit: false
            });
        }
		
	}

    setContentTemplateReminder = (payload) => {
        let param_template_reminder = this.state.param_template_reminder
        param_template_reminder.content = payload;
        this.setState({param_template_reminder: param_template_reminder})
    }

    modalProgress = (uuid, type) => {
        if (type === 'progress-log') {
            this.props.showProgressLog(uuid)
                .then((resp) => {
                    let data = resp.data.data;
                    console.log(resp)
                    this.setState({
                        param_modal: data,
                        modalOpen: true,
                        modalType: 'progress-log',
                    });
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
        else {
            let param_progress = this.state.param_progress
            if (uuid !== '') {
                this.setState({ loading_progress_lampiran: true });
                this.props.showProgress(uuid)
                    .then((resp) => {
                        let data = resp.data.data;
                        param_progress.uuid = data.uuid
                        param_progress.id = data.id
                        param_progress.po_id = data.po_id
                        param_progress.number = data.number
                        param_progress.planning = data.planning
                        param_progress.realitation = data.realitation
                        param_progress.progress_date = data.progress_date
                        param_progress.description = data.description
                        if (data.attachment === null) {
                            data.attachment = []
                        }
                        param_progress.attachment = data.attachment
                        this.setState({
                            param_progress: param_progress,
                            modalOpen:true,
                            modalType: 'progress',
                            tipe_modal: type,
                            loading_progress_lampiran: false,
                        });
                    })
                    .catch((resp) => {
                        toastr.error(resp.data.message);;
                    });
            }
            else {
                param_progress.uuid = ''
                param_progress.id = ''
                param_progress.po_id = ''
                param_progress.number = ''
                param_progress.planning = ''
                param_progress.realitation = ''
                param_progress.progress_date = ''
                param_progress.description = ''
                param_progress.attachment = []    
                this.setState({
                    param_progress: param_progress,
                    modalOpen:true,
                    modalType: 'progress',
                    tipe_modal: type,
                });
            }
        }
	}

    setProgressDate = (payload) => {
        this.setState(({ param_progress }) => ({
            param_progress: { ...param_progress, progress_date: payload }
        }));
    }

    addTempLampiranProgress = (name, file) => {
        this.setState(({ temp_lampiran_progress }) => ({
            temp_lampiran_progress: { ...temp_lampiran_progress, name: name, file: file },
        }));
    }

    addLampiranProgress = () => {
        if (this.state.temp_lampiran_progress.name !== '' && this.state.temp_lampiran_progress.file !== '') {
            let param_progress = this.state.param_progress
            param_progress.attachment.push(this.state.temp_lampiran_progress);
            this.setState(({ temp_lampiran_progress }) => ({
                temp_lampiran_progress: { ...temp_lampiran_progress, name: '', file: '' },
                param_progress: param_progress
            }));
        }
    }

    deleteLampiranProgress = (key) => {
        let param_progress = this.state.param_progress
        if (param_progress.attachment[key].id !== undefined) {
            param_progress.attachment_delete.push(param_progress.attachment[key].id)
        }
        delete param_progress.attachment[key];

        this.setState({ loading_progress_lampiran: true, isConfirm: false }, () => {
            let new_data = []
            param_progress.attachment.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState({ param_progress: param_progress, loading_progress_lampiran: false })
            }, 200)
        })
    }

    deleteProgress = (uuid) => {
        this.props.deleteProgress(uuid)
            .then((resp) => {
                this.setState({ isConfirm: false }, () => {
                    // this.fetchProgress(this.state.data.id)
                    toastr.success(resp.data.message);
                    window.location.reload()
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    modalKonfirmasiExpediting = (payload) => {
        let data = []
        data.push(payload)
        this.setState(({ param_konfirmasi}) => ({
            param_konfirmasi: { ...param_konfirmasi, reply_to: payload.parent_id},
            loading_konfirmasi_detail: false,
            modalOpen:true,
            param_modal: data,
            modalType:'konfirmasi-expediting',
        }));
	}

    onInputChangeCatatan = (value) => {
        if (value !== '') {
            this.setState({ status_catatan: false })
        }
        this.setState({ catatan: value })
    }

    setTax = (payload) => {
        this.setState(({ value_temp }) => ({
            value_temp: { ...value_temp, tax: {label: payload.label, value: payload.value} },
        }));
    }

    setDeliveryDate = (payload) => {
        this.setState(({ value_temp }) => ({
            value_temp: { ...value_temp, delivery_date: payload },
        }));
    }

    setSpesifikasi = (payload) => {
        this.setState(({ value_temp }) => ({
            value_temp: { ...value_temp, spesifikasi: payload },
        }));
    }

    setNote = (payload) => {
        this.setState(({ value_temp }) => ({
            value_temp: { ...value_temp, note: payload },
        }));
    }

    // changeAccAssgCategory = (payload) => {
    //     if (payload !== 'U' && payload !== '') {
    //         this.setState(({ status_acc_asgnment }) => ({
    //             status_acc_asgnment: { ...status_acc_asgnment, acc_assgn_category: false}
    //         }));
    //     }
    // }

    // changeGLAccount = (payload) => {
    //     if (payload !== 'U' && payload !== '') {
    //         this.setState(({ status_acc_asgnment }) => ({
    //             status_acc_asgnment: { ...status_acc_asgnment, gl_account: false}
    //         }));
    //     }
    // }

    setOption = async (payload, type) => {
        this.setState({ status_edit: true })
        let param_input = this.state.param_input
        switch(type) {
            case 'header-text':
                param_input.header_text = payload;
                break;
            case 'due-date':
                param_input.due_date = payload;
                break;
            case 'incoterm-id':
                param_input.incoterm_param = payload;
                param_input.incoterm_id = payload.value;
                break;
            case 'incoterm-detail':
                param_input.incoterm_detail = payload;
                break;
            case 'notes':
                param_input.notes = payload;
                if (payload !== '') {
                    this.setState({ status_catatan: false })
                }
                break;
            default:
                break;
        }
        this.setState({ param_input: param_input })
    }

    setOptionKonfirmasi = async (payload, type) => {
        // this.setState({ status_edit: true })
        let param_konfirmasi = this.state.param_konfirmasi
        switch(type) {
            case 'attachment':
                param_konfirmasi.attachment = payload;
                break;
            case 'notes':
                param_konfirmasi.comment = payload;
                if (payload !== '') {
                    // this.setState({ status_catatan: false })
                }
                break;
            default:
                break;
        }
        this.setState({ param_konfirmasi: param_konfirmasi })
    }

    setOptionReminder = async (payload, type) => {
        this.setState({ status_edit: true })
        let param_reminder = this.state.param_reminder
        switch(type) {
            case 'item':
                param_reminder.po_item_id = payload;
                break;
            case 'due-date':
                param_reminder.due_date_days = payload;
                break;
            case 'task-name':
                param_reminder.task_name = payload;
                break;
            case 'reminder-template':
                param_reminder.reminder_template_id = payload;
                break;
            default:
                break;
        }
        this.setState({ param_reminder: param_reminder })
    }

    saveKonfirmasi = () => {
        let param_konfirmasi = this.state.param_konfirmasi
        param_konfirmasi.po_id = this.state.data.id
        this.props.saveKonfirmasi(param_konfirmasi)
            .then((resp) => {
                this.setState(({ param_konfirmasi}) => ({
                    param_konfirmasi: { ...param_konfirmasi, po_id: '', comment: '', attachment: '', reply_to: ''}
                }), () => {
                    this.toggleClose()
                    toastr.success(resp.data.message);
                    this.fetchKonfirmasi(this.state.data.id)
                })    
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

    }

    saveReminder = () => {
        let param_reminder = this.state.param_reminder
        param_reminder.po_id = this.state.data.id
        if (param_reminder.po_item_id[0] === 'all'){
            param_reminder.po_item_id = this.state.m_items.map((item) => {
                    return item.value[0]
            })
            param_reminder.po_item_id.pop();
        }
        // console.log(param_reminder)
        // return
        this.props.saveReminder(param_reminder)
            .then((resp) => {
                this.setState(({ param_reminder }) => ({
                    param_reminder: { ...param_reminder, po_id: '', po_item_id: '', due_date_days: '', task_name: '', reminder_template_id: ''}
                }), () => {
                    this.fetchReminder(this.state.data.id)
                    toastr.success(resp.data.message);
                })    
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

    }

    deleteReminder = (uuid) => {
        this.props.deleteReminder(uuid)
            .then((resp) => {
                this.setState({ isConfirm: false }, () => {
                    this.fetchReminder(this.state.data.id)
                    toastr.success(resp.data.message);
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    updatePurchaseOrderOATemp = (payload) => {
        this.props.updatePurchaseOrderOATemp(this.state.data.uuid)
            .then((resp) => {
                toastr.success(resp.data.message);
                window.history.back()
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })        
    }    

    deletePurchaseOrderOATemp = (payload) => {
        this.props.deletePurchaseOrderOATemp(this.state.data.uuid)
            .then((resp) => {
                toastr.success(resp.data.message);
                window.history.back()
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })        
    }

    renderSwitchBody(param) {
        switch(param) {
          case 'item-detail':
            return <ItemDetail
                        loadings={this.state.loadings}
                        data={this.state.data}
                        user={this.props.user}
						data_item={this.state.data_item}
                        m_tax={this.state.m_tax}
                        m_type={this.state.m_type}
                        m_uom={this.state.m_uom}
                        m_vendor={this.state.m_vendor}
                        m_acc_assgn_category={this.state.m_acc_assgn_category}
                        m_gl_account={this.state.m_gl_account}
                        m_asset={this.state.m_asset}
                        m_cost_center={this.state.m_cost_center}
                        m_wbs_element={this.state.m_wbs_element}
                        fetchTax={this.fetchTax}
                        fetchAccAssignmentCategory={this.fetchAccAssignmentCategory}
                        fetchConditionType={this.fetchConditionType}
                        fetchUom={this.fetchUom}
                        fetchVendor={this.fetchVendor}
                        fetchGlAccount={this.fetchGlAccount}
                        fetchAssets={this.fetchAssets}
                        fetchCostCenter={this.fetchCostCenter}
                        fetchWbsProject={this.fetchWbsProject}
                        saveAdditionalCost={this.saveAdditionalCost}
                        updateItemDetail={this.updateItemDetail}
                        toggleDelete={this.toggleDelete}
                        status_additional_cost={this.state.status_additional_cost}
                        status_detail_item={this.state.status_detail_item}
                        disabledForm={true}
                        toggleClose={this.toggleClose}
                        toggleDeleteAccAssgnment={this.toggleDeleteAccAssgnment}
                        toggleAccountAssignment={this.toggleAccountAssignment}
                        value_temp={this.state.value_temp}
                        setDeliveryDate={this.setDeliveryDate}
                        setTax={this.setTax}
                        setSpesifikasi={this.setSpesifikasi}
                        setNote={this.setNote}
                        status_account_assignmment={this.state.status_account_assignmment}
                        status_acc_asgnment={this.state.status_acc_asgnment}
                        updateAccountAssignment={this.updateAccountAssignment}
                        // changeAccAssgCategory={this.changeAccAssgCategory}
                        // changeGLAccount={this.changeGLAccount}
                        errors={this.state.errors}
						/>;
          case 'error-sap':
            return <ErrorSAP
                        data={this.state.data}
                        user={this.props.user}
                        param={this.state.param_modal}
                        toggleClose={this.toggleClose}
                        save={this.syncPurchaseOrder}
						/>;
          case 'confirm':
            return <Konfirmasi
                        data={this.state.data.items}
                        param={this.state.param_modal}
                        nego={this.state.nego}
                        toggleClose={this.toggleClose}
                        save={this.releasePurchaseOrder}
						/>;
          case 'confirm-update':
            return <KonfirmasiOA
                        modalType={this.state.modalType}
                        save={this.updatePurchaseOrderOATemp}
                        delete={this.deletePurchaseOrderOATemp}
                        toggleClose={this.toggleClose}
						/>;
          case 'confirm-delete':
            return <KonfirmasiOA
                        modalType={this.state.modalType}
                        save={this.updatePurchaseOrderOATemp}
                        delete={this.deletePurchaseOrderOATemp}
                        toggleClose={this.toggleClose}
						/>;
          case 'batal-po':
            return <FormBatalPO
                        fileUpload={this.props.fileUpload}
                        loadings={this.state.loadings}
                        m_vendor={this.state.m_vendor}
                        fetchVendorAwarding={this.fetchVendorAwarding}
                        saveRetender={this.saveRetender}
                        upload={this.props.fileUpload}
                        parentState={this.state}
                        modalType={this.state.modalType}
                        save={this.purchaseOrderCancel}
                        toggleClose={this.toggleClose}
						/>;
          case 'template-reminder-create':
            return <FormTemplate
                        loadings={this.state.loadings}
                        parentState={this.state}
                        data={this.state.param_template_reminder}
                        errors={this.state.errors}
                        isError={this.state.isError}
                        modalType='create'
                        setData={this.setContentTemplateReminder}
                        save={this.saveTemplateReminder}
                        toggleClose={this.toggleClose}
						/>;
          case 'template-reminder-detail':
            return <FormTemplate
                        loadings={this.state.loadings}
                        parentState={this.state}
                        data={this.state.param_template_reminder}
                        errors={this.state.errors}
                        isError={this.state.isError}
                        modalType='detail'
                        setData={this.setContentTemplateReminder}
                        save={this.saveTemplateReminder}
                        toggleClose={this.toggleClose}
						/>;
          case 'progress':
            return <FormProgress
                        loadings={this.state.loadings}
                        loading_progress_lampiran={this.state.loading_progress_lampiran}
						errors={this.state.errors}
                        upload={this.props.fileUpload}
                        parentState={this.state}
                        modalType={this.state.tipe_modal}
                        data={this.state.param_progress}
                        save={this.saveProgress}
                        update={this.updateProgress}
                        setProgressDate={this.setProgressDate}
                        addTempLampiran={this.addTempLampiranProgress}
						addLampiranProgress={this.addLampiranProgress}
                        deleteLampiranProgress={this.deleteLampiranProgress}
                        toggleDelete={this.toggleDelete}
                        toggleClose={this.toggleClose}
						/>;
          case 'progress-log':
            return <HistoryUpdate
                        loadings={this.state.loadings}
						errors={this.state.errors}
                        data={this.state.param_modal}
                        modalType={this.state.modalType}
                        toggleClose={this.toggleClose}
						/>;
          case 'konfirmasi-expediting':
            return <FormReply
                        loadings={this.state.loadings}
                        upload={this.props.fileUpload}
                        modalType={this.state.modalType}
                        data={this.state.param_modal}
                        param_konfirmasi={this.state.param_konfirmasi}
                        setOptionKonfirmasi={this.setOptionKonfirmasi}
                        loading_konfirmasi={this.state.loading_konfirmasi_detail}
                        save={this.saveKonfirmasi}
                        toggleClose={this.toggleClose}
						/>;
          case 'history_jadwal_reminder':
            return <HistoryLogEmail 
                        loadings={this.state.loadings}
                        errors={this.state.errors}
                        data={this.state.data_log_email_reminder}
                        toggleClose={this.toggleClose}
                    />;
          default:
            return ;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
          case 'item-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>;
          case 'error-sap':
            return <ModalHeader toggle={() => this.toggleClose()}>Error SAP</ModalHeader>;
          case 'confirm':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'confirm-update':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'confirm-delete':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'batal-po':
            return <ModalHeader toggle={() => this.toggleClose()}>Pembatalan PO</ModalHeader>;
          case 'template-reminder-create':
            return <ModalHeader toggle={() => this.toggleClose()}>Create Template Reminder</ModalHeader>;
          case 'template-reminder-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Detail Template Reminder</ModalHeader>;
          case 'progress':
            return <ModalHeader toggle={() => this.toggleClose()}>{
                this.state.tipe_modal === "edit" ? 'Edit' :
                this.state.tipe_modal === "create" ? 'Create' :
                'Detail'} Progress Barang & Jasa</ModalHeader>;
          case 'konfirmasi-expediting':
            return <ModalHeader toggle={() => this.toggleClose()}>Reply Komentar</ModalHeader>;
          case 'progress-log':
            return <ModalHeader toggle={() => this.toggleClose()}>History Log Update Progress</ModalHeader>;
          case 'history_jadwal_reminder':
            return <ModalHeader toggle={() => this.toggleClose()}>History Log Email Reminder</ModalHeader>;
          default:
            return ;
        }
    }

    downloadPOBeritaAcara = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.downloadBeritaAcaraPO(this.props.match.params.id)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Purchase_order_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
      this.setState({loadingDownload : false});
			toastr.error("Failed Download Berita Acara");
			// this.setState({loading: false});
		});
	}

    render() {
        const {t} = this.props;
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
                        errors={this.state.errors}
                        user={this.props.user}
                        role_vendor={this.state.role_vendor}
                        data={this.state.data}
                        data_user_vendor={this.state.data_user_vendor}
                        data_progress={this.state.data_progress}
                        data_reminder={this.state.data_reminder}
                        data_konfirmasi={this.state.data_konfirmasi}
                        param_input={this.state.param_input}
                        document={this.state.data_document}
                        m_incoterm={this.state.m_incoterm}
                        m_template_reminder={this.state.m_template_reminder}
                        m_items={this.state.m_items}
                        status_dokumen_confirm={this.state.status_dokumen_confirm}
                        status_catatan={this.state.status_catatan}
                        status_data_item={this.state.status_data_item}
                        status_header_text={this.state.status_header_text}
                        status_due_date={this.state.status_due_date}
                        status_data_incoterm_detail={this.state.status_data_incoterm_detail}
                        loadings={this.state.loadings}
                        loading_document={this.state.loading_document}
                        loading_progress={this.state.loading_progress}
                        loading_reminder={this.state.loading_reminder}
                        loading_konfirmasi={this.state.loading_konfirmasi}
                        param_konfirmasi={this.state.param_konfirmasi}
                        toggleBatalPO={this.toggleBatalPO}
                        toggleDokumenPO={this.toggleDokumenPO}
                        toggleDelete={this.toggleDelete}
                        toggleApprovalCancel={this.toggleApprovalCancel}
                        modalItem={this.modalItem}
                        modalSap={this.modalSap}
                        modalConfirm={this.modalConfirm}
                        modalConfirmOA={this.modalConfirmOA}
                        modalTemplate={this.modalTemplate}
                        modalProgress={this.modalProgress}
                        modalKonfirmasiExpediting={this.modalKonfirmasiExpediting}
                        onInputChangeCatatan={this.onInputChangeCatatan}
                        setOptionKonfirmasi={this.setOptionKonfirmasi}
                        setOption={this.setOption}
                        setOptionReminder={this.setOptionReminder}
                        fetchIncoterms={this.fetchIncoterms}
                        fetchTemplateReminder={this.fetchTemplateReminder}
                        saveReminder={this.saveReminder}
                        saveKonfirmasi={this.saveKonfirmasi}
                        savePurchaseOrder={this.savePurchaseOrder}
                        approvalVendorPurchaseOrder={this.approvalVendorPurchaseOrder}
                        approvalPurchaseOrder={this.approvalPurchaseOrder}
                        releasePurchaseOrder={this.releasePurchaseOrder}
                        updatePurchaseOrderOATemp={this.updatePurchaseOrderOATemp}
                        deletePurchaseOrderOATemp={this.deletePurchaseOrderOATemp}
                        fileUpload={this.props.fileUpload}
                        downloadPOBeritaAcara = {this.downloadPOBeritaAcara}
                        loadingSubmit={this.state.loadingSubmit}
                    />
                }
                {(this.state.modalType === 'confirm-update' || this.state.modalType === 'confirm-delete') ?
                    <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-md">
                        {this.renderSwitchHeader(this.state.modalType)}
                        {this.state.loadings.loadingModal ? (
                            <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                            </center>
                        ) : this.renderSwitchBody(this.state.modalType)}
                    </Modal> :
                    <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                        {this.renderSwitchHeader(this.state.modalType)}
                        {this.state.loadings.loadingModal ? (
                            <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                            </center>
                        ) : this.renderSwitchBody(this.state.modalType)}
                    </Modal>
                }
                { this.state.modalDokumenPO &&
                    <ModalDokumenPO
                        fileUpload={this.props.fileUpload}
                        modalDokumenPO={this.state.modalDokumenPO}
                        errors={this.state.errors}
                        saveDokumenPO={this.saveDokumenPO}
                        toggleClose={this.toggleClose}
                        status_dokumen_po={this.state.status_dokumen_po}
                    />
                }
                { this.state.modalAccountAssignment &&
                    <ModalForm
                        errors={this.state.errors}
                        toggleAdd={this.state.modalAccountAssignment}
                        toggleClose={this.toggleCloseAccountAssignment}
                        updateAccountAssignment={this.updateAccountAssignment}
                        data={this.state.data_item.account_assignment}
                        po_item_id={this.state.param_modal.po_item_id}
                        disableModal={this.state.disableModal}
                    />
                }
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.yes")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={this.state.title}
                    onConfirm={() => this.toggleSweetAlert(this.state.code_confirm)}
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
        showExpediting: (id) => dispatch(showExpediting(id)),
		savePurchaseOrder: (payload) => dispatch(savePurchaseOrder(payload)),
        fetchPurchaseOrderItemDetail: (id) => dispatch(fetchPurchaseOrderItemDetail(id)),
        updatePurchaseOrderItemDetail: (id, payload) => dispatch(updatePurchaseOrderItemDetail(id, payload)),
        updateAccountAssignment: (id, payload) => dispatch(updateAccountAssignment(id, payload)),
		savePurchaseOrderAdditionalCost: (payload) => dispatch(savePurchaseOrderAdditionalCost(payload)),
        deletePurchaseOrderAdditionalCost: (id) => dispatch(deletePurchaseOrderAdditionalCost(id)),
        approvalVendorPurchaseOrder: (id, payload) => dispatch(approvalVendorPurchaseOrder(id, payload)),
        approvalPurchaseOrder: (id, payload) => dispatch(approvalPurchaseOrder(id, payload)),
        releasePurchaseOrder: (id, payload) => dispatch(releasePurchaseOrder(id, payload)),
        fetchDocumentPurchaseOrder: (id, param) => dispatch(fetchDocumentPurchaseOrder(id, param)),
		saveDocumentPurchaseOrder: (payload) => dispatch(saveDocumentPurchaseOrder(payload)),
        deleteDocumentPurchaseOrder: (id) => dispatch(deleteDocumentPurchaseOrder(id)),
        showUserVendorDetail: (id) => dispatch(showUserVendorDetail(id)),
        fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
        fetchTax: (params) => dispatch(fetchTax(params)),
        fetchConditionType: (params) => dispatch(fetchConditionType(params)),
        fetchUom: (params) => dispatch(fetchUom(params)),
        fetchVendor: (params) => dispatch(fetchVendor(params)),
        fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
        fetchAssets: (params) => dispatch(fetchAssets(params)),
        fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
        fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
        fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        downloadBeritaAcaraPO: (uuid) => dispatch(downloadBeritaAcaraPO(uuid)),
        syncPurchaseOrder: (id) => dispatch(syncPurchaseOrder(id)),
        updatePurchaseOrderOATemp: (id) => dispatch(updatePurchaseOrderOATemp(id)),
        deletePurchaseOrderOATemp: (id) => dispatch(deletePurchaseOrderOATemp(id)),
        fetchVendorAwarding: (params) => dispatch(fetchVendorAwarding(params)),
        purchaseOrderCancel: (payload) => dispatch(purchaseOrderCancel(payload)),
        purchaseOrderApprovalCancel: (payload) => dispatch(purchaseOrderApprovalCancel(payload)),
        fetchTemplateReminder: (params) => dispatch(fetchTemplateReminder(params)),
		saveTemplateReminder: (payload) => dispatch(saveTemplateReminder(payload)),
        showReminder: (id) => dispatch(showReminder(id)),
        showKonfirmasi: (id) => dispatch(showKonfirmasi(id)),
        fetchKonfirmasi: (param) => dispatch(fetchKonfirmasi(param)),
		saveKonfirmasi: (payload) => dispatch(saveKonfirmasi(payload)),
        updateKonfirmasi: (id, payload) => dispatch(updateKonfirmasi(id, payload)),
        fetchReminder: (param) => dispatch(fetchReminder(param)),
		saveReminder: (payload) => dispatch(saveReminder(payload)),
        updateReminder: (id, payload) => dispatch(updateReminder(id, payload)),
        deleteReminder: (id) => dispatch(deleteReminder(id)),
        fetchProgress: (param) => dispatch(fetchProgress(param)),
        showProgress: (id) => dispatch(showProgress(id)),
		saveProgress: (payload) => dispatch(saveProgress(payload)),
        updateProgress: (id, payload) => dispatch(updateProgress(id, payload)),
        deleteProgress: (id) => dispatch(deleteProgress(id)),
        showProgressLog: (id) => dispatch(showProgressLog(id)),
        showLogEmailReminder  : (param) => dispatch(showLogEmailReminder(param))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailOpenPO));

