import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const FormSuratKetFiskal = (props) => {
	const { t } = props
	const { register, errors, handleSubmit, setValue } = useForm({});
	const [loading, setLoading] = React.useState(false)
	const {has_draft_verification} = props;
	const sendData = props.data;
	const [file,setFile] = React.useState(sendData?.file)
    const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')
	const [fileErrors,setFileErrors] = React.useState([])
	const [isFileErrors,setIsFileErrors] = React.useState(false)

	const onSubmit = async data => {
		setData(data)
		if (props.uuid === "") {
			props.save(data)
		} else {
			props.update(props.uuid, data)
		}
	};

	const changeFile = (e) => {
		if (e.target.files[0] !== undefined) {
			setLoading(!loading);
			setFileErrors([])
			props.upload('PVFS01', e.target.files[0])
				.then((resp) => {
					setLoading(false);
					setValue("file", resp.data.data.name)
					setFile(resp.data.data.name)
            		setPlace_file('temp')
				})
				.catch((err) => {
					setLoading(false);
					setValue("file", '')
					toastr.error(err.data.message, err.data?.errors?.file[0])
					setIsFileErrors(true)
					setFileErrors(err.data?.errors)
				})
		} else {
			setValue('file', '')
			setFileErrors([])
			setIsFileErrors(false)
		}
	}

	const setData = (data) => {
		data.the = props.vendor_uuid
		delete data.files
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="row">
				<div className="col-md-12">

					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.dikeluarkan')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="issued_by" className={(errors.issued_by || props.errors.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register({ required: false })} defaultValue={props.data.issued_by} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.issued_by && <span className="text-danger"> {props.errors.issued_by[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:fiskal.nomor')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="number" className={(errors.number || props.errors.number) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register({ required: false })} defaultValue={props.data.number} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.number && <span className="text-danger"> {props.errors.number[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.berlaku-sejak')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="date" name="start_date" className={(errors.start_date || props.errors.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register({ required: false })} defaultValue={props.data.start_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.start_date && <span className="text-danger"> {props.errors.start_date[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.berlaku-sampai')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="date" name="end_date" className={(errors.end_date || props.errors.end_date) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register({ required: false })} defaultValue={props.data.end_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.end_date && <span className="text-danger"> {props.errors.end_date[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:fiskal.file')}<span className="text-danger">*</span></label>
						<div className="col-md-5">
							<input type="text" className={(errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={props.data.file} />
							{(props.uuid!=="" && props.data.file !== "" && props.data.file !== null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file}/${file}` } > {t("common:Button.Download")} </a> : '' }
							{ isFileErrors &&
								Object.keys(fileErrors).map((item, i) => (
									<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
								))
							}  
							{errors.file && <span className="text-danger"> {props.errors.file[0]}  </span>}
							<FileUploadInformation idFileUpload="PVFS01"/>
						</div>
						<div className="col-md-3">
							{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
								<input type="file" name="files" ref={register({ required: false })} placeholder="" disabled={loading} onChange={changeFile} />
								<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
							</label>}
						</div>
					</div>

				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<div className="pull-right m-t-10 m-b-10">
						{props.uuid !== '' && <button className="btn btn-sm btn-danger m-l-10" type="button" onClick={props.cancelBtn}>
							{/* <i className="fas fa-spinner fa-pulse"></i>  */}
							{t('Button.Batal')}
						</button>}
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? "Update" : "Simpan"}</button>}
					</div>
				</div>
			</div>
		</form>
	)
}

export default withTranslation()(FormSuratKetFiskal);