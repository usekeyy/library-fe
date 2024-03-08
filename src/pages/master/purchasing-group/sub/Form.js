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
						<label>Id <span className="text-danger">*</span> </label>
						<div>
							<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" disabled={props.uuid !== "" ? true : false} ref={register(
								{
									required: true,
									minLength: {
										value: 3,
										message: "id must have at least 3 characters"
									},
									maxLength: {
										value: 3,
										message: "id must have at least 3 characters"
									}
								}
							)} defaultValue={props.data.id || ''} />
							{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
							{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("purchasingGroup:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
							{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("purchasingGroup:button.close")}</button>
					<button className="btn btn-success" type="submit">{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("purchasingGroup:button.update") : t("purchasingGroup:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (RouteForm);