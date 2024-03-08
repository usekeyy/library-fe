import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';

const animatedComponents = makeAnimated();

const Upload = (props) => {
	const { t } = props;
	const { register, control, setValue } = useFormContext();
	const { header } = props.parentState.purchasing_requisition;
	const { attachments } = props.parentState.purchasing_requisition;
	// const {errors} = props.parentState.purchasing_requisition;
	const { uuid } = props.parentState;
	const { optionsTipeLampiran } = props.parentState;
	const { loadings } = props.parentState;

	const [loading, setLoading] = React.useState(false)
	const [tipelampiran, setTipelampiran] = React.useState()
	const [deskripsilampiran, setDeskripsilampiran] = React.useState()
	const [filelampiran, setFilelampiran] = React.useState()
	const [validTypeLampiran, setValidTypeLampiran] = React.useState(false)
	const [validDescriptionLampiran, setValidDescriptionLampiran] = React.useState(false)
	const [validFileLampiran, setValidFileLampiran] = React.useState(false)
	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}

	const changeDeskripsiLampiran = (e) => {
		setDeskripsilampiran(e.target.value)
	}

	const changeFile = (e) => {
		e.preventDefault()
		if (e.target.files[0] !== undefined) {
			setLoading(true);
			props.upload('PR0001', e.target.files[0])
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

	const changeTipeLampiran = (value) => {
		setTipelampiran(value.value)
	}

	const handleAddLampiran = (e) => {
		e.preventDefault()
		setValidTypeLampiran(tipelampiran !== undefined ? false : true);
		setValidDescriptionLampiran(deskripsilampiran !== undefined ? false : true);
		setValidFileLampiran(filelampiran !== undefined ? false : true);
		if (deskripsilampiran === undefined || deskripsilampiran === "" || tipelampiran === undefined || tipelampiran === "" || filelampiran === undefined || filelampiran === "") {
			toastr.warning("Data Tidak Lengkap", "Mohon lengkapi data lampiran")
		} else {
			props.addLampiran({
				description: (deskripsilampiran === undefined) ? "" : deskripsilampiran,
				type: (tipelampiran === undefined) ? "" : tipelampiran,
				file: (filelampiran === undefined) ? "" : filelampiran
			})
			setTipelampiran('')
			setDeskripsilampiran('')
			setFilelampiran('')
			setValue("file", '')
			setValue("attactment_description", '')
			setValue("attactment_type", '')
		}
	}

	const toggleConfirm = (e, id) => {
		e.preventDefault()
		props.toggleConfirm(e,id)
	}

	let rows_attactment;
	if (attachments.length > 0) {
		rows_attactment = attachments.map((dt, i) => {
			return (
				<tr key={i}>
					<td>{i + 1}</td>
					<td>{dt.type.toUpperCase()}</td>
					<td>{dt.description}</td>
					<td>
						{(dt.file !== "") ? <a className="pull-left" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}`} > {dt.file} </a> : dt.file}
					</td>
					<td>{dt.created_by_name}</td>
					<td>{dt.created_at}</td>
					<td>
						{uuid !== '' && (header.status_open !== 0 || header.status_reject !== 0) && !props.parentProps.user.has_roles.includes("KBGPNG") && <button className="btn btn-xs btn-danger" onClick={(e) => toggleConfirm(e,dt.uuid)} value={i} ><i className="danger fa fa-trash"></i></button>}
					</td>
				</tr>
			)
		})
	} else {
		rows_attactment = (<RowEmpty colSpan='7'>Tidak ada data</RowEmpty>);
	}
	// console.log(attachments);

	return (
		<div>
			<Row>
				<Col sm="12">
					{(header.status_open !== 0 || header.status_reject !== 0) && props.parentProps.user.has_roles.includes("PRPLNR")  &&
						<div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Tipe Lampiran</label>
								<div className="col-sm-10">
									<Controller
										components={animatedComponents}
										closeMenuOnSelect={true}
										as={Select}
										control={control}
										options={optionsTipeLampiran}
										className="basic-multi-select"
										classNamePrefix="select"
										name="attactment_type"
										onChange={([selected]) => {
											changeTipeLampiran(selected)
											return selected;
										}}
										styles={validTypeLampiran ? customStyles : {}}
										defaultValue={tipelampiran}
										isClearable
										rules={{ required: false }}
									/>
									{validTypeLampiran && <span className="text-danger"> {"Attachment Type is required"} </span>}
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Description</label>
								<div className="col-sm-10">
									<input type="text" className={validDescriptionLampiran ? "form-control is-invalid" : "form-control"} name="attactment_description" ref={register({ required: false })} onChange={changeDeskripsiLampiran} />
									{validDescriptionLampiran && <span className="text-danger"> {"Description is required"} </span>}
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label">Upload</label>
								<div className="col-sm-5">
									<input type="text" className={validFileLampiran ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={filelampiran} />
									{validFileLampiran && <span className="text-danger"> {"File is required"} </span>}
								</div>
								<div className="col-sm-3">
									<label className="custom-file-upload">
										<input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
										<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
									</label>
								</div>
								<div className="col-sm-2 pull -left">
									<button className="btn btn-primary" onClick={(e) => handleAddLampiran(e)} disabled={loading || loadings.buttonUpload}>
										<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
								</div>
							</div>
						</div>}

					<div className="row">
						<div className="col-sm-12">
							<div className="table-responsive">
								<table className="table table-bordered table-striped table-sm">
									<thead>
										<tr>
											<th>No</th>
											<th>Tipe Lampiran</th>
											<th>Description</th>
											<th>File</th>
											<th>Upload By</th>
											<th>Upload At</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>{rows_attactment}</tbody>
								</table>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
}

export default withTranslation()(Upload);