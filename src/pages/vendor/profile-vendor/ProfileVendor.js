import React from 'react';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import { Route, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {showLastVerification, showLastVerificationForVerifikator} from '../../../store/actions/vendor/verifikasiDataActions';
import {vendorResponse} from '../../../store/actions/vendor/profile-vendor/perusahaanActions';
import { withTranslation } from 'react-i18next';

class ProfileVendor extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			data:[],
			uri: null,
			toggle: [],
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : (this.props.vendor.vendor !== undefined) ? this.props.vendor.vendor.uuid : null,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
			collapse: [
				{	
					id: 1, 
					name: 'Data Administrasi',
					collapse: false,
					children: [
						{ 
							id: 101, 
							name: 'Profil Perusahaan', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/profile' : '/vendor/verification/profile'),
							children: ["Nama Perusahaan", "Alamat Perusahaan"] 
						},
						{ 
							id: 102, 
							name: 'Informasi Legal', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/informasi-legal' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/informasi-legal' : '/vendor/verification/informasi-legal'),
							children: ["Akta Perusahaan","Nomor Pokok Wajib Pajak (NPWP)"," Pakta Integritas"]
						},
						{ 
							id: 103, 
							name: 'Surat Izin Usaha', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/surat-izin-usaha' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/surat-izin-usaha' : '/vendor/verification/surat-izin-usaha'),
							children: ["Surat Ijin Usaha Perdagangan (SIUP)","SITU/SKDU/Ijin Lokasi","Tanda Daftar Perusahan/TDP","Surat Ijin Usaha Jasa Konstruksi","Surat Ijin Lainnya"]
						},
						{ 
							id: 104, 
							name: 'Pemegang Saham', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pemegang-saham' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/pemegang-saham' : '/vendor/verification/pemegang-saham'),
							children:["Pemegang Saham"]
						},
						{ 
							id: 105, 
							name: 'Pengurus Perusahaan', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pengurus-perusahaan' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/pengurus-perusahaan' : '/vendor/verification/pengurus-perusahaan'),
							children:["Pengurus Perusahaan"]
						},
						{ 
							id: 106, 
							name: 'PIC', 
							parent_id: 1, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/profile-pic' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/profile-pic' : '/vendor/verification/profile-pic'),
							children:["PIC"] 
						},
					] 
				},
				{	
					id: 2, 
					name: 'Kompetensi & Pengalaman Kerja',
					collapse: false,
					children: [
						{ 
							id: 201, 
							name: 'Alat/Mesin Perusahaan', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/alat-perusahaan' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/alat-perusahaan' : '/vendor/verification/alat-perusahaan'),
							children: ["Alat"]
						},
						{ 
							id: 202, 
							name: 'Tenaga Ahli', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/tanaga-ahli' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/tanaga-ahli' : '/vendor/verification/tanaga-ahli'),
							children: ["Tenaga Ahli"] 
						},
						{ 
							id: 203, 
							name: 'Kompetensi', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/kompetensi' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/kompetensi' : '/vendor/verification/kompetensi'),
							children: ["Kompetensi"]
						},
						{ 
							id: 204, 
							name: 'Pengalaman Pekerjaan', 
							parent_id: 2, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/pengalaman-kerja' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/pengalaman-kerja' : '/vendor/verification/pengalaman-kerja'),
							children:["Pengalaman Pekerjaan"]
						},
					] 
				},
				{	
					id: 3, 
					name: 'Data Keuangan',
					collapse: false,
					children: [
						{ 
							id: 301, 
							name: 'Rekening Bank', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/rekening-bank' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/rekening-bank' : '/vendor/verification/rekening-bank'),
							children:["Rekening Bank"]
						},
						{ 
							id: 302, 
							name: 'Laporan Keuangan', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/laporan-keuangan' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/laporan-keuangan' : '/vendor/verification/laporan-keuangan'),
							children:["Laporan Keuangan Neraca","Laporan Keuangan Laba Rugi","Laporan Keuangan Lainnya"]
						},
						{ 
							id: 303, 
							name: 'Dokumen Pajak', 
							parent_id: 3, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/dokumen-pajak' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/dokumen-pajak' : '/vendor/verification/dokumen-pajak'),
							children:["SPPKP","SPT Tahunan","Surat Keterangan Fiskal"]
						},
					] 
				},
				{	
					id: 4, 
					name: 'Konfirmasi',
					collapse: false,
					children: [
						{ 
							id: 401, 
							name: 'Konfirmasi', 
							parent_id: 4, 
							path: this.props.user.has_roles.includes("VNDR01") ? '/vendor/profile/konfirmasi' : (this.props.location.pathname.split("/")[2] === 'list' ? '/vendor/list/daftar-vendor/konfirmasi' : '/vendor/verification/konfirmasi'),
							children:[]
						},
					] 
				},
			]
		};
		// this.toggleCollapse = this.toggleCollapse.bind(this);
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			if(this.state.isVendor || this.props.user.has_roles.includes('VMG001')){
				this.showPayload(this.state.user_uuid)
			} else {
				this.showPayloadVerificator(this.state.user_uuid)
			}
			setTimeout(() => {
				if(this.props.location.pathname.includes('/vendor/profile')){
					this.props.vendorResponse({type: false});
				}
				// console.log(this.props.location.pathname === '/vendor/profile');
				this.setState({ uri: this.props.location.pathname })
				this.setCollapse()
				if(this.props.getId.verification_uuid === false) { this.removeKonfirm() }
			}, 100)
		} 
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	checkTolakData = (value,level) => {
		// console.log(value)
		let isTolakData = false;
		if (this.state.isVendor){
			if (level === "menu"){
				value.children.forEach((data) => {
					data.children.forEach((dataChildren) => {
						let isTolakDataTemp=(this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[dataChildren] !== undefined && this.props.verification[dataChildren]).status==="n" ? true : false;
						if (isTolakDataTemp){
							isTolakData = isTolakDataTemp
						}
					})
				})
			}else if(level === "subMenu"){
				value.children.forEach((dataChildren) => {
					// console.log(dataChildren)
					let isTolakDataTemp=(this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[dataChildren] !== undefined && this.props.verification[dataChildren]).status==="n" ? true : false;
					if (isTolakDataTemp){
						isTolakData = isTolakDataTemp
						console.log("tes")
					}
				})
			}
		}
		return isTolakData;
	}
		
	
	removeKonfirm() {
		var array = [...this.state.collapse]; // make a separate copy of the array
		array.splice(3, 1);
		this.setState({collapse: array});
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

	setCollapse = () => {
		let uri = this.props.location.pathname;
		this.state.collapse.map(dd => dd.children.map(item => {
			if(uri === item.path){
				this.toggleCollapse(item.parent_id)
			}
			return null
		}));
	}

	showPayload = async (uuid) => {
		this.props.showLastVerification(uuid)
		.then((resp) => {
			var data = resp.data;
			var setSendData = { ...this.state }
			setSendData.data = data;
			this.setState({ setSendData });
		})
		.catch((resp) => {
			// this.props.location.history.push('/error/404')
			// let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			// toastr.error(message);
		});
	}

	showPayloadVerificator = async (uuid) => {
		this.props.showLastVerificationForVerifikator(uuid)
		.then((resp) => {
			var data = resp.data;
			var setSendData = { ...this.state }
			setSendData.data = data;
			this.setState({ setSendData });
		})
		.catch((resp) => {
			// this.props.location.history.push('/error/404')
			// let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			// toastr.error(message);
		});
	}
	
	  
	render() {
		const actived = { 
			// 'backgroundColor': 'aliceblue',
			'backgroundColor': '#1bbcea',
			'borderRadius': '7px',
			'color' : 'white',
			'fontWeight': 'bold'
		}

		const activedTolak = { 
			// 'backgroundColor': 'aliceblue',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
			'borderRadius': '7px',
			'color' : 'white',
			'fontWeight': 'bold'
		}
		// const actived = 'bg-lime-transparent-1';
		const colorLink = {
			'color' : 'green'
		}
		const colorLinkTolak = {
			'color' : '#DE0A0A',
			'fontWeight': 'bold'
		}
		const colorPanel = {
			// 'background-image': 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)'
			// 'backgroundColor': '#369156',
			// 'background': 'rgb(2,106,103)',
			
			// 'background': 'linear-gradient(90deg, rgba(2,106,103,1) 0%, rgba(2,121,44,1) 100%)',
			'background': 'linear-gradient(90deg, rgba(87, 174, 229, 1) 0%, rgba(97, 188, 246, 1) 100%)',
		}

		const colorPanelRed = {
			'fontWeight' : 'bold',
			// 'background': 'rgb(173,0,0)',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
		}

		const {t} = this.props;
				
		return (
			
			<div>
				{ this._isMounted === false && <p>Loading ... </p>}
				{ this._isMounted && 
					<div id="accordion" className="accordion">
						{
							this.state.collapse.map((value, i) => (
							<Card className="text-white" key={i} >
								<CardHeader style={this.checkTolakData(value,"menu") ? colorPanelRed : colorPanel} className={'card-header text-white set-pointer  ' + (!value.collapse ? 'collapsed ' : '')} onClick={() => this.toggleCollapse(value.id)}>
									<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i>
									{value.name === 'Data Administrasi'&& t("profileVendor:accordion.data-administrasi")}
									{value.name === 'Kompetensi & Pengalaman Kerja'&& t("profileVendor:accordion.kompetensi-pengalaman-kerja")}
									{value.name === 'Data Keuangan'&& t("profileVendor:accordion.data-keuangan")}
									{value.name === 'Konfirmasi'&& t("profileVendor:accordion.konfirmasi")}
								</CardHeader>
								<Collapse isOpen={value.collapse}>
									<CardBody className="bg-white text-black">
										{value.children.map((child, childKey) => (
											<ul key={childKey} style={(this.state.uri === child.path) ? (this.checkTolakData(child,"subMenu") ? activedTolak: actived) : null} >
												<Route>
													<li className="set-pointer"> 
														<Link style={(this.state.uri === child.path) ? (this.checkTolakData(child,"subMenu") ? activedTolak: actived) : (this.checkTolakData(child,"subMenu") ? colorLinkTolak: colorLink) } onClick={() => this.toggleCollapse(child.parent_id)} to={child.path}>
															{child.name === "Profil Perusahaan" && t("profileVendor:sub-accordion.profil-perusahaan")}
															{child.name === "Surat Izin Usaha" && t("profileVendor:sub-accordion.surat-izin-usaha")}
															{child.name === "Informasi Legal" && t("profileVendor:sub-accordion.informasi-legal")}
															{child.name === "Pemegang Saham" && t("profileVendor:sub-accordion.pemegang-saham")}
															{child.name === "Pengurus Perusahaan" && t("profileVendor:sub-accordion.pengurus-perusahaan")}
															{child.name === "PIC" && t("profileVendor:sub-accordion.pic")}
															{child.name === "Alat/Mesin Perusahaan" && t("profileVendor:sub-accordion.alat-mesin-perusahaan")}
															{child.name === "Tenaga Ahli" && t("profileVendor:sub-accordion.tenaga-ahli")}
															{child.name === "Kompetensi" && t("profileVendor:sub-accordion.kompetensi")}
															{child.name === "Pengalaman Pekerjaan" && t("profileVendor:sub-accordion.pengalaman-kerja")}
															{child.name === "Rekening Bank" && t("profileVendor:sub-accordion.rekening-bank")}
															{child.name === "Laporan Keuangan" && t("profileVendor:sub-accordion.laporan-keuangan")}
															{child.name === "Dokumen Pajak" && t("profileVendor:sub-accordion.dokumen-pajak")}
															{child.name === "Konfirmasi" && t("profileVendor:sub-accordion.konfirmasi")}
														</Link> 
														{/* {(this.props.verification[child.alias]!==undefined && this.props.verification[child.alias]).status==="n"  ? "Abang" : "Biru"} */}
													</li>
												</Route>
											</ul>
										))}
									</CardBody>
								</Collapse>
							</Card>
							))
						}
					</div>
				}
			</div>
		)
	}
}

const stateToProps = state => {
	return {
		location: state.sidebarDt.location,
		access: state.sidebarDt.access,
		vendor: state.vendorProfile,
		user : state.auth.user.data,
		getId: state.vendorProfile,
		verification: state.verification.verification,
	}
}

const dispatchToProps = dispatch => {
	return {
		showLastVerification: (vendor_uuid) => dispatch(showLastVerification(vendor_uuid)),
		showLastVerificationForVerifikator: (vendor_uuid) => dispatch(showLastVerificationForVerifikator(vendor_uuid)),
		vendorResponse: data => dispatch(vendorResponse(data)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(ProfileVendor));