import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import { statusName, statusVerifikasi } from '../../../../../../helpers/statusName';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation';
import { checkFileTempVendor } from '../../../../../../helpers/globalHelper';

const FormPaktaIntegritas = (props) => {
    const {t} = props;
    const { register, handleSubmit, setValue } = useForm({});
    const errors_response = props.pakta_integritas.errors;
    const {sendData} = props.pakta_integritas;
	const {has_draft_verification} = props;
    const [loading, setLoading] = React.useState(false)
    const [file,setFile] = React.useState(sendData?.file)
    // const [place_file,setPlace_file] = React.useState((sendData?.tipe_verifikasi === 'sudah_diverifikasi' || sendData?.tipe_verifikasi === 'tambah_data' || sendData?.tipe_verifikasi === 'submit_pendaftaran') ? 'vendor' : 'temp')

      
    const onSubmit = async data => {
        setData(data);
        props.save(data)
        // console.log(data);
    };

    const changeFile = (e) => {
        setLoading(!loading);
        props.upload('PVPI01', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("file_name", resp.data.data.name)
            setFile(resp.data.data.name)
            // setPlace_file('temp')
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
        data.status_approval = sendData.status_approval;
        delete data.file_name
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    {sendData.status_approval === 'setuju' && <div>
                        <div className="form-group row m-b-15">
                            <label className="col-md-3 col-form-label">{t('profileVendor:pakta-integritas-file')}</label>
                            <div className="col-md-5">
                                <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={sendData.file} placeholder="" disabled={true} />
                                {(sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href="/" onClick={e => checkFileTempVendor(e,file)}> {t("common:Button.Download")} </a> : '' }
                                {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
                                <FileUploadInformation idFileUpload="PVPI01"/>
                            </div>
                            <div className="col-md-3">
                                {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                </label>}
                            </div>
                        </div>
                        <div className="form-group row m-b-15">
                            <label className="col-md-3 col-form-label">Status</label>
                            <div className="col-md-7">
                                <div className="m-t-10">{statusName(sendData.status)}</div>
                            </div>
                        </div>
                        <div className="form-group row m-b-15">
                            <label className="col-md-3 col-form-label">{t("profileVendor:status-verifikasi")}</label>
                            <div className="col-md-7">
                                <div className="m-t-10">{statusVerifikasi(sendData.tipe_verifikasi)}</div>
                            </div>
                        </div>
                    </div>}
                   {props.isVendor && !has_draft_verification && sendData.uuid === '' && <center>
                        <button className="btn btn-danger m-l-10" type="button" onClick={() => props.handleStatus("tolak")} disabled={props.pakta_integritas.loadingButton}> 
                            {props.pakta_integritas.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                            {(sendData.status_approval === 'tolak' && props.pakta_integritas.loadingButton === false) && <i className="fas fa-check"></i>}
                            {t('Button.Tolak')}
                        </button>
                        <button className="btn btn-success m-l-10" type="button" onClick={() => props.handleStatus("setuju")} disabled={props.pakta_integritas.loadingButton}> 
                            {props.pakta_integritas.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                            {(sendData.status_approval === 'setuju' && props.pakta_integritas.loadingButton === false) && <i className="fas fa-check"></i>}
                            {t('Button.Setuju')}
                        </button>
                        <br />
                        {errors_response.status_approval && <span className="text-danger"> {errors_response.status_approval[0]} </span>}
                    </center>}
                    <div className="pull-right m-t-10 m-b-10">
                    {props.isVendor && !has_draft_verification && sendData.status_approval === 'setuju' && <button className="btn btn-success m-l-10" type="submit" disabled={props.pakta_integritas.loadingButton}> 
                        {props.pakta_integritas.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
                        {t('Button.Submit')}
                    </button>}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormPaktaIntegritas);