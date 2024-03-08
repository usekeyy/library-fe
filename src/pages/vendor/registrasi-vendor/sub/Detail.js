import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading'
import Form from './Form';
import Sync from './Sync';
import {
	fetchCompany, 
	fetchPurchasingOrg, 
	fetchVendorType, 
	saveVendor 
} from '../../../../store/actions/beranda/berandaActions';
import { showVerificationRequestor, saveVerificationRequestor } from '../../../../store/actions/vendor/verificationRequestorActions';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {fetchVendorAccGroup} from '../../../../store/actions/master/vendorAccGroupActions';
import {fetchIncoterms} from '../../../../store/actions/master/incotermsActions';
import {fetchGlAccountCompany} from '../../../../store/actions/master/glAccountCompanyActions';
import {fetchCurrencies} from '../../../../store/actions/master/currenciesActions';
import {fetchCountries} from '../../../../store/actions/master/countriesActions';
import {fetchRegions} from '../../../../store/actions/master/regionsActions';
import {fetchDistricts} from '../../../../store/actions/master/districtsActions';
import {fetchSubDistricts} from '../../../../store/actions/master/subDistrictsAction';
import {fetchPostcalCode} from '../../../../store/actions/master/postaclCodeActions';
import {fetchSearchTerms} from '../../../../store/actions/master/seacrhTermsAction';
import {fetchTermsOfPayment} from '../../../../store/actions/master/termsOfPaymentActions';

class Detail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			uuid: (this.props.location.pathname.split("/")[4] !== undefined) ? this.props.location.pathname.split("/")[4] : '',
			isRequestor : this.props.location.pathname.split("/")[2] === 'registration' ? true : false,
			account_group: '',
			recont_account: '',
			company_code: '',
			purchasing_org_id: '',
			currency: '',
			term_of_payment: '',
			incoterm_id: '',
			searchterms_id: '',
			witholding_tax: '',
			incoterm_location: '',
			data_kompetensi: [],
			noteApproval :'',
			tempData: {
				name: '',
				company_type: '',
				direktur_utama: '',
				vendor_type_id: '',
				purchasing_org_id: '',
				email: '',
				pic_name: '',
				pic_phone_no: '',
				address_nomor_telepon: '',
				pic_email: '',
				npwp_number: '',
				address_address: '',
				address_country_id: '',
				address_region_id: '',
				address_district_id: '',
				address_district_name: '',
				address_kecamatan_id: '',
				address_kecamatan_name: '',
				address_postal_code: '',
				search_terms_id: '',
				tdp_number: '',
				tdp_date: '',
				sap_code: '',
			},
			tempLuarNegeri: {
				address_kecamatan_name: '',
				address_district_name: '',
				address_postal_code: '',
				vendor_type_id: '',
			},
			sendData: {},
			loadings: {
				company_type: false,
				purchasing_org: false,
				vendor_type: false,
				vendor: false,
				form: false,
				konfirmasi_type: false,
				incoterm: false,
				vendor_acc_group: false,
				gl_account: false,
				currency: false,
				loading_sap: false,
				country: false,
				province: false,
				district: false,
				sub_district: false,
				postal_code: false,
				search_terms: false,
				termsOfPayment : false
			},
			errors: {},
			m_company: [],
			m_purchasing_org: [],
			m_vendor_type: [],
			errors_response: [],
			master_data: {
				m_incoterm: [],
				m_vendor_acc_group: [],
				m_gl_account: [],
				m_currency: [],
				m_country: [],
				m_province: [],
				m_district: [],
				m_sub_district: [],
				m_postal_code: [],
				m_search_terms: [],
				m_term_of_payment: []
			}
		}
	}
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			if(this.state.uuid !== '') { 
				this.showVerificationRequestor(this.state.uuid) 
			}
			this.fetchCompany()
			this.fetchPurchasingOrg()
			this.fetchVendorType()
			this.fetchCountries()
			this.fetchSearchTerms()
			this.fetchRegions({country_id: this.state.tempData.address_country_id.value})
			this.fetchTermOfPayment()
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
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

	setData = (gl_account_id, incoterm_id, vendor_acc_group_id, purchasing_org_id, gl_account_name, incoterm_name, vendor_acc_group_name, purchasing_org_name, vendor_type_id) => {
		// const data_vendor = this.state.tempData;
		// DEFAULT DATA
		const purchasing_org = { value: this.props.user.purchasing_org_id, label: `${this.props.user.purchasing_org_id} - ${this.props.user.purchasing_org_name}` }
		// const company = { value: data_vendor.company_type_id, label: `${data_vendor.company_type_id} - ${data_vendor.company_type_name}` }
		const account_group_id = (vendor_type_id !== 1) ? 'AP02' : 'AP01';
		const account_group_name = (vendor_type_id !== 1) ? 'Rekanan Luar Negeri' : 'Rekanan Dalam Negeri';
		const account_group = { value: account_group_id, label: `${account_group_id} - ${account_group_name}` }
		const witholding_tax = { value: 'ID', label: `ID` }
		// const term_of_payment = { value: 'Z000', label: `Z000` }
		const currency = { value: 'IDR', label: `IDR - Rupiah Indonesia` }
		const recont_account = { value: '210211100', label: `210211100 - Utang Ush-P3` }
		// GET DATA
		const gl_account = { value: gl_account_id, label: `${gl_account_id} - ${gl_account_name}` }
		const incoterm = { value: incoterm_id, label: `${incoterm_id} - ${incoterm_name}` }
		const vendor_acc_group = { value: vendor_acc_group_id, label: `${vendor_acc_group_id} - ${vendor_acc_group_name}` }
		this.setState({
			company_code: (purchasing_org_id !== '') ? { value: purchasing_org_id, label: `${purchasing_org_id} - ${purchasing_org_name}` } : purchasing_org,
			purchasing_org_id: (purchasing_org_id !== '') ? { value: purchasing_org_id, label: `${purchasing_org_id} - ${purchasing_org_name}` } : purchasing_org,
			account_group: (vendor_acc_group_id !== '') ? vendor_acc_group : account_group,
			witholding_tax: witholding_tax,
			// term_of_payment: term_of_payment,
			currency: currency,
			recont_account: (gl_account_id !== '') ? gl_account : recont_account,
			incoterm_id: (incoterm_id !== '') ? incoterm : '',
			incoterm_location: this.state.incoterm_location
		})
	}
	
	showVerificationRequestor = (uuid) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, form: true, loading_sap: true } }));
			this.props.showVerificationRequestor(uuid)
			.then((resp) => {
				const data = resp.data.data;
				const setTempData = {...this.state.tempData}
				const setLuarNegeri = {...this.state.tempLuarNegeri}
				setTempData.name = data.name;
				setTempData.company_type = {value: data.company_type_id, label: `${data.company_type_name}`};;
				setTempData.direktur_utama = data.direktur_utama;
				setTempData.vendor_type_id = {value: data.vendor_type_id, label: `${data.vendor_type_name}`};;
				setTempData.purchasing_org_id = {value: data.purchasing_org_id, label: `${data.purchasing_org_id} - ${data.purchasing_org_name}`};
				setTempData.email = data.email;
				setTempData.pic_name = data.pic_name;
				setTempData.address_nomor_telepon = data.pic_phone;
				setTempData.pic_email = data.pic_email;
				setTempData.npwp_number = data.npwp_nomor;
				setTempData.address_address = data.address;
				setTempData.tdp_number = data.tdp_nomor;
				setTempData.tdp_date = data.tdp_tanggal_berakhir;
				setTempData.sap_code = data.sap_code;
				setTempData.address_country_id = {value: data.country_id, label: `${data.country_id} - ${data.country_name}`};
				setTempData.address_region_id = {value: data.region_id, label: `${data.region_name}`};
				setTempData.address_district_id = {value: data.district_id, label: `${data.district_name}`};
				setTempData.address_kecamatan_id = {value: data.kecamatan_id, label: `${data.kecamatan_name}`};
				setTempData.address_postal_code = {value: data.postal_code, label: `${data.postal_code}`};
				setTempData.address_postal_code = {value: data.postal_code, label: `${data.postal_code}`};
				setTempData.search_terms_id = {value: data.search_terms_code, label: `${data.search_terms_code} - ${data.search_terms_description}`};
				setLuarNegeri.address_district_name = data.district_name_luar;
				setLuarNegeri.address_kecamatan_name = data.kecamatan_name_luar;
				setLuarNegeri.address_postal_code = data.postal_code;
				setLuarNegeri.vendor_type_id = data.vendor_type_id;
				setLuarNegeri.address_region_name = data.region_name_luar;
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, form: false },
					tempData: setTempData,
					tempLuarNegeri: setLuarNegeri
				}), () => {
					this.fetchIncoterms('')
					this.fetchVendorAccGroup('')
					this.fetchGlAccountCompany('')
					this.fetchCurrencies('')
					setTimeout(() => {
						this.setData('', '', '', data.purchasing_org_id, '', '', '', data.purchasing_org_name, data.vendor_type_id);
						this.setState(({ loadings }) => ({ loadings: { ...loadings, loading_sap: false } }));
					})
				});
			})
			.catch((resp) => {
				toastr.error(resp.data.status, resp.data.message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, form: false } }));
				this.props.history.push('/vendor/verification-registration')
			});
		}
	}

	fetchCompany = () => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, company_type: true }, m_company: [] }));
			this.props.fetchCompany()
			.then((resp) => {
				let m_company = resp.data.data;
        let options = m_company.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, company_type: false },
					m_company: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load Company', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, company_type: false } }));
			});
		}
	}

	fetchPurchasingOrg = () => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, purchasing_org: true }, m_purchasing_org: [] }));
			this.props.fetchPurchasingOrg()
			.then((resp) => {
				let m_purchasing_org = resp.data.data;
        let options = m_purchasing_org.map((dt) => {
          return { value: dt.company_id, label: dt.company_id+' - '+dt.company_name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, purchasing_org: false },
					m_purchasing_org: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load Purchase Org', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, purchasing_org: false } }));
			});
		}
	}

	fetchVendorType = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, vendor_type: true }, m_vendor_type: [] }));
			this.props.fetchVendorType(params)
			.then((resp) => {
				let m_vendor_type = resp.data.data;
        let options = m_vendor_type.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, vendor_type: false },
					m_vendor_type: options
				}));
			})
			.catch((resp) => {
				let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
				toastr.error('Failed Load Vendor Type', message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings, vendor_type: false } }));
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
			let select_params = (params !== '') ? {company_id: this.state.tempData.purchasing_org_id.value, select: params} : {company_id: this.state.tempData.purchasing_org_id.value, start: 0, length: 10};
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

	setCountry = (type) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, country: true } }));
		const m_country = this.state.master_data.m_country;
		if(m_country.length > 0){
			m_country.forEach((item, key) => {
				if(type === 3){
					if(item.value === "ID"){
						m_country[key] = { value: item.value, label: `${item.label}`, disabled: true }
					} else {
						m_country[key] = { value: item.value, label: `${item.label}`, disabled: false }
					}
				} else {
					if(item.value === "ID"){
						m_country[key] = { value: item.value, label: `${item.label}`, disabled: false }
					} else {
						m_country[key] = { value: item.value, label: `${item.label}`, disabled: true }
					}
				}
			})
		}
		setTimeout(() => {
			this.setState(({ loadings, master_data }) => ({ loadings: { ...loadings, country: false }, master_data: { ...master_data, m_country: m_country } }));
		}, 500)
	}

	fetchCountries = () => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, country: true },
				master_data: { ...master_data, m_country: [] }
			}));
			this.props.fetchCountries()
			.then((resp) => {
				let m_country = resp.data.data;
        let options = m_country.map((dt) => {
          return { value: dt.id, label: dt.id+' - '+dt.name };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, country: false },
					master_data: { ...master_data, m_country: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, country: false },
					master_data: { ...master_data, m_country: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchRegions = (params) => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, province: true },
				master_data: { ...master_data, m_province: [] }
			}));
			this.props.fetchRegions(params)
			.then((resp) => {
				let m_region = resp.data.data;
        let options = m_region.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, province: false },
					master_data: { ...master_data, m_province: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, province: false },
					master_data: { ...master_data, m_province: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}
	
	fetchDistricts = (params) => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, district: true },
				master_data: { ...master_data, m_district: [] }
			}));
			this.props.fetchDistricts(params)
			.then((resp) => {
				let m_district = resp.data.data;
        let options = m_district.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, district: false },
					master_data: { ...master_data, m_district: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, district: false },
					master_data: { ...master_data, m_district: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchSubDistricts = (params) => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, sub_district: true },
				master_data: { ...master_data, m_sub_district: [] }
			}));
			this.props.fetchSubDistricts(params)
			.then((resp) => {
				let m_sub_district = resp.data.data;
        let options = m_sub_district.map((dt) => {
          return { value: dt.id, label: dt.name };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, sub_district: false },
					master_data: { ...master_data, m_sub_district: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, sub_district: false },
					master_data: { ...master_data, m_sub_district: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchPostcalCode = (params) => {
		if(this._isMounted){
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, postal_code: true },
				master_data: { ...master_data, m_postal_code: [] }
			}));
			this.props.fetchPostcalCode(params)
			.then((resp) => {
				let m_postal_code = resp.data.data;
        let options = m_postal_code.map((dt) => {
          return { value: dt.id, label: dt.id };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, postal_code: false },
					master_data: { ...master_data, m_postal_code: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, postal_code: false },
					master_data: { ...master_data, m_postal_code: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchSearchTerms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, master_data }) => ({
				loadings: { ...loadings, search_terms: true },
				master_data: { ...master_data, m_search_terms: [] }
			}));
			this.props.fetchSearchTerms(select_params)
			.then((resp) => {
				let m_search_terms = resp.data.data;
        let options = m_search_terms.map((dt) => {
          return { value: dt.code, label: `${dt.code} - ${dt.description}` };
        })
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, search_terms: false },
					master_data: { ...master_data, m_search_terms: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, master_data }) => ({
					loadings: { ...loadings, search_terms: false },
					master_data: { ...master_data, m_search_terms: [] }
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

	saveItems = (payload) => {
		this.setState(prevState => ({
			...prevState,
			data_kompetensi: payload
		}))
	}
	
	deletePayload = (payload) => {
    this.setState(prevState => ({
			...prevState,
			data_kompetensi: payload
		}))
  	}

	setNoteApproval = (teks) => {
		this.setState({noteApproval : teks})
	}

	saveVendor = (data) => {
		if(this._isMounted){
			var arrKompetensi = [];
			if(this.state.data_kompetensi.length > 0){
				this.state.data_kompetensi.forEach((item, key) => {
					const merk = (item.merk !== null && item.merk !== "") ? (Array.isArray(item.merk) && item.merk.length > 0) ? item.merk.map((data, keyy) => {
						return data.value;
					}) : item.merk : "";
					var obj = {
						bidang_usaha_id: item.bidang_usaha_id.value,
						sub_bidang_usaha_id: item.sub_bidang_usaha_id.value,
						tipe_rekanan_id: item.tipe_rekanan_id.value,
						merk: Array.isArray(merk) ? merk.length > 0 ? merk.join(";") : "" : "",
						attachment: item.attachment
					}
					arrKompetensi.push(obj)
				})
			}
			data.kompetensi = arrKompetensi;
			
			this.setState(({ loadings }) => ({ 
				loadings: { ...loadings, btn: true }
			}));
			delete data.npwp_file_name;
			delete data.tdp_file_name;
			// console.log(data)
			this.props.saveVendor(data)
			.then((resp) => {
				this.setState(({ loadings }) => ({
					tabLogin: true,
					loadings: { ...loadings, btn: false },
					isShowPaktaIntegritas: false,
					errors: {},
					sendData: {}
				}));
				this.props.history.push('/vendor/registration')
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, btn: false },
					errors: resp.data.errors,
					isShowPaktaIntegritas: false
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	handleApproval = (data) => {
		if(this._isMounted){
			const sendData = {
				account_group: this.state.account_group.value,
				recont_account: this.state.recont_account.value,
				company_code: this.state.company_code.value,
				purchasing_org_id: this.state.purchasing_org_id.value,
				currency: this.state.currency.value,
				term_of_payment: this.state.term_of_payment.value,
				incoterm_id: this.state.incoterm_id ? this.state.incoterm_id.value : '',
				witholding_tax: this.state.witholding_tax.value,
				incoterm_location: this.state.incoterm_location,
				search_term : this.state.searchterms_id.value,
				status: data
			}
			if (this.state.noteApproval !== ''){
				sendData.note = this.state.noteApproval
			}
			// console.log(sendData)
			if (!sendData.search_term){
				toastr.warning('Searchterms tidak boleh kosong')
			}else if (!sendData.term_of_payment){
				toastr.warning('Terms Of Payment tidak boleh kosong')
			}else{
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, btn: true }
				}));
				console.log(sendData)
				this.props.saveVerificationRequestor(this.state.uuid, sendData)
				.then((resp) => {
					this.setState(({ loadings }) => ({
						tabLogin: true,
						loadings: { ...loadings, btn: false },
						isShowPaktaIntegritas: false,
						errors: {},
						sendData: {}
					}));
					this.props.history.push('/vendor/verification-registration')
					toastr.success('Success Save Data');
				})
				.catch((resp) => {
					this.setState(({ loadings }) => ({ 
						loadings: { ...loadings, btn: false },
						errors: resp.data.errors,
						isShowPaktaIntegritas: false
					}));
					toastr.error(resp.data.status, resp.data.message);
				});
			}
		}
	}

  render(){
    return (
      <div>
				{this.state.loadings.loading_sap && <center><h5><i className="fas fa-spinner fa-pulse"></i> Loading Data ERP ...</h5></center>}
				{this.state.loadings.loading_sap === false && this.state.uuid !== '' && !this.state.isRequestor && <Sync
					parentState={this.state}
					t={this.props.t}
					data_vendor={this.state.tempData}
					handleChange={this.handleChange}
					fetchIncoterms={this.fetchIncoterms}
					fetchVendorAccGroup={this.fetchVendorAccGroup}
					fetchGlAccount={this.fetchGlAccountCompany}
					fetchCurrencies={this.fetchCurrencies}
				/>}
				<Panel loading={false}>
					<PanelHeader>Form Registrasi Vendor Oleh Requestor</PanelHeader>
					<PanelBody loading={false}>
						{this.state.loadings.form && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.loadings.form && <Form 
							parentState={this.state}
							uuid={this.state.uuid}
							isRequestor={this.state.isRequestor}
							data={this.state.tempData}
							m_company={this.state.m_company}
							m_purchasing_org={this.state.m_purchasing_org}
							m_vendor_type={this.state.m_vendor_type}
							m_search_terms={this.state.master_data.m_search_terms}
							loadings={this.state.loadings}
							errors_response={this.state.errors}
							save={this.saveVendor} 
							handleApproval={this.handleApproval}
							fetchCountries={this.fetchCountries}
							fetchRegions={this.fetchRegions}
							fetchDistricts={this.fetchDistricts}
							fetchSubDistricts={this.fetchSubDistricts}
							fetchPostcalCode={this.fetchPostcalCode}
							fetchSearchTerms={this.fetchSearchTerms}
							t={this.props.t} 
							setCountry={this.setCountry}
							saveItems={(payload) => this.saveItems(payload)}
							deletePayload={(payload) => this.deletePayload(payload)}
							setNoteApproval={this.setNoteApproval}
						/>}
					</PanelBody>
				</Panel>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		user: state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchCompany: (params) => dispatch(fetchCompany(params)),
		showVerificationRequestor: (id) => dispatch(showVerificationRequestor(id)),
		fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
		fetchVendorType: (params) => dispatch(fetchVendorType(params)),
		saveVendor: (payload) => dispatch(saveVendor(payload)),
		saveVerificationRequestor: (uuid, payload) => dispatch(saveVerificationRequestor(uuid, payload)),
		fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
		fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
		fetchVendorAccGroup: (params) => dispatch(fetchVendorAccGroup(params)),
		fetchGlAccountCompany: (params) => dispatch(fetchGlAccountCompany(params)),
		fetchCountries: (params) => dispatch(fetchCountries(params)),
		fetchRegions: (params) => dispatch(fetchRegions(params)),
		fetchDistricts: (params) => dispatch(fetchDistricts(params)),
		fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
		fetchPostcalCode: (params) => dispatch(fetchPostcalCode(params)),
		fetchSearchTerms: (params) => dispatch(fetchSearchTerms(params)),
		fetchTermsOfPayment: (params) => dispatch(fetchTermsOfPayment(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Detail));