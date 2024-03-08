import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import moment from 'moment';
// import Header from './detail/Header';
import HeaderClassBase from './detail/HeaderClassBase';
import Bid from './detail/Bid';
import Rangking from './detail/Rangking';
// import Tabulation from './detail/Tabulation';
import Score from './detail/Score';
// import { elementType } from 'prop-types';
// import { formatNumber } from '../../../../helpers/formatNumber';

const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
		// console.log(data)
		// console.log(setData(data))
		// console.log("heheh");
		props.storeBidDetailAuctionVendor(setData(data))
	};

	const setData = (data) => {
		let auctions_id = ""
		let arr = []
		let retr={};
		props.bids.forEach((element, i)=> {
			let post= {}
			post.auctions_id =  element['auctions_id']
			auctions_id = element['auctions_id']
			if(props.headers.source==="free"){
				post.auction_free_items_id = element['id']
			}else{
				post.proposal_tender_item_id =  element['proposal_tender_item_id']
			}
			post.vendor_id =  props.vendor_id.username
			post.unit_price =  parseFloat((data['unit_price'][i]===undefined) ? 0 :  data['unit_price'][i].toString().replace(/\./g,'').replace(/,/g,'.')) 
			if(props.headers?.price_calculation==="diskon"){
				post.unit_price =  parseFloat((data['unit_price'][i]===undefined) ? 0 :  parseFloat(data['unit_price'][i]).toFixed(2))
				post.diskon = data['form_discount']!==undefined ?  parseFloat(parseFloat(data['settingvalue'][i]).toFixed(2)) : parseFloat((data['settingvalue'][i]===undefined) ? 0 :  (typeof data['settingvalue'][i] == 'number') ? data['settingvalue'][i] : parseFloat(data['settingvalue'][i].toString().replace(/\./g,'').replace(/,/g,'.'))) 	
			}else{
				post.unit_price =  parseFloat((data['settingvalue'][i]===undefined || data['settingvalue'][i]===null) ? 0 : ((typeof data['settingvalue'][i] == 'number') ? data['settingvalue'][i] : data['settingvalue'][i].toString().replace(/\./g,'').replace(/,/g,'.'))) 
				post.diskon = 0 
			}
			post.unit_price=post.unit_price*parseFloat(props.headers.denominimilisasi)
			post.total =  parseFloat((data['total_price'][i]===undefined) ? 0 :  parseFloat(data['total_price'][i]).toFixed(2))*parseFloat(props.headers.denominimilisasi)	 
			arr.push(post)
		})
		retr.auctions_id =  auctions_id
		retr.bid = arr
		return retr
	}

	// const formattingDate = (e) => {
	// 	let date = "";
	// 	if (e !== undefined) {
	// 		let d = new Date(e)
	// 		date = moment(d).format("YYYY-MM-DD HH:mm:ss")
	// 	}
	// 	return date
	// }

	// const checkKeyDown = (e) => {
  //   if (e.code === 'Enter') {
	// 		e.preventDefault();
	// 		console.log(e.code);
	// 	}
  // };

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)} >
				
				<HeaderClassBase
					loadings={props.loadings}
					data={props.headers} 
					changeFreeze = {() => props.changeFreeze()}
					onRefreshButton = {() => props.onRefreshButton()}
					onCompleteWaitingTimes = {() => props.onCompleteWaitingTimes()}
					waiting_socket_times = {props.waiting_socket_times}
					sisa_auction_socket_times = {props.sisa_auction_socket_times}
					sisa_freeze_socket_times = {props.sisa_freeze_socket_times}
					socket_timer={props.socket_timer}
					/>
				
				<Rangking
					loadings={props.loadings}
					data={props.rangkings} 
					headers = {props.headers} 					
				/>
				
				{props.headers.metode_peringkat!==undefined && props.headers.metode_peringkat==="multivariate" &&
				<Score
					loadings={props.loadings}
					metode_penentuan_pemenang={props.headers.metode_penentuan_pemenang}
					data={props.scores} 
				/>
				}

				<Bid
					methods={methods}
					onSubmit={onSubmit}
					headers={props.headers}
					loadings={props.loadings}
					data={props.bids}
					errors={props.bid_errors}
					akumulasi_ranking={props.akumulasi_ranking}
					handleIncrement = {(i,data) => props.handleIncrement(i,data)}
                    handleDecrement = {(i,data) => props.handleDecrement(i,data)}
                    handleChange = {(i,data) => props.handleChange(i,data)}
                    tongleOpenHistory = {(i,data) => props.tongleOpenHistory(i,data)}
                    increment_decrement_paket_discount={props.increment_decrement_paket_discount}
				/>
				
				{/* <Tabulation
					loadings={props.loadings}
					data={props.tabulations} /> */}
				
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);