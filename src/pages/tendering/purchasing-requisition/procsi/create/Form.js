import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import ReactLoading from 'react-loading';
// import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

import Header from './Header';
import Item from './Item';
import FormDetail from './FormDetail'
// import ModalReject from '../reject/ModalReject';
// import { toastr } from 'react-redux-toastr';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	// const { loading } = props.parentState.purchasing_requisition;
	// const { header } = props.parentState.purchasing_requisition;

	const onSubmit = data => {
		setData(data)
	};

	const setData = (data) => {
		
		const sendObj = {
			"item": {
        "tipe": data.type_id?.value,
        "item_no": data.item_no,
        "per": data.per,
        "qty": data.qty,
        "uom": data.uom_id?.value,
        "valuation_price": data.valuation_price,
        "total_value": data.total_value,
        "currency": data.currency?.value,
        "req_tracking_number": data.req_tracking_number,
        "requesitioner": data.requesitioner,
        "plant_id": data.plant_id?.value,
        "mrp_controller_id": data.mrp_controller_id?.value,
        "storage_location_id": data.storage_location?.value,
        "material_number": data.material_number,
        "material_group_id": data.material_group?.value,
        "item_category": data.item_category?.value,
        "short_text": data.short_text,
				"acc_assignment_category_id": data.acc_assignment_category_id?.value
			},
			"long_text": data.long_text,
			"account": props.parentState.account,
			"service": props.parentState.service_line
		};
		props.saveItem(props.parentState.uuid, sendObj);
	}

	// const OpenModal = (e) => {
	// 	props.toggleOpenReject(props.parentState.uuid)
	// 	e.preventDefault()
	// }

	// const submitCheck = (e) => {
	// 	setStatus('p')
	// 	if(props.parentState.purchasing_requisition.items_selected.length===0){
	// 		toastr.warning("Warning", "Please Select Your Items");
	// 		e.preventDefault()
	// 	}
		
	// }

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header 
					parentProps={props.parentProps} 
					parentState={props.parentState} 
					saveHeader={(payload) => props.saveHeader(payload)} 
				/>
				{props.parentState.addItem && <Item
					parentState={props.parentState}
					parentProps={props.parentProps}
					handleChecklistAll={props.handleChecklistAll}
					modals={(payload) => props.modals(payload)}
					handlerCheckList={(payload) => props.handlerCheckList(payload)}
					handleAddItem={() => props.handleAddItem()}
				/>}
				{props.parentState.addItem && <FormDetail
					disabledForm={false}
					data={props.parentState.modalData}
					toggleOpen={(type) => props.toggleOpen(type)}
					showServiceLine={(type) => props.showServiceLine(type)}
					parentState={props.parentState}
					fetchDocumentType={props.fetchDocumentType}
					fetchCurrencies={props.fetchCurrencies}
					fetchPlant={props.fetchPlant}
					fetchMrpController={props.fetchMrpController}
					fetchStorageLocation={props.fetchStorageLocation}
					fetchMaterialGroup={props.fetchMaterialGroup}
					fetchItemCategory={props.fetchItemCategory}
					fetchAccAssignmentCategory={props.fetchAccAssignmentCategory}
					fetchUom={props.fetchUom}
				/>}
				{props.parentState.addItem && <div className="panel bg-white margin-bot-false">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{/* {props.parentState.uuid !== "" && (header.status === 'o' || header.status === 'd' || header.status === 'r') &&
										<button type="submit" onClick={() => setStatus('d')} className="btn btn-info m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Draft </button>
									} */}
									{/* {(!props.parentProps.user.has_roles.includes("KBGPNG") || props.parentProps.user.has_roles.includes("PRPLNR"))  && props.parentState.uuid !== "" && (header.status_reject !== 0 || header.status_open !== 0) &&
										<button type="submit" onClick={(e) => submitCheck(e)} className="btn btn-success m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Process </button>
									}
									{props.parentProps.user.has_roles.includes("KBGPNG") && props.parentState.uuid !== "" && header.status_submit !== 0 &&
										<button type="submit" onClick={(e) => OpenModal(e)} className="btn btn-danger m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Reject </button>
									} */}
									<button type="submit" className="btn btn-success m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Process </button>
									<button type="button" onClick={(e) => window.history.back()} className="btn btn-white m-r-5" disabled={props.parentState.loadings.button}> Kembali </button>
								</div>
							</div>
						</div>
					</div>
				</div>}
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);