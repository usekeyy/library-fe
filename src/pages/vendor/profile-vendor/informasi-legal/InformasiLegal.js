import React from 'react';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import Akta from "./sub/akta-perusahaan/Akta";
import Npwp from "./sub/npwp/Npwp";
import PaktaIntegritas from "./sub/pakta-integritas/PaktaIntegritas";
import { withTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

class InformasiLegal extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			toggle: [],
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			collapse: [
				{	id: 1, alias: 'Akta Perusahaan', name: 'Akta Perusahaan', type: 'akta-perusahaan', collapse: false, isOpen: false },
				{	id: 2, alias: 'Nomor Pokok Wajib Pajak (NPWP)', name: 'Nomor Pokok Wajib Pajak (NPWP)', type: 'vendor-npwp', collapse: false, isOpen: false },
				{	id: 3, alias: 'Pakta Integritas', name: 'Pakta Integritas', type: 'pakta-integritas', collapse: false, isOpen: false },
			],
			// pathActive: this.props.location.name
			isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
			pathActive: localStorage.getItem("pathConfirmVerifikator") ? localStorage.getItem("pathConfirmVerifikator") : undefined
		};
	}

	componentDidMount(){
		this._isMounted = true;
		localStorage.removeItem("pathConfirmVerifikator")
		if(this._isMounted){
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
	
	removePakta() {
		var array = [...this.state.collapse]; // make a separate copy of the array
		array.splice(2, 1);
		this.setState({collapse: array});
	}

	toggleCollapse = (index) => {
		// this.setState({toggle: index});
		// console.log(this.state.toggle);
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
		// const {t} = this.props;
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Informasi Legal</li>
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
										{value.type === 'akta-perusahaan' &&
										<>
										{t("profileVendor:title.akta-perusahaan")}
										{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification["Akta Perusahaan"]?.tipe_verifikasi?.[0])})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification["Akta Perusahaan"])})</div>)}
										</>
										
										}
										{value.type === 'vendor-npwp' &&
										<>
										{t("profileVendor:title.npwp")}
										{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification["Nomor Pokok Wajib Pajak (NPWP)"]?.tipe_verifikasi)})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification["Nomor Pokok Wajib Pajak (NPWP)"])})</div>)}
										</>
										
										}
										{value.type === 'pakta-integritas' &&
										<>
										{t("profileVendor:title.pakta-integritas")}
										{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification["Pakta Integritas"]?.tipe_verifikasi)})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification["Pakta Integritas"])})</div>)}
										</>
										}
									</CardHeader>
									<Collapse isOpen={value.collapse}>
										<CardBody>
										{ value.isOpen && value.type === 'akta-perusahaan' &&  
										<Akta title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
										{ value.isOpen && value.type === 'vendor-npwp' && 
										<Npwp title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
										{ value.isOpen && value.type === 'pakta-integritas' && 
										<PaktaIntegritas title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal={this.state.isInternal}/> }
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

export default connect(stateToProps, dispatchToProps)(withTranslation()(InformasiLegal));