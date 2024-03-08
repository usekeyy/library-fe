import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import {formatDate} from '../../../../helpers/formatDate'
import { statusNameDur } from '../../../../helpers/statusName';

const JadwalTender = (props) => {
	const {data,isBuyer,data_header,data_pengajuan_extend} = props;
	console.log(data)
	let rows;
	let quotation_status = false
	// let isAnwijzing = false

	const setStatus = (data) => {
		let mulai = new Date(`${data.start_date} ${data.start_time}`)
		let berhenti = new Date(`${data.end_date} ${data.end_time}`)
		// let sekarang = new Date();
		let sekarang = new Date(localStorage.getItem('times'));

		if (berhenti < sekarang){
			return "Done"
		}else{
			if (mulai > sekarang){
				return "Waiting"
			}else{
				return "Process"
			}
		}

	}

	if (data.length > 0) {
			const now = new Date(localStorage.getItem("times"))
			let date_quotation = new Date(`${data[data.length-1].end_date} ${data[data.length-1].end_time}`)
			if(date_quotation < now && data_header.status_monitoring_abjad === "y"){
				quotation_status = true
			}else if(data_header.status_monitoring_abjad === "x" || data_header.status_monitoring_abjad === "b"){
				 quotation_status = true
			}else if(data_header.awarding_status_text === 'published'){
				quotation_status = true
			}
			rows = data.map((dt, i) => {
					let isAanwijzing = true
					if (dt.jadwal_tender_code === 'JT003'){
						if (dt.start_date === null && dt.end_date === null){
							isAanwijzing = false
						}
					}
					if (isAanwijzing){
						return (
							<tr key={i}>
								<td>{dt?.jadwal_tender_name}</td>
								<td>{formatDate(dt?.start_date)}</td>
								<td>{dt?.start_time}</td>
								<td>{formatDate(dt?.end_date)}</td>
								<td>{dt?.end_time}</td>
								<td>{isAanwijzing && ((data_header.status_monitoring_abjad === "x" || data_header.status_monitoring_abjad === "b" || data_header.bid_comercil === "y") ? "Done" : setStatus(dt))}</td>
								<td>{isAanwijzing && <button className="btn btn-white btn-sm" onClick={(e) => detail(e,dt.uuid,"edit")} disabled={isBuyer ? quotation_status : true}>Edit</button>}</td>
							</tr>
						)
					}else{
						return false
					}
			})
	} else {
		rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
	}

	const detail = (e, pr_item_uuid,action) =>{
		e.preventDefault()
		if(action === "edit"){
			props.modal(pr_item_uuid,"jadwal_tender")
		} else if (action === "extend_jadwal"){
			props.modal(pr_item_uuid,"extend_jadwal")
		}else{
			props.modal(pr_item_uuid,"history_jadwal")
		}
	}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Jadwal Tender</PanelHeader>
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
                                                                <th>Process</th>
                                                                <th>Start Date</th>
                                                                <th>Start Time</th>
                                                                <th>End Date</th>
                                                                <th>End Time</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
															</tr>
													</thead>
													<tbody>
                                                        {rows}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td style={{border : "none"}} colSpan={6}></td>
                                                            <td style={{border : "none"}}>
																<button 
																	className="btn btn-white"
																	onClick={(e) => detail(e,"uuid","history")}>
																History</button>
																{isBuyer && quotation_status && (!(data_pengajuan_extend.length > 0) || data_pengajuan_extend[data_pengajuan_extend.length-1].closing_date === 'y' || data_pengajuan_extend[data_pengajuan_extend.length-1].closing_date === 'r') &&
																<button
																	className="btn btn-success m-l-10"
																	onClick={(e) => detail(e,"uuid","extend_jadwal")}>
																Extend Jadwal</button>}
															</td>
                                                        </tr>
                                                    </tfoot>
											</table>
									</div>

									{/* table pengajuan extend jadwal */}
									{ data_pengajuan_extend && data_pengajuan_extend.length > 0 &&
									<>
										<h5>Pengajuan Extend Jadwal</h5>
										<div className="table-responsive">
												<table className="table table-bordered table-striped table-sm text-nowrap">
														<thead>
																<tr>
																	<th>Process</th>
																	<th>End Date</th>
																	<th>End Time</th>
																	<th>Note</th>
																	<th>Tanggal Pengajuan</th>
																	<th>Status</th>
																</tr>
														</thead>
														<tbody>
															{
																data_pengajuan_extend.map((data,index) => {
																	return (
																		<tr key={index}>
																			<td>{data?.jadwal_tender_name}</td>
																			<td>{formatDate(data?.end_date)}</td>
																			<td>{data?.end_time}</td>
																			<td>{data?.note}</td>
																			<td>{formatDate(data?.created_at,true)}</td>
																			<td>{statusNameDur(data?.closing_date)}</td>
																		</tr>
																	)
																})
															}
														</tbody>
												</table>
										</div>
									</>
									}
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(JadwalTender);