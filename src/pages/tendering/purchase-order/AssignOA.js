import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
import { showPurchasingRequisitionListItem, showPurchasingRequisitionListItemAssignProcessing, savePurchasingRequisitionAssign, showPurchasingRequisitionListAttachment, assignPurchasingRequisition, ShowDetailPurchasingRequisition, fetchPurchasingRequisitionOA, updateOAPurchasingRequisition, deleteAssignPOOA } from '../../../store/actions/tendering/purchasingRequisitionActions';
import { syncPRPrice } from '../../../store/actions/tendering/OutlineAgreementActions';
import { setSelectedItemsPr, getOA, createPurchaseOrder } from '../../../store/actions/tendering/proposalTenderActions';
import { savePurchaseOrderOA } from '../../../store/actions/tendering/PurchaseOrderActions';
import { fetchUsers } from '../../../store/actions/utility/usersActions';
import List from './assign-oa/List';
import Item from './assign-oa/Item';
// import DetailOA from './assign-oa/DetailOA';
import FormDetail from './assign-oa/FormDetail';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';

class AssignOA extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this.childList = React.createRef();
		this.childItem = React.createRef();
		this._data = []
		this.state = {
			data_list: [],
			purchasing_requisition: {
				sendData: {
					determination_id: { value: "eproc", label: "E-Proc"},
					user_id: '',
					items: []
				},
				datas: [],
				items_tender: [], 
				items_tender_selected: [], 
				items_oa: [],
				items: [],
				attachments: [],
				items_selected: [],
				errors: [],
				loading: true,
				loadingButton: false
			},
			sendData: {
				items: [],
				source_determination: '',
				assign_to_buyer: '',
			},
			loadings: {
				button: false,
				buttonUpload: false,
				items: false,
				showItems: false,
				users: false,
				determination: false
			},
			loading: false,
			m_determination: [
				{ value: "eproc", label: "E-Proc" },
				{ value: "sap", label: "SAP" },
			],
			status_processing: false,
			m_users: [],
			modalOpen: false,
			modalType: '',
			modalData : {
				data_header:[],
				data_oa : [],
				items:[],
				item_potext : [],
				account_assignment : [],
				serviceline:[]
			}
		}
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			this.props.setSelectedItemsPr({type: false, data: []});
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
			return;
		};
	}

	setLoading = (type) => {
		this.setState({ loading: type })
	}
	
	setListData = (data) => {
		this.setState({ data_list: data })
	}

	handleCheckAll = (isCheckAll) => {
		const {data_list} = this.state;
		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items: [], items_selected: []}
		}));
		let arr_selected = this.state.purchasing_requisition.items_selected;
		if(isCheckAll){
			if(data_list.length > 0){
				data_list.map(item => {
					item.purchasing_requisition_item_id = item.id
					item.no_oa = item.outline_agreement
					item.item_oa = item.princ_agreement_item
					item.vendor = item.fixed_vendor
					arr_selected.push(item.uuid)
					return true
				})
			}
			this.setState(({ purchasing_requisition }) => ({
				purchasing_requisition: { ...purchasing_requisition, items: data_list.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number), items_selected: arr_selected}
			}));
			this.showPurchasingRequisitionListAttachment(arr_selected)
		} else {
			this.setState(({ purchasing_requisition }) => ({
				purchasing_requisition: { ...purchasing_requisition, items: [], items_selected: []}
			}));
		}
	}

	handleChecklist = (e, payload, uuid) => {
		let arr = this.state.purchasing_requisition.items;
		let arr_selected = this.state.purchasing_requisition.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.uuid!==uuid) {
					element.purchasing_requisition_item_id = payload.id
					element.no_oa = payload.outline_agreement
					element.item_oa = payload.princ_agreement_item
					element.vendor = payload.fixed_vendor
					arrTemp.push(element)
					arrTempSelected.push(element.uuid)
				} 
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
			if (arr_selected.includes(uuid)){
				arr.forEach((item, key) => {
					if (item.uuid === uuid) {
						const index = arr.indexOf(key);
						arr.splice(index, 1)
						arr_selected.splice(index, 1)
					}
				});
			} else {
				payload.purchasing_requisition_item_id = payload.id
				payload.no_oa = payload.outline_agreement
				payload.item_oa = payload.princ_agreement_item
				payload.vendor = payload.fixed_vendor
				arr.push(payload);
				arr_selected.push(uuid)
			}
		}

		let processing = ''
		let status_processing = false
		arr.forEach((item, key) => {
			if (key === 0) {
				processing = item.outline_agreement
			}
			else {
				if (processing !== item.outline_agreement) {
					status_processing = true
				}
			}
		});

		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number), items_selected: arr_selected},
			status_processing: status_processing
		}), () => { 
			this.showPurchasingRequisitionListAttachment(arr_selected)
		});
	}

	setSendData = (payload) => {
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, items: this.state.purchasing_requisition.items_selected, assign_to_buyer: payload.user_id, source_determination: payload.determination_id}
		}));
	}

	syncPRPrice = (payload) => {
		this.props.syncPRPrice('')
			.then((resp) => {
				toastr.success(resp.data.message);
				window.location.reload();
			})
			.catch((resp) => {
				toastr.error(resp.status, resp.data.message);
			});
	}

	savePurchasingRequisitionAssign = (payload) => {
		this.setState(({ loadings, purchasing_requisition }) => ({ 
			loadings: { ...loadings, buttonUpload: true, button: true },
			purchasing_requisition: { ...purchasing_requisition, errors: [] }
		}));
		this.setSendData(payload)
		this.props.savePurchasingRequisitionAssign(this.state.sendData)
			.then((resp) => {
				toastr.success(resp.data.message);
				this.setState(({ loadings, purchasing_requisition }) => ({ 
					purchasing_requisition: { ...purchasing_requisition, errors: [] },
					loadings: { ...loadings, buttonUpload: false, button: false } 
				}), () => { window.history.back(); });
			})
			.catch((resp) => {
				this.setState(({ loadings, purchasing_requisition }) => ({ 
					loadings: { ...loadings, buttonUpload: false, button: false },
					purchasing_requisition: { ...purchasing_requisition, errors: resp.data.errors }
				}));
				toastr.error(resp.status, resp.data.message);
			});
	}

	assignPurchasingRequisition = (uuid, payload) => {
		this.setState(({ loadings, purchasing_requisition }) => ({ 
			loadings: { ...loadings, buttonUpload: true, button: true, showItems: true },
			purchasing_requisition: { ...purchasing_requisition, errors: [], items: [] }
		}));
		this.props.assignPurchasingRequisition(uuid, payload)
			.then((resp) => {
				// const arr_tender = this.state.purchasing_requisition.items_tender;
				// const arr_tender_selected = this.state.purchasing_requisition.items_tender_selected;
				toastr.success(resp.data.message);
				setTimeout(() => {
					this.childList.current.fetchData()
					// const obj = {}
					// obj[uuid] = payload.target;
					// if(!arr_tender_selected.includes(uuid)){
					// 	arr_tender.push({id: uuid, name: payload.target})
					// 	arr_tender_selected.push(uuid)
					// }
					// this.setState(({ purchasing_requisition }) => ({
					// 	purchasing_requisition: { ...purchasing_requisition, items_tender: arr_tender }
					// }));
					// // this.setState(({ loadings, purchasing_requisition }) => ({ 
					// // 	purchasing_requisition: { ...purchasing_requisition, errors: [] },
					// // 	loadings: { ...loadings, buttonUpload: false, button: false, showItems: false } 
					// // }));
				}, 1000)
			})
			.catch((resp) => {
				this.setState(({ loadings, purchasing_requisition }) => ({ 
					loadings: { ...loadings, buttonUpload: false, button: false, showItems: false },
					purchasing_requisition: { ...purchasing_requisition, errors: resp.data.errors }
				}));
				toastr.error(resp.status, resp.data.message);
			});
	}

	showPurchasingRequisitionListAttachment = (payload) => {
		this.setState(({ loadings, purchasing_requisition }) => ({ 
			purchasing_requisition: { ...purchasing_requisition, errors: [], attachments: [] },
			loadings: { ...loadings, buttonUpload: true, button: true, items: true } 
		}));
		let params={
			items:payload,
			column: "number_pr",
			dir: "desc"};
		this.props.showPurchasingRequisitionListAttachment(params)
			.then((resp) => {
				this.setState(({ loadings, purchasing_requisition }) => ({ 
					purchasing_requisition: { ...purchasing_requisition, errors: [], attachments: resp.data.data },
					loadings: { ...loadings, buttonUpload: false, button: false, items: false } 
				}));
				toastr.success(resp.data.message);
			})
			.catch((resp) => {
				this.setState(({ loadings, purchasing_requisition }) => ({ 
					purchasing_requisition: { ...purchasing_requisition, errors: resp.data.errors, attachments: [] },
					loadings: { ...loadings, buttonUpload: false, button: false, items: false } 
				}));
				// toastr.error(resp.status, resp.data.message);
			});
	}

	setItems = (data) => {
		const arr = [];
		data.forEach((item, key) => {
			if(this.state.purchasing_requisition.items_selected.includes(item.uuid)){
				arr.push(item)
			}
		})
		this.setState(({ loadings, purchasing_requisition }) => ({ 
			purchasing_requisition: { ...purchasing_requisition, errors: [], datas: [], items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number) },
			loadings: { ...loadings, buttonUpload: false, button: false, showItems: false } 
		}));
	}

	submitPraProposalTender = () => {
		this.setState({ status_processing: false })
		const items = this.state.purchasing_requisition.items;
		let processing = ''
		let status_processing = false
		items.forEach((item, key) => {
			if (key === 0) {
				processing = item.outline_agreement
			}
			else {
				if (processing !== item.outline_agreement) {
					status_processing = true
				}
			}
		});
		if (status_processing) {
			this.setState({ status_processing: status_processing })
			return
		}

		// console.log(items)
		this.props.savePurchaseOrderOA({ param: items })
			.then((resp) => {
				console.log(resp)
				toastr.success(resp.data.message);
				this.props.history.push('/perikatan/purchase-order/detail/' + resp.data.data.uuid)
				// window.location.reload();
			})
			.catch((resp) => {
				// console.log(resp)
				toastr.error(resp.data.message);
			});
	}

	toggleClose = () => {
		this.setState({ modalOpen: false })
	}

	modals = async (payload, type, data) => {
		this.setState(({ loadings, modalData}) => ({
			loadings: { ...loadings, loadingModal:true, button: true},
			modalOpen:true,
			modalType: type,
			modalData: { ...modalData, items:[], item_potext : [] , account_assignment : [], data_header: data, data_oa: []}
		}));
		// console.log(type);
		const params = (type === 'items') ? this.state.purchasing_requisition.items[payload].uuid : payload;
		if (type === 'items') {
			this.props.ShowDetailPurchasingRequisition(params)
				.then((resp) => {
					const datas = resp.data.data;
					this.setState(({  loadings , modalData}) => ({
						loadings: { ...loadings, loadingModal:false, button: false},
						modalData: { ...modalData, items:datas.items, item_potext : datas.item_potext , account_assignment : datas.account_assignment, serviceline:datas.serviceLine}
					}));
				})
				.catch((resp) => {
					// this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
					toastr.error(resp.status, resp.message);
					// this.props.history.push('/home')
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loadingModal:false, button: false}
					}));
				});
		}
		if (type === 'oa') {
			let param = {
				material_no: data.material_id,
				material_group_no: data.material_group_id,
				plant: data.plant_id,
				purchasing_group_id: data.purchasing_group_id,
				purchasing_prg_id: data.purchasing_org_id
			}
			this.props.getOA(param)
				.then((resp) => {
					const datas = resp.data.data;
					this.setState(({ loadings, modalData }) => ({
						loadings: { ...loadings, loadingModal:false, button: false},
						modalData: { ...modalData, data_oa : datas.list}
					}), () => {
						// console.log(data)
						// console.log(param)
					});
				})
				.catch((resp) => {
					// this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
					toastr.error(resp.status, resp.message);
					// this.props.history.push('/home')
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loadingModal:false, button: false}
					}));
				});
		}
		else {
			const params = (type === 'items') ? this.state.purchasing_requisition.items[payload].uuid : payload;
			this.props.ShowDetailPurchasingRequisition(params)
				.then((resp) => {
					const data = resp.data.data;
					this.setState(({  loadings , modalData}) => ({
						loadings: { ...loadings, loadingModal:false, button: false},
						modalData: { ...modalData, items:data.items, item_potext : data.item_potext , account_assignment : data.account_assignment, serviceline:data.serviceLine}
					}));
				})
				.catch((resp) => {
					// this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: false } }));
					toastr.error(resp.status, resp.message);
					// this.props.history.push('/home')
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loadingModal:false, button: false}
					}));
				});
		}
	}

    renderSwitchBody(param) {
        switch(param) {
			default:
				return <FormDetail
					disabledForm={true}
					data={this.state.modalData}
					toggleClose={this.toggleClose}
				/>
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
        //   case 'oa':
        //     return <ModalHeader toggle={() => this.toggleClose()}>Contract References</ModalHeader>;
          default:
            return <ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader>;
        }
    }

	render(){
		// const {t} = this.props;
		// console.log(this.state.purchasing_requisition.items_tender_selected);
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Perikatan</li>
					<li className="breadcrumb-item active">Assign Purchase Order - Outline Agreement</li>
				</ol>
				<h1 className="page-header">Assign Purchase Order - Outline Agreement </h1>
				<List
					ref={this.childList}
					handleChecklist={this.handleChecklist}
					handleCheckAll={this.handleCheckAll}
					setLoading={this.setLoading}
					parentProps={this.props}
					fetchPurchasingRequisition={this.props.fetchPurchasingRequisitionOA}
					deleteAssignPOOA={this.props.deleteAssignPOOA}
					parentState={this.state}
					syncPRPrice={this.syncPRPrice}
					setListData={this.setListData}
					setItems={this.setItems}
					modals={this.modals}
					access={this.props.access}
				/>
				<Item
					ref={this.childItem}
					parentState={this.state}
					assignPurchasingRequisition={this.assignPurchasingRequisition}
					submitPraProposalTender={this.submitPraProposalTender}
					modals={this.modals}
					t={this.props.t}
				/>
				<Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
					{this.renderSwitchHeader(this.state.modalType)}
					{/* <ModalHeader toggle={() => this.toggleClose()}>Detail Item</ModalHeader> */}
					{this.state.loadings.loadingModal && (
						<center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					)}
					{this.state.loadings.loadingModal === false && (
						this.renderSwitchBody(this.state.modalType)
					)}
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
	}
}

const dispatchToProps = dispatch => {
	return {
		showPurchasingRequisitionListItemAssignProcessing: (params) => dispatch(showPurchasingRequisitionListItemAssignProcessing(params)),
		updateOAPurchasingRequisition: (payload) => dispatch(updateOAPurchasingRequisition(payload)),
		fetchPurchasingRequisitionOA: (params) => dispatch(fetchPurchasingRequisitionOA(params)),
		getOA: (params) => dispatch(getOA(params)),
		showPurchasingRequisitionListItem: (params) => dispatch(showPurchasingRequisitionListItem(params)),
		showPurchasingRequisitionListAttachment: (payload) => dispatch(showPurchasingRequisitionListAttachment(payload)),
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		savePurchasingRequisitionAssign: (payload) => dispatch(savePurchasingRequisitionAssign(payload)),
		savePurchaseOrderOA: (payload) => dispatch(savePurchaseOrderOA(payload)),
		createPurchaseOrder: (payload) => dispatch(createPurchaseOrder(payload)),
		assignPurchasingRequisition: (uuid, target, payload) => dispatch(assignPurchasingRequisition(uuid, target, payload)),
		setSelectedItemsPr: (payload) => dispatch(setSelectedItemsPr(payload)),
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		syncPRPrice: (payload) => dispatch(syncPRPrice(payload)),
		deleteAssignPOOA : (uuid) => dispatch(deleteAssignPOOA(uuid))
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (AssignOA));