import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
const animatedComponents = makeAnimated();


const Form = (props) => {
	const { t } = props;
	const { register, errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
		props.save(data)
	};
	let msg = props.errors;
	let { loading } = props;
	let { loadings } = props;
	let { m_plant } = props;
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{t("mrpController:label.id")} <span className="text-danger">*</span></label>
						<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">* This field is required</span>}
						{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
					</div>
					<div className="form-group">
						<label>{t("mrpController:label.code")} <span className="text-danger">*</span></label>
						<input className={(errors.code || msg.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: true })} defaultValue={props.data.code || ''} />
						{errors.code && <span className="text-danger">* This field is required</span>}
						{msg.code && <span className="text-danger"> {msg.code[0]} </span>}
					</div>
					<div className="form-group">
						<label>{t("mrpController:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger">* This field is required</span>}
						{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
					</div>
					<div className="form-group">
						<label>{t("mrpController:label.plant-id")} <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							placeholder={loadings.plant ? 'Sedang Memuat ..' : 'Pilih'}
							isLoading={loadings.plant}
							className="basic-multi-select"
							classNamePrefix="select"
							name="plant_id"
							control={control}
							options={m_plant}
							onInputChange={props.handleInputChange}
							defaultValue={props.data.plant_id}
							rules={{ required: true }}
							isClearable
						/>
						{errors.plant_id && <span className="text-danger">* This field is required</span>}
						{msg.plant_id && <span className="text-danger">{msg.plant_id[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("mrpController:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("mrpController:button.update") : t("mrpController:button.submit")}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);