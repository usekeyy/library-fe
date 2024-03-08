import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, control, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		let payload = (props.uuid !== "") ? { code: data.code, name: data.name, country_id: data.country_id.value } : { code: data.code, id: data.id, name: data.name, country_id: data.country_id.value };
		props.save(payload);
	};
	
	const onInputChange = (option, { action }) => {
		if (action === "input-change") {
			props.handleInputChange(option)
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >{t("region:label.code")} <span className="text-danger">*</span> </label>
						<input className={(errors.code || props.errors.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: true })} defaultValue={props.data.code || ''} />
						{errors.code && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.code.message} </span>}
						{props.errors.code && <span className="text-danger">{props.errors.code[0]}</span>}
					</div>
					<div className="form-group">
						<label >{t("region:label.name")} <span className="text-danger">*</span> </label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label >{t("region:label.country")} <span className="text-danger">*</span></label>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								className={(errors.name || props.errors.name) ? "is-invalid" : ""}
								control={control}
								options={props.countries} 
								onInputChange={onInputChange}
								name="country_id" 
								defaultValue={props.data.country_id}
								rules={{ required: true }}
							/>
							{errors.country_id && <span className="text-danger">* This field is required</span>}
							{props.errors.country_id && <span className="text-danger">{props.errors.country_id[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("region:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ?t("region:button.update") : t("region:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (RouteForm);