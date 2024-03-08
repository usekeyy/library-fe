import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Itemize = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {itemize} = props.parentState.tahap_nego;
		// const {attachments} = props.parentState.tahap_nego;
		const {header} = props.parentState.tahap_nego;
		const {errors} = props.parentState.tahap_nego;
		const {loadings} = props.parentState;
		const {item_selected} = props.parentState.tahap_nego;
		let rows;
		let rows_lines;
		let rows_items;
		// let Total = 0;

		if (itemize.length > 0) {
			rows = itemize.map((vendor, indx) => {
				if(vendor.items.length > 0){
					rows_items = vendor.items.map((dt, i) => {
						const row_vendor = i === 0 ? <tr><td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} colSpan={10}><b>{`${dt.vendor_id} - ${dt.vendor_name}`}</b></td></tr> : null;
						const isServices = dt.service_lines && dt.service_lines.length > 0;
						let total_harga_barang = 0;
						if(!isServices){
							total_harga_barang = parseFloat(dt.valuation_price) * (parseFloat(dt.qty)/parseFloat(dt.per))
						} else {
							total_harga_barang = 0
						}

						const send_items = {
							proposal_tender_item_id: dt.proposal_tender_item_id,
							price: dt.valuation_price,
							delivery_time: 0,
						}
						const send_vendors = {
							uuid: dt.uuid,
							id: dt.vendor_id,
							proposal_tender_item_id: dt.proposal_tender_item_id,
						}

						// Total += total_harga_barang;
							if(isServices){
								rows_lines = dt.service_lines.map((line, key) => {
									let service_lines;
									if(dt.purchasing_requisition_item_id === line.purchasing_requisition_item_id){
										const total_harga_jasa = parseFloat(line.valuation_price) * (parseFloat(line.qty)/parseFloat(line.per))
										// Total += total_harga_jasa;
										service_lines = <tr key={key}>
																			<td></td>
																			<td>{line.number_pr}</td>
																			<td>{line.line_number}</td>
																			<td>{line?.material_id && parseFloat(line?.material_id)}</td>
																			<td><ul><li>{line.quote_short_text}</li></ul></td>
																			<td>{line.currency}</td>
																			<td>{line.uom}</td>
																			<td>{formatNumber(line.per, 2)}</td>
																			<td align="right">{formatNumber(line.qty, 2)}</td>
																			<td align="right">{formatNumber(total_harga_jasa, 2)}</td>
																	</tr>
									}
											return service_lines
								})
							}
								return (
										<React.Fragment key={i}>
											{row_vendor}
											<tr>
													<td>
														<input disabled={header.on_process} type="checkbox" checked={item_selected.includes(dt.uuid)} onChange={(event) => props.handleChecklistItem(event, send_items, dt.uuid, send_vendors)} />
													</td>
													<td>{dt.number_pr}</td>
													<td>{dt.item_no}</td>
													<td colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
													{isServices ? null : <td>{dt.short_text}</td>}
													<td>{isServices ? '' : dt.currency}</td>
													<td>{isServices ? '' : dt.uom}</td>
													<td>{isServices ? '' : formatNumber(dt.per, 2) }</td>
													<td align="right">{isServices ? '' : formatNumber(dt.qty, 2) }</td>
													<td align="right">{isServices ? '' : formatNumber(total_harga_barang, 2) }</td>
											</tr>
											{isServices && rows_lines}
										</React.Fragment>
								)
							})
						}
						return rows_items
				})
		} else {
			if(loadings.itemize){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Itemize</PanelHeader>
					{(loadings.itemize) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.itemize) &&
					<PanelBody >
						{errors.itemize && <p className="text-danger"> * {errors.itemize[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th></th>
																	<th>No PR</th>
																	<th>Line Item</th>
																	<th>No Material</th>
																	<th>Description</th>
																	<th>Curr</th>
																	<th>Uom</th>
																	<th>Per</th>
																	<th>QTY</th>
																	<th>Total</th>
															</tr>
													</thead>
													<tbody>{rows}</tbody>
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default withTranslation()(Itemize);