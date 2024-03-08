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
		const {quotation_items} = props.parentState.proses_nego_vendor;
		// const { header } = props.parentState.proses_nego_vendor;
		const { dataTemp } = props.parentState.proses_nego_vendor;
		const {errors} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;
		let rows;
		let rows_lines;
		let Total = 0;

		if (quotation_items.length > 0) {
			rows = quotation_items.map((dt, i) => {
				const total_harga_barang = parseInt(dt.valuation_price) * (parseInt(dt.qty)/parseInt(dt.per))
				Total += total_harga_barang;
				const isServices = dt.services_lines && dt.services_lines.length > 0;
					if(isServices){
						rows_lines = dt.services_lines.map((line, key) => {
							let services_lines;
							if(dt.purchasing_requisition_item_id === line.purchasing_requisition_item_id){
								const total_harga_jasa = parseFloat(line.valuation_price) * (parseFloat(line.qty)/parseFloat(line.per))
								Total += total_harga_jasa;
								services_lines = <tr key={key}>
																	<td>{line.pr_number}</td>
																	<td>{line.item_no}</td>
																	<td>{line.material_id}</td>
																	<td><ul><li>{line.short_text_service}</li></ul></td>
																	<td>{line.currency}</td>
																	<td>{line.uom}</td>
																	<td>{formatNumber(line.per, 2)}</td>
																	<td>{formatNumber(line.qty, 2)}</td>
																	<td align="right">{formatNumber(total_harga_jasa,2)}</td>
															</tr>
							}
									return services_lines
						})
					}
						return (
								<React.Fragment key={i}>
									<tr>
											<td>{dt.pr_number}</td>
											<td>{dt.item_no}</td>
											<td colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
											{isServices ? null : <td>{dt.short_text}</td>}
											<td>{isServices ? '' : dt.currency}</td>
											<td>{isServices ? '' : dt.uom}</td>
											<td>{isServices ? '' : formatNumber(dt.per, 2) }</td>
											<td>{isServices ? '' : formatNumber(dt.qty, 2) }</td>
											<td align="right">{isServices ? '' : formatNumber(total_harga_barang, 2) }</td>
									</tr>
									{isServices && rows_lines}
								</React.Fragment>
						)
						
				})
				rows.push(
					<tr key={quotation_items.length + 1}>
							<td colSpan="8">Total Harga</td>
							<td align="right">{formatNumber(Total, 2)}</td>
					</tr>
				)
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel className={dataTemp.tipe === "2" && dataTemp.status !== "closed" && "margin-bot-false"}>
					<PanelHeader>Item</PanelHeader>
					{(loadings.quotation_items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.quotation_items) &&
					<PanelBody >
						{errors.quotation_items && <p className="text-danger"> * {errors.quotation_items[0]} </p>}
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