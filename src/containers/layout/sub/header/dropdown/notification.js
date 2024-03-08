import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class DropdownNotification extends React.Component {
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
		let data = (typeof this.props.notifications.data !== 'undefined') ? this.props.notifications.data : null;
		var count = (data !== null) ? Object.keys(data).length : 0;
		let message = (data !== null) ? data.message : '';
		
		return (
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="dropdown" tag="li">
				<DropdownToggle className="f-s-14" tag="a">
					<i className="fa fa-bell"></i>
					<span className="label"> {count} </span>
				</DropdownToggle>
				<DropdownMenu className="media-list dropdown-menu-right" tag="ul">
					<DropdownItem className="dropdown-header" tag="li" header>NOTIFICATIONS </DropdownItem>
					<DropdownItem className="media">
						<div className="media-left">
							<i className="fa fa-bug media-object bg-silver-darker"></i>
						</div>
						<div className="media-body">
							<h6 className="media-heading"> 
								{message} 
								<i className="fa fa-exclamation-circle text-danger"></i>
							</h6>
							<div className="text-muted f-s-11">3 minutes ago</div>
						</div>
					</DropdownItem>
					<DropdownItem className="dropdown-footer text-center">
						View more
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	}
};

export default DropdownNotification;
