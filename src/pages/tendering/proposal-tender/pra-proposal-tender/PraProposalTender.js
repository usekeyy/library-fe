import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
import { showPurchasingRequisitionListItem, showPurchasingRequisitionListItemAssignProcessing, savePurchasingRequisitionAssign, showPurchasingRequisitionListAttachment, assignPurchasingRequisition, ShowDetailPurchasingRequisition, fetchPurchasingRequisitionApproval, updateOAPurchasingRequisition, deletePurchasingRequisitionItem } from '../../../../store/actions/tendering/purchasingRequisitionActions';
import { setSelectedItemsPr, getOA, createPurchaseOrder } from '../../../../store/actions/tendering/proposalTenderActions';
import { fetchUsers } from '../../../../store/actions/utility/usersActions';
import List from './sub/List';
import Item from './sub/Item';
import DetailOA from './sub/DetailOA';
import FormDetail from './sub/FormDetail';
import FormDeletePR from './sub/FormDeletePR';
import { toastr } from 'react-redux-toastr';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';

class PraProposalTender extends Component {
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
			},
			error: false,
			errors: [],
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
					arr_selected.push(item.uuid)
					return true
				})
			}
			this.setState(({ purchasing_requisition }) => ({
				purchasing_requisition: { ...purchasing_requisition, items: data_list.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number), items_selected: arr_selected}
			}));
			this.showPurchasingRequisitionListAttachment(arr_selected)
		} else {
			let pr = this.state.data_list
			pr.forEach(element => {
				if (element.no_oa !== undefined) {
					if (element.no_oa !== null && element.no_oa !== '') {
						element.no_oa = ''
						element.data_oa = []
						element.assign_processing = (element.assign_processing_last !== undefined ? element.assign_processing_last : element.assign_processing)
					}
				}
			});
			this.setState(({ purchasing_requisition, data_list: pr }) => ({
				purchasing_requisition: { ...purchasing_requisition, items: [], items_selected: []}
			}));
		}
	}

	handleChecklist = (e, payload, uuid) => {
		let pr = this.state.data_list
		let index = pr.findIndex(d => d.uuid === uuid)
		pr[index].no_oa = ''
		pr[index].data_oa = []
		pr[index].assign_processing = (pr[index].assign_processing_last !== undefined ? pr[index].assign_processing_last : pr[index].assign_processing)
		this.setState({ data_list: pr })

		let arr = this.state.purchasing_requisition.items;
		let arr_selected = this.state.purchasing_requisition.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		if(arr.includes(payload)){
			arr.forEach((element, i) => {
				if (element.uuid!==uuid) {
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
				arr.push(payload);
				arr_selected.push(uuid)
			}
		}
	
		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number), items_selected: arr_selected}
		}), () => { 
			this.showPurchasingRequisitionListAttachment(arr_selected)
		});
	}

	setSendData = (payload) => {
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, items: this.state.purchasing_requisition.items_selected, assign_to_buyer: payload.user_id, source_determination: payload.determination_id}
		}));
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
				processing = item.assign_processing
			}
			else {
				if (processing !== item.assign_processing) {
					status_processing = true
				}
			}
		});
		if (status_processing) {
			this.setState({ status_processing: status_processing })
			return
		}

		if (processing === 'OA') {
			this.props.updateOAPurchasingRequisition({ param: items })
				.then((resp) => {
					toastr.success(resp.data.message);
					window.location.reload();
				})
				.catch((resp) => {
					// console.log(resp)
					toastr.error(resp.data.message);
				});
		}
		else {			
			const arr = [];
			const arr_currency = [];
			this.setState(({ loadings, purchasing_requisition }) => ({ 
				loadings: { ...loadings, buttonUpload: true, button: true },
				purchasing_requisition: { ...purchasing_requisition, errors: [] }
			}));
			setTimeout(() => {
				if(items.length > 0){
					items.forEach((item, key) => {
						if(item.assign_processing === 'tender'){
								arr.push(item)
								arr_currency.push(item.currency)
						}
					})
				}
				this.setState(({ sendData, loadings, purchasing_requisition }) => ({
					sendData: { ...sendData, items: arr},
					loadings: { ...loadings, buttonUpload: false, button: false },
					purchasing_requisition: { ...purchasing_requisition, errors: [] }
				}), () => { 
					let unique_curr = [...new Set(arr_currency)];
					if(unique_curr.length > 1){
						toastr.warning("Currency Item Terpilih Berbeda");
					} else {
						if(arr.length > 0){
							toastr.success("Berhasil Submit Pra Proposal Tender");
							this.props.setSelectedItemsPr({type: true, data: {
								items: arr,
								attachments: this.state.purchasing_requisition.attachments
							}});
							this.props.history.push('/tendering/pra-proposal-tender/create')
						} else {
							this.props.setSelectedItemsPr({type: false, data: []});
							toastr.warning("Data Item Terpilih Kosong");
						}
					}
				});
			}, 1000)
		}
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
		console.log(type);
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
		else if (type === 'oa') {
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
					toastr.error(resp.data.errors);
					// this.props.history.push('/home')
					this.setState(({  loadings }) => ({
						loadings: { ...loadings, loadingModal:false, button: false}
					}));
				});
		}
		else if (type === 'delete-pr') {
			const uuid = payload
			let index = this.state.data_list.findIndex(d => d.uuid === uuid);
			this.setState(({ loadings, modalData }) => ({
				loadings: { ...loadings, loadingModal:false, button: false},
				modalData: { ...modalData, uuid: uuid, data_param: this.state.data_list[index]}
			}))
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

	saveOA = (payload) => {
		let data_oa = this.state.modalData.data_oa[payload.oa_selected];
		let data_header = this.state.modalData.data_header;

		let pr = this.state.data_list
		let index = pr.findIndex(d => d.purchasing_requisition_number === data_header.purchasing_requisition_number && d.item_no === data_header.item_no)
		pr[index].assign_processing_last = pr[index].assign_processing
		pr[index].assign_processing = 'OA'
		pr[index].no_oa = data_oa.no_oa
		pr[index].item_oa = data_oa.item_oa
		pr[index].vendor_sap_code = data_oa.vendor_sap_code
		// pr[index].data_oa = param
		this.setState({ data_list: pr }, () => {
			this.toggleClose()
		})
	}

	deletePurchasingRequisitionItem = (payload) => {
		// console.log(this.state.modalData.uuid)
		// console.log(payload)
		// return
		this.props.deletePurchasingRequisitionItem(this.state.modalData.uuid, payload)
			.then((resp) => {
				window.location.reload();
				toastr.success(resp.data.message);
			})
			.catch(error => {
				if (typeof error !== 'undefined') {
					toastr.error(error.data.message);
					this.setState({ error: true, errors: error.data.errors, loading: false });
				} else {
					this._isMounted && this.setState({ loading: false });
					toastr.error(error.data.message);
				}
			})
	}

    renderSwitchBody(param) {
        switch(param) {
			case 'oa':
				return <DetailOA
					disabledForm={true}
					data={this.state.modalData}
					save={this.saveOA}
					toggleClose={this.toggleClose}
				/>
			case 'delete-pr':
				return <FormDeletePR
					disabledForm={true}
					parentState={this.state}
					modalData={this.state.modalData}
					save={this.deletePurchasingRequisitionItem}
					toggleClose={this.toggleClose}
				/>
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
          case 'oa':
            return <ModalHeader toggle={() => this.toggleClose()}>Contract References</ModalHeader>;
          case 'delete-pr':
            return <ModalHeader toggle={() => this.toggleClose()}>Kembalikan PR ke Perencanaan</ModalHeader>;
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
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Pra Proposal Tender</li>
				</ol>
				<h1 className="page-header">Pra Proposal Tender </h1>
				{<List
					t={this.props.t}
					ref={this.childList}
					handleChecklist={this.handleChecklist}
					handleCheckAll={this.handleCheckAll}
					setLoading={this.setLoading}
					parentProps={this.props}
					fetchPurchasingRequisition={this.props.fetchPurchasingRequisitionApproval}
					parentState={this.state}
					setListData={this.setListData}
					setItems={this.setItems}
					modals={this.modals}
				/>}
				{<Item
					ref={this.childItem}
					parentState={this.state}
					assignPurchasingRequisition={this.assignPurchasingRequisition}
					submitPraProposalTender={this.submitPraProposalTender}
					modals={this.modals}
					t={this.props.t}/>}
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
					<Modal isOpen={this.state.modalOpen && this.state.modalType === 'delete'} toggle={() => this.toggleClose()} className="modal-lg">
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
		fetchPurchasingRequisitionApproval: (params) => dispatch(fetchPurchasingRequisitionApproval(params)),
		getOA: (params) => dispatch(getOA(params)),
		showPurchasingRequisitionListItem: (params) => dispatch(showPurchasingRequisitionListItem(params)),
		showPurchasingRequisitionListAttachment: (payload) => dispatch(showPurchasingRequisitionListAttachment(payload)),
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		savePurchasingRequisitionAssign: (payload) => dispatch(savePurchasingRequisitionAssign(payload)),
		createPurchaseOrder: (payload) => dispatch(createPurchaseOrder(payload)),
		assignPurchasingRequisition: (uuid, target, payload) => dispatch(assignPurchasingRequisition(uuid, target, payload)),
		setSelectedItemsPr: (payload) => dispatch(setSelectedItemsPr(payload)),
		ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
		deletePurchasingRequisitionItem: (uuid, payload) => dispatch(deletePurchasingRequisitionItem(uuid, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (PraProposalTender));