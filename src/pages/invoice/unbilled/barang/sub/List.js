import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Pagination from '../../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import {formatNumber2} from '../../../../../helpers/formatNumber';
import {debounce} from '../../../../../helpers/debounce';
import FilterDate from '../../../../../components/filterdate/FilterDate';
import moment from 'moment';

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
				category: '',
				po_eproc_number: '',
				po_sap_number: '',
				po_item_no: '',
				goods_receipt_number: '',
				item_no: '',
				short_text: '',
				// vendor_name: '',
				qty: '',
				uom: '',
				per: '',
				currency: '',
				penalty: '',
				amount: '',
				post_date: '',
				doc_date: '',
				plant: '',
				company_id: '',
				company_name: '',
				trans_type: '1',
			},
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			isCheckedAll: false,
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
				Header: () => <div className="pull-left m-l-30"><input type="checkbox" name="isCheckedAll" checked={this.state.isCheckedAll} onChange={(e) => this.handleCheckAll(e)} /></div>,
				id:"action",
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
				Header:'Kategori',
				id: "category",
				accessor: d => d.category,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="category" onChange={(event) => this.handleFilter(event)} value={this.state.options.category} />
				)
			},
			{
				Header:'Company Code',
				id: "company_id",
				accessor: d => d.company_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="company_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_id} />
				)
			},
			{
				Header:'Company Name',
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				)
			},
			{
				Header:'No. PO (Eproc)',
				id: "po_eproc_number",
				accessor: d => d.po_eproc_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="po_eproc_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.po_eproc_number} />
				)
			},
			{
				Header:'No. PO (SAP)',
				id: "po_sap_number",
				accessor: d => d.po_sap_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="po_sap_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.po_sap_number} />
				)
			},
			{
				Header:'PO Item',
				id: "po_item_no",
				accessor: d => d.po_item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="po_item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.po_item_no} />
				)
			},
			{
				Header:'No. GR',
				id: "goods_receipt_number",
				accessor: d => d.goods_receipt_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="goods_receipt_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.goods_receipt_number} />
				)
			},
			{
				Header:'GR Item',
				id: "item_no",
				accessor: d => d.item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_no} />
				)
			},
			{
				Header:'Description',
				id: "short_text",
				accessor: d => d.short_text,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="short_text" onChange={(event) => this.handleFilter(event)} value={this.state.options.short_text} />
				)
			},
			{
				Header:'Qty',
				id: "qty",
				accessor: d => d.qty,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty" onChange={(event) => this.handleFilterNilai(event)} value={this.state.options.qty} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber2(value, 3)}</div>
                )
			},
			{
				Header:'UOM',
				id: "uom",
				accessor: d => d.uom,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="uom" onChange={(event) => this.handleFilter(event)} value={this.state.options.uom} />
				)
			},
			{
				Header:'Amount',
				id: "amount",
                accessor: d => d.amount,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="amount" onChange={(event) => this.handleFilterNilai(event)} value={this.state.options.amount} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber2(value, 2)}</div>
                )
			},
			{
				Header:'Penalty',
				id: "penalty",
				accessor: d => d.penalty,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="penalty" onChange={(event) => this.handleFilterNilai(event)} value={this.state.options.penalty} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber2(value, 2)}</div>
                )
			},
			{
				Header:'Currency',
				id: "currency",
				accessor: d => d.currency,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="currency" onChange={(event) => this.handleFilter(event)} value={this.state.options.currency} />
				)
			},
            {
                Header: "Post Date",
                id: "post_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.post_date} />
                ),
                Cell: ({ value }) => (
                    value.post_date !== null && value.post_date !== '' && 
                    <label>{moment(value.post_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Doc. Date",
                id: "doc_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.doc_date} />
                ),
                Cell: ({ value }) => (
                    value.doc_date !== null && value.doc_date !== '' && 
                    <label>{moment(value.doc_date).format("DD-MM-YYYY")}</label>
                )
            },
			{
				Header:'Plant',
				id: "plant",
				accessor: d => d.plant,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="plant" onChange={(event) => this.handleFilter(event)} value={this.state.options.plant} />
				)
			},
			{
                Header: () => "Action",
				filterable: false,
				sortable: false,
                accessor: "uuid",
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							<Button color="info" size="xs" value={value} onClick={(e) => this.edits(e, value)} >Detail </Button>
						</center>
					</React.Fragment>
				)
			},
		]
	}
	
	debounced = debounce(text => this.fetchData());

	componentDidMount = () => {
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

	asyncData = async (params) => {
		this.setState({loading: true})
		this.props.setLoading(true, [])
		this.props.fetchUnbilled(params)
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

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.state.options)
		}
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

    post_date = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.post_date = date;
        } else {
            filters.post_date = '';
        }
		console.log(filters)
        this.setState({ options: filters }, () => {
            this.asyncData(filters)
        })
    }

    doc_date = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.doc_date = date;
        } else {
            filters.doc_date = '';
        }
        this.setState({ options: filters }, () => {
            this.asyncData(filters)
        })
    }

	onResetFilter = (val) => {
		this.setState({
			options: val
		}, () => this.fetchData());    
	}

	handleFilterNilai = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
        let new_value = event.target.value.replace(/[^0-9]/g, '')
        filters[event.target.name] = new_value
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	handleFilter = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({options: filters}, () => {
			this.debounced(filters);
		})
	}

	handleCheckAll = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		}, () => {
			this.props.handleCheckAll(this.state.isCheckedAll)
		});
	}

	handleChecklist = (e, value, uuid) => {
		// this.setState({isCheckedAll: false})
		e.preventDefault();
		// console.log(uuid);
		this.props.handleChecklist(e, value, uuid)
	}
	
    edits(e, value) {
		let data = this.state.data.data
		let index = data.findIndex(d => d.uuid === value)
		switch (data[index].category) {
			case 'Barang':
				const url = '/invoice/unbilled/barang/detail/' + value
				this.props.redirectDetail(url)				
				break;
			case 'Additional Cost':
				// console.log('ini additional cost')
				this.props.modalAdditionalCost(data[index])
				break;
			default:
				break;
		}
    }

	toDetail = (e, id) => {
		// e.preventDefault();
		// this.props.parentProps.history.push(`/tendering/purchasing-requisition/detail/${id}`);
	}

	onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

	render(){
		return (
			<div>
				<Panel>
					<PanelHeader>List Unbilled - Barang</PanelHeader>
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