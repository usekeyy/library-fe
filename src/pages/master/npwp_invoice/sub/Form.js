import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit,control } = useForm({});
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
						<label>Company ID <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.company_id || msg.company_id) ? "form-control is-invalid" : "form-control"} name="company_id" ref={register({ required: false })} defaultValue={props.data.company_id || ''} disabled={props.data.id !== ''}/>
							{errors.company_id && <span className="text-danger">* This field is required</span>}
							{msg.company_id && <span className="text-danger"> {msg.company_id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>City <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.city || msg.city) ? "form-control is-invalid" : "form-control"} name="city" ref={register({ required: false })} defaultValue={props.data.city || ''} disabled={props.data.id !== ''}/>
							{errors.city && <span className="text-danger">* This field is required</span>}
							{msg.city && <span className="text-danger"> {msg.city[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>NPWP Number <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.npwp_number || msg.npwp_number) ? "form-control is-invalid" : "form-control"} name="npwp_number" ref={register({ required: false })} defaultValue={props.data.npwp_number || ''} disabled={props.data.id !== ''}/>
							{errors.npwp_number && <span className="text-danger">* This field is required</span>}
							{msg.npwp_number && <span className="text-danger"> {msg.npwp_number[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>NPWP Address <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.npwp_address || msg.npwp_address) ? "form-control is-invalid" : "form-control"} name="npwp_address" ref={register({ required: false })} defaultValue={props.data.npwp_address || ''} disabled={props.data.id !== ''}/>
							{errors.npwp_address && <span className="text-danger">* This field is required</span>}
							{msg.npwp_address && <span className="text-danger"> {msg.npwp_address[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>Status <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.status || msg.status) ? "form-control is-invalid" : "form-control"} name="status" ref={register({ required: false })} defaultValue={props.data.status || ''} disabled={props.data.id !== ''}/>
							{errors.status && <span className="text-danger">* This field is required</span>}
							{msg.status && <span className="text-danger"> {msg.status[0]} </span>}
						</div>
					</div>
					{/* <div className="form-group">
						<label>Status <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={[
									{
										label : "Actived",
										value : "y"
									},
									{
										label : "Inactived",
										value : "n"
									}
								]}
								defaultValue={[
									{label : "Actived", value : "y"}
								]}
								inputRef={(e) => register({ name: "status", required: false })}
								name="status"
								rules={{ required: true }}
								disabled={props.data.id !== ''}
							/>
							{errors.dur_restricted?.type === "required" && <span className="text-danger">* Field harus diisi</span>}
							{props.errors.dur_restricted && <span className="text-danger">{props.errors.dur_restricted[0]}</span>}
						</div>
					</div> */}
					<div className="form-group">
						<label>Primary <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={[
									{
										label : "Utama",
										value : "y"
									},
									{
										label : "Tidak Utama",
										value : "n"
									}
								]}
								defaultValue={props.data.flag}
								inputRef={(e) => register({ name: "flag", required: false })}
								name="flag"
								rules={{ required: true }}
							/>
							{errors.dur_restricted?.type === "required" && <span className="text-danger">* Field harus diisi</span>}
							{props.errors.flag && <span className="text-danger">{props.errors.flag[0]}</span>}
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