import React from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { PageSettings } from '../../config/page-settings';
import Login from '../auth/login/Login';
import PaktaIntegritas from './sub/pakta-integritas/PaktaIntegritas'

import { withTranslation } from 'react-i18next';
import {
	fetchCompany, 
	fetchPurchasingOrg, 
	fetchCountry,
	fetchRegion, 
	fetchDistrict,
	fetchVendorType, 
	fetchSubDistrict,
	fetchVillage,
	fetchPostcalCode,
	saveVendor,
	fetchTederUmum
} from '../../store/actions/beranda/berandaActions';
import { fetchPraQualificationTenderList } from '../../store/actions/tendering/praQualificationActions'
import { guestUpload } from '../../store/actions/uploadActions';

class Beranda extends React.Component {
	static contextType = PageSettings;
	constructor(props) {
		super(props);
		
		this._isMounted = false;
		this.showTab = this.showTab.bind(this);
		this.state = {
			bgLogo: '/app-assets/images/procsi-profile-cover.jpg',
			bgId: '/app-assets/images/id.png',
			bgEn: '/app-assets/images/en.png',
			lang : localStorage.getItem("i18nextLng"),
			uuid_tender: '',
			tabBeranda: true,
			tabRegistrasi: false,
			tabDownload: false,
			tabKontak: false,
			tabPhoto: false,
			tabVideo: false,
			tabFriend: false,
			tabLogin: true,
			isShowPaktaIntegritas: false,
			dateTime: '',
			tempData: {
				name: '',
				company_type: '',
				direktur_utama: '',
				vendor_type_id: '',
				purchasing_org_id: '',
				email: '',
				website: '',
				pic_name: '',
				pic_phone_no: '',
				npwp_number: '',
				npwp_date: '',
				npwp_file: '',
				tdp_number: '',
				tdp_date: '',
				tdp_file: '',
				address_address: '',
				address_country_id: '',
				address_region_id: '',
				address_district_id: '',
				address_kecamatan_id: '',
				address_village_id: '',
				address_postal_code: '',
			},
			sendData: {},
			loadings: {
				company_type: false,
				purchasing_org: false,
				country: false,
				reegion: false,
				district: false,
				sub_district: false,
				village: false,
				postcal_code: false,
				vendor_type: false,
				vendor: false,
				form: false
			},
			errors: {},
			m_country: [],
			m_company: [],
			m_purchasing_org: [],
			m_region: [],
			m_district: [],
			m_sub_district: [],
			m_village: [],
			m_postcal_code: [],
			m_vendor_type: [],
			m_vendor: [],
			options: {
				start: 0, 
				length: 5, 
			}
		}
	}

	componentDidMount() {
		this.props.history.push('/beranda')
		this._isMounted = true;
		this.setState({sendData: {}})

	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	showTab(e, tab) {
		e.preventDefault();
		this.setState(state => ({
			errors: {},
			tabRegistrasi: (tab === 'registrasi') ? true : false,
			tabDownload: (tab === 'download') ? true : false,
			tabBeranda: (tab === 'beranda') ? true : false,
			tabKontak: (tab === 'kontak') ? true : false,
		}));
	}
	
	toggleLogin = (e, uuid) => {
		e.preventDefault();
		this.setState({ tabLogin: true, uuid_tender: uuid })
	}

	startTime = () => {
		if(this._isMounted){
			const lang = localStorage.getItem("i18nextLng");
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			m = this.checkTime(m);
			s = this.checkTime(s);
			var date = new Date();
			var tahun = date.getFullYear();
			var bulan = date.getMonth();
			var tanggal = date.getDate();
			var hari = date.getDay();
			// var jam = date.getHours();
			// var menit = date.getMinutes();
			// var detik = date.getSeconds();
			switch(hari) {
				case 0: hari = (lang === "en") ? "Sunday" : "Minggu"; break;
				case 1: hari = (lang === "en") ? "Monday" : "Senin"; break;
				case 2: hari = (lang === "en") ? "Tuesday" : "Selasa"; break;
				case 3: hari = (lang === "en") ? "Wednesday" : "Rabu"; break;
				case 4: hari = (lang === "en") ? "Thursday" : "Kamis"; break;
				case 5: hari = (lang === "en") ? "Friday" : "Jum'at"; break;
				case 6: hari = (lang === "en") ? "Saturday" : "Sabtu"; break;
				default: break;
			}
			switch(bulan) {
				case 0: bulan = (lang === "en") ? "January" : "Januari"; break;
				case 1: bulan = (lang === "en") ? "February" : "Februari"; break;
				case 2: bulan = (lang === "en") ? "March" : "Maret"; break;
				case 3: bulan = (lang === "en") ? "April" : "April"; break;
				case 4: bulan = (lang === "en") ? "May" : "Mei"; break;
				case 5: bulan = (lang === "en") ? "June" : "Juni"; break;
				case 6: bulan = (lang === "en") ? "July" : "Juli"; break;
				case 7: bulan = (lang === "en") ? "August" : "Agustus"; break;
				case 8: bulan = (lang === "en") ? "September" : "September"; break;
				case 9: bulan = (lang === "en") ? "October" : "Oktober"; break;
				case 10: bulan = (lang === "en") ? "November" : "November"; break;
				case 11: bulan = (lang === "en") ? "December" : "Desember"; break;
				default: break;
			}
			var tampilTanggal = "" + hari + ", " + tanggal + " " + bulan + " " + tahun;
			// var tampilWaktu = "Jam: " + jam + ":" + menit + ":" + detik;

			document.getElementById('dateTime').innerHTML =
			tampilTanggal + " " + h + ":" + m + ":" + s;
			setTimeout(this.startTime, 500);
		}
	}

	handleData(data) {
		var date = new Date(data);	
		const lang = localStorage.getItem("i18nextLng");	
		var tahun = date.getFullYear();
		var bulan = date.getMonth();
		var tanggal = date.getDate();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var hari = date.getDay();
		h = this.checkTime(h);
		m = this.checkTime(m);
		s = this.checkTime(s);	
		switch(hari) {
			case 0: hari = (lang === "en") ? "Sunday" : "Minggu"; break;
			case 1: hari = (lang === "en") ? "Monday" : "Senin"; break;
			case 2: hari = (lang === "en") ? "Tuesday" : "Selasa"; break;
			case 3: hari = (lang === "en") ? "Wednesday" : "Rabu"; break;
			case 4: hari = (lang === "en") ? "Thursday" : "Kamis"; break;
			case 5: hari = (lang === "en") ? "Friday" : "Jum'at"; break;
			case 6: hari = (lang === "en") ? "Saturday" : "Sabtu"; break;
			default: break;
		}
		switch(bulan) {
			case 0: bulan = (lang === "en") ? "January" : "Januari"; break;
			case 1: bulan = (lang === "en") ? "February" : "Februari"; break;
			case 2: bulan = (lang === "en") ? "March" : "Maret"; break;
			case 3: bulan = (lang === "en") ? "April" : "April"; break;
			case 4: bulan = (lang === "en") ? "May" : "Mei"; break;
			case 5: bulan = (lang === "en") ? "June" : "Juni"; break;
			case 6: bulan = (lang === "en") ? "July" : "Juli"; break;
			case 7: bulan = (lang === "en") ? "August" : "Agustus"; break;
			case 8: bulan = (lang === "en") ? "September" : "September"; break;
			case 9: bulan = (lang === "en") ? "October" : "Oktober"; break;
			case 10: bulan = (lang === "en") ? "November" : "November"; break;
			case 11: bulan = (lang === "en") ? "December" : "Desember"; break;
			default: break;
		}
		var tampilTanggal =  hari+", "+tanggal + " " + bulan + " " + tahun + " "  + h + " : " + m + " : " + s ;
		document.getElementById('dateTime').innerHTML = tampilTanggal;
		localStorage.setItem('times' , date)
	}

	checkTime = (i) => {
		if(this._isMounted){
			if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		}
	}

	goBack = (e) => {
		e.preventDefault()
		this.setState({tabLogin: false})
	}

	changeLanguage = lng => {
    this.props.i18n.changeLanguage(lng);
	};

	isConfirm = () => {
		if(this._isMounted){
			// console.log(this.state.sendData);
			this.saveVendor(this.state.sendData);
		}
	}

	isCancel = () => {
		this.setState({ isShowPaktaIntegritas: false })
	}

	saveVendor = (data) => {
		const toastrMessageOptions = {
			timeOut: 20000, // Default value is 0
			onShowComplete: () => console.log('SHOW: animation is done'),
			onHideComplete: () => console.log('HIDE: animation is done'),
			removeOnHover: false, // Default value is false
			removeOnHoverTimeOut: 1000, // Default value is 1000
			// component: React.Component
		};
		if(this._isMounted){
			this.setState(({ loadings }) => ({ 
				loadings: { ...loadings, form: true }
			}));
			delete data.npwp_file_name;
			delete data.tdp_file_name;
			this.props.saveVendor(data)
			.then((resp) => {
				this.setState(({ loadings }) => ({
					tabLogin: true,
					loadings: { ...loadings, form: false },
					isShowPaktaIntegritas: false,
					errors: {},
					sendData: {}
				}));
				toastr.success('Success Save Data');
				toastr.info('mohon cek inbox/spam pada email pic untuk aktivasi akun', toastrMessageOptions);
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, form: false },
					errors: resp.data.errors,
					isShowPaktaIntegritas: false
				}));
				toastr.error('Failed Save Data');
			});
		}
	}

	render() {
		const { t } = this.props;
		// const count = 11;
		// const name = 'alex'
		const styles = {
			'minHeight': '2px',
			'width': '15px',
			'height': '15px',
			'borderRadius': '10px',
			'backgroundRepeat': 'no-repeat',
			'backgroundSize': '15px',
			'backgroundPosition': 'center',
		}

		const lang = localStorage.getItem("i18nextLng");
		
		return (
			<div>
				{this.state.tabLogin && <Login goBack={this.goBack} />}
				{this.state.tabLogin === false && 
					<div style={{minHeight:'100vh'}}>
						<div className="profile">
							<div className="profile-header">
								<div className="profile-header-cover" style={{ backgroundImage: 'url(' + this.state.bgLogo + ')' }}></div>
								<div className="profile-header-content">
									{/* <div className="profile-header-img">
										<img src="/assets/img/user/user-13.jpg" alt="" />
									</div> */}
									<div className="profile-header-info">
										{/* <img width="5%" src="/app-assets/images/procsi-logo.png" alt='img-logo-beranda'></img> */}
										{/* <p className="m-b-10" style={{color : "#1bbcea", fontWeight : "bold", fontSize : "14px"}}>Procurement System Integration</p> */}
										<img width="5%" src="/app-assets/images/logo-beranda.png"></img>
										<p className="m-b-10">Procurement System Integration</p>
										<p className="m-b-10" id="dateTime">  </p>
										<button type="button" onClick={e => this.toggleLogin(e, '')} className="btn btn-xs btn-info">Login</button>
										{/* <button type="button" onClick={() => this.props.history.push('/login')} className="btn btn-xs btn-info">Login</button> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				}
				{this.state.isShowPaktaIntegritas && 
					<PaktaIntegritas 
						loadings={this.state.loadings}
						toggleOpen={this.state.isShowPaktaIntegritas}
						isConfirm={this.isConfirm}
						isCancel={this.isCancel}
						allProps={this.props}
					/>
				}
			</div>
		)
	}
}


const stateToProps = state => {
	return {

	}
}

const dispatchToProps = dispatch => {
	return {
		fetchCompany: (params) => dispatch(fetchCompany(params)),
		fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
		fetchCountry: (params) => dispatch(fetchCountry(params)),
		fetchRegion: (params) => dispatch(fetchRegion(params)),
		fetchDistrict: (params) => dispatch(fetchDistrict(params)),
		fetchVendorType: (params) => dispatch(fetchVendorType(params)),
		fetchSubDistrict: (params) => dispatch(fetchSubDistrict(params)),
		fetchVillage: (params) => dispatch(fetchVillage(params)),
		fetchPostcalCode: (params) => dispatch(fetchPostcalCode(params)),
		saveVendor: (payload) => dispatch(saveVendor(payload)),
		guestUpload: (id, payload) => dispatch(guestUpload(id, payload)),
		fetchTederUmum: (params) => dispatch(fetchTederUmum(params)),
		fetchPraQualificationTenderList: (params) => dispatch(fetchPraQualificationTenderList(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation("common")(Beranda));
