import React from 'react';
import PropTypes from "prop-types";
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { PageSettings } from '../../../../config/page-settings';
import SidebarNavList from './sidebar-nav-list';
// import menus from './menu';
import { sidebarAction } from '../../../../store/actions/sidebarActions';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { restrictAlphaNumeric } from '../../../../helpers/restrictAlphaNumeric';
import { Link } from 'react-router-dom'

class SidebarNav extends React.Component {
	static contextType = PageSettings;
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			active: -1,
			clicked: -1,
			menus: [],
			menusChild: [],
			loading: false,
			keyword: ''
		};
	}

	static propTypes = {
    getAccess: PropTypes.func,
  };

	handleExpand(e, i, match) {
		e.preventDefault();

		if (this.state.clicked === -1 && match) {
			this.setState(state => ({
				active: -1,
				clicked: 1
			}));
		} else {
			this.setState(state => ({
				active: (this.state.active === i ? -1 : i),
				clicked: 1
			}));
		}
	}
	
	handleSidebarSearch(e, reset) {
		let searchValue = (reset) ? '' : e.target.value;
				searchValue = searchValue.toLowerCase();
		this.setState({keyword: searchValue})
		this.setState(state => {
			let newMenus = [];
			let newMenusChild = [];
			let isParent = null;
			if (searchValue !== '') {
				newMenus = this.props.sidebarDt.sidebar.filter(item => {
					let title = item.title;
							title = title.toLowerCase();
					if (title.search(searchValue) > -1) {
						item.search = true;
						isParent = true;
						return true;
					} else {
						if (item.children) {
							// for (var i = 0; i < item.children.length; i++) {
							// 	let title2 = item.children[i]['title'];
							// 			title2 = title2.toLowerCase();
										
							// 	if (title2.search(searchValue) > -1) {
							// 		item.search = true;
							// 		return true;
							// 	}
							// }
							newMenusChild = this.state.menusChild.filter(child => { 
								let title2 = child.title;
								title2 = title2.toLowerCase();
								if (title2.search(searchValue) > -1) {
									child.search = true;
									item.search = false;
									isParent = false;
									return true;
								} else {
									return false;
								}
							})
						}
						return false;
					}
				});
			} else {
				newMenus = this.props.sidebarDt.sidebar.filter(item => {
					item.search = false;
					if (item.children) {
						for (var i = 0; i < item.children.length; i++) {
							item.search = false;
							// return true;
						}
					}
					return true;
				});
				// newMenus = this.state.menus;
			}
			const lnegthMenu = isParent ? newMenus : newMenusChild;
			let setNewMenus;
			if(lnegthMenu.length <= 0){
				setNewMenus = this.props.sidebarDt.sidebar;
			} else {
				setNewMenus = lnegthMenu;
			}
			return {
				menus: setNewMenus
			};
		});
	}

	asyncData = async () => {
		this.setState({loading: true})
		await this.props.sidebarAction()
		.then((resp) => {
			if(this._isMounted){
				let arrChild = [];
				resp.data.data.forEach(item => {
					if (item.children) {
						item.children.forEach(child => {
							arrChild.push(child)
						})
					}
				})
				this.setState({loading: false, menus: resp.data.data, menusChild: arrChild})
			}
		})
		.catch((resp) => {
			this.setState({loading: false})
		});
	}

	componentDidMount(){
		this._isMounted = true;
		if(this._isMounted){
			this.asyncData();
		}
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }
  
	render() {
		let uri = this.props.location.pathname.split("/")[1];
		return (
			<ul className="nav" style={{marginTop:"75px"}}>
				<li className="nav-header">Navigation</li>
				<div className="card">
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<Link to='/' >Home</Link>
						</li>
						<li className="list-group-item">
							<Link to='/book' >Books</Link>
						</li>
					</ul>
				</div>
				{this.state.loading && (
					<SkeletonTheme color="#ffff" highlightColor="#53d9ff">
						<p>
							<Skeleton count={12} height={24} width={185} />
						</p>
					</SkeletonTheme>
				)}
			</ul>
		);
	}
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
    response: state.sidebarDt.response,
	}
}

const dispatchToProps = dispatch => {
	return {
		sidebarAction: () => dispatch(sidebarAction())
	}
}


export default connect(stateToProps, dispatchToProps)(SidebarNav);