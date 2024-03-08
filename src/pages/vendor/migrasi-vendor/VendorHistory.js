import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Modal, ModalHeader} from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Row, Col} from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import Pagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {fetchVendorHistory, resendEmailMigrasi, updateEmailMigrasi} from '../../../store/actions/vendor/migrasiVendorActions';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FormEditEmail from './sub/FormEditEmail';
class VendorHistory extends Component {
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
            modalOpen : false,
            loadingButton : false,
            dataModal : {}
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
				Header:'Vendor ID',
				id: "id",
                accessor: d => d.id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				),
			},
            {
				Header:'Vendor Name',
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				),
				// Cell: ({value}) => (
				// 	<React.Fragment>
                //         <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${value}`} > {value} </a>
				// 	</React.Fragment>
				// )
            },
            {
				Header:'Email PIC',
				id: "email",
                accessor: d => d.email,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="email" onChange={(event) => this.handleFilter(event)} value={this.state.options.email} />
				),
			},
			{
				Header:'Company Name',
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				),
				// Cell: ({original}) => (
				// 	<React.Fragment>
                //        {original.purchasing_org_id  + ' ' + original.purchasing_org_name}
				// 	</React.Fragment>
				// )
            },
            {
				Header:'Action',
				id: "id",
				accessor: d => d.id,
				filterable : false,
				sortable : false,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				),
				Cell: ({original}) => (
					
					<React.Fragment>
                        <center>
                            <button className="btn btn-sm btn-success" onClick={(e) => this.resendEmail(original.uuid)} disabled={this.state.loadingButton}>
                                {this.state.loadingButton ? <i className="fas fa-circle-notch fa-spin"></i> : 'Resend'}
                            </button>
                            <button className="btn btn-sm btn-warning" onClick={(e) => {this.openModal(e,original)}} disabled={this.state.loadingButton}>Edit PIC</button>
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
        this.props.fetchVendorHistory(params)
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

    resendEmail = async (uuid) => {
	    this.setState({loadingButton: true})
        this.props.resendEmailMigrasi(uuid)
        .then((resp) => {
            toastr.success(resp.data.status,resp.data.message);
            this.setState({loadingButton: false});
        })
        .catch((err) => {
            console.log(err)
            this.setState({loadingButton: false})
            toastr.error("Failed Resend Email");
        });
	}

    updateEmailPIC = async (uuid,params) => {
	    this.setState({loadingButton: true})
        this.props.updateEmailMigrasi(uuid,params)
        .then((resp) => {
            toastr.success(resp.data.status,resp.data.message);
            this.setState({loadingButton: false});
            this.closeModal()
            this.fetchData()
        })
        .catch((err) => {
            console.log(err)
            this.setState({loadingButton: false})
            toastr.error("Failed Update Email", err?.data?.errors?.email?.[0]);
            this.closeModal()
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

    closeModal = () => {
        this.setState({modalOpen : false})
    }

    openModal = (e,data) => {
        e.preventDefault()
        this.setState({modalOpen : true, dataModal : data})
    }

    back = () => {
        this.props.history.push('/vendor/migration');
    }

  render(){

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item active">Vendor History</li>
        </ol>
        <h1 className="page-header">Vendor Belum Konfirmasi Email</h1>
        <Panel loading={false}>
                    <PanelHeader>Tabel Vendor</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
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

                            <Modal isOpen={this.state.modalOpen} toggle={() => this.closeModal()}>
                                <ModalHeader toggle={() => this.closeModal()}>
                                    Kirim Ulang Notifikasi Dengan Email Baru
                                </ModalHeader>
                                <FormEditEmail 
                                    data = {this.state.dataModal}
                                    closeModal = {this.closeModal}
                                    loading = {this.state.loadingButton}
                                    update = {this.updateEmailPIC}
                                />
                            </Modal>
                        </Row>
                        <br></br>
                        <Row>
                            <Col sm="12">
                                <button className="btn btn-white pull-right" onClick={(e) => this.back(e)}>kembali</button>
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
		fetchVendorHistory: (params) => dispatch(fetchVendorHistory(params)),
        resendEmailMigrasi: (uuid) => dispatch(resendEmailMigrasi(uuid)),
        updateEmailMigrasi: (uuid,params) => dispatch(updateEmailMigrasi(uuid,params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (VendorHistory));