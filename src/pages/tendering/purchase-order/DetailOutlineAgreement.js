import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { showOutlineAgreement,
        saveOutlineAgreement,
        fetchOutlineAgreementItemDetail, 
        updateOutlineAgreementItemDetail, 
        updateAccountAssignment,
        saveOutlineAgreementAdditionalCost, 
        deleteOutlineAgreementAdditionalCost, 
        fetchDocumentOutlineAgreement,
        saveDocumentOutlineAgreement,
        deleteDocumentOutlineAgreement } from '../../../store/actions/tendering/OutlineAgreementActions';
import { showUserVendorDetail } from '../../../store/actions/tendering/praQualificationActions';
import { fetchIncoterms } from '../../../store/actions/master/incotermsActions';
import { fetchTax } from '../../../store/actions/master/masterTaxActions';
import {fetchConditionType } from '../../../store/actions/master/conditionTypeActions'
import { fetchUom } from '../../../store/actions/master/uomActions';
import { fetchVendor } from '../../../store/actions/vendor/vendorActions';
import { fetchDocumentType } from '../../../store/actions/master/documentTypeActions';

import { fetchAccAssignmentCategory } from '../../../store/actions/master/accAssignmentCategoryActions';
import { fetchAssets } from '../../../store/actions/master/assetsActions';
import { fetchCostCenter } from '../../../store/actions/master/costCenterActions';
import { fetchWbsProject } from '../../../store/actions/master/wbsProjectActions';
import { fetchGlAccount } from '../../../store/actions/master/glAccountActions';

import { downloadBeritaAcaraPO } from '../../../store/actions/tendering/monitoringTenderBuyerActions';

import { fileUpload } from '../../../store/actions/uploadActions';
import Form from './detail-oa/Form'
import ItemDetail from './detail-oa/ItemDetail'
import Konfirmasi from './detail-oa/Konfirmasi'
// import KonfirmasiOA from './detail-oa/KonfirmasiOA'
import ErrorSAP from './detail-oa/ErrorSAP'
import ReleaseAgreement from './detail-oa/ReleaseAgreement';
import ModalDokumenPO from './detail-oa/dokumen-po/ModalDokumenPO'
// import ModalAccountAssignment from './detail/account-assiggnment/ModalAccountAssignment'
import ModalForm from './detail-oa/account-assiggnment/ModalForm'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';

export class DetailOutlineAgreement extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
            data_document: [],
            data_user_vendor: [],
            data_header: [],
            m_incoterm: [],
            m_agreement_type: [],
            m_tax: [],
            m_type: [],
            m_uom: [],
            m_vendor: [],
            m_acc_assgn_category: [],
            m_gl_account: [],
            m_asset: [],
            m_cost_center: [],
            m_wbs_element: [],
            document: [],
            tipe_dokumen: '0',
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
                tax: false,
                qty_oa: false,
                price: false,
            },
            data_item: [],
            data_purchase_order: [],
            data_catatan: [],
            param_modal: [],
            loading: true,
            loading_document: true,
            loadings: {
                loadingModal: false,
                incoterm: true,
                agreement_type: true,
                tax: true,
                type: true,
                uom_id: true,
                vendor_id: true,
                acc_assgn_category: true,
                gl_account_id: true,
                asset_id: true,
                cost_center_id: true,
                wbe_element_id: true,
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
            catatan: '',
            status_catatan: false,
            status_account_assignmment: false,
            status_data_item: false,
            isConfirm: false,
            loading_dokumen_po: false,
            additional_cost_uuid: '',
            status_dokumen_po: false,
            status_dokumen_confirm: false,
            status_edit: false,
            status_incoterm: false,
            status_agreement_type: false,
            modalOpen:false,
            modalDokumenPO: false,
            modalAccountAssignment: false,
            modalType:'',
            uuid:'',
            code_confirm:'',
            param_input: {
                outline_agreement_id:'',
                header_text:'',
                incoterm_param:[],
                incoterm_id:'',
                agreement_type_param:[],
                agreement_type:'',
                incoterm_detail:'',
                agreement_date:'',
                validity_start:'',
                validity_end:'',
                target_value:'',
                note:'',
            },
            param_item_detail: {
                // header_text:'',
                spesifikasi:'',
                uuid:'',
                tax:'',
                tax_param:[],
                qty_oa:'',
                price:'',
            },
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
                this.fetchDocumentType()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleClose = () => {
        this.setState(({ value_temp, param_item_detail }) => ({
            value_temp: { ...value_temp, spesifikasi: '', delivery_date: '', tax: '', note: '' },
            modalOpen:false, modalType:'', modalDokumenPO: false,
            status_account_assignmment: false,
            param_item_detail: { ...param_item_detail, tax: '', tax_param: [], qty_oa: '', price: '', uuid: '', spesifikasi: '' },
        }));
	}

    toggleDelete = (e, value, code) => {
        // console.log(e)
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'additional-cost':
                this.deleteAdditionalCost(this.state.uuid)
                break;
            case 'dokumen-po':
                this.deleteDokumenPO(this.state.uuid, 'document_po')
                break;
            case 'dokumen-po-confirm':
                this.deleteDokumenPO(this.state.uuid, 'document_po_confirm')
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
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
                    toastr.error("FAILED LOAD DATA");
                });
        }
    }

    getUUID = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showOutlineAgreement(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    // datas.status = 'd'
                    let oa = datas.outline_agreement
                    let param_input = this.state.param_input
                    if (oa.header_text !== null && oa.header_text !== '' && param_input.header_text === '') {
                        param_input.header_text = oa.header_text
                    }
                    if (oa.agreement_type !== null && oa.agreement_type !== '' && param_input.agreement_type === '') {
                        param_input.agreement_type_param = {
                            value: oa.agreement_type,
                            label: oa.agreement_type + ' - ' + oa.agreement_type_description,
                        }
                        param_input.agreement_type = oa.agreement_type
                    }
                    if (oa.incoterm_id !== null && oa.incoterm_id !== '' && param_input.incoterm_id === '') {
                        param_input.incoterm_param = {
                            value: oa.incoterm_id,
                            label: oa.incoterm_id + ' - ' + oa.incoterm_name,
                        }
                        param_input.incoterm_id = oa.incoterm_id
                    }
                    if (oa.incoterm_detail !== null && oa.incoterm_detail !== '' && param_input.incoterm_detail === '') {
                        param_input.incoterm_detail = oa.incoterm_detail
                    }
                    if (oa.agreement_date !== null && oa.agreement_date !== '' && param_input.agreement_date === '') {
                        param_input.agreement_date = oa.agreement_date
                    }
                    if (oa.validity_start !== null && oa.validity_start !== '' && param_input.validity_start === '') {
                        param_input.validity_start = oa.validity_start
                    }
                    if (oa.validity_end !== null && oa.validity_end !== '' && param_input.validity_end === '') {
                        param_input.validity_end = oa.validity_end
                    }
                    if (oa.target_value !== null && oa.target_value !== '' && param_input.target_value === '') {
                        param_input.target_value = oa.target_value
                    }
                    this.setState({ loading: false, data: datas, document: datas.document, param_input: param_input }, () => {
                        this.fetchDocumentOutlineAgreement(datas.uuid)
                    })
                })
                .catch((resp) => {
                    if (resp.data.message === "User does not have the right permissions.") {
                        this.props.history.push('/')
                        toastr.error(resp.data.message);
                    }
                    else {
                        this.setState({ loading: false });
                        toastr.error("FAILED LOAD DATA");
                    }
                });
        }
    }

    fetchDocumentOutlineAgreement = (uuid) => {
        if (this._isMounted) {
            this.setState({ loading_document: true });
            let param = []
            this.props
                .fetchDocumentOutlineAgreement(uuid, param)
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
                        toastr.error("FAILED LOAD DATA");
                    }
                });
        }
    }

    fetchOutlineAgreementItemDetail = (id) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingModal: true },
        }));
        this.props.fetchOutlineAgreementItemDetail(id)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let value_temp = this.state.value_temp
                let param_item_detail = this.state.param_item_detail
                if (data.tax !== null && data.tax !== '' && param_item_detail.tax === '') {
                    param_item_detail.tax_param = {
                        value: data.tax,
                        label: data.tax_description,
                    }
                    param_item_detail.tax = data.tax
                }
                if (data.spesifikasi !== null && data.spesifikasi !== '' && param_item_detail.spesifikasi === '') {
                    param_item_detail.spesifikasi = data.spesifikasi
                }
                if (data.qty_oa !== null && data.qty_oa !== '' && param_item_detail.qty_oa === '') {
                    param_item_detail.qty_oa = data.qty_oa
                }
                if (data.price !== null && data.price !== '' && param_item_detail.price === '') {
                    param_item_detail.price = data.price
                }

                let status = false
                if (data.account_assignment[0].acc_assignment_category_id === null) {
                    status = true
                }
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal: false },
                    data_item: data,
                    value_temp: value_temp,
                    param_item_detail: param_item_detail,
                    status_account_assignmment: status,
                }), () => {
                    if (this.state.data.created_by === this.props.user.uuid && this.state.data.status === 'd') {
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
                toastr.error("FAILED LOAD DATA");
            });
    };

    fetchDocumentType = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, agreement_type: true },
        }));
        let select_params = (newValue !== '') ?
            {start: 0, length: 10, doc_cat: 'K', select: newValue} :
            {start: 0, length: 10, doc_cat: 'K'};
        this.props.fetchDocumentType(select_params)
            .then((resp) => {
                console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.description};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, agreement_type: false },
                    m_agreement_type: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, agreement_type: false },
                }));
                toastr.error("FAILED LOAD DATA");
            });
    };
    
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                    return { value: data.code, label: data.code + ' - ' + data.name};
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
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
                toastr.error("FAILED LOAD DATA");
            });
    };

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
            outline_agreement_item_id: this.state.param_modal.id,
            type: payload.type.value,
            amount: payload.amount,
            vendor_id: payload.vendor_id.value,
            uom: payload.uom_id.value,
        };
        // console.log(param)
        // return
        this.props.saveOutlineAgreementAdditionalCost(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.fetchOutlineAgreementItemDetail(this.state.param_modal.uuid)
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
        let param = this.state.param_item_detail
        param.uuid = this.state.param_modal.uuid
        // console.log(param)
        // return
        this.setState(({ status_detail_item }) => ({
            status_detail_item: { ...status_detail_item, qty_oa: false, price: false, tax: false}
        }));

        if (param.qty_oa === ''){
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, qty_oa: true}
            }));
            return false
        }

        if (param.price === ''){
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, price: true}
            }));
            return false
        }

        if (param.tax === ''){
            this.setState(({ status_detail_item }) => ({
                status_detail_item: { ...status_detail_item, tax: true}
            }));
            return false
        }

        this.props.updateOutlineAgreementItemDetail(this.state.param_modal.uuid, param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
                // this.fetchOutlineAgreementItemDetail(this.state.param_modal.uuid)
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
        let param = {
            outline_agreement_item_id: this.state.param_modal.id,
            account_assignment: (payload.account_category_id !== '' ? payload.account_category_id : param_modal.account_assignment),
            account_assignment_name: (payload.account_category_name !== '' ? payload.account_category_name : param_modal.account_assignment_name),
            account_assignment_number: param_number,
            gl_account: (payload.gl_account_id !== '' ? payload.gl_account_id : param_modal.gl_account),
        }
        // console.log(payload)
        // console.log(param)
        // return

        this.props.updateAccountAssignment(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.fetchOutlineAgreementItemDetail(this.state.param_modal.uuid)
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

    deleteAdditionalCost = (uuid) => {
        this.props.deleteOutlineAgreementAdditionalCost(uuid)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false }, () => {
                    this.fetchOutlineAgreementItemDetail(this.state.param_modal.uuid)
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    deleteDokumenPO = (uuid, code) => {
        this.props.deleteDocumentOutlineAgreement(uuid)
            .then((resp) => {
                this.setState({ loading_document: true })
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false }, () => {
                    this.fetchDocumentOutlineAgreement(this.state.data.uuid)
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
                outline_agreement_id: this.state.data.id,
                file: payload.file_name,
                description: payload.description,
                // tipe: this.state.tipe_dokumen
            }
            this.props.saveDocumentOutlineAgreement(param)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.fetchDocumentOutlineAgreement(this.state.data.uuid)
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
    
    saveOutlineAgreement = (payload) => {
        let param = this.state.param_input
        param.outline_agreement_id = this.state.data.id
        // console.log(this.state.param_input)
        this.setState({ status_agreement_type: false })
        if (param.agreement_type === '') {
            this.setState({ status_agreement_type: true })
            return
        }
        this.setState({ status_incoterm: false })
        if (param.incoterm_id === '') {
            this.setState({ status_incoterm: true })
            return
        }
        // let status = false
        // let data_item = this.state.data.items
        // data_item.forEach(element => {
        //     if (element.tax === null || element.delivery_date === null) {
        //         status = true
        //         this.setState({ status_data_item: true })
        //         return
        //     }
        // });

        // if (!status) {
        //     let param = {
        //         po_id: this.state.data.id,
        //         notes: payload.note,
        //         // due_date: this.state.due_date,
        //         // attachment: this.state.data.document,
        //     }
        //     // console.log(param)
            this.props.saveOutlineAgreement(param)
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
        // }
    }

    toggleDokumenPO = (code) => {
		this.setState({ modalDokumenPO: true, tipe_dokumen: code });
	}

    modalItem = async (payload) => {
        this.fetchOutlineAgreementItemDetail(payload.uuid)

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

    setOption = async (payload, type) => {
        this.setState({ status_edit: true })
        let param_input = this.state.param_input
        switch(type) {
            case 'header-text':
                param_input.header_text = payload;
                break;
            case 'agreement-date':
                param_input.agreement_date = payload;
                break;
            case 'validity-start':
                param_input.validity_start = payload;
                break;
            case 'validity-end':
                param_input.validity_end = payload;
                break;
            case 'agreement-type':
                param_input.agreement_type_param = payload;
                param_input.agreement_type = payload.value;
                break;
            case 'incoterm-id':
                param_input.incoterm_param = payload;
                param_input.incoterm_id = payload.value;
                break;
            case 'incoterm-detail':
                param_input.incoterm_detail = payload;
                break;
            case 'target-value':
                param_input.target_value = payload;
                break;
            case 'note':
                param_input.note = payload;
                break;
            default:
                break;
        }
        this.setState({ param_input: param_input })
    }

    setOptionDetail = async (payload, type) => {
        this.setState(({ status_detail_item }) => ({
            status_detail_item: { ...status_detail_item, qty_oa: false, price: false, tax: false}
        }));
        let param_item_detail = this.state.param_item_detail
        switch(type) {
            // case 'header-text':
            //     param_item_detail.header_text = payload;
            //     break;
            case 'spesifikasi':
                param_item_detail.spesifikasi = payload;
                break;
            case 'qty-oa':
                param_item_detail.qty_oa = payload;
                this.setState(({ status_detail_item }) => ({
                    status_detail_item: { ...status_detail_item, qty_oa: false}
                }));
                break;
            case 'price-oa':
                param_item_detail.price = payload;
                this.setState(({ status_detail_item }) => ({
                    status_detail_item: { ...status_detail_item, price: false}
                }));
                break;
            case 'tax':
                param_item_detail.tax_param = payload;
                param_item_detail.tax = payload.value;
                this.setState(({ status_detail_item }) => ({
                    status_detail_item: { ...status_detail_item, tax: false}
                }));
                break;
            default:
                break;
        }
        this.setState({ param_item_detail: param_item_detail })
    }

    modalReleaseAgreement = async (payload) => {
		this.setState({
            modalOpen:true,
			param_modal: payload,
            modalType:'release-agreement',
        });
	}

    modalConfirmOA = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
            modalType:'confirm-' + payload,
        }));
    }
    
    modal_sap = () => {
		this.setState({
            modalOpen:true,
			param_modal: this.state.data.error_sap,
			modalType:'error-sap',
        });
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

    setHeaderText = (payload) => {
        this.setState(({ param_input }) => ({
            param_input: { ...param_input, header_text: payload },
        }));
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
                        toggleAccountAssignment={this.toggleAccountAssignment}
                        value_temp={this.state.value_temp}
                        setDeliveryDate={this.setDeliveryDate}
                        setTax={this.setTax}
                        setSpesifikasi={this.setSpesifikasi}
                        setNote={this.setNote}
                        status_account_assignmment={this.state.status_account_assignmment}
                        status_acc_asgnment={this.state.status_acc_asgnment}
                        updateAccountAssignment={this.updateAccountAssignment}
                        setOptionDetail={this.setOptionDetail}
                        param_item_detail={this.state.param_item_detail}
                        errors={this.state.errors}
						/>;
          case 'error-sap':
            return <ErrorSAP
                        data={this.state.data}
                        param={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          case 'release-agreement':
            return <ReleaseAgreement
                        // data={this.state.data}
                        data={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          case 'confirm':
            return <Konfirmasi
                        data={this.state.data.items}
                        param={this.state.param_modal}
                        nego={this.state.nego}
                        toggleClose={this.toggleClose}
                        save={console.log('ok')}
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
          case 'release-agreement':
            return <ModalHeader toggle={() => this.toggleClose()}>Release Order</ModalHeader>;
          case 'confirm':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'confirm-update':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'confirm-delete':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
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
			const url = window.URL.createObjectURL(new ([resp.data])());
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
                        data={this.state.data}
                        param_input={this.state.param_input}
                        document={this.state.data_document}
                        user={this.props.user}
                        role_vendor={this.state.role_vendor}
                        data_user_vendor={this.state.data_user_vendor}
                        loading_document={this.state.loading_document}
                        status_dokumen_confirm={this.state.status_dokumen_confirm}
                        status_catatan={this.state.status_catatan}
                        status_data_item={this.state.status_data_item}
                        setHeaderText={this.setHeaderText}
                        setOption={this.setOption}
                        onInputChangeCatatan={this.onInputChangeCatatan}
                        saveOutlineAgreement={this.saveOutlineAgreement}
                        toggleDokumenPO={this.toggleDokumenPO}
                        toggleDelete={this.toggleDelete}
                        modalItem={this.modalItem}
                        modal_sap={this.modal_sap}
                        modalReleaseAgreement={this.modalReleaseAgreement}
                        modalConfirm={this.modalConfirm}
                        modalConfirmOA={this.modalConfirmOA}
                        downloadPOBeritaAcara = {this.downloadPOBeritaAcara}
                        m_incoterm={this.state.m_incoterm}
                        m_agreement_type={this.state.m_agreement_type}
                        status_incoterm={this.state.status_incoterm}
                        status_agreement_type={this.state.status_agreement_type}
                        fetchIncoterms={this.fetchIncoterms}
                        fetchDocumentType={this.fetchDocumentType}
                        loadings={this.state.loadings}

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
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
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
        showOutlineAgreement: (id) => dispatch(showOutlineAgreement(id)),
		saveOutlineAgreement: (payload) => dispatch(saveOutlineAgreement(payload)),
        fetchOutlineAgreementItemDetail: (id) => dispatch(fetchOutlineAgreementItemDetail(id)),
        updateOutlineAgreementItemDetail: (id, payload) => dispatch(updateOutlineAgreementItemDetail(id, payload)),
        updateAccountAssignment: (id, payload) => dispatch(updateAccountAssignment(id, payload)),
		saveOutlineAgreementAdditionalCost: (payload) => dispatch(saveOutlineAgreementAdditionalCost(payload)),
        deleteOutlineAgreementAdditionalCost: (id) => dispatch(deleteOutlineAgreementAdditionalCost(id)),
        fetchDocumentOutlineAgreement: (id, param) => dispatch(fetchDocumentOutlineAgreement(id, param)),
		saveDocumentOutlineAgreement: (payload) => dispatch(saveDocumentOutlineAgreement(payload)),
        deleteDocumentOutlineAgreement: (id) => dispatch(deleteDocumentOutlineAgreement(id)),
        showUserVendorDetail: (id) => dispatch(showUserVendorDetail(id)),
        fetchTax: (params) => dispatch(fetchTax(params)),
        fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
        fetchConditionType: (params) => dispatch(fetchConditionType(params)),
        fetchUom: (params) => dispatch(fetchUom(params)),
        fetchVendor: (params) => dispatch(fetchVendor(params)),
        fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
        fetchAssets: (params) => dispatch(fetchAssets(params)),
        fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
        fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
        fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
        fetchDocumentType: (params) => dispatch(fetchDocumentType(params)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        downloadBeritaAcaraPO: (uuid) => dispatch(downloadBeritaAcaraPO(uuid)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailOutlineAgreement));

