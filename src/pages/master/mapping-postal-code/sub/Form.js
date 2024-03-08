import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();


const Form = (props) => {
	const { t } = props;
	const { register, control, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save({
			required: data.required.value,
			country_id: data.country_id.value,
			length: data.length
		});
		console.log(data)
	};

	let { loadings } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>

					<div className="form-group">
						<label>{t("postalCode:label.country-name")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.countries}
							defaultValue={props.data.country_id}
							inputRef={(e) => register({ name: "country_id", required: true })}
							name="country_id"
							placeholder={loadings.country ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							isLoading={loadings.country}
							rules={{ required: true }}
						/>
						{errors.country_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.country_id && <span className="text-danger">{props.errors.country_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>Required <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={[
								{label : "y - Ya",value: "y"},
								{label : "n - Tidak", value: "n"}
							]}
							defaultValue={props.data.required}
							inputRef={(e) => register({ name: "required", required: true })}
							name="required"
							// placeholder={loadings.required ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							// isLoading={loadings.required}
							rules={{ required: true }}
							
						/>
						{errors.required && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.required && <span className="text-danger">{props.errors.required[0]}</span>}
					</div>
					<div className="form-group">
						<label>Length <span className="text-danger">*</span></label>
						<input type="number" min="0" className={(errors.length || props.errors.length) ? "form-control is-invalid" : "form-control"} name="length" ref={register({ required: true })} defaultValue={props.data.length || ''} />
						{errors.length && <span classlength="text-danger"> {errors.length.type === "required" ? t("common:errors.required") : ''}  {errors.length.message} </span>}
						{props.errors.length && <span className="text-danger">{props.errors.length[0]}</span>}
					</div>
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