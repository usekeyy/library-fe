import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { withTranslation } from 'react-i18next';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';

import {fetchUsers, saveUsers, showUsers, updateUsers, deleteUsers, changePassword, changePasswordByAdmin} from '../../../store/actions/utility/usersActions';
import {fetchRole} from '../../../store/actions/utility/roleActions';
import {fetchCompanies} from '../../../store/actions/master/companyActions';
import {fetchWorkUnits} from '../../../store/actions/master/workUnitsActions';
import {fetchPurchasingGroup} from '../../../store/actions/master/purchasingGroupActions';
import {fetchPurchasingOrg} from '../../../store/actions/master/purchasingOrgActions';
import {fetchGeneralPlanner} from '../../../store/actions/master/generalPlannerActions';
import {fetchSpecificPlanner} from '../../../store/actions/master/specificPlannerActions';
import * as tableOptions from './sub/tableOptions';
import ModalForm from'./sub/Modal';
import ModalDetail from'./sub/ModalDetail';
import ChangePassword from'./sub/ChangePassword';
import ChangePasswordByAdmin from'./sub/ChangePasswordByAdmin';
import FilterDate from '../../../components/filterdate/FilterDate';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import Pagination from '../../../components/paginations/ReactTablePagination';
import {statusName} from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class Users extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				page: 0,
				name: '',
				username: '',
				email: '',
				company_id:'',
				status: [],
				created_at: '',
				updated_at: '',
			},
			data: [],
			statusSearch: [
				{name: 'Active', value: 'y', isChecked: false},
				{name: 'Inactive ', value: 'n', isChecked: false},
			],
			total: 0,
			access: this.props.access,
			errors: [],
			isConfirm: false,
			isConfirmPassword: false,
			uuid: '',
			toggleAdd: false,
			toggledetail: false,
			toggleChangePassword: false,
			toggleChangePasswordByAdmin : false,
			loading: false
		}

		this.columns = [
			{
				Header: () => this.props.t("users:Label.Nama"),
				id: "name",
				className: "sticky",
				headerClassName: "sticky",
				fixed: "left",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: () => this.props.t("users:Label.Username"),
				id: "username",
				className: "sticky",
				headerClassName: "sticky",
				fixed: "left",
				accessor: d => d.username,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="username" onChange={(event) => this.handleFilter(event)} value={this.state.options.username} />
				)
			},
			{
				Header: () => this.props.t("users:Label.Email"),
				id: "email",
				accessor: d => d.email,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="email" onChange={(event) => this.handleFilter(event)} value={this.state.options.email} />
				)
			},
			{
				Header: () => this.props.t("users:Label.Status"),
				id: "status",
				accessor: d => statusName(d.status),
				Filter: ({ filter, onChange }) => (
					<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
			{
				Header:  () => this.props.t("users:Label.company-code"),
				id: "company_id",
				accessor: d => d.company_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_id} />
				)
			},
			{
				Header: () => this.props.t("users:Label.Tanggal Dibuat"),
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: () => this.props.t("users:Label.Tanggal Diubah"),
				id: "updated_at",
				accessor: d => d.updated_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
			{
				Header: () => this.props.t("common:Label.Aksi"),
				id:"uuid",
				accessor: "uuid",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							{/* {this.props.access.U && <Button color="primary" size="xs" value={value} onClick={(e) => this.toggleChangePasswordOpen(e, value)} ><span className="fas fa-key"></span> </Button>} */}
							{<Button color="green" size="xs" value={value} onClick={(e) => this.toggleDetail(e, value)} ><span className="fa fa-info-circle"></span> </Button>}
							{/* {this.props.access.U && <Button color="primary" size="xs" value={value} onClick={(e) => this.showPermission(e, value)} ><span className="fa fa-cog"></span> </Button>} */}
							{this.props.access.U && <Button color="warning" size="xs" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><span className="fa fa-edit"></span> </Button>}
							{this.props.access.U && <Button color="primary" size="xs" value={value} onClick={(e) => this.toggleChangePasswordByAdminOpen(e, value)} ><span className="fa fa-key"></span> </Button>}
							{this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><span className="fa fa-trash"></span></Button>}
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
			this.asyncData(this.state.options);
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
			this.setState({loading: true});
      this.props.fetchUsers(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
				}
			})
      .catch((resp) => {
				this.setState({loading: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
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

	toggleDetail = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = e.target.value;
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleDetail: true, uuid: uuid})
		}
	}

	toggleFormOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = e.target.value;
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleAdd: true, uuid: uuid})
		}
	}
	
	toggleFormClose = () => {
		if(this._isMounted){
			this.setState({toggleAdd: false, uuid: '', errors: []})
		}
	}

	toggleDetailClose = () => {
		if(this._isMounted){
			this.setState({toggleDetail: false, uuid: '', errors: []})
		}
	}

	toggleChangePasswordOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			console.log(value);
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleChangePassword: true, uuid: uuid})
		}
	}

	toggleChangePasswordClose = () => {
		if(this._isMounted){
			this.setState({toggleChangePassword: false, uuid: '', errors: []})
		}
	}

	toggleChangePasswordByAdminOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault()
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({isConfirmPassword: true, uuid: uuid})
		}
	}

	toggleSweetAlertPassword(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.setState({ isConfirmPassword: false });
					this.handleChangePasswordByAdmin(this.state.uuid)
					break;
				case 'cancel':
					this.setState({ isConfirmPassword: false, uuid: '' });
					break;
				default:
					break;
			}
		}
	}

	toggleChangePasswordByAdminClose = () => {
		if(this._isMounted){
			this.setState({toggleChangePasswordByAdmin: false, uuid: '', errors: []})
		}
	}

	handleSave = (val) => {
		if(this._isMounted){
			this.setState({loading: true});
			this.props.saveUsers(val)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false, errors: []}, () => {
					this.fetchData()
				});
			})
			.catch(error => {
					if(typeof error !== 'undefined'){
						const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
						toastr.error(message);
						this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
					} else {
						this._isMounted && this.setState({loading: false});
						toastr.error("Gagal Menyimpan Data");
					}
			})
		}
	}

	handleUpdate = (payload, id) => {
		if(this._isMounted){
			this.setState({loading: true});
			this.props.updateUsers(payload, id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this.setState({loading: false, toggleAdd: false, errors: [], uuid: ''});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this.setState({loading: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
		}
	}

	handleChangePassword = (id, payload) => {
		if(this._isMounted){
			this.setState({loading: true});
			this.props.changePassword(id, payload)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this.setState({loading: false, toggleChangePassword: false, errors: []}, () => this.fetchData());
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this.setState({loading: false});
					toastr.error("Failed Change Password");
				}
			})
		}
	}

	handleChangePasswordByAdmin = (id) => {
		if(this._isMounted){
			console.log(id)
			this.setState({loading: true});
			this.props.changePasswordByAdmin(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this.setState({loading: false, errors: []}, () => this.fetchData());
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this.setState({loading: false});
					toastr.error("Failed Change Password");
				}
			})
		}
	}

	handleDelete = (id) => {
		if(this._isMounted){
			this.setState({loading: true});
			this.props.deleteUsers(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false}, () => this.fetchData());
			})
			.catch(error => {
					const {message} = error.data;
					if(typeof message === 'string') {
							toastr.error('Gagal', message);
					}
					this._isMounted && this.setState({error: true, errors: message, loading: false});
			})
		}
	}

	toggleConfirm = (e, value) => {
		if(this._isMounted){
			e.preventDefault()
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({isConfirm: true, uuid: uuid})
		}
	}

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.setState({ isConfirm: false });
					this.handleDelete(this.state.uuid)
					break;
				case 'cancel':
					this.setState({ isConfirm: false, uuid: '' });
					break;
				default:
					break;
			}
		}
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
	
	onResetFilter = (val) => {
		this.setState({
      options: val
    }, () => this.fetchData());    
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

	showPermission = (e, value) => {
		this.props.history.push('/user/user/object-permission/'+value)
	}

  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">{t("users:Breadcrumb.Beranda")}</li>
					<li className="breadcrumb-item">{t("users:Breadcrumb.Managemen Pengguna")}</li>
					<li className="breadcrumb-item active"> {t("users:Breadcrumb.Pengguna")} </li>
				</ol>
				<h1 className="page-header"> {t("users:Title")} </h1>
				<Panel loading={false}>
					<PanelHeader>{t("users:Tabel User")}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">

							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} > {t("common:Button.Tambah Baru")} </Button>}
								</div>
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
							defaultSorted={tableOptions.defaultSorted} 
							pages={this.state.total}
							page={this.state.options.page}
							onResetFilter={val => this.onResetFilter(val)}
							options={this.state.options}
							// style={{ height: "450px" }}
							onSortedChange={val => {this.changeSorted(val) }}
							onPageSizeChange={(length) => {this.changePageSize(length)}}
							onPageChange={(perPage) => {this.changePage(perPage)}}
							className="-striped -highlight" />
					</PanelBody>
				</Panel>
				{this.state.toggleAdd && 
					<ModalForm 
						loading={this.state.loading}
						errors={this.state.errors}
						fetchRole={this.props.fetchRole}
						fetchCompanies={this.props.fetchCompanies}
						fetchWorkUnits={this.props.fetchWorkUnits}
						fetchPurchasingGroup={this.props.fetchPurchasingGroup}
						fetchPurchasingOrg={this.props.fetchPurchasingOrg}
						fetchGeneralPlanner={this.props.fetchGeneralPlanner}
						fetchSpecificPlanner={this.props.fetchSpecificPlanner}
						showUsers={this.props.showUsers} 
						uuid={this.state.uuid} 
						toggleAdd={this.state.toggleAdd} 
						toggleClose={this.toggleFormClose} 
						save={this.handleSave} 
						update={this.handleUpdate}
				/>}
				{this.state.toggleDetail && 
					<ModalDetail 
						toggleDetail={this.state.toggleDetail} 
						loading={this.state.loading}
						errors={this.state.errors}
						showUsers={this.props.showUsers} 
						uuid={this.state.uuid} 
						toggleClose={this.toggleDetailClose} 
				/>}
				{this.state.toggleChangePassword && 
					<ChangePassword 
						loading={this.state.loading}
						errors={this.state.errors}
						uuid={this.state.uuid} 
						toggleOpen={this.state.toggleChangePassword} 
						toggleClose={this.toggleChangePasswordClose} 
						save={this.handleChangePassword}
				/>}
				{this.state.toggleChangePasswordByAdmin && 
					<ChangePasswordByAdmin 
						loading={this.state.loading}
						errors={this.state.errors}
						uuid={this.state.uuid} 
						toggleOpen={this.state.toggleChangePasswordByAdmin} 
						toggleClose={this.toggleChangePasswordByAdminClose} 
						save={this.handleChangePasswordByAdmin}
				/>}
				{(this.state.isConfirm &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText="Yes, delete it!"
						cancelBtnText="Cancel"
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title="Apakah anda yakin ?"
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
						Delete This Data?
					</SweetAlert>
				)}
				{(this.state.isConfirmPassword &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title="Change Password ?"
						onConfirm={() => this.toggleSweetAlertPassword('confirm')}
						onCancel={() => this.toggleSweetAlertPassword('cancel')}
					>
						Apa Anda Yakin Ingin Merubah Password?
					</SweetAlert>
				)}
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
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		saveUsers: (payload) => dispatch(saveUsers(payload)),
		showUsers: (id) => dispatch(showUsers(id)),
		updateUsers: (id, payload) => dispatch(updateUsers(id, payload)),
		changePassword: (id, payload) => dispatch(changePassword(id, payload)),
		deleteUsers: (id) => dispatch(deleteUsers(id)),
		fetchRole: (params) => dispatch(fetchRole(params)),
		fetchCompanies: (params) => dispatch(fetchCompanies(params)),
		fetchWorkUnits: (params) => dispatch(fetchWorkUnits(params)),
		fetchPurchasingGroup: (params) => dispatch(fetchPurchasingGroup(params)),
		fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
		fetchGeneralPlanner: (params) => dispatch(fetchGeneralPlanner(params)),
		fetchSpecificPlanner: (params) => dispatch(fetchSpecificPlanner(params)),
		changePasswordByAdmin: (id, payload) => dispatch(changePasswordByAdmin(id, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Users));