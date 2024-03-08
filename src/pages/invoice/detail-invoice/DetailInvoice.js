import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
import { showInvoice, submitInvoice, updateItemInvoice, updateStatusInvoice, updateAmountInvoice, submitInvoiceSAP, showSimulateInvoice,
        cetakInvoice, postingInvoiceSAP, scanFakturPajak, uploadLampiranInvoice, fetchDocumentInvoice, reverseInvoice, fetchTaxInvoice, deleteLampiranInvoice, 
        savePenaltyInvoice, updatePenaltyInvoice, deletePenaltyInvoice,
    } from '../../../store/actions/invoice/invoiceActions';
import { fetchRekeningBank } from '../../../store/actions/vendor/profile-vendor/rekeningBankActions';
import { fetchPaymentBlock } from '../../../store/actions/invoice/paymentBlockActions';
import { fetchPaymentMethod } from '../../../store/actions/invoice/paymentMethodActions';
import { fetchSelectHouseBank, fetchSelectAccountId } from '../../../store/actions/invoice/houseBankActions';
import { fetchReferenceKey } from '../../../store/actions/invoice/referenceKeyActions';
import { fetchTax } from '../../../store/actions/master/masterTaxActions';
import { fetchTermsOfPayment } from '../../../store/actions/master/termsOfPaymentActions';
import { fetchAccAssignmentCategory } from '../../../store/actions/master/accAssignmentCategoryActions';
import { fetchCostCenter } from '../../../store/actions/master/costCenterActions';
import { fetchProfitCenter } from '../../../store/actions/master/invoiceProfitCenterActions';
import { fetchGlAccount } from '../../../store/actions/master/glAccountActions';
import { fileUpload } from '../../../store/actions/uploadActions';
import Form from './invoice/Form';
import ModalPenalty from './invoice/ModalPenalty';
import KonfirmasiCetak from '../unbilled/invoice/KonfirmasiCetak';
import KonfirmasiReverse from './invoice/KonfirmasiReverse';
import KonfirmasiPosting from './invoice/KonfirmasiPosting';
import {replaceAll} from '../../../helpers/formatNumber';
// import DetailOA from './sub/DetailOA';
// import { formatDate } from '../../../helpers/formatDate';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import ModalSimulate from './invoice/ModalSimulate';
import Preview from '../../../components/modal/preview/Preview';
// import { formatNumber2 } from '../../../helpers/formatNumber';

class DetailInvoice extends Component {
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
                        value: 'H',
                        label: 'Credit', 
					},
                    {
                        value: 'S',
                        label: 'Debit', 
					},
				],
				m_payment_block: [],
                m_payment_method: [],
                m_house_bank: [],
                m_account_id: [],
                m_reference_key: [],
                gl_account: [],
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
                cost_center_id: true,
                profit_center_id: true,
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
                        value: 'Potongan Mutu',
                        label: 'Potongan Mutu',
                    },
                    {
                        value: 'Denda Keterlambatan',
                        label: 'Denda Keterlambatan',
                    },
                    {
                        value: 'Additional Expense',
                        label: 'Additional Expense',
                    },
                ],
                m_jenis_pembebanan: [
                    {
                        value: 'Inventory',
                        label: 'Inventory',
                    },
                    {
                        value: 'Non Inventory',
                        label: 'Non Inventory',
                    },
                ],
				m_debit_credit: [
					{
                        value: 'H',
                        label: 'Credit', 
					},
                    {
                        value: 'S',
                        label: 'Debit', 
					},
				],
                m_acc_assgn_category: [],
                m_gl_account: [],
                m_cost_center: [],
                m_profit_center: [],
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
                    if (datas.total_add_cost === null) {
                        datas.total_add_cost = 0
                    }
                    datas.total_add_cost_temp = datas.total_add_cost
                    datas.amount_temp = datas.amount
                    datas.ppn_amount_temp = datas.ppn_amount
                    datas.dpp_amount_temp = datas.dpp_amount
                    datas.potongan_temp = datas.potongan
                    datas.total_temp = datas.total

                    datas.penalty.forEach(element => {
                        element.debit_credit_temp = element.debit_credit
                    });
                    datas.items.forEach(element => {
                        element.qty_awal = element.qty
                    });
                    datas.penalty_add_cost.forEach(element => {
                        element.debit_credit_temp = element.debit_credit
                        element.qty_awal = element.qty
                    });
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
                        this.fetchGlAccountHeader()
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
        let company_id = data.purchasing_org_id
		this.setState({loadingSubmit: true})
        this.props.scanFakturPajak(company_id, payload)
            .then((resp) => {
                console.log(resp)
                let datas = resp.data.data;
                data.number = datas.nomor_invoice !== null ? datas.nomor_invoice : data.number;
                data.faktur_pajak_no = datas.nomor !== null ? datas.nomor : data.faktur_pajak_no;
                data.faktur_tanggal = datas.tanggal !== null ? datas.tanggal : data.faktur_tanggal;
                data.note_vendor = datas.nama !== null ? datas.nama : data.note_vendor;
                if (data.note_vendor !== null) {
                    if (data.note_vendor.length > 50) {
                        data.note_vendor.substring(0, 50)
                    }
                }
				data.faktur_status = datas?.status_approval;
				data.invoice_date = datas.tanggal !== null ? datas.tanggal : data.invoice_date;
                data.dpp_amount = datas.kena_pajak !== null ? datas.kena_pajak : data.dpp_amount;
                data.ppn_amount = datas.ppn !== null ? datas.ppn : data.ppn_amount;
                data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2);
                if (data.faktur_pajak_no !== null) {
                    if (data.faktur_pajak_no.length > 0) {
                        if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
                            data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
                        }
                    }
                }

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
        let select_params = (newValue !== '') ? {start: 0, select: newValue} : {start: 0};
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
            {start: 0, select: newValue, company_id: this.props.user.company_id} :
            {start: 0, company_id: this.props.user.company_id};
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
        let select_params = (newValue !== '') ? {select: newValue} : '';
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
        // return
        let data = this.state.data
        let items = data.items
        let add_cost = data.add_cost
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
			if (payload.with_ppn.value === 'y') {
                if (items.length > 0) {
                    if (!items.some(d => d.with_ppn === 'y')) {
                        this.setState({ status_ppn: true })
                        status = true
                    }
                }
                else {
                    if (!add_cost.some(d => d.with_ppn === 'y')) {
                        this.setState({ status_ppn: true })
                        status = true
                    }
                }
			}
			else {
                if (items.length > 0) {
                    if (items.some(d => d.with_ppn === 'y')) {
                        this.setState({ status_ppn: true })
                        status = true
                    }
                }
                else {
                    if (add_cost.some(d => d.with_ppn === 'y')) {
                        this.setState({ status_ppn: true })
                        status = true
                    }
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
            if (data.document_po_confirm.length > 0) {
                data.document_po_confirm.forEach(element => {
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
            if (payload.rekening_bank_id === null) {
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

        payload.uuid = this.state.data.uuid
		payload.attachment = this.state.data_lampiran_vendor
		payload.rekening_bank_id = payload.rekening_bank_id?.value
		payload.with_ppn = payload.with_ppn?.value
		payload.items = items
		payload.add_cost = add_cost
		payload.document_po_confirm = data.document_po_confirm
        if (payload.faktur_status === '') {			
            payload.faktur_status = null
        }
        // console.log(payload)
        // return
        if (payload.status === 'submitted') {
            this.modalConfirm(payload)
        }
        else {
            this.submitInvoice(payload)
        }
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
                    this.setState({isConfirm: false}, () => {
                        this.modalCetak(payload)
                    })
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
        // console.log(payload)
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
        let status_reject = false
        if (payload.status === 'rejected_1' || payload.status === 'rejected_2') {
            if (payload.note === null || payload.note === '') {
                status_reject = true
            }
        }
        if (status_reject) {
            toastr.error('Mohon isi catatan terlebih dahulu')
            return
        }
		payload.uuid = this.state.data.uuid
		payload.attachment = this.state.data_lampiran_internal
        // console.log(payload)
        // return

        this.props.updateStatusInvoice(this.state.data.uuid, payload)
            .then((resp) => {
                this.setState({loadingSubmit: false, isConfirm: false})
                toastr.success(resp.data.message);
                if (payload.status === 'approved_2') {
                    window.location.reload()
                }
                else if (payload.status === 'approved_1') {
                    this.props.history.push('/invoice/invoice-management')
                }
                else if (payload.status === 'rejected_1' || payload.status === 'rejected_2') {
                    this.props.history.push('/invoice/invoice-management')
                }
                else {
                    window.history.back()
                }
            })
            .catch(error => {
                this.setState({loadingSubmit: false, isConfirm: false})
                console.log("kliked")
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    // if (typeof error.data.errors === 'object' && error.data.errors !== null){
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    // }else{
                    //     toastr.error(error.data.errors)
                    // }
                    this.setState({ isError: true, errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    submitInvoiceSAP = (payload, code) => {
        let data = this.state.data
        if (data.note_vendor === undefined || data.note_vendor === null || data.note_vendor === '') {
            toastr.error('Mohon lengkapi data Keterangan')
            return
        }
        this.setState({loadingSubmit: true})
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
        let data_lampiran_vendor = this.state.data_lampiran_vendor
        if(data_lampiran_vendor[key]['uuid'] !== undefined) {
            let uuid = data_lampiran_vendor[key]['uuid']
            this.props.deleteLampiranInvoice(uuid)
                .then((resp) => {
                    toastr.success(resp.data.message);
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
        else {
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
        let data_lampiran_internal = this.state.data_lampiran_internal
        if(data_lampiran_internal[key]['uuid'] !== undefined) {
            let uuid = data_lampiran_internal[key]['uuid']
            this.props.deleteLampiranInvoice(uuid)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    delete data_lampiran_internal[key];
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, list_lampiran_internal: true },
                        isConfirm: false,
                    }), () => {
                        let new_data = []
                        data_lampiran_internal.map(function(d, i) {
                            return new_data.push(d)
                        })
                        setTimeout(() => {
                            this.setState(({ loadings }) => ({
                                loadings: { ...loadings, list_lampiran_internal: false },
                                data_lampiran_internal: new_data,
                            }))
                        })
                    })
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
        else {
            delete data_lampiran_internal[key];
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, list_lampiran_internal: true },
                isConfirm: false,
            }), () => {
                let new_data = []
                data_lampiran_internal.map(function(d, i) {
                    return new_data.push(d)
                })
                setTimeout(() => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, list_lampiran_internal: false },
                        data_lampiran_internal: new_data,
                    }))
                })
            })
        }
    }

    toggleClose = () => {
		this.setState({ modalOpen: false, loadingSubmit: false })
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
            case 'penalty-add-cost':
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
        this.setState({ isConfirm: false });
        switch (name) {
            case 'penalty':
                this.deletePenalty(this.state.uuid_temp, 'item')
                break;
            case 'penalty-add-cost':
                this.deletePenalty(this.state.uuid_temp, 'add_cost')
                break;
            case 'submitted':
                this.submitInvoice(this.state.param_modal)
                break;
            case 'approved_1':
                this.updateStatusInvoice(this.state.param_modal)
                break;
            case 'approved_2':
                this.submitInvoiceSAP(this.state.param_modal, 'approve')
                break;
            case 'rejected_1':
                this.updateStatusInvoice(this.state.param_modal)
                break;
            case 'rejected_2':
                this.updateStatusInvoice(this.state.param_modal)
                break;
            case 'posted':
                this.postingInvoiceSAP()
                break;
            case 'reverse':
                this.reverseInvoice()
                break;
            case 'lampiran-vendor':
                this.deleteLampiranVendor(this.state.uuid_temp)
                break;
            case 'lampiran-internal':
                this.deleteLampiranInternal(this.state.uuid_temp)
                break;
            default:
                this.setState({ loadingSubmit:false, isConfirm: false, uuid_temp: '' });
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
        let new_value = 0
        switch(code) {
            case 'net_value':
                new_value = this.formatValue(payload)

                data.total = (parseFloat(data.total) - parseFloat(data.amount)).toFixed(2)
                data.amount = (parseFloat(data.amount) - parseFloat(data.items[key].net_value)).toFixed(2)

                data.items[key].net_value = parseFloat(new_value)
                data.amount = (parseFloat(data.amount) + parseFloat(data.items[key].net_value)).toFixed(2)
                data.total = (parseFloat(data.total) + parseFloat(data.amount)).toFixed(2)

                break;
            case 'qty':
                new_value = this.formatValue(payload)
                data.items[key].qty = new_value

                data.total = (parseFloat(data.total) - parseFloat(data.amount)).toFixed(2)
                data.amount = (parseFloat(data.amount) - parseFloat(data.items[key].net_value)).toFixed(2)

                data.items[key].net_value = (parseFloat(new_value) * parseFloat(data.items[key].unit_price)).toFixed(2)
                data.amount = (parseFloat(data.amount) + parseFloat(data.items[key].net_value)).toFixed(2)
                data.total = (parseFloat(data.total) + parseFloat(data.amount)).toFixed(2)

                break;
            case 'ppn':
                data.items[key].with_ppn = payload.value
                if (payload.value === 'y') {
                    status = false
                }
                break;
            case 'tax':
                status_edit_amount = true
                data.items[key].tax_id = payload.value
                data.items[key].tax_value = payload.param
                break;
            default:
                break;
        }
        this.setState({ data: data, status_ppn: status, status_edit_amount: status_edit_amount }, () => {
            this.setState({ data: data})
        })
    }

	setOptionAddCost = async (payload, code, key) => {
        let data = this.state.data
        let status = this.state.status_ppn
        let status_edit_amount = false
        let new_value = 0
        switch(code) {
            case 'net_value':
                new_value = this.formatValue(payload)

                data.total = (parseFloat(data.total) - parseFloat(data.total_add_cost)).toFixed(2)
                data.total_add_cost = (parseFloat(data.total_add_cost) - parseFloat(data.add_cost[key].net_value)).toFixed(2)

                data.add_cost[key].net_value = parseFloat(new_value)
                data.total_add_cost = (parseFloat(data.total_add_cost) + parseFloat(data.add_cost[key].net_value)).toFixed(2)
                data.total = (parseFloat(data.total) + parseFloat(data.total_add_cost)).toFixed(2)

                break;
            case 'qty':
                new_value = this.formatValue(payload)
                data.add_cost[key].qty = new_value

                data.total = (parseFloat(data.total) - parseFloat(data.total_add_cost)).toFixed(2)
                data.total_add_cost = (parseFloat(data.total_add_cost) - parseFloat(data.add_cost[key].net_value)).toFixed(2)

                data.add_cost[key].net_value = (parseFloat(new_value) * parseFloat(data.add_cost[key].unit_price)).toFixed(2)
                data.add_cost[key].amount_confirm = data.add_cost[key].net_value
                data.total_add_cost = (parseFloat(data.total_add_cost) + parseFloat(data.add_cost[key].net_value)).toFixed(2)
                data.total = (parseFloat(data.total) + parseFloat(data.total_add_cost)).toFixed(2)
                break;
            case 'ppn':
                data.add_cost[key].with_ppn = payload.value
                if (payload.value === 'y') {
                    status = false
                }
                break;
            case 'tax':
                status_edit_amount = true
                data.add_cost[key].tax_id = payload.value
                data.add_cost[key].tax_value = payload.param
                break;
            default:
                break;
        }
        // console.log(data)
        this.setState({ data: data, status_ppn: status, status_edit_amount: status_edit_amount }, () => {
            // console.log(data.add_cost[key].net_value)
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
                data.penalty_add_cost.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                data.potongan = potongan
                data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2)
                if (data.faktur_pajak_no !== null) {
                    if (data.faktur_pajak_no.length > 0) {
                        if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
                            data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
                        }
                    }
                }
                break;
            default:
                break;
        }
        this.setState({ data: data })
    }

	setOptionPenaltyAddCost = async (payload, code, key) => {
        let data = this.state.data
        switch(code) {
            case 'debit-credit':
                data.penalty_add_cost[key].debit_credit = payload.value
                let potongan = 0
                data.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                data.penalty_add_cost.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });
                data.potongan = potongan
                data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2)
                if (data.faktur_pajak_no !== null) {
                    if (data.faktur_pajak_no.length > 0) {
                        if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
                            data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
                        }
                    }
                }
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
                let options = []
                data.forEach(element => {
                    if (element.id === 'F' || element.id === 'K' || element.id === 'P' || element.id === 'Q' || element.id === 'N' || element.id === 'T') {
                        options.push({ value: element.id, label: element.id + ' - ' + element.name})
                    }
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

    fetchProfitCenter = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, profit_center_id: true },
        }));
        let select_params = (newValue !== '') ?
            { start: 0, length: 10, select: newValue, company_id: this.props.user.company_id } :
            { start: 0, length: 10, company_id: this.props.user.company_id };
        this.props.fetchProfitCenter(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.profit_ctr_code, label: data.profit_ctr_code + ' - ' + data.profit_name};
                });
                this.setState(({ loadings, data_option }) => ({
                    loadings: { ...loadings, profit_center_id: false },
                    data_option: { ...data_option, m_profit_center: options },
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, profit_center_id: false },
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

    fetchGlAccountHeader = (newValue) => {
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
                this.setState(({ loadings, param_option }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                    param_option: { ...param_option, m_gl_account: options },
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, gl_account_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    modalPenalty = (data, code) => {
        this.fetchGlAccount('')
        this.fetchAccAssignmentCategory('')
        this.fetchCostCenter('')
        this.fetchProfitCenter('')

        let arr_item = []
        if (code === 'item') {
            this.state.data.items.forEach(element => {
                arr_item.push({value: element.id, label: element.goods_receipt_number + ' - ' + element.goods_receipt_item_no})
            });
        }
        else {
            this.state.data.add_cost.forEach(element => {
                arr_item.push({value: element.id, label: element.goods_receipt_number + ' - ' + element.goods_receipt_item_no + ' - ' + element.conditional_type + ' - ' + element.condition_type_description})
            });
        }

        let param_modal = []
        if (Object.keys(data).length !== 0) {
            // param_modal = data
            param_modal.id = data.id
            param_modal.invoice_item_id = {value: data.invoice_item_id,
                label: code === 'item' ?
                    data.goods_receipt_number + ' - ' + data.goods_receipt_item_no :
                    data.goods_receipt_number + ' - ' + data.goods_receipt_item_no + ' - ' + data.conditional_type + ' - ' + data.conditional_type_description
                }
            param_modal.penalty_type = {value: data.penalty_type, label: data.penalty_type}
            param_modal.amount = data.amount
            param_modal.description = data.description
            param_modal.description = data.description
            param_modal.file = data.file
            param_modal.gl_account = []
            if (data.gl_account !== null) {
                param_modal.gl_account = {value: data.gl_account, label: data.gl_account + ' - ' + data.gl_account_name}
            }
            param_modal.ass_category = []
            if (data.acc_assigment_category_id !== null) {
                param_modal.ass_category = {value: data.acc_assigment_category_id, label: data.acc_assigment_category_id + ' - ' + data.acc_assigment_category_name}
            }
            param_modal.object = data.acc_assigment_category_number
            if (data.acc_assigment_category_id === 'K' || data.acc_assigment_category_id === 'T') {
                param_modal.object = []
                if (data.acc_assigment_category_number !== null) {
                    param_modal.object = {value: data.acc_assigment_category_number, label: data.acc_assigment_category_number}
                }
            }
            param_modal.debit_credit = []
            if (data.debit_credit !== null) {
                param_modal.debit_credit = {value: data.debit_credit, label: data.debit_credit === 'H' ? 'Credit' : 'Debit'}
            }
        }

        param_modal.code = code
        this.setState(({ data_option }) => ({
            data_option: { ...data_option, m_item: arr_item },
            modalOpen: true,
            modalType: 'penalty',
            param_modal: param_modal,
        }));
	}

    modalConfirm = (payload) => {
        let code = payload.status
        let title = ''
        if (code === 'reverse') {
            let status_reverse = false
            let param_reverse = this.state.param_reverse

            if (this.state.check_reverse === false) {
                status_reverse = true
                toastr.error('Mohon centang Reverse Posted Invoice')
            }
            if (param_reverse.reason_reversal === null) {
                status_reverse = true
                toastr.error('Mohon pilih Alasan Reverse Posted Invoice')
            }
            if (this.state.check_reverse === false) {
                status_reverse = true
                toastr.error('Mohon lengkapi Tanggal Reverse Posted Invoice')
            }
            if (status_reverse) {
                return
            }
        }
        if (code === 'submitted' || code === 'approved_1' || code === 'approved_2') {
            if (payload.note_vendor === undefined || payload.note_vendor === null || payload.note_vendor === '') {
                toastr.error('Mohon lengkapi data Keterangan')
                return
            }
        }

        switch (code) {
            case 'submitted':
                title = 'Submit Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'rejected_1':
                title = 'Reject Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'rejected_2':
                title = 'Reject Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'approved_1':
                title = 'Approve Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'approved_2':
                title = 'Approve Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'posted':
                title = 'Posting Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            case 'reverse':
                title = 'Reverse Invoice, ' + this.props.t("common:delete.title-delete")
                break;
            default:
                title = this.props.t("common:delete.title-delete")
                break;
        }
        this.setState({ loadingSubmit: true, isConfirm: true, code_confirm: code,
            color_confirm: "success", param_modal: payload, title: title })
    }

    createPenalty = (payload) => {
        let gl_account = ''
        let gl_account_name = ''
        let acc_assigment_category_id = ''
        let acc_assigment_category_name = ''
        let acc_assigment_category_number = ''
        let status = false;
        if (payload.invoice_item_id === undefined || payload.invoice_item_id === null) {
            toastr.error('Mohon pilih Item GR/SA')
            status = true
        }
        if (payload.penalty_type === undefined || payload.penalty_type === null) {
            toastr.error('Mohon pilih Jenis Penalty')
            status = true
        }
        if (payload.gl_account === undefined || payload.gl_account === null) {
            toastr.error('Mohon pilih G/L Account')
            status = true
        }
        if (payload.gl_account !== undefined || payload.gl_account !== null) {
            if (payload.gl_account.value !== undefined) {
                let length_gl_account_id = payload.gl_account.value.length + 3
                gl_account_name = payload.gl_account.label.substr(length_gl_account_id, payload.gl_account.label.length - length_gl_account_id)
                gl_account = payload.gl_account.value
            }
            else {
                toastr.error('Mohon pilih G/L Account')
                status = true
            }
        }
        if (payload.ass_category !== undefined && payload.ass_category !== null) {
            if (payload.ass_category.value !== undefined) {
                let length_acc_assigment_category_id = payload.ass_category.value.length + 3
                acc_assigment_category_id = payload.ass_category.value
                acc_assigment_category_name = payload.ass_category.label.substr(length_acc_assigment_category_id, payload.ass_category.label.length - length_acc_assigment_category_id)
                acc_assigment_category_number = payload.object

                if (payload.object.value !== undefined) {
                    acc_assigment_category_number = payload.object.value
                }
            }
        }
        if (status) {
            return
        }

        let param_add = {
            invoice_item_id: payload.invoice_item_id.value,
            penalty_type: payload.penalty_type.label,
            amount: this.formatValue(payload.amount),
            currency: payload.currency,
            description: payload.description,
            file: payload.file_name,
            debit_credit: payload.debit_credit.value !== undefined ? payload.debit_credit.value : (payload.penalty_type.label === 'Additional Expense' ? 'S' : 'H'),
            // jenis_pembebanan: payload.jenis_pembebanan.label,
            jenis_pembebanan: payload.jenis_pembebanan,
            gl_account: gl_account,
            gl_account_name: gl_account_name,
            acc_assigment_category_id: acc_assigment_category_id,
            acc_assigment_category_name: acc_assigment_category_name,
            acc_assigment_category_number: acc_assigment_category_number,
            // acc_assigment_category_number_name: acc_assigment_category_number_name,
        }
        this.setState(({loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true},
            loadingSubmit: true
        }));

        if (payload.id !== '') {
            param_add.id = payload.id
            this.updatePenalty(param_add)
            return
        }

        let param = {
            param_add: [],
            param_delete: this.state.delete_penalty,
        }

        param.param_add.push(param_add)

        payload.amount = this.formatValue(payload.amount)
        console.log(payload.amount)

        this.props.savePenaltyInvoice(param)
            .then((resp) => {
                this.props.showInvoice(this.props.match.params.id)
                    .then((resp2) => {
                        let datas = resp2.data.data
                        if (this.state.param_modal.code === 'item') {
                            datas.penalty.forEach(element => {
                                element.debit_credit_temp = element.debit_credit
                            });
                            let index = datas.penalty.findIndex(d => d.id === resp.data.data[0].id)
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty: datas.penalty},
                                loadings: { ...loadings, loading_list_penalty: false}
                            }), () => {
                                this.setAmountPenalty(datas.penalty[index], 'add')
                            });
                        }
                        else {
                            datas.penalty_add_cost.forEach(element => {
                                element.debit_credit_temp = element.debit_credit
                            });
                            let index = datas.penalty_add_cost.findIndex(d => d.id === resp.data.data[0].id)
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty_add_cost: datas.penalty_add_cost},
                                loadings: { ...loadings, loading_list_penalty: false}
                            }), () => {
                                this.setAmountPenalty(datas.penalty_add_cost[index], 'add')
                            });
                        }
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

    updatePenalty = (payload) => {
        // console.log(payload)
        let param = {
            penalty: []
        }
        param.penalty.push(payload)
        this.props.updatePenaltyInvoice(param)
            .then((resp) => {
                this.props.showInvoice(this.props.match.params.id)
                    .then((resp2) => {
                        let datas = resp2.data.data
                        let datas_origin = this.state.data
                        let index = ''
                        if (this.state.param_modal.code === 'item') {
                            index = datas_origin.penalty.findIndex(d => String(d.id) === String(payload.id))
    
                            // reset data old
                            datas_origin.total = (datas_origin.penalty[index].debit_credit === 'H') ? 
                                (parseFloat(datas_origin.total) + parseFloat(datas_origin.penalty[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total) - parseFloat(datas_origin.penalty[index].amount)).toFixed(2)
                            datas_origin.total_temp = (datas_origin.penalty[index].debit_credit === 'H') ? 
                                (parseFloat(datas_origin.total_temp) + parseFloat(datas_origin.penalty[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total_temp) - parseFloat(datas_origin.penalty[index].amount)).toFixed(2)
                            datas_origin.potongan = (datas_origin.penalty[index].debit_credit === 'H') ?
                                parseFloat(datas_origin.potongan) - parseFloat(datas_origin.penalty[index].amount) :
                                parseFloat(datas_origin.potongan) + parseFloat(datas_origin.penalty[index].amount)
                            datas_origin.potongan_temp = (datas_origin.penalty[index].debit_credit === 'H') ?
                                parseFloat(datas_origin.potongan_temp) - parseFloat(datas_origin.penalty[index].amount) :
                                parseFloat(datas_origin.potongan_temp) + parseFloat(datas_origin.penalty[index].amount)
    
                            // set data new
                            datas_origin.potongan = datas.penalty[index].debit_credit === 'H' ?
                                parseFloat(datas_origin.potongan) + parseFloat(datas.penalty[index].amount) :
                                parseFloat(datas_origin.potongan) - parseFloat(datas.penalty[index].amount)
                            datas_origin.potongan_temp = datas.penalty[index].debit_credit === 'H' ?
                                parseFloat(datas_origin.potongan_temp) + parseFloat(datas.penalty[index].amount) :
                                parseFloat(datas_origin.potongan_temp) - parseFloat(datas.penalty[index].amount)
                            datas_origin.total = datas.penalty[index].debit_credit === 'H' ?
                                (parseFloat(datas_origin.total) - parseFloat(datas.penalty[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total) + parseFloat(datas.penalty[index].amount)).toFixed(2)
                            datas_origin.total_temp = datas.penalty[index].debit_credit === 'H' ?
                                (parseFloat(datas_origin.total_temp) - parseFloat(datas.penalty[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total_temp) + parseFloat(datas.penalty[index].amount)).toFixed(2)
                            
                            datas_origin.penalty[index] = datas.penalty[index]
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty: datas.penalty},
                                loadings: { ...loadings, loading_list_penalty: false},
                                loadingSubmit: false
                            }), () => {
                                this.updateAmountInvoice(datas_origin, [], 'penalty')
                            });
                        }
                        else {
                            index = datas_origin.penalty_add_cost.findIndex(d => String(d.id) === String(payload.id))
    
                            // reset data old
                            datas_origin.total = (datas_origin.penalty_add_cost[index].debit_credit === 'H') ? 
                                (parseFloat(datas_origin.total) + parseFloat(datas_origin.penalty_add_cost[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total) - parseFloat(datas_origin.penalty_add_cost[index].amount)).toFixed(2)
                            datas_origin.total_temp = (datas_origin.penalty_add_cost[index].debit_credit === 'H') ? 
                                (parseFloat(datas_origin.total_temp) + parseFloat(datas_origin.penalty_add_cost[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total_temp) - parseFloat(datas_origin.penalty_add_cost[index].amount)).toFixed(2)
                            datas_origin.potongan = (datas_origin.penalty_add_cost[index].debit_credit === 'H') ?
                                parseFloat(datas_origin.potongan) - parseFloat(datas_origin.penalty_add_cost[index].amount) :
                                parseFloat(datas_origin.potongan) + parseFloat(datas_origin.penalty_add_cost[index].amount)
                            datas_origin.potongan_temp = (datas_origin.penalty_add_cost[index].debit_credit === 'H') ?
                                parseFloat(datas_origin.potongan_temp) - parseFloat(datas_origin.penalty_add_cost[index].amount) :
                                parseFloat(datas_origin.potongan_temp) + parseFloat(datas_origin.penalty_add_cost[index].amount)
    
                            // set data new
                            datas_origin.potongan = datas.penalty_add_cost[index].debit_credit === 'H' ?
                                parseFloat(datas_origin.potongan) + parseFloat(datas.penalty_add_cost[index].amount) :
                                parseFloat(datas_origin.potongan) - parseFloat(datas.penalty_add_cost[index].amount)
                            datas_origin.potongan_temp = datas.penalty_add_cost[index].debit_credit === 'H' ?
                                parseFloat(datas_origin.potongan_temp) + parseFloat(datas.penalty_add_cost[index].amount) :
                                parseFloat(datas_origin.potongan_temp) - parseFloat(datas.penalty_add_cost[index].amount)
                            datas_origin.total = datas.penalty_add_cost[index].debit_credit === 'H' ?
                                (parseFloat(datas_origin.total) - parseFloat(datas.penalty_add_cost[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total) + parseFloat(datas.penalty_add_cost[index].amount)).toFixed(2)
                            datas_origin.total_temp = datas.penalty_add_cost[index].debit_credit === 'H' ?
                                (parseFloat(datas_origin.total_temp) - parseFloat(datas.penalty_add_cost[index].amount)).toFixed(2) :
                                (parseFloat(datas_origin.total_temp) + parseFloat(datas.penalty_add_cost[index].amount)).toFixed(2)
                            
                            datas_origin.penalty_add_cost[index] = datas.penalty_add_cost[index]
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty_add_cost: datas.penalty_add_cost},
                                loadings: { ...loadings, loading_list_penalty: false},
                                loadingSubmit: false
                            }), () => {
                                this.updateAmountInvoice(datas_origin, [], 'penalty')
                            });
                        }
                    })
                    .catch(error => {
                        this.setState({ isConfirm: false, loadingSubmit: false })
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

    deletePenalty = (key, code) => {
        let data = this.state.data
        let payload = ''
        if (code === 'item') {
            payload = data.penalty[key]
        }
        else {
            payload = data.penalty_add_cost[key]
        }

        this.setState(({loadings }) => ({
            loadings: { ...loadings, loading_list_penalty: true}
        }));
        this.props.deletePenaltyInvoice(payload.uuid)
            .then((resp) => {
                this.props.showInvoice(this.props.match.params.id)
                    .then((resp2) => {
                        let datas = resp2.data.data
                        if (code === 'item') {
                            datas.penalty.forEach(element => {
                                element.debit_credit_temp = element.debit_credit
                            });
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty: datas.penalty},
                                loadings: { ...loadings, loading_list_penalty: false},
                                isConfirm: false
                            }), () => {
                                this.setAmountPenalty(payload, 'delete')
                            });
                        }
                        else {
                            datas.penalty_add_cost.forEach(element => {
                                element.debit_credit_temp = element.debit_credit
                            });
                            this.setState(({ data, loadings }) => ({
                                data: { ...data, penalty_add_cost: datas.penalty_add_cost},
                                loadings: { ...loadings, loading_list_penalty: false},
                                isConfirm: false
                            }), () => {
                                this.setAmountPenalty(payload, 'delete')
                            });
                        }
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
        let amount = payload.amount
        if (payload.debit_credit_temp !== 'H') {
            amount = 0 - parseFloat(payload.amount)
        }
        console.log(payload)
        let data = this.state.data
        data.potongan_temp = code === 'add' ? parseFloat(data.potongan_temp) + parseFloat(amount)
                    : code === 'delete' ? parseFloat(data.potongan_temp) - parseFloat(amount)
                    : parseFloat(data.potongan_temp)
        data.total_temp = code === 'add' ? parseFloat(data.total_temp) - parseFloat(amount)
                    : code === 'delete' ? parseFloat(data.total_temp) + parseFloat(amount)
                    : parseFloat(data.total_temp)
        this.updateAmountInvoice(data, [], 'penalty')
    }

    updateAmountInvoice = (payload, data_param, code) => {
        // let data = this.state.data
        // console.log(payload)
        let param = {
            uuid: payload.uuid,
            amount: code === 'penalty' ? payload.amount_temp : payload.amount,
            total_add_cost: code === 'penalty' ? payload.total_add_cost_temp : payload.total_add_cost,
            dpp_amount: this.state.data.dpp_amount,
            ppn_amount: this.state.data.ppn_amount,
            potongan: code === 'penalty' ? payload.potongan_temp : payload.potongan,
            total: code === 'penalty' ? payload.total_temp : payload.total,
            // potongan: 0,
            // total: parseFloat(payload.amount_temp) + parseFloat(payload.ppn_amount_temp),
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
                let amount = 0
                let total_add_cost = 0
                let potongan = 0

                datas_origin.items.forEach(element => {
                    amount += parseFloat(element.net_value)
                });
                datas_origin.add_cost.forEach(element => {
                    total_add_cost += parseFloat(element.net_value)
                });

                datas_origin.penalty.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });

                datas_origin.penalty_add_cost.forEach(element => {
                    if (element.debit_credit === 'H') {
                        potongan += parseFloat(element.amount)
                    }
                    else {
                        potongan -= parseFloat(element.amount)
                    }
                });

                datas.amount_temp = parseFloat(datas.amount).toFixed(2)
                datas.amount = parseFloat(amount).toFixed(2)
                datas.total_add_cost_temp = parseFloat(datas.total_add_cost).toFixed(2)
                datas.total_add_cost = parseFloat(total_add_cost).toFixed(2)
                datas.potongan_temp = parseFloat(datas.potongan).toFixed(2)
                datas.potongan = parseFloat(potongan).toFixed(2)
                datas.total_temp = parseFloat(datas.total).toFixed(2)
                datas.total = (parseFloat(amount) + parseFloat(total_add_cost) + parseFloat(datas_origin.ppn_amount) - parseFloat(potongan)).toFixed(2)
                if (datas_origin.faktur_pajak_no !== null) {
                    if (datas_origin.faktur_pajak_no.length > 0) {
                        if (datas_origin.faktur_pajak_no[0] === '0' && datas_origin.faktur_pajak_no[1] === '3') {
                            datas.total = (parseFloat(amount) + parseFloat(total_add_cost) - parseFloat(potongan)).toFixed(2);
                        }
                    }
                }
                if (code === 'approve') {
                    this.setState(({loadings }) => ({
                        loadings: { ...loadings, loading_dpp: false},
                    }), () => {
                        this.updateStatusInvoice(data_param)
                    });
                }
                else if (code === 'simulate') {
                    this.setState(({loadings }) => ({
                        loadings: { ...loadings, loading_dpp: false},
                        loadingSubmit: false
                    }), () => {
                        this.modalSimulate()
                    });
                }
                else {
                    this.toggleClose()
                    this.setState(({ data, loadings }) => ({
                        data: { ...data, amount: datas.amount, amount_temp: datas.amount_temp,
                            total_add_cost: datas.total_add_cost, total_add_cost_temp: datas.total_add_cost_temp, 
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
                new_value = this.formatValue(payload)

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
            case 'exchange-rate':
                data.exchange_rate = this.formatValue(payload);
                break;
            case 'gl-account':
                data.gl_account = payload.value;
                // data.reference_1_param = payload;
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
        let status = 'n'
        switch(code) {
            // case 'ppn-amount':
            //     let new_value = this.formatValue(payload)

            //     data.ppn_amount = new_value
            //     break;
            case 'checklist':
                if (payload === false) {
                    status = 'y'
                    data.ppn_amount = data.ppn_amount_temp
                }
                break;
            default:
                break;
        }
        data.lock_ppn = status
        this.setState({ data: data })
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
                        loadingSubmit={this.state.loadingSubmit}
						errors={this.state.errors}
                        data_option={this.state.data_option}
                        data={this.state.data}
                        param_modal={this.state.param_modal}
                        createPenalty={this.createPenalty}
                        upload={this.props.fileUpload}
                        // addPenalty={this.addPenalty}
                        fetchAccAssignmentCategory={this.fetchAccAssignmentCategory}
                        fetchProfitCenter={this.fetchProfitCenter}
                        fetchCostCenter={this.fetchCostCenter}
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
        let amount = 0
		data.items.forEach(element => {
            if (element.category === 'Barang') {
                amount += parseFloat(element.net_value)
            }
            else if (element.category === 'Additional Cost') {
                amount += parseFloat(element.amount)
            }
		});
		// data.ppn_amount = ppn
		data.total = (parseFloat(amount) + parseFloat(data.add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2)
        if (data.faktur_pajak_no !== null) {
            if (data.faktur_pajak_no.length > 0) {
                if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
                    data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
                }
            }
        }
		// this.setState({ data: data, status_ppn: status })

		this.setState(({ loadings }) => ({
			loadings: { ...loadings, update_ppn: true },
			data: data,
			status_ppn: status
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, update_ppn: false },
				}))
			}, 10);
		});
	}

	setWithPPN = (payload) => {
		let data = this.state.data
		data.with_ppn = payload
		if (payload === 'y') {
			data.items.forEach(element => {
				element.with_ppn_param = {value: 'y', label: 'Ya'}
				element.with_ppn = 'y'					
			});
			data.add_cost.forEach(element => {
				element.with_ppn_param = {value: 'y', label: 'Ya'}
				element.with_ppn = 'y'					
			});
		}
		else {
            data.ppn_amount = 0
            data.total = 0
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
                // console.log(datas)
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
                // console.log(arr)
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

    resetScanFakturPajak = (e) => {
		let data = this.state.data;
		let ppn = 0
		data.number = null
		data.faktur_pajak_no = null
		data.faktur_tanggal = null
		data.note_vendor = null
		data.faktur_status = null
		data.invoice_date = null
		data.ppn_amount = ppn
		data.dpp_amount = 0
		data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2)
        if (data.faktur_pajak_no !== null) {
            if (data > 0) {
                if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
                    data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
                }
            }
        }

		this.setState(({ loadings }) => ({
			loadings: { ...loadings, form: true },
			data: data,
			loadingSubmit: false
		}), () => {
			setTimeout(() => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, form: false },
				}));
				console.log(this.state.data)
			}, 10);
		});
	}

	setDocumentPO = (payload, key) => {
		let data = this.state.data
		data.document_po_confirm[key].file = payload
		data.document_po_confirm[key].file_temp = null
		this.setState({data: data})
	}

	setValue = (payload, code) => {
		// console.log(payload)
		let data = this.state.data
		let new_value = this.formatValue(payload)

        if (code === 'ppn_amount') {
			data.ppn_amount = new_value
			data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) + parseFloat(data.ppn_amount) - parseFloat(data.potongan)).toFixed(2);
			if (data.faktur_pajak_no !== null) {
				if (data.faktur_pajak_no.length > 0) {
					if (data.faktur_pajak_no[0] === '0' && data.faktur_pajak_no[1] === '3') {
						data.total = (parseFloat(data.amount) + parseFloat(data.total_add_cost) - parseFloat(data.potongan)).toFixed(2);
					}
				}
			}
		}
		else if (code === 'dpp_amount') {
			data.dpp_amount = new_value
		}
		this.setState({ data: data })
	}

    formatValue(payload) {
        let new_value = replaceAll(payload, '.', '')
        return replaceAll(new_value, ',', '.')
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
                        resetScanFakturPajak={this.resetScanFakturPajak}
                        toggleConfirm={this.toggleConfirm}
                        setWithPPN={this.setWithPPN}
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
                        setOptionPenaltyAddCost={this.setOptionPenaltyAddCost}
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
                        modalPenaltyAddCost={this.modalPenaltyAddCost}
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
                        modalConfirm={this.modalConfirm}
                        setDocumentPO={this.setDocumentPO}
                        setValue={this.setValue}
                        fetchGlAccountHeader={this.fetchGlAccountHeader}
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
        deleteLampiranInvoice: (id) => dispatch(deleteLampiranInvoice(id)),
        submitInvoiceSAP: (id, payload) => dispatch(submitInvoiceSAP(id, payload)),
        postingInvoiceSAP: (id, payload) => dispatch(postingInvoiceSAP(id, payload)),
		savePenaltyInvoice: (payload) => dispatch(savePenaltyInvoice(payload)),
		updatePenaltyInvoice: (payload) => dispatch(updatePenaltyInvoice(payload)),
		deletePenaltyInvoice: (id) => dispatch(deletePenaltyInvoice(id)),
		fetchRekeningBank: (params) => dispatch(fetchRekeningBank(params)),
		fetchPaymentBlock: (params) => dispatch(fetchPaymentBlock(params)),
		fetchPaymentMethod: (params) => dispatch(fetchPaymentMethod(params)),
		fetchSelectHouseBank: (params) => dispatch(fetchSelectHouseBank(params)),
		fetchSelectAccountId: (params) => dispatch(fetchSelectAccountId(params)),
		fetchReferenceKey: (params) => dispatch(fetchReferenceKey(params)),
		fetchTax: (params) => dispatch(fetchTax(params)),
		fetchTermsOfPayment: (params) => dispatch(fetchTermsOfPayment(params)),
        fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
        fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
        fetchProfitCenter: (params) => dispatch(fetchProfitCenter(params)),
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

export default connect(stateToProps, dispatchToProps)( withTranslation() (DetailInvoice));