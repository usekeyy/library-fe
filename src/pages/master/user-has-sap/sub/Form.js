import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
		props.save(data)
	};
	let msg = props.errors;
	let { loading,loadings } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>User ID <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.user}
							defaultValue={props.data.user_id}
							inputRef={(e) => register({ name: "user_id", required: true })}
							name="user_id"
							placeholder={loadings.country ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							isLoading={loadings.country}
							rules={{ required: true }}
						/>
						{errors.user_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.user_id && <span className="text-danger">{props.errors.user_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>User SAP<span className="text-danger">*</span></label>
						<div>
							<input className={(errors.user_sap || msg.user_sap) ? "form-control is-invalid" : "form-control"} name="user_sap" ref={register({ required: false })} defaultValue={props.data.user_sap || ''} />
							{errors.user_sap && <span className="text-danger">* This field is required</span>}
							{msg.user_sap && <span className="text-danger"> {msg.user_sap[0]} </span>}
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