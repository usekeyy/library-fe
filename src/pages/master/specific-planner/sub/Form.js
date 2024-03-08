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

	const setSendData = (data) => {
		data.general_planner_id = typeof data.general_planner_id.value !== "undefined" ? data.general_planner_id.value : "";
	}

	let msg = props.errors;
	let { loading } = props;

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{'General Planner'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.loadings.general_planner ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.general_planner}
								className="basic-multi-select"
								classNamePrefix="select"
								name="general_planner_id"
								styles={msg.general_planner_id ? customStyles : {}}
								defaultValue={props.data.general_planner_id}
								options={props.parentState.m_general_planner} 
								rules={{ required: false }} />
							{msg.general_planner_id && <span className="text-danger"> {msg.general_planner_id[0]} </span>}
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