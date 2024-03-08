import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const Form = (props) => {
	const { t } = props;
	const { register , handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{t("companyType:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("companyType:label.description")}</label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register()} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("companyType:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("companyType:button.update") : t("companyType:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);