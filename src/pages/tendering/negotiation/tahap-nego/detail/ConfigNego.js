import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import Datetime from 'react-datetime';
import ReactLoading from 'react-loading';
import TimePicker from "../../../../../components/TimePicker";
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
// const animatedComponents = makeAnimated();

const ConfigNego = (props) => {
	// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
	const { t } = props;
	const { register,setValue,control,getValues } = useFormContext();
	const {header} = props.parentState.tahap_nego;
	const {errors} = props.parentState.tahap_nego;
	const {tempConfig} = props.parentState.tahap_nego;
	// const {uuid} = props.parentState;
	// const {tahap_nego} = props.parentState;
	const {loading} = props.parentState.tahap_nego;
	const {attachments_persyaratan} = props.parentState.tahap_nego;
	const {dateNow} = props.parentState;
	const {loadings} = props.parentState;
	const [validDescriptionLampiran, setValidDescriptionLampiran] = React.useState(false)
	const [validLampiran, setValidLampiran] = React.useState(false)
	const [deskripsilampiran, setDeskripsilampiran] = React.useState()
	const [lampiran, setlampiran] = React.useState()
	const [pathlampiran, setpathlampiran] = React.useState()
	// const [loadingz, setLoadingz] = React.useState(false)

	const deleteAttachments = (e, id) => {
		e.preventDefault()
		props.deleteLampiranTerm(id)
	}

	const changeDeskripsiLampiran = (e) => {
		setDeskripsilampiran(e.target.value)
	}
	
	const handleAddLampiran = (e) => {
		e.preventDefault()
		setValidDescriptionLampiran(deskripsilampiran !== undefined ? false : true);
		setValidLampiran(lampiran !== undefined ? false : false);
		if (deskripsilampiran === undefined || deskripsilampiran === "") {
			toastr.warning("Validation Fail", "Description Is Required")
		} else {
			props.addLampiranTerm({
					description: (deskripsilampiran === undefined) ? "" : deskripsilampiran,
					file: (lampiran === undefined) ? "" : lampiran,
					path: (pathlampiran === undefined) ? "" : pathlampiran,
			})
			setDeskripsilampiran('')
			setlampiran('')
			setpathlampiran('')
			setValue("attactment_description", '')
			setValue("attactment_file", '')
		}
	}

	const changeFile = (e) => {
		e.preventDefault()
		if (e.target.files[0] !== undefined) {
			// setLoadingz(true);
			props.upload('THNEGO', e.target.files[0])
			.then((resp) => {
					// setLoadingz(false);
					setValue("attactment_file", resp.data.data.name)
					setlampiran(resp.data.data.name);
					setpathlampiran(resp.data.data.path);
			})
			.catch((err) => {
					// setLoadingz(false);
					setlampiran('');
					setpathlampiran('');
					setValue("attactment_file", '')
					toastr.error(err.data.message, err.data.errors.file[0])
			})
		} else {
				setValue('attactment_file', '')
		}
	}

	const downloadLampiran = (e, url) => {
		e.preventDefault()
		window.open(url, "_blank")
	}

	const validation = (currentDate) => {
		return currentDate.isAfter(moment(dateNow)) >= currentDate.isBefore(moment(dateNow));
	};

	const formattingDate = (e) => {
		var timestamp = Date.parse(e);
		if (isNaN(timestamp) === false && typeof e === 'object') {
			let d = new Date(e);
			let month = '' + (d.getMonth() + 1);
			let day = '' + d.getDate();
			let year = d.getFullYear();
	
			if (month.length < 2) 
					month = '0' + month;
			if (day.length < 2) 
					day = '0' + day;
	
			return [day, month, year].join('-');
		} else {
			let newDate;
			if(e && e !== ""){
				if(e.indexOf('-') !== -1){
					const splitDate = e.split("-");
					newDate = splitDate.reverse().join("-");
				} else {
					newDate = "";
				}
			} else {
				newDate = "";
			}
			return newDate;
		}
	}

	// const onFocusChangeTime = (e) => {
	// 	console.log(e);
	// }

	// const onTimeChangeTime = (e, x, y) => {
	// 	console.log(e)
	// 	console.log(x)
	// 	console.log(y)
	// }

	// const onChangeTime = (time, timeString) => {
	// 	console.log(time, timeString);
	// }

	// const handleChange = (time) => {
	// 	console.log(time);
	// }

	let rows_attachments;
	const data_attachment = attachments_persyaratan ;//(header.negotiation_uuid === null) ?  : (tempConfig) ? tempConfig?.documents : [];
	if (data_attachment && data_attachment.length > 0) {
		rows_attachments = data_attachment.map((dt, i) => {
			const mandatory = (header.negotiation_uuid === null) ? '' : dt.mandatory;
			const is_show_file = (header.negotiation_uuid === null) ? (dt.file !== '' && dt.path !== '') : (dt.file !== null);
			const path = (header.negotiation_uuid === null) ? dt.path : dt.uuid!==undefined ? `files/tendering/${dt.file}` : `files/temp/${dt.file}` ;
				return (
						<tr key={i}>
								<td>
									{dt.description}
									<input disabled={header.on_process} type="hidden" readOnly={false} name={`documents[${i}].description`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.description} />
								</td>
								<td>
									<input readOnly={true} type="text" name={`documents[${i}].file`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.file} />
								</td>
								<td>
									<input disabled={header.on_process} type="checkbox" name={`documents[${i}].mandatory`} defaultChecked={mandatory} ref={register({})} />
								</td>
								<td>
									{!header.on_process && <button type="button" onClick={(e) => deleteAttachments(e, i)} className="btn btn-xs btn-danger"><span className="fa fa-trash"></span></button>}
									{is_show_file && <button type="button" className="btn btn-xs btn-info"  onClick={e => downloadLampiran(e, `${process.env.REACT_APP_API_BASE_URL}${path}` )}><i className="fa fa-file"></i></button>}
								</td>
						</tr>
				)
		})
	} else {
		rows_attachments = (<RowEmpty colSpan='4'>Tidak ada data</RowEmpty>);
	}

	const start_date = (!header.on_process) ? '' : (tempConfig) ? tempConfig?.start_date : '';
	const start_time = (!header.on_process) ? '' : (tempConfig) ? tempConfig?.start_time : '';
	const end_date = (!header.on_process) ? '' : (tempConfig) ? tempConfig?.end_date : '';
	const end_time = (!header.on_process) ? '' : (tempConfig) ? tempConfig?.end_time : '';
	return (
		<div>
			{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
			{(!loadings.items) && <Panel >
				<PanelHeader  noButton={true}>
					Konfigurasi Proses Nego
				</PanelHeader>
				<PanelBody>
					<div className="row">
						<div className="col-md-6">
								<label><b>Edit Jadwal</b></label>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Tanggal Mulai</label>
								<div className="col-sm-4">
										{/* <input disabled={header.on_process} type="date" className={errors['header.start_date'] ? "form-control is-invalid" : "form-control"}  name="header.start_date" ref={register} defaultValue={start_date} /> */}
										<Controller
											control={control}
											name={`header.start_date`}
											defaultValue={formattingDate(start_date)}
											as={<Datetime
												value={formattingDate(start_date)}
												closeOnSelect={true}
												dateFormat="DD-MM-YYYY"
												timeFormat={false}
												inputProps={{ placeholder: header.on_process ? formattingDate(start_date) : "dd/mm/yyyy", disabled: header.on_process}}
												isValidDate={validation}
											/>}
										/>
										{errors['header.start_date'] && <span className="text-danger"> {errors['header.start_date'][0]} </span>}
								</div>
								<label className="col-sm-2 col-form-label">Waktu Mulai</label>
								<div className="col-sm-4">
										{!header.on_process && <Controller
											control={control}
											name={`header.start_time_picker`}
											defaultValue={formattingDate(start_time)}
											as={<TimePicker
												className="xxx"
												value={moment(start_time)}
												onClose={(vv) => {
													const getTime = getValues(`header.start_time_picker`);
													if(getTime !== "" && getTime !== null && getTime !== undefined){
														// console.log(getTime);
														const sTimes = moment(getTime).subtract(1, 'days');
														const nTime = moment(sTimes?._d).format("HH:mm:ss")
														setValue('header.start_time', nTime);
													}
												}}
											/>}
										/>}
										<input disabled={header.on_process} type={"text"} className={(!header.on_process) ? "is-hidden" : "form-control"} name="header.start_time" ref={register} defaultValue={start_time} />
										{errors['header.start_time'] && <span className="text-danger"> {errors['header.start_time'][0]} </span>}
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Tanggal Selesai</label>
								<div className="col-sm-4">
										{/* <input disabled={header.on_process} type="date" className={errors['header.end_date'] ? "form-control is-invalid" : "form-control"}  name="header.end_date" ref={register} defaultValue={end_date} /> */}
										<Controller
											control={control}
											name={`header.end_date`}
											defaultValue={formattingDate(end_date)}
											as={<Datetime
												value={formattingDate(end_date)}
												closeOnSelect={true}
												dateFormat="DD-MM-YYYY"
												timeFormat={false}
												inputProps={{ placeholder: header.on_process ? formattingDate(end_date) : "dd/mm/yyyy", disabled: header.on_process}}
												isValidDate={validation}
											/>}
										/>
										{errors['header.end_date'] && <span className="text-danger"> {errors['header.end_date'][0]} </span>}
								</div>
								<label className="col-sm-2 col-form-label">Waktu Selesai</label>
								<div className="col-sm-4">
										{!header.on_process && <Controller
											control={control}
											name={`header.end_time_picker`}
											defaultValue={formattingDate(end_time)}
											as={<TimePicker
												className="xxx"
												value={moment(end_time)}
												onClose={(vv) => {
													const getTime = getValues(`header.end_time_picker`);
													if(getTime !== "" && getTime !== null && getTime !== undefined){
														// console.log(getTime);
														const sTimes = moment(getTime).subtract(1, 'days');
														const nTime = moment(sTimes?._d).format("HH:mm:ss")
														setValue('header.end_time', nTime);
													}
												}}
											/>}
										/>}
										<input disabled={header.on_process} type={"text"} className={(!header.on_process) ? "is-hidden" : "form-control"}  name="header.end_time" ref={register} defaultValue={end_time} />
										{errors['header.end_time'] && <span className="text-danger"> {errors['header.end_time'][0]} </span>}
								</div>
							</div>
						</div>
						<div className="col-md-6">
								<label><b>Dokumen Lampiran</b></label>
								{errors.documents && <p className="text-danger"> * {errors.documents[0]} </p>}
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Jenis Dokumen</label>
									<div className="col-sm-10">
											<input disabled={header.on_process} type="text" className={validDescriptionLampiran ? "form-control is-invalid" : "form-control"} name="attactment_description" ref={register({ required: false })} onChange={changeDeskripsiLampiran} />
											{validDescriptionLampiran && <span className="text-danger"> {"Description is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Lampiran</label>
									<div className="col-sm-5">
											<input type="text" className={(validLampiran) ? "form-control is-invalid" : "form-control"} name={`attactment_file`} ref={register({ required: false })} placeholder="" disabled={true} defaultValue={lampiran} />
											{/* {(validLampiran) && <span className="text-danger"> {"Files is required"} </span>} */}
									</div>
									{!header.on_process && <div className="col-sm-5">
											<label className="custom-file-upload">
													<input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
													<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
											</label>
									</div>}
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label"> &nbsp; </label>
									<div className="col-sm-10 pull-left">
											<button type="button" className="btn btn-primary btn-xs" onClick={(e) => handleAddLampiran(e)} disabled={header.on_process || loading || loadings.buttonUpload}>
											<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
									</div>
								</div>
								<div className="table-responsive m-t-10">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>Jenis Dokumen</th>
												<th>Deskripsi</th>
												<th>Mandatory</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{rows_attachments}</tbody>
									</table>
								</div>
						</div>
					</div>
					
				</PanelBody>
			</Panel>}
		</div>
	);
}

export default withTranslation()(ConfigNego);