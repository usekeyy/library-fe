import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Row } from 'reactstrap';
import { toastr } from 'react-redux-toastr';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';


const Upload = (props) => {
    const { t } = props;
    const { register, handleSubmit, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const onSubmit = async data => {
        delete data.file
        data.file = data.attachment
        props.storeUploadAanwijzing(data)
    };

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0] !== undefined) {
            props.upload('AAWZ01', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("attachment", resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    setValue("attachment", '')
                    toastr.error(err.data.message, err.data.status)
                })
        } else {
            setValue('attachment', '')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <div className="col-sm-12">
                    <div className="form-group">
                        <label className="col-form-label">Description</label>
                        <textarea className="form-control" name="description" ref={register({required:true})}/>
                    </div>
                    <div className="form-group">
						<label>{t("aanwijzing:label.attactment")}</label>
                        <input type="text" name="attachment" className="form-control" readOnly ref={register({required:false})}/>
                        <FileUploadInformation idFileUpload="AAWZ01"/>
                        <label>&nbsp;</label>
                        <label className="custom-file-upload pull-right m-t-5">
                            <input type="file" name="file" ref={register()} placeholder="" disabled={loading} onChange={changeFile} />
                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
						</label>
                        
					</div>
                </div>
            </Row>
            <div className="row">
                <div className="col-sm-12">
                    <div className="pull-right m-t-5 m-b-5">
                        <button
                            type="submit"
                            disabled={props.loadings.loading_store_upload}
                            className="btn btn-success m-r-5">
                            {props.loadings.loading_store_upload && <i className="fas fa-spinner fa-pulse"></i>}
                            {t("common:Button.Kirim")}
                    </button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    );
}

export default withTranslation()(Upload);