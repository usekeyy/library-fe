import React from 'react';
import ProfileVendor from '../ProfileVendor';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import SubRekeningBank from './sub/SubRekeningBank';
import { withTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import {camelCase} from '../../../../helpers/camelCase';
import {statusKonfirmasiVerifikator} from '../../../../helpers/statusName';

class RekeningBank extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			toggle: [],
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			isInternal: this.props.location.pathname.split("/")[2] === 'list' ? true : false,
			collapse: [
				{	id: 1, alias: 'Rekening Bank', name: 'Rekening Bank', type: 'RekeningBank', collapse: true, },
			]
		};
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			
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
		// console.log(this.state.toggle);
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
					<li className="breadcrumb-item active">{t("profileVendor:sub-accordion.rekening-bank")}</li>
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
										<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i> {t("profileVendor:sub-accordion.rekening-bank")}
										{!this.state.isInternal && (this.state.isVendor ?
											<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({camelCase(this.props?.verification[value.alias]?.tipe_verifikasi?.[0])})</div>
											:<div style={{color:"yellow", fontWeight:"bold", float:"right"}}>({statusKonfirmasiVerifikator(this.props?.verification?.status_vendor,this.props?.verification[value.alias])})</div>)
										}
									</CardHeader>
									<Collapse isOpen={value.collapse}>
										<CardBody>
											<SubRekeningBank title={value.name} revisi={(this.props.verification.has_draft_verification === false) ? this.props.verification[value.alias] : undefined} collapse={() => this.toggleCollapse(value.id)} isInternal = {this.state.isInternal}/>
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
    user: state.auth.user.data,
		vendor: state.vendorProfile.vendor,
    getId: state.vendorProfile,
    verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {

	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(RekeningBank));