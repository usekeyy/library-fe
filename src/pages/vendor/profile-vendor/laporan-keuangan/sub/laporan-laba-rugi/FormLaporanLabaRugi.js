import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import NumberFormat from 'react-number-format';
import {formatNumber} from '../../../../../../helpers/formatNumber';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormLaporanLabaRugi = (props) => {
    const {t} = props;
    const { register, control, handleSubmit, setValue, watch } = useForm({});
    const errors_response = props.laporan_laba_rugi.errors;
    const {sendData} = props.laporan_laba_rugi;
    const {has_draft_verification} = props;
    const [loading, setLoading] = React.useState(false)
    const [tahunLaporan, setTahunLaporan] = React.useState(sendData.tahun_laporan)
    const use_pendapatan = watch('pendapatan', sendData.pendapatan)
    const use_hpp = watch('hpp', sendData.hpp)
    const use_biaya_usaha = watch('biaya_usaha', sendData.biaya_usaha)
    const use_biaya_lain = watch('biaya_lain', sendData.biaya_lain)
    const use_pajak = watch('pajak', sendData.pajak)

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
            '#ddd' : 'red',
        })
    }
    
    const updateNumber = (e) => {
        const val = e.target.value;
        if (e.target.validity.valid) setTahunLaporan(e.target.value)
        else if (val === '' || val === '-') setTahunLaporan(val)
    }
    
    const onSubmit = async data => {
        setData(data);
        if(sendData.uuid !== ''){
            props.update(sendData.uuid, data)
        } else {
            props.save(data)
        }
        // console.log(data);
    };

    const changeFileLaporanNeraca = (e) => {
        setLoading(!loading);
        props.upload('PVLN02', e.target.files[0])
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
        data.currency_id = (typeof data.currency_id.value !== 'undefined') ? data.currency_id.value : "";
        data.tahun_laporan = tahunLaporan;
        data.pendapatan = parseInt( (data.pendapatan.length > 3) ? data.pendapatan.replace(/\./g,'') : data.pendapatan );
        data.hpp = parseInt( (data.hpp.length > 3) ? data.hpp.replace(/\./g,'') : data.hpp );
        data.laba_kotor = parseInt( (data.laba_kotor.length > 3) ? data.laba_kotor.replace(/\./g,'') : data.laba_kotor );
        data.biaya_usaha = parseInt( (data.biaya_usaha.length > 3) ? data.biaya_usaha.replace(/\./g,'') : data.biaya_usaha );
        data.biaya_lain = parseInt( (data.biaya_lain.length > 3) ? data.biaya_lain.replace(/\./g,'') : data.biaya_lain );
        data.pajak = parseInt( (data.pajak?.length > 3) ? data.pajak.replace(/\./g,'') : data.pajak );
        data.laba_setelah_pajak = parseInt( (data.laba_setelah_pajak.length > 3) ? data.laba_setelah_pajak.replace(/\./g,'') : data.laba_setelah_pajak );
        data.laba_usaha = parseInt( (data.laba_usaha.length > 3) ? data.laba_usaha.replace(/\./g,'') : data.laba_usaha );
        delete data.file_name
    }

    // laba_kotor = pendapatan - hpp
    // laba_usaha = laba kotor - biaya usaha - biaya lain
    // laba setelah pajak = laba usaha - pajak
    const pendapatan = (isNaN(parseInt(use_pendapatan))) ? 0 : parseInt( (use_pendapatan.length > 3) ? use_pendapatan.replace(/\./g,'') : use_pendapatan );
    const hpp = (isNaN(parseInt(use_hpp))) ? 0 : parseInt( (use_hpp.length > 3) ? use_hpp.replace(/\./g,'') : use_hpp );
    const biaya_usaha = (isNaN(parseInt(use_biaya_usaha))) ? 0 : parseInt( (use_biaya_usaha.length > 3) ? use_biaya_usaha.replace(/\./g,'') : use_biaya_usaha );
    const biaya_lain = (isNaN(parseInt(use_biaya_lain))) ? 0 : parseInt( (use_biaya_lain.length > 3) ? use_biaya_lain.replace(/\./g,'') : use_biaya_lain );
    const pajak = (isNaN(parseInt(use_pajak))) ? 0 : parseInt( (use_pajak.length > 3) ? use_pajak.replace(/\./g,'') : use_pajak );
    
    const laba_kotor = formatNumber(pendapatan - hpp);
    const laba_usaha = formatNumber((pendapatan - hpp) - biaya_usaha - biaya_lain);
    const laba_setelah_pajak = formatNumber(((pendapatan - hpp) - biaya_usaha - biaya_lain) - pajak);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-tahun")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input
                                value={tahunLaporan}
                                type="text"
                                name="tahun_laporan"
                                maxLength={4}
                                className={(errors_response.tahun_laporan) ? "form-control is-invalid" : "form-control"} 
                                onChange={(e) => updateNumber(e)}
                                pattern="^-?[0-9]\d*\.?\d*$"
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.tahun_laporan && <span className="text-danger"> {errors_response.tahun_laporan[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-matauang")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                        	<Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select} 
                            placeholder={props.loadings.currency ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                            isLoading={props.loadings.currency}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            name="currency_id"
                            styles={errors_response.currency_id ? customStyles : {}}
                            control={control}
                            options={props.laporan_laba_rugi.currencies} 
                            defaultValue={sendData.currency_id}
                            isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            rules={{ required: false }} />
                            {errors_response.currency_id && <span className="text-danger"> {errors_response.currency_id[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-pendapatan")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors_response.pendapatan) ? "form-control is-invalid" : "form-control"} name="pendapatan" ref={register({ required: false })} defaultValue={sendData.pendapatan} placeholder="" /> */}
                            <Controller
                                name="pendapatan"
                                control={control}
                                className={(errors_response.pendapatan) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_pendapatan}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.pendapatan && <span className="text-danger"> {errors_response.pendapatan[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-hpp")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors_response.hpp) ? "form-control is-invalid" : "form-control"} name="hpp" ref={register({ required: false })} defaultValue={sendData.hpp} placeholder="" /> */}
                            <Controller
                                name="hpp"
                                control={control}
                                className={(errors_response.hpp) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_hpp}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.hpp && <span className="text-danger"> {errors_response.hpp[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-laba-kotor")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.laba_kotor) ? "form-control is-invalid" : "form-control"} name="laba_kotor" ref={register({ required: false })} value={laba_kotor} placeholder="" disabled={true} />
                            {errors_response.laba_kotor && <span className="text-danger"> {errors_response.laba_kotor[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-biaya-usaha")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors_response.biaya_usaha) ? "form-control is-invalid" : "form-control"} name="biaya_usaha" ref={register({ required: false })} defaultValue={sendData.biaya_usaha} placeholder="" /> */}
                            <Controller
                                name="biaya_usaha"
                                control={control}
                                className={(errors_response.biaya_usaha) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_biaya_usaha}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.biaya_usaha && <span className="text-danger"> {errors_response.biaya_usaha[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-biaya-lain")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors_response.biaya_lain) ? "form-control is-invalid" : "form-control"} name="biaya_lain" ref={register({ required: false })} defaultValue={sendData.biaya_lain} placeholder="" /> */}
                            <Controller
                                name="biaya_lain"
                                control={control}
                                className={(errors_response.biaya_lain) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_biaya_lain}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.biaya_lain && <span className="text-danger"> {errors_response.biaya_lain[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-laba-usaha")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.laba_usaha) ? "form-control is-invalid" : "form-control"} name="laba_usaha" ref={register({ required: false })} value={laba_usaha} placeholder="" disabled={true} />
                            {errors_response.laba_usaha && <span className="text-danger"> {errors_response.laba_usaha[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-pajak")}</label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors_response.pajak) ? "form-control is-invalid" : "form-control"} name="pajak" ref={register({ required: false })} defaultValue={sendData.pajak} placeholder="" /> */}
                            <Controller
                                name="pajak"
                                control={control}
                                className={(errors_response.pajak) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_pajak}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.pajak && <span className="text-danger"> {errors_response.pajak[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-laba-rugi-laba-setelah-pajak")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.laba_setelah_pajak) ? "form-control is-invalid" : "form-control"} name="laba_setelah_pajak" ref={register({ required: false })} value={laba_setelah_pajak} placeholder="" disabled={true} />
                            {errors_response.laba_setelah_pajak && <span className="text-danger"> {errors_response.laba_setelah_pajak[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('profileVendor:laporan-laba-rugi-file')}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.file} placeholder="" disabled={true} />
                            {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
                            {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                            <FileUploadInformation idFileUpload="PVLN02"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileLaporanNeraca} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="pull-right m-t-10 m-b-10">
                    {sendData.uuid !== '' && <button className="btn btn-danger m-l-10" type="button" onClick={() => props.fetchLaporanLabaRugi()} disabled={props.laporan_laba_rugi.loadingButton}> 
                        {props.laporan_laba_rugi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Batal')}
                    </button>}
                    {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.laporan_laba_rugi.loadingButton}> 
                        {props.laporan_laba_rugi.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Submit')}
                    </button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormLaporanLabaRugi);