import React from 'react';
import { withTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {toastr} from 'react-redux-toastr'
import { downloadSLK } from '../../../../../store/actions/vendor/profile-vendor/perusahaanActions';
import { clearCacheData } from '../../../../../helpers/globalHelper';

class DropdownProfile extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false,
			isUsers: this.props.user.has_roles,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
		};
	}

	toggle() {
		this.setState(prevState => ({
			dropdownOpen: !prevState.dropdownOpen
		}));
	}

	downloadSLK = (e, uuid, username) => {
		e.preventDefault();
		this.setState(({ profile_vendor }) => ({ profile_vendor: { ...profile_vendor, loading: true } }));
		this.props.downloadSLK(uuid)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `SLK_${username}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
			toastr.error("Failed Download SLK");
			// this.setState({loading: false});
		});
	}
	
	userGuide = () =>{
		this.props.userGuide()
	}

	render() {
		let logo;
		let isUsers = this.props.user.has_roles;
		if (isUsers.includes('ADM001')) {
			logo = <img src="/app-assets/images/user-admin.png" alt="" />
		} else if (isUsers.includes('VNDR01')) {
			logo = <img src="/app-assets/images/user-vendor.png" alt="" />
		} else {
			logo = <img src="/app-assets/images/user-icon.png" alt="" />
		}

		return (
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="dropdown navbar-user" tag="li">
				<DropdownToggle tag="a">
					{logo}
					<span className="d-none d-md-inline"> {this.props.user.name.toUpperCase()} </span> <b className="caret"></b>
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu dropdown-menu-right" tag="ul">
					<DropdownItem>Edit Profile</DropdownItem>
					{this.state.isVendor && <DropdownItem onClick={(e) => {this.downloadSLK(e, this.props.user.uuid, this.props.user.username)}}>Download SLK</DropdownItem>}
					<DropdownItem onClick={(e) => {this.props.toggleChangePasswordOpen(e, this.props.user.uuid)}}>Change Password</DropdownItem>
					<div className="dropdown-divider"></div>
					<DropdownItem onClick={ _=> clearCacheData()}>Clear Storage</DropdownItem>
					<DropdownItem onClick={() => this.userGuide()}>User Guide</DropdownItem>
					<DropdownItem onClick={this.props.logout}>Log Out</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	}
};



const stateToProps = state => {
	return {
		user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		downloadSLK: (uuid) => dispatch(downloadSLK(uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DropdownProfile));
