import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	let msg = props.errors;
	let { loading } = props;

	const onSubmit = async data => {
		props.save(data)
	};

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
						<label>{t("uom:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>MR/SR <span className="text-danger">*</span></label>
						<div>
							<label><input type="radio" name="flag" value={'MR/SR'} ref={register({ required: false })} required defaultChecked={props.data.flag==='MR/SR' ? true : false} /> Yes</label>
							<br></br>
							<label><input type="radio" name="flag" value={false} ref={register({ required: false })} required defaultChecked={props.data.flag===null ? true : false} /> No</label>
						</div>
					</div>
					<div className="form-group">
						<label>Status <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_status}
								defaultValue={props.data.status}
								inputRef={(e) => register({ name: "status", required: false })}
								name="status"
								placeholder={ t("common:Select.Pilih") }
								isLoading={ false }
								rules={{ required: false }}
							/>
							{errors.status && <span className="text-danger">* This field is required</span>}
							{msg.status && <span className="text-danger">{msg.status[0]}</span>}
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