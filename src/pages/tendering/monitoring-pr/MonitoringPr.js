import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
// import SweetAlert from 'react-bootstrap-sweetalert';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import withFixedColumns from "react-table-hoc-fixed-columns";
import { Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import {fetchMonitoringPurchasingRequisition , downloadMonitoringPR } from '../../../store/actions/tendering/purchasingRequisitionActions';

import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import { statusName } from '../../../helpers/statusName';
import {formatNumber} from '../../../helpers/formatNumber';
import { formatDate } from '../../../helpers/formatDate';
import { debounce } from '../../../helpers/debounce';
import FilterRangeValue from '../../../components/filterrangevalue/FilterRangeValue';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class MonitoringPr extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            params: {
                number : "",
                pr : "",
                title : "",
                nilai : "",
                currency : "",
                start_tanggal_pengumuman : "",
                end_tanggal_registrasi : "",
                end_tanggal_closing : "",
                status : "",
                uuid : "",
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Draft', value: 'Draft', isChecked: false },
                { name: 'Open Praqualification', value: 'Open Praqualification', isChecked: false },
                { name: 'Active Praqualification', value: 'Active Praqualification', isChecked: false },
                { name: 'Approval Praqualification', value: 'Approval Praqualification', isChecked: false },
                { name: 'Approved Praqualification', value: 'Approved Praqualification', isChecked: false },
                { name: 'Rejected Praqualification', value: 'Rejected Praqualification', isChecked: false },
                { name: 'Approval DUR', value: 'Approval DUR', isChecked: false },
                { name: 'Approved DUR', value: 'Approved DUR', isChecked: false },
                { name: 'Rejected DUR', value: 'Rejected DUR', isChecked: false },
                { name: 'Published', value: 'Published', isChecked: false },
                { name: 'Registration', value: 'Registration', isChecked: false },
                { name: 'Aanwijzing', value: 'Aanwijzing', isChecked: false },
                { name: 'Quotation', value: 'Quotation', isChecked: false },
                { name: 'Penawaran Teknis', value: 'Penawaran Teknis', isChecked: false },
                { name: 'Penawaran Komersil', value: 'Penawaran Komersil', isChecked: false },
                { name: 'Bid Opening', value: 'Bid Opening', isChecked: false },
                { name: 'Evaluasi Admin', value: 'Evaluasi Admin', isChecked: false },
                { name: 'Evaluasi Teknis: Approval Ketua Evaluator', value: 'Evaluasi Teknis: Approval Ketua Evaluator', isChecked: false },
                { name: 'Evaluasi Teknis', value: 'Evaluasi Teknis', isChecked: false },
                { name: 'Evaluasi Komersil', value: 'Evaluasi Komersil', isChecked: false },
                { name: 'Negotiation', value: 'Negotiation', isChecked: false },
                { name: 'Awarding', value: 'Awarding', isChecked: false },
                { name: 'Retender', value: 'Retender', isChecked: false },
                { name: 'Canceled', value: 'Canceled', isChecked: false },
                { name: 'Closed', value: 'Closed', isChecked: false },

            ],
            statusSearchPo: [
                { name: 'Open PO', value: 'Open PO', isChecked: false },
                { name: 'Review', value: 'Review', isChecked: false },
                { name: 'Rejected', value: 'Rejected', isChecked: false },
                { name: 'Approval', value: 'Approval', isChecked: false },
                { name: 'PO Created', value: 'PO Created', isChecked: false },
                { name: 'PO Released', value: 'PO Released', isChecked: false },
                { name: 'PO Confirmed', value: 'PO Confirmed', isChecked: false },
                { name: 'Proposal Cancel PO', value: 'Proposal Cancel PO', isChecked: false },
                { name: 'PO Canceled', value: 'PO Canceled', isChecked: false },
            ],
            statusSearchPr: [
                { name: 'Open', value: 'Open', isChecked: false },
                { name: 'Submitted', value: 'submitted', isChecked: false },
                { name: 'Rejected', value: 'rejected', isChecked: false },
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
            loadingSubmit: false,
            now : localStorage.getItem('times'),
            loadings : {
                downloadExcel : false
            }
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
				Header: () => this.props.t("monitoring_pr:label.number"),
                accessor: "number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: () => this.props.t("monitoring_pr:label.item_no"),
                id : "item_no",
                accessor: "item_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="item_no" onChange={(event) => this.onChanged(event)} value={this.state.params.item_no} />
                ),
                // Cell: ({ value }) => (
                //     <label>{this.setPr(value)}</label>
                // )
            },
            {
				Header: () => this.props.t("monitoring_pr:label.tipe"),
                accessor: "tipe",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="tipe" onChange={(event) => this.onChanged(event)} value={this.state.params.tipe} />
                )
            },
            {
				Header: () => this.props.t("monitoring_pr:label.material_id"),
                accessor: "material_no",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="material_no" onChange={(event) => this.onChanged(event)} value={this.state.params.material_no} />
                ),
                // Cell: ({ value }) => (
                //     <div style={{
                //         textAlign:"right"
                //       }}>{formatNumber(value,2)}</div>
                // )
            },
            {
				Header: () => "Shorttext",
                accessor: "short_text",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="short_text" onChange={(event) => this.onChanged(event)} value={this.state.params.short_text} />
                )
            },
            {
				Header: () => "Qty",
                accessor: "qty",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="qty" onChange={(event) => this.onChanged(event)} value={this.state.params.qty} />
                )
            },
            {
				Header: () => "Valuation Price",
                accessor: "valuation_price",
                // Filter: ({ filter, onChange }) => (
                //     <input className="form-control" name="valuation_price" onChange={(event) => this.onChanged(event)} value={this.state.params.valuation_price} />
                // ),
                Filter: ({ filter, onChange }) => (
                    <FilterRangeValue type="total_value" getDate={this.rangeValue} />
                ),
                Cell: ({ value }) => (
                    <div style={{
                        textAlign:"right"
                      }}>{formatNumber(value,2)}</div>
                )
            },
            {
				Header: () => "Material Group ID",
                accessor: "material_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="material_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.material_group_id} />
                )
            },
            {
				Header: () => "Purchasing Group ID",
                accessor: "purchasing_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_id} />
                )
            },
            {
				Header: () => "Requisitioner",
                accessor: "requisitioner",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="requisitioner" onChange={(event) => this.onChanged(event)} value={this.state.params.requisitioner} />
                )
            },
            {
                Header: () => "Status PR",
                accessor: "status_pr",
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearchPr} getStatus={this.getCheckPr} />
                ),
                // Cell: ({ original }) => (
                //     <label>{this.setStatustender(original)}</label>
                // )
            },
            {
				Header: () => "Kabag",
                id : "kabag",
                accessor: d => d.status_pr !== 'Open' && d.kabag,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="kabag" onChange={(event) => this.onChanged(event)} value={this.state.params.kabag} />
                )
            },
            {
                Header: () => "Assign At",
                id : "assign_at",
                accessor: d => d.status_pr !== 'Open' && formatDate(d.assign_at,2),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="assign_at" getDate={this.assign_at} />
                )
            },
            {
				Header: () => "Buyer",
                id : "buyer",
                accessor: d => d.status_pr !== 'Open' && d.buyer,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="buyer" onChange={(event) => this.onChanged(event)} value={this.state.params.buyer} />
                )
            },
            {
				Header: () => "Source Determination",
                id : "source",
                accessor: d => d.status_pr !== 'Open' && d.source,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="source" onChange={(event) => this.onChanged(event)} value={this.state.params.source} />
                )
            },
            {
				Header: () => "Outline Agreement",
                id : "outline_agreement",
                accessor: d => d.status_pr !== 'Open' && d.outline_agreement,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="outline_agreement" onChange={(event) => this.onChanged(event)} value={this.state.params.outline_agreement} />
                )
            },
            {
				Header: () => "Proposal Tender Number",
                id : "tender_number",
                accessor: d => d.status_pr !== 'Open' && d.tender_number,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="tender_number" onChange={(event) => this.onChanged(event)} value={this.state.params.tender_number} />
                )
            },
            {
				Header: () => "Retender",
                id : "is_retender",
                accessor: d => d.is_retender,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="is_retender" placeholder='only x' onChange={(event) => this.onChanged(event)} value={this.state.params.is_retender} />
                ),
                Cell: ({ value }) => (
                    <div style={value==='x' ? {
                        textAlign:"center",
                        fontWeight :'bold',
                        color : "red",
                      }: {textAlign:"center",
                      fontWeight :'bold',
                      color : "black",}}>{value==='x' ? value.toUpperCase() : ''}
                    </div>
                )
            },
            {
                Header: () => "Created At",
                id : "created_at",
                accessor: d => d.status_pr !== 'Open' && formatDate(d.created_at,2),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
                Header: () => "Status Tender",
                id : "status_tender",
                accessor: d => d.status_pr !== 'Open' && d.status_tender,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                // Cell: ({ original }) => (
                //     <label>{this.setStatustender(original)}</label>
                // )
            },
            {
				Header: () => "PO Number",
                id : "po_eproc_number",
                accessor: d => d.status_pr !== 'Open' && d.po_eproc_number,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_eproc_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_eproc_number} />
                )
            },
            {
				Header: () => "PO SAP Number",
                id : "po_sap_number",
                accessor: d => d.status_pr !== 'Open' && d.po_sap_number,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="po_sap_number" onChange={(event) => this.onChanged(event)} value={this.state.params.po_sap_number} />
                )
            },
            {
                Header: () => "Status PO",
                id : "status_po",
                accessor: d => d.status_pr !== 'Open' && d.status_po,
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearchPo} getStatus={this.getCheckPo} />
                ),
                // Cell: ({ original }) => (
                //     <label>{this.setStatustender(original)}</label>
                // )
            },
            // {
            //     Header: () => this.props.t("monitoring_pr:label.tanggal_pengumuman"),
            //     id : "start_tanggal_pengumuman",
            //     accessor: d => formatDate(d.start_tanggal_pengumuman),
            //     Filter: ({ filter, onChange }) => (
            //         <FilterDate type="created_at" getDate={this.tanggal_pengumuman} />
            //     )

                
            // },
            
            // {
            //     Header: "Action",
            //     filterable: false,
            //     headerClassName: "sticky",
            //     id:"actions",
            //     fixed: "right",
            //     sortable: false,
            //     Cell: d => (
            //         <React.Fragment>
            //             <center>
            //                 {(d.original.status === 'Draft') && <button className="btn btn-xs btn-warning" onClick={(e) => this.toEdit(e,d.original.uuid)}>Edit</button>}
            //                 <button className="btn btn-xs btn-primary" onClick={(e) => this.detail(e,d.original.uuid)}>{this.props.t("monitoring_pr:button.view")}</button>
            //             </center>
            //         </React.Fragment>
            //     )
            // },
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

    debounced = debounce(text => this.req(text));

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchMonitoringPurchasingRequisition(this.state.params)
            .then((resp) => {
                // console.log(resp.data.data)
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
                })
            })
            .catch((resp) => {
                // console.log(resp)
                // this.setState({ loading: false })
                // let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                // toastr.error('Oops', message);
            });
    }

    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        someProperty.start = 0
        this.setState({
            params: someProperty,
            page: 0
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

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
    }


    // created_at = (date = '') => {
    //     let filters = { ...this.state.params }
    //     filters.start = 0;
    //     filters.page = 0;
    //     if (date !== '') {
    //         filters.created_at = date;
    //     } else {
    //         filters.created_at = '';
    //     }
    //     this.setState({ params: filters }, () => {
    //         this.asyncData()
    //     })
    // }

    // updated_at = (date = '') => {
    //     let filters = { ...this.state.params }
    //     filters.start = 0;
    //     filters.page = 0;
    //     if (date !== '') {
    //         filters.updated_at = date;
    //     } else {
    //         filters.updated_at = '';
    //     }
    //     this.setState({ params: filters }, () => {
    //         this.asyncData()
    //     })
    // }

    dayWarning = (resp) => {
        let sekarangTemp = new Date(localStorage.getItem('times'));
        let sekarang = new Date(`${sekarangTemp.getFullYear()}-${sekarangTemp.getMonth()+1}-${sekarangTemp.getDate()} 07:00:00`)
        let closing = new Date(resp.end_tanggal_closing);
        if (resp.status_dur === 'y'){
            if (closing < sekarang){
                return false
            }else{
                const diffTime = Math.abs(closing - sekarang);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(sekarang)
                console.log(closing)
                if (diffDays === 1 || diffDays === 0){
                    if (resp.metode_penyampaian_id === '2t'){
                        if (resp.bid_administrasi !== 'y'){
                            return true
                        }else {
                            if (resp.bid_comercil !== 'y'){
                                return true
                            }else {
                                return false
                            }
                        }
                    }else{
                        if (resp.bid_administrasi !== 'y'){
                            return true
                        }else{
                            return false
                        }
                    }
                }else{
                    return false
                }
            }
        }else{
            return false
        }
    }
    
    assign_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_assign_at = date;
        } else {
            filters.start_assign_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    created_at = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_created_at = date;
        } else {
            filters.start_created_at = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    closing_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.end_tanggal_closing = date;
        } else {
            filters.end_tanggal_closing = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tanggal_registrasi = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.end_tanggal_registrasi = date;
        } else {
            filters.end_tanggal_registrasi = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_tender = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status_tender = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }
    getCheckPo = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_po = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status_po = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }
    getCheckPr = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_pr = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status_pr = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }
    rangeValue = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.valuation_price = date;
        } else {
            filters.valuation_price = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }
    toEdit = (e, uuid) => {
        e.preventDefault()
        this.props.history.push(`/tendering/pra-proposal-tender/edit/${uuid}`)
    }

    detail(e, uuid) {
        this.props.history.push('/tendering/monitoring-tender-buyer/detail/' + uuid)
    }

    setPr(data){
        // console.log(data)
        let temp_result = []
        data.forEach((dt) => {
            // console.log(dt)
            if(!temp_result.includes(dt)){
                temp_result.push(dt)
            }
        })

        return temp_result.join("; ")
        
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}

    downloadBapp() {
        // if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, downloadExcel: true }
            }));
            this.props.downloadMonitoringPR(this.state.params)
            .then((resp) => {
                console.log('download')
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Download Monitoring PR.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            })
            .catch((resp) => {
                console.log('gagal download')
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            });
        // }
    }


    render() {
        // const { t } = this.props;
        return (
            <div>
                {console.log(this.state.now)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Monitoring Purchasing Requisition</li>
                </ol>
                <h1 className="page-header">Monitoring Purchasing Requisition  <small>Monitoring Purchasing Requisition</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Monitoring Purchasing Requisition
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <div className="row m-b-10">
                            <div className=" col-sm-12">
                                <button className="pull-right btn btn-sm btn-success" disabled={this.state.loadings.downloadExcel} onClick={ () => this.downloadBapp()}> {this.state.loadings.downloadExcel && <i className="fa fa-spinner fa-spin"></i>  } Download</button>
                            </div>
                        </div>
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
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    pages={this.state.pages}
                                    page={this.state.page}
                                    onFetchData={(state, instance) => {
                                        this.debounced(state);
                                    }}
                                />
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
        access: state.sidebarDt.access
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchMonitoringPurchasingRequisition: (params) => dispatch(fetchMonitoringPurchasingRequisition(params)),
        downloadMonitoringPR : (params) => dispatch(downloadMonitoringPR(params))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(MonitoringPr));
