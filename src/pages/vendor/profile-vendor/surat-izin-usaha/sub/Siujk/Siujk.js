import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormSiujk from './FormSiujk';
import TableSiujk from './TableSiujk';
import { fileUpload } from '../../../../../../store/actions/uploadActions';
import { fetchVendorClassification } from '../../../../../../store/actions/master/vendorClassificationActions';
import { fetchVendorSubClassification } from '../../../../../../store/actions/master/vendorSubClassificationActions';
import { fetchVendorQualification } from '../../../../../../store/actions/master/vendorQualificationActions';
import { showSiujk,
				fetchSiujk,
				createSiujk,
				updateSiujk,
				deleteSiujk } from '../../../../../../store/actions/vendor/profile-vendor/suratIzinUsahaActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class Siujk extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			siujk: {
				data: [],
				sendData: {
					id: '',
					uuid: '',
					number: '',
					file: '',
					start_date: '',
					end_date: '',
					issued_by: '',
					vendor_classification_id: [],
					vendor_sub_classification_id: [],
					vendor_qualification_id: '',
					main: '',
					status: '',
				},
				errors: [],
				classifications: [],
				sub_classifications: [],
				selected_classification: [],
				selected_sub_classification: [],
				qualifications: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				siujk_type: false,
				classification: false,
				sub_classification: false,
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
			// this.fetchSiujk(this.state.user_uuid)
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
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, classifications: options },
				loadings: { ...loadings, classification: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, errors: resp.data.errors, },
				loadings: { ...loadings, classification: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchVendorSubClassification = (isParam, param) => {
		if(isParam.length > 0){
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, sub_classifications: [] },
				loadings: { ...loadings, sub_classification: true },
			}));
			this.props.fetchVendorSubClassification(param)
			.then((resp) => {
				let sub_classifications = resp.data.data;
				let options = sub_classifications.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name, vendor_classification_id: dt.vendor_classification_id };
				})
				this.setState(({ siujk, loadings }) => ({ 
					siujk: { ...siujk, sub_classifications: options },
					loadings: { ...loadings, sub_classification: false },
				}));
			})
			.catch((resp) => {
				this.setState(({ siujk, loadings }) => ({ 
					siujk: { ...siujk, errors: resp.data.errors, sub_classifications: [] },
					loadings: { ...loadings, sub_classification: false },
				}));
				toastr.error(resp.data.message, resp.data.status);
			});
		} else {
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, sub_classifications: [] },
				loadings: { ...loadings, sub_classification: false },
			}));
		}
	}

	fetchVendorQualification = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, qualification: true } }));
		this.props.fetchVendorQualification()
		.then((resp) => {
			let qualifications = resp.data.data;
			let options = qualifications.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name };
			})
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, qualifications: options },
				loadings: { ...loadings, qualification: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ siujk, loadings }) => ({ 
				siujk: { ...siujk, errors: resp.data.errors },
				loadings: { ...loadings, qualification: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	checkStatus = (status, count, verify) => {
		this.setState(({ verification }) => ({
			verification: { ...verification, btn_approve: (status) ? 'n' : 'anjay', verifyAll: (count !== 0) ? count === verify : false, dataLength : count },
		}));
	}

	setLoadingForm = (type) => {
    this.setState(({ siujk }) => ({ siujk : { ...siujk, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.siujk.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, siujk }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			siujk: { ...siujk, sendData: setSendData },
		}));
	}

	showSiujk = (vendor_id, uuid) => {
		this.setState(({ siujk }) => ({ siujk: { ...siujk, loading: true } }));
		this.props.showSiujk(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data[0];
			var datas = resp.data.data;
			const classification = []
			const sub_classification = []
			const classification_id = []
			const sub_classification_id = []

			var setSendData = {...this.state.siujk.sendData}
			if (data !== null) {
				setSendData.id = data.id;
				setSendData.uuid = data.uuid;
				setSendData.number = data.number;
				setSendData.file = data.file;
				setSendData.start_date = data.start_date;
				setSendData.end_date = data.end_date;
				setSendData.issued_by = data.issued_by;
				if (datas.length > 0) {
					datas.map(item => {
						classification.push({ value: item.classification_id, label: `${item.classification_id} - ${item.classification_name}` })
						classification_id.push(item.classification_id)
						JSON.parse(item.sub_classification).map(sub => {
							if(sub.vendor_classification_id === item.classification_id){
								sub_classification.push({ value: sub.id, label: `${sub.id} - ${sub.name}`, vendor_classification_id: sub.vendor_classification_id })
								sub_classification_id.push(sub.id)
							}
							return true;
						})
						return true;
					})
					this.fetchVendorSubClassification(classification, classification_id.join(";"))
				}
				setSendData.vendor_classification_id = classification;
				setSendData.vendor_sub_classification_id = sub_classification;
				setSendData.vendor_qualification_id = {value: data.vendor_qualification_id, label: data.vendor_qualification_id+' - '+data.qualification_name};
				setSendData.main = data.main;
				setSendData.status = data.status;
			}
			this.setState(({ siujk }) => ({
				siujk: { ...siujk, loading: false, data: data, errors: [], sendData: setSendData, selected_classification: classification_id, selected_sub_classification: sub_classification_id }
			}));
		})
		.catch((resp) => {
			this.setState(({ siujk }) => ({ siujk: { ...siujk, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchSiujk = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 500)
	}

	createSiujk = (payload) => {
		if(this._isMounted){
			this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: true } }));
			this.props.createSiujk(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ siujk }) => ({ siujk: { ...siujk, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	updateSiujk = (id, payload) => {
		if(this._isMounted){
			this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: true } }));
			this.props.updateSiujk(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ siujk }) => ({ siujk: { ...siujk, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	deleteSiujk = (id) => {
		if(this._isMounted){
			this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: true } }));
			this.props.deleteSiujk(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ siujk }) => ({ siujk: { ...siujk, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ siujk }) => ({ siujk: { ...siujk, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.siujk.sendData}
		setSendData.id = ''; 
		setSendData.uuid = ''; 
		setSendData.number = ''; 
		setSendData.file = ''; 
		setSendData.start_date = ''; 
		setSendData.end_date = ''; 
		setSendData.status = ''; 
		setSendData.issued_by = ''; 
		setSendData.vendor_classification_id = [];
		setSendData.vendor_sub_classification_id = [];
		setSendData.vendor_qualification_id = '';
		setSendData.main = ''; 
		this.setState(({ siujk }) => ({ siujk: { ...siujk, sendData: setSendData, loading: true } }));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ siujk }) => ({ siujk: { ...siujk, loading: true } }));
				this.setState(({ siujk, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					siujk: { ...siujk, loading: false } 
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
			this.setState(({ siujk, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				siujk: { ...siujk, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ siujk, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					siujk: { ...siujk, loadingButton: false } 
				}), () => {
					// this.child.current.fetchData();
					this.fetchSiujk()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ siujk, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					siujk: { ...siujk, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {loading} = this.state.siujk;
		const {t} = this.props;

		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status === 'n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor === true &&
				<FormSiujk 
					siujk={this.state.siujk} 
					save={this.createSiujk}
					update={this.updateSiujk}
					fetchSiujk={this.fetchSiujk}
					fetchVendorSubClassification={this.fetchVendorSubClassification}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && <TableSiujk
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					access={this.props.access}
					data={this.state.siujk.data}
					siujk={this.state.siujk} 
					fetchSiujk={this.props.fetchSiujk}
					showSiujk={this.showSiujk}
					delete={this.deleteSiujk}
					isVendor={this.state.isVendor}
					user_uuid={this.state.user_uuid}
					path={"surat_izin_siujk"}
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
					path={"surat_izin_siujk"}
					access={this.props.access}
					verification={this.saveVerificationItem}
					status={this.state.siujk.sendData.status}
					isVerifMultiple={true}
					isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.user_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"surat_izin_siujk"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
					deleteVerificationItem={this.props.deleteVerificationLineItem} 
					title={this.props.title} 
					isVerifMultiple={true}
					checkStatusLog={this.checkStatusLog}
					fetchData={this.fetchSiujk}
					showLogHistory={this.props.showLogHistory}
				/>}
				{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.user_uuid} 
					path={"surat_izin_siujk"}
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
		fetchVendorSubClassification: (params) => dispatch(fetchVendorSubClassification(params)),
		fetchVendorQualification: (params) => dispatch(fetchVendorQualification(params)),
		createSiujk: (vendor_id, payload) => dispatch(createSiujk(vendor_id, payload)),
		showSiujk: (vendor_id, id) => dispatch(showSiujk(vendor_id, id)),
		fetchSiujk: (vendor_id, payload) => dispatch(fetchSiujk(vendor_id, payload)),
		updateSiujk: (vendor_id, id, payload) => dispatch(updateSiujk(vendor_id, id, payload)),
		deleteSiujk: (vendor_id, id) => dispatch(deleteSiujk(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Siujk));