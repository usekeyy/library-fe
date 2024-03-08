import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
// import { Modal, ModalHeader } from 'reactstrap';
// import ReactLoading from 'react-loading';
import { fileUpload } from '../../../../store/actions/uploadActions';
import { fetchIncoterms } from '../../../../store/actions/master/incotermsActions';
import { getProposalTender } from '../../../../store/actions/tendering/proposalTenderActions';
import { getPenawaranTerkirimVendorQuotation, submitVendorQuotation, updateVendorQuotation } from '../../../../store/actions/tendering/quotationActions';
import Form from './Form';
// import PaktaIntegritas from '../modal/PaktaIntegritas';

class QuotationDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			paramId: this.props.location.pathname.split("/")[4],
			paramType: this.props.location.pathname.split("/")[3],
			modalOpen: false,
			sendData: {},
			tempData: {},
			pakta_integritas: {
				sendData: {
					status_approval: '',
				},
			},
			quotation: {
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
					metode_aanwijzing: '',
					metode_pengadaan: '',
					metode_penyampaian: '',
					multiwinner: '',
					note_external: '',
					note_internal: '',
					number: '',
					order_placement: '',
					pra_qualification: '',
					purchasing_group_id: '',
					purchasing_org_id: '',
					purchasing_org_name: '',
					reference: '',
					status: '',
					status_aanwijzing: '',
					status_text: '',
					title: '',
					updated_at: '',
					updated_by: '',
					uuid: '',
					visibilitas_bid_open: '',
				},
				attachments: [],
				items: [],
				schedules: [],
				terms: [],
				errors: [],
				m_incoterm: [],
				tempQuotes: []
			},
			loadings: {
				button: false,
				modal: false,
				pages: false,
				items: false,
				incoterm: false,
				buttonUpload: false,
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.getProposalTender(this.state.paramId)
			this.fetchIncoterms('')
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	fetchIncoterms = (params) => {
		if(this._isMounted){
			let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
			this.setState(({ loadings, quotation }) => ({
				loadings: { ...loadings, incoterm: true },
				quotation: { ...quotation, m_incoterm: [] }
			}));
			this.props.fetchIncoterms(select_params)
			.then((resp) => {
				let m_incoterm = resp.data.data;
				let options = m_incoterm.map((dt) => {
					return { value: dt.id, label: dt.id+' - '+dt.name };
				})
				this.setState(({ loadings, quotation }) => ({
					loadings: { ...loadings, incoterm: false },
					quotation: { ...quotation, m_incoterm: options }
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, quotation }) => ({
					loadings: { ...loadings, incoterm: false },
					quotation: { ...quotation, m_incoterm: [] }
				}));
				toastr.error("Failed Load Data", "incoterm")
			});
		}
	}

	getProposalTender = (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, items: true, button: true } }));
			this.props.getProposalTender(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const setHeader = {...this.state.quotation.header}
				setHeader.ambang_batas = data.ambang_batas;
				setHeader.approved_at = data.approved_at;
				setHeader.bid_bond = data.bid_bond;
				setHeader.bid_bond_value = data.bid_bond_value;
				setHeader.bobot_komersil = data.bobot_komersil;
				setHeader.bobot_teknis = data.bobot_teknis;
				setHeader.created_at = data.created_at;
				setHeader.created_by = data.created_by;
				setHeader.delivery_location = data.delivery_location;
				setHeader.delivery_time = data.delivery_time;
				setHeader.id = data.id;
				setHeader.incoterm_id = data.incoterm_id;
				setHeader.lingkup_pekerjaan = data.lingkup_pekerjaan;
				setHeader.masa_berlaku = data.masa_berlaku;
				setHeader.metode_aanwijzing_id = data.metode_aanwijzing_id;
				setHeader.metode_evaluasi = data.metode_evaluasi;
				setHeader.metode_negosiasi = data.metode_negosiasi;
				setHeader.metode_pengadaan_id = data.metode_pengadaan_id;
				setHeader.metode_penyampaian_id = data.metode_penyampaian_id;
				setHeader.multiwinner = data.multiwinner;
				setHeader.note_external = data.note_external;
				setHeader.note_internal = data.note_internal;
				setHeader.number = data.number;
				setHeader.order_placement = data.order_placement;
				setHeader.pra_qualification = data.pra_qualification;
				setHeader.purchasing_group_id = data.purchasing_group_id;
				setHeader.purchasing_org_id = data.purchasing_org_id;
				setHeader.purchasing_org_name = data.purchasing_org_name;
				setHeader.reference = data.reference;
				setHeader.status = data.status;
				setHeader.status_aanwijzing = data.status_aanwijzing;
				setHeader.status_text = data.status_text;
				setHeader.title = data.title;
				setHeader.updated_at = data.updated_at;
				setHeader.updated_by = data.updated_by;
				setHeader.uuid = data.uuid;
				setHeader.visibilitas_bid_open = data.visibilitas_bid_open;
				setHeader.metode_aanwijzing = data.metode_aanwijzing;
				setHeader.metode_pengadaan = data.metode_pengadaan;
				setHeader.metode_penyampaian = data.metode_penyampaian;

				let arr = [];
				if(data.items.length > 0){
					data.items.sort((a,b) => a.proposal_tender_item_id-b.proposal_tender_item_id).sort((a,b) => a.purchasing_requisition_item_id-b.purchasing_requisition_item_id).forEach((item, key) => {
						const obj = {
							id: item.pr_item_id,
							value: '',
							child: (item.service_lines && item.service_lines.length > 0) ? 
								item.service_lines.map(child => {
									return {
										id: child.purchasing_requisition_item_id,
										uuid: child.uuid,
										value: ''
									}
								})
							: []
						}
						arr.push(obj)
					})
				}

				this.setState(({ loadings, quotation }) => ({ 
					loadings: { ...loadings, button: false, items: false },
					quotation : {
							...quotation,
							errors: [],
							items: data.items.sort((a,b) => a.proposal_tender_item_id-b.proposal_tender_item_id).sort((a,b) => a.purchasing_requisition_item_id-b.purchasing_requisition_item_id),
							schedules: data.schedules,
							terms: data.terms,
							attachments: data.attachments,
							header: setHeader,
							tempQuotes: arr
					}
				}), () => {
					// if(this.state.paramType === 'update'){
						this.getPenawaranTerkirimVendorQuotation(this.state.paramId)
					// }
				});
				
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, items: false, button: false } }));
				// toastr.error(resp.data.status, resp.data.message);
				toastr.error('error');
			});
		}
	}

	getPenawaranTerkirimVendorQuotation = (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true, items: true } }));
			this.props.getPenawaranTerkirimVendorQuotation(uuid, params)
			.then((resp) => {
				let arr = [];
				let arr_quotes = [];
				toastr.success(resp.data.status, resp.data.message);
				const data = resp.data.data;
				if(data.items.length > 0){
					data.items.sort((a,b) => a.proposal_tender_item_id-b.proposal_tender_item_id).sort((a,b) => a.purchasing_requisition_item_id-b.purchasing_requisition_item_id).forEach((item, key) => {
						// const pt_items = this.state.quotation.items.filter( i => i.pr_item_id === item.purchasing_requisition_item_id)
						const obj = {
							created_at: item.created_at,
							created_by: item.created_by,
							delivery_time: item.delivery_time,
							id: item.id,
							proposal_tender_item_id: item.proposal_tender_item_id,
							purchasing_requisition_item_id: item.purchasing_requisition_item_id,
							proposal_tender_item_uuid: item.proposal_tender_item_uuid,
							qty: item.qty,
							quotation_id: item.quotation_id,
							quote: item.quote,
							remark: item.remark,
							long_text: item.spesifikasi,
							short_text: item.short_text,
							uom: item.uom,
							status: item.status,
							updated_at: item.updated_at,
							updated_by: item.updated_by,
							uuid: item.uuid,
							valuation_price: item.valuation_price,
							service_lines: item.services_lines !== undefined ? item.services_lines.length > 0 ? item.services_lines : [] : [],
							tipe: item.services_lines !== undefined ? item.services_lines.length > 0 ? 'jasa' : 'barang' : 'barang',
						}
						arr.push(obj)
						const objQuote = {
							id: item.purchasing_requisition_item_id,
							value: item.quote,
							child: item.services_lines !== undefined ? 
								item.services_lines.length > 0 ?
									item.services_lines.map(child => {
										return {
											id: child.purchasing_requisition_item_id,
											uuid: child.uuid,
											value: item.quote
										}
									})
								: [] 
							: []
						}
						arr_quotes.push(objQuote)
					})
				}
				
				this.setState(({ loadings, tempData, quotation }) => ({ 
					loadings: { ...loadings, button: false, items: false },
					quotation : {
						...quotation,
						tempQuotes: arr_quotes
					},
					tempData : {
							...tempData,
							errors: [],
							bidbond: data.bidbond,
							bidbond_file: data.bidbond_file,
							bidbond_validity: data.bidbond_validity,
							date: data.date,
							location: data.location,
							note: data.note,
							number: data.number,
							validity: data.validity,
							incoterm_id: {value: data.incoterm_id, label: `${data.incoterm_id} - ${data.incoterm_name}`},
							items: arr.sort((a,b) => a.proposal_tender_item_id-b.proposal_tender_item_id).sort((a,b) => a.purchasing_requisition_item_id-b.purchasing_requisition_item_id),
							terms: data.attachments,
					}
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings,  button: false }, sendData: {} }));
				toastr.error(resp.data.status, resp.data.message);
				this.props.history.push(`/task-vendor/penawaran-terkirim`)
			});
		}
	}

	submitVendorQuotation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
			this.props.submitVendorQuotation(this.state.paramId, params)
			.then((resp) => {
				toastr.success(resp.data.status, resp.data.message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings,  button: false }, modalOpen: false, sendData: {} }));
				this.props.history.push(`/task-vendor/quotation`)
			})
			.catch((resp) => {
				this.setState(({ loadings, quotation }) => (
					{ 
						loadings: { ...loadings, button: false, errors: resp.data.errors },
						quotation: { ...quotation, errors: resp.data.errors },
						modalOpen: false, 
						sendData: {}
					}
				));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	updateVendorQuotation = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
			this.props.updateVendorQuotation(this.state.paramId, params)
			.then((resp) => {
				toastr.success(resp.data.status, resp.data.message);
				this.setState(({ loadings }) => ({ loadings: { ...loadings,  button: false }, modalOpen: false, sendData: {} }));
				this.props.history.push(`/task-vendor/quotation`)
			})
			.catch((resp) => {
				this.setState(({ loadings, quotation }) => (
					{ 
						loadings: { ...loadings, button: false, errors: resp.data.errors },
						quotation: { ...quotation, errors: resp.data.errors },
						modalOpen: false, 
						sendData: {}
					}
				));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	toggleClose = () => {
		this.setState({ modalOpen: false, sendData: {} })
	}

	toggleOpen = (data) => {
		this.setState({ modalOpen: true, sendData: data })
	}

	toggleSubmit = () => {
		this.submitVendorQuotation(this.state.sendData);
	}

	toggleUpdate = () => {
		this.updateVendorQuotation(this.state.sendData);
	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Task Vendor</li>
					<li className="breadcrumb-item active">Penawaran Terkirim</li>
				</ol>
				<h1 className="page-header">Penawaran Terkirim </h1>
					<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						fetchIncoterms={this.fetchIncoterms}
						submit={this.toggleOpen}
						update={this.toggleOpen}
					/>
					{/* <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
					<ModalHeader toggle={() => this.toggleClose()}>Persyaratan {this.state.modalType} </ModalHeader>
						{this.state.loadings.modal && (
							<center>
							<br />
							<ReactLoading type="cylon" color="#0f9e3e" />
							<br />
							</center>
						)}
							{this.state.loadings.modal === false && (
							<PaktaIntegritas
								parentState={this.state}
								parentProps={this.props}
								toggleClose={this.toggleClose}
								submit={this.toggleSubmit}
								update={this.toggleUpdate}
							/>
						)}
					</Modal> */}
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
		fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		getProposalTender: (uuid, params) => dispatch(getProposalTender(uuid, params)),
		getPenawaranTerkirimVendorQuotation: (uuid, params) => dispatch(getPenawaranTerkirimVendorQuotation(uuid, params)),
		submitVendorQuotation: (uuid, params) => dispatch(submitVendorQuotation(uuid, params)),
		updateVendorQuotation: (uuid, params) => dispatch(updateVendorQuotation(uuid, params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (QuotationDetail));