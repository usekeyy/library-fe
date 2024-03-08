import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import {formatNumber} from '../../../../../helpers/formatNumber';

const HasilBidOpening = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {bidOpening} = props.parentState.vendor_registration_tender;
		// const {attachments} = props.parentState.vendor_registration_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		let rows;

		if (bidOpening.length > 0) {
				rows = bidOpening.map((dt, i) => {
						return (
								<tr key={i}>
										<td>{i+1}</td>
										<td>{dt.company_name} {dt.name}</td>
										<td className="text-right">{formatNumber(dt.jumlah, 2)}</td>
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
					<PanelHeader>Hasil Bid Opening</PanelHeader>
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
																	<th>Nama Vendor</th>
																	<th>Nilai</th>
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

export default withTranslation()(HasilBidOpening);