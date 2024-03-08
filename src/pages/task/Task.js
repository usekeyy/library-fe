import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { fetchTaskMenu, fetchTaskItem } from '../../store/actions/taskActions';
import {fetchMonitoringTenderBuyer} from '../../store/actions/tendering/monitoringTenderBuyerActions';
import { fetchExpediting } from '../../store/actions/expediting/ExpeditingActions'
import { fetchReminder } from '../../store/actions/expediting/reminderActions'
import { fetchProgress } from '../../store/actions/expediting/progressActions'
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../containers/layout/sub/panel/panel';

class Task extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			data: [],
			data_expediting: [],
			dataStatic: [],
			loading: false,
			loadingStatic: false,
			isBuyer: this.props.user.has_roles.includes("BYR001") ? true : false,
		}
	}

  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.fetchTaskMenu()
			// this.countTaskOutstandingPOExpediting()
			if (this.state.isBuyer) {
				this.fetchMonitoringTender()
				this.countTaskOpenPOExpediting()
				this.countTaskReminder()
				this.countTaskProgress()
				this.countTaskKonfirmasi()
			}
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	asyncData = async () => {
		this.setState({loading: true})
		this.props.fetchTaskMenu()
		.then((resp) => {
			if(this._isMounted){
				this.setState({loading: false, data: resp.data.data});
			}
		})
		.catch((resp) => {
			this._isMounted = false && this.setState({loading: false})
			let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
			toastr.error('Oops', message);
		});
	}

	fetchTaskMenu = () => {
		this.asyncData();
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
		this.setState({loadingStatic: true})
		const filterMulai = this.getDate(new Date(new Date(localStorage.getItem('times')).getTime() + (1 * 24 * 60 * 60 * 1000)))
		const filterSekarang = this.getDate(new Date(localStorage.getItem('times')))
		this.props.fetchMonitoringTenderBuyer({end_tanggal_closing : `${filterSekarang};${filterMulai}`})
			.then((resp) => {
				if(this._isMounted){
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
					this.setState({loadingStatic: false, dataStatic: dataFilter});
				}
			})
			.catch((resp) => {
				this._isMounted = false && this.setState({loadingStat: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	//task expediting
	countTaskOpenPOExpediting = async () => {
		this.setState({ loading: true })
		this.props.fetchExpediting()
			.then((resp) => {
				var joined = this.state.data_expediting.concat({ order: 1, name: 'Purchase Order Expediting', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `expediting/purchase-order-open` });
				this.setState({ loading: false, data_expediting: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_expediting: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}
	
	countTaskReminder = async () => {
		this.setState({ loading: true })
		this.props.fetchReminder({remindered: 1})
			.then((resp) => {
				var joined = this.state.data_expediting.concat({ order: 2, name: 'Reminder Expediting', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `expediting/reminder` });
				this.setState({ loading: false, data_expediting: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_expediting: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}
	
	countTaskProgress = async () => {
		this.setState({ loading: true })
		this.props.fetchProgress()
			.then((resp) => {
				var joined = this.state.data_expediting.concat({ order: 3, name: 'Progress Barang & Jasa', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `expediting/progress` });
				this.setState({ loading: false, data_expediting: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_expediting: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}
	
	//task expediting
	countTaskKonfirmasi = async () => {
		this.setState({ loading: true })
		this.props.fetchExpediting({confirmation_forum: 'y'})
			.then((resp) => {
				var joined = this.state.data_expediting.concat({ order: 4, name: 'Komunikasi Expediting', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `expediting/konfirmasi` });
				this.setState({ loading: false, data_expediting: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_expediting: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	toDetail = (e, task_id, id, uuid, title) => {
		e.preventDefault();
		this.props.history.push({
			pathname: `/task/${task_id}`,
			state: { isTitle: title }
		  })
	}
	
	toDetailMenu = (e, task_id, id, uuid) => {
		e.preventDefault();
		this.props.history.push(`/${task_id}`)
	}

	render(){
		let task;
		let task_expediting;
		let {data, data_expediting } = this.state;
		if(this.state.loading){
			task = <div className="col-md-12"><h5>Loading ...</h5></div>
		} else {
			if(data.length > 0){
				task = data.map((item, key) => (
					<div key={key} className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon"><i className={item.icon}></i></div>
							<div className="stats-info">
								<h4>{item.name}</h4>
								<p>{item.tickets_count}</p>	
							</div>
							<div className="stats-link">
								<a href="/home" onClick={(e) => {this.toDetail(e, item.task_id, item.id, item.uuid, item.title)}}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task = <div className="col-md-12"><h5>No Data Found </h5></div>
			}

			if (data_expediting.length > 0) {
				const datas = data_expediting.sort((a, b) => a.order - b.order)
				task_expediting = datas.map((item, key) => (
					<div key={key} className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon"><i className={item.icon}></i></div>
							<div className="stats-info">
								<h4>{item.name}</h4>
								<p>{item.tickets_count}</p>
							</div>
							<div className="stats-link">
								<a href="/" onClick={(e) => { this.toDetailMenu(e, item.url) }}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task_expediting = <div className="col-md-12"><h5>No Data Found </h5></div>
			}
		}

    return (
		<div>
			<ol className="breadcrumb float-xl-right">
				<li className="breadcrumb-item"><Link to="/home">Home</Link></li>
				<li className="breadcrumb-item active">Task</li>
			</ol>
			<h1 className="page-header">My Task </h1>
			
			<div style={{clear : 'both'}}>
				<Panel>
					<PanelHeader>Task General</PanelHeader>
					<PanelBody>
						<div className="row">
							{!this.state.loadingStatic && this.state.isBuyer &&
								<div className="col-xl-3 col-md-6">
									<div className="widget widget-stats bg-blue">
										<div className="stats-icon"><i className='fa fa-cube'></i></div>
										<div className="stats-info">
											<h4>Closing Date Reminder</h4>
											<p>{this.state.dataStatic.length}</p>	
										</div>
										<div className="stats-link">
											<a href="/home" onClick={(e) => {e.preventDefault(); this.props.history.push(`task-buyer/task-quotation`)}}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
										</div>
									</div>
								</div>}
							{task}
						</div>
						{/* <div className="row">
							{task}
						</div> */}
					</PanelBody>
				</Panel>
			</div>
			{this.state.isBuyer &&
				<div style={{clear : 'both'}}>
					<Panel>
						<PanelHeader>Task Expediting</PanelHeader>
						<PanelBody>
							<div className="row">
								{task_expediting}
							</div>
						</PanelBody>
					</Panel>
				</div>
			}
		</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
		access: state.sidebarDt.access,
		user: state.auth.user.data,
		vendor: state.vendorProfile.vendor,
		getId: state.vendorProfile,
		verification: state.verification.verification
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchTaskMenu: () => dispatch(fetchTaskMenu()),
		fetchTaskItem: (ticket_id) => dispatch(fetchTaskItem(ticket_id)),
		fetchMonitoringTenderBuyer: (params) => dispatch(fetchMonitoringTenderBuyer(params)),
		fetchReminder: (params) => dispatch(fetchReminder(params)),
		fetchExpediting: (params) => dispatch(fetchExpediting(params)),
		fetchProgress: (params) => dispatch(fetchProgress(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Task));