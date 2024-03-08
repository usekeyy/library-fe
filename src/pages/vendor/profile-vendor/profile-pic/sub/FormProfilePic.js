import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import InputMask from 'react-input-mask';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const FormProfilePic = (props) => {
    const { t } = props;
    const { register, control, errors, handleSubmit , setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const [fileErrors,setFileErrors] = React.useState([])
	const [isFileErrors,setIsFileErrors] = React.useState(false)

    const {has_draft_verification} = props;
    const sendData = props.data;
    const onSubmit = async data => {
        let datas = data;
        delete datas.file;
        datas.vendor_id = props.vendor_id;
        datas.pic_main = datas.pic_main ? "y" : "n";
        // console.log(datas)
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
                setValue("pic_ktp_file", resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("pic_ktp_file", '')
                toastr.error(err.data.message, err.data.status)
                setIsFileErrors(true)
				setFileErrors(err.data?.errors)
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.nama")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.pic_name || props.errors.pic_name) ? "form-control is-invalid" : "form-control"} name="pic_name" ref={register()} placeholder="" defaultValue={props.data.pic_name || ''} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.pic_name && <span className="text-danger">{props.errors.pic_name[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.nomor-ktp")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.pic_ktp_no) ? "form-control is-invalid" : "form-control"}
                                mask="9999999999999999"
                                name="pic_ktp_no"
                                defaultValue={props.data.pic_ktp_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {/* <input type="number" className={(errors.pic_ktp_no || props.errors.pic_ktp_no) ? "form-control is-invalid" : "form-control"} name="pic_ktp_no" ref={register()} placeholder="" /> */}
                            {props.errors.pic_ktp_no && <span className="text-danger">{props.errors.pic_ktp_no[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.file-ktp")}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.pic_ktp_file || props.errors.pic_ktp_file) ? "form-control is-invalid" : "form-control"} name="pic_ktp_file" ref={register()} placeholder="" disabled={true} defaultValue={props.data.pic_ktp_file || ''} />
                            {props.errors.pic_ktp_file && <span className="text-danger">{props.errors.pic_ktp_file[0]}</span>}
                            {( props.data.pic_ktp_file !== "" && props.data.pic_ktp_file!==null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.pic_ktp_file}` } > {t("common:Button.Download")} </a> : '' }
                            <FileUploadInformation idFileUpload="PVKTP1"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" onChange={changeFileKTP} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                                {/* <FileUploadInformation idFileUpload="PVKTP1"/> */}
                                { isFileErrors &&
									Object.keys(fileErrors).map((item, i) => (
										<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
									))
								}  
                            </label>}
                        </div>
                        
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.no-hp")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="number" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} className={(errors.pic_phone_no || props.errors.pic_phone_no) ? "form-control is-invalid" : "form-control"} name="pic_phone_no" ref={register()} placeholder="" defaultValue={props.data.pic_phone || ''} />
                            {props.errors.pic_phone_no && <span className="text-danger">{props.errors.pic_phone_no[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.email")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="email" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} className={(errors.pic_email || props.errors.pic_email) ? "form-control is-invalid" : "form-control"} name="pic_email" ref={register()} placeholder="" defaultValue={props.data.pic_email || ''} />
                            {props.errors.pic_email && <span className="text-danger">{props.errors.pic_email[0]}</span>}
                        </div>
                    </div>
                    <div className="checkbox row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.email-utama")}<span className="text-danger">*</span></label>
                        <div className="col-md-1">
                            <input style={{width: "30px", height: "20px", marginTop: "5px"}} type="checkbox" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} className={(errors.main || props.errors.main) ? "is-invalid" : ""} name="pic_main" ref={register()} placeholder="" defaultChecked={props.data.pic_email_utama} />
                            {props.errors.main && <span className="text-danger">{props.errors.main[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pic.jabatan")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.pic_jabatan || props.errors.pic_jabatan) ? "form-control is-invalid" : "form-control"} name="pic_jabatan" ref={register()} placeholder="" defaultValue={props.data.pic_jabatan || ''} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.pic_jabatan && <span className="text-danger">{props.errors.pic_jabatan[0]}</span>}
                        </div>
                    </div>
                    {/* <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">Status </label>
                        <div className="col-md-7">
                            <label><label>{statusName(props.data.status) }</label></label>
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">Status Verifikasi </label>
                        <div className="col-md-7">
                            <label><label>{statusVerifikasi(props.data.tipe_verifikasi) }</label></label>
                        </div>
                    </div> */}
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

export default withTranslation()(FormProfilePic);