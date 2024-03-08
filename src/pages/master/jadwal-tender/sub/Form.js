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
						<label>{t("jadwalTender:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("jadwalTender:label.metode_penyampaian")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_metode_penyampaian}
								defaultValue={props.data.metode_penyampaian_id}
								inputRef={(e) => register({ name: "metode_penyampaian_id", required: false })}
								name="metode_penyampaian_id"
								placeholder={loadings.metode_penyampaian ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.metode_penyampaian}
								rules={{ required: false }}
							/>
							{errors.metode_penyampaian && <span className="text-danger">* This field is required</span>}
							{props.errors.metode_penyampaian && <span className="text-danger">{props.errors.metode_penyampaian[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("jadwalTender:label.order")} <span className="text-danger">*</span></label>
						<input type="number" min="1" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.order || props.errors.order) ? "form-control is-invalid" : "form-control"} name="order" ref={register({ required: true })} defaultValue={props.data.order || ''} />
						{errors.order && <span className="text-danger"> {errors.order.type === "required" ? "Field harus diisi" : ''}  {errors.order.message} </span>}
						{props.errors.order && <span className="text-danger">{props.errors.order[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("jadwalTender:label.code")} <span className="text-danger">*</span></label>
						<input className={(errors.code || props.errors.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: true })} defaultValue={props.data.code || ''} />
						{errors.code && <span className="text-danger"> {errors.code.type === "required" ? "Field harus diisi" : ''}  {errors.code.message} </span>}
						{props.errors.code && <span className="text-danger">{props.errors.code[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("jadwalTender:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorClassification:button.update") : t("vendorClassification:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);