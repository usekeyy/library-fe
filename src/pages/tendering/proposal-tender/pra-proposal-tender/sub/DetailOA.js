import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../../helpers/formatNumber';

const DetailOA = (props) => {
	const {data_header, data_oa} = props.data;
	const { t } = props;
	const { register, handleSubmit } = useForm({});

	const onSubmit = async data => {
		props.save(data);
	};
    let rows;

    if (props.data !== undefined) {
		if (data_oa.length > 0) {
			rows = Object.keys(data_oa).map(function (key, index) {
				return (
					<tr key={key}>
						<td>
							<input type="radio" name="oa_selected" ref={register({ required: true })} required value={key} defaultChecked={data_header.no_oa !== undefined ? (data_header.no_oa === data_oa[key]['no_oa'] ? true : false) : false}/>
						</td>
						<td>{data_oa[key]['no_oa']}</td>
						<td>{data_oa[key]['item_oa']}</td>
						<td>{data_oa[key]['vendor_name']}</td>
						<td>{parseInt(data_oa[key]['qty_oa'])}</td>
						<td>{parseInt(data_oa[key]['qty_used'])}</td>
						<td>{parseInt(data_oa[key]['qty_open'])}</td>
						<td>{data_oa[key]['validity_start']}</td>
						<td>{data_oa[key]['validity_end']}</td>
						{/* <td align="right">{formatNumber(data_oa[key]['target_value'], 2)}</td>
						<td align="right">{formatNumber(data_oa[key]['actual_value'], 2)}</td>
						<td align="right">{formatNumber(data_oa[key]['remaining_value'], 2)}</td>
						<td>{data_oa[key]['status']}</td> */}
					</tr>
				)
			});
		}
	}
	
	const toggleClose = (e) => {
		e.preventDefault()
		props.toggleClose()
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<Panel >
						<PanelHeader  noButton={true}>
							Detail OA
						</PanelHeader>
						<div style={{paddingTop: '15px', paddingLeft: '15px', paddingRight: '15px'}}>
							<div className="table-responsive">
								<table className="table table-bordered table-sm text-nowrap">
									<tbody>
										<tr>
											<td style={{width: "1%"}}><b>Material</b></td>
											<td>
												{data_header.material_id !== undefined && data_header.material_id !== null && data_header.material_id !== '' ?
													parseInt(data_header.material_id) + ' - ' + data_header.short_text : ''
												}
											</td>
										</tr>
										<tr>
											<td style={{width: "1%"}}><b>Material Group</b></td>
											<td>{data_header.material_group_id !== undefined && data_header.material_group_id + ' - ' + data_header.material_group_name}</td>
										</tr>
										<tr>
											<td style={{width: "1%"}}><b>Plant</b></td>
											<td>{data_header.plant_id !== undefined && data_header.plant_id + ' - ' + data_header.plant_name}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div style={{paddingLeft: '15px', paddingRight: '15px'}}>
							<div className="form-group">
								<div className="table-responsive m-t-10" >
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th></th>
												<th>No. OA</th>
												<th>Line Item</th>
												<th>Vendor</th>
												<th>Qty OA</th>
												<th>QTY Used</th>
												<th>QTY Open</th>
												<th>Validity Start</th>
												<th>Validity End</th>
												{/* <th>Target Value</th>
												<th>Actual Value</th>
												<th>Remaining Value</th>
												<th>Status</th> */}
											</tr>
										</thead>
										<tbody>{rows}</tbody>
									</table>
								</div>
							</div>
						</div>
					</Panel>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={(e) => toggleClose(e)}>{t("currency:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("currency:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(DetailOA);