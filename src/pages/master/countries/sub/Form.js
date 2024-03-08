import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const RouteForm = (props) => {
	const {t} = props;
	const { register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};

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
									value: 1,
									message: "id must have at least 3 characters"
								},
								maxLength: {
									value: 2,
									message: "id must have at least 2 characters"
								}
							}
						)} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>

					<div className="form-group">
						<label>{t("country:label.name")} <span className="text-danger">*</span>  </label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>

					<div className="form-group">
						<label >{t("country:label.long-name")} <span className="text-danger">*</span> </label>
						<input className={(errors.long_name || props.errors.long_name) ? "form-control is-invalid" : "form-control"} name="long_name" ref={register({ required: true })} defaultValue={props.data.long_name || ''} />
						{errors.long_name && <span className="text-danger"> {errors.long_name.type === "required" ? "Field harus diisi" : ''}  {errors.long_name.message} </span>}
						{props.errors.long_name && <span className="text-danger">{props.errors.long_name[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("country:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("country:button.update") : t("country:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);