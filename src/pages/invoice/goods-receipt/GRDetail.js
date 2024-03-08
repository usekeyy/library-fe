import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { showGRSA, saveGRSA, fetchAdditionalCost, updateAdditionalCost, fetchPenalty, createPenalty, fetchPenaltyAdditionalCost, createPenaltyAdditionalCost } from '../../../store/actions/invoice/grsaActions';
import { showUserVendorDetail } from '../../../store/actions/tendering/praQualificationActions';
// import { fetchAccAssignmentCategory } from '../../../store/actions/master/accAssignmentCategoryActions';
// import { fetchAssets } from '../../../store/actions/master/assetsActions';
// import { fetchCostCenter } from '../../../store/actions/master/costCenterActions';
// import { fetchWbsProject } from '../../../store/actions/master/wbsProjectActions';
// import { fetchGlAccount } from '../../../store/actions/master/glAccountActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import AdditionalCost from './detail/AdditionalCost';
import Detail from './detail/Detail';
import Penalty from './detail/Penalty';
import Preview from '../../../components/modal/preview/Preview';
import PenaltyAddCost from './detail/PenaltyAddCost';
import { replaceAll } from '../../../helpers/formatNumber';

export class GRDetail extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this._cursor = '';
        this.state = {
            isReport: this.props.location.pathname.split("/")[2] === 'report' ? true : false,
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			// status_detail: this.props.location.state.status_detail,
            data: [],
            data_penalty: [],
            delete_penalty: [],
            data_user_vendor: [],
            param_modal: [],
            data_header: [],
            param_penalty: {
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            param_penalty_add_cost: {
                goods_receipt_add_cost_id: '',
                conditional_type: '',
                vendor_id: '',
                vendor_name: '',
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            data_option: {
                m_penalty_type: [
                    {
                        value: 'potongan_mutu',
                        label: 'Potongan Mutu',
                    },
                    {
                        value: 'denda_keterlambatan',
                        label: 'Denda Keterlambatan',
                    },
                ],
                m_jenis_pembebanan: [
                    {
                        value: 'inventory',
                        label: 'Inventory',
                    },
                    {
                        value: 'non_inventory',
                        label: 'Non Inventory',
                    },
                ],
                m_acc_assgn_category: [],
                m_gl_account: [],
                m_asset: [],
                m_cost_center: [],
                m_wbs_element: [],
                m_add_cost: [],
            },
            loadings: {
                loadingModal: false,
                acc_assgn_category: true,
                gl_account_id: true,
                asset_id: true,
                cost_center_id: true,
                wbe_element_id: true,
                loading_input_penalty: false,
                loading_list_penalty: false,
            },
            select_params: {
                start: 0,
                length: 10,
            },
            loading: true,
            errors: [],
            isError: false, 
            isConfirm: false,
            loadingSubmit: false,
            modalType:'',
            uuid:'',
            title:'',
            preview: {
                modalOpen: false,
                title: '',
                src: '',
                loading: false,
            },
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this._isMounted) {
            this.getUUID()
            // if (this.state.role_vendor) {
            //     this.getUserVendor()
            // }
            // else {
            //     this.getUUID()
            //     this.fetchIncoterms()
            //     this.fetchTemplateReminder()
            // }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleClose = () => {
        this.setState(({ param_penalty, param_penalty_add_cost }) => ({
            param_penalty: { ...param_penalty,
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            param_penalty_add_cost: {
                ...param_penalty_add_cost,
                goods_receipt_add_cost_id: '',
                conditional_type: '',
                vendor_id: '',
                vendor_name: '',
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            modalOpen:false, modalType:'', isError: false, errors: [], status_submit: false, delete_penalty: []
        }));
        this.setState({ modalOpen:false, modalType:'', isError: false, errors: [], status_submit: false, delete_penalty: [] });
	}

    toggleDelete = (e, value, code) => {
        e.preventDefault();

        let title = ''
        switch (code) {
            case 'penalty':
                title = 'Delete Penalty, ' + this.props.t("common:delete.title-delete")
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code, title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'penalty':
                this.deletePenalty(this.state.uuid)
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
                .showGRSA(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    datas.total_amount_item = 0;
                    datas.total_additional_cost = 0;
                    datas.total_penalty = 0;
                    datas.items.map((dt, i) => {
                        datas.total_amount_item += parseFloat(dt.amount_value)
                        datas.total_additional_cost += parseFloat(dt.add_cost)
                        datas.total_penalty += parseFloat(dt.penalty)
                        return true
                    })
                    datas.total_amount_item = parseFloat(datas.total_amount_item).toFixed(2)
                    datas.total_additional_cost = parseFloat(datas.total_additional_cost).toFixed(2)
                    datas.total_penalty = parseFloat(datas.total_penalty).toFixed(2)
                    datas.total_akhir = (parseFloat(datas.total_amount_item) + parseFloat(datas.total_additional_cost) - parseFloat(datas.total_penalty)).toFixed(2);
                    this.setState({ loading: false, data: datas })
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
    
    // fetchAccAssignmentCategory = (newValue) => {
    //     this.setState(({ loadings }) => ({
    //         loadings: { ...loadings, acc_assgn_category: true },
    //     }));
    //     let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
    //     this.props.fetchAccAssignmentCategory(select_params)
    //         .then((resp) => {
    //             // console.log(resp)
    //             let data = resp.data.data;
    //             let options = data.map((data) => {
    //                 return { value: data.id, label: data.id + ' - ' + data.name};
    //             });
    //             this.setState(({ loadings, data_option }) => ({
    //                 loadings: { ...loadings, acc_assgn_category: false },
    //                 data_option: { ...data_option, m_acc_assgn_category: options },
    //             }));
    //         })
    //         .catch((resp) => {
    //             this.setState(({ loadings }) => ({
    //                 loadings: { ...loadings, acc_assgn_category: false },
    //             }));
    //             toastr.error(resp.data.message);;
    //         });
    // }
    
    // fetchAssets = (newValue) => {
    //     this.setState(({ loadings }) => ({
    //         loadings: { ...loadings, asset_id: true },
    //     }));
    //     let select_params = (newValue !== '') ?
    //         { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
    //         { start: 0, length: 10, company_id: this.props.user.company_id };
    //     this.props.fetchAssets(select_params)
    //         .then((resp) => {
    //             // console.log(resp)
    //             let data = resp.data.data;
    //             let options = data.map((data) => {
    //                 return { value: data.id, label: data.id + ' - ' + data.description};
    //             });
    //             this.setState(({ loadings, data_option }) => ({
    //                 loadings: { ...loadings, asset_id: false },
    //                 data_option: { ...data_option, m_asset: options },
    //             }));
    //         })
    //         .catch((resp) => {
    //             this.setState(({ loadings }) => ({
    //                 loadings: { ...loadings, asset_id: false },
    //             }));
    //             toastr.error(resp.data.message);;
    //         });
    // };

    // fetchCostCenter = (newValue) => {
    //     this.setState(({ loadings }) => ({
    //         loadings: { ...loadings, cost_center_id: true },
    //     }));
    //     let select_params = (newValue !== '') ?
    //         { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
    //         { start: 0, length: 10, company_id: this.props.user.company_id };
    //     this.props.fetchCostCenter(select_params)
    //         .then((resp) => {
    //             // console.log(resp)
    //             let data = resp.data.data;
    //             let options = data.map((data) => {
    //                 return { value: data.id, label: data.id + ' - ' + data.name};
    //             });
    //             this.setState(({ loadings, data_option }) => ({
    //                 loadings: { ...loadings, cost_center_id: false },
    //                 data_option: { ...data_option, m_cost_center: options },
    //             }));
    //         })
    //         .catch((resp) => {
    //             this.setState(({ loadings }) => ({
    //                 loadings: { ...loadings, cost_center_id: false },
    //             }));
    //             toastr.error(resp.data.message);;
    //         });
    // };

    // fetchWbsProject = (newValue) => {
    //     this.setState(({ loadings }) => ({
    //         loadings: { ...loadings, wbs_element_id: true },
    //     }));
    //     let select_params = (newValue !== '') ?
    //         { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
    //         { start: 0, length: 10, company_id: this.props.user.company_id };
    //     this.props.fetchWbsProject(select_params)
    //         .then((resp) => {
    //             // console.log(resp)
    //             let data = resp.data.data;
    //             let options = data.map((data) => {
    //                 return { value: data.id, label: data.id + ' - ' + data.description};
    //             });
    //             this.setState(({ loadings, data_option }) => ({
    //                 loadings: { ...loadings, wbs_element_id: false },
    //                 data_option: { ...data_option, m_wbs_element: options },
    //             }));
    //         })
    //         .catch((resp) => {
    //             this.setState(({ loadings }) => ({
    //                 loadings: { ...loadings, wbs_element_id: false },
    //             }));
    //             toastr.error(resp.data.message);;
    //         });
    // };

    // fetchGlAccount = (newValue) => {
    //     this.setState(({ loadings }) => ({
    //         loadings: { ...loadings, gl_account_id: true },
    //     }));
    //     let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
    //     this.props.fetchGlAccount(select_params)
    //         .then((resp) => {
    //             // console.log(resp)
    //             let data = resp.data.data;
    //             let options = data.map((data) => {
    //                 return { value: data.id, label: data.id + ' - ' + data.name};
    //             });
    //             this.setState(({ loadings, data_option }) => ({
    //                 loadings: { ...loadings, gl_account_id: false },
    //                 data_option: { ...data_option, m_gl_account: options },
    //             }));
    //         })
    //         .catch((resp) => {
    //             this.setState(({ loadings }) => ({
    //                 loadings: { ...loadings, gl_account_id: false },
    //             }));
    //             toastr.error(resp.data.message);;
    //         });
    // };

    saveGRSA = (payload) => {
        this.props.saveGRSA({ goods_receipt_id: this.state.data.id, status: payload.status })
            .then((resp) => {
                toastr.success(resp.data.message);
                this.props.history.push('/invoice/goods-receipt')
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    updateAdditionalCost = (payload) => {
        this.setState({ status_submit: false })
        let param = {
            id: [],
            amount_confirm: [],
            note: [],
        }

        for (let index = 0; index < payload.id.length; index++) {
            param.id.push(payload.id[index])
            let amount_confirm = this.formatValue(payload.add_cost_net_value[index])
            if (amount_confirm === '') {
                this.setState({ status_submit: true })
                return
            }
            param.amount_confirm.push(parseFloat(amount_confirm))
            param.note.push(payload.note[index])
        }

        this.props.updateAdditionalCost(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
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

    addPenalty = (payload) => {
        let param = {
            goods_receipt_item_id: this.state.data_header.id,
            penalty_type: payload.penalty_type.label,
            amount: this.formatValue(payload.amount),
            currency: this.state.data_header.currency,
            description: payload.description,
            file: payload.file_name,
            jenis_pembebanan: payload.jenis_pembebanan,
            gl_account: payload.gl_account,
            acc_assigment_category_id: null,
            acc_assigment_category_number: null,
        }
        let data_penalty = this.state.data_penalty
        data_penalty.push(param)
            
        // this.setState({ data_penalty: data_penalty })
        this.setState(({ param_penalty, loadings }) => ({
            param_penalty: { ...param_penalty,
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            data_penalty: data_penalty,
            loadings: { ...loadings, loading_input_penalty: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_input_penalty: false },
                }))
            }, 200)
        });
    }

    addPenaltyAddCost = (payload) => {
        let param = {
            goods_receipt_add_cost_id: payload.add_cost.value,
            conditional_type: payload.add_cost.conditional_type,
            conditional_type_description: payload.add_cost.conditional_type_description,
            vendor_id: payload.add_cost.vendor_id,
            vendor_name: payload.add_cost.vendor_name,
            penalty_type: payload.penalty_type.label,
            amount: this.formatValue(payload.amount),
            currency: payload.currency,
            description: payload.description,
            file: payload.file_name,
            jenis_pembebanan: payload.jenis_pembebanan,
            gl_account: payload.gl_account,
            acc_assigment_category_id: null,
            acc_assigment_category_number: null,
        }
        let data_penalty = this.state.data_penalty
        data_penalty.push(param)
            
        // this.setState({ data_penalty: data_penalty })
        this.setState(({ param_penalty_add_cost, loadings }) => ({
            param_penalty_add_cost: { ...param_penalty_add_cost,
                goods_receipt_add_cost_id: '',
                conditional_type: '',
                conditional_type_description: '',
                vendor_id: '',
                vendor_name: '',
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: '',
                jenis_pembebanan: '',
                jenis_pembebanan_param: [],
                gl_account: '',
                gl_account_id: '',
                account_assignment_category: '',
                account_assignment_category_param: [],
                acc_assignment_category_id: '',
                acc_assignment_category_name: '',
                acc_assignment_category_number: '',
            },
            data_penalty: data_penalty,
            loadings: { ...loadings, loading_input_penalty: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_input_penalty: false },
                }))
            }, 200)
        });
    }

    deletePenalty = (key) => {
        let data_penalty = this.state.data_penalty
        let delete_penalty = this.state.delete_penalty

        if (data_penalty[key].id !== undefined) {
            delete_penalty.push(data_penalty[key].id)

        }
        delete data_penalty[key];

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true },
            delete_penalty: delete_penalty,
            isConfirm: false,
        }), () => {
            let new_data = []
            data_penalty.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loading_list_penalty: false },
                    data_penalty: new_data,
                }))
            }, 200)
        })
    }

    createPenalty = (payload) => {
        this.setState({ status_submit: false })

        let param = {
            param_add: [],
            param_delete: this.state.delete_penalty,
        }

        let data_penalty = this.state.data_penalty
        data_penalty.map((dt, i) => {
            if (dt.id === undefined) {
                param.param_add.push(dt)
            }
            return true
        })

        console.log(param)
        // return

        this.props.createPenalty(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
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

    createPenaltyAdditionalCost = (payload) => {
        this.setState({ status_submit: false })

        let param = {
            param_add: [],
            param_delete: this.state.delete_penalty,
        }

        let data_penalty = this.state.data_penalty
        data_penalty.map((dt, i) => {
            if (dt.id === undefined) {
                param.param_add.push(dt)
            }
            return true
        })

        // console.log(param)
        // return

        this.props.createPenaltyAdditionalCost(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
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

    modalConfirm = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
            modalType:'confirm',
            param_modal: payload,
        }));
    }

    modalAdditionalCost = (e, payload) => {
		// e.preventDefault();
        payload.vendor_id = this.state.data.vendor_id
        payload.vendor_name = this.state.data.vendor_name
        payload.vendor_sap_code = this.state.data.vendor_sap_code
        payload.reference = this.state.data.reference
        // console.log(payload)
        // return
        this.props.fetchAdditionalCost({goods_receipt_item_id: payload.id})
            .then((resp) => {
                let datas = resp.data.data;
                // console.log(datas)
                // return
                this.setState({
                    modalOpen:true,
                    delete_penalty: [],
                    data_header: payload,
                    param_modal: datas,
                    modalType:'additional-cost',
                });
                // this.setState({ loading: false, data: datas })
            })
            .catch((resp) => {
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                }
            });
	}

    modalPenalty = (e, payload) => {
        payload.vendor_id = this.state.data.vendor_id
        payload.vendor_name = this.state.data.vendor_name
        payload.vendor_sap_code = this.state.data.vendor_sap_code
        payload.reference = this.state.data.reference

        this.props.fetchPenalty({goods_receipt_item_id: payload.id})
            .then((resp) => {
                let datas = resp.data.data;
                // console.log(datas)
                // return
                this.setState({
                    modalOpen:true,
                    data_header: payload,
                    param_modal: datas,
                    data_penalty: datas,
                    modalType:'penalty',
                });
                // this.setState({ loading: false, data: datas })
            })
            .catch((resp) => {
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                }
            });

        // e.preventDefault();
        // console.log(payload)
	}

    modalPenaltyAdditionalCost = (e, payload) => {
        this.fetchAdditionalCost(payload)
    }

    fetchAdditionalCost = (payload) => {
		// e.preventDefault();
        payload.vendor_id = this.state.data.vendor_id
        payload.vendor_name = this.state.data.vendor_name
        payload.vendor_sap_code = this.state.data.vendor_sap_code
        payload.reference = this.state.data.reference
        
        this.props.fetchAdditionalCost({goods_receipt_item_id: payload.id})
            .then((resp) => {
                let datas = resp.data.data;
                console.log(datas)
                let options = []
                let arr_id = []
                datas.forEach(element => {
                    arr_id.push(element.id)
                    options.push(
                        {
                            id: element.id,
                            conditional_type: element.conditional_type,
                            conditional_type_description: element.condition_type_description,
                            vendor_id: element.vendor_id,
                            vendor_name: element.vendor_name,
                            // conditional_type_desc: element.condition_type_description,
                            value: element.id,
                            label: element.conditional_type + ' - ' + element.vendor_id,
                            currency: element.currency,
                        }
                    )
                });

                let param = {
                    // array_goods_receipt_add_cost_id: arr_id,
                    goods_receipt_add_cost_id: arr_id.length > 0 ? arr_id.join(';') : null,
                    // goods_receipt_add_cost_id: 833,
                }
                console.log(param)
                this.setState(({ data_option }) => ({
                    data_option: { ...data_option, m_add_cost: options },
                    data_header: payload,
                }), () => {
                    if (arr_id.length > 0) {
                        this.fetchPenaltyAdditionalCost(param)
                    }
                    else {
                        this.setState({
                            modalOpen: true,
                            // param_modal: datas,
                            data_penalty: [],
                            modalType: 'penalty-add-cost',
                        });
                    }
                });
            })
            .catch((resp) => {
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                }
            });
	}

    fetchPenaltyAdditionalCost = (payload) => {
        this.props.fetchPenaltyAdditionalCost(payload)
            .then((resp) => {
                let datas = resp.data.data;
                // console.log(datas)
                // return
                this.setState({
                    modalOpen: true,
                    // param_modal: datas,
                    data_penalty: datas,
                    modalType: 'penalty-add-cost',
                });
                // this.setState({ loading: false, data: datas })
            })
            .catch((resp) => {
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    // this.setState({ loading: false });
                    toastr.error(resp.data.message);;
                }
            });
    }

    setOptionAddCost = (payload, type, key) => {
        // console.log(payload)
        let param_modal = this.state.param_modal
        let new_value = ''
        switch(type) {
            case 'qty':
                new_value = this.formatValue(payload)
                param_modal[key].qty_confirm = new_value
                break;
            case 'amount':
                new_value = this.formatValue(payload)
                param_modal[key].amount_confirm = new_value
                break;
            case 'note':
                param_modal[key].note = payload
                break;
            default:
                break;
        }
        this.setState({ param_modal: param_modal })
    }

    setOptionPenalty = (payload, type) => {
        // console.log(payload)
        let param_penalty = this.state.param_penalty
        switch(type) {
            case 'amount':
                let new_value = this.formatValue(payload)
                param_penalty.amount = new_value
                break;
            default:
                break;
        }
        this.setState({ param_penalty: param_penalty })
    }

    renderSwitchBody(param) {
        switch(param) {
          case 'additional-cost':
            return <AdditionalCost
                        loadings={this.state.loadings}
                        isReport={this.state.isReport}
                        cursor={this._cursor}
						errors={this.state.errors}
                        parentState={this.state}
                        modalType={this.state.tipe_modal}
                        data_header={this.state.data_header}
                        data={this.state.param_modal}
                        setOption={this.setOptionAddCost}
                        save={this.updateAdditionalCost}
                        update={this.updateProgress}
                        toggleClose={this.toggleClose}
						/>;
          case 'penalty':
            return <Penalty
                        loadings={this.state.loadings}
                        isReport={this.state.isReport}
						errors={this.state.errors}
                        modalType={this.state.tipe_modal}
                        data_header={this.state.data_header}
                        param_modal={this.state.param_modal}
                        data_option={this.state.data_option}
                        param_penalty={this.state.param_penalty}
                        data={this.state.data_penalty}
                        data_additional_cost={this.state.data.items}
                        save={this.createPenalty}
                        upload={this.props.fileUpload}
                        toggleOpenPreview={this.toggleOpenPreview}
                        addPenalty={this.addPenalty}
                        setOption={this.setOptionPenalty}
                        fetchAccAssignmentCategory={this.fetchAccAssignmentCategory}
                        fetchAssets={this.fetchAssets}
                        fetchCostCenter={this.fetchCostCenter}
                        fetchWbsProject={this.fetchWbsProject}
                        fetchGlAccount={this.fetchGlAccount}
                        toggleDelete={this.toggleDelete}
                        toggleClose={this.toggleClose}
						/>;
          case 'penalty-add-cost':
            return <PenaltyAddCost
                        loadings={this.state.loadings}
                        isReport={this.state.isReport}
						errors={this.state.errors}
                        data_header={this.state.data_header}
                        data_option={this.state.data_option}
                        param_penalty={this.state.param_penalty}
                        data={this.state.data_penalty}
                        upload={this.props.fileUpload}
                        toggleOpenPreview={this.toggleOpenPreview}
                        addPenalty={this.addPenaltyAddCost}
                        save={this.createPenaltyAdditionalCost}
                        setOption={this.setOptionPenalty}
                        toggleDelete={this.toggleDelete}
                        toggleClose={this.toggleClose}
						/>;
          default:
            return ;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
            case 'additional-cost':
                return <ModalHeader toggle={() => this.toggleClose()}>Additional Cost</ModalHeader>;
            case 'penalty':
                return <ModalHeader toggle={() => this.toggleClose()}>Penalty</ModalHeader>;
              default:
                return ;
        }
    }

	toggleOpenPreview = (e, file, url) => {
		e.preventDefault()
		this.setState(({ preview }) => ({
			preview: { ...preview, title: file, src: url, loading: true, modalOpen: true },
		}), () => {
            setTimeout(() => {
                this.setState(({ preview }) => ({
                    preview: { ...preview, loading: false },
                }));
            }, 100)
        });
	}

	toggleClosePreview = () => {
		this.setState(({ preview }) => ({
			preview: { ...preview, title: '', src: '', modalOpen: false },
		}));
	}

    formatValue(payload) {
        let new_value = replaceAll(payload, '.', '')
        return replaceAll(new_value, ',', '.')
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
                    <Detail
                        data={this.state.data}
                        save={this.saveGRSA}
                        loadingSubmit={this.state.loadingSubmit}
                        modalAdditionalCost={this.modalAdditionalCost}
                        modalPenalty={this.modalPenalty}
                        modalPenaltyAdditionalCost={this.modalPenaltyAdditionalCost}
                        isReport={this.state.isReport}
                    />
                }
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
				{!this.state.preview.loading &&
                    <Preview
                        open={this.state.preview.modalOpen}
                        title={this.state.preview.title}
                        src={this.state.preview.src}
                        loading={this.state.preview.loading}
                        toggle={this.toggleClosePreview}
                    />
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
        showGRSA: (id) => dispatch(showGRSA(id)),
		saveGRSA: (payload) => dispatch(saveGRSA(payload)),
        fetchAdditionalCost: (params) => dispatch(fetchAdditionalCost(params)),
		updateAdditionalCost: (payload) => dispatch(updateAdditionalCost(payload)),
        fetchPenalty: (params) => dispatch(fetchPenalty(params)),
		createPenalty: (payload) => dispatch(createPenalty(payload)),
        showUserVendorDetail: (id) => dispatch(showUserVendorDetail(id)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        fetchPenaltyAdditionalCost: (params) => dispatch(fetchPenaltyAdditionalCost(params)),
        createPenaltyAdditionalCost: (params) => dispatch(createPenaltyAdditionalCost(params)),
        // fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
        // fetchAssets: (params) => dispatch(fetchAssets(params)),
        // fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
        // fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
        // fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(GRDetail));

