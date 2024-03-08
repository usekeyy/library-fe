import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const { t } = props;
	const { register, errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{/* <div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div> */}
					<div className="form-group">
						<label>{t("templatePersyaratan:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("templatePersyaratan:label.tipe")}<span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_tipe}
								defaultValue={props.data.tipe}
								inputRef={(e) => register({ name: "tipe", required: false })}
								name="tipe"
								placeholder={ t("common:Select.Pilih") }
								isLoading={ false }
								rules={{ required: false }}
							/>
							{errors.tipe && <span className="text-danger">* This field is required</span>}
							{props.errors.tipe && <span className="text-danger">{props.errors.tipe[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("templatePersyaratan:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorClassification:button.update") : t("vendorClassification:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);