import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Header from '../../Header';
import DetailParameterAuction from './DetailParameterAuction';

const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {	
		// console.log(setData(data))
		props.storeDetailAuction(setData(data))
	};

	const setData = (data) => {
		data.freeze =(data.freeze==="" || data.freeze===undefined  ) ?  0 : parseFloat(data.freeze.toString().replace(/\./g,'').replace(/,/g,'.'))
		data.auction_type= (data.auction_type===undefined || data.auction_type===null) ? "" : data.auction_type.value
		data.denominimilisasi= (data.denominimilisasi===undefined || data.denominimilisasi===null) ? "" : data.denominimilisasi.value
		data.increment_decrement =  parseFloat( (data.increment_decrement===null) ? 0 : (data.increment_decrement.length > 3) ? data.increment_decrement.replace(/\./g,'').replace(/,/g,'.') : data.increment_decrement )
		data.metode_penentuan_pemenang =  (data.metode_penentuan_pemenang===undefined || data.metode_penentuan_pemenang===null)? "" : data.metode_penentuan_pemenang.value
		data.metode_peringkat =  (data.metode_peringkat===undefined || data.metode_peringkat===null)? "" : data.metode_peringkat.value
		data.opsi_penampilan_peringkat =  (data.opsi_penampilan_peringkat===undefined || data.opsi_penampilan_peringkat===null)? "" : data.opsi_penampilan_peringkat.value
		data.opsi_penerimaan_jumlah =  (data.opsi_penerimaan_jumlah===undefined || data.opsi_penerimaan_jumlah===null)? "" : data.opsi_penerimaan_jumlah.value
		data.price_calculation =  (data.price_calculation===undefined || data.price_calculation===null)? "" : data.price_calculation.value
		data.purchasing_group_id =  (data.purchasing_group_id===undefined || data.purchasing_group_id===null)? "" : data.purchasing_group_id.value
		data.purchasing_org_id =  (data.purchasing_org_id===undefined || data.purchasing_org_id===null)? "" : data.purchasing_org_id.value
		data.jenis_auction =  (data.jenis_auction===undefined || data.jenis_auction===null)? "" : data.jenis_auction.value
		data.visibilitas_harga_terbaik =  (data.visibilitas_harga_terbaik===undefined || data.visibilitas_harga_terbaik===null)? "" : data.visibilitas_harga_terbaik.value
		data.visibilitas_peringkat_terbaik =  (data.visibilitas_peringkat_terbaik===undefined || data.visibilitas_peringkat_terbaik===null)? "" : data.visibilitas_peringkat_terbaik.value
		data.visibilitas_oe =  (data.visibilitas_oe===undefined || data.visibilitas_oe===null)? "" : data.visibilitas_oe.value
		return data
	}
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					data = {props.state.data.header}
				/>
				<DetailParameterAuction
					access={props.access}
					loadings = {props.state.loadings}
					options = {props.state.options}
					data = {props.state.data.detail}
					header = {props.state.data.header}
					errors = {props.state.errors}
					fetchPurchasingGroup = {(payload) => props.fetchPurchasingGroup(payload)}
					toAuctionList = {() => props.toAuctionList()}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);