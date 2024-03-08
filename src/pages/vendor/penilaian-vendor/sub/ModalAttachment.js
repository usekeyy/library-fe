import React from 'react';
import { useForm} from 'react-hook-form';
import { Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
import { toastr } from 'react-redux-toastr';
// import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { Col } from 'reactstrap/lib';

// const animatedComponents = makeAnimated();

const ModalAttachment = (props) => {
	const {t} = props;
	const { register, handleSubmit,  setValue } = useForm({});
    const [loading,setLoading] = React.useState(false)
    const onSubmit = async data => {
        console.log(data)
        props.saveAttachment(data)
    }

    const changeFile = (e) => {
        setLoading(!loading);
        props.upload('PVL001', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("file_name", resp.data.data.name)
            // setFile_akta(resp.data.data.name)
            // setPlace_file_akta('temp')
        })
        .catch((err) => {
            setLoading(false);
            setValue("file_name", "")
            toastr.error(err.data?.message, err.data?.errors?.file[0])
        })
      }
	return (
		<div>
            <Row>
                <Col sm="12">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group row m-b-15">
                            <label className="col-md-3 col-form-label">Deskripsi File</label>
                            <div className="col-md-9">
                                {/* <input type="text" className={(errors.number) ? "form-control is-invalid" : "form-control"} name="number" ref={register({ required: false })} defaultValue={sendData.number} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                                {errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>} */}
                                <input className={"form-control"} name="deskripsi" ref={register({ required: false })} />
                                {/* {errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>} */}
                            </div>
                        </div>

                        <div className="form-group row m-b-15">
                            <label className="col-md-3 col-form-label">File</label>
                            <div className="col-md-6">
                                <input type="text" className={"form-control"} name="file_name" ref={register({required: false})} placeholder="" disabled={true} />
                                {/* <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file_akta}/${file_akta}` } > {t("common:Button.Download")} </a>
                                {errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>} */}
                                <FileUploadInformation idFileUpload="PVL001"/>
                            </div>
                            <div className="col-md-3">
                                <label className="custom-file-upload">
                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile}/>
                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                </label>
                            </div>
                            
                        </div>
                          
                        
                        <button className="btn btn-success" type="submit">{props.loading ? <i className="fa fa-spinner fa-pulse" /> : "Submit"}</button>
                    </form>
                </Col>
            </Row>
		</div>
	);
}

export default  withTranslation() (ModalAttachment);