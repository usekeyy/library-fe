import React from 'react';
// import {useHistory} from 'react-router-dom'
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../helpers/formatNumber';
// import { statusName } from '../../../../helpers/statusName';
import VendorTable from './VendorTable';

const Vendor = (props) => {
	// const history = useHistory()
		// const {data_sos,data_vendor,check_vendor,download} = props
		const {data_sos,uuid,status_dur,loadings,check_vendor,download} = props
		// let rows;
		// if (data_vendor.length > 0){
		// 	rows = data_vendor.map((dt,i) => {
		// 		return (
		// 		<tr key={i}>
		// 			<td>{i+1}</td>
		// 			<td>{dt.vendor_id}</td>
		// 			<td>{dt.company_name}</td>
		// 			<td>{dt.vendor_name}</td>
		// 			<td>{dt.score_vpr}</td>
		// 			<td>
		// 				<div
        //                     style={{
        //                         width: '100%',
        //                         height: '100%',
        //                         backgroundColor: dt.color,

        //                     }}
                            
        //                 > &nbsp; </div>
		// 			</td>
		// 			<td>{statusName(dt.vendor_status)}</td>
		// 			<td>{dt.po_outstanding}</td>
		// 			<td>
		// 				{dt.expired_document ? 
		// 					<button className="btn btn-white btn-xs" onClick={(e)=>detail(e,dt.uuid)}>
		// 						Detail &nbsp;
		// 								<label className="text-danger">
		// 									({dt.expired_document})
		// 								</label> 
		// 					</button> : ''}
		// 			</td>	
		// 		</tr>
		// 		)
		// 	})
		// }else{
		// 	rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
		// }

		// const detail = (e, uuid) => {
		// 	e.preventDefault()
		// 	history.push('/vendor/dokumen-expired/'+uuid)
		// 	// props.modal(pr_item_uuid,"vendor")
		// }

		const detailPOOutstanding = (e, data) => {
			e.preventDefault()
			// history.push('/vendor/dokumen-expired/'+uuid)
			props.modal(data,"vendor")
		}
    return (
			<div>
				<Panel>
					<PanelHeader>Vendor</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
                                <h6>Source Of Supply</h6>
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-wrap">
												<thead>
													<tr>
														<td>SoS Header Terpilih</td>
														<td>{data_sos?.header}</td>														
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>SoS Item Terpilih</td>
														<td>{data_sos?.item}</td>														
													</tr>
													<tr>
														<td>Material Group</td>
														<td>{data_sos?.material_group}</td>														
													</tr>
												</tbody>
											</table>
									</div>
									{/* {check_vendor.length > 0 &&  */}
									<VendorTable 
										uuid = {uuid} 
										checkCheckbox = {props.checkCheckbox} 
										check_vendor = {check_vendor} 
										status_dur = {status_dur} 
										download = {download}
										loadings = {loadings}
										modalPOOutstanding = {detailPOOutstanding}
									/>
									{/* } */}
									{/* {check_vendor &&
                                    <div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
												<thead>
													<tr>
														<th>No</th>
														<th>Nomor Vendor</th>
                                                        <th>Badan Usaha</th>
                                                        <th>Nama Vendor</th>
                                                        <th>Score VPR</th>
                                                        <th>Kategori</th>
                                                        <th>Status</th>
                                                        <th>PO</th>
                                                        <th>Expired Document</th>														
													</tr>
												</thead>
												<tbody>
													{rows}
												</tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan={9} style={{border: "none"}}>
                                                            <button className="btn btn-white" onClick={() => download()}>Print</button>
                                                        </td>
                                                    </tr>
                                                </tfoot>
											</table>
									</div>
									}		 */}
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(Vendor);