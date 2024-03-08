import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';

const FormBatalTender = (props) => {
	const {t} = props;
	const { register, handleSubmit, setValue } = useForm({});
	const [loadingUpload, setLoadingUpload] = React.useState(false)
	const {loadings} = props.parentState;
	const resp_errors = props.parentState.errors;
	const onSubmit = async data => {
		delete data.file_name;
        data.proposal_tender_id = props.parentState.data.proposal_tender_id;
        data.is_batal_tender = true
        // console.log(data)
		props.saveRetender(data)
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
    
    const closeBtn =  (e) => {
        props.toggleClose();
        e.preventDefault()
    }

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>Catatan<span className="text-danger">*</span></label>
						<div>
							<textarea className={(resp_errors.note) ? "form-control is-invalid" : "form-control"} name="note" ref={register({ required: false })} defaultValue={''} />
							{resp_errors.note && <span className="text-danger">{resp_errors.note[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>Lampiran<span className="text-danger">*</span></label>
						<div className="row">
                            <div className="col-md-6">
                                <input type="text" className={(resp_errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({required: false})} placeholder="" disabled={true} />
                                    {resp_errors.file && <span className="text-danger">{resp_errors.file[0]}</span>}
                            </div>
                            <div className="col-md-6">
                                <label className="custom-file-upload">
                                    <input type="file" name="file_name" ref={register({required: false})} placeholder="" onChange={changeFile} className="form-control" disabled={loadingUpload}/>
                                        <i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> 
                                        Telusuri
                                </label>
                            </div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-danger" disabled={loadings.button}>
						{loadings.button && <i className="fa fa-spinner fa-spin"></i> } <div>Confirm</div>
					</button>
					<button className="btn btn-white" disabled={loadings.button} onClick={(e) => closeBtn(e)}>{t("uom:button.cancel")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormBatalTender);