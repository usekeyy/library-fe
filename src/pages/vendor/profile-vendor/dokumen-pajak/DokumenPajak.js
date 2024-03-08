import React from 'react';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import PajakSppkp from './sub/pajak-sppkp/PajakSppkp';
import PajakSpt from './sub/pajak-spt/PajakSpt';
import PajakFiskal from './sub/pajak-fiskal/PajakFiskal';
import { withTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

class DokumenPajak extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			toggle: [],
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			collapse: [
				{	id: 1, alias: 'SPPKP', name: 'SPPKP', type: 'sppkp', collapse: false, isOpen: false, color:"black"},
				{	id: 2, alias: 'SPT Tahunan', name: 'SPT Tahunan', type: 'spt', collapse: false, isOpen: false, color:"black"},
				{	id: 3, alias: 'Surat Keterangan Fiskal', name: 'Surat Keterangan Fiskal', type: 'fiskal', collapse: false, isOpen: false , color:"black"},
			],
			// pathActive: props.location.name
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

	toggleCollapse = (index) => {		
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

	handlerChangeColor = (index) => {
		var newArray = [];
		for (let collapseObj of this.state.collapse) {
			if (collapseObj.id === index) {
				collapseObj.color = 'red';
			}
			newArray.push(collapseObj);
		}
		this.setState({
			collapse: newArray
		});
	}
	
	render() {
		const {t} = this.props;
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
					<li className="breadcrumb-item active">Dokumen Pajak</li>
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
										{value.type === 'sppkp' && 
											<>
											{t("profileVendor:title.sppkp")}
											{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi)})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
											
										}
										{value.type === 'spt' &&
											<>
												{t("profileVendor:title.spt-tahunan")}
												{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
										}
										{value.type === 'fiskal' && 
											<>
												{t("profileVendor:title.surat-fiskal")}
												{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)}
											</>
											
										}
									</CardHeader>
									<Collapse isOpen={value.collapse}>
										<CardBody>
											{ value.type === 'sppkp' && 
											<PajakSppkp title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal = {this.state.isInternal}/> 
											}
											{value.isOpen && value.type === 'spt' && 
													<PajakSpt title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal = {this.state.isInternal}/>
											}
											{value.isOpen && value.type === 'fiskal' && 
													<PajakFiskal title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal = {this.state.isInternal}/>
											}
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
		user: state.auth.user.data,
    getId: state.vendorProfile,
		verification: state.verification.verification,
		collapseActive: state.vendorProfile.collapseActive
	}
}

const dispatchToProps = dispatch => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DokumenPajak));