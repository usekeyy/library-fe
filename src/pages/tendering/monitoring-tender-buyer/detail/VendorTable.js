import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';

import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import Pagination from '../../../../components/paginations/ReactTablePagination';
import { showDurVendor} from '../../../../store/actions/tendering/durActions';
import { statusName } from '../../../../helpers/statusName';
import FilterDate from '../../../../components/filterdate/FilterDate';
// import { formatDate } from '../../../../helpers/formatDate';
import { debounce } from '../../../../helpers/debounce';
import { withRouter } from "react-router";


const ReactTableFixedColumns = withFixedColumns(ReactTable);


class VendorTable extends Component {
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
				vendor_id: '',
				vendor_name: '',
				company_name: '',
				business_group: '',
				district_name: '',
				coi: 0,
				color: '',
				vendor_status: '',
				po_outstanding: '',
				expired_tdp: '',
				sos_type: "",
				id: "",
                monitoring : 1
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
			loading: false,
			modalOpen: false,
			loadings: {
				loadingModal: false,
				loading_syncrn_vendor_sap: false
			},
			modalData: {
				items: [],
				item_potext: [],
				account_assignment: [],
				serviceline: []
			},
			vendorSelection: [],
			checkAll: false
		}

		this.defaultSorted = [
			{
				id: "purchasing_requisition_number",
				desc: false
			}
		];

		this.columns = [
			{
				id: "id",
				accessor: d => d.vendor_id,
				filterable: false,
				sortable: false,
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'left',
                show: this.props.status_dur !== 'approved',
				Cell: (d) => {
					return (
						<>
							<React.Fragment>
								<div className="pull-left m-l-30">
                                    <input type="checkbox" checked={this.props.check_vendor.includes(d.original.vendor_id)} disabled={true}/>
								</div>
							</React.Fragment>
						</>
					);
				}
			},
			{
				Header: this.props.t("dur:label.vendor-number"),
				id: "vendor_id",
				accessor: d => d.vendor_id,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="vendor_id" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_id} />
				)
			},
			{
				Header: this.props.t("dur:label.vendor-name"),
				id: "vendor_name",
				accessor: d => d.vendor_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="vendor_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.vendor_name} />
				)
			},
			{
				Header: this.props.t("dur:label.category-company"),
				id: "company_name",
				accessor: d => d.company_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="company_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.company_name} />
				)
			},
			{
				Header: this.props.t("dur:label.bid-usaha"),
				id: "business_group",
				accessor: d => d.business_group,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="business_group" onChange={(event) => this.handleFilter(event)} value={this.state.options.business_group} />
				)
			},
			{
				Header: this.props.t("dur:label.district"),
				id: "district_name",
				accessor: d => d.district_name,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="district_name" onChange={(event) => this.handleFilter(event)} value={this.state.options.district_name} />
				)
			},
			{
				Header: this.props.t("dur:label.score-vpr"),
				id: "score_vpr",
				accessor: d => d.score_vpr,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="score_vpr" onChange={(event) => this.handleFilter(event)} value={this.state.options.score_vpr} />
				)
			},
			// {
			// 	Header: this.props.t("dur:label.coi"),
			// 	id: "coi",
			// 	accessor: d => d.coi,
			// 	filterable: false,
			// },
			{
				Header: this.props.t("dur:label.category"),
				id: "color",
				accessor: d => d.color,
				filterable: false,
				Cell: ({ value }) => (
					<div
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: value,

						}}
					> &nbsp; </div>
				)
			},
			{
				Header: this.props.t("dur:label.status"),
				id: "vendor_status",
				accessor: d => statusName(d.vendor_status),
				filterable: false,
			},
			{
				Header: this.props.t("dur:label.po"),
				id: "po_outstanding",
				accessor: d => d.po_outstanding,
				Filter: ({ filter, onChange }) => (
					<input type="text" className="form-control" name="po_outstanding" onChange={(event) => this.handleFilter(event)} value={this.state.options.po_outstanding} />
				),
				Cell: ({original}) => (
                    <React.Fragment>
                        <center>
                            {original.po_outstanding > 0 && <button className="btn btn-xs btn-white" onClick={(e) => this.props.modalPOOutstanding(e,original)}>{original.po_outstanding}</button>}
                        </center>
                    </React.Fragment>
                )
			},
			{
				Header: this.props.t("dur:label.document-expired"),
				id: "expired_tdp",
				className: "sticky",
				headerClassName: "sticky",
				fixed: 'right',
				accessor: d => d.expired_tdp,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="expired_tdp" getDate={this.expired_tdp} />
				),
				Cell: (d) => {
					let expired_tdp = '';
					if (d.original.expired_document>0) { //&& props.data[key]['po_outstanding'] < 6
					// style={{ backgroundColor: "red", fontWeight: "bold", color: "white" }}	
					expired_tdp =
							<div>
								<a href={'/vendor/dokumen-expired/'+d.original.uuid}>
								<button className="btn btn-white btn-xs" type="button" onClick={(e) => this.toDocExpired(e, d.original.uuid)}>
									Detail &nbsp;
										<label className="text-danger">
											({d.original.expired_document})
										</label> 
								</button>
								</a>
							</div>
					} 
					// else {
					// 	expired_tdp =
					// 		<div >
					// 			<center>{formatDate(d.original.expired_tdp, false)}</center>
					// 		</div>
					// }
					return (
						<>
							<React.Fragment>
								{expired_tdp}
							</React.Fragment>
						</>
					);
				}
			}
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

	debounced = debounce(text => this.fetchData());

	asyncData = async (params) => {
		if (this._isMounted) {
			this.setState({ loading: true })
			this.props.showDurVendor(this.props.uuid, params)
				.then((resp) => {
					if (this._isMounted) {
						let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
						this.setState({ loading: false, total: lengthPage, data: resp.data });
						this.props.setLoading(false)
					}
				})
				.catch((resp) => {
					this.setState({ loading: false })
				});
		}
	}

	handleChecklist = (e, value) => {
		this.props.handlerCheckList(value)
		if (this.state.checkAll) {
			this.setState({
				checkAll: !this.state.checkAll
			});
		}
	}

	// handlerCheckAll =  (e) => {
	// 	this.props.handleChecklistAll()
	// 	this.fetchData()
	// 	e.preventDefault();
	// }


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
			length === 'All' ? optDt.length = 10000 : optDt.length = length;
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
			this.debounced()
		})
	}

	expired_tdp = (date = '') => {
		let filters = { ...this.state.options }
		filters.start = 0;
		filters.page = 0;
		if (date !== '') {
			filters.expired_tdp = date;
		} else {
			filters.expired_tdp = '';
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

	// filterCoi = () => {
	// 	let filters = { ...this.state.options }
	// 	let arr = []
	// 	this.state.data.data.forEach(element => {
	// 		arr.push(element.vendor_id);
	// 	});
	// 	filters.coi = "1";
	// 	filters.getVendor = arr;
	// 	this.setState({ options: filters }, () => {
	// 		this.fetchData()
	// 	})
	// }

	filterby = (payload) => {
		console.log(payload)
		this.setState(({ options }) => ({
			options: { ...options, sos_type: payload.sos_type, id: payload.id }
		}), () => this.fetchData());

	}

	toggleClose = (e, id) => {
		this.setState({ modalOpen: false })
	}

	toDocExpired(e,uuid){
		this.props.history.push('/vendor/dokumen-expired/' + uuid)
	}

	// onResetFilter = (val) => {
	// 	this.setState({
	// 		options: val
	// 	}, () => this.fetchData());
	// }

	render() {
		return (
			<div>
                <ReactTableFixedColumns
                    columns={this.columns}
                    filterable loading={this.state.loading}
                    manual
                    minRows={1}
                    PaginationComponent={Pagination}
                    pageSizeOptions={[10, 20, 25, 50, 100, 'All']}
                    recordsTotal={this.state.data.recordsTotal}
                    recordsFiltered={this.state.data.recordsFiltered}
                    data={this.state.data.data}
                    showPagination={true}
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
                <div className="row m-t-10">
                    <div className="col-sm-12">
                        {/* <button type="button" onClick={(e) => this.filterCoi(e)} className="btn btn-sm btn-white m-r-5"> Open Coi </button>
                        <button type="button" onClick={(e) => this.syncrnVendorSAP()} className={this.state.loadings.loading_syncrn_vendor_sap ? 'btn btn-sm btn-white disabled m-r-5' : 'btn btn-sm btn-white m-r-5'}>Syncr Vendor SAP
                        {this.state.loadings.loading_syncrn_vendor_sap && <i className="fa fa-spinner fa-spin"></i>}
                        </button> */}
                        <button type="button" onClick={(e) => this.props.download(e)} className={this.props.loadings.button ? 'btn btn-sm btn-white disabled m-r-5' : 'btn btn-sm btn-white m-r-5'}>
                            {this.state.loadings.button && <i className="fa fa-spinner fa-spin"></i>}
                            Print
                        </button>
                    </div>
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
		// ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		showDurVendor: (id, payload) => dispatch(showDurVendor(id, payload)),
	}
}

export default withRouter(connect(stateToProps, dispatchToProps)(withTranslation()(VendorTable)));