import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

import Header from './Header'
import Items from './Items'
import ContractReferences from './ContractReferences'
// import Detail from './Detail'
import Catatan from './Catatan'
import DokumenPO from './DokumenPO'

const Form = (props) => {

	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
        data.status = status
		let payload = []
		payload.status = status
		payload.note = data.note
		if (status === "o") {
			props.saveOutlineAgreement(payload);
		}
	};

	const submitCheck = (e) => {
		setStatus('o')
	}

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{/* {props.data.sap_number === null && props.data.status === 'c' &&
					<h5>
						<span className="text-danger">*PO gagal ter-create di SAP. Cek error pada bagian item terpilih </span>
					</h5>
				} */}
				<Header
					data={props.data}
					user={props.user}
					param_input={props.param_input}
					setOption={props.setOption}
				/>
				<ContractReferences 
					data={props.data}
					user={props.user}
					param_input={props.param_input}
					m_incoterm={props.m_incoterm}
					m_agreement_type={props.m_agreement_type}
					fetchIncoterms={props.fetchIncoterms}
					fetchDocumentType={props.fetchDocumentType}
					setOption={props.setOption}
					loadings={props.loadings}
				/>
				<Items 
					data={props.data}
					modalItem={props.modalItem}
					// modal_sap={props.modal_sap}
					modalReleaseAgreement={props.modalReleaseAgreement}
					user={props.user}
				/>
				<DokumenPO 
					data={props.data}
					document={props.document} 
					loading={props.loading_document}
					user={props.user}
					// is_vendor={props.role_vendor}
					// user_vendor_id={props.data_user_vendor.id}
					// vendor_id={props.data.purchase_order.vendor_id}
					toggleDelete={props.toggleDelete}
					toggleFormOpen={props.toggleDokumenPO}
					// downloadPOBeritaAcara={props.downloadPOBeritaAcara}
				/>
				<Catatan
					data={props.data}
					onInputChangeCatatan={props.onInputChangeCatatan}
					setOption={props.setOption}
				/>
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{props.status_agreement_type &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih Agreement Type terlebih dahulu
										</span>
									}
									{props.status_incoterm &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih Incoterm terlebih dahulu
										</span>
									}
                                    {props.data.status === 'd' && props.user.uuid === props.data.created_by &&
										<button
											type="submit"
											className="btn btn-success m-r-5"
											onClick={(e) => submitCheck(e)}
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