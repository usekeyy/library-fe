import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();
const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, watch, control } = useForm({});
	const password = useRef({});
	password.current = watch("password", "");
	const onSubmit = async data => {
		props.save(data)
	};
	let msg = props.errors;
	let { loading } = props;
	let { m_company } = props;
	let { company_id } = props.data;
	let { loadings } = props;
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{t("purchasingOrg:label.id")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
							{errors.id && <span className="text-danger">* This field is required</span>}
							{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("purchasingOrg:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("purchasingOrg:label.company-name")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								placeholder={loadings.company ? 'Sedang Memuat ..' : 'Pilih'}
								isLoading={loadings.company}
								className="basic-multi-select"
								classNamePrefix="select"
								name="company_id"
								control={control}
								options={m_company}
								defaultValue={company_id}
								rules={{ required: true }}
								isClearable
							/>
							{errors.company_id && <span className="text-danger">* This field is required</span>}
							{msg.company_id && <span className="text-danger">{msg.company_id[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("purchasingOrg:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("purchasingOrg:button.update") : t("purchasingOrg:button.submit")}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (Form);