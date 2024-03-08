import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import Pagination from '../../../components/paginations/ReactTablePagination';
import {fetchRole, saveRole, showRole, updateRole, deleteRole} from '../../../store/actions/utility/roleActions';
import * as tableOptions from './sub/tableOptions';
import ModalForm from'./sub/Modal';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import {statusName} from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';

class Role extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;

		this.columns = [
			{
				Header: "Nama",
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: "Code",
				id: "code",
				accessor: d => d.code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="code" onChange={(event) => this.handleFilter(event)} value={this.state.options.code} />
				)
			},
			{
				Header: "Status",
				id: "status",
				accessor: d => statusName(d.status),
				Filter: ({ filter, onChange }) => (
					<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
			{
				Header: "Tanggal Dibuat",
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: "Tanggal Diubah",
				id: "updated_at",
				accessor: d => d.updated_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
			{
				Header: "Action",
				id:"action",
				accessor: "uuid",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							{this.props.access.U && <Button color="primary" size="xs" value={value} onClick={(e) => this.showEdit(e, value)} ><span className="fa fa-cog"></span> </Button>}
							{this.props.access.U && <Button color="warning" size="xs" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><span className="fa fa-edit"></span> </Button>}
							{this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><span className="fa fa-trash"></span></Button>}
						</center>
					</React.Fragment>
				)
			},
		]
	}
	
  state = {
		options: {
			start: 0, 
			length: 10, 
			sorted_column: 1, 
			order: 'asc', 
			keyword: '',
			page: 0,
			name: '',
			code: '',
			created_at: '',
			updated_at: ''
		},
		statusSearch: [
			{name: 'Active', value: 'y', isChecked: false},
			{name: 'Inactive ', value: 'n', isChecked: false},
		],
		data: [],
		errors: [],
		total: 0,
		isConfirm: false,
		uuid: '',
		toggleAdd: false,
		loading: false
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
      this.props.fetchRole(params)
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
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleAdd: true, uuid: uuid})
		}
	}
	
	toggleFormClose = () => {
		if(this._isMounted){
			this.setState({toggleAdd: false, uuid: '', errors: []})
		}
	}

	handleSave = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.saveRole(val)
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
			this.setState({loading: true})
			this.props.updateRole(payload, id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false, errors: []}, () => this.fetchData());
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

	handleDelete = (id) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.deleteRole(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, toggleAdd: false}, () => this.fetchData());
			})
			.catch(error => {
					const {message} = error.data;
					if(typeof message === 'string') {
							toastr.error('Something Wrong', message);
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

	showEdit = (e, value) => {
		this.props.history.push('/user/role/edit/'+value)
	}

  render(){
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">User Management</li>
					<li className="breadcrumb-item active">Role</li>
				</ol>
				<h1 className="page-header">Role </h1>
				<Panel loading={false}>
					<PanelHeader>Table Role</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} >Add New</Button>}
								</div>
							</Col>
						</Row>
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
							defaultSorted={tableOptions.defaultSorted} 
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
				{this.state.toggleAdd && 
				<ModalForm 
				loading={false}
				errors={this.state.errors}
				fetchRole={this.props.fetchRole}
				showRole={this.props.showRole} 
				uuid={this.state.uuid} 
				toggleAdd={this.state.toggleAdd} 
				toggleClose={this.toggleFormClose} 
				save={this.handleSave} 
				update={this.handleUpdate} />}
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
		fetchRole: (params) => dispatch(fetchRole(params)),
		saveRole: (payload) => dispatch(saveRole(payload)),
		showRole: (id) => dispatch(showRole(id)),
		updateRole: (id, payload) => dispatch(updateRole(id, payload)),
		deleteRole: (id) => dispatch(deleteRole(id)),
	}
}

export default connect(stateToProps, dispatchToProps)(Role);