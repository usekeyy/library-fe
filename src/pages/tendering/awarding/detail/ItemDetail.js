import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { ModalBody, ModalFooter } from 'reactstrap';

const ItemDetail = (props) => {
	const { t } = props;

    return (
        <div>
			<ModalBody>
				<Panel className="margin-bot-false">
					<PanelHeader>Detail Item</PanelHeader>
					<PanelBody >
						<div className="row">
							<div className="col-sm-12" style={{marginBottom:"12px"}}>
								Status Quote: <p style={{color:"red", display:"inline"}}>{props.data.penawaran.quote}</p>
							</div>
							<div className="col-sm-12">
								<table className="table table-bordered table-sm text-wrap">
									<thead>
										<tr>
											<th style={{width: "20%"}}></th>
											<th style={{width: "40%"}}>Tender</th>
											<th style={{width: "40%"}}>Penawaran</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th>No PR</th>
											<td>{props.data.tender.pr_number}</td>
											<td>{props.data.penawaran.pr_number}</td>
										</tr>
										<tr>
											<th>PR Item</th>
											<td>{parseInt(props.data.tender.pr_item_number)}</td>
											<td>{parseInt(props.data.penawaran.pr_item_number)}</td>
										</tr>
										<tr>
											<th>Jenis Item</th>
											<td>{props.data.tender.pr_item_description}</td>
											<td>{props.data.penawaran.pr_item_description}</td>
										</tr>
										<tr>
											<th>No Material</th>
											<td>{props.data.tender.no_material !== null && props.data.tender.no_material !== '' ? parseInt(props.data.tender.no_material) : ''}</td>
											<td>{props.data.penawaran.no_material !== null && props.data.penawaran.no_material !== '' ? parseInt(props.data.penawaran.no_material) : ''}</td>
										</tr>
										<tr>
											<th>Spesifikasi</th>
											<td>{props.data.tender.spesifikasi_tender}</td>
											<td>{props.data.penawaran.spesifikasi_penawaran}</td>
										</tr>
										<tr>
											<th>Quantity</th>
											<td align="right">{props.data.tender.pr_qty}</td>
											<td align="right">{props.data.penawaran.qty_akhir}</td>
										</tr>
										<tr>
											<th>Currency</th>
											<td>{props.data.tender.pr_currency}</td>
											<td>{props.data.penawaran.currency}</td>
										</tr>
										<tr>
											<th>Delivery Time</th>
											<td align="right">{props.data.tender.delivery_time_tender}</td>
											<td align="right">{props.data.penawaran.delivery_time_akhir}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</PanelBody>
				</Panel>
			</ModalBody>
			<ModalFooter>
				<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} >{t("currency:button.close")}</button>
			</ModalFooter>
        </div>
    );
}

export default withTranslation()(ItemDetail);