import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';

// const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit } = useForm({});
	// let msg = props.errors;
	const onSubmit = async data => {
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Tax Code<span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger"> {errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message} </span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Tax Description<span className="text-danger">*</span> </label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("documentType:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("documentType:button.update") : t("documentType:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);