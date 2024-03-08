import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormPaktaIntegritas from './FormPaktaIntegritas';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { fetchPaktaIntegritas,
				updatePaktaIntegritas, 
				downloadPaktaIntegritas } from '../../../../../../store/actions/vendor/profile-vendor/paktaIntegritasActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import { showProfileVendor } from '../../../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import Term from './Term';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class PaktaIntegritas extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			file_pakta: '/app-assets/files/Form_Pakta_Integritas Rekanan_Baru.doc',
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			pakta_integritas: {
				data: [],
				sendData: {
					uuid: '',
					status_approval: '',
					file: '',
					status: '',
					tipe_verifikasi: '',
				},
				errors: [],
				loading: false,
				loadingButton: false
			},
			tempData: '',
			loadings: {
				pakta_integritas_type: false
			},
			verification: {
				note: '',
				errors: [],
				loadingButton: false,
				loading: false,
				btn_approve: '',
				verifLength: 0,
				loadingNote: true
			}
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			this.fetchPaktaIntegritas()
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	fetchPaktaIntegritas = async () => {
		let params = this.props.isInternal ? {source : 'master'} : ''
		this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: true } }));
		this.props.fetchPaktaIntegritas(this.state.user_uuid,params)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.pakta_integritas.sendData}
			if (data !== null) {
				setSendData.uuid = data.uuid;
				setSendData.status_approval = data.status_approval;
				setSendData.file = data.file;
				setSendData.status = data.status;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
			}
			this.setState(({ pakta_integritas }) => ({
				pakta_integritas: { ...pakta_integritas, data: resp.data, errors: [], sendData: setSendData }
			}), () => this.showProfileVendor(this.state.user_uuid));
		})
		.catch((resp) => {
				this.setState({loading: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false } }));
				toastr.error(message);
		});
	}

	downloadPaktaIntegritas = () => {
		this.props.downloadPaktaIntegritas(this.state.user_uuid)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `PAKTA_INTEGRITAS_${this.state.user_uuid}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
				this.setState({loading: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false } }));
				toastr.error(message);
		});
	}

	showProfileVendor = async (uuid) => {
		this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: true } }));
		this.props.showProfileVendor(uuid)
			.then((resp) => {
				var data = resp.data.data;
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false }, tempData: data }));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				toastr.error(message);
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false } }));
			});
	}

	updatePaktaIntegritas = (payload) => {
		if(this._isMounted){
			this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loadingButton: true } }));
			this.props.updatePaktaIntegritas(this.state.user_uuid, payload)
			.then((resp) => {
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false, loadingButton: false, errors: [] } }), () => this.fetchPaktaIntegritas());
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, loading: false, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	handleStatus = (type) => {
		const setSendData = {...this.state.pakta_integritas.sendData}
		setSendData.status_approval = type
		this.setState(({ pakta_integritas }) => ({
			pakta_integritas: { ...pakta_integritas, sendData: setSendData }
		}));
	}

	resetForm = () => {
		var setSendData = {...this.state.pakta_integritas.sendData}
		setSendData.uuid = '';
		setSendData.status_approval = '';
		setSendData.file = '';
		this.setState(({ pakta_integritas }) => ({ pakta_integritas: { ...pakta_integritas, sendData: setSendData, loading: true } }));
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
						this.child.current.fetchData() && this.fetchPaktaIntegritas() && this.setState(({ verification }) => ({
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
		const {t} = this.props;
		const loading = this.state.pakta_integritas.loading;
		return (
			<div>
				{(loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{ !loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{loading === false &&
				<div>
					{this.state.isVendor && <Term
						t={t}
						file_pakta={this.state.file_pakta}
						pakta_integritas={this.state.pakta_integritas}
						isVendor={this.state.isVendor}
						user={this.props.user}
						downloadPaktaIntegritas={this.downloadPaktaIntegritas}
						tempData={this.state.tempData}
					/>}
					<FormPaktaIntegritas 
						pakta_integritas={this.state.pakta_integritas} 
						save={this.updatePaktaIntegritas}
						fetchPaktaIntegritas={this.fetchPaktaIntegritas}
						handleStatus={this.handleStatus}
						upload={this.props.fileUpload}
						loadings={this.state.loadings}
						isVendor={this.state.isVendor}
						has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
						file_pakta={this.state.file_pakta}
					/>
				</div>}
				{!loading && this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state.pakta_integritas.sendData?.uuid && <NoteVerificationData
						status_vendor={this.props.verification.status_vendor} 
						data={this.state.verification} 
						vendor_uuid={this.state.user_uuid}
						verification_uuid={this.props.getId.verification_uuid}
						path={"pakta_integritas"}
						access={this.props.access}
						verification={this.saveVerificationItem}
						status={this.state.pakta_integritas.sendData.status}
						isVerifMultiple={true}
					/>}
					{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
					<TableVerificationData 
						ref={this.child}
						vendor_uuid={this.state.user_uuid} 
						verification_uuid={this.props.getId.verification_uuid}
						path={"pakta_integritas"}
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
						path={"pakta_integritas"}
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
		fetchPaktaIntegritas: (vendor_id, payload) => dispatch(fetchPaktaIntegritas(vendor_id, payload)),
		downloadPaktaIntegritas: (vendor_id, payload) => dispatch(downloadPaktaIntegritas(vendor_id, payload)),
		updatePaktaIntegritas: (vendor_id, payload) => dispatch(updatePaktaIntegritas(vendor_id, payload)),
		showProfileVendor: (uuid) => dispatch(showProfileVendor(uuid)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(PaktaIntegritas));