import React from 'react';
import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
import { Route, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {showLastVerification, showLastVerificationForVerifikator} from '../../../store/actions/vendor/verifikasiDataActions';
import {vendorResponse} from '../../../store/actions/vendor/profile-vendor/perusahaanActions';

class Unbilled extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false
		this.state = {
			data:[],
			uri: null,
			toggle: [],
			user_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : (this.props.vendor.vendor !== undefined) ? this.props.vendor.vendor.uuid : null,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			collapse: [
				{	
					id: 1, 
					name: 'Unbilled',
					collapse: false,
					children: [
						{ 
							id: 101, 
							name: 'Barang', 
							parent_id: 1, 
							path: '/invoice/unbilled/barang',
							children: ["List Unbilled - Barang", "Selected Unbilled Invoice"] 
						},
						{ 
							id: 102, 
							name: 'Jasa', 
							parent_id: 1, 
							path: '/invoice/unbilled/jasa',
							children: ["List Unbilled - Jasa", "Selected Unbilled Invoice"] 
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
			// if(this.state.isVendor || this.props.user.has_roles.includes('VMG001')){
			// 	this.showPayload(this.state.user_uuid)
			// } else {
			// 	this.showPayloadVerificator(this.state.user_uuid)
			// }
			setTimeout(() => {
				// if(this.props.location.pathname.includes('/invoice/unbilled-barang')){
				// 	this.props.vendorResponse({type: false});
				// }
				// console.log(this.props.location.pathname === '/vendor/profile');
				this.setState({ uri: this.props.location.pathname })
				this.setCollapse()
				// if(this.props.getId.verification_uuid === false) { this.removeKonfirm() }
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
				value.children.map((data) => {
					data.children.map((dataChildren) => {
						let isTolakDataTemp=(this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[dataChildren] !== undefined && this.props.verification[dataChildren]).status==="n" ? true : false;
						if (isTolakDataTemp){
							isTolakData = isTolakDataTemp
						}
						return true
					})
					return true
				})
			}else if(level === "subMenu"){
				value.children.map((dataChildren) => {
					// console.log(dataChildren)
					let isTolakDataTemp=(this.props.verification.has_draft_verification !== undefined && this.props.verification.has_draft_verification === false && this.props.verification[dataChildren] !== undefined && this.props.verification[dataChildren]).status==="n" ? true : false;
					if (isTolakDataTemp){
						isTolakData = isTolakDataTemp
						console.log("tes")
					}
					return true
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
			'backgroundColor': '#369156',
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
			'background': 'linear-gradient(90deg, rgba(2,106,103,1) 0%, rgba(2,121,44,1) 100%)',
		}

		const colorPanelRed = {
			'fontWeight' : 'bold',
			// 'background': 'rgb(173,0,0)',
			'background': 'linear-gradient(90deg, rgba(173,0,0,1) 0%, rgba(255,0,0,1) 100%)',
		}
				
		return (
			
			<div>
				{ this._isMounted === false && <p>Loading ... </p>}
				{ this._isMounted && 
					<div id="accordion" className="accordion">
						{
							this.state.collapse.map((value, i) => (
							<Card className="text-white" key={i} >
								<CardHeader style={this.checkTolakData(value,"menu") ? colorPanelRed : colorPanel} className={'card-header text-white set-pointer  ' + (!value.collapse ? 'collapsed ' : '')} onClick={() => this.toggleCollapse(value.id)}>
									<i className="fa fa-circle f-s-8 mr-2 text-white-lighter"></i> {value.name} 
								</CardHeader>
								<Collapse isOpen={value.collapse}>
									<CardBody className="bg-white text-black">
										{value.children.map((child, childKey) => (
											<ul key={childKey} style={(this.state.uri === child.path) ? (this.checkTolakData(child,"subMenu") ? activedTolak: actived) : null} >
												<Route>
													<li className="set-pointer"> 
														<Link style={(this.state.uri === child.path) ? (this.checkTolakData(child,"subMenu") ? activedTolak: actived) : (this.checkTolakData(child,"subMenu") ? colorLinkTolak: colorLink) } onClick={() => this.toggleCollapse(child.parent_id)} to={child.path}>{child.name}</Link> 
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

export default connect(stateToProps, dispatchToProps)(Unbilled);