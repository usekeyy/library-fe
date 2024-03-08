import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const { t } = props;
	let {loadings} = props;
	let msg = props.errors;
	const { control, register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("company:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_company}
								defaultValue={props.data.company_id}
								inputRef={(e) => register({ name: "company_id", required: false })}
								name="company_id"
								placeholder={loadings.company ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.company}
								rules={{ required: false }}
							/>
							{errors.company && <span className="text-danger">* This field is required</span>}
							{msg.company && <span className="text-danger">{msg.company[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("wbsProject:label.wbs_element")} <span className="text-danger">*</span></label>
						<input className={(errors.wbs_element || props.errors.wbs_element) ? "form-control is-invalid" : "form-control"} name="wbs_element" ref={register({ required: true })} defaultValue={props.data.wbs_element || ''} />
						{errors.wbs_element && <span className="text-danger"> {errors.wbs_element.type === "required" ? "Field harus diisi" : ''}  {errors.wbs_element.message} </span>}
						{props.errors.wbs_element && <span className="text-danger">{props.errors.wbs_element[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("wbsProject:label.description")} <span className="text-danger">*</span></label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("wbsProject:label.object_number")} <span className="text-danger">*</span></label>
						<input className={(errors.object_number || props.errors.object_number) ? "form-control is-invalid" : "form-control"} name="object_number" ref={register({ required: true })} defaultValue={props.data.object_number || ''} />
						{errors.object_number && <span className="text-danger"> {errors.object_number.type === "required" ? "Field harus diisi" : ''}  {errors.object_number.message} </span>}
						{props.errors.object_number && <span className="text-danger">{props.errors.object_number[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("wbsProject:label.project_type")} <span className="text-danger">*</span></label>
						<input className={(errors.project_type || props.errors.project_type) ? "form-control is-invalid" : "form-control"} name="project_type" ref={register({ required: true })} defaultValue={props.data.project_type || ''} />
						{errors.project_type && <span className="text-danger"> {errors.project_type.type === "required" ? "Field harus diisi" : ''}  {errors.project_type.message} </span>}
						{props.errors.project_type && <span className="text-danger">{props.errors.project_type[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("wbsProject:label.level")} <span className="text-danger">*</span></label>
						<input className={(errors.level || props.errors.level) ? "form-control is-invalid" : "form-control"} name="level" ref={register({ required: true })} defaultValue={props.data.level || ''} />
						{errors.level && <span className="text-danger"> {errors.level.type === "required" ? "Field harus diisi" : ''}  {errors.level.message} </span>}
						{props.errors.level && <span className="text-danger">{props.errors.level[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("wbsProject:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("wbsProject:button.update") : t("wbsProject:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);