import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormNpwp from './FormNpwp';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { showNpwp,
				updateNpwp } from '../../../../../../store/actions/vendor/profile-vendor/informasiLegalActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class Npwp extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			vendor_npwp: {
				data: {},
				sendData: {
					id: '',
					uuid: '',
					npwp_number: '',
					npwp_file: '',
					npwp_date: '',
					status: '',
					tipe_verifikasi: '',
					created_at: '',
					udpated_at: '',
					created_by: '',
					updated_by: '',
				},
				errors: [],
				loading: true,
				loadingButton: false,
			},
			verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				verifLength: 0,
				loadingNote: true,
			}
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			this.showNpwp(this.state.user_uuid)
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	showNpwp = async (id) => {
		this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loading: true } }));
		let params = this.props.isInternal ? {source : 'master'} : ''
		this.props.showNpwp(id,params)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.vendor_npwp.sendData}
			if (data !== null) {
				setSendData.id = data.id;
				setSendData.uuid = data.uuid;
				setSendData.npwp_number = data.nomor;
				setSendData.npwp_file = data.file;
				setSendData.npwp_date = data.tanggal_terdaftar;
				setSendData.status = data.status;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
				setSendData.created_at = data.created_at;
				setSendData.udpated_at = data.udpated_at;
				setSendData.created_by = data.created_by;
				setSendData.updated_by = data.updated_by;
			}
			this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loading: false, data: data, sendData: setSendData, errors: [] } }));
		})
		.catch((resp) => {
			this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loading: true } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	updateNpwp = (payload) => {
		if(this._isMounted){
			this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loadingButton: true } }));
			this.props.updateNpwp(this.state.user_uuid, payload)
			.then((resp) => {
				this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loadingButton: false, errors: [] } }), () => {
					this.showNpwp(this.state.user_uuid)
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ vendor_npwp }) => ({ vendor_npwp: { ...vendor_npwp, loading: true } }));
				this.setState(({ vendor_npwp, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					vendor_npwp: { ...vendor_npwp, loading: false } 
				}), () => {
					setTimeout(() => {
						this.child.current.fetchData() && this.showNpwp(this.state.user_uuid) && this.setState(({ verification }) => ({
							verification: { ...verification, loadingNote: false },
						}));
					}, 100)
				});
				toastr.success('Success Save Verification Data');
				this.props.collapse();
			})
			.catch((resp) => {
				this.setState(({ verification }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false }, 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}

	checkStatusLog = (value) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
		}));
	}
	
	render() {
		const {loading} = this.state.vendor_npwp;
		const {t} = this.props;
		
		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}

				{!loading && <FormNpwp 
					npwp={this.state.vendor_npwp} 
					save={this.updateNpwp} 
					upload={this.props.fileUpload}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					isVendor={this.state.isVendor}/>}
					{!loading && this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
					{!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state.vendor_npwp.data !== null && <NoteVerificationData
						status_vendor={this.props.verification.status_vendor} 
						data={this.state.verification} 
						vendor_uuid={this.state.user_uuid}
						verification_uuid={this.props.getId.verification_uuid}
						path={"vendor_npwp"}
						access={this.props.access}
						verification={this.saveVerificationItem}
						status={this.state.vendor_npwp.sendData.status}
						isVerifMultiple={true}
					/>}
					{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
					<TableVerificationData 
						ref={this.child}
						vendor_uuid={this.state.user_uuid} 
						verification_uuid={this.props.getId.verification_uuid}
						path={"vendor_npwp"}
						access={this.props.access}
						showVerification={this.props.showVerificationItem} 
						saveVerificationItem={this.props.saveVerificationLineItem}
						deleteVerificationItem={this.props.deleteVerificationLineItem} 
						title={this.props.title} 
						isVerifMultiple={true}
						checkStatusLog={this.checkStatusLog}
						showLogHistory={this.props.showLogHistory}
					/>}
					{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
						vendor_uuid={this.state.user_uuid} 
						path={"vendor_npwp"}
						access={this.props.access}
						title={this.props.title} 
						showLogHistory={this.props.showLogHistory}
					/>}
			</div>
		)
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
		showNpwp: (id,params) => dispatch(showNpwp(id,params)),
		updateNpwp: (id, payload) => dispatch(updateNpwp(id, payload)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Npwp));