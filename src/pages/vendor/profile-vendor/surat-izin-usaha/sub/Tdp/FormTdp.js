import React from 'react';
import {useForm} from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import {statusName, statusVerifikasi} from '../../../../../../helpers/statusName';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'
import { checkFileTempVendor } from '../../../../../../helpers/globalHelper';

const FormTdp = (props) => {
		const { register, handleSubmit, setValue, watch } = useForm({});
		const {t} = props;
		const errors_response = props.tdp.errors;
		const {sendData} = props.tdp;
		const {has_draft_verification} = props;
		const Lifetime = watch("lifeTimeTDP", parseInt(sendData.lifeTimeTDP) === 1 ? true : false);
		const [file,setFile] = React.useState(sendData?.tdp_file)
    	// const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')
		const [fileErrors,setFileErrors] = React.useState([])
		const [isFileErrors,setIsFileErrors] = React.useState(false)

		// const watchLifetime = watch("lifeTimeTDP");
		const [loading, setLoading] = React.useState(false)
		const onSubmit = async data => {
			setData(data);
			props.save(data)
			// console.log(data);
		};

		const changeFileTdp = (e) => {
			setLoading(!loading);
			setIsFileErrors(false)
			setFileErrors([])
			props.upload('PVTDP1', e.target.files[0])
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
			setValue("tdp_date", '')
		}

		const setData = (data) => {
			data.tdp_file = data.file_name;
			data.lifetime = (Lifetime) ? 1 : 0;
			if(data.lifetime === 1) { delete data.tdp_date }
		}
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">

						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:tdp-number")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="tdp_number" ref={register({required: false})} className={(errors_response.tdp_number) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.tdp_number} placeholder="" disabled={has_draft_verification} />
								{errors_response.tdp_number && <span className="text-danger"> {errors_response.tdp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:tdp-file')} <span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.file_name) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.tdp_file} placeholder="" disabled={true} />
								{(sendData.tdp_file === "" || sendData.tdp_file === null) ? '' : <a className="pull-right" target="_blank" rel="noopener noreferrer" href="/" onClick={e => checkFileTempVendor(e,file)}> {t("common:Button.Download")} </a> }
								{errors_response.tdp_file && <span className="text-danger"> {errors_response.tdp_file[0]} </span>}
								<FileUploadInformation idFileUpload="PVTDP1"/>
								{ isFileErrors &&
									Object.keys(fileErrors).map((item, i) => (
										<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
									))
								}  
							</div>
							<div className="col-md-3">
								{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="tdp_file" ref={register({required: false})} placeholder="" onChange={changeFileTdp} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:tdp-valid")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="date" name="tdp_date" ref={register({required: false})} className={(errors_response.tdp_date) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.tdp_date} placeholder="" disabled={has_draft_verification || Lifetime} />
								{errors_response.tdp_date && <span className="text-danger"> {errors_response.tdp_date[0]} </span>}
								<div className="checkbox checkbox-css">
								<input type="checkbox" id="lifeTimeTDP" name="lifeTimeTDP" defaultChecked={parseInt(sendData.lifeTimeTDP) === 1 ? true : false} ref={register({required: false})} disabled={has_draft_verification} onClick={(e) => handleLifeTime(e)}/>
									<label htmlFor="lifeTimeTDP"> Berlaku Selamanya </label>
								</div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Status</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{statusName(sendData.status)}</label></div>
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
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.tdp.loadingButton}> 
							{props.tdp.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
				</div>
			</form>
		)
}

export default withTranslation()(FormTdp);