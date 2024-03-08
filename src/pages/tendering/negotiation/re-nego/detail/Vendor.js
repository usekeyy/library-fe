import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Vendor = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const {items} = props.parentState.re_nego;
		const {vendor_selected} = props.parentState.re_nego;
		const {vendors} = props.parentState.re_nego;
		// const {attachments} = props.parentState.re_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.re_nego;
		const {loadings} = props.parentState;
		let rows;
		// console.log(vendor_selected);
		const details = (e, data, type) => {
			e.preventDefault();
			props.toggleOpenDokumenVendor(data.uuid, data, type)
		}

		if (vendors.length > 0) {
			rows = vendors.map((dt, i) => {
						return (
								<tr key={i}>
										<td>
											<input type="checkbox" checked={vendor_selected.includes(dt.vendor_id)} onChange={(event) => props.handleChecklistVendor(event, dt, dt.vendor_id)} />
										</td>
										<td>{dt.vendor_id}</td>
										<td>{dt.vendor_name}</td>
										<td>{formatNumber(dt.valuation_price, 2)}</td>
										<td>{formatNumber(dt.valuation_price, 2)}</td>
										<td>{formatNumber(dt.valuation_price, 2)}</td>
										<td>{formatNumber(dt.valuation_price, 2)}</td>
										<td>{dt.quote}</td>
										<td><button type="button" className="btn btn-xs btn-info" onClick={(e) => details(e, dt, 'dokumen-vendor')}><i className="fa fa-file"></i></button></td>
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
																	<th>Total Nilai</th>
																	<th>OE</th>
																	<th>Total Penawaran</th>
																	<th>Total Nego</th>
																	<th>Quote</th>
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