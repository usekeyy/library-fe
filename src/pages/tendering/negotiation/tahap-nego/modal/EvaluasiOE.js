import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const EvaluasiOE = (props) => {
	const {t} = props;
	const { register, handleSubmit } = useForm({});
	// const {header} = props.parentState.tahap_nego;
	const {loadings} = props.parentState;
	// const resp_errors = props.parentState.tahap_nego.errors;
	const {items,negotiations} = props.parentState.tahap_nego;
	// const {item_selected} = props.parentState.tahap_nego;
	const pr_value = Object.values(negotiations)
	const pr_index = Object.keys(negotiations)
	const rekap_nego = []
	console.log(pr_index)

	const onSubmit = async data => {
		let arr = [];
		if(data.items.length > 0){
			data.items.forEach(i => {
				if(i.proposal_tender_item_id !== false) { arr.push(i) }
			})
		}
		data.items = arr;
		if(arr.length > 0){
			props.saveEvaluasiOE(data.items);
		} else {
			toastr.warning("Warning", "No Item Selected");
		}
	};

	//ruwet
	pr_value.forEach((item, index) => { //pr number
		const item_line = Object.values(item)
		const item_key = Object.keys(item)
		item_line.forEach((item_line, index_line) => { //item line
			let isSelisihOE = true;
			const item_value = Object.values(item_line)
			// const item_key = Object.keys(item_line)
			item_value.forEach((itemz, indexz) => { //description
				const itemz_index = Object.keys(itemz)
				const itemz_value = Object.values(itemz)
				const vendorRows = itemz_index.forEach((itemx, indexx) => { //vendor
					const datax = itemz_value[indexx][0];
					const filter_items = items.filter(i => i.number_pr === datax.pr_number && i.short_text === datax.short_text);
					const pr_value = (filter_items[0]) ? filter_items[0].valuation_price : 0;
					const nilai_awal = (parseInt(datax.nego_valuation_price) === 0 || isNaN(datax.nego_valuation_price)) ? datax.valuation_price : datax.nego_valuation_price;
					const selisih_oe = (parseInt(pr_value)-parseInt(nilai_awal))/parseInt(pr_value) * 100;
					isSelisihOE = (isSelisihOE && (parseInt(selisih_oe) < 0 ? true : false)) ? true : false
					// console.log(selisih_oe)
				})
				console.log(vendorRows);
			})
			rekap_nego.push({
				pr_number : pr_index[index],
				item_no : item_key[index_line],
				isSelisihOE : isSelisihOE
			})
		})
	})
	//ruwet

	let rows;
		let rows_lines;
		let Total = 0;
		// console.log(props.parentState)
		if (items.length > 0) {
			rows = items.map((dt, i) => {
				const isServices = dt.service_lines && dt.service_lines.length > 0;
				let total_harga_barang = 0;
				if(!isServices){
					total_harga_barang = parseFloat(dt.valuation_price) * (parseFloat(dt.qty)/parseFloat(dt.per))
				} else {
					total_harga_barang = 0
				}

				// const obj = {
				// 	proposal_tender_item_id: dt.pr_item_id,
				// 	price: dt.valuation_price,
				// 	delivery_time: 0,
				// }

				const data_selisih_oe = rekap_nego.filter((dataa,indexx) => {
					return (dataa.pr_number === dt.number_pr && dataa.item_no === dt.item_no)
				})
				// console.log(rekap_nego)
				// console.log(data_selisih_oe)
				// console.log(dt.number_pr + " " + dt.item_no)
				Total += total_harga_barang;
					if(isServices){
						rows_lines = dt.service_lines.map((line, key) => {
							let service_lines;
							if(dt.purchasing_requisition_item_id === line.purchasing_requisition_item_id){
								const total_harga_jasa = parseFloat(line.net_value) * (parseFloat(line.qty)/parseFloat(line.per))
								Total += total_harga_jasa;
								service_lines = <tr key={key} className={data_selisih_oe[0]?.isSelisihOE ? "text-danger" : ""}>
																	<td></td>
																	<td>{line.number_pr}</td>
																	<td>{line.line_number}</td>
																	<td>{line?.material_id && parseInt(line?.material_id)}</td>
																	<td><ul><li>{line.short_text}</li></ul></td>
																	<td>{line.currency}</td>
																	<td>{line.uom}</td>
																	<td>{formatNumber(line.per, 2)}</td>
																	<td>{formatNumber(line.qty, 2)}</td>
																	<td align="right">{formatNumber(total_harga_jasa, 2)}</td>
																	<td></td>
															</tr>
							}
									return service_lines
						})
					}
						return (
								<React.Fragment key={i}>
									<tr className={data_selisih_oe[0]?.isSelisihOE ? "text-danger" : ""}>
											<td>
												{/* <input disabled={header.on_process} type="checkbox" checked={item_selected.includes(dt.pr_item_id)} onChange={(event) => props.handleChecklistItem(event, obj, dt.pr_item_id)} /> */}
												<input disabled={dt.pr_status === "o"} type="checkbox" name={`items[${i}].proposal_tender_item_id`} ref={register} value={dt.id} />
												<input type="hidden" name={`items[${i}].price`} ref={register} value={dt.valuation_price} />
												<input type="hidden" name={`items[${i}].delivery_time`} ref={register} value={0} />
											</td>
											<td>{dt.number_pr}</td>
											<td>{dt.item_no}</td>
											<td colSpan={isServices ? 2 : 0}>{isServices ? dt.short_text : parseInt(dt.material_id)}</td>
											{isServices ? null : <td>{dt.short_text}</td>}
											<td>{isServices ? '' : dt.currency}</td>
											<td>{isServices ? '' : dt.uom}</td>
											<td>{isServices ? '' : formatNumber(dt.per, 2) }</td>
											<td>{isServices ? '' : formatNumber(dt.qty, 2) }</td>
											<td align="right">{isServices ? '' : formatNumber(total_harga_barang, 2) }</td>
											<td>
												<input type="text" name={`items[${i}].note`} className="form-control" ref={register} defaultValue={dt.pr_catatan_buyer} disabled={dt.pr_status === "o"} />
											</td>
									</tr>
									{isServices && rows_lines}
								</React.Fragment>
						)
						
				})
				rows.push(
					<tr key={items.length + 1}>
							<td colSpan="9">Total Harga</td>
							<td align="right">{formatNumber(Total, 2)}</td>
							<td></td>
					</tr>
				)
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='13'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='13'>Tidak ada data</RowEmpty>);
			}
		}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
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
																<th>Remark</th>
														</tr>
												</thead>
												<tbody>{rows}</tbody>
										</table>
								</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-danger" disabled={loadings.button}>
						{loadings.button ? <i className="fa fa-spinner fa-spin"></i> : <div>Confirm</div>}
					</button>
					<button className="btn btn-white" disabled={loadings.button} type="button" onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (EvaluasiOE);