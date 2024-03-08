import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
 

import Pagination from '../../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import {formatNumber} from '../../../../../helpers/formatNumber';
import {debounce} from '../../../../../helpers/debounce';
import FilterDate from '../../../../../components/filterdate/FilterDate';
import { formatDate } from '../../../../../helpers/formatDate';



const ReactTableFixedColumns = withFixedColumns(ReactTable);

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
				purchasing_requisition_number: '',
				item_no: '',
				material_id: '',
				short_text: '',
				material_group_id: '',
				qty: '',
				qty_po: '',
				qty_pr: '',
				uom: '',
				per: '',
				valuation_price: '',
				currency:'',
				plant_id: '',
				purchasing_org_name: '',
				purchasing_group_id: '',
				requisitioner:'',
				assign_at : '',
				assign_by : '',
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
				id: "purchasing_requisition_number",
				desc: true
			},
		];

		this.columns = [
			{
				Header: () => <div className="pull-left m-l-30"><input type="checkbox" name="isCheckedAll" checked={this.state.isCheckedAll} onChange={(e) => this.handleCheckAll(e)} /></div>,
				id:"action",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<div className="pull-left m-l-30">
							<input type="checkbox" checked={this.props.parentState.purchasing_requisition.items_selected.includes(value.uuid)} onChange={(event) => this.handleChecklist(event, value, value.uuid)} />
						</div>
					</React.Fragment>
				)
			},
			{
				Header:'No PR',
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				id: "purchasing_requisition_number",
				accessor: d => d.purchasing_requisition_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_requisition_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_requisition_number} />
				)
			},
			{
				Header:'Line Item',
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				id: "item_no",
				accessor: d => d.item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_no} />
				)
			},
			{
				Header:'No Material',
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				id: "material_id",
				accessor: d => (d.material_id===null || d.material_id==="") ? "" : parseFloat(d.material_id),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_id} />
				)
			},
			{
				Header:'Short Text',
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				id: "short_text",
				accessor: d => d.short_text,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="short_text" onChange={(event) => this.handleFilter(event)} value={this.state.options.short_text} />
				)
			},
			{
				Header:'Material Group',
				id: "material_group_id",
				accessor: d => d.material_group_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_group_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_group_id} />
				)
			},
			{
				Header:'Qty PR',
				id: "qty_pr",
				accessor: d => formatNumber(d.qty_pr, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty_pr" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty_pr} />
				)
			},
			{
				Header:'Qty PO',
				id: "qty_po",
				accessor: d => formatNumber(d.qty_po, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty_po" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty_po} />
				)
			},
			{
				Header:'Qty Open',
				id: "qty",
				accessor: d => formatNumber(d.qty, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty} />
				)
			},
			{
				Header:'Uom',
				id: "uom",
				accessor: d => d.uom,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="uom" onChange={(event) => this.handleFilter(event)} value={this.state.options.uom} />
				)
			},
			{
				Header:'Per',
				id: "per",
				accessor: d => formatNumber(d.per, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="per" onChange={(event) => this.handleFilter(event)} value={this.state.options.per} />
				)
			},
			{
				Header:'Harga Satuan',
				id: "valuation_price",
				accessor: d => formatNumber(d.valuation_price, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="valuation_price" onChange={(event) => this.handleFilter(event)} value={this.state.options.valuation_price} />
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
				Header:'Requisitioner',
				id: "requisitioner",
				accessor: d => d.requisitioner,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="requisitioner" onChange={(event) => this.handleFilter(event)} value={this.state.options.requisitioner} />
				)
			},
			{
				Header:'Plant',
				id: "plant_id",
				accessor: d => d.plant_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="plant_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.plant_id} />
				)
			},
			
			// {
			// 	Header:'POrg',
			// 	id: "purchasing_org_name",
			// 	accessor: d => d.purchasing_org_name,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input type="text" className="form-control" name="purchasing_org_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_org_name} />
			// 	)
			// },
			{
				Header:'PGroup',
				id: "purchasing_group_id",
				accessor: d => d.purchasing_group_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_group_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_group_id} />
				)
			},
			{
                Header: () => this.props.t("common:Label.assign-at"),
                id: "assign_at",
                accessor: d => formatDate(d.assign_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="assign_at" getDate={this.assign_at} />
                )
            },
			{
				Header: () => this.props.t("common:Label.assign-by"),
				id: "assign_by",
				accessor: d => d.assign_by,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="assign_by" onChange={(event) => this.handleFilter(event)} value={this.state.options.assign_by} />
				)
			},
			
			{
				Header: () => "Action",
				id:"action",
				accessor: d => d,
				filterable: false,
				fixed: 'right',
				className: "sticky",
				headerClassName: "sticky",
				width: 120,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							<Button color="info" size="xs" value={value.uuid} onClick={(e) => this.props.modals(value.uuid, 'list')} >Detail</Button>
							<Button color="danger" size="xs" value={value.uuid} onClick={(e) => this.props.modals(value.uuid, 'delete-pr')} className="m-r-10">Delete</Button>
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
      this.props.fetchPurchasingRequisition(params)
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

	onResetFilter = (val) => {
		this.setState({
      options: val
    }, () => this.fetchData());    
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
		console.log(uuid);
		this.props.handleChecklist(e, value, uuid)
	}
	
	toDetail = (e, id) => {
		// e.preventDefault();
		// this.props.parentProps.history.push(`/tendering/purchasing-requisition/detail/${id}`);
	}

	assign_at = (date = '') => {
        let filters = { ...this.state.options }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.assign_at = date;
        } else {
            filters.assign_at = '';
        }
        this.setState({ options: filters }, () => {
            this.fetchData()
        })
    }

  render(){
    return (
      <div>
				<Panel>
					<PanelHeader>List Purchase Requisition</PanelHeader>
					<PanelBody>
						<Row>
							<Col sm="12">
								<ReactTableFixedColumns 
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