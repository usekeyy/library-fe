import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();


const Form = (props) => {
	const {t} = props;
	const { register, control, handleSubmit, errors, setValue, watch, reset, getValues } = useForm({});
	const selectValue = watch("country_id", props.data.country_id);
	const onSubmit = async data => {
		props.save(data);
		console.log(data)
	};
	
	React.useEffect(() => {
		register({ name: "country_id" });
	}, [register]);

	const handleChange = (e) => {
		let value = e[0].value;
		reset(
			{...getValues(), region_id: '' }
		)
		setValue("country_id", e[0]);
		setValue("country", e[0]);
		props.getRegions(value)
	}

	let {loadings} = props;
	let {isDisabled} = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register(
							{
								required: true,
								minLength: {
									value: 4,
									message: "Password must have at least 4 characters"
								},
								maxLength: {
									value: 4,
									message: "Password must have at least 4 characters"
								}
							}
						)} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("district:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}	
					</div>
					<div className="form-group">
						<label>{t("district:label.country")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.countries}
							defaultValue={selectValue}
							// value={selectValue}
							onChange={handleChange}
							inputRef={(e) => register({ name: "country_id", required: false })}
							name="country_id"
							rules={{ required: false }}
						/>
						{errors.country_id && <span className="text-danger">* This field is required</span>}
						{props.errors.country_id && <span className="text-danger">{props.errors.country_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("district:label.region")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.regions}
							name="region_id"
							defaultValue={props.data.region_id}
							placeholder={loadings.region ? 'Sedang Memuat ..' : 'Pilih' }
							isLoading={loadings.region}
							isDisabled={isDisabled.region}
							rules={{ required: false }}
						/>
						{errors.region_id && <span className="text-danger">* This field is required</span>}
						{props.errors.region_id && <span className="text-danger">{props.errors.region_id[0]}</span>}
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