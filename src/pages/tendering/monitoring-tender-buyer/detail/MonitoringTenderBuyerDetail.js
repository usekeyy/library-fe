import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import Header from './Header';
import ItemTerpilih from './ItemTerpilih'
import DokumenPengadaan from './DokumenPengadaan';
import DetailTender from './DetailTender';
import JadwalTender from './JadwalTender';
import Vendor from './Vendor';
import VendorUndang from './VendorUndang';
import RekapHasilEvaluasi from './RekapHasilEvaluasi';
import RekapNegosiasi from './RekapNegosiasi';
// import CatatanEksternal from './CatatanEksternal';
import Awarding from '../../announcement/undangan-tender-aktif/detail/Awarding';
// import Awarding from './Awarding';
import HistoryApproval from './HistoryApproval';
import ArsipTender from './ArsipTender';
import EDoc from './EDoc';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {
	showMonitoringTenderBuyerDetail, 
	// showVendorPanel, 
	updateDokumenPengadaan, 
	updateProposalTenderJadwal,
	fetchJadwalTender,
	fetchArsipTender,
	saveArsipTender,
	deleteArsipTender,
	submitExtendJadwal,
	approveExtendJadwal
	} from '../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { showStepNegotiation } from '../../../../store/actions/tendering/negotiationActions';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import FormDetail from '../../purchasing-requisition/list/detail/FormDetail';
import { ShowDetailPurchasingRequisition } from '../../../../store/actions/tendering/purchasingRequisitionActions'
import { saveRetender, approveRetender, rejectRetender, showRetender, createRetenderItemize , approveRetenderItemize } from '../../../../store/actions/tendering/retenderActions';
import { showDurVendor, showEDocDUR, downloadDurVendorDocument, showDurPersyaratanAdmin, showDurPersyaratanCommercial} from '../../../../store/actions/tendering/durActions';
import ReactLoading from 'react-loading';
import FormJadwalTender from './form/FormJadwalTender'
// import FormVendor from './form/FormVendor'
import FormRekapNegosiasi from './form/FormRekapNegosiasi'
import FormRetender from './form/FormRetender'
import Catatan from './Catatan'
import FormHistoryJadwal from './form/FormHistoryJadwal'
import FormHistoryApproval from './form/FormHistoryApproval'
import FormEdoc from './form/FormEdoc'

import { downloadAwardingBeritaAcara,downloadMonitoringTender } from '../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { downloadBidOpening, downloadBidOpeningBidTabulation} from '../../../../store/actions/tendering/bidOpeningActions';
import { downloadBeritaAcaraAanwijzing } from '../../../../store/actions/tendering/aanwijzingActions';
import { downloadBAHN, downloadBidTabulation } from '../../../../store/actions/tendering/negotiationActions';

import { fileUpload } from '../../../../store/actions/uploadActions';

import SweetAlert from 'react-bootstrap-sweetalert';
import { shuffleArray } from '../../../../helpers/shuffleArray';
import FormBatalTender from './form/FormBatalTender';
import ModalPOOutstanding from './form/ModalPOOutstanding';
import FormExtendJadwalTender from './form/FormExtendJadwalTender';
import Persyaratan from './Persyaratan';
import DetailPersyaratan from '../../dur/modal-persyaratan/DetailPersyaratan';
import ListEvaluasiTeknis from '../../dur/modal-persyaratan/ListEvaluasiTeknis';
import ListPersyaratan from '../../dur/modal-persyaratan/ListPersyaratan';

class MonitoringTenderBuyerDetail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.state = {
			isBuyer : props.user.has_roles.includes("BYR001") ? true : false,
			dataDetailItem : {
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			},
			paramId: this.props.location.pathname.split("/")[4],
			retender_uuid: this.props.location.pathname.split("/")[5],
			paramType: this.props.location.pathname.split("/")[2],
			retender: {},
			monitoringTender: {
				header : {},
				item_terpilih : [],
				dokumen_pengadaan : [],
				detail_tender : {},
				jadwal_tender : [],
				sos : {},
				vendor : [],
				vendorUndang : {},
				rekap_admin : [],
				rekap_teknis : [],
				rekap_komersil : [],
				negotiations : [],
				awarding : {},
				catatan : [],
				check_vendor : [],
				arsip_tender : [],
				proposal_tender_id : '',
				uuid_negosiasi : [],
				note_eksternal : '',
				assignment_evatek : '',
				tim_evaluator : '',
				e_doc_aanwijzing:[],
				negotiations_new : []
			},
			loadings: {
				button: false,
				pages: true,
				items: false,
				awarding : false,
				updateDokumenPengadaan : false,
				updateProposalTenderJadwal : false,
				saveArsipTender : false,
				cetak : false,
				retender: false,
				batal_tender: false,
				extend_jadwal : false,
				approval_jadwal: false,
			},
			modal: {
				item : false,
				alert : false,
				retender : false,
				batal_tender : false
			},
			panelHistoryApproval: false,
			panelModal :"",
			jadwalTenderModal : "",
			rekapNegoModal : "",
			historyJadwal : [],
			eDocContent : '',
			historyApproval : [],
			historyApprovalPraKualifikasi : [],
			historyApprovalAwarding : [],
			historyApprovalDur: [],
			uuid_arsip_tender : '',
			status_aanwijzing : '',
			errors: [],
			temp_vendor : '',
			dataModalPersyaratan: {
                header: [],
                evaluasi_admin: [],
                persyaratan: []
            },
			approvalItemize : {
				comfirmPopUp : false,
				status : '',
				proposal_tender_uuid : ''
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.getMonitoringTenderDetail(this.state.paramId)
			if(this.state.paramType === 'retender' && this.state.retender_uuid !== undefined){
				this.showRetender(this.state.retender_uuid)
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

	getMonitoringTenderDetail = async (uuid) => {
		if(this._isMounted){
			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: true, button: true } }));
			this.props.showMonitoringTenderBuyerDetail(uuid)
			.then((resp) => {
                const data = resp.data.data;
				let status_history_approval = false
				let date_now = new Date(localStorage.getItem("times"));
				if (data.jadwal_tender !== undefined && data.jadwal_tender !== null && data.jadwal_tender.length !== 0) {
					if (data.jadwal_tender.some(item => item.jadwal_tender_code === "JT002")) {
						let index = data.jadwal_tender.findIndex(d => d.jadwal_tender_code === "JT002");
						let date_pendaftaran = new Date(data.jadwal_tender[index]['end_date'] + ' ' + data.jadwal_tender[index]['end_time'])
						if (date_now > date_pendaftaran) {
							status_history_approval = true
						}
					}

				} 
	
				this.setState(({ loadings, monitoringTender }) => ({ 
					loadings: { ...loadings, button: false, awarding : true },
					panelHistoryApproval: status_history_approval,
					status_aanwijzing: data.status_aanwijzing,
					status_awarding: data.status_awarding,
					status_dur: data.status_dur,
					aanwijzing_ba : data.aanwijzing_ba,
					monitoringTender : {
							...monitoringTender,
							header : {
								number : data.number,
								reference : data.reference,
								title : data.title,
								total_value : data.total_value,
								status_text : data.status_text,
								created_by_name : data.created_by_name,
								proposal_tender_id : data.id,
								retender : data.retender,
								status : data?.status === "x" ? "Cancel" : data.status_monitoring,
								bid_comercil : data.bid_comersil,
								awarding_status : data.awarding_status,
								status_monitoring_abjad : data?.status,
								awarding_status_text : data?.awarding_status_text,
								purchasing_group : `${data?.purchasing_group_id} ${data?.purchasing_group_name}`
							},
							// item_terpilih : data.items,
							item_terpilih: data.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
							dokumen_pengadaan : data.attachment,
							detail_tender : {
								metode_pengadaan_name : data.metode_pengadaan_name,
								pra_qualification : (data?.pra_qualification === "n" || data?.pra_qualification === "0" || data?.pra_qualification === 0)? "Not Active" : "Active",
								metode_aanwijzing_name : data?.metode_aanwijzing_name,
								metode_aanwijzing_id : data?.metode_aanwijzing_id,
								metode_penyampaian_id : data?.metode_penyampaian_id,
								metode_penyampaian_name : data?.metode_penyampaian_name,
								metode_evaluasi : data?.metode_evaluasi,
								metode_negosiasi : data?.metode_negosiasi,
								multiwinner : data?.multiwinner === "0" ? "Not Active" : "Active",
								bid_bond : data?.bid_bond === "1" ? data.bid_bond_value : "Not Active",
								order_placement : data?.order_placement,
								incoterm : data?.incoterm_name,
								visibilitas_bid_open : data?.visibilitas_bid_open,
								delivery_location : data?.delivery_location,
								masa_berlaku : data?.masa_berlaku,
								delivery_time : data?.delivery_time,
								lingkup_pekerjaan : data?.lingkup_pekerjaan,
								note_internal : data?.note_internal,
								note_eksternal : data?.note_external,
								pq_status : data.pq_status,
								workflow_user : data?.workflow_user
							},
							jadwal_tender : data?.jadwal_tender,
							sos : this.setSOS(data?.sos_header, data?.sos_item),
							vendorUndang : {
								bid_administrasi : data?.bid_administrasi,
								bid_comersil : data?.bid_comersil,
								data : shuffleArray(data?.vendor_diundang)
							},
							rekap_teknis : data.rekap_teknis,
							rekap_admin : data.rekap_admin,
							rekap_komersil : data.rekap_komersil,
							negotiations : data.rekap_negosiasi,
							awarding : {
									vendor_registration_tender : {
										header : {
											order_placement : data.order_placement,
										},
										awarding : data.rekap_awarding
									}
							},
							catatan : data.notes,
							check_vendor : data.vendor,
							proposal_tender_id : data.id,
							uuid_negosiasi : data.uuid_negosiasi,
							note_eksternal : data.note_external,
							assignment_evatek : data.assignment_evatek,
							tim_evaluator : data?.tim_evaluator?.tim_evaluator ? data?.tim_evaluator?.tim_evaluator : data?.created_by_name,
							e_doc_aanwijzing: data.e_doc_aanwijzing,
							status_aanwijzing : data.status_aanwijzing,
							pengajuan_extend : data?.pengajuan_extend,
							order_placement : data?.order_placement,
							is_retender_itemize : data?.is_retender_itemize,
							uuid : data?.uuid
							// awarding : data.rekap_awarding
							// errors: [],
							// items: data.items.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number),
					},
					historyApprovalPraKualifikasi : data.approval_praqualification,
					historyApprovalAwarding: data.approval_awarding,
					historyApprovalDur : data.approval_dur,
					isBuyer : this.state.isBuyer ? (this.props.user.uuid === data?.created_by ? true : false) : false
				}));
				

				
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
			})
			.catch((error) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
				
				if (error !== undefined) {
					toastr.error(error.data?.message)
				} else {
					toastr.error(error.data.status, error.data.message);
				}
			});

			this.getNegotiation()
			this.getArsipTender()
			// this.props
			// 		.showDurVendor(this.state.paramId,{ sos_type: '', id: '', coi: 0,monitoring:1 })
			// 		.then((resp) => {
			// 			let data = resp.data.data;
			// 			this.setState(({ loadings, monitoringTender }) => ({ 
			// 				loadings: { ...loadings, button: false },
			// 				monitoringTender : {
			// 					...monitoringTender,
			// 					vendor : data
			// 				}
			// 			}))
			// 			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
			// 		})
			// 		.catch((error) => {
			// 			if (error !== undefined) {
			// 				toastr.error(error.data.message)
			// 			} else {
			// 				toastr.error(error.data.message);;
			// 			}

			// 			this.setState(({ loadings }) => ({ loadings: { ...loadings, pages: false, button: false } }));
						
			// 		});
		}
	}

	setSOS = (sosHeader,sosItem) => {
		let sosHeaderTerpilih = '', sosItemTerpilih = '', materialGroup=''
		sosHeader.forEach((dt,i) => {
			sosHeaderTerpilih += ((sosHeaderTerpilih !== "" ? "; " : "") + dt.bidang_usaha_id + "-" + dt.bidang_usaha_name)
			if (sosItem.length <= 0){
				materialGroup += ((materialGroup !== "" ? "; " : "") + dt.material_group_id)
			}
		})
		if (sosItem.length > 0){
			sosItem.forEach((dt,i) => {
				sosItemTerpilih += ((sosItemTerpilih !== "" ? "; " : "") + dt.sub_bidang_usaha_id + "-" + dt.sub_bidang_usaha_name)
				materialGroup += ((materialGroup !== "" ? "; " : "") + dt.material_group_id)
			})
		}

		return (
			{
				header : sosHeaderTerpilih,
				item : sosItemTerpilih,
				material_group : materialGroup
			}
		)

	}

	toggleClose = () => {
		this.setState( ({modal}) => ({
			modal : {
				item : false
			}
		})
		)
	}
	
	openDetailItem = async (payload,panel) => {
		this.setState( ({modal,loadings,panelModal}) => ({
			modal : {
				item : true
			},
			loadings : {
				...loadings,
				items : true
			},
			panelModal : panel
		}))
		if (panel === "item"){
			this.props.ShowDetailPurchasingRequisition(payload)
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({dataDetailItem, loadings}) => ({
						loadings: { ...loadings, items:false},
						dataDetailItem: { ...dataDetailItem, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
					}));
				})
				.catch((resp) => {
					toastr.error(resp.status, resp.message);
					// this.setState(({  loadings }) => ({
					// 	loadings: { ...loadings, loadingModal:false}
					// }));
					this.setState( ({modal,loadings}) => ({
						modal : {
							item : false
						},loadings : {
							items : false
						}
					}))
				});
		}else if(panel === "jadwal_tender"){
			let tempData = this.state.monitoringTender.jadwal_tender.filter((data)=>{
				return data.uuid === payload
			})
			this.setState( ({loadings}) => ({
				jadwalTenderModal : tempData,
				loadings : {
					...loadings,
					items : false
				}
			}))
		}else if(panel === "vendor"){
			this.setState( ({loadings}) => ({
				temp_vendor : payload,
				loadings : {
					...loadings,
					items : false
				},
			}))
		}else if(panel === "rekap_negosiasi"){
			this.setState( ({loadings}) => ({
				rekapNegoModal : payload,
				loadings : {
					...loadings,
					items : false
				},
			}))
		}else if(panel === "history_jadwal"){
			this.props.fetchJadwalTender(this.state.paramId,{})
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({historyJadwal, loadings}) => ({
						loadings: { ...loadings, items:false},
						historyJadwal : data
					}));
				})
				.catch((resp) => {
					toastr.error(resp.status, resp.message);
					// this.setState(({  loadings }) => ({
					// 	loadings: { ...loadings, loadingModal:false}
					// }));
					this.setState( ({modal,loadings}) => ({
						modal : {
							item : false
						},loadings : {
							items : false
						}
					}))
				});
		} else if (panel === "retender"){
			this.setState(({loadings}) => ({
				loadings: { ...loadings, items: false}
			}));
		} else if (panel === "batal_tender"){
			this.setState(({loadings}) => ({
				loadings: { ...loadings, items: false}
			}));
		} else if(panel === "edoc"){
			this.props.showEDocDUR(payload)
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({loadings}) => ({
						loadings: { ...loadings, items:false},
						eDocContent : data.item_document.content
					}));
				})
				.catch((resp) => {
					toastr.error(resp.status, resp.message);
					// this.setState(({  loadings }) => ({
					// 	loadings: { ...loadings, loadingModal:false}
					// }));
					this.setState( ({modal,loadings}) => ({
						modal : {
							item : false
						},loadings : {
							items : false
						}
					}))
				});
		} else if(panel === "history_approval"){
			if (payload === 'Prakualifikasi'){
				this.setState(({historyApproval, loadings}) => ({
					loadings: { ...loadings, items:false},
					historyApproval : this.state.historyApprovalPraKualifikasi
				}));
			}else if (payload ==='DUR'){
				this.setState(({historyApproval, loadings}) => ({
					loadings: { ...loadings, items:false},
					historyApproval : this.state.historyApprovalDur
				}));
			}else if (payload === 'Awarding'){
				this.setState(({historyApproval, loadings}) => ({
					loadings: { ...loadings, items:false},
					historyApproval : this.state.historyApprovalAwarding
				}));
			}	
		} else if (panel === "extend_jadwal"){
			this.setState(({loadings}) => ({
				loadings: { ...loadings, items: false}
			}));
		} else if (panel === "administration"){
			this.showDurPersyaratanAdmin()
		} else if (panel === "komersil"){
			this.showDurPersyaratanCommercial()
		}
	}

	handleUpdateDokumenPengadaan = (payload) => {
		this.setState(({loadings}) => ({
			loadings : {
				...loadings,
				updateDokumenPengadaan : true
			}
		}))
		this.props.updateDokumenPengadaan(payload)
			.then((resp) => {
				this.setState(({loadings}) => ({
					loadings : {
						...loadings,
						updateDokumenPengadaan : false
					}
				}))
				toastr.success(resp.data.status, resp.data.message);
			})
			.catch((error) => {
				this.setState(({loadings}) => ({
					loadings : {
						...loadings,
						updateDokumenPengadaan : false
					}
				}))
				if (error !== undefined) {
					toastr.error(error.data.message)
				} else {
					toastr.error('Opps Somethings Wrong')
				}
			});
	}

	handleUpdateProposalTenderJadwal = (uuid,payload) => {
		this.setState(({loadings}) => ({
			loadings : {
				...loadings,
				updateProposalTenderJadwal : true
			}
		}))
		this.props.updateProposalTenderJadwal(uuid,payload)
			.then((resp) => {
				this.getMonitoringTenderDetail(this.state.paramId)
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						updateProposalTenderJadwal : false
					},
					modal : {
						...modal,
						item : false
					}
				}))
				toastr.success(resp.data.status, resp.data.message);
			})
			.catch((error) => {
				this.getMonitoringTenderDetail(this.state.paramId)
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						updateProposalTenderJadwal : false
					},
					modal : {
						...modal,
						item : false
					}
				}))
				if (error !== undefined) {
					toastr.error(error.data.message)
				} else {
					toastr.error('Opps Somethings Wrong')
				}
			});
	}

	downloadAwardingBeritaAcara = (e) => {
			// this.setState(({}) => ({loadingDownload : true}));
			e.preventDefault()
			this.props.downloadAwardingBeritaAcara(this.state.paramId)
			.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Awarding_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success", resp.data.message)
		})
		.catch((resp) => {
      		// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Berita Acara");
			// this.setState({loading: false});
		});
	}

	downloadAwardingBeritaAcaraVendor = (e,data) => {
		e.preventDefault()
		this.props.downloadAwardingBeritaAcara(this.state.paramId,data)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Penunjukan_Awarding_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success Download", resp.data.message)
		})
		.catch((resp) => {
      		// this.setState(({}) => ({loadingDownload : false}));
			toastr.error("Failed Download Berita Acara");
			// this.setState({loading: false});
		});
	}

	downloadBappBidOpening = (e) =>  {
        // if (this._isMounted) {
            // this.setState(({ loadings }) => ({
            //     loadings: { ...loadings, loadingOpenBid: true }
			// }));
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
                    toastr.error("FAILED Download BAPP BId Opening");
                });
        // }
	}
	
	downloadBeritaAcaraAanwijzing = (e,payload) => {
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
			toastr.error("Failed Download Berita Acara", resp?.statusText);
			// this.setState({loading: false});
		});
	}

	downloadNegoBeritaAcara = (e,vendor_uuid) => {
		e.preventDefault()
		// this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		if (this.state.monitoringTender?.uuid_negosiasi.uuid){
			this.props.downloadBAHN(this.state.monitoringTender.uuid_negosiasi.uuid, vendor_uuid)
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
				toastr.success(resp.data.status, resp.data.message);
			});
		}else{
			toastr.error('Maaf Data Belum Ada');
		}
	}

	downloadMonitoringTender = (e) => {
		e.preventDefault()
		this.setState(({loadings}) => ({...loadings, cetak : true}));
		this.props.downloadMonitoringTender(this.state.paramId)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `Monitoring_Tender${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			toastr.success("Success Download Monitoring Tender", resp.data.message)
		})
		.catch((resp) => {
			this.setState(({loadings}) => ({...loadings, cetak : false}));
			toastr.error("Failed Download Monitoring Tender");
			// this.setState({loading: false});
		});
	}

	downloadBidTabulation = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.downloadBidTabulation(this.state.monitoringTender?.uuid_negosiasi?.uuid)
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

	downloadDurVendorDocument = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.downloadDurVendorDocument(this.state.paramId)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `Dur_Vendor_${this.state.monitoringTender.header.number}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
		})
		.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
				toastr.error(resp.data.message);
		});
	}

	downloadBidOpeningBidTabulation = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		// this.props.downloadBidOpeningBidTabulation(this.state.monitoringTender?.uuid_negosiasi?.uuid)
		this.props.downloadBidOpeningBidTabulation(this.state.paramId)
		.then((resp) => {
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `Bid Tabulation - Bid Opening (${this.state.monitoringTender.header.number}).pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
		})
		.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false } }));
				toastr.error(resp?.statusText);
				// console.log(resp)
		});
	}

	getArsipTender = (e) => {
		if (e !== undefined){
			e.preventDefault()
		}

		this.props
			.fetchArsipTender(this.state.paramId)
			.then((resp) => {
				let data = resp.data.data;
				this.setState(({ loadings, monitoringTender }) => ({ 
					loadings: { ...loadings, button: false },
					monitoringTender : {
						...monitoringTender,
						arsip_tender : data,
					}
				}))
			})
			.catch((error) => {
				toastr.error(error.data.status, error.data.message);
			});
	}

	getNegotiation = () => {
		this.props
			.showStepNegotiation(this.state.paramId)
			.then((resp) => {
				let data = resp.data.data;
				this.setState(({ loadings, monitoringTender }) => ({ 
					loadings: { ...loadings, button: false },
					monitoringTender : {
						...monitoringTender,
						negotiations_new : data.negotiation,
					}
				}))
			})
			.catch((error) => {
				toastr.error(error.data.status, error.data.message);
			});
	}

	handleSaveArsipTender = (data) => {
		this.setState(({loadings}) => ({
			loadings : {
				...loadings,
				saveArsipTender : true
			}
		}))
		const payload = {
			proposal_tender_id : this.state.monitoringTender.proposal_tender_id,
			type : data.tipe_lampiran,
			description : data.deskripsi,
			file : data.file_name
		}

		this.props.saveArsipTender(payload)
			.then((resp) => {
				this.getArsipTender()
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						saveArsipTender : false
					}
				}))
				toastr.success(resp.data.status, resp.data.message);
			})
			.catch((error) => {
				this.getMonitoringTenderDetail(this.state.paramId)
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						saveArsipTender : false
					}
				}))
				if (error !== undefined) {
					toastr.error(error.data.message)
				} else {
					toastr.error('Opps Somethings Wrong')
				}
			});
	}

	handleExtendJadwal = (data) => {
		// console.log(data)
		// console.log(this.state)
		let uuid = "";
		this.state.monitoringTender.jadwal_tender.forEach((data) => {
			if (this.state.monitoringTender.detail_tender.metode_penyampaian_id === '2t'){
				if(data.jadwal_tender_code === 'JT006'){
					uuid = data.uuid
				}
			}else{
				if(data.jadwal_tender_code === 'JT004'){
					uuid = data.uuid
				}
			}
		})
		// console.log(uuid)
		// if(this.state.monitoringTender.detail_tender.metode_penyampaian_id === '2t'){
		// 	if(this.state.monitoringTender.detail_tender.metode_aanwijzing_id === 3){
		// 		uuid = this.state.monitoringTender.jadwal_tender[3].uuid
		// 	}else{
		// 		uuid = this.state.monitoringTender.jadwal_tender[4].uuid
		// 	}
		// }else{
		// 	if(this.state.monitoringTender.detail_tender.metode_aanwijzing_id === 3){
		// 		uuid = this.state.monitoringTender.jadwal_tender[2].uuid
		// 	}else{
		// 		uuid = this.state.monitoringTender.jadwal_tender[3].uuid
		// 	}
		// }
		// console.log(uuid)
		this.setState(({loadings}) => ({
			loadings : {
				...loadings,
				extend_jadwal : true
			}
		}))

		this.props.submitExtendJadwal(uuid, data)
			.then((resp) => {
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						extend_jadwal : false
					},
					modal : {
						...modal,
						item : false
					}
				}))
				this.getMonitoringTenderDetail(this.state.paramId)
				toastr.success(resp.data.status, resp.data.message);
			})
			.catch((error) => {
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						extend_jadwal : false
					}
				}))
				if (error !== undefined) {
					toastr.error(error.data.message, error.data.errors)
				} else {
					toastr.error('Opps Somethings Wrong')
				}
			});
	}

	handleApprovalJadwal= (status) => {
		console.log(status)
		if (!this.state?.monitoringTender?.detail_tender?.workflow_user){
			toastr.error("Error", "Mapping Value Tidak Tersedia")
			return
		}

		if (status !== "y" && status !== "r"){
			toastr.error("Error", "Error Sistem Tidak Terdefinisi")
			return
		}

		const payload = {
			"status" : status
		}
		// console.log(uuid)
		this.setState(({loadings}) => ({
			loadings : {
				...loadings,
				approval_jadwal : true
			}
		}))

		this.props.approveExtendJadwal(this.state?.monitoringTender?.detail_tender?.workflow_user?.uuid, payload)
			.then((resp) => {
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						approval_jadwal : false
					},
				}))
				this.getMonitoringTenderDetail(this.state.paramId)
				toastr.success(resp.data.status, resp.data.message);
			})
			.catch((error) => {
				this.setState(({loadings,modal}) => ({
					loadings : {
						...loadings,
						approval_jadwal : false
					}
				}))
				if (error !== undefined) {
					toastr.error(error.data.message, error.data.errors)
				} else {
					toastr.error('Opps Somethings Wrong')
				}
			});
	}

	toggleConfirm = (e, value) => {
		// if(this._isMounted){
			e.preventDefault()
			const uuid = (typeof value !== 'undefined') ? value : e.target.value;
			this.setState(({modal}) => ({
				modal : {
					...modal,
					 alert : true
				},
				uuid_arsip_tender : uuid
			}))
		// }
	}

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.setState(({modal}) => ({
						modal : {
							...modal,
							 alert : false
						},
					}))
					this.handleDeleteArsipTender(this.state.uuid_arsip_tender)
					break;
				case 'cancel':
					this.setState(({modal}) => ({
						modal : {
							...modal,
							 alert : false
						},
						uuid_arsip_tender : ''
					}))
					break;
				default:
					break;
			}
		}
	}

	handleDeleteArsipTender = (id) => {
		if(this._isMounted){
			// this.setState({loading: true})
			this.props.deleteArsipTender(id)
			.then(res => {
				this.getArsipTender()
				const response = res.data;
				toastr.success(response.message);
				// this._isMounted && this.setState({loading: false, toggleAdd: false}, () => this.fetchData());
			})
			.catch(error => {
				toastr.success(error.data.status, error.data.message);
			})
		}
	}

	saveRetender = (payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.saveRetender(payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings, modal }) => ({ loadings: { ...loadings, button: false }, modal: { ...modal, item: false } }));
			this.props.history.push(`/tendering/retender`)
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

	createRetenderItemize = (payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.createRetenderItemize(payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings, modal }) => ({ loadings: { ...loadings, button: false }, modal: { ...modal, item: false } }));
			window.location.reload();
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

	approveRetender = (uuid, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.approveRetender(uuid, payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings, modal }) => ({ loadings: { ...loadings, button: false }, modal: { ...modal, item: false } }));
			this.props.history.push(`/tendering/retender`)
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

	rejectRetender = (uuid, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
		this.props.rejectRetender(uuid, payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings, modal }) => ({ loadings: { ...loadings, button: false }, modal: { ...modal, item: false } }));
			this.props.history.push(`/tendering/retender`)
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

	showRetender = async (uuid, params) => {
		this.setState({button: true})
		this.props.showRetender(uuid, params)
		.then((resp) => {
				const data = resp.data.data;
				this.setState({ retender: data })
		})
		.catch((resp) => {
			this.setState({button: false})
			toastr.error(resp.data.status, resp.data.message);
		});
	}

	handleApprove = (type) => {
		if(type === 'y'){
			this.approveRetender(this.state.retender_uuid)
		} else if (type === 'n'){
			this.rejectRetender(this.state.retender_uuid)
		} else {
			toastr.error('Type Is Not Defined')
		}
	}

	handleOnclickDetailRekapEvaluasi = (e,type_evaluasi) => {
		if (type_evaluasi === 'admin'){
			this.props.history.push(`/tendering/monitoring-tender-buyer/detail_evaluasi/admin/${this.state.paramId}`)
		}else if (type_evaluasi === 'teknis'){
			if(this.state.monitoringTender.assignment_evatek === "self assignment") {
				this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_process/' + this.state.paramId)
			}else if(this.state.monitoringTender.assignment_evatek === "assign to evaluator"){
				this.props.history.push('/tendering/monitoring-tender-buyer/detail_evaluasi/teknis_evaluator/' + this.state.paramId)
			}else{
				this.props.history.push('/tendering/evaluation-technical/detail/' + this.state.paramId)
			}
			// this.props.history.push(`/tendering/monitoring-tender-buyer/detail_evaluasi/teknis/${this.state.paramId}`)
		}else if (type_evaluasi === 'komersil'){
			this.props.history.push(`/tendering/monitoring-tender-buyer/detail_evaluasi/komersil/${this.state.paramId}`)
		}
	}

	showDurPersyaratanAdmin() {
        this.props.showDurPersyaratanAdmin(this.props.match.params.id)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings, dataModalPersyaratan }) => ({
                    dataModalPersyaratan: { ...dataModalPersyaratan, header: resp.data.data.sistem_bobot, evaluasi_admin: resp.data.data.persyaratan_admin, persyaratan: resp.data.data.persyaratan_teknis },
                    loadings: { ...loadings, items:false },
                }));
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, items:false },
                }));
            })
    }

    showDurPersyaratanCommercial() {
        this.props.showDurPersyaratanCommercial(this.props.match.params.id)
            .then((resp) => {
                toastr.success("Success", resp.data.message)
                this.setState(({ loadings, dataModalPersyaratan }) => ({
                    dataModalPersyaratan: { ...dataModalPersyaratan, persyaratan: resp.data.data.persyaratan },
                    loadings: { ...loadings, items:false },
                }));
            })
            .catch((resp) => {
                toastr.error(resp.data.status, resp.data.message);
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, items:false },
                }));
            })
    }

	approveRetenderItemize = () => {
		this.setState(({ loadings, approvalItemize }) => ({ loadings: { ...loadings, button: true } , approvalItemize : {...approvalItemize , comfirmPopUp: false}}));
		let payload = {
			status : this.state.approvalItemize.status
		}
		this.props.approveRetenderItemize(this.state.monitoringTender.uuid,payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings, approvalItemize }) => ({ loadings: { ...loadings, button: false }, approvalItemize: { ...approvalItemize, comfirmPopUp: false } }));
			window.location.reload();
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

	toggleConfirmApproval = (payload) => {
		console.log(payload)
        if (this._isMounted) {
            this.setState(({ approvalItemize }) => ({
				approvalItemize: { ...approvalItemize, comfirmPopUp:true, status : payload }
			}));
        }
    }

	toggleSweetAlertApproval(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
					this.approveRetenderItemize();
					break;
				case 'cancel':
					this.setState(({ approvalItemize }) => ({
						approvalItemize: { ...approvalItemize, comfirmPopUp:false, status : '' }
					}));
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
				{console.log("tes")}
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">{this.state.paramType === 'retender' ? 'Retender Detail' : 'Monitoring Tender' }</li>
				</ol>
				<h1 className="page-header">{this.state.paramType === 'retender' ? 'Retender Detail' : 'Monitoring Tender' } </h1>
				{/* {this.state.loadings.pages?
				<Panel>
					<PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
					</PanelBody>
				</Panel> : */}
				<div>
				<Header 
					data = {this.state.monitoringTender.header}
					download= {this.downloadMonitoringTender}
					loading= {this.state.loadings}
					modal={this.openDetailItem}
					parentState={this.state}
					isBuyer={this.state.isBuyer}
				/>
				<ItemTerpilih 
					user={this.props.user} 
					loadings={this.state.loadings} 
					monitoringTender={this.state.monitoringTender} 
					data = {this.state.monitoringTender.item_terpilih} 
					approval = {(payload) => this.toggleConfirmApproval (payload)}
					modal = {this.openDetailItem}/>
				<DokumenPengadaan 
					parentState={this.state}
					data={this.state.monitoringTender.dokumen_pengadaan} 
					update={this.handleUpdateDokumenPengadaan} 
					loading={this.state.loadings.updateDokumenPengadaan}
					isBuyer={this.state.isBuyer}/>
				<DetailTender data={this.state.monitoringTender.detail_tender}/>
				<JadwalTender 
					data={this.state.monitoringTender.jadwal_tender}
					data_header={this.state.monitoringTender.header}
					data_detail_tender={this.state.monitoringTender.detail_tender} 
					modal = {this.openDetailItem} isBuyer={this.state.isBuyer}
					data_pengajuan_extend = {this.state.monitoringTender.pengajuan_extend}/>
				{this.state.monitoringTender?.detail_tender?.metode_aanwijzing_id !== 2 && this.state.monitoringTender?.detail_tender?.metode_aanwijzing_id !== 3 && <EDoc 
					data={this.state.monitoringTender.e_doc_aanwijzing}
					modal={this.openDetailItem} 
					// modalsEdoc={(payload) => props.modalsEdoc(payload)}
				/>}
				<Persyaratan modal={this.openDetailItem} />
				<Vendor 
					data_sos={this.state.monitoringTender.sos}
					status_dur = {this.state?.status_dur}
					uuid = {this.state.paramId}
					loadings = {this.state.loadings}
					// data_vendor={this.state.monitoringTender.vendor} 
					modal = {this.openDetailItem} 
					check_vendor={this.state.monitoringTender.check_vendor}
					download = {this.downloadDurVendorDocument}/>
				<VendorUndang data={this.state.monitoringTender.vendorUndang}/>
				<RekapHasilEvaluasi 
					type_evaluasi="admin" 
					data={this.state.monitoringTender.rekap_admin} 
					detail={this.handleOnclickDetailRekapEvaluasi}
				/>
				<RekapHasilEvaluasi 
					type_evaluasi="teknis" 
					data={this.state.monitoringTender.rekap_teknis}
					assignment_evatek={this.state.monitoringTender.assignment_evatek}
					tim_evaluator={this.state.monitoringTender.tim_evaluator}
					detail={this.handleOnclickDetailRekapEvaluasi}
				/>
				<RekapHasilEvaluasi 
					type_evaluasi="komersil" 
					data={this.state.monitoringTender.rekap_komersil} 
					detail={this.handleOnclickDetailRekapEvaluasi}
				/>
				<RekapNegosiasi 
					data={this.state.monitoringTender.negotiations_new}
					items={this.state.monitoringTender.item_terpilih} 
					modal = {this.openDetailItem}
				/>
				{this.state.loadings.awarding && this.state.monitoringTender.header?.awarding_status === 's' &&
				<Awarding 
					parentState={this.state.monitoringTender.awarding}
					downloadAwardingBeritaAcara={this.downloadAwardingBeritaAcaraVendor}
				/>}
				{ this.state.panelHistoryApproval &&
					<HistoryApproval 
						modal = {this.openDetailItem} 
						pq={this.state.monitoringTender.detail_tender?.pra_qualification}
						pq_status={this.state.monitoringTender.detail_tender?.pq_status}
						status_aanwijzing= {this.state.status_aanwijzing}
						status_awarding={ this.state.status_awarding}
						status_dur= {this.state.status_dur}
					/>
				}
				<ArsipTender
					// isAwarding={this.state.monitoringTender?.awarding?.vendor_registration_tender?.awarding?.length > 0 ? true : false}
					isAwarding={this.state.monitoringTender.header?.awarding_status === 'y' || this.state.monitoringTender.header?.awarding_status === 's' ? true : false}
					isBidOpening={this.state.monitoringTender.header?.bid_comercil === 'y' ? true : false}
					isAanwijzing={this.state.monitoringTender?.status_aanwijzing === 'close' ? true : false}
					downloadAwarding = {this.downloadAwardingBeritaAcara}
					downloadBO = {this.downloadBappBidOpening}
					downloadAanwijzing = {(e, payload) => this.downloadBeritaAcaraAanwijzing (e, payload) }
					downloadNego = {this.downloadNegoBeritaAcara}
					downloadBidTabulation = {this.downloadBidTabulation}
					downloadBidOpeningBidTabulation = {this.downloadBidOpeningBidTabulation}
					upload = {this.props.fileUpload}
					data = {this.state.monitoringTender.arsip_tender}
					aanwijzing_ba = {this.state.aanwijzing_ba}
					save = {this.handleSaveArsipTender}
					delete = {this.toggleConfirm}
					loading = {this.state.loadings}
					dataNego = {this.state.monitoringTender?.uuid_negosiasi}
					parentState={this.state}
					isBuyer={this.state.isBuyer}
				/>
				{/* <CatatanEksternal data={this.state.monitoringTender.note_eksternal} /> */}
				<Catatan parentState={this.state} data={this.state.monitoringTender.catatan}/>
				<Panel>
					<div style={{marginTop : "-20px"}}>	
						<PanelBody className="text-right">
							{this.state.paramType === 'retender' &&  <React.Fragment>
								<button 
									className="m-l-10 btn btn-danger"
									onClick={(e) => this.handleApprove('n')} disabled={this.state.loadings.button} >
									{this.state.loadings.button && <i className="fa fa-spinner fa-spin"></i>}
									Reject
								</button>
								<button 
									className="m-l-10 btn btn-primary"
									onClick={(e) => this.handleApprove('y')} disabled={this.state.loadings.button} >
									{this.state.loadings.button && <i className="fa fa-spinner fa-spin"></i>}
									Approve
								</button>
							</React.Fragment>}
							{this.state.paramType !== 'retender' && this.state?.monitoringTender?.detail_tender?.workflow_user?.closing_date === "p" &&  this.state?.monitoringTender?.detail_tender?.workflow_user?.user_id === this.props.user.uuid && <React.Fragment>
								<button 
									className="m-l-10 btn btn-danger"
									onClick={(e) => this.handleApprovalJadwal('r')} disabled={this.state.loadings.button} >
									{this.state.loadings.approval_jadwal && <i className="fa fa-spinner fa-spin"></i>}
									Reject
								</button>
								<button 
									className="m-l-10 btn btn-primary"
									onClick={(e) => this.handleApprovalJadwal('y')} disabled={this.state.loadings.button} >
									{this.state.loadings.approval_jadwal && <i className="fa fa-spinner fa-spin"></i>}
									Approve
								</button>
							</React.Fragment>}
							<button 
								className="m-l-10 btn btn-white"
								onClick={(e) => window.history.back()}>
								Kembali
							</button>
						</PanelBody>
					</div>
				</Panel>
				</div>
				{/* } */}

				<Modal isOpen={this.state.modal.item} toggle={() => this.toggleClose()} className="modal-lg">
					{this.state.loadings.items && (
						<center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					)}
					  {this.state.loadings.items === false && (
						this.state.panelModal === "item" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>
							<FormDetail
							disabledForm={true}
							data={this.state.dataDetailItem}
							toggleClose={this.toggleClose}
							/>
						</div>

					)}

					{this.state.loadings.items === false && (
						this.state.panelModal === "jadwal_tender" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Edit Jadwal Tender</ModalHeader>
							<FormJadwalTender 
								data={this.state.jadwalTenderModal} 
								update={this.handleUpdateProposalTenderJadwal}
								loading={this.state.loadings.updateProposalTenderJadwal}/>
						</div>

					)}

					{this.state.loadings.items === false && (
						this.state.panelModal === "vendor" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()} className="modal-lg">PO Outstanding</ModalHeader>
							{/* <FormVendor /> */}
							<ModalPOOutstanding 
								purchasing_org_id = {this.props.user.purchasing_org_id}
								data_vendor = {this.state.temp_vendor}
							/>
						</div>

					)}

					{this.state.loadings.items === false && (
						this.state.panelModal === "rekap_negosiasi" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Rekap Negosiasi</ModalHeader>
							<FormRekapNegosiasi data = {this.state.rekapNegoModal}/>
						</div>

					)}

					{this.state.loadings.items === false && (
						this.state.panelModal === "history_jadwal" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>History Edit Jadwal</ModalHeader>
							<FormHistoryJadwal data={this.state.historyJadwal}/>
						</div>

					)}

					{this.state.loadings.retender === false && (
						this.state.panelModal === "retender" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Retender </ModalHeader>
							<FormRetender fileUpload={this.props.fileUpload} toggleClose={() => this.toggleClose()} saveRetender={this.saveRetender}  createRetenderItemize={this.createRetenderItemize} upload={this.props.fileUpload} parentState={this.state} />
						</div>

					)}

					{this.state.loadings.batal_tender === false && (
						this.state.panelModal === "batal_tender" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Batal Tender</ModalHeader>
							<FormBatalTender fileUpload={this.props.fileUpload} toggleClose={() => this.toggleClose()} saveRetender={this.saveRetender} upload={this.props.fileUpload} parentState={this.state} />
						</div>

					)}

					{this.state.loadings.items === false && (
						this.state.panelModal === "edoc" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Edoc Aanwijzing</ModalHeader>
							<FormEdoc data={this.state.eDocContent}/>
						</div>

					)}
					{this.state.loadings.items === false && (
						this.state.panelModal === "history_approval" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>List Approval</ModalHeader>
							<FormHistoryApproval data={this.state.historyApproval}/>
						</div>

					)}
					{this.state.loadings.items === false && (
						this.state.panelModal === "extend_jadwal" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Extend Jadwal Quotation</ModalHeader>
							<FormExtendJadwalTender loading_button={this.state.loadings.extend_jadwal} submit={this.handleExtendJadwal}/>
						</div>

					)}
					{this.state.loadings.items === false && (
						this.state.panelModal === "administration" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Persyaratan Adminstrasi & Teknis</ModalHeader>
							<ModalBody>
								<div>
									<DetailPersyaratan
										metode_evaluasi={this.state.monitoringTender.detail_tender.metode_evaluasi}
										data={this.state.dataModalPersyaratan.header}
									/>
									<ListPersyaratan
										metode_evaluasi={this.state.monitoringTender.detail_tender.metode_evaluasi}
										data={this.state.dataModalPersyaratan.evaluasi_admin}
									/>
									<ListEvaluasiTeknis
										metode_evaluasi={this.state.monitoringTender.detail_tender.metode_evaluasi}
										data={this.state.dataModalPersyaratan.persyaratan}
									/>
								</div>
							</ModalBody>
						</div>

					)}
					{this.state.loadings.items === false && (
						this.state.panelModal === "komersil" &&
						<div>
							<ModalHeader toggle={() => this.toggleClose()}>Persyaratan Adminstrasi & Teknis</ModalHeader>
							<ModalBody>
								<div>
									<ListPersyaratan
										metode_evaluasi={this.state.monitoringTender.detail_tender.metode_evaluasi}
										data={this.state.dataModalPersyaratan.persyaratan}
									/>
								</div>
							</ModalBody>
						</div>

					)}
				</Modal>

				{(this.state.modal.alert &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={t("common:delete.approve-delete")}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title={t("common:delete.title-delete")}
						onConfirm={() => this.toggleSweetAlert('confirm')}
						onCancel={() => this.toggleSweetAlert('cancel')}
					>
					</SweetAlert>
				)}

				{/* Sweets Alert Approval or Reject Itemize */}

				{(this.state.approvalItemize.comfirmPopUp &&
					<SweetAlert 
						warning
						showCancel
						confirmBtnText={this.state.approvalItemize.status==='r' ? t("common:approval.submit-reject") : t("common:approval.submit-approve")}
						cancelBtnText={t("common:delete.cancel")}
						confirmBtnBsStyle={this.state.approvalItemize.status==='r' ? "danger" :"success"} 
						cancelBtnBsStyle="default"
						title={this.state.approvalItemize.status==='r' ? t("common:approval.reject") : t("common:approval.approve")}
						onConfirm={() => this.toggleSweetAlertApproval('confirm')}
						onCancel={() => this.toggleSweetAlertApproval('cancel')}
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
		showMonitoringTenderBuyerDetail: (uuid) => dispatch(showMonitoringTenderBuyerDetail(uuid)),
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		// showVendorPanel: (uuid,parameter) => dispatch(showVendorPanel(uuid,parameter)),
		updateDokumenPengadaan: (payload) => dispatch(updateDokumenPengadaan(payload)),
		updateProposalTenderJadwal: (uuid,payload) => dispatch(updateProposalTenderJadwal(uuid,payload)),
		fetchJadwalTender: (uuid,params) => dispatch(fetchJadwalTender(uuid,params)),
		downloadAwardingBeritaAcara: (uuid, params) => dispatch(downloadAwardingBeritaAcara(uuid, params)),
		fetchArsipTender: (uuid,params) => dispatch(fetchArsipTender(uuid,params)),
		saveArsipTender: (payload) => dispatch(saveArsipTender(payload)),
		deleteArsipTender: (id) => dispatch(deleteArsipTender(id)),
		downloadBidOpening: (id) => dispatch(downloadBidOpening(id)),
		downloadBeritaAcaraAanwijzing: (id) => dispatch(downloadBeritaAcaraAanwijzing(id)),
		downloadBAHN: (uuid, vendor_uuid) => dispatch(downloadBAHN(uuid, vendor_uuid)),
		downloadMonitoringTender: (id) => dispatch(downloadMonitoringTender(id)),
		saveRetender: (payload) => dispatch(saveRetender(payload)),
		approveRetender: (uuid, payload) => dispatch(approveRetender(uuid, payload)),
		rejectRetender: (uuid, payload) => dispatch(rejectRetender(uuid, payload)),
		showRetender: (uuid, payload) => dispatch(showRetender(uuid, payload)),
		showDurVendor: (id, payload) => dispatch(showDurVendor(id, payload)),
		showEDocDUR: (id) => dispatch(showEDocDUR(id)),
		showStepNegotiation: (uuid) => dispatch(showStepNegotiation(uuid)),
		downloadBidTabulation: (uuid) => dispatch(downloadBidTabulation(uuid)),
		downloadDurVendorDocument: (id) => dispatch(downloadDurVendorDocument(id)),
		downloadBidOpeningBidTabulation : (uuid) => dispatch(downloadBidOpeningBidTabulation(uuid)),
		submitExtendJadwal : (uuid,payload) => dispatch(submitExtendJadwal(uuid,payload)),
		approveExtendJadwal : (uuid,payload) => dispatch(approveExtendJadwal(uuid,payload)),
		showDurPersyaratanAdmin: (id) => dispatch(showDurPersyaratanAdmin(id)),
        showDurPersyaratanCommercial: (id) => dispatch(showDurPersyaratanCommercial(id)),
		createRetenderItemize :(payload) =>dispatch(createRetenderItemize(payload)),
		approveRetenderItemize :(uuid,payload) => dispatch(approveRetenderItemize(uuid,payload))
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (MonitoringTenderBuyerDetail));