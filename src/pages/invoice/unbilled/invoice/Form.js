import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

// import Header from './Header'
import Items from './Items'
import AdditionalCost from './AdditionalCost'
import Penalty from './Penalty';
import LampiranPendukung from './LampiranPendukung';
import CreateInvoice from './CreateInvoice';
import Catatan from './Catatan';
import PenaltyAddCost from './PenaltyAddCost';
import { replaceAll } from '../../../../helpers/formatNumber';
// import ContractReferences from './ContractReferences'
// import Detail from './Detail'
// import Catatan from './Catatan'
// import DokumenPO from './DokumenPO'
// import ListProgress from './ListProgress'
// import JadwalReminder from './JadwalReminder'
// import KonfirmasiExpediting from './KonfirmasiExpediting';

const Form = (props) => {

	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
		// return
		data.amount = formatValue(data.amount)
		data.total_add_cost = formatValue(data.total_add_cost)
		data.dpp_amount = formatValue(data.dpp_amount)
		data.ppn_amount = formatValue(data.ppn_amount)
		data.potongan = formatValue(data.potongan)
		data.total = formatValue(data.total)

		data.save_draft = status
		let payload = data

		// if (status === "y" || status === 'n') {
		// 	props.toggleConfirm('', payload, 'save-invoice')
		// }

		if (status === "n") {
			props.toggleConfirm('', payload, 'save-invoice')
		}else if (status === "y"){
			props.toggleConfirm('', payload, 'draft-invoice')
		}
	};

	const formatValue = (payload) => {
        let new_value = replaceAll(payload, '.', '')
        return replaceAll(new_value, ',', '.')
    }

	const SubmitCheck = (e) => {
		setStatus('n')
	}
	
	const SubmitDraft = (e) => {
		setStatus('y')
	}
	
    const toggleOpenPreview = (e, file, url) => {
        // e.preventDefault()
        props.toggleOpenPreview(e, file, url)

    }

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<CreateInvoice 
					toggleOpenPreview={toggleOpenPreview}
					errors={props.errors}
					loadings={props.loadings_invoice}
					loadingSubmit={props.loadingSubmit}
					data={props.param_invoice}
					param_option={props.param_option}
					setWithPPN={props.setWithPPN}
					fetchBank={props.fetchBank}
					user={props.user}
					scanFakturPajak={props.scanFakturPajak}
					resetScanFakturPajak={props.resetScanFakturPajak}
					upload={props.fileUpload}
					setDocumentPO={props.setDocumentPO}
					setValue={props.setValue}
				/>
				<LampiranPendukung
					toggleOpenPreview={toggleOpenPreview}
					errors={props.errors}
					data={props.data_lampiran_pendukung}
					param={props.param_lampiran_pendukung}
					statusLampiranVendor={props.statusLampiranVendor}
					loadings={props.loadings_invoice}
					save={props.addLampiranPendukung}
					delete={props.deleteLampiranPendukung}
					setOption={props.setOptionLampiran}
					upload={props.fileUpload}
					user={props.user}
					toggleDelete={props.toggleDelete}
				/>
				<Items 
					loadings={props.loadings_invoice}
					errors={props.errors}
					data={props.param_invoice}
					param_option={props.param_option}
					user={props.user}
					setOption={props.setOption}
				/>
				<AdditionalCost 
					loadings={props.loadings_invoice}
					errors={props.errors}
					data={props.param_invoice}
					param_option={props.param_option}
					user={props.user}
					setOption={props.setOption}
				/>
				<Penalty 
					toggleOpenPreview={toggleOpenPreview}
					data={props.param_invoice}
					user={props.user}
				/>
				<PenaltyAddCost 
					toggleOpenPreview={toggleOpenPreview}
					data={props.param_invoice}
					user={props.user}
				/>
				<Catatan 
					data={props.param_invoice}
					user={props.user}
				/>
				<div className="panel bg-white">
					<div className="row">
						<div className="col-sm-12">
							<div className="pull-right m-t-5 m-b-5">
								<div>
									{props.status_ppn && props.param_invoice.with_ppn === 'y' &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih ppn 'Ya' pada salah satu item GR/SA
										</span>
									}
									{props.status_ppn && props.param_invoice.with_ppn === 'n' &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon pilih ppn 'Tidak' pada semua item GR/SA
										</span>
									}
									{props.format_djp &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Format <b>No. Faktur Pajak</b> tidak sesuai
										</span>
									}
									{props.status_input_faktur &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon lengkapi inputan <b>No. Faktur Pajak</b>, <b>Tanggal Faktur Pajak</b>, dan upload <b>lampiran Faktur Pajak</b>
										</span>
									}
									{/* {props.status_due_date &&
										<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
											*Mohon isi <b>Due Date</b> terlebih dahulu
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
									} */}
									<button
										type="submit"
										className="btn btn-success m-r-5"
										onClick={(e) => SubmitCheck(e)}
										disabled={props.loadingSubmit}
									>
									{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
									<button
										type="submit"
										className="btn btn-info m-r-5"
										onClick={(e) => SubmitDraft(e)}
										disabled={props.loadingSubmit}
									>
									{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Save Draft</button>
									<button
										type="button"
										onClick={(e) => props.resetParam()}
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