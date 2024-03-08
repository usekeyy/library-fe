import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import {fetchVerificationList} from '../../../store/actions/vendor/verifikasiDataActions';
import { fetchProfileVendor } from '../../../store/actions/vendor/profile-vendor/perusahaanActions';
import FilterDate from '../../../components/filterdate/FilterDate';
import Pagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import {statusName} from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class VerificationData extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				page: 0,
				vendor_id: '',
				sap_number: '',
				vendor_name: '',
				vendor_type_name: '',
				name: '',
				created_at: '',
				updated_at: '',
			},
			data: [],
			statusSearch: [
				{name: 'Active', value: 'y', isChecked: false},
				{name: 'Inactive ', value: 'n', isChecked: false},
			],
			access: this.props.access,
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			toggleChangePassword: false,
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
					Header: "No Pendaftaran",
					id: "vendor_id",
					accessor: d => d.vendor_id,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="vendor_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_id} />
					)
				}, {
					Header: "No ERP",
					id: "sap_number",
					accessor: d => d.sap_number,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="sap_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.sap_number} />
					)
				}, {
					Header: "Nama Vendor",
					id: "vendor_name",
					accessor: d => d.vendor_name,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="vendor_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_name} />
					)
				}, {
					Header: "Tipe Vendor",
					id: "vendor_type_name",
					accessor: d => d.vendor_type_name,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="vendor_type_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_type_name} />
					)
				},{
					Header: "Company Name",
					id: "company_name",
					accessor: d => d.company_name,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
					)
				}, {
					Header: "Tanggal Registrasi",
					id: "created_at",
					accessor: d => d.created_at,
					Filter: ({ filter, onChange }) => (
						<FilterDate type="updated_at" getDate={this.created_at} />
					)
				}, 
				// {
				// 	Header: "Status",
				// 	id: "status",
				// 	accessor: d => statusName(d.status),
				// 	Filter: ({ filter, onChange }) => (
				// 		<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				// 	)
				// }, 
				{
					Header: "Status",
					id: "name",
					accessor: d => d.name,
					Filter: ({ filter, onChange }) => (
						<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
					)
				},
				{
					Header: "Action",
					id:"action",
					accessor: d => d,
					filterable: false,
					sortable: false,
					Cell: ({value}) => (
						<React.Fragment>
							<center>
								{this.props.access.A && value.status === 'd' && <button className="btn btn-xs btn-primary" onClick={(e) => this.handleShow(value.vendor_uuid, value.uuid)} >{this.props.t("common:Button.Proses")}</button>}
							</center>
						</React.Fragment>
					)
				}
		];
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
			this.setState({loading: true});
      this.props.fetchVerificationList(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
				}
			})
      .catch((resp) => {
				this.props.history.push('/error/404')
				this.setState({loading: false})
				let message = (typeof resp !== 'undefined') ? resp.data.message : 'Error';
				toastr.error('Oops', message);
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

	handleShow = (vendor_uuid, verif_uuid) => {
		this.setState({loading: true});
		this.props.fetchProfileVendor(vendor_uuid, verif_uuid)
		.then((resp) => {
			this.setState({loading: false}, () => this.handleProcces());
		})
		.catch((resp) => {
			toastr.error(resp.data.status, resp.data.message);
			this.setState({loading: false});
		});
	}

	handleProcces = () => {
		// this.handleShow(value, 'vendor_address')
		this.props.history.push('/vendor/verification/profile')
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

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.options}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({options: optDt}, () => this.fetchData());
		}
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

  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">{t("users:Breadcrumb.Beranda")}</li>
					<li className="breadcrumb-item">{t("verification:Verifikasi Data Vendor")}</li>
					<li className="breadcrumb-item active"> {t("verification:Daftar Verifikasi Data")} </li>
				</ol>
				<h1 className="page-header"> {t("verification:Daftar Verifikasi Data")} </h1>
				<Panel loading={false}>
					<PanelHeader>{t("verification:Daftar Verifikasi Data")}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
								
							</Col>
							<Col sm="6">
								
							</Col>
						</Row>
						<ReactTableFixedColumns 
							filterable loading={this.state.loading} 
							manual
							minRows={1}
							PaginationComponent={Pagination}
							pageSizeOptions={[10, 20, 25, 50, 100]}
							recordsTotal={this.state.data.recordsTotal}
							recordsFiltered={this.state.data.recordsFiltered}
							data={this.state.data.data} 
							columns={this.columns} 
							defaultPageSize={10} 
							defaultSorted={this.defaultSorted} 
							pages={this.state.total}
							page={this.state.options.page}
							onResetFilter={val => this.onResetFilter(val)}
							options={this.state.options}
							// offResetFilter={true}
							// style={{ height: "450px" }}
							onSortedChange={val => {this.changeSorted(val) }}
							onPageSizeChange={(length) => {this.changePageSize(length)}}
							onPageChange={(perPage) => {this.changePage(perPage)}}
							className="-striped -highlight" />
					</PanelBody>
				</Panel>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		auth: state.auth.user.data
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchProfileVendor: (vendor_uuid, verif_uuid) => dispatch(fetchProfileVendor(vendor_uuid, verif_uuid)),
		fetchVerificationList: (params) => dispatch(fetchVerificationList(params))
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(VerificationData));