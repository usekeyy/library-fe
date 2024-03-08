import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Pagination from '../../../../components/paginations/ReactTablePagination';
import FilterDate from '../../../../components/filterdate/FilterDate';
import FilterStatus from '../../../../components/filterstatus/FilterStatus';
// import {statusName} from '../../../../helpers/statusName';
import {debounce} from '../../../../helpers/debounce';

class Table extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				sorted_column: 1, 
				page: 0,
				number: '',
				title: '',
				purchasing_org_name: '',
				start_date: '',
				end_date: '',
				registration_quotation: '',
			},
			statusSearch: [
				{name: 'Open', value: 'o', isChecked: false},
				{name: 'Registered ', value: 'r', isChecked: false},
				{name: 'Submited ', value: 's', isChecked: false},
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
				id: "number",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'Nomor Tender',
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.number} />
				)
			},
			{
				Header:'Judul',
				id: "title",
				accessor: d => d.title,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title" onChange={(event) => this.handleFilter(event)} value={this.state.options.title} />
				)
			},
			{
				Header:'Tanggal Mulai',
				id: "start_date",
				accessor: d => d.start_date,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="start_date" getDate={this.start_date} />
				)
			},
			{
				Header:'Tanggal Selesai',
				id: "end_date",
				accessor: d => d.end_date,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="end_date" getDate={this.end_date} />
				)
			},
			{
				Header:'Company',
				id: "purchasing_org_name",
				accessor: d => d.purchasing_org_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.purchasing_org_name} />
				)
			},
			{
				Header: () => this.props.t("plant:label.status")+' Quotation',
				id: "status",
				accessor: d => d.registration_quotation,
				Filter: ({ filter, onChange }) => (
						<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
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
							{/* {
									(value.registration_quotation === null || value.registration_quotation === 'open') && <button className="btn btn-primary btn-xs" onClick={(e) => this.props.handleAction('registrasi', value, value.uuid)}>Register</button>
							} {
									value.registration_quotation === 'register' && <button className="btn btn-primary btn-xs" onClick={(e) => this.props.handleAction('process', value, value.uuid)}>Process</button>
							} {
								(new Date(value.end_date).getTime() > new Date().getTime()) && value.registration_quotation === 'submitted' && <button className="btn btn-primary btn-xs" onClick={(e) => this.props.handleAction('update', value, value.uuid)}>Update</button>
							} */}
							<button className="btn btn-primary btn-xs" onClick={(e) => this.props.handleAction('update', value, value.uuid)}>Detail</button>
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

	asyncData = async (uuid, params) => {
			this.setState({loading: true})
			this.props.setLoading(true, [])
      this.props.fetchQuotation(uuid, params)
      .then((resp) => {
				if(this._isMounted){
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({loading: false, total: lengthPage, data: resp.data});
					this.props.setLoading(false, resp.data.data)
				}
			})
      .catch((resp) => {
				this.setState({loading: false})
				this.props.setLoading(false, [])
toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.props.user_uuid, this.state.options)
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

	start_date = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.start_date = date;
		} else {
			filters.start_date = '';	
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	end_date = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.end_date = date;
		} else {
			filters.end_date = '';	
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
			filters.registration_quotation = check.join(";");
			this.setState({options: filters}, () => this.fetchData())
		} else {
			filters.registration_quotation = [];
			this.setState({options: filters}, () => this.fetchData())
		}
	}

	showDetail = (e, value) => {
		e.preventDefault();
		this.props.toDetail(value)
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

export default Table;