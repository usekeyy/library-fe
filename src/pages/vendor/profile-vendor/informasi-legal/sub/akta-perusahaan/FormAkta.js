import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormAkta = (props) => {
    const {t} = props;
    const { register, control, errors, handleSubmit, setValue } = useForm({});
    const errors_response = props.akta.errors;
    const {sendData} = props.akta;
    const [loading, setLoading] = React.useState(false)
    const {has_draft_verification} = props;
    const [file_akta,setFile_akta] = React.useState(sendData?.file)
    const [place_file_akta,setPlace_file_akta] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')
    // let file_akta = sendData?.file;
    // let place_file_akta = 'vendor';
    const [fileErrorsAkta,setFileErrorsAkta] = React.useState([])
	const [isFileErrorsAkta,setIsFileErrorsAkta] = React.useState(false)
    const [fileErrorsMenHum,setFileErrorsMenHum] = React.useState([])
	const [isFileErrorsMenHum,setIsFileErrorsMenHum] = React.useState(false)
    
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
            '#ddd' : 'red',
        })
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

    const changeFileAkta = (e) => {
        setLoading(!loading);
        setIsFileErrorsAkta(false)
        setFileErrorsAkta([])
        props.upload('PVL001', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("file_name", resp.data.data.name)
            setFile_akta(resp.data.data.name)
            setPlace_file_akta('temp')
            // file_akta = resp.data.data.name
            // place_file_akta = 'temp'

            console.log(file_akta)
            // setTdpFileName(resp.data.data.name)
        })
        .catch((err) => {
            setLoading(false);
            // setTdpFileName('')
            setValue("file_name", '')
            toastr.error(err.data?.message, err.data?.errors?.file[0])
            setIsFileErrorsAkta(true)
            setFileErrorsAkta(err.data?.errors)
        })
    }

    const changeFileMenkumham = (e) => {
        setLoading(!loading);
        setIsFileErrorsMenHum(false)
        setFileErrorsMenHum([])
        props.upload('PVL002', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("menkumham_file_name", resp.data.data.name)
            // setTdpFileName(resp.data.data.name)
        })
        .catch((err) => {
            setLoading(false);
            // setTdpFileName('')
            setValue("menkumham_file_name", '')
            toastr.error(err.data.message, err.data?.errors?.file[0])
            setIsFileErrorsMenHum(true)
            setFileErrorsMenHum(err.data?.errors)
        })
    }

    const setData = (data) => {
        data.file = data.file_name;
        data.type = (typeof data.type.value !== 'undefined') ? data.type.value : "";
        data.menkumham_file = data.menkumham_file_name;
        data.notaris_name = (data.notaris_name === "") ? null : data.notaris_name;
        data.notaris_address = (data.notaris_address === "") ? null : data.notaris_address;
        // data.menkumham_date = (data.menkumham_date === "") ? null : data.menkumham_date;
        data.menkumham_file = (data.menkumham_file_name === "") ? null : data.menkumham_file;
        delete data.file_name
        delete data.menkumham_file_name
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                {console.log(file_akta)}
                <div className="col-md-12">
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:akta-type")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select} 
                            placeholder={props.loadings.akta_type ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                            isLoading={props.loadings.akta_type}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            name="type"
                            styles={errors_response.type ? customStyles : {}}
                            // onInputChange={props.handleInputChange}
                            control={control}
                            options={[
                                { value: "Akta Pendirian", label: "Akta Pendirian" },
                                { value: "Akta Perubahan", label: "Akta Perubahan" }
                            ]} 
                            defaultValue={sendData.type}
                            isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            rules={{ required: false }} />
                            {errors_response.type && <span className="text-danger"> {errors_response.type[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:akta-number")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.number) ? "form-control is-invalid" : "form-control"} name="number" ref={register({ required: false })} defaultValue={sendData.number} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('profileVendor:akta-file')}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.file} placeholder="" disabled={true} />
                            {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file_akta}/${file_akta}` } > {t("common:Button.Download")} </a> : '' }
                            {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                            { isFileErrorsAkta &&
								Object.keys(fileErrorsAkta).map((item, i) => (
									<p><span className="text-danger" key={i}><b>*</b> {fileErrorsAkta[item][0]}</span></p>
								))
							}  
                            <FileUploadInformation idFileUpload="PVL001"/>
                        </div>
                        <div className="col-md-3">
                            {((props.isVendor === false || !has_draft_verification)) && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileAkta} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>}
                        </div>
                        
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:akta-date")}  <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="date" className={(errors.date) ? "form-control is-invalid" : "form-control"} name="date" ref={register({ required: false })} defaultValue={sendData.date} placeholder="dd-mm-yyyy" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {errors_response.date && <span className="text-danger"> {errors_response.date[0]} </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:notaris-name")} </label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.notaris_name) ? "form-control is-invalid" : "form-control"} name="notaris_name" ref={register({ required: false })} defaultValue={sendData.notaris_name} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {errors_response.notaris_name && <span className="text-danger"> {errors_response.notaris_name[0]} </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:notaris-address")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.notaris_address) ? "form-control is-invalid" : "form-control"} name="notaris_address" defaultValue={sendData.notaris_address} ref={register({ required: false })} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {errors_response.notaris_address && <span className="text-danger"> {errors_response.notaris_address[0]} </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:menkumham-sk-date")}</label>
                        <div className="col-md-7">
                            <input type="date" className={(errors.menkumham_date) ? "form-control is-invalid" : "form-control"} name="menkumham_date" defaultValue={sendData.menkumham_date} ref={register({ required: false })} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                            {errors_response.menkumham_date && <span className="text-danger"> {errors_response.menkumham_date[0]} </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('profileVendor:menkumham-sk-file')}</label>
                        <div className="col-md-5">
                            <input type="text" className={(errors_response.menkumham_file_name) ? "form-control is-invalid" : "form-control"} name="menkumham_file_name" ref={register({required: false})} defaultValue={sendData.menkumham_file} placeholder="" disabled={true} />
                            {(sendData.uuid !== "" && sendData.menkumham_file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.menkumham_file}` } > {t("common:Button.Download")} </a> : '' }
                            {errors_response.menkumham_file && <span className="text-danger"> {errors_response.menkumham_file[0]} </span>}
                            { isFileErrorsMenHum &&
								Object.keys(fileErrorsMenHum).map((item, i) => (
									<p><span className="text-danger" key={i}><b>*</b> {fileErrorsMenHum[item][0]}</span></p>
								))
							}  
                            <FileUploadInformation idFileUpload="PVL002"/>
                        </div>
                        <div className="col-md-3">
                            {((props.isVendor === false || !has_draft_verification)) && <label className="custom-file-upload">
                                <input type="file" name="menkumham_file" ref={register({required: false})} placeholder="" onChange={changeFileMenkumham} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                    <div className="pull-right m-t-10 m-b-10">
						{sendData.uuid !== '' && <button className="btn btn-danger m-l-10" type="button" onClick={() => props.fetchAkta()} disabled={props.akta.loadingButton}> 
							{props.akta.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Batal')}
						</button>}
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.akta.loadingButton}> 
							{props.akta.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
				    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormAkta);