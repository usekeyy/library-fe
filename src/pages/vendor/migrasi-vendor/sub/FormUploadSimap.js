import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';

const animatedComponents = makeAnimated();
// import FileUploadInformation from '../../../../components/upload/FileUploadInformation';

const FormUploadSimap = (props) => {
    const {t} = props;
    const errors_response = props.data.errors;
    const { register , control, errors, handleSubmit, setValue } = useForm({});
    const [loadingUpload, setLoadingUpload] = React.useState(false);
    // const [error,setError] = React.useState([])
    const [file_akta,setFile_akta] = React.useState()
    // const {has_draft_verification} = props
    // const sendData = props.data;
    const onSubmit = async data => {
        setData(data);
        props.save(data)
        console.log(data)
    };

    const changeFileAkta = (e) => {
        setLoadingUpload(!loadingUpload);
        props.upload('VMSUAP', e.target.files[0])
        .then((resp) => {
            setLoadingUpload(false);
            setValue("file_name", resp.data.data.name)
            setFile_akta(resp.data.data.name)
            // setPlace_file_akta('temp')
            // file_akta = resp.data.data.name
            // place_file_akta = 'temp'

            console.log(file_akta)
            // setTdpFileName(resp.data.data.name)
        })
        .catch((err) => {
            setLoadingUpload(false);
            // setTdpFileName('')
            setValue("file_name", '')
            toastr.error(err.data?.message, err.data?.errors?.file[0])
        })
    }

    const setData = (data) => {
        data.file = data.file_name;
        data.vendor_id = data.vendor.value;
        delete data.file_name
        delete data.vendor
    }

    const onInputChangeVendor = (option, { action }) => {
		if (action === "input-change") {
            props.fetchVendor(option)
		}
	};

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
                            <label className="col-md-2 col-form-label">Pilih Vendor<span className="text-danger">*</span></label>
                            <div className="col-md-8">
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select} 
                                    placeholder={props.data.loadingVendor ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                    isLoading={props.data.loadingVendor}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    name="vendor"
                                    control = {control}
                                    styles={errors.vendor ? customStyles : {}}
                                    onInputChange={onInputChangeVendor}
                                    // onChange={(val)=> {setVendor({target: { id: val.id, value: val.value, vendor_name: val.vendor_name, sap_code: val.sap_code }})}}
                                    options={props.data.dataVendor} 
                                    // defaultValue={sendData.vendor_id}
                                    // isDisabled={state.loading}
                                    rules={{ required: true }} />
                                    {errors.vendor && <span className="text-danger"> "Vendor required" </span>}
                            </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-2 col-form-label">File SIMAP<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: true})} placeholder="" disabled={true} />
                            {/* {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file_akta}/${file_akta}` } > {t("common:Button.Download")} </a> : '' } */}
                            {errors.file_name && <span className="text-danger"> "File SIMAP Required" </span>}
                            <FileUploadInformation idFileUpload="VMSUAP"/>
                        </div>
                        <div className="col-md-3">
                            <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileAkta} disabled={loadingUpload} />
                                <i className={(loadingUpload || props.data.loadingSubmit) ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>
                        </div>
                        
                    </div>
                    <div className="form-group">
                            <button className="btn btn-success" type="submit" disabled={(loadingUpload || props.data.loadingSubmit)}>
                            {(loadingUpload || props.data.loadingSubmit) && <i className="fas fa-spinner fa-pulse"/>}
                                    Submit
                            </button>
                        </div>
                </div>
            </div>
            
        </form>
    )
}

export default withTranslation()  (FormUploadSimap);