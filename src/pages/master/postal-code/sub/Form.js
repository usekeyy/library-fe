import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();


const Form = (props) => {
	const { t } = props;
	const { register, control, handleSubmit, errors, getValues } = useForm({});
	const onSubmit = async data => {
		props.save({
			id: data.id,
			name: data.name,
			country_id: data.country_id.value,
			sub_district_id : data.sub_district_id.value
		});
		console.log(data)
	};

	let { loadings } = props;

	const onInputChangeSubDistrict = (option, { action }) => {
		let getCountry = getValues("country_id")
		// console.log(getCountry)
		if (action === "input-change" && getCountry !== "") {
			props.getSubDistrict(getValues("country_id"),"inputChange",option)
		}
	};
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
							onChange={([selected]) => {
								props.getSubDistrict(selected, "onChange")
								return selected
							  }}
						/>
						{errors.country_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.country_id && <span className="text-danger">{props.errors.country_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>Sub district <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.sub_districts}
							defaultValue={props.data.sub_district_id}
							inputRef={(e) => register({ name: "sub_district_id", required: true })}
							name="sub_district_id"
							placeholder={loadings.sub_district ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							isLoading={loadings.sub_district}
							rules={{ required: true }}
							onInputChange= {onInputChangeSubDistrict}
							
						/>
						{errors.sub_district && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.sub_district && <span className="text-danger">{props.errors.sub_district[0]}</span>}
					</div>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? t("common:errors.required") : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("postalCode:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? t("common:errors.required") : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
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