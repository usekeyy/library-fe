import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

import Header from './Header';
import Item from './Item';
import Upload from './Upload'
// import ModalReject from '../reject/ModalReject';
import { toastr } from 'react-redux-toastr';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	const [status, setStatus] = React.useState('')
	const { loading } = props.parentState.purchasing_requisition;
	const { header } = props.parentState.purchasing_requisition;
	// const { status_items } = props.parentState.purchasing_requisition;
	// const is_open_items = (status_items.length > 0) ? status_items.includes("o") : false;
	const onSubmit = data => {
		setData(data)
	};

	const setData = (data) => {
		data.status = status;
		data.work_unit_id = props.parentProps.user.work_unit_id;
		data.created_by = props.parentProps.user.id;
		data.items = props.parentState.purchasing_requisition.items_selected;
		props.update(props.parentState.uuid, data);
	}

	const OpenModal = (e) => {
		props.toggleOpenReject(props.parentState.uuid)
		e.preventDefault()
	}

	const submitCheck = (e) => {
		setStatus('p')
		if(props.parentState.purchasing_requisition.items_selected.length===0){
			toastr.warning("Warning", "Please Select Your Items");
			e.preventDefault()
		}
		
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Item
					parentState={props.parentState}
					parentProps={props.parentProps}
					handleChecklistAll={props.handleChecklistAll}
					modals={(payload,isEdit) => props.modals(payload,isEdit)}
					handlerCheckList={(payload) => props.handlerCheckList(payload)}
				/>
				<Panel>
					<PanelHeader>Lampiran</PanelHeader>
					{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading &&
						<PanelBody>
							<Upload parentProps={props.parentProps} parentState={props.parentState} upload={props.upload} addLampiran={props.addLampiran} toggleConfirm={(e,payload)=>props.toggleConfirm(e,payload)} />
							<div className="row">
								<div className="col-sm-12">
									<div className="pull-right m-t-5 m-b-5">
										<div>
											{/* {props.parentState.uuid !== "" && (header.status === 'o' || header.status === 'd' || header.status === 'r') &&
												<button type="submit" onClick={() => setStatus('d')} className="btn btn-info m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Draft </button>
											} */}
											{(!props.parentProps.user.has_roles.includes("KBGPNG") || props.parentProps.user.has_roles.includes("PRPLNR"))  && props.parentState.uuid !== "" && (header.status_reject !== 0 || header.status_open !== 0 || header.status_review !== 0) &&
												<button type="submit" onClick={(e) => submitCheck(e)} className="btn btn-success m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Process </button>
											}
											{props.parentProps.user.has_roles.includes("KBGPNG") && props.parentState.uuid !== "" && header.status_submit !== 0 &&
												<button type="submit" onClick={(e) => OpenModal(e)} className="btn btn-danger m-r-5" disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ? <i className="fa fa-spinner fa-spin"></i> : ''} Reject </button>
											}
											<button type="button" onClick={(e) => window.history.back()} className="btn btn-white m-r-5" disabled={props.parentState.loadings.button}> Kembali </button>
										</div>
									</div>
								</div>
							</div>
						</PanelBody>}
				</Panel>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);