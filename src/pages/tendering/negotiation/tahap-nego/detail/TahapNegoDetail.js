import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../../store/actions/uploadActions';
// import { saveNegotiation } from '../../../../../store/actions/tendering/vendorRegistrationTenderActions';
import { showStepNegotiation, saveNegotiation, downloadBidTabulation, showVendorNegotiation , createAuction } from '../../../../../store/actions/tendering/negotiationActions';
import { fetchLampiranAwarding } from '../../../../../store/actions/tendering/awardingActions';
import { findQuotationVendor } from '../../../../../store/actions/tendering/quotationActions';
import { saveRetender } from '../../../../../store/actions/tendering/retenderActions';
import Form from './Form';
import DetailItem from '../modal/DetailItem';
import FormRetender from '../modal/FormRetender';
import EvaluasiOE from '../modal/EvaluasiOE';
import DocumentVendor from '../modal/DokumenVendor';
import DetailNego from '../modal/DetailNego';
import SweetAlert from 'react-bootstrap-sweetalert';

class TahapNegoDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			isConfirm : false,
			dateNow: '',
			sendData: {},
			modalOpen: false,
			uuid: '',
			paramId: this.props.location.pathname.split("/")[4],
			quotation_detail: [],
			loading_lampiran: false,
			data_lampiran: [],
			vendor_documents: [],
			documents: [],
			param_modal: [],
			detailNego: false,
			dataDetailNego: {},
			proses_nego_vendor: {
				header: {
					ambang_batas: '',
					approved_at: '',
					bid_bond: '',
					bid_bond_value: '',
					bobot_komersil: '',
					bobot_teknis: '',
					created_at: '',
					created_by: '',
					delivery_location: '',
					delivery_time: '',
					id: '',
					incoterm_id: '',
					lingkup_pekerjaan: '',
					masa_berlaku: '',
					metode_aanwijzing_id: '',
					metode_evaluasi: '',
					metode_negosiasi: '',
					metode_pengadaan_id: '',
					metode_penyampaian_id: '',
					multiwinner: '',
					note_external: '',
					note_internal: '',
					number: '',
					order_placement: '',
					pra_qualification: '',
					purchasing_group_id: '',
					purchasing_org_id: '',
					reference: '',
					status: '',
					status_aanwijzing: '',
					status_text: '',
					title: '',
					updated_at: '',
					updated_by: '',
					uuid: '',
					visibilitas_bid_open: '',
					current: '',
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
				},
				dataTemp: {},
				items: [],
				proposal_tender_items: [],
				quotation_items: [],
				documents: [],
				history_nego: [],
				last_histories: [],
				vendors: [],
				errors: [],
			},
			tahap_nego: {
				header: {
					ambang_batas: '',
					approved_at: '',
					bid_bond: '',
					bid_bond_value: '',
					created_at: '',
					created_by: '',
					delivery_location: '',
					delivery_time: '',
					id: '',
					incoterm_id: '',
					lingkup_pekerjaan: '',
					masa_berlaku: '',
					metode_aanwijzing_id: '',
					metode_evaluasi: '',
					metode_negosiasi: '',
					metode_pengadaan_id: '',
					metode_penyampaian_id: '',
					multiwinner: '',
					note_external: '',
					note_internal: '',
					number: '',
					order_placement: '',
					pra_qualification: '',
					purchasing_group_id: '',
					purchasing_org_id: '',
					reference: '',
					status: '',
					status_aanwijzing: '',
					status_text: '',
					title: '',
					updated_at: '',
					updated_by: '',
					uuid: '',
					visibilitas_bid_open: '',
					oe: '',
					buyer_name: '',
					proposal_tender_id: '',
					method_type: '',
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
					negotiation_uuid: '',
					total_penawaran: '',
					total_nego: '',
					auction_uuid :''
				},
				items: [],
				itemize: [],
				schedules: [],
				negotiations: [],
				terms: [],
				errors: [],
				attachments_persyaratan: [],
				vendors: [],
				vendor_selected: [],
				vendor_itemize: [],
				item_selected: [],
				items_selected: [],
				evaluations: {},
				tempConfig: {},
			},
			loadings: {
				modal: false,
				button: false,
				pages: false,
				items: false,
				itemize: false
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.showStepNegotiation(this.state.paramId)
			this.dateNow()
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	sumArray = (qty, prop, array) => {
		var total = 0
		for ( var i = 0, _len = array.length; i < _len; i++ ) {
			if(array[i]['purchasing_requisition_service_id'] !== null){
				total += parseFloat(array[i][prop]) * (parseFloat(array[i][qty])/parseFloat(array[i]['per']))
			}
		}
		return total
	}
	
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

	setMethodType = (type) => {
		const setHeader = {...this.state.tahap_nego.header}
		setHeader.method_type = type;
		this.setState(({ loadings, tahap_nego }) => ({ 
			tahap_nego : {
					...tahap_nego,
					header: setHeader,
			}
		}));
	}

	addLampiranTerm = (payload) => {
		let arr = this.state.tahap_nego.attachments_persyaratan;
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			tahap_nego: {
				...prevState.tahap_nego,
				attachments_persyaratan: arr
			}
		}))
	}

	deleteLampiranTerm = (payload) => {
		let data = this.state.tahap_nego.attachments_persyaratan;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			tahap_nego: {
				...prevState.tahap_nego,
				attachments_persyaratan: arr
			}
		}))
	}

	toggleClose = () => {
		this.setState({ modalOpen: false, uuid: '', modalType: '', quotation_detail: [], detailNego: false, dataDetailNego: {} })
	}

	toggleOpen = (uuid, data, type) => {
		this.setState({ modalType: type, modalOpen: true, uuid: uuid }, () => {
			if(type === 'dokumen-vendor'){
				this.fetchLampiranAwarding(data)
			} else if (type === 'detail-nego') {
				this.showVendorNegotiation(this.state.tahap_nego.header.negotiation_uuid, {vendor_id: data.vendor_id}, data)
			} else {
				this.getQuotationDetail(uuid, data)
			}
		});
	}

	handleChecklistVendor = (e, payload, id) => {
		let arr_selected = this.state.tahap_nego.vendor_selected;
		if (arr_selected.includes(id)){
			const index = arr_selected.indexOf(id);
			if (index > -1) {
				arr_selected.splice(index, 1)
			}
		} else {
			arr_selected.push(id)
		}

		var sendObj = {
			proposal_tender_id: this.state.tahap_nego.header.id,
			vendor_id: id,
			itemize: true
		}
		
		if(arr_selected.length <= 0){
			this.setState(({ tahap_nego }) => ({
				tahap_nego: { ...tahap_nego, itemize: [], arr_itemize: [] }
			}));
		}

		this.setState(({ tahap_nego }) => ({
			tahap_nego: { ...tahap_nego, vendor_selected: arr_selected}
		}), () => this.state.tahap_nego.header.order_placement === 'itemize' && arr_selected.length > 0 && this.findQuotationVendor(sendObj, payload));
	}

	handleChecklistItem = (e, payload, uuid, send_vendors) => {
		let arr = this.state.tahap_nego.items_selected;
		let arr_itemize = this.state.tahap_nego.vendor_itemize;
		let arr_selected = this.state.tahap_nego.item_selected;
		
		if (arr_selected.includes(uuid)){
			const index = arr_selected.indexOf(uuid);
			const indexItems = arr.map((item) => { return item.uuid; }).indexOf(uuid);
			const indexItemize = arr_itemize.map((item) => { return item.uuid; }).indexOf(uuid);
			if (index > -1) { 
				arr.splice(indexItems, 1)
				arr_selected.splice(index, 1)
				arr_itemize.splice(indexItemize, 1)
			}
		} else {
			arr.push(payload);
			arr_itemize.push(send_vendors);
			arr_selected.push(uuid)
		}
	
		this.setState(({ tahap_nego }) => ({
			tahap_nego: { ...tahap_nego, items_selected: arr, item_selected: arr_selected, vendor_itemize: arr_itemize }
		}));
	}

	showStepNegotiation = async (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showStepNegotiation(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const {tender} = data;
				const setHeader = {...this.state.tahap_nego.header}
				setHeader.buyer = tender.buyer;

				setHeader.on_process = resp.data.data.on_process;
				setHeader.ambang_batas = tender.ambang_batas;
				setHeader.approved_at = tender.approved_at;
				setHeader.bid_bond = tender.bid_bond;
				setHeader.bid_bond_value = tender.bid_bond_value;
				setHeader.bobot_komersil = tender.bobot_komersil;
				setHeader.bobot_teknis = tender.bobot_teknis;
				setHeader.created_at = tender.created_at;
				setHeader.created_by = tender.created_by;
				setHeader.delivery_location = tender.delivery_location;
				setHeader.delivery_time = tender.delivery_time;
				setHeader.id = tender.id;
				setHeader.incoterm_id = tender.incoterm_id;
				setHeader.lingkup_pekerjaan = tender.lingkup_pekerjaan;
				setHeader.masa_berlaku = tender.masa_berlaku;
				setHeader.metode_aanwijzing_id = tender.metode_aanwijzing_id;
				setHeader.metode_evaluasi = tender.metode_evaluasi;
				setHeader.metode_negosiasi = tender.metode_negosiasi;
				setHeader.metode_pengadaan_id = tender.metode_pengadaan_id;
				setHeader.metode_penyampaian_id = tender.metode_penyampaian_id;
				setHeader.multiwinner = tender.multiwinner;
				setHeader.note_external = tender.note_external;
				setHeader.note_internal = tender.note_internal;
				setHeader.number = tender.number;
				setHeader.order_placement = tender.order_placement;
				setHeader.pra_qualification = tender.pra_qualification;
				setHeader.purchasing_group_id = tender.purchasing_group_id;
				setHeader.purchasing_org_id = tender.purchasing_org_id;
				setHeader.reference = tender.reference;
				setHeader.status = tender.status;
				setHeader.status_aanwijzing = tender.status_aanwijzing;
				setHeader.status_text = tender.status_text;
				setHeader.title = tender.title;
				setHeader.updated_at = tender.updated_at;
				setHeader.updated_by = tender.updated_by;
				setHeader.uuid = tender.uuid;
				setHeader.visibilitas_bid_open = tender.visibilitas_bid_open;
				setHeader.metode_aanwijzing = tender.metode_aanwijzing;
				setHeader.metode_pengadaan = tender.metode_pengadaan;
				setHeader.metode_penyampaian = tender.metode_penyampaian;
				setHeader.oe = tender.oe;
				setHeader.buyer_name = tender.buyer_name;
				setHeader.proposal_tender_id = tender.proposal_tender_id;
				setHeader.negotiation_uuid = data.negotiation_uuid;
				setHeader.auction_uuid = tender.auction_uuid;
				setHeader.is_retender_itemize = (tender.is_retender_itemize!==undefined) ? tender.is_retender_itemize : [] ;
				if(data.negotiation_uuid !== null){
					this.showVendorNegotiation(data.negotiation_uuid, '', null, 'get-proses');
				} 
				let sum_total_penawaran = 0;
				let sum_total_nego = 0;
				const negotiations = data.negotiation;
				const line_value = Object.values(negotiations)
				line_value.forEach((item_line, index_line) => { 
						const pr_value = Object.values(item_line)
						pr_value.forEach((item, index) => { 
							const item_value = Object.values(item)
							item_value.forEach((itemz, indexz) => { 
								const itemz_index = Object.keys(itemz)
								const itemz_value = Object.values(itemz)
								itemz_index.forEach((itemx, indexx) => {  
									itemz_value[indexx].sort((a,b) => (a.purchasing_requisition_service_id!==null)-(b.purchasing_requisition_service_id!==null))
									const isServices = itemz_value[indexx].length > 1;
									if(isServices){
										const sum_nego_valuation_price = this.sumArray('nego_qty', 'nego_valuation_price', itemz_value[indexx]);
										const sum_valuation_price = this.sumArray('qty', 'valuation_price', itemz_value[indexx]);
										sum_total_penawaran += sum_valuation_price;
										sum_total_nego += (parseInt(itemz_value[indexx][0].nego_valuation_price) === 0 || isNaN(itemz_value[indexx][0].nego_valuation_price)) ? sum_valuation_price : sum_nego_valuation_price;

										itemz_value[indexx][0]['nego_valuation_price'] = sum_nego_valuation_price;
										itemz_value[indexx][0]['nego_qty'] = 1;
										itemz_value[indexx][0]['valuation_price'] = sum_valuation_price;
										itemz_value[indexx][0]['qty'] = 1;
									}
								})
							})
						})
				})
				setHeader.total_penawaran = sum_total_penawaran;
				setHeader.total_nego = sum_total_nego;
				
				this.setState(({ loadings, tahap_nego }) => ({ 
					loadings: { ...loadings, button: false, pages: false },
					tahap_nego : {
							...tahap_nego,
							errors: [],
							items: tender.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
							vendors: data.vendor_list,
							negotiations: data.negotiation,
							header: setHeader,
							evaluations: tender.evaluations
					}
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	showVendorNegotiation = async (uuid, params, dt, type) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showVendorNegotiation(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const setHeader = {...this.state.tahap_nego.tempConfig}
				if(type === 'get-proses'){
					setHeader.created_at = data.created_at;
					setHeader.created_by = data.created_by;
					setHeader.end_date = data.end_date;
					setHeader.end_time = data.end_time;
					setHeader.id = data.id;
					setHeader.proposal_tender_id = data.proposal_tender_id;
					setHeader.start_date = data.start_date;
					setHeader.start_time = data.start_time;
					setHeader.status = data.status;
					setHeader.tipe = data.tipe;
					setHeader.updated_at = data.updated_at;
					setHeader.updated_by = data.updated_by;
					setHeader.uuid = data.uuid;
					setHeader.current = data.current;
					setHeader.vendor_list = data.vendor_list;
					setHeader.documents = data.documents;
				}

				const {proposal_tender} = data;
				const setHeaderProses = {...this.state.proses_nego_vendor.header}
				const setDataTemp = {...this.state.proses_nego_vendor.dataTemp}
				setDataTemp.created_at = data.created_at;
				setDataTemp.created_by = data.created_by;
				setDataTemp.end_date = data.end_date;
				setDataTemp.end_time = data.end_time;
				setDataTemp.id = data.id;
				setDataTemp.proposal_tender_id = data.proposal_tender_id;
				setDataTemp.start_date = data.start_date;
				setDataTemp.start_time = data.start_time;
				setDataTemp.status_nego = data.status;
				setDataTemp.tipe = data.tipe;
				setDataTemp.updated_at = data.updated_at;
				setDataTemp.updated_by = data.updated_by;
				setDataTemp.uuid = data.uuid;
				setDataTemp.current = data.current;
				setDataTemp.status = data.status;

				setHeaderProses.current = data.current;
				setHeaderProses.ambang_batas = proposal_tender.ambang_batas;
				setHeaderProses.approved_at = proposal_tender.approved_at;
				setHeaderProses.bid_bond = proposal_tender.bid_bond;
				setHeaderProses.bid_bond_value = proposal_tender.bid_bond_value;
				setHeaderProses.bobot_komersil = proposal_tender.bobot_komersil;
				setHeaderProses.bobot_teknis = proposal_tender.bobot_teknis;
				setHeaderProses.created_at = proposal_tender.created_at;
				setHeaderProses.created_by = proposal_tender.created_by;
				setHeaderProses.delivery_location = proposal_tender.delivery_location;
				setHeaderProses.delivery_time = proposal_tender.delivery_time;
				setHeaderProses.id = proposal_tender.id;
				setHeaderProses.incoterm_id = proposal_tender.incoterm_id;
				setHeaderProses.lingkup_pekerjaan = proposal_tender.lingkup_pekerjaan;
				setHeaderProses.masa_berlaku = proposal_tender.masa_berlaku;
				setHeaderProses.metode_aanwijzing_id = proposal_tender.metode_aanwijzing_id;
				setHeaderProses.metode_evaluasi = proposal_tender.metode_evaluasi;
				setHeaderProses.metode_negosiasi = proposal_tender.metode_negosiasi;
				setHeaderProses.metode_pengadaan_id = proposal_tender.metode_pengadaan_id;
				setHeaderProses.metode_penyampaian_id = proposal_tender.metode_penyampaian_id;
				setHeaderProses.multiwinner = proposal_tender.multiwinner;
				setHeaderProses.note_external = proposal_tender.note_external;
				setHeaderProses.note_internal = proposal_tender.note_internal;
				setHeaderProses.number = proposal_tender.number;
				setHeaderProses.order_placement = proposal_tender.order_placement;
				setHeaderProses.pra_qualification = proposal_tender.pra_qualification;
				setHeaderProses.purchasing_group_id = proposal_tender.purchasing_group_id;
				setHeaderProses.purchasing_org_id = proposal_tender.purchasing_org_id;
				setHeaderProses.reference = proposal_tender.reference;
				setHeaderProses.status = proposal_tender.status;
				setHeaderProses.status_aanwijzing = proposal_tender.status_aanwijzing;
				setHeaderProses.status_text = proposal_tender.status_text;
				setHeaderProses.title = proposal_tender.title;
				setHeaderProses.updated_at = proposal_tender.updated_at;
				setHeaderProses.updated_by = proposal_tender.updated_by;
				setHeaderProses.uuid = proposal_tender.uuid;
				setHeaderProses.visibilitas_bid_open = proposal_tender.visibilitas_bid_open;
				setHeaderProses.metode_aanwijzing = proposal_tender.metode_aanwijzing;
				setHeaderProses.metode_pengadaan = proposal_tender.metode_pengadaan;
				setHeaderProses.metode_penyampaian = proposal_tender.metode_penyampaian;
				
				if(type !== 'get-proses' && data.histories.length <= 0){
					toastr.warning("Data Histori Kosong", "Vendor Belum Di Nego");
				}

				let arrDoc = this.state.tahap_nego.attachments_persyaratan
				if(type==="get-proses"){
					data.documents.forEach((element,i)=>{
						arrDoc.push(element)
					})
				}

				this.setState(({ loadings, tahap_nego, proses_nego_vendor }) => ({ 
					detailNego: true,
					dataDetailNego: {
						id: dt?.vendor_id,
						name: dt?.vendor_name,
					},
					loadings: { ...loadings, button: false, pages: false },
					tahap_nego : {
							...tahap_nego,
							errors: [],
							tempConfig: setHeader,
							attachments_persyaratan: arrDoc
					},
					proses_nego_vendor : {
						...proses_nego_vendor,
						errors: [],
						items: data.items,
						proposal_tender_items: data.proposal_tender_items,
						quotation_items: data.quotation_items,
						documents: data.documents,
						vendor_documents: data.vendor_documents,
						histories: data.histories,
						header: setHeaderProses,
						dataTemp: setDataTemp
					}
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}
	
	getQuotationDetail = async (uuid, data) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: true, button: true }, quotation_detail: [] }));
		setTimeout(() => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false }, quotation_detail: data }));
		}, 1000)
	}

	renderModalBody(param) {
		switch(param) {
			case 'dokumen-vendor':
				return <DocumentVendor
									data={this.state.param_modal}
									loading_lampiran={this.state.loading_lampiran}
									data_lampiran={this.state.data_lampiran}
									vendor_documents={this.state.vendor_documents}
									documents={this.state.documents}
									toggleClose={this.toggleClose}
								/>
			case 'detail-item':
				return <DetailItem
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleClose}
								/>;
			case 'retender':
				return <FormRetender
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleClose}
									saveRetender={this.saveRetender} 
									upload={this.props.fileUpload}
								/>;
			case 'batal-tender':
				return <FormRetender
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleClose}
									saveRetender={this.saveRetender} 
									upload={this.props.fileUpload}
								/>;
			case 'evaluasi_oe':
				return <EvaluasiOE
									parentState={this.state}
									parentProps={this.props}
									handleChecklistItem={this.handleChecklistItem}
									saveEvaluasiOE={this.saveEvaluasiOE}
									toggleClose={this.toggleClose}
								/>;
			case 'detail-nego':
				return <DetailNego
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleClose}
								/>;
			default:
				return <DetailItem
									parentState={this.state}
									parentProps={this.props}
									toggleClose={this.toggleClose}
								/>;
		}
	}

	renderModalHeader(param) {
			switch(param) {
				case 'dokumen-vendor':
					return <ModalHeader toggle={() => this.toggleClose()}>Dokumen Vendor</ModalHeader>;
				case 'detail-item':
					return <ModalHeader toggle={() => this.toggleClose()}>Detail Item Penawaran</ModalHeader>;
				case 'retender':
					return <ModalHeader toggle={() => this.toggleClose()}>Retender {this.state.tahap_nego.header.number}</ModalHeader>;
				case 'batal-tender':
					return <ModalHeader toggle={() => this.toggleClose()}>Batal Tender {this.state.tahap_nego.header.number}</ModalHeader>;
				case 'evaluasi_oe':
					return <ModalHeader toggle={() => this.toggleClose()}>Evaluasi OE {this.state.tahap_nego.header.number}</ModalHeader>;
				case 'detail-nego':
					return <ModalHeader toggle={() => this.toggleClose()}>Detail Nego </ModalHeader>;
				default:
					return <ModalHeader toggle={() => this.toggleClose()}>Detail Item Penawaran</ModalHeader>;
			}
	}

	showVendorAttachment = async (uuid, params) => {
		if(this._isMounted){
			// this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showVendorNegotiation(uuid, {vendor_id: params.vendor_id})
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({ loadings }) => ({ 
					loadings: { ...loadings, modal: false },
					loading_lampiran: false, 
					vendor_documents: data.vendor_documents,
					documents: data.documents,
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchLampiranAwarding = async (payload) => {
		if (this._isMounted) {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: true }, param_modal: payload }));
			this.props.fetchLampiranAwarding({ vendor_id: payload.vendor_id, proposal_tender_id: this.state.tahap_nego.header.id })
			.then((resp) => {
					let datas = resp.data.data.lampiran;
					
					this.setState(({ loadings }) => ({ 
						// loadings: { ...loadings, modal: false },
						// loading_lampiran: false, 
						data_lampiran: datas
					}), () => {
						if(this.state.tahap_nego.header.negotiation_uuid !== null){
							this.showVendorAttachment(this.state.tahap_nego.header.negotiation_uuid, payload);
						} else {
							this.setState(({ loadings }) => ({ 
								loadings: { ...loadings, modal: false },
								loading_lampiran: false, 
							}));
						}
					});
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false } }));
				toastr.error(resp.data.message);;
			});
		}
	}

	findQuotationVendor = async (payload, vendors) => {
		if (this._isMounted) {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true, itemize: true } }));
			let arr_selected = this.state.tahap_nego.itemize;
			const indx = arr_selected.findIndex(v => v.vendor_id === vendors.vendor_id);
			if (indx > -1){
				arr_selected.splice(indx, indx >= 0 ? 1 : 0);
			} else {
				this.props.findQuotationVendor(payload)
				.then((resp) => {
						let datas = resp.data.data;
						const obj = {
							vendor_id: vendors.vendor_id,
							vendor_name: vendors.vendor_name,
							items: datas.data
						}
						arr_selected.push(obj);
				})
				.catch((resp) => {
					toastr.error(resp.data.message);
				});
			}
			setTimeout(() => {
				this.setState(({ loadings, tahap_nego }) => ({ 
					loadings: { ...loadings, button: false, itemize: false },
					tahap_nego : { ...tahap_nego, itemize: arr_selected } 
				}));
			}, 1000)
		}
	}

	setSendData = (datas) => {
		const arr = [...this.state.tahap_nego.vendor_selected]
		let uniqueVendors = [...new Set(arr)];
		uniqueVendors.length > 1 ? datas.header.tipe = 2 : datas.header.tipe = 1;
		let get_vendor_paket = [];
		let get_vendor_itemize = [];
		if(uniqueVendors.length > 0){ uniqueVendors.forEach(i => { get_vendor_paket.push({ id: i }) }) }
		if(this.state.tahap_nego.vendor_itemize.length > 0){ this.state.tahap_nego.vendor_itemize.forEach(i => { get_vendor_itemize.push({ id: i.id, proposal_tender_item_id: i.proposal_tender_item_id }) }) }
		const obj = {
			header: datas.header,
			documents: (datas.documents !== undefined) ? datas.documents : [],
			items: this.state.tahap_nego.items_selected,
			vendors: (this.state.tahap_nego.header.order_placement === 'itemize') ? get_vendor_itemize : get_vendor_paket,
		}
		this.saveNegotiation(obj)
	}

	saveNegotiation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveNegotiation(params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, tahap_nego }) => ({ 
					sendData: {},
					loadings: { ...loadings, button: false },
					tahap_nego : { ...tahap_nego, errors: [] }
				}));
				this.props.history.push(`/tendering/negotiation`)
			})
			.catch((resp) => {
				this.setState(({ loadings, tahap_nego }) => ({ 
					loadings: { ...loadings, button: false },
					tahap_nego : { ...tahap_nego, errors: resp.data.errors }
				}));
				const errors = resp.data.errors;
				if(errors){
					var msg = (typeof errors === 'object') ? Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> }) : <li>{errors}</li>;
					const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
					toastr.error(resp.data.message, toastr_msg);
				} else {
					toastr.error(resp.data.status, resp.data.message);
				}
			});
		}
	}

	saveRetender = (payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.saveRetender(payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, modalOpen: false }));
			this.props.history.push(`/tendering/monitoring-tender-buyer/detail/`+this.state.paramId)
		})
		.catch((resp) => {
			this.setState(({ loadings, tahap_nego }) => ({ loadings: { ...loadings, button: false }, tahap_nego: { ...tahap_nego, errors: resp.data.errors} }));
			const errors = resp.data.errors;
			if(errors){
				var msg = (typeof errors === 'object') ? Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> }) : <li>{errors}</li>;
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				toastr.error(resp.data.message, toastr_msg);
			} else {
				toastr.error(resp.data.status, resp.data.message);
			}
		});
	}

	downloadBidTabulation = (nego_uuid) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.downloadBidTabulation(nego_uuid)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `RESUME_BID_TABULATION.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
		})
		.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
				toastr.error(resp.data.message);
		});
	}

	configAuction = (auction_uuid) => {
		this.props.history.push(`/auction/parameter-auction/`+this.state.tahap_nego.header.auction_uuid)
	}

	createAuction = () => {
		this.setState({ isConfirm: true });
	}

	createAuctionData = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		console.log(this.state.paramId)
		this.props.createAuction(this.state.paramId)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }}));
			this.props.history.push(`/auction/parameter-auction/`+resp.data.data.uuid)
		})
		.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
				toastr.error(resp.data.message);
		});
	}

	saveEvaluasiOE = (payload) => {
		const params = {
			items: payload,
			header: {
				tipe: "1",
				status: "evaluasi_oe",
				proposal_tender_id: this.state.tahap_nego.header.id
			}
		}
		this.saveNegotiation(params)
	}

	toggleSweetAlert(name) {
        if (this._isMounted) {
            switch (name) {
                case 'confirm':
                    this.setState({ isConfirm: false });
                    this.createAuctionData();
                    break;
                case 'cancel':
                    this.setState({ isConfirm: false });
                    break;
                default:
                    break;
            }
        }
    }


  render(){
		const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Tahap Nego Detail</li>
				</ol>
				<h1 className="page-header">Tahap Nego Detail </h1>
				<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						addLampiranTerm={this.addLampiranTerm}
						deleteLampiranTerm={this.deleteLampiranTerm}
						saveNegotiation={this.saveNegotiation}
						toggleDetailItem={this.toggleOpen}
						toggleOpenDokumenVendor={this.toggleOpen}
						toggleOpenRetender={this.toggleOpen}
						handleChecklistVendor={this.handleChecklistVendor}
						handleChecklistItem={this.handleChecklistItem}
						setSendData={this.setSendData}
						setMethodType={this.setMethodType}
						downloadBidTabulation={this.downloadBidTabulation}
						configAuction={this.configAuction}
						createAuction={this.createAuction}
					/>
					<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-xl">
						{this.renderModalHeader(this.state.modalType)}
						{this.state.loadings.modal && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.loadings.modal && this.renderModalBody(this.state.modalType)}
					</Modal>

					{(this.state.isConfirm &&
                    <SweetAlert
                        warning
                        showCancel
                        confirmBtnText={t("common:delete.create-auction")}
                        cancelBtnText={t("common:delete.cancel")}
                        confirmBtnBsStyle="success"
                        cancelBtnBsStyle="default"
                        title={t("common:delete.title-create-auction")}
                        onConfirm={() => this.toggleSweetAlert('confirm')}
                        onCancel={() => this.toggleSweetAlert('cancel')}
                    >
                    </SweetAlert>
                )}
					
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
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		showStepNegotiation: (uuid, params) => dispatch(showStepNegotiation(uuid, params)),
		showVendorNegotiation: (uuid, params) => dispatch(showVendorNegotiation(uuid, params)),
		saveNegotiation: (params) => dispatch(saveNegotiation(params)),
		fetchLampiranAwarding: (params) => dispatch(fetchLampiranAwarding(params)),
		findQuotationVendor: (params) => dispatch(findQuotationVendor(params)),
		saveRetender: (params) => dispatch(saveRetender(params)),
		downloadBidTabulation: (uuid) => dispatch(downloadBidTabulation(uuid)),
		createAuction : (uuid) => dispatch(createAuction(uuid))
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TahapNegoDetail));