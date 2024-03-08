import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';

// import {toastr} from 'react-redux-toastr';
import { fileUpload } from '../../../../store/actions/uploadActions';
import { setSelectedItemsPr, submitProposalTender } from '../../../../store/actions/tendering/proposalTenderActions';
import { ShowDetailPurchasingRequisition, uploadPurchasingRequisition } from '../../../../store/actions/tendering/purchasingRequisitionActions';
import { fetchMetodePengadaan } from '../../../../store/actions/master/metodePengadaanActions';
import { fetchMetodeAanwijzing } from '../../../../store/actions/master/metodeAanwijzingActions';
import { fetchMetodePenyampaian } from '../../../../store/actions/master/metodePenyampaianActions';
import { fetchIncoterms } from '../../../../store/actions/master/incotermsActions';
import { fetchJadwalTender } from '../../../../store/actions/master/jadwalTenderActions';
import { fetchTemplatePersyaratan, fetchTemplatePersyaratanItem } from '../../../../store/actions/master/templatePersyaratanActions';
import { authFetch } from '../../../../store/actions/authActions';

import Form from './sub/Form';
import FormDetail from './sub/FormDetail';
import ModalTerm from './sub/ModalTerm';
import ModalEdoc from './sub/ModalEdoc';
import { toastr } from 'react-redux-toastr';

class CreateProposalTender extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.childList = React.createRef();
		this.childItem = React.createRef();
		this._data = []
		this.state = {
			hideNav: '',
			dateNow: '',
			data_list: [],
			date_server: '',
			proposal_tender: {
				header: {
					status: 'o',
					title: '',
					number: '',
					reference: '',
					metode_pengadaan_id: '',
					pra_qualification: '',
					metode_aanwijzing_id: '',
					metode_penyampaian_id: '',
					metode_evaluasi: '',
					metode_negosiasi: '',
					order_placement: '',
					multiwinner: '',
					bid_bond: '',
					bid_bond_value: '',
					incoterm_id: '',
					visibilitas_bid_open: '',
					delivery_location: '',
					masa_berlaku: '',
					delivery_time: '',
					lingkup_pekerjaan: '',
					note_internal: '',
					note_external: '',
					bobot_teknis: '',
					bobot_komersil: '',
					ambang_batas: '',
					tipe_template: '',
					tipe_template_komersil: '',
					purchasing_group_id: '',
					terms: [],
					terms_admin: [],
					terms_komersil: []
				},
				m_metode_pengadaan: [],
				m_metode_aanwijzing: [],
				m_metode_penyampaian: [],
				m_incoterm: [],
				m_jadwal_tender: [],
				m_tipe: [],
				m_template_persyaratan: [],
				m_template_persyaratan_item: [],
				m_template_persyaratan_item_komersil: [],
				edoc: [],
				items: [],
				attachments: [],
				attachments_persyaratan: [],
				attachments_persyaratan_komersil: [],
				participants: [],
				errors: [],
				m_persyaratan: [
					{term_code: 'teknikal', term_name: 'Administratif & Technical'},
					{term_code: 'komersial', term_name: 'Commercial'},
				],
				m_metode_evaluasi: [
					{value: 'sistem_gugur', label: 'Sistem Gugur'},
					{value: 'sistem_nilai', label: 'Sistem Nilai'},
				],
				m_metode_negosiasi: [
					{value: 'auction', label: 'Auction'},
					{value: 'non_auction', label: 'Non Auction'},
				],
				m_order_placement: [
					{value: 'paket', label: 'Paket'},
					{value: 'itemize', label: 'Itemize'},
				],
				m_visibilitas_bid_open: [
					{value: 'general', label: 'General'},
					{value: 'privat', label: 'Privat'},
				],
				loading: false,
				loadingButton: false
			},
			sendData: {
				header: [],
				items: [],
				documents: [],
				schedules: [],
				terms: [],
				edocs: [],
				panitia: [],
			},
			tempData: {
				terms: [],
				terms_admin: [],
				terms_komersil: [],
				edocs: {
					id: '',
					title: '',
					items: [],
				},
			},
			loadings: {
				button: false,
				buttonUpload: false,
				loadingModal: false,
				loadingModalTerm: false,
				modalsEdoc: false,
				items: false,
				edoc: false,
				showItems: false,
				metode_pengadaan: false,
				metode_aanwijzing: false,
				metode_penyampaian: false,
				incoterm: false,
				jadwal_tender: false,
				persyaratan: false,
				persyaratan_item: false,
				determination: false
			},
			loading: false,
			uuid: null,
			modalOpen: false,
			modalOpenTerm: false,
			modalOpenEdoc: false,
			modalTypeEdoc: '',
			modalType: '',
			modalData : {
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.authFetch();
			this.setItems();
			this.dateNow();
			this.fetchMetodePengadaan('', this.props.user.company_id)
			this.fetchMetodeAanwijzing('')
			this.fetchMetodePenyampaian('')
			this.fetchIncoterms('')
			window.addEventListener("resize", this.resize.bind(this));
			this.resize();
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
		window.removeEventListener("resize", this.resize.bind(this));
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	componentDidMount() {

	}

	resize() {
			this.setState({hideNav: window.innerWidth <= 760});
	}

	// setLoading = (type) => {
	// 	this.setState({ loading: type })
	// }
	
	dateNow = () => {
		let dtToday = new Date();
		let month = dtToday.getMonth() + 1;
		let day = dtToday.getDate();
		let year = dtToday.getFullYear();
		if(month < 10)
				month = '0' + month.toString();
		if(day < 10)
				day = '0' + day.toString();
		let maxDate = year + '-' + month + '-' + day;
		this.setState({ dateNow: maxDate })
	}

	formattingDate = (e) => {
		let d = new Date(e),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();

		if (month.length < 2) 
				month = '0' + month;
		if (day.length < 2) 
				day = '0' + day;

		return [year, month, day].join('-');
	}

	fetchMetodePengadaan = (params, company_id) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 10, select: params, company_id: company_id} : {start: 0, length: 10, company_id: company_id};
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, metode_pengadaan: true },
				proposal_tender: { ...proposal_tender, m_metode_pengadaan: [] }
			}));
			this.props.fetchMetodePengadaan(select_params)
			.then((resp) => {
				let m_metode_pengadaan = resp.data.data;
				let options = m_metode_pengadaan.map((dt) => {
					return { value: dt.id, label: dt.name, pra_qualification: dt.pra_qualification, tender_umum: dt.tender_umum };
				})
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_pengadaan: false },
					proposal_tender: { ...proposal_tender, m_metode_pengadaan: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_pengadaan: false },
					proposal_tender: { ...proposal_tender, m_metode_pengadaan: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchMetodeAanwijzing = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 10, select: params} : {start: 0, length: 10};
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, metode_aanwijzing: true },
				proposal_tender: { ...proposal_tender, m_metode_aanwijzing: [] }
			}));
			this.props.fetchMetodeAanwijzing(select_params)
			.then((resp) => {
				let m_metode_aanwijzing = resp.data.data;
				let options = m_metode_aanwijzing.map((dt) => {
					return { value: dt.id, label: dt.name };
				})
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_aanwijzing: false },
					proposal_tender: { ...proposal_tender, m_metode_aanwijzing: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_aanwijzing: false },
					proposal_tender: { ...proposal_tender, m_metode_aanwijzing: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchMetodePenyampaian = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {start: 0, length: 10, select: params} : {start: 0, length: 10};
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, metode_penyampaian: true },
				proposal_tender: { ...proposal_tender, m_metode_penyampaian: [] }
			}));
			this.props.fetchMetodePenyampaian(select_params)
			.then((resp) => {
				let m_metode_penyampaian = resp.data.data;
				let options = m_metode_penyampaian.map((dt) => {
					return { value: dt.id, label: dt.name };
				})
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_penyampaian: false },
					proposal_tender: { ...proposal_tender, m_metode_penyampaian: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, metode_penyampaian: false },
					proposal_tender: { ...proposal_tender, m_metode_penyampaian: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	setMetodeEvaluasi = (params) => {
		const setHeader = {...this.state.proposal_tender.header}
		setHeader.metode_evaluasi = params;
		this.setState(({ loadings, proposal_tender }) => ({
			loadings: { ...loadings, metode_penyampaian: false },
			proposal_tender: { ...proposal_tender, header: setHeader }
		}));
	}

	setMetodeAanwijzing = (params) => {
		const setHeader = {...this.state.proposal_tender.header}
		setHeader.metode_aanwijzing_id = params;
		this.setState(({ loadings, proposal_tender }) => ({
			loadings: { ...loadings, metode_aanwijzing: false },
			proposal_tender: { ...proposal_tender, header: setHeader, m_jadwal_tender: [] }
		}));
	}

	fetchIncoterms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, incoterm: true },
				proposal_tender: { ...proposal_tender, m_incoterm: [] }
			}));
			this.props.fetchIncoterms(select_params)
			.then((resp) => {
				let m_incoterm = resp.data.data;
				let options = m_incoterm.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, incoterm: false },
					proposal_tender: { ...proposal_tender, m_incoterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, incoterm: false },
					proposal_tender: { ...proposal_tender, m_incoterm: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchJadwalTender = async (params, val) => {
		if(this._isMounted){
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, jadwal_tender: true },
				proposal_tender: { ...proposal_tender, m_jadwal_tender: [] }
			}));
			const setHeader = {...this.state.proposal_tender.header}
			this.props.fetchJadwalTender(params)
			.then((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, jadwal_tender: false },
					proposal_tender: { ...proposal_tender, m_jadwal_tender: resp.data.data, header: setHeader }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, jadwal_tender: false },
					proposal_tender: { ...proposal_tender, m_jadwal_tender: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchTemplatePersyaratan = (params) => {
		if(this._isMounted){
			let select_params = { tipe: params }
			this.setState(({ loadings, proposal_tender }) => ({
				loadings: { ...loadings, persyaratan: true },
				proposal_tender: { ...proposal_tender, m_template_persyaratan: [] }
			}));
			this.props.fetchTemplatePersyaratan(select_params)
			.then((resp) => {
				let m_template_persyaratan = resp.data.data;
				let options = m_template_persyaratan.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, persyaratan: false, loadingModalTerm: false, button: false },
					proposal_tender: { ...proposal_tender, m_template_persyaratan: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, persyaratan: false, loadingModalTerm: false, button: false },
					proposal_tender: { ...proposal_tender, m_template_persyaratan: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchTemplatePersyaratanItem = (params, type) => {
		if(this._isMounted){
			// let select_params = { tipe: params }
			this.setState(({ loadings }) => ({
				loadings: { ...loadings, persyaratan_item: true }
			}));
			this.props.fetchTemplatePersyaratanItem(params)
			.then((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, persyaratan_item: false, loadingModalTerm: false, button: false },
					proposal_tender: type === 'teknikal' ? { ...proposal_tender, m_template_persyaratan_item: resp.data.data } : { ...proposal_tender, m_template_persyaratan_item_komersil: resp.data.data }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({
					loadings: { ...loadings, persyaratan_item: false, loadingModalTerm: false, button: false },
					proposal_tender: { ...proposal_tender, m_template_persyaratan_item: [], m_template_persyaratan_item_komersil: [] }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	setItems = () => {
		if(this.props.temporary.selected_items_pr.items !== undefined){
			this.setState(({ loadings, proposal_tender }) => ({ 
				// loadings: { ...loadings, buttonUpload: true, button: true, showItems: true },
				proposal_tender : {
						...proposal_tender,
						errors: [],
						items: this.props.temporary.selected_items_pr.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
						attachments: this.props.temporary.selected_items_pr.attachments
				}
			}));
		} else {
			toastr.warning("Validation Fail", "Selected Items Is Empty")
			this.props.history.push('/tendering/pra-proposal-tender')
		}
	}

	toggleClose = () => {
		this.setState({ modalOpen: false })
	}

	toggleCloseTerm = () => {
		this.setState({ modalOpenTerm: false })
	}

	toggleCloseEdoc = () => {
		const edocTemp = {...this.state.tempData.edocs};
		edocTemp.id = '';
		edocTemp.title = '';
		edocTemp.items = [];
		this.setState(({ tempData }) => ({
			modalOpenEdoc: false,
			modalTypeEdoc: '',
			tempData: { ...tempData, edocs: edocTemp },
		}));
	}

	modals = async (payload) => {
		this.setState(({ loadings, modalData}) => ({
			loadings: { ...loadings, loadingModal:true, button: true},
			modalOpen:true,
			modalData: { ...modalData, items:[], item_potext : [] , account_assignment : []}
		}));
		this.props.ShowDetailPurchasingRequisition(this.state.proposal_tender.items[payload].uuid)
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({  loadings , modalData}) => ({
					loadings: { ...loadings, loadingModal:false, button: false},
					modalData: { ...modalData, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
				}));
			})
			.catch((resp) => {
				// this.setState(({ proposal_tender }) => ({ proposal_tender: { ...proposal_tender, loading: false } }));
				toastr.error(resp.status, resp.message);
				// this.props.history.push('/home')
				this.setState(({  loadings }) => ({
					loadings: { ...loadings, loadingModal:false, button: false}
				}));
			});
	}

	modalsTerm = async (payload) => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, loadingModalTerm: true, button: false},
			modalOpenTerm: true,
			modalType: payload
		}));
		this.fetchTemplatePersyaratan(payload)
	}

	modalsEdoc = async (payload) => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, loadingModalEdoc: false, button: false},
			modalOpenEdoc: true,
			modalTypeEdoc: 'add'
		}));
	}

	uploadPurchasingRequisition = (id, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, buttonUpload: true, button: true } }));
		this.props.uploadPurchasingRequisition(id, payload)
			.then((resp) => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, buttonUpload: false, button: false }
				}), () => {
					this.showPurchasingRequisition(this.state.uuid);
				});
				toastr.success(resp.data.message);
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, buttonUpload: false, errors: resp.data.errors, button: false } }));
				toastr.error(resp.status, resp.data.message);
				// this.props.history.push('/home')
			});
	}

	addLampiran = (payload) => {
		let arr = this.state.proposal_tender.attachments;
		// this.uploadPurchasingRequisition(this.state.uuid, payload)
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				attachments: arr
			}
		}))
	}

	addLampiranTerm = (payload, type) => {
		if(type === 'teknikal'){
			let arr = this.state.proposal_tender.attachments_persyaratan;
			arr.push(payload);
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					attachments_persyaratan: arr
				}
			}))
		} else {
			let arr = this.state.proposal_tender.attachments_persyaratan_komersil;
			arr.push(payload);
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					attachments_persyaratan_komersil: arr
				}
			}))
		}
	}

	addParticipant = (payload) => {
		let arr = this.state.proposal_tender.participants;
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				participants: arr
			}
		}))
	}

	addTemplateTerm = (payload, type) => {
		if(type === 'teknikal'){
			let arr = this.state.proposal_tender.m_template_persyaratan_item;
			arr.push(payload);
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					m_template_persyaratan_item: arr
				}
			}))
		} else {
			let arr = this.state.proposal_tender.m_template_persyaratan_item_komersil;
			arr.push(payload);
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					m_template_persyaratan_item_komersil: arr
				}
			}))
		}
	}

	deleteLampiran = (payload) => {
		let data = this.state.proposal_tender.attachments;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				attachments: arr
			}
		}))
	}

	deleteLampiranTerm = (payload, type) => {
		if(type === 'teknikal'){
			let data = this.state.proposal_tender.attachments_persyaratan;
			let arr = []
			data.forEach((element, i) => {
				if (i !== payload) {
					arr.push(element)
				}
			});
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					attachments_persyaratan: arr
				}
			}))
		} else {
			let data = this.state.proposal_tender.attachments_persyaratan_komersil;
			let arr = []
			data.forEach((element, i) => {
				if (i !== payload) {
					arr.push(element)
				}
			});
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					attachments_persyaratan_komersil: arr
				}
			}))
		}
	}

	deleteParticipant = (payload) => {
		let data = this.state.proposal_tender.participants;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				participants: arr
			}
		}))
	}
	
	deleteTerms = (payload, type) => {
		if(type === 'teknikal'){
			let data = this.state.proposal_tender.m_template_persyaratan_item;
			let arr = []
			data.forEach((element, i) => {
				if (i !== payload) {
					arr.push(element)
				}
			});
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					m_template_persyaratan_item: arr
				}
			}))
		} else {
			let data = this.state.proposal_tender.m_template_persyaratan_item_komersil;
			let arr = []
			data.forEach((element, i) => {
				if (i !== payload) {
					arr.push(element)
				}
			});
			this.setState(prevState => ({
				...prevState,
				proposal_tender: {
					...prevState.proposal_tender,
					m_template_persyaratan_item_komersil: arr
				}
			}))
		}
	}

	setLoading = () => {
		this.setState(({ loadings, proposal_tender }) => ({ loadings: { ...loadings, button: true}, proposal_tender: { ...proposal_tender, errors: [] } }));
	}

	setTermData = (terms, header, tipe_id, termItem, type, terms_admin) => {
		const setHeader = { ...this.state.proposal_tender.header }
		if(type === 'teknikal'){
			setHeader.bobot_teknis = header.bobot_teknis;
			setHeader.bobot_komersil = header.bobot_komersil;
			setHeader.ambang_batas = header.ambang_batas;
			setHeader.terms = terms;
			setHeader.terms_admin = terms_admin;
			setHeader.tipe_template = tipe_id
			if(termItem !== false){
				this.setState(({ proposal_tender }) => ({
					proposal_tender: { ...proposal_tender, m_template_persyaratan_item: termItem },
				}));
			}
			this.setState(({ tempData, proposal_tender }) => ({
				tempData: { ...tempData, terms: terms, terms_admin: terms_admin },
				proposal_tender: { ...proposal_tender, header: setHeader, },
			}));
		} else {
			setHeader.terms_komersil = terms;
			setHeader.tipe_template_komersil = tipe_id
			if(termItem !== false){
				this.setState(({ proposal_tender }) => ({
					proposal_tender: { ...proposal_tender, m_template_persyaratan_item_komersil: termItem },
				}));
			}
			this.setState(({ tempData, proposal_tender }) => ({
				tempData: { ...tempData, terms_komersil: terms },
				proposal_tender: { ...proposal_tender, header: setHeader, },
			}));
		}
		this.setTerms();
	}

	setTerms = () => {
		const combineData = this.state.tempData.terms.concat(this.state.tempData.terms_komersil);
		const concatTerms = combineData.concat(this.state.tempData.terms_admin);
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, terms: concatTerms }
		}));
	}

	setSchedule = (data) => {
		let schedule = []
		if(data && data.length > 0){
			data.forEach(item => {
				var obj = {
					end_date: (item.end_date && item.end_date !== "") ? item.end_date : "",
					end_time: item.end_time,
					jadwal_tender_code: item.jadwal_tender_code,
					jadwal_tender_id: item.jadwal_tender_id,
					jadwal_tender_name: item.jadwal_tender_name,
					start_date: (item.start_date && item.start_date !== "") ? item.start_date : "",
					start_time: item.start_time,
				}
				schedule.push(obj);
			})
		}
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, schedules: schedule },
		}));
	}

	setPanitia = (data) => {
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, panitia: data },
		}));
	}

	setHeader = (data, status) => {
		const datas = this.state.proposal_tender.header;
		const headerData = 
		{
			bobot_teknis: datas.bobot_teknis,
			bobot_komersil: datas.bobot_komersil,
			ambang_batas: datas.ambang_batas,
			attactment_description: data.attactment_description,
			bid_bond: data.bid_bond,
			bid_bond_value: data.bid_bond_value,
			created_by_name: data.created_by_name,
			delivery_location: data.delivery_location,
			delivery_time: data.delivery_time,
			file: data.file,
			incoterm_id: data.incoterm_id,
			lingkup_pekerjaan: data.lingkup_pekerjaan,
			masa_berlaku: data.masa_berlaku,
			metode_aanwijzing_id: data.metode_aanwijzing_id,
			metode_evaluasi: data.metode_evaluasi,
			metode_negosiasi: data.metode_negosiasi,
			metode_pengadaan_id: data.metode_pengadaan_id,
			metode_penyampaian_id: data.metode_penyampaian_id,
			multiwinner: data.multiwinner,
			note_external: data.note_external,
			note_internal: data.note_internal,
			number: data.number,
			order_placement: data.order_placement,
			pra_qualification: data.pra_qualification,
			reference: data.reference,
			title: data.title,
			visibilitas_bid_open: data.visibilitas_bid_open,
			purchasing_group_id: data.purchasing_group_id,
			status: data.status,
		}
		this.setState(({ sendData }) => ({
			sendData : { ...sendData, header: headerData }
		}), () => {
			this.setEdocs(this.state.proposal_tender.edoc)
		});
	}

	setItemsAttch = (data) => {
		const arr_items = []
		const arr_attch = []
		const setVal = []
		if(this.state.proposal_tender.items.length > 0){
			this.state.proposal_tender.items.forEach((item, key) => {
				arr_items.push({purchasing_requisition_item_id: item.id, purchasing_requisition_id: item.purchasing_requisition_id})
			})
			const valueArr = arr_items.map((item) => { return item.purchasing_requisition_item_id });
			valueArr.some((item, idx) => { 
					const checkIndexDuplicate = valueArr.indexOf(item);
					if(valueArr.indexOf(item) === idx){
						setVal.push(arr_items[checkIndexDuplicate])
					}
					return false;
			});
		}
		if(this.state.proposal_tender.attachments.length > 0){
			this.state.proposal_tender.attachments.forEach((item, key) => {
				arr_attch.push({purchasing_requisition_attachment_id: item.id, status: 'd'})
			})
		}
		this.setState(({ sendData }) => ({
			sendData : { ...sendData, items: setVal, documents: data }
		}));
	}

	setEdocs = (payload) => {
		const arr = [];
		if(payload.length > 0){
			payload.forEach((item, key) => {
				arr.push(item.edoc)
			})
		}
		this.setState(({ sendData }) => ({
			sendData : { ...sendData, edocs: arr }
		}));
	}

	addEdoc = (payload, id) => {
		let arr;
		if(id !== ''){
			arr = this.state.proposal_tender.edoc;
			arr[id].title = payload.title;
			arr[id].edoc = payload.edoc;
			arr[id].created_at = payload.created_at;
			arr[id].created_by = payload.created_by;
		} else {
			arr = this.state.proposal_tender.edoc;
			arr.push(payload);
		}
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				edoc: arr
			}
		}))
	}

	editEdoc = (id) => {
		const edocData = this.state.proposal_tender.edoc;
		const edocTemp = {...this.state.tempData.edocs};
		edocTemp.id = id;
		edocTemp.title = edocData[id].title;
		edocTemp.items = edocData[id].edoc.items;
		this.setState(({ tempData }) => ({
			modalOpenEdoc: true,
			modalTypeEdoc: 'edit',
			tempData: { ...tempData, edocs: edocTemp },
		}));
	}

	deleteEdoc = (id) => {
		let data = this.state.proposal_tender.edoc;
		let arr = []
		data.forEach((element, i) => {
			if (i !== id) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				edoc: arr
			}
		}))
	}

	deleteEdocItems = (id) => {
		let data = this.state.proposal_tender.edoc.items;
		let arr = []
		data.forEach((element, i) => {
			if (i !== id) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			proposal_tender: {
				...prevState.proposal_tender,
				edoc: arr
			}
		}))
	}

	submitProposalTender = async () => {
		if (this.checkCompleteTerms()){
			this.props.submitProposalTender(this.state.sendData)
			.then((resp) => {
				toastr.success("Berhasil Simpan Data")
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false} }));
				this.props.history.push('/tendering/monitoring-tender-buyer')
			})
			.catch((resp) => {
				this.setState(({ loadings, proposal_tender }) => ({ loadings: { ...loadings, button: false}, proposal_tender: { ...proposal_tender, errors: resp.data.errors } }));
				const errors = resp.data.errors;
				if(errors){
					var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
					const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
					if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
				} else {
					toastr.error(resp.data.status, resp.data.message);
				}
			});
		}else{
			// toastr.error('Lengkapi Semua Persyaratan Terlebih Dahulu');
			this.setState(({ loadings, proposal_tender }) => ({ loadings: { ...loadings, button: false}, proposal_tender: { ...proposal_tender, errors: {terms : ['Field Persyaratan Diperlukan']} } }));
		}
	}

	authFetch = () => {
		this.props.authFetch()
		.then((resp) => {
			const {data} = resp.data
			const set_date = new Date(data.timestamp);
			this.setState({ date_server: set_date })
		})
		.catch((resp) => {
			const set_date = new Date();
			this.setState({ date_server: set_date })
		});
	}

	checkCompleteTerms = () => {
		let adminTerms = false
		let teknisTerms = false
		let comercilTerms = false

		if (this.state.sendData.header.metode_evaluasi){
			if(this.state.sendData.terms.length > 0){
				this.state.sendData.terms.forEach((item) => {
					if(item.tipe === '4'){
						teknisTerms = true
					}else if (item.tipe === '2'){
						adminTerms = true
					}else if(item.tipe === '6'){
						comercilTerms = true
					}
				})
			}
			
			if (adminTerms && teknisTerms && comercilTerms){
				return true
			}else{
				return false
			}
		}else{
			return true
		}

	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Create Proposal Tender</li>
				</ol>
				<h1 className="page-header">Create Proposal Tender </h1>
					<Form
						parentState={this.state}
						parentProps={this.props}
						modals={(payload) => this.modals(payload)}
						modalsTerm={(payload) => this.modalsTerm(payload)}
						submitProposalTender={this.submitProposalTender}
						setLoading={this.setLoading}
						fetchJadwalTender={this.fetchJadwalTender}
						setMetodeEvaluasi={this.setMetodeEvaluasi}
						setMetodeAanwijzing={this.setMetodeAanwijzing}
						upload={this.props.fileUpload}
						addLampiran={this.addLampiran}
						deleteLampiran={this.deleteLampiran}
						setSchedule={this.setSchedule}
						setHeader={this.setHeader}
						setItemsAttch={this.setItemsAttch}
						fetchMetodePengadaan={this.fetchMetodePengadaan}
						fetchMetodeAanwijzing={this.fetchMetodeAanwijzing}
						fetchMetodePenyampaian={this.fetchMetodePenyampaian}
						fetchIncoterms={this.fetchIncoterms}
						modalsEdoc={this.modalsEdoc}
						editEdoc={this.editEdoc}
						deleteEdoc={this.deleteEdoc}
						setEdocs={this.setEdocs}
						setPanitia={this.setPanitia}
						addParticipant={this.addParticipant}
						deleteParticipant={this.deleteParticipant}
					/>
					{/* MODAL DETAIL PR */}
					<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>
						{this.state.loadings.loadingModal && (
							<center>
							<br />
							<ReactLoading type="cylon" color="#0f9e3e" />
							<br />
							</center>
						)}
							{this.state.loadings.loadingModal === false && (
							<FormDetail
							disabledForm={true}
							data={this.state.modalData}
							toggleClose={this.toggleClose}
							/>
						)}
					</Modal>
					{/* MODAL TERM */}
					<Modal isOpen={this.state.modalOpenTerm} toggle={() => this.toggleCloseTerm()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleCloseTerm()}>Persyaratan {this.state.modalType} </ModalHeader>
						{this.state.loadings.loadingModalTerm && (
							<center>
							<br />
							<ReactLoading type="cylon" color="#0f9e3e" />
							<br />
							</center>
						)}
							{this.state.loadings.loadingModalTerm === false && (
							<ModalTerm
								parentState={this.state}
								parentProps={this.props}
								toggleClose={this.toggleCloseTerm}
								fetchTemplatePersyaratanItem={this.fetchTemplatePersyaratanItem}
								addLampiranTerm={this.addLampiranTerm}
								addTemplateTerm={this.addTemplateTerm}
								deleteLampiranTerm={this.deleteLampiranTerm}
								setTermData={this.setTermData}
								deleteTerms={this.deleteTerms}
							/>
						)}
					</Modal>
					{/* MODAL EDOC */}
					<Modal isOpen={this.state.modalOpenEdoc} toggle={() => this.toggleCloseEdoc()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleCloseEdoc()}>E-Document Aanwijzing </ModalHeader>
						{this.state.loadings.loadingModalEdoc && (
							<center>
							<br />
							<ReactLoading type="cylon" color="#0f9e3e" />
							<br />
							</center>
						)}
							{this.state.loadings.loadingModalEdoc === false && (
							<ModalEdoc
								parentState={this.state}
								parentProps={this.props}
								toggleClose={this.toggleCloseEdoc}
								addEdoc={this.addEdoc}
								deleteEdocItems={this.deleteEdocItems}
							/>
						)}
					</Modal>
			</div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
    access: state.sidebarDt.access,
		user: state.auth.user.data,
		temporary: state.temporary
	}
}

const dispatchToProps = dispatch => {
	return {
		fetchMetodePengadaan: (params) => dispatch(fetchMetodePengadaan(params)),
		fetchMetodeAanwijzing: (params) => dispatch(fetchMetodeAanwijzing(params)),
		fetchMetodePenyampaian: (params) => dispatch(fetchMetodePenyampaian(params)),
		fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
		fetchJadwalTender: (params) => dispatch(fetchJadwalTender(params)),
		fetchTemplatePersyaratan: (params) => dispatch(fetchTemplatePersyaratan(params)),
		fetchTemplatePersyaratanItem: (params) => dispatch(fetchTemplatePersyaratanItem(params)),
		setSelectedItemsPr: (payload) => dispatch(setSelectedItemsPr(payload)),
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		uploadPurchasingRequisition: (id, payload) => dispatch(uploadPurchasingRequisition(id, payload)),
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		submitProposalTender: (payload) => dispatch(submitProposalTender(payload)),
		authFetch: () => dispatch(authFetch()),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (CreateProposalTender));