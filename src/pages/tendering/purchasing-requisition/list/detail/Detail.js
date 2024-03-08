import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { toastr } from 'react-redux-toastr';
import { fileUpload } from '../../../../../store/actions/uploadActions';
import SweetAlert from 'react-bootstrap-sweetalert';
import {
	showPurchasingRequisition,
	updatePurchasingRequisition,
	uploadPurchasingRequisition,ShowDetailPurchasingRequisition,
	deleteAttacmentPurchasingRequisition,
	updatePurchasingRequisitionItemStatusH
} from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import Form from './Form';
import FormDetail from './FormDetail';
import FormReject from '../reject/FormReject';

class Detail extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
	}

	state = {
		uuid: (this.props.location.pathname.split("/")[4] !== undefined) ? this.props.location.pathname.split("/")[4] : '',
		purchasing_requisition: {
			header: {
				created_at: '',
				created_by: '',
				created_by_name: '',
				doc_category_bstyp: '',
				doc_category_vrtyp: '',
				document_type: '',
				id: '',
				number: '',
				status: '',
				updated_at: '',
				updated_by: '',
				uuid: '',
				work_unit_id: '',
				work_unit_name: '',
			},
			items: [],
			status_items: [],
			attachments: [],
			purchasing_orgs: [],
			company_types: [],
			vendor_types: [],
			errors: [],
			loading: true,
			loadingButton: false,
			items_selected :[]
		},
		sendData: {
			header: {},
			attachments: {},
			items: [],
		},
		loadings: {
			button: false,
			buttonUpload: false,
			loadingModal : false,
			loadingModalReject: false,
			loading_tombol_update_modal :false
		},
		optionsTipeLampiran: [
			{ value: "tor", label: "TOR" },
			{ value: "oe", label: "OE" },
			{ value: "rks", label: "RKS" },
			{ value: "lainnya", label: "LAINNYA" }
		],
		modalOpen: false,
		modalData : {
			items:[],
			item_potext : [],
			account_assignment : [],
			serviceline:[]
		},
		modalRejectOpen : false,
		modalRejectData : {
			data : [],
			uuid : ""
		},
		checkAll : false,
		isConfirm:false,
		uuidAttactment:'',
		isEditValuationPriceModal :false
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			// let uri = this.props.location.pathname.split("/")[4];
			this.showPurchasingRequisition(this.state.uuid)
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	showPurchasingRequisition = async (id) => {
		this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: true } }));
		this.props.showPurchasingRequisition(id)
			.then((resp) => {
				let arr = [];
				const data = resp.data.data;
				data.items.forEach(dt => {
					arr.push(dt.status);
				})
				this.setState(({ purchasing_requisition }) => ({
					purchasing_requisition: { ...purchasing_requisition, loading: false, header: data.header, items: data.items, status_items: arr, attachments: data.attachments }
				}));
			})
			.catch((resp) => {
				this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
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

	updatePurchasingRequisition = (id, payload) => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, buttonUpload: true, button: true } }));
		this.props.updatePurchasingRequisition(id, payload)
			.then((resp) => {
				this.setState(({ loadings }) => ({
					loadings: { ...loadings, buttonUpload: false, button: false }
				}), () => {
					this.props.history.push('/tendering/purchasing-requisition')
					// this.showPurchasingRequisition(this.state.uuid);
				});
				toastr.success(resp.data.message);
			})
			.catch((resp) => {
				this.setState(({ loadings }) => ({ loadings: { ...loadings, errors: resp.data.errors, buttonUpload: false, button: false } }));
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

	addLampiran = (payload) => {
		let arr = this.state.purchasing_requisition.attachments;
		this.uploadPurchasingRequisition(this.state.uuid, payload)
		arr.push(payload);
		this.setState(prevState => ({
			...prevState,
			purchasing_requisition: {
				...prevState.purchasing_requisition,
				attachments: arr
			}
		}))
	}

	deletePayload = (id) => {
        this.props.deleteAttacmentPurchasingRequisition(id)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.setState({ isConfirm: false , uuidAttactment:''});
                this.showPurchasingRequisition(this.state.uuid)
            })
            .catch((error) => {
                toastr.error("Delete Failed", error.message)
            })
	}
	
	toggleConfirm = (e, value) => {
		console.log(value)
        e.preventDefault();
        this.setState({ isConfirm: true, uuidAttactment: value })
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'confirm':
                this.deletePayload(this.state.uuidAttactment)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuidDeleteOrUpdate: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuidDeleteOrUpdate: '' });
                break;
        }
    }

	deleteLampiran = (payload) => {
		// console.log(payload);
		let data = this.state.purchasing_requisition.attachments;
		let arr = []
		data.forEach((element, i) => {
			if (i !== payload) {
				arr.push(element)
			}
		});
		this.setState(prevState => ({
			...prevState,
			purchasing_requisition: {
				...prevState.purchasing_requisition,
				attachments: arr
			}
		}))
	}

	modals = async (payload, isEdit) => {
		console.log(isEdit)
		this.setState(({ modalOpen, loadings , modalData}) => ({
			loadings: { ...loadings, loadingModal:true},
			modalOpen:true,
			isEditValuationPriceModal: isEdit,
			modalData: { ...modalData, items:[], item_potext : [] , account_assignment : []}
		}));
		this.props.ShowDetailPurchasingRequisition(this.state.purchasing_requisition.items[payload].uuid)
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({  loadings , modalData}) => ({
					loadings: { ...loadings, loadingModal:false},
					modalData: { ...modalData, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
				}));
			})
			.catch((resp) => {
				// this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
				toastr.error(resp.status, resp.message);
				// this.props.history.push('/home')
				this.setState(({  loadings }) => ({
					loadings: { ...loadings, loadingModal:false}
				}));
			});
	}

	toggleClose = () => {
		this.setState({ modalOpen: false })
	}

	toggleOpenReject = (uuid) => {
		if(this.state.purchasing_requisition.items_selected.length!==0 ){
			this.setState(({ modalOpenReject, modalRejectData }) => ({
				modalOpenReject:true,
				modalRejectData: { ...modalRejectData, data:this.state.purchasing_requisition.items_selected, uuid : uuid }
			}));
		}else{
			toastr.warning("Warning", "Please Select Your Items");
		}
	}

	toggleCloseReject = () => {
		this.setState({ modalOpenReject: false })
	}

	handlerCheckList = (uuid) => {
		let arr_selected = this.state.purchasing_requisition.items_selected;
		// let arrTemp = []
		let arrTempSelected = []
		if(this.state.purchasing_requisition.items_selected.includes(uuid)){
			
			this.state.purchasing_requisition.items_selected.forEach((element, i) => {
				if (element!==uuid) {
					arrTempSelected.push(element)
				}
			});
			arr_selected=arrTempSelected
		} else {
			arr_selected.push(uuid)
		}
	
		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items_selected: arr_selected }
		}));
	}

	handleChecklistAll = () => {
		console.log('object')
		let arr_selected = this.state.purchasing_requisition.items_selected;
		if(!this.state.checkAll){
			this.state.purchasing_requisition.items.forEach((element, i) => {
				// if(!this.props.user.has_roles.includes("KBGPNG")){
				// 	if (!arr_selected.includes(element.uuid) && element.status!=="p") {
				// 		arr_selected.push(element.uuid)
				// 	}
				// }else{
				// 	if (!arr_selected.includes(element.uuid) && element.status==="p") {
				// 		arr_selected.push(element.uuid)
				// 	}
				// }
				
				if (this.props.user.has_roles.includes("PRPLNR") && element.status==="o"){
					if (!arr_selected.includes(element.uuid) && element.status==="o") {
						arr_selected.push(element.uuid)
					}
				}else if (this.props.user.has_roles.includes("KBGPNG") && element.status==="p") {
					if (!arr_selected.includes(element.uuid) && element.status==="p") {
						arr_selected.push(element.uuid)
					}
				}
			});
		}else{
			arr_selected=[]
		}
		
		console.log(arr_selected)
		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items_selected: arr_selected },
			checkAll : !this.state.checkAll
		}));
	}

	savePurchasingRequisitionItemStatusH = (id,payload) => {
		this.setState(({ loadings, purchasing_requisition }) => ({ 
			loadings: { ...loadings, loading_tombol_update_modal:true },
		}));
		this.props.updatePurchasingRequisitionItemStatusH(id, payload)
		.then((resp) => {
			toastr.success(resp.data.message);
			this.setState(({ loadings, purchasing_requisition }) => ({ 
				loadings: { ...loadings, loading_tombol_update_modal:false },
			}));
			this.showPurchasingRequisition(this.state.uuid)
		})
		.catch((resp) => {
			this.setState(({ loadings, purchasing_requisition }) => ({ 
				loadings: { ...loadings, loading_tombol_update_modal:false },
				modalOpen : false
			}));
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

	render() {
		const {t} = this.props;
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Purchase Requisition Detail</li>
				</ol>
				<h1 className="page-header">Purchase Requisition Detail </h1>
				<Form
					parentState={this.state}
					upload={this.props.fileUpload}
					addLampiran={this.addLampiran}
					deleteLampiran={this.deleteLampiran}
					update={this.updatePurchasingRequisition}
					parentProps={this.props}
					modals={(payload,isEdit) => this.modals(payload,isEdit)}
					handlerCheckList={(payload) => this.handlerCheckList(payload)}
					toggleOpenReject={(payload) => this.toggleOpenReject(payload)}
					toggleConfirm={(e,payload) => this.toggleConfirm(e,payload)}
					handleChecklistAll={this.handleChecklistAll}
				/>

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
						loadings={this.state.loadings}
						isEditValuationPriceModal={this.state.isEditValuationPriceModal}
						save={(id,payload) => this.savePurchasingRequisitionItemStatusH(id, payload)}
						/>
					)}
				</Modal>

				<Modal isOpen={this.state.modalOpenReject} toggle={() => this.toggleCloseReject()} >
					<ModalHeader toggle={() => this.toggleCloseReject()}>Reject Data</ModalHeader>
					{this.state.loadings.loadingModalReject && (
						<center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					)}
					  {this.state.loadings.loadingModalReject === false && (
						<FormReject
						data = {this.state.modalRejectData.data}
						uuid = {this.state.modalRejectData.uuid}
						update={this.updatePurchasingRequisition}
						loadings={this.state.loadings.button}
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
                    onConfirm={() => this.toggleSweetAlert('confirm')}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
			</div>

		);
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
		fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
		showPurchasingRequisition: (id) => dispatch(showPurchasingRequisition(id)),
		deleteAttacmentPurchasingRequisition: (id) => dispatch(deleteAttacmentPurchasingRequisition(id)),
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		updatePurchasingRequisition: (id, payload) => dispatch(updatePurchasingRequisition(id, payload)),
		uploadPurchasingRequisition: (id, payload) => dispatch(uploadPurchasingRequisition(id, payload)),
		updatePurchasingRequisitionItemStatusH : (id, payload) => dispatch(updatePurchasingRequisitionItemStatusH(id, payload))
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Detail));