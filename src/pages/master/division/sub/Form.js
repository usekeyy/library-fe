import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control, setValue } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};

	const handleChangePurchasingOrg = (e) => {
		let selected = e.value;
		setValue('chief', null)
		props.setPurchasingOrg(selected)
	}

	const onInputChangePurchasingOrg = (option, { action }) => {
		if (action === "input-change") {
			props.fetchPurchasingOrg(option)
		}
		if (action === "set-value") {
			props.fetchPurchasingOrg()
		}
	};
	const onInputChangePurchasingGroup = (option, { action }) => {
		if (action === "input-change") {
			props.fetchPurchasingGroup(option)
		}
		if (action === "set-value") {
			props.fetchPurchasingGroup()
		}
	};
	const onInputChangeUser = (option, { action }) => {
		if (action === "input-change") {
			props.fetchUsersRole(option)
		}
		if (action === "set-value") {
			props.fetchUsersRole()
		}
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >{t("division:label.name")} <span className="text-danger">*</span> </label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("purchasingOrg:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_purchasing_org}
								defaultValue={props.data.purchasing_org_id}
								onInputChange={onInputChangePurchasingOrg}
								inputRef={(e) => register({ name: "purchasing_org_id", required: true })}
								name="purchasing_org_id"
								onChange={([selected]) => {
									handleChangePurchasingOrg(selected)
									return  selected;
								}}
							placeholder={props.loadings.purchasing_org_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.purchasing_org_id}
								rules={{ required: true }}
							/>
							{errors.purchasing_org_id && <span className="text-danger">* This field is required</span>}
							{props.errors.purchasing_org_id && <span className="text-danger">{props.errors.purchasing_org_id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("purchasingGroup:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={false}
								as={Select}
								control={control}
								options={props.m_purchasing_groups}
								defaultValue={props.data.purchasing_groups}
								onInputChange={onInputChangePurchasingGroup}
								inputRef={(e) => register({ name: "purchasing_groups", required: true })}
								name="purchasing_groups"
								placeholder={props.loadings.purchasing_groups ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.purchasing_groups}
								rules={{ required: true }}
								className="basic-multi-select"
								classNamePrefix="select"
								isMulti
								isClearable
							/>
							{errors.purchasing_groups && <span className="text-danger">* This field is required</span>}
							{props.errors.purchasing_groups && <span className="text-danger">{props.errors.purchasing_groups[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label >{t("division:label.chief")} <span className="text-danger">*</span> </label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								defaultValue={props.data.chief}
								onInputChange={onInputChangeUser}
								options={props.m_chief}
								name="chief"
								inputRef={(e) => register({ name: "chief", required: true })}
								placeholder={props.loadings.chief ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
								isLoading={props.loadings.chief}
								isDisabled={props.isDisabled.chief}
								rules={{ required: true }}
								/>
							{errors.chief && <span className="text-danger">* This field is required</span>}
							{props.errors.chief && <span className="text-danger">{props.errors.chief[0]}</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("division:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("division:button.update") : t("division:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);