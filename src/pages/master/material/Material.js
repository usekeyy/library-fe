import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchMaterial,
				showMaterial,
				deleteMaterial,
				saveMaterial,
				updateMaterial,
				syncMaterial} from '../../../store/actions/master/materialActions';
import { fetchMaterialGroup } from '../../../store/actions/master/materialGroupActions';
import { fetchMaterialType } from '../../../store/actions/master/materialTypeActions';
import { fetchUom } from '../../../store/actions/master/uomActions';
import ModalForm from'./sub/Modal';
import ModalSync from'./sub/ModalSync';
import FilterDate from '../../../components/filterdate/FilterDate';
import Pagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import {statusName} from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

class Material extends Component {
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
				updated_at: ''
			},
			statusSearch: [
				{name: 'Active', value: 'y', isChecked: false},
				{name: 'Inactive ', value: 'n', isChecked: false},
			],
			loadings: {
				material_group: false,
				material_type: false,
				uom: false,
			},
			m_material_group: [],
			m_material_type: [],
			m_uom: [],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			toggleSync: false,
			loading: false
		}

		this.defaultSorted = [
			{
				id: "name",
				desc: false
			}
		];
		this.columns = [
			{
				Header: "Material ID",
				id: "id",
				accessor: d => d.id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				)
			},
			{
				Header: "Material Name",
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: "Material Group",
				id: "material_group_name",
				accessor: d => d.material_group_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="material_group_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_group_name} />
				)
			},
			{
				Header: "Material Type",
				id: "material_type_name",
				accessor: d => d.material_type_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="material_type_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.material_type_name} />
				)
			},
			{
				Header: "Uom",
				id: "uom_name",
				accessor: d => d.uom_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="uom_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.uom_name} />
				)
			},
			{
				Header:() => this.props.t("uom:label.name"),
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header: () => this.props.t("uom:label.status"),
				id: "status",
				accessor: d => statusName(d.status),
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
			{
				Header: () => this.props.t("uom:label.created_at"),
				id: "created_at",
				accessor: d => formatDate(d.created_at, true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: () => this.props.t("uom:label.updated_at"),
				id: "updated_at",
				accessor: d => formatDate(d.updated_at, true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
			// {
			// 	Header: () => this.props.t("uom:label.action"),
			// 	id:"action",
			// 	accessor: "uuid",
			// 	filterable: false,
			// 	sortable: false,
			// 	Cell: ({value}) => (
			// 		<React.Fragment>
			// 			<center>
			// 				{this.props.access.U && <Button color="warning" size="xs" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><span className="fa fa-edit"></span> </Button>}
			// 				{this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><span className="fa fa-trash"></span></Button>}
			// 			</center>
			// 		</React.Fragment>
			// 	)
			// },
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
      this.props.fetchMaterial(params)
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
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleAdd: true, uuid: value})
		}
	}
	
	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleSync: true, uuid: value})
		}
	}
	
	toggleFormClose = () => {
		if(this._isMounted){
			this.setState({toggleAdd: false, toggleSync: false, uuid: '', errors: []})
		}
	}

	handleSync = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.syncMaterial(val)
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
					toastr.error("Gagal Sinkron Data");
				}
			})
		}
	}

	handleSave = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.saveMaterial(val)
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
			this.props.updateMaterial(payload, id)
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
			this.props.deleteMaterial(id)
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

	fetchMaterialGroup = async (params = '') => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 5, select: params} : {start: 0, length: 5};
			this.setState(({ loadings }) => ({ loadings: { ...loadings, material_group: true }, m_material_group: [] }));
			this.props.fetchMaterialGroup(select_params)
			.then((resp) => {
				let m_material_group = resp.data.data;
        let options = m_material_group.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, material_group: false },
					m_material_group: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load Region', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, material_group: false } }));
			});
		}
	}

	fetchMaterialType = async (params = '') => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 5, select: params} : {start: 0, length: 5};
			this.setState(({ loadings }) => ({ loadings: { ...loadings, material_type: true }, m_material_type: [] }));
			this.props.fetchMaterialType(select_params)
			.then((resp) => {
				let m_material_type = resp.data.data;
        let options = m_material_type.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, material_type: false },
					m_material_type: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load Countries', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, material_type: false } }));
			});
		}
	}
	
	fetchUom = async (params = '') => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 5, select: params} : {start: 0, length: 5};
			this.setState(({ loadings }) => ({ loadings: { ...loadings, uom: true }, m_uom: [] }));
			this.props.fetchUom(select_params)
			.then((resp) => {
				let m_uom = resp.data.data;
        let options = m_uom.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, uom: false },
					m_uom: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load District', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, region: false } }));
			});
		}
	}

  render(){
	  const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Master Data</li>
					<li className="breadcrumb-item active">{"Material"}</li>
				</ol>
				<h1 className="page-header">Material </h1>
				<Panel loading={false}>
					<PanelHeader>{"Table Material"}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								{/* <div className="pull-right m-b-10">
									{this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e, '')} >{t("uom:button.add")}</Button>}
								</div> */}
								<div className="pull-right m-b-10">
									<Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormSync(e, '')} >Sync</Button>
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
				{this.state.toggleAdd && 
				<ModalForm 
				loading={this.state.loading}
				errors={this.state.errors}
				fetchMaterial={this.props.fetchMaterial}
				showMaterial={this.props.showMaterial} 
				uuid={this.state.uuid} 
				toggleAdd={this.state.toggleAdd} 
				toggleClose={this.toggleFormClose} 
				save={this.handleSave} 
				update={this.handleUpdate}
				fetchMaterialGroup={this.fetchMaterialGroup}
				fetchMaterialType={this.fetchMaterialType}
				fetchUom={this.fetchUom}
				datas={this.state} />}
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
				{this.state.toggleSync && 
				<ModalSync 
				loading={this.state.loading}
				errors={this.state.errors}
				toggleSync={this.state.toggleSync} 
				toggleClose={this.toggleFormClose} 
				fetchMaterialType={this.fetchMaterialType}
				sync={this.handleSync}
				datas={this.state} />}
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
		fetchMaterial: (params) => dispatch(fetchMaterial(params)),
		fetchMaterialGroup: (params) => dispatch(fetchMaterialGroup(params)),
		fetchMaterialType: (params) => dispatch(fetchMaterialType(params)),
		fetchUom: (params) => dispatch(fetchUom(params)),
		saveMaterial: (payload) => dispatch(saveMaterial(payload)),
		showMaterial: (id) => dispatch(showMaterial(id)),
		updateMaterial: (id, payload) => dispatch(updateMaterial(id, payload)),
		deleteMaterial: (id) => dispatch(deleteMaterial(id)),
		syncMaterial: (payload) => dispatch(syncMaterial(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Material));