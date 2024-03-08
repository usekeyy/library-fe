import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation';
import { formatDate } from '../../../../../helpers/formatDate'

const animatedComponents = makeAnimated();

const Attachment = (props) => {
    const { t } = props;
		const { register, control, setValue } = useFormContext();
		// const {header} = props.parentState.proposal_tender;
		const {attachments} = props.parentState.proposal_tender;
		// const {errors} = props.parentState.proposal_tender;
		// const {uuid} = props.parentState;
		// const {optionsTipeLampiran} = props.parentState;
		const optionsTipeLampiran = [
			{ value: "tor", label: "TOR" },
			{ value: "oe", label: "OE" },
			{ value: "rks", label: "RKS" },
			{ value: "lainnya", label: "LAINNYA" }
		];
		
		const {loadings} = props.parentState;
		
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
		// console.log(attachments)
		
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
							isSelfUpload: true,
							id: null,
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

		const handleDeleteLampiran = (e, id) => {
			e.preventDefault()
			props.deleteLampiran(id)
		}

		let rows_attactment;
    if (attachments.length > 0) {
        rows_attactment = attachments.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.number_pr}</td>
                    <td>{dt.type}</td>
                    <td>{dt.description}</td>
                    <td>{dt.created_by_name}</td>
                    <td>{formatDate(dt.created_at, true)}</td>
                    <td>
											{(dt.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={ (dt.id===null) ? `${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.file}` : `${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` } > {dt.file} </a> : dt.file }
										</td>
										<td>
											{dt.type !== 'oe' && <input type="checkbox" name={`documents[${i}].share`} ref={register({})} />}
											<input type="hidden" name={`documents[${i}].status`} ref={register({})} defaultValue={`d`} />
											<input type="hidden" name={`documents[${i}].purchasing_requisition_attachment_id`} ref={register({})} defaultValue={dt.id} />
											<input type="hidden" name={`documents[${i}].type`} ref={register({})} defaultValue={dt.type} />
											<input type="hidden" name={`documents[${i}].description`} ref={register({})} defaultValue={dt.description} />
											<input type="hidden" name={`documents[${i}].file`} ref={register({})} defaultValue={dt.file} />
										</td>
                    <td>
                        {<button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteLampiran(e, i)} value={i} ><i className="danger fa fa-trash"></i></button> }
                    </td>
                </tr>
            )
        })
    } else {
        rows_attactment = (<RowEmpty colSpan='8'>Tidak ada data</RowEmpty>);
		}

    return (
			<div>
				<Panel>
					<PanelHeader>Dokumen Pengadaan</PanelHeader>
					{loading === 'xxx' && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{
					<PanelBody>
					<Row>
					<Col sm="12">
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
										<FileUploadInformation idFileUpload="PR0001"/>
										{validFileLampiran && <span className="text-danger"> {"File is required"} </span>}
								</div>
								<div className="col-sm-3">
										<label className="custom-file-upload">
												<input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
												<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
										</label>
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label"> &nbsp; </label>
								<div className="col-sm-10 pull-left">
										<button className="btn btn-primary btn-xs" onClick={(e) => handleAddLampiran(e)} disabled={loading || loadings.buttonUpload}>
										<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
								</div>
							</div>
						</div>
																		
						<div className="row">
							<div className="col-sm-12">
								<div className="table-responsive">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>No</th>
												<th>No PR</th>
												<th>Tipe Lampiran</th>
												<th>Description</th>
												<th>Uploaded By</th>
												<th>Uploaded At</th>
												<th>File</th>
												<th>Share</th>
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
				</PanelBody>
				}
			</Panel>
		</div>
    );
}

export default withTranslation()(Attachment);