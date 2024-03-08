import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import EDocument from '../../../master/e-document/EDocument';

import Header from './Header'
import JadwalAanwijzing from './JadwalAanwijzing';
import MetodeAanwijzing from './MetodeAanwijzing'
import EDocumentList from './EDocument'
import Vendor from './Vendor'
// import Catatan from './Catatan'
// import DokumenPO from './DokumenPO'

const Form = (props) => {

	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
        data.status = status
		let payload = []
		payload.status = status
		if (status === 'y') {
			props.saveAanwijzingSAP(payload)
		}
	};

	const submitCheck = (e) => {
		setStatus('y')
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
                    created_by={props.user.name}
                    param={props.param}
				/>
				<MetodeAanwijzing
					metode_aanwijzing={props.metode_aanwijzing}
					errors={props.errors}
					setMetodeAanwijzing={props.setMetodeAanwijzing}
				/>
				<EDocumentList 
					data={props.data_edocs}
					modalsEdoc={props.modalsEdoc}
					editEdoc={props.editEdoc}
					deleteEdoc={props.deleteEdoc}
					status_document={props.status_document}
					toggleDelete={props.toggleDelete}
					errors={props.errors}
				/>
				<JadwalAanwijzing 
					data={props.data_jadwal}
					errors={props.errors}
					update={props.update_date}
				/>
				<Vendor 
                    fetchBidangUsaha={props.fetchBidangUsaha}
                    fetchSubBidangUsaha={props.fetchSubBidangUsaha}
                    m_bidang_usaha={props.m_bidang_usaha}
                    m_sub_bidang_usaha={props.m_sub_bidang_usaha}
					loadings={props.loadings}
                    isDisabled={props.isDisabled}
					data={props.sos_vendor}
					data_vendor={props.data_vendor}
                    data_bidang_usaha={props.data_sos.bidang_usaha_id}
                    data_sub_bidang_usaha={props.data_sos.sub_bidang_usaha_id}
                    setBidangUsaha={props.setBidangUsaha}
                    setSubBidangUsaha={props.setSubBidangUsaha}
                    addSos={props.addSos}
					resetSos={props.resetSos}
					vendor_checklist={props.vendor_checklist}
					handleChecklist={props.handleChecklist}
					handleCheckAll={props.handleCheckAll}
					status_check_all={props.status_check_all}
					status_sos_input={props.status_sos_input}
				/>
				{/* <Detail
                    data={props.data.purchase_order}
				/>
				<Items 
					data={props.data.items} 
					modals={props.modal_item}
					user_uuid={props.user.uuid}
					created_by={props.data.created_by} 
                    status={props.data.status}
				/>
				<DokumenPO 
					data={props.document} 
					data_confirm={props.document_confirm} 
                    data_approval={props.data.list_approval} 
					user_uuid={props.user.uuid}
					is_vendor={props.role_vendor}
					vendor_id={props.data.purchase_order.vendor_id}
					user_vendor_id={props.data_user_vendor.id}
					created_by={props.data.created_by} 
                    status={props.data.status}
					loading={props.loading_dokumen_po}
					toggleDelete={props.toggleDelete}
					toggleFormOpen={props.toggleDokumenPO}
				/>
				<Catatan
                    data={props.data.notes}
					user_uuid={props.user.uuid}
					created_by={props.data.created_by} 
                    status={props.data.status}
				/> */}
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{props.status_metode &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih Metode Aanwijzing terlebih dahulu
										</span>
									}
									{props.status_jadwal &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon tentukan Jadwal Aanwijzing terlebih dahulu
										</span>
									}
									{props.status_vendor &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih Vendor terlebih dahulu
										</span>
									}
									<button
										type="submit"
										className="btn btn-success m-r-5"
										onClick={(e) => submitCheck(e)}
										disabled={props.loadingSubmit}
									>
									{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>

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