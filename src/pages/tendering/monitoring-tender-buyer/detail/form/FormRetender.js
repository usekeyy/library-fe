import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
// import ItemsRetenderSelected from './ItemsRetenderSelected'
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';

const FormJadwalTender = (props) => {
	const {t} = props;
	const { register,handleSubmit, setValue } = useForm({});
	const [loadingUpload, setLoadingUpload] = React.useState(false)
	const {header} = props.parentState.monitoringTender;
	const {loadings} = props.parentState;
	const resp_errors = props.parentState.errors;
	const onSubmit = async data => {
		if(props.parentState.monitoringTender.order_placement==="itemize"){
			delete data.file_name;
			data.proposal_tender_id = header.proposal_tender_id;
			console.log(data)
			props.createRetenderItemize(data)
		}else{
			delete data.file_name;
			data.proposal_tender_id = header.proposal_tender_id;
			props.saveRetender(data)
		}
	};

	const changeFile = (e) => {
		// setLoading(!loading);
		setLoadingUpload(true)
		props.upload('RETEN1', e.target.files[0])
		.then((resp) => {
				setLoadingUpload(false)
				setValue("file", resp.data.data.name)
		})
		.catch((err) => {
				setLoadingUpload(false)
				setValue("file", '')
				toastr.error(err.data.message, err.data.status)
		})
	}

	const closeBtn =  (e) => {
        props.toggleClose();
        e.preventDefault()
    }

	let data = props.parentState.monitoringTender.item_terpilih;
	let rows="", total_keseluruhan = 0;
	if (data.length > 0){
		rows = data.map((dt, i) => {
			total_keseluruhan = total_keseluruhan + (dt.valuation_price* (dt.qty/dt.per))
			return (
				<tr key={i}>
                    <td>
                        {dt.is_retender_itemize===null && <input type="checkbox" name="items" ref={register({ required: false })} defaultValue={dt.pr_item_id} />}
                    </td>
					<td>{dt.number_pr}</td>
                    <td>{dt.item_no}</td>
                    <td>{dt.material_id && parseInt(dt.material_id)}</td>
                    <td>{dt.short_text}</td>
                    <td>{dt.material_group_id}</td>
                    <td>{dt.plant_id}</td>
                    <td style={{textAlign : 'right'}}>{ formatNumber(dt.qty,2) }</td>
                    <td>{dt.uom}</td>
                    <td style={{textAlign : 'right'}}>{formatNumber(dt.per,2)}</td>
                    <td align="right">{formatNumber(dt.valuation_price,2)}</td>
                    <td align="right">{formatNumber(dt.valuation_price* (dt.qty/dt.per),2)}</td>
                    <td>{dt.currency}</td>
				</tr>
			)
		})
	}else {
		rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<Panel>
						<PanelHeader>Item Terpilih</PanelHeader>
						
						<PanelBody >
							<div className="row">
								<div className="col-sm-12">
										<div className="table-responsive">
												<table className="table table-bordered table-striped table-sm text-nowrap">
														<thead className="text-bold">
															<tr>
																<th></th>
																<th>No PR</th>
																<th>Line Item</th>
																<th>No. Material</th>
																<th>Short Text</th>
																<th>Material Group</th>
																<th>Plan</th>
																<th>Qty</th>
																<th>UOM</th>
																<th>Per</th>
																<th>Harga Satuan</th>
																<th>Total</th>
																<th>Curr</th>
															</tr>
														</thead>
														<tbody>
															{rows}
														</tbody>
														<tfoot>
															<tr>
																<th colSpan={10} className="text-center">Total Keseluruhan</th>
																<th className="text-right">{formatNumber(total_keseluruhan,2)}</th>
																<th></th>
																<th></th>
															</tr>
														</tfoot>
												</table>
										</div>
								</div>
							</div>
						</PanelBody>
					</Panel>
					<div className="form-group">
						<label>Catatan<span className="text-danger">*</span></label>
						<div>
							<textarea className={(resp_errors.note) ? "form-control is-invalid" : "form-control"} name="note" ref={register({ required: false })} defaultValue={''} />
							{resp_errors.note && <span className="text-danger">{resp_errors.note[0]}</span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
							<label className="col-md-3">Lampiran<span className="text-danger">*</span></label>
							<div className="col-md-5">
									<input type="text" className={(resp_errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({required: false})} placeholder="" disabled={true} />
									{resp_errors.file && <span className="text-danger">{resp_errors.file[0]}</span>}
							</div>
							<div className="col-md-3">
									<label className="custom-file-upload">
											<input type="file" name="file_name" ref={register({required: false})} placeholder="" onChange={changeFile} className="form-control" disabled={loadingUpload}/>
											<i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> 
											Telusuri
									</label>
							</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-danger" disabled={loadings.button}>
						{loadings.button && <i className="fa fa-spinner fa-spin"></i> } <div>Confirm</div>
					</button>
					<button className="btn btn-white" disabled={loadings.button} onClick={(e) => closeBtn(e)}>{t("uom:button.cancel")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormJadwalTender);