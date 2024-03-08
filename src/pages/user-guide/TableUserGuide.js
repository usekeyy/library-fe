import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { formatDate } from '../../helpers/formatDate';
import { Panel, PanelHeader, PanelBody  } from '../../containers/layout/sub/panel/panel';
import { fetchUserGuidePublic} from '../../store/actions/master/userGuideActions';
import { debounce } from '../../helpers/debounce';
import FilterDate from '../../components/filterdate/FilterDate';
import Pagination from '../../components/paginations/ReactTablePagination';


class TableUserGuide extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.columns = [
			{
				Header:() => this.props.t("uom:label.id"),
				id: "code",
				filterable: this.props.user.has_roles.includes("ADM001") ? true:false,
				accessor: d => d.code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="code" onChange={(event) => this.handleFilter(event)} value={this.state.options.code} />
				)
			},
			{
				Header:() => this.props.t("userguide:label.description"),
				id: "description",
				accessor: d => d.description,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="description" onChange={(event) => this.handleFilter(event)} value={this.state.options.description} />
				)
			},
			{
				Header:() => 'file',
				id: "path",
				accessor: d => d.path,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="path" onChange={(event) => this.handleFilter(event)} value={this.state.options.path} />
				),
				Cell : ({value})=> (
					<React.Fragment>
						{value!=='' && <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/user_guide_docs/${value}` } > {value} </a> }
					</React.Fragment>
				),
			},
			{
				Header: () => this.props.t("uom:label.created_at"),
				id: "created_at",
				accessor: d => formatDate(d.created_at,true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: () => this.props.t("uom:label.updated_at"),
				id: "updated_at",
				accessor: d => formatDate(d.updated_at,true),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="updated_at" getDate={this.updated_at} />
				)
			},
			{
				Header: () => this.props.t("uom:label.action"),
				id:"action",
				accessor: "uuid",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							<Button color="warning" size="xs" value={value} onClick={(e) => this.detail(e, value)} ><span className="fa fa-eye"></span> </Button>
							{/* {this.props.access.D && <Button color="danger" size="xs" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><span className="fa fa-trash"></span></Button>} */}
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
			code: this.props.user.has_roles.includes("VNDR01") ? this.props.user.has_roles.includes("ADM001") ? 'vendor;internal': 'vendor' :  this.props.user.has_roles.includes("ADM001") ? 'vendor;internal' : 'internal',
			path: '',
			description :'',
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
      this.props.fetchUserGuidePublic(params)
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
    
    detail = (e, id) => {
        e.preventDefault()
        this.props.history.push('/user-guide/'+ id)
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
					<li className="breadcrumb-item active">{t("userguide:title")}</li>
				</ol>
				<h1 className="page-header">{t("userguide:title")}</h1>
				<Panel loading={false}>
					<PanelHeader>{t("userguide:table-title")}</PanelHeader>
					<PanelBody loading={false}>
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{this.props.access.C && <Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormOpen(e)} >{t("uom:button.add")}</Button>}
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
							// defaultSorted={{id: "name",desc: false}} 
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
		access: state.sidebarDt.access,
        user: state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchUserGuidePublic: (params) => dispatch(fetchUserGuidePublic(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableUserGuide));