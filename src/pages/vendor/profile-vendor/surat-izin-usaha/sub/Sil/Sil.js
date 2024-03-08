import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormSil from './FormSil';
import TableSil from './TableSil';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { fetchVendorClassification } from '../../../../../../store/actions/master/vendorClassificationActions';
import { fetchVendorQualification } from '../../../../../../store/actions/master/vendorQualificationActions';
import { showSil,
				fetchSil,
				createSil,
				updateSil,
				deleteSil } from '../../../../../../store/actions/vendor/profile-vendor/suratIzinUsahaActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class Sil extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.childVerif = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			sil: {
				data: [],
				sendData: {
					id: '',
					uuid: '',
					number: '',
					file: '',
					start_date: '',
					end_date: '',
					issued_by: '',
					vendor_classification_id: '',
					vendor_qualification_id: '',
					main: '',
					status: '',
					tipe_verifikasi: '',
				},
				errors: [],
				classifications: [],
				qualifications: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				sil_type: false,
				classification: false,
				qualification: false
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
				dataLength : 0
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
			this.fetchVendorClassification()
			this.fetchVendorQualification()
			// this.fetchSil(this.state.user_uuid)
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	fetchVendorClassification = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, classification: true }}));
		this.props.fetchVendorClassification()
		.then((resp) => {
			let classifications = resp.data.data;
			let options = classifications.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name };
			})
			this.setState(({ sil, loadings }) => ({ 
				sil: { ...sil, classifications: options },
				loadings: { ...loadings, classification: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ sil, loadings }) => ({ 
				sil: { ...sil, errors: resp.data.errors, },
				loadings: { ...loadings, classification: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchVendorQualification = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, qualification: true } }));
		this.props.fetchVendorQualification()
		.then((resp) => {
			let qualifications = resp.data.data;
			let options = qualifications.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name };
			})
			this.setState(({ sil, loadings }) => ({ 
				sil: { ...sil, qualifications: options },
				loadings: { ...loadings, qualification: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ sil, loadings }) => ({ 
				sil: { ...sil, errors: resp.data.errors },
				loadings: { ...loadings, qualification: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false, dataLength : count }
		}));
	}

	setLoadingForm = (type) => {
    this.setState(({ sil }) => ({ sil : { ...sil, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.sil.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, sil }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false, },
			sil: { ...sil, sendData: setSendData },
		}));
	}

	showSil = (vendor_id, uuid) => {
		this.setState(({ sil }) => ({ sil: { ...sil, loading: true } }));
		this.props.showSil(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data;
			var setSendData = {...this.state.sil.sendData}
			if (data !== null) {
				setSendData.id = data.id;
				setSendData.uuid = data.uuid;
				setSendData.number = data.number;
				setSendData.name = data.name;
				setSendData.file = data.file;
				setSendData.start_date = data.start_date;
				setSendData.end_date = data.end_date;
				setSendData.issued_by = data.issued_by;
				setSendData.vendor_classification_id = {value: data.vendor_classification_id, label: data.vendor_classification_id+' - '+data.vendor_classification_name};
				setSendData.vendor_qualification_id = {value: data.vendor_qualification_id, label: data.vendor_qualification_id+' - '+data.vendor_qualification_name};
				setSendData.main = data.main;
				setSendData.status = data.status;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
			}
			this.setState(({ sil }) => ({
				sil: { ...sil, loading: false, data: data, errors: [], sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this.setState(({ sil }) => ({ sil: { ...sil, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchSil = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 500)
	}

	createSil = (payload) => {
		if(this._isMounted){
			this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: true } }));
			this.props.createSil(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ sil }) => ({ sil: { ...sil, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	updateSil = (id, payload) => {
		if(this._isMounted){
			this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: true } }));
			this.props.updateSil(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ sil }) => ({ sil: { ...sil, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	deleteSil = (id) => {
		if(this._isMounted){
			this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: true } }));
			this.props.deleteSil(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ sil }) => ({ sil: { ...sil, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ sil }) => ({ sil: { ...sil, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.sil.sendData}
		setSendData.id = ''; 
		setSendData.uuid = ''; 
		setSendData.number = ''; 
		setSendData.file = ''; 
		setSendData.start_date = ''; 
		setSendData.end_date = ''; 
		setSendData.issued_by = ''; 
		setSendData.vendor_classification_id = '';
		setSendData.vendor_qualification_id = '';
		setSendData.main = ''; 
		this.setState(({ sil }) => ({ sil: { ...sil, sendData: setSendData, loading: true } }));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true }
			}));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ sil }) => ({ sil: { ...sil, loading: true } }));
				this.setState(({ sil, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [],  loadingNote: true },
					sil: { ...sil, loading: false } 
				}), () => {
					this.child.current.fetchData();
					this.childVerif.current.fetchData() && this.setState(({ verification }) => ({
						verification: { ...verification, loadingNote: false },
					}));
				});
				toastr.success('Success Save Verification Data');
				this.props.collapse();
			})
			.catch((resp) => {
				this.setState(({ verification, sil }) => ({ 
					verification: { ...verification, errors: resp.data.errors, loadingButton: false, loading: false }
				}));
				toastr.error(resp?.data?.message, resp?.data?.errors);
			});
		}
	}

	saveVerificationLineItem = (uuid, item_uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ sil, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				sil: { ...sil, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ sil, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					sil: { ...sil, loadingButton: false } 
				}), () => {
					this.child.current.fetchData();
					this.fetchSil()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ sil, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					sil: { ...sil, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {loading} = this.state.sil;
		const {t} = this.props;
		console.log(this.state.sil)
		// const verification_table = (this.childVerif.current) ? this.childVerif.current.state.data.data : [];
		// console.log();
		// console.log(this.childVerif.current);
		// console.log((verification_table !== undefined) ? verification_table.length : 0);
		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status === 'n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor &&
				<FormSil 
					sil={this.state.sil} 
					save={this.createSil}
					update={this.updateSil}
					fetchSil={this.fetchSil}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && <TableSil
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					sil={this.state.sil} 
					access={this.props.access}
					data={this.state.sil.data}
					fetchSil={this.props.fetchSil}
					showSil={this.showSil}
					delete={this.deleteSil}
					isVendor={this.state.isVendor}
					user_uuid={this.state.user_uuid}
					path={"surat_izin_lainnya"}
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
				{!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && this.state.verification.dataLength > 0 && <NoteVerificationData
					status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.user_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"surat_izin_lainnya"}
					access={this.props.access}
					verification={this.saveVerificationItem}
					status={this.state.sil.sendData.status}
					isVerifMultiple={true}
					isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.childVerif}
					vendor_uuid={this.state.user_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"surat_izin_lainnya"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
					deleteVerificationItem={this.props.deleteVerificationLineItem} 
					title={this.props.title} 
					isVerifMultiple={true}
					checkStatusLog={this.checkStatusLog}
					fetchData={this.fetchSil}
					showLogHistory={this.props.showLogHistory}
				/>}
				{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.user_uuid} 
					path={"surat_izin_lainnya"}
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
		fetchVendorClassification: (params) => dispatch(fetchVendorClassification(params)),
		fetchVendorQualification: (params) => dispatch(fetchVendorQualification(params)),
		createSil: (vendor_id, payload) => dispatch(createSil(vendor_id, payload)),
		showSil: (vendor_id, id) => dispatch(showSil(vendor_id, id)),
		fetchSil: (vendor_id, payload) => dispatch(fetchSil(vendor_id, payload)),
		updateSil: (vendor_id, id, payload) => dispatch(updateSil(vendor_id, id, payload)),
		deleteSil: (vendor_id, id) => dispatch(deleteSil(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Sil));