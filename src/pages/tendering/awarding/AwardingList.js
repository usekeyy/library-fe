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
import { fetchAwarding  } from '../../../store/actions/tendering/awardingActions'
// import { Modal, ModalHeader } from 'reactstrap';
import { formatNumber } from '../../../helpers/formatNumber';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import { statusNameAwarding } from '../../../helpers/statusName';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

class AwardingList extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id:'',
                uuid:'',
                proposal_tender_id:'',
                proposal_tender_uuid:'',
                proposal_tender_no:'',
                proposal_tender_title:'',
                created_at:'',
                created_by:'',
                updated_at:'',
                updated_by:'',
                status:'',
                status_text:'',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Approved', value: 'y', isChecked: false },
                { name: 'Rejected', value: 'r', isChecked: false },
                { name: 'Approval', value: 'p', isChecked: false },
                { name: 'Open', value: 'd', isChecked: false },
                // { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            dataRegistration :[],
            dataModalRegistration : {
                start_date :'',
                end_date:'',
                paket_no :'',
                title : '',
                uuid:''
            }
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
                id :"proposal_tender_no",
                accessor: d => d.proposal_tender_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                ),
                // Cell: d => (
                //     <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}tendering/monitoring-tender-buyer/detail/${d.original.proposal_tender_uuid}`} >{d.original.proposal_tender_no}</a>
                // )
            },
            {
                Header: "Description",
                id: "proposal_tender_title",
                accessor: d => d.proposal_tender_title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_title" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_title} />
                )
            },
            {
                Header: "Nilai",
                id: "total_value",
                accessor: d => d.total_value,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
                ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value,2)}</div>
                )
            },
            {
                Header: "Status",
                id: "status",
                accessor: d=>d.status,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{statusNameAwarding(value)}</label>
                )
                // filterable:false,
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
                            <button className="btn btn-xs btn-warning m-r-5" value={d.original.proposal_tender_uuid} onClick={(e) => this.edits(e,d.original.proposal_tender_uuid)}  >Process</button>
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
        this.props.fetchAwarding(this.state.params)
            .then((resp) => {
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
        this.props.history.push('/tendering/awarding/detail/' + value)
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
        return (
            <div>
            <ol className="breadcrumb float-xl-right">
                <li className="breadcrumb-item">Home</li>
                <li className="breadcrumb-item">Tendering</li>
                <li className="breadcrumb-item active">Awarding</li>
            </ol>
            <h1 className="page-header">Awarding<small></small></h1>
            <Panel loading={false} className="margin-bot-false">
                <PanelHeader>
                   Awarding
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
        fetchAwarding: (params) => dispatch(fetchAwarding(params)),
        // registrationAanwijzing: (id,payload) => dispatch(registrationAanwijzing(id,payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(AwardingList))
