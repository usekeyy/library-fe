import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { fetchEprocGRSA, saveEprocGRSA } from '../../../store/actions/invoice/grsaActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import AdditionalCost from './detail-eproc/AdditionalCost';
import Detail from './detail-eproc/Detail';
import Penalty from './detail-eproc/Penalty';
import Preview from '../../../components/modal/preview/Preview';
import PenaltyAddCost from './detail-eproc/PenaltyAddCost';
import { replaceAll } from '../../../helpers/formatNumber';

export class GREprocDetail extends Component {
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
            checklist: {
                isCheckAll: false,
                items: [],
                items_selected: [],
            },
            param_penalty: {
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: null,
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
                file: null,
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
                item: false,
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
            color_confirm: 'danger',
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
            this.setState({ loading: false })
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
                file: null,
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
                file: null,
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

    toggleConfirm = (e, value, code) => {
        if (code === 'penalty') {
            e.preventDefault();
        }

        let title = ''
        let color_confirm = 'danger'
        switch (code) {
            case 'penalty':
                title = 'Delete Penalty, ' + this.props.t("common:delete.title-delete")
                break;
            case 'penalty-add-cost':
                title = 'Delete Penalty Add. Cost, ' + this.props.t("common:delete.title-delete")
                break;
            case 'save':
                title = this.props.t("common:delete.title-delete")
                color_confirm = 'success'
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code, title: title, color_confirm: color_confirm })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'penalty':
                this.deletePenalty(this.state.uuid)
                break;
            case 'penalty-add-cost':
                this.deletePenaltyAddCost(this.state.uuid)
                break;
            case 'save':
                this.saveEprocGRSA(this.state.param_modal)
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
        return true
    }

    fetchEprocGRSA = (payload) => {
        this.props.fetchEprocGRSA({po_sap_number: payload.po_sap_number})
            .then((resp) => {
                let datas = resp.data.data;
                if (datas.items.length > 0) {
                    datas.items.forEach(items => {
                        items.total_penalty = 0
                        items.total_add_cost = 0
                        items.penalty = []
                        if (items.jenis_item === "barang") {
                            items.add_cost.forEach(add_cost => {
                                add_cost.note = ''
                                add_cost.amount_confirm = parseFloat(add_cost.amount) * parseFloat(add_cost.qty)
                                items.total_add_cost += parseFloat(add_cost.amount_confirm)
                                add_cost.add_cost_penalty = []
                            });
                        }
                        else {
                            items.service_line.forEach(service_line => {
                                service_line.amount_confirm = parseFloat(service_line.total)
                            });
                        }
                    });
                    this.setState(({ checklist }) => ({
                        checklist: { ...checklist, items: [], items_selected: [], isCheckAll: false },
                        loading: false, data: datas
                    }));
                }
                else {
                    this.setState(({ checklist }) => ({
                        checklist: { ...checklist, items: [], items_selected: [], isCheckAll: false },
                        loading: false, data: []
                    }), () => {
                        toastr.error("PO has no Items left");
                    });
                }
            })
            .catch((error) => {
                this.setState(({ checklist }) => ({
                    checklist: { ...checklist, items: [], items_selected: [], isCheckAll: false },
                    loading: false, data: []
                }));
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    console.log("oi")
                }
                else {
                    console.log("tes")
                    this.setState({ loading: false });
                    toastr.error(error.data.message);;
                }
            });
    }

    validateSubmit = (payload) => {
		let status = false
        if (payload.delivery_note === undefined || payload.delivery_note === null || payload.delivery_note === '') {
            toastr.error('Mohon lengkapi data Delivery Note')
            status = true
        }
        if (payload.document_date === undefined || payload.document_date === null || payload.document_date === '') {
            toastr.error('Mohon lengkapi data Doc. Date')
            status = true
        }
        if (payload.posting_date === undefined || payload.posting_date === null || payload.posting_date === '') {
            toastr.error('Mohon lengkapi data Posting Date')
            status = true
        }
        if (this.state.checklist.items.length === 0) {
            toastr.error('Mohon checklist minimal satu Item')
            status = true
        }

        if (status) {
			return
		}

        this.setState({ param_modal: payload, loadingSubmit: true }, () => {
            this.toggleConfirm('', '', 'save')
        })
    }

    saveEprocGRSA = (payload) => {
        let data = this.state.data
        data.po_id = data.id
        data.po_number = data.sap_number
        data.year = new Date().getFullYear()
        data.purchasing_org_id = data.purc_org_id
        data.purchasing_group_id = data.purc_group_id
        data.trans_type = data.items[0].jenis_item === "barang" ? "1" : "9"
        data.doc_date = payload.document_date
        data.post_date = payload.posting_date
        data.reference = payload.delivery_note
        data.purchasing_org_id = data.purc_org_id
        data.purchasing_group_id = data.purc_group_id
        // data.batch = null
        // data.bill_of_landing = null
        // data.service_score = null
        // data.k3_score = null
        // data.lh_score = null    
        data.items = this.state.checklist.items
        data.items.forEach(items => {
            // hardcode
            items.movement_type = '101'
            items.recipient = null
            items.sloc = null
            items.dci = null
            items.debit_credit = 'S'
            // ----
            items.plant = items.plant_id
            items.material_no = items.material_id
            if (items.jenis_item === "barang") {
                items.unit_price = items.harga_satuan
                items.amount_value = parseFloat(items.amount)
                items.add_cost.forEach(add_cost => {
                    add_cost.conditional_type = add_cost.condition_type_id
                    add_cost.currency = items.currency
                    add_cost.amount = add_cost.amount_confirm
                    add_cost.uom = add_cost.uom_code
                });
            }
            else {
                let total = 0
                items.add_cost = []
                items.service_line.forEach(service_line => {

                    service_line.po_item_no = service_line.po_item_line_no
                    // hardcode
                    service_line.movement_type = '101'
                    service_line.recipient = null
                    service_line.sloc = null
                    service_line.dci = null
                    service_line.debit_credit = 'S'
                    // ----
                    service_line.plant = items.plant_id
                    service_line.unit_price = service_line.harga_satuan
                    service_line.amount_value = service_line.total
                    service_line.short_text = service_line.description
                    service_line.material_no = items.material_id
                    total += parseFloat(service_line.total)
                });
                items.unit_price = items.harga_satuan
                items.amount_value = total
            }
        });

        // console.log(this.state.data)
        // console.log(payload)
        // return
        this.setState({ isConfirm: false })
        this.props.saveEprocGRSA(data)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({loadingSubmit: false}, () => {
                    this.props.history.push('/invoice/report/goods-receipt')
                })
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

	handleCheckAll = (e, isCheckAll) => {
        const items = this.state.data.items
		this.setState(({ checklist }) => ({
			checklist: { ...checklist, items: [], items_selected: []}
		}));
		let arr_selected = this.state.checklist.items_selected;
		if(!isCheckAll){
			if(items.length > 0){
				items.map(item => {
                    if (!arr_selected.includes(item.po_item_id))
                    {
                        arr_selected.push(item.po_item_id)
                    }
					return true
				})
			}
			this.setState(({ checklist }) => ({
				checklist: { ...checklist, items: items.sort((a,b) => a.po_item_no-b.po_item_no), items_selected: arr_selected, isCheckAll: true}
			}));
		} else {
			this.setState(({ checklist }) => ({
				checklist: { ...checklist, items: [], items_selected: [], isCheckAll: false}
			}));
		}
	}

	handleChecklist = (e, payload, id) => {
		let arr = this.state.checklist.items;
		let arr_selected = this.state.checklist.items_selected;
		let arrTemp = []
		let arrTempSelected = []

		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.po_item_id !== id) {
					arrTemp.push(element)
					arrTempSelected.push(element.po_item_id)
				} 
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
			if (arr_selected.includes(id)){
				// return
				arr.forEach((item, key) => {
					if (item.po_item_id === id) {
						const index = arr.indexOf(key);
						arr.splice(index, 1)
						arr_selected.splice(index, 1)
					}
				});
			} else {
				// return
				arr.push(payload);
				arr_selected.push(id)
			}
		}

        this.setState(({ checklist }) => ({
			checklist: { ...checklist, items: arr.sort((a,b) => a.po_item_id-b.po_item_id), items_selected: arr_selected},
			// status_processing: status_processing
		}), () => { 
			setTimeout(() => {
				this.setState(({ checklist }) => ({ 
					checklist: { ...checklist, items: arr.sort((a,b) => a.po_item_id-b.po_item_id), items_selected: arr_selected},
					// status_processing: status_processing
				}));
			}, 10)
		});
	}

    addPenalty = (payload) => {
        let data = this.state.data
        let index = data.items.findIndex(d => d.po_item_id === this.state.data_header.po_item_id)

        let amount = this.formatValue(payload.amount)
        data.items[index].total_penalty = parseFloat(data.items[index].total_penalty) + parseFloat(amount)
        let param = {
            // goods_receipt_item_id: this.state.data_header.id,
            penalty_type: payload.penalty_type.label,
            amount: this.formatValue(payload.amount),
            currency: this.state.data_header.currency,
            debit_credit: 'S',
            description: payload.description,
            file: payload.file_name,
            jenis_pembebanan: payload.jenis_pembebanan,
            gl_account: payload.gl_account,
            acc_assignment_category_id: null,
            acc_assignment_category_number: null,
        }
        let data_penalty = this.state.data_penalty
        data_penalty.push(param)
            
        // this.setState({ data_penalty: data_penalty })
        this.setState(({ param_penalty, loadings }) => ({
            data: data,
            param_penalty: { ...param_penalty,
                penalty_type: '',
                penalty_type_param: [],
                amount: '0.00',
                currency: '',
                deskripsi: '',
                file: null,
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
                    data: data,
                }))
            }, 200)
        });
    }

    addPenaltyAddCost = (payload) => {
        let data = this.state.data
        let index = data.items.findIndex(d => d.po_item_id === this.state.data_header.po_item_id)
        let index_add_cost = data.items[index].add_cost.findIndex(d => d.id === payload.add_cost.id)

        let amount = this.formatValue(payload.amount)
        data.items[index].total_penalty = parseFloat(data.items[index].total_penalty) + parseFloat(amount)
        let param = {
            add_cost_id: payload.add_cost.id,
            goods_receipt_add_cost_id: payload.add_cost.value,
            conditional_type: payload.add_cost.conditional_type,
            conditional_type_description: payload.add_cost.conditional_type_description,
            vendor_id: payload.add_cost.vendor_id,
            vendor_name: payload.add_cost.vendor_name,
            penalty_type: payload.penalty_type.label,
            amount: this.formatValue(payload.amount),
            currency: payload.currency,
            debit_credit: 'S',
            description: payload.description,
            file: payload.file_name,
            jenis_pembebanan: payload.jenis_pembebanan,
            gl_account: payload.gl_account,
            acc_assignment_category_id: null,
            acc_assignment_category_number: null,
        }
        let data_penalty = this.state.data_penalty
        data_penalty.push(param)
        data.items[index].add_cost[index_add_cost].add_cost_penalty.push(param)

        this.setState(({ param_penalty_add_cost, loadings }) => ({
            data: data,
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
                file: null,
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
                    data: data,
                }))
            }, 200)
        });
    }

    deletePenalty = (key) => {
        let data = this.state.data
        let index = data.items.findIndex(d => d.po_item_id === this.state.data_header.po_item_id)
        let data_penalty = this.state.data_penalty
        
        data.items[index].total_penalty = parseFloat(data.items[index].total_penalty) - parseFloat(data_penalty[key].amount)
        delete data_penalty[key];

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true },
            data: data,
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
                    data: data,
                }))
            }, 200)
        })
    }

    deletePenaltyAddCost = (key) => {
        let data = this.state.data
        let data_penalty = this.state.data_penalty
        let index = data.items.findIndex(d => d.po_item_id === this.state.data_header.po_item_id)
        let index_add_cost = data.items[index].add_cost.findIndex(d => d.id === data_penalty[key].add_cost_id)

        data.items[index].total_penalty = parseFloat(data.items[index].total_penalty) - parseFloat(data_penalty[key].amount)
        delete data.items[index].add_cost[index_add_cost].add_cost_penalty[key];
        delete data_penalty[key];
        
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true },
            data: data,
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
                    data: data,
                }))
            }, 200)
        })
    }

    modalAdditionalCost = (e, payload) => {
        e.preventDefault()
        payload.reference = ''
        payload.po_sap_number = this.state.data.po_sap_number

        this.setState({
            modalOpen:true,
            delete_penalty: [],
            data_header: payload,
            param_modal: payload.add_cost,
            modalType:'additional-cost',
        });
	}

    modalPenalty = (e, payload) => {
        e.preventDefault()
        payload.reference = ''
        payload.po_sap_number = this.state.data.po_sap_number

        this.setState({
            modalOpen:true,
            data_header: payload,
            param_modal: payload,
            data_penalty: payload.penalty,
            modalType:'penalty',
        });
	}

    modalPenaltyAdditionalCost = (e, payload) => {
        e.preventDefault()
        payload.reference = ''
        payload.po_sap_number = this.state.data.po_sap_number
        let data_penalty = []
        let options = []
        payload.add_cost.forEach(add_cost => {
            options.push(
                {
                    id: add_cost.id,
                    conditional_type: add_cost.condition_type_id,
                    conditional_type_description: add_cost.condition_type_description,
                    vendor_id: add_cost.vendor_id,
                    vendor_name: add_cost.vendor_name,
                    // conditional_type_desc: add_cost.condition_type_description,
                    value: add_cost.id,
                    label: add_cost.condition_type_id + ' - ' + add_cost.vendor_id,
                    currency: add_cost.currency,
                }
            )
            add_cost.add_cost_penalty.forEach(penalty => {
                data_penalty.push(penalty)                
            });
        });

        this.setState(({ data_option }) => ({
            data_option: { ...data_option, m_add_cost: options },
            modalOpen:true,
            data_header: payload,
            param_modal: payload,
            data_penalty: data_penalty,
            modalType:'penalty-add-cost',
        }))
    }

	setOptionItem = async (payload, code, key) => {
        let data = this.state.data
        let new_value = 0
        switch(code) {
            case 'qty':
                new_value = this.formatValue(payload)
                data.items[key].qty = new_value
                let total = 0
                data.items[key].add_cost.forEach(add_cost => {
                    add_cost.qty = new_value
                    add_cost.amount_confirm = parseFloat(add_cost.qty) * parseFloat(add_cost.amount)
                    total += add_cost.amount_confirm
                });
                data.items[key].total_add_cost = total
                break;
            default:
                break;
        }
        this.setState({ data: data }, () => {
            this.setState({ data: data })
        })
    }

    setOptionAddCost = (payload, type, key) => {
        // console.log(payload)
        let param_modal = this.state.param_modal
        let new_value = ''
        let data = this.state.data
        let index = data.items.findIndex(d => d.po_item_id === this.state.data_header.po_item_id)
        switch(type) {
            case 'amount':
                new_value = this.formatValue(payload)
                param_modal[key].amount_confirm = new_value
                data.items[index].add_cost[key].amount_confirm = new_value
                let total_add_cost = 0
                data.items[index].add_cost.forEach(add_cost => {
                    total_add_cost += parseFloat(add_cost.amount_confirm)                    
                });
                data.items[index].total_add_cost = total_add_cost
                break;
            case 'note':
                param_modal[key].note = payload
                data.items[index].add_cost[key].note = new_value
                break;
            default:
                break;
        }
        this.setState({ param_modal: param_modal, data: data })
    }

	setOptionServiceLine = async (payload, code, key_s, key_i) => {
        let data = this.state.data
        let new_value = 0
        switch(code) {
            case 'qty':
                new_value = this.formatValue(payload)
                data.items[key_i].service_line[key_s].qty = new_value
                data.items[key_i].service_line[key_s].total = parseFloat(new_value) * data.items[key_i].service_line[key_s].harga_satuan
                break;
            default:
                break;
        }
        this.setState({ data: data }, () => {
            this.setState({ data: data })
        })
    }

    setOptionPenalty = (payload, type) => {
        // console.log(payload)
        let param_penalty = this.state.param_penalty
        switch(type) {
            case 'amount':
                let new_value = this.formatValue(payload)
                param_penalty.amount = new_value
                break;
            case 'file':
                param_penalty.file = payload
                break;
            default:
                break;
        }
        this.setState({ param_penalty: param_penalty })
    }

    setOptionPenaltyAddCost = (payload, type) => {
        // console.log(payload)
        let param_penalty_add_cost = this.state.param_penalty_add_cost
        switch(type) {
            case 'amount':
                let new_value = this.formatValue(payload)
                param_penalty_add_cost.amount = new_value
                break;
            case 'file':
                param_penalty_add_cost.file = payload
                break;
            default:
                break;
        }
        this.setState({ param_penalty_add_cost: param_penalty_add_cost })
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
                        // save={this.updateAdditionalCost}
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
                        toggleConfirm={this.toggleConfirm}
                        toggleClose={this.toggleClose}
						/>;
          case 'penalty-add-cost':
            return <PenaltyAddCost
                        loadings={this.state.loadings}
                        isReport={this.state.isReport}
						errors={this.state.errors}
                        data_header={this.state.data_header}
                        data_option={this.state.data_option}
                        param_penalty={this.state.param_penalty_add_cost}
                        data={this.state.data_penalty}
                        upload={this.props.fileUpload}
                        toggleOpenPreview={this.toggleOpenPreview}
                        addPenalty={this.addPenaltyAddCost}
                        save={this.createPenaltyAdditionalCost}
                        setOption={this.setOptionPenaltyAddCost}
                        toggleConfirm={this.toggleConfirm}
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
                        save={this.validateSubmit}
                        loadings={this.state.loadings}
                        setOptionItem={this.setOptionItem}
                        setOptionServiceLine={this.setOptionServiceLine}
                        loadingSubmit={this.state.loadingSubmit}
                        modalAdditionalCost={this.modalAdditionalCost}
                        modalPenalty={this.modalPenalty}
                        modalPenaltyAdditionalCost={this.modalPenaltyAdditionalCost}
                        isReport={this.state.isReport}
                        fetchEprocGRSA={this.fetchEprocGRSA}
                        checklist={this.state.checklist}
                        handleChecklist={this.handleChecklist}
                        handleCheckAll={this.handleCheckAll}
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
                    confirmBtnBsStyle={this.state.color_confirm}
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
		saveEprocGRSA: (payload) => dispatch(saveEprocGRSA(payload)),
        fetchEprocGRSA: (params) => dispatch(fetchEprocGRSA(params)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(GREprocDetail));

