import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button } from 'reactstrap';

import FilterDate from '../../../../components/filterdate/FilterDate';
import Pagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import {statusName} from '../../../../helpers/statusName';
import {debounce} from '../../../../helpers/debounce';

class Table extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				// sorted_column: 1, 
				column: 'id',
				order: 'asc', 
				keyword: '',
				page: 0,
				address: '',
				company_type_id: '',
				company_type_name: '',
				country_id: '',
				country_name: '',
				created_at: '',
				created_by: '',
				direktur_utama: '',
				district_id: '',
				district_name: '',
				email: '',
				id: '',
				kecamatan_id: '',
				kecamatan_name: '',
				name: '',
				npwp_file: '',
				npwp_nomor: '',
				npwp_tanggal_terdaftar: '',
				pic_email: '',
				pic_jabatan: '',
				pic_ktp_file: '',
				pic_ktp_no: '',
				pic_name: '',
				pic_phone: '',
				pic_status: '',
				postal_code: '',
				purchasing_org_id: '',
				purchasing_org_name: '',
				region_id: '',
				region_name: '',
				sap_code: '',
				status: 'd',
				tdp_file: '',
				tdp_nomor: '',
				tdp_tanggal_berakhir: '',
				tipe_verifikasi: '',
				updated_at: '',
				updated_by: '',
				uuid: '',
				vendor_type_id: '',
				vendor_type_name: '',
				website: '',
				company_name: ''
			},
			statusSearch: [
				{name: 'Actived', value: 'y', isChecked: false},
				{name: 'Draft', value: 'd', isChecked: false},
				// {name: 'Submit Pendaftaran', value: 'submit_pendaftaran', isChecked: false},
				// {name: 'Revisi Data ', value: 'revisi_data', isChecked: false},
				// {name: 'Pendaftaran ', value: null, isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'Nomor Pendaftaran',
				id: "id",
				accessor: d => d.id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="id" onChange={(event) => this.handleFilter(event)} value={this.state.options.id} />
				)
			},
			{
				Header:'Nama Vendor',
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				)
			},
			{
				Header:'Company Name',
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				)
			},
			{
				Header:'Nama PIC',
				id: "pic_name",
				accessor: d => d.pic_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="pic_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.pic_name} />
				)
			},
			{
				Header:'Email PIC',
				id: "pic_email",
				accessor: d => d.pic_email,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="pic_email" onChange={(event) => this.handleFilter(event)} value={this.state.options.pic_email} />
				)
			},
			{
				Header:'Nomor NPWP',
				id: "npwp_nomor",
				accessor: d => d.npwp_nomor,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="npwp_nomor" onChange={(event) => this.handleFilter(event)} value={this.state.options.npwp_nomor} />
				)
			},
			{
				Header:'Status',
				id: "status",
				filterable: false,
				accessor: d => statusName(d.status),
				// Filter: ({ filter, onChange }) => (
				// 		<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				// )
			},
			{
				Header:'Tanggal Registrasi',
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: () => this.props.t("common:Label.Aksi"),
				id:"action",
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							{this.props.access.R && <Button color="primary" size="xs" onClick={(e) => this.showProfileVendor(e, value.uuid, false)} >View </Button>}
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
			this.props.setLoading(true)
      this.props.fetchDataVendor(params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
					this.props.setLoading(false)
				}
			})
      .catch((resp) => {
				this.setState({loading: false})
				this.props.setLoading(false)
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

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.options}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({options: optDt}, () => this.fetchData());
		}
	}

	onResetFilter = (val) => {
		val.status = "d";
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

	showProfileVendor = (e, vendor_uuid, verif_uuid) => {
		e.preventDefault();
		this.setState({loading: true});
		this.props.fetchProfileVendor(vendor_uuid, verif_uuid)
		.then((resp) => {
			setTimeout(() => {
				this.setState({loading: false}, () => this.handleProcces());
			}, 100)
		})
		.catch((resp) => {
			toastr.error(resp.data.status, resp.data.message);
			this.setState({loading: false});
		});
	}

	handleProcces = () => {
		this.props.history.push('/vendor/verification/profile')
	}

  render(){
    return (
      <div>
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
		
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Table));