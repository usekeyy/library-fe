import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const DokumenPengadaan = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {attachments} = props.parentState.vendor_registration_tender;
		// const {attachments} = props.parentState.vendor_registration_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		let rows;

		if (attachments.length > 0) {
				rows = attachments.map((dt, i) => {
					const row_attachments = <tr key={i}>
																			<td>{i+1}</td>
																			<td>{dt.type}</td>
																			<td>{dt.description}</td>
																			<td>{<a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` } > <span className="label label-primary">Preview</span></a>}</td>
																	</tr>
						return (parseInt(dt.share) === 0) ? null : row_attachments
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
					<PanelHeader>Dokumen Pengadaan</PanelHeader>
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
																	<th>Tipe Lampiran</th>
																	<th>Description</th>
                                                                    <th>File</th>
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

export default withTranslation()(DokumenPengadaan);