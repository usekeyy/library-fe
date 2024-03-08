import React from 'react';
import {useForm} from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const FormSil = (props) => {
		const { register, handleSubmit, setValue } = useForm({});
		const {t} = props;
		const errors_response = props.sil.errors;
		const {sendData} = props.sil;
		const {has_draft_verification} = props;
		const [loading, setLoading] = React.useState(false)
		const onSubmit = async data => {
			setData(data);
			// props.save(data)
			// console.log(data);
			sendData.uuid !== "" ? props.update(sendData.uuid, data) : props.save(data)
		};

		const changeFileSil = (e) => {
			setLoading(!loading);
			props.upload('PVSIU5', e.target.files[0])
			.then((resp) => {
				setLoading(false);
				setValue("file_name", resp.data.data.name)
				// setTdpFileName(resp.data.data.name)
			})
			.catch((err) => {
				setLoading(false);
				// setTdpFileName('')
				setValue("file_name", '')
				toastr.error(err.data.message, err.data?.errors?.file[0])
			})
		}

		const setData = (data) => {
			data.file = data.file_name;
		}
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">

						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:sil-number")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="number" ref={register({required: false})} className={(errors_response.number) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.number} disabled={has_draft_verification} />
								{errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:sil-name")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="name" ref={register({required: false})} className={(errors_response.name) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.name} disabled={has_draft_verification} />
								{errors_response.name && <span className="text-danger"> {errors_response.name[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:sil-file')} <span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} placeholder="" defaultValue={sendData.file} disabled={true} />
								{(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
								{errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
								<FileUploadInformation idFileUpload="PVSIU5"/>
							</div>
							<div className="col-md-3">
								{!has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="file" ref={register({required: false})} onChange={changeFileSil} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:sil-valid-from")} </label>
							<div className="col-md-7">
								<input type="date" name="start_date" ref={register({required: false})} className={(errors_response.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.start_date} disabled={has_draft_verification} />
								{errors_response.start_date && <span className="text-danger"> {errors_response.start_date[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:sil-valid-to")} </label>
							<div className="col-md-7">
								<input type="date" name="end_date" ref={register({required: false})} className={(errors_response.end_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.end_date} disabled={has_draft_verification} />
								{errors_response.end_date && <span className="text-danger"> {errors_response.end_date[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:sil-published-by")} </label>
							<div className="col-md-7">
								<input type="text" name="issued_by" ref={register({required: false})} className={(errors_response.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.issued_by} disabled={has_draft_verification} />
								{errors_response.issued_by && <span className="text-danger"> {errors_response.issued_by[0]} </span>}
							</div>
						</div>
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success pull-right m-b-10 m-l-10" type="submit" disabled={props.sil.loadingButton}> 
							{props.sil.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
						{sendData.uuid !== '' && !has_draft_verification && <button className="btn btn-danger m-b-10 m-l-10 pull-right" type="button" onClick={() => props.fetchSil()} disabled={props.sil.loadingButton}> 
							{props.sil.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Batal')}
						</button>}
					</div>
				</div>
			</form>
		)
}

export default withTranslation() (FormSil);