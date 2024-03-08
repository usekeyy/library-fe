import React, {Component} from 'react';
import bgHome from '../assets/images/10172.jpg';
import {connect} from 'react-redux';
// import {toastr} from 'react-redux-toastr';
import {vendorResponse} from '../store/actions/vendor/profile-vendor/perusahaanActions';
import {showLastVerification} from '../store/actions/vendor/verifikasiDataActions';

class Home extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	}
	state = {
		tender_uuid: this.props.praQualification.tender_uuid,
		isVendor : this.props.user.has_roles.includes("VNDR01") ? true : false,
		vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : (this.props.vendor.vendor !== undefined) ? this.props.vendor.vendor.uuid : null
	}
	

  componentDidMount = () => {
		this._isMounted = true;
		this.props.vendorResponse({type: false});
		if (this.state.tender_uuid !== null && this.state.tender_uuid !== '') {
			this.props.history.push('/tendering/pra-qualification/detail/' + this.state.tender_uuid)
		}
		else {
			this.state.isVendor && this.showLastVerification(this.state.vendor_uuid);
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  showLastVerification = async (uuid) => {
	this.props.showLastVerification(uuid)
	.then((resp) => {
		if (this.state.isVendor && this.props.verification.status_vendor === 'applicant'){
			this.props.history.push('/vendor/profile')
		}
		if (this.state.isVendor && this.props.verification.status_vendor !== 'applicant'){
			this.props.history.push('/task-vendor')
		}
		console.log(this.props)
	})
	.catch((resp) => {
		console.log("error")
		// this.props.location.history.push('/error/404')
		// let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
		// toastr.error(message);
	});
}

  render(){
		const styles = {
			'backgroundColor': '#fff',
			'minHeight': '90vh',
			'backgroundImage': `url(${bgHome})`,
			'backgroundRepeat': 'no-repeat',
			'backgroundSize': '52%',
			'backgroundPosition': 'center',
		}
    return (
      <div className="content-wrapper">
				<div style={styles}>

				</div>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		praQualification: state.praQualification,
		verification: state.verification.verification,
		user : state.auth.user.data,
		vendor: state.vendorProfile,
	}
}

const dispatchToProps = dispatch => {
	return {
		vendorResponse: (params) => dispatch(vendorResponse(params)),
		showLastVerification: (vendor_uuid) => dispatch(showLastVerification(vendor_uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)(Home);