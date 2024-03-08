import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

// import Header from './Header'
// import LampiranPendukung from './LampiranPendukung';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import CreateInvoice from './CreateInvoice';
import Items from './Items'
import AdditionalCost from './AdditionalCost'
import Penalty from './Penalty';
import DPP from './DPP';
import LampiranInternal from './LampiranInternal';
import LampiranVendor from './LampiranVendor';
import InputSAP from './InputSAP';
import Catatan from './Catatan';
import DataSAP from './DataSAP';
import ReverseInput from './ReverseInput';
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
    // const { t } = props;

	const methods = useForm();
	const [status, setStatus] = React.useState('')

	const onSubmit = data => {
		data.amount = formatValue(data.amount)
		data.total_add_cost = formatValue(data.total_add_cost)
		data.dpp_amount = formatValue(data.dpp_amount)
		data.ppn_amount = formatValue(data.ppn_amount)
		data.potongan = formatValue(data.potongan)
		data.total = formatValue(data.total)

        data.status = status
		if (status === "submitted" || status === "draft") {
			props.toggleConfirm(data)
		}
		else if (status === 'mvp') {
			props.uploadLampiranInvoice(data)
		}
		else {
			props.modalConfirm(data)
		}
	};

	const formatValue = (payload) => {
        let new_value = replaceAll(payload, '.', '')
        return replaceAll(new_value, ',', '.')
    }

	const SubmitCheck = (e) => {
		setStatus('submitted')
	}

	const SubmitDraft = (e) => {
		setStatus('draft')
	}
	
	const approve1Check = (e) => {
		setStatus('approved_1')
	}
	
	const reject1Check = (e) => {
		setStatus('rejected_1')
	}
	
	const approve2Check = (e) => {
		setStatus('approved_2')
	}
	
	const reject2Check = (e) => {
		setStatus('rejected_2')
	}

	const postingCheck = (e) => {
		setStatus('posted')
	}

	const reverseCheck = (e) => {
		setStatus('reverse')
	}

	const mvpCheck = (e) => {
		setStatus('mvp')
	}

	const modalSimulate = (e) => {
		e.preventDefault()
		props.submitInvoiceSAP([], 'simulate')
	}

	const setCheckReverse = (e) => {
		// e.preventDefault()
		props.setCheckReverse()
	}
	
    const toggleOpenPreview = (e, file, url) => {
        // e.preventDefault()
        props.toggleOpenPreview(e, file, url)

    }

	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				{props.data.note_list.length > 0 && (props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.user.has_roles.includes("VNDR01") &&
					<div>
						<Panel className="margin-bot-false">
							<PanelHeader>Catatan Reject</PanelHeader>
							<PanelBody>
								<Row>
									<Col sm="12">
										<div className="form-group">
											<label className="col-form-label">Catatan Reject</label>
											<div className="col-lg-12">
												<textarea className="form-control" defaultValue={props.data.note} readOnly={true}/>
											</div>
										</div>
									</Col>
								</Row>
							</PanelBody>
						</Panel>
					</div>
				}
				{props.data.items.some(d=>d.goods_receipt_item_status === 'n') &&
					<h5>
						<span className="text-danger">GR telah dibatalkan di level invoice</span>
					</h5>
				}
				
				<CreateInvoice 
					toggleOpenPreview={toggleOpenPreview}
					resetScanFakturPajak={props.resetScanFakturPajak}
					loadings={props.loadings}
					loadingSubmit={props.loadingSubmit}
					errors={props.errors}
					data={props.data}
					user={props.user}
					param_option={props.param_option}
					setWithPPN={props.setWithPPN}
					fetchBank={props.fetchBank}
					scanFakturPajak={props.scanFakturPajak}
					upload={props.fileUpload}
					isVerifikasi={props.isVerifikasi}
					setOptionParamSAP={props.setOptionParamSAP}
					setDocumentPO={props.setDocumentPO}
				/>
				<LampiranVendor
					toggleOpenPreview={toggleOpenPreview}
					errors={props.errors}
					loadings={props.loadings}
					user={props.user}
					data={props.data}
					data_lampiran_vendor={props.data_lampiran_vendor}
					param={props.param_lampiran_vendor}
					statusLampiranVendor={props.statusLampiranVendor}
					save={props.addLampiranVendor}
					delete={props.deleteLampiranVendor}
					setOption={props.setOptionLampiranVendor}
					upload={props.fileUpload}
					toggleDelete={props.toggleDelete}
				/>
				<Items 
					loadings={props.loadings}
					data={props.data}
					param_option={props.param_option}
					setOptionItem={props.setOptionItem}
					fetchTax={props.fetchTax}
					user={props.user}
				/>
				<AdditionalCost
					loadings={props.loadings}
					data={props.data}
					param_option={props.param_option}
					setOptionAddCost={props.setOptionAddCost}
					fetchTax={props.fetchTax}
					user={props.user}
				/>
				{((props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) &&
				(props.data.status === 'received' || props.data.status === 'approved_2' || props.data.status === 'posted' || props.data.status === 'sent_bendahara' || props.data.status === 'received_bendahara' || props.data.status === 'rejected_hc_bendahara' || props.data.status === 'paid')) ?
					(
						((props.data.status === 'received' || props.data.status === 'approved_2') && props.user.has_roles.includes("INVER2")) ?
							<InputSAP
								errors={props.errors}
								loadings={props.loadings}
								user={props.user}
								data={props.data}
								status_edit_wh_tax={props.status_edit_wh_tax}
								param_option={props.param_option}
								fetchPaymentMethod={props.fetchPaymentMethod}
								fetchPaymentBlock={props.fetchPaymentBlock}
								fetchSelectHouseBank={props.fetchSelectHouseBank}
								fetchSelectAccountId={props.fetchSelectAccountId}
								fetchReferenceKey={props.fetchReferenceKey}
								fetchTermsOfPayment={props.fetchTermsOfPayment}
								fetchTaxInvoice={props.fetchTaxInvoice}
								setOptionParamSAP={props.setOptionParamSAP}
								fetchGlAccountHeader={props.fetchGlAccountHeader}
							/> :
							<DataSAP
								user={props.user}
								data={props.data}
							/> 
					) : ''
				}
				<Penalty 
					toggleOpenPreview={toggleOpenPreview}
					data={props.data}
					param_option={props.param_option}
					setOptionPenalty={props.setOptionPenalty}
					user={props.user}
					modalPenalty={props.modalPenalty}
					loadings={props.loadings}
					toggleDelete={props.toggleDelete}
				/>
				<PenaltyAddCost
					toggleOpenPreview={toggleOpenPreview}
					data={props.data}
					param_option={props.param_option}
					setOptionPenaltyAddCost={props.setOptionPenaltyAddCost}
					user={props.user}
					modalPenalty={props.modalPenalty}
					loadings={props.loadings}
					toggleDelete={props.toggleDelete}
				/>
				<DPP 
					data={props.data}
					setOption={props.setOption}
					status_edit_ppn={props.status_edit_ppn}
					user={props.user}
					loadings={props.loadings}
					setValue={props.setValue}
				/>
				{(props.user.has_roles.includes("INVER1") || props.user.has_roles.includes("INVER2")) &&
					<LampiranInternal
						toggleOpenPreview={toggleOpenPreview}
						errors={props.errors}
						loadings={props.loadings}
						user={props.user}
						data={props.data}
						data_lampiran_internal={props.data_lampiran_internal}
						param={props.param_lampiran_internal}
						statusLampiranInternal={props.statusLampiranInternal}
						save={props.addLampiranInternal}
						delete={props.deleteLampiranInternal}
						setOption={props.setOptionLampiranInternal}
						upload={props.fileUpload}
						toggleDelete={props.toggleDelete}
					/>
				}
				<Catatan
					data={props.data}
					user={props.user}
				/>
				{/* <AdditionalCost 
					data={props.data}
					user={props.user}
				/> */}
				<div className="panel bg-white">
					<div className="row m-0">
						{(props.data.status === 'posted' || props.data.status === 'rejected_hc_bendahara') && props.user.has_roles.includes("INVER2") &&
							<div className="col-sm-12 p-r-15">
								<div className="col-sm-2">
									<input type="checkbox" name="check_reverse" checked={props.check_reverse} onChange={(e) => setCheckReverse(e)} />
									<span> </span>
									<label>Reverse Posted Invoice</label>
								</div>
							</div>
						}
						{(props.data.status === 'posted' || props.data.status === 'rejected_hc_bendahara') && props.user.has_roles.includes("INVER2") && props.check_reverse &&
						<ReverseInput
							param_option={props.param_option}
							param_reverse={props.param_reverse}
							setReverse={props.setReverse}
						/>
						}
						<div className="col-sm-12">
							<Row>
								<div className="col-sm-1">
									{!props.data.items.some(d=>d.goods_receipt_item_status === 'n') &&
										<div className="pull-left m-t-5 m-b-5">
											{props.data.status === 'submitted' && props.user.has_roles.includes("INVER1") &&
												<button
													type="submit"
													className="btn btn-danger m-l-5"
													onClick={(e) => reject1Check(e)}
													disabled={props.loadingSubmit}
												>
												{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
											}
											{props.data.status === 'received' && props.user.has_roles.includes("INVER2") &&
												<button
													type="submit"
													className="btn btn-danger m-l-5"
													onClick={(e) => reject2Check(e)}
													disabled={props.loadingSubmit}
												>
												{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reject</button>
											}
										</div>
									}
								</div>
								<div className="col-sm-11">
									<div className="pull-right m-t-5 m-b-5">
										{!props.data.items.some(d=>d.goods_receipt_item_status === 'n') ?
											<div>
												{(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.status_ppn && props.data.with_ppn === 'y' &&
													<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
														*Mohon pilih ppn 'Ya' pada salah satu item GR/SA
													</span>
												}
												{(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.status_ppn && props.data.with_ppn === 'n' &&
													<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
														*Mohon pilih ppn 'Tidak' pada semua item GR/SA
													</span>
												}
												{props.status_mvp &&
													<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
														*Mohon upload <b>Lampiran MVP</b> sebelum melakukan Posting
													</span>
												}
												{/* {props.status_reverse &&
													<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
														*Mohon centang <b>Reverse Posted Invoice</b>, pilih alasan dan posting datenya
													</span>
												} */}
												{(props.data.status === 'posted' || props.data.status === 'rejected_hc_bendahara') && props.user.has_roles.includes("INVER2") &&
													<button
														type="submit"
														onClick={(e) => reverseCheck(e)}
														disabled={props.loadingSubmit}
														className="btn btn-danger m-r-5"
														>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Reverse</button>
												}
												{props.data.status === 'approved_2' && props.user.has_roles.includes("INVER2") &&
													<button
														type="button"
														onClick={(e) => modalSimulate(e)}
														disabled={props.loadingSubmit}
														className="btn btn-info m-r-5"
														>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Simulate</button>
												}
												{props.data.status === 'approved_2' && props.user.has_roles.includes("INVER2") &&
													<button
														type="submit"
														onClick={(e) => postingCheck(e)}
														disabled={props.loadingSubmit}
														className="btn btn-success m-r-5"
														>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Posting</button>
												}
												{(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.data.created_by === props.user.uuid && props.user.has_roles.includes("VNDR01") &&
													<button
														type="submit"
														className="btn btn-success m-r-5"
														onClick={(e) => SubmitCheck(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>
												}
												{(props.data.status === 'draft') && props.data.created_by === props.user.uuid && props.user.has_roles.includes("VNDR01") &&
													<button
														type="submit"
														className="btn btn-info m-r-5"
														onClick={(e) => SubmitDraft(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Save Draft</button>
												}
												{/* {props.status_reject &&
													<span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
														*Mohon isi <b>catatan</b> terlebih dahulu
													</span>
												} */}
												{/* {props.data.status === 'draft' && props.data.created_by === props.user.uuid && props.user.has_roles.includes("VNDR01") &&
													<button
														type="submit"
														className="btn btn-info m-r-5"
														onClick={(e) => SubmitDraft(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Save Draft</button>
												} */}
												{props.data.status === 'submitted' && props.user.has_roles.includes("INVER1") &&
													<button
														type="submit"
														className="btn btn-success m-r-5"
														onClick={(e) => approve1Check(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
												}
												{props.data.status === 'received' && props.user.has_roles.includes("INVER2") &&
													<button
														type="submit"
														className="btn btn-success m-r-5"
														onClick={(e) => approve2Check(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Approve</button>
												}
												{props.data.status === 'posted' && props.user.has_roles.includes("INVER2") &&
													<button
														type="submit"
														className="btn btn-success m-r-5"
														onClick={(e) => mvpCheck(e)}
														disabled={props.loadingSubmit}
													>
													{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Save</button>
												}
												<button
													type="button"
													onClick={(e) => window.history.back()}
													disabled={props.loadingSubmit}
													className="btn btn-white m-r-5">
													Kembali
													</button>
											</div> : 
											<div>
												<button
													type="button"
													onClick={(e) => window.history.back()}
													disabled={props.loadingSubmit}
													className="btn btn-white m-r-5">
													Kembali
													</button>										
											</div>
										}
									</div>
								</div>
							</Row>
						</div>
					</div>
				</div>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);