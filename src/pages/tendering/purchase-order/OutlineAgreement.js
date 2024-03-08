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
import { fetchOutlineAgreement  } from '../../../store/actions/tendering/OutlineAgreementActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import { formatNumber } from '../../../helpers/formatNumber';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import moment from 'moment';
import { debounce } from '../../../helpers/debounce';

const ReactTableFixedColumns = withFixedColumns(ReactTable);


class OutlineAgreement extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id:'',
                number:'',
                eproc_number:'',
                sap_number: '',
                vendor_id:'',
                vendor_name:'',
                target_value:'',
                agreement_type:'',
                agreement_date:'',
                validity_start:'',
                validity_end:'',
                purchasing_group_id:'',
                purchasing_org_id: '',
                currency:'',
                tipe: 'oa',
                status: '',
                status_text:'',
                created_at:'',
                updated_at:'',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Draft', value: 'd', isChecked: false },
                { name: 'Active', value: 'y', isChecked: false },
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
                Header: "No OA Eproc",
                accessor: "number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "No OA ERP",
                accessor: "sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_number} />
                )
            },
            {
                Header: "No Proposal Tender",
                accessor: "proposal_tender_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_number" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_number} />
                )
            },
            {
                Header: "Vendor",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                ),
            },
            {
                Header: "Vendor Name",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                ),
            },
            {
                Header: "Target Value",
                id: "target_value",
                accessor: d => formatNumber(d.target_value, 2),
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="target_value" onChange={(event) => this.onChanged(event)} value={this.state.params.target_value} />
                ),
            },
            {
                Header: "Currency",
                accessor: "currency",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
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
                Header: "POrg",
                accessor: "purchasing_org_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_org_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_id} />
                ),
            },
            {
                Header: "PGroup",
                accessor: "purchasing_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_id} />
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
                Header: "Action",
                filterable: false,
                className: "sticky",
				headerClassName: "sticky",
				fixed: 'right',
				width: 120,
                id:"actions",
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
        this.props.fetchOutlineAgreement(this.state.params)
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
        this.props.history.push('/perikatan/outline-agreement/detail/' + value)
    }

	onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}
    // savePayload = (payload) => {
    //     if (this._isMounted) {
    //         this.setState({ loadingSubmit: true });
    //         this.props.saveVillages(payload)
    //             .then((resp) => {
    //                 toastr.success(resp.data.message);
    //                 this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
    //                 toastr.success(resp.message);
    //             })
    //             .catch(error => {
    //                 if(typeof error !== 'undefined'){
    //                     const {message} = (typeof error !== 'undefined') ? error.data : 'Gagal';
    //                     toastr.error(message);
    //                     this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false ,loadingSubmit:false});
    //                 } else {
    //                     this._isMounted && this.setState({loading: false, loadingSubmit:false});
    //                     toastr.error("Gagal Menyimpan Data");
    //                 }
    //             })
    //     }
    // }

    // updatePayload = (id, payload) => {
    //     if (this._isMounted) {
    //         this.setState({ loadingSubmit: true });
    //         this.props.updateVillages(id, payload)
    //             .then((resp) => {
    //                 toastr.success(resp.data.message);
    //                 this.setState({ modalOpen: false, loadingSubmit:false }, () => this.req())
    //                 console.log(resp)
    //             })
    //             .catch((error) => {
    //                 this.setState({ loadingSubmit: false });
    //                 console.log(error)
    //             })
    //     }
    // }

    // deletePayload = (type) => {
    //     this.props.deleteVillages(type)
    //         .then((resp) => {
    //             toastr.success(resp.data.message);
    //             this.setState({ isConfirm: false });
    //             this.req()
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Perikatan</li>
                    <li className="breadcrumb-item active">Outline Agreement</li>
                </ol>
                <h1 className="page-header">Outline Agreement</h1>
                <Panel loading={false}>
                    <PanelHeader>List Outline Agreement</PanelHeader>
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
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
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
        fetchOutlineAgreement: (params) => dispatch(fetchOutlineAgreement(params)),
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

export default connect(stateToProps, dispatchToProps)( withTranslation() (OutlineAgreement));
