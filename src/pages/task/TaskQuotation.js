import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
// import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../containers/layout/sub/panel/panel';

// import { fetchTaskItem } from '../../store/actions/taskActions';
import {fetchMonitoringTenderBuyer} from '../../store/actions/tendering/monitoringTenderBuyerActions';
import { Link } from 'react-router-dom';
import FilterDate from '../../components/filterdate/FilterDate';
import Pagination from '../../components/paginations/ReactTablePagination';
import { formatDate } from '../../helpers/formatDate';

class TaskQuotation extends Component {
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
                end_tanggal_closing : ''
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
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.number} />
				),
                Cell: d => (
					<React.Fragment>
						{`${d.original.number} - ${d.original.title}`}
					</React.Fragment>
				)
			},
			{
				Header: 'Title',
				id: "title",
				accessor: d => d.title,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="title" onChange={(event) => this.handleFilter(event)} value={this.state.options.title} />
				),
                Cell: d => (
					<React.Fragment>
						{`${d.original.number} - ${d.original.title}`}
					</React.Fragment>
				)
			},
			{
				Header: 'Closing Date',
				id: "end_tanggal_closing",
				accessor: d => formatDate(d.end_tanggal_closing),
				Filter: ({ filter, onChange }) => (
					<FilterDate type="created_at" getDate={this.created_at} />
				),
                Cell: d => (
					<React.Fragment>
						<center>
                            {formatDate(d.original.end_tanggal_closing)}
                        </center>
					</React.Fragment>
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
							<button className="btn btn-xs btn-primary" onClick={(e) => this.detail(e, d.original.uuid)}>View</button>
						</center>
					</React.Fragment>
				)
			},
		]

	}

	detail(e, uuid) {
        e.preventDefault()
		this.props.history.push('/tendering/monitoring-tender-buyer/detail/' + uuid)
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.fetchMonitoringTender()
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	// asyncData = async (ticket_id) => {
	// 	this.setState({ loading: true })
	// 	this.props.fetchTaskItem(ticket_id, this.state.options)
	// 		.then((resp) => {
	// 			if (this._isMounted) {
	// 				let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
	// 				this.setState({ loading: false, total: lengthPage, data: resp.data });
	// 			}
	// 		})
	// 		.catch((resp) => {
	// 			this._isMounted = false && this.setState({ loading: false })
	// 			let message = (typeof resp !== 'undefined') ? resp.data.message : 'Something Wrong';
	// 			toastr.error('Oops', message);
	// 			this.props.history.push(`/home`)
	// 		});
	// }

	// fetchTaskItem = () => {
	// 	this.asyncData(this.state.ticket_id);
	// }

    getDate = (date) => {
		let dd = date.getDate();
		let mm = date.getMonth()+1; //January is 0!
		let yyyy = date.getFullYear();
		if(dd<10){
				dd='0'+dd
		} 
		if(mm<10){
			mm='0'+mm
		}

		return yyyy+'-'+mm+'-'+dd
	}

	fetchMonitoringTender = async () => {
		this.setState({loading: true})
		const filterMulai = this.getDate(new Date(new Date(localStorage.getItem('times')).getTime() + (1 * 24 * 60 * 60 * 1000)))
		const filterSekarang = this.getDate(new Date(localStorage.getItem('times')))
        let params = {...this.state.options,end_tanggal_closing : `${filterSekarang};${filterMulai}`}
		this.props.fetchMonitoringTenderBuyer(params)
			.then((resp) => {
				if(this._isMounted){
                    let dataFilter = resp.data.data.filter((item) => {
						if (item.status_dur === 'y'){
							if (item.metode_penyampaian_id === '2t'){
								if (item.bid_administrasi !== 'y'){
									return item
								}else {
									if (item.bid_comercil !== 'y'){
										return item
									}
								}
							}else{
								if (item.bid_administrasi !== 'y'){
									return item
								}
							}
						}
						return false;
					})
					this.setState({loading: false, data: dataFilter});
				}
			})
			.catch((resp) => {
				this._isMounted = false && this.setState({loadingStat: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
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
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchMonitoringTender());
		}
	}

	changePageSize = (length) => {
		if (this._isMounted) {
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.options.length);
			let optDt = { ...this.state.options }
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({ total: lengthPage, options: optDt }, () => this.fetchMonitoringTender());
		}
	}


	changeSorted = (val) => {
		if (this._isMounted) {
			let optDt = { ...this.state.options }
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({ options: optDt }, () => this.fetchMonitoringTender());
		}
	}

	onResetFilter = (val) => {
		this.setState({
			options: val
		}, () => this.fetchMonitoringTender());
	}

	handleFilter = (event) => {
		let filters = this.state.options;
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({ options: filters }, () => {
			this.fetchMonitoringTender()
		})
	}

	created_at = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.end_tanggal_closing = date;
		} else {
			filters.end_tanggal_closing = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchMonitoringTender()
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
			this.fetchMonitoringTender()
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
						<ReactTable
							columns={this.columns}
							filterable loading={this.state.loading}
							manual
							minRows={1}
							PaginationComponent={Pagination}
							pageSizeOptions={[10, 20, 25, 50, 100]}
							recordsTotal={this.state.data.recordsTotal}
							recordsFiltered={this.state.data.recordsFiltered}
							data={this.state.data}
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
		// fetchMonitoringTender: (ticket_id,payload) => dispatch(fetchMonitoringTender(ticket_id, payload)),
        fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(TaskQuotation));