import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button, Row, Col} from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import Pagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {getListDokumenExpired} from '../../../../store/actions/vendor/vendorActions';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../helpers/formatDate';
import {debounce} from '../../../../helpers/debounce';
import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import { showVendorSummary } from '../../../../store/actions/vendor/profile-vendor/perusahaanActions';

class TableDokumenExpired extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			profile_vendor:[],
			options: {
				start: 0, 
				length: 10, 
				// sorted_column: 1, 
				column: 'tipe_dokumen',
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
				// {name: 'Submit Pendaftaran', value: 'submit_pendaftaran', isChecked: false},
				// {name: 'Revisi Data ', value: 'revisi_data', isChecked: false},
				// {name: 'Pendaftaran ', value: null, isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: this.props.match.params.uuid,
			toggleAdd: false,
            loading: false,
            isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            redirect:[
                {
                    name : "SIUP",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
                    collapseActive: "Surat Ijin Usaha Perdagangan (SIUP)"
                },
                {
                    name : "SITU",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
                    collapseActive: "SITU/SKDU/Ijin Lokasi"
                },
                {
                    name : "TDP",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
                    collapseActive: "Tanda Daftar Perusahan/TDP"
                },
                {
                    name : "SIUJK",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
                    collapseActive: "Surat Ijin Usaha Jasa Konstruksi"
                },
                {
                    name : "Surat Izin Lainnya",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha',
                    collapseActive: "Surat Ijin Lainnya"
                },
                {
                    name : "SPPKP",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/dokumen-pajak' : '/vendor/verification/dokumen-pajak',
                    collapseActive:"SPPKP"
                },
                {
                    name : "SPT Tahunan",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/dokumen-pajak' : '/vendor/verification/dokumen-pajak',
                    collapseActive:"SPT Tahunan"
                },
                {
                    name : "Surat Keterangan Fiskal",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/dokumen-pajak' : '/vendor/verification/dokumen-pajak',
                    collapseActive: "Surat Keterangan Fiskal"
                },
                {
                    name : "Pakta Integritas",
                    path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/informasi-legal' : '/vendor/verification/informasi-legal',
                    collapseActive: "Pakta Integritas"
                }
            ]
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'Dokumen',
				id: "tipe_dokumen",
				accessor: d => d.tipe_dokumen,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="tipe_dokumen" onChange={(event) => this.handleFilter(event)} value={this.state.options.tipe_dokumen} />
				)
            },
            {
				Header:'Nomor Dokumen',
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.number} />
				)
            },
            {
				Header:'Expired Date',
				id: "expired_date",
                accessor: d => formatDate(d.expired_date),
                filterable: false,
                sortable: false,
				// Filter: ({ filter, onChange }) => (
				// 	<FilterDate type="expired_date" getDate={this.created_at} />
				// )
			},
			{
				Header:'Status',
				id: "status",
				accessor: d => d.status,
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({value}) => (
					<React.Fragment>
                        <div style={{padding : "5px", width : "100%", height : "100%",fontWeight: "bold", color : "white", backgroundColor:(value === 'Expired'? "red" : "#ff9700")}}>
                            <center>{value}</center>
                        </div>
					</React.Fragment>
				)
                
            },
            {
				Header:'Count Days',
				id: "days",
				accessor: d => d.days,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="days" onChange={(event) => this.handleFilter(event)} value={this.state.options.days} />
				)
            },
            {
				Header: () => this.props.t("common:Label.Aksi"),
				id:"action",
				accessor: d => d.tipe_dokumen,
				filterable: false,
                sortable: false,
                show: this.state.isVendor,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							<Link to={{pathname: this.handleRedirectPath(value), name : this.handleRedirectCollapseActive(value)}}>
                                <Button color="warning" size="xs">Proses </Button>
                            </Link>
						</center>
					</React.Fragment>
				)
			}
		]
	}

	debounced = debounce(text => this.fetchData());
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
			this.showVendorSummary(this.state.uuid);
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
        this.props.getListDokumenExpired(this.state.uuid,params)
        .then((resp) => {
                    if(this._isMounted){
                        let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
                        this.setState({loading: false, total: lengthPage, data: resp.data});
                    }
                })
        .catch((resp) => {
                    this.setState({loading: false})
                    toastr.error("error");
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

	showVendorSummary = (id) => {
		this.props.showVendorSummary(id)
		.then((resp) => {
			var data = resp.data.data;
			this.setState({profile_vendor : data});
		})
		.catch((resp) => {
			toastr.error(resp.data.status, resp.data.message);
		});
	}

  render(){

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">Home</li>
            <li className="breadcrumb-item">Vendor Management</li>
            <li className="breadcrumb-item active">Dokumen Expired</li>
        </ol>
		<h1 >Dokumen Expired</h1>
        <h5 style={{marginTop:"-10"}}>{this.state.profile_vendor?.id} - {this.state.profile_vendor?.name}</h5>
        <Panel loading={false}>
                    <PanelHeader>Tabel Dokumen Expired</PanelHeader>
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
		getListDokumenExpired: (uuid,params) => dispatch(getListDokumenExpired(uuid,params)),
		showVendorSummary: (vendor_uuid) => dispatch(showVendorSummary(vendor_uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableDokumenExpired));