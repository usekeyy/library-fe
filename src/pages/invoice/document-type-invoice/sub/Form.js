import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	let msg = props.errors;
	const onSubmit = async data => {
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{/* <div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div> */}
					<div className="form-group">
						<label >{t("documentType:label.description")} <span className="text-danger">*</span> </label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					{/* <div className="form-group">
						<label >Company ID <span className="text-danger">*</span> </label>
						<input className={(errors.company_id || props.errors.company_id) ? "form-control is-invalid" : "form-control"} name="company_id" ref={register({ required: true })} defaultValue={props.data.company_id || ''} />
						{errors.company_id && <span className="text-danger"> {errors.company_id.type === "required" ? "Field harus diisi" : ''}  {errors.company_id.message} </span>}
						{props.errors.company_id && <span className="text-danger">{props.errors.company_id[0]}</span>}
					</div> */}
					{props.uuid !== "" && 
						<div className="form-group">
							<label>Status <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_status}
									defaultValue={props.data.status}
									inputRef={(e) => register({ name: "status", required: false })}
									name="status"
									placeholder={ t("common:Select.Pilih") }
									isLoading={ false }
									rules={{ required: false }}
								/>
								{errors.status && <span className="text-danger">* This field is required</span>}
								{msg.status && <span className="text-danger">{msg.status[0]}</span>}
							</div>
						</div>
					}

					{/* <div className="form-group">
						<label>Document Category<span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={
									[{
										value : "B",
										label : "B - PR"
									},{
										value : "F",
										label : "F - PO"
									},{
										value : "K",
										label : "K - Kontrak"
									},{
										value : "A",
										label : "A - RFQ"
									},{
										value : "L",
										label : "L - Scheduling Agreement"
									}]
								}
								defaultValue={props.data.doc_cat}
								inputRef={(e) => register({ name: "doc_cat", required: true })}
								name="doc_cat"
								onChange={([selected]) => {
									// handleChangePurchasingOrg(selected)
									return  selected;
								}}
								rules={{ required: true }}
							/>
							{errors.doc_cat && <span className="text-danger">* This field is required</span>}
							{props.errors.doc_cat && <span className="text-danger">{props.errors.doc_cat[0]}</span>}
						</div>
					</div> */}
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("documentType:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("documentType:button.update") : t("documentType:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);