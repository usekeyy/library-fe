import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Items = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const {items} = props.parentState.re_nego;
		// const {attachments} = props.parentState.re_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.re_nego;
		const {loadings} = props.parentState;
		let rows;
		let Total = 0;

		if (items.length > 0) {
			rows = items.map((dt, i) => {
				Total += dt.valuation_price * (dt.qty/dt.per)
						return (
								<tr key={i}>
										<td>{dt.pr_number}</td>
										<td>{dt.item_no}</td>
										<td>{dt.material_id}</td>
										<td>{dt.short_text}</td>
										<td>{dt.spesifikasi}</td>
										<td>{dt.currency}</td>
										<td>{dt.uom}</td>
										<td align="right">{formatNumber(dt.per,2)}</td>
										<td align="right">{formatNumber(dt.qty, 2)}</td>
										<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
								</tr>
						)
				})
				rows.push(
					<tr key={items.length + 1}>
							<td colSpan="9">Total Harga</td>
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
																	<th>Short Text</th>
																	<th>Spesifikasi</th>
																	<th>Curr</th>
																	<th>Uom</th>
																	<th>Per</th>
																	<th>QTY</th>
																	<th>OE / Harga Satuan</th>
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

export default withTranslation()(Items);