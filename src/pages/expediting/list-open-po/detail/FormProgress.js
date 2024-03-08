import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
// import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import ReactLoading from "react-loading";

const FormProgress = (props) => {
	const { t } = props;
	const { register, handleSubmit, errors, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
	const onSubmit = async data => {
        if(props.modalType === 'create') {
            props.save(data);
        }
        else if (props.modalType === 'edit') {
            props.update(data);
        }
	};

    const onChangeProgressDate = (e) => {
        props.setProgressDate(formattingDate(e))
        setValue('progress_date', formattingDate(e))
    }

    const formattingDate = (e) => {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            let name = e.target.files[0].name
            props.upload('PRCORD', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                props.addTempLampiran(name, resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("file_name", '')
                props.addTempLampiran('', '')
                console.log(err)
                // toastr.error(err.data.message, err.data.status)
            })    
        }else{
            props.addTempLampiran('', '')
            setLoading(false);
        }
    }

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    const  addLampiranProgress = (e) => {
        e.preventDefault()
        setValue("file_name", '')
        props.addLampiranProgress()
    }

    // const  deleteLampiranProgress = (e, index, type) => {
    //     e.preventDefault()
    //     props.deleteLampiranProgress(index)
    // }

    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data.attachment).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data.attachment[key]['name']}</td>
                    <td>
                        {props.data.attachment[key]['file'] !== undefined && props.data.attachment[key]['file'] !== null &&
                            (props.data.attachment[key]['id'] !== undefined ?
                                <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/invoice/' + props.data.attachment[key]['file'] )} disabled={loading}>
                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                                </button> :
                                <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/temp/' + props.data.attachment[key]['file'] )} disabled={loading}>
                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                                </button>
                            )
                        }
                    </td>
                    <td>
                        {props.modalType !== 'detail' &&
                            <button className="btn btn-xs btn-danger" onClick={(e) => props.toggleDelete(e, key, 'lampiran-progress')} ><i className="fa fa-trash"></i></button>
                            // <button className="btn btn-xs btn-danger" onClick={(e) => deleteLampiranProgress(e, key, 'lampiran-progress')} ><i className="fa fa-trash"></i></button>
                        }
                    </td>
                </tr>
            )
        });
    }

    return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                    <div className="row">
                        <div className="row col-sm-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>No Expediting <span className="text-danger">*</span></label>
                                    <input className={errors.number ? "form-control is-invalid" : "form-control"} name="number" ref={register({ required: false })} defaultValue={props.data.number || ''} disabled={true}/>
                                    {errors.number && <span className="text-danger">{errors.number.type === "required" ? "Field harus diisi" : ''}  {errors.number.message}</span>}
                                    {props.errors.number && <span className="text-danger">{props.errors.number[0]}</span>}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Planning (%) <span className="text-danger">*</span></label>
                                    <input type="number" min="0" max="100" className={errors.planning ? "form-control is-invalid" : "form-control"} name="planning" ref={register({ required: false })} defaultValue={props.data.planning || ''} disabled={props.modalType==='detail' ? true : false}/>
                                    {errors.planning && <span className="text-danger">{errors.planning.type === "required" ? "Field harus diisi" : ''}  {errors.planning.message}</span>}
                                    {props.errors.planning && <span className="text-danger">{props.errors.planning[0]}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="row col-sm-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Tanggal Progress <span className="text-danger">*</span></label>
									{props.modalType==='detail' ? 
                                        <input type="text" disabled={true} name="progress_date_temp" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.progress_date !==undefined ? moment(props.data.progress_date).format("DD-MM-YYYY") : ''} /> :
										<Datetime
											value={props.data.progress_date !== undefined && props.data.progress_date !== '' && props.data.progress_date !== null ? moment(props.data.progress_date).format("DD-MM-YYYY") : ''}
											onChange={onChangeProgressDate}
											closeOnSelect={true}
											name="progress_date_temp"
											dateFormat="DD-MM-YYYY"
											timeFormat={false}
											inputProps={{ placeholder: "DD-MM-YYYY" }}
										/>
									}
                                    <input type="hidden" name="progress_date" ref={register({ required: false })} defaultValue={props.data.progress_date !== undefined ? props.data.progress_date : ''} />
                                    {errors.progress_date && <span className="text-danger">{errors.progress_date.type === "required" ? "Field harus diisi" : ''}  {errors.progress_date.message}</span>}
                                    {props.errors.progress_date && <span className="text-danger">{props.errors.progress_date[0]}</span>}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Realisasi (%) <span className="text-danger">*</span></label>
                                    <input type="number" min="0" max="100" className={errors.realitation ? "form-control is-invalid" : "form-control"} name="realitation" ref={register({ required: false })} defaultValue={props.data.realitation || ''} disabled={props.modalType==='detail' ? true : false}/>
                                    {errors.realitation && <span className="text-danger">{errors.realitation.type === "required" ? "Field harus diisi" : ''}  {errors.realitation.message}</span>}
                                    {props.errors.realitation && <span className="text-danger">{props.errors.realitation[0]}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="row col-sm-12">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Deskripsi Progress</label>
                                    <textarea className={errors.content ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: false })} defaultValue={props.data.description || ''} disabled={props.modalType==='detail' ? true : false}/>
                                    {errors.description && <span className="text-danger">{errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message}</span>}
                                    {props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
                                </div>
                            </div>
                        </div>
						{props.modalType !== 'detail' &&
							<div className="row col-sm-12">
								<div className="col-sm-12">
									<div className="form-group">
										<label>Upload Dokumen/Lampiran Pendukung</label>
										<div className="form-group row">
											<div className="col-md-8">
												<input type="text" className="form-control" name="file_name" ref={register({required: false})} disabled={true}/>
											</div>
											<div className="col-md-4">
												<label className="custom-file-upload">
                                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						}
						{props.modalType !== 'detail' &&
							<div className="row col-sm-12">
								<div className="col-sm-12">
									<div className="form-group">
										<button className="btn btn-white" onClick={(e) => addLampiranProgress(e)}>Upload</button>
									</div>
								</div>
							</div>
						}
                        <div className="row col-sm-12">
                            <div className="col-sm-12">
								<label>Lampiran</label>
                                {props.loading_progress_lampiran && (
                                    <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                    </center>
                                )}
                                {props.loading_progress_lampiran === false && (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Dokumen</th>
                                                    <th style={{width: "1%"}}>Lampiran</th>
                                                    <th style={{width: "1%"}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
					{props.modalType !== 'detail' &&
						<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button>
					}
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(FormProgress);