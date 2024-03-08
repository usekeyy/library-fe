import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header'
import Items from './Items'
import ContractReferences from './ContractReferences'
import Detail from './Detail'
import Catatan from './Catatan'
import DokumenPO from './DokumenPO'
import ListProgress from './ListProgress'
import JadwalReminder from './JadwalReminder'
import KonfirmasiExpediting from './KonfirmasiExpediting';

const Form = (props) => {

	const methods = useForm();
	// const [status, setStatus] = React.useState('')
	const status = '';
	const onSubmit = data => {
        data.status = status
		let payload = []
		payload.status = status
		payload.note = data.note
		console.log(payload)
		// if (status === "o") {
		// 	props.savePurchaseOrder(payload);
		// }
		// else if (status === "d") {
		// 	props.savePurchaseOrder(payload);
		// }
		// else if (status === "p" || status === "r" || status === "c")
		// {
        //     if (props.data.status === 'p') {
        //         props.approvalPurchaseOrder(payload)
        //     }
        //     else {
        //         props.approvalVendorPurchaseOrder(payload)
        //     }
		// }
		// else if (status === "s") {
		// 	props.modalConfirm(payload)
		// 	// props.releasePurchaseOrder(payload)
		// }
		// else if (status === "y") {
		// 	// props.modalConfirm(payload)
		// 	props.approvalVendorPurchaseOrder(payload)
		// }
		// else if (status === "b") {
		// 	// props.modalConfirm(payload)
		// 	props.toggleBatalPO(payload)
		// }
		// else if (status === "y-c") {
		// 	payload.status = 'y'
		// 	props.toggleApprovalCancel(payload)
		// }
		// else if (status === "n-c") {
		// 	payload.status = 'n'
		// 	props.toggleApprovalCancel(payload)
		// }
	};
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{props.data.sap_number === null && props.data.status === 'c' &&
					<h5>
						<span className="text-danger">*PO gagal ter-create di SAP. Cek error pada bagian Header </span>
					</h5>
				}
				<Header
					data={props.data}
					user={props.user}
					param_input={props.param_input}
					setOption={props.setOption}
					modalSap={props.modalSap}
				/>
				{props.data.tipe === 'oa' ?
					<ContractReferences 
						data={props.data}
						user={props.user}
						param_input={props.param_input}
						setOption={props.setOption}
						loadings={props.loadings}
						m_incoterm={props.m_incoterm}
						fetchIncoterms={props.fetchIncoterms}
					/> :
					<Detail
						data={props.data}
						user={props.user}
						param_input={props.param_input}
						setOption={props.setOption}
						loadings={props.loadings}
						m_incoterm={props.m_incoterm}
						fetchIncoterms={props.fetchIncoterms}
					/>
				}
				<Items 
					data={props.data}
					modalItem={props.modalItem}
					user={props.user}
				/>
				<DokumenPO 
					data={props.data}
					document={props.document} 
					loading={props.loading_document}
					user={props.user}
					is_vendor={props.role_vendor}
					user_vendor_id={props.data_user_vendor.id}
					vendor_id={props.data.purchase_order.vendor_id}
					toggleDelete={props.toggleDelete}
					toggleFormOpen={props.toggleDokumenPO}
					downloadPOBeritaAcara={props.downloadPOBeritaAcara}
				/>
				<Catatan
					data={props.data}
					param_input={props.param_input}
					setOption={props.setOption}
					onInputChangeCatatan={props.onInputChangeCatatan}
				/>
				{props.data.status === 'y' &&
					<ListProgress
						data={props.data}
						user={props.user}
						user_vendor={props.data_user_vendor}
						data_progress={props.data_progress}
						errors={props.errors}
						document={props.document} 
						loading={props.loading_document}
						loading_progress={props.loading_progress}
						is_vendor={props.role_vendor}
						toggleDelete={props.toggleDelete}
						toggleFormOpen={props.toggleDokumenPO}
						modalProgress={props.modalProgress}
					/>
				}
				{props.data.status === 'y' &&
					<JadwalReminder
						data={props.data}
						errors={props.errors}
						setOptionReminder={props.setOptionReminder}
						save={props.saveReminder}
						data_reminder={props.data_reminder}
						m_items={props.m_items}
						document={props.document} 
						loading={props.loading_document}
						loadings={props.loadings}
						loading_reminder={props.loading_reminder}
						user={props.user}
						is_vendor={props.role_vendor}
						user_vendor_id={props.data_user_vendor.id}
						vendor_id={props.data.purchase_order.vendor_id}
						toggleDelete={props.toggleDelete}
						modalTemplate={props.modalTemplate}
                        m_template_reminder={props.m_template_reminder}
                        fetchTemplateReminder={props.fetchTemplateReminder}
						loadingSubmit={props.loadingSubmit}
					/>
				}
				{props.data.status === 'y' &&
					<KonfirmasiExpediting
						data={props.data}
						user={props.user}
						user_vendor={props.data_user_vendor}
						data_konfirm={props.data_konfirmasi}
						loading_konfirmasi={props.loading_konfirmasi}
						upload={props.fileUpload}
						save={props.saveKonfirmasi}
						param_konfirmasi={props.param_konfirmasi}
						setOptionKonfirmasi={props.setOptionKonfirmasi}
						modalKonfirmasiExpediting={props.modalKonfirmasiExpediting}
					/>
				}
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
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