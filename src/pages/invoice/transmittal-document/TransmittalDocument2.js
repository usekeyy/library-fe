import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';

import { fetchInvoice, fetchDocumentInvoice, updateTransmittal } from '../../../store/actions/invoice/invoiceActions';
// import ModalSync from'./sub/ModalSync';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import {formatNumber} from '../../../helpers/formatNumber';
// import { statusName } from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';
import ReactLoading from 'react-loading';
import { formatDate } from '../../../helpers/formatDate';
import FormChecklist from './sub/FormChecklist';
import Preview from '../../../components/modal/preview/Preview';
import { mergeDocument }from '../../../store/actions/uploadActions';

class TransmittalDocument2 extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
			modalData: {
				data_header:[],
				items:[],
			},
            data_invoice: {
				items: [],
				items_selected: [],
            },
            params: {
                id: '',
                status: (this.props.user.has_roles.includes("INVER2") && this.props.user.has_roles.includes("BNDHRA")) ? 'sent;sent_bendahara;received_bendahara;paid' : this.props.user.has_roles.includes("INVER2") ? 'sent' : this.props.user.has_roles.includes("BNDHRA") ? 'sent_bendahara' : 'null',
                no_transmittal: '',
                faktur_pajak_no: '',
                faktur_tanggal: '',
                purchase_order_number: '',
                number: '',
                invoice_date: '',
                category: '',
                note_vendor: '',
                vendor_id: '',
                vendor_name: '',
                created_by: '',
                craeted_at: '',
                document_date: '',
                posting_date: '',
                total: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            statusSearch: (this.props.user.has_roles.includes("INVER2") && this.props.user.has_roles.includes("BNDHRA")) ? [
                { name: 'Send Hardcopy to Verifikator 2', value: 'sent', isChecked: false },
                { name: 'Send Hardcopy to Bendahara', value: 'sent_bendahara', isChecked: false },
                { name: 'Hardcopy Received by Bendahara', value: 'received_bendahara', isChecked: false },
                { name: 'Paid', value: 'paid', isChecked: false },
            ] : (this.props.user.has_roles.includes("INVER2")) ? [
                { name: 'Send Hardcopy to Verifikator 2', value: 'sent', isChecked: false },
            ] : (this.props.user.has_roles.includes("BNDHRA")) ? [
                { name: 'Send Hardcopy to Bendahara', value: 'sent_bendahara', isChecked: false },
                { name: 'Hardcopy Received by Bendahara', value: 'received_bendahara', isChecked: false },
                { name: 'Paid', value: 'paid', isChecked: false },
            ] : '',
            total: 0,
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
			modalOpen: false,
			modalType: '',
            toggleSync: false,
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false,
            loadingModal: false,
            status_error: false,
            message_error: '',
            isCheckedAll: false,
            preview: {
                modalOpen: false,
                title: '',
                src: '',
                loading: false,
            },
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "No. Transmittal",
                accessor: "no_transmittal",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="no_transmittal" onChange={(event) => this.onChanged(event)} value={this.state.params.no_transmittal} />
                )
            },
            {
                Header: "Faktur Pajak",
                accessor: "faktur_pajak_no",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="faktur_pajak_no" onChange={(event) => this.onChanged(event)} value={this.state.params.faktur_pajak_no} />
                )
            },
            {
                Header: "Tgl. Faktur Pajak",
                id: "faktur_tanggal",
                accessor: d => formatDate(d.faktur_tanggal, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="faktur_tanggal" getDate={this.faktur_tanggal} />
                )
            },
            {
                Header: "No. Invoice",
                accessor: "number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "Tgl. Invoice",
                id: "invoice_date",
                accessor: d => formatDate(d.invoice_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="invoice_date" getDate={this.invoice_date} />
                )
            },
            {
                Header: "Jenis Invoice",
                accessor: "category",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="category" onChange={(event) => this.onChanged(event)} value={this.state.params.category} />
                )
            },
            {
                Header: "No. PO (SAP)",
                accessor: "purchase_order_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchase_order_number" onChange={(event) => this.onChanged(event)} value={this.state.params.purchase_order_number} />
                )
            },
            {
                Header: "Vendor Code",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
            },
            {
                Header: "Vendor",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
            },
            // {
            //     Header: "No. PO (SAP)",
            //     accessor: "po_sap_number",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
            //     )
            // },
            {
                Header: "Keterangan",
                accessor: "note_vendor",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="note_vendor" onChange={(event) => this.onChanged(event)} value={this.state.params.note_vendor} />
                )
            },
			{
				Header:'Nilai Invoice',
				id: "total",
				accessor: d => d.total,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="total" onChange={(event) => this.onChangedNilai(event)} value={this.state.params.total} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
			},
			{
				Header:'Currency',
				id: "currency",
				accessor: d => d.currency,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
				)
			},
            {
                Header: "Status",
                id: "status",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{value.status_text}</label>
                )
            },
            {
                Header: "Next Process",
                accessor: "next_status",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="next_status" onChange={(event) => this.onChanged(event)} value={this.state.params.next_status} />
                )
            },
            {
                Header: "Tgl. Status",
                id: "created_at",
                accessor: d => formatDate(d.created_at, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => this.props.t("assets:label.action"),
				id:"action",
                filterable: false,
                width: 120,
                sortable: false,
				accessor: d => d,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-lime" value={value.uuid} onClick={(e) => this.modalChecklist(e, value.uuid, value)} >Process</button>
                            <button className="btn btn-xs btn-warning" value={value.uuid} onClick={(e) => this.edits(e, value.uuid)} >View</button>
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    debounced = debounce(text => this.fetchData());

    componentDidMount() {
        this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchData = async (params = this.state.params) => {
        this.setState({ loading: true })
        this.props.fetchInvoice(params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading:false
                })
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
    }
    onChangedNilai(event) {
        var someProperty = { ...this.state.params }
        let new_value = event.target.value.replace(/[^0-9]/g, '')
        someProperty[event.target.name] = new_value
        this.setState({
            params: someProperty
        }, () => { this.req() });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => {
            this.debounced(someProperty);
        });
    }

    edits(e, value) {
        // this.props.history.push({
        //     pathname: '/invoice/goods-receipt/detail/' + value,
        //     state: { status_detail: true }
        // })
        this.props.history.push('/invoice/detail/' + value)
    }

	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleSync: true, uuid: value})
		}
	}

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

	handleSync = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.syncAssets(val)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, errors: []}, () => {
                    this.toggleFormClose()
					this.fetchData()
				});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					toastr.error(error.data.message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this._isMounted && this.setState({loading: false});
					toastr.error("Gagal Sinkron Data");
				}
			})
		}
	}

    savePayload = (payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.saveAssets(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                })
                .catch(error => {
                    if (typeof error !== 'undefined') {
                        toastr.error(error.data.message);
                        this._isMounted && this.setState({ error: true, errors: error.data.errors, loading: false, loadingSubmit: false });
                    } else {
                        this._isMounted && this.setState({ loading: false, loadingSubmit: false });
                        toastr.error("Gagal Menyimpan Data");
                    }
                })
        }
    }

    deletePayload = (type) => {
        this.props.deleteAssets(type)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false });
                this.req()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

	toggleClose = () => {
        this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: [], items_selected: []},
            modalOpen: false, status_error: false, message_error: "",
        }));
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    faktur_tanggal = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.faktur_tanggal = date;
        } else {
            filters.faktur_tanggal = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    invoice_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.invoice_date = date;
        } else {
            filters.invoice_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    created_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.created_at = date;
        } else {
            filters.created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    document_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.document_date = date;
        } else {
            filters.document_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    posting_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.posting_date = date;
        } else {
            filters.posting_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.status = (this.props.user.has_roles.includes("INVER2") && this.props.user.has_roles.includes("BNDHRA")) ? 'sent;sent_bendahara;received_bendahara;paid'
            : this.props.user.has_roles.includes("INVER2") ? 'sent'
            : this.props.user.has_roles.includes("BNDHRA") ? 'sent_bendahara;received_bendahara;paid' : 'null';
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }

    onResetFilter = (val) => {
        val.status = (this.props.user.has_roles.includes("INVER2") && this.props.user.has_roles.includes("BNDHRA")) ? 'sent;sent_bendahara;received_bendahara;paid'
            : this.props.user.has_roles.includes("INVER2") ? 'sent'
            : this.props.user.has_roles.includes("BNDHRA") ? 'sent_bendahara;received_bendahara;paid' : 'null'
		this.setState({
            params: val,
        }, () => this.fetchData(val));    
	}

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.params}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({params: optDt}, () => this.fetchData(optDt));
		}
	}

	changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.params.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
		}
	}
	
	changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
			console.log(this.state.params.start);
		}
	}

	handleCheckAll = (e, isCheckAll) => {
		let modalData = this.state.modalData;
		const {items} = this.state.modalData;
		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: [], items_selected: []}
		}));
		let arr_selected = this.state.data_invoice.items_selected;
		if(isCheckAll){
            modalData.items.forEach((element, i) => {
                element.status = 'n'
            });
            this.setState(({ data_invoice }) => ({
                data_invoice: { ...data_invoice, items: [], items_selected: []},
                isCheckedAll: false,
                modalData: modalData
            }));
        } else {
			if(items.length > 0){
                items.forEach((element, i) => {
					if (!arr_selected.includes(element.id)) {
                        arr_selected.push(element.id)
                        // return true
					}
                });
			}
            modalData.items.forEach((element, i) => {
                if (arr_selected.includes(element.id)) {
                    element.status = 'y'
                }
                else {
                    element.status = 'n'
                }
            });
			this.setState(({ data_invoice }) => ({
				data_invoice: { ...data_invoice, items: items.sort((a,b) => a.id-b.id), items_selected: arr_selected},
                isCheckedAll: true,
                modalData: modalData
			}));
		}
	}

	handleChecklist = (e, payload, id) => {
        // console.log(id)
		let modalData = this.state.modalData;
		let arr = this.state.data_invoice.items;
		let arr_selected = this.state.data_invoice.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.id !== id) {
					arrTemp.push(element)
					arrTempSelected.push(element.id)
				} 
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
            arr.push(payload);
            arr_selected.push(id)
		}

        modalData.items.forEach((element, i) => {
            if (arr_selected.includes(element.id)) {
                element.status = 'y'
            }
            else {
                element.status = 'n'
            }
        });
        // console.log(arr)
        // console.log(arr_selected)

		this.setState(({ data_invoice }) => ({
			data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.id-b.id), items_selected: arr_selected},
            modalData: modalData
		}), () => { 
			setTimeout(() => {
				this.setState(({ data_invoice }) => ({ 
					data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.id-b.id), items_selected: arr_selected},
                    modalData: modalData
				}));
			})
		});
	}

	modalChecklist = (e, payload, data_param) => {
        let arr = this.state.data_invoice.items;
        let arr_selected = this.state.data_invoice.items_selected;
        this.props.fetchDocumentInvoice(payload)
            .then((resp) => {
                let datas = resp.data.data
                if (data_param.status === 'sent' || data_param.status === 'sent_bendahara') {
                    datas.forEach(element => {
                        if (element.status === 'y') {
                            arr.push(element)
                            arr_selected.push(element.id)
                        }
                        else if (element.status === 'd') {
                            element.status = 'n'
                        }
                    });
                }
                let arr2 = []
                if (datas.some(d => d.tipe === "mvp")) {
                    let index = datas.findIndex(d => d.tipe === "mvp");
                    arr2.push(datas[index])
                    datas.forEach(element => {
                        if (element.tipe !== 'mvp') {
                            arr2.push(element)
                        }
                    });
                }
                else {
                    arr2 = datas
                }
				// console.log(datas)
				this.setState(({ modalData, data_invoice }) => ({
                    data_invoice: { ...data_invoice, items: arr.sort((a,b) => a.id-b.id), items_selected: arr_selected },
					modalData: { ...modalData, items: arr2, data_header: data_param },
					modalOpen:true,
				}));
            })
            .catch(error => {
                this.setState({loadingSubmit: false, isConfirm: false})
                if (error !== undefined) {
                    // toastr.error(error.data.message)
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                    this.setState({ isError: true, errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

	updateTransmittal = (payload) => {
        this.setState({ status_error: false, message_error: "" })
        let items = this.state.modalData.items
        let arr_selected = this.state.data_invoice.items_selected;
        items.forEach(element => {
            element.status = 'n'
            if (arr_selected.includes(element.id)) {
                element.status = 'y'
            }
        });
        let status_error = false
        let message_error = ""
        if ((payload.status === 'received' || payload.status === 'received_bendahara') && items.some(d => d.status === 'n') ) {
            status_error = true
            message_error = "mohon centang seluruh dokumen untuk menerima data"
        }
        if ((payload.status === 'rejected_hc' || payload.status === 'rejected_hc_bendahara') && !items.some(d => d.status === 'n') ) {
            status_error = true
            message_error = "mohon hapus centang untuk dokumen yang belum sesusai"
        }
        if ((payload.status === 'rejected_hc' || payload.status === 'rejected_hc_bendahara') && payload.note === "") {
            status_error = true
            message_error = "mohon isi catatan terlebih dahulu"
        }
        if (status_error) {
            this.setState({ status_error: true, message_error: message_error })
            return
        }
        let param = {
            status: payload.status,
            note: payload.note,
            document: items
        }
        // console.log(payload)
        // return
        this.props.updateTransmittal(payload.uuid, param)
            .then((resp) => {
                this.toggleClose()
                this.fetchData()
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
	}

    renderSwitchBody(param) {
        switch(param) {
			default:
				return <FormChecklist
                    mergeDocument={this.mergeDocument}
					disabledForm={true}
					user={this.props.user}
                    status_error={this.state.status_error}
                    message_error={this.state.message_error}
                    toggleOpenPreview={this.toggleOpenPreview}
                    handleChecklist={this.handleChecklist}
                    handleCheckAll={this.handleCheckAll}
                    data_invoice={this.state.data_invoice}
                    isCheckedAll={this.state.isCheckedAll}
					modalData={this.state.modalData}
                    save={this.updateTransmittal}
					toggleClose={this.toggleClose}
				/>
        }
    }

	renderSwitchHeader(param) {
        switch(param) {
        //   case 'oa':
        //     return <ModalHeader toggle={() => this.toggleClose()}>Contract References</ModalHeader>;
          default:
            return <ModalHeader toggle={() => this.toggleClose()}>Hardcopy Lampiran Invoice</ModalHeader>;
        }
    }

    titleMenu (url) {
        let title = ''
        switch (url.substring(30)) {
            case 'send':
                title = 'Transmittal Send Document'
                break;
            case 'receive':
                title = 'Transmittal Receive Document'
                break;
            default:
                break;
        }
        return title
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
            }, 1000)
        });
	}

	toggleClosePreview = () => {
		this.setState(({ preview }) => ({
			preview: { ...preview, title: '', src: '', modalOpen: false },
		}));
	}

    mergeDocument = () => {
		let items = this.state.modalData.items
		let arr_file = []
		items.forEach(element => {
			arr_file.push(`${element.dir.substring(1)}/${element.file}`)
		});
		let params = {
			files: arr_file,
		}
        this.props.mergeDocument(params)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data], {type : 'application/pdf'}));
                this.setState(({ preview }) => ({
                    preview: { ...preview, title: `Dokumen Invoice ${this.state.modalData.data_header.number}(merged)`, src: url, loading: true, modalOpen: true },
                }), () => {
                    setTimeout(() => {
                        this.setState(({ preview }) => ({
                            preview: { ...preview, loading: false },
                        }));
                    }, 100)
                });

                // let pdfWindow = window.open("")
                // pdfWindow.document.write(
                //     "<iframe width='100%' height='100%' src='" + url + "'></iframe>"
                // )
            })
            .catch((resp) => {
				toastr.error(`Failed Download Dokumen Invoice ${this.state.modalData.data_header.number}(merged)`);
            });
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">Transmittal Receive Document</li>
                </ol>
                <h1 className="page-header">Transmittal Receive Document</h1>
                <Panel loading={false}>
                    <PanelHeader>List Invoice</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    // loading={false}
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    PaginationComponent={ReactTablePagination}
                                    data={this.state.data}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    onSortedChange={val => {this.changeSorted(val) }}
                                    onPageSizeChange={(length) => {this.changePageSize(length)}}
                                    onPageChange={(perPage) => {this.changePage(perPage)}}
                                    options={this.state.params}
                                    className="-highlight"
                                    pages={this.state.pages}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    {this.renderSwitchHeader(this.state.modalType)}
                    {this.state.loadingModal ? (
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
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert('confirm')}
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
        fetchInvoice: (params) => dispatch(fetchInvoice(params)),
		fetchDocumentInvoice: (id) => dispatch(fetchDocumentInvoice(id)),
        updateTransmittal: (id, payload) => dispatch(updateTransmittal(id, payload)),
		mergeDocument: (payload) => dispatch(mergeDocument(payload)),
        // deleteAssets: (id) => dispatch(deleteAssets(id)),
        // saveAssets: (id, payload) => dispatch(saveAssets(id, payload)),
        // updateAssets: (id, payload) => dispatch(updateAssets(id, payload)),      
        // fetchCompanies: (params) => dispatch(fetchCompanies(params)),
        // syncAssets: (payload) => dispatch(syncAssets(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TransmittalDocument2));
