import React from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';
import {formatDate} from '../../../../../helpers/formatDate';

const Negotiation = (props) => {
    // const { t } = props;
		const {histories} = props.parentState.proses_nego_vendor;
		// const {data} = props.parentState;
		// const {attachments} = props.parentState.proses_nego_vendor;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;
		const data_nego = Object.entries(histories);
		
		// const sum_count = (total, num) => {
		// 	return total - num;
		// }
		
		let tbodies;
		let length_item = 0;
		if (data_nego.length > 0) {
			const history_index = Object.keys(histories)
			const history_value = Object.values(histories)
			const arr_count = [];
			tbodies = history_value.map((child, index) => {
				const childs = child.sort().reverse();
				const row_desc = childs.sort((a,b) => new Date(a.created_at)-new Date(b.created_at)).reverse().map((item, key) => {
					arr_count.push(key+1)
					const uniqueCount = [...new Set(arr_count)];
					// console.log(uniqueCount);
					length_item = uniqueCount.length;
					const td_width = 300 + (item.vendor_name.length * 2)
						return (
							<td key={key} style={{ minWidth: `${td_width}px` }}>
								<div className="invoice-header">
										<center><address className="m-t-5 m-b-5">{`Nego ${child.length - key}`}</address></center>
										<div className="row">
											<div className="col-md-6">
												<div className="invoice-from">
													<address>
														<br/><strong className="text-inverse">Oleh</strong>
														<br/><strong className="text-inverse">Tanggal</strong>
														<br/><strong className="text-inverse">Harga Satuan</strong>
														<br/><strong className="text-inverse">Harga Negosiasi</strong>
														<br/><strong className="text-inverse">Qty</strong>
														<br/><strong className="text-inverse">Curr</strong>
														<br/><strong className="text-inverse">Delivery Time (Hari)</strong>
													</address>
												</div>
											</div>
											<div className="col-md-6">
												<div className="invoice-to">
													<address>
														<br/>{item.vendor_name}
														<br/>{formatDate(item.created_at, true)}
														<br/>{formatNumber(item.price_after, 2)}
														<br/>{formatNumber(item.price_after*parseInt(item.qty_after), 2)}
														<br/>{item.qty_after}
														<br/>{item.currency}
														<br/>{item.delivery_time}
													</address>
												</div>
											</div>
										</div>
								</div>	
							</td>
						);
				})
				const rowItem = <tr>
													<td>{history_index[index]}</td>
													{row_desc}
												</tr>
				return <tbody key={index}>{rowItem}</tbody>
			})
		} else {
			tbodies = (<tbody><RowEmpty colSpan='12'>Tidak ada data</RowEmpty></tbody>);
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>History Negosiasi</PanelHeader>
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
															<th className="text-center">Item</th>
															<th colSpan={length_item} className="text-center">History</th>
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