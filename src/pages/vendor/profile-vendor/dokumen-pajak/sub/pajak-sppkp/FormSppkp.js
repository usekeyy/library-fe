import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { statusName, statusVerifikasi } from '../../../../../../helpers/statusName';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormSppkp = (props) => {
	const { t } = props
	const { register, errors, handleSubmit, control, setValue, watch } = useForm({});
	const [loading, setLoading] = React.useState(false)
	const {sppkp_type} = props.parentState.tempData;
	const {has_draft_verification} = props;

	const sendData = props.data;
	const [file,setFile] = React.useState(sendData?.file)
    // const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')


	const Lifetime = watch("lifeTimeSPPKP", parseInt(sendData.lifeTimeSPPKP) === 1 ? true : false);
	// const watchLifetime = watch("lifeTimeSPPKP");
	const onSubmit = async data => {
		setData(data)
		props.save(data)
	};

	const handleLifeTime = (e) => {
		setValue("end_date", '')
	}

	const setData = (data) => {
		(data.type !== null && data.type !== undefined) ? data.type = data.type.value : data.type = "";
		data.lifetime = (Lifetime) ? 1 : 0;
		if(data.lifetime === 1) { delete data.end_date }
		delete data.files
		if (sppkp_type !== "SPPKP"){
			data.lifetime = 1
		}
	}

	const changeFile = (e) => {
		setLoading(!loading);
		if (e.target.files[0] !== undefined) {
			props.upload('SPPKP1', e.target.files[0])
				.then((resp) => {
					setLoading(false);
					setValue("file", resp.data.data.name)
					setFile(resp.data.data.name)
            		// setPlace_file('temp')
				})
				.catch((err) => {
					setLoading(false);
					setValue("file", '')
					toastr.error(err.data.message, err.data?.errors?.file[0])
				})
		} else {
			setValue("file", '')
		}
	}

	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}

	const onInputChange = (option, { action }) => {
		if (action === "input-change") {
			props.handleInputChange(option)
		}
	};

	const handleChangeSPPKP = (e) => {
		props.setSPPKP(e.value)
	}

	console.log(sppkp_type);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="row">
				<div className="col-md-12">

					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.jenis-dokumen')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								styles={props.errors.type ? customStyles : {}}
								control={control}
								options={props.optionsType}
								onInputChange={onInputChange}
								onChange={([selected]) => {
									handleChangeSPPKP(selected)
									return selected;
								}}
								name="type"
								defaultValue={props.data.type}
								isDisabled={has_draft_verification}
							/>
							{/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
							{props.errors.type && <span className="text-danger"> {props.errors.type[0]}  </span>}
						</div>
					</div>
					{sppkp_type === "SPPKP" && <div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.dikeluarkan')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="issued_by" className={(errors.issued_by || props.errors.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.issued_by} disabled={has_draft_verification} />
							{props.errors.issued_by && <span className="text-danger"> {props.errors.issued_by[0]}  </span>}
						</div>
					</div>}
					{sppkp_type === "SPPKP" && <div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.nomor')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" name="number" className={(errors.number || props.errors.number) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.number} disabled={has_draft_verification} />
							{props.errors.number && <span className="text-danger"> {props.errors.number[0]}  </span>}
						</div>
					</div>}
					{sppkp_type === "SPPKP" && <div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.berlaku-sejak')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="date" name="start_date" className={(errors.start_date || props.errors.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.start_date} disabled={has_draft_verification} />
							{props.errors.start_date && <span className="text-danger"> {props.errors.start_date[0]}  </span>}
						</div>
					</div>}
					{sppkp_type === "SPPKP" && <div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.berlaku-sampai')}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="date" name="end_date" className={(errors.date || props.errors.date) ? "form-control is-invalid" : "form-control"} placeholder="" ref={register()} defaultValue={props.data.end_date} disabled={has_draft_verification || Lifetime} />
							{props.errors.end_date && <span className="text-danger"> {props.errors.end_date[0]}  </span>}
							<div className="checkbox checkbox-css">
								<input type="checkbox" id="lifeTimeSPPKP" name="lifeTimeSPPKP" defaultChecked={parseInt(sendData.lifeTimeSPPKP) === 1 ? true : false} ref={register({required: false})} disabled={has_draft_verification} onClick={(e) => handleLifeTime(e)}/>
								<label htmlFor="lifeTimeSPPKP">{t('profileVendor:sppkp.berlaku-selamanya')}</label>
							</div>
						</div>
					</div>}
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:sppkp.file')}<span className="text-danger">*</span></label>
						<div className="col-md-5">
							<input type="text" className={(errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register()} placeholder="" disabled={true} defaultValue={props.data.file} />
							{((props.data.file === "" || (props.data.file === null || props.data.file === undefined ))) ? '' : <a className="pull-right" target="_blank" rel="noopener noreferrer" href="/" onClick={e => props.checkPlaceFile(e,file)}> {t("common:Button.Download")} </a> }
							{props.errors.file && <span className="text-danger"> {props.errors.file[0]}  </span>}
							<FileUploadInformation idFileUpload="SPPKP1"/>
						</div>
						<div className="col-md-3">
							{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
								<input type="file" name="files" ref={register({ required: false })} placeholder="" disabled={loading} onChange={changeFile} />
								<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
							</label>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">Status </label>
						<div className="col-md-7">
							<label>{statusName(props.data.status) }</label>
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">Status Expired</label>
						<div className="col-md-7">
							<label>{props.data.status_expired }</label>
							{console.log(props.data)}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t('profileVendor:status-verifikasi')}</label>
						<div className="col-md-7">
							<label>{statusVerifikasi(props.data.tipe_verifikasi) }</label>
						</div>
					</div>

				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<div className="pull-right m-t-10 m-b-10">
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>}
					</div>
				</div>
			</div>
		</form>
	)
}

export default withTranslation()(FormSppkp);