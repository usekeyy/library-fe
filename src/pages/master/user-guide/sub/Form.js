import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
import { toastr } from 'react-redux-toastr';


const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, setValue } = useForm({});
	const onSubmit = async data => {
		props.save(data)
	};
	const [fileErrorsAkta,setFileErrorsAkta] = React.useState([])
	const [isFileErrorsAkta,setIsFileErrorsAkta] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	let msg = props.errors;

	const changeFile = (e) => {
        setLoading(!loading);
        setIsFileErrorsAkta(false)
        setFileErrorsAkta([])
        props.upload('USRGUI', e.target.files[0])
        .then((resp) => {
            setLoading(false);
            setValue("path", resp.data.data.name)
        })
        .catch((err) => {
            setLoading(false);
            setValue("path", '')
            toastr.error(err.data?.message, err.data?.errors?.file[0])
            setIsFileErrorsAkta(true)
            setFileErrorsAkta(err.data?.errors)
        })
    }

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>{t("uom:label.code")} <span className="text-danger">*</span></label>
						<div>
							{/* <input disabled={props.uuid!=="" ? true: false} className={(errors.code || msg.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: true })} defaultValue={props.data.code || ''} /> */}
							<select  className={(errors.code || msg.code) ? "form-control is-invalid" : "form-control"} name="code" ref={register({ required: true })} defaultValue={props.data.code || ''} >
								<option value=""></option>
								<option value="internal">Internal</option>
								<option value="vendor">Vendor</option>
							</select>
							{errors.code && <span className="text-danger">* This field is required</span>}
							{msg.code && <span className="text-danger"> {msg.code[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("userguide:label.description")} <span className="text-danger">*</span></label>
						<div>
							<input className={(errors.description || msg.description) ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.data.description || ''} />
							{errors.code && <span className="text-danger">* This field is required</span>}
							{msg.code && <span className="text-danger"> {msg.code[0]} </span>}
						</div>
					</div>
					<div className="form-group">
						<label>{t("uom:label.name")} <span className="text-danger">*</span></label>
						<div className="col-md-12">
                            <input type="text" className={(msg.path) ? "form-control is-invalid" : "form-control"} name="path" ref={register({required: false})} defaultValue={props.data.path} placeholder="" disabled={true} />
                            {/* {(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/${place_file_akta}/${file_akta}` } > {t("common:Button.Download")} </a> : '' } */}
                            {msg.path && <span className="text-danger"> {msg.path[0]} </span>}
                            { isFileErrorsAkta &&
								Object.keys(fileErrorsAkta).map((item, i) => (
									<p><span className="text-danger" key={i}><b>*</b> {fileErrorsAkta[item][0]}</span></p>
								))
							}  
                            <FileUploadInformation idFileUpload="USRGUI"/>
                        </div>
                        <div className="col-md-3">
                            <label className="custom-file-upload">
                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>
                        </div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{(loading || props.loading) && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);