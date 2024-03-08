import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FormRekeningBank from './FormRekeningBank';
import TableRekeningBank from './TableRekeningBank';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import { fetchCurrencies } from '../../../../../store/actions/master/currenciesActions';
import { fetchBank } from '../../../../../store/actions/master/bankActions';
import { fetchBankBranch } from '../../../../../store/actions/master/bankBranchActions';
import { fetchCountries } from '../../../../../store/actions/master/countriesActions';
import { fetchDistricts } from '../../../../../store/actions/master/districtsActions';
import { showRekeningBank,
				fetchRekeningBank,
				createRekeningBank,
				updateRekeningBank,
				deleteRekeningBank } from '../../../../../store/actions/vendor/profile-vendor/rekeningBankActions';
import NoteVerificationData from '../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../verification-data/TableVerificationData';
import {showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory} from '../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../verification-data/HistoryInternal';

class RekeningBank extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			rekening_bank: {
				data: [],
				sendData: {
					uuid: '',
					currency_id: '',
					bank_id: '',
					country_id: '',
					bank_district: '',
					bank_address: '',
					bank_branch_id: '',
					nomor_rekening: '',
					pemegang_rekening: '',
					file: '',
					status: '',
				},
				errors: [],
				currencies: [],
				banks: [],
				countries: [],
				districts: [],
				bank_branches: [],
				loading: false,
				loadingButton: false
			},
			loadings: {
				currency: false,
				country: true,
				district: false,
				bank_branch: true,
				bank: false,
				branch: false,
				currency_default : false
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
			// this.fetchCurrencies()
			// this.fetchCountries()
			// this.fetchBank()
			// this.fetchRekeningBank(this.state.user_uuid)
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	fetchCurrencies = (id_currency) => {
		var setSendData = {...this.state.rekening_bank.sendData}
		setSendData.currency_id = '';
		this.setState(({ loadings }) => ({ loadings: { ...loadings, currency: true, sendData: setSendData }}));
		this.props.fetchCurrencies()
		.then((resp) => {
			let currencies = resp.data.data;
			let currenciesFilter = currencies.filter((item) => {				
				return (item.id === id_currency)
			})
			// let currenciesFinal = currenciesFilter.length > 0 ? currenciesFilter : currencies;
			let options = []
			if (currenciesFilter.length > 0){
				setSendData.currency_id = {value: currenciesFilter[0].id, label: currenciesFilter[0].id+' - '+currenciesFilter[0].short_text}
			}else{
				options = currencies.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.short_text };
				})
			}

			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, currencies: options, sendData: setSendData },
				loadings: { ...loadings, currency: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, errors: resp.data.errors, },
				loadings: { ...loadings, currency: false },
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
    this.setState(({ rekening_bank }) => ({ rekening_bank : { ...rekening_bank, loading: type } }));
	}	

	checkStatusLog = (value) => {
		var setSendData = {...this.state.rekening_bank.sendData}
		setSendData.status = 'd';
		this.setState(({ verification, rekening_bank }) => ({
			verification: { ...verification, loading: false, verifLength: value, loadingNote: false },
			rekening_bank: { ...rekening_bank, sendData: setSendData },
		}));
	}

	fetchBank = (params) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, bank: true } }));
		this.props.fetchBank(params)
		.then((resp) => {
			let bank = resp.data.data;
			let options = bank.map((dt) => {
				// return { value: dt.id, label: dt.id+' - '+dt.name, country_id: dt.country_id };
				return { value: dt.id, label: dt.name, country_id: dt.country_id };
			})
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, banks: options },
				loadings: { ...loadings, bank: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, errors: resp.data.errors },
				loadings: { ...loadings, bank: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchCountries = (params) => {
		// var setSendData = {...this.state.rekening_bank.sendData}
		// setSendData.country_id = '';
		// this.setState(({ loadings }) => ({ loadings: { ...loadings, country: true, sendData: setSendData } }));
		this.setState(({ loadings }) => ({ loadings: { ...loadings, country: true} }));
		this.props.fetchCountries(params)
		.then((resp) => {
			let countries = resp.data.data;
			let options = countries.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name, currency : dt.currency_id };
			})
			// if (countries.length > 0) { setSendData.country_id = {value: countries[0].id, label: countries[0].id+' - '+countries[0].name, currency : countries[0].currency_id}; }
			this.setState(({ rekening_bank, loadings }) => ({ 
				// rekening_bank: { ...rekening_bank, countries: options, sendData: setSendData },
				rekening_bank: { ...rekening_bank, countries: options },
				loadings: { ...loadings, country: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, errors: resp.data.errors },
				loadings: { ...loadings, country: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchDistricts = (params) => {
		var setSendData = {...this.state.rekening_bank.sendData}
		this.setState(({ loadings }) => ({ loadings: { ...loadings, district: true, sendData: setSendData } }));
		this.props.fetchDistricts(params)
		.then((resp) => {
			let district = resp.data.data;
			let options = district.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name };
			})
			// if (district.length > 0) { setSendData.district_id = {value: district[0].id, label: district[0].id+' - '+district[0].name}; }
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, districts: options, sendData: setSendData },
				loadings: { ...loadings, district: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, errors: resp.data.errors },
				loadings: { ...loadings, district: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	fetchBankBranch = (params) => {
		var setSendData = {...this.state.rekening_bank.sendData}
		setSendData.bank_branch_id = '';
		this.setState(({ loadings, rekening_bank }) => ({ 
			loadings: { ...loadings, bank_branch: true, sendData: setSendData }, 
			rekening_bank: { ...rekening_bank, sendData: setSendData }, 
		}));
		this.props.fetchBankBranch(params)
		.then((resp) => {
			let banks = resp.data.data;
			let options = banks.map((dt) => {
				return { value: dt.id, label: dt.sap_code+' - '+dt.name, data: dt };
			})
			// if (banks.length > 0) { 
			// setSendData.bank_address = banks[0].address;
			// setSendData.bank_district = banks[0].district_name;
			// setSendData.bank_branch_id = {value: banks[0].id, label: banks[0].bank_id+' - '+banks[0].name, data: banks[0]}; 
			// }
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, bank_branches: options },
				loadings: { ...loadings, bank_branch: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, errors: resp.data.errors },
				loadings: { ...loadings, bank_branch: false },
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	setBankBranch = (value) => {
		// console.log(value);
		// this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loading: true } }));
		this.setState(({ loadings }) => ({ 
			loadings: { ...loadings, branch: true },
		}));
		let setSendData = {...this.state.rekening_bank.sendData}
		if(value !== ''){
			setSendData.bank_address = value.address;
			setSendData.bank_district = value.district_name;
		} else {
			setSendData.bank_address = '';
			setSendData.bank_district = '';
		}
		setTimeout(() => {
			this.setState(({ rekening_bank, loadings }) => ({ 
				rekening_bank: { ...rekening_bank, sendData: setSendData, loading: false },
				loadings: { ...loadings, branch: false },
			}));
		}, 1000)
	}

	showRekeningBank = async (vendor_id, uuid) => {
		var setSendData = {...this.state.rekening_bank.sendData}
		this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loading: true } }));
		this.props.showRekeningBank(vendor_id, uuid)
		.then((resp) => {
			var data = resp.data.data[0];
			// this.fetchCountries({ id: data.country_id })
			this.fetchBankBranch({ bank_id: data.bank_id, country_id : data.kode_negara })
			this.fetchBank({country_id : data.kode_negara})
			this.fetchCurrencies(data.currency_id)
			setSendData.country_id = { value: data.kode_negara, label: data.kode_negara+' - '+data.country_name, currency : data.currency_id  }
			setSendData.currency_id = { value: data.currency_id, label: data.currency_id+' - '+data.short_currency }
			// setSendData.bank_id = { value: data.bank_id, label: data.bank_id+' - '+data.bank_name }
			setSendData.bank_id = { value: data.bank_id, label: data.bank_name }
			setSendData.bank_branch_id = { value: data.bank_branch_id, label: data.bank_branches_sap_code+' - '+data.branch_name }
			setSendData.uuid = data.uuid
			setSendData.nomor_rekening = data.nomor_rekening
			setSendData.pemegang_rekening = data.pemegang_rekening
			setSendData.bank_address = data.bank_branches_address
			setSendData.bank_district = data.district_name
			setSendData.file = data.file
			setTimeout(() => {
				this.setState(({ rekening_bank }) => ({
					rekening_bank: { ...rekening_bank, loading: false, data: data, errors: [], sendData: setSendData }
				}), () => {
					
				});
			}, 2000)
		})
		.catch((resp) => {
			this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loading: false } }));
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error(message);
		});
	}

	fetchRekeningBank = async () => {
		this.resetForm()
		setTimeout(() => {
			this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: false, loading: false, errors: [] } }), () => {
				this.child.current.fetchData();
			});
		}, 500)
	}

	createRekeningBank = (payload) => {
		if(this._isMounted){
			this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: true } }));
			this.props.createRekeningBank(this.state.user_uuid, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}
	
	updateRekeningBank = (id, payload) => {
		if(this._isMounted){
			this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: true } }));
			this.props.updateRekeningBank(this.state.user_uuid, id, payload)
			.then((resp) => {
				this.resetForm();
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Save Data');
			})
			.catch((resp) => {
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	deleteRekeningBank = (id) => {
		if(this._isMounted){
			this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: true } }));
			this.props.deleteRekeningBank(this.state.user_uuid, id)
			.then((resp) => {
				this.resetForm();
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loadingButton: false, loading: false, errors: [] } }), () => {
					this.child.current.fetchData();
				});
				toastr.success('Success Delete Data');
			})
			.catch((resp) => {
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, errors: resp.data.errors, loadingButton: false } }));
				toastr.error(resp.data.message, resp.data.status);
			});
		}
	}

	resetForm = () => {
		var setSendData = {...this.state.rekening_bank.sendData}
		setSendData.uuid = ''
		setSendData.currency_id = ''
		setSendData.bank_id = ''
		setSendData.country_id = ''
		setSendData.bank_district = ''
		setSendData.bank_address = ''
		setSendData.bank_branch_id = ''
		setSendData.nomor_rekening = ''
		setSendData.pemegang_rekening = ''
		setSendData.file = ''
		this.setState(({ rekening_bank, loadings }) => ({ 
			rekening_bank: { ...rekening_bank, sendData: setSendData, loading: true },
			loadings: { ...loadings, country: true, bank_branch: true}
		}));
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if(this._isMounted){
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
			.then((resp) => {
				this.setState(({ rekening_bank }) => ({ rekening_bank: { ...rekening_bank, loading: true } }));
				this.setState(({ rekening_bank, verification }) => ({ 
					verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
					rekening_bank: { ...rekening_bank, loading: false } 
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
			this.setState(({ rekening_bank, verification }) => ({ 
				verification: { ...verification, loadingButton: true, loading: true, errors: [] },
				rekening_bank: { ...rekening_bank, loadingButton: true } 
			}));
			this.props.saveVerificationLineItem(uuid, item_uuid, path, payload)
			.then((resp) => {
				this.setState(({ rekening_bank, verification }) => ({ 
					verification: { ...verification, loadingButton: false, loading: false, errors: [] },
					rekening_bank: { ...rekening_bank, loadingButton: false } 
				}), () => {
					// this.child.current.fetchData();
					this.fetchRekeningBank()
				});
				toastr.success('Success Save Verification Data');
			})
			.catch((resp) => {
				this.setState(({ rekening_bank, verification }) => ({ 
					verification: { ...verification, loadingButton: true, loading: false, errors: resp.data.errors },
					rekening_bank: { ...rekening_bank, loadingButton: false } 
				}));
				toastr.error('Failed Save Verification Data');
			});
		}
	}
	
	render() {
		const {loading} = this.state.rekening_bank;
		const {t} = this.props;
		return (
			<div>
				{loading && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status ==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{!loading && this.state.isVendor &&
				<FormRekeningBank 
					rekening_bank={this.state.rekening_bank} 
					save={this.createRekeningBank}
					update={this.updateRekeningBank}
					fetchRekeningBank={this.fetchRekeningBank}
					fetchCountries={this.fetchCountries}
					fetchBankBranch={this.fetchBankBranch}
					fetchBank={this.fetchBank}
					fetchCurrencies={this.fetchCurrencies}
					upload={this.props.fileUpload}
					loadings={this.state.loadings}
					isVendor={this.state.isVendor}
					setBankBranch={this.setBankBranch}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
				/>}
				{!loading && <TableRekeningBank
					rekening_bank={this.state.rekening_bank} 
					// ref={this.child}
					childRef={ref => (this.child.current = ref)}
					verification={this.state.verification}
					access={this.props.access}
					data={this.state.rekening_bank.data}
					fetchRekeningBank={this.props.fetchRekeningBank}
					showRekeningBank={this.showRekeningBank}
					delete={this.deleteRekeningBank}
					isVendor={this.state.isVendor}
					user_uuid={this.state.user_uuid}
					path={"rekening_bank"}
					checkStatus={this.checkStatus}
					saveVerificationItem={this.saveVerificationLineItem}
					has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					verification_uuid={this.props.getId.verification_uuid}
					status_vendor={this.props.verification.status_vendor}
					setLoadingForm={this.setLoadingForm}
					setStatusDraftVerif={this.setStatusDraftVerif}
					isInternal = {this.props.isInternal}
				/>}
				{this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
				{!loading && !this.state.isVendor && !this.state.verification.loadingNote && this.props.getId.verification_uuid !== false && this.state.verification.dataLength > 0 && <NoteVerificationData
					status_vendor={this.props.verification.status_vendor} 
					data={this.state.verification} 
					vendor_uuid={this.state.user_uuid}
					verification_uuid={this.props.getId.verification_uuid}
					path={"rekening_bank"}
					access={this.props.access}
					verification={this.saveVerificationItem}
					status={this.state.rekening_bank.sendData.status}
					isVerifMultiple={true}
					isStatusDraftVerif={this.state.isStatusDraftVerif}
				/>}
				{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false &&
				<TableVerificationData 
					ref={this.child}
					vendor_uuid={this.state.user_uuid} 
					verification_uuid={this.props.getId.verification_uuid}
					path={"rekening_bank"}
					access={this.props.access}
					showVerification={this.props.showVerificationItem} 
					saveVerificationItem={this.props.saveVerificationLineItem}
					deleteVerificationItem={this.props.deleteVerificationLineItem} 
					title={this.props.title} 
					isVerifMultiple={true}
					checkStatusLog={this.checkStatusLog}
					fetchData={this.fetchRekeningBank}
					showLogHistory={this.props.showLogHistory}
				/>}
				{!loading && !this.state.isVendor && this.props.isInternal && <HistoryInternal 
					vendor_uuid={this.state.user_uuid} 
					path={"rekening_bank"}
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
		fetchCurrencies: (params) => dispatch(fetchCurrencies(params)),
		fetchBank: (params) => dispatch(fetchBank(params)),
		fetchCountries: (params) => dispatch(fetchCountries(params)),
		fetchDistricts: (params) => dispatch(fetchDistricts(params)),
		fetchBankBranch: (params) => dispatch(fetchBankBranch(params)),
		createRekeningBank: (vendor_id, payload) => dispatch(createRekeningBank(vendor_id, payload)),
		showRekeningBank: (vendor_id, id) => dispatch(showRekeningBank(vendor_id, id)),
		fetchRekeningBank: (vendor_id, payload) => dispatch(fetchRekeningBank(vendor_id, payload)),
		updateRekeningBank: (vendor_id, id, payload) => dispatch(updateRekeningBank(vendor_id, id, payload)),
		deleteRekeningBank: (vendor_id, id) => dispatch(deleteRekeningBank(vendor_id, id)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(RekeningBank));