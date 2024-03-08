import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
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
						<label>{t("assets:label.description")} <span className="text-danger">*</span></label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("assets:label.subnumber")} <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.subnumber || props.errors.subnumber) ? "form-control is-invalid" : "form-control"} name="subnumber" ref={register({ required: true })} defaultValue={props.data.subnumber || ''} />
						{errors.subnumber && <span className="text-danger"> {errors.subnumber.type === "required" ? "Field harus diisi" : ''}  {errors.subnumber.message} </span>}
						{props.errors.subnumber && <span className="text-danger">{props.errors.subnumber[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("assets:label.asset_class")} <span className="text-danger">*</span></label>
						<input className={(errors.asset_class || props.errors.asset_class) ? "form-control is-invalid" : "form-control"} name="asset_class" ref={register({ required: true })} defaultValue={props.data.asset_class || ''} />
						{errors.asset_class && <span className="text-danger"> {errors.asset_class.type === "required" ? "Field harus diisi" : ''}  {errors.asset_class.message} </span>}
						{props.errors.asset_class && <span className="text-danger">{props.errors.asset_class[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("assets:label.account_determination")} <span className="text-danger">*</span></label>
						<input className={(errors.account_determination || props.errors.account_determination) ? "form-control is-invalid" : "form-control"} name="account_determination" ref={register({ required: true })} defaultValue={props.data.account_determination || ''} />
						{errors.account_determination && <span className="text-danger"> {errors.account_determination.type === "required" ? "Field harus diisi" : ''}  {errors.account_determination.message} </span>}
						{props.errors.account_determination && <span className="text-danger">{props.errors.account_determination[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("assets:label.capitalized_on")} <span className="text-danger">*</span></label>
						<input className={(errors.capitalized_on || props.errors.capitalized_on) ? "form-control is-invalid" : "form-control"} name="capitalized_on" ref={register({ required: true })} defaultValue={props.data.capitalized_on || ''} />
						{errors.capitalized_on && <span className="text-danger"> {errors.capitalized_on.type === "required" ? "Field harus diisi" : ''}  {errors.capitalized_on.message} </span>}
						{props.errors.capitalized_on && <span className="text-danger">{props.errors.capitalized_on[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("assets:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("assets:button.update") : t("assets:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);