import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {formatNumber, replaceNumberFormat} from '../../../../helpers/formatNumber';
import {toFloat} from '../../../../helpers/toFloat';
import Header from './Header';
import Detail from './Detail';
import Attachment from './Attachment';
import Items from './Items';
import ItemsDuaTahap from './ItemsDuaTahap';
import Term from './Term';
import { toastr } from 'react-redux-toastr';


const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	// const [status, setStatus] = React.useState('')
	const { header } = props.parentState.quotation;
	const metode_penyampaian_id = (header.metode_penyampaian_id !== undefined) ? header.metode_penyampaian_id : '';
	
	const onSubmit = data => {
		let checkBidBond = false;
		let checkBidBondVal = false;
		console.log("Data", data);
		setData(data)
		const convertBidbond = formatNumber(((data.header?.bidbond) ? parseFloat(data.header.bidbond) : 0),2);
		
		if(metode_penyampaian_id !== '2t' && header.bid_bond === "1"){
			checkBidBond = (parseFloat(convertBidbond) < formatNumber(parseFloat(header.bid_bond_value),2)) ? true : false;
		}

		if(header.bid_bond === "1" && header.bid_comersil !== null){
			if((metode_penyampaian_id !== '2t' || (metode_penyampaian_id === '2t' && parseInt(header.current_step) === 2))){
				checkBidBondVal = (parseFloat(convertBidbond) < formatNumber((parseFloat(data.header?.total_penawaran)*(parseFloat(header.bid_bond_value)/100)),2)) ? true : false;
			}
		}

		// console.log('checkBidBondVal :' +checkBidBondVal)
		// console.log('checkBidbond :'+checkBidBond )
		// console.log('hasil' + (parseFloat(data.header?.total_penawaran)*(parseFloat(header.bid_bond_value)/100)))
		// console.log('cenovert '+convertBidbond)

		if(checkBidBond === false && checkBidBondVal === false) {
			delete header.total_penawaran;
			delete data.header?.total_penawaran;
			// const sendObj = {
			// 	"attachments": data.attachments,
			// 	"header": {
			// 			"number": "",
			// 			"validity": "",
			// 			"location": "",
			// 			"bidbond_file": "",
			// 			"note": "",
			// 			"date": "",
			// 			"incoterm_id": "",
			// 			"bidbond": "",
			// 			"bidbond_validity": ""
			// 	},
			// 	"items": [],
			// 	"service_lines": [],
			// 	"step": data.step,
			// 	"bid_bond": data.bid_bond
			// }
			const sendData = data; //(metode_penyampaian_id === '2t' && parseInt(header.current_step) === 1) ? sendObj : data;
			// console.log("SendData", sendData);
			if (props.parentState.paramType === 'detail'){
				props.submit(sendData);
			}
			if (props.parentState.paramType === 'update'){

				props.update(sendData);
			}
		} else {
			if(checkBidBondVal || checkBidBond){ toastr.warning(`Nilai Bidbond Quotation (${convertBidbond}) Kurang Dari Nilai Bidbond Tender (${formatNumber(parseFloat(data.header.total_penawaran)*(parseFloat(header.bid_bond_value)/100), 2)})`) }
		}
	};
	
	const setData = (data) => {
		let arr_barang = [];
		if(typeof data.header?.bidbond === 'number'){
			data.header.bidbond = data.header.bidbond.toString().replace('.',',')
		}
		const convertBidbond = (data.header?.bidbond) ? replaceNumberFormat(data.header.bidbond) : 0;
		// console.log(convertBidbond);
		if(data.items && data.items.length > 0){
			data.items.forEach(async (item, key) => {
				if(typeof item.valuation_price === 'string'){
					item.valuation_price = await toFloat(item.valuation_price)
				}
				if(typeof item.qty === 'string'){
					item.qty = await toFloat(item.qty)
				}
				// const convertPrice = item.valuation_price.toString().indexOf('.') !== -1 ? parseFloat(replaceNumberFormat(item.valuation_price.split('.').join(''))) : parseFloat(replaceNumberFormat(item.valuation_price));
				const convertPrice = item.valuation_price;
				// const convertPrice = parseFloat(replaceNumberFormat(item.valuation_price))
				let setObj = {
					delivery_time: (parseInt(item.delivery_time) <= 0) ? "" : item.delivery_time,
					proposal_tender_item_id: item.proposal_tender_item_id,
					purchasing_requisition_item_id: item.purchasing_requisition_item_id,
					qty: (parseFloat(item.qty) <= 0) ? "" : parseFloat(item.qty),
					quote: item.quote,
					remark: item.remark,
					spesifikasi: data.service_lines && data.service_lines.length > 0 ? "-" : item.spesifikasi,
					short_text: item.short_text,
					valuation_price: (convertPrice <= 0) ? 0 : convertPrice,
				}
				arr_barang.push(setObj)
			})
		}
		if(metode_penyampaian_id === '2t'){
			data.step = header.current_step
			if(header.current_step === 2){
				let arr = [];
				if(data.service_lines && data.service_lines.length > 0){
					data.service_lines.forEach((item, key) => {
						// const convertPriceLine = item.valuation_price.toString().indexOf('.') !== -1 ? parseInt(item.valuation_price.split('.').join('')) : parseInt(item.valuation_price);
						const convertPriceLine = item.valuation_price;
						let setObj = {
							delivery_time: (parseInt(item.delivery_time) <= 0) ? "" : item.delivery_time,
							proposal_tender_item_id: item.proposal_tender_item_id,
							purchasing_requisition_item_id: item.purchasing_requisition_item_id,
							qty: (parseFloat(item.qty) <= 0) ? "" : item.qty,
							quote: item.quote,
							remark: item.remark,
							spesifikasi: item.short_text,
							short_text: item.short_text,
							purchasing_requisition_service_id: item.purchasing_requisition_service_id,
							valuation_price: (convertPriceLine <= 0) ? 0 : convertPriceLine,
						}
						arr.push(setObj)
					})
				}
				data.service_lines = arr;
				data.header.incoterm_id = (data.header.incoterm_id !== null && data.header.incoterm_id !== '') ? data.header.incoterm_id.value : '';	
			}else{
				let arr = [];
				if(data.service_lines && data.service_lines.length > 0){
					data.service_lines.forEach((item, key) => {
						// const convertPriceLine = item.valuation_price.toString().indexOf('.') !== -1 ? parseFloat(item.valuation_price.split('.').join('')) : parseFloat(item.valuation_price);
						const convertPriceLine = parseFloat(item.valuation_price);
						let setObj = {
							delivery_time: (parseInt(item.delivery_time) <= 0) ? "" : item.delivery_time,
							proposal_tender_item_id: item.proposal_tender_item_id,
							purchasing_requisition_item_id: item.purchasing_requisition_item_id,
							qty: (parseFloat(item.qty) <= 0) ? "" : item.qty,
							quote: item.quote,
							remark: item.remark,
							spesifikasi: item.short_text,
							short_text: item.short_text,
							purchasing_requisition_service_id: item.purchasing_requisition_service_id,
							valuation_price: (convertPriceLine <= 0) ? 0 : convertPriceLine,
						}
						arr.push(setObj)
					})
				}
				data.service_lines = arr;
				data.header.incoterm_id = (data.header.incoterm_id !== null && data.header.incoterm_id !== '') ? data.header.incoterm_id.value : '';
			}
		} else {
			let arr = [];
			if(data.service_lines && data.service_lines.length > 0){
				data.service_lines.forEach((item, key) => {
					let setObj = {
						delivery_time: (parseInt(item.delivery_time) <= 0) ? "" : item.delivery_time,
						proposal_tender_item_id: item.proposal_tender_item_id,
						purchasing_requisition_item_id: item.purchasing_requisition_item_id,
						qty: (parseFloat(item.qty) <= 0) ? "" : item.qty,
						quote: item.quote,
						remark: item.remark,
						spesifikasi: item.short_text,
						short_text: item.short_text,
						purchasing_requisition_service_id: item.purchasing_requisition_service_id,
						valuation_price: (parseFloat(item.valuation_price) <= 0) ? 0 : item.valuation_price,
					}
					arr.push(setObj)
				})
			}
			data.service_lines = arr;
			data.header.incoterm_id = (data.header.incoterm_id !== null && data.header.incoterm_id !== '') ? data.header.incoterm_id.value : '';
		}

		data.bid_bond = header.bid_bond;
		if(data.header?.bidbond) { data.header.bidbond = convertBidbond; }
		if(data.header?.date) { data.header.date = formattingDate(data.header.date); }
		if(data.header?.bidbond_validity) { data.header.bidbond_validity = formattingDate(data.header.bidbond_validity); }
		data.items = arr_barang;
		delete data.files
		delete data.terms
	}

	const formattingDate = (e) => {
		var timestamp = Date.parse(e);
		if (isNaN(timestamp) === false && typeof e === 'object') {
			let d = new Date(e);
			let month = '' + (d.getMonth() + 1);
			let day = '' + d.getDate();
			let year = d.getFullYear();
	
			if (month.length < 2) 
					month = '0' + month;
			if (day.length < 2) 
					day = '0' + day;
	
			return [year, month, day].join('-');
		} else {
			let newDate;
			if(e !== ""){
				if(e.indexOf('-') !== -1){
					const splitDate = e.split("-");
					newDate = splitDate.reverse().join("-");
				} else {
					newDate = "";
				}
			} else {
				newDate = "";
			}
			return newDate;
		}
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} />
				<Detail parentProps={props.parentProps} parentState={props.parentState} />
				<Attachment parentProps={props.parentProps} parentState={props.parentState} />
				{(metode_penyampaian_id !== '2t' || (metode_penyampaian_id === '2t' && parseInt(header.current_step) === 2)) && <Items
					parentProps={props.parentProps}
					parentState={props.parentState}
					fetchIncoterms={props.fetchIncoterms}
					upload={props.upload}
				/>}
				{(metode_penyampaian_id === '2t' && (metode_penyampaian_id === '2t' && parseInt(header.current_step) === 1)) && 
				<ItemsDuaTahap
					parentProps={props.parentProps}
					parentState={props.parentState}
					fetchIncoterms={props.fetchIncoterms}
					upload={props.upload}
				/>}
				<Term parentProps={props.parentProps} parentState={props.parentState} upload={props.upload} />
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														<button
																type="submit"
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
				</div>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);