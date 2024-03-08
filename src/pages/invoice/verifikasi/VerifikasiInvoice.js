import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchInvoice, fetchHistoryInvoice } from '../../../store/actions/invoice/invoiceActions';

import ModalForm from'./../invoice-management/sub/Modal';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import {formatNumber} from '../../../helpers/formatNumber';
// import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

class VerifikasiInvoice extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                status: (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'submitted;received;approved_2;posting' : this.props.user.has_roles.includes("INVER1") ? 'submitted' : this.props.user.has_roles.includes("INVER2") ? 'received;approved_2;posting' : 'null',
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
            statusSearch: (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? [
                { name: 'Invoice Submitted', value: 'submitted', isChecked: false },
                { name: 'Hardcopy Received by Verifikator 2', value: 'received', isChecked: false },
                { name: 'Approved by Verifikator 2', value: 'approved_2', isChecked: false },
                { name: 'Invoice Posted MIRO SAP', value: 'posted', isChecked: false },
                { name: 'Send Hardcopy to Bendahara', value: 'sent_bendahara', isChecked: false },
            ] : (this.props.user.has_roles.includes("INVER1")) ? [
                { name: 'Invoice Submitted', value: 'submitted', isChecked: false },
            ] : (this.props.user.has_roles.includes("INVER2")) ? [
                { name: 'Hardcopy Received by Verifikator 2', value: 'received', isChecked: false },
                { name: 'Approved by Verifikator 2', value: 'approved_2', isChecked: false },
                { name: 'Invoice Posted MIRO SAP', value: 'posted', isChecked: false },
                { name: 'Send Hardcopy to Bendahara', value: 'sent_bendahara', isChecked: false },
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
            toggleSync: false,
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
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
					<input type="text" className="form-control" name="total" onChange={(event) => this.onChanged(event)} value={this.state.params.total} />
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
                filterable: false,
                sortable: false,
                width: 200,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.edits(e, value)} >Process</button>
                            <button className="btn btn-xs btn-info" value={value} onClick={(e) => this.toggleFormOpen(e, value)} >History</button>
                            {/* <button className="btn btn-xs btn-white" value={value} onClick={(e) => this.edits(e, value)} >Print</button> */}
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
        this.props.history.push({
            pathname: '/invoice/detail/' + value,
            state: { isVerifikasi: true }
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
            filters.status = (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'submitted;received;approved_2;posting'
            : this.props.user.has_roles.includes("INVER1") ? 'submitted'
            : this.props.user.has_roles.includes("INVER2") ? 'received;approved_2;posting' : 'null';
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }

    onResetFilter = (val) => {
        val.status = (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'submitted;received;approved_2;posting'
            : this.props.user.has_roles.includes("INVER1") ? 'submitted'
            : this.props.user.has_roles.includes("INVER2") ? 'received;approved_2;posting' : 'null'
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

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">Verifikasi Invoice</li>
                </ol>
                <h1 className="page-header">Verifikasi Invoice</h1>
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
		fetchHistoryInvoice: (id) => dispatch(fetchHistoryInvoice(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(VerifikasiInvoice));
