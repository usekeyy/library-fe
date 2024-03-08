import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

// import { fetchUsersRole } from '../../../store/actions/tendering/mappingValueApprovalActions';
import {fetchAnggotaEvaluator, saveAnggotaEvaluator, showAnggotaEvaluator, updateAnggotaEvaluator, deleteAnggotaEvaluator} from '../../../store/actions/master/anggotaEvaluatorActions'
// import { fetchPurchasingOrg } from '../../../store/actions/master/purchasingOrgActions';
import { fetchUsers } from '../../../store/actions/utility/usersActions';
// import { fetchUsersRole } from '../../../store/actions/utility/usersActions';
// import { fetchRole, showRole } from '../../../store/actions/utility/roleActions';

import ModalForm from './sub/Modal'
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import { statusName } from '../../../helpers/statusName';
// import {formatNumber} from '../../../helpers/formatNumber';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class Evaluator extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                evaluator_group_name : '',
                user_id: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            defaultPageSize: 10,
            recordsFiltered: 0,
            recordsTotal: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            isConfirm: false,
            uuid: '',
            user_id : '',
            isError: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
				Header: () => "Evaluator Group Name",
                accessor: "evaluator_group_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="evaluator_group_name" onChange={(event) => this.onChanged(event)} value={this.state.params.evaluator_group_name} />
                )
            },
            {
				Header: () => "User",
                accessor: "user_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="user_name" onChange={(event) => this.onChanged(event)} value={this.state.params.user_name} />
                )
            },
            {
				Header: () => "Status",
                accessor: "status",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="status" onChange={(event) => this.onChanged(event)} value={this.state.params.status} />
                ),
                Cell : ({value}) => {
                    switch (value) {
                        case "y":
                            return "Ketua"
                        case "n" :
                            return "Anggota"
                        default: 
                            return ""
                    }
                }
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                headerClassName: "sticky",
                fixed: "right",
                Cell: ({ value, original }) => (
                    <React.Fragment>
                        <center>
                            <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value, original.user_id)} ><i className="fa fa-trash"></i></button>
                        </center>
                    </React.Fragment>
                )
            },
        ]
    }

    componentDidMount = () => {
        this._isMounted = true;        
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async () => {
        // let dataDummy = [
        //     {
        //         evaluator_id : "1",
        //         user : "Khafit",
        //         status : "Ketua"
        //     },
        //     {
        //         evaluator_id : "2",
        //         user : "Eris",
        //         status : "Anggota"
        //     }
        // ]
        // this.setState({data : dataDummy})
        this.setState({ loading: true })
        this.props.fetchAnggotaEvaluator(this.state.params, this.props.match.params.id)
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
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start = 0
        this.setState({
            params: someProperty,
            page: 0
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

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, isError: false, errors: {}, loadingSubmit: false })
    }

    savePayload = (type, payload) => {
        if (type === "save") {
            this.setState({ loadingSubmit: true });
            this.props.saveAnggotaEvaluator(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    updatePayload = (type, id, payload) => {
        if (type === "update") {
            this.setState({ loadingSubmit: true });
            this.props.updateAnggotaEvaluator(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch((error) => {
                    if (error !== undefined) {
                        if (error.data.errors?.check_ketua_exist){
                            toastr.error(error.data.errors.check_ketua_exist[0])
                        }else{
                            toastr.error(error.data.message)
                        }
                        this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    deletePayload = (type, user_id) => {
        const payload = {
            user_id : user_id
        }
        this.props.deleteAnggotaEvaluator(type,payload)
            .then((resp) => {
                this.setState({ isConfirm: false });
                toastr.success(resp.data.message);
                this.req()
            })
            .catch((error) => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false, isConfirm: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleConfirm = (e, value, user_id) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, user_id : user_id })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuid, this.state.user_id)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '', user_id : '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '', user_id : '' });
                break;
        }
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

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Anggota Evaluator</li>
                </ol>
                <h1 className="page-header">Anggota Evaluator  <small>Master Data Anggota Evaluator</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Tabel Anggota Evaluator
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("mappingValueApproval:button.add")}</Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTableFixedColumns
                                    filterable loading={this.state.loading}
                                    manual
                                    minRows={1}
                                    data={this.state.data}
                                    PaginationComponent={ReactTablePagination}
                                    columns={this.columns}
                                    defaultPageSize={this.state.defaultPageSize}
                                    defaultSorted={this.defaultSorted}
                                    showPagination={true}
                                    showPaginationTop={false}
                                    showPaginationBottom={true}
                                    pageSizeOptions={[10, 20, 25, 50, 100]}
                                    className="-highlight"
                                    recordsTotal={this.state.recordsTotal}
                                    recordsFiltered={this.state.recordsFiltered}
                                    length={this.state.params.length}
                                    start={this.state.params.start}
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
                {this.state.modalOpen &&
                    <ModalForm
                        evaluator_id = {this.props.match.params.evaluator_id}
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        showAnggotaEvaluator={this.props.showAnggotaEvaluator}
                        fetchPurchasingOrg={this.props.fetchPurchasingOrg}
                        fetchUsers={this.props.fetchUsers}
                        fetchRole={this.props.fetchRole}
                        showRole={this.props.showRole}
                        fetchUsersRole={this.props.fetchUsersRole}
                        save={this.savePayload}
                        update={this.updatePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
                    />
                    
                }
                {console.log(this.props.match.params.evaluator_id)}
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
        fetchAnggotaEvaluator: (params,id) => dispatch(fetchAnggotaEvaluator(params,id)),
        saveAnggotaEvaluator: (id, payload) => dispatch(saveAnggotaEvaluator(id, payload)),
        fetchUsers: (params) => dispatch(fetchUsers(params)),

        showAnggotaEvaluator: (id) => dispatch(showAnggotaEvaluator(id)),
        deleteAnggotaEvaluator: (id,payload) => dispatch(deleteAnggotaEvaluator(id,payload)),
        updateAnggotaEvaluator: (id, payload) => dispatch(updateAnggotaEvaluator(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Evaluator));
