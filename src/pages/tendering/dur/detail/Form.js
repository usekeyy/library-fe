import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header'
import Items from './Items'
import DocumentPengadaan from './DocumentPengadaan'
import DetailTender from './DetailTender'
import JadwalTender from './JadwalTender'
import Catatan from './Catatan'
// import Vendor from './Vendor'
import Persyaratan from "./Persyaratan";
import EDoc from "./EDoc"
import Table from './Table';

const Form = (props) => {
	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
		let payload = []
		if(data !== undefined){
			data.status = status
			payload.note = data.note
		}
		payload.status = status
		if (status === "y" || status === "r") {
			props.approvalpayload(data);
		} else {
			props.savePayload(payload);
		}
	};

	const submitCheck = (status) => {
		setStatus(status)
	}

	const saveDraftCheck = (status) => {
		setStatus(status)
	}

	const submitDraft = () => {
		props.savePayload({status: 'd'});
	}

	const ApprovalCheck = (e) => {
		setStatus('y')
	}

	const RejectCheck = (e) => {
		setStatus('r')
	}

	console.log(props.data.status);

	return (
		<FormContext {...methods} >
			
				<Header
					created_by_name={props.data.created_by_name}
					number={props.data.number}
					reference={props.data.reference}
					title={props.data.title}
					total_value={props.data.total_value}
					purchasing_group_id={props.data.purchasing_group_id === null ? "" : props.data.purchasing_group_id + " - " + props.data.purchasing_group_name}
				/>
				<Items
					data={props.data.items}
					modals={(payload) => props.modals(payload)}
				/>
				<DocumentPengadaan data={props.data.attachment} />
				<DetailTender
					metode_pengadaan_name={props.data.metode_pengadaan_name}
					pra_qualification={props.data.pra_qualification}
					metode_aanwijzing_name={props.data.metode_aanwijzing_name}
					metode_penyampaian_name={props.data.metode_penyampaian_name}
					metode_evaluasi={props.data.metode_evaluasi}
					metode_negosiasi={props.data.metode_negosiasi}
					multiwinner={props.data.multiwinner}
					bid_bond_value={props.data.bid_bond_value}
					bid_bond={props.data.bid_bond}
					order_placement={props.data.order_placement}
					incotermn={props.data.incoterm_id + " - " + props.data.incoterm_name}
					note_external={props.data.note_external}
					note_internal={props.data.note_internal}
					visibilitas_bid_open={props.data.visibilitas_bid_open}
					masa_berlaku={props.data.masa_berlaku}
					delivery_time={props.data.delivery_time}
					delivery_location={props.data.delivery_location}
					lingkup_pekerjaan={props.data.lingkup_pekerjaan}
				/>
				<JadwalTender data={props.data.jadwal_tender} />
				<EDoc
					data={props.data.e_doc_aanwijzing}
					modalsEdoc={(payload) => props.modalsEdoc(payload)}
				/>
				<Persyaratan data={props.data.persyaratan}
					modalOpenPersyaratan={(payload) => props.modalOpenPersyaratan(payload)}
					modalTDP={() => props.modalTDP()}
				/>
				<Table
					changeFiltersTableVendor={props.changeFiltersTableVendor}
					filter_dur={props.data.filter_dur}
					uuid={props.uuid}
					number={props.data.number}
					sos_header={props.data.sos_header}
					sos_item={props.data.sos_item}
					optionsFilterBy={props.optionsFilterBy}
					vendors={props.vendorSelection}
					pq_status={props.data.pq_status}
					pra_qualification={props.data.pra_qualification}
					status={props.data.status}
					handlerCheckList={(payload) => props.handlerCheckList(payload)}
					handleChecklistAll={(payload) => props.handleChecklistAll(payload)}
					checkAll={props.checkAll}
					items={props.data.items}
					modalPOOutstanding = {(e,data) => props.modalPOOutstanding(e,data)}
					submitDraft = {() => submitDraft()}
					vendor={props.data.vendor}
					access={props.access}
					user={props.user}
					data_approval={props.data.approvalGroupBy}
					filter1 = {props.filter1}
					filter2 = {props.filter2}
					filter3 = {props.filter3}
					arrFilter = {props.arrFilter}
				/>
				{/* <Vendor
					data={props.vendors}
					vendorSelection={props.vendorSelection}
					loadings={props.loadings}
					handlerCheckList={(payload) => props.handlerCheckList(payload)}
					handleChecklistAll={props.handleChecklistAll}
					status={props.data.status}
					sos_header={props.data.sos_header}
					sos_item={props.data.sos_item}
					optionsFilterBy={props.optionsFilterBy}
					showDurVendor={(payload) => props.showDurVendor(payload)}
					syncrnVendorSAP = {(payload) => props.syncrnVendorSAP(payload)}
					pq_status={props.data.pq_status}
					pra_qualification={props.data.pra_qualification}
					uuid={props.uuid}
					vendors = {props.data.vendor}
				/> */}
				<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Catatan data={props.data.notes} status={props.data.status} errors={props.errors}/>
				
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>

									{((props.user.uuid === props.data.created_by && (props.data.status === "o" || props.data.status === "r")) || (props.user.uuid === props.data.workflow_user && props.data.status === "p")) &&
										<button
											type="submit"
											className="btn btn-info m-r-5"
											onClick={(e) => saveDraftCheck('d')}
											disabled={props.loadingSubmit}
										>
											{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Save Draft</button>
									}
									{/* tombol untuk approver */}

									{props.user.uuid === props.data.workflow_user && (props.data.status === "y" || props.data.status === "p") &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApprovalCheck(e)}
											disabled={props.loadingSubmit}
										>
											{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
									}

									{props.user.uuid === props.data.workflow_user && (props.data.status === "y" || props.data.status === "p") &&
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => RejectCheck(e)}
											disabled={props.loadingSubmit}
										>
											{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
									}
									{/* end tombol untuk approver */}


									{/* tombol untuk buyer */}
									{props.user.uuid === props.data.created_by && (props.data.status === "o" || props.data.status === "r") &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => submitCheck('p')}
											disabled={props.loadingSubmit}
										>
											{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
									}
									{/* end tombol untuk buyer */}

									<button
										type="button"
										onClick={(e) => window.history.back()}
										disabled={props.loadingSubmit}
										className="btn btn-white m-r-5">
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