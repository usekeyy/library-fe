import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fileUpload } from '../../../store/actions/uploadActions';
import {fetchDataVendor, fetchPunishmentVendor, showPunishmentVendor, savePunishmentVendor, updatePunishmentVendor} from '../../../store/actions/vendor/punishmentVendorActions';

import Modal from './sub/Modal'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import { debounce } from '../../../helpers/debounce';

class PunishmentVendor extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            approval: {
                status: '',
                name: '',
            },
            params: {
				vendor_sap_code: '',
				vendor_npwp_nomor: '',
                vendor_id: '',
				vendor_name: '',
				punishhment_type: '',
				purchasing_org_suspend: '',
				suspend_type: '',
				start_date: '',
				end_date: '',
				reason_note: '',
				verification_note: '',
                status: 's;r;u',
                created_at: '',
                updated_at: '',
                created_by: '',
                created_by_name: '',
                start: 0,
                length: 0,
                column: 'vendor_id',
                dir: 'asc'
            },
			statusSearch: [
				{name: 'Menunggu Approval', value: 's', isChecked: false},
				{name: 'Tolak Punishment', value: 'r', isChecked: false},
				{name: 'Revisi Punishment', value: 'u', isChecked: false},
			],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalDetail: false,
            isConfirm: false,
            status: '',
            uuid: '',
            vendor_uuid: '',
            error: false,
            errors: {},
            loadingSubmit: false
        }
        this.defaultSorted = [
            {
                id: "vendor_id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: this.props.t("punishmentVendor:label.vendor_id"),
                accessor: "vendor_id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                )
            },
			{
                Header: this.props.t("punishmentVendor:label.vendor_sap_code"),
				id: "vendor_sap_code",
				accessor: d => d.vendor_sap_code,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="vendor_sap_code" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_sap_code} />
				)
			},
            {
                Header: this.props.t("punishmentVendor:label.vendor_name"),
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                )
            },
            {
                Header: this.props.t("punishmentVendor:label.punishment_type"),
                accessor: "punishment_type",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="punishment_type" onChange={(event) => this.onChanged(event)} value={this.state.params.punishment_type} />
                )
            },
            {
                Header: this.props.t("punishmentVendor:label.suspend_type"),
                accessor: "suspend_type",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="suspend_type" onChange={(event) => this.onChanged(event)} value={this.state.params.suspend_type} />
                ),
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {value === 'all' ? 'All Company' : value}
                        </center>
                    </React.Fragment>
                )
            },
            {
                Header: this.props.t("punishmentVendor:label.reason_note"),
                accessor: "reason_note",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="reason_note" onChange={(event) => this.onChanged(event)} value={this.state.params.reason_note} />
                )
            },
			{
                Header: this.props.t("punishmentVendor:label.start_date"),
				id: "start_date",
				accessor: d => d.start_date,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="start_date" getDate={this.start_date} />
				)
			},
			{
                Header: this.props.t("punishmentVendor:label.end_date"),
				id: "end_date",
				accessor: d => d.end_date,
				Filter: ({ filter, onChange }) => (
					<FilterDate type="end_date" getDate={this.end_date} />
				)
			},
            {
				Header: () => this.props.t("punishmentVendor:label.created_at"),
                id: "created_at",
                accessor: d => d.created_at,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
				Header: () => this.props.t("punishmentVendor:label.updated_at"),
                id: "updated_at",
                accessor: d => d.updated_at,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="updated_at" getDate={this.updated_at} />
                )
            },
			{
                Header: this.props.t("punishmentVendor:label.status"),
				id: "status_text",
				accessor: d => d.status_text,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
				)
			},
            {
                Header: () => this.props.t("punishmentVendor:label.action"),
                filterable: false,
                sortable: false,
                accessor: '',
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            { value.status === 'r' ?
                                this.props.access.U && <button className="btn btn-xs btn-primary" value={value.uuid} onClick={(e) => this.toggleFormOpen(e, value)} >Edit</button> : 
                                <button className="btn btn-xs btn-primary" value={value.uuid} onClick={(e) => this.toggleDetail(e, value)} >View</button>
                            }
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    debounced = debounce(text => this.asyncData())
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
        this.props.fetchPunishmentVendor(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered
                })
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
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
        }, () => { this.debounced(someProperty) });
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

    toggleFormOpen = (e, data) => {
        e.preventDefault();
        const uuid = e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleDetail = (e, data) => {
        e.preventDefault();
        const uuid = e.target.value;
        this.setState({ modalOpen: true, modalDetail: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, modalDetail: false, uuid: '' })
    }

    savePayload = (payload) => {
        // console.log(payload)
        if (this._isMounted) {
            if (payload.punishment_type === 'Blacklist'){
                payload.suspend_type = null
            }
            this.setState({ loadingSubmit: true });
            this.props.savePunishmentVendor(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, modalDetail: false, loadingSubmit: false }, () => this.req())
                })
                .catch(error => {
                    if(typeof error !== 'undefined'){
                        const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
                        toastr.error(message);
                        this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false ,loadingSubmit:false});
                    } else {
                        this._isMounted && this.setState({loading: false, loadingSubmit:false});
                        toastr.error("Gagal Menyimpan Data");
                    }
                })
        }
    }

    updatePayload = (id, payload) => {
        // console.log(payload)
        if (this._isMounted) {
            if (payload.punishment_type === 'Blacklist'){
                payload.suspend_type = null
            }
            this.setState({ loadingSubmit: true });
            this.props.updatePunishmentVendor(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, modalDetail: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch((error) => {
                    this.setState({ loadingSubmit: false });
                    console.log(error)
                })
        }
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
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
        // console.log(check)
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
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">{t("punishmentVendor:label.punishment_vendor")}</li>
                </ol>
                <h1 className="page-header">{t("punishmentVendor:label.punishment_vendor")}</h1>
                <Panel loading={false}>
                    <PanelHeader>{t("punishmentVendor:table")} {t("punishmentVendor:label.punishment_vendor")}</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            { !this.state.modalOpen ?
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        {this.props.access.C && <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleFormOpen(e, '')} >{t("punishmentVendor:button.add")}</Button>}
                                    </div>
                                </Col> : 
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>Kembali</Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col sm="12">
                                { !this.state.modalOpen ?
                                    <ReactTable
                                        // loading={false}
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
                                        onResetFilter={val => this.onResetFilter(val)}
                                        options={this.state.params}
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
                                    /> : 
                                    <Modal
                                        toggleAdd={this.state.modalOpen}
                                        toggleDetail={this.state.modalDetail}
                                        uuid={this.state.uuid} 
                                        status={this.state.status} 
                                        user_uuid={this.props.user.uuid}
                                        vendor_uuid={this.state.vendor_uuid} 
                                        showPunishmentVendor={this.props.showPunishmentVendor} 
                                        upload={this.props.fileUpload}
                                        fetchDataVendor={this.props.fetchDataVendor}
                                        fetchPunishmentVendor={this.props.fetchPunishmentVendor}
                                        update={this.updatePayload} 
                                        save={this.savePayload} 
                                        toggleFormClose={this.toggleFormClose}
                                        errors={this.state.errors}
                                        loadingSubmit={this.state.loadingSubmit}
                                        setLoading={this.setLoading} />
                                }
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
        user: state.auth.user.data,
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
	return {
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchPunishmentVendor: (params) => dispatch(fetchPunishmentVendor(params)),
		showPunishmentVendor: (id) => dispatch(showPunishmentVendor(id)),
		savePunishmentVendor: (params) => dispatch(savePunishmentVendor(params)),
		updatePunishmentVendor: (id, payload) => dispatch(updatePunishmentVendor(id, payload)),
		fetchDataVendor: (params) => dispatch(fetchDataVendor(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PunishmentVendor));