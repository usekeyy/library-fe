import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';

const FormDokumenPO = (props) => {
	const { t } = props;
	const { register, handleSubmit, errors, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
	const onSubmit = async data => {
		props.save(data);
	};	

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('PRCORD', e.target.files[0])
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

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>Description <span className="text-danger">*</span></label>
						<input className={errors.description ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} />
						{errors.description && <span className="text-danger"> {errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message} </span>}
					</div>
                    <div className="form-group">
                        <label>File <span className="text-danger">*</span></label>
                        <div className="form-group row">
                            <div className="col-md-8">
                                <input type="text" className="form-control" name="file_name" ref={register({required: false})} disabled={true}/>
                                {props.status_dokumen_po &&  <span className="text-danger">Dokumen harus diunggah</span> }
                            </div>
                            <div className="col-md-4">
                                <label className="custom-file-upload">
                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                </label>
                            </div>
                        </div>
                    </div>

				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(FormDokumenPO);