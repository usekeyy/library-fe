import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../../helpers/formatNumber';
import Detail from './Detail'

const HasilEvaluasi = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const {hasilEvaluasi} = props.parentState.vendor_registration_tender;
		const {uuid} = props.parentState.vendor_registration_tender.header;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;

		let rows = false
		if (hasilEvaluasi.length > 0){
			if (hasilEvaluasi[0].evaluasi_admin === null || hasilEvaluasi[0].evaluasi_admin === "null"){
				rows = <RowEmpty colSpan='15'>Tidak ada data</RowEmpty>
			}
		}	

		const [modalOpen,setModalOpen] = React.useState(false)
		const [typeEvaluasi,setTypeEvaluasi] = React.useState('admin')

		const detail_evaluasi = (e,typeEvaluasi) => {
			e.preventDefault()
			setTypeEvaluasi(typeEvaluasi)
			setModalOpen(true)
		}

		const toggleFormClose = () => {
			console.log("close")
			setModalOpen(false)
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Hasil Evaluasi</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>No</th>
																	<th>Evaluasi</th>
																	<th>Status</th>
                                                                    <th>Action</th>
															</tr>
													</thead>
													{!rows ?
													<tbody>
														<tr>
															<td>1</td>
															<td>Evaluasi Admin</td>
															<td>{hasilEvaluasi[0]?.evaluasi_admin}</td>
															<td  className="text-center">
																<button onClick={(e) => detail_evaluasi(e, "admin")} className="btn btn-white">Detail</button>
															</td>
														</tr>
														<tr>
															<td>2</td>
															<td>Evaluasi Teknis</td>
															<td>{hasilEvaluasi[0]?.evaluasi_teknis}</td>
															<td className="text-center">
																<button onClick={(e) => detail_evaluasi(e, "teknis")} className="btn btn-white">Detail</button>
															</td>
														</tr>
														<tr>
															<td>3</td>
															<td>Evaluasi Commercial</td>
															<td>{hasilEvaluasi[0]?.evaluasi_komersil}</td>
															<td className="text-center">
																<button onClick={(e) => detail_evaluasi(e, "komersil")} className="btn btn-white">Detail</button>
															</td>
														</tr>
													</tbody> : <tbody>{rows}</tbody>}
													 {/* <RowEmpty colSpan='15'>Tidak ada data</RowEmpty> */}
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
				{modalOpen && 
				<Detail 
					toggleAdd={modalOpen}
					toggleClose={() => toggleFormClose()}
					uuid = {uuid}
					typeEvaluasi = {typeEvaluasi}
				/>}
			</div>
    );
}

export default withTranslation()(HasilEvaluasi);