import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import Item from './Item';
import Note from './Note';
import Evaluation from './Evaluation';
import Negotiation from './Negotiation';
import Vendor from './Vendor';
import ConfigNego from './ConfigNego';
import Itemize from './Itemize';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	const { header } = props.parentState.re_nego;

	const onSubmit = data => {
		setData(data)
	};
	
	const setData = (data) => {
		data.header.status = (data.header.status !== '') ? data.header.status.value : '';
		delete data.number;
		delete data.status;
		delete data.title;
		delete data.buyer;
		delete data.ambang_batas;
		delete data.oe;
		delete data.attactment_description;
		delete data.process_id;
		props.setSendData(data);
		// console.log(data);
	}

	// const show = false
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Item t={props.parentProps.t} parentState={props.parentState} />
				<Evaluation t={props.parentProps.t} parentState={props.parentState} />
				<Negotiation
					t={props.parentProps.t}
					parentState={props.parentState}
					toggleDetailItem={props.toggleDetailItem}/>
				<Vendor
					t={props.parentProps.t}
					parentState={props.parentState}
					handleChecklistVendor={props.handleChecklistVendor}
					toggleOpenDokumenVendor={props.toggleOpenDokumenVendor}
				/>
				<ConfigNego
						t={props.parentProps.t}
						parentState={props.parentState}
						addLampiranTerm={props.addLampiranTerm}
						deleteLampiranTerm={props.deleteLampiranTerm} />
				{header.order_placement === 'itemize' && <Itemize
					t={props.parentProps.t}
					parentState={props.parentState}
					handleChecklistItem={props.handleChecklistItem}/>}
				<Note parentProps={props.parentProps} parentState={props.parentState} />
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{<button
																type="submit"
																className="btn btn-primary m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Process
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