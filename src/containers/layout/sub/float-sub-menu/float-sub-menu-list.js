import React from 'react';
import { Route, Link } from 'react-router-dom';
import { PageSettings } from '../../../../config/page-settings';

class FloatSubMenuList extends React.Component {
	static contextType = PageSettings;
	
	constructor(props) {
		super(props);
		this.state = {
			active: -1,
			clicked: -1
		};
	}
	
	handleExpand(e, i, match) {
		e.preventDefault();
	
		this.setState(state => ({
			active: (this.state.active === i ? -1 : i),
			clicked: 1
		}));
		setTimeout(() => {
			this.context.handleFloatSubMenuClick();
		}, 0);
	}
  
	render() {
		var icon = this.props.data.icon && <i className={this.props.data.icon}></i>;
		var img = this.props.data.img && <span className="icon-img"><img src={this.props.data.img} alt="" /></span>;
		var caret = (this.props.data.children && !this.props.data.badge) && <b className="caret"></b>;
		var label = this.props.data.label && <span className="label label-theme m-l-5">{this.props.data.label}</span>;
		var badge = this.props.data.badge && <span className="badge pull-right">{this.props.data.badge}</span>;
		var title = this.props.data.title && <span>{this.props.data.title} {label}</span>;
		
		return (
			<PageSettings.Consumer>
				{({pageSidebarMinified}) => (
					<Route path={this.props.data.path} exact={this.props.data.exact} children={({ match }) => (
						<li className={(match ? "active " : "") + ((this.props.active || (this.props.clicked === -1 && match)) ? 'expand ' : 'closed ') + (this.props.data.children ? "has-sub " : "")}>
							{this.props.data.children ? (
								<Link to={this.props.data.path} onClick={this.props.expand}>{ img } { icon } { title } { badge } { caret }</Link>
							):(
								<Link to={this.props.data.path}>{ img } { icon } { title } { badge } { caret }</Link>
							)}
							{this.props.data.children && (
								<ul className={"sub-menu " + (((this.props.active || (this.props.clicked === -1 && match)) && !pageSidebarMinified) ? 'd-block ' : 'd-none')}>
									{this.props.data.children && this.props.data.children.map((submenu, i) => (
										<FloatSubMenuList
											data={submenu} 
											key={i} 
											expand={(e) => this.handleExpand(e, i, match)}
											active={i === this.state.active} 
											clicked={this.state.clicked}
										/>
									))}
								</ul>
							)}
						</li>
					)} />
				)}
			</PageSettings.Consumer>
		);
	}
}

export default FloatSubMenuList;