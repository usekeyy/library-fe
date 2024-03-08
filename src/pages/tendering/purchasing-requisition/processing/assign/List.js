import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";

import { withTranslation } from 'react-i18next';
import Pagination from '../../../../../components/paginations/ReactTablePagination';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import {formatNumber} from '../../../../../helpers/formatNumber';
import {debounce} from '../../../../../helpers/debounce';
import FormDetail from '../sub/FormDetail';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import {ShowDetailPurchasingRequisition, deletePurchasingRequisitionItem, downloadAssignmentPR} from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import FormDeletePR from './FormDeletePR.js';
import { formatDate } from '../../../../../helpers/formatDate';


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class List extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			options: {
				start: 0, 
				length: -1, 
				sorted_column: 1, 
				// order: 'asc', 
				keyword: '',
				page: 0,
				item_no: '',
				purchasing_requisition_number: '',
				material_id: '',
				plant_id: '',
				purchasing_requisition_id: '',
				qty: '',
				short_text: '',
				status: '',
				total_price: '',
				unit_price: '',
				uom_name: '',
				outline_agreement:'',
				uom: '',
				per:'',
				uuid: '',
				valuation_price: '',
				purchasing_org_name: '',
				purchasing_group_name: '',
				requisitioner:''
			},
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			isCheckedAll: false,
			loading: false,
			modalOpen: false,
			modalDeletePr : false,
			loadings:{
				loadingModal:false,
				loading_proses_delete_pr : false,
				downloadExcel : false
			},
			modalData : {
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			},
			modalDataPR : {
				uuid : '',
				data_param : []
			},
			error_delete_pr : []
			
		}

		this.defaultSorted = [
			{
				id: "purchasing_requisition_number",
				desc: false
			}
		];

		this.columns = [
			{
				Header: () => <div className="pull-left m-l-30"><input type="checkbox" name="isCheckedAll" checked={this.state.isCheckedAll} onChange={(e) => this.handleCheckAll(e)} /></div>,
				id:"action",
				accessor: d => d,
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
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
				id: "purchasing_requisition_number",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				accessor: d => d.purchasing_requisition_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_requisition_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_requisition_number} />
				)
			},
			{
				Header:'Line Item',
				id: "item_no",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				accessor: d => d.item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_no} />
				)
			},
			{
				Header:'No Material',
				id: "material_id",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
				accessor: d => (d.material_id==="" || d.material_id===null) ? "" : parseInt(d.material_id),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_id} />
				)
			},
			{
				Header:'Short Text',
				id: "short_text",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
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
			{
				Header:'Qty',
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
				accessor: d => formatNumber(parseFloat(d.per), 2),
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
				Header:'Outl. Aggrement',
				id: "OA",
				accessor: d => (d.outline_agreement==="") ? "" : d.outline_agreement +'-'+formatNumber(d.princ_agreement_item),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="outline_agreement" onChange={(event) => this.handleFilter(event)} value={this.state.options.outline_agreement} />
				)
			},
			{
				Header:'POrg',
				id: "purchasing_org_id",
				accessor: d => d.purchasing_org_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_org_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_org_id} />
				)
			},
			{
				Header:'PGroup',
				id: "purchasing_group_id",
				accessor: d => d.purchasing_group_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_group_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_group_id} />
				)
			},
			{
				Header: () => this.props.t("uom:label.action"),
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
							<Button color="info" size="xs" value={value.uuid} onClick={(e) => this.toDetail(e, value.uuid)} >Detail </Button>
							{this.props.access.D && <Button color="danger" size="xs" value={value.uuid} onClick={(e)=> this.openModal(e, value.uuid)} className="m-r-10">Delete</Button> }
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

  	openModal = (e,uuid) => {
		  let index = this.state.data.data.findIndex(d => d.uuid === uuid);
		  this.setState(({ loadings, modalData }) => ({
			modalDeletePr : true,
			loadings: { ...loadings, loading_proses_delete_pr:false, button: false},
			modalDataPR: { ...modalData, uuid: uuid, data_param: this.state.data.data[index]}
		}))
	  }

	asyncData = async (params) => {
			this.setState({loading: true})
			this.props.setLoading(true, [])
      this.props.fetchPurchasingRequisition(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data}, () => {
						this.props.setLoading(false)
						this.props.setListData(resp.data)
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
		this.props.handleChecklist(e, value, uuid)

		if(((this.props.parentState.purchasing_requisition.items_selected.length-2) < this.props.parentState.data_list.length)){
			this.setState({
				isCheckedAll : false
			})
		}
	
		if((this.props.parentState.purchasing_requisition.items_selected.length+1) > this.props.parentState.data_list.length){
			this.setState({
				isCheckedAll : true
			})
		}
	}
	
	toDetail = (e, id) => {
		this.modals(id)

		// e.preventDefault();
		// this.props.parentProps.history.push(`/tendering/purchasing-requisition/detail/${id}`);
	}

	modals = async (payload) => {
		this.setState(({ modalOpen, loadings , modalData}) => ({
			loadings: { ...loadings, loadingModal:true},
			modalOpen:true,
			modalData: { ...modalData, items:[], item_potext : [] , account_assignment : []}
		}));
		this.props.ShowDetailPurchasingRequisition(payload)
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({  loadings , modalData}) => ({
					loadings: { ...loadings, loadingModal:false},
					modalData: { ...modalData, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
				}));
			})
			.catch((resp) => {
				// this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
				toastr.error(resp.status, resp.message);
				// this.props.history.push('/home')
				this.setState(({  loadings }) => ({
					loadings: { ...loadings, loadingModal:false}
				}));
			});
	}

	toggleClose = (e,id) => {
		this.setState({ modalOpen: false })
	}

	toggleCloseModalDeletePr = (e,id) => {
		this.setState({ modalDeletePr: false })
	}

	deletePurchasingRequisitionItem = (payload) => {
		// console.log(this.state.modalDataPR.uuid)
		// console.log(payload)
		// return
		this.setState(({  loadings }) => ({
			loadings: { ...loadings, loading_proses_delete_pr:true}
		}));
		this.props.deletePurchasingRequisitionItem(this.state.modalDataPR.uuid, payload)
			.then((resp) => {
				this.fetchData()
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
						loadings: { ...loadings, loading_proses_delete_pr:false}
					}));
					// this.setState({ error_delete_pr: error.data.errors, loading_proses_delete_pr: false });
				} else {
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loading_proses_delete_pr:false}
					}));
					toastr.error(error.data.message);
				}
			})
	}
	download() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, downloadExcel: true }
            }));
            this.props.downloadAssignmentPR()
            .then((resp) => {
                console.log('download')
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Assignment PR ${formatDate(localStorage.getItem("times"))}.xlsx`); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            })
            .catch((resp) => {
                console.log('gagal download')
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            });
        }
    }

  render(){
    return (
      <div>
				<Panel>
					<PanelHeader>List Purchase Requisition</PanelHeader>
					<PanelBody>
						<div className="row m-b-10">
                            <div className=" col-sm-12">
                                <button className="pull-right btn btn-sm btn-success" disabled={this.state.loadings.downloadExcel} onClick={ () => this.download()}> {this.state.loadings.downloadExcel && <i className="fa fa-spinner fa-spin"></i>  } Download</button>
                            </div>
                        </div>
						<Row>
							<Col sm="12">
								<ReactTableFixedColumns 
									columns={this.columns} 
									filterable loading={this.state.loading} 
									manual
									minRows={1}
									PaginationComponent={Pagination}
									pageSizeOptions={[-1,5, 10, 15, 20, 50]}
									recordsTotal={this.state.data.recordsTotal}
									recordsFiltered={this.state.data.recordsFiltered}
									data={this.state.data.data} 
									defaultPageSize={-1} 
									defaultSorted={this.defaultSorted} 
									pages={this.state.total}
									page={this.state.options.page}
									onResetFilter={val => this.onResetFilter(val)}
									options={this.state.options}
									hiddenPaginationContent={true}
									style={ (this.state.data.length > 0) ? { height: "450px" } : {}}
									onSortedChange={val => {this.changeSorted(val) }}
									onPageSizeChange={(length) => {this.changePageSize(length)}}
									onPageChange={(perPage) => {this.changePage(perPage)}}
									// style={{
									// 	height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
									//   }}
									className="-striped -highlight" />
							</Col>
						</Row>
					</PanelBody>
				</Panel>
				<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>
					{this.state.loadings.loadingModal && (
						<center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					)}
					{this.state.loadings.loadingModal === false && (
						<FormDetail
						disabledForm={true}
						data={this.state.modalData}
						toggleClose={this.toggleClose}
						/>
					)}
				</Modal>

				<Modal isOpen={this.state.modalDeletePr} toggle={() => this.toggleCloseModalDeletePr()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleCloseModalDeletePr()}>Kembalikan PR ke Perencanaan</ModalHeader>
					
					<FormDeletePR
						errors = {this.state.error_delete_pr}
						loadings = {this.state.loadings}
						modalData={this.state.modalDataPR}
						save={this.deletePurchasingRequisitionItem}
						toggle={this.toggleCloseModalDeletePr}
					/>
					
				</Modal>


			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access
	}
}

const dispatchToProps = dispatch => {
	return {
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		deletePurchasingRequisitionItem: (uuid, payload) => dispatch(deletePurchasingRequisitionItem(uuid, payload)),
		downloadAssignmentPR : () => dispatch(downloadAssignmentPR()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (List));