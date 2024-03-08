import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const Evaluation = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		// const {terms} = props.parentState.tahap_nego;
		const {evaluations} = props.parentState.tahap_nego;
		const {header} = props.parentState.tahap_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.tahap_nego;
		const {loadings} = props.parentState;
		let rows;

		if (Object.entries(evaluations).length > 0 && evaluations.list.length > 0) {
			rows = evaluations.list.map((dt, i) => {
						return (
								<tr key={i}>
										<td>{dt.vendor_id}</td>
										<td>{dt.vendor_name}</td>
										{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' && <td>{formatNumber(parseInt(dt.score_teknis))}</td>}
										<td>{dt.evaluasi_teknis}</td>
										{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' && <td>{formatNumber(parseInt(dt.score_komersil))}</td>}
										<td>{dt.evaluasi_komersil}</td>
										{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' && <td>{formatNumber(parseInt(dt.score_komersil)+parseInt(dt.score_teknis))}</td>}
										<td>{dt.evaluasi_admin}</td>
								</tr>
						)
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Hasil Evaluasi</PanelHeader>
					{(loadings.evaluations) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.evaluations) &&
					<PanelBody >
						{errors.evaluations && <p className="text-danger"> * {errors.evaluations[0]} </p>}
						<div className="row">
							<div className={props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' ? "col-sm-9" : "col-sm-12"}>
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>No Peserta</th>
																	<th>Nama Peserta</th>
																	{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' &&<th>Nilai Teknis</th>}
																	<th>Hasil Teknis</th>
																	{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' &&<th>Nilai Komersial</th>}
																	<th>Hasil Komersial</th>
																	{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' &&<th>Total Nilai</th>}
																	<th>Status</th>
															</tr>
													</thead>
													<tbody>{rows}</tbody>
											</table>
									</div>
							</div>
							{props.parentState.proses_nego_vendor.header.metode_evaluasi === 'sistem_nilai' &&
							<div className="col-sm-3">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th><b>Bobot</b></th>
																	<th><b>Nilai</b></th>
															</tr>
													</thead>
													<tbody>
														<tr>
															<td>Bobot Teknis</td>
															<td>{header ? header.bobot_teknis : ''}</td>
														</tr>
														<tr>
															<td>Bobot Komersil</td>
															<td>{header ? header.bobot_komersil : ''}</td>
														</tr>
														<tr>
															<td>Passing Grade Total</td>
															<td>{header ? header.ambang_batas : ''}</td>
														</tr>
													</tbody>
											</table>
									</div>
							</div>
							}
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default withTranslation()(Evaluation);