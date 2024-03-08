import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Form = (props) => {
	// const [disabledRegion, setDisabledRegion] = React.useState(false)
	const [disabledDistrict, setDisabledDistrict] = React.useState(true)

	const {t} = props;
	const { register, errors, handleSubmit, control, setValue } = useForm({});
	const onSubmit = async data => {
		setSendData(data);
		props.save(data)
	};
	let msg = props.errors;
	let { loading } = props;

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}

	const handleChangeCountry = (e) => {
		let value = {
			country_id: e.value,
		};
		setDisabledDistrict(false);

		setValue("district_id", '')
		props.fetchDistricts(value)
	}

	const setSendData = (data) => {
		data.bank_id = typeof data.bank_id.value !== "undefined" ? data.bank_id.value : "";
		data.country_id = typeof data.country_id.value !== "undefined" ? data.country_id.value : "";
		data.district_id = typeof data.district_id.value !== "undefined" ? data.district_id.value : "";
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{/* <div className="form-group">
						<label>{"ID"} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: false })} defaultValue={props.data.id || ''} disabled={props.data.id !== ''} />
							{errors.id && <span className="text-danger">* This field is required</span>}
							{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
						</div>
					</div> */}
					<div className="form-group">
						<label>{"ERP CODE"}</label>
						<div>
							<input type="number" className={(errors.sap_code || msg.sap_code) ? "form-control is-invalid" : "form-control"} name="sap_code" ref={register({ required: false })} defaultValue={props.data.sap_code || ''} />
							{errors.sap_code && <span className="text-danger">* This field is required</span>}
							{msg.sap_code && <span className="text-danger"> {msg.sap_code[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{"Name"} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} defaultValue={props.data.name || ''} />
							{errors.name && <span className="text-danger">* This field is required</span>}
							{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{'Bank'} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								control={control}
								placeholder={props.loadings.bank ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.bank}
								className="basic-multi-select"
								classNamePrefix="select"
								name="bank_id"
								styles={msg.bank_id ? customStyles : {}}
								defaultValue={props.data.bank_id}
								options={props.parentState.m_bank} 
								rules={{ required: false }} />
							{msg.bank_id && <span className="text-danger"> {msg.bank_id[0]} </span>}
						</div>
					</div>
					<div className="form-group">
							<label>{t('Beranda.Registrasi.Label.Negara')} <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.country ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.country}
									className="basic-multi-select"
									classNamePrefix="select"
									name="country_id"
									styles={msg.country_id ? customStyles : {}}
									defaultValue={props.data.country_id}
									// onChange={handleChangeCountry}
									onChange={([selected]) => {
										handleChangeCountry(selected)
										return selected;
									}}
									// onInputChange={props.handleInputChange}
									// inputRef={(e) => register({ name: "country_id" })}
									options={props.parentState.m_country} 
									rules={{ required: false }} />
								{msg.country_id && <span className="text-danger"> {msg.country_id[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label>{t('Beranda.Registrasi.Label.Kota/Kabupaten')} <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.district}
									className="basic-multi-select"
									classNamePrefix="select"
									name="district_id"
									styles={msg.district_id ? customStyles : {}}
									defaultValue={props.data.district_id}
									options={props.parentState.m_district} 
									isDisabled={props.data.id !== '' ? false : disabledDistrict}
									rules={{ required: false }} />
								{msg.district_id && <span className="text-danger"> {msg.district_id[0]} </span>}
							</div>
						</div>
					<div className="form-group">
						<label>{"Alamat"} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.address || msg.address) ? "form-control is-invalid" : "form-control"} name="address" ref={register({ required: false })} defaultValue={props.data.address || ''} />
							{errors.address && <span className="text-danger">* This field is required</span>}
							{msg.address && <span className="text-danger"> {msg.address[0]} </span>}
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