import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormAkta from './FormAkta';
import TableAkta from './TableAkta';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { showAkta,
				fetchAkta,
				createAkta,
				updateAkta,
				deleteAkta } from '../../../../../../store/actions/vendor/profile-vendor/informasiLegalActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class Akta extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			akta: {
				data: [],
				sendData: {
					uuid: '',
					number: '',
					type: '',
					file: '',
					date: '',
					notaris_name: '',
					notaris_address: '',
					menkumham_date: '',
					menkumham_file: '',
					status: '',
					akta_types: [
						{ value: "Akta Pendirian", label: "Akta Pendirian" },
						{ value: "Akta Perubahan", label: "Akta Perubahan" }
					],
				},
				errors: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				akta_type: false
			},
			verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				btn_approve: '',
				verifLength: 0,
				loadingNote: true,
				verifyAll: true,
				dataLenght : 0
			},
			isStatusDraftVerif : false
		};
	}

	setStatusDraftVerif = (status) => {
		this.setState({isStatusDraftVerif : status})
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			// this.fetchAkta(this.state.user_uuid)
		}
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
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false, dataLenght : count },
		}));
	}

	setLoadingForm = (type) => {
    this.setState(({ akta }) => ({ akta : { ...akta, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.akta.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, akta }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			akta: { ...akta, sendData: setSendData },
		}));
	}

	showAkta = (vendor_id, uuid) => {
		this.setState(({ akta }) => ({ akta: { ...akta, loading: true } }));
		this.props.showAkta(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.akta.sendData}
			if (data !== null) {
				setSendData.type = {value: data.type, label: data.type};
				setSendData.uuid = data.uuid;
				setSendData.number = data.number;
				setSendData.file = data.file;
				setSendData.date = data.date;
				setSendData.notaris_name = data.notaris_name;
				setSendData.notaris_address = data.notaris_address;
				setSendData.menkumham_date = data.menkumham_date;
				setSendData.menkumham_file = data.menkumham_file;
				setSendData.status = data.status;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
			}
			this.setState(({ akta }) => ({
				akta: { ...akta, loading: false, data: data, errors: [], sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this.setState(({ akta }) => ({ akta: { ...akta, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchAkta = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 1)
	}

	createAkta = (payload) => {
		if(this._isMounted){
			this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: true } }));
			this.props.createAkta(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ akta }) => ({ akta: { ...akta, errors: resp.data.errors, loadingButton: false } }));
				// toastr.error(resp.data.message, resp.data.status);
				let alert = ''
				for (const [ value] of Object.entries(resp.data.errors)) {
					alert = alert+  "\n" + value
				}
				toastr.error(resp.data.message, alert);
			});
		}
	}
	
	updateAkta = (id, payload) => {
		if(this._isMounted){
			this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: true } }));
			this.props.updateAkta(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ akta }) => ({ akta: { ...akta, errors: resp.data.errors, loadingButton: false } }));
				// toastr.error(resp.data.message, resp.data.status);
				let alert = ''
				for (const [ value] of Object.entries(resp.data.errors)) {
					alert = alert+  "\n" + value
				}
				toastr.error(resp.data.message, alert);
			});
		}
	}

	deleteAkta = (id) => {
		if(this._isMounted){
			this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: true } }));
			this.props.deleteAkta(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ akta }) => ({ akta: { ...akta, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ akta }) => ({ akta: { ...akta, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.akta.sendData}
		setSendData.uuid = '';
		setSendData.type = '';
		setSendData.number = '';
		setSendData.file = '';
		setSendData.date = '';
		setSendData.notaris_name = '';
		setSendData.notaris_address = '';
		setSendData.menkumham_date = '';
		setSendData.menkumham_file = '';
		this.setState(({ akta }) => ({ akta: { ...akta, sendData: setSendData, loading: true } }));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ akta }) => ({ akta: { ...akta, loading: true } }));
				this.setState(({ akta, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					akta: { ...akta, loading: false } 
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
			this.setState(({ akta, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				akta: { ...akta, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ akta, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					akta: { ...akta, loadingButton: false } 
				}), () => {
					// this.child.current.fetchData();
					this.fetchAkta()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ akta, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					akta: { ...akta, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {t} = this.props;
		const loading = this.state.akta.loading
		// console.log(loading);
		return (
			<div>
				{(this.state.akta.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{!this.state.akta.loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{this.state.akta.loading === false && this.state.isVendor === true &&
				<FormAkta 
					akta={this.state.akta} 
					save={this.createAkta}
					update={this.updateAkta}
					fetchAkta={this.fetchAkta}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{this.state.akta.loading === false && <TableAkta
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					access={this.props.access}
					data={this.state.akta.data}
					akta={this.state.akta} 
					fetchAkta={this.props.fetchAkta}
					showAkta={this.showAkta}
					delete={this.deleteAkta}
					user_uuid={this.state.user_uuid}
					isVendor={this.state.isVendor}
					path={"akta_perusahaan"}
					checkStatus={this.checkStatus}
					saveVerificationItem={this.saveVerificationLineItem}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					status_vendor={this.props.verification.status_vendor}
					verification_uuid={this.props.getId.verification_uuid}
					setLoadingForm={this.setLoadingForm}
					setStatusDraftVerif={this.setStatusDraftVerif}
					isInternal = {this.props.isInternal}
				/>}
				{this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				<div>
					{!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false &&  this.state.verification.dataLenght > 0 && <NoteVerificationData
						status_vendor={this.props.verification.status_vendor} 
						data={this.state.verification} 
						vendor_uuid={this.state.user_uuid}
						verification_uuid={this.props.getId.verification_uuid}
						path={"akta_perusahaan"}
						access={this.props.access}
						verification={this.saveVerificationItem}
						status={this.state.akta.sendData.status}
						isVerifMultiple={true}
						isStatusDraftVerif={this.state.isStatusDraftVerif}
					/>}
					{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false && <TableVerificationData 
						ref={this.child}
						vendor_uuid={this.state.user_uuid} 
						verification_uuid={this.props.getId.verification_uuid}
						path={"akta_perusahaan"}
						access={this.props.access}
						showVerification={this.props.showVerificationItem}
						saveVerificationItem={this.props.saveVerificationLineItem}
						deleteVerificationItem={this.props.deleteVerificationLineItem}  
						title={this.props.title} 
						isVerifMultiple={true}
						checkStatusLog={this.checkStatusLog}
						fetchData={this.fetchAkta}
						showLogHistory={this.props.showLogHistory}
					/>}

					{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
						vendor_uuid={this.state.user_uuid} 
						path={"akta_perusahaan"}
						access={this.props.access}
						title={this.props.title} 
						showLogHistory={this.props.showLogHistory}
					/>}
					
				</div>
			</div>
		)
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
		createAkta: (vendor_id, payload) => dispatch(createAkta(vendor_id, payload)),
		showAkta: (vendor_id, id) => dispatch(showAkta(vendor_id, id)),
		fetchAkta: (vendor_id, payload) => dispatch(fetchAkta(vendor_id, payload)),
		updateAkta: (vendor_id, id, payload) => dispatch(updateAkta(vendor_id, id, payload)),
		deleteAkta: (vendor_id, id) => dispatch(deleteAkta(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Akta));