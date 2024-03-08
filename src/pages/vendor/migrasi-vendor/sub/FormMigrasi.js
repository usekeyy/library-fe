import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
// import FileUploadInformation from '../../../../components/upload/FileUploadInformation';

const FormMigrasi = (props) => {
    // const {t} = props;
    const { register , errors, handleSubmit, setValue } = useForm({});
    const [loadingUpload, setLoadingUpload] = React.useState(false);
    const [error,setError] = React.useState([])
    // const {has_draft_verification} = props
    // const sendData = props.data;
    const onSubmit = async data => {
        props.setStateTab('0')
        console.log(data.file[0])
        setLoadingUpload(true)
        props.upload(data.file[0])
        .then((resp) => {
            console.log(resp)
            setLoadingUpload(false)
            const errors = checkError(resp.data.data)
            if(errors === ""){
                toastr.success('sukses upload')
                props.checkIsError(resp.data.data)
                props.setStateTab('1')
            }else{
                toastr.error("error",errors)
            }
            setValue("file_name",'')
            setValue("file",'')
        })
        .catch((err) => {
            console.log(err)
            setLoadingUpload(false)
            setError(err.data.errors)
            toastr.error('gagal upload',err.data.errors)
            setValue("file_name",'')
            setValue("file",'')
        })
    };

    const checkError = (data) => {
        let message = "";
        for (const value of Object.values(data.error)) {
            if(value[0].error.length > 0){
                if (message === ""){
                    message = value[0].error[0];
                }else{
                    message = message + ", " + value[0].error[0];
                }
            }
        }
        return message
    }

    const changeFileArsipTender = (e) => {
        e.target?.files[0]?.name && setValue("file_name", e.target.files[0].name)
        setError([])
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group row m-b-15">
                        {/* <label>File<span className="text-danger">*</span></label> */}
                        <div className="col-md-6">
                            <input type="text" className={(errors.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: true})} placeholder="" disabled={true} />
                            {errors.file_name && <span className="text-danger">* This field is required</span>}
                            {error?.file && <span className="text-danger">{error?.file?.[0]}</span>}
                            {/* <FileUploadInformation idFileUpload="ARSTND"/> */}
                        </div>
                        <div className="col-md-3">
                            <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileArsipTender} className="form-control" disabled={loadingUpload}/>
                                <i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> 
                                Telusuri
                            </label>
                        </div>
                        <div className="col-md-3">
                            <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/Template_Migrasi_Baru_PI.XLSX` } >
                            {/* <a target="_blank" rel="noopener noreferrer" href="#"> */}
                                <button type="button" className="btn btn-success pull-right" disabled={loadingUpload}>Download Template</button>
                            </a>
                            {/* <button className="btn btn-success pull-right" disabled={loadingUpload}>Download Template</button> */}
                        </div>
                        <div>
                            </div>                        
                    </div>

                    <div className="form-group">
                        <button className="btn btn-success" type="submit" disabled={loadingUpload}>
                        {loadingUpload && <i className="fas fa-spinner fa-pulse"/>}
                                Upload
                        </button>
                    </div>
                </div>
            </div>
            
        </form>
    )
}

export default withTranslation()  (FormMigrasi);