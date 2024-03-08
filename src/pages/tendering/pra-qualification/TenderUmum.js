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
import { fetchPraQualificationTenderList } from '../../../store/actions/tendering/praQualificationActions'
// import { statusNamePraQualification } from '../../../helpers/statusName';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { formatNumber } from '../../../helpers/formatNumber';
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
                total_value:'',
                company_id:'',
                company_name:'',
                metode_tender: '',
                metode_pemasukan_penawaran: '',
                batas_registrasi:'',
                currency:'',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Tender', value: 'Tender', isChecked: false },
                { name: 'Pra Qualification ', value: 'Pra Qualification', isChecked: false },
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
                Header: "Company",
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
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.batas_registrasi} />
                ),
                Cell: ({ value }) => (
                    value.batas_registrasi !== null && value.batas_registrasi !== '' && 
                    <label>{moment(value.batas_registrasi).format("DD-MM-YYYY hh:mm:ss")}</label>
                )
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
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Detail</button>
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
        this.props.fetchPraQualificationTenderList(this.state.params)
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

    batas_registrasi = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.batas_registrasi = date;
        } else {
            filters.batas_registrasi = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    created_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.created_at = date;
        } else {
            filters.created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status = [];
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
                    <li className="breadcrumb-item active">Tender Umum</li>
                </ol>
                <h1 className="page-header">Proposal Tender - Tender Umum<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                       Tender Umum
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
        fetchPraQualificationTenderList: (params) => dispatch(fetchPraQualificationTenderList(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListReacttable));
