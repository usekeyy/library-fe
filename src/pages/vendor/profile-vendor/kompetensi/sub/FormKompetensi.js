import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import Creatable from 'react-select/creatable';
import { components } from "react-select";
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();
const FormKompetensi = (props) => {
    const { t } = props
    const { register, control, errors, handleSubmit, setValue, getValues } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const { has_draft_verification } = props;
    const sendData = props.data;
    const isBarang = (getValues('bidang_usaha_id')?.value >= 1 && getValues('bidang_usaha_id')?.value <= 31)? true : false;
    const onSubmit = async data => {
        console.log(data);
        setData(data)
        if(data.merk === "" || data.merk === null){
            
        }else{
            let options = data.merk.map((data) => {
                return data.value
            });
            data.merk=options.join(',')
        }
        if (props.uuid === "") {
            props.save(data)
        } else {
            props.update(props.uuid, data)
        }
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    const clearSelect = (value) => {
        setValue("sub_bidang_usaha_id", '');
    };

    const handleChange = (e) => {
        if (e !== null) { 
            clearSelect(null); 
            props.getSubBidangUsaha(e.value)
            if(e.value >=1 && e.value <=31){
                if (getValues('merk') === ''){
                    setValue('merk',[{value : 'general', label : 'general'}])
                }
            }else{
                setValue('merk','')
            }
        }else { 
            clearSelect(null) 
        };
    }

    const Menu = props => {
        const optionSelectedLength = props.getValue().length || 0;
        return (
          <components.Menu {...props}>
            {optionSelectedLength < 10 ? (
              props.children
            ) : (
              <div style={{ margin: 15 }}>Max limit achieved</div>
            )}
          </components.Menu>
        );
      };

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0] !== undefined) {
            props.upload('PVKOM1', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("attachment", resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    setValue("attachment", '')
                    toastr.error(err.data.message, err.data?.errors?.file[0])
                })
        } else {
            setValue("attachment", '')
        }
    }

    const setData = (data) => {
        (data.bidang_usaha_id === undefined || data.bidang_usaha_id === null || data.bidang_usaha_id === "") ?   data.bidang_usaha_id = "" : data.bidang_usaha_id = data.bidang_usaha_id.value;
        (data.sub_bidang_usaha_id === undefined || data.sub_bidang_usaha_id === "" || data.sub_bidang_usaha_id === null) ?   data.sub_bidang_usaha_id = "" : data.sub_bidang_usaha_id = data.sub_bidang_usaha_id.value;
        (data.tipe_rekanan_id === undefined || data.tipe_rekanan_id === null || data.tipe_rekanan_id === "") ?   data.tipe_rekanan_id = "" : data.tipe_rekanan_id = data.tipe_rekanan_id.value;
       
        delete data.file
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
                                options={props.optionsBidangUsaha}
                                name="bidang_usaha_id"
                                isClearable
                                styles={props.errors.bidang_usaha_id ? customStyles : {}}
                                onChange={([selected]) => {
                                    handleChange(selected)
                                    return selected;
                                }}
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
                                options={props.optionsSubBidangUsaha}
                                styles={props.errors.sub_bidang_usaha_id ? customStyles : {}}
                                name="sub_bidang_usaha_id"
                                defaultValue={props.data.sub_bidang_usaha_id}
                                isLoading={props.loadings.subBidangUsaha}
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.sub_bidang_usaha_id && <span className="text-danger"> {props.errors.sub_bidang_usaha_id[0]}  </span>}
                            {props.errors.bidang_usaha_rule && <span className="text-danger"> {props.errors.bidang_usaha_rule[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:kompetensi.tipe-rekanan")}<span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                control={control}
                                isClearable
                                defaultValue={props.data.tipe_rekanan_id}
                                styles={props.errors.tipe_rekanan_id ? customStyles : {}}
                                options={props.optionsTipeRekanan}
                                name="tipe_rekanan_id"
                                isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
                            />
                            {props.errors.tipe_rekanan_id && <span className="text-danger"> {props.errors.tipe_rekanan_id[0]}  </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">Merk/Brand{isBarang && <span className="text-danger">*</span>}</label>
                        <div className="col-md-7">
                            {/* <input type="text" className={(errors.merk || props.errors.merk) ? "form-control is-invalid" : "form-control"} name="merk" ref={register()} placeholder="" defaultValue={props.data.merk} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} /> */}
                            <Controller
                                components={{ Menu }}
                                closeMenuOnSelect={true}
                                as={Creatable}
                                control={control}
                                isClearable
                                isMulti
                                defaultValue={props.data.merk}
                                styles={props.errors.merk ? customStyles : {}}
                                options={props.optionsMerk}
                                rules={{ required:  getValues('bidang_usaha_id')?.value >=1 && getValues('bidang_usaha_id')?.value <=31}}
                                // onInputChange={onInputChange}
                                // inputValue={props.inputValue}
                                name="merk"
                            />
                            {props.errors.merk && <span className="text-danger"> {props.errors.merk[0]}  </span>}
                        </div>
                    </div>

                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:kompetensi.lampiran")}<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(errors.attachment || props.errors.attachment) ? "form-control is-invalid" : "form-control"} name="attachment" ref={register()} placeholder="" disabled={true} defaultValue={props.data.attachment} />
                            {(props.uuid !== "" && props.data.attachment !== "" && props.data.attachment !== null) ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.attachment}`} > {t("common:Button.Download")} </a> : ''}
                            {props.errors.attachment && <span className="text-danger"> {props.errors.attachment[0]}  </span>}
                            <FileUploadInformation idFileUpload="PVKOM1"/>
                        </div>
                        <div className="col-md-3">
                            {props.isVendor && !has_draft_verification && <label className="custom-file-upload">
                                <input type="file" name="file" ref={register()} placeholder="" disabled={loading} onChange={changeFile} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
                            </label>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="pull-right m-t-10 m-b-10">

                        {props.uuid !== '' && <button className="btn btn-sm btn-danger m-l-10" type="button" onClick={props.cancelBtn}>
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

export default withTranslation()(FormKompetensi);