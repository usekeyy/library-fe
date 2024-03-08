import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { countTaskProposalTender,
			countTaskProposalTenderAktif,
			countTaskQuotation, 	
			countTaskEvaluasiAdmin, 
			countTaskEvaluasiTeknis, 
			countTaskEvaluasiTeknisAssignment,
			countTaskEvaluasiKomersil,
			countTaskPenawaranTerkirim,
			countTaskKlarifikasiEvaluasiTeknis,
			countTaskRejectExtendCompany,
			countTaskRejectDataProfil,
			getCountDokumenExpired, getCountAuctionVendor,
			countUnbilledBarang,
			countUnbilledJasa } 
		from '../../../store/actions/vendor/taskVendorActions';
import { taskAanwijzing } from '../../../store/actions/tendering/aanwijzingActions';
import { fetchVendorNegotiation } from '../../../store/actions/tendering/negotiationActions';
import { countPraQualificationKlarifikasi } from '../../../store/actions/tendering/praQualificationActions'
import { fetchPurchaseOrder  } from '../../../store/actions/tendering/PurchaseOrderActions'
import { fetchOutlineAgreement  } from '../../../store/actions/tendering/OutlineAgreementActions'
import { fetchExpediting } from '../../../store/actions/expediting/ExpeditingActions'
import { fetchReminder } from '../../../store/actions/expediting/reminderActions'
import { fetchProgress } from '../../../store/actions/expediting/progressActions'
import { fetchInvoice } from '../../../store/actions/invoice/invoiceActions'
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';

class Task extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			data: [],
			data_vendor: [],
			data_expediting: [],
			data_invoice : [],
			loading: false
		}
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			this.countTaskRejectExtendCompany()
			this.countTaskRejectDataProfil()
			this.countTaskDokumenExpired()
			this.countTaskProposalTender()
			this.countTaskProposalTenderAktif()
			this.countTaskQuotation()
			this.countTaskaAanwjizing()
			this.countTaskaNego()
			// this.countTaskEvalAdmin()
			// this.countTaskEvalTeknis()
			// this.countTaskEvalTeknisAssignment()
			// this.countTaskEvalKomersil()
			this.countPenawaranTerkirim()
			this.countTaskPraKualifikasi()
			this.countTaskOutlineAgreement()
			this.countTaskPurchaseOrder()
			this.countTaskPurchaseOrderOA()
			this.countTaskKlarifikasiEvaluasiTeknis()
			this.countTaskOpenPOExpediting()
			// this.countTaskOutstandingPOExpediting()
			this.getCountAuctionVendor()
			this.countTaskReminder()
			this.countTaskProgress()
			this.countTaskKonfirmasi()

			this.countUnbilledBarang()
			this.countUnbilledJasa()
			this.fetchInvoice()
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	countUnbilledBarang = async () => {
		this.setState({ loading: true })
		this.props.countUnbilledBarang("")
			.then((resp) => {
				var joined = this.state.data_invoice.concat({ order: 0, name: 'Unbilled Barang', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/invoice/unbilled/barang` });
				this.setState({ loading: false, data_invoice: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_invoice: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countUnbilledJasa = async () => {
		this.setState({ loading: true })
		this.props.countUnbilledJasa("")
			.then((resp) => {
				var joined = this.state.data_invoice.concat({ order: 1, name: 'Unbilled Jasa', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/invoice/unbilled/jasa` });
				this.setState({ loading: false, data_invoice: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_invoice: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	fetchInvoice = async () => {
		this.setState({ loading: true })
		this.props.fetchInvoice({status: 'rejected_1;rejected_2'})
			.then((resp) => {
				var joined = this.state.data_invoice.concat({ order: 2, name: 'Invoice Rejected', icon: 'fa fa-book', tickets_count: resp.data.recordsFiltered, url: `/invoice/invoice-management` });
				this.setState({ loading: false, data_invoice: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_invoice: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskProposalTender = async () => {
		this.setState({ loading: true })
		this.props.countTaskProposalTender(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 0, name: 'Undangan Tender', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/task-vendor/undangan-tender` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskProposalTenderAktif = async () => {
		this.setState({ loading: true })
		this.props.countTaskProposalTenderAktif(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 1, name: 'Tender Aktif', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/task-vendor/undangan-tender-aktif` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskQuotation = async () => {
		this.setState({ loading: true })
		this.props.countTaskQuotation(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 2, name: 'Quotation', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/task-vendor/quotation` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskaAanwjizing = async () => {
		this.setState({ loading: true })
		this.props.taskAanwijzing(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 3, name: 'Aanwijzing', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `/task-vendor/aanwijzing-vendor` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskaNego = async () => {
		this.setState({ loading: true })
		this.props.fetchVendorNegotiation({process: true})
			.then((resp) => {
				const data = resp.data.data;
				const filters =  data.filter(i => i.status === 'nego');
				var joined = this.state.data.concat({ order: 4, name: 'Negotiation', icon: 'fa fa-book', tickets_count: filters.length, url: `/task-vendor/negotiation` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countPenawaranTerkirim = async () => {
		this.setState({ loading: true })
		this.props.countTaskPenawaranTerkirim()
			.then((resp) => {
				var joined = this.state.data.concat({ order: 5, name: 'Penawaran Terkirim', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `task-vendor/penawaran-terkirim` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskEvalAdmin = async () => {
		this.setState({ loading: true })
		this.props.countTaskEvaluasiAdmin(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 5, name: 'Evaluasi Admin', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `tendering/evaluation-administration` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskEvalTeknis = async () => {
		this.setState({ loading: true })
		this.props.countTaskEvaluasiTeknis(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 6, name: 'Evaluasi Teknis', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `tendering/evaluation-technical` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskEvalTeknisAssignment = async () => {
		this.setState({ loading: true })
		this.props.countTaskEvaluasiTeknisAssignment(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 7, name: 'Evaluasi Teknis Assignment', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `tendering/evaluation-technical/assignment` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskEvalKomersil = async () => {
		this.setState({ loading: true })
		this.props.countTaskEvaluasiKomersil(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data.concat({ order: 8, name: 'Evaluasi Komersil', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `tendering/evaluation-commercial` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskPraKualifikasi = async () => {
		this.setState({ loading: true })
		this.props.countPraQualificationKlarifikasi()
			.then((resp) => {
				var joined = this.state.data.concat({ order: 6, name: 'Klarifikasi Pra Kualifikasi', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `tendering/pra-qualification-klarifikasi` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskOutlineAgreement = async () => {
		this.setState({ loading: true })
		this.props.fetchOutlineAgreement()
			.then((resp) => {
				var joined = this.state.data.concat({ order: 7, name: 'Outline Agreement', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `perikatan/outline-agreement` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskPurchaseOrder = async () => {
		this.setState({ loading: true })
		this.props.fetchPurchaseOrder({tipe: 'po'})
			.then((resp) => {
				var joined = this.state.data.concat({ order: 8, name: 'Purchase Order ', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `perikatan/purchase-order-vendor` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskPurchaseOrderOA = async () => {
		this.setState({ loading: true })
		this.props.fetchPurchaseOrder({tipe: 'oa'})
			.then((resp) => {
				var joined = this.state.data.concat({ order: 9, name: 'Purchase Order - Outline Agreement', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `perikatan/purchase-order-oa-vendor` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskKlarifikasiEvaluasiTeknis = async () => {
		this.setState({ loading: true })
		this.props.countTaskKlarifikasiEvaluasiTeknis()
			.then((resp) => {
				var joined = this.state.data.concat({ order: 9, name: 'Klarifikasi Evaluasi', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `task-vendor/klarifikasi-evaluasi` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	getCountAuctionVendor = async () => {
		this.setState({ loading: true })
		this.props.getCountAuctionVendor({status:'s;p'})
			.then((resp) => {
				var joined = this.state.data.concat({ order: 10, name: 'Auction', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `task-vendor/auctions` });
				this.setState({ loading: false, data: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}


	//task vendor management
	countTaskRejectExtendCompany = async () => {
		this.setState({ loading: true })
		this.props.countTaskRejectExtendCompany()
			.then((resp) => {
				var joined = this.state.data_vendor.concat({ order: 2, name: 'Reject Extend Company', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `vendor/extend-company` });
				this.setState({ loading: false, data_vendor: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_vendor: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskRejectDataProfil = async () => {
		this.setState({ loading: true })
		this.props.countTaskRejectDataProfil()
			.then((resp) => {
				var joined = this.state.data_vendor.concat({ order: 1, name: 'Reject Data Profil', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `vendor/profile` });
				this.setState({ loading: false, data_vendor: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_vendor: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskDokumenExpired = async () => {
		this.setState({ loading: true })
		this.props.getCountDokumenExpired(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data_vendor.concat({ order: 3, name: 'Dokumen Expired', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `vendor/dokumen-expired/${this.props.user.uuid}` });
				this.setState({ loading: false, data_vendor: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_vendor: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
				toastr.error('Oops', message);
			});
	}

	countTaskDokumenExpired = async () => {
		this.setState({ loading: true })
		this.props.getCountDokumenExpired(this.props.user.uuid)
			.then((resp) => {
				var joined = this.state.data_vendor.concat({ order: 3, name: 'Dokumen Expired', icon: 'fa fa-book', tickets_count: resp.data.data.count, url: `vendor/dokumen-expired/${this.props.user.uuid}` });
				this.setState({ loading: false, data_vendor: joined })
			})
			.catch((resp) => {
				this.setState({ loading: false, data_vendor: [] })
				let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
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
	
	// countTaskOutstandingPOExpediting = async () => {
	// 	this.setState({ loading: true })
	// 	this.props.fetchExpediting()
	// 		.then((resp) => {
	// 			var joined = this.state.data_expediting.concat({ order: 2, name: 'Outstanding PO', icon: 'fa fa-book', tickets_count: resp.data.data.length, url: `expediting/purchase-order-open` });
	// 			this.setState({ loading: false, data_expediting: joined })
	// 		})
	// 		.catch((resp) => {
	// 			this.setState({ loading: false, data_expediting: [] })
	// 			let message = (typeof resp.data !== 'undefined') ? resp.data.message : 'Something Wrong';
	// 			toastr.error('Oops', message);
	// 		});
	// }
	
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

	toDetail = (e, value) => {
		e.preventDefault();
		this.props.history.push(value)
	}

	render() {
		let task;
		let task_vendor;
		let task_expediting;
		let task_invoice;
		let { data, data_vendor, data_expediting, data_invoice } = this.state;
		if (this.state.loading) {
			task = <div className="col-md-12"><h5>Loading ...</h5></div>
			task_vendor = <div className="col-md-12"><h5>Loading ...</h5></div>
		} else {
			if (data.length > 0) {
				const datas = data.sort((a, b) => a.order - b.order)
				task = datas.map((item, key) => (
					<div key={key} className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon"><i className={item.icon}></i></div>
							<div className="stats-info">
								<h4>{item.name}</h4>
								<p>{item.tickets_count}</p>
							</div>
							<div className="stats-link">
								<a href="/" onClick={(e) => { this.toDetail(e, item.url) }}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task = <div className="col-md-12"><h5>No Data Found </h5></div>
			}

			//task vendor management
			if (data_vendor.length > 0) {
				const datas = data_vendor.sort((a, b) => a.order - b.order)
				task_vendor = datas.map((item, key) => (
					<div key={key} className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon"><i className={item.icon}></i></div>
							<div className="stats-info">
								<h4>{item.name}</h4>
								<p>{item.tickets_count}</p>
							</div>
							<div className="stats-link">
								<a href="/" onClick={(e) => { this.toDetail(e, item.url) }}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task_vendor = <div className="col-md-12"><h5>No Data Found </h5></div>
			}

			// console.log(data_expediting)
			//task expediting
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
								<a href="/" onClick={(e) => { this.toDetail(e, item.url) }}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task_expediting = <div className="col-md-12"><h5>No Data Found </h5></div>
			}
			

			//task_invoice
			if (data_invoice.length > 0) {
				const datas = data_invoice.sort((a, b) => a.order - b.order)
				task_invoice = datas.map((item, key) => (
					<div key={key} className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon"><i className={item.icon}></i></div>
							<div className="stats-info">
								<h4>{item.name}</h4>
								<p>{item.tickets_count}</p>
							</div>
							<div className="stats-link">
								<a href="/" onClick={(e) => { this.toDetail(e, item.url) }}>View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
							</div>
						</div>
					</div>
				))
			} else {
				task_invoice = <div className="col-md-12"><h5>No Data Found </h5></div>
			}

		}

		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item"><Link to="/home">Home</Link></li>
					<li className="breadcrumb-item active">Task</li>
				</ol>
				{/* <h1 className="page-header">Task Vendor Management</h1> */}
				<div style={{clear : 'both'}}>
					<Panel>
						<PanelHeader>Task Vendor Management</PanelHeader>
						<PanelBody>
							<div className="row">
								{task_vendor}
							</div>
						</PanelBody>
					</Panel>
				</div>
				<div style={{clear : 'both'}}>
					<Panel>
						<PanelHeader>Task Tender Management</PanelHeader>
						<PanelBody>
							<div className="row">
								{task}
							</div>
						</PanelBody>
					</Panel>
				</div>
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
				<div style={{clear : 'both'}}>
					<Panel>
						<PanelHeader>Task Invoice</PanelHeader>
						<PanelBody>
							<div className="row">
								{task_invoice}
							</div>
						</PanelBody>
					</Panel>
				</div>
				{/* <h1 className="page-header"> </h1> */}

				
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
		countTaskProposalTender: (vendor_uuid, params) => dispatch(countTaskProposalTender(vendor_uuid, params)),
		countTaskProposalTenderAktif: (vendor_uuid, params) => dispatch(countTaskProposalTenderAktif(vendor_uuid, params)),
		countTaskQuotation: (vendor_uuid, params) => dispatch(countTaskQuotation(vendor_uuid, params)),
		taskAanwijzing: (vendor_uuid) => dispatch(taskAanwijzing(vendor_uuid)),
		countTaskEvaluasiAdmin: (vendor_uuid) => dispatch(countTaskEvaluasiAdmin(vendor_uuid)),
		countTaskEvaluasiTeknis: () => dispatch(countTaskEvaluasiTeknis()),
		countTaskEvaluasiTeknisAssignment: () => dispatch(countTaskEvaluasiTeknisAssignment()),
		countTaskEvaluasiKomersil: () => dispatch(countTaskEvaluasiKomersil()),
		countTaskPenawaranTerkirim: () => dispatch(countTaskPenawaranTerkirim()),
		countTaskKlarifikasiEvaluasiTeknis: () => dispatch(countTaskKlarifikasiEvaluasiTeknis()),
		fetchVendorNegotiation: (params) => dispatch(fetchVendorNegotiation(params)),
		countPraQualificationKlarifikasi: (params) => dispatch(countPraQualificationKlarifikasi(params)),
		fetchPurchaseOrder: (params) => dispatch(fetchPurchaseOrder(params)),
		fetchOutlineAgreement: (params) => dispatch(fetchOutlineAgreement(params)),
		countTaskRejectExtendCompany: () => dispatch(countTaskRejectExtendCompany()),
		countTaskRejectDataProfil: () => dispatch(countTaskRejectDataProfil()),
		getCountDokumenExpired: (uuid) => dispatch(getCountDokumenExpired(uuid)),
		fetchReminder: (params) => dispatch(fetchReminder(params)),
		fetchExpediting: (params) => dispatch(fetchExpediting(params)),
		fetchProgress: (params) => dispatch(fetchProgress(params)),
		getCountAuctionVendor: (params) => dispatch(getCountAuctionVendor(params)),
		countUnbilledBarang: (params) => dispatch(countUnbilledBarang(params)),
		countUnbilledJasa: (params) => dispatch(countUnbilledJasa(params)),
		fetchInvoice: (params) => dispatch(fetchInvoice(params)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Task));