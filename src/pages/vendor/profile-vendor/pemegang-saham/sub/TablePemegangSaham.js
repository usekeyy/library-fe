import React, { Component } from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import FormPemegangSaham from './FormPemegangSaham';
import ReactLoading from 'react-loading';

import { fetchPemegangSaham, savePemegangSaham, showPemegangSaham, updatePemegangSaham, deletePemegangSaham } from '../../../../../store/actions/vendor/profile-vendor/pemegangSahamActions'
import ReactTablePagination from '../../../../../components/paginations/ReactTablePagination';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import { statusVerifikasi, statusName } from '../../../../../helpers/statusName';
import NoteVerificationData from '../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../verification-data/HistoryInternal';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

class TablePemegangSaham extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
		this.child = React.createRef();

        this.state = {
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,		
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
            params: {
                the: this.props.user.uuid,
                start: 0,
                length: 0,
                column: '',
                dir: '',
                source : this.props.isInternal? 'master' : ''
            },
            defaultPageSize: 10,
            pages: 0,
            recordsTotal: 0,
            recordsFiltered: 0,
            column: 1,
            dir: '',
            page: 0,
            loading: false,
            modalOpen: false,
            isConfirm: false,
            uuid: '',
            uuid_delete : '',
            isError: false,
            errors: {},
            loadingSubmit: false,
            sendData: {
                created_at: '',
                created_by: '',
                id: '',
                ktp_file: '',
                ktp_no: '',
                name: '',
                npwp_file: '',
                npwp_no: '',
                shareholding: '',
                status: '',
                tipe_verifikasi: '',
                type: '',
                updated_at: '',
                updated_by: '',
                uuid: '',
                vendor_id: '',
            },
            load: {
                loadForm: false
            },
            statusSearch: [
                { name: 'Active', value: 'y', isChecked: false },
                { name: 'Inactive ', value: 'n', isChecked: false },
                { name: 'Suspend', value: 'p', isChecked: false },
                { name: 'Draft', value: 'd', isChecked: false },
                { name: 'Submitted', value: 's', isChecked: false }
            ],
            optionsType : [
                { label: 'Perorangan', value: 'perorangan' },
                { label: 'Perusahaan ', value: 'perusahaan' },
            ],
            verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				btn_approve: '',
                verifLength: 0,
                loadingNote: true,
                verifyAll: true
			},
			isStatusDraftVerif : false
        }
        this.defaultSorted = [
            {
                id: "name",
                desc: false
            }
        ];
        this.columns = [
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.jenis"),
                accessor: "type"
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.nama"),
                accessor: "name"
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.nomor-npwp"),
                accessor: "npwp_no"
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.file-npwp"),
                accessor: "npwp_file",
                Cell: ({original}) => (
					<React.Fragment>
                        <a href="/" onClick={ (e) => this.checkFileTemp(e,original.npwp_file)}>{original.npwp_file}</a>
						{/* <a target="_blank" rel="noopener noreferrer" href={(original.tipe_verifikasi === 'sudah_diverifikasi' || original.tipe_verifikasi === 'tambah_data' || original.tipe_verifikasi === 'submit_pendaftaran') ? `${process.env.REACT_APP_API_BASE_URL}files/vendor/${original.npwp_file}` : `${process.env.REACT_APP_API_BASE_URL}files/temp/${original.npwp_file}`} > {original.npwp_file} </a> */}
					</React.Fragment>
				)
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.nomor-ktp"),
                accessor: "ktp_no"
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.file-ktp"),
                accessor: "ktp_file",
                Cell: ({original}) => (
					<React.Fragment>
                        <a href="/" onClick={ (e) => this.checkFileTemp(e,original.ktp_file)}>{original.ktp_file}</a>
						{/* <a target="_blank" rel="noopener noreferrer" href={(original.tipe_verifikasi === 'sudah_diverifikasi' || original.tipe_verifikasi === 'tambah_data' || original.tipe_verifikasi === 'submit_pendaftaran') ? `${process.env.REACT_APP_API_BASE_URL}files/vendor/${original.ktp_file}` : `${process.env.REACT_APP_API_BASE_URL}files/temp/${original.ktp_file}`} > {original.ktp_file} </a> */}
					</React.Fragment>
				)
            },
            {
                Header: () => this.props.t("profileVendor:pemegang-saham.kepemilikan"),
                accessor: "shareholding"
            },
            {
                Header: "Status",
                id: "status",
                accessor: d => statusName(d.status),
            },
            {
                Header: () => this.props.t("profileVendor:status-verifikasi"),
                id: "tipe_verifikasi",
                accessor: d => statusVerifikasi(d.tipe_verifikasi),
            },
            {
                Header: "Action",
                id: "action",
                accessor: d => d,
                className: "sticky",
                headerClassName: "sticky",
                fixed: "right",
                filterable: false,
                sortable: false,
                Cell: ({ value }) => (
                    <React.Fragment>
                        {this.props.getId.verification_uuid !== false && <center>
                            {this.props.access.U && this.state.isVendor && !this.props.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-warning" onClick={(e) => this.showPayload(this.state.vendor_uuid, value.uuid)} ><i className="fa fa-edit"></i></button>}
                            {this.props.access.U && this.state.isVendor && !this.props.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.toggleConfirm(e, value.uuid)}  ><i className="fa fa-trash"></i></button>}
                            {this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-primary" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'pemegang_saham', { status: 'y' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-check"} disabled={this.state.verification.loadingButton}></span> </button>}
							{this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'pemegang_saham', { status: 'n' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-times"} disabled={this.state.verification.loadingButton}></span></button>}
                        </center>}
                    </React.Fragment>
                )
            },


        ];
    }

    setStatusDraftVerif = (status) => {
		this.setState({isStatusDraftVerif : status})
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

    checkFileTemp = async (e,file) => {
        e.preventDefault()
        let url = `${process.env.REACT_APP_API_BASE_URL}files/vendor/${file}`
        let url2 = `${process.env.REACT_APP_API_BASE_URL}files/temp/${file}`
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        try {
            http.send();
            if (http.status!==404){
                window.open(url)
            }else{
                window.open(url2)
            }
        } catch (error) {
            window.open(url)
        } 
    }

    checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false },
		}));
	}

	checkStatusLog = (value) => {
		this.setState(({ verification, sendData }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			sendData: { ...sendData, status: 'd' },
		}));
	}

    asyncData = async () => {
        this.setState({ loading: true })
        this.setLoadingForm(false);
        this.props.fetchPemegangSaham(this.state.vendor_uuid, this.state.params)
            .then((resp) => {
                this.setState({
                    data: resp.data.data,
                    pages: Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.params.length),
                    recordsFiltered: resp.data.recordsFiltered,
                    recordsTotal: resp.data.recordsTotal,
                    loading: false
                }, () => {
                    var found = false;
                    const arr = [];
                    let temp = false;
                    for(var i = 0; i < this.state.data.length; i++) {
                        if (this.state.data[i].status === 'y') {
                            arr.push(this.state.data[i].status)
                        }
                        if (this.state.data[i].status === 'n') {
                            // console.log("ooke");
                            found = true;
                            break;
                        }

                        if (this.state.data[i].tipe_verifikasi === 'update_data' || this.state.data[i].tipe_verifikasi === 'submit_pendaftaran' || this.state.data[i].tipe_verifikasi === 'tambah_data' || this.state.data[i].tipe_verifikasi === 'hapus_data'){
                            this.setStatusDraftVerif(true)
                            temp = true
                        }else{
                            !temp && this.setStatusDraftVerif(false)
                        }
                    }
                    this.checkStatus(found, resp.data.data.length, arr.length)
					this.setLoadingForm(false);
				})
			})
			.catch((resp) => {
				this.setState({ loading: false })
toastr.error(resp.data?.status, resp.data?.message);
			});
	}

	setLoadingForm = (type) => {
        this.setState(({ load }) => ({ load : { ...load, loadForm: type } }));
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

    savePayload = (payload) => {
        if (this._isMounted) {
            let formLoad = { ...this.state.load }
            formLoad.loadForm = true;
            this.setState({ formLoad, loadingSubmit: true });
            this.props.savePemegangSaham(this.state.vendor_uuid, payload)
                .then((resp) => {
                    this.resetForm()
                    let load = { ...this.state.load };
                    load.loadForm = false;
                    this.setState({ load, loadingSubmit: false , errors : {}}, () => this.req())
                    toastr.success(resp.data.message);
                })
                .catch(error => {
                    console.log(error)
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                        this.setState({ errors: error.data.errors, loadingSubmit: false })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    showPayload = (vendor_id, uuid) => {
        let load = { ...this.state.load };
        load.loadForm = true;
        this.setState({ load });
        this.props.showPemegangSaham(vendor_id, uuid)
            .then((resp) => {
                var data = resp.data.data;
                this.setState({ uuid: data.uuid });
                var setSendData = { ...this.state }
                setSendData.sendData.created_at = data.created_at;
                setSendData.sendData.created_by = data.created_by;
                setSendData.sendData.id = data.id;
                setSendData.sendData.ktp_file = data.ktp_file;
                setSendData.sendData.ktp_no = data.ktp_no;
                setSendData.sendData.name = data.name;
                setSendData.sendData.npwp_file = data.npwp_file;
                setSendData.sendData.npwp_no = data.npwp_no;
                setSendData.sendData.shareholding = data.shareholding;
                setSendData.sendData.status = data.status;
                setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
                if(data.type==="perorangan") {
                    setSendData.sendData.type ={ value: data.type, label: "Perorangan" };
                }else{
                    setSendData.sendData.type = { value :data.type ,label : "Perusahaan" };
                }
                setSendData.sendData.updated_at = data.updated_at;
                setSendData.sendData.updated_by = data.updated_by;
                setSendData.sendData.uuid = data.uuid;
                setSendData.sendData.vendor_id = data.vendor_id;
                setSendData.uuid = uuid;
                setSendData.load.loadForm = false;
                this.setState({ setSendData });                
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error(message);
            });
    }

    updatePayload = (id, payload) => {
        if (this._isMounted) {
            this.setState({ loadingSubmit: true });
            this.props.updatePemegangSaham(this.state.vendor_uuid, id, payload)
                .then((resp) => {
                    this.resetForm();
                    let load = { ...this.state.load };
                    load.loadForm = false;
                    toastr.success(resp.data.message);
                    this.setState({ load, modalOpen: false, loadingSubmit: false, uuid: '' }, () => this.req())
                })
                .catch((error) => {
                    this.setState({ errors: error.data.errors, loadingSubmit: false });
                })
        }
    }

    deletePayload = (vendor_uuid, uuid) => {
        this.props.deletePemegangSaham(vendor_uuid, uuid)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false });
                this.req()
            })
            .catch((error) => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ isError: true, errors: error.data.errors, loadingSubmit: false })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleConfirm = (e, value) => {
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid_delete: uuid })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.setState({ isConfirm: false}, () => this.deletePayload(this.state.vendor_uuid, this.state.uuid_delete));
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid_delete: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid_delete: '' });
                break;
        }
    }

    resetForm = () => {
        var setSendData = { ...this.state }
        setSendData.sendData.created_at = '';
        setSendData.sendData.created_by = '';
        setSendData.sendData.id = '';
        setSendData.sendData.ktp_file = '';
        setSendData.sendData.ktp_no = '';
        setSendData.sendData.name = '';
        setSendData.sendData.npwp_file = '';
        setSendData.sendData.npwp_no = '';
        setSendData.sendData.shareholding = '';
        setSendData.sendData.status = '';
        setSendData.sendData.tipe_verifikasi = '';
        setSendData.sendData.type = '';
        setSendData.sendData.updated_at = '';
        setSendData.sendData.updated_by = '';
        setSendData.sendData.uuid = '';
        setSendData.sendData.vendor_id = '';
        setSendData.uuid = '';
        setSendData.load.loadForm = true;
        this.setState({ setSendData });
    }

    cancelBtn = async () => {
        this.resetForm()
        setTimeout(() => {
            var setSendData = { ...this.state }
            setSendData.load.loadForm = false;
            setSendData.uuid = '';
            this.setState(setSendData);
        }, 1)
    }

    // VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ load }) => ({ load: { ...load, loadForm: true } }));
				this.setState(({ load, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					load: { ...load, loadForm: false }
				}), () => {
                    this.child.current.fetchData() && this.setState(({ verification }) => ({
						verification: { ...verification, loadingNote: false },
					}));
				});
                toastr.success('Success Save Verification Data');
                this.props.collapse();
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error(resp?.data?.message, resp?.data?.errors);
			});
		}
	}

	saveVerificationLineItem = (uuid, item_uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ 
				verification: { ...verification, loadingButton: true }, 
			}));

			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, errors: [] },
				}), () => {
					this.req();
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}

    render() {
        const {t} = this.props;
        const loading = this.state.load.loadForm;
        
        return (
            <div>
                {loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status === 'n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
                {!loading && this.state.isVendor &&
                    <FormPemegangSaham
                        optionTypes = {this.state.optionsType}
                        uuid={this.state.uuid}
                        data={this.state.sendData}
                        upload={this.props.fileUpload}
                        save={this.savePayload}
                        update={this.updatePayload}
                        cancelBtn={this.cancelBtn}
                        errors={this.state.errors}
                        loadingSubmit={this.state.loadingSubmit}
                        has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
                        isVendor={this.state.isVendor}
                    />
                }
                {!loading && <ReactTableFixedColumns
                    filterable={false}
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
                    page={this.state.page}
                    offResetFilter={true}
                    className="-highlight"
                    pages={this.state.pages}
                    onFetchData={(state, instance) => {
                        this.req(state);
                    }}
                />}
                {this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
                {!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state.data.length > 0 && <NoteVerificationData
                    status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.vendor_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"pemegang_saham"}
					access={this.props.access}
                    verification={this.saveVerificationItem}
                    status={this.state.sendData.status}
					isVerifMultiple={true}
                    isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.vendor_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"pemegang_saham"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
                    deleteVerificationItem={this.props.deleteVerificationLineItem} 
                    title={this.props.title} 
					isVerifMultiple={true}
                    checkStatusLog={this.checkStatusLog}
                    fetchData={this.asyncData}
                    showLogHistory={this.props.showLogHistory}
				/>}
                {!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.vendor_uuid} 
					path={"pemegang_saham"}
					access={this.props.access}
					title={this.props.title} 
					showLogHistory={this.props.showLogHistory}
				/>}
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel={true}
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert('confirm')}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
            </div>
        );
    }
}
const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
		vendor: state.vendorProfile.vendor,
        getId: state.vendorProfile,
		verification: state.verification.verification
    }
}

const dispatchToProps = dispatch => {
    return {
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        fetchPemegangSaham: (vendor_uuid, params) => dispatch(fetchPemegangSaham(vendor_uuid, params)),
        showPemegangSaham: (vendor_uuid, params) => dispatch(showPemegangSaham(vendor_uuid, params)),
        deletePemegangSaham: (vendor_uuid, params) => dispatch(deletePemegangSaham(vendor_uuid, params)),
        savePemegangSaham: (vendor_uuid, params) => dispatch(savePemegangSaham(vendor_uuid, params)),
        updatePemegangSaham: (vendor_uuid, id, params) => dispatch(updatePemegangSaham(vendor_uuid, id, params)),
        showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
        deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
    }
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(TablePemegangSaham));
