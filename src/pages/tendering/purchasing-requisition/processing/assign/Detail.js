import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
// import {toastr} from 'react-redux-toastr';
import { fetchUserList, showPurchasingRequisitionListItem, savePurchasingRequisitionAssign, showPurchasingRequisitionListAttachment } from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import { fetchUsers } from '../../../../../store/actions/utility/usersActions';
import List from './List';
import Item from './Item';
import { toastr } from 'react-redux-toastr';
import SourceAssigment from './SourceAssigment'
import { debounce } from '../../../../../helpers/debounce';

class Detail extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		this._data = []
		this.state = {
			data_list: [],
			list_purchasing_group: [],
			purchasing_requisition: {
				sendData: {
					determination_id: { value: "eproc", label: "E-Proc"},
					user_id: '',
					items: [],
					disposisi_note : ''
				},
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
				users: false,
				determination: false,
				form_user_buyyer : false
			},
			loading: false,
			m_determination: [
				{ value: "eproc", label: "E-Proc" },
				{ value: "sap", label: "SAP" },
			],
			m_users: []
		}
	}

	debounced = debounce(text => this.fetchUserList(text));

	debounceUsers = (filters) => {
		this.debounced(filters);
	}
	
  componentDidMount = () => {
		this._isMounted = true;
		if(this._isMounted){
			// this.fetchUserList('')
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
	}

	fetchUsers = (newValue) => {
    if(this._isMounted){
      let select_params = (newValue !== '') ? {start: 0, length: 5, q: newValue, role:"BYR001",status:"y", company_id: this.props.user.company_id} : {start: 0, length: 5 ,role:"BYR001",status:"y", company_id: this.props.user.company_id};
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, users: true }
      }));
      this.props.fetchUsers(select_params)
      .then((resp) => {
        let m_users = resp.data.data;
        let options = m_users.map((dt) => {
          return { value: dt.uuid, label: `${dt.username} - ${dt.name} (Tender : ${(dt.total_assigned !== null) ? dt.total_assigned : 0})  (PO : ${(dt.total_po_assigned !== null) ? dt.total_po_assigned : 0})` };
        })
        this.setState(({ loadings }) => ({
          m_users: options,
          loadings: { ...loadings, users: false }
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, users: false }
        }));
        toastr.error(resp.data.message);
      });
    }
  }

  debounced = debounce(text => this.fetchUserList(text));

  fetchUserList = (newValue) => {
    if(this._isMounted){
		if (this.state.list_purchasing_group.length > 0){
			this.setState(({ loadings }) => ({
				loadings: { ...loadings, form_user_buyyer: true }
			  }));
			let purchasing_group_id = this.state.list_purchasing_group.map(item => item.purchasing_group_id).join(';');
			// let purchasing_group_id = 'A00;A01;A02;A03;B00;B01;B02;B03';
			  
			let select_params = (newValue !== '') ?
				{start: 0, length: -1, purchasing_group_id: purchasing_group_id, q: newValue, select: newValue} :
				{start: 0, length: -1, purchasing_group_id: purchasing_group_id, select: newValue};
			this.props.fetchUserList(select_params)
			.then((resp) => {
			  let m_users = resp.data.data;
			  let options = m_users.map((dt) => {
				return { value: dt.uuid, label: `${dt.username} - ${dt.name} (Tender : ${(dt.total_assigned !== null) ? dt.total_assigned : 0})  (PO : ${(dt.total_po_assigned !== null) ? dt.total_po_assigned : 0})` };
			  })
			  this.setState(({ loadings }) => ({
				m_users: options,
				loadings: { ...loadings, form_user_buyyer: false, users : false }
			  }));
			})
			.catch((resp) => {
			  this.setState(({ loadings }) => ({
				loadings: { ...loadings, form_user_buyyer: false, users : false }
			  }));
			  toastr.error(resp.data.message);
			});
		}
		else{
			this.setState(({ loadings }) => ({
				m_users: [],
				loadings: { ...loadings, users: false }
			  }));
		}
	}
  }

  debounceUsers = (filters) => {
	this.debounced(filters)
  }

	setLoading = (type) => {
		this.setState({ loading: type })
	}
	
	setListData = (value) => {
		this.setState({ data_list: value.data })
	}

	callFetchUserList(){
		let loadings = this.state.list_purchasing_group;
		loadings.users = true;
		this.setState({ loadings }, this.fetchUserList);
		// this.fetchUserList();
	}

	handleCheckAll = (isCheckAll) => {
		const {data_list} = this.state;
		let list_purchasing_group = [...this.state.list_purchasing_group];
		if (isCheckAll) {
			list_purchasing_group = data_list
		}
		else {
			list_purchasing_group = []
		}
		
		this.setState({ list_purchasing_group }, this.callFetchUserList);

		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items: [], items_selected: []}
		}));
		let arr_selected = this.state.purchasing_requisition.items_selected;
		console.log(arr_selected);
		if(isCheckAll){
			if(data_list.length > 0){
				data_list.map(item => {
					if(!arr_selected.includes(item.uuid)){
						arr_selected.push(item.uuid)
					}
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
		let list_purchasing_group = [...this.state.list_purchasing_group];
		if (list_purchasing_group.length > 0) {
			let index = list_purchasing_group.findIndex( ({ id }) => id === payload.id );
			if (index === payload.id) {
				list_purchasing_group.splice(index, 1);
			}
			else {
				list_purchasing_group.push(payload)
			}
		}
		else {
			list_purchasing_group.push(payload)
		}
		// console.log(list_purchasing_group)		
		this.setState({ list_purchasing_group }, this.callFetchUserList);

		let arr = this.state.purchasing_requisition.items;
		let arr_selected = this.state.purchasing_requisition.items_selected;
		let arrTemp = []
		let arrTempSelected = []
		if(arr.includes(payload)){
			// arr.map((item, key) => {
			// 	if(item.uuid === uuid){
			// 		arr.splice(key, 1)
			// 		arr_selected.splice(key, 1)
			// 	}
			// 	return true;
			// })
			
			arr.forEach((element, i) => {
				if (element.uuid!==uuid) {
					arrTemp.push(element)
					arrTempSelected.push(element.uuid)
				}
			});
			arr=arrTemp
			arr_selected=arrTempSelected
		} else {
			arr.push(payload);
			arr_selected.push(uuid)
		}
	
		this.setState(({ purchasing_requisition }) => ({
			purchasing_requisition: { ...purchasing_requisition, items: arr.sort((a,b) => a.item_no-b.item_no).sort((a,b) => a.purchasing_requisition_number-b.purchasing_requisition_number), items_selected: arr_selected}
		}), () => { 
			this.showPurchasingRequisitionListAttachment(arr_selected)
		});
	}

	setSendData = (payload) => {
		this.setState(({ sendData }) => ({
			sendData: { ...sendData, items: this.state.purchasing_requisition.items_selected, assign_to_buyer: payload.user_id, source_determination: payload.determination_id, disposisi_note : payload.disposisi_note}
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
			toastr.error(resp.data.status, resp.data.message);
		});
	}

  render(){
		// const {t} = this.props;
    return (
      <div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item">Home</li>
					<li className="breadcrumb-item">Tendering</li>
					<li className="breadcrumb-item active">Purchase Requisition Assign</li>
				</ol>
				<h1 className="page-header">Purchase Requisition Assign </h1>
				<List handleChecklist={this.handleChecklist} handleCheckAll={this.handleCheckAll} setLoading={this.setLoading} parentProps={this.props} fetchPurchasingRequisition={this.props.showPurchasingRequisitionListItem} parentState={this.state} setListData={this.setListData} />
				<Item parentState={this.state} />
				<SourceAssigment parentState={this.state} fetchUsers={this.fetchUsers} fetchUserList={(val) => this.debounceUsers(val)} save={this.savePurchasingRequisitionAssign} />
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
		showPurchasingRequisitionListItem: (params) => dispatch(showPurchasingRequisitionListItem(params)),
		showPurchasingRequisitionListAttachment: (payload) => dispatch(showPurchasingRequisitionListAttachment(payload)),
		fetchUsers: (params) => dispatch(fetchUsers(params)),
		fetchUserList: (params) => dispatch(fetchUserList(params)),
		savePurchasingRequisitionAssign: (payload) => dispatch(savePurchasingRequisitionAssign(payload)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (Detail));