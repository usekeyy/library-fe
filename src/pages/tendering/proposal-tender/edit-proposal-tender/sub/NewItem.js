import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';
// import { statusName } from '../../../../../helpers/statusName';


const NewItem = (props) => {
	const { t } = props;
	// const { register } = useFormContext();
	const { header } = props.parentState.proposal_tender;
	const { items } = props.parentState.proposal_tender;
	// const {errors} = props.parentState.proposal_tender;
	const { uuid } = props.parentState;
	const {loadings} = props.parentState;
	let rows;
	console.log(header.status);
	if (items.length > 0) {
		let Total = 0;
		rows = items.map((dt, i) => {
			Total += dt.valuation_price * (dt.qty/dt.per)
			// let check = "";

			return (
				<tr key={i}>
					<td>
						{dt.number_pr}
					</td>
					<td>{dt.item_no}</td>
					<td>{(dt.material_id==="" || dt.material_id===null) ? "" : parseInt(dt.material_id)}</td>
					<td>{dt.short_text}</td>
					<td>{dt.plant_id}</td>
					<td  align="right">{formatNumber(dt.qty,2)}</td>
					<td>{dt.uom}</td>
					<td>{dt.per}</td>				
					<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
					<td align="right">{formatNumber(dt.valuation_price * (dt.qty/dt.per), 2)}</td>
					<td>
						<button className="btn btn-xs btn-lime" onClick={(e) => details(e,i)} value={dt.pr_item_uuid} disabled={loadings.button} ><i className="danger fa fa-eye"></i></button>
					</td>
				</tr>
			)
		})

		rows.push(
			<tr key={items.length + 1}>
				<td align="center" colSpan="9"><b>Total Harga</b></td>
				<td align="right">{formatNumber(Total, 2)}</td>
				<td></td>
			</tr>
		)
	} else {
		rows = (<RowEmpty colSpan='14'>Tidak ada data</RowEmpty>);
	}

	const details = (e, data) => {
		e.preventDefault()
		props.modals(data)
	}

	return (
		<div>
			<Panel>
				<PanelHeader>Item</PanelHeader>
				{loadings.showItems && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
				{!loadings.showItems &&
					<PanelBody >
						{uuid === '' &&
							<div className="row">
								{props.errors.items && <span className="text-danger"> {props.errors.items[0]}  </span>}
								<div className="col-sm-12">
									<div className="pull-right m-t-10 m-b-10">
										<Button color="primary" className="btn btn-sm btn-primary" value='' >{t("company:button.add")}</Button>
									</div>
								</div>
							</div>
						}
						<div className="row">
							<div className="col-sm-12">
								<div className="table-responsive">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>No PR</th>
												<th>Line Item</th>
												<th>No Material</th>
												<th>Description</th>
												<th>Plant</th>
												<th>QTY</th>
												<th>Uom</th>
												<th>Per</th>
												<th align="right">Harga Satuan</th>
												<th align="right">Total Harga</th>
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

export default withTranslation()(NewItem);
