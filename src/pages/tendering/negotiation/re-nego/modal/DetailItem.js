import React from 'react';
// import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import { toastr } from 'react-redux-toastr';
import { ModalBody, ModalFooter } from 'reactstrap';


const DetailItem = (props) => {
		const { t } = props;
		// const { register,control, handleSubmit, setValue, getValues } = useForm({});
		// const {header} = props.parentState.re_nego;
		// const {errors} = props.parentState.re_nego;
		const {loadings} = props.parentState;
		const {quotation_detail} = props.parentState;

    return (
        <div>
					<ModalBody>
						<Panel className="margin-bot-false">
								<PanelHeader>Detail Item</PanelHeader>
								<PanelBody >
										<p>Status Quote : <i className="text-danger">{quotation_detail.quote}</i></p>
										<div className="row">
											<div className="col-sm-12">
												<table className="table table-bordered table-sm">
													<thead>
														<tr>
															<th></th>
															<th>Tender</th>
															<th>Penawaran</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<th>No PR</th>
															<td>{quotation_detail.pr_number}</td>
															<td>{quotation_detail.pr_number}</td>
														</tr>
														<tr>
															<th>PR Item</th>
															<td>{quotation_detail.item_no}</td>
															<td>{quotation_detail.item_no}</td>
														</tr>
														<tr>
															<th>Jenis Item</th>
															<td>{quotation_detail.jenis}</td>
															<td>{quotation_detail.jenis}</td>
														</tr>
														<tr>
															<th>Material No</th>
															<td>{quotation_detail.material_id}</td>
															<td>{quotation_detail.material_id}</td>
														</tr>
														<tr>
															<th>Spesifikasi</th>
															<td>{quotation_detail.spesifikasi}</td>
															<td>{quotation_detail.spesifikasi}</td>
														</tr>
														<tr>
															<th>Quantity</th>
															<td>{quotation_detail.qty}</td>
															<td>{quotation_detail.qty}</td>
														</tr>
														<tr>
															<th>Currency</th>
															<td>{quotation_detail.currency}</td>
															<td>{quotation_detail.currency}</td>
														</tr>
														<tr>
															<th>Delivery Time</th>
															<td>{quotation_detail.delivery_time}</td>
															<td>{quotation_detail.delivery_time}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
								</PanelBody>
						</Panel>
					</ModalBody>
					<ModalFooter>
						<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} disabled={loadings.button}>{t("currency:button.close")}</button>
					</ModalFooter>
        </div>
    );
}

export default withTranslation()(DetailItem);