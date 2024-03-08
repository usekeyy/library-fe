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
            props.upload('PNSVDR', e.target.files[0])
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
		props.getDetailVendor(selected)
	}

	const handleChangePunishment = (e) => {
        let selected = e.value;
		props.setStatusPunishment(selected)
	}

	var curr = new Date();
	curr.setDate(curr.getDate());
	var date = curr.toISOString().substr(0,10);

    return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							isDisabled={props.toggleDetail ? true : false}
							options={props.m_vendor}
							onChange={([selected]) => {
								handleChangeVendor(selected)
								return selected;
							}}
							defaultValue={props.data.vendor_id}
							inputRef={(e) => register({ name: "vendor_id", required: false })}
							name="vendor_id"
							placeholder={loadings.vendor ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
							isLoading={loadings.vendor}
							rules={{ required: false }}
						/>
						{errors.vendor && <span className="text-danger">* This field is required</span>}
						{props.errors.vendor && <span className="text-danger">{props.errors.vendor[0]}</span>}
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_id")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_id" defaultValue={props.detail_vendor.id} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_sap_code")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_sap_code" defaultValue={props.detail_vendor.sap_code} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.vendor_npwp_nomor")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input disabled={true} className={"form-control"} name="vendor_npwp_nomor" defaultValue={props.detail_vendor.npwp_nomor} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.punishment_type")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={props.option_punishment}
							onChange={([selected]) => {
								handleChangePunishment(selected)
								return selected;
							}}
							defaultValue={props.data.punishment_type}
							inputRef={(e) => register({ name: "punishment_type", required: false })}
							name="punishment_type"
							placeholder={loadings.punishment_type ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
							isLoading={loadings.punishment_type}
							rules={{ required: true }}
						/>
						{errors.punishment_type && <span className="text-danger">* This field is required</span>}
						{props.errors.punishment_type && <span className="text-danger">{props.errors.punishment_type[0]}</span>}
					</div>
				</div>
				{props.status_punishment === 'Suspend' &&
					<div className="form-group row">
						<div className="col-md-2">
							<label>{t("punishmentVendor:label.suspend_type")} <span className="text-danger">*</span></label>
						</div>
						<div className="col-md-10">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								options={props.option_suspend}
								defaultValue={props.data.suspend_type}
								inputRef={(e) => register({ name: "suspend_type", required: false })}
								name="suspend_type"
								placeholder={loadings.suspend_type ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={loadings.suspend_type}
								rules={{ required: true }}
							/>
							{errors.suspend_type && <span className="text-danger">* This field is required</span>}
							{props.errors.suspend_type && <span className="text-danger">{props.errors.suspend_type[0]}</span>}
						</div>
					</div>
				}
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.start_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" className={(errors.start_date || props.errors.start_date) ? "form-control is-invalid" : "form-control"} name="start_date" ref={register({ required: false })} defaultValue={props.data.start_date === '' ? date : props.data.start_date} />
						{errors.start_date && <span className="text-danger">* This field is required</span>}
						{props.errors.start_date && <span className="text-danger"> {props.errors.start_date[0]} </span>}
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.end_date")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input type="date" className={(errors.end_date || props.errors.end_date) ? "form-control is-invalid" : "form-control"} name="end_date" ref={register({ required: false })} defaultValue={props.data.end_date === '' ? date : props.data.end_date} />
						{errors.end_date && <span className="text-danger">* This field is required</span>}
						{props.errors.end_date && <span className="text-danger"> {props.errors.end_date[0]} </span>}
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.reason_note")} <span className="text-danger">*</span></label>
					</div>
					<div className="col-md-10">
						<input className={(errors.reason_note || props.errors.reason_note) ? "form-control is-invalid" : "form-control"} name="reason_note" ref={register({ required: true })} defaultValue={props.data.reason_note || ''} />
						{errors.reason_note && <span className="text-danger"> {errors.reason_note.type === "required" ? t("common:errors.required"): ''}  {errors.reason_note.message} </span>}
						{props.errors.reason_note && <span className="text-danger">{props.errors.reason_note[0]}</span>}	
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-2">
						<label>{t("punishmentVendor:label.file")} <span className="text-danger">*</span></label>
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
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {!props.uuid ? t("punishmentVendor:button.submit") : t("punishmentVendor:button.update")}</button>
				</div>
			</form>
		</div>
	);
}

export default withTranslation()(Form);