import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../helpers/formatNumber';


const ItemTerpilih = (props) => {
	let {data} = props;
	let rows="", total_keseluruhan = 0;
	if (data.length > 0){
		rows = data.map((dt, i) => {
			total_keseluruhan = total_keseluruhan + (dt.valuation_price* (dt.qty/dt.per))
			return (
				<tr key={i}>
					<td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.number_pr}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.item_no}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.material_id && parseInt(dt.material_id)}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.short_text}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.material_group_id}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.plant_id}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold',textAlign:'right'}:(dt.is_retender_itemize==='x') ? {color:'red' , textAlign:'right'} :{textAlign : 'right'}}>{ formatNumber(dt.qty,2) }</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{}}>{dt.uom}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold',textAlign:'right'}: (dt.is_retender_itemize==='x') ? {color:'red' , textAlign:'right'} : {textAlign : 'right'}}>{formatNumber(dt.per,2)}</td>
                    <td align="right" style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} } >{formatNumber(dt.valuation_price,2)}</td>
                    <td align="right" style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} } >{formatNumber(dt.valuation_price* (dt.qty/dt.per),2)}</td>
                    <td style={(dt.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(dt.is_retender_itemize==='x') ? {color:'red'}:{} }>{dt.currency}</td>
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
					{console.log(props.monitoringTender?.is_retender_itemize)}
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
                                                            <th>Plant</th>
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
						{props.loadings.pages===false && props.monitoringTender?.is_retender_itemize!==undefined && props.monitoringTender?.is_retender_itemize.includes('p') && 
							<div className="row pull-right m-t-10">
								<button  className="btn btn-danger btn-sm m-r-10" style={{float : "right"}} onClick={ () => props.approval('r') } disabled={props.loadings.button}>{props.loadings.button && <i className="fa fa-spinner fa-spin"></i> }  Reject</button>
								<button  className="btn btn-success btn-sm m-r-10" style={{float : "right"}} onClick={ () => props.approval('x') } disabled={props.loadings.button}>{props.loadings.button && <i className="fa fa-spinner fa-spin"></i> }  Approve</button>
							</div>
						}

					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(ItemTerpilih);