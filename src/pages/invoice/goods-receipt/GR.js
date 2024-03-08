import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import {  Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchGRSA, syncGRSA, fetchReportGRSA
        // updateAssets , saveAssets , deleteAssets , showAssets, syncAssets
    } from '../../../store/actions/invoice/grsaActions';
// import { fetchCompanies } from '../../../store/actions/master/companyActions';

import ModalSync from'./sub/ModalSync';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
// import { statusName } from '../../../helpers/statusName';
import { formatDate } from '../../../helpers/formatDate';
import {debounce} from '../../../helpers/debounce';

class GR extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            isReport: this.props.location.pathname.split("/")[2] === 'report' ? true : false,
            isVendor : this.props.user.has_roles.includes('VNDR01'),
            data: [],
            params: {
                id: '',
                status: '',
                number: '',
                year: '',
                po_eproc_number: '',
                po_sap_number: '',
                vendor_id: '',
                vendor_name: '',
                sap_created_by: '',
                sap_created_at: '',
                doc_date: '',
                post_date: '',
                trans_type: '',
                start: 0,
                length: 10,
                column: '',
                dir: ''
            },
            param_sync: {
                date_from: '',
                date_to: '',
                // sap_created_by: '',
                // trans_type: '',
                // year: '',
                // number: '',
                // movement_type: '',
                // posting_date: '',
                // doc_date: '',
                // po_sap_number: '',
            },
            statusSearch: [
                { name: 'Barang', value: '1', isChecked: false },
                { name: 'Jasa', value: '9', isChecked: false },
            ],
            statusSearch2: [
                { name: 'Open', value: 'd', isChecked: false },
                { name: 'Submit', value: 'p', isChecked: false },
            ],
            total: 0,
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
				Header:'No',
				id: "id",
				accessor: d => d.id,
				filterable : false,
				sortable : false,
                width : 70,
				Cell: ({index}) => (
					
					<React.Fragment>
						{/* {console.log(index)} */}
                        {index + 1 + this.state.params.start}
					</React.Fragment>
				)
            },
            {
                Header: "Category",
                id: "trans_type",
                accessor: d => d.trans_type,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell: ({ value }) => (
                    <label>{value === '1' ? "Barang" : value === '9' ? 'Jasa' : ''}</label>
                )
            },
            {
                Header: "No. GR/Entry Sheet",
                accessor: "number",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: "Fiscal Year",
                accessor: "year",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="year" onChange={(event) => this.onChanged(event)} value={this.state.params.year} />
                )
            },
            {
                Header: "No. PO Eproc",
                accessor: "eproc_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.eproc_number} />
                )
            },
            {
                Header: "No. PO SAP",
                accessor: "po_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_number} />
                )
            },
            {
                Header: "Vendor Code",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
                ),
                Cell: ({ original }) => (
                    <React.Fragment>
                        {original.vendor_id && original.vendor_id.split("; ").join(', ')}
                    </React.Fragment>
                )
            },
            {
                Header: "Vendor Name",
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                ),
                Cell: ({ original }) => (
                    <React.Fragment>
                        {original.vendor_name && original.vendor_name.split("; ").join(', ')}
                    </React.Fragment>
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
                Header: "Status",
                id: "status",
                accessor: d => d.status,
                show : this.state.isReport,
                filterable : !this.state.isVendor,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch2} getStatus={this.getStatus} />
                ),
                Cell: ({ value }) => (
                    <label>{value === 'p' ? "Submit" : value === 'd' ? 'Open' : ''}</label>
                )
            },
            {
                Header: () => this.props.t("assets:label.action"),
                filterable: false,
                id: "action",
                sortable: false,
                accessor: d => d,
                Cell: ({ value }) => (
                    <React.Fragment>
                        <center>
                            {this.state.isReport ?
                            <button className="btn btn-xs btn-white" value={value.uuid}
                            onClick={(e) => this.edits(e, value.uuid, value.trans_type === '1' ? '/invoice/report/goods-receipt/detail' : value.trans_type === '9' ? '/invoice/report/service-acceptance/detail' : '')} >
                                Detail
                            </button> 
                            :  
                            <button className="btn btn-xs btn-white" value={value.uuid}
                            onClick={(e) => this.edits(e, value.uuid, value.trans_type === '1' ? '/invoice/goods-receipt/detail' : value.trans_type === '9' ? '/invoice/service-acceptance/detail' : '')} >
                                Process
                            </button>
                            }
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

    fetchData = async (params = this.state.params) => {
        this.setState({ loading: true })
        if (!this.state.isReport){
            this.props.fetchGRSA(params)
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
        }else{
            this.props.fetchReportGRSA(this.state.params)
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
    }

    toggleFetchEproc = (e) => {
		if(this._isMounted){
            this.props.history.push('goods-receipt/detail-eproc')
		}
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

    edits(e, value, url) {
        // this.props.history.push({
        //     pathname: '/invoice/goods-receipt/detail/' + value,
        //     state: { status_detail: true }
        // })
        this.props.history.push(url + '/' + value)
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
        let param_sync = this.state.param_sync
        param_sync.sap_created_by = val.sap_created_by
        param_sync.po_sap_number = val.po_sap_number
        // console.log(param_sync)
        
        let curr = new Date();
        curr.setDate(curr.getDate());
        curr = this.formattingDate(curr)
        
        // return
        // console.log(param_sync)
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
					this.fetchData()
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

    sap_created_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.sap_created_at = date;
        } else {
            filters.sap_created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.fetchData(filters)
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
            this.fetchData(filters)
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
            this.fetchData(filters)
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.trans_type = check.join(";");
            this.setState({ params: filters }, () => this.fetchData(filters))
        } else {
            filters.trans_type = [];
            this.setState({ params: filters }, () => this.fetchData(filters))
        }
    }

    getStatus = (check) => {
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

    onResetFilter = (val) => {
        // val.trans_type = '1'
		this.setState({
            params: val,
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
        this.setState({ param_sync: param_sync })
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Invoice</li>
                    <li className="breadcrumb-item active">{this.state.isReport ? "Report GR/SA SAP" : "Goods Receipt / Service Acceptance"}</li>
                </ol>
                <h1 className="page-header">{this.state.isReport ? "Report GR/SA SAP" : "Goods Receipt / Service Acceptance"}</h1>
                <Panel loading={false}>
                    <PanelHeader>List {this.state.isReport ? "Report GR/SA SAP" : "GR/SA"}</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                                {/* {!this.state.isReport &&
                                    <div className="pull-left m-b-10 m-r-3">
                                        <button className="btn btn-success" onClick={(e) => this.toggleFormSync(e, '')} >Sync GR/SA ERP</button>
                                    </div>
                                } */}
                                <span> </span>
                                {!this.state.isReport &&
                                    <div className="pull-left m-b-10 m-r-3">
                                        <button className="btn btn-success" onClick={(e) => this.toggleFetchEproc(e)} >Create GR/SA Manual</button>
                                    </div>
                                }
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
        access: state.sidebarDt.access,
        user : state.auth.user.data
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchGRSA: (params) => dispatch(fetchGRSA(params)),
        fetchReportGRSA: (params) => dispatch(fetchReportGRSA(params)),
        syncGRSA: (params) => dispatch(syncGRSA(params)),
        // showAssets: (id) => dispatch(showAssets(id)),
        // deleteAssets: (id) => dispatch(deleteAssets(id)),
        // saveAssets: (id, payload) => dispatch(saveAssets(id, payload)),
        // updateAssets: (id, payload) => dispatch(updateAssets(id, payload)),      
        // fetchCompanies: (params) => dispatch(fetchCompanies(params)),
        // syncAssets: (payload) => dispatch(syncAssets(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(GR));
