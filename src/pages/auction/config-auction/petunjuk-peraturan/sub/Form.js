import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Header from '../../Header';
import Editor from './Editor';

const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
		if(data.status==="n"){
			props.toggleConfirmSaveDraft(data)
		}else{
			props.toggleConfirmPublish(data)
		}
    //    props.publishAuction(data);
	};
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					data = {props.state.data.header}
				/>
				<Editor
					access={props.access}
					header = {props.state.data.header}
					options = {props.options}
					data = {props.state.data.detail}
					loadings = {props.state.loadings}
					toAuctionList = {()=>props.toAuctionList()}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);