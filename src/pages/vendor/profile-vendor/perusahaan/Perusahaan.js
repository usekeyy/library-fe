import React from 'react';
import {connect} from 'react-redux';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import Profile from './sub/profile/Profile';
import Alamat from './sub/alamat/Alamat';
import { withTranslation } from 'react-i18next';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

class Perusahaan extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		const { t } = props;
		this.state = {
			toggle: [],
			vendor_type_id: 0,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			collapse: [
				{ id: 1, alias:'Nama Perusahaan', name: t("profileVendor:title.company-name"), type: 'nama-perusahaan', collapse: false, isOpen: false },
				{ id: 2, alias:'Alamat Perusahaan', name: t("profileVendor:title.company-address"), type: 'alamat-perusahaan', collapse: false, isOpen: false },
			],
			// pathActive: props.location.name
			isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
			pathActive: localStorage.getItem("pathConfirmVerifikator") ? localStorage.getItem("pathConfirmVerifikator") : undefined
		};
	}

	

	componentDidMount() {
		this._isMounted = true;
		console.log(this.props.location.pathname)
		localStorage.removeItem("pathConfirmVerifikator")
		if (this._isMounted) {
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

	setVendorType = (type) => {
		this.setState({vendor_type_id: type})
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
			// 'background': 'rgb(173,0,0)',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
		}
		
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Vendor Management</li>
					<li className="breadcrumb-item active">Profil Perusahaan</li>
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
										<CardHeader style={(this.state.isVendor && this.props.verification?.has_draft_verification !== undefined && this.props.verification?.has_draft_verification === false && this.props.verification[value.alias] !== undefined && this.props.verification[value.alias]).status==="n" ? colorPanelRed : colorPanelBlack } className={'card-header bg-dark-darker text-white set-pointer ' + (!value.collapse ? 'collapsed ' : '')} onClick={() => this.toggleCollapse(value.id)}>
											<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i> 
											{value.type === 'nama-perusahaan' &&
												<>
													{t("profileVendor:title.company-name")}
													{!this.state.isInternal && (this.state.isVendor ?
													<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification["Nama Perusahaan"]?.tipe_verifikasi)})</div>
													:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification["Nama Perusahaan"])})</div>)}
													{/* ) */}
												</>
												
											}
											{value.type === 'alamat-perusahaan' &&
												<>
												{t("profileVendor:title.company-address")}
												{!this.state.isInternal && (this.state.isVendor ?
												<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification["Alamat Perusahaan"]?.tipe_verifikasi)})</div> 
												:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification["Alamat Perusahaan"])})</div>)}
												</>
											}
										</CardHeader>
										<Collapse isOpen={value.collapse}>
											<CardBody>
												{value.type === 'nama-perusahaan' && value.isOpen &&
													<Profile 
														history={this.props.history} 
														pathname={this.props.location.pathname} title={value.name} 
														revisi={(this.props.verification?.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} 
														setVendorType={this.setVendorType}
														collapse={() => this.toggleCollapse(value.id)}
														isInternal = {this.state.isInternal} 
													/>
												}
												{value.type === 'alamat-perusahaan' && value.isOpen && 
													<Alamat 
														title={value.name} 
														revisi={(this.props.verification?.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} 
														parentState={this.state}
														collapse={() => this.toggleCollapse(value.id)}
														isInternal = {this.state.isInternal} 
														/>
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
			vendor: state.vendorProfile,
			user : state.auth.user.data,
			verification: state.verification?.verification,
			collapseActive: state.vendorProfile.collapseActive
    }
}

const dispatchToProps = dispatch => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Perusahaan));