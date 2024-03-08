import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import SweetAlert from 'react-bootstrap-sweetalert';
// import TinyMce from '../../TinyMce'
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

import { fetchKonfigurasi, saveKonfigurasi, fetchKonfigurasiShow } from '../../../store/actions/master/announcementActions';
import RouteForm from './Form';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import FilterDate from '../../../components/filterdate/FilterDate';
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import { formatDate } from '../../../helpers/formatDate';


class KonfigurasiPendaftaran extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            currentStatus : false,
            params: {
                id: '',
                title: '',
                status: '',
                created_at: '',
                updated_at: '',
                start: 0,
                length: 0,
                column: '',
                dir: ''
            },
            statusSearch: [
                { name: 'Open', value: 'o', isChecked: false },
                { name: 'Close ', value: 'c', isChecked: false },
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
            loadingCUrrentStatus : false
        }
        this.defaultSorted = [
            {
                id: "id",
                desc: false
            }
        ];
        this.columns = [
            {
				Header: () => "Nomor",
                accessor: "id",
                height: 10,
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="id" onChange={(event) => this.onChanged(event)} value={this.state.params.id} />
                ),
                filterable : false
            },
            // {
			// 	Header: "Content",
            //     id: "content",
            //     accessor: d => d.content,
            //     Filter: ({ filter, onChange }) => (
            //         <input className="form-control" name="content" onChange={(event) => this.onChanged(event)} value={this.state.params.content} />
            //     ),
            //     Cell : ({value}) => (
            //         <React.Fragment>
            //             <div dangerouslySetInnerHTML={{__html: value}} />
            //         </React.Fragment>
            //     )
            // },
            {
				Header: () => this.props.t("eDocument:label.status"),
                id: "status",
                accessor: d => d.status === 'c' ? 'Close' : 'Open',
                Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
            },
            {
				Header: () => "Tanggal",
                id: "created_at",
                accessor: d => formatDate(d.created_at, true),
                Filter: ({ filter, onChange }) => (
                    <FilterDate type="created_at" getDate={this.created_at} />
                )
            },
            {
				Header: () => "Note",
                accessor: "note",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="note" onChange={(event) => this.onChanged(event)} value={this.state.params.note} />
                )
            },
            // {
			// 	Header: () => this.props.t("eDocument:label.action"),
            //     filterable: false,
            //     sortable: false,
            //     accessor: "uuid",
            //     Cell: ({ value }) => (
            //         <React.Fragment>
            //             <center>
            //                 {this.props.access.U && <button className="btn btn-xs btn-warning" value={value} onClick={(e) => this.toggleFormOpen(e, value)} ><i className="fa fa-edit"></i></button>}
            //                 {this.props.access.D && <button className="btn btn-xs btn-danger" value={value} onClick={(e) => this.toggleConfirm(e, value)} ><i className="fa fa-trash"></i></button>}
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

    asyncData = async () => {
        this.showCurrentStatus()
        this.setState({ loading: true })
        this.props.fetchKonfigurasi(this.state.params)
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
                toastr.error(resp.data.status, resp.data.message);
            });
    }

    showCurrentStatus = async () => {
        this.setState({ loadingCUrrentStatus: true })
        this.props.fetchKonfigurasiShow()
            .then((resp) => {
                console.log("current status")
                console.log(resp.data.data)
                this.setState({
                    currentStatus : resp.data.data.status === 'o' ? true : false,
                    loadingCUrrentStatus: false
                })
            })
            .catch((resp) => {
                this.setState({ loadingCUrrentStatus: false })
                toastr.error(resp.data.status, resp.data.message);
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

    savePayload = (type, payload) => {
        if (type === "save") {
            this.setState({ loadingSubmit: true });
            this.props.saveKonfigurasi(payload)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ loadingSubmit: false }, () => this.req())
                    console.log(resp)
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
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

    onResetFilter = (val) => {
        let a = {...val}
        a.column = 'id'
        a.dir = 'asc'
		this.setState({
            params: a,
        }, () => this.asyncData());    
	}

    handleSubmit = (data) => {
        // data.preventDefault()
        if (data.status === this.state.currentStatus){
            const s = data.status ? "OPEN" : "CLOSE";
            toastr.error("Saat ini status sudah " + s)
            return
        }
        const request = {...data}
        request.status = data.status ? "o": "c";
        console.log(request)
        this.savePayload("save", request)
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
                    <li className="breadcrumb-item">Vendor</li>
                    <li className="breadcrumb-item active">Konfigurasi Buka dan Tutup Registrasi Vendor Mandiri</li>
                </ol>
                <h1 className="page-header">Konfigurasi Buka dan Tutup Registrasi Vendor Mandiri  <small>Master Data Konfigurasi Buka dan Tutup Registrasi Vendor Mandiri</small></h1>
                { this.state.modalOpen ?
                    <Panel loading={false}>
                        <PanelHeader>
                            Konfigurasi Buka dan Tutup Registrasi Vendor Mandiri
                        </PanelHeader>
                        <PanelBody loading={false}>
                            <Row>
                                <Col sm="6">
                                </Col>
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>Kembali</Button>
                                    </div>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col sm="12">
                                    <ModalForm
                                        toggleAdd={this.state.modalOpen}
                                        uuid={this.state.uuid}
                                        showAnnouncement={this.props.showAnnouncement}
                                        save={this.savePayload}
                                        update={this.updatePayload}
                                        isError={this.state.isError}
                                        errors={this.state.errors}
                                        loadingSubmit={this.state.loadingSubmit}
                                        toggleClose={this.toggleFormClose}
                                    />
                                </Col>
                            </Row> */}

                        </PanelBody>

                    </Panel>
                    :
                    <Panel loading={false}>
                        <PanelHeader>
                            Konfigurasi Buka dan Tutup Registrasi Vendor Mandiri
                        </PanelHeader>
                        <PanelBody loading={false}>
                            <Row className="m-b-15">
                                <Col sm="8">
                                    {!this.state.loadingSubmit && <RouteForm save={this.handleSubmit} loading={this.state.loadingSubmit} defaultStatus={this.state.currentStatus}/>}
                                </Col>
                                <Col sm="3">
                                    {!this.state.loadingCUrrentStatus && <h5 className="pull-right">Status saat ini : {this.state.currentStatus ? "OPEN" : "CLOSE"}</h5>}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="12">
                                    <h5>History Pembukaan Registrasi Vendor</h5>
                                    <ReactTable
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
                }
				{(this.state.isConfirm &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={t("common:delete.approve-delete")}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title={t("common:delete.title-delete")}
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
					</SweetAlert>
				)}
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
        fetchKonfigurasi: (params) => dispatch(fetchKonfigurasi(params)),
        fetchKonfigurasiShow: () => dispatch(fetchKonfigurasiShow()),
        // deleteAnnouncement: (id) => dispatch(deleteAnnouncement(id)),
        saveKonfigurasi: (id, payload) => dispatch(saveKonfigurasi(id, payload)),
        // updateAnnouncement: (id, payload) => dispatch(updateAnnouncement(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(KonfigurasiPendaftaran));
