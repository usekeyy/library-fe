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
	const { header } = props.parentState.tahap_nego;
	const { vendor_selected } = props.parentState.tahap_nego;
	// console.log(header.method_type);
	const onSubmit = data => {
		setData(data)
	};
	
	const setData = (data) => {
		data.header.status = (data.header.status !== '') ? data.header.status.value : '';
		data.header.start_date = (data.header.start_date && data.header.start_date !== "") ? formattingDate(data.header.start_date) : "";
		data.header.end_date = (data.header.end_date && data.header.end_date !== "") ? formattingDate(data.header.end_date) : "";
		delete data.header.start_time_picker;
		delete data.header.end_time_picker;
		delete data.number;
		delete data.status;
		delete data.title;
		delete data.buyer;
		delete data.ambang_batas;
		delete data.oe;
		delete data.attactment_description;
		delete data.attactment_file;
		delete data.process_id;
		delete data.files;
		if(data.header.status !== 'retender' || data.header.status !== 'batal-tender'){
			props.setSendData(data);
		} 
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

	// const show = false
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState} downloadBidTabulation={props.downloadBidTabulation} configAuction={props.configAuction} createAuction= {props.createAuction}/>
				<Item t={props.parentProps.t} parentState={props.parentState} />
				<Evaluation t={props.parentProps.t} parentState={props.parentState} />
				<Negotiation
					t={props.parentProps.t}
					parentState={props.parentState}
					toggleDetailItem={props.toggleDetailItem} />
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
						deleteLampiranTerm={props.deleteLampiranTerm}
						upload={props.upload} />
				{header.order_placement === 'itemize' && vendor_selected.length > 0 && <Itemize
					t={props.parentProps.t}
					parentState={props.parentState}
					handleChecklistItem={props.handleChecklistItem} />}
				<Note parentProps={props.parentProps} parentState={props.parentState} setMethodType={props.setMethodType} />
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{header.on_process === false && header.method_type !== 'retender' && header.method_type !== 'batal-tender' && header.method_type !== 'evaluasi_oe' && <button
																type={"submit"}
																className="btn btn-primary m-r-5"
																disabled={(header.is_retender_itemize.includes('p')) ? true :props.parentState.loadings.button}>
																	{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Process
														</button>}
														{header.on_process === false && (header.method_type === 'retender' || header.method_type === 'batal-tender' || header.method_type === 'evaluasi_oe') && <button
																type={"button"}
																onClick={(e) => {
																	props.toggleOpenRetender('', '', header.method_type)
																}}
																className={(header.method_type === 'retender' || header.method_type === 'batal-tender') ? "btn btn-danger m-r-5" : "btn btn-danger m-r-5"}
																disabled={props.parentState.loadings.button}>
																{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} {(header.method_type === 'retender' || header.method_type === 'batal-tender') ? 'Submit' : 'Proses Evaluasi OE'}
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