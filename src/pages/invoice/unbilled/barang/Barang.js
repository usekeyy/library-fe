import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
// import Unbilled from '../Unbilled';
import { fetchUnbilled, showUnbilled } from '../../../../store/actions/invoice/unbilledActions';
import { cetakInvoice, scanFakturPajak, saveInvoice, updateItemInvoice, showInvoice, draftInvoice } from '../../../../store/actions/invoice/invoiceActions';
import { fetchMultipleDetailPurchaseOrder } from '../../../../store/actions/tendering/PurchaseOrderActions';
import { fetchPenalty, fetchPenaltyAdditionalCost } from '../../../../store/actions/invoice/grsaActions';
import { fetchRekeningBank } from '../../../../store/actions/vendor/profile-vendor/rekeningBankActions';
import { fetchUsers } from '../../../../store/actions/utility/usersActions';
import { fileUpload } from '../../../../store/actions/uploadActions';
import List from './sub/List';
import Item from './sub/Item';
import Form from './../invoice/Form';
// import DetailOA from './sub/DetailOA';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import AdditionalCost from './detail/AdditionalCost';
import KonfirmasiCetak from '../../unbilled/invoice/KonfirmasiCetak';
import Preview from '../../../../components/modal/preview/Preview';
import {replaceAll} from '../../../../helpers/formatNumber';

class Barang extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.childList = React.createRef();
		this.childItem = React.createRef();
		this._data = []
		this.state = {
			data_list: [],
			data_invoice: {
				sendData: {
					determination_id: { value: "eproc", label: "E-Proc"},
					user_id: '',
					items: []
				},
				datas: [],
				items: [],
				items_selected: [],
				loading: true,
				loadingButton: false
			},
			errors: [],
			loadings: {
				button: false,
				buttonUpload: false,
				items: false,
				showItems: false,
				users: false,
				determination: false
			},
            select_params: {
                start: 0,
                length: 10,
            },
			loading: false,
			m_determination: [
				{ value: "eproc", label: "E-Proc" },
				{ value: "sap", label: "SAP" },
			],
			status_processing: false,
			m_users: [],
			modalOpen: false,
			modalType: '',
			modalData : {
				data_header: [],
				items: [],
			},
			data_header: [],
			param_modal: [],
			loadingModal: false,
			pathActive: props.location.name,
			uuid_temp: '',
            code_confirm:'',
            color_confirm:'danger',
            title:'',
            isConfirm: false,
			statusForm: false,
			data_lampiran_pendukung: [],
			param_invoice: {
				faktur_status: null,
				faktur_file: '',
				faktur_attachment: '',
				faktur_pajak_no: '',
				faktur_tanggal: '',
				number: '',
				invoice_date: '',
				invoice_file: '',
				invoice_attachment: '',
				bank: [],
				rekening_bank_id: '',
				ppn: [],
				with_ppn: 'n',
				faktur_pajak_attachment: '',
				status: '',
				purchasing_requisition_number: '',
				purchase_order_eproc_number: '',
				purchase_order_number: '',
				document_po_confirm: [],
				goods_receipt_number: '',
				goods_receipt_file: '',
				goods_receipt_attachment: '',
				amount: 0,
				amount_temp: 0,
				dpp_amount: 0,
				dpp_amount_temp: 0,
				total_add_cost: 0,
				total_add_cost_temp: 0,
				potongan: 0,
				potongan_temp: 0,
				ppn_amount: 0,
				ppn_amount_temp: 0,
				total: 0,
				total_temp: 0,
				note_vendor: '',
				save_draft: '',
				items: [],
				attachment: [],
				note: '',
			},
			param_lampiran_pendukung: {
				document_date: '',
				file: '',
				file_name: '',
				description: '',
			},
			param_option: {
				m_bank: [],
				m_ppn: [
					{
						value: 'y',
						label: 'Ya'
					},
					{
						value: 'n',
						label: 'Tidak'
					},
				],
			},
			loadings_invoice: {
				form: false,
				update_ppn: false,
				item: false,
				input_lampiran_pendukung: false,
				list_lampiran_pendukung: false,
				bank: false,
			},
			status_barang: false,
			statusLampiranVendor: false,
			status_ppn: false,
			status_input_faktur: false,
			format_djp: false,
			loadingSubmit: false,
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
		if(this._isMounted){
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	setLoading = (type) => {
		this.setState({ loading: type })
	}
	
	setListData = (data) => {
		this.setState({ data_list: data })
	}

	handleCheckAll = (isCheckAll) => {
		const {data_list} = this.state;
		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: [], items_selected: []}
		}));
		let arr_selected = this.state.data_invoice.items_selected;
		if(isCheckAll){
			if(data_list.length > 0){
				let po_sap_number = ''
				let company_id = ''
				let currency = ''
				let status = false
				data_list.forEach((element, i) => {
					if (i === 0) {
						po_sap_number = element.po_sap_number
						company_id = element.company_id
						currency = element.currency
					}
					if (po_sap_number !== element.po_sap_number) {
						toastr.error("Mohon pilih item dengan PO yang sama");
						status = true
						return
					}
					if (company_id !== element.company_id) {
						toastr.error("Mohon pilih item dengan Company yang sama");
						status = true
						return
					}
					if (currency !== element.currency) {
						toastr.error("Mohon pilih item dengan Currency yang sama");
						status = true
						return
					}
				});
				if (status) {
					return
				}
				data_list.map(item => {
					arr_selected.push(item.uuid)
					return true
				})
			}
			this.setState(({ data_invoice }) => ({
				data_invoice: { ...data_invoice, items: data_list.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.id-b.id), items_selected: arr_selected}
			}));
		} else {
			this.setState(({ data_invoice }) => ({
				data_invoice: { ...data_invoice, items: [], items_selected: []}
			}));
		}
	}

	handleChecklist = (e, payload, uuid) => {
		let arr = this.state.data_invoice.items;
		let arr_selected = this.state.data_invoice.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		let status = false

		if (arr.length > 0) {
			arr.forEach(element => {
				if (element.po_sap_number !== payload.po_sap_number) {
					toastr.error("Mohon pilih item dengan PO yang sama");
					status = true
					return
				}
				if (element.company_id !== payload.company_id) {
					toastr.error("Mohon pilih item dengan Company yang sama");
					status = true
					return
				}
				if (element.currency !== payload.currency) {
					toastr.error("Mohon pilih item dengan Currency yang sama");
					status = true
					return
				}
			});
		}
		if (status) {
			return
		}

		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.uuid!==uuid) {
					arrTemp.push(element)
					arrTempSelected.push(element.uuid)
				} 
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
			if (arr_selected.includes(uuid)){
				// return
				arr.forEach((item, key) => {
					if (item.uuid === uuid) {
						const index = arr.indexOf(key);
						arr.splice(index, 1)
						arr_selected.splice(index, 1)
					}
				});
			} else {
				// return
				arr.push(payload);
				arr_selected.push(uuid)
			}
		}

		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.id-b.id), items_selected: arr_selected},
			// status_processing: status_processing
		}), () => { 
			setTimeout(() => {
				this.setState(({ data_invoice }) => ({ 
					data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.id-b.id), items_selected: arr_selected},
					// status_processing: status_processing
				}));
			}, 10)
		});
	}

	setItems = (data) => {
		const arr = [];
		data.forEach((item, key) => {
			if(this.state.data_invoice.items_selected.includes(item.uuid)){
				arr.push(item)
			}
		})
		this.setState(({ loadings, data_invoice }) => ({ 
			data_invoice: { ...data_invoice, errors: [], datas: [], items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.id-b.id) },
			loadings: { ...loadings, buttonUpload: false, button: false, showItems: false } 
		}));
	}

	submitUnbilled = () => {
		if (this.state.data_invoice.items.length === 0) {
			toastr.error("Mohon pilih item GR / Add Cost terlebih dahulu")
			return
		}
		if (this.state.status_processing) {
			return
		}
		this.setState({ status_barang: false })
		let items = this.state.data_invoice.items
		let arr_gr = []
		let arr_penalty = []
		let arr_penalty_add_cost = []
		let new_items = []

		let param_invoice = this.state.param_invoice
		param_invoice.items = []
		param_invoice.penalty = []
		param_invoice.penalty_add_cost = []
		param_invoice.purchase_order_number = ''
		param_invoice.purchasing_requisition_number = ''
		param_invoice.goods_receipt_number = ''
		param_invoice.po_id = []
		param_invoice.arr_po_sap_number = []
		param_invoice.document_po_confirm = []
		param_invoice.currency = ''

		items.forEach(element => {
			element.service_line_id = null
			if (!param_invoice.arr_po_sap_number.includes(element.po_sap_number)) {
				param_invoice.arr_po_sap_number.push(element.po_sap_number)
				param_invoice.document_po_confirm.push({po_sap_number: element.po_sap_number, po_id: element.po_id, file: null, dir: "/invoice"})
			}
			if (!param_invoice.po_id.includes(element.po_id) && element.po_id !== null) {
				param_invoice.po_id.push(element.po_id)
			}
			if ((element.category).toLowerCase() === 'additional cost') {
				element.add_cost_id = element.id
				param_invoice.total_add_cost += parseFloat(element.amount)
				if (arr_gr.length === 0) {
					arr_gr.push(element.goods_receipt_number)
				}
				if (!arr_gr.includes(element.goods_receipt_number)) {
					arr_gr.push(element.goods_receipt_number)
				}
				if (!arr_penalty_add_cost.includes(element.id)) {
					arr_penalty_add_cost.push(element.id)
				}
			}
			else {
				if (!arr_penalty.includes(element.goods_receipt_item_id)) {
					arr_penalty.push(element.goods_receipt_item_id)
				}
				if (arr_gr.length === 0) {
					arr_gr.push(element.goods_receipt_number)
				}
				if (!arr_gr.includes(element.goods_receipt_number)) {
					arr_gr.push(element.goods_receipt_number)
				}
				element.add_cost_id = null
				param_invoice.amount += parseFloat(element.amount)
			}
			element.with_ppn_param = []
			element.with_ppn = 'n'
			element.qty_awal = element.qty
			new_items.push(element)
		});
		param_invoice.amount = parseFloat(param_invoice.amount).toFixed(2)
		param_invoice.total_add_cost = parseFloat(param_invoice.total_add_cost).toFixed(2)
		param_invoice.amount_temp = parseFloat(param_invoice.amount).toFixed(2)
		// param_invoice.dpp_amount = parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost)
		// param_invoice.dpp_amount_temp = param_invoice.dpp_amount
		param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost)).toFixed(2)
		param_invoice.total_temp = param_invoice.total

		param_invoice.goods_receipt_number = arr_gr.join(', ')
		// param_invoice.purchase_order_eproc_number = param_invoice.arr_po_sap_number.join(', ')
		param_invoice.purchase_order_number = param_invoice.arr_po_sap_number.join(', ')
		param_invoice.po_uuid = items[0].po_uuid
		param_invoice.items = new_items

		this.setState({param_invoice: param_invoice}, () => {
			if (arr_penalty.length > 0) {
				this.fetchPenalty(arr_penalty, arr_penalty_add_cost)
			}
			else {
				if (arr_penalty_add_cost.length > 0) {
					this.fetchPenaltyAdditionalCost(arr_penalty_add_cost)
				}
				else {
					this.getDataPO(param_invoice)
				}
			}
		})
	}

	fetchPenalty = (payload, payload2) => {
		let  param_invoice = this.state.param_invoice
		this.props.fetchPenalty({goods_receipt_item_id: payload.join(';'), status: 'd'})
			.then((resp) => {
				let data_penalty = resp.data.data
				let potongan = 0
				data_penalty.forEach(element => {
					potongan += parseFloat(element.amount)
				});
				param_invoice.potongan = (parseFloat(param_invoice.potongan) + parseFloat(potongan)).toFixed(2)
				param_invoice.penalty = data_penalty
				param_invoice.total = (parseFloat(param_invoice.total) - parseFloat(potongan)).toFixed(2)
				param_invoice.total_temp = param_invoice.total
				this.setState({param_invoice: param_invoice}, () => {
					if (payload2.length > 0) {
						this.fetchPenaltyAdditionalCost(payload2)
					}
					else {
						this.getDataPO(param_invoice)
					}
				})
				// this.setParamInvoice(param_invoice)
			})
			.catch((resp) => {
				console.log(resp)
				toastr.error('Get Data Penalty errror! ' + resp.data.message);
				return
			});
	}

	fetchPenaltyAdditionalCost = (payload) => {
		let  param_invoice = this.state.param_invoice
		this.props.fetchPenaltyAdditionalCost({goods_receipt_add_cost_id: payload.join(';'), status: 'd'})
			.then((resp) => {
				let data_penalty = resp.data.data
				let potongan = 0
				data_penalty.forEach(element => {
					potongan += parseFloat(element.amount)
				});
				param_invoice.potongan = (parseFloat(param_invoice.potongan) + parseFloat(potongan)).toFixed(2)
				param_invoice.penalty_add_cost = data_penalty
				param_invoice.total = (parseFloat(param_invoice.total) - parseFloat(potongan)).toFixed(2)
				param_invoice.total_temp = param_invoice.total
				this.getDataPO(param_invoice)
			})
			.catch((resp) => {
				console.log(resp)
				toastr.error('Get Data Penalty errror! ' + resp.data.message);
				return
			});
	}

	getDataPO = (payload) => {
		let arr_pr = []
		payload.purchasing_requisition_number = null
		if (payload.po_id.length === 0) {
			this.setParamInvoice(payload)
		}
		else {
			this.props.fetchMultipleDetailPurchaseOrder({po_id: payload.po_id})
				.then((resp) => {
					let data_po = resp.data.data
					data_po.forEach(element => {
						let index = payload.document_po_confirm.findIndex(d => d.po_sap_number === element.sap_number)
						if (element.document_po_confirm !== null) {
							payload.document_po_confirm[index].file = element.document_po_confirm.file
							payload.document_po_confirm[index].dir = "/tendering"
						}

						element.item.forEach(item => {
							if (!arr_pr.includes(item.purchasing_requisition_number)) {
								arr_pr.push(item.purchasing_requisition_number)
							}
						});
					});
					payload.purchasing_requisition_number = arr_pr.join(', ')
					if (payload.document_po_confirm.length > 0) {
						payload.document_po_confirm.sort((a,b) => a.po_sap_number - b.po_sap_number)
					}
					this.setParamInvoice(payload)
				})
				.catch((resp) => {
					console.log(resp)
					toastr.error('Get Data PO Error!' + resp.data.message);
					return
				});
		}
	}

	setParamInvoice = (payload) => {
		this.setState({ statusForm: true, param_invoice: payload }, () => {
			window.scrollTo(0, 0);
			this.fetchRekeningBank()
		})
	}

	toggleClose = () => {
		this.setState({ modalOpen: false })
		if (this.state.modalType === 'cetak') {
            this.props.history.push('/invoice/invoice-management')
		}
	}

	toggleCloseForm = () => {
		this.setState({ statusForm: false })
	}

    redirectDetail = (url) => {
		const win = window.open(url, "_blank")
		win.focus();
        // this.props.history.push(url)
    }

    toggleConfirm = (e, payload, code) => {
		// console.log(payload)
		// return
		let param_invoice = this.state.param_invoice
		let items = this.state.param_invoice.items
		let err_format_djp = false
		let err_lampiran_po = false
		let status = false
		if (payload.number === '') {
			toastr.error('Mohon lengkapi Nomor Invoice')
			status = true
		}
		if (payload.invoice_date === '') {
			toastr.error('Mohon lengkapi Tanggal Invoice')
			status = true
		}
		if (code === 'save-invoice') {
            if (payload.with_ppn.value === 'y') {
				if (payload.faktur_pajak_no === '') {
					toastr.error('Mohon lengkapi Nomor Faktur Pajak')
					status = true
				}
				if (payload.faktur_file === '') {
					toastr.error('Mohon upload Lampiran Faktur Pajak')
					status = true
				}
				if (payload.faktur_tanggal === '') {
					toastr.error('Mohon lengkapi Tanggal Faktur Pajak')
					status = true
				}
				if (!items.some(d => d.with_ppn === 'y')) {
					this.setState({ status_ppn: true })
					status = true
				}
			}
			else {
				if (items.some(d => d.with_ppn === 'y')) {
					this.setState({ status_ppn: true })
					status = true
				}
			}
			if (payload.faktur_pajak_no !== undefined && payload.faktur_pajak_no !== '' && payload.faktur_pajak_no !== null) {
				let str = payload.faktur_pajak_no.split("")
				str.forEach((element, i) => {
					if (i === 3 || i === 10) {
						if (element !== ".") {
							err_format_djp = true
						}
					}
					else if (i === 7) {
						if (element !== "-") {
							err_format_djp = true
						}
					}
					else {
						if (!element.match(/[0-9]/)) {
							err_format_djp = true
						}
					}
					
				});
			}
            if (param_invoice.document_po_confirm.length > 0) {
                param_invoice.document_po_confirm.forEach(element => {
                    if (element.file === null) {
                        status = true
                        err_lampiran_po = true
                    }
                });
            }
			if (err_format_djp) {
				toastr.error('Format Nomor Faktur Pajak belum sesuai')
				status = true
			}
			if (payload.invoice_file === undefined || payload.invoice_file === null || payload.invoice_file === '') {
				toastr.error('Mohon upload Lampiran Invoice')
				status = true
			}
            if (payload.rekening_bank_id === null || payload.rekening_bank_id === '') {
                toastr.error('Mohon pilih Bank')
                status = true
            }
			if (err_lampiran_po) {
				toastr.error('Lampiran Document PO Confirm tidak boleh kosong')
				status = true
			}
			if (payload.goods_receipt_file === undefined || payload.goods_receipt_file === null || payload.goods_receipt_file === '') {
				toastr.error('Mohon upload Lampiran GR/SA')
				status = true
			}
            if (payload.note_vendor === undefined || payload.note_vendor === null || payload.note_vendor === '') {
                toastr.error('Mohon lengkapi data Keterangan')
                status = true
            }
			this.setState({ status_ppn: false, status_input_faktur: false, format_djp: false })
			if (payload.note === null || payload.note === '') {
				toastr.error('Mohon isi Catatan')
				status = true
			}
		}
		if (status) {
			return
		}
		if (payload.faktur_status === '') {			
			payload.faktur_status = null
		}
		payload.document_po_confirm = param_invoice.document_po_confirm
		payload.rekening_bank_id = payload.rekening_bank_id?.value
		payload.with_ppn = payload.with_ppn?.value
		payload.attachment = this.state.data_lampiran_pendukung		
		payload.items = items
		let arr_category = []
		if (payload.items.some(d => d.category === 'Barang')) {
			arr_category.push('Barang')
		}
		if (payload.items.some(d => d.category === 'Additional Cost')) {
			arr_category.push('Additional Cost')
		}
		// if (payload.items.some(d => d.category === 'Jasa')) {
		// 	arr_category.push('Barang')
		// }
		payload.category = arr_category.join(', ')
		this.setState({ isConfirm: true, code_confirm: code, color_confirm: "success", title: this.props.t("common:delete.title-delete"), param_modal: payload })
    }

    toggleDelete = (e, value, code) => {
		if (code !== 'multiple-company' && code !== 'multiple-po') {
			e.preventDefault();
		}
        let title = ''
        switch (code) {
            case 'multiple-company':
                title = 'Mohon pilih item dengan Company yang sama'
                break;
            case 'multiple-po':
                title = 'Mohon pilih item dengan PO yang sama'
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid_temp: uuid, code_confirm: code, color_confirm: "danger", title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'save-invoice':
                this.saveInvoice(this.state.param_modal)
                break;
			case 'draft-invoice':
				this.draftInvoice(this.state.param_modal)
				break;
            case 'lampiran-pendukung':
                this.deleteLampiranPendukung(this.state.uuid_temp)
                break;
            default:
                this.setState({ isConfirm: false, uuid_temp: '' });
                break;
        }
        return true
    }

    fetchRekeningBank = (newValue) => {
        this.setState(({ loadings_invoice }) => ({
            loadings_invoice: { ...loadings_invoice, bank: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchRekeningBank(this.props.user.uuid, select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.nomor_rekening + ' - ' + data.branch_name};
                });
                this.setState(({ loadings_invoice, param_option }) => ({
                    loadings_invoice: { ...loadings_invoice, bank: false },
                    param_option: { ...param_option, m_bank: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, bank: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

	setOptionLampiran = async (payload, type) => {
        let param_lampiran_pendukung = this.state.param_lampiran_pendukung
        switch(type) {
            case 'file':
                param_lampiran_pendukung.file = payload;
                break;
            case 'file-name':
                param_lampiran_pendukung.file_name = payload;
                break;
            case 'document-date':
                param_lampiran_pendukung.document_date = payload;
                break;
            case 'description':
                param_lampiran_pendukung.description = payload;
                break;
            default:
                break;
        }
        this.setState({ param_lampiran_pendukung: param_lampiran_pendukung })
    }

	addLampiranPendukung = () => {
        this.setState({ statusLampiranVendor: false })
        let status = false
        let param_lampiran_pendukung = this.state.param_lampiran_pendukung
        Object.keys(param_lampiran_pendukung).map(function (key, index) {
            if (param_lampiran_pendukung[key] === '') {
                status = true
            }
            return true
        });
        if (status) {
            this.setState({ statusLampiranVendor: status })
            return
        }

		let data_lampiran_pendukung = this.state.data_lampiran_pendukung
        data_lampiran_pendukung.push(param_lampiran_pendukung)

        this.setState(({ param_lampiran_pendukung, loadings_invoice }) => ({
            param_lampiran_pendukung: { ...param_lampiran_pendukung,
                file: '',
                file_name: '',
                document_date: '',
                description: '',
            },
            data_lampiran_pendukung: data_lampiran_pendukung,
            loadings_invoice: { ...loadings_invoice, input_lampiran_pendukung: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, input_lampiran_pendukung: false },
                }))
            }, 10)
        });
	}

    deleteLampiranPendukung = (key) => {
		// console.log(key)
        let data_lampiran_pendukung = this.state.data_lampiran_pendukung
        delete data_lampiran_pendukung[key];

        this.setState(({ loadings_invoice }) => ({
            loadings_invoice: { ...loadings_invoice, list_lampiran_pendukung: true },
            isConfirm: false,
        }), () => {
            let new_data = []
            data_lampiran_pendukung.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState(({ loadings_invoice }) => ({
                    loadings_invoice: { ...loadings_invoice, list_lampiran_pendukung: false },
                    data_lampiran_pendukung: new_data,
                }))
            }, 10)
        })
    }

	setOption = async (payload, code, key) => {
		let data = this.state.param_invoice
		let status = this.state.status_ppn
        let new_value = 0

        switch(code) {
            case 'qty':
                new_value = this.formatValue(payload)
                data.items[key].qty = new_value

				if (data.items[key].category === 'Additional Cost') {
					data.total = (parseFloat(data.total) - parseFloat(data.total_add_cost)).toFixed(2)
					data.total_add_cost = (parseFloat(data.total_add_cost) - parseFloat(data.items[key].net_value)).toFixed(2)
	
					data.items[key].amount = (parseFloat(new_value) * parseFloat(data.items[key].unit_price)).toFixed(2)
					data.items[key].net_value = data.items[key].amount
					data.total_add_cost = (parseFloat(data.total_add_cost) + parseFloat(data.items[key].net_value)).toFixed(2)
					data.total = (parseFloat(data.total) + parseFloat(data.total_add_cost)).toFixed(2)
				}
				else {
					data.total = (parseFloat(data.total) - parseFloat(data.amount)).toFixed(2)
					data.amount = (parseFloat(data.amount) - parseFloat(data.items[key].net_value)).toFixed(2)
	
					data.items[key].amount = (parseFloat(new_value) * parseFloat(data.items[key].unit_price)).toFixed(2)
					data.items[key].net_value = data.items[key].amount
					data.amount = (parseFloat(data.amount) + parseFloat(data.items[key].net_value)).toFixed(2)
					data.total = (parseFloat(data.total) + parseFloat(data.amount)).toFixed(2)
				}

                break;
            case 'ppn':
				if (payload.value === 'y') {
					status = false
				}
				data.items[key].with_ppn_param = payload
				data.items[key].with_ppn = payload.value
                break;
            default:
                break;
		}

		this.setState(({ loadings_invoice }) => ({
			loadings_invoice: { ...loadings_invoice, update_ppn: true },
			param_invoice: data,
			status_ppn: status
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings_invoice }) => ({
					loadings_invoice: { ...loadings_invoice, update_ppn: false },
				}))
			}, 10);
		});
	}

	updateItemInvoice = async (payload, data_param) => {
        this.props.showInvoice(data_param.uuid)
            .then((resp) => {
				let data_invoice = resp.data.data
				data_invoice.items.forEach(element => {
					element.tax_id = 'BA'
					if (element.with_ppn === 'y') {
						element.tax_id = 'BB'
					}
				});
				data_invoice.add_cost.forEach(element => {
					element.tax_id = 'BA'
					if (element.with_ppn === 'y') {
						element.tax_id = 'BB'
					}
				});
				let param = []
				if (data_invoice.add_cost.length === 0) {
					param = {
						items: data_invoice.items
					}
				}
				else if (data_invoice.items.length === 0) {
					param = {
						add_cost: data_invoice.add_cost
					}
				}
				else {
					param = {
						items: data_invoice.items,
						add_cost: data_invoice.add_cost
					}
				}
				this.props.updateItemInvoice(param)
					.then((resp) => {
						if (payload.save_draft === 'n') {
							this.setState({isConfirm: false}, () => {
								this.modalCetak(data_param)
							})
						}
						else {
							this.props.history.push('/invoice/invoice-management')
						}
						toastr.success(resp.data.message);
					})
					.catch(error => {
						if (error !== undefined) {
							// toastr.error(error.data.message)
							this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
						} else {
							toastr.error('Opps Somethings Wrong')
						}
					})
            })
            .catch(error => {
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

	saveInvoice = async (payload) => {
		// console.log(payload)
		// return
        this.props.saveInvoice(payload)
            .then((resp) => {
				let datas = resp.data.data
				this.updateItemInvoice(payload, datas)
				toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

	draftInvoice = async (payload) => {
		// console.log(payload)
		// return
        this.props.draftInvoice(payload)
            .then((resp) => {
				let datas = resp.data.data
				this.updateItemInvoice(payload, datas)
				toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    modalAdditionalCost = (payload) => {
		this.setState({ loadingModal: true }, () => {
			this.props.showUnbilled(payload.uuid)
				.then((resp) => {
					let datas = resp.data.data;
					// console.log(datas)
					// return
					this.setState({
						loadingModal: false,
						modalOpen:true,
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
		})
	}

    modalCetak = async (payload) => {
		// console.log(payload)
		// return
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
            modalType:'cetak',
            param_modal: payload,
        }));
    }

    cetakInvoice = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.cetakInvoice(this.state.param_modal.uuid)
            .then((resp) => {
                // this.setState(({}) => ({loadingDownload : false}));
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `invoice_${this.state.param_modal.number}_${this.state.param_modal.created_at}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
				setTimeout(() => {
					this.toggleClose()
				});
            })
            .catch((resp) => {
                // this.setState({loadingDownload : false});
                toastr.error("Ceklist Dokumen tidak bisa dicetak");
                // this.setState({loading: false});
            });
	}

    scanFakturPajak = (payload) => {
		this.setState({loadingSubmit: true})
		let param_invoice = this.state.param_invoice;
		let company_id = param_invoice.items[0]['company_id']
		this.setState({loadingSubmit: true})
        this.props.scanFakturPajak(company_id, payload)
            .then((resp) => {
                console.log(resp)
                let datas = resp.data.data;
                // param_invoice.amount = datas.amount !== null ? datas.amount : param_invoice.amount;
                param_invoice.number = datas.nomor_invoice !== null ? datas.nomor_invoice : param_invoice.number;
                param_invoice.faktur_pajak_no = datas.nomor !== null ? datas.nomor : param_invoice.faktur_pajak_no;
                param_invoice.faktur_tanggal = datas.tanggal !== null ? datas.tanggal : param_invoice.faktur_tanggal;
                param_invoice.note_vendor = datas.nama !== null ? datas.nama : param_invoice.note_vendor;
                if (param_invoice.note_vendor !== null) {
                    if (param_invoice.note_vendor.length > 50) {
                        param_invoice.note_vendor.substring(0, 50)
                    }
                }
				param_invoice.faktur_status = datas?.status_approval;
				param_invoice.invoice_date = datas.tanggal !== null ? datas.tanggal : param_invoice.invoice_date;
                param_invoice.dpp_amount = datas.kena_pajak !== null ? datas.kena_pajak : param_invoice.dpp_amount;
                param_invoice.ppn_amount = datas.ppn !== null ? datas.ppn : param_invoice.ppn_amount;
                param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) + parseFloat(param_invoice.ppn_amount) - parseFloat(param_invoice.potongan)).toFixed(2);
                if (param_invoice.faktur_pajak_no !== null) {
					if (param_invoice.faktur_pajak_no.length > 0) {
						if (param_invoice.faktur_pajak_no[0] === '0' && param_invoice.faktur_pajak_no[1] === '3') {
							param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) - parseFloat(param_invoice.potongan)).toFixed(2);
						}
					}
				}

				this.setState(({ loadings_invoice }) => ({
					loadings_invoice: { ...loadings_invoice, form: true },
					param_invoice: param_invoice,
					loadingSubmit: false
				}), () => {
					setTimeout(() => {
						this.setState(({ loadings_invoice }) => ({
							loadings_invoice: { ...loadings_invoice, form: false },
						}));
					}, 10);
				});
            })
            .catch((resp) => {
				this.setState({loadingSubmit: false})
				if (resp.data.errors.length > 0) {
					resp.data.errors.forEach(element => {
						toastr.error(element, { closeButton: true, timeOut: 6000});
					});
				}
            });
	}

    resetScanFakturPajak = (e) => {
		let param_invoice = this.state.param_invoice;
		let ppn = 0
		// param_invoice.items.forEach(element => {
		// 	if (element.with_ppn === 'y') {
		// 		if (element.category === 'Barang') {
		// 			ppn += parseFloat(element.net_value)/10
		// 		}
		// 		else if (element.category === 'Additional Cost') {
		// 			ppn += parseFloat(element.amount)/10
		// 		}
		// 	}
		// });
		param_invoice.number = ''
		param_invoice.faktur_pajak_no = ''
		param_invoice.faktur_tanggal = ''
		param_invoice.note_vendor = ''
		param_invoice.faktur_status = null
		param_invoice.invoice_date = ''
		param_invoice.ppn_amount = ppn
		param_invoice.dpp_amount = param_invoice.dpp_amount_temp
		param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) + parseFloat(param_invoice.ppn_amount) - parseFloat(param_invoice.potongan)).toFixed(2)
		if (param_invoice.faktur_pajak_no !== null && param_invoice.faktur_pajak_no !== '') {
			if (param_invoice.faktur_pajak_no.length > 0) {
				if (param_invoice.faktur_pajak_no[0] === '0' && param_invoice.faktur_pajak_no[1] === '3') {
					param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) - parseFloat(param_invoice.potongan)).toFixed(2);
				}
			}
		}

		this.setState(({ loadings_invoice }) => ({
			loadings_invoice: { ...loadings_invoice, form: true },
			param_invoice: param_invoice,
			loadingSubmit: false
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings_invoice }) => ({
					loadings_invoice: { ...loadings_invoice, form: false },
				}));
				console.log(this.state.param_invoice)
			}, 10);
		});
	}

	setWithPPN = (payload) => {
		let param_invoice = this.state.param_invoice
		param_invoice.with_ppn = payload
		if (payload === 'y') {
			// param_invoice.ppn_amount = ((parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost))/10)
			// param_invoice.total = parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) + parseFloat(param_invoice.ppn_amount) - parseFloat(param_invoice.potongan)
			param_invoice.items.forEach(element => {
				element.with_ppn_param = {value: 'y', label: 'Ya'}
				element.with_ppn = 'y'					
			});
		}
		else {
			param_invoice.ppn_amount = 0
			param_invoice.dpp_amount = 0
			param_invoice.items.forEach(element => {
				element.with_ppn_param = {value: 'n', label: 'Tidak'}
				element.with_ppn = 'n'					
			});
		}
		this.setState(({ loadings_invoice }) => ({
			loadings_invoice: { ...loadings_invoice, update_ppn: true, item: true },
			param_invoice: param_invoice
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings_invoice }) => ({
					loadings_invoice: { ...loadings_invoice, update_ppn: false, item: false },
				}))
			}, 10);
		});
	}

	renderSwitchBody(param) {
        switch(param) {
          case 'cetak':
            return <KonfirmasiCetak
                        modalType={this.state.tipe_modal}
                        data={this.state.param_modal}
                        save={this.cetakInvoice}
                        toggleClose={this.toggleClose}
						/>;
          case 'additional-cost':
            return <AdditionalCost
                        modalType={this.state.tipe_modal}
                        data_header={this.state.data_header}
                        data={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          default:
            return ;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
            case 'cetak':
                return <ModalHeader toggle={() => this.toggleClose()}>Invoice Document Successfully Submited</ModalHeader>;
            case 'additional-cost':
                return <ModalHeader toggle={() => this.toggleClose()}>Additional Cost</ModalHeader>;
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

	resetParam = () => {
		let reset_param = {
			faktur_status: null,
			faktur_file: '',
			faktur_attachment: '',
			faktur_pajak_no: '',
			faktur_tanggal: '',
			number: '',
			invoice_date: '',
			invoice_file: '',
			invoice_attachment: '',
			bank: [],
			rekening_bank_id: '',
			ppn: [],
			with_ppn: 'n',
			faktur_pajak_attachment: '',
			status: '',
			purchasing_requisition_number: '',
			purchase_order_eproc_number: '',
			purchase_order_number: '',
			document_po_confirm: '',
			goods_receipt_number: '',
			goods_receipt_file: '',
			goods_receipt_attachment: '',
			amount: 0,
			amount_temp: 0,
			dpp_amount: 0,
			dpp_amount_temp: 0,
			total_add_cost: 0,
			total_add_cost_temp: 0,
			potongan: 0,
			potongan_temp: 0,
			ppn_amount: 0,
			ppn_amount_temp: 0,
			total: 0,
			total_temp: 0,
			note_vendor: '',
			save_draft: '',
			items: [],
			attachment: [],
		}
		this.setState({ statusForm: false }, () => {
			setTimeout(() => {
				this.setState({param_invoice: reset_param})
			}, 10);
		})
	}

	setDocumentPO = (payload, key) => {
		let param_invoice = this.state.param_invoice
		param_invoice.document_po_confirm[key].file = payload
		this.setState({param_invoice: param_invoice})
	}

	setValue = (payload, code) => {
		// console.log(payload)
		let param_invoice = this.state.param_invoice
		let new_value = this.formatValue(payload)
		if (code === 'ppn_amount') {
			param_invoice.ppn_amount = new_value
			param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) + parseFloat(param_invoice.ppn_amount) - parseFloat(param_invoice.potongan)).toFixed(2);
			if (param_invoice.faktur_pajak_no !== null) {
				if (param_invoice.faktur_pajak_no.length > 0) {
					if (param_invoice.faktur_pajak_no[0] === '0' && param_invoice.faktur_pajak_no[1] === '3') {
						param_invoice.total = (parseFloat(param_invoice.amount) + parseFloat(param_invoice.total_add_cost) - parseFloat(param_invoice.potongan)).toFixed(2);
					}
				}
			}
		}
		else if (code === 'dpp_amount') {
			param_invoice.dpp_amount = new_value
		}
		this.setState({ param_invoice: param_invoice })
	}

    formatValue(payload) {
        let new_value = replaceAll(payload, '.', '')
        return replaceAll(new_value, ',', '.')
    }

	render(){
		const {t} = this.props;
		return (
			<div>
				{this.state.statusForm === false &&
					<div>
						<ol className="breadcrumb float-xl-right">
							<li className="breadcrumb-item">Home</li>
							<li className="breadcrumb-item">Invoice</li>
							<li className="breadcrumb-item active">Unbilled - Barang</li>
						</ol>
						<h1 className="page-header">Unbilled - Barang </h1>
						<div className="row">
							{/* <div className="col-md-3">
								<Unbilled />
							</div> */}
							<div className="col-md-12">
								<List
									ref={this.childList}
									redirectDetail={this.redirectDetail}
									handleChecklist={this.handleChecklist}
									handleCheckAll={this.handleCheckAll}
									setLoading={this.setLoading}
									parentProps={this.props}
									fetchUnbilled={this.props.fetchUnbilled}
									parentState={this.state}
									// syncPRPrice={this.syncPRPrice}
									setListData={this.setListData}
									setItems={this.setItems}
									modals={this.modals}
									modalAdditionalCost={this.modalAdditionalCost}
								/>
								<Item
									ref={this.childItem}
									redirectDetail={this.redirectDetail}
									parentState={this.state}
									submitUnbilled={this.submitUnbilled}
									modals={this.modals}
									modalAdditionalCost={this.modalAdditionalCost}
									t={this.props.t}
								/>
							</div>
						</div>
					</div>
				}
				{this.state.statusForm &&
					<div>
						<Form
							errors={this.state.errors}
							user={this.props.user}
							// data={this.state.data_invoice.items}
							param_invoice={this.state.param_invoice}
							param_option={this.state.param_option}
							data_lampiran_pendukung={this.state.data_lampiran_pendukung}
							param_lampiran_pendukung={this.state.param_lampiran_pendukung}
							loadings_invoice={this.state.loadings_invoice}
							status_ppn={this.state.status_ppn}
							format_djp={this.state.format_djp}
							status_input_faktur={this.state.status_input_faktur}
							statusLampiranVendor={this.state.statusLampiranVendor}
							fileUpload={this.props.fileUpload}
							setOption={this.setOption}
							setWithPPN={this.setWithPPN}
							fetchBank={this.fetchRekeningBank}
							setOptionLampiran={this.setOptionLampiran}
							addLampiranPendukung={this.addLampiranPendukung}
							deleteLampiranPendukung={this.deleteLampiranPendukung}
							saveInvoice={this.saveInvoice}
							scanFakturPajak={this.scanFakturPajak}
							toggleDelete={this.toggleDelete}
							toggleConfirm={this.toggleConfirm}
							toggleClose={this.toggleCloseForm}
							loadingSubmit={this.state.loadingSubmit}
							toggleOpenPreview={this.toggleOpenPreview}
							resetParam={this.resetParam}
							resetScanFakturPajak={this.resetScanFakturPajak}
							setDocumentPO={this.setDocumentPO}
							setValue={this.setValue}
						/>
					</div>
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
		);
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
		fetchUnbilled: (params) => dispatch(fetchUnbilled(params)),
		fetchMultipleDetailPurchaseOrder: (payload) => dispatch(fetchMultipleDetailPurchaseOrder(payload)),
		fetchPenalty: (params) => dispatch(fetchPenalty(params)),
		fetchPenaltyAdditionalCost: (params) => dispatch(fetchPenaltyAdditionalCost(params)),
		showUnbilled: (id) => dispatch(showUnbilled(id)),
        saveInvoice: (payload) => dispatch(saveInvoice(payload)),
        updateItemInvoice: (payload) => dispatch(updateItemInvoice(payload)),
		showInvoice: (id) => dispatch(showInvoice(id)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		fetchRekeningBank: (id, params) => dispatch(fetchRekeningBank(id, params)),
        scanFakturPajak: (id, params) => dispatch(scanFakturPajak(id, params)),
		cetakInvoice: (id) => dispatch(cetakInvoice(id)),
		draftInvoice: (payload) => dispatch(draftInvoice(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Barang));