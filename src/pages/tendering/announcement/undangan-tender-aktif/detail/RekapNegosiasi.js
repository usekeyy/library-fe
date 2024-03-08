import React from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';
import ModalRekapNegosiasi from './ModalRekapNegosiasi';

const RekapNegosiasi = (props) => {
	// const { t } = props;
		const detail = (e, uuid,data) =>{
			e.preventDefault()
			setModalOpen(true)
			setDataModal(data)
		}
		// const {negotiations} = props.parentState.tahap_nego;
		const {rekapNegosiasi} = props.parentState.vendor_registration_tender;
		const [modalOpen,setModalOpen] = React.useState(false)
		const [dataModal,setDataModal]= React.useState('')
		const data = rekapNegosiasi;
		const data_nego = Object.entries(data);
		let tbodies;
		if (data_nego.length > 0) {
		// const pr_index = Object.keys(data)
		const pr_value = Object.values(data)

		// const toggleDetailItem = (e, uuid, data) => {
		// 	e.preventDefault();
		// 	props.toggleDetailItem(uuid, data)
		// }

		tbodies = pr_value.map((item, index) => {
				// const item_index = Object.keys(item)
				const item_value = Object.values(item)
				const itemzRows = item_value.map((itemz, indexz) => {
					// const row_pr = indexz === 0 ? <td rowSpan={7}>{pr_index[index]}</td> : null;
					const row_pr = indexz === 0
					? <tr>
									<th style={{ backgroundColor: '#e6e600', borderColor: '#e6e600' }}>No Material</th>
									<th style={{ backgroundColor: '#e6e600', borderColor: '#e6e600' }}>Deskripsi</th>
									<th style={{ backgroundColor: '#e6e600', borderColor: '#e6e600' }}>Line Item</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Curr</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Satuan Awal</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Qty</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Harga Total</th>
									<th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>Delivery Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Curr</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Nego Satuan</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Qty</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Nego Total</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Delivery Time</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Selisih Harga Awal (%)</th>
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Quote</th>
									{/* <th style={{ backgroundColor: 'pink', borderColor: 'pink' }}>No PR</th>
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
									<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }}>Quote</th> */}
							</tr>
					: null;
					// console.log(itemz[0]);
					const itemz_index = Object.keys(itemz)
					const itemz_value = Object.values(itemz)
					const vendorRows = itemz_index.map((itemx, indexx) => { 
						// const datax = itemz_value[indexx][0];
						const result = itemz_value[indexx].map((datax, indexxx) => {
							
							const row_item = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{datax.short_text}</td> : null;
							const row_line = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{datax.item_no}</td> : null;
							// const row_item_pr = indexx === 0 ? <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}} rowSpan={itemz_index.length}>{pr_index[index]}</td> : null;
							const nego_qty = (datax.negotiation_id !== null) ? datax.nego_qty : datax.qty;
							const nego_valuation_price = (datax.negotiation_id !== null) ? datax.nego_valuation_price : datax.valuation_price;
							// const selisih_oe = (parseInt(nego_valuation_price)-parseInt(datax.valuation_price))/parseInt(nego_valuation_price) * 100;
							const selisih_awal = (parseInt(nego_valuation_price)-parseInt(datax.valuation_price))/parseInt(datax.valuation_price) * 100;
								return (
									<tr key={indexx +'-'+indexxx}>
										<td>{datax.material_id && parseInt(datax.material_id)}</td>
										{row_item}
										{row_line}
										<td>{datax.currency}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(datax.valuation_price, 2)}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(datax.qty, 2)}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(parseInt(datax.valuation_price) * (parseInt(datax.qty)/parseInt(datax.per)), 2)}</td>
										<td style={{textAlign : 'right'}}>{datax.delivery_time}</td>
										<td>{datax.currency}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(nego_valuation_price, 2)}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(nego_qty, 2)}</td>
										<td style={{textAlign : 'right'}}>{formatNumber(parseInt(nego_valuation_price) * (parseInt(nego_qty)/parseInt(datax.per)), 2)}</td>
										<td>{datax.delivery_time}</td>
										{/* <td>{`${formatNumber(selisih_oe)} %`}</td> */}
										<td style={{textAlign : 'right'}}>{`${formatNumber(selisih_awal)} %`}</td>
										<td>
											{datax.quote === 'deviate' && <a href="/" onClick={(e) => detail(e, datax.uuid, datax)}>{datax.quote}</a>}
											{datax.quote !== 'deviate' && datax.quote}
										</td>
									</tr>
								);
						})
						return result
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

		const toggleFormClose = () => {
			console.log("close")
			setModalOpen(false)
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
															<th style={{ backgroundColor: '#e6e600', borderColor: '#e6e600' }} colSpan={3} className="text-center">Item</th>
															<th style={{ backgroundColor: 'pink', borderColor: 'pink' }} colSpan={5} className="text-center">Harga Penawaran Awal</th>
															<th style={{ backgroundColor: 'aquamarine', borderColor: 'aquamarine' }} colSpan={7} className="text-center">Harga Penawaran Akhir</th>
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
				{modalOpen && 
				<ModalRekapNegosiasi 
					toggleAdd={modalOpen}
					toggleClose={() => toggleFormClose()}
					data = {dataModal}
				/>}
			</div>
    );
}

export default RekapNegosiasi;