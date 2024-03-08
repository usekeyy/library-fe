import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


const RouteForm = (props) => {
	const { register, handleSubmit, errors, control } = useForm({});
	const { t } = props;
	const onSubmit = data => {
		setData(data)
		props.save(data);
	};

	const setData = (data) => {
		data.coa_id = (data.coa_id === undefined || data.coa_id === null) ? "" : data.coa_id.value
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" disabled={props.uuid !== "" ? true : false} ref={register()} defaultValue={props.data.id || ''} />
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label >{t("company:label.name")}  <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>Description <span></span> </label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register()} defaultValue={props.data.description || ''} />
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					<div className="form-group">
						<label >Chart Of Account  <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							defaultValue={props.data.coa_id}
							options={props.optionsChartOfAccount}
							name="coa_id"
							inputRef={(e) => register({ name: "region_id", required: false })}
							isClearable
						/>
						{props.errors.coa_id && <span className="text-danger">{props.errors.coa_id[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit} > {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {props.uuid !== "" ?  t("currency:button.update") : t("currency:button.submit")} </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(RouteForm);