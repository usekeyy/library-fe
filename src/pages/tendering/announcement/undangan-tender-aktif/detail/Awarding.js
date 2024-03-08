import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Awarding = (props) => {
		// const { order_placement } = props.parentState.vendor_registration_tender.header;
		const {awarding} = props.parentState.vendor_registration_tender;
		// const {loadings} = props.parentState;
		const handleDokumenDownload = (e,winner_id) => {
			console.log("klik")
			// e.preventDefault()
			props.downloadAwardingBeritaAcara(e,{winner_id : winner_id})
		}
		let rows;
		if (awarding.length > 0) {
			// if (order_placement == "paket"){
			// 	let harga_pen = 0, harga_akhir = 0
			// 	rows = awarding.map((data, i) => {
			// 			harga_pen = harga_pen + parseFloat(data.harga_penawaran)
			// 			harga_akhir = harga_akhir + parseFloat(data.harga_akhir)
			// 			if (awarding.length - 1 === i){
			// 				return (
			// 					<tr key={i}>
			// 						<td>{data.winner_id}</td>
			// 						<td>{data.name}</td>
			// 						<td>{formatNumber(harga_pen)}</td>
			// 						<td>{formatNumber(harga_akhir)}</td>
			// 						<td className="text-center"><button className="btn btn-white" onClick={(e) => handleDokumenDownload(e,data.winner_id)}>Dokumen</button></td>
			// 					</tr>
			// 				)
			// 			}else{
			// 				return
			// 			}
							
			// 	})
			// }else{
			rows = awarding.forEach((data, i) => {
				if (data.is_winner === "y"){
					return (
						<tr key={i}>
							<td>{data.vendor_id}</td>
							<td>{data.vendor_name}</td>
							<td style={{textAlign : 'right'}}>{formatNumber(data.total_awal, 2)}</td>
							<td style={{textAlign : 'right'}}>{formatNumber(data.total_akhir, 2)}</td>
							<td className="text-center"><button className="btn btn-white" onClick={(e) => handleDokumenDownload(e,data.vendor_id)}>Dokumen</button></td>
						</tr>
					)
				}
			})
			// }
		} else {
			rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Awarding</PanelHeader>
					{/* {(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) && */}
					<PanelBody >
						{/* {errors.items && <p className="text-danger"> * {errors.items[0]} </p>} */}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>Nomor Vendor</th>
																	<th>Nama Vendor</th>
																	<th>Harga Penawaran</th>
                                                                    <th>Harga Akhir</th>
                                                                    <th>Status</th>
															</tr>
													</thead>
													<tbody>
														{rows}
														{/* <tr>
															<td>12345</td>
															<td>Renovolution</td>
															<td className="text-right">{formatNumber(20000000,2)}</td>
															<td className="text-right">{formatNumber(18000000,2)}</td>
															<td className="text-center"><button className="btn btn-white" onClick={(e) => e.preventDefault()}>Dokumen</button></td>
														</tr> */}
													</tbody>
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

export default withTranslation()(Awarding);