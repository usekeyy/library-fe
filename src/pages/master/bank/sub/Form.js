import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async data => {
		props.save(data)
	};
	let msg = props.errors;
	let { loading } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{"ID"} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: false })} defaultValue={props.data.id || ''} disabled={props.data.id !== ''} />
							{errors.id && <span className="text-danger">* This field is required</span>}
							{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("uom:label.code")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.code || msg.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: false })} defaultValue={props.data.code || ''} />
							{errors.code && <span className="text-danger">* This field is required</span>}
							{msg.code && <span className="text-danger"> {msg.code[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("uom:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);