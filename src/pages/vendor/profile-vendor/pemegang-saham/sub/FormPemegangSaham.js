import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
// import InputMask from 'react-input-mask';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormPemegangSaham = (props) => {
    const { t } = props;
    const { register, control, errors, handleSubmit, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const {has_draft_verification} = props;
    const sendData = props.data;
    const customStyles = {
        control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }
    const onSubmit = async data => {
        setData(data)
        if(data.shareholding <= 0){
            toastr.warning("Kepemilikan Saham Harus Lebih Dari 0")
        }else{
            if (props.uuid==="") {
                props.save(data) 
            }else{
                props.update(props.uuid, data)
            }
        }
    };
    const setData = (data) => {
        data.type = data.type.value
        delete data.file
    }

    const changeFileKTP = (e) => {
        setLoading(!loading);
        props.upload('PVKTP1', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("ktp_file", resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("ktp_file", '')
                toastr.error(err.data.message, err.data?.errors?.file[0])
            })
    }

    const changeFileNPWP = (e) => {
        setLoading(!loading);
        props.upload('PVNPWP', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("npwp_file", resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("npwp_file", '')
                toastr.error(err.data.message, err.data.status)
            })
    }



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                <p className="text-red">Note :  {t("profileVendor:pemegang-saham.saham-note")}</p>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.jenis")} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                        <Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								styles={(props.errors.type  || props.errors.type )? customStyles : {}}
								control={control}
								options={props.optionTypes} 
								onInputChange={props.handleInputChange}
								name="type" 
                                defaultValue={props.data.type}
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
							/>
                            {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                            {props.errors.type && <span className="text-danger"> {props.errors.type[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.nama")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} placeholder=""  defaultValue={props.data.name} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.name && <span className="text-danger"> {props.errors.name[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.nomor-npwp")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.npwp_no || props.errors.npwp_no) ? "form-control is-invalid" : "form-control"} name="npwp_no" ref={register()} placeholder=""  defaultValue={props.data.npwp_no} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.npwp_no && <span className="text-danger"> {props.errors.npwp_no[0]}  </span>}
                            {/* <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.npwp_no || props.errors.npwp_no) ? "form-control is-invalid" : "form-control"}
                                mask="99.999.999.9-999.999"
                                name="npwp_no"
                                defaultValue={props.data.npwp_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            /> */}
                            {props.errors.npwp_no && <span className="text-danger"> {props.errors.npwp_no[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.file-npwp")}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.npwp_file || props.errors.npwp_file) ? "form-control is-invalid" : "form-control"} name="npwp_file" ref={register({ required: false })} placeholder="" disabled={true}  defaultValue={props.data.npwp_file}  />
                            {(props.uuid!=="" && props.data.npwp_file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.npwp_file}` } > {t("common:Button.Download")} </a> : '' }
                            {props.errors.npwp_file && <span className="text-danger"> {props.errors.npwp_file[0]}  </span>}
                            <FileUploadInformation idFileUpload="PVNPWP"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" disabled={loading} onChange={changeFileNPWP} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.nomor-ktp")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.ktp_no || props.errors.ktp_no) ? "form-control is-invalid" : "form-control"} name="ktp_no" ref={register()} placeholder=""  defaultValue={props.data.ktp_no} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.ktp_no && <span className="text-danger"> {props.errors.ktp_no[0]}  </span>}
                            {/* <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.ktp_no || props.errors.ktp_no) ? "form-control is-invalid" : "form-control"}
                                mask="9999999999999999"
                                name="ktp_no"
                                defaultValue={props.data.ktp_no}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            /> */}
                            {props.errors.ktp_no && <span className="text-danger"> {props.errors.ktp_no[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.file-ktp")}</label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.ktp_file || props.errors.ktp_file) ? "form-control is-invalid" : "form-control"} name="ktp_file" ref={register({ required: false })} placeholder="" disabled={true}  defaultValue={props.data.ktp_file}  />
                            {(props.uuid!=="" && props.data.ktp_file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.ktp_file}` } > {t("common:Button.Download")} </a> : '' }
                            {props.errors.ktp_file && <span className="text-danger"> {props.errors.ktp_file[0]}  </span>}
                            <FileUploadInformation idFileUpload="PVKTP1"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" onChange={changeFileKTP} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pemegang-saham.kepemilikan")} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="number" step="0.01" className={(errors.shareholding || props.errors.shareholding) ? "form-control is-invalid" : "form-control"} name="shareholding" ref={register()} placeholder=""  defaultValue={props.data.shareholding} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.shareholding && <span className="text-danger"> {props.errors.shareholding[0]}  </span>}
                            {props.errors.pemegang_saham_rule && <span className="text-danger"> {props.errors.pemegang_saham_rule[0]}  </span>}
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
                    {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? "Update" : "Simpan"}</button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation()(FormPemegangSaham);