import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';
import { toastr } from 'react-redux-toastr';

const Vendor = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const {header} = props.parentState.tahap_nego;
		const {vendor_selected} = props.parentState.tahap_nego;
		const {vendors} = props.parentState.tahap_nego;
		const {items} = props.parentState.tahap_nego;
		const {tempConfig} = props.parentState.tahap_nego;
		const {list} = props.parentState.tahap_nego.evaluations;
		const {errors} = props.parentState.tahap_nego;
		const {loadings} = props.parentState;
		let rows;
		
		const details = (e, data, type) => {
			e.preventDefault();
			props.toggleOpenDokumenVendor(data.uuid, data, type)
		}

		const detailsNego = (e, data, type) => {
			e.preventDefault();
			if(header.negotiation_uuid !== null){
				props.toggleOpenDokumenVendor(data.uuid, data, type)
			} else {
				toastr.warning("Tidak Ditemukan", "Data Belum Di Nego !");
			}
		}

		let Total_OE = 0;
		
		
		if (items.length > 0) {
			items.forEach((dt, i) => {
				const isServices = dt.service_lines && dt.service_lines.length > 0;
				let total_harga_barang = 0;
				if(!isServices){
					total_harga_barang = parseFloat(dt.valuation_price) * (parseFloat(dt.qty)/parseFloat(dt.per))
				} else {
					total_harga_barang = 0
				}
				Total_OE += total_harga_barang;
					if(isServices){
						dt.service_lines.forEach((line, key) => {
							if(dt.purchasing_requisition_item_id === line.purchasing_requisition_item_id){
								const total_harga_jasa = parseFloat(line.net_value) * (parseFloat(line.qty)/parseFloat(line.per))
								Total_OE += total_harga_jasa;
							}
						})
					}
				})
		}
		
		if (vendors.length > 0) {
			rows = vendors.map((dt, i) => {
				const evaluation_vendor = list && list.filter(i => i.vendor_id === dt.vendor_id)
				
				const total_nilai = parseFloat(evaluation_vendor[0]?.score_teknis)+parseFloat(evaluation_vendor[0]?.score_komersil)
				const nego_value = (dt.nego_valuation_price !== "" && dt.nego_valuation_price !== null && parseFloat(dt.nego_valuation_price) !== 0) ? dt.nego_valuation_price : dt.valuation_price
				const data_temp = (!header.on_process) ? [] : (tempConfig && header.on_process) ? tempConfig?.vendor_list : [];
				const get_vendor = (data_temp && data_temp.length > 0) ? data_temp.filter(i => i.id === dt.vendor_id) : [];
				const is_checked = (!header.on_process) ? vendor_selected.includes(dt.vendor_id) : (get_vendor.length > 0);
						return (
								<tr key={i} style={(dt.auction_peserta_isupdate==='n' && dt.auction_peserta_status==="y") ? {color:'red'} : {}}>
										<td>
											<input disabled={header.on_process} type="checkbox" checked={is_checked} onChange={(event) => props.handleChecklistVendor(event, dt, dt.vendor_id)} />
										</td>
										<td>{dt.vendor_id}</td>
										<td>{dt.vendor_name}</td>
										{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' && <td align="right">{formatNumber(total_nilai, 2)}</td>}
										<td align="right">{formatNumber(Total_OE, 2)}</td>
										<td align="right">{formatNumber((dt.tipe === 'jasa') ? header.total_penawaran : dt.valuation_price, 2)}</td>
										<td align="right">{formatNumber((dt.tipe === 'jasa') ? header.total_nego : nego_value, 2)}</td>
										<td>
											<button type="button" className="btn btn-xs btn-info" onClick={(e) => details(e, dt, 'dokumen-vendor')}><i className="fa fa-file"></i></button>
											{!header.on_process && <button type="button" className="btn btn-xs btn-primary m-l-5" onClick={(e) => detailsNego(e, dt, 'detail-nego')}>Detail</button>}
										</td>
								</tr>
						)
				})
		} else {
			rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>List Peserta</PanelHeader>
					{(loadings.vendors) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.vendors) &&
					<PanelBody >
						{errors.vendors && <p className="text-danger"> * {errors.vendors[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th></th>
																	<th>No Peserta</th>
																	<th>Nama Peserta</th>
																	{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' && <th>Total Nilai</th>}
																	<th>OE</th>
																	<th>Total Penawaran</th>
																	<th>Total Nego</th>
																	<th>Lampiran</th>
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

export default withTranslation()(Vendor);