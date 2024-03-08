import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';


const ItemsRetenderSelected = (props) => {

	let {data} = props;
	let rows="", total_keseluruhan = 0;
	if (data.length > 0){
		rows = data.map((dt, i) => {
			total_keseluruhan = total_keseluruhan + (dt.valuation_price* (dt.qty/dt.per))
			return (
				<tr key={i}>
                    <td>
                        <input type="checkbox" value={dt.pr_item_uuid}/>
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
                    <td>
                        <button className="btn btn-xs btn-lime" onClick={(e) => detail(e, dt.pr_item_uuid)}>Details</button>
                    </td>
				</tr>
			)
		})
	}else {
		rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
	}

	const detail = (e, pr_item_uuid) =>{
		e.preventDefault()
		props.modal(pr_item_uuid,"item")
	}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Item Terpilih</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead className="text-bold">
														<tr>
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
															<th>Action</th>
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
			</div>
    );
}

export default withTranslation()(ItemsRetenderSelected);