import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import BidItem from './BidItem';
import Negotiation from './Negotiation';
import Vendor from './Vendor';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	const [status, setStatus] = React.useState('')
	const { header } = props.parentState.proses_nego_vendor;
	const { dataTemp } = props.parentState.proses_nego_vendor;
	
	const onSubmit = data => {
		setData(data)
		props.saveBuyerNegotiation({action: status, items: data.items});
		// console.log(data);
	};
	
	const setData = (data) => {
		// console.log(data);
		let items = [];
		delete data.ambang_batas;
		delete data.status;
		delete data.number;
		delete data.title;
		if(data.items.length > 0){
			data.items.forEach(dt => {
				items.push(dt);
			})
		}
		data.items = items;
	}

	const show = (dataTemp.tipe === "2") ? (dataTemp.status === "closed") : true 
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Vendor t={props.parentProps.t} parentState={props.parentState} toggleDetailItem={props.toggleDetailItem} saveBuyerNegotiation={props.saveBuyerNegotiation} downloadBAHN={props.downloadBAHN} isRole={props.isRole} />
				<BidItem t={props.parentProps.t} parentState={props.parentState} />
				{show && <Negotiation t={props.parentProps.t} parentState={props.parentState} isRole={props.parentState.isRole} />}
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{(header.current === props.isRole && dataTemp.tipe === "1" && dataTemp.status === 'nego') && <button
																type="submit"
																onClick={() => setStatus('rejected')}
																className="btn btn-danger m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Reject
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