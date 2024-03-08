import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import {formatNumber} from '../../../../helpers/formatNumber';
import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../../components/filterdate/FilterDate';
import { formatDate } from '../../../../helpers/formatDate';
import {debounce} from '../../../../helpers/debounce';

class List extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				sorted_column: 1, 
				// order: 'asc', 
				keyword: '',
				page: 0,
				faktur_pajak_no: '',
				faktur_tanggal: '',
				number: '',
				invoice_date: '',
				category: '',
				purchase_order_number: '',
				note_vendor: '',
				total: '',
				currency: '',
                status: (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'approved_1;rejected_hc;posted;rejected_hc_bendahara' : this.props.user.has_roles.includes("INVER1") ? 'approved_1;rejected_hc' : this.props.user.has_roles.includes("INVER2") ? 'posted;rejected_hc_bendahara' : 'null',
				status_text: '',
				next_status: '',
			},
            statusSearch: (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? [
                { name: 'Approved by Verifikator 1', value: 'approved_1', isChecked: false },
                { name: 'Hardcopy Rejected by Verifikator 2', value: 'rejected_hc', isChecked: false },
                { name: 'Invoice Posted MIRO SAP', value: 'posted', isChecked: false },
                { name: 'Hardcopy Rejected by Bendahara', value: 'rejected_hc_bendahara', isChecked: false },
            ] : (this.props.user.has_roles.includes("INVER1")) ? [
                { name: 'Approved by Verifikator 1', value: 'approved_1', isChecked: false },
                { name: 'Hardcopy Rejected by Verifikator 2', value: 'rejected_hc', isChecked: false },
            ] : (this.props.user.has_roles.includes("INVER2")) ? [
                { name: 'Invoice Posted MIRO SAP', value: 'posted', isChecked: false },
                { name: 'Hardcopy Rejected by Bendahara', value: 'rejected_hc_bendahara', isChecked: false },
            ] : '',
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			isCheckedAll: this.props.parentState.isCheckedAll,
			loading: false
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: true
			},
		];

		this.columns = [
			{
				Header: () => <div className="pull-left m-l-30"><input type="checkbox" name="isCheckedAll" checked={this.props.parentState.isCheckedAll} onChange={(e) => this.handleCheckAll(e)} /></div>,
				id:"checklist",
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<div className="pull-left m-l-30">
							<input type="checkbox" checked={this.props.parentState.data_invoice.items_selected.includes(value.uuid)} onChange={(event) => this.handleChecklist(event, value, value.uuid)} />
						</div>
					</React.Fragment>
				)
			},
            {
                Header: "Faktur Pajak",
                accessor: "faktur_pajak_no",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="faktur_pajak_no" onChange={(event) => this.onChanged(event)} value={this.state.options.faktur_pajak_no} />
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
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.options.number} />
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
                    <input className="form-control" name="category" onChange={(event) => this.onChanged(event)} value={this.state.options.category} />
                )
            },
            {
                Header: "No. PO (SAP)",
                accessor: "purchase_order_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchase_order_number" onChange={(event) => this.onChanged(event)} value={this.state.options.purchase_order_number} />
                )
            },
            {
                Header: "Vendor Code",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.options.vendor_id} />
                )
            },
            {
                Header: "Vendor",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.options.vendor_name} />
                )
            },
            // {
            //     Header: "No. PO (SAP)",
            //     accessor: "po_sap_number",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.options.po_sap_number} />
            //     )
            // },
            {
                Header: "Keterangan",
                accessor: "note_vendor",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="note_vendor" onChange={(event) => this.onChanged(event)} value={this.state.options.note_vendor} />
                )
            },
			{
				Header:'Nilai Invoice',
				id: "total",
				accessor: d => d.total,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="total" onChange={(event) => this.onChangedNilai(event)} value={this.state.options.total} />
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
					<input type="text" className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.options.currency} />
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
                    <input className="form-control" name="next_status" onChange={(event) => this.onChanged(event)} value={this.state.options.next_status} />
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
                Header: "Action",
				id:"action",
                width: 120,
                filterable: false,
                sortable: false,
				accessor: d => d,
				Cell: ({value}) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-warning" value={value.uuid} onClick={(e) => this.modalChecklist(e, value.uuid, value)} >View</button>
                            <button className="btn btn-xs btn-lime" value={value.uuid} onClick={(e) => this.edits(e, value.uuid)} >Detail</button>
                            {/* <button className="btn btn-xs btn-white" value={value} onClick={(e) => this.edits(e, value)} >Print</button> */}
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

	fetchData = async (params = this.state.options) => {
		this.setState({loading: true})
		this.props.setLoading(true, [])
		this.props.fetchInvoice(params)
			.then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data}, () => {
						this.props.setLoading(false, [])
						this.props.setListData(resp.data.data)
						if(this.props.parentState.loadings.showItems === true){
							this.props.setItems(resp.data.data)
						}
					});
				}
			})
			.catch((resp) => {
				this.setState({loading: false})
				this.props.setLoading(false, [])
				toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

    onChangedNilai(event) {
        var someProperty = { ...this.state.options }
        let new_value = event.target.value.replace(/[^0-9]/g, '')
        someProperty[event.target.name] = new_value
        this.setState({
            options: someProperty
        }, () => { this.req() });
    }

    onChanged(event) {
        var someProperty = { ...this.state.options }
        someProperty[event.target.name] = event.target.value
        this.setState({
            options: someProperty
        }, () => {
            this.debounced(someProperty);
        });
    }

	changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.options.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchData());
		}
	}
	
	changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = {...this.state.options}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, options: optDt}, () => this.fetchData());
			// console.log(this.state.options.start);
		}
	}

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.options}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({options: optDt}, () => this.fetchData());
		}
	}

    faktur_tanggal = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.faktur_tanggal = date;
        } else {
            filters.faktur_tanggal = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData(filters)
        })
    }

    invoice_date = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.invoice_date = date;
        } else {
            filters.invoice_date = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData(filters)
        })
    }

    created_at = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.created_at = date;
        } else {
            filters.created_at = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData(filters)
        })
    }

    document_date = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.document_date = date;
        } else {
            filters.document_date = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData(filters)
        })
    }

    posting_date = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.posting_date = date;
        } else {
            filters.posting_date = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData(filters)
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.options }
		console.log(filters)
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ options: filters }, () => this.fetchData(filters))
        } else {
            filters.status = (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'approved_1;rejected_hc;posted;rejected_hc_bendahara'
			: this.props.user.has_roles.includes("INVER1") ? 'approved_1;rejected_hc'
			: this.props.user.has_roles.includes("INVER2") ? 'posted;rejected_hc_bendahara' : 'null';
            this.setState({ options: filters }, () => this.fetchData(filters))
        }
    }

	onResetFilter = (val) => {
		this.setState({
			options: val
		}, () => this.fetchData());    
	}

	handleCheckAll = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		console.log(this.props.parentState.isCheckedAll)
		this.setState({
			[name]: value
		}, () => {
			this.props.handleCheckAll(event, this.props.parentState.isCheckedAll)
		});
	}

	handleChecklist = (e, value, uuid) => {
		// this.setState({isCheckedAll: false})
		e.preventDefault();
		// console.log(uuid);
		this.props.handleChecklist(e, value, uuid)
	}
	
    modalChecklist(e, value, data) {
		e.preventDefault()
		this.props.modalChecklist(value, data)
        // const url = '/invoice/unbilled/barang/detail/' + value
        // this.props.redirectDetail(url)
    }

    edits(e, value) {
        // this.props.history.push({
        //     pathname: '/invoice/goods-receipt/detail/' + value,
        //     state: { status_detail: true }
        // })
        this.props.parentProps.history.push('/invoice/detail/' + value)
    }

	toDetail = (e, id) => {
		// e.preventDefault();
		// this.props.parentProps.history.push(`/tendering/purchasing-requisition/detail/${id}`);
	}

	onResetFilter = (val) => {
		val.status = (this.props.user.has_roles.includes("INVER1") && this.props.user.has_roles.includes("INVER2")) ? 'approved_1;rejected_hc;posted;rejected_hc_bendahara'
			: this.props.user.has_roles.includes("INVER1") ? 'approved_1;rejected_hc'
			: this.props.user.has_roles.includes("INVER2") ? 'posted;rejected_hc_bendahara' : 'null'
		this.setState({
            options: val
        }, () => this.fetchData(val));    
	}

	render(){
		return (
			<div>
				<Panel>
					<PanelHeader>List Invoice</PanelHeader>
					<PanelBody>
						<Row>
							<Col sm="12">
								{/* <div className="pull-right m-b-10">
									<Button color="success" size="sm" value="" onClick={(e) => this.toggleSyncPRPrice(e, '')} >Sync Harga PR</Button>
								</div> */}
							</Col>
						</Row>
						<Row>
							<Col sm="12">
								<ReactTable 
									columns={this.columns} 
									filterable loading={this.state.loading} 
									manual
									minRows={1}
									PaginationComponent={Pagination}
									pageSizeOptions={[10, 20, 25, 50, 100]}
									recordsTotal={this.state.data.recordsTotal}
									recordsFiltered={this.state.data.recordsFiltered}
									data={this.state.data.data} 
									defaultPageSize={10} 
									defaultSorted={this.defaultSorted} 
									pages={this.state.total}
									page={this.state.options.page}
									onResetFilter={val => this.onResetFilter(val)}
									options={this.state.options}
									// style={{ height: "450px" }}
									onSortedChange={val => {this.changeSorted(val) }}
									onPageSizeChange={(length) => {this.changePageSize(length)}}
									onPageChange={(perPage) => {this.changePage(perPage)}}
									className="-highlight" />
							</Col>
						</Row>
					</PanelBody>
				</Panel>
			</div>
		);
	}
}

export default List;