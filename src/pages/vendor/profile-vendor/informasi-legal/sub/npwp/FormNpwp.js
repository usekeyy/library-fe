import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import InputMask from 'react-input-mask';
import { statusName, statusVerifikasi } from '../../../../../../helpers/statusName';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation';
import { checkFileTempVendor } from '../../../../../../helpers/globalHelper';

const FormNpwp = (props) => {
	const { register, handleSubmit, setValue, control } = useForm({});
	const { t } = props;
	const errors_response = props.npwp.errors;
	const { sendData } = props.npwp;
	const {has_draft_verification} = props;
	const [loading, setLoading] = React.useState(false)
	const [file,setFile] = React.useState(sendData?.npwp_file)
    // const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')
	const [fileErrors,setFileErrors] = React.useState([])
	const [isFileErrors,setIsFileErrors] = React.useState(false)
	
	const onSubmit = async data => {
		setData(data);
		props.save(data)
		// console.log(data);
	};

	const changeFileNpwp = (e) => {
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

	const setData = (data) => {
		data.npwp_file = data.file_name;
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">

						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:npwp-number")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.npwp_number) ? "form-control is-invalid" : "form-control"}
									mask="99.999.999.9-999.999"
									name="npwp_number"
									disabled={has_draft_verification}
									defaultValue={sendData.npwp_number}
								/>
								{/* <input type="text" name="npwp_number" ref={register({required: false})} className={(errors_response.npwp_number) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.npwp_number} /> */}
								{errors_response.npwp_number && <span className="text-danger"> {errors_response.npwp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:npwp-file')} <span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.npwp_file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={sendData.npwp_file} />
								{(sendData.npwp_file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href="/" onClick={e => checkFileTempVendor(e,file)}> {t("common:Button.Download")} </a> : '' }
								{errors_response.npwp_file && <span className="text-danger"> {errors_response.npwp_file[0]} </span>}
								{ isFileErrors &&
									Object.keys(fileErrors).map((item, i) => (
										<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
									))
								}  
								<FileUploadInformation idFileUpload="PVSIUP"/>
							</div>
							<div className="col-md-3">
								{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="npwp_file" ref={register({ required: false })} onChange={changeFileNpwp} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:npwp-valid")} </label>
							<div className="col-md-7">
								<input type="date" name="npwp_date" ref={register({ required: false })} className={(errors_response.npwp_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.npwp_date} disabled={has_draft_verification} />
								{errors_response.npwp_date && <span className="text-danger"> {errors_response.npwp_date[0]} <br /></span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">Status</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{statusName(sendData.status)}</label></div>
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:status-verifikasi")}</label>
							<div className="col-md-7">
								<div className="m-t-10"><label>{statusVerifikasi(sendData.tipe_verifikasi) }</label></div>
							</div>
						</div>
					</div>
				</div>
				<div className="pull-right m-t-10 m-b-10">
					{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.npwp.loadingButton}>
						{props.npwp.loadingButton && <i className="fas fa-spinner fa-pulse"></i>}
						{t('Button.Submit')}
					</button>}
				</div>
			</form>
		</div>
	)
}

export default withTranslation()(FormNpwp);