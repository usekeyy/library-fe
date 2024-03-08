import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import { withTranslation } from 'react-i18next';
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody} from 'reactstrap';
import Pagination from '../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {fetchMigrasiKompetensiVendor} from '../../../../store/actions/vendor/migrasiVendorActions';
import {debounce} from '../../../../helpers/debounce';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

class SheetKompetensiVendor extends Component {
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
				Header:'sub_bidang_usaha_id',
				id: "sub_bidang_usaha_id",
				accessor: d => d.sub_bidang_usaha_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="sub_bidang_usaha_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.sub_bidang_usaha_id} />
				)
            },
			{
				Header:'tipe_rekanan_id',
				id: "tipe_rekanan_id",
				accessor: d => d.tipe_rekanan_id,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="tipe_rekanan_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.tipe_rekanan_id} />
				)
            },
			// {
			// 	Header:'merk',
			// 	id: "merk",
			// 	accessor: d => d.merk,
			// 	Filter: ({ filter, onChange }) => (
			// 		<input className="form-control" name="merk" onChange={(event) => this.handleFilter(event)} value={this.state.options.merk} />
			// 	)
            // },
			{
				Header:'validasi',
				id: "error_log",
				accessor: d => d.error_log,
				headerClassName: "sticky",
                fixed: "right",
				Cell: (original) => (
					<React.Fragment>
						{original.value ? 
						<center>
							<Button id={'kompetensi' + original.index} type="button" className="btn-xs btn-danger">
								show error
							</Button>
							<UncontrolledPopover
								trigger="legacy"  
								placement="left" 
								target={'kompetensi' + original.index}
								// isOpen={this.state.popOver}
								// toggle={this.togglePopOver}
							>
								<PopoverHeader>Daftar Error</PopoverHeader>
								<PopoverBody style={{paddingLeft : "0"}}>
									<ul>
										{this.showErrorPerSheet(original.value)}
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

	asyncData = async (params) => {
	    this.setState({loading: true})
        this.props.fetchMigrasiKompetensiVendor(params)
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

    redirectCreateMigrasi = () => {
        this.props.history.push('/vendor/migration/create');
    }

	showErrorPerSheet = (error) => {
		console.log(error)
		let temp = []
		for (const [key, value] of Object.entries(JSON.parse(error))) {
			temp.push({name : key, value : value})
		}

		const a = temp.map((item,index) => {
			return (
				<li key={index}>{`${item.name} : ${item.value}`}</li>
			)
		})


		return a;
	}

	togglePopOver = () => {
		this.setState({popOver : !this.state.popOver})
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
		fetchMigrasiKompetensiVendor: (params) => dispatch(fetchMigrasiKompetensiVendor(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (SheetKompetensiVendor));