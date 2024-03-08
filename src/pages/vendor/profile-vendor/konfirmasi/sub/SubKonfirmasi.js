import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';

import TableKonfirmasi from './TableKonfirmasi';
import TableKonfirmasiVerifikasi from './TableKonfirmasiVerifikasi';

import { fetchKonfirmasi,
				submitKonfirmasi,
				cancelKonfirmasi,
				fetchKonfirmasiVerifikasi,
				updateKonfirmasiVerifikasi, 
				setCollapseActive } from '../../../../../store/actions/vendor/profile-vendor/konfirmasiActions';
import {showLastVerification} from '../../../../../store/actions/vendor/verifikasiDataActions';
import {logoutAction, logoutResponse} from '../../../../../store/actions/authActions';
import {accessAction} from '../../../../../store/actions/sidebarActions';
import {fileUpload} from '../../../../../store/actions/uploadActions';
import {fetchVendorAccGroup} from '../../../../../store/actions/master/vendorAccGroupActions';
import {fetchIncoterms} from '../../../../../store/actions/master/incotermsActions';
import {fetchGlAccountCompany} from '../../../../../store/actions/master/glAccountCompanyActions';
import {fetchCurrencies} from '../../../../../store/actions/master/currenciesActions';
import {fetchSearchTerms} from '../../../../../store/actions/master/seacrhTermsAction';
import {fetchTermsOfPayment} from '../../../../../store/actions/master/termsOfPaymentActions';


class Konfirmasi extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			account_group: '',
			recont_account: '',
			company_code: '',
			purchasing_org_id: '',
			currency: '',
			term_of_payment: '',
			term_of_payment_description:'',
			incoterm_id: '',
			searchterms_id: '',
			incoterm_location: '',
			witholding_tax: '',
			konfirmasi: {
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
				},
				errors: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				konfirmasi_type: false,
				incoterm: false,
				vendor_acc_group: false,
				gl_account: false,
				currency: false,
				searchterms: false,
				termsOfPayment : false
			},
			master_data: {
				m_incoterm: [],
				m_vendor_acc_group: [],
				m_gl_account: [],
				m_currency: [],
				m_searchterm: [],
				m_term_of_payment: []
			}
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			if(!this.state.isVendor){
				this.fetchSearchTerms('')
				this.fetchIncoterms('')
				this.fetchVendorAccGroup('')
				this.fetchGlAccountCompany('')
				this.fetchCurrencies('')
				this.fetchTermOfPayment('')
				
				// this.setData();
			}
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	fetchKonfirmasi = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 1)
	}

	setData = (gl_account_id, incoterm_id, vendor_acc_group_id, gl_account_name, incoterm_name, vendor_acc_group_name, search_terms_id, search_terms_description, incoterm_location, terms_of_payment, terms_of_payment_description) => {
		console.log(`gl_account_id : ${gl_account_id}`);
		console.log(`incoterm_id : ${incoterm_id}`);
		console.log(`vendor_acc_group_id : ${vendor_acc_group_id}`);
		console.log(`gl_account_name : ${gl_account_name}`);
		console.log(`incoterm_name : ${incoterm_name}`);
		console.log(`vendor_acc_group_name : ${vendor_acc_group_name}`);
		const data_vendor = this.props.vendor;
		// DEFAULT DATA
		const purchasing_org = { value: data_vendor.purchasing_org_id, label: `${data_vendor.purchasing_org_id} - ${data_vendor.purchasing_org_name}` }
		// const company = { value: data_vendor.company_type_id, label: `${data_vendor.company_type_id} - ${data_vendor.company_type_name}` }
		const account_group_id = (data_vendor.vendor_type_id !== 1) ? 'AP02' : 'AP01';
		const account_group_name = (data_vendor.vendor_type_id !== 1) ? 'Rekanan Luar Negeri' : 'Rekanan Dalam Negeri';
		const account_group = { value: account_group_id, label: `${account_group_id} - ${account_group_name}` }
		const witholding_tax = { value: 'ID', label: `ID` }
		const term_of_payment = { value: terms_of_payment, label: `${terms_of_payment} - ${terms_of_payment_description}` }
		const currency = { value: 'IDR', label: `IDR - Rupiah Indonesia` }
		const recont_account = { value: '210211100', label: `210211100 - Utang Ush-P3` }
		// GET DATA
		const gl_account = { value: gl_account_id, label: `${gl_account_id} - ${gl_account_name}` }
		const incoterm = { value: incoterm_id, label: `${incoterm_id} - ${incoterm_name}` }
		const vendor_acc_group = { value: vendor_acc_group_id, label: `${vendor_acc_group_id} - ${vendor_acc_group_name}` }
		const search_term = { value: search_terms_id, label: `${search_terms_id} - ${search_terms_description}` }
		this.setState({
			company_code: purchasing_org,
			purchasing_org_id: purchasing_org,
			account_group: (vendor_acc_group_id !== null) ? vendor_acc_group : account_group,
			witholding_tax: witholding_tax,
			term_of_payment: (terms_of_payment !== null) ? term_of_payment : '',
			currency: currency,
			recont_account: (gl_account_id !== null) ? gl_account : recont_account,
			incoterm_id: (incoterm_id !== null) ? incoterm : '',
			searchterms_id : (search_terms_id !== null) ? search_term : '',
			incoterm_location: (incoterm_location !== null) ? incoterm_location : ''
		})
	}

	fetchSearchTerms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, searchterms: true },
				master_data: { ...master_data, m_searchterm: [] }
			}));
			this.props.fetchSearchTerms(select_params)
			.then((resp) => {
				let m_searchterm = resp.data.data;
				let options = m_searchterm.map((dt) => {
					return { value: dt.code, label: dt.code+' - '+dt.description };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, searchterms: false },
					master_data: { ...master_data, m_searchterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, searchterms: false },
					master_data: { ...master_data, m_searchterms: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchTermOfPayment = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, termsOfPayment: true },
				master_data: { ...master_data, m_term_of_payment: [] }
			}));
			this.props.fetchTermsOfPayment(select_params)
			.then((resp) => {
				let m_term_of_payment = resp.data.data;
				let options = m_term_of_payment.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.description };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, termsOfPayment: false },
					master_data: { ...master_data, m_term_of_payment: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, termsOfPayment: false },
					master_data: { ...master_data, m_term_of_payments: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchVendorAccGroup = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, vendor_acc_group: true },
				master_data: { ...master_data, m_vendor_acc_group: [] }
			}));
			this.props.fetchVendorAccGroup(select_params)
			.then((resp) => {
				let m_vendor_acc_group = resp.data.data;
				let options = m_vendor_acc_group.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, vendor_acc_group: false },
					master_data: { ...master_data, m_vendor_acc_group: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, vendor_acc_group: false },
					master_data: { ...master_data, m_vendor_acc_group: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchGlAccountCompany = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {company_id: this.props.vendor.purchasing_org_id, select: params} : {company_id: this.props.vendor.purchasing_org_id, start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, gl_account: true },
				master_data: { ...master_data, m_gl_account: [] }
			}));
			this.props.fetchGlAccountCompany(select_params)
			.then((resp) => {
				let m_gl_account = resp.data.data;
				let options = m_gl_account.map((dt) => {
					return { value: dt.gl_account_id, label: dt.gl_account_id+' - '+dt.gl_account_name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, gl_account: false },
					master_data: { ...master_data, m_gl_account: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, gl_account: false },
					master_data: { ...master_data, m_gl_account: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchCurrencies = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, currency: true },
				master_data: { ...master_data, m_currency: [] }
			}));
			this.props.fetchCurrencies(select_params)
			.then((resp) => {
				let m_currency = resp.data.data;
				let options = m_currency.map((dt) => {
					return { value: dt.short_text, label: dt.short_text+' - '+dt.long_text };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, currency: false },
					master_data: { ...master_data, m_currency: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, currency: false },
					master_data: { ...master_data, m_currency: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchIncoterms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, incoterm: true },
				master_data: { ...master_data, m_incoterm: [] }
			}));
			this.props.fetchIncoterms(select_params)
			.then((resp) => {
				let m_incoterm = resp.data.data;
				let options = m_incoterm.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, incoterm: false },
					master_data: { ...master_data, m_incoterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, incoterm: false },
					master_data: { ...master_data, m_incoterm: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	submitKonfirmasi = (payload) => {
		if(this._isMounted){
			this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, loadingButton: true } }));
			this.props.submitKonfirmasi(this.state.user_uuid, payload)
			.then((resp) => {
				toastr.success('Success Save Data');
				this.props.history.push('/home')
			})
			.catch((resp) => {
				let err = ''
				for (const [key, value] of Object.entries(resp.data.errors)) {
					let temp ='';
					if (Array.isArray(value?.errors)){
						temp = value.errors.map((item) => {
							return (
								item
							)
						})
					}else{
						temp = value;
					}
					err = `${key} => ${temp}`;
				}
				this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, err);
			});
		}
	}
	
	cancelKonfirmasi = (payload) => {
		if(this._isMounted){
			this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, loadingButton: true } }));
			var params = {
				reason: payload
			}
			this.props.cancelKonfirmasi(this.state.user_uuid, params)
			.then((resp) => {
				if(this.state.isVendor){
					this.handleLogout()
				} else {
					this.props.history.push('/home')
				}
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	resetForm = () => {
		var setSendData = {...this.state.konfirmasi.sendData}
		setSendData.uuid = '';
		setSendData.type = '';
		setSendData.number = '';
		setSendData.file = '';
		setSendData.date = '';
		setSendData.notaris_name = '';
		setSendData.notaris_address = '';
		setSendData.menkumham_date = '';
		setSendData.menkumham_file = '';
		this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, sendData: setSendData, loading: true } }));
	}

	updateKonfirmasiVerifikasi = (payload) => {
		if(this._isMounted){
			const sendObj = {
				account_group: this.state.account_group.value,
				recont_account: this.state.recont_account.value,
				company_code: this.state.company_code.value,
				purchasing_org_id: this.state.purchasing_org_id.value,
				currency: this.state.currency.value,
				term_of_payment: this.state.term_of_payment.value,
				incoterm_id: this.state.incoterm_id.value ? this.state.incoterm_id.value : "",
				witholding_tax: this.state.witholding_tax.value,
				search_term: this.state.searchterms_id.value,
				incoterm_location : this.state.incoterm_location,
				status: payload.status,
				suap_file: payload.suap_file,
			}
			// console.log(sendObj);
			this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, loadingButton: true } }));
			this.props.updateKonfirmasiVerifikasi(this.props.getId.verification_uuid, sendObj)
			.then((resp) => {
				toastr.success('Success Save Data');
				this.props.history.push('/home')
			})
			.catch((resp) => {
				this.setState(({ konfirmasi }) => ({ konfirmasi: { ...konfirmasi, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	handleLogout = () => {
		var objParent = {}
		var objChild = {}
		objParent = {
			C: false,
			R: false,
			U: false,
			D: false,
		}
		objChild = {
			C: false,
			R: false,
			U: false,
			D: false,
		}
		const dataDispatch = {type: true, parent_access: objParent, access: objChild};
		this.props.accessAction(dataDispatch);
		
		this.props.logoutAction().then(resp => {
			this.props.logoutResponse({type: true});
		}).catch(error => {
			this.props.logoutResponse({type: false});
		})
	}

	handleChange = (name, value) => {
		if (name === 'account_group' && value.value === 'AP04'){
			this.setState({
				recont_account: {value : '210221100', label : '210221100 - Utang Ush-PR'},
			});
		}else if (name === 'account_group' && (value.value === 'AP01' || value.value === 'AP02')){
			this.setState({
				recont_account: {value : '210211100', label : '210211100 - Utang Ush-P3'},
			});
		}
		this.setState({
				[name]: value,
		});
	};

	setCollapseActive = (params) => {
		this.props.setCollapseActive(params)
	}
	
	render() {
		return (
			<div>
				{(this.state.konfirmasi.loading) && ( <center> <br/> <ReactLoading type="cylon" color="#0f9e3e" /> <br/> </center> )}
				{this.props.verification && this.state.konfirmasi.loading === false && this.state.isVendor && <TableKonfirmasi
					// ref={this.child}
					access={this.props.access}
					konfirmasi={this.state.konfirmasi}
					fetchKonfirmasi={(this.props.verification.status_vendor !== 'partner') ? this.props.fetchKonfirmasi : this.props.showLastVerification }
					confirm={this.submitKonfirmasi}
					cancel={this.cancelKonfirmasi}
					user_uuid={this.state.user_uuid}
					isVendor={this.state.isVendor}
					verificatino_uuid={this.props.getId.verification_uuid}
					fetchKonfirmasiVerifikasi={this.props.fetchKonfirmasiVerifikasi}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					status_vendor={this.props.verification.status_vendor}
					expired_in_day={this.props.verification.expired_in_day}
					setCollapseActive={this.setCollapseActive}
				/>}
				{this.props.verification && this.state.konfirmasi.loading === false && !this.state.isVendor && <TableKonfirmasiVerifikasi
					parentState={this.state}
					// ref={this.child}
					t={this.props.t}
					access={this.props.access}
					konfirmasi={this.state.konfirmasi}
					fetchKonfirmasi={(this.props.verification.status_vendor === 'partner') ? this.props.showLastVerification : this.props.fetchKonfirmasiVerifikasi }
					update={this.updateKonfirmasiVerifikasi}
					cancel={this.cancelKonfirmasi}
					user_uuid={this.state.user_uuid}
					isVendor={this.state.isVendor}
					verificatino_uuid={this.props.getId.verification_uuid}
					uuid={(this.props.verification.status_vendor === 'partner') ? this.state.user_uuid : this.props.getId.verification_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					fetchKonfirmasiVerifikasi={this.props.fetchKonfirmasiVerifikasi}
					showLastVerification={this.props.showLastVerification}
					status_vendor={this.props.verification.status_vendor}
					upload={this.props.fileUpload}
					data_vendor={this.props.vendor}
					fetchIncoterms={this.fetchIncoterms}
					fetchVendorAccGroup={this.fetchVendorAccGroup}
					fetchGlAccount={this.fetchGlAccountCompany}
					fetchCurrencies={this.fetchCurrencies}
					fetchSearchTerms={this.fetchSearchTerms}
					fetchTermOfPayment={this.fetchTermOfPayment}
					handleChange={this.handleChange}
					setData={this.setData}
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
		showLastVerification: (vendor_uuid) => dispatch(showLastVerification(vendor_uuid)),
		logoutAction: payload => dispatch(logoutAction(payload)),
		logoutResponse: data => dispatch(logoutResponse(data)),
		accessAction: data => dispatch(accessAction(data)),
		submitKonfirmasi: (vendor_id, payload) => dispatch(submitKonfirmasi(vendor_id, payload)),
		cancelKonfirmasi: (vendor_id, payload) => dispatch(cancelKonfirmasi(vendor_id, payload)),
		fetchKonfirmasi: (vendor_id, payload) => dispatch(fetchKonfirmasi(vendor_id, payload)),
		fetchKonfirmasiVerifikasi: (verif_uuid, payload) => dispatch(fetchKonfirmasiVerifikasi(verif_uuid, payload)),
		updateKonfirmasiVerifikasi: (verif_uuid, payload) => dispatch(updateKonfirmasiVerifikasi(verif_uuid, payload)),
		fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
		fetchVendorAccGroup: (params) => dispatch(fetchVendorAccGroup(params)),
		fetchGlAccountCompany: (params) => dispatch(fetchGlAccountCompany(params)),
		fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
		setCollapseActive: (params) => dispatch(setCollapseActive(params)),
		fetchSearchTerms: (params) => dispatch(fetchSearchTerms(params)),
		fetchTermsOfPayment: (params) => dispatch(fetchTermsOfPayment(params)),
		
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Konfirmasi));