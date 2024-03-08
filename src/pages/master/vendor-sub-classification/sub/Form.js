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
						<label>{t("vendorSubClassification:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("vendorClassification:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_vendor_classification}
								defaultValue={props.data.vendor_classification_id}
								inputRef={(e) => register({ name: "vendor_classification_id", required: false })}
								name="vendor_classification_id"
								placeholder={loadings.vendor_classification ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.vendor_classification}
								rules={{ required: false }}
							/>
							{errors.vendor_classification && <span className="text-danger">* This field is required</span>}
							{msg.vendor_classification && <span className="text-danger">{msg.vendor_classification[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("vendorSubClassification:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorClassification:button.update") : t("vendorClassification:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);