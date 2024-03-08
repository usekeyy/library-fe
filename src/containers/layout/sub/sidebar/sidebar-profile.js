import React from 'react';
// import { Link } from 'react-router-dom';
import { PageSettings } from '../../../../config/page-settings';
import SidebarTimer from './sidebar-timer';


class SidebarProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profileActive: 0
		};
		this.handleProfileExpand = this.handleProfileExpand.bind(this);
	}

	handleProfileExpand(e) {
		e.preventDefault();
		this.setState(state => ({
			profileActive: !this.state.profileActive,
		}));
	}

	render() {
		return (
			<PageSettings.Consumer>
				{({ pageSidebarMinify }) => (
					<ul className="nav">
						{/* <li className={"nav-profile " + (this.state.profileActive ? "expand " : "")}>
							<Link to="/" onClick={this.handleProfileExpand}>
							<div className="cover with-shadow"></div>
							<div className="image">
							<img src="" alt="" />
							</div>
							<div className="info">
							<b className="caret pull-right"></b>
							{this.props.profile.name.toUpperCase()}
							<small>{(this.props.profile.roles.length > 0) ? this.props.profile.roles[0].name.toLowerCase() : ''}</small>
							</div>
							</Link>
						</li> */}
						<li className={"nav-profile " + (this.state.profileActive ? "expand " : "")} style={{width:"91%" ,display:"block", position:"fixed", zIndex:'9999', background:"white"}}>
							<div className="cover with-shadow"></div>

							<div className="info" >
								<SidebarTimer date= {this.props.date} />
							</div>
						</li>

						{/* <li>
							<ul className={"nav nav-profile " + (this.state.profileActive && !pageSidebarMinify ? "d-block " : "")}>
								<li><Link to="/"><i className="fa fa-cog"></i> Settings</Link></li>
								<li><Link to="/"><i className="fa fa-pencil-alt"></i> Send Feedback</Link></li>
								<li><Link to="/"><i className="fa fa-question-circle"></i> Helps</Link></li>
							</ul>
						</li> */}
					</ul>
				)}
			</PageSettings.Consumer>
		)
	}
}

export default SidebarProfile;