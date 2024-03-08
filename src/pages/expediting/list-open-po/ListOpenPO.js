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
import { fetchExpediting  } from '../../../store/actions/expediting/ExpeditingActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import { formatNumber } from '../../../helpers/formatNumber';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';
import moment from 'moment';

class ListOpenPO extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                eproc_number: '',
                sap_number: '',
                proposal_tender_number: '',
                proposal_tender_title:'',
                header_text: '',
                purc_group_id:'',
                purc_org_id: '',
                po_date: '',
                tipe: '',
                total_nilai:'',
                release_date: '',
                delivery_date: '',
                jenis_item:'',
                status_progress: '',
                status: '',
                status_text:'',
                read_by_vendor: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'open', value: 'open', isChecked: false },
                { name: 'outstanding', value: 'outstanding', isChecked: false },
            ],
            total: 0,
            defaultPageSize: 10,
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
                Header: "No. PO SAP",
                accessor: "sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_number} />
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
                Header: "Header Text",
                accessor: "header_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="header_text" onChange={(event) => this.onChanged(event)} value={this.state.params.header_text} />
                ),
            },
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
                Header: "Currency",
                accessor: "currency",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
                ),
            },
            {
                Header: "Kategori",
                accessor: "jenis_item",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="jenis_item" onChange={(event) => this.onChanged(event)} value={this.state.params.jenis_item} />
                ),
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
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
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
                Header: "Action",
                filterable: false,
                // width: 180,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Detail</button>
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
        this.props.fetchExpediting(params)
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
            filters.status_progress = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.status = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
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
        this.props.history.push('/expediting/purchase-order-open/detail/' + value)
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
                    <li className="breadcrumb-item active">Purchase Order</li>
                </ol>
                <h1 className="page-header">Purchase Order Expediting</h1>
                <Panel loading={false}>
                    <PanelHeader>List Purchase Order Expediting</PanelHeader>
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
        fetchExpediting: (params) => dispatch(fetchExpediting(params)),
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

export default connect(stateToProps, dispatchToProps)( withTranslation() (ListOpenPO));
