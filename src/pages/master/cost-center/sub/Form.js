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
						<input disabled={props.uuid !== "" ? true : false} className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("costCenter:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
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
						<label>{t("costCenter:label.company_area")} <span className="text-danger">*</span></label>
						<input className={(errors.company_area || props.errors.company_area) ? "form-control is-invalid" : "form-control"} name="company_area" ref={register({ required: true })} defaultValue={props.data.company_area || ''} />
						{errors.company_area && <span className="text-danger"> {errors.company_area.type === "required" ? "Field harus diisi" : ''}  {errors.company_area.message} </span>}
						{props.errors.company_area && <span className="text-danger">{props.errors.company_area[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("costCenter:label.description")} <span className="text-danger">*</span></label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("costCenter:label.valid_from")} <span className="text-danger">*</span></label>
						<input className={(errors.valid_from || props.errors.valid_from) ? "form-control is-invalid" : "form-control"} name="valid_from" ref={register({ required: true })} defaultValue={props.data.valid_from || ''} />
						{errors.valid_from && <span className="text-danger"> {errors.valid_from.type === "required" ? "Field harus diisi" : ''}  {errors.valid_from.message} </span>}
						{props.errors.valid_from && <span className="text-danger">{props.errors.valid_from[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("costCenter:label.valid_to")} <span className="text-danger">*</span></label>
						<input className={(errors.valid_to || props.errors.valid_to) ? "form-control is-invalid" : "form-control"} name="valid_to" ref={register({ required: true })} defaultValue={props.data.valid_to || ''} />
						{errors.valid_to && <span className="text-danger"> {errors.valid_to.type === "required" ? "Field harus diisi" : ''}  {errors.valid_to.message} </span>}
						{props.errors.valid_to && <span className="text-danger">{props.errors.valid_to[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("costCenter:label.category")} <span className="text-danger">*</span></label>
						<input className={(errors.category || props.errors.category) ? "form-control is-invalid" : "form-control"} name="category" ref={register({ required: true })} defaultValue={props.data.category || ''} />
						{errors.category && <span className="text-danger"> {errors.category.type === "required" ? "Field harus diisi" : ''}  {errors.category.message} </span>}
						{props.errors.category && <span className="text-danger">{props.errors.category[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("costCenter:button.update") : t("costCenter:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);