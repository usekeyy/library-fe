import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();


const RouteForm = (props) => {
	const { register, handleSubmit, errors } = useForm({});
	const { t } = props;
	const onSubmit = data => {
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" disabled={props.uuid !== "" ? true : false} ref={register()} defaultValue={props.data.id || ''} />
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label >{t("company:label.name")}  <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit} > {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {props.uuid !== "" ?  t("currency:button.update") : t("currency:button.submit")} </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(RouteForm);