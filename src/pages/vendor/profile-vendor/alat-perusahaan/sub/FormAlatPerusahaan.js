import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';

const FormAlatPerusahaan = (props) => {
    const {t} = props;
    const { register , errors, handleSubmit } = useForm({});
    const {has_draft_verification} = props
    const sendData = props.data;
    const onSubmit = async data => {
        if (props.uuid==="") {
            props.save(data) 
        }else{
            props.update(props.uuid, data)
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                  
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.nama")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.name) ? "form-control is-invalid" : "form-control"} name="name"  defaultValue={props.data.name} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.jumlah")}</label>
                        <div className="col-md-7">
                            <input type="number" className={(errors.qty) ? "form-control is-invalid" : "form-control"} name="qty"  defaultValue={props.data.qty} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.pengukuran")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.measurement) ? "form-control is-invalid" : "form-control"} name="measurement"  defaultValue={props.data.measurement} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.merk")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.merk) ? "form-control is-invalid" : "form-control"} name="merk"  defaultValue={props.data.merk} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.kondisi")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.condition) ? "form-control is-invalid" : "form-control"} name="condition"  defaultValue={props.data.condition} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.lokasi")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.location) ? "form-control is-invalid" : "form-control"} name="location"  defaultValue={props.data.location} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.kepemilikan")}<span className="text-danger">*</span> </label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.ownership) ? "form-control is-invalid" : "form-control"} name="ownership"  defaultValue={props.data.ownership} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.ownership && <span className="text-danger">{props.errors.ownership[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:alat-mesin.keterangan")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.information) ? "form-control is-invalid" : "form-control"} name="information"  defaultValue={props.data.information} ref={register()} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
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
                        {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation()  (FormAlatPerusahaan);