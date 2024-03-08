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
		const {items} = props.parentState.vendor_registration_tender;
		// const {attachments} = props.parentState.vendor_registration_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		let rows;

		if (items.length > 0) {
				rows = items.map((dt, i) => {
						if (dt.tipe === "jasa" || dt.tipe === "Jasa"){
							let temp_tr = (<tr key={i}>
												<td>{dt.number_pr}</td>
												<td>{dt.item_no}</td>
												<td colSpan={2} className="text-left">{dt.short_text}</td>
												<td>{dt.long_text}</td>
												<td className="text-right">{formatNumber(dt.qty, 2)}</td>
												<td>{dt.uom}</td>
												<td>{dt.currency}</td>
											</tr>)
							let temp_tr_service = dt.service_lines.sort((a,b) => a.line_number - b.line_number)
							temp_tr_service = dt.service_lines.map((data_service)=>{
								return (
									<tr key={data_service.id}>
											<td>{data_service.pr_number}</td>
											<td><div className="pull-right">{data_service.line_number.replace(/^0+/, '')}</div></td>
											<td></td>
											<td colSpan={2} className="text-left">{data_service.short_text}</td>
											<td className="text-right">{formatNumber(data_service.qty, 2)}</td>
											<td>{data_service.uom}</td>
											<td>{data_service.currency}</td>
										</tr>
								)
							})
							temp_tr_service.unshift(temp_tr)
							return (temp_tr,temp_tr_service)
							
						}else{
							return (
								<tr key={i}>
										<td>{dt.number_pr}</td>
										<td>{dt.item_no}</td>
										<td>{dt.material_group_id}</td>
										<td>{dt.short_text}</td>
										<td>{dt.long_text}</td>
										<td className="text-right">{formatNumber(dt.qty, 2)}</td>
										<td>{dt.uom}</td>
										<td>{dt.currency}</td>
								</tr>
							)
						}
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel className="margin-bot-false">
					<PanelHeader>Item</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-wrap">
													<thead>
															<tr>
																	<th>No PR</th>
																	<th>Line Item</th>
																	<th>No Material</th>
																	<th>Short Text</th>
																	<th>Spesifikasi</th>
																	<th>QTY</th>
																	<th>Uom</th>
																	<th>Currency</th>
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