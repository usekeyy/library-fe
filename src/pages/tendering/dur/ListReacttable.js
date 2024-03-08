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
import { fetchDurList, showDurHistory } from '../../../store/actions/tendering/durActions'
import { statusNameDur } from '../../../helpers/statusName';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import FilterRangeValue from '../../../components/filterrangevalue/FilterRangeValue';
import { formatNumber } from '../../../helpers/formatNumber';
import { formatDate } from '../../../helpers/formatDate';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../components/tableoptions/TableOptions';


const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListReacttable extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false

        this.state = {
            data: [],
            params: {
                proposal_tender_no: '',
                pr: '',
                title: '',
                total_value: '',
                currency: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Approved', value: 'y', isChecked: false },
                { name: 'Inactived ', value: 'n', isChecked: false },
                { name: 'Submitted ', value: 's', isChecked: false },
                { name: 'Draft ', value: 'd', isChecked: false },
                { name: 'Reject ', value: 'r', isChecked: false },
                { name: 'Open ', value: 'o', isChecked: false },
                { name: 'Approval ', value: 'p', isChecked: false },
            ],
            loadings: {
                loadingModal: false
            },
            modalOpen: false,
            modalData: [],
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
                Header: () => this.props.t("dur:label.number-proposal-tender"),
                accessor: "proposal_tender_no",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: () => this.props.t("dur:label.number-pr"),
                id: "pr",
                accessor: d => d.pr.join("; "),//description.replace(/;/g, "\n"),
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="pr" onChange={(event) => this.onChanged(event)} value={this.state.params.pr} />
                )
            },
            {
                Header: () => this.props.t("dur:label.title"),
                id: "title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                ),
            },
            {
                Header: () => this.props.t("dur:label.value"),
                id: "total_value",
                accessor: d => d.total_value,
                // Filter: ({ filter, onChange }) => (
                //     <input className="form-control" name="total_value" onChange={(event) => this.onChanged(event)} value={this.state.params.total_value} />
                // ),
                Cell: ({ value }) => (
                    <div style={{ textAlign: "right" }}>{formatNumber(value, 2)}</div>
                ),
                Filter: ({ filter, onChange }) => (
                    <FilterRangeValue type="total_value" getDate={this.rangeValue} />
                ),
            },
            {
                Header: () => this.props.t("dur:label.currency"),
                id: "currency",
                accessor: d => d.currency,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
                )
            },
            {
                Header: () => this.props.t("dur:label.registration-date"),
                id: "registration_created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                ),
            },
            {
                Header: () => this.props.t("dur:label.approval-date"),
                id: "approved_at",
                accessor: d => formatDate(d.approved_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="approved_at" getDate={this.approved_at} />
                )
            },
            {
                Header: () => this.props.t("dur:label.status"),
                id: "status",
                accessor: d => d.status,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{statusNameDur(value)}</label>
                )
            },
            {
                Header: () => this.props.t("dur:label.action"),
                filterable: false,
                headerClassName: "sticky",
                id: "actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <div>
                            {(d.original.status === "o" || d.original.status === "r") && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >{d.original.status === "r" ? "Edit" : "Process"}</button>}
                            {(d.original.status === "p" || d.original.status === "a" || d.original.status === "y") && <a href={'/tendering/dur/detail/'+d.original.uuid}><button className={this.props.user.uuid === d.original.workflow_user ? "btn btn-xs btn-warning" : "btn btn-xs btn-lime"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} > {this.props.user.uuid === d.original.workflow_user ? "Process" : "View"}  </button></a>}
                            <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={(e) => this.getHistory(d.original.uuid)} >History</button>
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
    toggleClose = () => {
        this.setState({ modalOpen: false, })
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchDurList(this.state.params)
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
        this.props.history.push('/tendering/dur/detail/' + value)
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

    rangeValue = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.total_value = date;
        } else {
            filters.total_value = '';
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

    approved_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.approved_at = date;
        } else {
            filters.approved_at = '';
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

    resetFilter = () => {
        this.setState(({ params }) => ({
            params: {
                ...params,
                proposal_tender_no: '',
                pr: '',
                title: '',
                total_value: '',
                currency: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: 'updated_at',
                dir: 'desc'
            }
        }), () => this.asyncData());
    }

    getHistory(uuid) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                modalOpen: true,
                loadings: { ...loadings, loadingModal: true },
                modalData: []
            }));
            this.props
                .showDurHistory(uuid)
                .then((resp) => {
                    
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                        modalData: resp.data.data.sort((a,b) => (a.created_at > b.created_at) ? 1 : ((b.created_at > a.created_at) ? -1 : 0))
                    }));
                    
                    toastr.success(resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                    }));
                    if (resp !== undefined) {
                        toastr.error(resp.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                });
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    render() {
        const { t } = this.props;
        let rows;

        if (this.state.modalData.length > 0) {
            rows = this.state.modalData.map((dt, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{dt.proposal_tender_no}</td>
                        <td>{statusNameDur(dt.status)}</td>
                        <td>{dt.created_by_name}</td>
                        <td>{formatDate(dt.created_at, true) }</td>
                    </tr>
                )
            })
        } else {
            rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
        }
        
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Proposal Tender</li>
                    <li className="breadcrumb-item active">DUR</li>
                </ol>
                <h1 className="page-header">Proposal Tender - DUR<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                        DUR
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row className="m-t-10">
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

                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleClose()}>History</ModalHeader>
                    <ModalBody>
                        {this.state.loadings.loadingModal && (
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                        )}

                        {this.state.loadings.loadingModal === false && (
                            <div className="row">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Proposal Tender</th>
                                                <th>{t("dur:label.status")}</th>
                                                <th>{t("dur:label.updated-by")}</th>
                                                <th>{t("dur:label.updated_at")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </Modal>
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
        fetchDurList: (params) => dispatch(fetchDurList(params)),
        showDurHistory: (id) => dispatch(showDurHistory(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListReacttable));
