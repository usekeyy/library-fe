import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../components/tableoptions/TableOptions';
// import { formatNumber } from '../../../helpers/formatNumber';
import { fetchMaterialServices, deleteMaterialServices, showHistoryMaterialServices } from '../../../store/actions/tendering/materialServiceActions'
import { formatDate } from '../../../helpers/formatDate';

class MaterialRequestList extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.columns = [
            {
                Header: "No MR/SR",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "Description",
                accessor: "description",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="description" onChange={(event) => this.onChanged(event)} value={this.state.params.description} />
                )
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
                Header: "Priority",
                id: "priority",
                accessor: d => d.priority,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="priority" onChange={(event) => this.onChanged(event)} value={this.state.params.priority} />
                ),
            },
            {
                Header: "Status",
                id: "status_text",
                accessor: d => d.status_text,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                // Cell: ({ value }) => (
                //     <label>{statusName(value)}</label>
                // )
            },
            {
                Header: "Created By",
                id: "created_by_name",
                accessor: d => d.created_by_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="created_by_name" onChange={(event) => this.onChanged(event)} value={this.state.params.created_by_name} />
                ),
            },
            {
                Header: "Tanggal Dibuat",
                id: "created_at",
                accessor: d => formatDate(d.created_at,true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: "Tanggal Diubah",
                id: "updated_at",
                accessor: d => formatDate(d.updated_at,true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
                Header: "Action",
                filterable: false,
                sortable: false,
                id: "uuid",
                accessor: d => d.uuid,
                Cell: d => (
                    <React.Fragment>
                        <div>
                            <center>
                                {
                                    d.original.status !== "d" &&
                                    <div>
                                        {(this.props.user.has_roles.includes("PLNRGN") && (d.original.status !== "m" && d.original.status !== "d")) && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} ><i className="fa fa-eye"></i></button>}
                                        {(this.props.user.has_roles.includes("PLNRGN") && d.original.status === "m") && <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >assgn to</button>}
                                        {(this.props.user.has_roles.includes("REQ002") && (d.original.status === "s" || d.original.status === "m")) && <button className="btn btn-xs btn-lime" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} ><i className="fa fa-eye"></i></button>}
                                        {(this.props.user.has_roles.includes("REQ002") && d.original.status === "a") && <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >approve</button>}
                                        {(!this.props.user.has_roles.includes("PLNRGN") && !this.props.user.has_roles.includes("REQ002") && d.original.status !== "r") && <button className="btn btn-xs btn-lime" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} > <i className="fa fa-eye"></i></button>}
                                        {/* {(this.props.user.has_roles.includes("REQ001") && (d.original.status == "a" || d.original.status == "m" || d.original.status == "s")) && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                        {(this.props.user.has_roles.includes("PLNRGN") && (d.original.status == "m" || d.original.status == "s")) && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                        {(this.props.user.has_roles.includes("REQ002") && (d.original.status == "a" || d.original.status == "m" || d.original.status == "s")) && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                        {(this.props.user.has_roles.includes("PLNRSP") && (d.original.status == "a" || d.original.status == "m" || d.original.status == "s")) && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>} */}
                                        {/* {(this.props.user.has_roles.includes("PLNRSP") && (d.original.status === "a" || d.original.status === "m" || d.original.status === "s")) && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} ><i className="fa fa-eye"></i></button>} */}
                                        { (!this.props.user.has_roles.includes("REQ001") && d.original.status !== "d") && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                        { this.props.user.has_roles.includes("REQ001") && d.original.status !== "r" && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                    </div>
                                }
                                {this.props.user.has_roles.includes("REQ001") &&
                                    <div>
                                        {((d.original.status === "d" || d.original.status === "r") && this.props.user.uuid !== d.original.created_by) && <button className="btn btn-xs btn-lime" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} > <i className="fa fa-eye"></i> </button>}
                                        {((d.original.status === "d" || d.original.status === "r") && this.props.user.uuid === d.original.created_by) && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} > <i className="fa fa-edit"></i> </button>}
                                        {((d.original.status === "d" || d.original.status === "r") && this.props.user.uuid === d.original.created_by) && <button className="btn btn-xs btn-danger" value={d.original.uuid} onClick={(e) => this.toggleConfirm(e, d.original.uuid)} ><i className="fa fa-trash"></i></button>}
                                        {(d.original.status === "r") && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => this.toggleOpenModalHistory(d.original.uuid)} > history </button>}
                                    </div>
                                }
                                {/* {(this.props.user.has_roles.includes("REQ001") && (d.original.status=="a" || d.original.status=="r" || d.original.status=="m" || d.original.status=="s")) && <button className="btn btn-xs btn-purple" value={d.original.uuid} onClick={(e) => alert(d.original.uuid)} > history </button>} */}
                            </center>
                        </div>
                    </React.Fragment>
                )
            },
        ];
        this.state = {
            data: [],
            params: {
                id: '',
                number: '',
                description: '',
                company_name: '',
                priority: '',
                created_by_name: '',
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
                { name: 'Submit ', value: 's', isChecked: false },
                { name: 'Draft ', value: 'd', isChecked: false },
                { name: 'Reject ', value: 'r', isChecked: false },
                { name: 'Open ', value: 'o', isChecked: false },
                { name: 'Approval ', value: 'p', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            isConfirm: false,
            uuid: '',
            isError: false,
            errors: {},
            loadingSubmit: false,
            modalHistory: false,
            dataHistory: [],
            loadingModalHistory: false
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
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

    updated_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.updated_at = date;
        } else {
            filters.updated_at = '';
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

    toggleOpenModalHistory = (e) => {
        console.log(e)
        this.setState({ modalHistory: true, loadingModalHistory: true })

        this.props.showHistoryMaterialServices(e)
            .then((resp) => {
                this.setState({
                    dataHistory: resp.data.data.history,
                    loadingModalHistory: false
                })
            })
            .catch((resp) => {
                this.setState({ loadingModalHistory: false, dataHistory: [] })
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });

    }

    toggleCloseModalHistory = () => {
        this.setState({ modalHistory: false, loadingModalHistory: false, dataHistory: [] })
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchMaterialServices(this.state.params)
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
        this.props.history.push('/tendering/msr-list-form/update/' + value)
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

    toggleConfirm = (e, value) => {

        if (this._isMounted) {
            console.log('delete')
            e.preventDefault()
            const uuid = (typeof value !== 'undefined') ? value : e.target.value;
            this.setState({ isConfirm: true, uuid: uuid })
        }
    }

    handleDelete = (id) => {
        if (this._isMounted) {
            this.props.deleteMaterialServices(id)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.req()
                })
                .catch((error) => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirm: false });
                    this.handleDelete(this.state.uuid)
                    break;
                case 'cancel':
                    this.setState({ isConfirm: false, uuid: '' });
                    break;
                default:
                    break;
            }
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
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


    render() {
        const { t } = this.props;
        let rows;

        if (this.state.dataHistory.length > 0) {
            rows = this.state.dataHistory.map((dt, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{formatDate(dt.created_at, true)}</td>
                        <td>{dt.note}</td>
                        <td>{dt.created_by_name}</td>
                        <td>{dt.status_text}</td>
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
                    <li className="breadcrumb-item">MSR List</li>
                    <li className="breadcrumb-item active">Material & Service Request List</li>
                </ol>
                <h1 className="page-header">MATERIAL & SERVICE REQUEST LIST  <small></small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {/* {t("company:title")} */}
                MATERIAL & SERVICE REQUEST LIST
                </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    {this.props.user.has_roles.includes("REQ001") &&
                                        <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.props.history.push('/tendering/msr-list-form/create')} >{t("company:button.add")}</Button>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTable
                                    // loading={false}
                                    filterable loading={this.state.loading}
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

                {(this.state.isConfirm &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.approve-delete")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="danger"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.title-delete")}
                        onConfirm={() => this.toggleSweetAlert('confirm')}
                        onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                    </SweetAlert>
                )}

                <Modal isOpen={this.state.modalHistory} toggle={() => this.toggleCloseModalHistory()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalHistory()}>Modal History</ModalHeader>

                    {this.state.loadingModalHistory && (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )}

                    {!this.state.loadingModalHistory &&
                        <div className="col-md-12"><table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Date</th>
                                    <th>Message</th>
                                    <th>Proses By</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                        </div>}
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
        fetchMaterialServices: (params) => dispatch(fetchMaterialServices(params)),
        deleteMaterialServices: (id) => dispatch(deleteMaterialServices(id)),
        showHistoryMaterialServices: (id) => dispatch(showHistoryMaterialServices(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(MaterialRequestList));
