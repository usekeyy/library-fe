import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';

const Form = (props) => {
	const { t } = props;
	const { register, handleSubmit, errors, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
	const onSubmit = async data => {
		props.save(data);
	};	

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('PQPT01', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                // setTdpFileName('')
                setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }

    const changeAttachment = (e) => {
		setValue('file', null)
		props.changeAttachment(e.target.value)
    }

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>Description <span className="text-danger">*</span></label>
						<input className={(errors.description || props.errors.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
						{props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
					</div>
					<div className="form-group">
						<label>Attachment <span className="text-danger">*</span></label>
						<div>
							<label><input type="radio" name="attachment" value={'y'} ref={register({ required: false })} required defaultChecked={props.data.attachment==='y' ? true : false} onChange={changeAttachment}/> Yes</label>
							<br></br>
							<label><input type="radio" name="attachment" value={'n'} ref={register({ required: false })} required defaultChecked={props.data.attachment==='n' ? true : false} onChange={changeAttachment}/> No</label>
						</div>
					</div>
					{props.data.attachment === 'y' && 
						<div className="form-group">
							<label>File <span className="text-danger">*</span></label>
							<div className="form-group row">
								<div className="col-md-8">
									<input type="text" className={(props.errors.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} defaultValue={props.data.file} placeholder="" disabled={true} />
									{(props.data.uuid !== "" && props.data.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data.file}` } > {t("common:Button.Download")} </a> : '' }
									{props.status_attachment_file === false && <span className="text-danger">* This field is required</span>}
								</div>
								<div className="col-md-4">
									<label className="custom-file-upload">
										<input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
										<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
									</label>
								</div>
							</div>
						</div>
					}

				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("costCenter:button.update") : t("costCenter:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);