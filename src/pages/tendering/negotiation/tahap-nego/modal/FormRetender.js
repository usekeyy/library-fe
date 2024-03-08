import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';

const FormRetender = (props) => {
	const {t} = props;
	const { register, handleSubmit, setValue } = useForm({});
	const [loadingUpload, setLoadingUpload] = React.useState(false)
	const {header} = props.parentState.tahap_nego;
	const {loadings} = props.parentState;
	const resp_errors = props.parentState.tahap_nego.errors;
	const onSubmit = async data => {
		delete data.file_name;
		const isBatalTender = (header.method_type === 'batal-tender') ? true : false;
		data.is_batal_tender = isBatalTender;
		data.proposal_tender_id = header.id;
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
					<div className="form-group row m-b-15">
							<label className="col-md-3">Lampiran<span className="text-danger">*</span></label>
							<div className="col-md-5">
									<input type="text" className={(resp_errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({required: false})} placeholder="" disabled={true} />
									{resp_errors.file && <span className="text-danger">{resp_errors.file[0]}</span>}
							</div>
							<div className="col-md-3">
									<label className="custom-file-upload">
											<input type="file" name="file_name" ref={register({required: false})} placeholder="" onChange={changeFile} className="form-control" disabled={loadingUpload}/>
											<i className={loadingUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> 
											Telusuri
									</label>
							</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-danger" disabled={loadings.button}>
						{loadings.button ? <i className="fa fa-spinner fa-spin"></i> : <div>Confirm</div>}
					</button>
					<button className="btn btn-white" disabled={loadings.button} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormRetender);