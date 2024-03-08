import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Button } from 'reactstrap';

import {fetchDataVendor} from '../../../../../store/actions/vendor/vendorActions';
import {downloadExcelStatusVendor} from '../../../../../store/actions/dashboard/dashboardVendorAction';
// import FilterDate from '../../../../../components/filterdate/FilterDate';
import Pagination from '../../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import {debounce} from '../../../../../helpers/debounce';
import FilterStatus from '../../../../../components/filterstatus/FilterStatus';

class TableStatusVendor extends Component {
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
			},
			statusSearch: [
				{name: 'Vendor', value: 'y', isChecked: false},
				{name: 'Applicant', value: 'd', isChecked: false},
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
			loading: false,
			loadingSubmit : false
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
                Cell: ({index}) => (
					<React.Fragment>
						<center>
							{index + 1 + this.state.options.start}
						</center>
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
                className: "text-center"
			},
			{
				Header:'SAP Number',
				id: "sap_code",
				accessor: d => d.sap_code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sap_code" onChange={(event) => this.handleFilter(event)} value={this.state.options.sap_code} />
				),
                className: "text-center"
			},
			{
				Header:'Vendor',
				id: "name",
				accessor: d => d.name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="name" onChange={(event) => this.handleFilter(event)} value={this.state.options.name} />
				),
			},
            {
				Header:'Purchasing Org',
				id: "purchasing_org_id",
				accessor: d => d.purchasing_org_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_org_id} />
				),
                className: "text-center"
			},
			{
				Header:'Company Name',
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				),
			},
			{
				Header:'Status',
				id: "status",
				accessor: d => d.status === 'y' ? 'Vendor' : 'Aplicant',
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				),
                className: "text-center"
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
	  
  	setMerk = (merk) => {
		  console.log(merk)
		let data = ''
		merk.forEach((item) => {
			if (item !== null){
				data = data === ''? `${item}` : `${data}, ${item}`
			}
		})
		return data;
	}

	asyncData = async () => {
			this.setState({loading: true})
      this.props.fetchDataVendor(this.state.options)
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
			this.asyncData()
		}
	}

	downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelStatusVendor()
			.then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Report_Status_Vendor.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState({loadingSubmit: false})
                // if (res.data.status == 'success'){
                //     toastr.success(res.data.message);
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }else{
                //     toastr.success("Gagal Sync");
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }
			})
			.catch(error => {
                // console.log(error)
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loadingSubmit: false});
				} else {
					this.setState({loadingSubmit: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
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

	getCheck = (check) => {
        let filters = { ...this.state.options }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ options: filters }, () => this.asyncData())
        } else {
            filters.status = [];
            this.setState({ options: filters }, () => this.asyncData())
        }
        
    }

  render(){
    return (
      <div>
		  		<div className="pull-right">
					<Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.downloadExcel()} >Download Excel 
						{this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
					</Button>

				</div>
                <br />
                <br />
                <div style={{clear : 'both'}}>
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
		fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
		downloadExcelStatusVendor : () => dispatch(downloadExcelStatusVendor()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TableStatusVendor));