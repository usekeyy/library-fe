import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { withTranslation } from 'react-i18next';

import FilterDate from '../../../../components/filterdate/FilterDate';
import Pagination from '../../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../../components/filterstatus/FilterStatus';
// import {statusName} from '../../../../helpers/statusName';
import {debounce} from '../../../../helpers/debounce';

class ExtendCompany extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				column: 'vendor_id', 
				order: 'asc', 
				keyword: '',
				page: 0,
				code: '',
				name: '',
				created_at: '',
				updated_at: '',
				approved_at: ''
			},
			statusSearch: [
				{name: 'Registered', value: 's', isChecked: false},
				{name: 'Rejected', value: 'r', isChecked: false},
				{name: 'Processing', value: 'd', isChecked: false},
				{name: 'Unregistered', value: null, isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false
		}

		this.defaultSorted = [
			{
				id: "vendor_id",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'No Pendaftaran',
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_id} />
				)
			},
			{
				Header:'No ERP',
				id: "sap_number",
				accessor: d => d.sap_number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.sap_number} />
				)
			},
			{
				Header:'Nama Vendor',
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_name} />
				)
			},
			{
				Header:'Purchasing Org',
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				)
			},
			{
				Header:'Tanggal Pengajuan',
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header:'Tanggal Approve',
				id: "approved_at",
				accessor: d => d.approved_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="approved_at" getDate={this.updated_at} />
				)
			},
			{
				Header:'Status',
				id: "status",
				accessor: d => d.status_text,
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
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
		this.props.setLoading(true)
		this.props.fetchExtendCompanyRequestor(params)
			.then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
					this.props.setLoading(false)
				}
			})
			.catch((resp) => {
				this.setState({loading: false})
				this.props.setLoading(false)
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
			console.log(this.state.options.start);
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

	created_at = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.created_at = date;
		} else {
			filters.created_at = '';	
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	updated_at = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.approved_at = date;
		} else {
			filters.approved_at = '';
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	getCheck = (check) => {
		let filters = {...this.state.options}
		filters.start = 0;
		if(check.length > 0){
			filters.status = check.join(";");
			this.setState({options: filters}, () => this.fetchData())
		} else {
			filters.status = [];
			this.setState({options: filters}, () => this.fetchData())
		}
	}

  render(){
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
				onResetFilter={val => this.onResetFilter(val)}
							options={this.state.options}
							// style={{ height: "450px" }}
onSortedChange={val => {this.changeSorted(val) }}
				onPageSizeChange={(length) => {this.changePageSize(length)}}
				onPageChange={(perPage) => {this.changePage(perPage)}}
				className="-highlight" />
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
		
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ExtendCompany));