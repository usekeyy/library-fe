import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
// import NumberFormat from 'react-number-format';
import { formatNumber } from '../../../../../helpers/formatNumber';

const animatedComponents = makeAnimated();

const FormDetail = (props) => {
	// const { t } = props;
	const {master} = props.parentState;
	const {errors} = props.parentState;
	const { register, control } = useFormContext();

	const handleChangeTipe = (e) => {
		if(e !== null && e !== undefined){
			if(e.value === "jasa"){ 
				props.showServiceLine(true)
			} else {
				props.showServiceLine(false)
			}
		}
	}

	const onInputChange = (type, option, action) => {
		if (action === "input-change") {
			switch(type) {
				case 'plant':
					props.fetchPlant(option)
					break;
				case 'mrp_controller':
					props.fetchMrpController(option)
					break;
				case 'uom':
					props.fetchUom(option)
					break;
				case 'storage_location':
					props.fetchStorageLocation(option)
					break;
				case 'material_number':
					// code block
					break;
				case 'material_group':
					props.fetchMaterialGroup(option)
					break;
				case 'currency':
					props.fetchCurrencies(option)
					break;
				case 'item_category':
					props.fetchItemCategory(option)
					break;
				case 'account_assignment':
					props.fetchAccAssignmentCategory(option)
					break;
				default:
					// code block
			}
		}
	};


	let rows;
	
	rows = props.parentState.account.map((dt, i) => {
		return (
			<tr key={i}>
				<td>{i + 1}</td>
				<td>{dt.distribution}</td>
				<td align="right">{formatNumber(dt.net_value,2)}</td>
				<td>{dt.gl_account_id}</td>
				{<td>{dt.cost_center_id}</td>}
				{<td>{dt.asset}</td>}
				{<td>{dt.wbs_element}</td>}
				{/* {<td>{dt.wbs_element}</td>} */}
				{/* {<td>{dt.order}</td>} */}
				{/* {<td>{dt.network}</td>} */}
			</tr>
		)
	})
	
	if(rows.length===0){
        rows = (<tr key="1"><td colSpan='8'>Tidak ada data</td></tr>);
	}
	

	let rows_service_line;
	
	rows_service_line = props.parentState.service_line.map((dt, i) => {
		return (
			<tr key={i}>
				<td>{i + 1}</td>
				<td>{ dt.line_number ==="" ? dt.line_number : parseInt(dt.line_number)}</td>
				<td>{ dt.activity_number==="" ? dt.activity_number:parseInt(dt.activity_number)}</td>
				<td>{dt.short_text}</td>
				<td align="right">{formatNumber(dt.qty,2)}</td>
				<td align="right">{formatNumber(dt.per,2)}</td>
				<td>{dt.uom}</td>
				<td align="right">{formatNumber(dt.gross_value,2)}</td>
				<td>{dt.gl_account_id}</td>
				{<td>{dt.cost_center_id}</td>}
				{<td>{dt.asset}</td>}
				{<td>{dt.wbs_element}</td>}
				{/* {<td>{dt.wbs_element}</td>} */}
				{/* {<td>{dt.order}</td>} */}
				{/* {<td>{dt.network}</td>} */}
				
			</tr>
		)
	})
	
	if(rows_service_line.length===0){
        rows_service_line = (<tr key="1"><td colSpan='13'>Tidak ada data</td></tr>);
	}

	return (
		<div>
			<Panel className="margin-bot-false">
				<PanelHeader>Create Item</PanelHeader>
				<PanelBody>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Tipe</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="type_id" 
							options={master.tipe} 
							defaultValue={((props.data.items.tipe !== undefined && props.data.items.tipe!=="") ? {label:  props.data.items.tipe.toUpperCase(), value:props.data.items.tipe } : null)}
							isDisabled={props.disabledForm}
							onChange={([selected]) => {
								handleChangeTipe(selected)
								return selected;
							}}
						/>
						{errors['item.tipe'] && <span className="text-danger"> {errors['item.tipe'][0]} </span>}
					</div>
					<div className="form-group col-md-6">
						<label>Req Tracking Number</label>
						<input type="number" ref={register({})}
                            defaultValue={props.data.items.req_tracking_number}
                            name="req_tracking_number"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{errors['item.req_tracking_number'] && <span className="text-danger"> {errors['item.req_tracking_number'][0]} </span>}
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Item Line</label>
						<input type="text" ref={register({})}
                            defaultValue={props.data.items.item_no}
                            name="item_no"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{errors['item.item_no'] && <span className="text-danger"> {errors['item.item_no'][0]} </span>}
					</div>
					
					<div className="form-group col-md-6">
						<label>requesitioner</label>
						<input type="text" ref={register({})}
                            defaultValue={props.data.items.requesitioner}
                            name="requesitioner"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{errors['item.requesitioner'] && <span className="text-danger"> {errors['item.requesitioner'][0]} </span>}
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Per</label>
						<input type="number" ref={register({})}
                            defaultValue={props.data.items.per}
                            name="per"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{errors['item.per'] && <span className="text-danger"> {errors['item.per'][0]} </span>}
					</div>
					
					<div className="form-group col-md-6">
						<label>Plant </label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="plant_id" 
							onInputChange={(props, {action}) => onInputChange('plant', props, action)}
							options={master.plant} 
							defaultValue={(props.data.items.plant_id !== undefined ? {label:props.data.items.plant_id +" - "+ props.data.items.plant_name, value:props.data.items.plant_id } : null)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.plant_id'] && <span className="text-danger"> {errors['item.plant_id'][0]} </span>}
					</div>
					
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Quantity</label>
						<input type="number" ref={register({})}
                            defaultValue={props.data.items.qty}
                            name="qty"
                            className="form-control"
                            disabled={props.disabledForm}
                        />
						{errors['item.qty'] && <span className="text-danger"> {errors['item.qty'][0]} </span>}
					</div>

					<div className="form-group col-md-6">
						<label>Mrp Cont.</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="mrp_controller_id" 
							options={master.mrp_controller} 
							onInputChange={(props, {action}) => onInputChange('mrp_controller', props, action)}
							defaultValue={((props.data.items.mrp_controllers_code !== undefined && props.data.items.mrp_controllers_code!=="" && props.data.items.mrp_controllers_code!==null) ? {label:props.data.items.mrp_controllers_code +" - "+ props.data.items.mrp_controllers_name, value:props.data.items.mrp_controllers_code } : null)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.mrp_controller_id'] && <span className="text-danger"> {errors['item.mrp_controller_id'][0]} </span>}
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
							options={master.uom} 
							onInputChange={(props, {action}) => onInputChange('uom', props, action)}
							defaultValue={(props.data.items.uom !== undefined ? {label:props.data.items.uom +" - "+ props.data.items.uom_name, value:props.data.items.uom } : null)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.uom'] && <span className="text-danger"> {errors['item.uom'][0]} </span>}
					</div>
					
					<div className="form-group col-md-6">
						<label>Storage Location</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="storage_location" 
							options={master.storage_location} 
							onInputChange={(props, {action}) => onInputChange('storage_location', props, action)}
							defaultValue={((props.data.items.storage_location_id !== undefined && props.data.items.storage_location_id!=="" && props.data.items.storage_location_id!==null) ? {label:props.data.items.storage_location_id +" - "+ props.data.items.storage_location_name, value:props.data.items.storage_location_id } : null)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.storage_location_id'] && <span className="text-danger"> {errors['item.storage_location_id'][0]} </span>}
					</div>
					
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Valuation Price </label>
						{/* <Controller
								name="valuation_price"
								control={control}
								defaultValue={(props.data.items.valuation_price === "" || props.data.items.valuation_price === undefined) ? 0 : props.data.items.valuation_price}
								className="form-control"
								as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
								disabled={props.disabledForm}
						/> */}
						<input type="number" ref={register({})}
								name="valuation_price"
								defaultValue={(props.data.items.valuation_price === "" || props.data.items.valuation_price === undefined) ? 0 : props.data.items.valuation_price}
								className="form-control"
								disabled={props.disabledForm}
						/>
						{errors['item.valuation_price'] && <span className="text-danger"> {errors['item.valuation_price'][0]} </span>}
					</div>
					
					<div className="form-group col-md-6">
						<label>Material Number</label>
						<input type="number" ref={register({})}
								defaultValue={props.data.items.per}
								name="material_number"
								className="form-control"
								disabled={props.disabledForm}
						/>
						{errors['item.material_number'] && <span className="text-danger"> {errors['item.material_number'][0]} </span>}
						{/* <Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="material_number" 
							options={master.material_number} 
							onInputChange={(props, {action}) => onInputChange('material_number', props, action)}
							defaultValue={((props.data.items.material_id !== undefined && props.data.items.material_id!=="") ? {label:parseInt(props.data.items.material_id), value:props.data.items.material_id } : null)}
							isDisabled={props.disabledForm}
						/> */}
					</div>
					
				</div>
				<div className="form-row">
					
					<div className="form-group col-md-6">
						<label>Total Value </label>
						{/* <Controller
								name="total_value"
								control={control}
								defaultValue={(props.data.items.total_price === "" || props.data.items.total_price === undefined) ? 0 : props.data.items.total_price}
								className="form-control"
								as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
								disabled={props.disabledForm}
						/> */}
						<input type="number" ref={register({})}
								name="total_value"
								defaultValue={(props.data.items.total_price === "" || props.data.items.total_price === undefined) ? 0 : props.data.items.total_price}
								className="form-control"
								disabled={props.disabledForm}
						/>
						{errors['item.total_value'] && <span className="text-danger"> {errors['item.total_value'][0]} </span>}
					</div>


					<div className="form-group col-md-6">
						<label>Material Group</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="material_group" 
							options={master.material_group} 
							onInputChange={(props, {action}) => onInputChange('material_group', props, action)}
							defaultValue={(props.data.items.material_group_id !== undefined ? {label:props.data.items.material_group_id +" - "+ props.data.items.material_group_name, value:props.data.items.material_group_id } : null)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.material_group_id'] && <span className="text-danger"> {errors['item.material_group_id'][0]} </span>}
					</div>
					
				</div>
				<div className="form-row">
					<div className="form-group col-md-6">
						<label>Currency</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="currency" 
							options={master.currency} 
							defaultValue={props.data.items.currency}
							onInputChange={(props, {action}) => onInputChange('currency', props, action)}
							isDisabled={props.disabledForm}
						/>
						{errors['item.currency'] && <span className="text-danger"> {errors['item.currency'][0]} </span>}
					</div>

					<div className="form-group col-md-6">
						<label>Item Category</label>
						<Controller
							components={animatedComponents}
							as={Select}
							control={control}
							name="item_category" 
							options={master.item_category} 
							onInputChange={(props, {action}) => onInputChange('item_category', props, action)}
							defaultValue={''}
							isDisabled={props.disabledForm}
						/>
						{errors['item.item_category'] && <span className="text-danger"> {errors['item.item_category'][0]} </span>}
					</div>
				</div>
					<Panel >
						<PanelHeader noButton={true}>
							Short Text
						</PanelHeader>
						<textarea ref={register({})}
						className="form-control m-t-10" name="short_text"
						disabled={props.disabledForm}
						/>
					</Panel>
					<Panel >
						<PanelHeader noButton={true}>
							Long Text
						</PanelHeader>
						<textarea ref={register({})}
						className="form-control m-t-10" name="long_text"
						disabled={props.disabledForm}
						/>
					</Panel>

					<Panel >
						<PanelHeader  noButton={true}>
							Account Assignment
						</PanelHeader>
						<div className="form-group row m-t-10">
								<label className="col-sm-2 col-form-label">Account Assignment</label>
								<div className="col-sm-10">
									<Controller
										components={animatedComponents}
										as={Select}
										control={control}
										name="acc_assignment_category_id" 
										options={master.account_assignment}
										onInputChange={(props, {action}) => onInputChange('account_assignment', props, action)}
										defaultValue={((props.data.items.acc_assignment_category_id !== undefined && props.data.items.acc_assignment_category_id !== null) ? {label:props.data.items.acc_assignment_category_id +" - "+ props.data.items.acc_assignment_category_name, value:props.data.items.acc_assignment_category_id } : null)}
										isDisabled={props.disabledForm}
									/>
									<button type="button" onClick={() => props.toggleOpen('account-assignment')} className="btn btn-sm btn-success m-t-10">Add Account Assignment</button>
								</div>
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
											{<th>Cost Center</th>}
											{<th>Assets</th>}
											{<th>WBS Element</th>}
											{/* {<th>WBS Element</th>} */}
											{/* {<th>Order</th>}
											{<th>Network</th>} */}
										</tr>
									</thead>
									<tbody>{rows}</tbody>
								</table>
							</div>
						</div>
					</Panel>
					{props.parentState.showServiceLine && <Panel >
						<PanelHeader  noButton={true}>
							Service Line
						</PanelHeader>
						<button type="button" onClick={() => props.toggleOpen('service-line')} className="btn btn-sm btn-success m-t-10">Add Service Line</button>
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
											{<th>Cost Center</th>}
											{<th>Assets</th>}
											{<th>WBS Element</th>}
											{/* {<th>WBS Element</th>} */}
											{/* {<th>Order</th>}
											{<th>Network</th>} */}
										</tr>
									</thead>
									<tbody>{rows_service_line}</tbody>
								</table>
							</div>
						</div>
					</Panel>}
					{/* <Panel>
						<div className="form-group">
							<label>Catatan Buyer</label>
							<textarea disabled className="form-control" row="4">
								{props.data.items.catatan_buyer}
							</textarea>
						</div>
					</Panel> */}
				</PanelBody>
		</Panel>
		</div>
	);
}

export default withTranslation()(FormDetail);