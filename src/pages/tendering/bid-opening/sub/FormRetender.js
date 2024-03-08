import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { toastr } from 'react-redux-toastr';
import { ModalBody, ModalFooter } from 'reactstrap';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';

const Catatan = (props) => {
    const { t } = props
    const { register, setValue, handleSubmit } = useForm();
    const [loadingUpload, setLoadingUpload] = React.useState(false)
    const onSubmit = async data => {
        delete data.file_name;
		data.proposal_tender_id = props.proposal_tender_id;
        props.reTendering(data)
    };

    const changeFile = (e) => {
        // setLoading(!loading);
        setLoadingUpload(true)
        props.upload('RETEN1', e.target.files[0])
            .then((resp) => {
                setLoadingUpload(false)
                setValue("file", resp.data.data.name)
            })
            .catch((err) => {
                setLoadingUpload(false)
                setValue("file", '')
                toastr.error(err.data.message, err.data.status)
            })
    }

    const close = (e) => {
        props.toggleClose()
        e.preventDefault();
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <div className="form-group">
                        <label>Catatan<span className="text-danger">*</span></label>
                        <div>
                            <textarea className={(props.errors.note) ? "form-control is-invalid" : "form-control"} name="note" ref={register({ required: false })} defaultValue={''} />
                            {props.errors.note && <span className="text-danger">{props.errors.note[0]}</span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3">Lampiran<span className="text-danger">*</span></label>
                        <div className="col-md-5">
                            <input type="text" className={(props.errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} />
                            {props.errors.file && <span className="text-danger">{props.errors.file[0]}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="custom-file-upload">
                                <input type="file" name="file_name" ref={register({ required: false })} placeholder="" onChange={changeFile} className="form-control" disabled={loadingUpload} />
                                <input type="file" name="file_name" ref={register({ required: false })} placeholder="" onChange={changeFile} className="form-control" disabled={loadingUpload} />
                                <i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} />
											Telusuri
							</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <FileUploadInformation idFileUpload="RETEN1" />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" disabled={props.loadings.loadingReTender || loadingUpload }>
                            {(props.loadings.loadingReTender || loadingUpload) ? <i className="fa fa-spinner fa-spin"></i> : ''}
                            Confirm
					</button>
                    <button className="btn btn-white" onClick={(e) => close(e)}>{t("uom:button.cancel")}</button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(Catatan);