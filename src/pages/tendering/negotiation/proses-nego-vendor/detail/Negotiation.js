import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';
import {restrictNumber} from '../../../../../helpers/restrictNumber';
import {statusName} from '../../../../../helpers/statusName';
import { Modal } from 'reactstrap';
import NumberFormat from 'react-number-format';

const Negotiation = (props) => {
    // const { t } = props;
		const { register, watch, control } = useFormContext();
		const watchAllFields = watch();
		const {items} = props.parentState.proses_nego_vendor;
		const {errors} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		const {quotation_items} = props.parentState.proses_nego_vendor;
		const {last_histories} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;
		const [mounted, isMounted] = React.useState(true)
		const [loadingItems, setLoadingItems] = React.useState(true)
		const isDisabledInput = dataTemp.current === props.parentState.isRole && (dataTemp.status === 'nego' || dataTemp.status_nego === 'rejected');
		let rows;
		let arr_price_length = []
		let arr_remark_length = []
		let arr_line_price_length = []
		let arr_line_remark_length = []
		
		React.useEffect(() => {
			if(mounted){
				if(!loadings.items && loadingItems){
					setTimeout(() => {
						isMounted(false)
						setLoadingItems(false)
						scrollTo()
					}, 3000)
				}
			}
		})

		const scrollTo = async () => {
			if(document.getElementById('page-nego-vendor') !== null){
				document.getElementById('page-nego-vendor').scrollIntoView();
			}
    }

		if (items.length > 0) {
			rows = items.map((dt, i) => {
					// let dlv_time = 0;
					if(last_histories && last_histories.length > 0){
						// const get_last_history = last_histories.filter(i => i.short_text === dt.short_text);
						// dlv_time = get_last_history[0]?.delivery_time;
					}
					const get_quote_barang = quotation_items.filter(i => i.purchasing_requisition_item_id === dt.pri_id);
					const get_harga_awal_barang = (get_quote_barang.length > 0) ? get_quote_barang[0].valuation_price : 0;
					// const qtyItems = (watchAllFields[`send_items[${dt.quotation_item_id}].qty`] !== undefined) ? watchAllFields[`send_items[${dt.quotation_item_id}].qty`] : 0;
					const get_harga_nego = (dt.price_negotiation && dt.price_negotiation !== null) ? isNaN(parseFloat(dt.price_negotiation)) ? 0 : parseFloat(dt.price_negotiation) : isNaN(parseFloat(dt.price_quotation)) ? 0 : parseFloat(dt.price_quotation);
					const priceItems = (watchAllFields[`send_items[${dt.quotation_item_id}].price`] !== undefined) ? watchAllFields[`send_items[${dt.quotation_item_id}].price`] : 0;
					const remarkItems = (watchAllFields[`send_items[${dt.quotation_item_id}].remark`] !== undefined) ? watchAllFields[`send_items[${dt.quotation_item_id}].remark`] : 0;

					let floatPriceItems = priceItems
					if(get_harga_nego !== floatPriceItems){
						if(priceItems.toString().indexOf(',') !== -1 && priceItems.toString().indexOf('.') !== -1){
							const split1 = priceItems.toString().split('.').join(';');
							const split2 = split1.toString().split(',').join('.');
							floatPriceItems = parseFloat(split2.toString().split(';').join(''));
						} else if(priceItems.toString().indexOf(',') !== -1){
							const split3 = priceItems.toString().split(',').join('.');
							floatPriceItems = parseFloat(split3);
						} else if(priceItems.toString().indexOf('.') !== -1){
							floatPriceItems = parseFloat(priceItems.toString().split('.').join(''));
						} 
					} else {
						floatPriceItems = get_harga_nego;
					}

					const convertPrice = floatPriceItems;
					let totalPerItem = convertPrice*(parseFloat(dt.qty)/dt.per)
					console.log("priceItems", priceItems);
					console.log("qty", parseFloat(dt.qty));
					console.log("convertPrice", convertPrice);
					console.log("totalPerItem", totalPerItem);
					console.log("----------------------------");
					let service_lines;
					// setWidth Tipe Barang
					const minWidthPrice = 150;
					// const minWidthRemark = 120;
					arr_price_length.push(priceItems.length);
					arr_remark_length.push(remarkItems.length);
					const max_length_price = Math.max(...arr_price_length);
					// const max_length_remark = Math.max(...arr_remark_length);
					const width_price = max_length_price > 8 ? minWidthPrice+(max_length_price*5) : minWidthPrice;
					// const width_remark = max_length_remark > 8 ? minWidthRemark+(max_length_remark*8) : minWidthRemark;
					const isServices = dt.services_lines && dt.services_lines.length > 0;
					const maxValue = get_harga_nego < convertPrice;
					// console.log(`${width_remark}`);
					if(isServices){
						service_lines = dt.services_lines.map((line, key) => {
							let row_lines;
							let get_quote_jasa = []
							if(get_quote_barang[0].services_lines.length > 0){
								get_quote_jasa = get_quote_barang[0].services_lines.filter(i => i.purchasing_requisition_service_id === line.purchasing_requisition_service_id);
							}
							const get_harga_awal_jasa = (get_quote_jasa.length > 0) ? get_quote_jasa[0].valuation_price : 0;
							const qtyItemsLine = (watchAllFields[`send_items[${line.quotation_item_id}].qty`] !== undefined) ? watchAllFields[`send_items[${line.quotation_item_id}].qty`] : 0;
							const priceItemsLine = (watchAllFields[`send_items[${line.quotation_item_id}].price`] !== undefined) ? watchAllFields[`send_items[${line.quotation_item_id}].price`] : 0;
							const remarkItemsLine = (watchAllFields[`send_items[${line.quotation_item_id}].remark`] !== undefined) ? watchAllFields[`send_items[${line.quotation_item_id}].remark`] : 0;
							const get_harga_nego_line = (line.price_negotiation && line.price_negotiation !== null) ? isNaN(parseFloat(line.price_negotiation)) ? 0 : parseFloat(line.price_negotiation) : isNaN(parseFloat(line.price_quotation)) ? 0 : parseFloat(line.price_quotation);
							let floatPriceItemsLine = priceItemsLine
							if(priceItemsLine.toString().indexOf(',') !== -1 && priceItemsLine.toString().indexOf('.') !== -1){
								const split1 = priceItemsLine.toString().split('.').join(';');
								const split2 = split1.toString().split(',').join('.');
								floatPriceItemsLine = parseFloat(split2.toString().split(';').join(''));
							} else if(priceItemsLine.toString().indexOf(',') !== -1){
								const split3 = priceItemsLine.toString().split(',').join('.');
								floatPriceItemsLine = parseFloat(split3);
							} else if(priceItemsLine.toString().indexOf('.') !== -1){
								floatPriceItemsLine = parseFloat(priceItemsLine.toString().split('.').join(''));
							} else {
								floatPriceItemsLine = parseFloat(priceItemsLine)
							}
							const convertLinePrice = floatPriceItemsLine;
							const totalPerItemLine = convertLinePrice*(parseFloat(qtyItemsLine)/parseFloat(line.per))
							const maxLineValue = get_harga_nego_line < convertLinePrice;

							// setWidth Tipe Jasa
							const minWidthLinePrice = 150;
							const minWidthLineRemark = 120;
							arr_line_price_length.push(priceItemsLine.length);
							arr_line_remark_length.push(remarkItemsLine.length);
							const max_length_line_price = Math.max(...arr_line_price_length);
							const max_length_line_remark = Math.max(...arr_line_remark_length);
							const width_line_price = max_length_line_price > 8 ? minWidthLinePrice+(max_length_line_price*5) : minWidthLinePrice;
							const width_line_remark = max_length_line_remark > 8 ? minWidthLineRemark+(max_length_line_remark*8) : minWidthLineRemark;
							console.log(`${width_line_remark}`);
							if(line.proposal_tender_item_id === dt.proposal_tender_item_id){
								row_lines = <tr key={key}>
															<td>{line.line_number_service}</td>
															<td>{line.material_id}</td>
															<td><ul><li>{line.short_text_service}</li></ul></td>
															<td align="right">{formatNumber(line.qty, 2)}</td>
															<td>{line.uom}</td>
															<td>{line.currency}</td>
															<td align="right">{formatNumber(get_harga_awal_jasa, 2)}</td>
															<td>
																<input type="hidden" name={`send_items[${line.quotation_item_id}].id`} defaultValue={line.id} className="form-control" ref={register} />
																<input type="hidden" name={`send_items[${line.quotation_item_id}].proposal_tender_item_id`} defaultValue={line.proposal_tender_item_id} className="form-control" ref={register} />
																<input type="hidden" name={`send_items[${line.quotation_item_id}].purchasing_requisition_service_id`} defaultValue={line.purchasing_requisition_service_id} className="form-control" ref={register} />
																<input type="hidden" name={`send_items[${line.quotation_item_id}].qty`} defaultValue={line.qty} className="form-control" ref={register} />
																<input type="hidden" name={`send_items[${line.quotation_item_id}].max_value`} defaultValue={get_harga_nego_line} className="form-control" ref={register} />
																{/* <input type="number" min="0" max={(line.price_negotiation && line.price_negotiation !== null) ? isNaN(parseInt(line.price_negotiation)) ? 0 : parseInt(line.price_negotiation) : isNaN(parseInt(line.price)) ? 0 : parseInt(line.price)} onKeyPress={(e) => restrictNumber(e)} name={`send_items[${line.quotation_item_id}].price`} defaultValue={(line.price_negotiation && line.price_negotiation !== null) ? isNaN(parseInt(line.price_negotiation)) ? 0 : parseInt(line.price_negotiation) : isNaN(parseInt(line.price)) ? 0 : parseInt(line.price) } className={(errors[`items.${line.quotation_item_id}.price`]) ? "form-control is-invalid" : "form-control"} ref={register} disabled={!isDisabledInput} style={{ width: `${width_line_price}px` }} /> */}
																{<Controller
																	as={NumberFormat} 
																	control={control} 
																	thousandSeparator={'.'} 
																	decimalSeparator={','}
																	name={`send_items[${line.quotation_item_id}].price`}
																	defaultValue={get_harga_nego_line}
																	className={(errors[`items.${line.quotation_item_id}.price`] || maxLineValue) ? "form-control is-invalid" : "form-control"} 
																	style={{ width: `${width_line_price}px` }} 
																	disabled={!isDisabledInput}
																	// isAllowed={(values) => {
																	// 	const {floatValue} = values;
																	// 	const maxValue = (line.price_negotiation && line.price_negotiation !== null) ? isNaN(parseInt(line.price_negotiation)) ? 0 : parseInt(line.price_negotiation) : isNaN(parseInt(line.price)) ? 0 : parseInt(line.price);
																	// 	return floatValue <= maxValue;
																	// }}
																	// placeholder="0" 
																	// min="0" 
																	// max={(line.price_negotiation && line.price_negotiation !== null) ? isNaN(parseInt(line.price_negotiation)) ? 0 : parseInt(line.price_negotiation) : isNaN(parseInt(line.price)) ? 0 : parseInt(line.price)} 
																/>}
																{errors[`items.${line.quotation_item_id}.price`] && <p className="text-danger"> {errors[`items.${line.quotation_item_id}.price`][0]} </p>}
																{maxLineValue && <p className="text-danger"> {`Value Must Be Less Than ${get_harga_nego_line}`} </p>}
															</td>
															<td align="right">{formatNumber(totalPerItemLine, 2)}</td>
															<td>{line.quote}</td>
															<td>{statusName(line.status)}</td>
															<td align="right">
																<input type="hidden" name={`send_items[${line.quotation_item_id}].delivery_time`} className={(errors['delivery_time']) ? "form-control is-invalid" : "form-control"} defaultValue={dt.delivery_time} ref={register} disabled={!isDisabledInput} />
																{errors[`items.${line.quotation_item_id}.delivery_time`] && <span className="text-danger"> {errors[`items.${line.quotation_item_id}.delivery_time`][0]} </span>}
															</td>
															<td>
																{/* <input type="text" name={`send_items[${line.quotation_item_id}].remark`} className={(errors['remark']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={line.remark} disabled={!isDisabledInput} style={{ width: `${width_line_remark}px` }} /> */}
																<textarea rows="1" cols="3" name={`send_items[${line.quotation_item_id}].remark`} className={(errors['remark']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={line.remark} disabled={!isDisabledInput} />
																{errors[`items.${line.quotation_item_id}.remark`] && <span className="text-danger"> {errors[`items.${line.quotation_item_id}.remark`][0]} </span>}
															</td>
															<td>{line.created_at}</td>
														</tr>
							}
							return row_lines;
						})
					}
						return (
								<React.Fragment key={i}>
									<tr>
										<td>{dt.item_no}</td>
										<td colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
										{!isServices && <td>{dt.short_text}</td>}
										<td align="right">{(isServices) ? '' : formatNumber(dt.qty, 2)}</td>
										<td>{(isServices) ? '' : dt.uom}</td>
										<td>{(isServices) ? '' : dt.currency}</td>
										<td align="right">{(isServices) ? '' : formatNumber(get_harga_awal_barang, 2)}</td>
										<td>
											<input type="hidden" name={`send_items[${dt.quotation_item_id}].id`} defaultValue={dt.id} className="form-control" ref={register} />
											<input type="hidden" name={`send_items[${dt.quotation_item_id}].proposal_tender_item_id`} defaultValue={dt.proposal_tender_item_id} className="form-control" ref={register} />
											<input type="hidden" name={`send_items[${dt.quotation_item_id}].purchasing_requisition_service_id`} defaultValue={''} className="form-control" ref={register} />
											<input type="hidden" name={`send_items[${dt.quotation_item_id}].qty`} defaultValue={dt.qty} className="form-control" ref={register} />
											<input type="hidden" name={`send_items[${dt.quotation_item_id}].max_value`} defaultValue={get_harga_nego} className="form-control" ref={register} />
											{/* <input type={isServices ? 'hidden' : 'number' } name={`send_items[${dt.quotation_item_id}].price`} defaultValue={(dt.price_negotiation && dt.price_negotiation !== null) ? isNaN(parseInt(dt.price_negotiation)) ? 0 : parseInt(dt.price_negotiation) : isNaN(parseInt(dt.price)) ? 0 : parseInt(dt.price) } className={(errors[`items.${dt.quotation_item_id}.price`]) ? "form-control is-invalid" : "form-control"} ref={register} placeholder="0" min="0" max={(dt.price_negotiation && dt.price_negotiation !== null) ? isNaN(parseInt(dt.price_negotiation)) ? 0 : parseInt(dt.price_negotiation) : isNaN(parseInt(dt.price)) ? 0 : parseInt(dt.price)} style={{ width: `${width_price}px` }} disabled={!isDisabledInput} /> */}
											{<Controller
												as={NumberFormat} 
												control={control} 
												thousandSeparator={'.'} 
												decimalSeparator={','}
												name={`send_items[${dt.quotation_item_id}].price`} 
												defaultValue={get_harga_nego} 
												className={(errors[`items.${dt.quotation_item_id}.price`] || maxValue) ? "form-control is-invalid" : "form-control"} 
												style={{ width: `${width_price}px`, display: (isServices) ? 'none' : 'unset' }} 
												disabled={!isDisabledInput}
												// isAllowed={(values) => {
												// 	const {floatValue} = values;
												// 	const maxValue = (dt.price_negotiation && dt.price_negotiation !== null) ? isNaN(parseInt(dt.price_negotiation)) ? 0 : parseInt(dt.price_negotiation) : isNaN(parseInt(dt.price)) ? 0 : parseInt(dt.price);
												// 	return floatValue <= maxValue;
												// }}
												// placeholder="0" 
												// min="0" 
												// max={(dt.price_negotiation && dt.price_negotiation !== null) ? isNaN(parseInt(dt.price_negotiation)) ? 0 : parseInt(dt.price_negotiation) : isNaN(parseInt(dt.price)) ? 0 : parseInt(dt.price)} 
											/>}
											{errors[`items.${dt.quotation_item_id}.price`] && <p className="text-danger"> {errors[`items.${dt.quotation_item_id}.price`][0]} </p>}
											{maxValue && <p className="text-danger"> {`Value Must Be Less Than ${get_harga_nego}`} </p>}
										</td>
										<td align="right">{(isServices) ? '' : formatNumber(totalPerItem, 2)}</td>
										<td>{(isServices) ? '' : dt.quote}</td>
										<td>{(isServices) ? '' : statusName(dt.status)}</td>
										<td align="right">
											<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} name={`send_items[${dt.quotation_item_id}].delivery_time`} className={(errors['delivery_time']) ? "form-control is-invalid" : "form-control"} defaultValue={(last_histories && last_histories.length > 0) ? dt.delivery_time : dt.delivery_time} ref={register} disabled={!isDisabledInput} />
											{errors[`items.${dt.quotation_item_id}.delivery_time`] && <span className="text-danger"> {errors[`items.${dt.quotation_item_id}.delivery_time`][0]} </span>}
										</td>
										<td>
											{/* {<input type={isServices ? 'hidden' : 'text' } name={`send_items[${dt.quotation_item_id}].remark`} className={(errors['remark']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={dt.remark} disabled={!isDisabledInput} style={{ width: `${width_remark}px` }} />} */}
											<textarea rows="1" cols="3" name={`send_items[${dt.quotation_item_id}].remark`} className={(errors['remark']) ? "form-control is-invalid" : "form-control"} ref={register} defaultValue={dt.remark} disabled={!isDisabledInput} />
											{errors[`items.${dt.quotation_item_id}.remark`] && <span className="text-danger"> {errors[`items.${dt.quotation_item_id}.remark`][0]} </span>}
										</td>
										<td>{dt.created_at}</td>
									</tr>
									{isServices && service_lines}
								</React.Fragment>
						)
				})
		} else {
			rows = (<RowEmpty colSpan='14'>Tidak ada data</RowEmpty>);
		}
		
		// const rows_loading = (<RowEmpty colSpan='14'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);

    return (
			<div>
				<Panel>
					<PanelHeader>Negotiation</PanelHeader>
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
																	<th>Line Item</th>
																	<th>No Material</th>
																	<th>Description</th>
																	<th>Qty</th>
																	<th>Uom</th>
																	<th>Curr</th>
																	<th>Harga Satuan Awal</th>
																	<th>Harga Satuan</th>
																	<th>Harga Total</th>
																	<th>Quote</th>
																	<th>Status</th>
																	<th>Delivery Time (Hari)</th>
																	<th style={{ minWidth: '200px' }}>Remark</th>
																	<th>Date</th>
															</tr>
													</thead>
													<tbody>
														{/* {loadingItems && rows_loading} */}
														{!loadingItems && rows}
													</tbody>
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
				<Modal isOpen={loadingItems} backdrop={false} fade={true} centered={true} className="modal-lg">
						<center>
						<br />
						<h1><i>LOAD ITEM ...</i> </h1>
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
				</Modal>
			</div>
    );
}

export default withTranslation()(Negotiation);