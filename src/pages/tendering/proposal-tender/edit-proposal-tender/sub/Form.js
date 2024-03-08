import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header';
import Item from './NewItem';
import Attachment from './Attachment';
import Detail from './Detail';
import Schedule from './Schedule';
import Term from './Term';
import Edoc from './Edoc';
import Participant from './Participant';

const Form = (props) => {
	const methods = useForm();
	// const { t } = props;
	const [status, setStatus] = React.useState('')
	// const { loading } = props.parentState.proposal_tender;
	const { header } = props.parentState.proposal_tender;
	// const { attachments } = props.parentState.proposal_tender;

	const onSubmit = data => {
		console.log(data.schedule);
		setData(data)
		props.submitProposalTender()
	};
	
	const setData = (data) => {
		// if(data.metode_aanwijzing_id.value === 3){
		// 	console.log("sii[p");
		// 	// data.schedule.splice(2, 1)
		// 	delete data.schedule[2].end_date;
		// 	delete data.schedule[2].end_time;
		// 	delete data.schedule[2].jadwal_tender_id;
		// 	delete data.schedule[2].jadwal_tender_name;
		// 	delete data.schedule[2].start_date;
		// 	delete data.schedule[2].start_time;
		// 	delete data.schedule[2].code;
		// 	data.schedule[2] = [];
		// }
		props.setLoading()
		props.setSchedule(data.schedule)
		props.setItemsAttch(data.documents)
		props.setPanitia(data.paticipants)
		data.delivery_time = parseInt(data.delivery_time)
		data.masa_berlaku = parseInt(data.masa_berlaku)
		data.incoterm_id = data.incoterm_id.value;
		data.metode_aanwijzing_id = data.metode_aanwijzing_id.value;
		data.metode_evaluasi = data.metode_evaluasi.value;
		data.metode_negosiasi = data.metode_negosiasi.value;
		data.metode_pengadaan_id = data.metode_pengadaan_id.value;
		data.metode_penyampaian_id = data.metode_penyampaian_id.value;
		data.order_placement = data.order_placement.value;
		data.visibilitas_bid_open = data.visibilitas_bid_open.value;
		data.purchasing_group_id = data.purchasing_group_id.value;
		data.status = status;
		delete data.files;
		delete data.tipe_id;
		delete data.attactment_type;
		delete data.attactment_description;
		delete data.file;
		delete data.created_by_name;
		delete data.schedule;
		props.setHeader(data, status)
	}
	
	const showEdoc = (typeof header.metode_aanwijzing_id === "object" && header.metode_aanwijzing_id !== '' && header.metode_aanwijzing_id !== null) ? (header.metode_aanwijzing_id.value === 1) ? true : false : false;
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header parentProps={props.parentProps} parentState={props.parentState}/>
				<Item
					t={props.parentProps.t}
					parentState={props.parentState}
					modals={(payload) => props.modals(payload)}
				/>
				<Attachment
					parentState={props.parentState}
					upload={props.upload}
					addLampiran={props.addLampiran}
					deleteLampiran={props.deleteLampiran}
				/>
				<Detail
					parentProps={props.parentProps}
					parentState={props.parentState}
					fetchJadwalTender={props.fetchJadwalTender}
					setMetodeEvaluasi={props.setMetodeEvaluasi}
					setMetodeAanwijzing={props.setMetodeAanwijzing}
					fetchMetodePengadaan={props.fetchMetodePengadaan}
					fetchMetodeAanwijzing={props.fetchMetodeAanwijzing}
					fetchMetodePenyampaian={props.fetchMetodePenyampaian}
					fetchIncoterms={props.fetchIncoterms}
				/>
				{showEdoc && <Edoc 
					parentProps={props.parentProps}
					parentState={props.parentState}
					modalsEdoc={props.modalsEdoc}
					editEdoc={props.editEdoc}
					deleteEdoc={props.deleteEdoc}
				/>}
				<Schedule 
					parentProps={props.parentProps} 
					parentState={props.parentState}/>
				<Participant 
					addParticipant={props.addParticipant}
					deleteParticipant={props.deleteParticipant}
					parentProps={props.parentProps} 
					parentState={props.parentState}/>
				<Term
					modalsTerm={props.modalsTerm}
					parentProps={props.parentProps}
					parentState={props.parentState}/>
				<div className="panel bg-white">
						<div className="row">
								<div className="col-sm-12">
										<div className="pull-right m-t-5 m-b-5">
												<div>
														{props.parentState.uuid !== "" && props.parentProps.user.uuid === header.created_by && (header.status === 'r' || header.status === 'o') &&
														<button
																type="submit"
																onClick={() => setStatus('r')}
																className="btn btn-success m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Update
														</button>
														} 
														{props.parentState.uuid !== "" && (header.status === 'd' || header.status === 'x' || header.status === 'c') &&
														<button
																type="submit"
																onClick={() => setStatus('o')}
																className="btn btn-success m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Submit
														</button>
														} 
														{props.parentState.uuid !== "" && (header.status === 'd' || header.status === 'x' || header.status === 'c') &&
														<button
																type="submit"
																onClick={() => setStatus('d')}
																className="btn btn-info m-r-5"
																disabled={props.parentState.loadings.button}>{props.parentState.loadings.button ?
																<i className="fa fa-spinner fa-spin"></i>
																: ''} Save Draft
														</button>
														} 
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