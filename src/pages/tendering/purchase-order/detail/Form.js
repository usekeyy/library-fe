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
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
        data.status = status
		let payload = []
		payload.status = status
		payload.note = data.note
		if (status === "o") {
			props.savePurchaseOrder(payload);
		}
		else if (status === "d") {
			props.savePurchaseOrder(payload);
		}
		else if (status === "p" || status === "r" || status === "c")
		{
            if (props.data.status === 'p') {
                props.approvalPurchaseOrder(payload)
            }
            else {
                props.approvalVendorPurchaseOrder(payload)
            }
		}
		else if (status === "s") {
			props.modalConfirm(payload)
			// props.releasePurchaseOrder(payload)
		}
		else if (status === "y") {
			// props.modalConfirm(payload)
			props.approvalVendorPurchaseOrder(payload)
		}
		else if (status === "b") {
			// props.modalConfirm(payload)
			props.toggleBatalPO(payload)
		}
		else if (status === "y-c") {
			payload.status = 'y'
			props.toggleApprovalCancel(payload)
		}
		else if (status === "n-c") {
			payload.status = 'n'
			props.toggleApprovalCancel(payload)
		}
	};

	const SubmitCheck = (e) => {
		setStatus('o')
	}

	const SubmitDraftCheck = (e) => {
		setStatus('d')
	}

	const ApproveVendorCheck = (e) => {
		setStatus('p')
	}

	const RejectCheck = (e) => {
		setStatus('r')
	}

	const ApproveCheck = (e) => {
		setStatus('c')
	}

	const ReleaseCheck = (e) => {
		setStatus('s')
	}

	const ConfirmCheck = (e) => {
		setStatus('y')
	}

	const BatalPO = (e) => {
		setStatus('b')
 	}

	const ApproveCancel = (e) => {
		setStatus('y-c')
	}

	const RejectCancel = (e) => {
		setStatus('n-c')
 	}
	
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
					modalCreateLoa={props.modalCreateLoa}
					downloadGeneratePDFLOA={props.downloadGeneratePDFLOA}
					loadings={props.loadings}
				/>
				{props.data.tipe === 'oa' ?
					<ContractReferences 
						data={props.data}
						user={props.user}
						param_input={props.param_input}
						setOption={props.setOption}
						loadings={props.loadings}
						m_document_type={props.m_document_type}
						m_incoterm={props.m_incoterm}
						fetchDocumentType={props.fetchDocumentType}
						fetchIncoterms={props.fetchIncoterms}
					/> :
					<Detail
						data={props.data}
						user={props.user}
						param_input={props.param_input}
						setOption={props.setOption}
						loadings={props.loadings}
						m_document_type={props.m_document_type}
						m_incoterm={props.m_incoterm}
						fetchDocumentType={props.fetchDocumentType}
						fetchIncoterms={props.fetchIncoterms}
						is_vendor={props.role_vendor}
						m_payment_term={props.m_payment_term}
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
									{props.status_header_text &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi <b>Header Text</b> terlebih dahulu
										</span>
									}
									{props.status_due_date &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi <b>Due Date</b> terlebih dahulu
										</span>
									}
									{props.status_data_document_type &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih <b>Tipe PO</b> terlebih dahulu
										</span>
									}
									{props.status_data_incoterm_detail &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi <b>Deskripsi Incoterm</b> terlebih dahulu
										</span>
									}
									{props.status_catatan &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi <b>catatan</b> terlebih dahulu
										</span>
									}
									{props.status_data_item &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon lengkapi <b>tax</b> dan <b>delivery date</b> pada detail item terpilih terlebih dahulu
										</span>
									}
									{props.status_dokumen &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon lengkapi <b>dokumen PO</b> Terlebih Dahulu
										</span>
									}
									{props.status_dokumen_confirm &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon lengkapi <b>dokumen PO Confirm</b> Terlebih Dahulu
										</span>
									}
                                    {props.user.uuid === props.data.created_by && props.data.status !== 'a' && props.data.status !== 'n' && props.data.status !== 'c' &&  //props.data.status !== 's' && props.data.status !== 'y' &&
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => BatalPO(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Batalkan PO</button>
                                    }
                                    {props.data.status === 'a' && props.user.uuid === props.data.po_cancel_approver_user &&
									<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApproveCancel(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
                                    }
                                    {props.data.status === 'a' && props.user.uuid === props.data.po_cancel_approver_user &&
										<button
											type="submit"
                                            className="btn btn-danger m-r-5"
											onClick={(e) => RejectCancel(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
                                    }


                                    {props.data.status === 'd' && props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => SubmitDraftCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Simpan Draft</button>
                                    }
                                    {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => SubmitCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
                                    }
                                    {props.data.status === 't'&& props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => props.modalConfirmOA('update')}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
                                    }
                                    {props.data.status === 't'&& props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-danger m-r-5"
											onClick={(e) => props.modalConfirmOA('delete')}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Batalkan</button>
                                    }

                                    {props.data.status === 'o' && props.role_vendor && props.data_user_vendor.id === props.data.purchase_order.vendor_id &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApproveVendorCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
                                    }
                                    {props.data.status === 'o' && props.role_vendor && props.data_user_vendor.id === props.data.purchase_order.vendor_id &&
										<button
											type="submit"
                                            className="btn btn-danger m-r-5"
											onClick={(e) => RejectCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
                                    }

                                    {props.data.status === 'p' && props.user.uuid === props.data.purchase_order.approver_user &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ApproveCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
                                    }
                                    {props.data.status === 'p' && props.user.uuid === props.data.purchase_order.approver_user &&
										<button
											type="submit"
                                            className="btn btn-danger m-r-5"
											onClick={(e) => RejectCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
                                    }

                                    {/* {props.data.status === 'c' && props.user.uuid === props.data.created_by && props.data.sap_number !== null &&
										<button
											type="submit"
                                            className="btn btn-success m-r-5"
											onClick={(e) => ReleaseCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Release PO</button>
                                    } */}
                                    {props.data.status === 's' && props.role_vendor && props.data_user_vendor.id === props.data.purchase_order.vendor_id &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => ConfirmCheck(e)}
											disabled={props.loadingSubmit}
										>
										{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Confirm PO</button>
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
