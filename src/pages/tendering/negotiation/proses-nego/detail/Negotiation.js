import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';
import {formatDate} from '../../../../../helpers/formatDate';

const Negotiation = (props) => {
    // const { t } = props;
		const { register } = useFormContext();
		// const { t } = props;
		const {items} = props.parentState.proses_nego_vendor;
		const {vendors} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		const {errors} = props.parentState.proses_nego_vendor;
		const {quotation_items} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;
		const {last_histories} = props.parentState.proses_nego_vendor;
		const [reject, setREject] = React.useState(false)
		// const [isShow, setIsShow] = React.useState(false)
		const isShow = false;
		// console.log((props.isRole));
		// console.log(dataTemp.current);
		const onCLickReject = (e) => {
			e.preventDefault();
			setREject(!reject);
		}

		let rows;
		let services_lines;
		// let length_vendor = vendors.length > 0 ? vendors.length : 0;
		// ((harga oe-harga vendor)/harga OE) * 100%
		if (items.length > 0) {
			let service;
			rows = items.map((dt, i) => {
				// let dlv_time = 0;
				if(last_histories && last_histories.length > 0){
					// const get_last_history = last_histories.filter(i => i.short_text === dt.short_text);
					// dlv_time = get_last_history[0]?.delivery_time;
				}
				const goodsQuotes = quotation_items.filter(i => i.purchasing_requisition_item_id === dt.pri_id);
				const servicesQuotes = goodsQuotes.length > 0 ? goodsQuotes[0]?.services_lines : [];
				const get_vendor = vendors.length > 0 ? vendors.filter(i => i.id === dt.vendor_id) : [];
				const get_harga_nego = dt.price_negotiation !== null ? dt.price_negotiation : dt.price_quotation;
				const harga_total = parseFloat(get_harga_nego)*(parseFloat(dt.qty)/parseFloat(dt.per))
				const selisih_oe = (parseFloat(goodsQuotes[0].pri_valuation_price)-parseFloat(get_harga_nego))/parseFloat(goodsQuotes[0].pri_valuation_price) * 100;
				const isServices = dt.services_lines && dt.services_lines.length > 0;
				
				if(isServices){
					services_lines = dt.services_lines.sort((a,b) => (a.line_number_service > b.line_number_service) ? 1 : ((b.line_number_service > a.line_number_service) ? -1 : 0)).map((line, key) => {
						if(dt.proposal_tender_item_id === line.proposal_tender_item_id){
							const price_quotes = servicesQuotes.filter(i => i.purchasing_requisition_service_id === line.purchasing_requisition_service_id);
							const get_vendor_line = vendors.length > 0 ? vendors.filter(i => i.id === line.vendor_id) : [];
							const th_vendor_line = key === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={dt.services_lines.length}>{`${get_vendor_line[0].id} - ${get_vendor_line[0].name}`}</td> : null;
							// console.log(get_vendor_line);
							const get_harga_nego_line = line.price_negotiation !== null ? line.price_negotiation : line.price_quotation;
							const harga_total_line = parseFloat(get_harga_nego_line)*(parseFloat(line.qty)/parseFloat(line.per))
							
							const selisih_oe_line = (parseFloat(price_quotes[0].net_value_service)-parseFloat(get_harga_nego_line))/parseFloat(price_quotes[0].net_value_service) * 100;

							service = 
								<tr key={key}>
									{/* {th_vendor_line} */}
									{/* <td>{get_vendor_line.length > 0 ? `${get_vendor_line[0].id} - ${get_vendor_line[0].name}` : ''}</td> */}
									{th_vendor_line}
									<td>{parseInt(line.line_number_service)}</td>
									<td>{line.material_id}</td>
									<td><ul><li>{line.short_text_service}</li></ul></td>
									<td align="right">{formatNumber(line.qty, 2)}</td>
									<td>{line.uom}</td>
									<td>{line.currency}</td>
									<td align="right">{formatNumber(line.price_quotation, 2)}</td>
									<td align="right">{formatNumber(line.pri_valuation_price, 2)}</td>
									<td align="right">{ line.price_negotiation !== null ? formatNumber(line.price_negotiation, 2) : formatNumber(line.price_quotation, 2) }</td>
									<td align="right">{formatNumber(harga_total_line, 2)}</td>
									<td>{line.quote}</td>
									<td>{line.status === 'y' ? 'Nego' : 'Rejected'}</td>
									<td align="right">
										{line.delivery_time}
									</td>
									{isShow && <td>
										{dataTemp.tipe === "1" && <React.Fragment>
											<input type="hidden" name="action" className={(errors['action']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={reject ? 'rejected' : ''} />
											{reject === false && <button type="button" className="btn btn-danger btn-xs" onClick={(e) => onCLickReject(e)}> Reject </button>}
											{reject === true && <button type="button" className="btn btn-primary btn-xs" onClick={(e) => onCLickReject(e)}> Cancel Reject </button>}
										</React.Fragment>}
									</td>}
									<td>
										<button type="button" className={(selisih_oe_line < 0) ? "btn btn-danger" : "btn btn-primary"} disabled={true}>{`${formatNumber(Math.abs(selisih_oe_line), 2)} %`}</button>
									</td>
									<td>
										<input type="hidden" name={`items[${line.quotation_item_id}].id`} className={"form-control"} ref={register} defaultValue={line.id} disabled={(dataTemp.current !== props.isRole)} />
										<input type="hidden" name={`items[${line.quotation_item_id}].purchasing_requisition_service_id`} className={"form-control"} ref={register} defaultValue={line.purchasing_requisition_service_id} disabled={(dataTemp.current !== props.isRole)} />
										{/* <input type="text" name={`items[${line.quotation_item_id}].remark`} className={"form-control"} ref={register} defaultValue={line.remark} disabled={(dataTemp.current !== props.isRole)} /> */}
										<textarea rows="1" cols="3" name={`items[${line.quotation_item_id}].remark`} className={"form-control"} ref={register} defaultValue={line.remark} disabled={(dataTemp.current !== props.isRole)} />
									</td>
									<td>{formatDate(line.created_at, true)}</td>
								</tr>	
						}
						return service
					})
				}
						return (
								<React.Fragment key={i}>
									<tr>
										<td style={isServices ? {width:"1%", textAlign: 'center', verticalAlign: 'middle'} : {width:"1%", textAlign: 'center', verticalAlign: 'middle', backgroundColor: '#f2f3f4'}}>{!isServices ? get_vendor.length > 0 ? `${get_vendor[0].id} - ${get_vendor[0].name}` : '' : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? dt.item_no : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}} colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
										{!isServices && <td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{dt.short_text}</td>}
										<td  align="right" style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? formatNumber(dt.qty, 2) : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? dt.uom : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? dt.currency : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? formatNumber(dt.price_quotation, 2) : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? formatNumber(dt.pri_valuation_price, 2) : ''}</td>
										<td align="right" style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? dt.price_negotiation !== null ? formatNumber(dt.price_negotiation, 2) : formatNumber(dt.price_quotation, 2) : ''}</td>
										<td align="right" style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? formatNumber(harga_total, 2) : ''}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices && dt.quote}</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{!isServices ? dt.status === 'y' ? 'Nego' : 'Rejected' : ''}</td>
										<td align="right" style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>
											{/* {(last_histories && last_histories.length > 0) ? dlv_time : dt.delivery_time} */}
											{dt.delivery_time}
										</td>
										{isShow && <td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>
											{dataTemp.tipe === "1" && <React.Fragment>
												<input type="hidden" name="action" className={(errors['action']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={reject ? 'rejected' : ''} />
												{!isServices && <React.Fragment>
													{reject === false && <button type="button" className="btn btn-danger btn-xs" onClick={(e) => onCLickReject(e)}> Reject </button>}
													{reject === true && <button type="button" className="btn btn-primary btn-xs" onClick={(e) => onCLickReject(e)}> Cancel Reject </button>}
												</React.Fragment>}
											</React.Fragment>}
										</td>}
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>
											{!isServices && <button type="button" className={(selisih_oe < 0) ? "btn btn-danger" : "btn btn-primary"} disabled={true}> {`${formatNumber(Math.abs(selisih_oe), 2)} %`} </button>}
										</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>
											{!isServices && 
											<React.Fragment>
												<input type="hidden" name={`items[${dt.quotation_item_id}].id`} className={"form-control"} ref={register} defaultValue={dt.id} disabled={(dataTemp.current !== props.isRole)} />
												<input type="hidden" name={`items[${dt.quotation_item_id}].purchasing_requisition_service_id`} className={"form-control"} ref={register} defaultValue={dt.purchasing_requisition_service_id} disabled={(dataTemp.current !== props.isRole)} />
												{/* <input type="text" name={`items[${dt.quotation_item_id}].remark`} className={"form-control"} ref={register} defaultValue={dt.remark} disabled={(dataTemp.current !== props.isRole)} /> */}
												<textarea rows="1" cols="3" name={`items[${dt.quotation_item_id}].remark`} className={"form-control"} ref={register} defaultValue={dt.remark} disabled={(dataTemp.current !== props.isRole)} />
											</React.Fragment>}
										</td>
										<td style={isServices ? {} : {backgroundColor: '#f2f3f4'}}>{formatDate(dt.updated_at, true)}</td>
									</tr>
									{isServices && services_lines}
								</React.Fragment>
						)
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='17'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='17'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel className="margin-bot-false">
					<PanelHeader>Negotiation</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-sm text-nowrap">
													<thead>
															<tr>
																	<th>Entity</th>
																	<th>Line Item</th>
																	<th>No Material</th>
																	<th>Description</th>
																	<th>Qty</th>
																	<th>Uom</th>
																	<th>Curr</th>
																	<th style={{ backgroundColor: 'pink', borderColor: 'pink' }} >Harga Awal</th>
																	<th>Harga OE</th>
																	<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }} >Harga Satuan</th>
																	<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }} >Harga Total</th>
																	<th>Quote</th>
																	<th>Status</th>
																	<th>Delivery Time (Hari)</th>
																	{isShow && <th>Process</th>}
																	<th>Selisih OE</th>
																	{<th style={{ minWidth: '200px' }}>Remark</th>}
																	<th>Update Date</th>
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

export default withTranslation()(Negotiation);