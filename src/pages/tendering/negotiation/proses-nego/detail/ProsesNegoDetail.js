import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import { showVendorNegotiation, saveBuyerNegotiation, downloadBAHN } from '../../../../../store/actions/tendering/negotiationActions';
import Form from './Form';
import DetailNego from '../modal/DetailNego';
// import datax from '../tahap-nego.json'

class ProsesNegoDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			datas: [],
			modalOpen: false,
			detailNego: true,
			dataDetailNego: {},
			uuid: '',
			paramId: this.props.location.pathname.split("/")[4],
			isRole: this.props.user.has_roles.includes("VNDR01") ? 'vendor' : 'buyer',
			tempData: {},
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
			this.showVendorNegotiation(this.state.paramId)
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
		this.setState({ modalOpen: false, dataDetailNego: {} }, () => this.showVendorNegotiation(this.state.paramId))
	}

	toggleDetailItem = (dataDetailNego, vendor_id) => {
		this.setState({ modalOpen: true, dataDetailNego: dataDetailNego });
		this.showVendorNegotiation(this.state.paramId, {vendor_id: vendor_id})
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
				setDataTemp.status = data.status;
				setDataTemp.tipe = data.tipe;
				setDataTemp.updated_at = data.updated_at;
				setDataTemp.updated_by = data.updated_by;
				setDataTemp.uuid = data.uuid;
				setDataTemp.current = data.current;
				
				setHeader.current = data.current;
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
				const arrItems = []
				let arrQuoteItems = []
				arrItems.push(data.items);
				if(data.quotation_items && data.quotation_items.length > 0){
					const unique = [...new Set(data.quotation_items.map(item => item.purchasing_requisition_item_id))];
					unique.forEach((item, i) => {
						const filters = data.quotation_items.filter(dt => dt.purchasing_requisition_item_id === item);
						arrQuoteItems.push(filters[0])
					})
				}
				this.setLastHistory(data.histories);
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false, pages: false },
					proses_nego_vendor : {
							...proses_nego_vendor,
							errors: [],
							items: data.items,
							proposal_tender_items: data.proposal_tender_items,
							quotation_items: arrQuoteItems,
							documents: data.documents,
							vendor_documents: data.vendor_documents,
							vendor_list: data.vendor_list,
							histories: data.histories,
							header: setHeader,
							dataTemp: setDataTemp,
							vendors: data.vendor_list
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
	
	getQuotationDetail = async (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: true, button: true } }));
			this.props.showVendorNegotiation(uuid, params)
			.then((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, modal: false, button: false } }));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	saveBuyerNegotiation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveBuyerNegotiation(this.state.proses_nego_vendor.dataTemp.uuid, params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false },
					proses_nego_vendor : { ...proses_nego_vendor, errors: [] }
				}));
				this.props.history.push(`/tendering/negotiation-process`)
			})
			.catch((resp) => {
				this.setState(({ loadings, proses_nego_vendor }) => ({ 
					loadings: { ...loadings, button: false },
					proses_nego_vendor : { ...proses_nego_vendor, errors: resp.data.errors }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	downloadBAHN = (nego_uuid, vendor_id, vendor_uuid) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.downloadBAHN(nego_uuid, vendor_id)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BAHN_${vendor_id}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
		})
		.catch((resp) => {
				this.setState({loading: false})
				let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
				toastr.error(message);
		});
	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Proses Negosiasi Detail</li>
				</ol>
				<h1 className="page-header">Proses Negosiasi Detail </h1>
				<Form
						parentState={this.state}
						isRole={this.state.isRole}
						parentProps={this.props}
						upload={this.props.fileUpload}
						addLampiranTerm={this.addLampiranTerm}
						deleteLampiranTerm={this.deleteLampiranTerm}
						saveBuyerNegotiation={this.saveBuyerNegotiation}
						toggleDetailItem={this.toggleDetailItem}
						downloadBAHN={this.downloadBAHN}
					/>
					<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleCloseDetailItem()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleCloseDetailItem()}>Detail Item Penawaran {this.state.modalType} </ModalHeader>
						{this.state.loadings.modal && <center><br/><ReactLoading type="cylon" color="#0f9e3e" /><br/></center>}
						{!this.state.loadings.modal && (
						<DetailNego
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
		saveBuyerNegotiation: (uuid, params) => dispatch(saveBuyerNegotiation(uuid, params)),
		downloadBAHN: (uuid, vendor_uuid) => dispatch(downloadBAHN(uuid, vendor_uuid)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ProsesNegoDetail));