import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import ReactLoading from 'react-loading';
import { toastr } from 'react-redux-toastr';
import { fileUpload } from '../../../../../store/actions/uploadActions';
// import SweetAlert from 'react-bootstrap-sweetalert';
import {
	showPurchasingRequisition,
	updatePurchasingRequisition,
	uploadPurchasingRequisition,ShowDetailPurchasingRequisition,
	deleteAttacmentPurchasingRequisition
} from '../../../../../store/actions/tendering/purchasingRequisitionActions';
import { fetchDocumentType } from '../../../../../store/actions/master/documentTypeActions';
import { fetchCurrencies } from '../../../../../store/actions/master/currenciesActions';
import { fetchPlant } from '../../../../../store/actions/master/plantActions';
import { fetchMrpController } from '../../../../../store/actions/master/mrpControllerActions';
import { fetchStorageLocation } from '../../../../../store/actions/master/storageLocationsActions';
import { fetchMaterialGroup } from '../../../../../store/actions/master/materialGroupActions';
import { fetchItemCategory } from '../../../../../store/actions/master/itemCategoryActions';
import { fetchAccAssignmentCategory } from '../../../../../store/actions/master/accAssignmentCategoryActions';
import { fetchUom } from '../../../../../store/actions/master/uomActions';
import { fetchAssets } from '../../../../../store/actions/master/assetsActions';
import { fetchGlAccount } from '../../../../../store/actions/master/glAccountActions';
import { fetchCostCenter } from '../../../../../store/actions/master/costCenterActions';
import { fetchProfitCenter } from '../../../../../store/actions/master/invoiceProfitCenterActions';
import { fetchWbsProject } from '../../../../../store/actions/master/wbsProjectActions';
import { saveHeader, saveItem } from '../../../../../store/actions/tendering/prProcsi';

import Form from './Form';
import AccountAssignment from '../modal/AccountAssignment';
import ServiceLine from '../modal/ServiceLine';

class Detail extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
	}

	state = {
		uuid: (this.props.location.pathname.split("/")[4] !== undefined) ? this.props.location.pathname.split("/")[4] : '',
		errors: [],
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
			attachments: [],
			purchasing_orgs: [],
			company_types: [],
			vendor_types: [],
			errors: [],
			loading: true,
			loadingButton: false,
			items_selected :[]
		},
		master: {
			document_type: [],
			tipe: [
				{ value: 'barang', label: 'BARANG' },
				{ value: 'jasa', label: 'JASA' },
			],
			currency: [],
			plant: [],
			mrp_controller: [],
			storage_location: [],
			material_number: [],
			material_group: [],
			item_category: [],
			account_assignment: [],
			uom: [],
			asset: [],
			gl_account: [],
			cost_center: [],
			profit_center: [],
			wbs: [],
		},
		account: [],
		service_line: [],
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
			document_type: false,
			tipe: false,
			currency: false,
			plant: false,
			mrp_controller: false,
			storage_location: false,
			material_number: false,
			material_group: false,
			item_category: false,
			account_assignment: false,
			uom: false,
		},
		optionsTipeLampiran: [
			{ value: "tor", label: "TOR" },
			{ value: "oe", label: "OE" },
			{ value: "rks", label: "RKS" },
			{ value: "lainnya", label: "LAINNYA" }
		],
		addItem: false,
		showItem: true,
		modalOpen: false,
		showServiceLine: false,
		modalType: '',
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
		uuidAttactment:''
	}

	componentDidMount = () => {
		this._isMounted = true;
		if (this._isMounted) {
			// let uri = this.props.location.pathname.split("/")[4];
			if(this.state.uuid !== ''){
				this.showPurchasingRequisition(this.state.uuid);
				this.fetchAssets('')
				this.fetchGlAccount('')
				this.fetchCostCenter('')
				this.fetchProfitCenter('')
				this.fetchWbsProject('')
			} else {
				this.setState(({ purchasing_requisition }) => ({
					purchasing_requisition: { ...purchasing_requisition, loading: false, header: [], items: [], attachments: [] }
				}));
			}
			this.fetchDocumentType('');
			this.fetchCurrencies('');
			this.fetchPlant('');
			this.fetchMrpController('');
			this.fetchStorageLocation('');
			this.fetchMaterialGroup('');
			this.fetchItemCategory('');
			this.fetchAccAssignmentCategory('');
			this.fetchUom('');
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state, callback) => {
			return;
		};
	}

	fetchDocumentType = (params) => {
		let select_params = (params !== '') ? {select: params, company_id : this.props.user.company_id} : {start: 0, length: -1, company_id : this.props.user.company_id};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, document_type: true } }));
		this.props.fetchDocumentType(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, document_type: options },
				loadings: { ...loadings, document_type: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, document_type: [] },
				loadings: { ...loadings, document_type: false },
			}));
		});
	}

	fetchCurrencies = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, currency: true } }));
		this.props.fetchCurrencies(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.short_text}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, currency: options },
				loadings: { ...loadings, currency: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, currency: [] },
				loadings: { ...loadings, currency: false },
			}));
		});
	}

	fetchPlant = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, plant: true } }));
		this.props.fetchPlant(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, plant: options },
				loadings: { ...loadings, plant: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, plant: [] },
				loadings: { ...loadings, plant: false },
			}));
		});
	}

	fetchMrpController = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, mrp_controller: true } }));
		this.props.fetchMrpController(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, mrp_controller: options },
				loadings: { ...loadings, mrp_controller: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, mrp_controller: [] },
				loadings: { ...loadings, mrp_controller: false },
			}));
		});
	}

	fetchStorageLocation = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, storage_location: true } }));
		this.props.fetchStorageLocation(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, storage_location: options },
				loadings: { ...loadings, storage_location: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, storage_location: [] },
				loadings: { ...loadings, storage_location: false },
			}));
		});
	}

	fetchMaterialGroup = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, material_group: true } }));
		this.props.fetchMaterialGroup(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, material_group: options },
				loadings: { ...loadings, material_group: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, material_group: [] },
				loadings: { ...loadings, material_group: false },
			}));
		});
	}

	fetchItemCategory = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, item_category: true } }));
		this.props.fetchItemCategory(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.id} - ${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, item_category: options },
				loadings: { ...loadings, item_category: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, item_category: [] },
				loadings: { ...loadings, item_category: false },
			}));
		});
	}

	fetchAccAssignmentCategory = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, account_assignment: true } }));
		this.props.fetchAccAssignmentCategory(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, account_assignment: options },
				loadings: { ...loadings, account_assignment: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, account_assignment: [] },
				loadings: { ...loadings, account_assignment: false },
			}));
		});
	}
	fetchAssets = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, asset: true } }));
		this.props.fetchAssets(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.description}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, asset: options },
				loadings: { ...loadings, asset: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, asset: [] },
				loadings: { ...loadings, asset: false },
			}));
		});
	}
	fetchGlAccount = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, gl_account: true } }));
		this.props.fetchGlAccount(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, gl_account: options },
				loadings: { ...loadings, gl_account: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, gl_account: [] },
				loadings: { ...loadings, gl_account: false },
			}));
		});
	}
	fetchCostCenter = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, cost_center: true } }));
		this.props.fetchCostCenter(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, cost_center: options },
				loadings: { ...loadings, cost_center: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, cost_center: [] },
				loadings: { ...loadings, cost_center: false },
			}));
		});
	}
	fetchProfitCenter = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, profit_center: true } }));
		this.props.fetchProfitCenter(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.profit_name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, profit_center: options },
				loadings: { ...loadings, profit_center: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, profit_center: [] },
				loadings: { ...loadings, profit_center: false },
			}));
		});
	}
	fetchWbsProject = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, wbs: true } }));
		this.props.fetchWbsProject(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.id, label: `${dt.description}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, wbs: options },
				loadings: { ...loadings, wbs: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, wbs: [] },
				loadings: { ...loadings, wbs: false },
			}));
		});
	}

	fetchUom = (params) => {
		let select_params = (params !== '') ? {select: params} : {start: 0, length: 10};
		this.setState(({ loadings }) => ({ loadings: { ...loadings, uom: true } }));
		this.props.fetchUom(select_params)
		.then((resp) => {
			const data = resp.data.data;
			let options = data.map((dt) => {
				return { value: dt.code, label: `${dt.name}` };
			})
			this.setState(({ master, loadings }) => ({
				master: { ...master, uom: options },
				loadings: { ...loadings, uom: false },
			}));
		})
		.catch((resp) => {
			this.setState(({ master, loadings }) => ({
				master: { ...master, uom: [] },
				loadings: { ...loadings, uom: false },
			}));
		});
	}

	saveHeader = (payload) => {
		// console.log(payload);
		this.props.saveHeader(payload)
		.then((resp) => {
			// this.setState({ showItem: false })
			// toastr.success(resp.data.message);
			const {uuid} = resp.data.data;
			this.props.history.push(`/tendering/purchasing-requisition-procsi/create-item/${uuid}`)
		})
		.catch((resp) => {
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

	saveItem = (id, payload) => {
		// console.log(payload);
		this.props.saveItem(id, payload)
		.then((resp) => {
			toastr.success(resp.data.message);
			this.props.history.push('/tendering/purchasing-requisition-procsi')
		})
		.catch((resp) => {
			const errors = resp.data.errors;
			if(errors){
				this.setState({ errors: errors })
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}


	showPurchasingRequisition = async (id) => {
		this.setState(({ purchasing_requisition }) => ({ purchasing_requisition: { ...purchasing_requisition, loading: true } }));
		this.props.showPurchasingRequisition(id)
			.then((resp) => {
				const data = resp.data.data;
				this.setState(({ purchasing_requisition }) => ({
					purchasing_requisition: { ...purchasing_requisition, loading: false, header: data.header, items: data.items, attachments: data.attachments },
					addItem: true
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

	modals = async (payload) => {
		this.setState(({ modalOpen, loadings , modalData}) => ({
			loadings: { ...loadings, loadingModal:true},
			modalOpen:true,
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
		this.setState({ modalOpen: false, modalType: '' })
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

	toggleOpen(type) {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, loadingModal: true }
		}), () => {
			this.setState(({ loadings }) => ({
				modalOpen: true,
				modalType: type,
				loadings: { ...loadings, loadingModal: false }
			}));
		});
	}

	handleAddItem() {
		this.setState({
			addItem: true
		});
	}

	addAssignment(data){
		// console.log(data);
		const joined = this.state.account.concat(data);
		this.setState({ account: joined });
	}

	addServiceLine(data){
		const joined = this.state.service_line.concat(data);
		this.setState({ service_line: joined });
	}

	showServiceLine(type){
		if(type){
			this.setState({ showServiceLine: type })
		} else {
			this.setState({ showServiceLine: false, service_line: [] })
		}
	}

	renderSwitchBody(param) {
		switch(param) {
			case 'account-assignment':
				return <AccountAssignment
									parentState={this.state}
									data={this.state.data}
									addAssignment={(payload) => this.addAssignment(payload)}
									toggleClose={this.toggleClose}
									fetchAssets={this.fetchAssets}
									fetchGlAccount={this.fetchGlAccount}
									fetchCostCenter={this.fetchCostCenter}
									fetchProfitCenter={this.fetchProfitCenter}
									fetchWbsProject={this.fetchWbsProject}
									fetchUom={this.fetchUom}
								/>;
			case 'service-line':
				return <ServiceLine
									parentState={this.state}
									data={this.state.data}
									addServiceLine={(payload) => this.addServiceLine(payload)}
									toggleClose={this.toggleClose}
									fetchAssets={this.fetchAssets}
									fetchGlAccount={this.fetchGlAccount}
									fetchCostCenter={this.fetchCostCenter}
									fetchProfitCenter={this.fetchProfitCenter}
									fetchWbsProject={this.fetchWbsProject}
									fetchUom={this.fetchUom}
								/>;
			default:
				return <ServiceLine
									parentState={this.state}
									data={this.state.data}
									addServiceLine={(payload) => this.addServiceLine(payload)}
									toggleClose={this.toggleClose}
									fetchAssets={this.fetchAssets}
									fetchGlAccount={this.fetchGlAccount}
									fetchCostCenter={this.fetchCostCenter}
									fetchProfitCenter={this.fetchProfitCenter}
									fetchWbsProject={this.fetchWbsProject}
									fetchUom={this.fetchUom}
								/>;
			}
	}

	renderSwitchHeader(param) {
			switch(param) {
				case 'account-assignment':
					return <ModalHeader toggle={() => this.toggleClose()}>Account Assignment</ModalHeader>;
				case 'service-line':
					return <ModalHeader toggle={() => this.toggleClose()}>Service Line</ModalHeader>;
				default:
					return <ModalHeader toggle={() => this.toggleClose()}>Add Item</ModalHeader>;
			}
	}

	render() {
		// const {t} = this.props;
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
					modals={(payload) => this.modals(payload)}
					handlerCheckList={(payload) => this.handlerCheckList(payload)}
					toggleOpenReject={(payload) => this.toggleOpenReject(payload)}
					toggleConfirm={(e,payload) => this.toggleConfirm(e,payload)}
					handleChecklistAll={this.handleChecklistAll}
					toggleOpen={(type) => this.toggleOpen(type)}
					handleAddItem={() => this.handleAddItem()}
					fetchDocumentType={this.fetchDocumentType}
					fetchCurrencies={this.fetchCurrencies}
					fetchPlant={this.fetchPlant}
					fetchMrpController={this.fetchMrpController}
					fetchStorageLocation={this.fetchStorageLocation}
					fetchMaterialGroup={this.fetchMaterialGroup}
					fetchItemCategory={this.fetchItemCategory}
					fetchAccAssignmentCategory={this.fetchAccAssignmentCategory}
					fetchUom={this.fetchUom}
					saveHeader={(payload) => this.saveHeader(payload)}
					showServiceLine={(payload) => this.showServiceLine(payload)}
					saveItem={(id, payload) => this.saveItem(id, payload)}
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
		fetchDocumentType: (payload) => dispatch(fetchDocumentType(payload)),
		fetchCurrencies: (payload) => dispatch(fetchCurrencies(payload)),
		fetchPlant: (payload) => dispatch(fetchPlant(payload)),
		fetchMrpController: (payload) => dispatch(fetchMrpController(payload)),
		fetchStorageLocation: (payload) => dispatch(fetchStorageLocation(payload)),
		fetchMaterialGroup: (payload) => dispatch(fetchMaterialGroup(payload)),
		fetchItemCategory: (payload) => dispatch(fetchItemCategory(payload)),
		fetchAccAssignmentCategory: (payload) => dispatch(fetchAccAssignmentCategory(payload)),
		fetchAssets: (payload) => dispatch(fetchAssets(payload)),
		fetchGlAccount: (payload) => dispatch(fetchGlAccount(payload)),
		fetchCostCenter: (payload) => dispatch(fetchCostCenter(payload)),
		fetchProfitCenter: (payload) => dispatch(fetchProfitCenter(payload)),
		fetchWbsProject: (payload) => dispatch(fetchWbsProject(payload)),
		fetchUom: (payload) => dispatch(fetchUom(payload)),
		saveHeader: (payload) => dispatch(saveHeader(payload)),
		saveItem: (id, payload) => dispatch(saveItem(id, payload)),
	}
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(Detail));