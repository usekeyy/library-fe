import React, { Component } from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import FormSuratKetFiskal from './FormSuratKetFiskal';
import ReactTablePagination from '../../../../../../components/paginations/ReactTablePagination';
import { fetchPajakFiskal, savePajakFiskal, updatePajakFiskal, showPajakFiskal, deletePajakFiskal } from '../../../../../../store/actions/vendor/profile-vendor/pajakFiskalActions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import ReactLoading from 'react-loading'
import SweetAlert from 'react-bootstrap-sweetalert';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { statusVerifikasi, statusName } from '../../../../../../helpers/statusName';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import { formatDate } from '../../../../../../helpers/formatDate';
import HistoryInternal from '../../../../verification-data/HistoryInternal';
import { checkFileTempVendor } from '../../../../../../helpers/globalHelper';

const ReactTableFixedColumns = withFixedColumns(ReactTable);



class PajakFiskal extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();

		this.state = {
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,			
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			params: {
				start: 0,
				length: 10,
				page: 0,
				source : this.props.isInternal ? 'master' : ''
			},
			defaultPageSize: 10,
			pages: 0,
			recordsTotal: 0,
			recordsFiltered: 0,
			column: 1,
			dir: "",
			page: 0,
			data: [],
			access: this.props.access,
			errors: [],
			total: 0,
			isConfirm: false,
			uuid: '',
			uuid_delete: "",
			load: {
				loadForm: false
			},
			sendData: {
				date: '',
				file: '',
				issued_by: '',
				number: '',
				status: '',
				tipe_verifikasi: '',
				start_date:'',
				end_date:''
			},
			pajak_fiskal: {
				data: [],
				sendData: { },
				errors: [],
			},
			toggleAdd: false,
			loading: false,
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
				Header: () => this.props.t('profileVendor:sppkp.dikeluarkan'),
				id: "issued_by",
				accessor: d => d.issued_by,
			},
			{
				Header: () => this.props.t('profileVendor:fiskal.nomor'),
				id: "number",
				accessor: d => d.number,
			},
			{
				Header: () => this.props.t('profileVendor:sppkp.berlaku-sejak'),
				id: "start_date",
				accessor: d => formatDate(d.start_date, false),
			},
			{
				Header: () => this.props.t('profileVendor:sppkp.berlaku-sampai'),
				id: "end_date",
				accessor: d => formatDate(d.end_date, false),
			},
			{
				Header: () => this.props.t('profileVendor:fiskal.file'),
				id: "file",
				accessor: d => d.file,
				Cell: ({value}) => (
					<React.Fragment>
						<a href="/" onClick={ (e) => checkFileTempVendor(e,value)}>{value}</a>
						{/* {(value!=="" && value !==null)? <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${value}` } > {value} </a> : ''} */}
					</React.Fragment>
				)
			},
			{
        Header: "Status",
        id: "status",
        accessor: d => statusName(d.status),
	  },
	  {
        Header: "Status Expired",
        id: "status_expired",
        accessor: d => d.status_expired,
      },
      {
        Header: () => this.props.t('profileVendor:status-verifikasi'),
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
							{this.props.access.U && this.state.isVendor && !this.props.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-warning" onClick={(e) => this.showPayload(this.state.vendor_uuid, value.uuid)}  ><i className="fa fa-edit"></i></button>}
							{this.props.access.U && this.state.isVendor && !this.props.has_draft_verification && <button disabled={this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.toggleConfirm(e, value.uuid)} ><i className="fa fa-trash"></i></button>}
							{this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-primary" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'dokumen_pajak_fiskal', { status: 'y' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-check"} disabled={this.state.verification.loadingButton}></span> </button>}
							{this.props.access.A && !this.state.isVendor && (value.status !== 'y') && <button disabled={value.status === 'y' || this.state.verification.verifLength > 0} className="btn btn-xs btn-danger" onClick={(e) => this.saveVerificationLineItem(this.state.vendor_uuid, value.uuid, 'dokumen_pajak_fiskal', { status: 'n' })}><span className={ (this.state.verification.loadingButton) ? "fas fa-spinner fa-pulse" : "fas fa-times"} disabled={this.state.verification.loadingButton}></span></button>}
						</center>}
					</React.Fragment>
				)
			},
		]
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

	checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false },
		}));
	}

	checkStatusLog = (value) => {
		this.setState(({ verification, sendData }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false, },
			sendData: { ...sendData, status: 'd' },
		}));
	}
	
	asyncData = async () => {
		this.setState({ loading: true })
		this.setLoadingForm(false);
		this.props.fetchPajakFiskal(this.state.vendor_uuid, this.state.params)
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
toastr.error(resp.data.status, resp.data.message);
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
			this.setState({ loadingSubmit: true });
			this.props.savePajakFiskal(this.state.vendor_uuid, payload)
				.then((resp) => {
					this.resetForm()
					let load = { ...this.state.load };
					load.loadForm = false;
					this.setState({ load, loadingSubmit: false }, () => this.req())
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
		this.setState({ load, errors: {} });
		this.props.showPajakFiskal(vendor_id, uuid)
			.then((resp) => {
				var data = resp.data.data;
				this.setState({ uuid: data.uuid });
				var setSendData = { ...this.state }
				setSendData.sendData.date = data.date;
				setSendData.sendData.file = data.file;
				setSendData.sendData.issued_by = data.issued_by;
				setSendData.sendData.number = data.number;
				setSendData.sendData.status = data.status;
				setSendData.sendData.tipe_verifikasi = data.tipe_verifikasi;
				setSendData.sendData.end_date = data.end_date;
				setSendData.sendData.start_date = data.start_date;
				setSendData.uuid = uuid;
				setSendData.load.loadForm = false;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
				this.setState({ setSendData });
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				toastr.error(message);
				this.setState(({ load }) => ({
					load : { ...load, loadForm: false },
				}));
			});
	}

	updatePayload = (id, payload) => {
		if (this._isMounted) {
			this.setState({ loadingSubmit: true });
			this.props.updatePajakFiskal(this.state.vendor_uuid, id, payload)
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
		this.props.deletePajakFiskal(vendor_uuid, uuid)
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
				this.deletePayload(this.state.vendor_uuid, this.state.uuid_delete)
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
		setSendData.sendData.date = "";
		setSendData.sendData.file = "";
		setSendData.sendData.issued_by = "";
		setSendData.sendData.number = "";
		setSendData.sendData.status = "";
		setSendData.uuid = '';
		setSendData.errors = {};
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
		const { t } = this.props
		const loading = this.state.load.loadForm;

		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor &&
					<FormSuratKetFiskal
						save={this.savePayload}
						update={this.updatePayload}
						uuid={this.state.uuid}
						cancelBtn={this.cancelBtn}
						data={this.state.sendData}
						errors={this.state.errors}
						upload={this.props.fileUpload}
						loadingSubmit={this.state.loadingSubmit}
						isVendor={this.state.isVendor}
						has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
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
					className="-highlight"
					pages={this.state.pages}
					offResetFilter={true}
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
					path={"dokumen_pajak_fiskal"}
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
					path={"dokumen_pajak_fiskal"}
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
                        path={"dokumen_pajak_fiskal"}
                        access={this.props.access}
                        title={this.props.title} 
                        showLogHistory={this.props.showLogHistory}
                      />}
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
		);
	}
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		vendor: state.vendorProfile.vendor,
		user: state.auth.user.data,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		fetchPajakFiskal: (id,params) => dispatch(fetchPajakFiskal(id,params)),
		savePajakFiskal: (vendor_uuid, params) => dispatch(savePajakFiskal(vendor_uuid, params)),
		showPajakFiskal: (vendor_uuid, params) => dispatch(showPajakFiskal(vendor_uuid, params)),
		deletePajakFiskal: (vendor_uuid, params) => dispatch(deletePajakFiskal(vendor_uuid, params)),
		updatePajakFiskal: (vendor_uuid, id, params) => dispatch(updatePajakFiskal(vendor_uuid, id, params)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}
export default connect(stateToProps, dispatchToProps)(withTranslation()(PajakFiskal));
