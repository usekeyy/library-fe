import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';

const Process = (props) => {
		const { t } = props;
		const { register, setValue } = useFormContext();
		// const {header} = props.parentState.vendor_registration_tender;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		const [checkProses, setCheckProses] = React.useState('')
		// const [validFileLampiran, setValidFileLampiran] = React.useState(false)
		const [loading, setLoading] = React.useState(false)
		const [filelampiran, setFilelampiran] = React.useState()

		const handleCheckProses = (proses) => {
			if (proses === 'register'){
				setValue("note", "")
				setCheckProses("register")
			}else if(proses === 'reject'){
				setCheckProses("reject")
			}
		}

		const changeFile = (e) => {
			e.preventDefault()
			if (e.target.files[0] !== undefined) {
				setLoading(true);
				props.upload('VRT001', e.target.files[0])
				.then((resp) => {
						setLoading(false);
						setValue("file", resp.data.data.name)
						setFilelampiran(resp.data.data.name);
				})
				.catch((err) => {
						setLoading(false);
						setFilelampiran('');
						setValue("file", '')
						toastr.error(err.data.message, err.data.errors.file[0])
				})
			} else {
					setValue('file', '')
			}
		}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Process</PanelHeader>
                <PanelBody >
                    <div className="row">
											<div className="col-md-12">
												<div className="form-group row m-b-10">
													<label className="col-md-3 col-form-label">Pilih Proses</label>
													<div className="col-md-9">
														<div className="radio radio-css">
															<input type="radio" ref={register({})} checked={checkProses === 'register'} onChange={(e) => handleCheckProses('register')}  name="status" id="register" value="register" />
															<label htmlFor="register">Register</label>
														</div>
														<div className="radio radio-css">
															<input type="radio" ref={register({})} checked={checkProses === 'reject'} onChange={(e) => handleCheckProses('reject')} name="status" id="reject" value="reject" />
															<label htmlFor="reject">Reject</label>
														</div>
													</div>
												</div>
												<div className="form-group row m-b-10">
												<label className="col-md-3 col-form-label">Catatan</label>
													<div className="col-md-9">
														<textarea type="text" name="note" ref={register({})} className={(errors['header.note']) ? "form-control is-invalid" : "form-control"} rows="4" cols="50" disabled={checkProses === 'register' || checkProses === ''} />
														{errors['header.note'] && <span className="text-danger"> {errors['header.note'][0]} </span>}
													</div>
												</div>
												{(checkProses === 'reject') && <div className="form-group row m-b-10">
													<label className="col-sm-3 col-form-label">Lampiran</label>
													<div className="col-sm-6">
															<input type="text" className={"form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={filelampiran} />
															{<span className="text-danger"> {"File is required"} </span>}
													</div>
													<div className="col-sm-3">
															<label className="custom-file-upload">
																	<input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
																	<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
															</label>
													</div>
												</div>}
											</div>
										</div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Process);
