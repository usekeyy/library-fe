import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchVendorAccGroup, saveVendorAccGroup, showVendorAccGroup, updateVendorAccGroup, deleteVendorAccGroup} from '../../../store/actions/master/vendorAccGroupActions';
import ModalForm from'./sub/Modal';
import FilterDate from '../../../components/filterdate/FilterDate';
import Pagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import {statusName} from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class VendorAccGroup extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];
		this.columns = [
			{
				Header: () => this.props.t("vendorAccGroup:label.code"),
				id: "id",
				accessor: d => d.id,
				className: "sticky",
				headerClassName: "sticky",
				fixed: "left",
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				)
			},
			{
				Header:() => this.props.t("vendorAccGroup:label.name"),
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: ()=> this.props.t("vendorAccGroup:label.on-time-acc"),
				id: "one_time_acc",
				accessor: d => d.one_time_acc,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="one_time_acc" onChange={(event) => this.handleFilter(event)} value={this.state.options.one_time_acc} />
				)
			},
			{
				Header: ()=> this.props.t("vendorAccGroup:label.status"),
				id: "status",
				accessor: d => statusName(d.status),
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
			{
				Header: ()=> this.props.t("vendorAccGroup:label.created_at"),
				id: "created_at",
				accessor: d => formatDate(d.created_at,true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: ()=> this.props.t("vendorAccGroup:label.updated_at"),
				id: "updated_at",
				accessor: d => formatDate(d.updated_at,true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
			{
				Header: ()=> this.props.t("vendorAccGroup:label.action"),
				id:"action",
				accessor: "uuid",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
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
			page: 0,
			column: '',
			dir: '',
			id: '',
			name: '',
			one_time_acc: '',
			created_at: '',
			updated_at: ''
		},
		filter: {
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
		this.props.fetchVendorAccGroup(params)
		.then((resp) => {
			if(this._isMounted){
				let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
				this.setState({loading: false, total: lengthPage, data: resp.data});
			}
		})
		.catch((resp) => {
			this.setState({loading: false})
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
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
			this.props.saveVendorAccGroup(val)
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
			this.props.updateVendorAccGroup(payload, id)
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
			this.props.deleteVendorAccGroup(id)
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

  render(){
	  const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Master Data</li>
					<li className="breadcrumb-item active">{t("vendorAccGroup:title")}</li>
				</ol>
				<h1 className="page-header">{t("vendorAccGroup:title")} </h1>
				<Panel loading={false}>
					<PanelHeader>{t("vendorAccGroup:table-title")}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} >{t("vendorAccGroup:button.add")}</Button>}
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
									className="-striped -highlight" />
							</Col>
						</Row>
					</PanelBody>
				</Panel>
				{this.state.toggleAdd && 
				<ModalForm 
				loading={false}
				errors={this.state.errors}
				fetchVendorAccGroup={this.props.fetchVendorAccGroup}
				showVendorAccGroup={this.props.showVendorAccGroup} 
				uuid={this.state.uuid} 
				toggleAdd={this.state.toggleAdd} 
				toggleClose={this.toggleFormClose} 
				save={this.handleSave} 
				update={this.handleUpdate} />}
				{(this.state.isConfirm &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={t("common:delete.approve-delete")}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title={t("common:delete.title-delete")}
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
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
		fetchVendorAccGroup: (start, length, column, dir, keyword) => dispatch(fetchVendorAccGroup(start, length, column, dir, keyword)),
		saveVendorAccGroup: (payload) => dispatch(saveVendorAccGroup(payload)),
		showVendorAccGroup: (id) => dispatch(showVendorAccGroup(id)),
		updateVendorAccGroup: (id, payload) => dispatch(updateVendorAccGroup(id, payload)),
		deleteVendorAccGroup: (id) => dispatch(deleteVendorAccGroup(id)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (VendorAccGroup));