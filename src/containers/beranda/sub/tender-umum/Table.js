import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ReactTablePagination from '../../../../components/paginations/ReactTablePagination';
import FilterDate from '../../../../components/filterdate/FilterDate';
import FilterStatus from '../../../../components/filterstatus/FilterStatus';
import {praQualificationDetailResponse} from '../../../../store/actions/authActions';
import moment from 'moment';

class Table extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
	
		this.state = {
            params: {
                proposal_tender_no:'',
                number_pr:'',
                title:'',
                company_id:'',
                company_name:'',
                metode_tender: '',
                metode_pemasukan_penawaran: '',
                batas_registrasi:'',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: '',
				sorted_column: 1, 
				order: 'asc', 
				keyword: '',
				page: 0,

			},
            statusSearch: [
                { name: 'Tender', value: 'Tender', isChecked: false },
                { name: 'Pra Qualification ', value: 'Pra Qualification', isChecked: false },
            ],
			data: [],
			errors: [],
			total: 0,
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false
		}

		this.defaultSorted = [
			{
				id: "name",
				desc: false
			}
		];

		this.columns = [
            {
                Header: "No. Proposal Tender",
                accessor: "proposal_tender_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: "Title",
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            {
                Header: "Company",
                id: "company_name",
                accessor: d => d.company_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                ),
            },
            {
                Header: "Metode Tender",
                id: "metode_tender",
                accessor: d => d.metode_tender,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="metode_tender" onChange={(event) => this.onChanged(event)} value={this.state.params.metode_tender} />
                ),
            },
            {
                Header: "Metode Pemasukan Penawaran",
                id: "metode_pemasukan_penawaran",
                accessor: d => d.metode_pemasukan_penawaran,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="metode_pemasukan_penawaran" onChange={(event) => this.onChanged(event)} value={this.state.params.metode_pemasukan_penawaran} />
                ),
            },
            {
                Header: "Status",
                id: "status",
                accessor: d => d.status,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
            },
            {
                Header: "Tanggal Batas Registrasi",
                id: "batas_registrasi",
                accessor: d => d,
                // accessor: d => d.batas_registrasi,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.batas_registrasi} />
                ),
                Cell: ({ value }) => (
                    value.batas_registrasi !== null && value.batas_registrasi !== '' && 
                    <label>{moment(value.batas_registrasi).format("DD-MM-YYYY hh:mm:ss")}</label>
                )
            },
			{
				Header: () => this.props.t("common:Label.Aksi"),
				id:"actions",
				filterable: false,
				sortable: false,
                Cell: d => (
					<React.Fragment>
						<center>
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={e => this.detail(e, d.original.uuid)} >Detail</button>
                            {/* <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Detail</button> */}
						</center>
					</React.Fragment>
				)
			}
		]
	}

	detail(e, uuid) {
		this.props.praQualificationDetailResponse({type: true, tender_uuid: uuid});
		this.props.toggleLogin(e, uuid)
	}

	onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start = 0;
        this.setState({
            params: someProperty,
            page: 0
        }, () => { this.req() });
    }


	componentDidMount = () => {
		this._isMounted = true;
		// if(this._isMounted){
		// 	this.fetchData();
		// }
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
		this.props.fetchPraQualificationTenderList(params)
			.then((resp) => {
				if(this._isMounted){
					this.setState({
						data: resp.data.data,
						pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
						recordsFiltered: resp.data.recordsFiltered,
						recordsTotal: resp.data.recordsTotal,
						loading: false
					});
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
			this.asyncData(this.state.params)
		}
	}
	
	batas_registrasi = (date = '') => {
		let filters = {...this.state.params}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.batas_registrasi = date;
		} else {
			filters.batas_registrasi = '';	
		}
		this.setState({params: filters}, () => {
			this.fetchData()
		})
	}

	updated_at = (date = '') => {
		let filters = {...this.state.params}
		filters.start = 0;
		filters.page = 0;
		if(date !== ''){
			filters.updated_at = date;
		} else {
			filters.updated_at = '';
		}
		this.setState({params: filters}, () => {
			this.fetchData()
		})
	}

	getCheck = (check) => {
		let filters = {...this.state.params}
		filters.start = 0;
		if(check.length > 0){
			filters.status = check.join(";");
			this.setState({params: filters}, () => this.fetchData())
		} else {
			filters.status = [];
			this.setState({params: filters}, () => this.fetchData())
		}
	}

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.page = arr.page
        someProperty.params.start = (arr.page * state)
        someProperty.params.length = state;
        someProperty.defaultPageSize = state;
        someProperty.params.column = arr.sorted[0].id
        someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')
        this.setState({ page: arr.page })
        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.fetchData();
        }
    }

	onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

	render(){
		return (
			<div>
				<ReactTable 
					filterable 
					loading={this.state.loading}
					manual
					minRows={1}
					PaginationComponent={ReactTablePagination}
					data={this.state.data}
					columns={this.columns}
					defaultPageSize={this.state.defaultPageSize}
					defaultSorted={this.defaultSorted}
					showPagination={true}
					showPaginationTop={false}
					showPaginationBottom={true}
					pageSizeOptions={[10, 20, 25, 50, 100]}
					recordsTotal={this.state.recordsTotal}
					recordsFiltered={this.state.recordsFiltered}
					length={this.state.params.length}
					start={this.state.params.start}
					onResetFilter={val => this.onResetFilter(val)}
					options={this.state.params}
					className="-highlight"
					pages={this.state.pages}
					page={this.state.page}
					onFetchData={(state, instance) => {
						this.req(state);
					}}/>
			</div>
		);
	}
}

const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {
		praQualificationDetailResponse: data => dispatch(praQualificationDetailResponse(data)),
	}
}

export default connect(stateToProps, dispatchToProps)(withRouter(Table));