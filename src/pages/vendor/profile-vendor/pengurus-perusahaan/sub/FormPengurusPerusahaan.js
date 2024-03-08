import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import InputMask from 'react-input-mask';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const FormPengurusPerusahaan = (props) => {
    const { t } = props;
    const { register, control, errors, handleSubmit , setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const [fileErrors,setFileErrors] = React.useState([])
	const [isFileErrors,setIsFileErrors] = React.useState(false)
    const {has_draft_verification} = props;
    const sendData = props.data;
    const onSubmit = async data => {
        if (props.uuid==="") {
            props.save(data) 
        }else{
            props.update(props.uuid, data)
        }
    };

    const changeFileKTP = (e) => {
        setLoading(!loading);
        setIsFileErrors(false)
        setFileErrors([])
        props.upload('PVKTP1', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("ktp_file", resp.data.data.name)
        })
        .catch((err) => {
            setLoading(false);
            setValue("ktp_file", '')
            toastr.error(err.data.message, err.data?.errors?.file[0])
            setIsFileErrors(true)
            setFileErrors(err.data?.errors)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengurus.nama")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} placeholder="" defaultValue={props.data.name || ''} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengurus.nomor-identitas")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.ktp_no) ? "form-control is-invalid" : "form-control"}
                                // mask="9999999999999999"
                                name="ktp_no"
                                defaultValue={props.data.ktp_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.ktp_no && <span className="text-danger">{props.errors.ktp_no[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengurus.file-identitas")}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.ktp_file || props.errors.ktp_file) ? "form-control is-invalid" : "form-control"} name="ktp_file" ref={register()} placeholder="" defaultValue={props.data.ktp_file || ''} disabled={true} />
                            {(props.uuid!=="" && props.data.ktp_file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.ktp_file}` } > {t("common:Button.Download")} </a> : '' }
                            {props.errors.ktp_file && <span className="text-danger">{props.errors.ktp_file[0]}</span>}
                            <FileUploadInformation idFileUpload="PVKTP1" />
                            { isFileErrors &&
                                Object.keys(fileErrors).map((item, i) => (
                                    <p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
                                ))
                            }  
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" onChange={changeFileKTP} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengurus.jabatan")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.jabatan || props.errors.jabatan) ? "form-control is-invalid" : "form-control"} name="jabatan" ref={register()} placeholder="" defaultValue={props.data.jabatan || ''} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.jabatan && <span className="text-danger">{props.errors.jabatan[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengurus.no-hp")}</label>
                        <div className="col-md-7">
                            <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.phone_no) ? "form-control is-invalid" : "form-control"}
                                mask="999999999999"
                                name="phone_no"
                                defaultValue={props.data.phone_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.phone_no && <span className="text-danger">{props.errors.phone_no[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">Email </label>
                        <div className="col-md-7">
                            <input type="email" className={(errors.email || props.errors.email) ? "form-control is-invalid" : "form-control"} name="email" ref={register({})} placeholder="" defaultValue={props.data.email || ''} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.email && <span className="text-danger">{props.errors.email[0]}</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="pull-right m-t-10 m-b-10">
                        {props.uuid !== '' && <button className="btn btn-sm btn-danger m-l-10" type="button"  onClick={props.cancelBtn}> 
							{/* <i className="fas fa-spinner fa-pulse"></i>  */}
							{t('Button.Batal')}
						</button>}
                        {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? "Submit" : "submit"}</button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation()(FormPengurusPerusahaan);