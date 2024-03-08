import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import Detail from './Detail';
import Attachment from './Attachment';
import Items from './Items';
import Term from './Term';


const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	// const { header } = props.parentState.quotation;

	const onSubmit = data => {
		setData(data)
		if (props.parentState.paramType === 'detail'){
			props.submit(data);
		}
		if (props.parentState.paramType === 'update'){
			props.update(data);
		}
	};
	
	const setData = (data) => {
		let arr = [];
		if(data.service_lines && data.service_lines.length > 0){
			data.service_lines.forEach((item, key) => {
				arr.push(item)
			})
		}
		data.service_lines = arr;
		data.header.incoterm_id = (data.header.incoterm_id !== null && data.header.incoterm_id !== '') ? data.header.incoterm_id.value : '';
		delete data.files
		delete data.terms
	}
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)} disabled>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Detail parentProps={props.parentProps} parentState={props.parentState} />
				<Attachment parentProps={props.parentProps} parentState={props.parentState} />
				<Items
					parentProps={props.parentProps}
					parentState={props.parentState}
					fetchIncoterms={props.fetchIncoterms}
					upload={props.upload}
				/>
				<Term parentProps={props.parentProps} parentState={props.parentState} upload={props.upload} />
				{/* <div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														<button
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
														</button>
												</div>
										</div>
								</div>
						</div>
				</div> */}
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);