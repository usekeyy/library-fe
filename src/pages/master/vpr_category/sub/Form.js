import React from 'react';
import { useForm} from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit} = useForm({});
	// let msg = props.errors;
	const onSubmit = async data => {
		// console.log(data)
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
						<label >{t("documentType:label.description")} <span className="text-danger">*</span> </label>
						<input className={(errors.category || props.errors.category) ? "form-control is-invalid" : "form-control"} name="category" ref={register({ required: true })} defaultValue={props.data.category || ''} />
						{errors.category && <span className="text-danger"> {errors.category.type === "required" ? "Field harus diisi" : ''}  {errors.category.message} </span>}
						{props.errors.category && <span className="text-danger">{props.errors.category[0]}</span>}
					</div>
					{/* <div className="form-group">
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
					</div> */}
					</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("documentType:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("documentType:button.update") : t("documentType:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);