import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchPurchaseOrder  } from '../../../store/actions/tendering/PurchaseOrderActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import { formatNumber } from '../../../helpers/formatNumber';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import moment from 'moment';
import { debounce } from '../../../helpers/debounce';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class PurchaseOrderOA extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                eproc_number: '',
                sap_number: '',
                no_oa:'',
                purchasing_requisition_number:'',
                vendor_id:'',
                vendor_name:'',
                purc_group_id:'',
                purc_org_id: '',
                agreement_type:'',
                total_nilai:'',
                agreement_date:'',
                validity_start:'',
                validity_end:'',
                tipe: 'oa',
                progress: '',
                status_progress: '',
                status: '',
                read_by_vendor: '',
                status_text:'',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Open PO', value: 'd', isChecked: false },
                { name: 'Review', value: 'o', isChecked: false },
                { name: 'Rejected', value: 'r', isChecked: false },
                { name: 'Approval', value: 'p', isChecked: false },
                { name: 'PO Created', value: 'c', isChecked: false },
                { name: 'PO Released', value: 's', isChecked: false },
                { name: 'PO Confirmed', value: 'y', isChecked: false },
                { name: 'Proposal Cancel PO', value: 'a', isChecked: false },
                { name: 'PO Canceled', value: 'n', isChecked: false },
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
            error: false,
            errors: {},
            loadingSubmit:false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "No. PO Eproc",
                // headerClassName: "sticky",
                // fixed: "left",
                height: 10,
                accessor: "eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.eproc_number} />
                ),
            },
            {
                Header: "No. PO ERP",
                accessor: "sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_number} />
                )
            },
            {
                Header: "No. OA",
                accessor: "no_oa",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="no_oa" onChange={(event) => this.onChanged(event)} value={this.state.params.no_oa} />
                )
            },
            {
                Header: "No. PR",
                accessor: "purchasing_requisition_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_requisition_number" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_requisition_number} />
                ),
                // Cell: ({ value }) => (
                //     value.length > 0 &&
                //         value.map(function(item, index) {
                //             return <span key={index}>{item}{ (value[index + 1] ? '; ' : '')}</span>;
                //         })
                // )
            },
            {
                Header: "Vendor",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                ),
            },
            // {
            //     Header: "Vendor Name",
            //     accessor: "vendor_name",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
            //     ),
            // },
            {
                Header: "POrg",
                accessor: "purc_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purc_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purc_org_id} />
                ),
            },
            {
                Header: "PGroup",
                accessor: "purc_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purc_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purc_group_id} />
                ),
            },
            // {
            //     Header: "Agreement Type",
            //     accessor: "agreement_type",
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="agreement_type" onChange={(event) => this.onChanged(event)} value={this.state.params.agreement_type} />
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
                Header: "Agreement Date",
                id: "agreement_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.agreement_date} />
                ),
                Cell: ({ value }) => (
                    value.agreement_date !== null && value.agreement_date !== '' && 
                    <label>{moment(value.agreement_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Validity Start",
                id: "validity_start",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.validity_start} />
                ),
                Cell: ({ value }) => (
                    value.validity_start !== null && value.validity_start !== '' && 
                    <label>{moment(value.validity_start).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Validity End",
                id: "validity_end",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.validity_end} />
                ),
                Cell: ({ value }) => (
                    value.validity_end !== null && value.validity_end !== '' && 
                    <label>{moment(value.validity_end).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Progress (%)",
                accessor: "progress",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="progress" onChange={(event) => this.onChanged(event)} value={this.state.params.progress} />
                ),
            },
            {
                Header: "Status Progress",
                accessor: "status_progress",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="status_progress" onChange={(event) => this.onChanged(event)} value={this.state.params.status_progress} />
                ),
            },
            {
                Header: "Status",
                id: "status_text",
                accessor: d => d.status_text,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
            },
            {
                Header: "Read By Vendor",
                accessor: "read_by_vendor",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="read_by_vendor" onChange={(event) => this.onChanged(event)} value={this.state.params.read_by_vendor} />
                ),
            },
            {
                Header: "Action",
                filterable: false,
                // width: 180,
                headerClassName: "sticky",
                id:"actions",
                className: "sticky",
				fixed: 'right',
				width: 120,
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Process</button>
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

    debounced = debounce(text => this.req(text));

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchPurchaseOrder(this.state.params)
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
        this.setState({
            params: someProperty
        }, () => { this.debounced() });
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
        }, () => { this.debounced() });
    }

    req(stateArr) {
        if (stateArr !== undefined) {
            this.customs(stateArr)
        } else {
            this.asyncData();
        }
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

    validity_start = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.validity_start = date;
        } else {
            filters.validity_start = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    validity_end = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.validity_end = date;
        } else {
            filters.validity_end = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    agreement_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.agreement_date = date;
        } else {
            filters.agreement_date = '';
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

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false })
    }

    edits(e, value) {
        this.props.history.push('/perikatan/purchase-order/detail/' + value)
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

	onResetFilter = (val) => {
        val.tipe = 'oa'
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Purchase Order - Outline Agreement</li>
                </ol>
                <h1 className="page-header">Purchase Order - Outline Agreement</h1>
                <Panel loading={false}>
                    <PanelHeader>List Purchase Order - Outline Agreement</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTableFixedColumns
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
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {/* {this.state.modalOpen &&
                    <ModalForm
                        errors={this.state.errors}
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid}
                        fetchRegions={this.props.fetchRegions}
                        fetchCountries={this.props.fetchCountries}
                        fetchDistricts={this.props.fetchDistricts}
                        fetchSubDistricts={this.props.fetchSubDistricts}
                        showVillages={this.props.showVillages}
                        loadingSubmit={this.state.loadingSubmit}
                        save={this.savePayload}
                        update={this.updatePayload}
                        toggleClose={this.toggleFormClose}
                    />
                } */}
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
		access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchPurchaseOrder: (params) => dispatch(fetchPurchaseOrder(params)),
        // fetchVillages: (params) => dispatch(fetchVillages(params)),
        // fetchDistricts: (params) => dispatch(fetchDistricts(params)),
        // showVillages: (id) => dispatch(showVillages(id)),
        // deleteVillages: (id) => dispatch(deleteVillages(id)),
        // saveVillages: (id, payload) => dispatch(saveVillages(id, payload)),
        // updateVillages: (id, payload) => dispatch(updateVillages(id, payload)),
        // fetchRegions: (params) => dispatch(fetchRegions(params)),
        // fetchCountries: (params) => dispatch(fetchCountries(params)),
        // fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PurchaseOrderOA));
