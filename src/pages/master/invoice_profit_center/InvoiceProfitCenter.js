import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchProfitCenter,syncProfitCenter} from '../../../store/actions/master/invoiceProfitCenterActions';
import FilterDate from '../../../components/filterdate/FilterDate';
import Pagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import {statusName} from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

class InvoiceProfitCenter extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;

		this.state = {
			options: {
				start: 0, 
				length: 10, 
				sorted_column: 1, 
				order: 'asc', 
				keyword: '',
				page: 0,
				id: '',
				code: '',
				name: '',
				created_at: '',
				updated_at: '',
				column : 'id'
			},
			statusSearch: [
				{name: 'Active', value: 'y', isChecked: false},
				{name: 'Inactive ', value: 'n', isChecked: false},
			],
			flagSearch: [
				{name: 'Utama', value: 'y', isChecked: false},
				{name: 'Tidak Utama ', value: 'n', isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false,
			loadingSync: false
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];
		this.columns = [
			{
				Header: "Nomor",
				id: "id",
				accessor: d => d.id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				)
			},
			{
				Header:"Profit Center Code",
				id: "profit_ctr_code",
				accessor: d => d.profit_ctr_code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="profit_ctr_code" onChange={(event) => this.handleFilter(event)} value={this.state.options.profit_ctr_code} />
				)
			},
			{
				Header: "Name Description",
				id: "profit_name",
				accessor: d => d.profit_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="profit_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.profit_name} />
				)
			},
			{
				Header: "Profit Center Text",
				id: "profit_ctr_text",
				accessor: d => d.profit_ctr_text,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="profit_ctr_text" onChange={(event) => this.handleFilter(event)} value={this.state.options.profit_ctr_text} />
				)
			},
			{
				Header: () => this.props.t("uom:label.created_at"),
				id: "created_at",
				accessor: d => formatDate(d.created_at, false),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: () => this.props.t("uom:label.updated_at"),
				id: "updated_at",
				accessor: d => formatDate(d.updated_at, false),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
		]
	}

	debounced = debounce(text => this.fetchData());

  componentDidMount = () => {
    this._isMounted = true;
		this.asyncData(this.state.options);
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
      this.props.fetchProfitCenter(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
				}
			})
      .catch((resp) => {
				this.setState({loading: false})
				toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.state.options)
		}
	}

	syncProfitCenter = async () => {
		this.setState({loadingSync: true})
		this.props.syncProfitCenter()
		.then((resp) => {
					// if(this._isMounted){
					// 	let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
						this.setState({loadingSync: false});
						this.fetchData()
						toastr.success(resp.data.message)
					// }
				})
		.catch((resp) => {
					this.setState({loadingSync: false})
					toastr.error(resp.data.status, resp.data.message);
					// this._isMounted = false;
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
			console.log(this.state.options.start);
		}
	}

	toggleFormOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleAdd: true, uuid: value})
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
			filters.updated_at = date;
		} else {
			filters.updated_at = '';
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

	getCheckFlag = (check) => {
		let filters = {...this.state.options}
		filters.start = 0;
		if(check.length > 0){
			filters.flag = check.join(";");
			this.setState({options: filters}, () => this.fetchData())
		} else {
			filters.flag = [];
			this.setState({options: filters}, () => this.fetchData())
		}
	}
	

  render(){
	  // const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Master Data</li>
					<li className="breadcrumb-item active">Profit Center</li>
				</ol>
				<h1 className="page-header">Master Profit Center </h1>
				{/* <Button size="xs" className="btn btn-default">Sync</Button> */}
				<Panel loading={false}>
					<PanelHeader>{"Table Master Profit Center"}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
								<Button color="primary" size="sm" value="" onClick={this.syncProfitCenter} disabled={this.state.loadingSync}>
									{this.state.loadingSync ? <i className="fa fa-spinner fa-spin"></i> : "Sync"}
								</Button>
								
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{/* <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e, '')} >{t("uom:button.add")}</Button> */}
								</div>
							</Col>
						</Row>
						<br></br>
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
					</PanelBody>
				</Panel>
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
		fetchProfitCenter: (params) => dispatch(fetchProfitCenter(params)),
		syncProfitCenter: (params) => dispatch(syncProfitCenter(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (InvoiceProfitCenter));