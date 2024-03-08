import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const BidItems = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const {items} = props.parentState.tahap_nego;
		// const {attachments} = props.parentState.tahap_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.tahap_nego;
		const {loadings} = props.parentState;
		let rows;
		let rows_lines;
		let Total = 0;

		if (items.length > 0) {
			rows = items.map((dt, i) => {
				const isServices = dt.service_lines && dt.service_lines.length > 0;
				let total_harga_barang = 0;
				if(!isServices){
					total_harga_barang = parseFloat(dt.valuation_price) * (parseFloat(dt.qty)/parseFloat(dt.per))
				} else {
					total_harga_barang = 0
				}
				Total += total_harga_barang;
					if(isServices){
						rows_lines = dt.service_lines.map((line, key) => {
							let service_lines;
							if(dt.purchasing_requisition_item_id === line.purchasing_requisition_item_id){
								const total_harga_jasa = parseFloat(line.net_value) * (parseFloat(line.qty)/parseFloat(line.per))
								Total += total_harga_jasa;
								service_lines = <tr key={key}>
																	<td>{line.number_pr}</td>
																	<td>{parseFloat(line.line_number)}</td>
																	<td>{line?.material_id && parseFloat(line?.material_id)}</td>
																	<td><ul><li>{line.short_text}</li></ul></td>
																	<td>{line.currency}</td>
																	<td>{line.uom}</td>
																	<td>{formatNumber(line.per, 2)}</td>
																	<td align="right">{formatNumber(line.qty, 2)}</td>
																	<td align="right">{formatNumber(line.net_value, 2)}</td>
																	<td align="right">{formatNumber(total_harga_jasa, 2)}</td>
															</tr>
							}
									return service_lines
						})
					}
						return (
								<React.Fragment key={i}>
									<tr>
											<td>{dt.number_pr}</td>
											<td>{dt.item_no}</td>
											<td colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
											{isServices ? null : <td>{dt.short_text}</td>}
											<td>{isServices ? '' : dt.currency}</td>
											<td>{isServices ? '' : dt.uom}</td>
											<td>{isServices ? '' : formatNumber(dt.per, 2) }</td>
											<td align="right">{isServices ? '' : formatNumber(dt.qty, 2) }</td>
											<td align="right">{isServices ? '' : formatNumber(dt.valuation_price, 2) }</td>
											<td align="right">{isServices ? '' : formatNumber(total_harga_barang, 2) }</td>
									</tr>
									{isServices && rows_lines}
								</React.Fragment>
						)
						
				})
				rows.push(
					<tr key={items.length + 1}>
							<td colSpan="9">Total Harga</td>
							<td align="right">{formatNumber(Total, 2)}</td>
					</tr>
				)
		} else {
			if(loadings.items){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Item</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>No PR</th>
																	<th>Line Item</th>
																	<th>No Material</th>
																	<th>Description</th>
																	<th>Curr</th>
																	<th>Uom</th>
																	<th>Per</th>
																	<th>QTY</th>
																	<th>OE / Harga Satuan</th>
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

export default withTranslation()(BidItems);