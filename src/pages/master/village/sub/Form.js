import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();


const Form = (props) => {
	const {t} = props;
	const { register, control, handleSubmit, errors} = useForm({});
	const onSubmit = async data => {
		props.save({
			id: data.id,
			name: data.name,
			sub_district_id: data.sub_district_id.value
		});
		console.log(data)
	};

	const handleChange = (e) => {
		let selected = e.value;
		props.getRegions(selected)
	}

	const handleChangeRegion = (e) =>{
		let selected = e.value;
		props.getDistrict(selected)
	}

	const handleChangeDistrict = (e) =>{
		let selected = e.value;
		props.getSubDistrict(selected)
	}

	let {loadings} = props;
	let {isDisabled} = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{t("villages:label.country-name")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.countries}
							defaultValue={props.data.country_id}
							onChange={([selected]) => {
								handleChange(selected)
								return selected;
							}}
							inputRef={(e) => register({ name: "country_id", required: false })}
							name="country_id"
							placeholder={loadings.country ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
							isLoading={loadings.country}
							rules={{ required: false }}
						/>
						{errors.country_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.country_id && <span className="text-danger">{props.errors.country_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("villages:label.region-name")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							defaultValue={props.data.region_id}
							options={props.regions}
							name="region_id"
							onChange={([selected]) => {
								handleChangeRegion(selected)
								return  selected;
							}}
							inputRef={(e) => register({ name: "region_id", required: false })}
							placeholder={loadings.region ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
							isLoading={loadings.region}
							isDisabled={isDisabled.region}
							rules={{ required: false }}
						/>
						{errors.region_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.region_id && <span className="text-danger">{props.errors.region_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("villages:label.district-name")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.districts}
							name="district_id"
							onChange={([selected]) => {
								handleChangeDistrict(selected)
								return selected
							}}
							defaultValue={props.data.district_id}
							placeholder={loadings.district ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
							isLoading={loadings.district}
							isDisabled={isDisabled.district}
							rules={{ required: false }}
						/>
						{errors.district_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.district_id && <span className="text-danger">{props.errors.district_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("villages:label.sub-district-name")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.subDistricts}
							name="sub_district_id"
							defaultValue={props.data.sub_district_id}
							placeholder={loadings.subDistrict ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
							isLoading={loadings.subDistrict}
							isDisabled={isDisabled.subDistrict}
							rules={{ required: false }}
						/>
						{errors.SUb_district_id && <span className="text-danger">* This field is required</span>}
						{props.errors.Sub_district_id && <span className="text-danger">{props.errors.sub_district_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register()} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? t("common:errors.required"): ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("villages:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? t("common:errors.required"): ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}	
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("district:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ?  t("district:button.update") : t("district:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);