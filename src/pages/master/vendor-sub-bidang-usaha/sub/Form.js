import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();


const Form = (props) => {
	const { t } = props;
	const { register, control, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save({
			bidang_usaha_id : data.bidang_usaha_id.value,
			id : data.id,
			name : data.name
		});
	};
	let { loadings } = props;
	let { isDisabled } = props;
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
				<div className="form-group">
						<label>Bidang Usaha <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.optionBidangUsaha}
							name="bidang_usaha_id"
							defaultValue={props.data.bidang_usaha_id}
							placeholder={loadings.bidang_usaha_id ? 'Sedang Memuat ..' : 'Pilih'}
							isLoading={loadings.bidang_usaha_id}
							isDisabled={isDisabled.bidang_usaha_id}
							inputRef={(e) => register({ name: "bidang_usaha_id", required: false })}
							rules={{ required: false }}
						/>
						{errors.bidang_usaha_id && <span className="text-danger">* This field is required</span>}
						{props.errors.bidang_usaha_id && <span className="text-danger">{props.errors.bidang_usaha_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input disabled={props.uuid !== "" ? true : false} className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? t("common:errors.required") : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("vendorBidangUsaha:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? t("common:errors.required") : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("vendorBidangUsaha:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorBidangUsaha:button.update") : t("vendorBidangUsaha:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);