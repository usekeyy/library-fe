import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { fetchBidangUsaha } from '../../../../store/actions/master/bidangUsahaActions';
import { fetchSubBidangUsaha } from '../../../../store/actions/master/subBidangUsahaActions';
import { fetchAanwijzingSAPVendor, saveAanwijzingSAP } from '../../../../store/actions/tendering/aanwijzingActions';
import { fetchMetodeAanwijzing } from '../../../../store/actions/master/metodeAanwijzingActions';

import Form from './Form'
import ModalEdoc from './ModalEdoc'
import ReactLoading from 'react-loading';

export class DetailCreateSap extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
			role_vendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            data: [],
            data_vendor: [],
            metode_aanwijzing: [
                {
                    label: 'E-Aanwijzing',
                    value: '1'
                },
                {
                    label: 'Aanwijzing Manual',
                    value: '2'
                },
            ],
            metode_aanwijzing_id: '',
            data_jadwal: {
                start_date: '',
                end_date: '',
                start_time: '',
                end_time: '',
            },
            vendor_checklist: {
                items: [],
                items_selected: [],
            },  
            status_date: true,
            param_modal: [],
            loading: false,
            select_params: {
                start: 0,
                length: 10,
            },
            status_document: false,
            sendData: {
                bidang_usaha_id: '',
                sub_bidang_usaha_id: '',
				edocs: [],
            },
            data_sos: {
                bidang_usaha_id: [],
                sub_bidang_usaha_id: [],
            },
            m_metode_aanwijzing: [],
            m_bidang_usaha: [],
            m_sub_bidang_usaha: [],
			tempData: {
				edocs: {
					id: '',
					title: '',
					items: [],
				},
			},
            isDisabled: {
                metode_aanwijzing_id: false,
                bidang_usaha_id: false,
                sub_bidang_usaha_id: true,
            },
            loadings: {
                loadingModal: false,
				modalsEdoc: false,
				edoc: false,
                metode_aanwijzing_id: false,
                bidang_usaha_id: false,
                sub_bidang_usaha_id: false,
                button: false,
            },
            errors: [],
            status_check_all: false,
            status_sos_input: false,
            status_vendor: false,
            status_metode: false,
            status_jadwal: false,
            isConfirm: false,
            loadingSubmit: false,
            modalOpen: false,
			modalOpenEdoc: false,
            modalType:'',
            uuid:'',
            code_confirm:'',
			proposal_tender: {
				edoc: [],
				items: [],
			},
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        if (this.props.location.state === undefined ) {
            window.history.back()
        }
        else {
            if (this._isMounted) {
                this.fetchMetodeAanwijzing('')
                this.fetchBidangUsaha('')
                // this.fetchSubBidangUsaha('')
                // this.getUUID()
            }
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleFormOpen = () => {
		this.setState({ modalOpen:true });
	}

    toggleClose = () => {
		this.setState({ modalOpen:false, modalType:'' });
	}

    toggleDelete = (e, value, code) => {
        // console.log(e)
        e.preventDefault();
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
        this.setState({ isConfirm: true, uuid: uuid, code_confirm: code })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'delete-dokumen':
                this.deleteDocument()
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    fetchMetodeAanwijzing = (newValue) => {
        this.setState(({ loadings }) => ({
            loadings: { ...loadings, metode_aanwijzing_id: true },
        }));

        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchMetodeAanwijzing(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, metode_aanwijzing_id: false },
                    m_metode_aanwijzing: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings }) => ({
                    loadings: { ...loadings, metode_aanwijzing_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchBidangUsaha = (newValue) => {
        this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, bidang_usaha_id: true },
        }));

        let select_params = (newValue !== '') ? {start: 0, length: 10, select: newValue} : this.state.select_params;
        this.props.fetchBidangUsaha(select_params)
            .then((resp) => {
                // console.log(resp)
                let data = resp.data.data;
                let options = data.map((data) => {
                    return { value: data.id, label: data.id + ' - ' + data.name};
                });
                this.setState(({ loadings, isDisabled }) => ({
                    loadings: { ...loadings, bidang_usaha_id: false },
                    m_bidang_usaha: options,
                }));
            })
            .catch((resp) => {
                this.setState(({ loadings, isDisabled }) => ({
                    loadings: { ...loadings, bidang_usaha_id: false },
                }));
                toastr.error(resp.data.message);;
            });
    };

    fetchSubBidangUsaha = (newValue) => {
        this.setState(({ loadings, isDisabled }) => ({
            loadings: { ...loadings, sub_bidang_usaha: true },
            isDisabled: { ...isDisabled, sub_bidang_usaha_id: true },
        }));

        let bidang_usaha_id = this.state.sendData.bidang_usaha_id;
        if (bidang_usaha_id !== null || bidang_usaha_id !== '') {
            let select_params = (newValue !== '') ?
              {start: 0, length: 10, bidang_usaha_id: bidang_usaha_id.value, select: newValue} : 
              {start: 0, length: 10, bidang_usaha_id: bidang_usaha_id.value};
    
            this.props.fetchSubBidangUsaha(select_params)
                .then((resp) => {
                    // console.log(resp)
                    let data = resp.data.data;
                    let options = data.map((data) => {
                        return { value: data.id, label: data.id + ' - ' + data.name};
                    });
                    this.setState(({ loadings, isDisabled }) => ({
                        loadings: { ...loadings, sub_bidang_usaha: false },
                        m_sub_bidang_usaha: options,
                        isDisabled: { ...isDisabled, sub_bidang_usaha_id: false },
                    }));
                })
                .catch((resp) => {
                    this.setState(({ loadings, isDisabled }) => ({
                        loadings: { ...loadings, sub_bidang_usaha: false },
                        isDisabled: { ...isDisabled, sub_bidang_usaha_id: false },
                    }));
                    toastr.error(resp.data.message);;
                });
        }
    };

    fetchAanwijzingSAPVendor = (param1, param2) => {
        let param = {
            uuid:this.state.uuid,
            bidang_usaha: param1,
            sub_bidang_usaha: param2,
        }
        this.props.fetchAanwijzingSAPVendor(param)
            .then((resp) => {
                let datas = resp.data.data;
                let arr = this.state.vendor_checklist.items;
                let arr_selected = this.state.vendor_checklist.items_selected;
                
                Object.keys(datas).forEach(function(key) {
                    if(datas[key]['selected'] === "y"){
                        arr.push(datas[key]);
                        arr_selected.push(datas[key]['vendor_id'])
                    }
                });
                this.setState(({ vendor_checklist }) => ({
                    vendor_checklist: { ...vendor_checklist, items: arr.sort((a,b) => a.vendor_id-b.vendor_id), items_selected: arr_selected},
                    data_vendor: datas
                }));
            })
            .catch((resp) => {
                // this.setState({ loading: false });
                toastr.error(resp.data.message);;
            });

    }

    update_date = async (payload) => {
        let data_jadwal = { ...this.state.data_jadwal };
        data_jadwal.start_date = payload.start_date;
        data_jadwal.end_date = payload.end_date;
        data_jadwal.start_time = payload.start_time;
        data_jadwal.end_time = payload.end_time;
        this.setState({ data_jadwal, status_date: true })
	}

    handleChecklist = (e, payload, vendor_id) => {
        let arr = this.state.vendor_checklist.items;
        let arr_selected = this.state.vendor_checklist.items_selected;
        let arrTemp = []
        let arrTempSelected = []
        if(arr.includes(payload)){
            arr.forEach((element, i) => {
                if (element.vendor_id!==vendor_id) {
                    arrTemp.push(element)
                    arrTempSelected.push(element.vendor_id)
                }
            });
            arr=arrTemp
            arr_selected=arrTempSelected
        } else {
            arr.push(payload);
            arr_selected.push(vendor_id)
        }

        this.setState(({ vendor_checklist }) => ({
            vendor_checklist: { ...vendor_checklist, items: arr.sort((a,b) => a.vendor_id-b.vendor_id), items_selected: arr_selected}
        }));
    }
    
    handleCheckAll = (e) => {
        let status_check_all = this.state.status_check_all
        let data_vendor = this.state.data_vendor
        let arr = this.state.vendor_checklist.items;
        let arr_selected = this.state.vendor_checklist.items_selected;
        // let arrTemp = []
        let arrTempSelected = []

        if (status_check_all === true) {
            this.setState(({ vendor_checklist }) => ({
                vendor_checklist: { ...vendor_checklist, items: [], items_selected: []},
                status_check_all: false
            }));    
        }
        else {
            data_vendor.forEach((element, i) => {
                arrTempSelected.push(element.vendor_id)
            })
            arr = data_vendor
            arr_selected = arrTempSelected

            this.setState(({ vendor_checklist }) => ({
                vendor_checklist: { ...vendor_checklist, items: arr, items_selected: arr_selected},
                status_check_all: true
            }));
        }
    }

    modal_dokumen = async (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            modalOpen:true,
			param_modal: payload,
			modalType:'dokumen',
        }));
	}

    saveAanwijzingSAP = (payload) => {
        this.setState({ status_metode: false, status_jadwal: false, status_vendor: false })
        let arr = this.state.vendor_checklist.items;
        let data_jadwal = this.state.data_jadwal
        let edoc = this.state.proposal_tender.edoc
        let edoc_title = ''
        let edoc_item = []

        if (this.state.metode_aanwijzing_id === '') {
            this.setState({ status_metode: true })
            return
        }
        if (data_jadwal.start_date === '' || data_jadwal.end_date === '' || data_jadwal.start_time === '' || data_jadwal.end_time === '') {
            this.setState({ status_jadwal: true })
            return
        }
        if (arr.length === 0 ) {
            this.setState({ status_vendor: true })
            return
        }
        
        if (edoc.length > 0 ) {
            edoc_title = edoc[0].title
            edoc_item = edoc[0].edoc.items

        }
        let param = {
            reference: this.props.location.state.referensi,
            metode_aanwijzing_id: this.state.metode_aanwijzing_id,
            start_date: data_jadwal.start_date,
            end_date: data_jadwal.end_date,
            start_time: data_jadwal.start_time,
            end_time: data_jadwal.end_time,
            document_title: edoc_title,
            documents: edoc_item,
            vendors: this.state.vendor_checklist.items
        } 
        this.props.saveAanwijzingSAP(param)
            .then((resp) => {
                console.log(resp)
                toastr.success(resp.data.message);
            })
            .catch(error => {
                if (error !== undefined) {
                    this.setState({ error: true, errors: error.data.errors });
                    toastr.error(error.data.message)
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })

    }

    setMetodeAanwijzing = (payload) => {
        this.setState({ metode_aanwijzing_id: payload });
    }

    setBidangUsaha = (payload) => {
        this.setState(({ sendData }) => ({
            sendData: { ...sendData, bidang_usaha_id: payload },
        }), () => {
            this.fetchSubBidangUsaha('')
        });        
    }

    setSubBidangUsaha = (payload) => {
        this.setState(({ sendData }) => ({
            sendData: { ...sendData, sub_bidang_usaha_id: payload },
        }));        
    }

    addSos = () => {
        let bidang_usaha_id = this.state.data_sos.bidang_usaha_id
        let sub_bidang_usaha_id = this.state.data_sos.sub_bidang_usaha_id
        let sendData = this.state.sendData

        this.setState({ status_sos_input: false})
        if (sendData.bidang_usaha_id === '' || sendData.sub_bidang_usaha_id === '') {
            this.setState({ status_sos_input: true})
            return
        }

        if (!bidang_usaha_id.some(d => d.value === sendData.bidang_usaha_id.value)) {
            bidang_usaha_id.push(sendData.bidang_usaha_id);
        }
        if (!sub_bidang_usaha_id.some(d => d.value === sendData.sub_bidang_usaha_id.value)) {
            sub_bidang_usaha_id.push(sendData.sub_bidang_usaha_id);
        }

        let list_bidang_usaha = '';
        let list_sub_bidang_usaha = '';

        // eslint-disable-next-line array-callback-return
        bidang_usaha_id.map(function(item, index) {
            if (bidang_usaha_id[index + 1]) {
                list_bidang_usaha += item.value + ';'
            }
            else {
                list_bidang_usaha += item.value
            }
        })
        // eslint-disable-next-line array-callback-return
        sub_bidang_usaha_id.map(function (item, index) {
                if (sub_bidang_usaha_id[index + 1]) {
                    list_sub_bidang_usaha += item.value + ';';
                }
                else {
                    list_sub_bidang_usaha += item.value;
                }
            })

        this.setState(({ data_sos }) => ({
            data_sos: { ...data_sos, bidang_usaha_id: bidang_usaha_id.sort((a,b) => a.value-b.value), sub_bidang_usaha_id: sub_bidang_usaha_id.sort((a,b) => a.value-b.value) },
        }), () => {
            this.fetchAanwijzingSAPVendor(list_bidang_usaha, list_sub_bidang_usaha)
        });
    }

    resetSos = () => {
        this.setState(({ data_sos }) => ({
            data_sos: { ...data_sos, bidang_usaha_id: [], sub_bidang_usaha_id: [] },
            data_vendor: []
        }));
    }

    modalConfirm = async (payload) => {
        this.setState({ status_dokumen_confirm: false })
        if (this.state.document_confirm.length === 0 ){
            this.setState({ status_dokumen_confirm: true })
        }
        else {

            this.setState(({ loadings}) => ({
                loadings: { ...loadings, loadingModal:false },
                modalOpen:true,
                status_dokumen_confirm: false,
                modalType:'confirm',
            }));
        }
	}

    renderSwitchBody(param) {
        switch(param) {
          default:
            return ;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
          default:
            return ;
        }
    }


	modalsEdoc = async (payload) => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, loadingModalEdoc: false, button: false},
			modalOpenEdoc: true
		}));
	}

	toggleCloseEdoc = () => {
		const edocTemp = {...this.state.tempData.edocs};
		edocTemp.id = '';
		edocTemp.title = '';
		edocTemp.items = [];
		this.setState(({ tempData }) => ({
			modalOpenEdoc: false,
			tempData: { ...tempData, edocs: edocTemp },
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
			}, status_document: true
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

    render() {
        const {t} = this.props;
        return (
            <div>
                <h1 className="page-header">Aanwijzing Configuration<small></small></h1>
                <Form
                    role_vendor={this.state.role_vendor}
                    errors={this.state.errors}
                    param={this.props.location.state}
                    data={this.state.data}
                    user={this.props.user}
                    metode_aanwijzing={this.state.m_metode_aanwijzing}
                    setMetodeAanwijzing={this.setMetodeAanwijzing}
                    data_jadwal={this.state.data_jadwal}
                    status_date={this.state.status_date}
                    status_document={this.state.status_document}
                    update_date={this.update_date}
                    modal_dokumen={this.modal_dokumen}
                    toggleDelete={this.toggleDelete}
                    fetchBidangUsaha={this.fetchBidangUsaha}
                    fetchSubBidangUsaha={this.fetchSubBidangUsaha}
                    m_bidang_usaha={this.state.m_bidang_usaha}
                    m_sub_bidang_usaha={this.state.m_sub_bidang_usaha}
                    setBidangUsaha={this.setBidangUsaha}
                    setSubBidangUsaha={this.setSubBidangUsaha}
                    addSos={this.addSos}
                    resetSos={this.resetSos}
                    loadings={this.state.loadings}
                    isDisabled={this.state.isDisabled}
                    sos_vendor={this.state.sendData}
                    data_sos={this.state.data_sos}
                    data_vendor={this.state.data_vendor}
                    handleChecklist={this.handleChecklist}
                    handleCheckAll={this.handleCheckAll}
                    status_check_all={this.state.status_check_all}
                    vendor_checklist={this.state.vendor_checklist}
                    status_sos_input={this.state.status_sos_input}
                    status_metode={this.state.status_metode}
                    status_jadwal={this.state.status_jadwal}
                    status_vendor={this.state.status_vendor}
                    saveAanwijzingSAP={this.saveAanwijzingSAP}
                    modalsEdoc={this.modalsEdoc}
                    editEdoc={this.editEdoc}
                    deleteEdoc={this.deleteEdoc}
                    data_edocs={this.state.proposal_tender}
                />
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

                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={t("common:delete.approve-delete")}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert(this.state.code_confirm)}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
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
        fetchAanwijzingSAPVendor: (params) => dispatch(fetchAanwijzingSAPVendor(params)),
        // showPurchaseOrder: (id) => dispatch(showPurchaseOrder(id)),
		saveAanwijzingSAP: (payload) => dispatch(saveAanwijzingSAP(payload)),
        // updatePurchaseOrderItemDetail: (id, payload) => dispatch(updatePurchaseOrderItemDetail(id, payload)),
        fetchMetodeAanwijzing: (params) => dispatch(fetchMetodeAanwijzing(params)),
        fetchBidangUsaha: (params) => dispatch(fetchBidangUsaha(params)),
        fetchSubBidangUsaha: (params) => dispatch(fetchSubBidangUsaha(params)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailCreateSap));

