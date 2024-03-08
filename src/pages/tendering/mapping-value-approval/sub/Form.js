import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const {t} = props;
	const { register, errors, handleSubmit, control, setValue } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};

	const handleChangePurchasingOrg = async(e) => {
		let selected = e.value;
		setValue('user_id', null)
		props.setPurchasingOrg(selected)
	}

	const handleChangeRole = async(e) => {
		let selected = e.value;
		setValue('user_id', null)
		props.setRole(selected)
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
	const onInputChangeRole = (option, { action }) => {
		if (action === "input-change") {
			props.fetchRole(option)
		}
		if (action === "set-value") {
			props.fetchRole()
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
						<label>{t("purchasingOrg:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_purchasing_org}
								defaultValue={props.data.purchasing_org_id}
								inputRef={(e) => register({ name: "purchasing_org_id", required: true })}
								name="purchasing_org_id"
								onInputChange={onInputChangePurchasingOrg}
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
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_purchasing_group}
								defaultValue={props.data.purchasing_group_id}
								onInputChange={onInputChangePurchasingGroup}
								inputRef={(e) => register({ name: "purchasing_group_id", required: true })}
								name="purchasing_group_id"
								placeholder={props.loadings.purchasing_group_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.purchasing_group_id}
								rules={{ required: true }}
							/>
							{errors.purchasing_group_id && <span className="text-danger">* This field is required</span>}
							{props.errors.purchasing_group_id && <span className="text-danger">{props.errors.purchasing_group_id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>Role <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.m_role}
								defaultValue={props.data.role_id}
								onInputChange={onInputChangeRole}
								inputRef={(e) => register({ name: "role_id", required: true })}
								name="role_id"
								onChange={([selected]) => {
									handleChangeRole(selected)
									return  selected;
								}}
								placeholder={props.loadings.role_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.role_id}
								rules={{ required: true }}
							/>
							{errors.role_id && <span className="text-danger">* This field is required</span>}
							{props.errors.role_id && <span className="text-danger">{props.errors.role_id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("users:Title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								defaultValue={props.data.user_id}
								onInputChange={onInputChangeUser}
								options={props.m_user}
								name="user_id"
								inputRef={(e) => register({ name: "user_id", required: true })}
								placeholder={props.loadings.user_id ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
								isLoading={props.loadings.user_id}
								isDisabled={props.isDisabled.user_id}
								rules={{ required: true }}
								/>
							{errors.user_id && <span className="text-danger">* This field is required</span>}
							{props.errors.user_id && <span className="text-danger">{props.errors.user_id[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("mappingValueApproval:label.value_from")} <span className="text-danger">*</span></label>
						<input type="number" step="0.01" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.value_from || props.errors.value_from) ? "form-control is-invalid" : "form-control"} name="value_from" ref={register({ required: true })} defaultValue={props.data.value_from || ''} />
						{errors.value_from && <span className="text-danger"> {errors.value_from.type === "required" ? "Field harus diisi" : ''}  {errors.value_from.message} </span>}
						{props.errors.value_from && <span className="text-danger">{props.errors.value_from[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("mappingValueApproval:label.value_to")} <span className="text-danger">*</span></label>
						<input type="number" step="0.01" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.value_to || props.errors.value_to) ? "form-control is-invalid" : "form-control"} name="value_to" ref={register({ required: true })} defaultValue={props.data.value_to || ''} />
						{errors.value_to && <span className="text-danger"> {errors.value_to.type === "required" ? "Field harus diisi" : ''}  {errors.value_to.message} </span>}
						{props.errors.value_to && <span className="text-danger">{props.errors.value_to[0]}</span>}
					</div>
					<div className="form-group">
						<label>Order <span className="text-danger">*</span></label>
						<input type="text" step="1" min="0"
							className={(errors.order || props.errors.order) ? "form-control is-invalid" : "form-control"} name="order" ref={register({ required: true })} defaultValue={props.data.order || ''} />
						{errors.order && <span className="text-danger"> {errors.order.type === "required" ? "Field harus diisi" : ''}  {errors.order.message} </span>}
						{props.errors.order && <span className="text-danger">{props.errors.order[0]}</span>}
					</div>
					<div className="form-group">
						<label>Tipe<span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={
									[{
										value : "dur",
										label : "DUR"
									},{
										value : "awarding",
										label : "AWARDING"
									},{
										value : "purchasing_order",
										label : "PURCHASING ORDER"
									},{
										value : "purchasing_order_oa",
										label : "PURCHASING ORDER - OUTLINE AGREEMENT"
									},{
										value : "loa",
										label : "APPROVAL LOA"
									},{
										value : "extend_jadwal",
										label : "EXTEND JADWAL"
									}]
								}
								defaultValue={props.data.type}
								inputRef={(e) => register({ name: "type", required: true })}
								name="type"
								onChange={([selected]) => {
									// handleChangePurchasingOrg(selected)
									return  selected;
								}}
								rules={{ required: true }}
							/>
							{errors.type && <span className="text-danger">* This field is required</span>}
							{props.errors.type && <span className="text-danger">{props.errors.type[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>Approver</label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={
									[{
										value : "x",
										label : "Direksi"
									},{
										value : "y",
										label : "VP"
									}]
								}
								defaultValue={props.data.approver}
								inputRef={(e) => register({ name: "approver", required: true })}
								name="approver"
								onChange={([selected]) => {
									// handleChangePurchasingOrg(selected)
									return  selected;
								}}
								rules={{ required: false }}
								isClearable
							/>
							{errors.approver && <span className="text-danger">* This field is required</span>}
							{props.errors.approver && <span className="text-danger">{props.errors.approver[0]}</span>}
						</div>
					</div>
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