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

const FormLaporanNeraca = (props) => {
    const {t} = props;
    const { register, control, handleSubmit, setValue, watch } = useForm({});
    // const watchAllFields = watch();
    const errors_response = props.laporan_neraca.errors;
    const {sendData} = props.laporan_neraca;
    const {has_draft_verification} = props;
    const [loading, setLoading] = React.useState(false)
    const [tahunLaporan, setTahunLaporan] = React.useState(sendData.tahun_laporan)
    
    const use_aktiva_lancar = watch('aktiva_lancar', sendData.aktiva_lancar);
    const use_aktiva_tetap_selain_tanah = watch('aktiva_tetap_selain_tanah', sendData.aktiva_tetap_selain_tanah);
    const use_aktiva_tetap_tanah = watch('aktiva_tetap_tanah', sendData.aktiva_tetap_tanah);
    const use_aktiva_tetap_lain = watch('aktiva_tetap_lain', sendData.aktiva_tetap_lain);
    const use_hutang_jangka_pendek = watch('hutang_jangka_pendek', sendData.hutang_jangka_pendek);
    const use_hutang_jangka_panjang = watch('hutang_jangka_panjang', sendData.hutang_jangka_panjang);
    const use_hutang_lain = watch('hutang_lain', sendData.hutang_lain);
    const use_permodalan = watch('permodalan', sendData.permodalan);
    // const [use_aktiva_lancar, setuse_aktiva_lancar] = React.useState(sendData.aktiva_lancar)
	console.log(use_aktiva_lancar);
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
        console.log(data);
    };

    const changeFileLaporanNeraca = (e) => {
        setLoading(!loading);
        props.upload('PVLN01', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("file_name", resp.data.data.name)
        })
        .catch((err) => {
            setLoading(false);
            setValue("file_name", '')
            toastr.error(err.data.message, err.data?.errors?.file[0])
        })
    }

    const setData = (data) => {
        data.file = data.file_name;
        data.tahun_laporan = tahunLaporan;
        data.aktiva_lancar = parseInt( (data.aktiva_lancar.length > 3) ? data.aktiva_lancar.replace(/\./g,'') : data.aktiva_lancar );
        data.aktiva_tetap_selain_tanah = parseInt( (data.aktiva_tetap_selain_tanah.length > 3) ? data.aktiva_tetap_selain_tanah.replace(/\./g,'') : data.aktiva_tetap_selain_tanah );
        data.aktiva_tetap_tanah = parseInt( (data.aktiva_tetap_tanah.length > 3) ? data.aktiva_tetap_tanah.replace(/\./g,'') : data.aktiva_tetap_tanah );
        data.aktiva_tetap_lain = parseInt( (data.aktiva_tetap_lain.length > 3) ? data.aktiva_tetap_lain.replace(/\./g,'') : data.aktiva_tetap_lain );
        data.hutang_jangka_pendek = parseInt( (data.hutang_jangka_pendek.length > 3) ? data.hutang_jangka_pendek.replace(/\./g,'') : data.hutang_jangka_pendek );
        data.hutang_jangka_panjang = parseInt( (data.hutang_jangka_panjang.length > 3) ? data.hutang_jangka_panjang.replace(/\./g,'') : data.hutang_jangka_panjang );
        data.hutang_lain = parseInt( (data.hutang_lain.length > 3) ? data.hutang_lain.replace(/\./g,'') : data.hutang_lain );
        data.permodalan = parseInt( (data.permodalan.length > 3) ? data.permodalan.replace(/\./g,'') : data.permodalan );
        data.nilai_aset = parseInt( (data.nilai_aset.length > 3) ? data.nilai_aset.replace(/[ ,.]/g,'') : data.nilai_aset );
        // data.nilai_aset = data.nilai_aset.replace(/[ ,.]/g,'');
        // data.nilai_aset = null;
        data.currency_id = (typeof data.currency_id.value !== 'undefined') ? data.currency_id.value : "";
        delete data.file_name
    }
		
    const aktiva_lancar = (isNaN(parseInt(use_aktiva_lancar))) ? 0 : parseInt( (use_aktiva_lancar.length > 3) ? use_aktiva_lancar.replace(/\./g,'') : use_aktiva_lancar );
    const aktiva_tetap_tanah = (isNaN(parseInt(use_aktiva_tetap_tanah))) ? 0 : parseInt( (use_aktiva_tetap_tanah.length > 3) ? use_aktiva_tetap_tanah.replace(/\./g,'') : use_aktiva_tetap_tanah );
    const aktiva_tetap_selain_tanah = (isNaN(parseInt(use_aktiva_tetap_selain_tanah))) ? 0 : parseInt( (use_aktiva_tetap_selain_tanah.length > 3) ? use_aktiva_tetap_selain_tanah.replace(/\./g,'') : use_aktiva_tetap_selain_tanah );
    const aktiva_tetap_lain = (isNaN(parseInt(use_aktiva_tetap_lain))) ? 0 : parseInt( (use_aktiva_tetap_lain.length > 3) ? use_aktiva_tetap_lain.replace(/\./g,'') : use_aktiva_tetap_lain );
    
    const pasiva_use_hutang_jangka_pendek = (isNaN(parseInt(use_hutang_jangka_pendek))) ? 0 : parseInt( (use_hutang_jangka_pendek.length > 3) ? use_hutang_jangka_pendek.replace(/\./g,'') : use_hutang_jangka_pendek );
    const pasiva_use_hutang_jangka_panjang = (isNaN(parseInt(use_hutang_jangka_panjang))) ? 0 : parseInt( (use_hutang_jangka_panjang.length > 3) ? use_hutang_jangka_panjang.replace(/\./g,'') : use_hutang_jangka_panjang );
    const pasiva_use_hutang_lain = (isNaN(parseInt(use_hutang_lain))) ? 0 : parseInt( (use_hutang_lain.length > 3) ? use_hutang_lain.replace(/\./g,'') : use_hutang_lain );
    const pasiva_use_permodalan = (isNaN(parseInt(use_permodalan))) ? 0 : parseInt( (use_permodalan.length > 3) ? use_permodalan.replace(/\./g,'') : use_permodalan );

    const nilai_asset = formatNumber(aktiva_lancar+aktiva_tetap_selain_tanah+aktiva_tetap_tanah+aktiva_tetap_lain);
    const total_pasiva = formatNumber(pasiva_use_hutang_jangka_pendek+pasiva_use_hutang_jangka_panjang+pasiva_use_hutang_lain+pasiva_use_permodalan)
    // const nilai_asset = 0
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <p className="text-red">Note : Total aktiva dan pasiva harus balance</p>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-tahun")}<span className="text-danger">*</span></label>
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
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-matauang")}<span className="text-danger">*</span></label>
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
                            options={props.laporan_neraca.currencies} 
                            defaultValue={sendData.currency_id}
                            isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            rules={{ required: false }} />
                            {errors_response.currency_id && <span className="text-danger"> {errors_response.currency_id[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-aktiva-lancar")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="aktiva_lancar"
                                control={control}
                                className={(errors_response.aktiva_lancar) ? "form-control is-invalid" : "form-control"} 
                                defaultValue={use_aktiva_lancar}
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.aktiva_lancar && <span className="text-danger"> {errors_response.aktiva_lancar[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-aktiva-selain")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="aktiva_tetap_selain_tanah"
                                control={control}
                                defaultValue={use_aktiva_tetap_selain_tanah}
                                className={(errors_response.aktiva_tetap_selain_tanah) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.aktiva_tetap_selain_tanah && <span className="text-danger"> {errors_response.aktiva_tetap_selain_tanah[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-aktiva-tanah")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="aktiva_tetap_tanah"
                                control={control}
                                defaultValue={use_aktiva_tetap_tanah}
                                className={(errors_response.aktiva_tetap_tanah) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.aktiva_tetap_tanah && <span className="text-danger"> {errors_response.aktiva_tetap_tanah[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-aktiva-lain")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="aktiva_tetap_lain"
                                control={control}
                                defaultValue={use_aktiva_tetap_lain}
                                className={(errors_response.aktiva_tetap_lain) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {/* <input type="number" className={(errors_response.aktiva_tetap_lain) ? "form-control is-invalid" : "form-control"} name="aktiva_tetap_lain" ref={register({ required: false })} defaultValue={sendData.aktiva_tetap_lain} placeholder="" /> */}
                            {errors_response.aktiva_tetap_lain && <span className="text-danger"> {errors_response.aktiva_tetap_lain[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-hutang-pendek")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="hutang_jangka_pendek"
                                control={control}
                                defaultValue={use_hutang_jangka_pendek}
                                className={(errors_response.hutang_jangka_pendek) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {/* <input type="number" className={(errors_response.hutang_jangka_pendek) ? "form-control is-invalid" : "form-control"} name="hutang_jangka_pendek" ref={register({ required: false })} defaultValue={sendData.hutang_jangka_pendek} placeholder="" /> */}
                            {errors_response.hutang_jangka_pendek && <span className="text-danger"> {errors_response.hutang_jangka_pendek[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-hutang-panjang")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="hutang_jangka_panjang"
                                control={control}
                                defaultValue={use_hutang_jangka_panjang}
                                className={(errors_response.hutang_jangka_panjang) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.hutang_jangka_panjang && <span className="text-danger"> {errors_response.hutang_jangka_panjang[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-hutang-lain")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="hutang_lain"
                                control={control}
                                defaultValue={use_hutang_lain}
                                className={(errors_response.hutang_lain) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.hutang_lain && <span className="text-danger"> {errors_response.hutang_lain[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-permodalan")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                name="permodalan"
                                control={control}
                                defaultValue={use_permodalan}
                                className={(errors_response.permodalan) ? "form-control is-invalid" : "form-control"} 
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                                disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {errors_response.permodalan && <span className="text-danger"> {errors_response.permodalan[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-nilai-asset")}/Total Aktiva<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.nilai_aset) ? "form-control is-invalid" : "form-control"} name="nilai_aset" ref={register({ required: false })} value={nilai_asset} placeholder="" disabled={true} />
                            {errors_response.nilai_aset && <span className="text-danger"> {errors_response.nilai_aset[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-neraca-total-pasiva")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.total_pasiva) ? "form-control is-invalid" : "form-control"} name="total_pasiva" ref={register({ required: false })} value={total_pasiva} placeholder="" disabled={true} />
                            {errors_response.total_pasiva && <span className="text-danger"> {errors_response.total_pasiva[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('profileVendor:laporan-neraca-file')}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.file} placeholder="" disabled={true} />
                            {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
                            {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                            <FileUploadInformation idFileUpload="PVLN01"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileLaporanNeraca} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="pull-right m-t-10 m-b-10">
                    {sendData.uuid !== '' && <button className="btn btn-danger m-l-10" type="button" onClick={() => props.fetchLaporanNeraca()} disabled={props.laporan_neraca.loadingButton}> 
                        {props.laporan_neraca.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Batal')}
                    </button>}
                    {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.laporan_neraca.loadingButton}> 
                        {props.laporan_neraca.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Submit')}
                    </button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormLaporanNeraca);