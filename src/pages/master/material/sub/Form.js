import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	let msg = props.errors;
	let { loading } = props;
	
	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
			'#ddd' : 'red',
		})
	}
	
	const onSubmit = async data => {
		setSendData(data)
		props.save(data)
	};

	const onInputChangeMaterialGroup = (option, { action }) => {
		if (action === "input-change") {
			props.fetchMaterialGroup(option)
		}
	};

	const onInputChangeMaterialType = (option, { action }) => {
		if (action === "input-change") {
			props.fetchMaterialType(option)
		}
	};

	const onInputChangeUom = (option, { action }) => {
		if (action === "input-change") {
			props.fetchUom(option)
		}
	};

	const setSendData = (data) => {
		data.material_group_id = typeof data.material_group_id.value !== "undefined" ? data.material_group_id.value : "";
		data.material_type_id = typeof data.material_type_id.value !== "undefined" ? data.material_type_id.value : "";
		data.uom_id = typeof data.uom_id.value !== "undefined" ? data.uom_id.value : "";
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{"ID"} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: false })} defaultValue={props.data.id || ''} disabled={props.data.id !== ''} />
							{errors.id && <span className="text-danger">* This field is required</span>}
							{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{'Material Group'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.parentState.loadings.material_group ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.parentState.loadings.material_group}
								className="basic-multi-select"
								classNamePrefix="select"
								name="material_group_id"
								onInputChange={onInputChangeMaterialGroup}
								styles={msg.material_group_id ? customStyles : {}}
								defaultValue={props.data.material_group_id}
								options={props.parentState.m_material_group} 
								rules={{ required: false }} />
							{msg.material_group_id && <span className="text-danger"> {msg.material_group_id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{'Material Type'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.parentState.loadings.material_type ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.parentState.loadings.material_type}
								className="basic-multi-select"
								classNamePrefix="select"
								name="material_type_id"
								onInputChange={onInputChangeMaterialType}
								styles={msg.material_type_id ? customStyles : {}}
								defaultValue={props.data.material_type_id}
								options={props.parentState.m_material_type} 
								rules={{ required: false }} />
							{msg.material_type_id && <span className="text-danger"> {msg.material_type_id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{'Uom'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.parentState.loadings.uom ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.parentState.loadings.uom}
								className="basic-multi-select"
								classNamePrefix="select"
								name="uom_id"
								onInputChange={onInputChangeUom}
								styles={msg.uom_id ? customStyles : {}}
								defaultValue={props.data.uom_id}
								options={props.parentState.m_uom} 
								rules={{ required: false }} />
							{msg.uom_id && <span className="text-danger"> {msg.uom_id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("uom:label.name")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);