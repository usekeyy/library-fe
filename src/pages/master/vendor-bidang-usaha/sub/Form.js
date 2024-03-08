import React from 'react';
import { useForm , Controller} from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const { t } = props;
	const { register, handleSubmit, errors , control} = useForm({});
	const onSubmit = async data => {
		props.save(setData(data));
	};

	const setData  = (data) => {
		data.tipe = data.tipe ===null ? "" : data.tipe.value
		data.construction = data.construction ===null ? "" : data.construction.value
		return data
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register()} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? t("common:errors.required") : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("vendorBidangUsaha:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? t("common:errors.required") : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label >Tipe<span className="text-danger">*</span></label>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								className={(errors.name || props.errors.name) ? "is-invalid" : ""}
								control={control}
								name="tipe" 
								options={props.tipeOptions} 
								// onInputChange={onInputChange}
								defaultValue={props.data.tipe}
							/>
							{errors.tipe && <span className="text-danger">* This field is required</span>}
							{props.errors.tipe && <span className="text-danger">{props.errors.tipe[0]}</span>}
					</div>
					<div className="form-group">
						<label >Construction<span className="text-danger">*</span></label>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								className={(errors.name || props.errors.name) ? "is-invalid" : ""}
								control={control}
								name="construction" 
								options={props.constructionOptions} 
								// onInputChange={onInputChange}
								defaultValue={props.data.construction}
							/>
							{errors.construction && <span className="text-danger">* This field is required</span>}
							{props.errors.construction && <span className="text-danger">{props.errors.construction[0]}</span>}
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