import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import {statusName} from '../../../../helpers/statusName'

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	// const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const {t} = props;
	const { register, errors, handleSubmit, control, setValue } = useForm({});
	const onSubmit = async data => {
        props.save(data);
        // console.log(data)
	};

	const handleChangePurchasingOrg = async(e) => {
		let selected = e.value;
		setValue('user_id', null)
		props.setPurchasingOrg(selected)
	}

	// const handleChangeRole = async(e) => {
	// 	let selected = e.value;
	// 	setValue('user_id', null)
	// 	props.setRole(selected)
	// }

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
	// const onInputChangeRole = (option, { action }) => {
	// 	if (action === "input-change") {
	// 		props.fetchRole(option)
	// 	}
	// 	if (action === "set-value") {
	// 		props.fetchRole()
	// 	}
	// };
	// const onInputChangeUser = (option, { action }) => {
	// 	if (action === "input-change") {
	// 		props.fetchUsersRole(option)
	// 	}
	// 	if (action === "set-value") {
	// 		props.fetchUsersRole()
	// 	}
	// };

	return (
		<div>
			{console.log(props.data.company_id)}
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
								defaultValue={props.data.company_id}
								inputRef={(e) => register({ name: "company_id", required: true })}
								name="company_id"
								onInputChange={onInputChangePurchasingOrg}
								onChange={([selected]) => {
									handleChangePurchasingOrg(selected)
									return  selected;
								}}
								placeholder={props.loadings.company_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.loadings.company_id}
								rules={{ required: true }}
							/>
							{errors.company_id && <span className="text-danger">* This field is required</span>}
							{props.errors.company_id && <span className="text-danger">{props.errors.company_id[0]}</span>}
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
						<label>Description <span className="text-danger">*</span></label>
						<input type="text" step="1" min="0"
							className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
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
										value : "y",
										label : "Actived"
									},{
										value : "n",
										label : "Inactived"
									}]
								}
								defaultValue={props.data.status}
								inputRef={(e) => register({ name: "status", required: true })}
								name="status"
								onChange={([selected]) => {
									// handleChangePurchasingOrg(selected)
									return  selected;
								}}
								rules={{ required: true }}
							/>
							{errors.status && <span className="text-danger">* This field is required</span>}
							{props.errors.status && <span className="text-danger">{props.errors.status[0]}</span>}
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