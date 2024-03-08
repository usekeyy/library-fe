import React from 'react';
import { 
	useForm, 
	// Controller 
} from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// const animatedComponents = makeAnimated();

const Form = (props) => {
	const {t} = props;
	const { 
		// register, 
		// errors, 
		handleSubmit, 
		// control 
	} = useForm({});
	// let msg = props.errors;
	let { loading } = props;
	
	// const customStyles = {
	// 	control: (base, state) => ({
	// 		...base,
	// 		borderColor: state.isFocused ?
	// 		'#ddd' : 'red',
	// 	})
	// }
	
	const onSubmit = async data => {
		// setSendData(data)
		props.save(data)
	};

	// const onInputChangeMaterialType = (option, { action }) => {
	// 	if (action === "input-change") {
	// 		props.fetchMaterialType(option)
	// 	}
	// };

	// const setSendData = (data) => {
	// 	data.type = typeof data.type.value !== "undefined" ? data.type.value : "";
	// }

	var curr = new Date();
	curr.setDate(curr.getDate());
	// var date = curr.toISOString().substr(0,10);

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{/* <div className="form-group">
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
								name="type"
								onInputChange={onInputChangeMaterialType}
								styles={msg.type ? customStyles : {}}
								defaultValue={props.data.type}
								options={props.parentState.m_material_type} 
								rules={{ required: false }} />
							{msg.type && <span className="text-danger"> {msg.type[0]} </span>}
						</div>
					</div> */}
					{/* <div className="form-group">
						<label>Create Date</label>
						<div>
							<div style={{display: 'inline-block'}}>
								<label>From</label>
								<input type="date" className={(errors.created_start || msg.created_start) ? "form-control is-invalid" : "form-control"} name="created_start" ref={register({ required: false })} />
								{errors.created_start && <span className="text-danger">* This field is required</span>}
								{msg.created_start && <span className="text-danger"> {msg.created_start[0]} </span>}
							</div>
							<span> </span>
							<div style={{display: 'inline-block'}}>
								<label>To</label>
								<input type="date" className={(errors.created_end || msg.created_end) ? "form-control is-invalid" : "form-control"} name="created_end" ref={register({ required: false })} />
								{errors.created_end && <span className="text-danger">* This field is required</span>}
								{msg.created_end && <span className="text-danger"> {msg.created_end[0]} </span>}
							</div>
						</div>
					</div>
					<div className="form-group">
						<label>Update Date</label>
						<div>
							<div style={{display: 'inline-block'}}>
								<label>From</label>
								<input type="date" className={(errors.updated_start || msg.updated_start) ? "form-control is-invalid" : "form-control"} name="updated_start" ref={register({ required: false })} />
								{errors.updated_start && <span className="text-danger">* This field is required</span>}
								{msg.updated_start && <span className="text-danger"> {msg.updated_start[0]} </span>}
							</div>
							<span> </span>
							<div style={{display: 'inline-block'}}>
								<label>To</label>
								<input type="date" className={(errors.updated_end || msg.updated_end) ? "form-control is-invalid" : "form-control"} name="updated_end" ref={register({ required: false })} />
								{errors.updated_end && <span className="text-danger">* This field is required</span>}
								{msg.updated_end && <span className="text-danger"> {msg.updated_end[0]} </span>}
							</div>
						</div>
					</div> */}
				</ModalBody>
				<ModalFooter>
					{/* {!props.status_input && <span className="text-danger pull-left">* Need to fill at least 1 input field</span>} */}
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>} Sync
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);