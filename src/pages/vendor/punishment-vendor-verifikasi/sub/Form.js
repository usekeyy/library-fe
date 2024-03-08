import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
    const { t } = props;
	const { control, register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};	

	const onSubmitAccept = handleSubmit(async data => {
		props.setStatus('y')
	})
	const onSubmitDecline = handleSubmit(async data => {
		props.setStatus('r')
	})

    return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>

			<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_name" defaultValue={props.data.vendor_name} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_id")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_id" defaultValue={props.data.vendor_id} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_sap_code")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_sap_code" defaultValue={props.data.vendor_sap_code} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_npwp_nomor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_npwp_nomor" defaultValue={props.data.vendor_npwp} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.punishment_type")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="punishment_type" defaultValue={props.data.punishment_type} />
					</div>
				</div>
				{props.data.punishment_type === 'Suspend' &&
					<div className="form-group row">
						<div className="col-md-2">
							<label>{t("punishmentVendor:label.suspend_type")} <span className="text-danger">*</span></label>
						</div>
						<div className="col-md-10">
							<input disabled={true} className={"form-control"} name="suspend_type" defaultValue={props.data.suspend_type} />
						</div>
					</div>
				}
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.start_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" disabled={true} className={"form-control"} name="start_date" defaultValue={props.data.start_date}/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.end_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" disabled={true} className={"form-control"} name="end_date" defaultValue={props.data.end_date}/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.reason_note")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="reason_note" defaultValue={props.data.reason_note} />
					</div>
				</div>
				<div className="form-group row">
						<div className="col-md-2">
							<label>{t("punishmentVendor:label.file")} <span className="text-danger">*</span></label>
						</div>
						<div className="col-md-10">
							<a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.file}`} > {props.data.file} </a>
						</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.purchasing_org_suspend")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.m_purchasing_org}
							defaultValue={props.data.purchasing_org_suspend}
							inputRef={(e) => register({ name: "purchasing_org_suspend", required: true })}
							name="purchasing_org_suspend"
							placeholder={ t("common:Select.Pilih") }
							isLoading={ false }
							rules={{ required: true }}
						/>
						{errors.purchasing_org_suspend && <span className="text-danger">* This field is required</span>}
						{props.errors.purchasing_org_suspend && <span className="text-danger">{props.errors.purchasing_org_suspend[0]}</span>}
					</div>
				</div>
				<textarea ref={register({ required: false })} className={(props.errors.verification_note) ? "form-control is-invalid" : "form-control"} name="verivication_note" rows="4" cols="50" defaultValue={props.data.verification_note && props.data.verification_note !== null ? props.data.verification_note : ''} />
				{props.errors.verification_note && <span className="text-danger"> {props.errors.verification_note[0]} </span>}
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-danger m-l-10" onClick={() => onSubmitDecline()}>{t("openPunishmentVendor:button.reject")}</button>
					<button className="btn btn-primary m-l-10" onClick={() => onSubmitAccept()}>{t("openPunishmentVendor:button.approve")}</button>
				</div>
			</form>
		</div>
	);
}

export default withTranslation()(Form);