import React from 'react';
import { useForm , Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import { toastr } from 'react-redux-toastr';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const FormAlatPerusahaan = (props) => {
    const {t} = props
    const { register, control, errors, handleSubmit , setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const {has_draft_verification} = props
    const sendData = props.data;
    const onSubmit = async data => {
        setData(data)
        if (props.uuid==="") {
            props.save(data) 
        }else{
            props.update(props.uuid, data)
        }
    };
    const setData = (data) => {
        delete data.file
    }
    const changeFile = (e) => {
        if(e.target.files[0] !== undefined){
        setLoading(!loading);
        props.upload('PVTA01', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("attachment", resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("attachment", '')
                toastr.error(err.data.message, err.data?.errors?.file[0])
            })
        }else{  
            setValue("attachment", '')
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <p className="text-red">Note : {t("profileVendor:tenaga-ahli.note")}</p>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.nama")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} placeholder=""  defaultValue={props.data.name} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.name && <span className="text-danger"> {props.errors.name[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.tanggal-lahir")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="date" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="born_date" ref={register()} placeholder="" defaultValue={props.data.born_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.born_date && <span className="text-danger"> {props.errors.born_date[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.nomor-ktp")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.ktp_no) ? "form-control is-invalid" : "form-control"}
                                mask="9999999999999999"
                                name="ktp_no"
                                defaultValue={props.data.ktp_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.ktp_no && <span className="text-danger"> {props.errors.ktp_no[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.pendidikan")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="education" ref={register()} placeholder="" defaultValue={props.data.education} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.education && <span className="text-danger"> {props.errors.education[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.pengalaman-kerja")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="work_experience" ref={register()} placeholder="" defaultValue={props.data.work_experience} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.work_experience && <span className="text-danger"> {props.errors.work_experience[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.tahun-pengalaman")}</label>
                        <div className="col-md-7">
                            <input type="number" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="experience_date" ref={register()} placeholder="" defaultValue={props.data.experience_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.experience_date && <span className="text-danger"> {props.errors.experience_date[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.sertifikasi")}<span className="text-danger">*</span> </label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="certification_name" ref={register()} placeholder="" defaultValue={props.data.certification_name} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.certification_name && <span className="text-danger"> {props.errors.certification_name[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.nomor-sertifikat")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="certification_number" ref={register()} placeholder="" defaultValue={props.data.certification_number} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.certification_number && <span className="text-danger"> {props.errors.certification_number[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:tenaga-ahli.lampiran")}<span className="text-danger">*</span></label>
                        <div className="col-md-5">                 
                            <input type="text" className={(errors.name) ? "form-control is-invalid" : "form-control"} name="attachment" ref={register({required: false})} placeholder="" disabled={true} defaultValue={props.data.attachment}/>
                            {props.errors.attachment && <span className="text-danger"> {props.errors.attachment[0]}  </span>}
                            <FileUploadInformation idFileUpload="PVTA01" />
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder=""  disabled={loading}  onChange={changeFile} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="pull-right m-t-10 m-b-10">{props.uuid !== '' && <button className="btn btn-sm btn-danger m-l-10" type="button"  onClick={props.cancelBtn}> 
							{/* <i className="fas fa-spinner fa-pulse"></i>  */}
							{t('Button.Batal')}
						</button>}
                    {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormAlatPerusahaan);