import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import { showVendorNegotiation, saveVendorNegotiation } from '../../../../../store/actions/tendering/negotiationActions';
import Form from './Form';
import DetailItem from '../modal/DetailItem';
// import datax from '../tahap-nego.json'

class ProsesNegoVendorDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			vendor_uuid: this.props.user.has_roles.includes("VNDR01") ? this.props.user.uuid : this.props.vendor.uuid,
			vendor_id: this.props.user.has_roles.includes("VNDR01") ? this.props.user.id : this.props.vendor.id,
			vendor_username: this.props.user.has_roles.includes("VNDR01") ? this.props.user.username : this.props.vendor.username,
			isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
			isRole: this.props.user.has_roles.includes("VNDR01") ? 'vendor' : 'buyer',
			datas: [],
			modalOpen: false,
			uuid: '',
			paramId: this.props.location.pathname.split("/")[4],
			detailNego: false,
			tempData: {},
			quotation_detail: {},
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
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
					status_nego: ''
				},
				dataTemp: {},
				items: [],
				histories: [],
				last_histories: [],
				proposal_tender_items: [],
				quotation_items: [],
				documents: [],
				vendor_documents: [],
				errors: [],
			},
			loadings: {
				modal: false,
				button: false,
				pages: false,
				items: false,
				quotation_items: false,
				proposal_tender_items: false,
				documents: false,
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.showVendorNegotiation(this.state.paramId, {vendor_id: this.state.vendor_username})
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
		let arr = this.state.proses_nego_vendor.attachments_persyaratan;
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			proses_nego_vendor: {
				...prevState.proses_nego_vendor,
				attachments_persyaratan: arr
			}
		}))
	}

	deleteLampiranTerm = (payload) => {
		let data = this.state.proses_nego_vendor.attachments_persyaratan;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			proses_nego_vendor: {
				...prevState.proses_nego_vendor,
				attachments_persyaratan: arr
			}
		}))
	}

	toggleCloseDetailItem = () => {
		this.setState({ modalOpen: false, uuid: '', quotation_detail: [] })
	}

	toggleDetailItem = (uuid, data) => {
		this.setState({ modalOpen: true, uuid: uuid }, () => this.getQuotationDetail(uuid, data));
	}

	showVendorNegotiation = async (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showVendorNegotiation(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const {proposal_tender} = data;
				const setHeader = {...this.state.proses_nego_vendor.header}
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

				setHeader.ambang_batas = proposal_tender.ambang_batas;
				setHeader.approved_at = proposal_tender.approved_at;
				setHeader.bid_bond = proposal_tender.bid_bond;
				setHeader.bid_bond_value = proposal_tender.bid_bond_value;
				setHeader.bobot_komersil = proposal_tender.bobot_komersil;
				setHeader.bobot_teknis = proposal_tender.bobot_teknis;
				setHeader.created_at = proposal_tender.created_at;
				setHeader.created_by = proposal_tender.created_by;
				setHeader.delivery_location = proposal_tender.delivery_location;
				setHeader.delivery_time = proposal_tender.delivery_time;
				setHeader.id = proposal_tender.id;
				setHeader.incoterm_id = proposal_tender.incoterm_id;
				setHeader.lingkup_pekerjaan = proposal_tender.lingkup_pekerjaan;
				setHeader.masa_berlaku = proposal_tender.masa_berlaku;
				setHeader.metode_aanwijzing_id = proposal_tender.metode_aanwijzing_id;
				setHeader.metode_evaluasi = proposal_tender.metode_evaluasi;
				setHeader.metode_negosiasi = proposal_tender.metode_negosiasi;
				setHeader.metode_pengadaan_id = proposal_tender.metode_pengadaan_id;
				setHeader.metode_penyampaian_id = proposal_tender.metode_penyampaian_id;
				setHeader.multiwinner = proposal_tender.multiwinner;
				setHeader.note_external = proposal_tender.note_external;
				setHeader.note_internal = proposal_tender.note_internal;
				setHeader.number = proposal_tender.number;
				setHeader.order_placement = proposal_tender.order_placement;
				setHeader.pra_qualification = proposal_tender.pra_qualification;
				setHeader.purchasing_group_id = proposal_tender.purchasing_group_id;
				setHeader.purchasing_org_id = proposal_tender.purchasing_org_id;
				setHeader.reference = proposal_tender.reference;
				setHeader.status = proposal_tender.status;
				setHeader.status_aanwijzing = proposal_tender.status_aanwijzing;
				setHeader.status_text = proposal_tender.status_text;
				setHeader.title = proposal_tender.title;
				setHeader.updated_at = proposal_tender.updated_at;
				setHeader.updated_by = proposal_tender.updated_by;
				setHeader.uuid = proposal_tender.uuid;
				setHeader.visibilitas_bid_open = proposal_tender.visibilitas_bid_open;
				setHeader.metode_aanwijzing = proposal_tender.metode_aanwijzing;
				setHeader.metode_pengadaan = proposal_tender.metode_pengadaan;
				setHeader.metode_penyampaian = proposal_tender.metode_penyampaian;
				setHeader.note = data.note;
				this.setLastHistory(data.histories);
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false, pages: false },
					proses_nego_vendor : {
							...proses_nego_vendor,
							errors: [],
							items: data.items,
							proposal_tender_items: data.proposal_tender_items,
							quotation_items: data.quotation_items,
							documents: data.documents,
							vendor_documents: data.vendor_documents,
							histories: data.histories,
							header: setHeader,
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
	
	setLastHistory = (histories) => {
		if(histories){
			// const history_index = Object.keys(histories)
			const history_value = Object.values(histories)
			let arr_value = [];
			// console.log(history_value);
			history_value.forEach((child, index) => {
				const childs = child.sort().reverse();
				const sort_childs = childs.sort((a,b) => new Date(a.created_at)-new Date(b.created_at)).reverse();
				arr_value.push(sort_childs[0])
			})
			this.setState(({ loadings, proses_nego_vendor }) => ({ 
				loadings: { ...loadings, button: false, pages: false },
				proses_nego_vendor : {
						...proses_nego_vendor,
						last_histories: arr_value
				}
			}));
		}
	}
	
	getQuotationDetail = async (uuid, data) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: true, button: true }, quotation_detail: [] }));
		setTimeout(() => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false }, quotation_detail: data }));
		}, 1000)
		if(this._isMounted){
			// this.props.showVendorNegotiation(uuid, params)
			// .then((resp) => {
			// 	this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
			// })
			// .catch((resp) => {
			// 	this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
			// 	toastr.error(resp.data.status, resp.data.message);
			// });
		}
	}

	saveVendorNegotiation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveVendorNegotiation(this.state.paramId, params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false },
					proses_nego_vendor : { ...proses_nego_vendor, errors: [] }
				}));
				this.props.history.push(`/task-vendor/negotiation`)
			})
			.catch((resp) => {
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false },
					proses_nego_vendor : { ...proses_nego_vendor, errors: (resp.data.errors !== undefined) ? resp.data.errors : resp.data }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

  render(){
		// const {t} = this.props;
    return (
      <div id="page-nego-vendor">
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Task Vendor</li>
					<li className="breadcrumb-item active">Proses Nego Vendor Detail</li>
				</ol>
				<h1 className="page-header">Proses Nego Vendor Detail </h1>
				<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						isRole={this.state.isRole}
						addLampiranTerm={this.addLampiranTerm}
						deleteLampiranTerm={this.deleteLampiranTerm}
						saveVendorNegotiation={this.saveVendorNegotiation}
						toggleDetailItem={this.toggleDetailItem}
					/>
					<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseDetailItem()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleCloseDetailItem()}>Detail Item Penawaran {this.state.modalType} </ModalHeader>
						{this.state.loadings.modal && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.loadings.modal && (
						<DetailItem
							parentState={this.state}
							parentProps={this.props}
							toggleClose={this.toggleCloseDetailItem}
						/>)}
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
		showVendorNegotiation: (uuid, params) => dispatch(showVendorNegotiation(uuid, params)),
		saveVendorNegotiation: (uuid, params) => dispatch(saveVendorNegotiation(uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ProsesNegoVendorDetail));