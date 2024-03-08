import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import {connect} from 'react-redux';
import Pagination from '../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import {formatNumber} from '../../../../helpers/formatNumber';
import {debounce} from '../../../../helpers/debounce';

import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import SweetAlert from 'react-bootstrap-sweetalert';
// import { withTranslation } from 'react-i18next';

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
				outline_agreement: '',
				princ_agreement_item: '',
				material_id: '',
				short_text: '',
				fixed_vendor: '',
				vendor_name: '',
				material_group_id: '',
				qty: '',
				qty_po: '',
				qty_pr: '',
				uom: '',
				per: '',
				currency: '',
				valuation_price: '',
				total_price: '',
				plant_id: '',
				purchasing_org_name: '',
				purchasing_group_id: '',
			},
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			isCheckedAll: false,
			loading: false,
			isConfirmDelete : false,
			uuidDelete :''
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
				accessor: d => d,
				filterable: false,
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
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
				id: "purchasing_requisition_number",
				accessor: d => d.purchasing_requisition_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_requisition_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_requisition_number} />
				)
			},
			{
				Header:'Item PR',
				id: "item_no",
				accessor: d => d.item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_no} />
				)
			},
			{
				Header:'No OA',
				id: "outline_agreement",
				accessor: d => d.outline_agreement,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="outline_agreement" onChange={(event) => this.handleFilter(event)} value={this.state.options.outline_agreement} />
				)
			},
			{
				Header:'Item OA',
				id: "princ_agreement_item",
				accessor: d => parseInt(d.princ_agreement_item),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="princ_agreement_item" onChange={(event) => this.handleFilter(event)} value={this.state.options.princ_agreement_item} />
				)
			},
			{
				Header:'Vendor',
				id: "fixed_vendor",
				accessor: d => d.fixed_vendor,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="fixed_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.fixed_vendor} />
				)
			},
			{
				Header:'Vendor Name',
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="vendor_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_name} />
				)
			},
			{
				Header:'No Material',
				id: "material_id",
				accessor: d => parseInt(d.material_id),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_id} />
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
				Header:'MGroup',
				id: "material_group_id",
				accessor: d => d.material_group_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_group_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_group_id} />
				)
			},
			{
				Header:'Qty PR',
				id: "qty_pr",
				accessor: d => d.qty_pr,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty_pr" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty_pr} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
			},
			{
				Header:'Qty PO',
				id: "qty_po",
				accessor: d => d.qty_po,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty_po" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty_po} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
			},
			{
				Header:'Qty Open',
				id: "qty",
				accessor: d => d.qty,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
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
				accessor: d => d.per,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="per" onChange={(event) => this.handleFilter(event)} value={this.state.options.per} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
			},
			{
				Header:'Harga Satuan',
				id: "valuation_price",
				accessor: d => d.valuation_price,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="valuation_price" onChange={(event) => this.handleFilter(event)} value={this.state.options.valuation_price} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
			},
			{
				Header:'Total Harga',
				id: "total_price",
				accessor: d => d.total_price,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="total_price" onChange={(event) => this.handleFilter(event)} value={this.state.options.total_price} />
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
					<input type="text" className="form-control" name="currency" onChange={(event) => this.handleFilter(event)} value={this.state.options.currency} />
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
				Header: () => "Action",
				id:"action",
				accessor: d => d,
				filterable: false,
				sortable: false,
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'right',
				width: 120,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							<Button color="info m-r-5" size="xs" value={value.uuid} onClick={(e) => this.props.modals(value.uuid, 'list')} >Detail </Button>
							{this.props.access.D && <Button color="danger" size="xs" value={value.uuid} onClick={(e)=> this.onClickDelete(value.uuid)} className="m-r-10">Delete</Button> }
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
		// console.log(uuid);
		this.props.handleChecklist(e, value, uuid)
	}
	
	toggleSyncPRPrice = (e, data) => {
		e.preventDefault();
		this.props.syncPRPrice(data)

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

	deleteAssingOA= (payload) => {
		this.setState(({  loadings }) => ({
			loadings: { ...loadings, loading_proses_delete : true}
		}));
		this.props.deleteAssignPOOA(payload)
			.then((resp) => {
				toastr.success(resp.data.message);
				this.setState({
					modalDeletePr : false
				})
			})
			.catch(error => {
				if (typeof error !== 'undefined') {
					toastr.error(error.data.message);
					this.setState(({  loadings }) => ({
						error_delete_pr: error.data.errors,
						loadings: { ...loadings, loading_proses_delete:false}
					}));
				} else {
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loading_proses_delete:false}
					}));
					toastr.error(error.data.message);
				}
			})
	}

	onClickDelete = (uuid) => {
		this.setState({
			isConfirmDelete : true,
			uuidDelete : uuid
		})
	}

	toggleSweetAlertBanned(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirmDelete: false });
                    this.deleteAssingOA(this.state.uuidDelete)
					this.asyncData()
                    break;
                case 'cancel':
                    this.setState({ isConfirmDelete: false, uuidDelete: '' });
                    break;
                default:
                    break;
            }
        }
    }

	render(){
		// const {t} = this.props;
		return (
			<div>
				<Panel>
					<PanelHeader>List Purchase Requisition - Outline Agreement</PanelHeader>
					<PanelBody>
						<Row>
							<Col sm="12">
								<div className="pull-right m-b-10">
									<Button color="success" size="sm" value="" onClick={(e) => this.toggleSyncPRPrice(e, '')} >Sync Harga PR</Button>
								</div>
							</Col>
						</Row>
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
				{(this.state.isConfirmDelete &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={this.props.parentProps.t("common:delete.close-auction-button")}
                        cancelBtnText={this.props.parentProps.t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={this.props.parentProps.t("common:delete.title-reject-oa")}
                        onConfirm={() => this.toggleSweetAlertBanned('confirm')}
                        onCancel={() => this.toggleSweetAlertBanned('cancel')}
                    >
                    </SweetAlert>
                )}
			</div>
		);
	}
}

export default List;