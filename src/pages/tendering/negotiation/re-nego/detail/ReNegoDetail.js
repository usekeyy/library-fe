import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../../store/actions/uploadActions';
// import { saveReNegotiation } from '../../../../../store/actions/tendering/vendorRegistrationTenderActions';
import { showNegotiation, saveReNegotiation } from '../../../../../store/actions/tendering/negotiationActions';
import { fetchLampiranAwarding } from '../../../../../store/actions/tendering/awardingActions';
import Form from './Form';
import DetailItem from '../modal/DetailItem';
import DocumentVendor from '../../../awarding/detail/PemenangDetail';
// import datax from '../tahap-nego.json'

class TahapNegoDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			sendData: {},
			modalOpen: false,
			modalType: '',
			uuid: '',
			paramId: this.props.location.pathname.split("/")[4],
			quotation_detail: [],
			loading_lampiran: false,
			data_lampiran: [],
			param_modal: [],
			re_nego: {
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
					oe: '',
					buyer_name: '',
					start_date: '',
					start_time: '',
					end_date: '',
					end_time: '',
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
				},
				items: [],
				schedules: [],
				negotiations: [],
				terms: [],
				errors: [],
				attachments_persyaratan: [],
				vendors: [],
				vendor_selected: [],
				item_selected: [],
				items_selected: [],
			},
			loadings: {
				modal: false,
				button: false,
				pages: false,
				items: false
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.showNegotiation(this.state.paramId)
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	addLampiranTerm = (payload) => {
		let arr = this.state.re_nego.attachments_persyaratan;
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			re_nego: {
				...prevState.re_nego,
				attachments_persyaratan: arr
			}
		}))
	}

	deleteLampiranTerm = (payload) => {
		let data = this.state.re_nego.attachments_persyaratan;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			re_nego: {
				...prevState.re_nego,
				attachments_persyaratan: arr
			}
		}))
	}

	toggleClose = () => {
		this.setState({ modalOpen: false, uuid: '', modalType: '', quotation_detail: [] })
	}

	toggleOpen = (uuid, data, type) => {
		console.log(type);
		this.setState({ modalType: type, modalOpen: true, uuid: uuid }, () => {
			if(type === 'dokumen-vendor'){
				this.fetchLampiranAwarding(data)
			} else {
				this.getQuotationDetail(uuid, data)
			}
		});
	}

	handleChecklistVendor = (e, payload, id) => {
		let arr_selected = this.state.re_nego.vendor_selected;
		if (arr_selected.includes(id)){
			const index = arr_selected.indexOf(id);
			if (index > -1) {
				arr_selected.splice(index, 1)
			}
		} else {
			arr_selected.push(id)
		}
	
		this.setState(({ re_nego }) => ({
			re_nego: { ...re_nego, vendor_selected: arr_selected}
		}));
	}

	handleChecklistItem = (e, payload, uuid) => {
		let arr = this.state.re_nego.items_selected;
		let arr_selected = this.state.re_nego.item_selected;
		if (arr_selected.includes(uuid)){
			const index = arr_selected.indexOf(uuid);
			const indexItems = arr.map((item) => { return item.uuid; }).indexOf(uuid);
			if (index > -1) { 
				arr.splice(indexItems, 1)
				arr_selected.splice(index, 1)
			}
		} else {
			arr.push(payload);
			arr_selected.push(uuid)
		}
	
		this.setState(({ re_nego }) => ({
			re_nego: { ...re_nego, items_selected: arr, item_selected: arr_selected }
		}));
	}

	fetchLampiranAwarding = async (payload) => {
		if (this._isMounted) {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: true }, param_modal: payload }));
			this.props.fetchLampiranAwarding({ vendor_id: payload.vendor_id, proposal_tender_id: this.state.re_nego.header.proposal_tender_id })
			.then((resp) => {
					let datas = resp.data.data.lampiran;
					this.setState(({ loadings }) => ({ 
						loadings: { ...loadings, modal: false },
						loading_lampiran: false, data_lampiran: datas
					}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false } }));
					toastr.error(resp.data.message);;
			});
		}
	}

	renderModalBody(param) {
		switch(param) {
			case 'dokumen-vendor':
				return <DocumentVendor
									data={this.state.param_modal}
									loading_lampiran={this.state.loading_lampiran}
									data_lampiran={this.state.data_lampiran}
									toggleClose={this.toggleClose}
								/>
			case 'detail-item':
				return <DetailItem
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
				default:
					return <ModalHeader toggle={() => this.toggleClose()}>Detail Item Penawaran</ModalHeader>;
			}
	}

	showNegotiation = async (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showNegotiation(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const tender = data.proposal_tender;
				const setHeader = {...this.state.re_nego.header}
				setHeader.buyer = tender.buyer;
				setHeader.bobot_teknis = tender.bobot_teknis;
				setHeader.bobot_komersil = tender.bobot_komersil;
				setHeader.grade_teknis = tender.grade_teknis;
				setHeader.grade_total = tender.grade_total;

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
				setHeader.start_date = data.start_date;
				setHeader.start_time = data.start_time;
				setHeader.end_date = data.end_date;
				setHeader.end_time = data.end_time;
				setHeader.proposal_tender_id = data.proposal_tender_id;

				this.setState(({ loadings, re_nego }) => ({ 
					loadings: { ...loadings, button: false, pages: false },
					re_nego : {
							...re_nego,
							errors: [],
							items: data.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
							vendors: data.quotation_items,
							// 	: data.negotiation,
							attachments_persyaratan: data.documents,
							header: setHeader
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
		if(this._isMounted){
			// this.props.showNegotiation('1944f32b-ecc7-4e0a-a946-c55be8cbdaf4', params)
			// .then((resp) => {
			// 	this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
			// })
			// .catch((resp) => {
			// 	this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
			// 	toastr.error(resp.data.status, resp.data.message);
			// });
		}
	}

	setSendData = (datas) => {
		const arr = [...this.state.re_nego.vendor_selected]
		let uniqueVendors = [...new Set(arr)];
		uniqueVendors.length > 1 ? datas.header.tipe = 2 : datas.header.tipe = 1;
		const obj = {
			// header: datas.header,
			// documents: (datas.documents !== undefined) ? datas.documents : [],
			// items: this.state.re_nego.items_selected,
			action: 'nego',
			vendors: uniqueVendors
		}
		// if(this.state.re_nego.header.order_placement !== 'itemize') { delete obj.items }
		this.saveReNegotiation(obj)
		// this.setState({ sendData: obj }, () => this.saveReNegotiation(this.state.sendData))
	}

	saveReNegotiation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveReNegotiation(this.state.paramId, params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, re_nego }) => ({ 
					sendData: {},
					loadings: { ...loadings, button: false },
					re_nego : { ...re_nego, errors: [] }
				}));
				this.props.history.push(`/tendering/re-negotiation`)
			})
			.catch((resp) => {
				this.setState(({ loadings, re_nego }) => ({ 
					loadings: { ...loadings, button: false },
					re_nego : { ...re_nego, errors: resp.data.errors }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Re Nego Detail</li>
				</ol>
				<h1 className="page-header">Re Nego Detail </h1>
				<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						addLampiranTerm={this.addLampiranTerm}
						deleteLampiranTerm={this.deleteLampiranTerm}
						saveNegotiation={this.saveReNegotiation}
						toggleDetailItem={this.toggleOpen}
						handleChecklistVendor={this.handleChecklistVendor}
						handleChecklistItem={this.handleChecklistItem}
						setSendData={this.setSendData}
						toggleOpenDokumenVendor={this.toggleOpen}
					/>
					<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
						{this.renderModalHeader(this.state.modalType)}
						{this.state.loadings.modal && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.loadings.modal && this.renderModalBody(this.state.modalType)}
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
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		showNegotiation: (uuid, params) => dispatch(showNegotiation(uuid, params)),
		saveReNegotiation: (uuid, params) => dispatch(saveReNegotiation(uuid, params)),
		fetchLampiranAwarding: (params) => dispatch(fetchLampiranAwarding(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (TahapNegoDetail));