import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';

// const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async data => {
        props.save(data);
	};
	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                    <div className="form-group">
						<label>Condition Type <span className="text-danger">*</span></label>
						<input type="text" className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger"> {errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message} </span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
                    <div className="form-group">
						<label>Condition Type Desciption <span className="text-danger">*</span></label>
						<input type="text" className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
                    <div className="form-group">
						<label>Calc Type <span className="text-danger">*</span></label>
						<input type="text" className={(errors.type || props.errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register({ required: true })} defaultValue={props.data.type || ''} />
						{errors.type && <span className="text-danger"> {errors.type.type === "required" ? "Field harus diisi" : ''}  {errors.type.message} </span>}
						{props.errors.type && <span className="text-danger">{props.errors.type[0]}</span>}
					</div>
					{/* <div className="form-group">
						<label>Status Anggota <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={[
									{
										value : "y",
										label : "Ketua"
									},
									{
										value : "n",
										label : "Anggota"
									}
								]}
								defaultValue={props.data.status}
								onInputChange={onInputChangeUser}
								inputRef={(e) => register({ name: "status", required: true })}
								name="status"
								placeholder={props.loadings.status ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.status}
								rules={{ required: true }}
							/>
							{errors.status && <span className="text-danger">* This field is required</span>}
							{props.errors.status && <span className="text-danger">{props.errors.status[0]}</span>}
						</div>
					</div> */}
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("mappingValueApproval:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("mappingValueApproval:button.update") : t("mappingValueApproval:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);