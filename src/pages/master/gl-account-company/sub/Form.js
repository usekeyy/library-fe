import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


const RouteForm = (props) => {
	const { handleSubmit, control } = useForm({});
	const { t } = props;
	const onSubmit = data => {
		setData(data)
		props.save(data);
	};

	const setData = (data) => {
		data.gl_account_id = (data.gl_account_id === undefined || data.gl_account_id === null) ? "" : data.gl_account_id.value
		data.currency_id = (data.currency_id === undefined || data.currency_id === null) ? "" : data.currency_id.value
		data.company_id = (data.company_id === undefined || data.company_id === null) ? "" : data.company_id.value
	}

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}
	
	const onInputChangeGlAccount = (option, { action }) => {
		if (action === "input-change") {
			props.getGlAccount(option)
		}
	};

	const onInputChangeCurrency = (option, { action }) => {
		if (action === "input-change") {
			props.getCurrency(option)
		}
	};

	const onInputChangeCompany= (option, { action }) => {
		if (action === "input-change") {
			props.getCompany(option)
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >GL Account  <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							defaultValue={props.data.gl_account_id}
							styles={props.errors.gl_account_id ? customStyles : {}}
							options={props.optionsGlAccount}
							onInputChange={onInputChangeGlAccount}
							name="gl_account_id"
							isClearable
							isLoading={props.loadings.gl_account_id}
						/>
						{props.errors.gl_account_id && <span className="text-danger">{props.errors.gl_account_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Currency  <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							defaultValue={props.data.currency_id}
							styles={props.errors.currency_id ? customStyles : {}}
							options={props.optionsCurrency}
							onInputChange={onInputChangeCurrency}
							name="currency_id"
							isClearable
							isLoading={props.loadings.currency_id}
						/>
						{props.errors.currency_id && <span className="text-danger">{props.errors.currency_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Company  <span className="text-danger">*</span></label>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							defaultValue={props.data.company_id}
							styles={props.errors.company_id ? customStyles : {}}
							options={props.optionsCompany}
							onInputChange={onInputChangeCompany}
							name="company_id"
							isClearable
							isLoading={props.loadings.company_id}
						/>
						{props.errors.company_id && <span className="text-danger">{props.errors.company_id[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("glAccountCompany:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit} > {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  {props.uuid !== "" ?  t("glAccountCompany:button.update") : t("glAccountCompany:button.submit")} </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(RouteForm);