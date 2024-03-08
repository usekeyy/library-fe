import React from 'react';
import { Link } from 'react-router-dom';
// import DropdownNotification from './dropdown/notification';
import DropdownLanguage from './dropdown/language';
import DropdownProfile from './dropdown/profile';
import DropdownMegaMenu from './dropdown/mega';
import { PageSettings } from '../../../../config/page-settings';
// import FloatTimerHeader from './timer/FloatTimerHeader';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.toggleMegaMenu = this.toggleMegaMenu.bind(this);
		this.state = { collapseMegaMenu: false };
	}

	toggleMegaMenu() {
		this.setState({ collapseMegaMenu: !this.state.collapseMegaMenu });
	}
	
	render() {
		return (
			<PageSettings.Consumer>
				{({ toggleMobileSidebar, toggleRightSidebar, toggleMobileRightSidebar, toggleMobileTopMenu, pageHeaderLanguageBar, pageHeaderMegaMenu, pageTwoSidebar, pageTopMenu, pageSidebar }) => (
					<div id="header" className="header navbar-inverse">
						<div className="navbar-header">
							{pageTwoSidebar && (
								<button type="button" className="navbar-toggle pull-left" onClick={toggleMobileRightSidebar}>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							)}
							{/* <Link to="/" className="navbar-brand"><span className="navbar-logo"></span>
								<img src="/app-assets/images/procsi_icon.png" alt="logo-procsi" /> &nbsp;
								<b style={{color:"#1190cb"}}>Procurement System Integration</b>
							</Link> */}

							{pageHeaderMegaMenu && (
								<button type="button" className="navbar-toggle pt-0 pb-0 mr-0" onClick={this.toggleMegaMenu}>
									<span className="fa-stack fa-lg text-inverse">
										<i className="far fa-square fa-stack-2x"></i>
										<i className="fa fa-cog fa-stack-1x"></i>
									</span>
								</button>
							)}
							{pageTopMenu && pageSidebar && (
								<button type="button" className="navbar-toggle pt-0 pb-0 mr-0 collapsed" onClick={toggleMobileTopMenu}>
									<span className="fa-stack fa-lg text-inverse">
										<i className="far fa-square fa-stack-2x"></i>
										<i className="fa fa-cog fa-stack-1x"></i>
									</span>
								</button>
							)}
							{!pageSidebar && pageTopMenu && (
								<button type="button" className="navbar-toggle" onClick={toggleMobileTopMenu}>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							)}
							{pageSidebar && (
								<button type="button" className="navbar-toggle" onClick={toggleMobileSidebar}>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
									<span className="icon-bar"></span>
								</button>
							)}
						</div>

						{pageHeaderMegaMenu && (
							<DropdownMegaMenu collapse={this.state.collapseMegaMenu} />
						)}

						<ul className="navbar-nav navbar-right">
							{/* <FloatTimerHeader/> */}
							{/* <DropdownLanguage handleChangeLanguage={this.props.handleChangeLanguage} /> */}
							{/* <DropdownNotification notifications={this.props.notifications} /> */}
							<DropdownProfile toggleChangePasswordOpen={this.props.toggleChangePasswordOpen} user={this.props.user.data} logout={this.props.logout} userGuide={this.props.userGuide} />
							{pageTwoSidebar && (
								<li className="divider d-none d-md-block"></li>
							)}

							{pageTwoSidebar && (
								<li className="d-none d-md-block">
									<Link to="/" onClick={toggleRightSidebar} className="f-s-14">
										<i className="fa fa-th"></i>
									</Link>
								</li>
							)}
						</ul>
					</div>
				)}
			</PageSettings.Consumer>
		)
	}
}

export default Header;
