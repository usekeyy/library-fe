import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import FormSync from './FormSync';

const FormNote = (props) => {
	const { t } = props;
	const { register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{console.log(props.approval)}
					{props.approval.status === 's' &&
					<FormSync
						parentState={props.parentState}
						t={props.t}
						data_vendor={props.data_vendor}
						handleChange={props.handleChange}
						fetchIncoterms={props.fetchIncoterms}
						fetchVendorAccGroup={props.fetchVendorAccGroup} 
						fetchGlAccount={props.fetchGlAccount}
						fetchCurrencies={props.fetchCurrencies}
						fetchSearchTerms={props.fetchSearchTerms}
						fetchTermOfPayment={props.fetchTermOfPayment}
					/>}
					<div className="form-group">
						<label>Note <span className="text-danger">*</span></label>
						<input className={(errors.note || props.errors.note) ? "form-control is-invalid" : "form-control"} name="note" ref={register({ required: true })} defaultValue={''} />
						{errors.note && <span className="text-danger"> {errors.note.type === "required" ? "Field harus diisi" : ''}  {errors.note.message} </span>}
						{props.errors.note && <span className="text-danger">{props.errors.note[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button type="button" className="btn btn-white" disabled={props.loadingSubmit} onClick={() => props.toggleClose()}>{t("district:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(FormNote);