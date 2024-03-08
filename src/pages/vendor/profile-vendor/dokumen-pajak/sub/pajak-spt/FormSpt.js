import React from 'react';
import { useForm } from 'react-hook-form';
import { toastr } from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const FormSpt = (props) => {
	const { t } = props;
	const { register, errors, handleSubmit, setValue } = useForm({});
	const [loading, setLoading] = React.useState(false)
	const {has_draft_verification} = props;
	const sendData = props.data;

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
			props.upload('PVSPT1', e.target.files[0])
				.then((resp) => {
					setLoading(false);
					setValue("file", resp.data.data.name)
				})
				.catch((err) => {
					setLoading(false);
					setValue("file", '')
					toastr.error(err.data.message, err.data?.errors?.file[0])
				})
		} else {
			setValue('file', '')
		}
	}

	const setData = (data) => {
		delete data.files
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="row">
				<div className="col-md-12">

					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.dikeluarkan')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="issued_by" className={(errors.issued_by || props.errors.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.issued_by} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.issued_by && <span className="text-danger"> {props.errors.issued_by[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:spt-tahunan.nomor')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="number" className={(errors.number || props.errors.number) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.number} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.number && <span className="text-danger"> {props.errors.number[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:spt-tahunan.tanggal')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="date" name="date" className={(errors.date || props.errors.date) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
							{props.errors.date && <span className="text-danger"> {props.errors.date[0]}  </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:spt-tahunan.file')}<span className="text-danger">*</span> </label>
						<div className="col-md-5">
							<input type="text" className={(errors.file || props.errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={props.data.file} />
							{(props.uuid!=="" && props.data.file !== "" && props.data.file !== null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.file}` } > {t("common:Button.Download")} </a> : '' }
							{props.errors.file && <span className="text-danger"> {props.errors.file[0]}  </span>}
							<FileUploadInformation idFileUpload="PVSPT1"/>
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
						{props.uuid !== '' && props.isVendor && <button className="btn btn-sm btn-danger m-l-10" type="button" onClick={props.cancelBtn}>
							{t('Button.Batal')}
						</button>}
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("common:Button.Submit")}</button>}
					</div>
				</div>
			</div>
		</form>
	)
}

export default withTranslation()(FormSpt);