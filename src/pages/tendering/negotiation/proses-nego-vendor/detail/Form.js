import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import BidItem from './BidItem';
import Negotiation from './Negotiation';
import History from './History';
import Attachment from './Attachment';
import { toastr } from 'react-redux-toastr';
import { toFloat } from '../../../../../helpers/toFloat';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	// const { header } = props.parentState.proses_nego_vendor;
	const { dataTemp } = props.parentState.proses_nego_vendor;

	const onSubmit = data => {
		setData(data)
	};
	
	const setData = async (data) => {
		const items = []
		// console.log(data.send_items);
		let max_value = false;
		if(data.send_items !== undefined){
			if(data.send_items.length > 0){
				data.send_items.forEach(async (item, key) => {
					
					// const convertPrice = item.price.toString().indexOf(',') !== -1 ? parseFloat(item.price.toString().split(',').join('.')) : item.price.toString().indexOf(',') !== -1 && item.price.toString().indexOf('.') !== -1 ? floatPrice : parseInt(item.price);
					if(typeof item.price === 'string'){
						item.price = await toFloat(item.price)
					}
					if(typeof item.max_value === 'string'){
						item.max_value = await toFloat(item.max_value)
					}
					// const convertPrice = await toFloat(item.price);
					// const maxPrice = await toFloat(item.max_value);
					const convertPrice = item.price;
					const maxPrice = item.max_value;
					console.log("convertPrice", convertPrice);
					console.log("maxPrice", maxPrice);
					console.log("item.price", item.price);
					console.log("item.max_value", item.max_value);
					if(maxPrice < convertPrice){
						max_value = true;
					}
					const sendObj = {
						delivery_time: item.delivery_time,
						id: item.id,
						price: convertPrice,
						proposal_tender_item_id: item.proposal_tender_item_id,
						purchasing_requisition_service_id: item.purchasing_requisition_service_id,
						qty: item.qty,
						remark: item.remark,
					}
					items.push(sendObj)
				})
			}
		}
		console.log(max_value);
		data.items = items
		delete data.bid_bond_date;
		delete data.ambang_batas;
		delete data.status;
		delete data.created_at;
		delete data.lingkup_pekerjaan;
		delete data.number;
		delete data.files;
		delete data.purchasing_org_id;
		delete data.title;
		delete data.terms;
		delete data.send_items;
		// console.log("data", data);
		if(!max_value) { props.saveVendorNegotiation(data); } else { toastr.error("Fail", "Validation Failed") }
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<BidItem t={props.parentProps.t} parentState={props.parentState} toggleDetailItem={props.toggleDetailItem} />
				{!props.parentState.detailNego && <Negotiation t={props.parentProps.t} parentState={props.parentState} />}
				<History t={props.parentProps.t} parentState={props.parentState} />
				<Attachment t={props.parentProps.t} parentState={props.parentState} upload={props.upload} />
				{!props.parentState.detailNego && <div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{dataTemp.current === props.parentState.isRole && (dataTemp.status === 'nego' || dataTemp.status_nego === 'rejected') && <button
																type="submit"
																className="btn btn-primary m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Send
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
				</div>}
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);