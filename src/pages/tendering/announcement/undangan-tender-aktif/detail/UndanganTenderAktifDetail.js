import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import { saveVendorRegistrationTender } from '../../../../../store/actions/tendering/vendorRegistrationTenderActions';
import { getProposalTender } from '../../../../../store/actions/tendering/proposalTenderActions';
import { downloadAwardingBeritaAcara } from '../../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { downloadBidOpening} from '../../../../../store/actions/tendering/bidOpeningActions';
import { downloadBAHN } from '../../../../../store/actions/tendering/negotiationActions';
import { downloadBeritaAcaraAanwijzing } from '../../../../../store/actions/tendering/aanwijzingActions';
import { fetchJadwalTender,downloadRFQ,downloadPaktaIntegritasTender } from '../../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { fetchRetender, showRetender } from '../../../../../store/actions/tendering/retenderActions';
import Form from './Form';
import FormHistoryJadwal from '../../../monitoring-tender-buyer/detail/form/FormHistoryJadwal';
import { Modal, ModalHeader } from 'reactstrap';

class VendorRegistrationTender extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			paramId: this.props.location.pathname.split("/")[4],
			vendor_registration_tender: {
				header: {
					ambang_batas: '',
					approved_at: '',
					bid_bond: '',
					bid_bond_value: '',
					bobot_komersil: '',
					bobot_teknis: '',
					buyer_name: '',
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
					is_retender: '',
					status_aanwijzing: '',
					status_text: '',
					title: '',
					updated_at: '',
					updated_by: '',
					uuid: '',
					visibilitas_bid_open: '',
					retender_file: '',
					retender_note: '',
					bo_start_date: '',
					company_name: '',
					metode_aanwijzing: {},
					metode_pengadaan: {},
					metode_penyampaian: {},
					status_bid_opening : []
				},
				retender: {},
				items: [],
				schedules: [],
				terms: [],
				errors: [],
				kemampuanPasok : [],
				bidOpening : [],
				hasilEvaluasi : [],
				rekapNegosiasi : [],
				awarding : [],
				attachments : [],
				beritaAcara : [],
				uuid_negosiasi : [],
				pakta_integritas: {},
				historyJadwal : []
			},
			loadings: {
				button: false,
				pages: false,
				items: false,
				modal : false
			},
			modal_history_jadwal : false
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.getProposalTender(this.state.paramId)
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	getProposalTender = (uuid, params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.getProposalTender(uuid, params)
			.then((resp) => {
				const data = resp.data.data;
				const setHeader = {...this.state.vendor_registration_tender.header}
				setHeader.ambang_batas = data.ambang_batas;
				setHeader.approved_at = data.approved_at;
				setHeader.bid_bond = data.bid_bond;
				setHeader.bid_bond_value = data.bid_bond_value;
				setHeader.bid_comercil = data.bid_comersil;
				setHeader.bobot_komersil = data.bobot_komersil;
				setHeader.bobot_teknis = data.bobot_teknis;
				setHeader.buyer_name = data.buyer_name;
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
				setHeader.reference = data.reference;
				setHeader.status = data.status;
				setHeader.status_aanwijzing = data.status_aanwijzing;
				setHeader.status_text = data.status_text;
				setHeader.awarding_status = data.awarding_status;
				setHeader.title = data.title;
				setHeader.updated_at = data.updated_at;
				setHeader.updated_by = data.updated_by;
				setHeader.uuid = data.uuid;
				setHeader.visibilitas_bid_open = data.visibilitas_bid_open;
				setHeader.metode_aanwijzing = data.metode_aanwijzing;
				setHeader.metode_pengadaan = data.metode_pengadaan;
				setHeader.metode_penyampaian = data.metode_penyampaian;
				setHeader.status_bid_opening = data.status_bid_opening;
				setHeader.is_retender = data.is_retender;
				setHeader.retender_file = data.retender_file;
				setHeader.retender_note = data.retender_note;
				setHeader.company_name = data.company_name;
				setHeader.bo_start_date = `${data.bo_start_date?.end_date} ${data.bo_start_date?.end_time}`;

				if(data.is_retender === 'y' && (data.status === 'c' || data.status === 'x')){
					// this.fetchRetender()
				}
				this.setState(({ loadings, vendor_registration_tender }) => ({ 
					loadings: { ...loadings, button: false },
					aanwijzing_ba : data.aanwijzing_ba,
					vendor_registration_tender : {
							...vendor_registration_tender,
							errors: [],
							items: data.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
							schedules: data.schedules,
							terms: data.terms,
							kemampuanPasok : data.kemampuan_pasok,
							bidOpening : data.bid_opening,
							bid_opening_bapp: data.bid_opening_bapp,
							hasilEvaluasi : data.evaluasi,
							rekapNegosiasi : data.negosiasi,
							awarding : data.awarding,
							attachments : data.attachments,
							header: setHeader,
							beritaAcara : data.berita_acara,
							uuid_negosiasi : data.uuid_negosiasi,
							pakta_integritas : data.dokumen_pakta_integritas,
							vendor_nego : data.vendor_nego,
							attachments_aanwijzing : data?.aanwijzing_attachment
					}
				}));
				// console.log(data);
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
				toastr.error(resp.data?.status, resp.data?.message);
				// toastr.error("error");
			});
		}
	}

	saveVendorRegistrationTender = (params) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.saveVendorRegistrationTender(this.state.paramId, params)
			.then((resp) => {
				toastr.success("Success", "Data Has Been Saved");
				this.setState(({ loadings, vendor_registration_tender }) => ({ 
					loadings: { ...loadings, button: false },
					vendor_registration_tender : { ...vendor_registration_tender, errors: [] }
				}));
				this.props.history.push(`/task-vendor/undangan-tender-aktif`)
			})
			.catch((resp) => {
				this.setState(({ loadings, vendor_registration_tender }) => ({ 
					loadings: { ...loadings, button: false },
					vendor_registration_tender : { ...vendor_registration_tender, errors: resp.data.errors }
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	downloadAwardingBeritaAcara = (e,data) => {
		e.preventDefault()
		this.props.downloadAwardingBeritaAcara(this.state.paramId,data)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Awarding_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success Download", resp.data.message)
		})
		.catch((resp) => {
			// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Berita Acara",resp?.statusText);
			// this.setState({loading: false});
		});
	}

	downloadBappBidOpening = (e) =>  {
		e.preventDefault()
		this.props.downloadBidOpening(this.state.paramId)
			.then((resp) => {
				const url = window.URL.createObjectURL(new Blob([resp.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `BAPP_Bid Opening_${this.props.user.name}.pdf`); //or any other extension
				document.body.appendChild(link);
				link.click();

				toastr.success("Success", resp.data.message)
				
			})
			.catch((resp) => {
				toastr.error("FAILED Download BAPP Bid Opening",resp?.statusText);
			});
	}
	
	downloadNegoBeritaAcara = (e) => {
		e.preventDefault()
		// this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		if (this.state.vendor_registration_tender.uuid_negosiasi?.uuid){
			this.props.downloadBAHN(this.state.vendor_registration_tender.uuid_negosiasi.uuid, this.props.user.username)
			.then((resp) => {
				const url = window.URL.createObjectURL(new Blob([resp.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `BAHN_${this.props.user.username}.pdf`); //or any other extension
				document.body.appendChild(link);
				link.click();
				// this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
			})
			.catch((resp) => {
					// this.setState({loading: false})
					let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
					// this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
					toastr.error(message);
			});
		}else{
			toastr.error('Maaf Data Belum Ada');
		}
	}

	downloadBeritaAcaraAanwijzing = (e, payload) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.downloadBeritaAcaraAanwijzing(payload)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Aanwijzing_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success", resp.data.message)
		})
		.catch((resp) => {
				// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Berita Acara",resp?.statusText);
			// this.setState({loading: false});
		});
	}

	downloadRFQ = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.downloadRFQ(this.state.paramId)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `RFQ_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success Download RFQ", resp.data.message)
		})
		.catch((resp) => {
				// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download RFQ",resp?.statusText);
			// this.setState({loading: false});
		});
	}

	downloadPaktaIntegritas = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.downloadPaktaIntegritasTender(this.state.paramId)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `Pakta_Integritas_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success Download Pakta Integritas", resp.data.message)
		})
		.catch((resp) => {
				// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Pakta Integritas",resp?.statusText);
			// this.setState({loading: false});
		});
	}

	showRetender = async (uuid, params) => {
		// this.setState({button: true})
		this.props.showRetender(uuid, params)
		.then((resp) => {
				const data = resp.data.data;
				// this.setState({ retender: data })
				console.log(data);
		})
		.catch((resp) => {
			// this.setState({button: false})
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	fetchRetender = async (params) => {
		// this.setState({button: true})
		this.props.fetchRetender(params)
		.then((resp) => {
				const data = resp.data.data;
				// this.setState({ retender: data })
				console.log(data);
		})
		.catch((resp) => {
			// this.setState({button: false})
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	fetchHistoryJadwal = async () => {
		this.setState(({ loadings}) => ({
			loadings : {
				...loadings,
				modal : true
			}
		}));
		// this.setState({button: true})
		this.props.fetchJadwalTender(this.state.paramId)
		.then((resp) => {
			this.setState(({ loadings,vendor_registration_tender }) => ({
				vendor_registration_tender : {
						...vendor_registration_tender,
						historyJadwal : resp.data.data
				},
				modal_history_jadwal : true,
				loadings : {
					...loadings,
					modal : false
				}
			}));
		})
		.catch((resp) => {
			// this.setState({button: false})
			this.setState(({ loadings}) => ({
				loadings : {
					...loadings,
					modal : false
				}
			}));
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	toggleClose = () => {
		this.setState( ({modal}) => ({
			modal_history_jadwal : false
		})
		)
	}



  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Task Vendor</li>
					<li className="breadcrumb-item active">Tender Aktif Detail</li>
				</ol>
				<h1 className="page-header">Tender Aktif Detail </h1>
				<Form
						parentState={this.state}
						parentProps={this.props}
						upload={this.props.fileUpload}
						saveVendorRegistrationTender={this.saveVendorRegistrationTender}
						downloadAwardingBeritaAcara={this.downloadAwardingBeritaAcara}
						downloadBidOpening={this.downloadBappBidOpening}
						downloadNegoBeritaAcara={this.downloadNegoBeritaAcara}
						downloadAanwijzing={(e, payload) => this.downloadBeritaAcaraAanwijzing(e, payload)}
						downloadRFQ={this.downloadRFQ}
						downloadPaktaIntegritas={this.downloadPaktaIntegritas}
						modalHistoryJadwal={this.fetchHistoryJadwal}
					/>
					
					<Modal isOpen={this.state.modal_history_jadwal} toggle={() => this.toggleClose()} className="modal-lg">
						{!this.state.loadings.modal && 
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>History Edit Jadwal</ModalHeader>
							<FormHistoryJadwal data={this.state.vendor_registration_tender.historyJadwal}/>
						</div>
  						}	
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
		getProposalTender: (uuid, params) => dispatch(getProposalTender(uuid, params)),
		saveVendorRegistrationTender: (uuid, params) => dispatch(saveVendorRegistrationTender(uuid, params)),
		downloadAwardingBeritaAcara: (uuid, params) => dispatch(downloadAwardingBeritaAcara(uuid, params)),
		downloadBidOpening: (id) => dispatch(downloadBidOpening(id)),
		downloadBAHN: (uuid, vendor_uuid) => dispatch(downloadBAHN(uuid, vendor_uuid)),
		downloadBeritaAcaraAanwijzing: (id) => dispatch(downloadBeritaAcaraAanwijzing(id)),
		downloadRFQ: (id) => dispatch(downloadRFQ(id)),
		downloadPaktaIntegritasTender: (id) => dispatch(downloadPaktaIntegritasTender(id)),
		showRetender: (uuid, payload) => dispatch(showRetender(uuid, payload)),
		fetchRetender: (payload) => dispatch(fetchRetender(payload)),
		fetchJadwalTender: (uuid,params) => dispatch(fetchJadwalTender(uuid,params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (VendorRegistrationTender));