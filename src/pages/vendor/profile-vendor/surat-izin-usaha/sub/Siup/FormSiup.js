import React from 'react';
import {useForm} from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import {statusName, statusVerifikasi} from '../../../../../../helpers/statusName';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation';
import { checkFileTempVendor } from '../../../../../../helpers/globalHelper';


const FormSiup = (props) => {
		const { register, handleSubmit, setValue, watch } = useForm({});
		const {t} = props;
		const errors_response = props.siup.errors;
		const {sendData} = props.siup;
		const {has_draft_verification} = props;
		const [loading, setLoading] = React.useState(false);
		const Lifetime = watch("lifeTimeSIUP", parseInt(sendData.lifeTimeSIUP) === 1 ? true : false);
		const [file,setFile] = React.useState(sendData?.file)
    	// const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')
		// const watchLifetime = watch("lifeTimeSIUP");
		// const end_date = watch("end_date")
		// console.log(end_date)
		const [fileErrors,setFileErrors] = React.useState([])
		const [isFileErrors,setIsFileErrors] = React.useState(false)

		const onSubmit = async data => {
			setData(data);
			props.save(data)
			// console.log(data);
		};

		const changeFileSiup = (e) => {
			setLoading(!loading);
			setIsFileErrors(false)
			setFileErrors([])
			props.upload('PVSIUP', e.target.files[0])
			.then((resp) => {
				setLoading(false);
				setValue("file_name", resp.data.data.name)
				setFile(resp.data.data.name)
				// setPlace_file('temp')
				// setTdpFileName(resp.data.data.name)
			})
			.catch((err) => {
				setLoading(false);
				// setTdpFileName('')
				setValue("file_name", '')
				toastr.error(err.data.message, err.data?.errors?.file[0])
				setIsFileErrors(true)
				setFileErrors(err.data?.errors)
			})
		}

		const handleLifeTime = (e) => {
			setValue("end_date", '')
		}

		const setData = (data) => {
			data.file = data.file_name;
			data.lifetime = data.lifeTimeSIUP ? 1 : 0
			if(data.lifetime === 1) { delete data.end_date }
			// delete data.file_name;
		}
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">

						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siup-number")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="number" ref={register({required: false})} className={(errors_response.number) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.number} placeholder="" disabled={has_draft_verification} />
								{errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:siup-file')} <span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} placeholder="" defaultValue={sendData.file} disabled={true} />
								{(sendData.file === "" || sendData.file === null) ? '' : <a className="pull-right" target="_blank" rel="noopener noreferrer" href="/" onClick={e => checkFileTempVendor(e,file)}> {t("common:Button.Download")} </a> }
								{errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
								{ isFileErrors &&
									Object.keys(fileErrors).map((item, i) => (
										<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
									))
								}  
								<FileUploadInformation idFileUpload="PVSIUP"/>
							</div>
							<div className="col-md-3">
								{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileSiup} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siup-business-group")}<span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="business_group" ref={register({required: false})} className={(errors_response.business_group) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.business_group} placeholder="" readOnly />
								{errors_response.business_group && <span className="text-danger"> {errors_response.business_group[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siup-valid-from")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="date" name="start_date" ref={register({required: false})} className={(errors_response.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.start_date} disabled={has_draft_verification} />
								{errors_response.start_date && <span className="text-danger"> {errors_response.start_date[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siup-valid-to")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="date" name="end_date" ref={register({required: false})} className={(errors_response.end_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.end_date} disabled={has_draft_verification || Lifetime} />
								{errors_response.end_date && <span className="text-danger"> {errors_response.end_date[0]} </span>}
								<div className="checkbox checkbox-css">
									<input type="checkbox" id="lifeTimeSIUP" name="lifeTimeSIUP" defaultChecked={parseInt(sendData.lifeTimeSIUP) === 1 ? true : false} ref={register({required: false})} disabled={has_draft_verification} onClick={(e) => handleLifeTime(e)}/>
									<label htmlFor="lifeTimeSIUP"> Berlaku Selamanya </label>
								</div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siup-published-by")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="issued_by" ref={register({required: false})} className={(errors_response.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.issued_by} disabled={has_draft_verification} />
								{errors_response.issued_by && <span className="text-danger"> {errors_response.issued_by[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Status</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{statusName(sendData.status) }</label></div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{props.t("profileVendor:status-expired")}</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{sendData.status_expired}</label></div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{props.t("profileVendor:status-verifikasi")}</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{statusVerifikasi(sendData.tipe_verifikasi) }</label></div>
							</div>
						</div>
					</div>
				</div>
				<div className="pull-right m-t-10 m-b-10">
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.siup.loadingButton}> 
							{props.siup.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
				</div>
			</form>
		)
}

export default withTranslation()(FormSiup);