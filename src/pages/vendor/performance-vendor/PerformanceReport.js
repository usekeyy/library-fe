import React, { Component } from 'react'
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { toastr } from 'react-redux-toastr';
import 'react-table/react-table.css';
import { Button, Row, Col } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';
import { withTranslation } from 'react-i18next';

// import { fileUpload } from '../../../store/actions/uploadActions';
import {fetchPeformanceReport,showDetailPerformanceReport, syncVpr, downloadExcelPerformanceReport} from '../../../store/actions/vendor/performanceReportActions';
import {showPunishmentVendor} from '../../../store/actions/vendor/punishmentVendorActions';

import Modal from './sub/Modal'
import ModalPunishment from './sub/ModalDetailPunishment'
import ReactTablePagination from '../../../components/paginations/ReactTablePagination';
import FilterStatus from '../../../components/filterstatus/FilterStatus';
import { debounce } from '../../../helpers/debounce';
// import FilterDate from '../../../components/filterdate/FilterDate';

class PerformanceReport extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.state = {
            data: [],
            // approval: {
            //     status: '',
            //     name: '',
            // },
            params: {
                purchasing_org_name: "",
                ranking: "",
                sap_code: props.location.sap_code ? props.location.sap_code : "",
                vendor_name : "",
                total : "",
                kelompok :"",
                status :"",
                start: 0,
                length: 0,
                column: 'sap_code',
                dir: 'asc'
            },
			statusSearch: [
                {name: 'Aktif', value: 'aktif', isChecked: false},
                {name: 'Suspend', value: 'suspend', isChecked: false},
                {name: 'Banned', value: 'banned', isChecked: false},
			],
            defaultPageSize: 10,
            pages: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            modalPunishment: false,
            isConfirm: false,
            status: '',
            uuid: '',
            company_id: '',
            company_name: '',
            error: false,
            errors: {},
            loadingSubmit: false,
            // recordsTotal : 0,
            recordsFiltered: 0
        }
        this.defaultSorted = [
            {
                id: "sap_code",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: "No",
                id: "nomor",
                accessor: d => (
                    <div style={{textAlign:"center"}}>{d.nomor}</div>),
                
                // height: 10,
            },
            {
                Header : "purchasing_org_id",
                accessor : "purchasing_org_id",
                show :false
            },
            {
                Header: "Purchasing Organization",
				id: "purchasing_org_name",
				accessor: d => d.purchasing_org_name,
				Filter: ({ filter, onChange }) => (
					<input className="form-control" name="purchasing_org_name" onChange={(event) => this.onChanged(event)} value={this.state.params.purchasing_org_name} />
                ),
                Cell : ({row,original}) => (
                    <div>
                        <center>
                            {`${row.purchasing_org_id} ${row.purchasing_org_name}`}
                        </center>   
                    </div>
                    
                )
			},
            {
                Header: () => this.props.t("performanceReport:label.ranking"),
                accessor: "ranking",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="ranking" onChange={(event) => this.onChanged(event)} value={this.state.params.ranking} />
                )
            },
            {
                Header: () => this.props.t("performanceReport:label.total-nilai"),
                accessor: "total",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="total" onChange={(event) => this.onChanged(event)} value={this.state.params.total} />
                )
            },
            {
                Header: () => this.props.t("performanceReport:label.kelompok"),
                accessor: "color",
                filterable: false,
				sortable: false,
                Cell : row => (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: row.value,
                            borderRadius: '2px'
                        }}
                    />
                )
            },
			{
                Header: () => this.props.t("performanceReport:label.status"),
                id: "status_name",
				accessor: d => d.status_name,
				Filter: ({ filter, onChange }) => (
                    <FilterStatus statusSearch={this.state.statusSearch} getStatus={this.getCheck} />
                ),
                Cell : row => (
                    <div>
                        <center>
                            {this.setStatus(row.value)}
                        </center>   
                    </div>
                    
                )
			},
            {
                Header: () => this.props.t("performanceReport:label.action"),
                filterable: false,
                sortable: false,
                accessor: 'uuid',
                width : 250,
                Cell: ({ row,original }) => (
                    <React.Fragment>
                            <button className="btn btn-xs btn-primary" value={row.uuid} onClick={(e) => this.detail(e, row.uuid, row.ranking)} >{this.props.t("performanceReport:data-table.detail-nilai")}</button>
                            {original.status_name === "Suspend" &&
                            <button className="btn btn-xs btn-warning" value={original.uuid_punishment} onClick={(e) => this.toggleFormOpenPunishment(e, original.uuid_punishment, row.uuid)} >Detail Punishment</button>
                            }
                    </React.Fragment>
                )
            },
        ];
    }
    debounced = debounce(text => this.asyncData());

    detail(e, value, ranking) {
        this.props.history.push('/vendor/performance-report/detail/' + value + '/' + ranking)
    }

    setStatus(value){
        if (value === "Active") {
            return <h5><span className="label label-success">{this.props.t("performanceReport:data-table.aktif")}</span></h5>
        }else if(value === "Suspend"){
            return <h5><span className="label label-warning">Suspend</span></h5>
        }else if(value === "Banned"){
            return <h5><span className="label label-danger">Banned</span></h5>
        }
    }

    setNoPendaftaran(value){
        let a = value.split(" ");
        return a[0]
    }

    setNamaVendor(value){
        let a = value.split(" ");
        let counter = 0;
        let b = "";
        a.forEach(element => {
            if (counter !== 0){
                b = b + " " + element
            }
            counter++
        });
        return b
    }

    componentDidMount() {
        this._isMounted = true;
        this.checkColumnVendor();
        // const isVendor = this.props.user.has_roles.includes("VNDR01");

        // console.log(isVendor)
    }

    componentWillUnmount() {
        this._isMounted = false;
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    checkColumnVendor(){
        if(this.props.user.has_roles.includes("VNDR01")){
        }else {
            const noPendaftaran = {
                Header: () => this.props.t("performanceReport:label.nomor-pendaftaran"),
                accessor: "sap_code",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="sap_code" onChange={(event) => this.onChanged(event)} value={this.state.params.sap_code} />
                ),
                // Cell : row => (
                //     <div>
                //         {this.setNoPendaftaran(row.value)}
                //     </div>
                // )
            };
            const namaVendor = 
            {
                Header: () => this.props.t("performanceReport:label.nama-vendor"),
                accessor: "vendor_name",
                Filter: ({ filter, onChange }) => (
                    <input className="form-control" name="vendor_name" onChange={(event) => this.onChanged(event)} value={this.state.params.vendor_name} />
                ),
                // Cell : row => (
                //     <div>
                //         {this.setNamaVendor(row.value)}
                //     </div>
                // )
            };
            this.columns.splice(2, 0, noPendaftaran);
            this.columns.splice(3, 0, namaVendor);

        }
    }

    asyncData = async () => {
        this.setState({ loading: true })
        this.props.fetchPeformanceReport(this.state.params)
            .then((resp) => {
                // console.log(resp.data)
                let number = 0;
                const dataPlusNomor = resp.data.data.map((item) => {
                    number++
                    return {...item, nomor : number}
                })
                this.setState({
                    // data: resp.data.data,
                    data: dataPlusNomor,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered
                })
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            })
            .then(() => {
                this.setState({ loading: false })
            })
        // let data = [
        //     {
        //         id : "1",
        //         uuid : "f9ec1055-250b-475b-b582-280a9676bcd5",
        //         purchasing_organization : "A000 Pupuk Indonesia Holding",
        //         ranking : "1",
        //         nomor_pendaftaran : "111021",
        //         nama_vendor : "Vendor A",
        //         total_nilai : "98",
        //         kelompok : "red",
        //         status : "Aktif"
        //     },
        //     {
        //         id : "2",
        //         uuid : "3bff655e-5387-4c03-86ff-f8708831ceb3",
        //         purchasing_organization : "A000 Pupuk Indonesia Holding",
        //         ranking : "1",
        //         nomor_pendaftaran : "111021",
        //         nama_vendor : "Vendor A",
        //         total_nilai : "98",
        //         kelompok : "red",
        //         status : "Suspend"
        //     },
        //     {
        //         id : "2",
        //         uuid : "f9ec1055-250b-475b-b582-280a9676bcd5",
        //         purchasing_organization : "A000 Pupuk Indonesia Holding",
        //         ranking : "1",
        //         nomor_pendaftaran : "111021",
        //         nama_vendor : "Vendor A",
        //         total_nilai : "98",
        //         kelompok : "red",
        //         status : "Banned"
        //     }
        // ]
        // this.setState({
        //     data: data,
        //     pages: Math.ceil(parseInt("10") / 10),
        //     recordsFiltered : 3
        // })
        // this.setState({ loading: false })
    }
	
    onChanged(event) {
        var someProperty = { ...this.state.params }
        someProperty[event.target.name] = event.target.value
        this.setState({
            params: someProperty
        }, () => { this.debounced(someProperty) });
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
        // console.log(stateArr)
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
        this.setState({ modalOpen: false, modalPunishment:false, uuid: '' })
    }

    toggleFormOpenPunishment = (e, value, id_vendor) => {
        // console.log(value)
        this.props.history.push('/vendor/performance-report/detail-punishment/' + value + '/' + id_vendor)
        // e.preventDefault();
        // const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        // this.setState({ modalPunishment: true, uuid: uuid })
    }

    // updatePayload = (id, payload) => {
    //     if (this._isMounted) {
    //         this.setState({ loadingSubmit: true });
    //         this.props.updatePunishmentVendor(id, payload)
    //             .then((resp) => {
    //                 toastr.success(resp.data.message);
    //                 this.setState({ modalOpen: false, loadingSubmit: false }, () => this.req())
    //                 console.log(resp)
    //             })
    //             .catch((error) => {
    //                 this.setState({ loadingSubmit: false });
    //                 console.log(error)
    //             })
    //     }
    // }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid })
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

    syncVprButton = () => {
        this.setState({loadingSubmit: true})
        this.props.syncVpr([])
			.then(res => {
                if (res.data.status === 'success'){
                    toastr.success(res.data.message);
                    this.setState({loadingSubmit: false}, () => this.asyncData())
                }else{
                    toastr.success("Gagal Sync");
                    this.setState({loadingSubmit: false}, () => this.asyncData())
                }
			})
			.catch(error => {
                // console.log(error)
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loadingSubmit: false});
				} else {
					this.setState({loadingSubmit: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
    }

    onResetFilter = (val) => {
		this.setState({
            params: val
        }, () => this.asyncData());    
	}

    downloadExcel = () => {
        this.setState({loadingSubmit: true})
        this.props.downloadExcelPerformanceReport()
			.then(res => {
                console.log(res)
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'PerformanceReport.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();

                toastr.success("Download Success");
                this.setState({loadingSubmit: false})
                // if (res.data.status == 'success'){
                //     toastr.success(res.data.message);
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }else{
                //     toastr.success("Gagal Sync");
                //     this.setState({loadingSubmit: false}, () => this.asyncData())
                // }
			})
			.catch(error => {
                // console.log(error)
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this.setState({error: true, errors: error.data.errors, loadingSubmit: false});
				} else {
					this.setState({loadingSubmit: false});
					toastr.error("Gagal Menyimpan Data");
				}
			})
    }

    render() {
        // const { t } = this.props;
        // console.log(this.props.user) 
        let view;
        if(this.state.modalOpen){
            view = <Modal
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid} 
                        user_uuid={this.props.user.uuid}
                        showPunishmentVendor={this.props.showPunishmentVendor} 
                        toggleFormClose={this.toggleFormClose}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        setLoading={this.setLoading}
                        showDetailPerformanceReport={this.props.showDetailPerformanceReport}
                    />
        }else if(this.state.modalPunishment){
            view = <ModalPunishment
                        toggleAdd={this.state.modalOpen}
                        uuid={this.state.uuid} 
                        user_uuid={this.props.user.uuid}
                        showPunishmentVendor={this.props.showPunishmentVendor} 
                        toggleFormClose={this.toggleFormClose}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        setLoading={this.setLoading}
                    />
        }else {
            view = 
            <div>
                <Col sm="12">
                    <div className="pull-right">
                        {/* <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.syncVprButton()}>
                            Sync {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                        </Button> */}
                        <Button color="primary" size="sm" disabled={this.state.loadingSubmit} onClick={() => this.downloadExcel()} >Download Excel 
                        {this.state.loadingSubmit && <i className="fas fa-spinner fa-pulse"></i>}
                        </Button>
                    </div>
                    <br/>
                    <br/>
                </Col>
                <ReactTable
                    // loading={false}
                    
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
                    // recordsTotal={this.state.recordsTotal}
                    recordsFiltered={this.state.recordsFiltered}
                    length={this.state.params.length}
                    start={this.state.params.start}
                    pages={this.state.pages}
                    page={this.state.page}
                    options={this.state.params}
                    onResetFilter={val => this.onResetFilter(val)}
                    onFetchData={(state, instance) => {
                        this.req(state);
                    }}
                />
            </div>
            
        }
        return (
            <div>
                {console.log(this.props)}
                <ol className="breadcrumb float-xl-right">
                    <li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Performance Report</li>
                </ol>
                <h1 className="page-header">Performance Report</h1>
                <Panel loading={false}>
                    <PanelHeader>Tabel Performance Report</PanelHeader>
                    <PanelBody loading={false}>
                        <Row>
                            <Col sm="6">
                            </Col>
                            { this.state.modalOpen &&
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>Kembali</Button>
                                    </div>
                                </Col>
                            }
                            { this.state.modalPunishment &&
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        <Button color="danger" size="sm" disabled={this.state.loading} onClick={(e) => this.toggleFormClose(e)}>Kembali</Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col sm="12">
                                {view}
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
        user: state.auth.user.data,
        access: state.sidebarDt.access,
    }
}

const dispatchToProps = dispatch => {
	return {
		// fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchPeformanceReport: (params) => dispatch(fetchPeformanceReport(params)),
        showPunishmentVendor: (id) => dispatch(showPunishmentVendor(id)),
        showDetailPerformanceReport: (id) => dispatch(showDetailPerformanceReport(id)),
        syncVpr: (payload) => dispatch(syncVpr(payload)),
        downloadExcelPerformanceReport : () => dispatch(downloadExcelPerformanceReport()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PerformanceReport));
// export default connect(stateToProps)( withTranslation() (PerformanceReport));