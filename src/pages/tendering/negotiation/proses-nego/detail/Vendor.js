import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const Vendor = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		// const {items} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		const {vendors} = props.parentState.proses_nego_vendor;
		const {header} = props.parentState.proses_nego_vendor;
		// const {attachments} = props.parentState.proses_nego_vendor;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;
		const approveBAHN = (nego_uuid, vendor_id, vendor_uuid) => {
			// props.saveBuyerNegotiation({action: 'approved', vendor_id: vendor_id})
			props.downloadBAHN(nego_uuid, vendor_id, vendor_uuid);
		}
		let rows;
		const show = (dataTemp.tipe === "2") ? (dataTemp.status === "closed") : true 

		if (vendors.length > 0) {
			rows = vendors.map((dt, i) => {
						return (
								<tr key={i}>
										<td>{dt.id}</td>
										<td>{dt.company_type.name}</td>
										<td>{dt.name}</td>
										<td>
											{ 
												<div className="col-md-12">
													{show && <button disabled={loadings.button} type="button" onClick={(e) => props.toggleDetailItem(dt, dt.id)} className="btn btn-primary btn-xs">Detail </button>} &nbsp;
													{(header.current === props.isRole && dataTemp.tipe === "1" && dataTemp.status === 'nego') && <button disabled={loadings.button} type="button" onClick={() => approveBAHN(dataTemp.uuid, dt.id, dt.uuid)} className="btn btn-primary btn-xs"> Download BAHN </button>} &nbsp;
													{/* {(header.current === props.isRole && dataTemp.tipe === "1" && dataTemp.status === 'nego') && <button disabled={loadings.button} type="button" onClick={() => props.saveBuyerNegotiation({action: 'closed', vendor_id: dt.id})} className="btn btn-primary btn-xs">Approve </button>} &nbsp; */}
													{dataTemp.tipe === "1" && <button disabled={loadings.button} type="button" onClick={() => props.saveBuyerNegotiation({action: 'closed', vendor_id: dt.id})} className="btn btn-primary btn-xs">Approve </button>}
												</div>
											}
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
					<PanelHeader>Vendor</PanelHeader>
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
																	<th>No Vendor</th>
																	<th>Badan Usaha</th>
																	<th>Nama Vendor</th>
																	<th>Action</th>
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