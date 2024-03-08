import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';

import FormAlamat from './FormAlamat';
import { withTranslation } from 'react-i18next';

import { fetchCountries } from '../../../../../../store/actions/master/countriesActions';
import { fetchRegions } from '../../../../../../store/actions/master/regionsActions';
import { fetchDistricts } from '../../../../../../store/actions/master/districtsActions';
import { fetchSubDistricts } from '../../../../../../store/actions/master/subDistrictsAction';
import { fetchPostcalCode } from '../../../../../../store/actions/master/postaclCodeActions';
import { fetchCompanies } from '../../../../../../store/actions/master/companyActions';
import { fetchCompanyType } from '../../../../../../store/actions/master/companyTypeActions';
import { fetchVillages } from '../../../../../../store/actions/master/villagesActions';
import {
	showVendorAddress,
	updateVendorAddress
} from '../../../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import NoteVerificationData from '../../../../verification-data/NoteVerificationData';
import TableVerificationData from '../../../../verification-data/TableVerificationData';
import { showVerificationItem, saveVerificationItem, saveVerificationLineItem, deleteVerificationLineItem, showLogHistory } from '../../../../../../store/actions/vendor/verifikasiDataActions';
import HistoryInternal from '../../../../verification-data/HistoryInternal';

class Perusahaan extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.child = React.createRef();
		this.state = {
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			vendor_address: {
				data: {},
				sendData: {
					pic_phone: '',
					address_nomor_telepon: '',
					address_address: '',
					address_country_id: '',
					address_region_id: '',
					address_district_id: '',
					address_subdistrict_id: '',
					address_village_id: '',
					address_postal_code: '',
					nomor_hp: '',
					rt: '',
					rw: '',
					status: '',
					tipe_verifikasi: '',
					vendor_type_id: '',
				},
				tempData: {
					district_name: '',
					region_name:'',
					kecamatan_name: '',
					postal_code: ''
				},
				errors: [],
				countries: [],
				regions: [],
				districts: [],
				subDistricts: [],
				villages: [],
				postcalCodes: [],
				loading: true,
				loadingButton: false
			},
			loadings: {
				country: false,
				region: false,
				district: false,
				subDistrict: false,
				village: false,
				postcalCode: false,
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

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted) {
			this.showVendorAddress(this.state.user_uuid);
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	// ALAMAT PERUSAHAAN
	showVendorAddress = async (id) => {
		let params = this.props.isInternal ? {source : 'master'} : ''
		this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, loading: true } }));
		this.props.showVendorAddress(id,params)
			.then((resp) => {
				var data = resp.data.data;
				var setSendData = { ...this.state.vendor_address.sendData }
				var setTempData = { ...this.state.vendor_address.tempData }
				this.fetchCountry(data.vendor_type_id);
				if(data.country_id !== null) { this.fetchRegions({ country_id: data.country_id }) }
				if(data.region_id !== null) { this.fetchDistricts({ region_id: data.region_id }) }
				if(data.district_id !== null) { this.fetchSubDistricts({ district_id: data.district_id }) }
				if(data.kecamatan_id !== null) { this.fetchVillages({ sub_district_id: data.kecamatan_id }) }
				if(data.village_id !== null) { this.fetchPostcalCode({ sub_district_id: data.village_id }) }
				setSendData.address_nomor_telepon = data.nomor_telepon;
				setSendData.nomor_hp = data.nomor_hp;
				setSendData.address_address = data.address;
				setSendData.address_country_id = (data.country_id !== null) ? { value: data.country_id, label: data.country_id + ' - ' + data.country_name } : '';
				setSendData.address_region_id = (data.region_id !== null) ? { value: data.region_id, label: data.region_name } : '';
				setSendData.address_district_id = (data.district_id !== null) ? { value: data.district_id, label: data.district_id + ' - ' + data.district_name } : '';
				setSendData.address_subdistrict_id = (data.kecamatan_id !== null) ? { value: data.kecamatan_id, label: data.kecamatan_name } : '';
				setSendData.address_village_id = (data.village_id !== null) ? { value: data.village_id, label: data.village_name } : '';
				setSendData.address_postal_code = (data.postal_code !== null) ? { value: data.postal_code, label: data.postal_code } : '';
				setSendData.rt = data.rt;
				setSendData.rw = data.rw;
				setSendData.status = data.status;
				setSendData.tipe_verifikasi = data.tipe_verifikasi;
				setSendData.vendor_type_id = data.vendor_type_id;
				setTempData.district_name = data.district_name;
				setTempData.kecamatan_name = data.kecamatan_name;
				setTempData.region_name = data.region_name;
				setTempData.postal_code = data.postal_code;
				this.setState(({ vendor_address }) => ({
					vendor_address: { ...vendor_address, data: data, sendData: setSendData, tempData: setTempData, loading: false }
				}));
			})
			.catch((resp) => {
				this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, loading: false } }));
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				toastr.error(message);
			});
	}

	updateVendorAddress = (data) => {
		if (this._isMounted) {
			this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, loadingButton: true } }));
			this.props.updateVendorAddress(this.state.user_uuid, data)
				.then((resp) => {
					this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, loadingButton: false } }), () => this.showVendorAddress(this.state.user_uuid));
					toastr.success('Success Save Data');
				})
				.catch((resp) => {
					this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, errors: resp.data.errors, loadingButton: false } }));
					toastr.error(resp.data.status, resp.data.message);
				});
		}
	}

	fetchCountry = (type) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, country: true },
				vendor_address: { ...vendor_address, countries: [] }
			}));
			this.props.fetchCountries()
				.then((resp) => {
					let m_country = resp.data.data;
					let options = []
					options = m_country.map((dt) => {
						if(type === 3){
							if(dt.id === "ID"){
								return { value: dt.id, label: dt.id + ' - ' + dt.name, disabled: true }
							} else {
								return { value: dt.id, label: dt.id + ' - ' + dt.name, disabled: false }
							}
						} else {
							if(dt.id === "ID"){
								return { value: dt.id, label: dt.id + ' - ' + dt.name, disabled: false }
							} else {
								return { value: dt.id, label: dt.id + ' - ' + dt.name, disabled: true }
							}
						}
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, country: false },
						vendor_address: { ...vendor_address, countries: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, country: false },
						vendor_address: { ...vendor_address, countries: [] }
					}));
				});
		}
	}

	fetchRegions = (params) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, region: true },
				vendor_address: { ...vendor_address, regions: [] }
			}));
			this.props.fetchRegions(params)
				.then((resp) => {
					let m_region = resp.data.data;
					let options = m_region.map((dt) => {
						return { value: dt.id, label: `${dt.code} - ${dt.name}` };
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, region: false },
						vendor_address: { ...vendor_address, regions: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, region: false },
						vendor_address: { ...vendor_address, regions: [] }
					}));
				});
		}
	}

	fetchDistricts = (params) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, district: true },
				vendor_address: { ...vendor_address, districts: [] }
			}));
			this.props.fetchDistricts(params)
				.then((resp) => {
					let m_district = resp.data.data;
					let options = m_district.map((dt) => {
						return { value: dt.id, label: `${dt.id} - ${dt.name}` };
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, district: false },
						vendor_address: { ...vendor_address, districts: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, district: false },
						vendor_address: { ...vendor_address, districts: [] }
					}));
				});
		}
	}

	fetchSubDistricts = (params) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, subDistrict: true },
				vendor_address: { ...vendor_address, subDistricts: [] }
			}));
			this.props.fetchSubDistricts(params)
				.then((resp) => {
					let m_sub_district = resp.data.data;
					let options = m_sub_district.map((dt) => {
						return { value: dt.id, label: `${dt.id} - ${dt.name}` };
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, subDistrict: false },
						vendor_address: { ...vendor_address, subDistricts: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, subDistrict: false },
						vendor_address: { ...vendor_address, subDistricts: [] }
					}));
				});
		}
	}

	fetchVillages = (params) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, village: true },
				vendor_address: { ...vendor_address, villages: [] }
			}));
			this.props.fetchVillages(params)
				.then((resp) => {
					let m_sub_district = resp.data.data;
					let options = m_sub_district.map((dt) => {
						return { value: dt.id, label: `${dt.id} - ${dt.name}` };
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, village: false },
						vendor_address: { ...vendor_address, villages: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Village', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, village: false },
						vendor_address: { ...vendor_address, villages: [] }
					}));
				});
		}
	}

	fetchPostcalCode = (params) => {
		if (this._isMounted) {
			this.setState(({ loadings, vendor_address }) => ({
				loadings: { ...loadings, postcalCode: true },
				vendor_address: { ...vendor_address, postcalCodes: [] }
			}));
			this.props.fetchPostcalCode(params)
				.then((resp) => {
					let m_postcal_code = resp.data.data;
					let options = m_postcal_code.map((dt) => {
						return { value: dt.id, label: dt.name };
					})
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, postcalCode: false },
						vendor_address: { ...vendor_address, postcalCodes: options }
					}));
				})
				.catch((resp) => {
					let message = (typeof resp !== 'undefined') ? resp.message : 'Error';
					toastr.error('Failed Load Countries', message);
					this.setState(({ loadings, vendor_address }) => ({
						loadings: { ...loadings, postcalCode: false },
						vendor_address: { ...vendor_address, postcalCodes: [] }
					}));
				});
		}
	}

	// VERIFICATION
	saveVerificationItem = (uuid, path, payload) => {
		if (this._isMounted) {
			this.setState(({ verification }) => ({ verification: { ...verification, loadingButton: true } }));
			this.props.saveVerificationItem(uuid, path, payload)
				.then((resp) => {
					this.setState(({ vendor_address }) => ({ vendor_address: { ...vendor_address, loading: true, } }));
					this.setState(({ vendor_address, verification }) => ({
						verification: { ...verification, note: '', loadingButton: false, loading: false, errors: [], loadingNote: true },
						vendor_address: { ...vendor_address, loading: false }
					}), () => {
						setTimeout(() => {
							this.child.current.fetchData() && this.showVendorAddress(this.state.user_uuid) && this.setState(({ verification }) => ({
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
		const loading = this.state.vendor_address.loading;
		return (
			<div>
				{this.state.vendor_address.loading && (<center> <br /> <ReactLoading type="cylon" color="#0f9e3e" /> <br /> </center>)}
				{ !this.state.vendor_address.loading && this.state.isVendor && this.props.revisi !== undefined && this.props.revisi.status==='n' && <p className="text-danger"> <b> {t("profileVendor:catatan-revisi")} </b> {this.props.revisi.note} </p>}
				{this.state.vendor_address.loading === false &&
					<FormAlamat
						vendor_address={this.state.vendor_address}
						loadings={this.state.loadings}
						save={this.updateVendorAddress}
						fetchRegion={this.fetchRegions}
						fetchDistrict={this.fetchDistricts}
						fetchSubDistrict={this.fetchSubDistricts}
						fetchVillages={this.fetchVillages}
						fetchPostcalCode={this.fetchPostcalCode}
						isVendor={this.state.isVendor}
						has_draft_verification={this.props.verification.has_draft_verification} has_verification={this.props.verification} parentState={this.state}
					/>}
					{!loading && this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
					<div>
						{!loading && !this.state.verification.loadingNote && !this.state.isVendor && this.props.getId.verification_uuid !== false &&  <NoteVerificationData
							status_vendor={this.props.verification.status_vendor}
							data={this.state.verification}
							vendor_uuid={this.state.user_uuid}
							verification_uuid={this.props.getId.verification_uuid}
							path={"vendor_address"}
							access={this.props.access}
							verification={this.saveVerificationItem}
							status={this.state.vendor_address.sendData.status}
							isVerifMultiple={true}
						/>}
						{!loading && !this.state.isVendor && this.props.getId.verification_uuid !== false && <TableVerificationData
							ref={this.child}
							vendor_uuid={this.state.user_uuid}
							verification_uuid={this.props.getId.verification_uuid}
							path={"vendor_address"}
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
							path={"vendor_address"}
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
		vendor: state.vendorProfile.vendor,
		user: state.auth.user.data,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchCountries: (params) => dispatch(fetchCountries(params)),
		fetchCompanies: (params) => dispatch(fetchCompanies(params)),
		fetchRegions: (params) => dispatch(fetchRegions(params)),
		fetchDistricts: (params) => dispatch(fetchDistricts(params)),
		fetchSubDistricts: (params) => dispatch(fetchSubDistricts(params)),
		fetchPostcalCode: (params) => dispatch(fetchPostcalCode(params)),
		fetchCompanyType: (params) => dispatch(fetchCompanyType(params)),
		fetchVillages: (params) => dispatch(fetchVillages(params)),
		showVendorAddress: (id,params) => dispatch(showVendorAddress(id,params)),
		updateVendorAddress: (id, payload) => dispatch(updateVendorAddress(id, payload)),
		showVerificationItem: (uuid, path, params) => dispatch(showVerificationItem(uuid, path, params)),
		saveVerificationItem: (uuid, path, payload) => dispatch(saveVerificationItem(uuid, path, payload)),
		saveVerificationLineItem: (uuid, item_uuid, path, payload) => dispatch(saveVerificationLineItem(uuid, item_uuid, path, payload)),
		deleteVerificationLineItem: (uuid, item_uuid, path) => dispatch(deleteVerificationLineItem(uuid, item_uuid, path)),
		showLogHistory: (uuid, path, params) => dispatch(showLogHistory(uuid, path, params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Perusahaan));