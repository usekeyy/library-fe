import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ApprovalTableConfig from './ApprovalTableConfig';
import Attachment from './Attachment';
import Note from './Note';

const FormApproval = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	// const { loading } = props.parentState.proposal_tender;
	// const { attachments } = props.parentState.proposal_tender;

	const onSubmit = data => {
        console.log(data)
        data.note && props.setValueState("notes", data.note)
		// props.save(setData(data))
		// console.log(setData(data))
		
	};
	
	// const setData = (data) => {
	// 	let penilaian = [];
    //     for (const [key, value] of Object.entries(data)) {
	// 		if(key !== 'note'){
	// 			penilaian.push({
	// 				id_subcategory : key,
	// 				id_rating : value
	// 			})
	// 		}
    //     }
	// 	const payload = {
	// 		score : props.parentState.score,
	// 		penilaian : penilaian,
	// 		note : data?.note,
	// 		vendor_id : props.parentState.data.po[0].vendor_id,
	// 		po_id : props.parentState.data.po[0].id
	// 	}

	// 	return payload
	// }
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{/* <Header parentProps={props.parentProps} parentState={props.parentState}/>
				<Term
					modalsTerm={props.modalsTerm}
					parentProps={props.parentProps}
					parentState={props.parentState}/> */}
				<ApprovalTableConfig 
					data = {props.parentState.data}
					loading = {props.parentState.loading}
					save = {props.save}
					toList = {props.toList}
					upload = {props.upload}
					setValueState = {props.setValueState}
				/>
				<Attachment 
					setModalOpen = {props.setModalOpen}
					data = {props.parentState.dataAttachment}
					delete = {props.deleteVprAttachment}
                    isRequestor = {props.parentState.isRequestor}
					statusText = {props.parentState.data?.status_text ? props.parentState.data?.status_text : ""}
					accessCreate = {false}
				/>
				<Note 
                    data = {props.parentState.data}
                />
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5 p-">
												<div>
													{props.parentState.data.status_text === 'In Progress' && props.parentState.isApprover && props.accessApproval && <button className="btn btn-success m-r-5" type="submit" onClick={(e) => props.setModalOpen("statusApproval", "y")}>{props.parentState.loading ? <i className="fa fa-circle fa-pulse"></i> : "Approve"}</button>}
                                                    {props.parentState.data.status_text === 'In Progress' && props.parentState.isApprover && props.accessApproval && <button className="btn btn-danger m-r-5" type="submit"  onClick={(e) => props.setModalOpen("statusApproval", "n")}>{props.parentState.loading ? <i className="fa fa-circle fa-pulse"></i> : "Reject"}</button>}
													<button className="btn btn-default m-r-5" type="button" onClick={(e) => props.toList(e)}>Kembali</button>  
														{/* <button
																type="submit"
																onClick={() => setStatus('o')}
																className="btn btn-success m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Submit
														</button>
														<button
																type="button"
																onClick={(e) => window.history.back()}
																className="btn btn-white m-r-5"
																disabled={props.parentState.loadings.button}>
																Kembali
														</button> */}
												</div>
										</div>
								</div>
						</div>
				</div>
			</form>
		</FormContext>
	);
}

export default withTranslation()(FormApproval);