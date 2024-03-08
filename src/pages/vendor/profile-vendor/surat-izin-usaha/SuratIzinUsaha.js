import React from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import Siup from './sub/Siup/Siup';
import Situ from './sub/Situ/Situ';
import Tdp from './sub/Tdp/Tdp';
import Siujk from './sub/Siujk/Siujk';
import Sil from './sub/Sil/Sil';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

class SuratIzinUsaha extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			toggle: [],
			collapse: [
				{	id: 1, alias: 'Surat Ijin Usaha Perdagangan (SIUP)', name: 'Surat Ijin Usaha Perdagangan (SIUP)', type: 'siup', collapse: false, isOpen: false },
				{	id: 2, alias: 'SITU/SKDU/Ijin Lokasi', name: 'SITU / SKDU / Ijin Lokasi', type: 'situ', collapse: false, isOpen: false },
				{	id: 3, alias: 'Tanda Daftar Perusahan/TDP', name: 'Tanda Daftar Perusahaan (TDP) / Nomor Induk Berusaha (NIB)', type: 'tdp', collapse: false, isOpen: false },
				{	id: 4, alias: 'Surat Ijin Usaha Jasa Konstruksi', name: 'Surat Ijin Usaha Jasa Konstruksi (SIUJK)', type: 'siujk', collapse: false, isOpen: false },
				{	id: 5, alias: 'Surat Ijin Lainnya', name: 'Surat Ijin Lainnya', type: 'sil', collapse: false, isOpen: false },
			],
			// pathActive: props.location.name,
			pathActive: localStorage.getItem("pathConfirmVerifikator") ? localStorage.getItem("pathConfirmVerifikator") : undefined,
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
			siup: {
				data: {},
				sendData: {
					id: '',
					uuid: '',
					nomor: '',
					file: '',
					start_date: '',
					end_date: '',
					issued_by: '',
					status: '',
					created_at: '',
					udpated_at: '',
					created_by: '',
					updated_by: '',
				},
				errors: [],
				loading: false,
				loadingButton: false
			},
		};
	}

	componentDidMount(){
		this._isMounted = true;
		localStorage.removeItem("pathConfirmVerifikator")
		if(this._isMounted){
			console.log(this.state.pathActive)
			if (this.state.pathActive !== undefined){
				let datak = this.state.collapse.map((data) => {
					if (data.alias === this.state.pathActive){
						return {
							id: data.id, alias:data.alias, name: data.name, type: data.type, collapse: true, isOpen: true
						}
					}else{
						return data
					}
				})
				this.setState({collapse : datak})

			}else{
				let datak = this.state.collapse.map((data) => {
					if(data.id === 1){
						return {
							id: data.id, alias:data.alias, name: data.name, type: data.type, collapse: true, isOpen: true
						}
					}else{
						return data
					}
				})
				this.setState({collapse : datak})
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

	toggleCollapse = (index) => {
		// this.setState({toggle: index});
		console.log(this.state.toggle);
		var newArray = [];
		for (let collapseObj of this.state.collapse) {
			if (collapseObj.id === index) {
				collapseObj.isOpen = true;
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

	render() {
		const { t } = this.props;
		const colorPanelBlack = {
			// 'background': 'black',
			// 'font-weight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(87, 174, 229, 1) 0%, rgba(97, 188, 246, 1) 100%)',
		}

		const colorPanelRed = {
			'fontWeight' : 'bold',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
		}
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Surat Izin Usaha</li>
				</ol>
				<h1 className="page-header">Profil Vendor </h1>
				<div className="row">
					<div className="col-md-3">
						<ProfileVendor />
					</div>
					<div className="col-md-9">
						<div id="accordion" className="accordion">
							{
								this.state.collapse.map((value, i) => (
								<Card className="bg-white text-black" key={i}>
									<CardHeader style={(this.state.isVendor && this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[value.alias] !== undefined && this.props.verification[value.alias]).status==="n" ? colorPanelRed : colorPanelBlack } className={'card-header bg-dark-darker text-white set-pointer ' + (!value.collapse ? 'collapsed ' : '')} onClick={() => this.toggleCollapse(value.id)}>
										<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i>
										{value.type === 'siup' &&
											<>
												{t("profileVendor:title.siup")}
												{!this.state.isInternal && (this.state.isVendor ?
												<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi)})</div>
												:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
											
										}
										{value.type === 'situ' &&
											<>
												{t("profileVendor:title.situ")}
												{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi)})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</> 
											
											
										}
										{value.type === 'tdp' &&
											<>
												{t("profileVendor:title.tdp")}
												{!this.state.isInternal && (this.state.isVendor ?
												<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi)})</div>
												:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
										}
										{value.type === 'siujk' && 
											<>
												{t("profileVendor:title.siujk")}
												{!this.state.isInternal && (this.state.isVendor ?
												<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
												:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
										}
										{value.type === 'sil' &&
										<>
											{t("profileVendor:title.sil")}
											{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
										</>
											
										}
									</CardHeader>
									<Collapse isOpen={value.collapse}>
										<CardBody>
											{ value.isOpen && value.type === 'siup' && <Siup  title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
											{ value.isOpen && value.type === 'situ' && <Situ title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
											{ value.isOpen && value.type === 'tdp' && <Tdp title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
											{ value.isOpen && value.type === 'siujk' && <Siujk title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
											{ value.isOpen && value.type === 'sil' && <Sil title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
										</CardBody>
									</Collapse>
								</Card>
								))
							}
						</div>
					</div>
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
		user : state.auth.user.data,
		verification: state.verification.verification,
		collapseActive: state.vendorProfile.collapseActive
	}
}

const dispatchToProps = dispatch => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(SuratIzinUsaha));