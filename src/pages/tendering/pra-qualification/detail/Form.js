import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header'
import Items from './Items'
import ItemsVendor from './ItemsVendor'
// import DocumentPengadaan from './DocumentPengadaan'
import DetailTender from './DetailTender'
import JadwalTender from './JadwalTender'
import Catatan from './Catatan'
import Vendor from './Vendor'
import PersyaratanDetail from "./PersyaratanDetail";
import KemampuanPasok from "./KemampuanPasok";
import Klarifikasi from "./Klarifikasi";
import PersyaratanVendor from "./PersyaratanVendor";
import PraQualificationDate from "./PraQualificationDate";

// var curr = new Date();
	// curr.setDate(curr.getDate());
	// let date = curr.toISOString().substr(0,10);
	// let time = curr.toString().substr(16, 8);
	// let now = date + ' ' + time
	// console.log(now)

const Form = (props) => {

	// console.log(props.data)
	// console.log(props.data_jadwal_pq)
	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
		data.status = status
		let payload = []
		payload.status = status
		payload.note = data.note
		if (status === "register_vendor") {
			// console.log('regis vendor')
			props.savePraQualificationRegisterVendor(payload);
		}
		else if (status === "y" || status === "r")
		{
			props.approvalPraQualification(payload);
		}
		else{
			// console.log('note')
			props.publishPraQualification(payload);
		}
	};

	const submitCheck = (e) => {
		setStatus('p')
	}

	const RegisterVendor = (e) => {
		setStatus('register_vendor')
	}

	const ApprovalCheck = (e) => {
		setStatus('y')
	}

	const RejectCheck = (e) => {
		setStatus('r')
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					created_by_name={props.data.created_by_name}
					role_vendor={props.role_vendor}
					pq_start_date={props.data.pq_start_date}
					pq_end_date={props.data.pq_end_date}
					status={props.data.pq_status}
					status_text={props.data.pq_status_text}
					company_name={props.data.company_name}
					number={props.data.number}
					reference={props.data.reference}
					title={props.data.title}
					total_value={props.data.total_value}
					// purchasing_group_id = {props.data.purchasing_group_id===null ? "" : props.data.purchasing_group_id +" - "+ props.data.purchasing_group_name}
				/>
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
					incotermn={props.data.incoterm_id+" - "+props.data.incoterm_name}
					note_external={props.data.note_external}
					note_internal={props.data.note_internal}
					visibilitas_bid_open={props.data.visibilitas_bid_open}
					masa_berlaku={props.data.masa_berlaku}					
					delivery_time={props.data.delivery_time}
					delivery_location={props.data.delivery_location}
					lingkup_pekerjaan={props.data.lingkup_pekerjaan}
				/>
				{!props.role_vendor ?
					<Items 
						data={props.data.items} 
						modals={(payload) => props.modal_item(payload)}
					/> :
					<ItemsVendor
						data={props.data.items} 
					/>
				}
				{props.role_vendor && 
					<KemampuanPasok
						data_header={props.data.sos_header}
						data_item={props.data.sos_item}
					/>
				}
				{!props.role_vendor &&
					<PersyaratanDetail
						data={props.data.persyaratan}
						modals={(payload) => props.modal_persyaratan(payload)}
					/>
				}
				<PraQualificationDate 
					role_vendor={props.role_vendor}
					status={props.data.pq_status}
					created_by={props.data.created_by}
					uuid={props.user.uuid}
					data={props.data_jadwal_pq}
					update={(payload) => props.update_date(payload)}
				/>
				{!props.role_vendor && 
					<Vendor
						data={props.data.vendor}
						data_vendor={props.data.vendor.list}
						modals={(payload) => props.modal_evaluasi(payload)}
					/>
				}
				<JadwalTender data={props.data.jadwal_tender} />
				{props.role_vendor &&
					<PersyaratanVendor
						data={props.data_persyaratan_vendor}
						data_user_vendor={props.data_user_vendor}
						upload={props.fileUpload}
						save={props.savePraQualificationDokumenPersyaratanVendor}
						modals={(payload) => props.modal_evaluasi(payload)}
					/>
				}
				{!props.role_vendor && 
					<Catatan
						data={props.data.notes}
						status_catatan={props.status_catatan}
						save={props.savePraQualificationNotes}
						onInputChangeCatatan={props.onInputChangeCatatan}
						errors={props.errors}
						created_by={props.data.created_by}
						uuid={props.user.uuid}
						workflow_user={props.data.workflow_user}
						status={props.data.status}
					/>
				}
				{props.role_vendor && 
					<Klarifikasi
						data={props.data_klarifikasi}
						data_klarifikasi_submit_vendor={props.data_klarifikasi_submit_vendor}
						onInputChangeKlarifikasi={props.onInputChangeKlarifikasi}
						upload={props.fileUpload}
						save={props.saveKlarifikasiVendor}
						uuid={props.user.uuid}
						workflow_user={props.data.workflow_user}
						status={props.data.status}
					/>
				}
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{props.status_date && <span className="text-danger" style={{paddingRight: "10px"}}>update dan lengkapi data Jadwal Pra Kualifikasi terlebih dahulu </span>}
									{props.status_pq_date && <span className="text-danger" style={{paddingRight: "10px"}}><b>Start Date</b> tidak boleh melebihi <b>End Date</b> pada Jadwal Pra Kualifikasi</span>}
									{props.status_pq_date_limit && <span className="text-danger" style={{paddingRight: "10px"}}><b>End Date Jadwal Pra Kualifikasi</b> tidak boleh melebihi <b>Start Date Jadwal Pengumuman</b></span>}
									{props.user.uuid === props.data.workflow_user && props.data.pq_status_text === "Approval" &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApprovalCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
									}
									{props.user.uuid === props.data.workflow_user && props.data.pq_status_text === "Approval" &&
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => RejectCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
									}
									{props.user.uuid === props.data.created_by && props.data.pq_status_text === "Open" &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => submitCheck(e)}
											disabled={props.loadingSubmit}
										>
										{
										props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Publish</button>
									}
									{props.status_register_vendor &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											Mohon lengkapi dokumen persyaratan
										</span>
									}
									{props.role_vendor && props.data.pq_status_text === "Active" && props.data.status_vendor === "Unregistered" &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => RegisterVendor(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Register</button>
									}
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