import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button } from 'reactstrap';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import FormDetail from './FormDetail';
import {ShowDetailPurchasingRequisition} from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import { withTranslation } from 'react-i18next';

import Pagination from '../../../../../components/paginations/ReactTablePagination';
import { formatNumber } from '../../../../../helpers/formatNumber';


class Table extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			options: {
				start: 0,
				length: 10,
				sorted_column: 1,
				// order: 'asc',
				page: 0,
				purchasing_requisition_number: '',
				source_detemination: '',
				assign_to_buyer: '',
				item_no: '',
				material_id: '',
				short_text: '',
				material_group_id: '',
				qty: '',
				uom: '',
				per:'',
				unit_price: '',
				valuation_price: '',
				plant_id: '',
				purchasing_org_name: '',
				purchasing_group_name: '',
				outline_agreement:''
			},
			statusSearch: [
				{ name: 'Open', value: 'o', isChecked: false },
				{ name: 'Reject ', value: 'r', isChecked: false },
				{ name: 'Submit ', value: 's', isChecked: false },
				{ name: 'Draft ', value: 'd', isChecked: false },
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false,
			modalOpen: false,
			loadings:{
				loadingModal:false,
			},
			modalData : {
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			}
		}

		this.defaultSorted = [
			{
				id: "purchasing_requisition_number",
				desc: false
			}
		];

		this.columns = [
			{
				Header: 'No PR',
				id: "purchasing_requisition_number",
				accessor: d => d.purchasing_requisition_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_requisition_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_requisition_number} />
				)
			},
			{
				Header: 'Source Detemination',
				id: "source_detemination",
				accessor: d => d.source_detemination,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="source_detemination" onChange={(event) => this.handleFilter(event)} value={this.state.options.source_detemination} />
				)
			},
			{
				Header: 'Assign To Buyer',
				id: "assign_to_buyer",
				accessor: d => d.assign_to_buyer,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="assign_to_buyer" onChange={(event) => this.handleFilter(event)} value={this.state.options.assign_to_buyer} />
				)
			},
			{
				Header: 'Line Item',
				id: "item_no",
				accessor: d => d.item_no,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="item_no" onChange={(event) => this.handleFilter(event)} value={this.state.options.item_no} />
				)
			},
			{
				Header: 'No Material',
				id: "material_id",
				accessor: d => (d.material_id === "" || d.material_id === undefined) ? d.material_id : parseFloat(d.material_id),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_id} />
				)
			},
			{
				Header: 'Short Text',
				id: "short_text",
				accessor: d => d.short_text,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="short_text" onChange={(event) => this.handleFilter(event)} value={this.state.options.short_text} />
				)
			},
			{
				Header: 'Material Group',
				id: "material_group_id",
				accessor: d => d.material_group_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="material_group_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_group_id} />
				)
			},
			{
				Header: 'Plant',
				id: "plant_id",
				accessor: d => d.plant_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="plant_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.plant_id} />
				)
			},
			{
				Header: 'Qty',
				id: "qty",
				accessor: d => formatNumber(d.qty, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="qty" onChange={(event) => this.handleFilter(event)} value={this.state.options.qty} />
				)
			},
			{
				Header: 'Uom',
				id: "uom",
				accessor: d => d.uom,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="uom" onChange={(event) => this.handleFilter(event)} value={this.state.options.uom} />
				)
			},
			{
				Header: 'Per',
				id: "per",
				accessor: d => formatNumber(d.per, 2),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="per" onChange={(event) => this.handleFilter(event)} value={this.state.options.per} />
				)
			},
			{
				Header: 'Harga Satuan',
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
				Header: 'POrg',
				id: "purchasing_org_name",
				accessor: d => d.purchasing_org_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_org_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_org_name} />
				)
			},
			{
				Header: 'PGroup',
				id: "purchasing_group_name",
				accessor: d => d.purchasing_group_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="purchasing_group_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_group_name} />
				)
			},
			{
				Header: () => this.props.t("uom:label.action"),
				id: "action",
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<React.Fragment>
						<center>
							<Button color="info" size="xs" value={value.uuid} onClick={(e) => this.toDetail(e, value.uuid)} >Detail </Button>
						</center>
					</React.Fragment>
				)
			},
		]
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.fetchData();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	asyncData = async (params) => {
		console.log(params)
		this.setState({ loading: true })
		this.props.setLoading(true)
		this.props.fetchPurchasingRequisition(params)
			.then((resp) => {
				if (this._isMounted) {
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({ loading: false, total: lengthPage, data: resp.data });
					this.props.setLoading(false)
				}
			})
			.catch((resp) => {
				this.setState({ loading: false })
				this.props.setLoading(false)
toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

	fetchData = () => {
		if (this._isMounted) {
			// console.log(this.state.options)
			this.asyncData(this.state.options)
		}
	}

	changePage = (perPage) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			let numb = 0;
			numb = perPage;
			if (numb > 0) {
				numb = perPage * this.state.options.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
		}
	}

	changePageSize = (length) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
			// console.log(this.state.options.start);
		}
	}

	changeSorted = (val) => {
		if (this._isMounted) {
			let optDt = { ...this.state.options }
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({ options: optDt }, () => this.fetchData());
		}
	}

	onResetFilter = (val) => {
		this.setState({
      options: val
    }, () => this.fetchData());    
	}

handleFilter = (event) => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({ options: filters }, () => {
			this.fetchData()
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
			this.fetchData()
		})
	}

	updated_at = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.updated_at = date;
		} else {
			filters.updated_at = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	getCheck = (check) => {
		let filters = { ...this.state.options }
		filters.start = 0;
		if (check.length > 0) {
			filters.status = check.join(";");
			this.setState({ options: filters }, () => this.fetchData())
		} else {
			filters.status = [];
			this.setState({ options: filters }, () => this.fetchData())
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

	onResetFilter = (val) => {
		this.setState({
			options: val
		}, () => this.fetchData());
	}

	render() {
		return (
			<div>
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
					onSortedChange={val => { this.changeSorted(val) }}
					onPageSizeChange={(length) => { this.changePageSize(length) }}
					onPageChange={(perPage) => { this.changePage(perPage) }}
					onResetFilter={val => this.onResetFilter(val)}
					options={this.state.options}
					className="-highlight" />

				<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleClose()}>Detail Items</ModalHeader>
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
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Table));