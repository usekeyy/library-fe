import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import Header from '../../Header';
import ListPeserta from './ListPeserta';
import PesertaAuction from './PesertaAuction';


const Form = (props) => {
	const {t} = props;
	const methods = useForm();
	
	const onSubmit = data => {
		if(props.state.data?.header.metode_peringkat==="multivariate" && props.state.data?.header.source==="free"){
			let bobot_teknis = data.bobot_teknis===undefined ? 0 : parseFloat(data.bobot_teknis.toString().replace(/\./g,'').replace(/,/g,'.'))
			let bobot_komersil = data.bobot_komersil===undefined ? 0 : parseFloat(data.bobot_komersil.toString().replace(/\./g,'').replace(/,/g,'.'))
			let sumbobot= bobot_komersil+ bobot_teknis
			if(sumbobot!==100){
				toastr.warning(t("auction:alert.bobot-multivariate-not-allowed"), t("auction:alert.bobot-multivariate"))
			}else{
				props.pesertaItemsAuction({
					vendor : setDataFree(props.state.tempVendorSelectionsId),
					bobot_teknis : bobot_teknis,
					bobot_komersil : bobot_komersil
				})
			}
		}
		if(props.state.data?.header.source==="eproc"){
			// props.pesertaItemsAuction({vendor_id : props.state.vendorsSelection})
			if(props.state.data.header.order_placement === "paket"){
				props.pesertaItemsAuction({
					vendor : setDataPaket(data),
					bobot_teknis : parseFloat(props.state.data.header.bobot_teknis),
					bobot_komersil : parseFloat(props.state.data.header.bobot_komersil)
				})
			}
			if(props.state.data.header.order_placement === "itemize"){
				props.pesertaItemsAuction({
					vendor : setDataItemize(data),
					bobot_teknis : parseFloat(props.state.data.header.bobot_teknis),
					bobot_komersil : parseFloat(props.state.data.header.bobot_komersil)
				})
			}
		}
		if(props.state.data?.header.source==="free" && props.state.data?.header.metode_peringkat!=="multivariate"){
			// console.log({vendor : setDataFree(props.state.tempVendorSelectionsId)})
			props.pesertaItemsAuction({vendor : setDataFree(props.state.tempVendorSelectionsId)})
		}
	};

	const setDataPaket = (data) => {
		let arr = []
		props.state.vendorsSelection.forEach((element) => {
			arr.push({"auction_items_id": "","vendor_id" : element})
		})
		return arr
	}

	const setDataFree = (data) => {
		let arr = []
		if(props.state.data?.header.metode_penentuan_pemenang==="paket"){
			props.state.vendorsSelection.forEach((element,j)=>{
				arr.push({"auction_items_id": "","vendor_id" : element})
			})
		}else{
			data.forEach((vendor) => {
				props.state.data.detail_item.forEach((item) => {
					arr.push({"auction_items_id": item.id,"vendor_id" : vendor})
				})
			})
		}
		
		return arr
	}

	const setDataItemize = (data) => {
		let arr = []
		props.state.prKeyItem.forEach((element,i) => {
			props.state.vendorsSelection[i].forEach((element,j)=>{
				arr.push({"auction_items_id": i,"vendor_id" : element})
			})
		})		
		return arr
	}
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					data = {props.state.data.header}
				/>
				<ListPeserta
				access={props.access}
				header = {props.state.data?.header}
				data = {props.state.data?.list_peserta} 
				handlerCheckAll = {()=>props.handlerCheckAll()}
				onCheckItemize = {(i, data,j)=>props.onCheckItemize(i,data,j)}
				vendorsSelection = {props.state.vendorsSelection}
				onCheck = {(payload)=> props.onCheck(payload)}
				checkAll={props.state.checkAll}
				onCheckAllItemize = {(i,j) => props.onCheckAllItemize(i,j)}
				errors = {props.state.errors}
				loadings={props.state.loadings}
				prKeyItem={props.state.prKeyItem}
				vendorOptions ={props.state.vendorOptions}
				addVendorSelection = {(data) => props.addVendorSelection(data)}
				getOptionsVendorAuction={(payload) =>props.getOptionsVendorAuction(payload)}
				toAuctionList = {()=> props.toAuctionList()}
				/>
				<PesertaAuction
				access={props.access}
				header = {props.state.data?.header}
				data = {props.state.data?.list_peserta} 
				tempVendorSelections = {props.state.tempVendorSelections}
				loadings = {props.state.loadings}
				toAuctionList = {()=> props.toAuctionList()}
				toggleOpenModalInitialBid = {(vendor_id)=> props.toggleOpenModalInitialBid(vendor_id)}
				toggleConfirmFreeze = {(e,vendor_id) =>props.toggleConfirmFreeze(e,vendor_id)}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);