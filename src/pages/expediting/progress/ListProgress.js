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
// import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchProgress, showProgress } from '../../../store/actions/expediting/progressActions'
import SweetAlert from 'react-bootstrap-sweetalert';
// import { formatNumber } from '../../../helpers/formatNumber';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';
import ModalForm from'./sub/Modal';
import moment from 'moment';

class ListProgress extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                number: '',
                progress_date: '',
                description: '',
                vendor_id: '',
                vendor_name: '',
                po_eproc_number: '',
                po_sap_number: '',
                po_date: '',
                delivery_date: '',
                kategori:'',
                status_text:'',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            // statusSearch: [
            //     { name: 'Open PO', value: 'd', isChecked: false },
            //     { name: 'Review', value: 'o', isChecked: false },
            //     { name: 'Rejected', value: 'r', isChecked: false },
            //     { name: 'Approval', value: 'p', isChecked: false },
            //     { name: 'PO Created', value: 'c', isChecked: false },
            //     { name: 'PO Released', value: 's', isChecked: false },
            //     { name: 'PO Confirmed', value: 'y', isChecked: false },
            //     { name: 'Proposal Cancel PO', value: 'a', isChecked: false },
            //     { name: 'PO Canceled', value: 'n', isChecked: false },
            // ],
            total: 0,
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalType: '',
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
        this.columns = this.props.user.has_roles.includes("VNDR01") ? 
        [
            {
                Header: "No. Expediting",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "Tanggal Expediting",
                id: "progress_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.progress_date} />
                ),
                Cell: ({ value }) => (
                    value.progress_date !== null && value.progress_date !== '' && 
                    <label>{moment(value.progress_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Keterangan",
                accessor: "description",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="description" onChange={(event) => this.onChanged(event)} value={this.state.params.description} />
                )
            },
            {
                Header: "No. PO Eproc",
                accessor: "po_eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_eproc_number} />
                ),
            },
            {
                Header: "No. PO SAP",
                accessor: "po_sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
                )
            },
            {
                Header: "PO Date",
                id: "po_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.po_date} />
                ),
                Cell: ({ value }) => (
                    value.po_date !== null && value.po_date !== '' && 
                    <label>{moment(value.po_date).format("DD-MM-YYYY")}</label>
                )
            },
            // {
            //     Header: "Delivery Date",
            //     id: "delivery_date",
            //     accessor: d => d,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterDate type="created_at" getDate={this.delivery_date} />
            //     ),
            //     Cell: ({ value }) => (
            //         value.delivery_date !== null && value.delivery_date !== '' && 
            //         <label>{moment(value.delivery_date).format("DD-MM-YYYY")}</label>
            //     )
            // },
            {
                Header: "Kategori",
                accessor: "kategori",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="kategori" onChange={(event) => this.onChanged(event)} value={this.state.params.kategori} />
                ),
            },

            {
                Header: "Realisasi (%)",
                accessor: "realitation",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="realitation" onChange={(event) => this.onChanged(event)} value={this.state.params.realitation} />
                ),
            },
            // {
            //     Header: "Status",
            //     id: "status_text",
            //     accessor: d => d.status_text,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
            //     ),
            // },
            {
				Header: () => this.props.t("templateReminder:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            <button className="btn btn-xs btn-white" value={value} onClick={(e) => this.toggleFormOpen(e, value, 'detail')} >detail</button>
                        </center>
                    </React.Fragment>
                )
            },
        ] : 
        [
            {
                Header: "No. Expediting",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "Tanggal Expediting",
                id: "progress_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.progress_date} />
                ),
                Cell: ({ value }) => (
                    value.progress_date !== null && value.progress_date !== '' && 
                    <label>{moment(value.progress_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Keterangan",
                accessor: "description",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="description" onChange={(event) => this.onChanged(event)} value={this.state.params.description} />
                )
            },
            {
                Header: "No. PO Eproc",
                accessor: "po_eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_eproc_number} />
                ),
            },
            {
                Header: "No. PO SAP",
                accessor: "po_sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
                )
            },
            {
                Header: "Vendor",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                ),
            },
            {
                Header: "PO Date",
                id: "po_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.po_date} />
                ),
                Cell: ({ value }) => (
                    value.po_date !== null && value.po_date !== '' && 
                    <label>{moment(value.po_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Delivery Date",
                id: "delivery_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.delivery_date} />
                ),
                Cell: ({ value }) => (
                    value.delivery_date !== null && value.delivery_date !== '' && 
                    <label>{moment(value.delivery_date).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Kategori",
                accessor: "kategori",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="kategori" onChange={(event) => this.onChanged(event)} value={this.state.params.kategori} />
                ),
            },
            {
                Header: "Realisasi (%)",
                accessor: "realitation",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="realitation" onChange={(event) => this.onChanged(event)} value={this.state.params.realitation} />
                ),
            },
            // {
            //     Header: "Status",
            //     id: "status_text",
            //     accessor: d => d.status_text,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
            //     ),
            // },
            {
				Header: () => this.props.t("templateReminder:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            <button className="btn btn-xs btn-white" value={value} onClick={(e) => this.toggleFormOpen(e, value, 'detail')} >detail</button>
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    debounced = debounce(text => this.fetchData());

    componentDidMount() {
        this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    fetchData = async (params) => {
        this.setState({ loading: true })
        this.props.fetchProgress(params)
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
        }, () => {
            this.debounced(someProperty);
        });
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
            this.fetchData(filters)
        })
    }

    progress_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.progress_date = date;
        } else {
            filters.progress_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    po_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.po_date = date;
        } else {
            filters.po_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    release_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.release_date = date;
        } else {
            filters.release_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
        })
    }

    delivery_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.delivery_date = date;
        } else {
            filters.delivery_date = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
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
            this.fetchData(filters)
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }

    toggleFormOpen = (e, value, type) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid, modalType: type })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, modalType: '', toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }

	onResetFilter = (val) => {
        val.status = 'y'
		this.setState({
            params: val
        }, () => this.fetchData(val));    
	}

	changeSorted = (val) => {
		if(this._isMounted){
			let optDt = {...this.state.params}
			optDt.column = val[0].id;
			optDt.dir = (val[0].desc ? 'desc' : 'asc');
			this.setState({params: optDt}, () => this.fetchData(optDt));
		}
	}

	changePage = (perPage) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			let numb = 0;
			numb = perPage;
			if(numb > 0){
				numb = perPage * this.state.params.length;
			}
			optDt.start = numb;
			optDt.page = perPage;
			// optDt.length = state;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
		}
	}
	
	changePageSize = (length) => {
		if(this._isMounted){
			let lengthPage = Math.ceil(parseInt(this.state.data.recordsFiltered) / this.state.params.length);
			let optDt = {...this.state.params}
			optDt.start = 0;
			optDt.page = 0;
			optDt.length = length;
			this.setState({total: lengthPage, params: optDt}, () => this.fetchData(optDt));
			console.log(this.state.params.start);
		}
	}

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Expediting</li>
                    <li className="breadcrumb-item active">List Progress Barang & Jasa</li>
                </ol>
                <h1 className="page-header">List Progress Barang & Jasa</h1>
                <Panel loading={false}>
                    <PanelHeader>List Progress Barang & Jasa</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
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
                                    onSortedChange={val => {this.changeSorted(val) }}
                                    onPageSizeChange={(length) => {this.changePageSize(length)}}
                                    onPageChange={(perPage) => {this.changePage(perPage)}}
                                    options={this.state.params}
                                    className="-highlight"
                                    pages={this.state.pages}
                                />
                            </Col>
                        </Row>

                    </PanelBody>

                </Panel>
                {this.state.modalOpen &&
                    <ModalForm
                        toggleAdd={this.state.modalOpen}
                        modalType={this.state.modalType}
                        uuid={this.state.uuid}
                        showProgress={this.props.showProgress}
                        save={this.savePayload}
                        update={this.updatePayload}
                        isError={this.state.isError}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        toggleClose={this.toggleFormClose}
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
		access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchProgress: (params) => dispatch(fetchProgress(params)),
        showProgress: (id) => dispatch(showProgress(id)),
        // fetchVillages: (params) => dispatch(fetchVillages(params)),
        // fetchDistricts: (params) => dispatch(fetchDistricts(params)),
        // showVillages: (id) => dispatch(showVillages(id)),
        // saveVillages: (id, payload) => dispatch(saveVillages(id, payload)),
        // updateVillages: (id, payload) => dispatch(updateVillages(id, payload)),
        // fetchRegions: (params) => dispatch(fetchRegions(params)),
        // fetchCountries: (params) => dispatch(fetchCountries(params)),
        // fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ListProgress));
