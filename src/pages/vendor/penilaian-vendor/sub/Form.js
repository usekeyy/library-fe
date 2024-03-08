import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Attachment from './Attachment';
import Note from './Note';
import TableConfig from './TableConfig';
import ReactLoading from 'react-loading';
import ApprovalTableConfig from './ApprovalTableConfig';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	const [template, setTemplate] = React.useState('')
	// const { loading } = props.parentState.proposal_tender;
	// const { attachments } = props.parentState.proposal_tender;
	React.useEffect(() => {
		if(Object.keys(props.parentState.dataDefaultTemplate).length !== 0){
			setTemplate(props.parentState.dataDefaultTemplate?.uuid)
		}
	},[props.parentState.dataDefaultTemplate])

	const onSubmit = data => {
		props.save(setData(data))
		// console.log(setData(data))
		
	};
	
	const setData = (data) => {
		let penilaian = [];
        for (const [key, value] of Object.entries(data)) {
			if(key !== 'note'){
				penilaian.push({
					id_subcategory : key,
					id_rating : value
				})
			}
        }
		const payload = {
			score : props.parentState.score,
			penilaian : penilaian,
			note : data?.note,
			vendor_id : (props.parentState.data?.po?.vendor_id || props.parentState.data.vendor_id),
			po_id : (props.parentState.data?.po?.id || props.parentState.data.id),
			// revisi : (props.parentState.data?.po?.status_text ? "0" : "1"),
			revisi : (props.parentState.isStatusCreate === 'Rejected' ? "1" : "0"),
			uuid_template : template
		}

		return payload
	}

	const onChangeSelect = (event) => {
		setTemplate(event.target.value)
		props.fetchDetail(event.target.value)
	}
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{props.accessCreate && (props.parentState.isStatusCreate === 'Open' || props.parentState.isStatusCreate === 'Rejected') &&
				<select name="template" onChange={(e) => onChangeSelect(e)} className="form-control">
					<option value="s" disabled selected={props.parentState.isStatusCreate === 'Open' ? true : false}>Pilih Template Penilaian.....</option>
					{/* {console.log(props.parentState.dataDefaultTemplate)} */}
					{props.parentState.dataTemplate.map((data) => {
						let isSelected = false
						if (props.parentState.isStatusCreate === 'Rejected' && Object.keys(props.parentState.dataDefaultTemplate).length !== 0){
							if(data.uuid === props.parentState.dataDefaultTemplate?.uuid){
								isSelected = true
							}
						}
						return (
							<>
								<option value={data.uuid} selected={isSelected}>{data.name}</option>
							</>
						)
					})}
               	</select>
				}
				<br></br>
				{/* <Header parentProps={props.parentProps} parentState={props.parentState}/>
				<Term
					modalsTerm={props.modalsTerm}
					parentProps={props.parentProps}
					parentState={props.parentState}/> */}
				{props.parentState.loading ? <center><ReactLoading type="cylon" color="#0f9e3e" /><br /></center> :
				(props.accessCreate ? 
					<TableConfig 
						data = {props.parentState.data}
						loading = {props.parentState.loading}
						save = {props.save}
						toList = {props.toList}
						upload = {props.upload}
						setValueState = {props.setValueState}
						tempScore = {props.parentState.tempScore}
						accessCreate = {props.accessCreate}
						statusText = {props.parentState.isStatusCreate}
						
					/> :
					<ApprovalTableConfig 
						data = {props.parentState.data}
						loading = {props.parentState.loading}
						save = {props.save}
						toList = {props.toList}
						upload = {props.upload}
						setValueState = {props.setValueState}
					/>
				)}
				<Attachment 
					setModalOpen = {props.setModalOpen}
					data = {props.parentState.dataAttachment}
					delete = {props.deleteVprAttachment}
					isRequestor = {props.parentState.isRequestor}
					statusText = {props.parentState.isStatusCreate}
					accessCreate = {props.accessCreate}
					// isStatusCreate = {props.parentState.isStatusCreate}
				/>
				<Note 
					data = {props.parentState.data}
				/>
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5 p-">
												<div>
													{props.accessCreate && (props.parentState.isStatusCreate === 'Open' || props.parentState.isStatusCreate === 'Rejected') && Object.keys(template).length !== 0 && <button className="btn btn-success m-r-5" type="submit">{props.parentState.loadingSubmit ? <i className="fa fa-spinner fa-pulse"></i> : "Submit"}</button>}
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

export default withTranslation()(Form);