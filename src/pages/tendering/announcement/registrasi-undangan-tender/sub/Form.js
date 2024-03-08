import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import Item from './Item';
import Detail from './Detail';
import Scope from './Scope';
import Note from './Note';
import Schedule from './Schedule';
import Term from './Term';
import Process from './Process';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	const { header } = props.parentState.vendor_registration_tender;

	const onSubmit = data => {
		setData(data)
		props.saveVendorRegistrationTender(data);
	};
	
	const setData = (data) => {
		delete data.bid_bond_date;
		delete data.created_at;
		delete data.lingkup_pekerjaan;
		delete data.number;
		delete data.files;
		delete data.purchasing_org_id;
		delete data.title;
		console.log(data);
	}
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Item t={props.parentProps.t} parentState={props.parentState} />
				<Detail  parentProps={props.parentProps} parentState={props.parentState}/>
				<Scope parentProps={props.parentProps} parentState={props.parentState} />
				<Note parentProps={props.parentProps} parentState={props.parentState} />
				<Schedule parentProps={props.parentProps} parentState={props.parentState} />
				<Term parentProps={props.parentProps} parentState={props.parentState} />
				{header.status === 'y' && <Process parentProps={props.parentProps} parentState={props.parentState} upload={props.upload} />}
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{header.status === 'y' && <button
																type="submit"
																className="btn btn-success m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Submit
														</button>}
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
				</div>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);