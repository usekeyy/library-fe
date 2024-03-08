import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';

// const animatedComponents = makeAnimated();

const ConfigNego = (props) => {
	// const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
	const { t } = props;
	const { register, setValue } = useFormContext();
	const {header} = props.parentState.re_nego;
	const {errors} = props.parentState.re_nego;
	// const {uuid} = props.parentState;
	// const {re_nego} = props.parentState;
	const {loading} = props.parentState.re_nego;
	const {attachments_persyaratan} = props.parentState.re_nego;
	// const {modalType} = props.parentState;
	const {loadings} = props.parentState;
	const [validDescriptionLampiran, setValidDescriptionLampiran] = React.useState(false)
	const [deskripsilampiran, setDeskripsilampiran] = React.useState()

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
		if (deskripsilampiran === undefined || deskripsilampiran === "") {
				toastr.warning("Data Tidak Lengkap", "Mohon lengkapi data lampiran")
		} else {
				props.addLampiranTerm({
						description: (deskripsilampiran === undefined) ? "" : deskripsilampiran,
				})
				setDeskripsilampiran('')
				setValue("attactment_description", '')
		}
	}

	let rows_attachments;
	if (attachments_persyaratan.length > 0) {
		rows_attachments = attachments_persyaratan.map((dt, i) => {
				return (
						<tr key={i}>
								<td>
									{dt.description}
									<input type="hidden" readOnly={false} name={`documents[${i}].description`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.description} />
								</td>
								<td>
									<input type="checkbox" name={`documents[${i}].mandatory`} defaultChecked={dt.mandatory} disabled={false} ref={register({})} />
								</td>
								<td>
									<button type="button" onClick={(e) => deleteAttachments(e, i)} className="btn btn-xs btn-danger" disabled={false}><span className="fa fa-trash"></span></button>
								</td>
						</tr>
				)
		})
	} else {
		rows_attachments = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>);
	}

	return (
		<div>
			{<Panel >
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
										<input type="date" className={errors['header.start_date'] ? "form-control is-invalid" : "form-control"}  name="header.start_date" defaultValue={header.start_date} disabled={false} ref={register} />
										{errors['header.start_date'] && <span className="text-danger"> {errors['header.start_date'][0]} </span>}
								</div>
								<label className="col-sm-2 col-form-label">Waktu Mulai</label>
								<div className="col-sm-4">
										<input type="time" step="1" className={errors['header.start_time'] ? "form-control is-invalid" : "form-control"}  name="header.start_time" defaultValue={header.start_time} disabled={false} ref={register} />
										{errors['header.start_time'] && <span className="text-danger"> {errors['header.start_time'][0]} </span>}
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Tanggal Selesai</label>
								<div className="col-sm-4">
										<input type="date" className={errors['header.end_date'] ? "form-control is-invalid" : "form-control"}  name="header.end_date" defaultValue={header.end_date} disabled={false} ref={register} />
										{errors['header.end_date'] && <span className="text-danger"> {errors['header.end_date'][0]} </span>}
								</div>
								<label className="col-sm-2 col-form-label">Waktu Selesai</label>
								<div className="col-sm-4">
										<input type="time" step="1" className={errors['header.end_time'] ? "form-control is-invalid" : "form-control"}  name="header.end_time" defaultValue={header.end_time} disabled={false} ref={register} />
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
											<input type="text" className={validDescriptionLampiran ? "form-control is-invalid" : "form-control"} name="attactment_description" disabled={false} ref={register({ required: false })} onChange={changeDeskripsiLampiran} />
											{validDescriptionLampiran && <span className="text-danger"> {"Description is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label"> &nbsp; </label>
									<div className="col-sm-10 pull-left">
											<button type="button" className="btn btn-primary btn-xs" onClick={(e) => handleAddLampiran(e)} disabled={false}>
											<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
									</div>
								</div>
								<div className="table-responsive m-t-10">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>Jenis Dokumen</th>
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