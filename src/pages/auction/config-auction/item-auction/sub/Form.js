import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Header from '../../Header';
import ItemsAuction from './ItemsAuction';


const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
		props.updateItemAuction(setData())		
	};

	const setData = () => {
		let arr = []
		props.state.data.detail_item.forEach(element => {
			arr.push({
				proposal_tender_item_id: element.proposal_tender_item_id,
				auction_id: element.auctions_id,
				high_unit_price: element.high_unit_price===null ? null : parseFloat(element.high_unit_price),
				low_unit_price: element.low_unit_price===null ? null : parseFloat(element.low_unit_price),
				discount: element.discount,
			})
		});
		return arr
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					data={props.state.data.header}
				/>
				<ItemsAuction
					access={props.access}
					options={props.options}
					loadings={props.state.loadings}
					header={props.state.data.header}
					data={props.state.data.detail_item}
					openModals= {(payload) => props.openModals(payload)}
					openModalFreeAuction = {(payload) => props.openModalFreeAuction(payload)}
					editModalFreeAuction = {(payload) => props.editModalFreeAuction(payload)}
					toAuctionList= {() => props.toAuctionList()}
					toggleConfirm = {(e,payload) => props.toggleConfirm(e, payload)}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);