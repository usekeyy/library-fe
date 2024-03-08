import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import { toastr } from 'react-redux-toastr';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormPengalamanKerja = (props) => {
    const { t } = props;
    const { register, control, errors, handleSubmit, setValue, watch } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const {has_draft_verification} = props
    const use_nilai_kontrak = watch('nilai_kontrak', props.data.nilai_kontrak)
    const sendData = props.data;
    const onSubmit = async data => {
        setData(data)
        if(props.uuid === ""){
            props.save(data)
        }else{
            props.update(props.uuid,data)
        }
    };

    const clearSelect = (value) => {
        setValue("sub_bidang_usaha_id", '');
    };

    const handleChange = (e) => {
        if (e !== null) { clearSelect(null); props.getSubBidangUsaha(e.value) } else { clearSelect(null) };
    }

    const setData = (data) => {
        data.end_date = (data.end_date==="") ? null : data.end_date;
        data.start_date = (data.start_date==="") ? null : data.start_date;
        (data.bidang_usaha_id !== undefined && data.bidang_usaha_id !== null) ? data.bidang_usaha_id = data.bidang_usaha_id.value : data.bidang_usaha_id = "";
        (data.sub_bidang_usaha_id !== "" && data.sub_bidang_usaha_id !== null) ? data.sub_bidang_usaha_id = data.sub_bidang_usaha_id.value : data.sub_bidang_usaha_id = "";
        (data.currency_id !== undefined && data.currency_id !== null) ? data.currency_id = data.currency_id.value : data.currency_id = "";
        if(data.start_date === "" || data.start_date === null){ delete data.start_date } 
        if(data.end_date === "" || data.end_date === null){ delete data.end_date }
        console.log(data.nilai_kontrak)
        data.nilai_kontrak = data.nilai_kontrak && (parseInt( (data.nilai_kontrak.length > 3) ? data.nilai_kontrak.replace(/\./g,'') : data.nilai_kontrak ));
        delete data.file
    }

    const changeBast = (e) => {
        setLoading(!loading);
        if (e.target.files[0] !== undefined) {
            props.upload('BASTPK', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("bast_file", resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    setValue("bast_file", '')
                    toastr.error(err.data.message, err.data?.errors?.file[0])
                })
        } else {
            setValue("bast_file", '')
        }
    }

    const changeBPK = (e) => {
        if (e.target.files[0] !== undefined) {
            setLoading(!loading);
            props.upload('BPKPK1', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("pengalaman_file", resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    setValue("pengalaman_file", '')
                    toastr.error(err.data.message, err.data?.errors?.file[0])
                })
        } else {
            setValue('pengalaman_file', '')
        }
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:kompetensi.bidang-usaha")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                control={control}
                                options={props.optionBidangUsaha}
                                name="bidang_usaha_id"
                                isClearable
                                onChange={([selected]) => {
                                    handleChange(selected)
                                    return selected;
                                }}
                                styles={props.errors.bidang_usaha_id ? customStyles : {}}
                                defaultValue={props.data.bidang_usaha_id}
                                isLoading={props.loadings.bidangUsaha}
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.bidang_usaha_id && <span className="text-danger"> {props.errors.bidang_usaha_id[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:kompetensi.sub-bidang-usaha")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                control={control}
                                options={props.optionSubBidangUsaha}
                                defaultValue={props.data.sub_bidang_usaha_id}
                                name="sub_bidang_usaha_id"
                                isLoading={props.loadings.subBidangUsaha}
                                styles={props.errors.sub_bidang_usaha_id ? customStyles : {}}
                                isClearable
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.sub_bidang_usaha_id && <span className="text-danger"> {props.errors.sub_bidang_usaha_id[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.nama-paket")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nama_paket_pekerjaan || props.errors.nama_paket_pekerjaan) ? "form-control is-invalid" : "form-control"} name="nama_paket_pekerjaan" ref={register()} placeholder="" defaultValue={props.data.nama_paket_pekerjaan} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.nama_paket_pekerjaan && <span className="text-danger"> {props.errors.nama_paket_pekerjaan[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.lokasi-paket")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.lokasi_paket_pekerjaan || props.errors.lokasi_paket_pekerjaan) ? "form-control is-invalid" : "form-control"} name="lokasi_paket_pekerjaan" ref={register()} placeholder="" defaultValue={props.data.lokasi_paket_pekerjaan} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.lokasi_paket_pekerjaan && <span className="text-danger"> {props.errors.lokasi_paket_pekerjaan[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.nama-perusahaan")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.perusahaan_pemenang || props.errors.perusahaan_pemenang) ? "form-control is-invalid" : "form-control"} name="perusahaan_pemenang" ref={register()} placeholder="" defaultValue={props.data.perusahaan_pemenang} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.perusahaan_pemenang && <span className="text-danger"> {props.errors.perusahaan_pemenang[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">Contact Person </label>
                        <div className="col-md-7">
                            {/* <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.contact_person) ? "form-control is-invalid" : "form-control"}
                                mask="999999999999"
                                name="contact_person"
                                defaultValue={props.data.contact_person}
                            /> */}
                            <input type="text" className={(errors.contact_person || props.errors.contact_person) ? "form-control is-invalid" : "form-control"} name="contact_person" ref={register()} placeholder="" defaultValue={props.data.contact_person} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.contact_person && <span className="text-danger"> {props.errors.contact_person[0]}  </span>}
                            {/* <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="contact_person" ref={register()} placeholder="" /> */}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.nomor-telepon")}</label>
                        <div className="col-md-7">
                            <Controller
                                as={InputMask}
                                control={control}
                                className={(errors.nomor_telepon) ? "form-control is-invalid" : "form-control"}
                                mask="999999999999"
                                name="nomor_telepon"
                                defaultValue={props.data.nomor_telepon}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.nomor_telepon && <span className="text-danger"> {props.errors.nomor_telepon[0]}  </span>}
                            {/* <input type="text" className={(errors.nama_rekanan) ? "form-control is-invalid" : "form-control"} name="nomor_telepon" ref={register()} placeholder="" /> */}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.nomor-kontrak")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nomor_kontrak || props.errors.nomor_kontrak) ? "form-control is-invalid" : "form-control"} name="nomor_kontrak" ref={register()} placeholder="" defaultValue={props.data.nomor_kontrak} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.nomor_kontrak && <span className="text-danger"> {props.errors.nomor_kontrak[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.tanggal-mulai")}</label>
                        <div className="col-md-7">
                            <input type="date" className={(errors.start_date || props.errors.start_date) ? "form-control is-invalid" : "form-control"} name="start_date" ref={register()} placeholder="" defaultValue={props.data.start_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {props.errors.start_date && <span className="text-danger"> {props.errors.start_date[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.tanggal-akhir")}</label>
                        <div className="col-md-7">
                            <input type="date" className={(errors.end_date || props.errors.end_date) ? "form-control is-invalid" : "form-control"} name="end_date" ref={register()} placeholder="" defaultValue={props.data.end_date} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
                            {props.errors.end_date && <span className="text-danger"> {props.errors.end_date[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.mata-uang")}</label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                control={control}
                                options={props.optionCurrencies}
                                name="currency_id"
                                defaultValue={props.data.currency_id}
                                isClearable
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                        </div>
                        {props.errors.currency_id && <span className="text-danger"> {props.errors.currency_id[0]}  </span>}
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.nilai-kontrak")}</label>
                        <div className="col-md-7">
                            {/* <input type="number" className={(errors.nilai_kontrak || props.errors.nilai_kontrak) ? "form-control is-invalid" : "form-control"} name="nilai_kontrak" ref={register()} placeholder="" defaultValue={props.data.nilai_kontrak} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} /> */}
                            <Controller
                                name="nilai_kontrak"
                                control={control}
                                className={(errors.nilai_kontrak) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_nilai_kontrak}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.nilai_kontrak && <span className="text-danger"> {props.errors.nilai_kontrak[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.berita-acara")}</label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.bast_file || props.errors.bast_file) ? "form-control is-invalid" : "form-control"} name="bast_file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={props.data.bast_file} />
                            {(props.uuid!=="" && props.data.bast_file !== "" && props.data.bast_file!==null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.bast_file}` } > {t("common:Button.Download")} </a> : '' }
                            {props.errors.bast_file && <span className="text-danger"> {props.errors.bast_file[0]}  </span>}
                            <FileUploadInformation idFileUpload="BASTPK"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" disabled={loading} onChange={changeBast} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:pengalaman-kerja.bukti")}</label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.pengalaman_file || props.errors.pengalaman_file) ? "form-control is-invalid" : "form-control"} name="pengalaman_file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={props.data.pengalaman_file} />
                            {(props.uuid!=="" && props.data.pengalaman_file !== "" && props.data.pengalaman_file!==null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.pengalaman_file}` } > {t("common:Button.Download")} </a> : '' }
                            {props.errors.pengalaman_file && <span className="text-danger"> {props.errors.pengalaman_file[0]}  </span>}
                            <FileUploadInformation idFileUpload="BPKPK1"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({ required: false })} placeholder="" disabled={loading} onChange={changeBPK} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="pull-right m-t-10 m-b-10">
                        <div className="pull-right m-t-10 m-b-10">
                            {props.uuid !== '' && <button className="btn btn-sm btn-danger m-l-10" type="button" onClick={props.cancelBtn}>
                                {/* <i className="fas fa-spinner fa-pulse"></i>  */}
                                {t('Button.Batal')}
                            </button>}
                            {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-sm btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? "Update" : "Simpan"}</button>}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation()(FormPengalamanKerja);