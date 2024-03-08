import React, {Component} from 'react';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Pagination from '../../../../../components/paginations/ReactTablePagination';
import FilterDate from '../../../../../components/filterdate/FilterDate';
import {formatDate} from '../../../../../helpers/formatDate';
// import { statusName } from '../../../../../helpers/statusName';
import {debounce} from '../../../../../helpers/debounce';
import FilterStatus from '../../../../../components/filterstatus/FilterStatus';

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
				tanggal_batas_registrasi: '',
				closing_date: '',
				registered: 'registered',
				status : ''
			},
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false,
			statusSearch: [
				{ name: 'Draft', value: 'Draft', isChecked: false },
                { name: 'Open Praqualification', value: 'Open Praqualification', isChecked: false },
                { name: 'Active Praqualification', value: 'Active Praqualification', isChecked: false },
                { name: 'Approval Praqualification', value: 'Approval Praqualification', isChecked: false },
                { name: 'Approved Praqualification', value: 'Approved Praqualification', isChecked: false },
                { name: 'Rejected Praqualification', value: 'Rejected Praqualification', isChecked: false },
                { name: 'Approval DUR', value: 'Approval DUR', isChecked: false },
                { name: 'Approved DUR', value: 'Approved DUR', isChecked: false },
                { name: 'Rejected DUR', value: 'Rejected DUR', isChecked: false },
                { name: 'Published', value: 'Published', isChecked: false },
                { name: 'Registration', value: 'Registration', isChecked: false },
                { name: 'Aanwijzing', value: 'Aanwijzing', isChecked: false },
                { name: 'Quotation', value: 'Quotation', isChecked: false },
                { name: 'Penawaran Teknis', value: 'Penawaran Teknis', isChecked: false },
                { name: 'Penawaran Komersil', value: 'Penawaran Komersil', isChecked: false },
                { name: 'Bid Opening', value: 'Bid Opening', isChecked: false },
                { name: 'Evaluasi Admin', value: 'Evaluasi Admin', isChecked: false },
                { name: 'Evaluasi Teknis: Approval Ketua Evaluator', value: 'Evaluasi Teknis: Approval Ketua Evaluator', isChecked: false },
                { name: 'Evaluasi Teknis', value: 'Evaluasi Teknis', isChecked: false },
                { name: 'Evaluasi Komersil', value: 'Evaluasi Komersil', isChecked: false },
                { name: 'Negotiation', value: 'Negotiation', isChecked: false },
                { name: 'Awarding', value: 'Awarding', isChecked: false },
                { name: 'Cancel', value: 'Cancel', isChecked: false },
                { name: 'Closed', value: 'Closed', isChecked: false },
            ],
		}

		this.defaultSorted = [
			{
				id: "number",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'Nomor Proposal Tender',
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.number} />
				)
			},
			{
				Header:'Title',
				id: "title",
				accessor: d => d.title,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title" onChange={(event) => this.handleFilter(event)} value={this.state.options.title} />
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
				Header:'Tanggal Batas Registrasi',
				id: "tanggal_batas_registrasi",
				accessor: d => formatDate(d.tanggal_batas_registrasi),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="tanggal_batas_registrasi" getDate={this.tanggal_batas_registrasi} />
				)
			},
			{
				Header:'Closing Date',
				id: "closing_date",
				accessor: d => formatDate(d.closing_date),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="closing_date" getDate={this.closing_date} />
				)
			},
			{
				Header:'Status',
				id: "status_tender",
				accessor: d => d.status_tender,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
			},
			{
				Header: () => this.props.t("common:Label.Aksi"),
				id:"uuid",
				accessor: "uuid",
				filterable: false,
				sortable: false,
				Cell: ({value}) => (
					<React.Fragment>
						<center>
							{<button className="btn btn-primary btn-xs" onClick={(e) => this.showDetail(e, value)} >Open </button>}
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

	asyncData = async (id, params) => {
			this.setState({loading: true})
			this.props.setLoading(true)
      this.props.fetchUndanganTender(id, params)
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

	tanggal_batas_registrasi = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.tanggal_batas_registrasi = date;
		} else {
			filters.tanggal_batas_registrasi = '';	
		}
		this.setState({options: filters}, () => {
			this.fetchData()
		})
	}

	closing_date = (date = '') => {
		let filters = {...this.state.options}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.closing_date = date;
		} else {
			filters.closing_date = '';	
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
			filters.status_tender = check.join(";");
			this.setState({options: filters}, () => this.fetchData())
		} else {
			filters.status_tender = [];
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