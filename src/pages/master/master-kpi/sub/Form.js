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
		console.log(data)
		props.save({
			purchasing_org_id: data.purchasing_org_id?.value,
			value: data.value
		});
	};

	let { loadings } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>

					<div className="form-group">
						<label>Purchasing Organization <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.purchasing_org}
							defaultValue={props.data.purchasing_org_id}
							inputRef={(e) => register({ name: "purchasing_org_id", required: true })}
							name="purchasing_org_id"
							placeholder={loadings.purchasing_org_id ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
							isLoading={loadings.purchasing_org_id}
							rules={{ required: true }}
						/>
						{errors.purchasing_org_id && <span className="text-danger">{t("common:errors.required")}</span>}
						{props.errors.purchasing_org_id && <span className="text-danger">{props.errors.purchasing_org_id[0]}</span>}
					</div>
					<div className="form-group">
						<label>Value <span className="text-danger">*</span></label>
						<input type="number" min="0" className={(errors.length || props.errors.length) ? "form-control is-invalid" : "form-control"} name="value" ref={register({ required: true })} defaultValue={props.data.value || ''} />
						{errors.value && <span classlength="text-danger"> {errors.value.type === "required" ? t("common:errors.required") : ''}  {errors.value.message} </span>}
						{props.errors.value && <span className="text-danger">{props.errors.value[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("postalCode:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("postalCode:button.update") : t("postalCode:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);