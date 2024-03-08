import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormLaporanLain = (props) => {
    const {t} = props;
    const { register, control, handleSubmit, setValue } = useForm({});
    const errors_response = props.laporan_lain.errors;
    const {sendData} = props.laporan_lain;
    const {has_draft_verification} = props;
    const [loading, setLoading] = React.useState(false)
    const [tahunLaporan, setTahunLaporan] = React.useState(sendData.tahun_laporan)

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
        props.upload('PVLN03', e.target.files[0])
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
        data.jenis_laporan = (typeof data.jenis_laporan.value !== 'undefined') ? data.jenis_laporan.value : "";
        data.tahun_laporan = tahunLaporan;
        delete data.file_name
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
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
                        <label className="col-md-3 col-form-label">{t("profileVendor:laporan-lain-jenis-laporan")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                        	<Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select} 
                            placeholder={props.loadings.jenis_laporan ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                            isLoading={props.loadings.jenis_laporan}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            name="jenis_laporan"
                            styles={errors_response.jenis_laporan ? customStyles : {}}
                            control={control}
                            options={props.laporan_lain.jenis_laporans} 
                            defaultValue={sendData.jenis_laporan}
                            isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            rules={{ required: false }} />
                            {errors_response.jenis_laporan && <span className="text-danger"> {errors_response.jenis_laporan[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('profileVendor:laporan-neraca-file')}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.file} placeholder="" disabled={true} />
                            {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
                            {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                            <FileUploadInformation idFileUpload="PVLN03"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileLaporanNeraca} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="pull-right m-t-10 m-b-10">
                    {sendData.uuid !== '' && <button className="btn btn-danger m-l-10" type="button" onClick={() => props.fetchLaporanLain()} disabled={props.laporan_lain.loadingButton}> 
                        {props.laporan_lain.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Batal')}
                    </button>}
                    {(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.laporan_lain.loadingButton}> 
                        {props.laporan_lain.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Submit')}
                    </button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormLaporanLain);