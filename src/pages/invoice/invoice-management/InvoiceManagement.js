import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchInvoice, cetakInvoice, fetchHistoryInvoice, syncInvoicePaid, exportExcelInvoice, fetchDocumentInvoice } from '../../../store/actions/invoice/invoiceActions';

import ModalForm from'./sub/Modal';
// import Popup from'./sub/Popup';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import {formatNumber} from '../../../helpers/formatNumber';
// import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';
import Preview from '../../../components/modal/preview/Preview';
import { mergeDocument } from '../../../store/actions/uploadActions';
import { modalShowFalse } from '../../../store/actions/authActions';


class InvoiceManagement extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        let d = new Date();
        let year = d.getFullYear();
        let default_inv_date = `${year}-01-01;${year}-12-31`
        this.state = {
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
            params: {
                id: '',
                status: '',
                faktur_pajak_no: '',
                faktur_tanggal: '',
                purchase_order_number: '',
                purchasing_org_id: '',
                purchasing_org_name: '',
                number: '',
                sap_mm: '',
                sap_fi: '',
                sap_mm_reverse: '',
                invoice_date: default_inv_date,
                category: '',
                note_vendor: '',
                vendor_id: '',
                vendor_name: '',
                created_by: '',
                craeted_at: '',
                document_date: '',
                posting_date: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            statusSearch: this.props.user.has_roles.includes("VNDR01") ?
            [
                { name: 'Invoice Drafted', value: 'draft', isChecked: false },
                { name: 'Invoice Submitted', value: 'submitted', isChecked: false },
                // { name: 'verification', value: ['approved_1', 'sent', 'received', 'rejected_hc', 'approved_2', 'posted', 'sent_bendahara', 'received_bendahara', 'rejected_hc_bendahara'], isChecked: false },
                { name: 'Verification', value: 'approved_1;sent;approved_2;posted;rejected_hc;sent_bendahara;received_bendahara;rejected_hc_bendahara', isChecked: false },
                { name: 'Rejected by Verifikator 1', value: 'rejected_1', isChecked: false },
                { name: 'Rejected by Verifikator 2', value: 'rejected_2', isChecked: false },
                { name: 'Paid', value: 'paid', isChecked: false },
            ] :
            [
                { name: 'Invoice Drafted', value: 'draft', isChecked: false },
                { name: 'Invoice Submitted', value: 'submitted', isChecked: false },
                { name: 'Approved by Verifikator 1', value: 'approved_1', isChecked: false },
                { name: 'Rejected by Verifikator 1', value: 'rejected_1', isChecked: false },
                { name: 'Send Hardcopy to Verifikator 2', value: 'sent', isChecked: false },
                { name: 'Hardcopy Received by Verifikator 2', value: 'received', isChecked: false },
                { name: 'Hardcopy Rejected by Verifikator 2', value: 'rejected_hc', isChecked: false },
                { name: 'Approved by Verifikator 2', value: 'approved_2', isChecked: false },
                { name: 'Invoice Posted MIRO SAP', value: 'posted', isChecked: false },
                { name: 'Rejected by Verifikator 2', value: 'rejected_2', isChecked: false },
                { name: 'Send Hardcopy to Bendahara', value: 'sent_bendahara', isChecked: false },
                { name: 'Hardcopy Received by Bendahara', value: 'received_bendahara', isChecked: false },
                { name: 'Hardcopy Rejected by Bendahara', value: 'rejected_hc_bendahara', isChecked: false },
                { name: 'Paid', value: 'paid', isChecked: false },
            ],
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
            toggleOpenPopup: true,
            toggleSync: false,
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false,
            preview: {
                modalOpen: false,
                title: '',
                src: '',
                loading: false,
            },
        }
        this.defaultSorted = [
            {
                id: "invoice_date",
                desc: true
            }
        ];
        this.columns = this.props.user.has_roles.includes("VNDR01") ? 
        [
            {
				Header:'No',
				id: "id",
				accessor: d => d.id,
				filterable : false,
				sortable : false,
                width : 70,
				Cell: ({index}) => (
					
					<React.Fragment>
						{/* {console.log(index)} */}
                        {index + 1 + this.state.params.start}
					</React.Fragment>
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
                Header: "Company Code",
                accessor: "purchasing_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                )
            },
            {
                Header: "Company Name",
                accessor: "purchasing_org_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
                )
            },
            {
                Header: "No. PO (SAP)",
                accessor: "purchase_order_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchase_order_number" onChange={(event) => this.onChanged(event)} value={this.state.params.purchase_order_number} />
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
                    <label>{(value.status === 'draft' || value.status === 'submitted' || value.status === 'rejected_1' || value.status === 'rejected_2' || value.status === 'paid') ? value.status_text : 'Verification'}</label>
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
                filterable: false,
                sortable: false,
                width: 280,
                id: "uuid",
                accessor: d => d,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-warning" value={value.uuid} onClick={(e) => this.edits(e, value.uuid)} >{this.props.user.has_roles.includes("VNDR01") && (value.status === 'draft' || value.status === 'rejected_1' || value.status === 'rejected_2') ? 'Process' : 'View'}</button>
                            <button className="btn btn-xs btn-info" value={value.uuid} onClick={(e) => this.toggleFormOpen(e, value.uuid)} >History</button>
                            <button className="btn btn-xs btn-white" value={value.uuid} onClick={(e) => this.cetakInvoice(e, value.uuid, value)} >Print</button>
                            <button className="btn btn-xs btn-success" value={value.uuid} onClick={(e) => this.fetchDocumentInvoice(e, value.uuid, value)}>Preview Doc</button>
                        </center>
                    </React.Fragment>
                )
            },
        ] :
        [
            {
				Header:'No',
				id: "id",
				accessor: d => d.id,
				filterable : false,
				sortable : false,
                width : 70,
				Cell: ({index}) => (
					
					<React.Fragment>
						{/* {console.log(index)} */}
                        {index + 1 + this.state.params.start}
					</React.Fragment>
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
                Header: "No. MIRO",
                accessor: "sap_mm",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_mm" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_mm} />
                )
            },
            {
                Header: "No. MVP",
                accessor: "sap_fi",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_fi" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_fi} />
                )
            },
            {
                Header: "No. Reverse",
                accessor: "sap_mm_reverse",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_mm_reverse" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_mm_reverse} />
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
                Header: "Company Code",
                accessor: "purchasing_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                )
            },
            {
                Header: "Company Name",
                accessor: "purchasing_org_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
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
                id: "next_status",
                accessor: d => d.next_status,
                Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="next_status" onChange={(event) => this.onChanged(event)} value={this.state.params.next_status} />
				),
                // Cell: ({ value }) => (
                //     <label>{value.next_status}</label>
                // )
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
                filterable: false,
                sortable: false,
                width: 280,
                id: "uuid",
                accessor: d => d,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-warning" value={value.uuid} onClick={(e) => this.edits(e, value.uuid)} >View</button>
                            <button className="btn btn-xs btn-info" value={value.uuid} onClick={(e) => this.toggleFormOpen(e, value.uuid)} >History</button>
                            <button className="btn btn-xs btn-white" value={value.uuid} onClick={(e) => this.cetakInvoice(e, value.uuid, value)} >Print</button>
                            <button className="btn btn-xs btn-success" value={value.uuid} onClick={(e) => this.fetchDocumentInvoice(e, value.uuid, value)}>Preview Doc</button>
                        </center>
                    </React.Fragment>
                )
            },
        ]
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

    syncInvoicePaid = (e) => {
        this.props.syncInvoicePaid()
            .then((resp) => {
                toastr.success(resp.data.message)
                this.onResetFilter(this.state.params)
            })
            .catch((error) => {
                // toastr.error(error.data.status, error.data.message);
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
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
        }, () => {
            this.debounced(someProperty);
        });
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
        console.log(this.state.isVendor)
        this.props.history.push({
            pathname: this.state.isVendor ? ('/invoice/detail/' + value) : ('/invoice/invoice-management/detail/' + value),
            state: { isVerifikasi: false }
        })
        // this.props.history.push('/invoice/detail/' + value)
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

    toggleClosePopup = () => {
        // this.setState({ toggleOpenPopup: false })
				this.props.modalShowFalse()
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
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
            filters.status = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }

    onResetFilter = (val) => {
        let d = new Date();
        let year = d.getFullYear();
        let default_inv_date = `${year}-01-01;${year}-12-31`
        val.invoice_date = default_inv_date
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

    cetakInvoice = (e, value, data) => {
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.cetakInvoice(uuid)
            .then((resp) => {
                // this.setState(({}) => ({loadingDownload : false}));
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `invoice_${data.number}_${data.created_at}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch((resp) => {
                // this.setState({loadingDownload : false});
                toastr.error("Ceklist Dokumen tidak bisa dicetak");
                // this.setState({loading: false});
            });
	}

    exportExcelInvoice = (e) => {
        // let params = this.state.params
        this.props.exportExcelInvoice(this.state.params)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                // eslint-disable-next-line no-extend-native
                Number.prototype.padLeft = function(base,chr){
                    let len = (String(base || 10).length - String(this).length)+1;
                    return len > 0? new Array(len).join(chr || '0')+this : this;
                }
                var d = new Date(), dformat = [
                    d.getDate().padLeft(),
                    (d.getMonth()+1).padLeft(),
                    d.getFullYear()].join('-')+' '+
                    [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join('.');
                console.log(dformat)
                link.setAttribute('download', `invoice_export_excel (${dformat}).xlsx`); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                // toastr.error(error.data.status, error.data.message);
                if (error !== undefined) {
                    Object.keys(error.data.errors).map(function (key, index) {
                        toastr.error(error.data.errors[key])
                        return true
                    })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
	}

    fetchDocumentInvoice = (e, uuid, data_param) => {
        console.log(data_param)
		let arr_file = []
        this.props.fetchDocumentInvoice(uuid)
            .then((resp) => {
                let datas = resp.data.data
                datas.forEach(element => {
                    arr_file.push(`${element.dir.substring(1)}/${element.file}`)
                })
                let params = {
                    files: arr_file,
                }
                // console.log(params)
                this.mergeDocument(params, data_param)
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
            })
    };

    mergeDocument = (params, data_param) => {
        this.props.mergeDocument(params)
            .then((resp) => {
                const url = window.URL.createObjectURL(new Blob([resp.data], {type : 'application/pdf'}));
                this.setState(({ preview }) => ({
                    preview: { ...preview, title: `Dokumen Invoice ${data_param.number}(merged)`, src: url, loading: true, modalOpen: true },
                }), () => {
                    setTimeout(() => {
                        this.setState(({ preview }) => ({
                            preview: { ...preview, loading: false },
                        }));
                    }, 100)
                });
            })
            .catch((resp) => {
                toastr.error(`Failed Download Dokumen Invoice ${data_param}(merged)`);
            });
    };

	toggleClosePreview = () => {
		this.setState(({ preview }) => ({
			preview: { ...preview, title: '', src: '', modalOpen: false },
		}));
	}

    render() {
        const { t } = this.props;
				// console.log(this.props.invoice_popup);
				// const isVendor = this.props.user?.has_roles.includes('VNDR01');
				
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">Invoice Management</li>
                </ol>
                <h1 className="page-header">Invoice Management</h1>
                <Panel loading={false}>
                    <PanelHeader>List Invoice Management</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                                {this.props.user.has_roles.includes("BNDHRA") &&
                                    <div className="pull-left m-b-10 m-r-3">
                                        <button className="btn btn-success" onClick={(e) => this.syncInvoicePaid(e)} >Sync Status Paid</button>
                                    </div>
                                }
                                <span> </span>
                                {(this.props.user.has_roles.includes("INVER1") || this.props.user.has_roles.includes("INVER2")) &&
                                    <div className="pull-left m-b-10">
                                        <button className="btn btn-success" onClick={(e) => this.exportExcelInvoice(e)} >Export Excel</button>
                                    </div>
                                }
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
                {this.state.modalOpen &&
                    <ModalForm
                        errors={this.state.errors}
                        toggleOpen={this.state.modalOpen}
                        uuid={this.state.uuid}
                        fetchHistoryInvoice={this.props.fetchHistoryInvoice}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
                    />
                }
                {/* {isVendor && this.props.invoice_popup &&
									<Popup
											toggleOpenPopup={this.props.invoice_popup}
											toggleClosePopup={this.toggleClosePopup}
									/>
                } */}
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
				invoice_popup: state.auth.invoice_popup,
    }
}

const dispatchToProps = dispatch => {
    return {
			fetchInvoice: (params) => dispatch(fetchInvoice(params)),
			cetakInvoice: (id) => dispatch(cetakInvoice(id)),
			fetchHistoryInvoice: (id) => dispatch(fetchHistoryInvoice(id)),
			syncInvoicePaid: () => dispatch(syncInvoicePaid()),
			exportExcelInvoice: (params) => dispatch(exportExcelInvoice(params)),
			fetchDocumentInvoice: (id) => dispatch(fetchDocumentInvoice(id)),
			mergeDocument: (payload) => dispatch(mergeDocument(payload)),
			modalShowFalse: () => dispatch(modalShowFalse()),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(InvoiceManagement));
