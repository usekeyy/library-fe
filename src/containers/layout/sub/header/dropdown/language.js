import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class DropdownLanguage extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false
		};
	}

	toggle() {
		this.setState(prevState => ({
			dropdownOpen: !prevState.dropdownOpen
		}));
	}
  
	render() {
		const lang = localStorage.getItem("i18nextLng");
		return (
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="dropdown navbar-languager" tag="li">
				<DropdownToggle className="dropdown-toggle" tag="a">
					<span className={(lang === "en") ? "flag-icon flag-icon-us m-r-5" : "flag-icon flag-icon-id m-r-5"} title={lang === "en" ? "us" : "id" }></span>
					<span className="name d-none d-sm-inline"> {lang === "en" ? "EN" : "ID" } </span>
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu dropdown-menu-right" tag="ul">
					<DropdownItem onClick={(e) => this.props.handleChangeLanguage("en")} ><span className="flag-icon flag-icon-us m-r-5" title="us"></span> English</DropdownItem>
					<DropdownItem onClick={(e) => this.props.handleChangeLanguage("id")}><span className="flag-icon flag-icon-id m-r-5" title="id"></span> Indonesia</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	}
};

export default DropdownLanguage;
