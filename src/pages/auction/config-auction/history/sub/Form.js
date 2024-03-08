import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Header from '../../Header';
import History from './History';


const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
		console.log(data)
	};

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					access={props.access}
					data={props.state.data.header}
				/>
				<History
					access={props.access}
					header={props.state.data.header}
					data={props.state.data?.history}
					openModalHistory={(payload) => props.openModalHistory(payload)}
					tonggleCloseModalItem={() => props.tonggleCloseModalItem()}
					toAuctionList={() => props.toAuctionList()}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);