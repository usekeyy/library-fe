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

import { fetchUsersRole, fetchMappingValueApproval, showMappingValueApproval, deleteMappingValueApproval, saveMappingValueApproval, updateMappingValueApproval } from '../../../store/actions/tendering/mappingValueApprovalActions';
import { fetchPurchasingOrg } from '../../../store/actions/master/purchasingOrgActions';
import { fetchPurchasingGroup } from '../../../store/actions/master/purchasingGroupActions';
// import { fetchUsersRole } from '../../../store/actions/utility/usersActions';
import { fetchRole, showRole } from '../../../store/actions/utility/roleActions';

import ModalForm from './sub/Modal'
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { statusName } from '../../../helpers/statusName';
import {formatNumber} from '../../../helpers/formatNumber';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class MappingValueApproval extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                user_id: '',
                user_name: '',
                role_id: '',
                role_name: '',
                purchasing_org_id: '',
                purchasing_org_name: '',
                purchasing_group_id: '',
                purchasing_group_name: '',
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
				Header: "",
                filterable: false,
                maxWidth: 50,
                sortable: false,
                Cell: (row) => {
                    return <div>{row.index+1}</div>;
                }
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.purchasing_org_id"),
                accessor: "purchasing_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                )
            },
            {
				Header: () => this.props.t("purchasingOrg:title"),
                accessor: "purchasing_org_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
                )
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.purchasing_group_id"),
                accessor: "purchasing_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_id} />
                )
            },
            {
				Header: () => this.props.t("purchasingGroup:title"),
                accessor: "purchasing_group_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_group_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_name} />
                )
            },
            {
				Header: () => "Role",
                accessor: "role_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="role_name" onChange={(event) => this.onChanged(event)} value={this.state.params.role_name} />
                )
            },
            {
				Header: () => this.props.t("users:Title"),
                accessor: "user_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="user_name" onChange={(event) => this.onChanged(event)} value={this.state.params.user_name} />
                )
            },
            {
                Header: () => this.props.t("mappingValueApproval:label.value_from"),
                accessor: "value_from",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="value_from" onChange={(event) => this.onChanged(event)} value={this.state.params.value_from} />
                ),
                Cell : item => {
                    return <div>
                        {formatNumber(item.value) + this.getCommaFormat(item.value)}
                    </div>
                }
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.value_to"),
                accessor: "value_to",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="value_to" onChange={(event) => this.onChanged(event)} value={this.state.params.value_to} />
                ),
                Cell : item => {
                    return <div>
                        {formatNumber(item.value) + this.getCommaFormat(item.value)}
                    </div>
                }
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.status"),
                id: "status",
                accessor: d => d.status,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{statusName(value)}</label>
                )
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.created_at"),
                id: "created_at",
                accessor: d => d.created_at,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.updated_at"),
                id: "updated_at",
                accessor: d => d.updated_at,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
				Header: () => "Order",
                accessor: "order",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="order" onChange={(event) => this.onChanged(event)} value={this.state.params.order} />
                )
            },
            {
				Header: () => "Tipe",
                accessor: "type",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="type" onChange={(event) => this.onChanged(event)} value={this.state.params.type} />
                )
            },
            {
				Header: () => this.props.t("mappingValueApproval:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                headerClassName: "sticky",
                fixed: "right",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>
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
        this.setState({ loading: true })
        this.props.fetchMappingValueApproval(this.state.params)
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
            this.props.saveMappingValueApproval(payload)
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
            this.props.updateMappingValueApproval(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
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

    deletePayload = (type) => {
        this.props.deleteMappingValueApproval(type)
            .then((resp) => {
                this.setState({ isConfirm: false });
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

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
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

    getCommaFormat(value) {
        if (value.substr(value.length - 3, 1) === "."){
            return `,${value.substr(value.length - 2)}`
        }else {
            return ""
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}


    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">{t("mappingValueApproval:title")}</li>
                </ol>
                <h1 className="page-header">{t("mappingValueApproval:title")}  <small>Master Data {t("mappingValueApproval:title")}</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("mappingValueApproval:table-title")}
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
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        showMappingValueApproval={this.props.showMappingValueApproval}
                        fetchPurchasingOrg={this.props.fetchPurchasingOrg}
                        fetchPurchasingGroup={this.props.fetchPurchasingGroup}
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
        fetchMappingValueApproval: (params) => dispatch(fetchMappingValueApproval(params)),
        showMappingValueApproval: (id) => dispatch(showMappingValueApproval(id)),
        deleteMappingValueApproval: (id) => dispatch(deleteMappingValueApproval(id)),
        saveMappingValueApproval: (id, payload) => dispatch(saveMappingValueApproval(id, payload)),
        updateMappingValueApproval: (id, payload) => dispatch(updateMappingValueApproval(id, payload)),
        fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
        fetchPurchasingGroup: (params) => dispatch(fetchPurchasingGroup(params)),
        fetchUsersRole: (params) => dispatch(fetchUsersRole(params)),
        fetchRole: (params) => dispatch(fetchRole(params)),
		showRole: (id) => dispatch(showRole(id)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(MappingValueApproval));