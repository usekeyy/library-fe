import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';
import { toastr } from 'react-redux-toastr';
import { ModalBody, ModalFooter } from 'reactstrap';


const Registrasi = (props) => {
		const { t } = props;
		const { register, handleSubmit, setValue } = useForm({});
		const {header} = props.parentState.quotation;
		const {errors} = props.parentState.quotation;
		const {loadings} = props.parentState;
		const [checkProses, setCheckProses] = React.useState('y')
		// const [validFileLampiran, setValidFileLampiran] = React.useState(false)
		const [loading, setLoading] = React.useState(false)
		const [filelampiran, setFilelampiran] = React.useState()
		// const [loadingBtn, setLoadingBtn] = React.useState(false)
		const validFileLampiran = false;
		
		const onSubmit = async data => {
			console.log(data);
			data.status = (data.status === 'y') ? 'register' : 'reject';
			delete data.files;
			props.submitRegisterVendorQuotation(data)
		};

		const handleCheckProses = (proses) => {
			if (proses === 'y'){
				setValue("note", "")
				setCheckProses("y")
			}else if(proses === 'n'){
				setCheckProses("n")
			}
		}

		const changeFile = (e) => {
			e.preventDefault()
			if (e.target.files[0] !== undefined) {
				setLoading(true);
				props.upload('QREG01', e.target.files[0])
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
					<form onSubmit={handleSubmit(onSubmit)}>
							<ModalBody>
								<Panel className="margin-bot-false">
										<PanelHeader>Quotation Registrasi</PanelHeader>
										<PanelBody >
												<div className="row">
                        	<div className="col-sm-12">
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Paket No</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {header.number}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Packet Title</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {header.title}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Tanggal Mulai</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {formatDate(`${header.start_date} ${header.start_time}`, true)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Tanggal Selesai</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {formatDate(`${header.end_date} ${header.end_time}`, true)}</label>
                                </div>
                            </div>
														<div className="form-group row m-b-10">
															<label className="col-md-3 col-form-label">Pilih Proses</label>
															<div className="col-md-9">
																<div className="radio radio-css">
																	<input type="radio" ref={register({})} checked={checkProses === 'y'} onChange={(e) => handleCheckProses('y')}  name="status" id="register" value="y" />
																	<label htmlFor="register">Input Penawaran</label>
																</div>
																<div className="radio radio-css">
																	<input type="radio" ref={register({})} checked={checkProses === 'n'} onChange={(e) => handleCheckProses('n')} name="status" id="reject" value="n" />
																	<label htmlFor="reject">Tidak Input Penawaran</label>
																</div>
															</div>
														</div>
														<div className="form-group row m-b-10">
														<label className="col-md-3 col-form-label">Catatan</label>
															<div className="col-md-9">
																<textarea name="note" ref={register({})} className={(errors['header.note']) ? "form-control is-invalid" : "form-control"} rows="4" cols="50" defaultValue={''} disabled={checkProses === 'y' || checkProses === ''} />
																{errors['header.note'] && <span className="text-danger"> {errors['header.note'][0]} </span>}
															</div>
														</div>
														{(checkProses === 'n') && <div className="form-group row m-b-10">
															<label className="col-sm-3 col-form-label">Lampiran</label>
															<div className="col-sm-6">
																	<input type="text" className={validFileLampiran ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={filelampiran} />
																	{validFileLampiran && <span className="text-danger"> {"File is required"} </span>}
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
							</ModalBody>
							<ModalFooter>
								<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} disabled={loadings.button}>{t("currency:button.close")}</button>
								<button className="btn btn-success" type="submit" disabled={loadings.button}> 
								{loadings.button && <i className="fa fa-spinner fa-spin"></i>}
								Save </button>
							</ModalFooter>
						</form>
        </div>
    );
}

export default withTranslation()(Registrasi);
