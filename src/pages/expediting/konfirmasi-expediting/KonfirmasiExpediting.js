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
// import ModalForm from'./sub/Modal';
import { fetchExpediting } from '../../../store/actions/expediting/ExpeditingActions'
import SweetAlert from 'react-bootstrap-sweetalert';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { fileUpload } from '../../../store/actions/uploadActions';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
// import { statusName } from '../../../helpers/statusName';
import {debounce} from '../../../helpers/debounce';
import moment from 'moment';

class KonfirmasiExpediting extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            param_modal: [],
            params: {
                id: '',
                eproc_number: '',
                sap_number: '',
                status: '',
                created_at: '',
                created_by_name: '',
                confirmation_forum: 'y',
                updated_at: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            // statusSearch: [
            //     { name: 'Unread', value: 'unread', isChecked: false },
            //     { name: 'Read', value: 'read', isChecked: false },
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
            statusUpdate:false,
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
                Header: "Header Text",
                accessor: "header_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="header_text" onChange={(event) => this.onChanged(event)} value={this.state.params.header_text} />
                )
            },
            {
                Header: "Created At",
                id: "created_at",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                ),
                Cell: ({ value }) => (
                    value.created_at !== null && value.created_at !== '' && 
                    <label>{moment(value.created_at).format("DD-MM-YYYY")}</label>
                )
            },
            {
                Header: "Created By",
                accessor: "created_by_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="created_by_name" onChange={(event) => this.onChanged(event)} value={this.state.params.created_by_name} />
                )
            },
            // {
            //     Header: "Status",
            //     id: "status_read",
            //     accessor: d => d.status_read,
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
            filters.status_read = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.status_read = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }
    
    edits(e, value) {
        this.props.history.push('/expediting/purchase-order-open/detail/' + value)
    }

	onResetFilter = (val) => {
        val.confirmation_forum = 'y'
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
                    <li className="breadcrumb-item active">Komunikasi Expediting</li>
                </ol>
                <h1 className="page-header">Komunikasi Expediting</h1>
                <Panel loading={false}>
                    <PanelHeader>List PO Komunikasi Expediting</PanelHeader>
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
                        fileUpload={this.props.fileUpload}
                        toggleAdd={this.state.modalOpen}
                        modalType={this.state.modalType}
                        showKonfirmasi={this.props.showKonfirmasi}
                        updateKonfirmasi={this.props.updateKonfirmasi}
                        uuid={this.state.uuid}
                        loadingSubmit={this.state.loadingSubmit}
                        save={this.saveKonfirmasi}
                        statusUpdate={this.state.statusUpdate}
                        setStatusUpdate={this.setStatusUpdate}
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
        // showKonfirmasi: (id) => dispatch(showKonfirmasi(id)),
		// saveKonfirmasi: (payload) => dispatch(saveKonfirmasi(payload)),
        // updateKonfirmasi: (id, payload) => dispatch(updateKonfirmasi(id, payload)),
        // fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        // fetchVillages: (params) => dispatch(fetchVillages(params)),
        // fetchDistricts: (params) => dispatch(fetchDistricts(params)),
        // deleteVillages: (id) => dispatch(deleteVillages(id)),
        // saveVillages: (id, payload) => dispatch(saveVillages(id, payload)),
        // fetchRegions: (params) => dispatch(fetchRegions(params)),
        // fetchCountries: (params) => dispatch(fetchCountries(params)),
        // fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
    }
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (KonfirmasiExpediting));
