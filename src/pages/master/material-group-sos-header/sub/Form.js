import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const { t } = props;
	let {loadings} = props;
	const { control, register, handleSubmit, errors } = useForm({});
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
						<label>{t("materialGroupSosHeader:label.material_group")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_material_group}
								defaultValue={props.data.material_group_id}
								inputRef={(e) => register({ name: "material_group_id", required: false })}
								name="material_group_id"
								placeholder={loadings.material_group ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.material_group}
								rules={{ required: false }}
							/>
							{errors.material_group && <span className="text-danger">* This field is required</span>}
							{props.errors.material_group && <span className="text-danger">{props.errors.material_group[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("materialGroupSosHeader:label.bidang_usaha")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_bidang_usaha}
								defaultValue={props.data.bidang_usaha_id}
								inputRef={(e) => register({ name: "bidang_usaha_id", required: false })}
								name="bidang_usaha_id"
								placeholder={loadings.bidang_usaha ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.bidang_usaha}
								rules={{ required: false }}
							/>
							{errors.bidang_usaha && <span className="text-danger">* This field is required</span>}
							{props.errors.bidang_usaha && <span className="text-danger">{props.errors.bidang_usaha[0]}</span>}
						</div>
					</div>
					{props.uuid !== "" && 
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
								{props.errors.status && <span className="text-danger">{props.errors.status[0]}</span>}
							</div>
						</div>
					}
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("materialGroupSosHeader:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorClassification:button.update") : t("vendorClassification:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);