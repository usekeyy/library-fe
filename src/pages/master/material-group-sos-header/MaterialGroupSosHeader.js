import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchMaterialGroupSosHeader, updateMaterialGroupSosHeader , saveMaterialGroupSosHeader , deleteMaterialGroupSosHeader , showMaterialGroupSosHeader , syncMaterialGroupSosHeader } from '../../../store/actions/master/materialGroupSosHeaderActions';
import { fetchMaterialGroup } from '../../../store/actions/master/materialGroupActions';
import { fetchBidangUsaha } from '../../../store/actions/master/bidangUsahaActions';

import ModalForm from './sub/Modal'
import ModalSync from './sub/ModalSync'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';


class MaterialGroupSosHeader extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                material_group_id: '',
                material_group_name: '',
                bidang_usaha_id: '',
                bidang_usaha_name: '',
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
            recordsTotal: 0,
            recordsFiltered: 0,
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
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("materialGroupSosHeader:label.id"),
                accessor: "id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.material_group_id"),
                accessor: "material_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="material_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.material_group_id} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.material_group_name"),
                accessor: "material_group_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="material_group_name" onChange={(event) => this.onChanged(event)} value={this.state.params.material_group_name} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.bidang_usaha_id"),
                accessor: "bidang_usaha_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="bidang_usaha_id" onChange={(event) => this.onChanged(event)} value={this.state.params.bidang_usaha_id} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.bidang_usaha_name"),
                accessor: "bidang_usaha_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="bidang_usaha_name" onChange={(event) => this.onChanged(event)} value={this.state.params.bidang_usaha_name} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.status"),
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
                Header: () => this.props.t("materialGroupSosHeader:label.created_at"),
                id: "created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.updated_at"),
                id: "updated_at",
                accessor: d => formatDate(d.updated_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
            {
                Header: () => this.props.t("materialGroupSosHeader:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {this.props.access.U && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
                            {this.props.access.D && <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>}
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
        this.setState = (state,callback)=>{
            return;
        };
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchMaterialGroupSosHeader(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading:false
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

	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({toggleSync: true, uuid: value})
		}
	}

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, toggleSync: false })
    }

	handleSync = (val) => {
		if(this._isMounted){
			this.setState({loading: true})
			this.props.syncMaterialGroupSosHeader(val)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading: false, errors: []}, () => {
                    this.toggleFormClose()
					this.asyncData()
				});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false});
				} else {
					this._isMounted && this.setState({loading: false});
					toastr.error("Gagal Sinkron Data");
				}
			})
		}
	}

    savePayload = (payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.saveMaterialGroupSosHeader(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false, errors: {} }, () => this.req())
                })
                .catch(error => {
                    if (typeof error !== 'undefined') {
                        const { message } = (typeof error !== 'undefined') ? error.data : 'Error';
                        toastr.error(message);
                        this._isMounted && this.setState({ error: true, errors: error.data.errors, loading: false, loadingSubmit: false });
                    } else {
                        this._isMounted && this.setState({ loading: false, loadingSubmit: false });
                        toastr.error("Gagal Menyimpan Data");
                    }
                })
        }
    }

    updatePayload = (id, payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.updateMaterialGroupSosHeader(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false, errors: {} }, () => this.req())
                    console.log(resp)
                })
                .catch((error) => {
                    if (typeof error !== 'undefined') {
                        const { message } = (typeof error !== 'undefined') ? error.data : 'Error';
                        toastr.error(message);
                        this._isMounted && this.setState({ error: true, errors: error.data.errors, loading: false, loadingSubmit: false });
                    } else {
                        this._isMounted && this.setState({ loading: false, loadingSubmit: false });
                        toastr.error("Gagal Menyimpan Data");
                    }
                })
        }
    }

    deletePayload = (type) => {
        this.props.deleteMaterialGroupSosHeader(type)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false });
                this.req()
            })
            .catch((error) => {
                console.log(error)
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

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">{t("materialGroupSosHeader:title")}</li>
                </ol>
                <h1 className="page-header">{t("materialGroupSosHeader:title")}  <small>Master {t("materialGroupSosHeader:title")}</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        {t("materialGroupSosHeader:table-title")}
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                                <div className="pull-right m-b-10">
                                    {this.props.access.C && <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("materialGroupSosHeader:button.add")}</Button>}
                                </div>
                                <span> </span>
                                <div className="pull-right m-b-10">
									<Button color="primary" size="sm" value="" onClick={(e) => this.toggleFormSync(e, '')} >Sync</Button>
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
                                    className="-highlight"
                                    pages={this.state.pages}
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
                        errors={this.state.errors}
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        showMaterialGroupSosHeader={this.props.showMaterialGroupSosHeader}
                        fetchMaterialGroup={this.props.fetchMaterialGroup}
                        fetchBidangUsaha={this.props.fetchBidangUsaha}
                        loadingSubmit={this.state.loadingSubmit}
                        save={this.savePayload}
                        update={this.updatePayload}
                        toggleClose={this.toggleFormClose}
                    />
                }
				{this.state.toggleSync && 
                    <ModalSync 
                        loading={this.state.loading}
                        errors={this.state.errors}
                        toggleSync={this.state.toggleSync} 
                        toggleClose={this.toggleFormClose} 
                        sync={this.handleSync}
                        datas={this.state} 
                    />
                }
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert('confirm')}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
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
        fetchMaterialGroupSosHeader: (params) => dispatch(fetchMaterialGroupSosHeader(params)),
        showMaterialGroupSosHeader: (id) => dispatch(showMaterialGroupSosHeader(id)),
        deleteMaterialGroupSosHeader: (id) => dispatch(deleteMaterialGroupSosHeader(id)),
        saveMaterialGroupSosHeader: (id, payload) => dispatch(saveMaterialGroupSosHeader(id, payload)),
        updateMaterialGroupSosHeader: (id, payload) => dispatch(updateMaterialGroupSosHeader(id, payload)),      
		syncMaterialGroupSosHeader: (payload) => dispatch(syncMaterialGroupSosHeader(payload)),
        fetchMaterialGroup: (params) => dispatch(fetchMaterialGroup(params)),
        fetchBidangUsaha: (params) => dispatch(fetchBidangUsaha(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(MaterialGroupSosHeader));
