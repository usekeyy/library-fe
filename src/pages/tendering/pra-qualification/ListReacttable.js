import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchPraQualificationList } from '../../../store/actions/tendering/praQualificationActions'
// import { statusNamePraQualification } from '../../../helpers/statusName';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { formatNumber } from '../../../helpers/formatNumber';
import moment from 'moment';


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListReacttable extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false

        this.state = {
            data: [],
            params: {
                proposal_tender_no:'',
                number_pr:'',
                title:'',
                total_nilai:'',
                currency:'',
                pq_status: '',
                pq_status_text: '',
                start_date: '',
                end_date: '',
                start_time: '',
                end_time: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Open', value: 'Open', isChecked: false },
                { name: 'Active', value: 'Active', isChecked: false },
                { name: 'Approval', value: 'Approval', isChecked: false },
                { name: 'Approved', value: 'Approved', isChecked: false },
                { name: 'Rejected', value: 'Rejected', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
        ];
        this.columns = [
            {
                Header: "No. Proposal Tender",
                accessor: "proposal_tender_no",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            // {
            //     Header: "No. PR",
            //     id :"number_pr",
            //     accessor: d => d.pr.join("; "),//description.replace(/;/g, "\n"),
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="number_pr" onChange={(event) => this.onChanged(event)} value={this.state.params.number_pr} />
            //     )
            // },
            {
                Header: "Title",
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            // {
            //     Header: "Nilai",
            //     id: "total_value",
            //     accessor: d => d.total_value,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
            //     ),
            //     Cell: ({ value }) => (
            //         <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
            //     )
            // },
            // {
            //     Header: "Currency",
            //     id: "currency",
            //     accessor: d => d.currency,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
            //     )
            // },
            {
                Header: "Total Nilai",
                id: "total_nilai",
                accessor: d => d.total_nilai,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total_nilai" onChange={(event) => this.onChanged(event)} value={this.state.params.total_nilai} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
            },
            {
                Header: "Start Date",
                id: "start_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.start_date} />
                ),
                Cell: ({ value }) => (
                    value.start_time !== null && value.start_time !== '' && 
                    <label>{moment(value.start_date).format("DD-MM-YYYY")} {value.start_time}</label>
                )
            },
            {
                Header: "End Date",
                id: "end_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.end_date} />
                ),
                Cell: ({ value }) => (
                    value.end_time !== null && value.end_time !== '' && 
                    <label>{moment(value.end_date).format("DD-MM-YYYY")} {value.end_time}</label>
                )
            },
            {
                Header: "Status",
                id: "pq_status_text",
                accessor: d => d.pq_status_text,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
            },
            {
                Header: "Action",
                filterable: false,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <div>
                            <button className={"btn btn-xs btn-success"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Detail</button>
                            {/* <button className={this.props.user.uuid === d.original.workflow_user ? "btn btn-xs btn-warning": "btn btn-xs btn-lime"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Process</button> */}
                            {/* <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={(e) => alert('a')} >History</button> */}
                        </div>
                    </React.Fragment>
                )
            },
        ];
    }


    componentDidMount = () => {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchPraQualificationList(this.state.params)
            .then((resp) => {
                // console.log(resp.data.data)
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
                })
            })
            .catch((resp) => {
                this.setState({ loading: false })
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
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

    edits(e, value) {
        this.props.history.push('/tendering/pra-qualification/detail/' + value)
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
            this.asyncData();
        }
    }

    start_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_date = date;
        } else {
            filters.start_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    end_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.end_date = date;
        } else {
            filters.end_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.pq_status_text = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.pq_status_text = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

	onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    render() {
        // const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Proposal Tender</li>
                    <li className="breadcrumb-item active">Pra Qualification</li>
                </ol>
                <h1 className="page-header">Proposal Tender - Pra Qualification<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                       Pra Qualification
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <ReactTableFixedColumns
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
                                    }}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchPraQualificationList: (params) => dispatch(fetchPraQualificationList(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListReacttable));
