import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { formatNumber } from '../../../../../helpers/formatNumber';


const animatedComponents = makeAnimated();

const FormDetail = (props) => {
	const { t } = props;
	const { control, handleSubmit } = useForm({});
	const onSubmit = async data => {
		// props.save(data);
	};

	let rows;
	
	rows = props.data.account_assignment.map((dt, i) => {
		return (
			<tr key={i}>
				<td>{i + 1}</td>
				<td>{dt.distribution}</td>
				<td style={{textAlign : 'right'}}>{formatNumber(dt.net_value,2)}</td>
				<td>{dt.gl_account_id}</td>
				{props.data.items.acc_assignment_category_id==="K" &&<td>{dt.cost_center_id}</td>}
				{props.data.items.acc_assignment_category_id==="A" &&<td>{dt.asset}</td>}
				{props.data.items.acc_assignment_category_id==="P" &&<td>{dt.wbs_element}</td>}
				{props.data.items.acc_assignment_category_id==="Q" &&<td>{dt.wbs_element}</td>}
				{props.data.items.acc_assignment_category_id==="F" &&<td>{dt.order}</td>}
				{props.data.items.acc_assignment_category_id==="N" &&<td>{dt.network}</td>}
			</tr>
		)
	})
	
	if(rows.length===0){
        rows = (<tr key="1"><td colSpan='5'>Tidak ada data</td></tr>);
	}
	

	let rows_service_line;
	
	rows_service_line = props.data.serviceline.map((dt, i) => {
		return (
			<tr key={i}>
				<td>{i + 1}</td>
				<td>{ dt.line_number ==="" ? dt.line_number : parseInt(dt.line_number)}</td>
				<td>{ dt.activity_number==="" ? dt.activity_number:parseInt(dt.activity_number)}</td>
				<td>{dt.short_text}</td>
				<td style={{textAlign : 'right'}}>{formatNumber(dt.qty,2)}</td>
				<td style={{textAlign : 'right'}}>{formatNumber(dt.per,2)}</td>
				<td>{dt.uom}</td>
				<td style={{textAlign : 'right'}}>{formatNumber(dt.gross_value,2)}</td>
				<td>{dt.gl_account_id}</td>
				{props.data.items.acc_assignment_category_id==="K" &&<td>{dt.cost_center_id}</td>}
				{props.data.items.acc_assignment_category_id==="A" &&<td>{dt.asset}</td>}
				{props.data.items.acc_assignment_category_id==="P" &&<td>{dt.wbs_element}</td>}
				{props.data.items.acc_assignment_category_id==="Q" &&<td>{dt.wbs_element}</td>}
				{props.data.items.acc_assignment_category_id==="F" &&<td>{dt.order}</td>}
				{props.data.items.acc_assignment_category_id==="N" &&<td>{dt.network}</td>}
				
			</tr>
		)
	})
	
	if(rows_service_line.length===0){
        rows_service_line = (<tr key="1"><td colSpan='10'>Tidak ada data</td></tr>);
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Tipe</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="type_id" 
							defaultValue={((props.data.items.tipe !== undefined && props.data.items.tipe!=="") ? {label:  props.data.items.tipe.toUpperCase(), value:props.data.items.tipe } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					<div className="form-group col-md-6">
						<label>Req Tracking Number</label>
						<input type="text"
                            defaultValue={props.data.items.req_tracking_number}
                            name="req_tracking_number"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Item Line</label>
						<input type="text"
                            defaultValue={props.data.items.item_no}
                            name="item_no"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>
					
					<div className="form-group col-md-6">
						<label>Requisitioner</label>
						<input type="text"
                            defaultValue={props.data.items.requisitioner}
                            name="requisitioner"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Per</label>
						<input type="number"
                            defaultValue={props.data.items.per}
                            name="qty"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>
					
					<div className="form-group col-md-6">
						<label>Plant </label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="plant_id" 
							defaultValue={(props.data.items.plant_id !== undefined ? {label:props.data.items.plant_id +" - "+ props.data.items.plant_name, value:props.data.items.plant_id } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Quantity</label>
						<input type="number"
                            defaultValue={props.data.items.qty}
                            name="qty"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>

					<div className="form-group col-md-6">
						<label>Mrp Cont.</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="mrp_controller_id" 
							defaultValue={((props.data.items.mrp_controllers_code !== undefined && props.data.items.mrp_controllers_code!=="" && props.data.items.mrp_controllers_code!==null) ? {label:props.data.items.mrp_controllers_code +" - "+ props.data.items.mrp_controllers_name, value:props.data.items.mrp_controllers_code } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
				</div>
				<div className="form-row">

					<div className="form-group col-md-6">
						<label>Unit Of Measure</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="uom_id" 
							defaultValue={(props.data.items.uom !== undefined ? {label:props.data.items.uom +" - "+ props.data.items.uom_name, value:props.data.items.uom } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
					<div className="form-group col-md-6">
						<label>Storage Location</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="mrp_controller_id" 
							defaultValue={((props.data.items.storage_location_id !== undefined && props.data.items.storage_location_id!=="" && props.data.items.storage_location_id!==null) ? {label:props.data.items.storage_location_id +" - "+ props.data.items.storage_location_name, value:props.data.items.storage_location_id } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Valuation Price </label>
						<Controller
                            name="unit_price"
                            control={control}
                            defaultValue={(props.data.items.valuation_price === "" || props.data.items.valuation_price === undefined) ? 0 : props.data.items.valuation_price}
                            className="form-control"
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            disabled={props.disabledForm}
                        />
					</div>
					
					<div className="form-group col-md-6">
						<label>Material Number</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="material_group_id" 
							defaultValue={((props.data.items.material_id !== undefined && props.data.items.material_id!=="") ? {label:parseInt(props.data.items.material_id), value:props.data.items.material_id } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
				</div>
				<div className="form-row">
					
					<div className="form-group col-md-6">
						<label>Total Value </label>
						<Controller
                            name="unit_price"
                            control={control}
                            defaultValue={(props.data.items.total_price === "" || props.data.items.total_price === undefined) ? 0 : props.data.items.total_price}
                            className="form-control"
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            disabled={props.disabledForm}
                        />
					</div>


					<div className="form-group col-md-6">
						<label>Material Group</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="material_group_id" 
							defaultValue={(props.data.items.material_group_id !== undefined ? {label:props.data.items.material_group_id +" - "+ props.data.items.material_group_name, value:props.data.items.material_group_id } : null)}
							isDisabled={props.disabledForm}
						/>
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Currency</label>
						<input type="text"
                            defaultValue={props.data.items.currency}
                            name="currency"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>

					<div className="form-group col-md-6">
						<label>Item Category</label>
						<input type="text"
                            defaultValue={props.data.items.item_category +" - " + props.data.items.item_category_name}
                            name="item_category"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
					</div>
				</div>
					<Panel >
						<PanelHeader noButton={true}>
							Short Text
						</PanelHeader>
						{/* <PanelBody> */}
						<input type="text"
                            defaultValue={props.data.items.short_text}
                            name="short_text"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{/* </PanelBody> */}
					</Panel>

					<Panel >
						<PanelHeader noButton={true}>
							Long Text
						</PanelHeader>
						{/* <textarea
						className="form-control"
						disabled={props.disabledForm}
						/> */}
						<ul className="m-t-5">
							{
								props.data.item_potext.map((dt, i) => {
									return <li key={i}>{dt.line}</li>
								})
							}
						</ul>
					</Panel>

					<Panel >
						<PanelHeader  noButton={true}>
							Account Assignment
						</PanelHeader>
						
						<div className="form-group">
							{/* <label>Account Assignment </label> */}
							<Controller
								components={animatedComponents}
								as={Select}
								control={control}
								name="acc_assignment_category_id" 
								defaultValue={((props.data.items.acc_assignment_category_id !== undefined && props.data.items.acc_assignment_category_id !== null)? {label:props.data.items.acc_assignment_category_id +" - "+ props.data.items.acc_assignment_category_name, value:props.data.items.acc_assignment_category_id } : null)}
								isDisabled={props.disabledForm}
							/>
						</div>

						<div className="form-group">
							<div className="table-responsive m-t-10">
								<table className="table table-bordered table-striped table-sm">
									<thead>
										<tr>
											<th>No</th>
											<th>Distribution</th>
											<th>Net Value</th>
											<th>Gl Account</th>
											{props.data.items.acc_assignment_category_id==="K" &&<th>Cost Center</th>}
											{props.data.items.acc_assignment_category_id==="A" &&<th>Assets</th>}
											{props.data.items.acc_assignment_category_id==="P" &&<th>WBS Element</th>}
											{props.data.items.acc_assignment_category_id==="Q" &&<th>WBS Element</th>}
											{props.data.items.acc_assignment_category_id==="F" &&<th>Order</th>}
											{props.data.items.acc_assignment_category_id==="N" &&<th>Network</th>}
										</tr>
									</thead>
									<tbody>{rows}</tbody>
								</table>
							</div>
						</div>
					</Panel>
					<Panel >
						<PanelHeader  noButton={true}>
							Service Line
						</PanelHeader>

						<div className="form-group">
							<div className="table-responsive m-t-10" >
								<table className="table table-bordered table-striped table-sm">
									<thead>
										<tr>
											<th>No</th>
											<th>Line Number</th>
											<th>Activity Number</th>
											<th>Short Text</th>
											<th>QTY</th>
											<th>PER</th>
											<th>UOM</th>
											<th>GROSS VALUE</th>
											<th>GL_ACCOUNT</th>
											{props.data.items.acc_assignment_category_id==="K" &&<th>Cost Center</th>}
											{props.data.items.acc_assignment_category_id==="A" &&<th>Assets</th>}
											{props.data.items.acc_assignment_category_id==="P" &&<th>WBS Element</th>}
											{props.data.items.acc_assignment_category_id==="Q" &&<th>WBS Element</th>}
											{props.data.items.acc_assignment_category_id==="F" &&<th>Order</th>}
											{props.data.items.acc_assignment_category_id==="N" &&<th>Network</th>}
										</tr>
									</thead>
									<tbody>{rows_service_line}</tbody>
								</table>
							</div>
						</div>
					</Panel>
					<Panel>
						<div className="form-group">
							<label>Catatan Buyer</label>
							<textarea disabled className="form-control" row="4">
								{props.data.items.catatan_buyer}
							</textarea>
						</div>
					</Panel>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("currency:button.close")}</button>
					{/* <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("currency:button.update") : t("currency:button.submit")}</button> */}
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(FormDetail);