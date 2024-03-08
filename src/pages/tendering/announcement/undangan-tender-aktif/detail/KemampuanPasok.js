import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
// import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const KemampuanPasok = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {kemampuanPasok} = props.parentState.vendor_registration_tender;
		// const {attachments} = props.parentState.vendor_registration_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		let material_group = [], arrSosHeader = [], arrSosItems = []
		// let rows;
		if (kemampuanPasok !== undefined) {
			// eslint-disable-next-line array-callback-return
			Object.keys(kemampuanPasok).map(function (key, index) {
				material_group.push(kemampuanPasok[key]['material_group'])
				arrSosHeader.push(kemampuanPasok[key]['sos_header'])
				arrSosItems.push(kemampuanPasok[key]['sos_item'])
			});
		}

		arrSosHeader = arrSosHeader.filter((value,index) => arrSosHeader.indexOf(value) === index)
		material_group = material_group.filter((value,index) => material_group.indexOf(value) === index)
    return (
			<div>
				<Panel>
					<PanelHeader>Kemampuan Pasok</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
                                <h6>Source Of Supply</h6>
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm">
												<thead>
													<tr>
														<td>SoS Header Terpilih</td>
														<td width="85%">{arrSosHeader.join('; ')}</td>														
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>SoS Item Terpilih</td>
														<td>{arrSosItems.join('; ')}</td>														
													</tr>
													<tr>
														<td>Material Group</td>
														<td>{material_group.join("; ")}</td>														
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

export default withTranslation()(KemampuanPasok);