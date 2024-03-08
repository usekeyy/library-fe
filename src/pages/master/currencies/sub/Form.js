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
						<label>Id <span className="text-danger">*</span></label>
							<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register(
								{
									required: true,
									minLength: {
										value: 1,
										message: "id must have at least 1 characters"
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
					<div className="form-group">
						<label>{t("currency:label.short-text")} <span className="text-danger">*</span> </label>
							<input className={(errors.short_text || props.errors.short_text) ? "form-control is-invalid" : "form-control"} name="short_text" ref={register({ required: true })} defaultValue={props.data.short_text || ''} />
							{errors.short_text && <span className="text-danger"> {errors.short_text.type === "required" ? "Field harus diisi" : ''}  {errors.short_text.message} </span>}
							{props.errors.short_text && <span className="text-danger">{props.errors.short_text[0]}</span>}
					</div>

					<div className="form-group">
						<label>{t("currency:label.long-text")}<span className="text-danger">*</span></label>
							<input className={(errors.long_text || props.errors.long_text) ? "form-control is-invalid" : "form-control"} name="long_text" ref={register({ required: true })} defaultValue={props.data.long_text || ''} />
							{errors.long_text && <span className="text-danger"> {errors.long_text.type === "required" ? "Field harus diisi" : ''}  {errors.long_text.message} </span>}
							{props.errors.long_text && <span className="text-danger">{props.errors.long_text[0]}</span>}
					</div>

				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("currency:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ?  t("currency:button.update") : t("currency:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (RouteForm);