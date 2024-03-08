import React, { Component } from 'react'
import { Row, Col, Modal } from 'reactstrap';
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
import { createLOA, generatePDFLOA, showDetailLoa, approvalLOA} from "../../../store/actions/expediting/CreateLoaActions";
import { fetchEDocument , showEDocument} from "../../../store/actions/master/masterLoaActions";
// import { statusName } from '../../../helpers/statusName';
import ReactLoading from 'react-loading';
import moment from 'moment';
import { debounce } from '../../../helpers/debounce';
import FormLoaList from './detail/loa/FormLoaList';

const ReactTableFixedColumns = withFixedColumns(ReactTable);
class PurchaseOrder extends Component {
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
                purc_group_id:'',
                purc_org_id: '',
                po_date: '',
                tipe: 'po',
                total_nilai:'',
                release_date: '',
                delivery_date: '',
                progress: '',
                status_progress: '',
                status: '',
                status_text:'',
                read_by_vendor: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: '',
                position_user_by : ''
            },
            statusSearch: [
                { name: 'Open PO', value: 'd', isChecked: false },
                { name: 'Review By Vendor', value: 'o', isChecked: false },
                { name: 'Rejected', value: 'r', isChecked: false },
                { name: 'Approval', value: 'p', isChecked: false },
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
            loadingSubmit:false,
            loadings : {
                loading_download_generate_loa : false,
                loading_create_loa : false,
                loadingModal : true
            },
            data_po_loa :[],
            uuid_po_loa :'',
            no_po_loa:'',
            docs_Loa:[]
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
                Header: "No. Tender",
                accessor: "proposal_tender_number",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_number" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_number} />
                ),
            },
            {
                Header: "Judul Tender",
                accessor: "proposal_tender_title",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="proposal_tender_title" onChange={(event) => this.onChanged(event)} value={this.state.params.proposal_tender_title} />
                ),
            },
            {
                Header: "Vendor",
                accessor: "vendor_id",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_id" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_id} />
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
                Header: "Release Date",
                id: "release_date",
                accessor: d => d,
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.release_date} />
                ),
                Cell: ({ value }) => (
                    value.release_date !== null && value.release_date !== '' && 
                    <label>{moment(value.release_date).format("DD-MM-YYYY")}</label>
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
				Header: () => "Posisi",
                accessor: "position_user_by",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="position_user_by" onChange={(event) => this.onChanged(event)} value={this.state.params.position_user_by} />
                )
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
                width: 200,
                sortable: false,
                Cell: d => (
                    <React.Fragment>
                        <center>
                            <button className={"btn btn-xs btn-white"} value={d.original.uuid} onClick={(e) => this.edits(e, d.original.uuid)} >Process</button>
                                {['c','s','y'].includes(d.original.status)===false &&
                                //onClick={()=>props.modalCreateLoa()}
                                <button className='btn btn-xs btn-success m-l-10' onClick={()=>this.modalCreateLoa(d.original.uuid, d.original.eproc_number)} > 
                                    <i className='fa fa-edit'></i>
                                    { this.props.user.has_roles.includes('KBGPNG') ?  "APPROVAL LOA" : "LOA" }
                                </button>
                                }

                                {d.original.po_loa_id!==null &&
                                <button className='btn btn-xs btn-success m-l-10'  onClick={()=> this.downloadGeneratePDFLOA(d.original.uuid, d.original.eproc_number)} disabled={this.state.loadings.loading_download_generate_loa}>
                                    {this.state.loadings.loading_download_generate_loa && <i className="fa fa-spinner fa-spin"></i>}
                                    <i className='fa fa-file-pdf'></i> LOA
                                </button>
                                }
                        </center>
                    </React.Fragment>
                )
            },
        ];
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchEDocumentLoa()
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
            this.asyncData()
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
            this.asyncData()
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
        val.tipe = 'po'
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    modalCreateLoa = async (payload,number) => {
        this.showDetailLoa(payload)
        this.setState(({ loadings}) => ({
            modalOpen:true,
            loadings : {... loadings , loadingModal : true},
            uuid_po_loa : payload,
            no_po_loa :number
        }));
    }

    downloadGeneratePDFLOA= (uuid, fileNamePO) => {
        console.log(uuid)
		this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: true } }));
		this.props.generatePDFLOA(uuid)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `LOA - ${fileNamePO}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: false } }));
		})
		.catch((resp) => {
            this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: false } }));
            toastr.error(resp?.statusText);
		});
	}

    showDetailLoa= (uuid) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: true } }));
		this.props.showDetailLoa(uuid)
		.then((resp) => {
            let datas = resp.data.data
			console.log(datas)
			this.setState(
                ({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: false ,loadingModal :false },
                data_po_loa : datas}
            ));
		})
		.catch((resp) => {
            this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_download_generate_loa: false } }));
            toastr.error(resp?.statusText);
		});
	}

    submitCreateLoa = (uuid,payload) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_create_loa: true },
        }));
        this.props.createLOA(uuid, {
            'status' : payload.status,
            'deskripsi' : this.state.data_po_loa.deskripsi
        })
        .then((resp) => {
            toastr.success(resp.data.message);
            this.setState(({ loadings, data }) => ({
                loadings: { ...loadings, loading_create_loa: false },
                download_loa_on_modal : true,
                modalOpen:false
            }));
        })
        .catch(error => {
            this.setState(({ loadings}) => ({
                loadings: { ...loadings, loading_create_loa: false },
            }));
            if (error !== undefined) {
                this.setState({ loading_document: false })
                toastr.error(error.data.message)
            } else {
                this.setState({ loading_document: false })
                toastr.error('Opps Somethings Wrong')
            }
        })
    }

    approvalLOA = (uuid,payload) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_create_loa: true },
        }));
        this.props.approvalLOA(uuid, {
            'status' : payload.status,
            'deskripsi' : this.state.data_po_loa.deskripsi
        })
        .then((resp) => {
            toastr.success(resp.data.message);
            this.setState(({ loadings, data }) => ({
                loadings: { ...loadings, loading_create_loa: false },
                download_loa_on_modal : true,
                modalOpen:false
            }));
        })
        .catch(error => {
            this.setState(({ loadings}) => ({
                loadings: { ...loadings, loading_create_loa: false },
            }));
            if (error !== undefined) {
                this.setState({ loading_document: false })
                toastr.error(error.data.message)
            } else {
                this.setState({ loading_document: false })
                toastr.error('Opps Somethings Wrong')
            }
        })
    }
    changeTextCKEditor = (payload)  => {
        this.setState(({data_po_loa}) => ({
            data_po_loa : {... data_po_loa, deskripsi: payload}
        }));
    }

    toggleClose = () => {
        this.setState({modalOpen:false});
	}

    fetchEDocumentLoa = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, get_document_loa: true },
        }));
        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : {start: 0, length: 10};
        this.props.fetchEDocument(select_params)
            .then((resp) => {
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.uuid, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, get_document_loa: false },
                    docs_Loa: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, get_document_loa: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    getDocumentTemplateLOA = (uuid) => {
        if (this._isMounted) {
            this.setState(({ loadings }) => ({
                loadings: { ...loadings, loading_document_ckeditor: true , loading_create_loa: true},
            }));
            this.props
                .showEDocument(uuid)
                .then((resp) => {
                    let datas = resp.data.data;
                    this.setState(({ loadings , data_po_loa}) => ({
                        loadings: { ...loadings, loading_document_ckeditor: false ,loading_create_loa: false},
                        data_po_loa : {... data_po_loa, deskripsi: datas.keterangan}
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings }) => ({
                        loadings: { ...loadings, loading_document_ckeditor: true, loading_create_loa: false },
                    }));
                    toastr.error(resp.data.message);;
                });
        }
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Perikatan</li>
                    <li className="breadcrumb-item active">Purchase Order</li>
                </ol>
                <h1 className="page-header">Purchase Order</h1>
                <Panel loading={false}>
                    <PanelHeader>List Purchase Order</PanelHeader>
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
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    {this.state.loadings.loadingModal ? (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    ) : <FormLoaList
                            no_po_loa={this.state.no_po_loa}
                            uuid = {this.state.uuid_po_loa}
                            user = {this.props.user}
                            access = {this.props.access}
                            errors={this.state.errors}
                            data={this.state.data_po_loa}
                            changeTextCKEditor={(payload)=>this.changeTextCKEditor(payload)}
                            submitCreateLoa={(uuid,payload) => this.submitCreateLoa(uuid,payload)}
                            approvalLOA={(uuid,payload) => this.approvalLOA(uuid,payload)}
                            docs_Loa = {this.state.docs_Loa}
                            loadings={this.state.loadings}
                            fetchEDocumentLoa={(payload)=> this.fetchEDocumentLoa(payload)}
                            getDocumentTemplateLOA={(payload) => this.getDocumentTemplateLOA(payload)}
                            ckeditor={this.state.ckeditor}
                            download_loa_on_modal={this.state.download_loa_on_modal}
                            downloadGeneratePDFLOA={(payload, number) => this.downloadGeneratePDFLOA(payload, number)}
                    />}
                </Modal>
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
        generatePDFLOA :(id) => dispatch(generatePDFLOA(id)),
        createLOA :(id, payload) => dispatch(createLOA(id, payload)),
        showDetailLoa : (id) => dispatch(showDetailLoa(id)),
        approvalLOA:(id, payload) => dispatch(approvalLOA(id,payload)),
        fetchEDocument : (params) => dispatch(fetchEDocument(params)),
        showEDocument:(id) => dispatch(showEDocument(id))
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

export default connect(stateToProps, dispatchToProps)( withTranslation() (PurchaseOrder));
