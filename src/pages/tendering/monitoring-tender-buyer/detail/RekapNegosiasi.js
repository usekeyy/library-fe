import React from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../helpers/formatNumber';

const Negotiation = (props) => {
	// const { t } = props;
		const detail = (e, uuid,data) =>{
			e.preventDefault()
			props.modal(data,"rekap_negosiasi")
		}
		const {data,items} = props;
		const data_nego = Object.entries(data);
		let tbodies;
		if (data_nego.length > 0) {
		const pr_index = Object.keys(data)
		const pr_value = Object.values(data)


		tbodies = pr_value.map((item, index) => {
			const item_line = Object.values(item)
			const rowLineNo = item_line.map((item_line, index_line) => {
				const row_pr = index_line === 0
					? <tr>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>No PR</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Short Text</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Line Item</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Rank</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Vendor</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Curr</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Satuan Awal</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Qty</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Total</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Dlv Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Curr</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Harga Satuan Awal</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Qty</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Harga Total</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Dlv Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Selisih OE (%)</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Selisih Harga Awal (%)</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Quote</th>
							</tr>
					: null;
				const item_value = Object.values(item_line)
				const itemzRows = item_value.map((itemz, indexz) => {
					// const row_pr = indexz === 0 ? <td rowSpan={7}>{pr_index[index]}</td> : null;
					
					// console.log(itemz[0]);
					const itemz_index = Object.keys(itemz)
					const itemz_value = Object.values(itemz)
					const vendorRows = itemz_index.map((itemx, indexx) => { 
						// console.log(itemz_value[indexx].length)

						const datax = itemz_value[indexx][0];
						if(datax.quote !== 'no_quote'){
							const filter_items = items.filter(i => i.number_pr === datax?.pr_number && i.short_text === datax.short_text);
							const pr_value = (filter_items[0]) ? filter_items[0].valuation_price : 0;
							const row_item = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{datax.short_text}</td> : null;
							const row_line = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{datax.item_no}</td> : null;
							const row_item_pr = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{pr_index[index]}</td> : null;
							const nego_qty = (datax.negotiation_id !== null) ? datax.nego_qty : datax.qty;
							const nego_valuation_price = (datax.negotiation_id !== null) ? datax.nego_valuation_price : datax.valuation_price;
							const nilai_awal = (parseFloat(datax.nego_valuation_price) === 0 || isNaN(datax.nego_valuation_price)) ? datax.valuation_price : datax.nego_valuation_price;
							// console.log("pr value : "+pr_value)
							// console.log("nilai awal : "+nilai_awal)
							const selisih_oe = (parseFloat(pr_value)-parseFloat(nilai_awal))/parseFloat(pr_value) * 100;
							const selisihAwalValue = (parseFloat(datax.valuation_price)-parseFloat(datax.nego_valuation_price))/parseFloat(datax.valuation_price) * 100;
							const selisih_awal = (parseFloat(datax.nego_valuation_price) === 0 || isNaN(datax.nego_valuation_price)) ? 0 : selisihAwalValue;
							// selisih OE = ((harga satuan item pr-harga satuan nego)/harga satuan item pr)*100%
								return (
									<tr key={indexx}>
										{row_item_pr}
										{row_item}
										{row_line}
										<td>{indexx+1}</td>
										<td>{itemx}</td>
										<td>{datax.currency}</td>
										<td align="right">{formatNumber(datax.valuation_price, 2)}</td>
										<td align="right">{formatNumber(datax.qty, 2)}</td>
										<td align="right">{formatNumber(parseFloat(datax.valuation_price) * (parseFloat(datax.qty)/parseFloat(datax.per)), 2)}</td>
										<td align="right">{datax.delivery_time}</td>
										<td>{datax.currency}</td>
										<td align="right">{formatNumber(nego_valuation_price, 2)}</td>
										<td align="right">{formatNumber(nego_qty, 2)}</td>
										<td align="right">{formatNumber(parseFloat(nego_valuation_price) * (parseFloat(nego_qty)/parseFloat(datax.per)), 2)}</td>
										<td align="right">{datax.delivery_time}</td>
										<td align="right" className={(selisih_oe < 0) ? 'text-danger' : ''}>{`${formatNumber(Math.abs(selisih_oe), 2)} %`}</td>
										<td align="right" className={(selisih_awal < 0) ? 'text-danger' : ''}>{`${formatNumber(selisih_awal, 2)} %`}</td>
										<td>
											{datax.quote === 'deviate' && <a href="/" onClick={(e) => detail(e, datax.uuid, datax)}>{datax.quote}</a>}
											{datax.quote !== 'deviate' && datax.quote}
										</td>
									</tr>
								);
						}else{
							return false
						}
					})
					return (
						<tbody key={indexz} >
							<React.Fragment>
								{row_pr}
							</React.Fragment>
							{vendorRows}
						</tbody>
					);
				})
				return itemzRows
			})
			return rowLineNo;
		})
	} else {
		tbodies = (<tbody><RowEmpty colSpan='12'>Tidak ada data</RowEmpty></tbody>);
	}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Rekap Negosiasi</PanelHeader>
					{/* {(!loadings.items) && */}
					<PanelBody >
						{/* {errors.items && <p className="text-danger"> * {errors.items[0]} </p>} */}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-sm text-nowrap">
													<thead>
														<tr>
															<th style={{ backgroundColor: 'pink', borderColor: 'pink' }} colSpan={10} className="text-center">Harga Penawaran Awal</th>
															<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }} colSpan={12} className="text-center">Harga Penawaran Akhir</th>
														</tr>
													</thead>
													{tbodies}
											</table>
									</div>
							</div>
						</div>
					</PanelBody>
					{/* } */}
				</Panel>
			</div>
    );
}

export default Negotiation;