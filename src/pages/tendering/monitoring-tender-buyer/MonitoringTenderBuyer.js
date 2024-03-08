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

import {fetchMonitoringTenderBuyer, downloadMonitoringTenderBuyer} from '../../../store/actions/tendering/monitoringTenderBuyerActions';

import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
// import { statusName } from '../../../helpers/statusName';
import {formatNumber} from '../../../helpers/formatNumber';
import { formatDate } from '../../../helpers/formatDate';
import FilterRangeValue from '../../../components/filterrangevalue/FilterRangeValue';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class MonitoringTenderBuyer extends Component {
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
                purchasing_group_id:'',
                posisition_user_by: '',
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
                { name: 'Pengajuan Retender', value: 'Pengajuan Retender', isChecked: false },
                { name: 'Pengajuan Batal Tender', value: 'Pengajuan Batal Tender', isChecked: false },

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
				Header: () => this.props.t("monitoring_tender:label.no_proposal_tender"),
                accessor: "number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="number" onChange={(event) => this.onChanged(event)} value={this.state.params.number} />
                )
            },
            {
                Header: () => this.props.t("monitoring_tender:label.no_pr"),
                id : "pr",
                // accessor: d => d.pr.join("; "),
                accessor: "pr",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="pr" onChange={(event) => this.onChanged(event)} value={this.state.params.pr} />
                ),
                Cell: ({ value }) => (
                    <label>{this.setPr(value)}</label>
                )
            },
            {
				Header: () => this.props.t("monitoring_tender:label.title"),
                accessor: "title",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
            },
            {
				Header: () => this.props.t("monitoring_tender:label.nilai"),
                accessor: "nilai",
                // Filter: ({ filter, onChange }) => (
                //     <input className="form-control" name="nilai" onChange={(event) => this.onChanged(event)} value={this.state.params.nilai} />
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
				Header: () => "Curr",
                accessor: "currency",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="currency" onChange={(event) => this.onChanged(event)} value={this.state.params.currency} />
                )
            },
            {
                Header: () => this.props.t("monitoring_tender:label.tanggal_pengumuman"),
                id : "start_tanggal_pengumuman",
                accessor: d => formatDate(d.start_tanggal_pengumuman),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tanggal_pengumuman} />
                )

                
            },
            {
				Header: () => this.props.t("monitoring_tender:label.tanggal_batas_registrasi"),
                id: "end_tanggal_registrasi",
                accessor: d => formatDate(d.end_tanggal_registrasi),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.tanggal_registrasi} />
                ),
            },
            {
				Header: () => this.props.t("monitoring_tender:label.tanggal_closing_date"),
                id: "end_tanggal_closing",
                accessor: d => d.end_tanggal_closing,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.closing_date} />
                ),
                Cell: (resp) => (
                    <div style={{
                        backgroundColor : this.dayWarning(resp.original) ? "red" : '',
                        color : this.dayWarning(resp.original) ? "white" : '',
                        padding : "5px"
                      }}>{formatDate(resp.original.end_tanggal_closing)}</div>
                )
            },
            {
				Header: () => "Buyer",
                accessor: "buyer",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="buyer" onChange={(event) => this.onChanged(event)} value={this.state.params.buyer} />
                )
            },
            {
				Header: () => "Purchasing Group",
                accessor: "purchasing_group_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="purchasing_group_id" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_group_id} />
                )
            },
            {
				Header: () => "Posisi",
                accessor: "posisition_user_by",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="posisition_user_by" onChange={(event) => this.onChanged(event)} value={this.state.params.posisition_user_by} />
                )
            },
            {
                Header: () => "Status",
                accessor: "status",
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                // Cell: ({ original }) => (
                //     <label>{this.setStatustender(original)}</label>
                // )
            },
            {
                Header: "Action",
                filterable: false,
                headerClassName: "sticky",
                id:"actions",
                fixed: "right",
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                            {((d.original.status === 'Draft') || d.original.status_dur==="o" || d.original.status_dur==="r" ) && this.props.user.has_roles.includes("BYR001") && (this.props.user.uuid===d.original.created_by) && <a href={'/tendering/pra-proposal-tender/edit/'+d.original.uuid}><button className="btn btn-xs btn-warning" onClick={(e) => this.toEdit(e,d.original.uuid)}>Edit</button></a>}
                             <a href={'/tendering/monitoring-tender-buyer/detail/'+d.original.uuid}> <button className="btn btn-xs btn-primary" onClick={(e) => this.detail(e,d.original.uuid)}>{this.props.t("monitoring_tender:button.view")}</button></a>
                        </center>
                    </React.Fragment>
                )
            },
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

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchMonitoringTenderBuyer(this.state.params)
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
                // console.log(diffTime)
                // console.log(diffDays)
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
    
    tanggal_pengumuman = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_tanggal_pengumuman = date;
        } else {
            filters.start_tanggal_pengumuman = '';
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

    rangeValue = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.nilai = date;
        } else {
            filters.nilai = '';
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

    toEdit = (e, uuid) => {
        e.preventDefault()
        this.props.history.push(`/tendering/pra-proposal-tender/edit/${uuid}`)
    }

    detail(e, uuid) {
        this.props.history.push('/tendering/monitoring-tender-buyer/detail/' + uuid)
    }

    setStatustender(data){
        let dt = new Date(this.state.now);
        let status = data.pq_status;
        if (data.dur_status !== 'n' || data.dur_status !== 'd' || data.dur_status !== 'r'){
            status = "DUR"
        }
        if (new Date(data.start_tanggal_pengumuman + " 00:01") <= dt && new Date(data.tanggal_pengumuman + " 23:59") >= dt){
            status = this.props.t("monitoring_tender:status.pengumuman")
        }  

        if (new Date(data.start_tanggal_registrasi + " 00:01") <= dt && new Date(data.tanggal_registrasi + " 23:59") >= dt){
            status = this.props.t("monitoring_tender:status.registrasi")
        }

        if (data.start_tanggal_aanwijzing !== null || data.start_tanggal_aanwijzing !== "null" || data.start_tanggal_aanwijzing !== undefined){
            if (new Date(data.start_tanggal_aanwijzing + " 00:01") <= dt && new Date(data.tanggal_aanwijzing + " 23:59") >= dt){
                status = "Aanwijzing"
            }
        }
        if (data.start_tanggal_closing !== null){
            if (new Date(data.start_tanggal_closing + " 00:01") <= dt && new Date(data.tanggal_closing + " 23:59") >= dt){
                status = "Quotation"
            }
        }else{
            status = "Quotation"
        }

        if (new Date(data.tanggal_closing + " 23:59") < dt){
            status = this.props.t("monitoring_tender:status.bid_opening")
        }

        if(data.status_close_tender === 'y'){
            status = this.props.t("monitoring_tender:status.done")
        }

        if(data.status === 'x'){
            status = 'Cancel'
        }

        if(data.status === 'd'){
            status = 'Draft'
        }

        return status
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

    download() {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, downloadExcel: true }
            }));
            this.props.downloadMonitoringTenderBuyer(this.state.params)
            .then((resp) => {
                console.log('download')
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Download Monitoring Tender Buyyer.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            })
            .catch((resp) => {
                console.log('gagal download')
                this.setState(({ loadings }) => ({ loadings: { ...loadings, downloadExcel: false } }));
            });
        }
    }


    render() {
        // const { t } = this.props;
        return (
            <div>
                {console.log(this.state.now)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Monitoring Tender</li>
                </ol>
                <h1 className="page-header">Monitoring Tender  <small>Monitoring Tender</small></h1>
                <Panel loading={false}>
                    <PanelHeader>
                        Monitoring Tender
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <div className="row m-b-10">
                            <div className=" col-sm-12">
                                <button className="pull-right btn btn-sm btn-success" disabled={this.state.loadings.downloadExcel} onClick={ () => this.download()}> {this.state.loadings.downloadExcel && <i className="fa fa-spinner fa-spin"></i>  } Download</button>
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
                                    // onResetFilter={val => this.onResetFilter(val)}
                                    // options={this.state.params}
                                    pages={this.state.pages}
                                    page={this.state.page}
                                    onResetFilter={val => this.onResetFilter(val)}
                                    options={this.state.params}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
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
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
        downloadMonitoringTenderBuyer : (params) =>dispatch(downloadMonitoringTenderBuyer(params))
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(MonitoringTenderBuyer));
