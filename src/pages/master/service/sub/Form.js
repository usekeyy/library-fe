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

		props.save(setData(data));
	};

	const setData = (data) => {
		let datas = {
			material_group_id: (data.material_group_id === undefined || data.material_group_id === null) ? "" : data.material_group_id.value,
			service_category_id: (data.service_category_id === undefined || data.service_category_id === null) ? "" : data.service_category_id.value,
			uom_id: (data.uom_id === undefined || data.uom_id === null) ? "" : data.uom_id.value,
			deletion_flag: data.deletion_flag,
			id: data.id,
			name: data.name
		}
		return datas
	}

	const onInputChangeUom = (option, { action }) => {
		if (action === "input-change") {
			props.getUom(option)
		}
	};

	const onInputChangeMaterialGroup = (option, { action }) => {
		if (action === "input-change") {
			props.getMaterialGroup(option)
		}
	};

	const onInputChangeServiceCategory = (option, { action }) => {
		if (action === "input-change") {
			props.getServiceCategory(option)
		}
	};

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" type="number" disabled={props.uuid !== "" ? true : false} ref={register()} defaultValue={props.data.id || ''} />
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label >{t("company:label.name")}  <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label >Uom</label>
						{/* <input type="number" name="uom" ref={register({})} className="form-control" placeholder="" /> */}
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							styles={props.errors.uom_id ? customStyles : {}}
							control={control}
							options={props.optionsUom}
							onInputChange={onInputChangeUom}
							name="uom_id"
							defaultValue={props.data.uom_id}
							isClearable
							isLoading={props.loadings.uom_id}
						// isDisabled={props.isVendor === false}
						/>
						{props.errors.uom_id && <span className="text-danger">{props.errors.uom_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Material Group <span className="text-danger">*</span></label>
						{/* <input type="number" name="uom" ref={register({})} className="form-control" placeholder="" /> */}
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							styles={props.errors.material_group_id ? customStyles : {}}
							control={control}
							options={props.optionsMaterialGroup}
							onInputChange={onInputChangeMaterialGroup}
							name="material_group_id"
							defaultValue={props.data.material_group_id}
							isClearable
							isLoading={props.loadings.material_group_id}
						// isDisabled={props.isVendor === false}
						/>
						{props.errors.material_group_id && <span className="text-danger">{props.errors.material_group_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Service Category <span className="text-danger">*</span></label>
						{/* <input type="number" name="uom" ref={register({})} className="form-control" placeholder="" /> */}
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							styles={props.errors.service_category_id ? customStyles : {}}
							control={control}
							options={props.optionsServiceCategory}
							onInputChange={onInputChangeServiceCategory}
							name="service_category_id"
							defaultValue={props.data.service_category_id}
							isClearable
							isLoading={props.loadings.service_category_id}
						// isDisabled={props.isVendor === false}
						/>
						{props.errors.service_category_id && <span className="text-danger">{props.errors.service_category_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Deletion Flag</label>
						<input className={(errors.deletion_flag || props.errors.deletion_flag) ? "form-control is-invalid" : "form-control"} name="deletion_flag" ref={register()} defaultValue={props.data.deletion_flag || ''} />
						{props.errors.deletion_flag && <span className="text-danger">{props.errors.deletion_flag[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit} > {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {props.uuid !== "" ? t("currency:button.update") : t("currency:button.submit")} </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(RouteForm);