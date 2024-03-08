import React, { Component } from 'react'
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withFixedColumns from "react-table-hoc-fixed-columns";
import { fetchAanwijzingList ,getAanwijzingHistory, storeAanwijzingConfig } from '../../../store/actions/tendering/aanwijzingActions'
import FilterDate from '../../../components/filterdate/FilterDate';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import { Modal, ModalHeader , ModalBody} from 'reactstrap';
import FormCreateAanwijzing from "./detail/FormCreateAanwijzing";
import FormRegistration from "./detail/FormRegistration";
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../helpers/formatDate';

const ReactTableFixedColumns = withFixedColumns(ReactTable);


class ListAanwijzingUser extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false

        this.state = {
            data: [],
            params: {
                no:'',
                reference:'',
                proposal_tender_no:'',
                versi:'',
                title: '',
                start_date:'',
                end_date:'',
                aanwijzing_name:'',
                tender_status:'',
                aanwijzing_status:'',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
            ],
            statusAanwijzing: [
                { name: 'Waiting ', value: 'waiting', isChecked: false },
                { name: 'Live', value: 'live', isChecked: false },
                { name: 'Done ', value: 'done', isChecked: false },
                { name: 'Close ', value: 'close', isChecked: false },
            ],
            optionsCreate:[
                { value: "eproc", label: "E-Proc" },
                { value: "sap", label: "SAP" },
            ],
            defaultPageSize: 10,
            recordsTotal: 0,
            recordsFiltered: 0,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loadings : {
                loadingModalCreate : false,
                loading_aanwijzing_config_store: false
            },
            modalCreate : false,
            dataCreate : [],
            dataModalRegistration : {
                start_date :'',
                end_date:'',
                paket_no :'',
                title : ''
            },
            modalData:[],
            modalOpen : false,
            errorAanwijzingConfig : []
        }
        this.defaultSorted = [
            {
                id: "updated_at",
                desc: true
            }
            
        ];
        this.columns = [
            {
                Header: "No.",
                accessor: "no",
                filterable:false,
                height:10,
                Cell: d =>
                (
                    <React.Fragment>
                        <div>
                            {d.index+1}
                        </div>
                    </React.Fragment>
                )
            },
            {
                Header: "Referensi",
                id :"reference",
                accessor: d => d.reference,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="reference" onChange={(event) => this.onChanged(event)} value={this.state.params.reference} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.proposal-tender-number"),
                id :"proposal_tender_no",
                accessor: d => d.proposal_tender_no,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_no" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_no} />
                )
            },
            {
                Header: () => "Title",
                id :"title",
                accessor: d => d.title,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="title" onChange={(event) => this.onChanged(event)} value={this.state.params.title} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.company-name"),
                id: "company_name",
                accessor: d => d.company_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="company_name" onChange={(event) => this.onChanged(event)} value={this.state.params.company_name} />
                ),
            },
            {
                Header: () => this.props.t("aanwijzing:label.version"),
                id: "versi",
                accessor: d => d.versi,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="versi" onChange={(event) => this.onChanged(event)} value={this.state.params.versi} />
                ),
                Cell: ({ value }) => (
                    <center><label>{value}</label></center>
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.maximum-registration-date"),
                id: "tgl_register",
                accessor: d => formatDate(d.tgl_register, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="tgl_register" getDate={this.tgl_register} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.closing-date"),
                id: "end_date",
                accessor: d => formatDate(d.end_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="end_date" getDate={this.end_date} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.start-date"),
                id: "start_date",
                accessor: d => formatDate(d.start_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="start_date" getDate={this.start_date} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.end-date"),
                id: "end_date",
                accessor: d => formatDate(d.end_date, false),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="end_date" getDate={this.end_date} />
                )
            },
            {
                Header: () => this.props.t("aanwijzing:label.type-aanwijzing"),
                id: "aanwijzing_name",
                accessor: d => d.aanwijzing_name,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="aanwijzing_name" onChange={(event) => this.onChanged(event)} value={this.state.params.aanwijzing_name} />
                ),
            },
            // {
            //     Header: () => this.props.t("aanwijzing:label.status-tender"),
            //     id: "tender_status",
            //     accessor: d => d.tender_status,
            //     Filter: ({ filter, onChange }) => (
            //         <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
            //     ),
            //     Cell: ({ value }) => (
            //         <label>{value}</label>
            //     )
            // },
            {
                Header: () => this.props.t("aanwijzing:label.status-aanwijzing"),
                id: "aanwijzing_status",
                accessor: d => (d.status_aanwijzing !=="" && d.status_aanwijzing!==null) ? d.status_aanwijzing  : (new Date().getTime()/1000 < new Date(d.start_date +" "+d.start_time).getTime()/1000) ? 'Waiting' : (new Date().getTime()/1000 > new Date(d.start_date +" "+d.start_time).getTime()/1000 && new Date().getTime()/1000 < new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Live" : (new Date().getTime()/1000 > new Date(d.end_date +" "+d.end_time).getTime()/1000) ? "Done" : "", 
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusAanwijzing} getStatus={this.getCheckStatusAanwijzing} />
                ),
                Cell: ({ value }) => (
                    <label>{value}</label>
                )
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
                        <div>
                            {(d.original.status==="o" || d.original.status==="r") && <button className="btn btn-xs btn-warning" value={d.original.uuid} onClick={(e) => this.edits(e, d.original)} >{d.original.status==="r"?"Edit":"Process"}</button>}
                            {(d.original.status==="p" || d.original.status==="a" ||  d.original.status==="y") && <button className={this.props.user.uuid === d.original.workflow_user ? "btn btn-xs btn-warning": "btn btn-xs btn-lime"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original)} > {this.props.user.uuid === d.original.workflow_user ? "Process" : "View"}  </button>}
                            {/* {d.original.proposal_tender_no!=="SAP" && <button className="btn btn-xs btn-info" value={d.original.uuid} onClick={() => this.getHistory(d.original.uuid)}  >History</button>} */}
                        </div>
                    </React.Fragment>
                )
            },
        ];
    }


    componentDidMount = () => {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }


    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchAanwijzingList(this.state.params)
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
        someProperty.start = 0;
        this.setState({
            params: someProperty,
            page: 0
        }, () => { this.req() });
    }

    edits(e, original) {
        if(new Date().getTime()/1000 < new Date(original.start_date +" "+original.start_time).getTime()/1000) {
            toastr.warning("Warning", "Tanggal Registrasi Belum Dimulai")
        }else{
            this.props.history.push('/tendering/aanwijzing-user/detail/' + original.uuid)
        }       
        
    }

    guidGenerator() {
        let S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    createSAP = (value) => {
        let id = this.guidGenerator()
        this.props.history.push('/tendering/aanwijzing-user/create-sap/'+ id , value)
    }

    customs(arr) {
        var state = (arr.pageSize = 0 ? 10 : arr.pageSize);
        var someProperty = { ...this.state }
        someProperty.page = arr.page
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

    getCheck = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.tender_status = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.tender_status = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    getCheckStatusAanwijzing = (check) => {
        let filters = { ...this.state.params }
        filters.start = 0;
        if (check.length > 0) {
            filters.status_aanwijzing = check.join(";");
            this.setState({ params: filters }, () => this.asyncData())
        } else {
            filters.status_aanwijzing = [];
            this.setState({ params: filters }, () => this.asyncData())
        }
    }

    toggleOpenModal = (e) => {
        this.setState(({loadings})=> ({ 
            modalCreate : true,
            loadings : {...loadings , loadingModalCreate:true}
        }))
    }

    toggleCloseModal = () => {
        this.removeErrorConfig()
        this.setState({ modalCreate: false, loadingModalCreate: false, dataCreate: [] })
    }

    toggleOpenModalRegistration = (e,uuid,a_proposal_tender_no,b_title,c_start_date,d_end_date) => {
        console.log(e)
        this.setState(({loadings,dataModalRegistration})=> ({ 
            modalRegistration : true,
            loadings : {...loadings , loadingModalRegistration:true},
            dataModalRegistration : {...dataModalRegistration , paket_no:a_proposal_tender_no, title:b_title, start_date:c_start_date, end_date:d_end_date}
        }))
    }

    toggleCloseModalRegistration = () => {
        this.setState({ modalRegistration: false, loadingModalRegistration: false, dataModalRegistration: [] })
    }


    start_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.start_date = date;
        } else {
            filters.start_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    end_date = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.end_date = date;
        } else {
            filters.end_date = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    tgl_register = (date = '') => {
        let filters = { ...this.state.params }
        filters.start = 0;
        filters.page = 0;
        if (date !== '') {
            filters.tgl_register = date;
        } else {
            filters.tgl_register = '';
        }
        this.setState({ params: filters }, () => {
            this.asyncData()
        })
    }

    getHistory(uuid) {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                modalOpen: true,
                loadings: { ...loadings, loadingModal: true },
                modalData: []
            }));
            this.props
                .getAanwijzingHistory(uuid)
                .then((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                        modalData: resp.data.data
                    }));
                    
                    toastr.success(resp.data.message);
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loadingModal: false },
                    }));
                    if (resp !== undefined) {
                        toastr.error(resp.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                });
        }
    }

    toggleCloseHistory = () => {
        this.setState({ modalOpen: false})
    }

    storeAanwijzingConfig (payload) {
        if (this._isMounted) {
            this.setState(({loadings}) => ({ 
                loadings : {...loadings , loading_aanwijzing_config_store: true},
                errorAanwijzingConfig : []
            }))
            this.props.storeAanwijzingConfig(payload)
            .then((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_aanwijzing_config_store: false},
                }))
                toastr.success(resp.data.status, resp.data.message)
                this.props.history.push('/tendering/aanwijzing-user/config-aanwijzing/' + resp.data.data.proposal_tender_uuid + "/" + resp.data.data.uuid)
            })
            .catch((resp) => {
                this.setState(({loadings}) => ({ 
                    loadings : {...loadings , loading_aanwijzing_config_store: false},
                    errorAanwijzingConfig : resp.data.errors
                }))
                toastr.error(resp.data.status, resp.data.message);
            });
        }
    }

    removeErrorConfig () {
        if (this._isMounted) {
            this.setState({errorAanwijzingConfig : []})
        }
    }

    onResetFilter = (val) => {
		this.setState({
            params: val,
        }, () => this.asyncData());    
	}


    render() {
        const { t } = this.props;
        let rows;

        if (this.state.modalData.length > 0) {
            rows = this.state.modalData.map((dt, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{dt.proposal_tender_no}</td>
                        <td>{dt.status_text}</td>
                        <td>{dt.created_at}</td>
                        <td>{dt.created_by_name}</td>
                    </tr>
                )
            })
        } else {
            rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
        }
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Tendering</li>
                    <li className="breadcrumb-item active">Aanwijzing</li>
                </ol>
                <h1 className="page-header">Tendering Aanwijzing<small></small></h1>
                <Panel loading={false} className="margin-bot-false">
                    <PanelHeader>
                       AANWIJZING
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="12">
                                <div className="pull-right m-b-10">
                                    <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleOpenModal(e)}  >Create</Button>
                                    {/* <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => this.toggleOpenModal('a')}  >Create</Button> */}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <ReactTableFixedColumns
                                    filterable 
                                    loading={this.state.loading}
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
                                    page={this.state.page}
                                    onFetchData={(state, instance) => {
                                        this.req(state);
                                    }}
                                />
                            </Col>
                        </Row>
                    </PanelBody>
                </Panel>

                <Modal isOpen={this.state.modalCreate} toggle={() => this.toggleCloseModal()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModal()}>Create Aanwijzing</ModalHeader>

                    {/* {this.state.loadings.loadingModalCreate&& (
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    )} */}
                    <FormCreateAanwijzing
                        optionsCreate={this.state.optionsCreate}
                        toggleCloseModal={this.toggleCloseModal}
                        createSAP={this.createSAP}
                        storeAanwijzingConfig = {(payload) => this.storeAanwijzingConfig(payload)}
                        loadings = {this.state.loadings}
                        errors = {this.state.errorAanwijzingConfig}
                        removeErrorConfig = {()=>this.removeErrorConfig()}
                    />
                </Modal>

                <Modal isOpen={this.state.modalRegistration} toggle={() => this.toggleCloseModalRegistration()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseModalRegistration()}>Modal Registration</ModalHeader>

                    <FormRegistration
                    toggleClose={() => this.toggleCloseModalRegistration()}
                    data = {this.state.dataModalRegistration}
                    />
                </Modal>

                {/* Modal Hostory */}
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseHistory()} className="modal-lg">
                    <ModalHeader toggle={() => this.toggleCloseHistory()}>History</ModalHeader>
                    <ModalBody>
                        {this.state.loadings.loadingModal && (
                            <center>
                                <br />
                                <ReactLoading type="cylon" color="#0f9e3e" />
                                <br />
                            </center>
                        )}

                        {this.state.loadings.loadingModal === false && (
                            <div className="row">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Proposal Tender</th>
                                                <th>{t("dur:label.status")}</th>
                                                <th>{t("dur:label.updated_at")}</th>
                                                <th>{t("dur:label.updated-by")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </Modal>
                {/* END Modal Hostory */}
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
        fetchAanwijzingList: (params) => dispatch(fetchAanwijzingList(params)),
        getAanwijzingHistory: (id) => dispatch(getAanwijzingHistory(id)),
        storeAanwijzingConfig: (payload) => dispatch(storeAanwijzingConfig(payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ListAanwijzingUser));