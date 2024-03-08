import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import ReactLoading from "react-loading";
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';

const animatedComponents = makeAnimated();
// let dataCheckbox = []

const Form = (props) => {
	// const handleCheckBox = (e,uuid) => {
	// 	// e.preventDefault()
	// 	if(dataCheckbox.length == 0){
	// 		dataCheckbox = [
	// 			{
	// 				uuid : uuid,
	// 				share : e.target.checked ? "1" : "0"
	// 			}
	// 		]
	// 	}else{
	// 		if (dataCheckbox.some(dt => dt.uuid === uuid)){
	// 			dataCheckbox = dataCheckbox.map((data,i)=>{
	// 				if(data.uuid === uuid){
	// 					return {
	// 						uuid : uuid,
	// 						share : e.target.checked
	// 					}
	// 				}else{
	// 					return data
	// 				}
	// 			})
	// 		}else{
	// 			dataCheckbox.push({uuid : uuid, share: e.target.checked? "1": "0"})
	// 		}
			
	// 	}
		
	// }

	
	
	const { t } = props;
	const { register, control, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save({
			pr_item_id : data.pr_number_item,
			uuid: data.pr_number.value
		});
		console.log(data)
	};

	let { loadings } = props;

	const {detail_pr} = props;
	console.log(detail_pr)
	let rows = ''
	if (detail_pr.length > 0){
		console.log(detail_pr)
		rows = detail_pr.map((dt,i) => {
			return (
				<tr key={i}>
					<td><input type="radio" name="pr_number_item" ref={register({ required: true })} value={dt.id} defaultChecked={dt.id === props.data.detail_pr}/></td>
					<td>{dt.item_no}</td>
					<td>{dt.material_id}</td>
					<td>{dt.short_text}</td>
					<td>{dt.mrsr_number}</td>
				</tr>
			)
		})
	}else{
		rows = (<RowEmpty colSpan='9'>Silahkan Pilih No Purchase Requisition Terlebih Dahulu</RowEmpty>);
	}
	
	const onInputChangePr = (option, { action }) => {
		if (action === "input-change") {
			// () => props.getPR(option)
		}
		
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>

					<div className="form-group">
						<label><b>No Purchase Requisition</b></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.pr_number}
							defaultValue={props.data.pr_number}
							inputRef={(e) => register({ name: "pr_number", required: true })}
							name="pr_number"
							placeholder={loadings.pr_number ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							isLoading={loadings.pr_number}
							rules={{ required: true }}
							onInputChange={onInputChangePr}
							onChange={([selected]) => {
								props.getDetailPR(selected)
								return selected
							  }}
							
						/>
						{errors.pr_number && <span className="text-danger">{t("common:errors.required")}</span>}
						{/* {props.errors.pr_number && <span className="text-danger">{props.errors.pr_number[0]}</span>} */}
					</div>
					<br/>
					<Panel>
						<PanelHeader>Detail Item</PanelHeader>
						<PanelBody >
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																<th></th>
																<th>Line Item</th>
																<th>No Material</th>
																<th>Description</th>
																<th>No MSR</th>
															</tr>
													</thead>
													<tbody>
														{props.loadings.detail_pr ? 
														<tr>
															<td colSpan="6" align="center">
																<ReactLoading type="cylon" color="#0f9e3e" />
															</td>
														</tr>
														: rows}
														{errors.pr_number_item && <span className="text-danger">{errors.pr_number_item.type === "required" ? t("common:errors.required") : ''}  {errors.pr_number_item.message}</span>}
														{/* {props.errors.pr_number_item && <span className="text-danger">{props.errors.pr_number_item[0]}</span>} */}
												</tbody>
											</table>
									</div>
							</div>
						</PanelBody>
					</Panel>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("postalCode:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("postalCode:button.update") : t("postalCode:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);