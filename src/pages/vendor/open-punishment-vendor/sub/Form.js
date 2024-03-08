import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import {toastr} from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const Form = (props) => {
    const { t } = props;
	let {loadings} = props;
	const { control, register, handleSubmit, errors, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
	const onSubmit = async data => {
		props.save(data);
	};	

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('OPNVDR', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                // setTdpFileName('')
                setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }


    const handleChangeVendor = (e) => {
        let selected = e.value;
		props.showPunishmentVendor(selected)
	}

	var curr = new Date();
	curr.setDate(curr.getDate());
	var date = curr.toISOString().substr(0,10);

    return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.vendor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							isDisabled={props.toggleDetail ? true : false}
							options={props.m_punishment_vendor_uuid}
							onChange={([selected]) => {
								handleChangeVendor(selected)
								return selected;
							}}
							defaultValue={props.data.punishment_vendor_uuid}
							inputRef={(e) => register({ name: "punishment_vendor_uuid", required: false })}
							name="punishment_vendor_uuid"
							placeholder={loadings.punishment_vendor_uuid ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
							isLoading={loadings.punishment_vendor_uuid}
							rules={{ required: false }}
						/>
						{errors.punishment_vendor_uuid && <span className="text-danger">* This field is required</span>}
						{props.errors.punishment_vendor_uuid && <span className="text-danger">{props.errors.punishment_vendor_uuid[0]}</span>}
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.vendor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_id" defaultValue={props.data.vendor_id} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.vendor_sap_code")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_sap_code" defaultValue={props.data.vendor_sap_code} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.vendor_npwp_nomor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_npwp" defaultValue={props.data.vendor_npwp} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.punishment_type")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="punishment_vendor_punishment_type" defaultValue={props.data.punishment_vendor_punishment_type} />
					</div>
				</div>
				{props.data.punishment_vendor_punishment_type === 'Suspend' &&
					<div className="form-group row">
						<div className="col-md-2">
							<label>{t("openPunishmentVendor:label.suspend_type")} <span className="text-danger">*</span></label>
						</div>
						<div className="col-md-10">
							<input disabled={true} className={"form-control"} name="punishment_vendor_suspend_type" defaultValue={props.data.punishment_vendor_suspend_type} />
						</div>
					</div>
				}
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.start_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" disabled={true} className={"form-control"} name="punishment_vendor_start_date" defaultValue={props.data.punishment_vendor_start_date}/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.end_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" disabled={true} className={"form-control"} name="punishment_vendor_end_date" defaultValue={props.data.punishment_vendor_end_date}/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.reason_note")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="punishment_vendor_reason_note" defaultValue={props.data.punishment_vendor_reason_note} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.file")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.punishment_vendor_file}`} > {props.data.punishment_vendor_file} </a>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.purchasing_org_suspend")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="punishment_vendor_purchasing_org_suspend" defaultValue={props.data.punishment_vendor_purchasing_org_suspend} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.open_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" className={(errors.open_date || props.errors.open_date) ? "form-control is-invalid" : "form-control"} name="open_date" ref={register({ required: false })} defaultValue={props.data.open_date === '' ? date : props.data.open_date} />
						{errors.open_date && <span className="text-danger">* This field is required</span>}
						{props.errors.open_date && <span className="text-danger"> {props.errors.open_date[0]} </span>}
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.reason_note")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input className={(errors.reason_note || props.errors.reason_note) ? "form-control is-invalid" : "form-control"} name="reason_note" ref={register({ required: true })} defaultValue={props.data.reason_note || ''} />
						{errors.reason_note && <span className="text-danger"> {errors.reason_note.type === "required" ? t("common:errors.required"): ''}  {errors.reason_note.message} </span>}
						{props.errors.reason_note && <span className="text-danger">{props.errors.reason_note[0]}</span>}	
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("openPunishmentVendor:label.file")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10 row">
						<div className="col-md-10">
							<input type="text" className={(props.errors.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={props.data.file} placeholder="" disabled={true} />
							{(props.data.uuid !== "" && props.data.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.file}` } > {t("common:Button.Download")} </a> : '' }
							{props.errors.file && <span className="text-danger"> {props.errors.file[0]} </span>}
						</div>
						<div className="col-md-2">
							<label className="custom-file-upload">
								<input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
								<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
							</label>
						</div>
					</div>
				</div>
				<textarea ref={register({ required: false })} className={(props.errors.verification_note) ? "form-control is-invalid" : "form-control"} name="verivication_note" rows="4" cols="50" defaultValue={props.data.verification_note || ''} placeholder="CATATAN VERIFIKASI" disabled={true} />
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {!props.uuid ? t("openPunishmentVendor:button.submit") : t("openPunishmentVendor:button.update")}</button>
				</div>
			</form>
		</div>
	);
}

export default withTranslation()(Form);