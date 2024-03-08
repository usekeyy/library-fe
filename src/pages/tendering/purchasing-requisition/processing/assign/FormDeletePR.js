import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const FormDeletePR = (props) => {
	const { t } = props;
	const { register, handleSubmit } = useForm({});
	const { data_param } = props.modalData;
	const onSubmit = async data => {
		data.status = 'o'
		data.status_review = 'a'
		// console.log(data)
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="row">
						<div className="col-sm-12">
							<div className="table-responsive">
								<table className="table table-bordered table-sm text-nowrap">
									<tbody>
										<tr>
											<th>No. PR</th>
											<th>Line Item</th>
											<th>No. Material</th>
											<th>Deskripsi</th>
										</tr>
										<tr>
											<td>{data_param.purchasing_requisition_number}</td>
											<td>{data_param.item_no}</td>
											<td>{data_param.material_id !== null && data_param.material_id !== '' ? parseInt(data_param.material_id) : ''}</td>
											<td>{data_param.short_text}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label>Catatan<span className="text-danger">*</span></label>
						<div>
							<textarea className="form-control" name="catatan_buyer" ref={register({ required: true })} required defaultValue={''}/>
							{props.errors && <span className="text-danger">{props.errors[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggle()}>{t("currency:button.close")}</button>
                    <button className="btn btn-success" type="submit" disabled={props.loadings.loading_proses_delete_pr} >{props.loadings.loading_proses_delete_pr ? <i className="fa fa-spinner fa-spin"></i> : ''}{t("currency:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(FormDeletePR);