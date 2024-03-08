import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import ConfigAanwijzingHeader from './ConfigAanwijzingHeader';
import ConfigAanwijzingCatatan from "./ConfigAanwijzingCatatan";
import ConfigAanwijzingDetailTender from "./ConfigAanwijzingDetailTender";
import ConfigAanwijzingItems from "./ConfigAanwijzingItems";
import ConfigAanwijzingJadwalTender from "./ConfigAanwijzingJadwalTender";
import ConfigAanwijzingPersyaratan from './ConfigAanwijzingPersyaratan';
import ConfigEdoc from './ConfigEdoc';
// import ConfigQuillEditor from './ConfigQuillEditor';
// import QuillEditor from '../detail/QuillEditor';

const Form = (props) => {

	const methods = useForm();
	// const [status, setStatus] = React.useState('')

	const onSubmit = data => {
		props.storeNoteAanwijzingCreate({
			proposal_tender_id : props.data.id,
			// note : data.note
		})

	};

	return (
		<div>
		
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingHeader
							data = {props.data}
						/>
					</div>					
				</div>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingDetailTender
							metode_pengadaan_name = {props.data.metode_pengadaan_name}
							pra_qualification = {props.data.pra_qualification}
							metode_aanwijzing_name = {props.data.metode_aanwijzing_name}
							metode_penyampaian_name = {props.data.metode_penyampaian_name}
							metode_evaluasi = {props.data.metode_evaluasi}
							metode_negosiasi = {props.data.metode_negosiasi}
							multiwinner = {props.data.multiwinner}
							bid_bond = {props.data.bid_bond}
							bid_bond_value = {props.data.bid_bond_value}
						/>
					</div>					
				</div>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigEdoc
							data = {props.data.e_doc_aanwijzing}
							modalEdoc = {(payload) => props.modalEdoc(payload)}
							addEdoc={()=>props.addEdoc()}
							removeEdoc = {(payload) => props.removeEdoc(payload)}
						/>
					</div>
				</div>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingItems
							data = {props.data.items}
							modals={(payload) => props.modals(payload)}
						/>
					</div>					
				</div>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingPersyaratan
							modalOpenPersyaratan={(payload) => props.modalOpenPersyaratan(payload)}
						/>
					</div>
				</div>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingJadwalTender
							data ={props.data.jadwal_tender}
							fetchJadwalTender={(payload) => props.fetchJadwalTender(payload)}
							openEditJadwal = {(payload) => props.openEditJadwal(payload)}
						/>
					</div>					
				</div>
			<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className="row">
					<div className=" col-sm-12">
						<ConfigAanwijzingCatatan
							data = {props.data.notes}
						/>
					</div>					
				</div>
				<div className="panel bg-white">
					<div className="row">
						<div className=" col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
                                    <button
											type="submit"
											className="btn btn-success m-r-5"
											disabled={props.loadings.loading_aanwijzing_submit_note}
										>
											{props.loadings.loading_aanwijzing_submit_note ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
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
		</div>
	);
}

export default withTranslation()(Form);