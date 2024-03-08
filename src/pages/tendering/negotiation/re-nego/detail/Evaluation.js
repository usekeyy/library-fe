import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const Evaluation = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const {terms} = props.parentState.re_nego;
		const {header} = props.parentState.re_nego;
		// const {attachments} = props.parentState.re_nego;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.re_nego;
		const {loadings} = props.parentState;
		let rows;

		if (terms.length > 0) {
			rows = terms.map((dt, i) => {
						return (
								<tr key={i}>
										<td>{dt.proposal_tender_id}</td>
										<td>{dt.description}</td>
										<td>{dt.bobot}</td>
										<td>{dt.status}</td>
										<td>{dt.bobot}</td>
										<td>{dt.status}</td>
										<td>{dt.id}</td>
										<td>{dt.status}</td>
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
					{(loadings.terms) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.terms) &&
					<PanelBody >
						{errors.terms && <p className="text-danger"> * {errors.terms[0]} </p>}
						<div className="row">
							<div className="col-sm-9">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>No Peserta</th>
																	<th>Nama Peserta</th>
																	<th>Nilai Teknis</th>
																	<th>Hasil Teknis</th>
																	<th>Nilai Komersial</th>
																	<th>Hasil Komersial</th>
																	<th>Total Nilai</th>
																	<th>Status</th>
															</tr>
													</thead>
													<tbody>{rows}</tbody>
											</table>
									</div>
							</div>
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
															<td>{header.bobot_teknis}</td>
														</tr>
														<tr>
															<td>Pasing Grade Teknis</td>
															<td>{header.grade_teknis}</td>
														</tr>
														<tr>
															<td>Bobot Komersil</td>
															<td>{header.bobot_komersil}</td>
														</tr>
														<tr>
															<td>Passing Grade Total</td>
															<td>{header.grade_total}</td>
														</tr>
													</tbody>
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default withTranslation()(Evaluation);