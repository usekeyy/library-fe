import React, {useRef} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { control, register, errors, handleSubmit, watch , setValue } = useForm({});
	const password = useRef({});

	const handleChangeCompany = (e) => {
		let selected = e.value;
		setValue('purchasing_org_id', null)
		setValue('general_planner_id', null)
		setValue('specific_planner_id', null)
		props.setCompany(selected)
	}

	const handleChangeGeneralPlanner = (e) =>{
		setValue('specific_planner_id', null)
		let selected = e.value;
		props.setGeneralPlanner(selected)
	}

	password.current = watch("password", "");
	const onSubmit = async data => {
		data.name = data.fullname
		console.log(data)
		props.save(data)
	};
	let {roles} = props.data;
	let msg = props.errors;
	let {loading} = props;
	let {loadings} = props;
	let {isDisabled} = props;
	const onInputChangeRole = (option, { action }) => {
		if (action === "input-change") {
			props.fetchRole(option)
		}
		if (action === "set-value") {
			props.fetchRole()
		}
	};
	const onInputChangeCompany = (option, { action }) => {
		if (action === "input-change") {
			props.fetchCompany(option)
		}
		if (action === "set-value") {
			props.fetchCompany()
		}
	};
	const onInputChangeWorkUnit = (option, { action }) => {
		if (action === "input-change") {
			props.fetchWorkUnit(option)
		}
		if (action === "set-value") {
			props.fetchWorkUnit()
		}
	};
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
	const onInputChangeGeneralPlanner = (option, { action }) => {
		if (action === "input-change") {
			props.fetchGeneralPlanner(option)
		}
		if (action === "set-value") {
			props.fetchGeneralPlanner()
		}
	};
	const onInputChangeSpecificPlanner = (option, { action }) => {
		if (action === "input-change") {
			props.fetchSpecificPlanner(option)
		}
		if (action === "set-value") {
			props.fetchSpecificPlanner()
		}
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="form-group">
							<label>Name <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="fullname" ref={register({required: true})} defaultValue={props.data.name || ''}/>
								{errors.name && <span className="text-danger">* This field is required</span>}
								{msg.name && <span className="text-danger">{msg.name[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label>Username <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.username || msg.username) ? "form-control is-invalid" : "form-control"} name="username" ref={register({required: true})} defaultValue={props.data.username || ''} />
								{errors.username && <span className="text-danger">* This field is required</span>}
								{msg.username && <span className="text-danger">{msg.username[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label>Email <span className="text-danger">*</span></label>
							<div>
								<input
									name="email"
									className={(errors.email || msg.email) ? "form-control is-invalid" : "form-control"}
									defaultValue={props.data.email || ''}
									ref={register({
										required: "Required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "invalid email address"
										}
									})}
								/>
								{errors.email && <span className="text-danger">{errors.email.message}</span>}
								{msg.email && <span className="text-danger">{msg.email[0]}</span>}
							</div>
						</div>
						{(props.uuid === '' || props.uuid === null) &&  (
							<div>
								<div className="form-group">
									<label>Password <span className="text-danger">*</span></label>
									<div>
										<input
											name="password"
											type="password"
											className={(errors.password || msg.password) ? "form-control is-invalid" : "form-control"}
											ref={register({
												required: "You must specify a password",
												minLength: {
													value: 6,
													message: "Password must have at least 6 characters"
												}
											})}
										/>
										{errors.password && <span className="text-danger">{errors.password.message}</span>}
										{msg.password && <span className="text-danger">{msg.password[0]}</span>}
									</div>
								</div>
								<div className="form-group">
									<label>Ulangi password <span className="text-danger">*</span></label>
									<div>
										<input
											name="re_password"
											className={(errors.re_password) ? "form-control is-invalid" : "form-control"}
											type="password"
											ref={register({
												validate: value =>
													value === password.current || "The passwords do not match"
											})}
										/>
										{errors.re_password && <span className="text-danger">{errors.re_password.message}</span>}
									</div>
								</div>
							</div>
						)}
						<div className="form-group">
							<label>Roles <span className="text-danger">*</span></label>
							<div>
								<Controller
								components={animatedComponents}
								closeMenuOnSelect={false}
								onMenuClose={(e) => { console.log("heheh") }}
								as={Select} 
								placeholder={loadings.roles ? 'Sedang Memuat ..' : 'Pilih'}
								isLoading={loadings.roles}
								className="basic-multi-select"
								classNamePrefix="select"
								name="roles"
								onInputChange={onInputChangeRole}
								control={control}
								isMulti
								options={props.m_role} 
								defaultValue={roles}
								rules={{ required: true }}
								isClearable
								 />
								{errors.roles && <span className="text-danger">* This field is required</span>}
								{msg.roles && <span className="text-danger">{msg.roles[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label>Company <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_company}
									defaultValue={props.data.company_id}
									onInputChange={onInputChangeCompany}
									onChange={([selected]) => {
										handleChangeCompany(selected)
										return selected;
									}}
									inputRef={(e) => register({ name: "company_id", required: false })}
									name="company_id"
									placeholder={loadings.company ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
									isLoading={loadings.company}
									rules={{ required: false }}
								/>
								{errors.company && <span className="text-danger">* This field is required</span>}
								{msg.company && <span className="text-danger">{msg.company[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label>Purchasing Organization <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_purchasing_org}
									name="purchasing_org_id"
									defaultValue={props.data.purchasing_org_id}
									onInputChange={onInputChangePurchasingOrg}
									placeholder={loadings.purchasing_org ? 'Sedang Memuat ..' : 'Pilih' }
									isLoading={loadings.purchasing_org}
									isDisabled={isDisabled.purchasing_org}
									rules={{ required: false }}
								 />
								{errors.purchasing_org && <span className="text-danger">* This field is required</span>}
								{msg.purchasing_org && <span className="text-danger">{msg.purchasing_org[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label>Purchasing Group</label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={false}
									as={Select}
									control={control}
									options={props.m_purchasing_groups}
									defaultValue={props.data.purchasing_groups}
									onInputChange={onInputChangePurchasingGroup}
									inputRef={(e) => register({ name: "purchasing_groups", required: false })}
									name="purchasing_groups"
									placeholder={loadings.purchasing_groups ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
									isLoading={loadings.purchasing_groups}
									rules={{ required: false }}
									className="basic-multi-select"
									classNamePrefix="select"
									isMulti
									isClearable
								/>
							</div>
						</div>
						<div className="form-group">
							<label>Work Unit</label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_work_unit}
									name="work_unit_id"
									defaultValue={props.data.work_unit_id}
									onInputChange={onInputChangeWorkUnit}
									placeholder={loadings.work_unit ? 'Sedang Memuat ..' : 'Pilih' }
									isLoading={loadings.work_unit}
									rules={{ required: false }}
								 />
							</div>
						</div>
						<div className="form-group">
							<label>General Planner</label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									defaultValue={props.data.general_planner_id}
									onInputChange={onInputChangeGeneralPlanner}
									options={props.m_general_planner}
									name="general_planner_id"
									onChange={([selected]) => {
										handleChangeGeneralPlanner(selected)
										return  selected;
									}}
									inputRef={(e) => register({ name: "general_planner_id", required: false })}
									placeholder={loadings.general_planner ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
									isLoading={loadings.general_planner}
									isDisabled={isDisabled.general_planner}
									rules={{ required: false }}
								 />
							</div>
						</div>
						<div className="form-group">
							<label>Specific Planner</label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_specific_planner}
									name="specific_planner_id"
									defaultValue={props.data.specific_planner_id}
									onInputChange={onInputChangeSpecificPlanner}
									placeholder={loadings.specific_planner ?  t("common:Select.Sedang Memuat"): t("common:Select.Pilih")  }
									isLoading={loadings.specific_planner}
									isDisabled={isDisabled.specific_planner}
									rules={{ required: false }}
								 />
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
							<button type="button" className="btn btn-white" onClick={(e) => props.toggleClose(e)} disabled={loading}>Close</button>
							<button className="btn btn-success" type="submit" disabled={loading}>Submit {loading && <i className="fas fa-spinner fa-pulse"></i>}</button>
					</ModalFooter>
			</form>
		</div>
  );
}

export default withTranslation() (Form);
