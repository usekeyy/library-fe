import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Detail = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {items} = props.parentState.proposal_tender;
		// const {attachments} = props.parentState.proposal_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		let rows;

		const details = (e, data) => {
			e.preventDefault()
			props.modals(data)
		}

		if (items.length > 0) {
				let Total = 0;
				rows = items.map((dt, i) => {
						Total += dt.valuation_price * (dt.qty/dt.per)
						return (
								<tr key={i}>
										<td>{dt.purchasing_requisition_number}</td>
										<td>{dt.item_no}</td>
										<td>{dt.material_id && parseInt(dt.material_id)}</td>
										<td>{dt.short_text}</td>
										<td>{dt.plant_id}</td>
										<td>{formatNumber(dt.qty, 2)}</td>
										<td>{dt.uom}</td>
										<td align="right">{formatNumber(dt.per, 2)}</td>
										<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
										<td align="right">{formatNumber((parseFloat(dt.qty)/parseFloat(dt.per)) * parseFloat(dt.valuation_price), 2)}</td>
										<td>
											{<button className="btn btn-xs btn-lime" onClick={(e) => details(e,i)} value={dt.no} disabled={loadings.button} ><i className="danger fa fa-eye"></i></button>}
										</td>
								</tr>
						)
				})

				rows.push(
						<tr key={items.length + 1}>
								<td colSpan="9">Total Harga</td>
								<td align="right">{formatNumber(Total, 2)}</td>
								<td colSpan="2"></td>
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
																	<th>Description</th>
																	<th>Plant</th>
																	<th>QTY</th>
																	<th>Uom</th>
																	<th>Per</th>
																	<th>Harga Satuan</th>
																	<th>Total Harga</th>
																	<th>Action</th>
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

export default withTranslation()(Detail);