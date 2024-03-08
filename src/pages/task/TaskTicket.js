import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../containers/layout/sub/panel/panel';

import { fetchTaskItem } from '../../store/actions/taskActions';
import { Link } from 'react-router-dom';
import FilterDate from '../../components/filterdate/FilterDate';
import Pagination from '../../components/paginations/ReactTablePagination';

class TaskTicket extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			options: {
				start: 0,
				length: 10,
				sorted_column: 1,
				order: 'asc',
				page: 0,
				description: '',
				count_day: '',
				created_at: '',
				updated_at: '',
			},
			total: 0,
			ticket_id: '',
			data: [],
			loading: false
		}

		this.defaultSorted = [
			{
				id: "description",
				desc: false
			}
		];

		this.columns = [
			{
				Header: 'Description',
				id: "description",
				accessor: d => d.description,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="description" onChange={(event) => this.handleFilter(event)} value={this.state.options.description} />
				)
			},
			{
				Header: 'Title',
				id: "title",
				accessor: d => d.title,
				show : this.props.location.state.isTitle === null ? false : true,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title" onChange={(event) => this.handleFilter(event)} value={this.state.options.title} />
				)
			},
			{
				Header: 'Assign Date',
				id: "created_at",
				accessor: d => d.created_at,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				)
			},
			{
				Header: 'Count Days',
				id: "count_days",
				accessor: d => d.count_days,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="count_days" onChange={(event) => this.handleFilter(event)} value={this.state.options.count_days} />
				)
			},
			// {
			// 	Header:'Due Date',
			// 	id: "updated_at",
			// 	accessor: d => d.updated_at,
			// 	Filter: ({ filter, onChange }) => (
			// 		<FilterDate type="updated_at" getDate={this.updated_at} />
			// 	)
			// },
			{
				Header: 'Action',
				id: "url",
				sortable: false,
				filterable: false,
				Cell: d => (
					<React.Fragment>
						<center>
							<button className="btn btn-xs btn-primary" onClick={(e) => this.detail(e, d.original.url)}>View</button>
						</center>
					</React.Fragment>
				)
			},
		]

	}

	detail(e, url) {
		this.props.history.push(url)
	}

	componentDidMount = () => {
		this._isMounted = true;
		let uri = this.props.location.pathname.split("/")[2];
		if (this._isMounted) {
			if (uri !== '' || uri !== undefined) {
				this.setState({ ticket_id: uri }, () => {
					this.fetchTaskItem()
				})
			} else {
				toastr.warning("Ticket ID Not Found")
				this.props.history.push(`/home`)
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	asyncData = async (ticket_id) => {
		this.setState({ loading: true })
		this.props.fetchTaskItem(ticket_id, this.state.options)
			.then((resp) => {
				if (this._isMounted) {
					let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
					this.setState({ loading: false, total: lengthPage, data: resp.data });
				}
			})
			.catch((resp) => {
				this._isMounted = false && this.setState({ loading: false })
				let message = (typeof resp !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
				this.props.history.push(`/home`)
			});
	}

	fetchTaskItem = () => {
		this.asyncData(this.state.ticket_id);
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
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchTaskItem());
		}
	}

	changePageSize = (length) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchTaskItem());
		}
	}


	changeSorted = (val) => {
		if (this._isMounted) {
			let optDt = { ...this.state.options }
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({ options: optDt }, () => this.fetchTaskItem());
		}
	}

	onResetFilter = (val) => {
		this.setState({
			options: val
		}, () => this.fetchTaskItem());
	}

	handleFilter = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({ options: filters }, () => {
			this.fetchTaskItem()
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
			this.fetchTaskItem()
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
			this.fetchTaskItem()
		})
	}


	render() {
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item"><Link to="/home">Home</Link></li>
					<li className="breadcrumb-item active">Task</li>
				</ol>
				<h1 className="page-header">My Task </h1>

				<Panel>
					<PanelHeader>My Task Table</PanelHeader>
					<PanelBody >
						<Row>
							<Col sm="6">
							</Col>
							<Col sm="6">
								<div className="pull-right m-b-10">
									{<Button color="primary" size="sm" value="" onClick={(e) => this.fetchTaskItem(e)} >Refresh</Button>}
								</div>
							</Col>
						</Row>
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
		user: state.auth.user.data,
		vendor: state.vendorProfile.vendor,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchTaskItem: (ticket_id,payload) => dispatch(fetchTaskItem(ticket_id, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TaskTicket));