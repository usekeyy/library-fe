import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';



const UserReply = (props) => {
    const { t } = props;
    const { register, handleSubmit , setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const onSubmit = async data => {
        data.reply_to =props.data.reply_to
        data.uuid = props.data.uuid
        delete data.file
        if(props.uuidDeleteOrUpdate===""){
            props.store(data)
        }else{
            delete data.reply_to
            delete data.uuid
            data.comment = data.note
            delete data.note
            props.update(data)
        }
        
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
                <ModalBody>
                    {props.uuidDeleteOrUpdate === "" &&
                    <div className="form-group">
                        <label>{t("aanwijzing:label.asked")}</label>
                        <input type="text" name="penanya" readOnly className="form-control"  defaultValue={props.data.asked}/>
                    </div>
                    }
                    { props.uuidDeleteOrUpdate === "" &&
                    <div className="form-group">
                        <label>{t("aanwijzing:label.question")}</label>
                        <textarea className="form-control" name="pertanyaan" readOnly defaultValue={props.data.question}/>
                    </div>
                    }
                    <div className="form-group">
                        <label>{t("aanwijzing:label.answer")}</label>
                        <textarea className="form-control" name="note" ref={register({required:true})} defaultValue={props.data.comment}/>
                    </div>
                    <div className="form-group">
						<label>{t("aanwijzing:label.attactment")}</label>
                        <input type="text" name="attachment" className="form-control" readOnly ref={register({required:false})} defaultValue={props.data.attachment}/>
                        {/* <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.attacment}` } > {t("common:Button.Download")} </a>  */}
                        <FileUploadInformation idFileUpload="AAWZ01"/>
                        <label>&nbsp;</label>
                        <label className="custom-file-upload pull-right m-t-5">
                            <input type="file" name="file" ref={register()} placeholder="" disabled={loading} onChange={changeFile} />
                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />  {t('Label.Unggah')}
						</label>
					</div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("uom:button.cancel")}</button>
                    <button className="btn btn-success" type="submit" disabled={props.btnDisabled}>
                        {props.btnDisabled && <i className="fas fa-spinner fa-pulse"></i>}
						Submit
					</button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(UserReply);