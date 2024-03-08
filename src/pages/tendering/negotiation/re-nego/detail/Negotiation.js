import React from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Negotiation = (props) => {
    // const { t } = props;
		const {negotiations} = props.parentState.re_nego;
		// const {data} = props.parentState;
		// const {attachments} = props.parentState.re_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.re_nego;
		const {loadings} = props.parentState;
		const data_nego = Object.entries(negotiations);
		let tbodies;
		if (data_nego.length > 0) {
		const pr_index = Object.keys(negotiations)
		const pr_value = Object.values(negotiations)

		const toggleDetailItem = (e, uuid, data) => {
			e.preventDefault();
			props.toggleDetailItem(uuid, data)
		}

		tbodies = pr_value.map((item, index) => {
				// const item_index = Object.keys(item)
				const item_value = Object.values(item)
				
				const itemzRows = item_value.map((itemz, indexz) => {
					// const row_pr = indexz === 0 ? <td rowSpan={7}>{pr_index[index]}</td> : null;
					const row_pr = indexz === 0
					? <tr>
									<th style={{ backgroundColor: '#f3f3f3', borderColor: '#f3f3f3' }}>{pr_index[index]}</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Short Text</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Line Item</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Rank</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Vendor</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Curr</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Satuan Awal</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Qty</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Total</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Delivery Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Curr</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Harga Satuan Awal</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Qty</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Harga Total</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Delivery Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Selisih OE (%)</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Selisih Harga Awal (%)</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Quote</th>
							</tr>
					: null;
					// console.log(itemz[0]);
					const itemz_index = Object.keys(itemz)
					const itemz_value = Object.values(itemz)
					const vendorRows = itemz_index.map((itemx, indexx) => { 
						const datax = itemz_value[indexx][0];
						
						const row_item = indexx === 0 ? <td rowSpan={itemz_index.length}>{datax.short_text}</td> : null;
						const row_line = indexx === 0 ? <td rowSpan={itemz_index.length}>{datax.item_no}</td> : null;
						const row_item_pr = indexx === 0 ? <td style={{ backgroundColor: '#f3f3f3', borderColor: '#f3f3f3' }} rowSpan={itemz_index.length}>{}</td> : null;
							return (
								<tr key={indexx}>
									{row_item_pr}
									{row_item}
									{row_line}
									<td>{datax.item_no}</td>
									<td>{itemx}</td>
									<td>{datax.currency}</td>
									<td>{formatNumber(datax.valuation_price, 2)}</td>
									<td>{formatNumber(datax.qty, 2)}</td>
									<td>{formatNumber(datax.valuation_price, 2)}</td>
									<td>{datax.delivery_time}</td>
									<td>{datax.currency}</td>
									<td>{formatNumber(datax.valuation_price, 2)}</td>
									<td>{formatNumber(datax.qty, 2)}</td>
									<td>{formatNumber(datax.valuation_price, 2)}</td>
									<td>{datax.delivery_time}</td>
									<td>{datax.delivery_time}</td>
									<td>{datax.delivery_time}</td>
									<td>
										{datax.quote === 'deviate' && <a href="/" onClick={(e) => toggleDetailItem(e, datax.uuid, datax)}>{datax.quote}</a>}
										{datax.quote !== 'deviate' && datax.quote}
									</td>
								</tr>
							);
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
		} else {
			tbodies = (<tbody><RowEmpty colSpan='12'>Tidak ada data</RowEmpty></tbody>);
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Rekap Negosiasi</PanelHeader>
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
															<th style={{ backgroundColor: '#f3f3f3', borderColor: '#f3f3f3' }} className="text-center">No PR</th>
															<th style={{ backgroundColor: 'pink', borderColor: 'pink' }} colSpan={9} className="text-center">Harga Penawaran Awal</th>
															<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }} colSpan={12} className="text-center">Harga Penawaran Akhir</th>
														</tr>
													</thead>
													{tbodies}
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default Negotiation;