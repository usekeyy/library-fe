import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import Form from './detail/Form'
import ModalPersyaratanTambahan from './detail/persyaratan-tambahan/ModalPersyaratanTambahan'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import FormDetail from '../purchasing-requisition/list/detail/FormDetail';
import { fileUpload } from '../../../store/actions/uploadActions';
import { showPraQualificationDetail,
        updatePraQualification,
        showPraQualificationVendorDetail,
        showUserVendorDetail,
        fetchPraQualificationVendor,
        fetchPraQualificationPersyaratan,
        fetchPraQualificationKlarifikasi,
        savePraQualificationKlarifikasi,
        fetchPraQualificationPersyaratanVendor,
        fetchPraQualificationEvaluasiVendor,
        savePraQualificationEvaluasiVendor,
        updatePraQualificationPersyaratan,
        fetchPraQualificationPersyaratanTambahan,
        showPraQualificationPersyaratanTambahan,
        savePraQualificationPersyaratanTambahan,
        updatePraQualificationPersyaratanTambahan,
        deletePraQualificationPersyaratanTambahan,
        savePraQualificationNotes,
        savePraQualificationRegisterVendor,
        savePraQualificationDokumenPersyaratanTambahan,
        savePraQualificationDokumenPersyaratanVendor,
        approvalPraQualification } from '../../../store/actions/tendering/praQualificationActions'
import { ShowDetailPurchasingRequisition } from '../../../store/actions/tendering/purchasingRequisitionActions'
import {praQualificationDetailResponse} from '../../../store/actions/authActions';
import Persyaratan from './detail/Persyaratan';
import Evaluasi from './detail/Evaluasi';

export class DetailPraQualification extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            data: [],
            data_vendor: [],
            data_vendor_evaluasi: [],
            data_klarifikasi: [],
            data_user_vendor: [],
            data_persyaratan: [],
            data_persyaratan_tambahan: [],
            data_persyaratan_vendor: [],
            data_evaluasi_persyaratan_vendor: [],
            data_klarifikasi_submit_vendor: {
                note: '',
                file: '',
            },
            data_catatan: {
                note: '',
                process: '',
                status: '',
                proposal_tender_id: '',
            },
            data_klarifikasi_submit: {
                due_date: '',
                note: '',
                file: '',
                vendor_id: '',
                proposal_tender_id: '',
            },
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data_jadwal_pq: {
                pq_start_date: '',
                pq_end_date: '',
                pq_start_time: '',
                pq_end_time: '',
            },
            notes: "",
            vendors: [],
            vendorSelection: [],
            detail: [],
            attactment: [],
            loadings: {
                loading_vendor: false,
                loadingModal: false
            },
            isDeletePersyaratanDetail: '',
            loading: true,
            errors: [],
            status_date: false,
            status_pq_date: false,
            status_pq_date_limit: false,
            status_attachment_file: true,
            status_catatan: true,
            status_catatan_evaluasi: false,
            status_register_vendor: false,
            loadingSubmit: false,
            loading_persyaratan_tambahan: true,
            checkAll: false,
            optionsFilterBy:[
                { value: "sosheader", label: "SoS Header" },
                { value: "sositem", label: "SoS Item" },
            ],
            evaluasi_persyaratan: {
              items: [],
              items_selected: [],
            },
            persyaratan: {
              sendData: {
                  determination_id: { value: "eproc", label: "E-Proc"},
                  user_id: '',
                  items: []
              },
              items: [],
              attachments: [],
              items_selected: [],
              errors: [],
              loading: true,
              loadingButton: false
            },
            uuid_persyaratan_tambahan: '',
            modalOpen:false,
            modalPersyaratanTambahan:false,
            modalType:'',
            modalData : {
                items:[],
                item_potext : [],
                account_assignment : [],
                serviceline:[]
            },
        }
    }


    componentDidMount = () => {
        this._isMounted = true;
        this.props.praQualificationDetailResponse({type: false});
        if (this._isMounted) {
            if (this.props.match.params.id !== undefined) {
                if (this.state.role_vendor) {
                    this.getUserVendor()
                }
                else {
                    this.getUUID()
                }
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

	toggleSweetAlert(name) {
		if(this._isMounted){
			switch(name) {
				case 'confirm':
                    this.setState({ isDeletePersyaratanDetail: false });
					this.deletePersyaratanDetail(this.state.uuid_persyaratan_tambahan)
					break;
				case 'cancel':
					this.setState({ isDeletePersyaratanDetail: false, uuid_persyaratan_tambahan: '' });
					break;
				default:
					break;
			}
		}
	}

    getUUID = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            if (!this.state.role_vendor) {
                this.props
                    .showPraQualificationDetail(this.props.match.params.id)
                    .then((resp) => {
                        let datas = resp.data.data;
                        // datas.pq_status = 'd'
                        // datas.pq_status_text = "Open"
                        // console.log(datas)
                        let data_jadwal_pq = { ...this.state.data_jadwal_pq };
                        if (this.state.data_jadwal_pq.pq_start_date === '' || this.state.data_jadwal_pq.pq_start_date === null
                            || this.state.data_jadwal_pq.pq_end_date === '' || this.state.data_jadwal_pq.pq_end_date === null)
                        {
                            data_jadwal_pq.pq_start_date = datas.pq_start_date;
                            data_jadwal_pq.pq_end_date = datas.pq_end_date;
                            data_jadwal_pq.pq_start_time = datas.pq_start_time;
                            data_jadwal_pq.pq_end_time = datas.pq_end_time;
                        }

                        this.setState({ loading: false, data: datas, vendorSelection: datas.vendor, data_jadwal_pq}, () => {
                            this.getVendor()
                        });
                    })
                    .catch((resp) => {
                        this.setState({ loading: false });
                        toastr.error(resp.data.message);;
                    });

            } else {
                this.props
                    .showPraQualificationVendorDetail(this.props.match.params.id, {vendor_id: this.state.data_user_vendor.id})
                    .then((resp) => {
                        let datas = resp.data.data;
                        // console.log(datas)
                        let data_jadwal_pq = { ...this.state.data_jadwal_pq };
                        if (this.state.data_jadwal_pq.pq_start_date === '' || this.state.data_jadwal_pq.pq_start_date === null
                            || this.state.data_jadwal_pq.pq_end_date === '' || this.state.data_jadwal_pq.pq_end_date === null)
                        {
                            data_jadwal_pq.pq_start_date = datas.pq_start_date;
                            data_jadwal_pq.pq_end_date = datas.pq_end_date;
                            data_jadwal_pq.pq_start_time = datas.pq_start_time;
                            data_jadwal_pq.pq_end_time = datas.pq_end_time;
                        }

                        this.setState({ loading: false, data: datas, vendorSelection: datas.vendor, data_jadwal_pq}, () => {
                            this.getKlarifikasi(this.state.data_user_vendor.id)
                            this.getPersyaratanVendor(this.state.data_user_vendor.id)
                        });
                    })
                    .catch((resp) => {
                        this.setState({ loading: false });
                        toastr.error(resp.data.message);;
                    });

            }
        }
    }

    getUserVendor() {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .showUserVendorDetail(this.props.user.uuid)
                .then((resp) => {
                    let datas = resp.data.data;
                    // console.log(datas)
                    this.setState({data_user_vendor: datas}, () => {
                        this.getUUID()
                    });
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
    }
    
    getVendor = async () => {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .fetchPraQualificationVendor({proposal_tender_id: this.state.data.id})
                .then((resp) => {
                    let datas = resp.data.data;
                    // console.log(datas)
                    this.setState({ data_vendor: datas });
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
    }

    getKlarifikasi = async (vendor_id) => {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .fetchPraQualificationKlarifikasi({proposal_tender_id: this.state.data.id, vendor_id: vendor_id})
                .then((resp) => {
                    let datas = resp.data.data;
                    // console.log(datas)
                    this.setState({ data_klarifikasi: datas});
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
    }

    getEvaluasiVendor = async (vendor_id) => {
        if (this._isMounted) {
            this.setState(({ evaluasi_persyaratan }) => ({
                evaluasi_persyaratan: { ...evaluasi_persyaratan, items: [], items_selected: []},
                data_evaluasi_persyaratan_vendor: []
            }), () => {
                this.props
                    .fetchPraQualificationEvaluasiVendor({proposal_tender_id: this.state.data.id, vendor_id: vendor_id})
                    .then((resp) => {
                        let datas = resp.data.data;
                        let arr = this.state.evaluasi_persyaratan.items;
                        let arr_selected = this.state.evaluasi_persyaratan.items_selected;
                        
                        Object.keys(datas).forEach(function(key) {
                            if(datas[key]['evaluasi_result'] === "y"){
                                arr.push(datas[key]);
                                arr_selected.push(datas[key]['syarat_id'] + '-' + datas[key]['syarat_tipe'])
                            }
                        });
                
                        this.setState(({ evaluasi_persyaratan }) => ({
                            // loading: false,
                            evaluasi_persyaratan: { ...evaluasi_persyaratan, items: arr.sort((a,b) => a.code-b.code), items_selected: arr_selected},
                            data_evaluasi_persyaratan_vendor: datas,
                        }));
                    })
                    .catch((resp) => {
                        // this.setState({ loading: false });
                        toastr.error(resp.data.message);;
                    });
            });
        }
    }

    getPersyaratanVendor = async (vendor_id) => {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .fetchPraQualificationPersyaratanVendor({proposal_tender_id: this.state.data.id, vendor_id: vendor_id})
                .then((resp) => {
                    let datas = resp.data.data;
                    // console.log(datas)
                    this.setState({ data_persyaratan_vendor: datas});
                })
                .catch((resp) => {
                    toastr.error(resp.data.message);;
                });
        }
    }

    getPersyaratan = () => {
        this.props.fetchPraQualificationPersyaratan(this.state.data.uuid)
            .then((resp) => {
                let data = resp.data.data
                let arr = this.state.persyaratan.items;
                let arr_selected = this.state.persyaratan.items_selected;
        
                Object.keys(data).forEach(function(key) {
                    if (data[key]['status'] === 'y') {
                        arr.push(data[key]);
                        arr_selected.push(data[key]['code'])
                    }
                });

                this.setState(({ persyaratan }) => ({
                    persyaratan: { ...persyaratan, items: arr.sort((a,b) => a.code-b.code), items_selected: arr_selected},
                    data_persyaratan: resp.data.data,
                }));
            })
            .catch((resp) => {
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
    }

    getPersyaratanTambahan = () => {
        this.props.fetchPraQualificationPersyaratanTambahan({ proposal_tender_id: this.state.data.id })
            .then((resp) => {
                this.setState({
                    data_persyaratan_tambahan: resp.data.data,
                    loading_persyaratan_tambahan: false
                })
            })
            .catch((resp) => {
                this.setState({ loading_persyaratan_tambahan: false })
                let message = (typeof resp !== 'undefined') ? resp.message : 'Something Wrong';
                toastr.error('Oops', message);
            });
    }
    
    handleChecklist = (e, payload, code) => {
        // console.log(payload)
        // console.log(code)
        let arr = this.state.persyaratan.items;
        let arr_selected = this.state.persyaratan.items_selected;
        let arrTemp = []
        let arrTempSelected = []
        if(arr.includes(payload)){
            arr.forEach((element, i) => {
                if (element.code!==code) {
                    arrTemp.push(element)
                    arrTempSelected.push(element.code)
                }
            });
            arr=arrTemp
            arr_selected=arrTempSelected
        } else {
            arr.push(payload);
            arr_selected.push(code)
        }

        this.setState(({ persyaratan }) => ({
            persyaratan: { ...persyaratan, items: arr.sort((a,b) => a.code-b.code), items_selected: arr_selected}
        }));
    }
    
    savePersyaratanDetail = (payload) => {
        if (payload.attachment === "y" && (payload.file === null || payload.file === '' || payload.file === undefined)) {
            this.setState({ status_attachment_file: false })
        }
        else {
            this.props.savePraQualificationPersyaratanTambahan(payload)
            .then(res => {
                const response = res.data;
                toastr.success(response.message);
                this._isMounted && this.setState({loading_persyaratan_tambahan: false, status_attachment_file: true, errors: []}, () => {
                    this.toggleCloseModalPersyaratanTambahan()
                    this.getPersyaratanTambahan()
                });
            })
            .catch(error => {
                if(typeof error !== 'undefined'){
                    const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
                    toastr.error(message);
                    this._isMounted && this.setState({error: true, errors: error.data.errors, loading_persyaratan_tambahan: false, status_attachment_file: true});
                } else {
                    this._isMounted && this.setState({loading_persyaratan_tambahan: false, status_attachment_file: true});
                    toastr.error("Gagal Menyimpan Data");
                }
            })
        }
	}

	updatePersyaratanDetail = (payload, id) => {
        if (payload.attachment === "y" && (payload.file === null || payload.file === '' || payload.file === undefined)) {
            this.setState({ status_attachment_file: false })
        }
        else {
			this.props.updatePraQualificationPersyaratanTambahan(payload, id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading_persyaratan_tambahan: false, status_attachment_file: true, errors: []}, () => {
                    this.toggleCloseModalPersyaratanTambahan()
					this.getPersyaratanTambahan()                    
                });
			})
			.catch(error => {
				if(typeof error !== 'undefined'){
					const {message} = (typeof error !== 'undefined') ? error.data : 'Error';
					toastr.error(message);
					this._isMounted && this.setState({error: true, errors: error.data.errors, loading_persyaratan_tambahan: false, status_attachment_file: true});
				} else {
					this._isMounted && this.setState({loading_persyaratan_tambahan: false, status_attachment_file: true});
					toastr.error("Gagal Menyimpan Data");
				}
			})
		}
	}

	deletePersyaratanDetail = (id) => {
		if(this._isMounted){
			// this.setState({loading: true})
			this.props.deletePraQualificationPersyaratanTambahan(id)
			.then(res => {
				const response = res.data;
				toastr.success(response.message);
				this._isMounted && this.setState({loading_persyaratan_tambahan: false}, () => {
                    this.toggleCloseModalPersyaratanTambahan()
					this.getPersyaratanTambahan()                    
                });
			})
			.catch(error => {
					const {message} = error.data;
					if(typeof message === 'string') {
							toastr.error('Something Wrong', message);
					}
					this._isMounted && this.setState({error: true, errors: message, loading_persyaratan_tambahan: false});
			})
		}
	}

	toggleDeletePersyaratanDetail = (e, uuid) => {
        // console.log('delete')
		if(this._isMounted){
			e.preventDefault()
			this.setState({isDeletePersyaratanDetail: true, uuid_persyaratan_tambahan: uuid})
		}
	}

    savePraQualificationRegisterVendor = (payload) => {
        let status = true
        this.setState({ status_register_vendor: false})
        this.state.data_persyaratan_vendor.map(function(d, i) {
            if(d.flag_upload === 'y' && (d.syarat_file === null || d.syarat_file === '')) {
                status = false
            }
            return true;
        })
        if (status) {
            this.props.savePraQualificationRegisterVendor({
                proposal_tender_id: this.state.data.id,
                vendor_id: this.state.data_user_vendor.id
            })
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ loadingSubmit: false }, () => {
                        this.getUserVendor()
                    })
                })
                .catch(error => {
                    this.setState({ loadingSubmit: false })
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
        else {
            this.setState({ status_register_vendor: true})
        }
    }

    modal_item = async (payload) => {
		this.setState(({ loadings , modalData}) => ({
			loadings: { ...loadings, loadingModal:true},
			modalOpen:true,
			modalType:'item-detail',
			modalData: { ...modalData, items:[], item_potext : [] , account_assignment : []}
		}));
		this.props.ShowDetailPurchasingRequisition(payload)
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({  loadings , modalData}) => ({
					loadings: { ...loadings, loadingModal:false},
					modalData: { ...modalData, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
				}));
			})
			.catch((resp) => {
				toastr.error(resp.status, resp.message);
				this.setState(({  loadings }) => ({
					loadings: { ...loadings, loadingModal:false}
				}));
			});
	}

    modal_persyaratan = async (payload) => {
        this.getPersyaratan()
        this.getPersyaratanTambahan()

		this.setState(({ loadings }) => ({
            loadings: { ...loadings, loadingModal:false},
			modalOpen:true,
            modalType:'persyaratan-detail',
		}));
	}

    modal_evaluasi = async (payload) => {
        this.getKlarifikasi(payload.vendor_id)
        this.getEvaluasiVendor(payload.vendor_id)
		this.setState(({ loadings}) => ({
			loadings: { ...loadings, loadingModal:false},
            modalOpen:true,
            data_vendor_evaluasi: payload,
			modalType:'evaluasi-detail',
		}));
	}

    update_date = async (payload) => {
        let data = this.state.data
        let status_pq_date = this.state.status_pq_date
        let status_pq_date_limit = this.state.status_pq_date_limit

        let data_jadwal_pq = { ...this.state.data_jadwal_pq };
        data_jadwal_pq.pq_start_date = (payload.pq_start_date !== '' ? payload.pq_start_date : data.pq_start_date);
        data_jadwal_pq.pq_end_date = (payload.pq_end_date !== '' ? payload.pq_end_date : data.pq_end_date);
        data_jadwal_pq.pq_start_time = (payload.pq_start_time !== '' ? payload.pq_start_time : data.pq_start_time);
        data_jadwal_pq.pq_end_time = (payload.pq_end_time !== '' ? payload.pq_end_time : data.pq_end_time);

        let start_date = new Date(data_jadwal_pq.pq_start_date + ' ' + data_jadwal_pq.pq_start_time)
        let end_date = new Date(data_jadwal_pq.pq_end_date + ' ' + data_jadwal_pq.pq_end_time)
        if (start_date < end_date) {
            status_pq_date = false
        }

        let jadwal_tender = this.state.data.jadwal_tender
        if (jadwal_tender.some(d => d.jadwal_tender_code === "JT001")) {
            let index = jadwal_tender.findIndex(d => d.jadwal_tender_code === "JT001")
            let start_date_pengumuman = new Date(jadwal_tender[index].start_date + ' ' + jadwal_tender[index].start_time)
            if (end_date <= start_date_pengumuman) {
                status_pq_date_limit = false
            }
        }

        this.setState({ data_jadwal_pq, status_date: false, status_pq_date: status_pq_date, status_pq_date_limit: status_pq_date_limit })
	}

    publishPraQualification = async (payload) => {
        this.setState({ status_date: false, status_pq_date: false, status_pq_date_limit: false })
        if (this.state.data_jadwal_pq.pq_start_date !== '' && this.state.data_jadwal_pq.pq_start_date !== null
            && this.state.data_jadwal_pq.pq_end_date !== '' && this.state.data_jadwal_pq.pq_end_date !== null)
        {
            let start_date = new Date(this.state.data_jadwal_pq.pq_start_date + ' ' + this.state.data_jadwal_pq.pq_start_time)
            let end_date = new Date(this.state.data_jadwal_pq.pq_end_date + ' ' + this.state.data_jadwal_pq.pq_end_time)
            if (start_date >= end_date) {
                this.setState({ status_pq_date: true })
            }
            let jadwal_tender = this.state.data.jadwal_tender
            if (jadwal_tender.some(d => d.jadwal_tender_code === "JT001")) {
                let index = jadwal_tender.findIndex(d => d.jadwal_tender_code === "JT001")
                let start_date_pengumuman = new Date(jadwal_tender[index].start_date + ' ' + jadwal_tender[index].start_time)
                if (end_date > start_date_pengumuman) {
                    this.setState({ status_pq_date_limit: true })
                }
            }
            // return
            this.props.updatePraQualification(this.state.data.uuid, this.state.data_jadwal_pq)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ status_date: true })
                    this.getUUID()
                })
                .catch(error => {
                    if (error !== undefined) {
                        this.setState({ errors: error.data.errors })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
        else {
            this.setState({ status_date: true })
        }
	}

    savePraQualificationNotes = async (payload) => {
        if (this.state.data_catatan.note !== '')
        {
            let param = {
                proposal_tender_id: this.state.data.id,
                // process: payload.note,
                note: this.state.data_catatan.note,
                // status: payload.status,
            };
            this.props.savePraQualificationNotes(param)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({ status_catatan: true })
                    this.getUUID()
                })
                .catch(error => {
                    if (error !== undefined) {
                        // toastr.error(error.data.message)
                        this.setState({ errors: error.data.errors })
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
        else {
            this.setState({ status_catatan: false })
        }

    }

    saveEvaluasi = async (payload) => {
        let evaluasi = this.state.data_evaluasi_persyaratan_vendor;
        let status = true
        this.setState({status_catatan_evaluasi: false})
        evaluasi.map(function(d, i) {
            if((d.evaluasi_result === 'n' || d.evaluasi_result === null) && (d.evaluasi_note === '' || d.evaluasi_note === null)) {
                status = false
            }
            return true;
        })
        if (status) {
            let param = {
                proposal_tender_id: this.state.data.id,
                vendor_id: payload.vendor_id,
                result_evaluasi_vendor: payload.status,
                evaluasi_persyaratan: this.state.data_evaluasi_persyaratan_vendor,
            };
            this.props.savePraQualificationEvaluasiVendor(param)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.setState({status_catatan_evaluasi: false}, () => {
                        this.toggleClose()
                        this.getUUID()
                    })
                    // this.getKlarifikasi(payload.vendor_id)
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
        else {
            this.setState({status_catatan_evaluasi: true})
        }
    }

    saveKlarifikasiVendor = () => {
        let data_klarifikasi_submit_vendor = { ...this.state.data_klarifikasi_submit_vendor };
        data_klarifikasi_submit_vendor.vendor_id = this.state.data_user_vendor.id;
        data_klarifikasi_submit_vendor.proposal_tender_id = this.state.data.id;

        this.props.savePraQualificationKlarifikasi(data_klarifikasi_submit_vendor)
            .then((resp) => {
                toastr.success(resp.data.message);
                data_klarifikasi_submit_vendor.note = '';
                data_klarifikasi_submit_vendor.vendor_id = '';
                data_klarifikasi_submit_vendor.proposal_tender_id = '';
                data_klarifikasi_submit_vendor.file = '';
                this.setState({ data_klarifikasi_submit_vendor })
    
                this.getKlarifikasi(this.state.data_user_vendor.id)
            })
            .catch(error => {
                data_klarifikasi_submit_vendor.note = '';
                data_klarifikasi_submit_vendor.vendor_id = '';
                data_klarifikasi_submit_vendor.proposal_tender_id = '';
                data_klarifikasi_submit_vendor.file = '';
                this.setState({ data_klarifikasi_submit_vendor })

                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

    }

    saveKlarifikasi = async (payload) => {
        let data_klarifikasi_submit = { ...this.state.data_klarifikasi_submit };
        data_klarifikasi_submit.note = payload.note;
        data_klarifikasi_submit.vendor_id = payload.vendor_id;
        data_klarifikasi_submit.proposal_tender_id = this.state.data.id;
        data_klarifikasi_submit.file = payload.file_name;

        this.props.savePraQualificationKlarifikasi(data_klarifikasi_submit)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.getKlarifikasi(payload.vendor_id)
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

        // console.log(data_klarifikasi_submit)
        // this.setState({ data_jadwal_pq });
    }

    approvalPraQualification = async (payload) => {
        this.props.approvalPraQualification(this.state.data.uuid, {pq_status: payload.status})
            .then((resp) => {
                toastr.success(resp.data.message);
                this.componentDidMount()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }
    
    savePraQualificationDokumenPersyaratanTambahan = (payload) => {
        this.props.savePraQualificationDokumenPersyaratanTambahan(payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ status_attachment_file: true })
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    savePraQualificationDokumenPersyaratanVendor = (payload) => {
        // console.log(payload)
        this.props.savePraQualificationDokumenPersyaratanVendor(payload)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    toggleClose = () => {
		this.setState(({ persyaratan }) => ({
            persyaratan: { ...persyaratan, items: [], items_selected: []},
			modalOpen:false,
		}));
	}

    toggleModalPersyaratanTambahan = (e, payload) => {
		this.setState({ uuid_persyaratan_tambahan: payload, modalPersyaratanTambahan: true });
	}

    toggleCloseModalPersyaratanTambahan = () => {
		this.setState({ uuid_persyaratan_tambahan: '', modalPersyaratanTambahan: false, status_attachment_file: true });
	}

    update_persyaratan = (payload) => {
		let data = this.state.data.persyaratan;
		let data_update = this.state.persyaratan.items;

        Object.keys(data).forEach(function(key) {
            let index = data_update.findIndex( d => d.code === data[key]['code'] );
            data[key]['status'] = 'n'
            data[key].value = 'n'
			if (index !== -1) {
                data[key]['status'] = 'y'
                data[key].value = 'y'
			}
        });

        this.props.updatePraQualificationPersyaratan(this.props.match.params.id, {persyaratan: data})
        .then((resp) => {
            // console.log(resp)
            toastr.success(resp.data.message);
        })
        .catch((error) => {
            console.log(error)
        })
    }

    onInputChangeCatatan = (value) => {
        let data_catatan = { ...this.state.data_catatan };
        data_catatan.note = value
        this.setState({ data_catatan })
        // console.log(data_catatan.note)
    }

    onInputChangeEvaluasi = (code, data, value) => {
        let data_evaluasi_persyaratan_vendor = this.state.data_evaluasi_persyaratan_vendor;
        if (code === "evaluasi_result") {

            let arr = this.state.evaluasi_persyaratan.items;
            let arr_selected = this.state.evaluasi_persyaratan.items_selected;
            let arrTemp = []
            let arrTempSelected = []
            if(arr.includes(data)){
                arr.forEach((element, i) => {
                    if ((element.syarat_id + '-' + element.syarat_tipe) !== value) {
                        arrTemp.push(element)
                        arrTempSelected.push(element.syarat_id + '-' + element.syarat_tipe)
                    }
                });
                arr=arrTemp
                arr_selected=arrTempSelected
            } else {
                arr.push(data);
                arr_selected.push(value)
            }
            let arrIndex = [];
            arr.forEach((element, i) => {
                let status = data_evaluasi_persyaratan_vendor.includes(element)
                if (status) {
                    let index = data_evaluasi_persyaratan_vendor.findIndex(d => d === element);
                    arrIndex.push(index.toString())
                    data_evaluasi_persyaratan_vendor[index].evaluasi_result = "y"
                }
            });

            Object.keys(data_evaluasi_persyaratan_vendor).map(function (key, index) {
                if (!arrIndex.includes(key)) {
                    data_evaluasi_persyaratan_vendor[key]['evaluasi_result'] = "n"
                }
                return true
            })

            this.setState(({ evaluasi_persyaratan }) => ({
                evaluasi_persyaratan: { ...evaluasi_persyaratan, items: arr.sort((a,b) => a.code-b.code), items_selected: arr_selected},
                data_evaluasi_persyaratan_vendor
            }), () => {
                // console.log(this.state.evaluasi_persyaratan)
                // console.log(this.state.data_evaluasi_persyaratan_vendor)
            });
        }
        else if (code === "evaluasi_note") {
            let status = data_evaluasi_persyaratan_vendor.includes(data)
            if (status) {
                let index = data_evaluasi_persyaratan_vendor.findIndex(d => d === data);
                data_evaluasi_persyaratan_vendor[index].evaluasi_note = value
            }

            this.setState({ data_evaluasi_persyaratan_vendor });
        }
    }

    onInputChangeKlarifikasi = (code, value) => {
        let data_klarifikasi_submit_vendor = { ...this.state.data_klarifikasi_submit_vendor };
        if (code === "note") {
            data_klarifikasi_submit_vendor.note = value
        }
        else if (code === "file") {
            data_klarifikasi_submit_vendor.file = value
        }

        this.setState({ data_klarifikasi_submit_vendor }, () => {
            // console.log(data_klarifikasi_submit_vendor)
        })
    }

    onInputChangeDueDate = (date) => {
        let data_klarifikasi_submit = { ...this.state.data_klarifikasi_submit };
        data_klarifikasi_submit.due_date = this.formattingDate(date);
        this.setState({ data_klarifikasi_submit });
    }

    formattingDate(e) {
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

    formattingTime(e) {
        let time = new Date(e).toTimeString()
        return time.split(' ')[0]
    }

    renderSwitchBody(param) {
        switch(param) {
          case 'item-detail':
            return <FormDetail
						disabledForm={true}
						data={this.state.modalData}
						toggleClose={this.toggleClose}
						/>;
          case 'persyaratan-detail':
            return <div>
                    <Persyaratan
                        handleChecklist={this.handleChecklist}
                        pq_status_text={this.state.data.pq_status_text}
                        created_by={this.state.data.created_by}
                        uuid={this.props.user.uuid}
                        handleCheckAll={this.handleCheckAll}
                        persyaratan={this.state.persyaratan}
                        data_persyaratan={this.state.data_persyaratan}
                        persyaratan_tambahan={this.state.data_persyaratan_tambahan}
                        loading={this.state.loading_persyaratan_tambahan}
                        toggleDelete={this.toggleDeletePersyaratanDetail}
                        toggleFormOpen={this.toggleModalPersyaratanTambahan}
                        update_persyaratan={(payload) => this.update_persyaratan(payload)}
						disabledForm={true}
						toggleClose={this.toggleClose}
						/>  
                </div>;
          case 'evaluasi-detail':
            return <Evaluasi
                        status_text={this.state.data.pq_status_text}
                        user_uuid={this.props.user.uuid}
                        created_by={this.state.data.created_by}
                        persyaratan={this.state.evaluasi_persyaratan}
                        data_persyaratan={this.state.data_evaluasi_persyaratan_vendor}
                        data_vendor={this.state.data_vendor_evaluasi}
                        data_klarifikasi={this.state.data_klarifikasi}
                        upload={this.props.fileUpload}
                        status_catatan_evaluasi={this.state.status_catatan_evaluasi}
                        saveEvaluasi={this.saveEvaluasi}
                        saveKlarifikasi={this.saveKlarifikasi}
                        onInputChangeEvaluasi={this.onInputChangeEvaluasi}
                        onInputChangeDueDate={this.onInputChangeDueDate}
						toggleClose={this.toggleClose}
						/>;
          default:
            return <FormDetail
						disabledForm={true}
						data={this.state.modalData}
						toggleClose={this.toggleClose}
						/>;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
          case 'item-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>;
          case 'persyaratan-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Persyaratan Pra Qualification</ModalHeader>;
          case 'evaluasi-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Evaluasi Vendor</ModalHeader>;
          default:
            return <ModalHeader toggle={() => this.toggleClose()}>Modal</ModalHeader>;
        }
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                { !this.state.loading &&
                    <Form
                        data={this.state.data}
                        data_vendor={this.state.data_vendor}
                        status_date={this.state.status_date}
                        status_pq_date={this.state.status_pq_date}
                        status_pq_date_limit={this.state.status_pq_date_limit}
                        status_catatan={this.state.status_catatan}
                        status_register_vendor={this.state.status_register_vendor}
                        data_user_vendor={this.state.data_user_vendor}
                        data_klarifikasi={this.state.data_klarifikasi}
                        data_jadwal_pq={this.state.data_jadwal_pq}
                        data_persyaratan_vendor={this.state.data_persyaratan_vendor}
                        vendors={this.state.vendors}
                        vendorSelection={this.state.vendorSelection}
                        loadingSubmit={this.state.loadingSubmit}
                        loadings={this.state.loadings}
                        user={this.props.user}
                        access={this.props.access}
                        onInputChangeCatatan={this.onInputChangeCatatan}
                        onInputChangeKlarifikasi={this.onInputChangeKlarifikasi}
                        data_klarifikasi_submit_vendor={this.state.data_klarifikasi_submit_vendor}
                        handlerCheckList={(payload) => this.handlerCheckList(payload)}
                        savePraQualificationDokumenPersyaratanTambahan={this.savePraQualificationDokumenPersyaratanTambahan}
                        savePayload={(payload) => this.savePayload(payload)}
                        approvalpayload={(id,payload) => this.approvalpayload(id,payload)}
                        handleChecklistAll={this.handleChecklistAll}
                        optionsFilterBy={this.state.optionsFilterBy}
                        modal_item={(payload) => this.modal_item(payload)}
                        update_date={(payload) => this.update_date(payload)}
                        publishPraQualification={this.publishPraQualification}
                        saveKlarifikasiVendor={this.saveKlarifikasiVendor}
                        approvalPraQualification={(payload) => this.approvalPraQualification(payload)}
                        savePraQualificationNotes={this.savePraQualificationNotes}
                        savePraQualificationRegisterVendor={(payload) => this.savePraQualificationRegisterVendor(payload)}
                        savePraQualificationDokumenPersyaratanVendor={this.savePraQualificationDokumenPersyaratanVendor}
                        modal_persyaratan={(payload) => this.modal_persyaratan(payload)}
                        modal_evaluasi={(payload) => this.modal_evaluasi(payload)}
                        role_vendor={this.state.role_vendor}
                        fileUpload={this.props.fileUpload}
                        errors={this.state.errors}
                    />
                }
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    {this.renderSwitchHeader(this.state.modalType)}
					{this.state.loadings.loadingModal ? (
                        <center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					) : this.renderSwitchBody(this.state.modalType)}
				</Modal>
                { this.state.modalPersyaratanTambahan &&
                    <ModalPersyaratanTambahan
                        fileUpload={this.props.fileUpload}
                        status_attachment_file={this.state.status_attachment_file}
                        errors={this.state.errors}
                        updatePersyaratanDetail={this.updatePersyaratanDetail}
                        savePersyaratanDetail={this.savePersyaratanDetail}
                        toggleAdd={this.state.modalPersyaratanTambahan}
                        showPraQualificationPersyaratanTambahan={this.props.showPraQualificationPersyaratanTambahan}
                        toggleClose={this.toggleCloseModalPersyaratanTambahan}
                        uuid={this.state.uuid_persyaratan_tambahan}
                        proposal_tender_id={this.state.data.id}
                    />
                }
				{(this.state.isDeletePersyaratanDetail &&
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

            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
		praQualificationDetailResponse: (params) => dispatch(praQualificationDetailResponse(params)),
        showPraQualificationDetail: (id) => dispatch(showPraQualificationDetail(id)),
        showPraQualificationVendorDetail: (id, params) => dispatch(showPraQualificationVendorDetail(id, params)),
        showUserVendorDetail: (id) => dispatch(showUserVendorDetail(id)),
        updatePraQualificationPersyaratan: (id, payload) => dispatch(updatePraQualificationPersyaratan(id, payload)),      
        fetchPraQualificationVendor: (params) => dispatch(fetchPraQualificationVendor(params)),
        fetchPraQualificationPersyaratan: (id) => dispatch(fetchPraQualificationPersyaratan(id)),
        fetchPraQualificationKlarifikasi: (params) => dispatch(fetchPraQualificationKlarifikasi(params)),
        savePraQualificationKlarifikasi: (params) => dispatch(savePraQualificationKlarifikasi(params)),
        fetchPraQualificationPersyaratanTambahan: (params) => dispatch(fetchPraQualificationPersyaratanTambahan(params)),
        savePraQualificationNotes: (payload) => dispatch(savePraQualificationNotes(payload)),
        savePraQualificationRegisterVendor: (payload) => dispatch(savePraQualificationRegisterVendor(payload)),
        updatePraQualification: (id,payload) => dispatch(updatePraQualification(id,payload)),
        ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
        showPraQualificationPersyaratanTambahan: (id, payload) => dispatch(showPraQualificationPersyaratanTambahan(id, payload)),
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		savePraQualificationPersyaratanTambahan: (payload) => dispatch(savePraQualificationPersyaratanTambahan(payload)),
        updatePraQualificationPersyaratanTambahan: (id, payload) => dispatch(updatePraQualificationPersyaratanTambahan(id, payload)),
        deletePraQualificationPersyaratanTambahan: (id) => dispatch(deletePraQualificationPersyaratanTambahan(id)),
        fetchPraQualificationPersyaratanVendor: (params) => dispatch(fetchPraQualificationPersyaratanVendor(params)),
        fetchPraQualificationEvaluasiVendor: (params) => dispatch(fetchPraQualificationEvaluasiVendor(params)),
        savePraQualificationEvaluasiVendor: (payload) => dispatch(savePraQualificationEvaluasiVendor(payload)),
        savePraQualificationDokumenPersyaratanTambahan: (payload) => dispatch(savePraQualificationDokumenPersyaratanTambahan(payload)),
        savePraQualificationDokumenPersyaratanVendor: (payload) => dispatch(savePraQualificationDokumenPersyaratanVendor(payload)),
        approvalPraQualification: (id, payload) => dispatch(approvalPraQualification(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailPraQualification));

