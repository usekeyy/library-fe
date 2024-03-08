import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Button } from 'reactstrap';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { statusName } from '../../../../../helpers/statusName';


const Item = (props) => {
	const { t } = props;
	// const { register } = useFormContext();
	const { header } = props.parentState.purchasing_requisition;
	const { items } = props.parentState.purchasing_requisition;
	// const {errors} = props.parentState.purchasing_requisition;
	const { uuid } = props.parentState;
	const { loading } = props.parentState.purchasing_requisition;
	let rows;
	console.log(header.status);
	if (items.length > 0) {
		let Total = 0;
		rows = items.map((dt, i) => {
			Total += dt.valuation_price * (dt.qty/dt.per)
			let check = "";
			if (props.parentProps.user.has_roles.includes("PRPLNR") && dt.status==="o"){
				check = <input type="checkbox" checked={props.parentState.purchasing_requisition.items_selected.includes(dt.uuid)} onChange={(event) => handleChecklist(dt.uuid)} value={dt.uuid} disabled={dt.status !== 'o'} />
			}else if (props.parentProps.user.has_roles.includes("KBGPNG") && dt.status==="p") {
				check = <input type="checkbox" checked={props.parentState.purchasing_requisition.items_selected.includes(dt.uuid)} onChange={(event) => handleChecklist(dt.uuid)} value={dt.uuid} disabled={dt.status !== 'o'} />
			}else if( !props.parentProps.user.has_roles.includes("KBGPNG") &&  (dt.status==="p" || dt.status==="s") ){
				check =<input type="checkbox" checked disabled/> ;
			}

			return (
				<tr key={i}>
					<td>
						{check}
					</td>
					<td>{dt.item_no}</td>
					<td>{(dt.material_id==="" || dt.material_id===null) ? "-" : parseInt(dt.material_id)}</td>
					<td>{dt.short_text}</td>
					<td>{(dt.outline_agreement==="" || dt.outline_agreement===null) ? "-" : dt.outline_agreement + "-" + formatNumber(dt.princ_agreement_item)}</td>
					<td>{dt.plant_id}</td>
					<td>{dt.acc_assignment_category_id}</td>
					<td>{dt.symbol}</td>
					<td  align="right">{formatNumber(dt.qty,2)}</td>
					<td>{dt.uom}</td>
					<td>{dt.per}</td>				
					<td align="right">{formatNumber(dt.valuation_price, 2)}</td>
					<td align="right">{formatNumber(dt.valuation_price * (dt.qty/dt.per), 2)}</td>
					<td>{statusName(dt.status)}</td>	
					<td>{dt.status_review}</td>	
					<td>
						{/* {props.user.roles[0].id !==23 && props.user.roles[0].id!==24 && <button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteItems(dt.no, e)} value={dt.no} ><i className="danger fa fa-trash"></i></button>}*/}
						{<button className="btn btn-xs btn-lime" onClick={(e) => details(e,i)} value={dt.no} ><i className="danger fa fa-eye"></i></button>}
						{dt.status_review==='H Review Harga' && <button className="btn btn-xs btn-warning" onClick={(e) => details(e,i, true)} value={dt.no} ><i className="warning fa fa-edit"></i></button>}
					</td>
				</tr>
			)
		})

		rows.push(
			<tr key={items.length + 1}>
				<td colSpan="12">Total Harga</td>
				<td  align="right">{formatNumber(Total, 2)}</td>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		)
	} else {
		rows = (<RowEmpty colSpan='16'>Tidak ada data</RowEmpty>);
	}

	const details = (e, data,isEdit=false) => {
		console.log(isEdit)
		props.modals(data, isEdit )
        e.preventDefault()
	}
	
	const handleChecklist = (uuid) => {
		props.handlerCheckList(uuid)
	}

	

	return (
		<div>
			<Panel>
				<PanelHeader>Item</PanelHeader>
				{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
				{!loading &&
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
												<th><input type="checkbox" onChange={() => props.handleChecklistAll()} disabled={header.status !== 'o'} /></th>
												<th>No</th>
												<th>No Material</th>
												<th>Description</th>
												<th>Outl. Aggrement</th>
												<th>Plant</th>
												<th>A</th>
												<th>I</th>
												<th>QTY</th>
												<th>Uom</th>
												<th>Per</th>
												<th align="right">Harga Satuan</th>
												<th>Total</th>
												<th>Status</th>
												<th>Review Buyer</th>
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

export default withTranslation()(Item);
