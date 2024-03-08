import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Row, Col} from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import Pagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {fetchMigrasiLog} from '../../../store/actions/vendor/migrasiVendorActions';
// import { Link } from 'react-router-dom';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
class MigrasiVendorList extends Component {
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
                tipe_dokumen: '',
                number:'',
                expired_date:'',
                status:'',
                days:''
			},
			statusSearch: [
				{name: 'Expired', value: 'Expired', isChecked: false},
				{name: 'Akan Expired', value: 'Akan Expired', isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			// uuid: this.props.match.params.uuid,
			toggleAdd: false,
            loading: false,
            isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'No',
				id: "id",
				accessor: d => d.id,
				filterable : false,
				sortable : false,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				),
				Cell: ({index}) => (
					
					<React.Fragment>
						{/* {console.log(index)} */}
                        {index + 1 + this.state.options.start}
					</React.Fragment>
				)
            },
            {
				Header:'File',
				id: "file",
				accessor: d => d.file,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="file" onChange={(event) => this.handleFilter(event)} value={this.state.options.file} />
				),
				Cell: ({value}) => (
					<React.Fragment>
                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${value}`} > {value} </a>
					</React.Fragment>
				)
            },
            {
				Header:'Created By',
				id: "created_by_name",
                accessor: d => d.created_by_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="created_by_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.created_by_name} />
				),
			},
			{
				Header:'Tanggal',
				id: "created_at",
                accessor: d => formatDate(d.created_at,true),
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="created_at" onChange={(event) => this.handleFilter(event)} value={this.state.options.created_at} />
				),
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
        this.props.fetchMigrasiLog(params)
        .then((resp) => {
                    if(this._isMounted){
                        let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
                        this.setState({loading: false, total: lengthPage, data: resp.data});
                    }
                })
        .catch((resp) => {
                    this.setState({loading: false})
                    // toastr.error("error");
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

	toProfileVendor = () => {
		this.props.history.push('/vendor/verification/profile')
	}

	toSortProfileVendor = (e, vendro_uuid, verif_uuid) => {
		this.props.history.push('/vendor/list/profile/'+vendro_uuid)
    }
    
    handleRedirectPath = (name) => {
        // console.log(name)
        let data = this.state.redirect.filter((item)=>{
            return (item.name === name)
        })
        // console.log(data?.[0]?.path)
        return data?.[0]?.path
        
    }

    handleRedirectCollapseActive = (name) => {
        console.log(name)
        let data = this.state.redirect.filter((item)=>{
            return (item.name === name)
        })
        console.log(data?.[0]?.collapseActive)
        return data?.[0]?.collapseActive
        
    }

    redirectCreateMigrasi = () => {
        this.props.history.push('/vendor/migration/create');
    }

	redirectVendorHistory = () => {
		this.props.history.push('/vendor/migration/history-vendor')
	}

	redirectSimap = () => {
		this.props.history.push('/vendor/migration/upload-simap')
	}
	

  render(){

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item active">Log Migrasi</li>
        </ol>
        <h1 className="page-header">Log Migrasi</h1>
        <Panel loading={false}>
                    <PanelHeader>Tabel Log Migrasi</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <button className="btn btn-success" onClick={this.redirectCreateMigrasi}>Upload File Migrasi</button>

								<button className="btn btn-warning pull-right" onClick={this.redirectSimap}>Upload SIMAP</button> 
								<button className="btn btn-warning pull-right m-r-10" onClick={this.redirectVendorHistory}>History Send Email</button>
                                <br></br>
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
                            </Col>
                        </Row>
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
        user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchMigrasiLog: (params) => dispatch(fetchMigrasiLog(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (MigrasiVendorList));