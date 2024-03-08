import React from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';

import FormProfile from './FormProfile';
import { withTranslation } from 'react-i18next';
import { fetchPurchasingOrg } from '../../../../../../store/actions/master/purchasingOrgActions';
import { fetchCompanyType } from '../../../../../../store/actions/master/companyTypeActions';
import { fetchVendorType } from '../../../../../../store/actions/master/vendorTypeActions';
import { showProfileVendor,
				updateProfileVendor } from '../../../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../../store/actions/vendor/verifikasiDataActions';
import {vendorResponse} from '../../../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';


class Profile extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : (this.props.vendor !== undefined) ? this.props.vendor.uuid : null,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			profile_vendor: {
				data: {},
				sendData: {
					name:'',
					company_type_id:'',
					vendor_type_id:'',
					purchasing_org_id:'',
					website:'',
					direktur_utama:'',
					email:'',
					pic_email:'',
					pic_name:'',
					pic_phone:'',
					status:'',
					tipe_verifikasi:'',
				},
				purchasing_orgs : [],
				company_types: [],
				vendor_types: [],
				errors: [],
				loading: true,
				loadingButton: false
			},
			loadings: {
				company_type: false,
				purchasing_org: false,
				vendor_type: false,
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

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) {
			this.fetchPurchasingOrg({});
			this.fetchCompanyType({})
			this.fetchVendorType({})
			if(this.props.pathname.includes('/vendor/profile')) {
				this.props.vendorResponse({type: false});
			}
			setTimeout(() => {
				if(this.state.user_uuid !== undefined || this.state.user_uuid !== null){
					this.showProfileVendor(this.state.user_uuid)
				} else {
					this.props.history.push('/error/404')
					// toastr.light("undefined")
				}
			}, 500)
			
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	toggleCollapse = (index) => {
		var newArray = [];
		for (let collapseObj of this.state.collapse) {
			if (collapseObj.id === index) {
				collapseObj.collapse = !collapseObj.collapse;
			} else {
				collapseObj.collapse = false;
			}
			newArray.push(collapseObj);
		}

		this.setState({
			collapse: newArray
		});
	}

	// NAMA PERUSAHAAN
	showProfileVendor = (id) => {
		// this.props.location.pathname.split("/")[2] === 'list' ? true : false,
		let params = this.props.isInternal ? {source : 'master'} : ''
		
		console.log(this.props.isInternal)
		this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
		this.props.showProfileVendor(id,params)
		.then((resp) => {
			var data = resp.data.data;
			this.props.setVendorType(data.vendor_type_id)
			var setSendData = {...this.state.profile_vendor.sendData}
			setSendData.name = data.name;
			setSendData.company_type_id = {value: data.company_type_id, label: data.company_type_name};
			setSendData.vendor_type_id = {value: data.vendor_type_id, label: data.vendor_type_name};
			setSendData.purchasing_org_id = {value: data.purchasing_org_id, label: data.purchasing_org_id+' - '+data.purchasing_org_name};
			setSendData.website = data.website;
			setSendData.email = data.email;
			setSendData.direktur_utama = data.direktur_utama
			setSendData.pic_email = data.pic_email
			setSendData.pic_name = data.pic_name
			setSendData.pic_phone = data.pic_phone
			setSendData.status = data.status;
			setSendData.tipe_verifikasi = data.tipe_verifikasi;
			this.setState(({ profile_vendor }) => ({
				profile_vendor: { ...profile_vendor, loading: false, data: data, sendData: setSendData }
			}));
		})
		.catch((resp) => {
			this._isMounted = true && this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: false } }));
			// console.log(resp);
			// let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(resp.status, resp.data.message);
			// this.props.history.push('/home')
		});
	}

	updateProfileVendor = (data) => {
		if(this._isMounted){
			this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loadingButton: true } }));
			this.props.updateProfileVendor(this.state.user_uuid, data)
			.then((resp) => {
				this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, errors: [], loadingButton: false } }), () => {
					this.showProfileVendor(this.state.user_uuid)
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchCompanyType = (params) => {
		this.setState(({ loadings, profile_vendor }) => ({ 
			loadings: { ...loadings, company_type: true },
			profile_vendor: {...profile_vendor, company_types: []}
		}));
		this.props.fetchCompanyType(params)
		.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.id, label: data.name };
			});
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, company_type: false },
				profile_vendor: {...profile_vendor, company_types: options}
			}));
		})
		.catch((resp) => {
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, company_type: false },
				profile_vendor: {...profile_vendor, company_types: []}
			}));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchVendorType = (params) => {
		this.setState(({ loadings, profile_vendor }) => ({ 
			loadings: { ...loadings, vendor_type: true },
			profile_vendor: {...profile_vendor, vendor_types: []}
		}));
		this.props.fetchVendorType(params)
		.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.id, label: data.name };
			});
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, vendor_type: false },
				profile_vendor: {...profile_vendor, vendor_types: options}
			}));
		})
		.catch((resp) => {
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, vendor_type: false },
				profile_vendor: {...profile_vendor, vendor_types: []}
			}));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchPurchasingOrg = (params) => {
		this.setState(({ loadings, profile_vendor }) => ({ 
			loadings: { ...loadings, purchasing_org: true },
			profile_vendor: {...profile_vendor, purchasing_orgs: []}
		}));
		this.props.fetchPurchasingOrg(params)
		.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.company_id, label: data.company_id +' - '+ data.company_name };
			});
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, purchasing_org: false },
				profile_vendor: {...profile_vendor, purchasing_orgs: options}
			}));
		})
		.catch((resp) => {
			this.setState(({ loadings, profile_vendor }) => ({ 
				loadings: { ...loadings, purchasing_org: false },
				profile_vendor: {...profile_vendor, purchasing_orgs: []}
			}));
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
				this.setState(({ profile_vendor, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					profile_vendor: { ...profile_vendor, loading: false } 
				}), () => {
					setTimeout(() => {
						this.child.current.fetchData() && this.showProfileVendor(this.state.user_uuid) && this.setState(({ verification }) => ({
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
		const loading = this.state.profile_vendor.loading;
		return (
			<div>
				{this.state.profile_vendor.loading && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{ !this.state.profile_vendor.loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{this.state.profile_vendor.loading === false && 
				<FormProfile 
					profile_vendor={this.state.profile_vendor}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					save={this.updateProfileVendor}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				<div>
					{!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <NoteVerificationData
						status_vendor={this.props.verification.status_vendor}
						data={this.state.verification} 
						vendor_uuid={this.state.user_uuid}
						verification_uuid={this.props.getId.verification_uuid}
						path={"vendor"}
						access={this.props.access}
						verification={this.saveVerificationItem}
						status={this.state.profile_vendor.sendData.status}
						isVerifMultiple={true}
					/>}
					{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false && <TableVerificationData 
						ref={this.child}
						vendor_uuid={this.state.user_uuid} 
						verification_uuid={this.props.getId.verification_uuid}
						path={"vendor"}
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
						path={"vendor"}
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
			user : state.auth.user.data,
			vendor: state.vendorProfile.vendor,
			getId: state.vendorProfile,
			verification: state.verification.verification
    }
}

const dispatchToProps = dispatch => {
	return {
		vendorResponse: data => dispatch(vendorResponse(data)),
		fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
		fetchCompanyType: (params) => dispatch(fetchCompanyType(params)),
		fetchVendorType: (params) => dispatch(fetchVendorType(params)),
		showProfileVendor: (id, params) => dispatch(showProfileVendor(id,params)),
		updateProfileVendor: (id, payload) => dispatch(updateProfileVendor(id, payload)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Profile));