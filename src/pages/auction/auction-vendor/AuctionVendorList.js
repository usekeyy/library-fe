import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination'
import { Panel, PanelBody, PanelHeader } from '../../../containers/layout/sub/panel/panel'
import 'react-table/react-table.css';
import { fetchAuctionVendorList } from '../../../store/actions/auction/auctionVendorActions'
import { toastr } from 'react-redux-toastr'
import FilterDate from '../../../components/filterdate/FilterDate'
import { formatDate } from '../../../helpers/formatDate'

class auction extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                auction_number : '',
                proposal_tender_no : '',
                auction_description : '',
                total_value : '',
                start: 0,
                length: 0,
                column: '',
                status: (this.props.location.pathname === '/auction-list') ? 'p;s;y' : 's;p',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            toggleSync: false,
            isConfirm: false,
            uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "auction_number",
                desc: true
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("auction:label.no-auction"),
                accessor: "auction_number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="auction_number" onChange={(event) => this.onChanged(event)} value={this.state.params.auction_number} />
                )
            },
            {
                Header: () => this.props.t("auction:label.no-proposal-tender"),
                accessor: "proposal_tender_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: () => this.props.t("auction:label.description"),
                accessor: "auction_description",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="auction_description" onChange={(event) => this.onChanged(event)} value={this.state.params.auction_description} />
                )
            },
            {
				Header: () => this.props.t("auction:label.start-date-auction"),
                id: "start_auction",
                accessor: d => formatDate(d.start_auction, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="start_auction" getDate={this.start_auction} />
                )
            },
            {
				Header: () => this.props.t("auction:label.finish-date-auction"),
                id: "end_auction",
                accessor: d => formatDate(d.end_auction, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="end_auction" getDate={this.end_auction} />
                )
            },
            {
                Header: () => this.props.t("auction:label.status"),
                accessor: "status_auction_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="status_auction_text" onChange={(event) => this.onChanged(event)} value={this.state.params.status_auction_text} />
                )
            },
            {
                Header: () => this.props.t("assets:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {this.props.access.R && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toDetail(e, value)} >Detail</button>}
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    toDetail(e, value) {
        this.props.history.push('/task-vendor/auctions/' + value)
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchAuctionVendorList(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length)
                })
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => { this.req() });
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.params.start = (arr.page * state)
        someProperty.params.length = state;
        someProperty.defaultPageSize = state;
        someProperty.params.column = arr.sorted[0].id
        someProperty.params.dir = (arr.sorted[0].desc ? 'desc' : 'asc')

        this.setState({
            someProperty
        }, () => { this.req() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
    }

    start_auction = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_auction = date;
        } else {
            filters.start_auction = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    end_auction = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.end_auction = date;
        } else {
            filters.end_auction = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    onResetFilter = (val) => {
        val.status = "y;p"
        this.setState({
            params: val,
        }, () => this.asyncData());
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Auction</li>
                    <li className="breadcrumb-item">Vendor Auction</li>
                </ol>
                <h1 className="page-header">{t("auction:title")}</h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("auction:title")}
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <div className="row">
                            <div className="col-sm-12">
                                <ReactTable
                                    // loading={false}
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
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </div>
        )
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
        fetchAuctionVendorList: (parameter) => dispatch(fetchAuctionVendorList(parameter))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(auction));
