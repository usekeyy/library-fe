import React from 'react';
import {connect} from 'react-redux';
import { PageSettings } from '../../config/page-settings';
import { withTranslation } from 'react-i18next';
import Header from './sub/header/header';
import Sidebar from './sub/sidebar/sidebar';
import SidebarRight from './sub/sidebar-right/sidebar-right';
import TopMenu from './sub/top-menu/top-menu';
// import Content from './subComponent/content/content';
import routes from '../../config/routes';
import {toastr} from 'react-redux-toastr';
import {showLastVerification} from '../../store/actions/vendor/verifikasiDataActions';
import Footer from './sub/footer/footer';
import FloatSubMenu from './sub/float-sub-menu/float-sub-menu';
import {logoutAction, logoutResponse} from '../../store/actions/authActions';
import {accessAction} from '../../store/actions/sidebarActions';
import {fetchNotification} from '../../store/actions/utility/pusherActions';
import {changePassword} from '../../store/actions/utility/usersActions';
import ChangePassword from '../../pages/utility/users/sub/ChangePassword';
import {vendorResponse} from '../../store/actions/vendor/profile-vendor/perusahaanActions';
import {fetchMonitoringTenderBuyer} from '../../store/actions/tendering/monitoringTenderBuyerActions';

const Content = React.lazy(() => import('./sub/content/content'));
const Loading = React.lazy(() => import('../../components/loading/Loading'));

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		
		this.toggleSidebarMinify = (e) => {
			e.preventDefault();
			if (this.state.pageSidebarMinify) {
				this.setState(state => ({
					pageFloatSubMenuActive: false
				}));
			}
			this.setState(state => ({
				pageSidebarMinify: !this.state.pageSidebarMinify
			}));
		}
		this.toggleMobileSidebar = (e) => {
			this.setState(state => ({
				pageSidebarToggled: !this.state.pageSidebarToggled
			}));
		}
		this.handleSetPageSidebar = (value) => {
			this.setState(state => ({
				pageSidebar: value
			}));
		}
		this.handleSetPageSidebarMinified = (value) => {
			this.setState(state => ({
				pageSidebarMinify: value
			}));
		}
		this.handleSetPageSidebarWide = (value) => {
			this.setState(state => ({
				pageSidebarWide: value
			}));
		}
		this.handleSetPageSidebarLight = (value) => {
			this.setState(state => ({
				pageSidebarLight: value
			}));
		}
		this.handleSetPageSidebarTransparent = (value) => {
			this.setState(state => ({
				pageSidebarTransparent: value
			}));
		}
		this.handleSetPageSidebarSearch = (value) => {
			this.setState(state => ({
				pageSidebarSearch: value
			}));
		}
		
		this.toggleRightSidebar = (e) => {
			e.preventDefault();
			this.setState(state => ({
				pageRightSidebarCollapsed: !this.state.pageRightSidebarCollapsed
			}));
		}
		this.toggleMobileRightSidebar = (e) => {
			e.preventDefault();
			this.setState(state => ({
				pageMobileRightSidebarToggled: !this.state.pageMobileRightSidebarToggled
			}));
		}
		this.handleSetPageRightSidebar = (value) => {
			this.setState(state => ({
				pageRightSidebar: value
			}));
		}
		
		var floatSubMenuRemove;
		var floatSubMenuCalculate;
		var floatSubMenuRemoveTime = 250;
		this.handleFloatSubMenuOnMouseOver = (e) => {
			clearTimeout(floatSubMenuRemove);
			clearTimeout(floatSubMenuCalculate);
		}
		this.handleFloatSubMenuOnMouseOut = (e) => {
			floatSubMenuRemove = setTimeout(() => {
				this.setState(state => ({
					pageFloatSubMenuActive: false
				}));
			}, floatSubMenuRemoveTime);
		}
		this.handleSidebarOnMouseOver = (e, menu) => {
			if (this.state.pageSidebarMinify) {
				if (menu.children) {
					var left = (document.getElementById('sidebar').offsetWidth + document.getElementById('sidebar').offsetLeft) + 'px';
					
					clearTimeout(floatSubMenuRemove);
					clearTimeout(floatSubMenuCalculate);
			
					this.setState(state => ({
						pageFloatSubMenu: menu,
						pageFloatSubMenuActive: true,
						pageFloatSubMenuLeft: left
					}));
					
					var offset = e.currentTarget.offsetParent.getBoundingClientRect();
					
					floatSubMenuCalculate = setTimeout(() => {
						var targetTop = offset.top;
						var windowHeight = window.innerHeight;
						var targetHeight = document.querySelector('.float-sub-menu-container').offsetHeight;
						var top, bottom, arrowTop, arrowBottom, lineTop, lineBottom;
						
						if ((windowHeight - targetTop) > targetHeight) {
							top = offset.top + 'px';
							bottom = 'auto';
							arrowTop = '20px';
							arrowBottom = 'auto';
							lineTop = '20px';
							lineBottom = 'auto';
						} else {
							var aBottom = (windowHeight - targetTop) - 21;
							top = 'auto';
							bottom = '0';
							arrowTop = 'auto';
							arrowBottom = aBottom + 'px';
							lineTop = '20px';
							lineBottom = aBottom + 'px';
						}
						
						this.setState(state => ({
							pageFloatSubMenuTop: top,
							pageFloatSubMenuBottom: bottom,
							pageFloatSubMenuLineTop: lineTop,
							pageFloatSubMenuLineBottom: lineBottom,
							pageFloatSubMenuArrowTop: arrowTop,
							pageFloatSubMenuArrowBottom: arrowBottom,
							pageFloatSubMenuOffset: offset
						}));
					}, 0);
					
				} else {
					floatSubMenuRemove = setTimeout(() => {
						this.setState(state => ({
							pageFloatSubMenu: '',
							pageFloatSubMenuActive: false
						}));
					}, floatSubMenuRemoveTime);
				}
			}
		}
		this.handleSidebarOnMouseOut = (e) => {
			if (this.state.pageSidebarMinify) {
				floatSubMenuRemove = setTimeout(() => {
					this.setState(state => ({
						pageFloatSubMenuActive: false
					}));
				}, floatSubMenuRemoveTime);
			}
		}
		this.handleFloatSubMenuClick = () => {
			if (this.state.pageSidebarMinify) {
				const windowHeight = window.innerHeight;
				const targetHeight = document.getElementById('float-sub-menu').offsetHeight;
				const targetTop = this.state.pageFloatSubMenuOffset.top;
				const top = ((windowHeight - targetTop) > targetHeight) ? targetTop : 'auto';
				const left = (this.state.pageFloatSubMenuOffset.left + document.getElementById('sidebar').offsetWidth) + 'px';
				const bottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : '0';
				const arrowTop = ((windowHeight - targetTop) > targetHeight) ? '20px' : 'auto';
				const arrowBottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : ((windowHeight - targetTop) - 21) + 'px';
				const lineTop = ((windowHeight - targetTop) > targetHeight) ? '20px' : 'auto';
				const lineBottom = ((windowHeight - targetTop) > targetHeight) ? 'auto' : ((windowHeight - targetTop) - 21) + 'px';
			
				this.setState(state => ({
					pageFloatSubMenuTop: top,
					pageFloatSubMenuLeft: left,
					pageFloatSubMenuBottom: bottom,
					pageFloatSubMenuLineTop: lineTop,
					pageFloatSubMenuLineBottom: lineBottom,
					pageFloatSubMenuArrowTop: arrowTop,
					pageFloatSubMenuArrowBottom: arrowBottom
				}));
			}
		}
		
		this.handleSetPageContent = (value) => {
			this.setState(state => ({
				pageContent: value
			}));
		}
		this.handleSetPageContentClass = (value) => {
			this.setState(state => ({
				pageContentClass: value
			}));
		}
		this.handleSetPageContentFullHeight = (value) => {
			this.setState(state => ({
				pageContentFullHeight: value
			}));
		}
		this.handleSetPageContentFullWidth = (value) => {
			this.setState(state => ({
				pageContentFullWidth: value
			}));
		}
		this.handleSetPageContentInverseMode = (value) => {
			this.setState(state => ({
				pageContentInverseMode: value
			}));
		}
		
		this.handleSetPageHeader = (value) => {
			this.setState(state => ({
				pageHeader: value
			}));
		}
		this.handleSetPageHeaderMegaMenu = (value) => {
			this.setState(state => ({
				pageHeaderMegaMenu: value
			}));
		}
		this.handleSetPageHeaderLanguageBar = (value) => {
			this.setState(state => ({
				pageHeaderLanguageBar: value
			}));
		}
		
		this.handleSetPageFooter = (value) => {
			this.setState(state => ({
				pageFooter: value
			}));
		}
		this.handleSetPageTopMenu = (value) => {
			this.setState(state => ({
				pageTopMenu: value
			}));
		}
		this.toggleMobileTopMenu = (e) => {
			e.preventDefault();
			this.setState(state => ({
				pageMobileTopMenu: !this.state.pageMobileTopMenu
			}));
		}
		this.handleSetPageTwoSidebar = (value) => {
			this.setState(state => ({
				pageTwoSidebar: value
			}));
		}
		this.handleSetPageBoxedLayout = (value) => {
			if (value === true) {
				document.body.classList.add('boxed-layout');
			} else {
				document.body.classList.remove('boxed-layout');
			}
		}
		this.handleSetBodyWhiteBg = (value) => {
			if (value === true) {
				document.body.classList.add('bg-white');
			} else {
				document.body.classList.remove('bg-white');
			}
		}
		
		this.state = {
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : null,
			isBuyer: this.props.user.has_roles.includes("BYR001") ? true : false,
			buyerHasNote : 0,
			changePassword: {
				toggle: false,
				loading: false,
				uuid: '',
				errors: []
			},
			date : new Date(localStorage.getItem("times")),
			expired_day: 0,
			loading_alert: false,
			router: routes,
			hasAccess: null,
			sidebarData: null,
			loading: true,
			pageHeader: true,
			pageheaderMegaMenu: false,
			pageHeaderLanguageBar: false,
			hasScroll: false,
			handleSetPageHeader: this.handleSetPageHeader,
			handleSetPageHeaderLanguageBar: this.handleSetPageHeaderLanguageBar,
			handleSetPageHeaderMegaMenu: this.handleSetPageHeaderMegaMenu,
			
			pageSidebar: true,
			pageSidebarWide: false,
			pageSidebarLight: false,
			pageSidebarMinify: false,
			pageSidebarToggled: false,
			pageSidebarTransparent: false,
			pageSidebarSearch: false,
			handleSetPageSidebar: this.handleSetPageSidebar,
			handleSetPageSidebarWide: this.handleSetPageSidebarWide,
			handleSetPageSidebarLight: this.handleSetPageSidebarLight,
			handleSetPageSidebarMinified: this.handleSetPageSidebarMinified,
			handleSetPageSidebarTransparent: this.handleSetPageSidebarTransparent,
			handleSetPageSidebarSearch: this.handleSetPageSidebarSearch,
			handleSidebarOnMouseOut: this.handleSidebarOnMouseOut,
			handleSidebarOnMouseOver: this.handleSidebarOnMouseOver,
			toggleSidebarMinify: this.toggleSidebarMinify,
			toggleMobileSidebar: this.toggleMobileSidebar,
			
			pageFloatSubMenuActive: false,
			pageFloatSubMenu: '',
			pageFloatSubMenuTop: 'auto',
			pageFloatSubMenuLeft: 'auto',
			pageFloatSubMenuBottom: 'auto',
			pageFloatSubMenuLineTop: 'auto',
			pageFloatSubMenuLineBottom: 'auto',
			pageFloatSubMenuArrowTop: 'auto',
			pageFloatSubMenuArrowBottom: 'auto',
			pageFloatSubMenuOffset: '',
			handleFloatSubMenuOnMouseOver: this.handleFloatSubMenuOnMouseOver,
			handleFloatSubMenuOnMouseOut: this.handleFloatSubMenuOnMouseOut,
			handleFloatSubMenuClick: this.handleFloatSubMenuClick,
			
			pageContent: true,
			pageContentClass: '',
			pageContentFullHeight: false,
			pageContentFullWidth: false,
			pageContentInverseMode: false,
			handleSetPageContent: this.handleSetPageContent,
			handleSetPageContentClass: this.handleSetPageContentClass,
			handleSetPageContentFullHeight: this.handleSetPageContentFullHeight,
			handleSetPageContentFullWidth: this.handleSetPageContentFullWidth,
			handleSetPageContentInverseMode: this.handleSetPageContentInverseMode,
			
			pageFooter: false,
			handleSetPageFooter: this.handleSetPageFooter,
			
			pageTopMenu: false,
			pageMobileTopMenu: false,
			toggleMobileTopMenu: this.toggleMobileTopMenu,
			handleSetPageTopMenu: this.handleSetPageTopMenu,
			
			pageTwoSidebar: false,
			handleSetPageTwoSidebar: this.handleSetPageTwoSidebar,
			
			pageRightSidebar: false,
			pageRightSidebarToggled: false,
			pageMobileRightSidebarToggled: false,
			toggleRightSidebar: this.toggleRightSidebar,
			toggleMobileRightSidebar: this.toggleMobileRightSidebar,
			handleSetPageRightSidebar: this.handleSetPageRightSidebar,
			
			handleSetBodyWhiteBg: this.handleSetBodyWhiteBg,
			handleSetPageBoxedLayout: this.handleSetPageBoxedLayout
		};
	}
	
	componentDidMount() {
		this._isMounted = true;
		if(this._isMounted){
			// this.setState({loading: true})
			// this.startTime();
			setTimeout(() => this.setState({loading: false}), 1);
			this.getAccess()
			if(this.state.isVendor && this.state.vendor_uuid !== null){
				this.showLastVerification(this.state.vendor_uuid)
			}else if(this.state.isBuyer){
				this.fetchMonitoringTender()
			}
			// this.getNotification();
			window.addEventListener('scroll', this.handleScroll)
		}
  }

  componentWillUnmount() {
		this._isMounted = false;
    window.removeEventListener('scroll', this.handleScroll)
	}

	static getDerivedStateFromProps(props, state) {
		// let checkAccessPage = state.router.some(item => item.path === props.location.pathname);
		// // console.log(checkAccessPage);
		// if(checkAccessPage !== state.hasAccess){
		// 	return {
		// 		hasAccess: checkAccessPage
		// 	}
		// }
		// if (props.location.key !== state.hasAccess){
		// 	return {
		// 		hasAccess: (typeof props.match !== 'undefined') ? true : false
		// 		// hasAccess: {
		// 		// 	...state.hasAccess,
		// 		// 	hasAccess: props.location.key
		// 		// }
		// 	}
		// }
    return null;
	}
	
	componentDidUpdate(prevProps) {
		if(this._isMounted){
			this.getAccess()
			if(this.state.hasAccess === false){
				this.props.history.push('/404')
			}
		}
	}
  
  handleScroll = () => {
  	if (window.scrollY > 0) {
  		this.setState(state => ({
				hasScroll: true
			}));
  	} else {
  		this.setState(state => ({
				hasScroll: false
			}));
  	}
  	var elm = document.getElementsByClassName('nvtooltip');
  	for (var i = 0; i < elm.length; i++) {
  		elm[i].classList.add('d-none');
  	}
	}
	
	handleLogout(e){
		e.preventDefault();
		var objParent = {}
		var objChild = {}
		objParent = {
			C: false,
			R: false,
			U: false,
			D: false,
		}
		objChild = {
			C: false,
			R: false,
			U: false,
			D: false,
		}
		const dataDispatch = {type: true, parent_access: objParent, access: objChild};
		this.props.accessAction(dataDispatch);
		
		this.props.logoutAction().then(resp => {
			this.props.logoutResponse({type: true});
			this.props.vendorResponse({type: false});
		}).catch(error => {
			this.props.logoutResponse({type: false});
			
		})
	}

	getNotification = () => {
		let {data} = this.props.userDt;
		this.props.fetchNotification(data)
	}

	refreshPage() {
    window.location.reload(false);
  }

	getAccess = async () => {
		if(this._isMounted){
			let uri = this.props.location.pathname.split("/")[1];
			let pathName = this.props.location.pathname;
			let {sidebarDt} = this.props;
			var arrChild = [];
			var arrParent = [];
			var objParent = {}
			var objChild = {}

			// console.log(this.props.location.pathname);
			if(typeof sidebarDt !== 'undefined'){
				this.props.sidebarDt.forEach(item => {
					let path = item.path.replace(/\//g,'');
					if(path.toString() === uri.toString()) {
						// parent access
						arrParent.push(item.access)
						if(item.children){
							item.children.forEach(child => {
								let childPath = child.path.toString();
								let pathNames = pathName.toString();
								let getPath = pathName.split("/");

								if(getPath.length > 3){
									if(pathNames.includes(childPath)){
										arrChild.push(child.access)
									}
								} else {
									if(child.path.toString() === pathName.toString()){
										// child accesss
										arrChild.push(child.access)
									}
								}
							})
						} else {
							arrChild.push(item.access)
						}
					}
				})
				objParent = {
					C: (typeof arrParent[0] !== 'undefined') ? arrParent[0].includes("CR") : false,
					R: (typeof arrParent[0] !== 'undefined') ? arrParent[0].includes("RE") : false,
					U: (typeof arrParent[0] !== 'undefined') ? arrParent[0].includes("UP") : false,
					D: (typeof arrParent[0] !== 'undefined') ? arrParent[0].includes("DE") : false,
					A: (typeof arrParent[0] !== 'undefined') ? arrParent[0].includes("AP") : false,
				}
				objChild = {
					C: (typeof arrChild[0] !== 'undefined') ? arrChild[0].includes("CR") : false,
					R: (typeof arrChild[0] !== 'undefined') ? arrChild[0].includes("RE") : false,
					U: (typeof arrChild[0] !== 'undefined') ? arrChild[0].includes("UP") : false,
					D: (typeof arrChild[0] !== 'undefined') ? arrChild[0].includes("DE") : false,
					A: (typeof arrChild[0] !== 'undefined') ? arrChild[0].includes("AP") : false,
				}
				const dataDispatch = {type: true, parent_access: objParent, access: objChild, location: this.props.location };
				this.props.accessAction(dataDispatch);
			} else {
				const dataDispatch = {type: false}
				this.props.accessAction(dataDispatch);
			}
		}
	}

	changeLanguage = lng => {
    this.props.i18n.changeLanguage(lng);
	};

	handleChangePassword = (id, payload) => {
		if(this._isMounted){
			this.setState(({ changePassword }) => ({
				changePassword: { ...changePassword, loading: true }
			}));
			this.props.changePassword(id, payload)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this.setState(({ changePassword }) => ({
					changePassword: { ...changePassword, loading: true, toggle: false, errors: []}
				}));
				// this.setState({loading: false, toggleChangePassword: false, errors: []});
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					// this.setState({error: true, errors: error.data.errors, loading: false});
					this.setState(({ changePassword }) => ({
						changePassword: { ...changePassword, loading: false, errors: error.data.errors}
					}));
				} else {
					this.setState({loading: false});
					toastr.error("Failed Change Password");
				}
			})
		}
	}

	toggleChangePasswordOpen = (e, value) => {
		if(this._isMounted){
			e.preventDefault();
			console.log(value);
			// const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			// this.setState({toggleChangePassword: true, uuid: uuid})
			this.setState(({ changePassword }) => ({
				changePassword: { ...changePassword, toggle: true, uuid: value, errors: []}
			}));
		}
	}

	toggleChangePasswordClose = () => {
		if(this._isMounted){
			this.setState(({ changePassword }) => ({
				changePassword: { ...changePassword, toggle: false, uuid: '', errors: []}
			}));
			// this.setState({toggleChangePassword: false, uuid: '', errors: []})
		}
	}

	getDate = (date) => {
		let dd = date.getDate();
		let mm = date.getMonth()+1; //January is 0!
		let yyyy = date.getFullYear();
		if(dd<10){
				dd='0'+dd
		} 
		if(mm<10){
			mm='0'+mm
		}

		return yyyy+'-'+mm+'-'+dd
	}

	fetchMonitoringTender = async () => {
			const filterMulai = this.getDate(new Date(new Date(localStorage.getItem('times')).getTime() + (1 * 24 * 60 * 60 * 1000)))
			const filterSekarang = this.getDate(new Date(localStorage.getItem('times')))
        this.props.fetchMonitoringTenderBuyer({end_tanggal_closing : `${filterSekarang};${filterMulai}`})
            .then((resp) => {
				let dataFilter = resp.data.data.filter((item) => {
					if (item.status_dur === 'y'){
						if (item.metode_penyampaian_id === '2t'){
							if (item.bid_administrasi !== 'y'){
								return item
							}else {
								if (item.bid_comercil !== 'y'){
									return item
								}
							}
						}else{
							if (item.bid_administrasi !== 'y'){
								return item
							}
						}
					}
					return false
				})
				this.setState({buyerHasNote : dataFilter.length})
            })
            .catch((resp) => {
                // console.log(resp)
                // this.setState({ loading: false })
                // let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                // toastr.error('Oops', message);
            });
    }

	showLastVerification = async (uuid) => {
		this.setState({loading_alert : true})
		this.props.showLastVerification(uuid)
		.then((resp) => {
			var data = resp.data;
			// var setSendData = { ...this.state }
			// setSendData.data = data;
			this.setState({ expired_day: data.expired_in_day, loading_alert : false });
		})
		.catch((resp) => {
			this.setState({loading_alert : false})
			// console.log(resp);
			// this.props.location.history.push('/error/404')
			// let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			// toastr.error(message);
		});
	}

	startTime = () => {
		if(this._isMounted){
			const lang = localStorage.getItem("i18nextLng");
			// var date = new Date(localStorage.getItem("times"));			
			var date = this.state.date;			
			// var tahun = date.getFullYear();
			var bulan = date.getMonth();
			// var tanggal = date.getDate();
			// var h = date.getHours();
			// var m = date.getMinutes();
			// var s = date.getSeconds();
			var hari = date.getDay();
			// h = this.checkTime(h);
			// m = this.checkTime(m);
			// s = this.checkTime(s);	
			switch(hari) {
				case 0: hari = (lang === "en") ? "Sunday" : "Minggu"; break;
				case 1: hari = (lang === "en") ? "Monday" : "Senin"; break;
				case 2: hari = (lang === "en") ? "Tuesday" : "Selasa"; break;
				case 3: hari = (lang === "en") ? "Wenesday" : "Rabu"; break;
				case 4: hari = (lang === "en") ? "Thursday" : "Kamis"; break;
				case 5: hari = (lang === "en") ? "Friday" : "Jum'at"; break;
				case 6: hari = (lang === "en") ? "Saturday" : "Sabtu"; break;
				default: break;
			}		
			switch(bulan) {
				case 0: bulan = (lang === "en") ? "January" : "Januari"; break;
				case 1: bulan = (lang === "en") ? "February" : "Februari"; break;
				case 2: bulan = (lang === "en") ? "March" : "Maret"; break;
				case 3: bulan = (lang === "en") ? "April" : "April"; break;
				case 4: bulan = (lang === "en") ? "May" : "Mei"; break;
				case 5: bulan = (lang === "en") ? "June" : "Juni"; break;
				case 6: bulan = (lang === "en") ? "July" : "Juli"; break;
				case 7: bulan = (lang === "en") ? "August" : "Agustus"; break;
				case 8: bulan = (lang === "en") ? "September" : "September"; break;
				case 9: bulan = (lang === "en") ? "October" : "Oktober"; break;
				case 10: bulan = (lang === "en") ? "November" : "November"; break;
				case 11: bulan = (lang === "en") ? "December" : "Desember"; break;
				default: break;
			}
			// var tampilTanggal = hari+", "+tanggal + " " + bulan + " " + tahun;
			// document.getElementById('dateTime').innerHTML = tampilTanggal;
			// document.getElementById('timer').innerHTML = h + " : " + m + " : " + s ;
			date.setSeconds(date.getSeconds() + 1)
			// console.log(this.state.date)
			localStorage.setItem('times' , date)
			setTimeout(this.startTime, 999);
		}
    }

	checkTime = (i) => {
		if(this._isMounted){
			if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		}
	}

	userGuide = (e) =>{
		this.props.history.push('/user-guide')
	}
	
	render() {
		return (
			<PageSettings.Provider value={this.state}>
				{this.state.loading && <Loading/>}
				{this.state.loading === false && <div className={
					'fade page-sidebar-fixed show page-container ' + 
					(this.state.pageHeader ? 'page-header-fixed ' : '') + 
					(this.state.pageSidebar ? '' : 'page-without-sidebar ') + 
					(this.state.pageRightSidebar ? 'page-with-right-sidebar ' : '') +
					(this.state.pageSidebarWide ? 'page-with-wide-sidebar ' : '') +
					(this.state.pageSidebarLight ? 'page-with-light-sidebar ' : '') +
					(this.state.pageSidebarMinify ? 'page-sidebar-minified ' : '') + 
					(this.state.pageSidebarToggled ? 'page-sidebar-toggled ' : '') + 
					(this.state.pageTopMenu ? 'page-with-top-menu ' : '') + 
					(this.state.pageContentFullHeight ? 'page-content-full-height ' : '') + 
					(this.state.pageTwoSidebar ? 'page-with-two-sidebar ' : '') + 
					(this.state.pageRightSidebarCollapsed ? 'page-right-sidebar-collapsed ' : '') + 
					(this.state.pageMobileRightSidebarToggled ? 'page-right-sidebar-toggled ' : '') + 
					(this.state.hasScroll ? 'has-scroll ' : '')
				}>
					{this.state.pageHeader && (
					<Header 
						handleChangeLanguage={this.changeLanguage} 
						notifications={this.props.notifications} 
						user={this.props.userDt} 
						toggleChangePasswordOpen={this.toggleChangePasswordOpen}
						logout={(e) => {this.handleLogout(e)}} 
						userGuide={(e) => {this.userGuide(e)}} 
					/>)}
					{this.state.pageSidebar && (<Sidebar location={this.props.location} user={this.props.userDt} date={this.state.date} />)}
					{this.state.pageTwoSidebar && (<SidebarRight />)}
					{this.state.pageTopMenu && (<TopMenu />)}
					{this.state.pageContent && (
					<Content 
						isVendor={this.state.isVendor} 
						expired_day={this.state.expired_day}
						has_draft_verification={this.props.verification?.verification?.has_draft_verification}
						isBuyer={this.state.isBuyer}
						buyerHasNote={this.state.buyerHasNote}
						loading_alert={this.state.loading_alert}
						status_migrasi={this.props.verification?.verification?.status_migrasi}
					/>)}
					{this.state.pageFooter && (<Footer />)}
					<FloatSubMenu />
				</div>}
				{this.state.changePassword.toggle && 
				<ChangePassword 
				loading={this.state.changePassword.loading}
				errors={this.state.changePassword.errors}
				uuid={this.state.changePassword.uuid} 
				toggleOpen={this.state.changePassword.toggle} 
				toggleClose={this.toggleChangePasswordClose} 
				save={this.handleChangePassword} />}
			</PageSettings.Provider>
		)
	}
}

const stateToProps = state => {
	return {
		userDt: state.auth.user,
		sidebarDt: state.sidebarDt.sidebar,
		user: state.auth.user.data,
		notifications: state.notifications,
		verification: state.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		logoutAction: payload => dispatch(logoutAction(payload)),
		logoutResponse: data => dispatch(logoutResponse(data)),
		accessAction: data => dispatch(accessAction(data)),
		fetchNotification: user => dispatch(fetchNotification(user)),
		changePassword: (id, payload) => dispatch(changePassword(id, payload)),
		showLastVerification: (vendor_uuid) => dispatch(showLastVerification(vendor_uuid)),
		vendorResponse: data => dispatch(vendorResponse(data)),
		fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Layout));
