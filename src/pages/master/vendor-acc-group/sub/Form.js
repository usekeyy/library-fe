import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const Form = (props) => {
	const { t } = props;
	const { register, errors, handleSubmit, watch } = useForm({});
	const password = useRef({});
	password.current = watch("password", "");
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
						<label>{t("vendorAccGroup:label.code")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
							{errors.id && <span className="text-danger">* This field is required</span>}
							{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("vendorAccGroup:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("vendorAccGroup:label.on-time-acc")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.one_time_acc || msg.one_time_acc) ? "form-control is-invalid" : "form-control"} name="one_time_acc" ref={register({ required: true })} defaultValue={props.data.one_time_acc || ''} />
							{errors.one_time_acc && <span className="text-danger">* This field is required</span>}
							{msg.one_time_acc && <span className="text-danger"> {msg.one_time_acc[0]} </span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()} disabled={loading}>{t("vendorAccGroup:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}> {loading && <i className="fas fa-spinner fa-pulse"></i>} {props.uuid !== "" ? t("vendorAccGroup:button.update") : t("vendorAccGroup:button.submit")} </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);