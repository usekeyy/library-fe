import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchGRSA, syncGRSA
    // updateAssets , saveAssets , deleteAssets , showAssets, syncAssets
} from '../../../store/actions/invoice/grsaActions';
// import { fetchCompanies } from '../../../store/actions/master/companyActions';

import ModalSync from'./sub/ModalSync';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';


class SA extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                id: '',
                status: '',
                number: '',
                po_eproc_number: '',
                po_sap_number: '',
                vendor_name: '',
                sap_created_by: '',
                sap_craeted_at: '',
                doc_date: '',
                post_date: '',
                trans_type: '9',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            param_sync: {
                date_from: '',
                date_to: '',
                // sap_created_by: '',
                trans_type: '9',
                // year: '',
                // number: '',
                // movement_type: '',
                // posting_date: '',
                // doc_date: '',
                // po_sap_number: '',
            },
            // statusSearch: [
            //     { name: 'Active', value: 'y', isChecked: false },
            //     { name: 'Inactive ', value: 'n', isChecked: false },
            // ],
            defaultPageSize: 10,
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
                Header: "No. Entry Sheet",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "No. PO Eproc",
                accessor: "po_eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_eproc_number} />
                )
            },
            {
                Header: "No. PO SAP",
                accessor: "po_sap_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
                )
            },
            {
                Header: "Short Text",
                accessor: "short_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="short_text" onChange={(event) => this.onChanged(event)} value={this.state.params.short_text} />
                )
            },
            {
                Header: () => this.props.t("assets:label.created_by"),
                accessor: "sap_created_by",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_created_by" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_created_by} />
                )
            },
            {
                Header: () => this.props.t("assets:label.created_at"),
                id: "sap_created_at",
                accessor: d => formatDate(d.sap_created_at, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="sap_created_at" getDate={this.sap_created_at} />
                )
            },
            {
                Header: "Document Date",
                id: "doc_date",
                accessor: d => formatDate(d.doc_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="doc_date" getDate={this.doc_date} />
                )
            },
            {
                Header: "Posting Date",
                id: "post_date",
                accessor: d => formatDate(d.post_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="post_date" getDate={this.post_date} />
                )
            },
            {
                Header: () => this.props.t("assets:label.action"),
                filterable: false,
                sortable: false,
                accessor: "uuid",
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {/* {this.props.access.U &&
                            } */}
                            <button className="btn btn-xs btn-white" value={value} onClick={(e) => this.edits(e, value)} >Process</button>
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
        this.props.fetchGRSA(this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length)
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

    edits(e, value) {
        this.props.history.push('/invoice/service-acceptance/detail/' + value)
    }

	toggleFormSync = (e, value) => {
		if(this._isMounted){
			e.preventDefault();

            let curr = new Date();
            curr.setDate(curr.getDate());
            curr = this.formattingDate(curr)

            let param_sync = this.state.param_sync
            param_sync.date_from = curr
            param_sync.date_to = curr

            // const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState({ toggleSync: true, uuid: value, param_sync: param_sync })
		}
	}

    formattingDate = (e) => {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    toggleFormOpen = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ modalOpen: true, uuid: uuid })
    }

    toggleFormClose = () => {
        this.setState({ modalOpen: false, toggleSync: false, isError: false, errors: {}, loadingSubmit: false })
    }

	handleSync = (val) => {
        // console.log(val)
        let param_sync = this.state.param_sync
        param_sync.sap_created_by = val.sap_created_by
        param_sync.po_sap_number = val.po_sap_number
        // console.log(param_sync)

        let curr = new Date();
        curr.setDate(curr.getDate());
        curr = this.formattingDate(curr)

        // return
		if(this._isMounted){
			this.setState({loading: true})
			this.props.syncGRSA(param_sync)
			.then(res => {
                
                param_sync = {
                    date_from: curr,
                    date_to: curr
                }
                
				const response = res.data;
				toastr.success(response.message);
				this.setState({loading: false, errors: []}, () => {
                    this.setState({ param_sync: param_sync })
                    this.toggleFormClose()
					this.asyncData()
				});
                console.log(res)
			})
			.catch(error => {
                param_sync = {
                    date_from: curr,
                    date_to: curr
                }
                
                if(typeof error !== 'undefined'){
                    toastr.error(error.data.message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading: false, param_sync: param_sync })
				} else {
                    this._isMounted && this.setState({loading: false, param_sync: param_sync })
					toastr.error("Gagal Sinkron Data");
				}
                console.log(error)
			})
		}
	}

    savePayload = (payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.saveAssets(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                })
                .catch(error => {
                    if (typeof error !== 'undefined') {
                        toastr.error(error.data.message);
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
            this.props.updateAssets(id, payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch((error) => {
                    this.setState({ loadingSubmit: false });
                    console.log(error)
                })
        }
    }

    deletePayload = (type) => {
        this.props.deleteAssets(type)
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

    sap_created_ay = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.sap_created_ay = date;
        } else {
            filters.sap_created_ay = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    doc_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.doc_date = date;
        } else {
            filters.doc_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    post_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.post_date = date;
        } else {
            filters.post_date = '';
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

    onResetFilter = (val) => {
        val.trans_type = '9'
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    setOption = async (payload, type) => {
        let param_sync = this.state.param_sync
        switch(type) {
            case 'start-date':
                param_sync.date_from = payload;
                break;
            case 'end-date':
                param_sync.date_to = payload;
                break;
            // case 'created-by':
            //     param_sync.sap_created_by = payload;
            //     break;
            // case 'po-number':
            //     param_sync.po_sap_number = payload;
            //     break;
            default:
                break;
        }
        this.setState({ param_input: param_sync })
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">Service Acceptance</li>
                </ol>
                <h1 className="page-header">Service Acceptance</h1>
                <Panel loading={false}>
                    <PanelHeader>List Service Acceptance</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                                <div className="m-b-10">
									<Button color="success" size="sm" value="" onClick={(e) => this.toggleFormSync(e, '')} >Sync SA SAP</Button>
                                    <span> </span>
                                    <label style={{paddingLeft: '5px'}}>Last Updated on 12/08/2020 13:07:13</label>
								</div>
                            </Col>
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
				{this.state.toggleSync && 
                    <ModalSync 
                        loading={this.state.loading}
                        errors={this.state.errors}
                        param_sync={this.state.param_sync}
                        setOption={this.setOption}
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
        fetchGRSA: (params) => dispatch(fetchGRSA(params)),
        syncGRSA: (params) => dispatch(syncGRSA(params)),
        // showAssets: (id) => dispatch(showAssets(id)),
        // deleteAssets: (id) => dispatch(deleteAssets(id)),
        // saveAssets: (id, payload) => dispatch(saveAssets(id, payload)),
        // updateAssets: (id, payload) => dispatch(updateAssets(id, payload)),      
        // fetchCompanies: (params) => dispatch(fetchCompanies(params)),
        // syncAssets: (payload) => dispatch(syncAssets(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(SA));
