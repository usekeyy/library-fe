import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
import { showInvoice, submitInvoice, updateItemInvoice, updateStatusInvoice, updateAmountInvoice, submitInvoiceSAP, showSimulateInvoice,
        cetakInvoice, postingInvoiceSAP, scanFakturPajak, uploadLampiranInvoice, fetchDocumentInvoice, reverseInvoice, fetchTaxInvoice
    } from '../../../store/actions/invoice/invoiceActions';
import { createPenalty, updatePenalty, deletePenalty } from '../../../store/actions/invoice/grsaActions';
import { fetchRekeningBank } from '../../../store/actions/vendor/profile-vendor/rekeningBankActions';
import { fetchPaymentBlock } from '../../../store/actions/invoice/paymentBlockActions';
import { fetchPaymentMethod } from '../../../store/actions/invoice/paymentMethodActions';
import { fetchSelectHouseBank, fetchSelectAccountId } from '../../../store/actions/invoice/houseBankActions';
import { fetchReferenceKey } from '../../../store/actions/invoice/referenceKeyActions';
import { fetchTax } from '../../../store/actions/master/masterTaxActions';
import { fetchTermsOfPayment } from '../../../store/actions/master/termsOfPaymentActions';
import { fetchAccAssignmentCategory } from '../../../store/actions/master/accAssignmentCategoryActions';
import { fetchAssets } from '../../../store/actions/master/assetsActions';
import { fetchCostCenter } from '../../../store/actions/master/costCenterActions';
import { fetchWbsProject } from '../../../store/actions/master/wbsProjectActions';
import { fetchGlAccount } from '../../../store/actions/master/glAccountActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import Form from './invoice/Form';
import ModalPenalty from './invoice/ModalPenalty';
import KonfirmasiCetak from '../unbilled/invoice/KonfirmasiCetak';
import KonfirmasiReverse from './invoice/KonfirmasiReverse';
import KonfirmasiPosting from './invoice/KonfirmasiPosting';
// import DetailOA from './sub/DetailOA';
// import { formatDate } from '../../../helpers/formatDate';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import ModalSimulate from './invoice/ModalSimulate';
import Preview from '../../../components/modal/preview/Preview';

class DetailInvoiceManagement extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            isVerifikasi: this.props.location?.state?.isVerifikasi,
            errors: [],
            document: [],
            data: [],
			loading: true,
			modalOpen: false,
			modalType: '',
			uuid_temp: '',
            title: this.props.t("common:delete.title-delete"),
            isConfirm: false,
            code_confirm: '',
            color_confirm: 'success',
			data_lampiran_vendor: [],
			data_lampiran_internal: [],
            param_tax: {
                tax_type: '',
                tax_code: '',
                base_amount: '',
            },
			param_lampiran_vendor: {
				document_date: '',
                description: '',
				file: '',
				file_name: '',
			},
			param_lampiran_internal: {
				document_date: '',
                description: '',
				file: '',
				file_name: '',
			},
			param_reverse: {
				reason_reversal: null,
                uuid: null,
				posting_date: null,
			},
			param_option: {
				m_document_type: [],
				m_bank: [],
				m_reverse: [
                    {
                        value: '01',
						label: '01 - Reversal in current period'
					},
                    {
                        value: '02',
						label: '02 - Reversal in closed period'
					},
                    {
                        value: '03',
						label: '03 - Actual reversal in current period'
					},
                    {
                        value: '04',
						label: '04 - Actual reversal in closed period'
					},
                    {
                        value: '05',
						label: '05 - Actual/defferal posting'
					},
                    {
                        value: '06',
						label: '06 - Reversal Wanprestasi'
					},
				],
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
				m_debit_credit: [
                    {
                        value: 'S',
                        label: 'Debit', 
					},
					{
                        value: 'H',
                        label: 'Credit', 
					},
				],
				m_payment_block: [],
                m_payment_method: [],
                m_house_bank: [],
                m_account_id: [],
                m_reference_key: [],
                m_w_tax: [],
                m_tax: [],
                m_pay_of_term: [],
            },
			loadings: {
                form: false,
                update_ppn: false,
                item: false,
                with_holding_tax: false,
                loadingModal: false,
                data: false,
				input_lampiran_vendor: false,
				list_lampiran_vendor: false,
				input_lampiran_internal: false,
				list_lampiran_internal: false,
				document_type: false,
				bank: false,
				payment_block: false,
				payment_method: false,
				house_bank: false,
				account_id: false,
				loading_account_id: false,
				payment_reff: false,
				reference_key: false,
				w_tax: false,
				tax: false,
                pay_of_term: false,
                acc_assgn_category: true,
                gl_account_id: true,
                asset_id: true,
                cost_center_id: true,
                wbe_element_id: true,
                loading_input_penalty: false,
                loading_list_penalty: false,
                loading_dpp: false,
			},
            status_edit_amount: false,
            status_edit_wh_tax: false,
            lampiran_code: '',
            statusLampiranVendor: false,
            statusLampiranInternal: false,
            status_ppn: false,
            status_reject: false,
            status_edit_ppn: true,
            status_mvp: false,
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
                    {
                        value: 'additional_expense',
                        label: 'Additional Expense',
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
                m_item: [],
                loadingSubmit: false,
            },
            delete_penalty: [],
            check_reverse: false,
            alasan_reverse: null,
            status_reverse: false,
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
            this.fetchDocumentInvoice()
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

    fetchDocumentInvoice = () => {
        this.props.fetchDocumentInvoice(this.props.match.params.id)
            .then((resp) => {
                this.setState({document: resp.data.data}, () => {
                    this.getUUID()
                })
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
                if (error !== undefined) {
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

    }

    getUUID = async () => {
        this.setState({ loading: true })
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props.showInvoice(this.props.match.params.id)
                .then((resp) => {
                    let document = this.state.document;
                    let datas = resp.data.data;
                    datas.document_po_confirm.forEach(element => {
                        if (element.description.length > 15) {
                            element.po_sap_number = element.description.substr(15, element.description.length)
                        }
                        element.file_temp = element.file
                    });
                    // datas.document_po_confirm.sort((a,b) => a.po_sap_number - b.po_sap_number)
                    if (datas.lock_ppn === null) {
                        datas.lock_ppn = 'y'
                    }
                    datas.mvp_file = null;
                    if (document.some(d => d.tipe === "mvp")) {
                        let index = document.findIndex(d => d.tipe === "mvp");
                        datas.mvp_file = document[index].file
                    }

                    let total_add_cost = 0
                    datas.add_cost.forEach(element => {
                        if (element.amount_confirm !== null) {
                            total_add_cost += parseFloat(element.amount_confirm)
                        }
                        else {
                            total_add_cost += parseFloat(element.amount)
                        }
                    });
                    datas.total_add_cost = total_add_cost
                    datas.total_add_cost_temp = total_add_cost

                    datas.amount_temp = datas.amount
                    datas.ppn_amount_temp = datas.ppn_amount
                    datas.dpp_amount_temp = datas.dpp_amount
                    datas.potongan_temp = datas.potongan
                    datas.total_temp = datas.total
                    if (datas.baseline_date === null || datas.baseline_date === '') {
                        datas.baseline_date = this.formattingDate(new Date())
                        datas.posting_date = this.formattingDate(new Date())
                    }
                    if ((datas.status === 'draft' || datas.status === 'rejected_1' || datas.status === 'rejected_2') && datas.created_by  === this.props.user.uuid) {
                        this.fetchRekeningBank()
                    }
                    if ((datas.status === 'received' || datas.status === 'approved_2') && this.props.user.has_roles.includes("INVER2")) {
                        this.fetchPaymentBlock()
                        this.fetchPaymentMethod()
                        this.fetchSelectHouseBank()
                        this.fetchReferenceKey()
                        this.fetchTax()
                        this.fetchTermsOfPayment()
                        if (datas.house_bank_code !== null) {
                            this.fetchSelectAccountId()
                        }
                    }
                    this.setState({ loading: false, loadingSubmit: false, data: datas,
                        data_lampiran_vendor: datas.attachment_vendor, data_lampiran_internal: datas.attachment_internal})
                })
                .catch((resp) => {
                    this.setState({loadingSubmit: false})
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

    scanFakturPajak = (payload) => {
        if (payload === null) {
			this.toggleDelete('', '', 'scan-fail')
			return
            // alert("mohon upload lampiran baru terlebih dahulu, sebelum melakukan scan")
        }
        let data = this.state.data;
		let company_id = ''
        if (data.items.length > 0) {
            company_id = data.items[0]['company_id']
        }
        else {
            company_id = data.add_cost[0]['company_id']
        }
		this.setState({loadingSubmit: true})
        this.props.scanFakturPajak(company_id, payload)
            .then((resp) => {
                console.log(resp)
                let datas = resp.data.data;
                data.amount = datas.amount !== null ? datas.amount : data.amount;
                data.dpp_amount = datas.kena_pajak !== null ? datas.kena_pajak : data.dpp_amount;
                data.ppn_amount = datas.ppn !== null ? datas.ppn : data.ppn_amount;
                data.total = parseFloat(data.ppn_amount) + parseFloat(data.dpp_amount) - parseFloat(data.potongan);
                data.number = datas.nomor_invoice !== null ? datas.nomor_invoice : data.number;
                data.faktur_pajak_no = datas.nomor !== null ? datas.nomor : data.faktur_pajak_no;
                data.faktur_tanggal = datas.tanggal !== null ? datas.tanggal : data.faktur_tanggal;
                data.note_vendor = datas.nama !== null ? datas.nama : data.note_vendor;
				data.faktur_status = datas?.status_approval;
				data.invoice_date = datas.tanggal !== null ? datas.tanggal : data.invoice_date;

				this.setState(({ loadings }) => ({
					loadings: { ...loadings, form: true },
                    loadingSubmit: false,
					data: data
				}), () => {
					setTimeout(() => {
						this.setState(({ loadings }) => ({
							loadings: { ...loadings, form: false },
						}));
						console.log(this.state.data)
					});
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

    fetchRekeningBank = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, bank: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchRekeningBank(this.props.user.uuid, select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.nomor_rekening + ' - ' + data.branch_name};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, bank: false },
                    param_option: { ...param_option, m_bank: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, bank: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchPaymentMethod = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, payment_method: true },
        }));
        let select_params = (newValue !== '') ?
            {start: 0, select: newValue, company_id: this.props.user.company_id} :
            {start: 0, company_id: this.props.user.company_id}
        this.props.fetchPaymentMethod(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.payment_method + ' - ' + data.description};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, payment_method: false },
                    param_option: { ...param_option, m_payment_method: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, payment_method: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchPaymentBlock = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, payment_block: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchPaymentBlock(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.code + ' - ' + data.description};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, payment_block: false },
                    param_option: { ...param_option, m_payment_block: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, payment_block: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchSelectHouseBank = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, house_bank: true },
        }));
        let select_params = (newValue !== '') ?
            {start: 0, select: newValue, company_id: this.props.user.company_id} :
            {start: 0, company_id: this.props.user.company_id};
        this.props.fetchSelectHouseBank(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.house_bank, label: data.house_bank + ' - ' + data.bank_name};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, house_bank: false },
                    param_option: { ...param_option, m_house_bank: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, house_bank: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchSelectAccountId = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, account_id: true },
        }));
        let select_params = (newValue !== '') ?
            {start: 0, select: newValue, company_id: this.props.user.company_id, house_bank: this.state.data.house_bank_code} :
            {start: 0, company_id: this.props.user.company_id, house_bank: this.state.data.house_bank_code};
        this.props.fetchSelectAccountId(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.acct_number + ' - ' + data.description, acct_number: data.acct_number, description: data.description};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, account_id: false, loading_account_id: false },
                    param_option: { ...param_option, m_account_id: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, account_id: false, loading_account_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchReferenceKey = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, reference_key: true },
        }));
        let select_params = (newValue !== '') ?
            {start: 0, length: 10, select: newValue, company_id: this.props.user.company_id} :
            {start: 0, length: 10, company_id: this.props.user.company_id};
        this.props.fetchReferenceKey(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.npwp_number + ' - ' + data.city};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, reference_key: false },
                    param_option: { ...param_option, m_reference_key: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, reference_key: false },
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
                    return { value: data.id, label: data.id + ' - ' + data.description, param: data.value};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, tax: false },
                    param_option: { ...param_option, m_tax: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, tax: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
    fetchTermsOfPayment = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, pay_of_term: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, select: newValue} : {start: 0};
        this.props.fetchTermsOfPayment(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.description};
                });
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, pay_of_term: false },
                    param_option: { ...param_option, m_pay_of_term: options},
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, pay_of_term: false },
                }));
                toastr.error(resp.data.message);;
            });
    };
    
	// setLoading = (type) => {
	// 	this.setState({ loading: type })
	// }

    toggleConfirm = (payload) => {
		// console.log(payload)
        let items = this.state.data.items
		let err_format_djp = false
		let status = false
		if (payload.number === '') {
			toastr.error('Mohon lengkapi Nomor Invoice')
			status = true
		}
		if (payload.status === 'submitted') {
            if (payload.with_ppn.value === undefined) {
                toastr.error('Mohon pilih PPN')
                status = true
            }
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
			if (err_format_djp) {
				toastr.error('Format Nomor Faktur Pajak belum sesuai')
				status = true
			}
            if (payload.rekening_bank_id.value === undefined) {
                toastr.error('Mohon pilih Bank')
                status = true
            }
			if (payload.invoice_file === undefined || payload.invoice_file === null || payload.invoice_file === '') {
				toastr.error('Mohon upload Lampiran Invoice')
				status = true
			}
			if (payload.document_po_confirm === undefined || payload.document_po_confirm === null || payload.document_po_confirm === '') {
				toastr.error('Mohon upload Lampiran PO')
				status = true
			}
			if (payload.goods_receipt_file === undefined || payload.goods_receipt_file === null || payload.goods_receipt_file === '') {
				toastr.error('Mohon upload Lampiran GR/SA')
				status = true
			}
			this.setState({ status_ppn: false, status_input_faktur: false, format_djp: false })
			if (payload.with_ppn.value === 'y') {
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
		}

        if (status) {
			return
		}

        payload.uuid = this.state.data.uuid
		payload.attachment = this.state.data_lampiran_vendor
		payload.rekening_bank_id = payload.rekening_bank_id?.value
		payload.with_ppn = payload.with_ppn?.value
		payload.items = items
        if (payload.faktur_status === '') {			
            payload.faktur_status = null
        }
        this.submitInvoice(payload)
    }

	updateItemInvoice = async (payload, code) => {
		let data = this.state.data
		data.items.forEach(element => {
			element.tax_id = 'BA'
			if (element.with_ppn === 'y') {
				element.tax_id = 'BB'
			}
		});
		data.add_cost.forEach(element => {
			element.tax_id = 'BA'
			if (element.with_ppn === 'y') {
				element.tax_id = 'BB'
			}
		});
        let param = []
        if (data.add_cost.length === 0) {
            param = {
                items: data.items
            }
        }
        else if (data.items.length === 0) {
            param = {
                add_cost: data.add_cost
            }
        }
        else {
            param = {
                items: data.items,
                add_cost: data.add_cost
            }
        }
        this.props.updateItemInvoice(param)
            .then((resp) => {
                if (code === 'draft'){
                    this.setState({loadingSubmit: false})
                    this.props.history.push('/invoice/invoice-management')
                    toastr.success(resp.data.message);
                }else{
                    this.modalCetak(payload)
                }
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

    submitInvoice = (payload) => {
		// payload.uuid = this.state.data.uuid
		this.setState({ loadingSubmit: true })
        this.props.submitInvoice(this.state.data.uuid, payload)
            .then((resp) => {
                this.setState({loadingSubmit: false})
                // this.props.history.push('/invoice/invoice-management')
                this.updateItemInvoice(resp.data.data, payload.status)
				toastr.success(resp.data.message);
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
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

    updateStatusInvoice = (payload) => {
        // console.log(payload)
        // return
        this.setState({status_reject: false, loadingSubmit: true})
        let status_reject = false
        if (payload.status === 'rejected_1' || payload.status === 'rejected_2') {
            if (payload.note === null || payload.note === '') {
                status_reject = true
            }
        }
        if (status_reject) {
            this.setState({status_reject: status_reject})
            return
        }
		payload.uuid = this.state.data.uuid
		payload.attachment = this.state.data_lampiran_internal
        // console.log(payload)
        // return

        this.props.updateStatusInvoice(this.state.data.uuid, payload)
            .then((resp) => {
                this.setState({loadingSubmit: false})
                toastr.success(resp.data.message);
                if (payload.status === 'approved_2') {
                    window.location.reload()
                }
                if (payload.status === 'approved_1') {
                    this.props.history.push('/invoice/invoice-management')
                }
                else {
                    window.history.back()
                }
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    submitInvoiceSAP = (payload, code) => {
        this.setState({loadingSubmit: true})
        let data = this.state.data
        data.house_bank = data.house_bank_id
        data.with_holding_tax.forEach(element => {
            if (element.w_tax_code_temp !== undefined) {
                element.w_tax_code = element.w_tax_code_temp
            }
        });
        this.props.submitInvoiceSAP(data.uuid, data)
            .then((resp) => {
                console.log(resp)
                this.updateAmountInvoice(data, payload, code)
            })
            .catch(error => {
                if (error !== undefined) {
                    console.log(error.data)
                    // console.log(error.data.errors)
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({loadingSubmit: false, isError: true, errors: error.data.errors})
                } else {
                    this.setState({loadingSubmit: false})
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }
    
    uploadLampiranInvoice = (payload) => {
        this.setState({ status_mvp: false })
        if (payload.mvp_file === '') {
            this.setState({ status_mvp: true })
            return
        }
        let param = {
            invoice_id: this.state.data.id,
            tipe: "mvp",
            description: "MVP",
            document_date: this.formattingDate(new Date()),
            file: payload.mvp_file
        }
        this.props.uploadLampiranInvoice(param)
            .then((resp) => {
                this.setState({loadingSubmit: false})
                toastr.success(resp.data.message);
                this.getUUID()
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    this.setState({loadingSubmit: false})
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    postingInvoiceSAP = () => {
        this.setState({loadingSubmit: true})
        this.props.postingInvoiceSAP(this.state.data.uuid, {uuid: this.state.data.uuid})
            .then((resp) => {
                this.setState({loadingSubmit: false})
                toastr.success(resp.data.message);
                this.modalPosting(resp.data.data)
            })
            .catch(error => {
                this.setState({loadingSubmit: false})
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    this.setState({loadingSubmit: false})
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

	setOptionLampiranVendor = async (payload, type) => {
        let param_lampiran_vendor = this.state.param_lampiran_vendor
        switch(type) {
            case 'file':
                param_lampiran_vendor.file = payload;
                break;
            case 'file-name':
                param_lampiran_vendor.file_name = payload;
                break;
            case 'document-date':
                param_lampiran_vendor.document_date = payload;
                break;
            case 'description':
                param_lampiran_vendor.description = payload;
                break;
            default:
                break;
        }
        this.setState({ param_lampiran_vendor: param_lampiran_vendor })
    }

	addLampiranVendor = () => {
        this.setState({ statusLampiranVendor: false })
        let status = false
        let param_lampiran_vendor = this.state.param_lampiran_vendor
        Object.keys(param_lampiran_vendor).map(function (key, index) {
            if (param_lampiran_vendor[key] === '') {
                status = true
            }
            return true
        });
        if (status) {
            this.setState({ statusLampiranVendor: status })
            return
        }

        let data_lampiran_vendor = this.state.data_lampiran_vendor
        data_lampiran_vendor.push(param_lampiran_vendor)

        this.setState(({ param_lampiran_vendor, loadings }) => ({
            param_lampiran_vendor: { ...param_lampiran_vendor,
                file: '',
                file_name: '',
                document_date: '',
                description: '',
            },
            data_lampiran_vendor: data_lampiran_vendor,
            loadings: { ...loadings, input_lampiran_vendor: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, input_lampiran_vendor: false },
                }))
            }, 10)
        });
	}

    deleteLampiranVendor = (key) => {
		// console.log(key)
        let data_lampiran_vendor = this.state.data_lampiran_vendor
        delete data_lampiran_vendor[key];

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, list_lampiran_vendor: true },
            isConfirm: false,
        }), () => {
            let new_data = []
            data_lampiran_vendor.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, list_lampiran_vendor: false },
                    data_lampiran_vendor: new_data,
                }))
            })
        })
    }

	setOptionLampiranInternal = async (payload, type) => {
        let param_lampiran_internal = this.state.param_lampiran_internal
        switch(type) {
            case 'file':
                param_lampiran_internal.file = payload;
                break;
            case 'file-name':
                param_lampiran_internal.file_name = payload;
                break;
            case 'document-date':
                param_lampiran_internal.document_date = payload;
                break;
            case 'description':
                param_lampiran_internal.description = payload;
                break;
            default:
                break;
        }
        this.setState({ param_lampiran_internal: param_lampiran_internal })
    }

	addLampiranInternal = () => {
        this.setState({ statusLampiranInternal: false })
        let status = false
        let param_lampiran_internal = this.state.param_lampiran_internal
        Object.keys(param_lampiran_internal).map(function (key, index) {
            if (param_lampiran_internal[key] === '') {
                status = true
            }
            return true
        });
        if (status) {
            this.setState({ statusLampiranInternal: status })
            return
        }

        let data_lampiran_internal = this.state.data_lampiran_internal
        data_lampiran_internal.push(param_lampiran_internal)

        this.setState(({ param_lampiran_internal, loadings }) => ({
            param_lampiran_internal: { ...param_lampiran_internal,
                file: '',
                file_name: '',
                document_date: '',
                description: '',
            },
            data_lampiran_internal: data_lampiran_internal,
            loadings: { ...loadings, input_lampiran_internal: true },
        }), () => {
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, input_lampiran_internal: false },
                }))
            }, 10)
        });
	}

    deleteLampiranInternal = (key) => {
		// console.log(key)
        let data_lampiran_internal = this.state.data_lampiran_internal
        delete data_lampiran_internal[key];

        this.setState(({ loadings }) => ({
            loadings: { ...loadings, list_lampiran_vendor: true },
            isConfirm: false,
        }), () => {
            let new_data = []
            data_lampiran_internal.map(function(d, i) {
                return new_data.push(d)
            })
            setTimeout(() => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, list_lampiran_vendor: false },
                    data_lampiran_internal: new_data,
                }))
            })
        })
    }

    toggleClose = () => {
		this.setState({ modalOpen: false })
        if (this.state.modalType === 'cetak') {
            this.props.history.push('/invoice/invoice-management')
        }
        else if (this.state.modalType === 'posting') {
            this.props.history.push('/invoice/invoice-management')
            // window.location.reload()
            // this.getUUID()
        }
        else if (this.state.modalType === 'reverse') {
            // window.location.reload()
            this.getUUID()
        }
        else if (this.state.modalType === 'simulate') {
            this.getUUID()
        }
	}

    redirectDetail = (url) => {
		const win = window.open(url, "_blank")
		win.focus();
        // this.props.history.push(url)
    }

    toggleDelete = (e, value, code) => {
        if (code !== 'scan-fail') {
            e.preventDefault();
        }

        let title = ''
        switch (code) {
            case 'penalty':
                title = 'Delete Penalty, ' + this.props.t("common:delete.title-delete")
                break;
            case 'scan-fail':
                title = "mohon upload lampiran baru"
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid_temp: uuid, color_confirm: "danger", code_confirm: code, title: title })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'reverse':
                this.reverseInvoice()
                break;
            case 'penalty':
                this.deletePenalty(this.state.uuid_temp)
                break;
            default:
                this.setState({ isConfirm: false, uuid_temp: '' });
                break;
        }
        return true
    }

    addTax = () => {
        let data = this.state.data
        let array = {
            w_tax_type: null,
            w_tax_code: null,
            w_tax_description: null,
            w_tax_value: null,
        }
        data.with_holding_tax.push(array)
        this.setState({ data: data });
    }

	setOptionItem = async (payload, code, key) => {
        let data = this.state.data
        let status = this.state.status_ppn
        let status_edit_amount = false
        let amount = 0
        let ppn_amount = 0
        let total_add_cost = 0
        let potongan = 0
        let new_value = ''
        switch(code) {
            case 'amount':
                new_value = payload.replace(/[^0-9]/g, '')
                if (new_value.length > 2) {            
                    new_value = new_value.substr(0, new_value.length - 2)
                }
                data.items[key].net_value = new_value
                data.items.forEach(element => {
                    amount += parseFloat(element.net_value)
                    if (element.tax_value !== null) {
                        ppn_amount += (parseFloat(element.net_value) * parseFloat(element.tax_value))/100
                    }
                });
                data.add_cost.forEach(element => {
                    if (element.amount_confirm !== null) {
                        ppn_amount += (parseFloat(element.amount_confirm) * parseFloat(element.tax_value))/100
                        total_add_cost += parseFloat(element.amount_confirm)
                    }
                    else {
                        ppn_amount += (parseFloat(element.amount) * parseFloat(element.tax_value))/100
                        total_add_cost += parseFloat(element.amount)
                    }
                });
                data.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                // console.log(ppn_amount)
                data.amount = amount
                data.ppn_amount = ppn_amount
                data.total_add_cost = total_add_cost
                data.potongan = potongan
                data.dpp_amount = parseFloat(amount) + parseFloat(total_add_cost)
                data.total = parseFloat(data.dpp_amount) + parseFloat(ppn_amount) - parseFloat(data.potongan)
                break;
            case 'qty':
                new_value = payload.replace(/[^0-9]/g, '')
                if (new_value.length > 2) {            
                    new_value = new_value.substr(0, new_value.length - 2)
                }
                data.items[key].qty = new_value
                break;
            case 'ppn':
                data.items[key].with_ppn = payload.value
                if (payload.value === 'y') {
                    status = false
                }
                break;
            case 'tax':
                console.log(payload.value)
                status_edit_amount = true
                data.items[key].tax_id = payload.value
                data.items[key].tax_value = payload.param
                data.items.forEach(element => {
                    amount += parseFloat(element.net_value)
                    if (element.tax_value !== null) {
                        ppn_amount += (parseFloat(element.net_value) * parseFloat(element.tax_value))/100
                    }
                });
                data.add_cost.forEach(element => {
                    if (element.amount_confirm !== null) {
                        ppn_amount += (parseFloat(element.amount_confirm) * parseFloat(element.tax_value))/100
                        total_add_cost += parseFloat(element.amount_confirm)
                    }
                    else {
                        ppn_amount += (parseFloat(element.amount) * parseFloat(element.tax_value))/100
                        total_add_cost += parseFloat(element.amount)
                    }
                });
                data.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                // console.log(ppn_amount)
                console.log(ppn_amount)
                data.ppn_amount = ppn_amount
                data.total_add_cost = total_add_cost
                data.potongan = potongan
                data.dpp_amount = parseFloat(amount) + parseFloat(total_add_cost)
                data.total = parseFloat(data.dpp_amount) + parseFloat(ppn_amount) - parseFloat(data.potongan)
                // console.log(data.total)
                break;
            default:
                break;
        }
        // console.log(data)
        this.setState({ data: data, status_ppn: status, status_edit_amount: status_edit_amount }, () => {
            this.setState({ data: data})
        })
    }

	setOptionAddCost = async (payload, code, key) => {
        let data = this.state.data
        let status = this.state.status_ppn
        let status_edit_amount = false
        switch(code) {
            case 'ppn':
                data.add_cost[key].with_ppn = payload.value
                if (payload.value === 'y') {
                    status = false
                }
                break;
            case 'tax':
                status_edit_amount = true
                let amount = 0
                let ppn_amount = 0
                let total_add_cost = 0
                let potongan = 0

                data.items.forEach(element => {
                    amount += parseFloat(element.net_value)
                    ppn_amount += (parseFloat(element.net_value) * parseFloat(element.tax_value))/100
                });
                data.add_cost[key].tax_id = payload.value
                data.add_cost[key].tax_value = payload.param
                data.add_cost.forEach(element => {
                    if (element.tax_value !== null) {
                        if (element.amount_confirm !== null) {
                            ppn_amount += (parseFloat(element.amount_confirm) * parseFloat(element.tax_value))/100
                        }
                        else {
                            ppn_amount += (parseFloat(element.amount) * parseFloat(element.tax_value))/100
                        }
                    }
                });
                console.log(ppn_amount)
                data.add_cost.forEach(element => {
                    if (element.amount_confirm !== null) {
                        total_add_cost += parseFloat(element.amount_confirm)
                    }
                    else {
                        total_add_cost += parseFloat(element.amount)
                    }
                });
                console.log(total_add_cost)
                data.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                console.log(potongan)
                data.amount = amount
                data.ppn_amount = ppn_amount
                data.total_add_cost = total_add_cost
                data.potongan = potongan
                data.dpp_amount = parseFloat(amount) + parseFloat(total_add_cost)
                data.total = parseFloat(data.dpp_amount) + parseFloat(ppn_amount) - parseFloat(data.potongan)
                // console.log(data.total)
                break;
            default:
                break;
        }
        // console.log(data)
        this.setState({ data: data, status_ppn: status, status_edit_amount: status_edit_amount }, () => {
            this.setState({ data: data})
        })
    }

	setOptionPenalty = async (payload, code, key) => {
        let data = this.state.data
        switch(code) {
            case 'debit-credit':
                data.penalty[key].debit_credit = payload.value
                let potongan = 0
                data.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                data.potongan = potongan
                data.total = parseFloat(data.dpp_amount) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)
                break;
            default:
                break;
        }
        this.setState({ data: data })
    }

    modalSimulate = () => {
        this.props.showSimulateInvoice(this.state.data.uuid)
            .then((resp) => {
                // console.log(resp.data.data)
                // return
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, loadingModal:false },
                    loadingSubmit: false,
                    modalOpen: true,
                    modalType:'simulate',
                    param_modal: resp.data.data,
                }));
            })
            .catch((resp) => {
                this.setState({loadingSubmit: false})
                if (resp.data.message === "User does not have the right permissions.") {
                    // this.props.history.push('/')
                    toastr.error(resp.data.message);
                }
                else {
                    if (resp.data.data !== undefined && resp.data.data.credit !== undefined) {
                        this.setState(({ loadings }) => ({
                            loadings: { ...loadings, loadingModal:false },
                            modalOpen: true,
                            modalType:'simulate',
                            param_modal: resp.data.data,
                            loading: false
                        }));
                    }
                    toastr.error(resp.data.message);;
                }
            });
    }

    modalCetak = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen: true,
            modalType:'cetak',
            param_modal: payload,
        }));
    }

    modalPosting = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen: true,
            modalType:'posting',
            param_modal: payload,
        }));
    }

    modalReverse = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen: true,
            modalType:'reverse',
            param_modal: payload,
        }));
    }

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
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, acc_assgn_category: false },
                    data_option: { ...data_option, m_acc_assgn_category: options },
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
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, asset_id: false },
                    data_option: { ...data_option, m_asset: options },
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
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, cost_center_id: false },
                    data_option: { ...data_option, m_cost_center: options },
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
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, wbs_element_id: false },
                    data_option: { ...data_option, m_wbs_element: options },
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
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                    data_option: { ...data_option, m_gl_account: options },
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    modalPenalty = () => {
        this.fetchGlAccount('')
        this.fetchAccAssignmentCategory('')
        this.fetchAssets('')
        this.fetchCostCenter('')
        this.fetchWbsProject('')

        let arr_item = []
        this.state.data.items.forEach(element => {
            arr_item.push({value: element.goods_receipt_item_id, label: element.goods_receipt_number + ' - ' + element.goods_receipt_item_no})
        });

        this.setState(({ data_option }) => ({
            data_option: { ...data_option, m_item: arr_item },
            modalOpen: true,
            modalType:'penalty',
        }));
	}

    createPenalty = (payload) => {
        let gl_account = ''
        let gl_account_name = ''
        let acc_assigment_category_id = ''
        let acc_assigment_category_name = ''
        // let acc_assigment_category_number_name = ''
        let acc_assigment_category_number = ''
        if (payload.jenis_pembebanan.value === 'non_inventory') {
            let length_gl_account_id = payload.gl_account.value.length + 3
            gl_account = payload.gl_account.value
            gl_account_name = payload.gl_account.label.substr(length_gl_account_id, payload.gl_account.label.length - length_gl_account_id)
            let length_acc_assigment_category_id = payload.ass_category.value.length + 3
            acc_assigment_category_id = payload.ass_category.value
            acc_assigment_category_name = payload.ass_category.label.substr(length_acc_assigment_category_id, payload.ass_category.label.length - length_acc_assigment_category_id)
            acc_assigment_category_number = payload.object
            // acc_assigment_category_number_name = payload.object
            if (payload.object.value !== undefined) {
                // let length_acc_assigment_category_number = payload.object.value.length + 3
                acc_assigment_category_number = payload.object.value
                // acc_assigment_category_number_name = payload.object.label.substr(length_acc_assigment_category_number, payload.object.label.length - length_acc_assigment_category_number)
            }
        }

        let param_add = {
            goods_receipt_item_id: payload.item_gr.value,
            penalty_type: payload.penalty_type.label,
            amount: payload.amount,
            currency: payload.currency,
            description: payload.description,
            file: payload.file_name,
            jenis_pembebanan: payload.jenis_pembebanan.label,
            gl_account: gl_account,
            gl_account_name: gl_account_name,
            acc_assigment_category_id: acc_assigment_category_id,
            acc_assigment_category_name: acc_assigment_category_name,
            acc_assigment_category_number: acc_assigment_category_number,
            // acc_assigment_category_number_name: acc_assigment_category_number_name,
        }

        let param = {
            param_add: [],
            param_delete: this.state.delete_penalty,
        }

        param.param_add.push(param_add)

        // console.log(payload)
        // console.log(param_add)
        // return

        this.setState(({loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true}
        }));
        this.props.createPenalty(param)
            .then((resp) => {
                this.props.showInvoice(this.props.match.params.id)
                    .then((resp2) => {
                        let datas = resp2.data.data
                        this.setState(({ data, loadings }) => ({
                            data: { ...data, penalty: datas.penalty},
                            loadings: { ...loadings, loading_list_penalty: false}
                        }), () => {
                            this.setAmountPenalty(payload.amount, 'add')
                        });
                    })
                    .catch(error => {
                        if (error !== undefined) {
                            this.setState({ errors: error.data.errors })
                        } else {
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
                
            })
            .catch(error => {
                this.setState(({loadings }) => ({
                    loadings: { ...loadings, loading_list_penalty: false}
                }));
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    deletePenalty = (key) => {
        let data = this.state.data
        let payload = data.penalty[key]

        this.setState(({loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true}
        }));
        this.props.deletePenalty(payload.uuid)
            .then((resp) => {
                this.props.showInvoice(this.props.match.params.id)
                    .then((resp2) => {
                        let datas = resp2.data.data
                        this.setState(({ data, loadings }) => ({
                            data: { ...data, penalty: datas.penalty},
                            loadings: { ...loadings, loading_list_penalty: false},
                            isConfirm: false
                        }), () => {
                            this.setAmountPenalty(payload.amount, 'delete')
                        });
                    })
                    .catch(error => {
                        this.setState({ isConfirm: false})
                        if (error !== undefined) {
                            this.setState({ errors: error.data.errors })
                        } else {
                            toastr.error('Opps Somethings Wrong')
                        }
                    })
                
            })
            .catch(error => {
                this.setState(({loadings }) => ({
                    loadings: { ...loadings, loading_list_penalty: false}
                }));
                if (error !== undefined) {
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    setAmountPenalty = (payload, code) => {
        let data = this.state.data
        data.potongan_temp = code === 'add' ? parseFloat(data.potongan_temp) + parseFloat(payload)
                    : code === 'delete' ? parseFloat(data.potongan_temp) - parseFloat(payload)
                    : parseFloat(data.potongan_temp)
        data.total_temp = code === 'add' ? parseFloat(data.total_temp) - parseFloat(payload)
                    : code === 'delete' ? parseFloat(data.total_temp) + parseFloat(payload)
                    : parseFloat(data.total_temp)
        this.updateAmountInvoice(data, [], 'penalty')
    }

    updateAmountInvoice = (payload, data_param, code) => {
        // let data = this.state.data
        let param = {
            uuid: payload.uuid,
            amount: code === 'penalty' ? payload.amount_temp : payload.amount,
            total_add_cost: code === 'penalty' ? payload.total_add_cost_temp : payload.total_add_cost,
            dpp_amount: code === 'penalty' ? payload.dpp_amount_temp : payload.dpp_amount,
            ppn_amount: code === 'penalty' ? payload.ppn_amount_temp : payload.ppn_amount,
            potongan: code === 'penalty' ? payload.potongan_temp : payload.potongan,
            total: code === 'penalty' ? payload.total_temp : payload.total,
        }
        // console.log(param)
        // return
        this.setState(({loadings }) => ({
            loadings: { ...loadings, loading_dpp: true}
        }));
        this.props.updateAmountInvoice(this.state.data.uuid, param)
            .then((resp) => {
                let datas_origin = this.state.data
                let datas = resp.data.data
                let ppn_amount = 0
                let amount = 0
                let total_add_cost = 0
                let potongan = 0

                datas_origin.add_cost.forEach(element => {
                    if (element.amount_confirm !== null) {
                        if (this.state.status_edit_amount) {
                            ppn_amount += (parseFloat(element.amount_confirm) * parseFloat(element.tax_value))/100
                        }
                        total_add_cost += parseFloat(element.amount_confirm)
                    }
                    else {
                        if (this.state.status_edit_amount) {
                            ppn_amount += (parseFloat(element.amount) * parseFloat(element.tax_value))/100
                        }
                        total_add_cost += parseFloat(element.amount)
                    }
                });
                datas.total_add_cost = parseFloat(total_add_cost)

                datas_origin.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan += parseFloat(element.amount)
                    }
                });
                datas.potongan = parseFloat(potongan)

                datas.amount_temp = parseFloat(datas.amount)
                datas.total_add_cost_temp = parseFloat(datas_origin.total_add_cost_temp)
                datas.ppn_amount_temp = parseFloat(datas.ppn_amount)
                datas.dpp_amount_temp = parseFloat(datas.dpp_amount)
                datas.potongan_temp = parseFloat(datas.potongan)
                datas.total_temp = parseFloat(datas.total)
                datas.total = parseFloat(datas.total) - parseFloat(datas.potongan)

                if (this.state.status_edit_amount) {
                    datas_origin.items.forEach(element => {
                        amount += parseFloat(element.net_value)
                        if (element.tax_value !== null) {
                            ppn_amount += (parseFloat(element.net_value) * parseFloat(element.tax_value))/100
                        }
                    });
                    datas.amount = parseFloat(amount)
                    datas.ppn_amount = parseFloat(ppn_amount)
                    datas.dpp_amount = parseFloat(amount) + parseFloat(total_add_cost)
                    datas.dpp_amount_temp = parseFloat(datas.dpp_amount)
                    datas.total = parseFloat(amount) + parseFloat(total_add_cost) + parseFloat(datas.ppn_amount) - parseFloat(datas.potongan)
                }

                if (code === 'approve') {
                    if (this.state.data.penalty.length > 0) {
                        this.props.updatePenalty({penalty: this.state.data.penalty})
                            .then((resp) => {
                                this.setState(({loadings }) => ({
                                    loadings: { ...loadings, loading_dpp: false},
                                }), () => {
                                    this.updateStatusInvoice(data_param)
                                });
                            })
                            .catch(error => {
                                this.setState({loadingSubmit: false})
                                if (error !== undefined) {
                                    this.setState({ errors: error.data.errors })
                                } else {
                                    toastr.error('Opps Somethings Wrong')
                                }
                            })
                    }
                    else {
                        this.setState(({loadings }) => ({
                            loadings: { ...loadings, loading_dpp: false},
                        }), () => {
                            this.updateStatusInvoice(data_param)
                        });
                    }
                }
                else if (code === 'simulate') {
                    this.setState(({loadings }) => ({
                        loadings: { ...loadings, loading_dpp: false}
                    }));
                    if (this.state.data.penalty.length > 0) {
                        this.setState(({loadings }) => ({
                            loadings: { ...loadings, loading_list_penalty: true}
                        }));
                        this.props.updatePenalty({penalty: this.state.data.penalty})
                            .then((resp) => {
                                this.props.showInvoice(this.props.match.params.id)
                                    .then((resp2) => {
                                        let datas = resp2.data.data
                                        this.setState(({data, loadings }) => ({
                                            data: { ...data, penalty: datas.penalty},
                                            loadings: { ...loadings, loading_list_penalty: false},
                                            loadingSubmit: false
                                        }), () => {
                                            this.modalSimulate()
                                        });
                                    })
                                    .catch(error => {
                                        this.setState({loadingSubmit: false})
                                        if (error !== undefined) {
                                            this.setState({ errors: error.data.errors })
                                        } else {
                                            toastr.error('Opps Somethings Wrong')
                                        }
                                    })
                            })
                            .catch(error => {
                                this.setState({loadingSubmit: false})
                                if (error !== undefined) {
                                    this.setState({ errors: error.data.errors })
                                } else {
                                    toastr.error('Opps Somethings Wrong')
                                }
                            })
                    }
                    else {
                        this.setState({ loadingSubmit: false }, () => {
                            this.modalSimulate()
                        });
                    }
                }
                else {
                    this.toggleClose()
                    this.setState(({ data, loadings }) => ({
                        data: { ...data, amount: datas.amount, amount_temp: datas.amount_temp,
                            total_add_cost: datas.total_add_cost, total_add_cost_temp: datas.total_add_cost_temp, 
                            dpp_amount: datas.dpp_amount, dpp_amount_temp: datas.dpp_amount_temp,
                            ppn_amount: datas.ppn_amount, ppn_amount_temp: datas.ppn_amount_temp,
                            potongan: datas.potongan, potongan_temp: datas.potongan_temp,
                            total: datas.total, total_temp: datas.total_temp},
                        loadings: { ...loadings, loading_dpp: false},
                        loadingSubmit: false
                    }));
                }
            })
            .catch(error => {
                this.setState(({loadings }) => ({
                    loadings: { ...loadings, loading_dpp: false},
                    loadingSubmit: false
                }));
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    setOptionParamSAP = (payload, code, key) => {
        let data = this.state.data
        let new_value = ''
        switch(code) {
            case 'w-tax':
                data.with_holding_tax[key].w_tax_code_temp = payload.value;
                data.with_holding_tax[key].description = payload.description;
                break;
            case 'w-tax-value':
                new_value = payload.replace(/[^0-9]/g, '')
                if (new_value.length > 2) {            
                    new_value = new_value.substr(0, new_value.length - 2)
                }
                data.with_holding_tax[key].w_tax_value = new_value;
                break;
            case 'posting-date':
                data.posting_date = payload;
                break;
            case 'baseline-date':
                data.baseline_date = payload;
                break;
            case 'payment-method':
                data.payment_method = payload.value;
                // data.payment_method_param = payload;
                break;
            case 'payment-block':
                data.payment_block = payload.value;
                // data.payment_block_param = payload;
                break;
            case 'payment-term':
                data.pay_of_term = payload.value;
                // data.pay_of_term_param = payload;
                break;
            case 'house-bank':
                if (data.house_bank_code !== payload.value) {
                    data.house_bank_id = null;
                    data.house_bank_acct_number = null;
                    data.house_bank_description = null;
                }
                data.house_bank_code = payload.value;
                // data.house_bank_param = payload;
                break;
            case 'account-id':
                data.house_bank_id = payload.value;
                data.house_bank_acct_number = payload.acct_number;
                data.house_bank_description = payload.description;
            // data.house_bank_param = payload;
                break;
            case 'payment-reff':
                data.payment_reff = payload.target.value;
                break;
            case 'reference-1':
                data.reference_1 = payload.value;
                // data.reference_1_param = payload;
                break;
            case 'reference-2':
                data.reference_2 = payload.target.value;
                break;
            case 'reference-3':
                data.reference_3 = payload.target.value;
                break;
            case 'header-text':
                data.header_text = payload.target.value;
                break;
            case 'assignment':
                data.assignment = payload.target.value;
                break;
            // case 'partner-bank':
            //     data.partner_bank = payload.target.value;
            //     break;
            case 'due-date':
                data.due_date = payload;
                break;
            case 'note_vendor':
                data.note_vendor = payload.target.value;
                break;
            default:
                break;
        }

        if (code === 'house-bank') {
            this.setState(({loadings }) => ({
                loadings: { ...loadings, loading_account_id: true},
                data: data
            }), () => {
                this.fetchSelectAccountId('')
            });
        }
        else {
            this.setState({data: data})
        }
    }

    setOption = (payload, code) => {
        let data = this.state.data
        let status = true
        switch(code) {
            case 'ppn-amount':
                let new_value = payload.replace(/[^0-9]/g, '')
                if (new_value.length > 2) {            
                    new_value = new_value.substr(0, new_value.length - 2)
                }
                data.ppn_amount = new_value
                break;
            case 'checklist':
                if (payload === false) {
                    data.ppn_amount = data.ppn_amount_temp
                    let ppn_amount = 0
                    data.items.forEach(element => {
                        if (element.tax_value !== null) {
                            ppn_amount += (parseFloat(element.net_value) * parseFloat(element.tax_value))/100
                        }
                    });
                    data.add_cost.forEach(element => {
                        if (element.amount_confirm !== null) {
                            ppn_amount += (parseFloat(element.amount_confirm) * parseFloat(element.tax_value))/100
                        }
                        else {
                            ppn_amount += (parseFloat(element.amount) * parseFloat(element.tax_value))/100
                        }
                    });
                    data.ppn_amount = ppn_amount
                    // if (data.faktur_status === null) {
                    // }
                }
                break;
            default:
                break;
        }
        this.setState({ data: data, status_edit_ppn: status }, () => {
            this.setState({status_edit_ppn: status})
        })

    }

    formattingDate = (e) => {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    renderSwitchBody(param) {
        switch(param) {
          case 'posting':
            return <KonfirmasiPosting
                        modalType={this.state.tipe_modal}
                        data={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          case 'penalty':
            return <ModalPenalty
                        toggleOpenPreview={this.toggleOpenPreview}
                        loadings={this.state.loadings}
						errors={this.state.errors}
                        data_option={this.state.data_option}
                        data={this.state.data}
                        save={this.createPenalty}
                        upload={this.props.fileUpload}
                        // addPenalty={this.addPenalty}
                        fetchAccAssignmentCategory={this.fetchAccAssignmentCategory}
                        fetchAssets={this.fetchAssets}
                        fetchCostCenter={this.fetchCostCenter}
                        fetchWbsProject={this.fetchWbsProject}
                        fetchGlAccount={this.fetchGlAccount}
                        toggleClose={this.toggleClose}
						/>;
          case 'simulate':
            return <ModalSimulate
                        loadings={this.state.loadings}
                        data={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          case 'cetak':
            return <KonfirmasiCetak
                        modalType={this.state.tipe_modal}
                        data={this.state.param_modal}
                        save={this.cetakInvoice}
                        toggleClose={this.toggleClose}
						/>;
          case 'reverse':
            return <KonfirmasiReverse
                        modalType={this.state.tipe_modal}
                        data={this.state.param_modal}
                        save={this.cetakInvoice}
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
              default:
                return ;
        }
    }

    cetakInvoice = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.cetakInvoice(this.state.data.uuid)
            .then((resp) => {
                // this.setState(({}) => ({loadingDownload : false}));
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `invoice_${this.state.data.number}_${this.state.data.created_at}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch((resp) => {
                // this.setState({loadingDownload : false});
                toastr.error("Ceklist Dokumen tidak bisa dicetak");
                // this.setState({loading: false});
            });
	}

    setCheckReverse = () => {
        let status = this.state.check_reverse
        if (status) {
            this.setState({ alasan_reverse: null })
            status = false
        }
        else {
            this.setState({ status_reverse: false })
            status = true
        }
        this.setState({ check_reverse: status })
    }

    setReverse = (payload, code) => {
        let param_reverse = this.state.param_reverse
        switch(code) {
            case 'reason':
                param_reverse.reason_reversal = payload
                break;
            case 'date':
                param_reverse.posting_date = payload
                break;
            default:
                break;
        }

        if (payload !== null) {
            this.setState({ status_reverse: false })
        }
        this.setState({ alasan_reverse: payload })
    }

    toggleReverse = (e, payload, code) => {
        this.setState({ status_reverse: false })
        let param_reverse = this.state.param_reverse
        if (this.state.check_reverse === false || param_reverse.reason_reversal === null || param_reverse.posting_date === null || param_reverse.posting_date === 'NaN-NaN-NaN') {
            this.setState({ status_reverse: true })
            return
        }
        let title = "Reverse Invoice. " + this.props.t("common:delete.title-delete")

		this.setState({ isConfirm: true, code_confirm: code, color_confirm: "success", title: title, param_modal: payload })
    }

    reverseInvoice = () => {
        let param_reverse = this.state.param_reverse
        param_reverse.uuid = this.state.data.uuid

        this.props.reverseInvoice(this.state.data.uuid, param_reverse)
            .then((resp) => {
                this.setState({loadingSubmit: false, isConfirm: false})
                toastr.success(resp.data.message);
                this.modalReverse(resp.data.data)
            })
            .catch(error => {
                this.setState({loadingSubmit: false, isConfirm: false})
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

	setOptionPPN = async (payload, index) => {
		let data = this.state.data
		data.items[index].with_ppn_param = payload
		data.items[index].with_ppn = payload.value

		let status = this.state.status_ppn
		if (payload.value === 'y') {
			status = false
		}
		// calculate ppn
		let ppn = 0
		data.items.forEach(element => {
			if (element.with_ppn === 'y') {
				if (element.category === 'Barang') {
					ppn += parseFloat(element.net_value)/10
				}
				else if (element.category === 'Additional Cost') {
					ppn += parseFloat(element.amount)/10
				}
			}
		});
		data.ppn_amount = ppn
		data.total = parseFloat(data.dpp_amount) + parseFloat(data.ppn_amount)
		// this.setState({ data: data, status_ppn: status })

		this.setState(({ loadings_invoice }) => ({
			loadings_invoice: { ...loadings_invoice, update_ppn: true },
			data: data,
			status_ppn: status
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings_invoice }) => ({
					loadings_invoice: { ...loadings_invoice, update_ppn: false },
				}))
			}, 10);
		});
	}

	setWithPPN = (payload) => {
		let data = this.state.data
		data.with_ppn = payload
		if (payload === 'y') {
            data.ppn_amount = (parseFloat(data.dpp_amount)/10)
            data.total = parseFloat(data.dpp_amount) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)
			data.items.forEach(element => {
				element.with_ppn_param = {value: 'y', label: 'Ya'}
				element.with_ppn = 'y'					
			});
		}
		else {
            data.ppn_amount = data.ppn_amount_temp
            data.total = parseFloat(data.dpp_amount) - parseFloat(data.potongan)
			data.items.forEach(element => {
				element.with_ppn_param = {value: 'n', label: 'Tidak'}
				element.with_ppn = 'n'					
			});
		}
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, update_ppn: true, item: true },
			data: data
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, update_ppn: false, item: false },
				}))
			}, 10);
		});
	}

    fetchTaxInvoice = () => {
        let data = this.state.data
        let param = {
            company_id: data.purchasing_org_id,
            vendor_sap_code: data.vendor_sap_code,
        }
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, with_holding_tax: true},
		}));
        this.props.fetchTaxInvoice(param)
            .then((resp) => {
                let datas = resp.data.data
                let arr = []
                console.log(datas)
                Object.keys(datas).map(function (key, index) {
                    datas[key].description = null
                    datas[key].w_tax_code_temp = null
                    datas[key].w_tax_code.forEach(d => {
                        d.value = d.w_tax_code
                        d.label = d.w_tax_code + ' - ' + d.description
                    });
                    arr.push(datas[key])
                    return true
                });
                console.log(arr)
                data.with_holding_tax = arr
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, with_holding_tax: false},
                    loadingSubmit: false,
                    data: data,
                    status_edit_wh_tax: true
                }));
                toastr.success(resp.data.message);
            })
            .catch(error => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, with_holding_tax: false},
                    loadingSubmit: false
                }));
                if (error !== undefined) {
                    toastr.error(error.data.message);
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
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

    render(){
		const {t} = this.props;
		// console.log(this.state.purchasing_requisition.items_tender_selected);
		return (
			<div>
                {this.state.loading && (
                    <center>
                    <br />
                    <ReactLoading type="cylon" color="#0f9e3e" />
                    <br />
                    </center>
                )}
                {this.state.loading === false && (
                    <Form
                        toggleOpenPreview={this.toggleOpenPreview}
                        toggleConfirm={this.toggleConfirm}
                        errors={this.state.errors}
                        isVerifikasi={this.state.isVerifikasi}
                        isVendor={this.state.isVendor}
                        loadings={this.state.loadings}
                        status_ppn={this.state.status_ppn}
                        statusLampiranVendor={this.state.statusLampiranVendor}
                        statusLampiranInternal={this.state.statusLampiranInternal}
                        status_reject={this.state.status_reject}
                        user={this.props.user}
                        data={this.state.data}
                        data_lampiran_vendor={this.state.data_lampiran_vendor}
                        data_lampiran_internal={this.state.data_lampiran_internal}
                        param_option={this.state.param_option}
                        setOptionItem={this.setOptionItem}
                        setOptionAddCost={this.setOptionAddCost}
                        setOptionPenalty={this.setOptionPenalty}
                        param_tax={this.state.param_tax}
                        param_lampiran_vendor={this.state.param_lampiran_vendor}
                        param_lampiran_internal={this.state.param_lampiran_internal}
                        setOptionLampiranInternal={this.setOptionLampiranInternal}
                        addLampiranInternal={this.addLampiranInternal}
                        deleteLampiranInternal={this.deleteLampiranInternal}
                        setOptionLampiranVendor={this.setOptionLampiranVendor}
                        addLampiranVendor={this.addLampiranVendor}
                        deleteLampiranVendor={this.deleteLampiranVendor}
                        fetchTaxInvoice={this.fetchTaxInvoice}
                        fileUpload={this.props.fileUpload}
                        fetchBank={this.fetchRekeningBank}
                        fetchPaymentMethod={this.fetchPaymentMethod}
                        fetchPaymentBlock={this.fetchPaymentBlock}
                        fetchSelectHouseBank={this.fetchSelectHouseBank}
                        fetchSelectAccountId={this.fetchSelectAccountId}
                        fetchReferenceKey={this.fetchReferenceKey}
                        fetchTax={this.fetchTax}
                        fetchTermsOfPayment={this.fetchTermsOfPayment}
                        submitInvoice={this.submitInvoice}
                        updateStatusInvoice={this.updateStatusInvoice}
                        submitInvoiceSAP={this.submitInvoiceSAP}
                        postingInvoiceSAP={this.postingInvoiceSAP}
                        uploadLampiranInvoice={this.uploadLampiranInvoice}
                        toggleDelete={this.toggleDelete}
                        modalPenalty={this.modalPenalty}
                        modalSimulate={this.modalSimulate}
                        setOptionParamSAP={this.setOptionParamSAP}
                        setOption={this.setOption}
                        scanFakturPajak={this.scanFakturPajak}
                        status_edit_ppn={this.state.status_edit_ppn}
                        status_edit_wh_tax={this.state.status_edit_wh_tax}
                        status_mvp={this.state.status_mvp}
                        loadingSubmit={this.state.loadingSubmit}
                        check_reverse={this.state.check_reverse}
                        alasan_reverse={this.state.alasan_reverse}
                        status_reverse={this.state.status_reverse}
                        setCheckReverse={this.setCheckReverse}
                        setReverse={this.setReverse}
                        param_reverse={this.state.param_reverse}
                        reverseInvoice={this.reverseInvoice}
                        toggleReverse={this.toggleReverse}
                    />
                )}
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
		showInvoice: (id) => dispatch(showInvoice(id)),
		showSimulateInvoice: (id) => dispatch(showSimulateInvoice(id)),
        submitInvoice: (id, payload) => dispatch(submitInvoice(id, payload)),
        updateItemInvoice: (payload) => dispatch(updateItemInvoice(payload)),
        updateStatusInvoice: (id, payload) => dispatch(updateStatusInvoice(id, payload)),
        updateAmountInvoice: (id, payload) => dispatch(updateAmountInvoice(id, payload)),
        submitInvoiceSAP: (id, payload) => dispatch(submitInvoiceSAP(id, payload)),
        postingInvoiceSAP: (id, payload) => dispatch(postingInvoiceSAP(id, payload)),
		createPenalty: (payload) => dispatch(createPenalty(payload)),
		updatePenalty: (payload) => dispatch(updatePenalty(payload)),
		deletePenalty: (id) => dispatch(deletePenalty(id)),
		fetchRekeningBank: (params) => dispatch(fetchRekeningBank(params)),
		fetchPaymentBlock: (params) => dispatch(fetchPaymentBlock(params)),
		fetchPaymentMethod: (params) => dispatch(fetchPaymentMethod(params)),
		fetchSelectHouseBank: (params) => dispatch(fetchSelectHouseBank(params)),
		fetchSelectAccountId: (params) => dispatch(fetchSelectAccountId(params)),
		fetchReferenceKey: (params) => dispatch(fetchReferenceKey(params)),
		fetchTax: (params) => dispatch(fetchTax(params)),
		fetchTermsOfPayment: (params) => dispatch(fetchTermsOfPayment(params)),
        fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
        fetchAssets: (params) => dispatch(fetchAssets(params)),
        fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
        fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
        fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
		cetakInvoice: (id) => dispatch(cetakInvoice(id)),
        scanFakturPajak: (id, params) => dispatch(scanFakturPajak(id, params)),
        uploadLampiranInvoice: (params) => dispatch(uploadLampiranInvoice(params)),
        fetchDocumentInvoice: (id) => dispatch(fetchDocumentInvoice(id)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        reverseInvoice: (id, payload) => dispatch(reverseInvoice(id, payload)),
        fetchTaxInvoice: (params) => dispatch(fetchTaxInvoice(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (DetailInvoiceManagement));