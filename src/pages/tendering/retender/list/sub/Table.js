import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button } from 'reactstrap';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';

import Pagination from '../../../../../components/paginations/ReactTablePagination';
import FilterDate from '../../../../../components/filterdate/FilterDate';
import { formatDate } from '../../../../../helpers/formatDate';
import {fetchMonitoringTenderBuyer} from '../../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { formatNumber } from '../../../../../helpers/formatNumber';

class Table extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			options: {
				start: 0,
				length: 10,
				sorted_column: 1,
				// order: 'asc',
				page: 0,
				number: '',
				pr_number: '',
				title: '',
				value: '',
				currency_name: '',
				annoucement_date: '',
				registration_date: '',
				closing_date: '',
				is_batal_tender: '',
			},
			statusSearch: [
				{ name: 'Open', value: 'o', isChecked: false },
				{ name: 'Reject ', value: 'r', isChecked: false },
				{ name: 'Submit ', value: 's', isChecked: false },
				{ name: 'Draft ', value: 'd', isChecked: false },
			],
			data: [],
			data_proposal_tender: [],
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			toggleAdd: false,
			loading: false,
			button: false,
			modalOpen: false,
			loadings:{
				loadingModal:false,
			},
			modalData : {
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			}
		}

		this.defaultSorted = [
			{
				id: "number",
				desc: false
			}
		];

		this.columns = [
			{
				Header: 'No Proposal Tender',
				id: "number",
				accessor: d => d.number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="number" onChange={(event) => this.handleFilter(event)} value={this.state.options.number} />
				)
			},
			{
				Header: 'No PR',
				id: "pr_number",
				accessor: d => d.pr_number,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="pr_number" onChange={(event) => this.handleFilter(event)} value={this.state.options.pr_number} />
				)
			},
			{
				Header: 'Title',
				id: "title",
				accessor: d => d.title,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="title" onChange={(event) => this.handleFilter(event)} value={this.state.options.title} />
				)
			},
			{
				Header: 'Nilai',
				id: "nilai",
				accessor: d => formatNumber(d.nilai,true),
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="nilai" onChange={(event) => this.handleFilter(event)} value={this.state.options.nilai} />
				)
			},
			{
				Header: 'Currency',
				id: "currency",
				accessor: d => d.currency,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="currency" onChange={(event) => this.handleFilter(event)} value={this.state.options.currency} />
				)
			},
			{
				Header: 'Tanggal Pengumuman',
				id: "start_tanggal_pengumuman",
				accessor: d => formatDate(d.start_tanggal_pengumuman, false),
				Filter: ({ filter, onChange }) => (
						<FilterDate type="start_tanggal_pengumuman" getDate={this.annoucement_date} />
				),
			},
			{
				Header: 'Tanggal Batas Registrasi',
				id: "end_tanggal_registrasi",
				accessor: d => formatDate(d.end_tanggal_registrasi, false),
				Filter: ({ filter, onChange }) => (
						<FilterDate type="end_tanggal_registrasi" getDate={this.registration_date} />
				),
			},
			{
				Header: 'Tanggal Closing',
				id: "end_tanggal_closing",
				accessor: d => formatDate(d.end_tanggal_closing, false),
				Filter: ({ filter, onChange }) => (
						<FilterDate type="end_tanggal_closing" getDate={this.closing_date} />
				),
			},
			{
				Header: 'Tipe',
				id: "is_batal_tender",
				accessor: d => (d.is_batal_tender===true) ? "Batal Tender" : "Retender",
				filterable : false
			},
			{
				Header: () => this.props.t("uom:label.action"),
				id: "action",
				accessor: d => d,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<React.Fragment>
						<center>
							<Button color="warning" size="xs" value={value.uuid} onClick={(e) => this.toDetail(e, value.number, value.uuid, value.proposal_tender_uuid)} disabled={this.state.button}> {this.state.button && <i className="fa fa-spinner fa-spin"></i>} Process </Button>
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
		// console.log(params)
		this.setState({ loading: true })
		this.props.setLoading(true)
		this.props.fetchTable(params)
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

	fetchMonitoringTenderBuyer = async (proposal_tender_number, uuid) => {
		this.setState({button: true})
		this.props.fetchMonitoringTenderBuyer({proposal_tender_no: proposal_tender_number})
		.then((resp) => {
				const data = resp.data.data;
				this.setState({ data_proposal_tender: data, button: false })
				// toastr.success(data[0].uuid)
				this.props.parentProps.history.push(`retender/detail/${data[0].uuid}/${uuid}`)
		})
		.catch((resp) => {
			this.setState({button: false})
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	fetchData = () => {
		if (this._isMounted) {
			// console.log(this.state.options)
			this.asyncData(this.state.options)
		}
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
			// console.log(this.state.options.start);
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
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		filters[event.target.name] = event.target.value;
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	annoucement_date = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.annoucement_date = date;
		} else {
			filters.annoucement_date = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	registration_date = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.registration_date = date;
		} else {
			filters.registration_date = '';
		}
		this.setState({ options: filters }, () => {
			this.fetchData()
		})
	}

	closing_date = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.closing_date = date;
		} else {
			filters.closing_date = '';
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

	toDetail = (e, pt_id, uuid, proposal_tender_uuid) => {
		e.preventDefault();
		this.props.parentProps.history.push(`retender/detail/${proposal_tender_uuid}/${uuid}`)
		// this.fetchMonitoringTenderBuyer(pt_id, uuid)
	}

	toggleClose = (e,id) => {
		this.setState({ modalOpen: false })
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
					onSortedChange={val => { this.changeSorted(val) }}
					onPageSizeChange={(length) => { this.changePageSize(length) }}
					onPageChange={(perPage) => { this.changePage(perPage) }}
					onResetFilter={val => this.onResetFilter(val)}
					options={this.state.options}
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
		fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Table));