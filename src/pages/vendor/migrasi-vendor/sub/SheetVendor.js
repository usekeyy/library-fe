import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody} from 'reactstrap';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import Pagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import {debounce} from '../../../../helpers/debounce';
import {fetchMigrasiVendor} from '../../../../store/actions/vendor/migrasiVendorActions';
// import { Link } from 'react-router-dom';
// import { formatDate } from '../../../../helpers/formatDate';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class SheetVendor extends Component {
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
			toggleAdd: false,
            loading: false,
            isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			popOver : false
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
				id: "tipe_dokumen",
				accessor: d => d.tipe_dokumen,
				Cell: (item) => (
					<React.Fragment>
						{item.index + 1}
					</React.Fragment>
				)
            },
            {
				Header:'vendor_id',
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_id} />
				)
            },
			{
				Header:'sap_kode_vendor',
				id: "sap_kode_vendor",
				accessor: d => d.sap_kode_vendor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_kode_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.sap_kode_vendor} />
				)
            },
			{
				Header:'sap_account_group',
				id: "sap_account_group",
				accessor: d => d.sap_account_group,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_account_group" onChange={(event) => this.handleFilter(event)} value={this.state.options.sap_account_group} />
				)
            },
			{
				Header:'title_vendor',
				id: "title_vendor",
				accessor: d => d.title_vendor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.title_vendor} />
				)
            },
			{
				Header:'nama_vendor',
				id: "nama_vendor",
				accessor: d => d.nama_vendor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nama_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.nama_vendor} />
				)
            },
			{
				Header:'tipe_vendor',
				id: "tipe_vendor",
				accessor: d => d.tipe_vendor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="tipe_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.tipe_vendor} />
				)
            },
			{
				Header:'country_id',
				id: "country_id",
				accessor: d => d.country_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="country_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.country_id} />
				)
            },
			{
				Header:'provinsi_id',
				id: "provinsi_id",
				accessor: d => d.provinsi_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="provinsi_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.provinsi_id} />
				)
            },
			{
				Header:'kabupaten_id',
				id: "kabupaten_id",
				accessor: d => d.kabupaten_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="kabupaten_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.kabupaten_id} />
				)
            },		
            {
				Header:'kecamatan_id',
				id: "kecamatan_id",
				accessor: d => d.kecamatan_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="kecamatan_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.kecamatan_id} />
				)
            },
			{
				Header:'kelurahan_id',
				id: "kelurahan_id",
				accessor: d => d.kelurahan_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="kelurahan_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.kelurahan_id} />
				)
            },
			{
				Header:'alamat lengkap',
				id: "alamat_lengkap",
				accessor: d => d.alamat_lengkap,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="alamat_lengkap" onChange={(event) => this.handleFilter(event)} value={this.state.options.alamat_lengkap} />
				)
            },
			{
				Header:'postal_code',
				id: "postal_code",
				accessor: d => d.postal_code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="postal_code" onChange={(event) => this.handleFilter(event)} value={this.state.options.postal_code} />
				)
            },
			{
				Header:'province_luar_negeri',
				id: "province_luar_negeri",
				accessor: d => d.province_luar_negeri,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="province_luar_negeri" onChange={(event) => this.handleFilter(event)} value={this.state.options.province_luar_negeri} />
				)
            },
			{
				Header:'district_luar_negeri',
				id: "district_luar_negeri",
				accessor: d => d.district_luar_negeri,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="district_luar_negeri" onChange={(event) => this.handleFilter(event)} value={this.state.options.district_luar_negeri} />
				)
            },		
            {
				Header:'subdistrict_luar_negeri',
				id: "subdistrict_luar_negeri",
				accessor: d => d.subdistrict_luar_negeri,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="subdistrict_luar_negeri" onChange={(event) => this.handleFilter(event)} value={this.state.options.subdistrict_luar_negeri} />
				)
            },
			// {
			// 	Header:'direktur_utama',
			// 	id: "direktur_utama",
			// 	accessor: d => d.direktur_utama,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="direktur_utama" onChange={(event) => this.handleFilter(event)} value={this.state.options.direktur_utama} />
			// 	)
            // },
			// {
			// 	Header:'email',
			// 	id: "email",
			// 	accessor: d => d.email,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="email" onChange={(event) => this.handleFilter(event)} value={this.state.options.email} />
			// 	)
            // },
			{
				Header:'website',
				id: "website",
				accessor: d => d.website,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="website" onChange={(event) => this.handleFilter(event)} value={this.state.options.website} />
				)
            },
			{
				Header:'telepon_kantor',
				id: "telepon_kantor",
				accessor: d => d.telepon_kantor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="telepon_kantor" onChange={(event) => this.handleFilter(event)} value={this.state.options.telepon_kantor} />
				)
            },		
            {
				Header:'nomor_npwp',
				id: "nomor_npwp",
				accessor: d => d.nomor_npwp,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nomor_npwp" onChange={(event) => this.handleFilter(event)} value={this.state.options.nomor_npwp} />
				)
            },
			// {
			// 	Header:'npwp_date',
			// 	id: "npwp_date",
			// 	accessor: d => d.npwp_date,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="npwp_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.npwp_date} />
			// 	)
            // },
			{
				Header:'nomor_sppkp',
				id: "nomor_sppkp",
				accessor: d => d.nomor_sppkp,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nomor_sppkp" onChange={(event) => this.handleFilter(event)} value={this.state.options.nomor_sppkp} />
				)
            },
			// {
			// 	Header:'sppkp_start_date',
			// 	id: "sppkp_start_date",
			// 	accessor: d => d.sppkp_start_date,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="sppkp_start_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.sppkp_start_date} />
			// 	)
            // },
			// {
			// 	Header:'sppkp_end_date',
			// 	id: "sppkp_end_date",
			// 	accessor: d => d.sppkp_end_date,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="sppkp_end_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.sppkp_end_date} />
			// 	)
            // },
			// {
			// 	Header:'lembaga_sppkp',
			// 	id: "lembaga_sppkp",
			// 	accessor: d => d.lembaga_sppkp,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="lembaga_sppkp" onChange={(event) => this.handleFilter(event)} value={this.state.options.lembaga_sppkp} />
			// 	)
            // },
			{
				Header:'nomor_siup',
				id: "nomor_siup",
				accessor: d => d.nomor_siup,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nomor_siup" onChange={(event) => this.handleFilter(event)} value={this.state.options.nomor_siup} />
				)
            },
			// {
			// 	Header:'siup_start_date',
			// 	id: "siup_start_date",
			// 	accessor: d => d.siup_start_date,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="siup_start_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.siup_start_date} />
			// 	)
            // },
			{
				Header:'siup_end_date',
				id: "siup_end_date",
				accessor: d => d.siup_end_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="siup_end_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.siup_end_date} />
				)
            },
			// {
			// 	Header:'lembaga_siup',
			// 	id: "lembaga_siup",
			// 	accessor: d => d.lembaga_siup,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="lembaga_siup" onChange={(event) => this.handleFilter(event)} value={this.state.options.lembaga_siup} />
			// 	)
            // },
			{
				Header:'nomor_tdp',
				id: "nomor_tdp",
				accessor: d => d.nomor_tdp,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nomor_tdp" onChange={(event) => this.handleFilter(event)} value={this.state.options.nomor_tdp} />
				)
            },
			{
				Header:'tdp_end_date',
				id: "tdp_end_date",
				accessor: d => d.tdp_end_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="tdp_end_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.tdp_end_date} />
				)
            },
			{
				Header:'nomor_situ',
				id: "nomor_situ",
				accessor: d => d.nomor_situ,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="nomor_situ" onChange={(event) => this.handleFilter(event)} value={this.state.options.nomor_situ} />
				)
            },
			{
				Header:'situ_end_date',
				id: "situ_end_date",
				accessor: d => d.situ_end_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="situ_end_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.situ_end_date} />
				)
            },
			{
				Header:'pakta_integritas_date',
				id: "pakta_integritas_date",
				accessor: d => d.pakta_integritas_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="pakta_integritas_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.pakta_integritas_date} />
				)
            },
			{
				Header:'status_vendor',
				id: "status_vendor",
				accessor: d => d.status_vendor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="status_vendor" onChange={(event) => this.handleFilter(event)} value={this.state.options.status_vendor} />
				),
				Cell: ({original}) => (
					<React.Fragment>
						{original.suspend_start_date === null ? 'A' : 'S'}
					</React.Fragment>
				)
            },
			{
				Header:'suspend_start_date',
				id: "suspend_start_date",
				accessor: d => d.suspend_start_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="suspend_start_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.suspend_start_date} />
				)
            },
			{
				Header:'suspend_end_date',
				id: "suspend_end_date",
				accessor: d => d.suspend_end_date,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="suspend_end_date" onChange={(event) => this.handleFilter(event)} value={this.state.options.suspend_end_date} />
				)
            },
			{
				Header:'company',
				id: "company",
				accessor: d => d.company,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company" onChange={(event) => this.handleFilter(event)} value={this.state.options.company} />
				)
            },
			// {
			// 	Header:'recount_account',
			// 	id: "recount_account",
			// 	accessor: d => d.recount_account,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="recount_account" onChange={(event) => this.handleFilter(event)} value={this.state.options.recount_account} />
			// 	)
            // },
			{
				Header:'incoterm',
				id: "incoterm",
				accessor: d => d.incoterm,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="incoterm" onChange={(event) => this.handleFilter(event)} value={this.state.options.incoterm} />
				)
            },
			// {
			// 	Header:'incoterm_location',
			// 	id: "incoterm_location",
			// 	accessor: d => d.incoterm_location,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="incoterm_location" onChange={(event) => this.handleFilter(event)} value={this.state.options.incoterm_location} />
			// 	)
            // },
			{
				Header:'search_term',
				id: "search_term",
				accessor: d => d.search_term,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="search_term" onChange={(event) => this.handleFilter(event)} value={this.state.options.search_term} />
				)
            },
			// {
			// 	Header:'term_of_payment',
			// 	id: "term_of_payment",
			// 	accessor: d => d.term_of_payment,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="term_of_payment" onChange={(event) => this.handleFilter(event)} value={this.state.options.term_of_payment} />
			// 	)
            // },
			{
				Header:'validasi',
				id: "error_log",
				accessor: d => d.error_log,
				headerClassName: "sticky",
                fixed: "right",
				Cell: ({original}) => (
					<React.Fragment>
						{console.log(original)}
						{(original.error_address || original.error_npwp || original.error_pakta || original.error_punishment || original.error_situ || original.error_siup || original.error_sppkp || original.error_tdp || original.error_vendor) ? 
						<center>
							<Button id={'vendor' + original.vendor_id} type="button" className="btn-xs btn-danger">
								show error
							</Button>
							<UncontrolledPopover
								trigger="legacy" 
								placement="left" 
								target={'vendor' + original.vendor_id}
								// isOpen={this.state.popOver}
								// toggle={this.togglePopOver}
							>
								<PopoverHeader>Daftar Error</PopoverHeader>
								<PopoverBody style={{paddingLeft : "0"}}>
									<ul>
										{this.showErrorPerSheet(original)}
									</ul>
								</PopoverBody>
							</UncontrolledPopover>
						</center>
						:
						<center>
							<Button type="button" className="btn-xs btn-success">
								valid
							</Button>
						</center>}
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

  togglePopOver = () => {
	  this.setState({popOver : !this.state.popOver})
  }

	asyncData = async (params) => {
		console.log('vendor')
	    this.setState({loading: true})
        this.props.fetchMigrasiVendor(params)
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

	showErrorPerSheet = (data) => {
		console.log(data)
		let temp = []
		if (data.error_address){
			for (const [key, value] of Object.entries(JSON.parse(data.error_address))) {
				temp.push({indux : "Address",name : key, value : value})
			}
		}
		
		if (data.error_npwp){
			for (const [key, value] of Object.entries(JSON.parse(data.error_npwp))) {
				temp.push({indux : "NPWP",name : key, value : value})
			}
		}

		if (data.error_pakta){
			for (const [key, value] of Object.entries(JSON.parse(data.error_pakta))) {
				temp.push({indux : "Pakta",name : key, value : value})
			}
		}

		if (data.error_punishment){
			for (const [key, value] of Object.entries(JSON.parse(data.error_punishment))) {
				temp.push({indux : "Punishment",name : key, value : value})
			}
		}

		if (data.error_situ){
			for (const [key, value] of Object.entries(JSON.parse(data.error_situ))) {
				temp.push({indux : "SITU",name : key, value : value})
			}
		}

		if (data.error_siup){
			for (const [key, value] of Object.entries(JSON.parse(data.error_siup))) {
				temp.push({indux : "SIUP",name : key, value : value})
			}
		}

		if (data.error_sppkp){
			for (const [key, value] of Object.entries(JSON.parse(data.error_sppkp))) {
				temp.push({indux : "SPPKP",name : key, value : value})
			}
		}

		if (data.error_tdp){
			for (const [key, value] of Object.entries(JSON.parse(data.error_tdp))) {
				temp.push({indux : "TDP",name : key, value : value})
			}
		}

		if (data.error_vendor){
			for (const [key, value] of Object.entries(JSON.parse(data.error_vendor))) {
				temp.push({indux : "Vendor",name : key, value : value})
			}
		}

		const a = temp.map((item,index) => {
			return (
				
				<li key={index}>{`${item.indux} => ${item.name} : ${item.value}`}</li>
			)
		})


		return a;
	}

  render(){

    return (
      <div>
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
            className="-highlight" />
                            
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
		fetchMigrasiVendor: (params) => dispatch(fetchMigrasiVendor(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (SheetVendor));