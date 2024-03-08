import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { Button } from 'reactstrap';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import FilterDate from '../../../../../components/filterdate/FilterDate';
import Pagination from '../../../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../../../components/filterstatus/FilterStatus';
import { statusName } from '../../../../../helpers/statusName';

class Table extends Component {
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
				number: '',
				document_type: '',
				work_unit_name: '',
				status: '',
				created_at: '',
				created_by: '',
				created_by_name: '',
				updated_at: ''
			},
			statusSearch: [
				{ name: 'Open', value: 'o', isChecked: false },
				{ name: 'Reject ', value: 'r', isChecked: false },
				{ name: 'Submit ', value: 's', isChecked: false },
				{ name: 'Draft ', value: 'd', isChecked: false },
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
				Header: 'No PR',
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.code} />
				)
			},
			{
				Header: 'Description',
				id: "document_type",
				accessor: d => d.document_type,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="document_type" onChange={(event) => this.handleFilter(event)} value={this.state.options.document_type} />
				)
			},
			{
				Header: 'Company',
				id: "work_unit_name",
				accessor: d => d.work_unit_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="work_unit_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.work_unit_name} />
				)
			},
			{
				Header: 'Created By',
				id: "created_by_name",
				accessor: d => d.created_by_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="created_by_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.created_by_name} />
				)
			},
			{
				Header: 'Created At',
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: 'Status',
				id: "status",
				accessor: d => statusName(d.status),
				Filter: ({ filter, onChange }) => (
					<FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
			{
				Header: () => this.props.parentProps.t("uom:label.action"),
				id: "action",
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<React.Fragment>
						<center>
							{value.status === 'p' && <Button color="danger" size="xs" value={value.uuid} onClick={(e) => this.toDetail(e, value.uuid)} >Reject </Button>}
							{value.status !== 'p' && <Button color="primary" size="xs" value={value.uuid} onClick={(e) => this.toDetail(e, value.uuid)} >View</Button>}
						</center>
					</React.Fragment>
				)
			},
		]
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.fetchData();
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	asyncData = async (params) => {
		this.setState({ loading: true })
		this.props.setLoading(true)
		this.props.fetchPurchasingRequisition(params)
			.then((resp) => {
				if (this._isMounted) {
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({ loading: false, total: lengthPage, data: resp.data });
					this.props.setLoading(false)
				}
			})
			.catch((resp) => {
				this.setState({ loading: false })
				this.props.setLoading(false)
				toastr.error(resp.data.status, resp.data.message);
				this._isMounted = false;
			});
	}

	fetchData = () => {
		this.asyncData(this.state.options)
	}

	changePage = (perPage) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			let numb = 0;
			numb = perPage;
			if (numb > 0) {
				numb = perPage * this.state.options.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
		}
	}

	changePageSize = (length) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchData());
			console.log(this.state.options.start);
		}
	}

	changeSorted = (val) => {
		if (this._isMounted) {
			let optDt = { ...this.state.options }
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({ options: optDt }, () => this.fetchData());
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
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	created_at = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.created_at = date;
		} else {
			filters.created_at = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	updated_at = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.updated_at = date;
		} else {
			filters.updated_at = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	getCheck = (check) => {
		let filters = { ...this.state.options }
		filters.start = 0;
		if (check.length > 0) {
			filters.status = check.join(";");
			this.setState({ options: filters }, () => this.fetchData())
		} else {
			filters.status = [];
			this.setState({ options: filters }, () => this.fetchData())
		}
	}

	toDetail = (e, id) => {
		// e.preventDefault();
		this.props.parentProps.history.push(`/tendering/purchasing-requisition/detail/${id}`);
	}

	render() {
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
					onSortedChange={val => { this.changeSorted(val) }}
					onPageSizeChange={(length) => { this.changePageSize(length) }}
					onPageChange={(perPage) => { this.changePage(perPage) }}
					className="-highlight" />
			</div>
		);
	}
}

export default Table;