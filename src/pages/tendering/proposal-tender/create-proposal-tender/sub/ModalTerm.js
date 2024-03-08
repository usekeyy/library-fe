import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';

const animatedComponents = makeAnimated();

const ModalTerm = (props) => {
	const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
	const { t } = props;
	const { register,control, handleSubmit, setValue, getValues } = useForm({});
	const {header} = props.parentState.proposal_tender;
	const {errors} = props.parentState.proposal_tender;
	// const {uuid} = props.parentState;
	const {proposal_tender} = props.parentState;
	const {loading} = props.parentState.proposal_tender;
	const {m_template_persyaratan_item} = props.parentState.proposal_tender;
	const {attachments_persyaratan} = props.parentState.proposal_tender;
	const {m_template_persyaratan_item_komersil} = props.parentState.proposal_tender;
	const {attachments_persyaratan_komersil} = props.parentState.proposal_tender;
	const {modalType} = props.parentState;
	const {loadings} = props.parentState;
	const [validDescriptionLampiran, setValidDescriptionLampiran] = React.useState(false)
	const [deskripsilampiran, setDeskripsilampiran] = React.useState()
	const [validDescriptionTemplate, setValidDescriptionTemplate] = React.useState(false)
	const [deskripsiTemplate, setDeskripsiTemplate] = React.useState()
	// const [tipe_template, set_tipe_template] = React.useState()
	// const [detail, set_detail] = React.useState(false)
	// const [teknis, set_teknis] = React.useState(false)
	const [errTerms, setErrTerms] = React.useState(false)
	const [errTermsAdmin, setErrTermsAdmin] = React.useState(false)
	const [err_bobot_teknis, setErr_bobot_teknis] = React.useState(false)
	const [err_bobot_komersil, setErr_bobot_komersil] = React.useState(false)
	const [err_ambang_batas, setErr_ambang_batas] = React.useState(false)
	const [errBobotDetail, setErrBobotDetail] = React.useState(false)
	const [errBobotTerm, setErrBobotTerm] = React.useState(false)
	const [loadingBtn, setLoadingBtn] = React.useState(false)

	let data_terms;
	if(modalType === 'teknikal'){
		data_terms = header.terms;
	} else {
		data_terms = header.terms_komersil;
	}

	let rows;
	let data_item;
	let data_attach;
	if(modalType === 'teknikal'){
		data_item = m_template_persyaratan_item;
		data_attach = attachments_persyaratan;
	} else {
		data_item = m_template_persyaratan_item_komersil;
		data_attach = attachments_persyaratan_komersil;
	}

	const onSubmit = async data => {
		console.log(data);
		setLoadingBtn(true);
		const arr = []
		let errBterm = false;
		let errBdetail = false;
		let lengthTerms = (modalType === 'teknikal') ? m_template_persyaratan_item : m_template_persyaratan_item_komersil;
		let lengthTermsAdmin = attachments_persyaratan;
		(lengthTerms.length > 0) ? setErrTerms(false) : setErrTerms(true);
		(lengthTermsAdmin.length > 0) ? setErrTermsAdmin(false) : setErrTermsAdmin(true);
		if(modalType === 'teknikal'){;
			if(data.terms !== undefined && header.metode_evaluasi.value === 'sistem_nilai'){
				data.terms.forEach(item => {
					arr.push(parseInt(item.bobot))
				})
				// setBobot_term(arr)
				const sum_bobot_term = arr.reduce((a, b) => a + b, 0)
				if(sum_bobot_term !== 100){
					// toastr.warning("Validation Fail", "Total Bobot Persyaratan Teknis Harus 100");
					setErrBobotTerm(true);
					errBterm = true;
				} else {
					errBterm = false;
					setErrBobotTerm(false)
				}
			}
	
			(data.bobot_teknis !== 0) ? setErr_bobot_teknis(false) : setErr_bobot_teknis(true);
			(data.bobot_komersil !== 0) ? setErr_bobot_komersil(false) : setErr_bobot_komersil(true);
			(data.ambang_batas !== 0) ? setErr_ambang_batas(false) : setErr_ambang_batas(true);
	
			if(header.metode_evaluasi.value === 'sistem_nilai'){
				const total_detail_bobot = parseInt(getValues('bobot_teknis')) + parseInt(getValues('bobot_komersil'));
				if(total_detail_bobot !== 100){
					toastr.warning('Validation Fail');
					errBdetail = true;
					setErrBobotDetail(true)
				} else {
					errBdetail = false;
					setErrBobotDetail(false)
				}
			} 
		}

		const checkTermAdmin = (modalType === 'teknikal') ? lengthTermsAdmin.length > 0 : true;
		
		if(errBterm === false && errBdetail === false && lengthTerms.length > 0 && checkTermAdmin){
			const headerDt = {
				ambang_batas: data.ambang_batas,
				bobot_komersil: data.bobot_komersil,
				bobot_teknis: data.bobot_teknis,
			}
			setData(data)
			props.setTermData((data.terms !== undefined) ? data.terms : [], headerDt, data.tipe_id, false, modalType, (data.terms_administratif !== undefined) ? data.terms_administratif : []);
			props.toggleClose()
			setLoadingBtn(false);
		} else {
			setLoadingBtn(false);
		}

	};

	const setData = (data) => {
		// delete data.tipe_id;
		delete data.attactment_description;
		delete data.metode_evaluasi;
	}

	const handleChangeTerm = (e) => {
		if(e !== null){
			const params = {
				template_persyaratan_id: e.value
			}
			// set_tipe_template(e.value)
			props.fetchTemplatePersyaratanItem(params, modalType)
		} else {
			const headerDt = {
				ambang_batas: '',
				bobot_komersil: '',
				bobot_teknis: '',
			}
			props.setTermData([], headerDt, e, [], modalType);
		}
	}

	const deleteAttachments = (e, id) => {
		e.preventDefault()
		props.deleteLampiranTerm(id, modalType)
	}

	const deleteTerms = (e, id) => {
		e.preventDefault()
		props.deleteTerms(id, modalType)
	}

	const changeDeskripsiLampiran = (e) => {
		setDeskripsilampiran(e.target.value)
	}
	
	const changeDeskripsiTemplate = (e) => {
		setDeskripsiTemplate(e.target.value)
	}
	
	const handleAddLampiran = (e) => {
		e.preventDefault()
		setValidDescriptionLampiran(deskripsilampiran !== undefined ? false : true);
		if (deskripsilampiran === undefined || deskripsilampiran === "") {
				toastr.warning("Data Tidak Lengkap", "Mohon lengkapi data lampiran")
		} else {
				props.addLampiranTerm({
						description: (deskripsilampiran === undefined) ? "" : deskripsilampiran,
				}, modalType)
				setDeskripsilampiran('')
				setValue("attactment_description", '')
		}
	}

	const handleAddTemplate = (e) => {
		e.preventDefault()
		setValidDescriptionTemplate(deskripsiTemplate !== undefined ? false : true);
		if (deskripsiTemplate === undefined || deskripsiTemplate === "") {
				toastr.warning("Data Tidak Lengkap", "Mohon lengkapi data Template")
		} else {
				props.addTemplateTerm({
						description: (deskripsiTemplate === undefined) ? "" : deskripsiTemplate,
				}, modalType)
				setDeskripsiTemplate('')
				setValue("lampiran_description", '')
		}
	}

	const validAmbangBatas = (e) => {
		e.preventDefault()
		const val = Number(e.target.value);
    if (val < 0 || val > 100) {
			setValue('ambang_batas', 0)
      setErr_ambang_batas(true)
    } else {
      setErr_ambang_batas(false)
    }
	}
	
	if (data_item.length > 0 ) {
		rows = data_item.map((dt, i) => {
				return (
						<tr key={i}>
								<td>
									{dt.description}
									<input type="hidden" readOnly={false} name={`terms[${i}].description`} ref={register({})} defaultValue={dt.description} />
									{modalType === 'teknikal' && <input type="hidden" name={`terms[${i}].tipe`} defaultValue={4} ref={register({})} />}
									{modalType === 'komersial' && <input type="hidden" name={`terms[${i}].tipe`} defaultValue={6} ref={register({})} />}
								</td>
								<td>
									{modalType === 'teknikal' && <input type="number" readOnly={false} name={`terms[${i}].bobot`} ref={register({})} className={(errBobotTerm) ? "form-control is-invalid" : "form-control"}  defaultValue={(data_terms[i] && data_terms.length > 0 && data_terms !== undefined) ? data_terms[i].bobot : 0} disabled={header.metode_evaluasi.value === 'sistem_gugur'} />}
									{modalType === 'komersial' && <input type="checkbox" name={`terms[${i}].attachment`} defaultChecked={(data_terms[i]) ? data_terms[i].attachment : ''} ref={register({})} />}
								</td>
								<td>
									<button type="button" onClick={(e) => deleteTerms(e, i)} className="btn btn-xs btn-danger"><span className="fa fa-trash"></span></button>
								</td>
						</tr>
				)
		})
	} else {
		rows = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>);
	}

	let rows_attachments;
	console.log(header.terms_admin);
	if (data_attach.length > 0) {
		rows_attachments = data_attach.map((dt, i) => {
				return (
						<tr key={i}>
								<td>
									{dt.description}
									<input type="hidden" readOnly={false} name={`terms_administratif[${i}].description`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.description} />
								</td>
								<td>
									{modalType === 'teknikal' && <input type="checkbox" name={`terms_administratif[${i}].attachment`} defaultChecked={(header.terms_admin !== undefined && header.terms_admin[i]) ? header.terms_admin[i].attachment : ''} ref={register({})} />}
									{modalType === 'teknikal' && <input type="hidden" name={`terms_administratif[${i}].tipe`} defaultValue={2} ref={register({})} />}
									{modalType === 'komersial' && <input type="checkbox" name={`terms[${i}].attachment`} defaultChecked={(data_terms[i]) ? data_terms[i].attachment : ''} ref={register({})} />}
									{modalType === 'komersial' && <input type="hidden" name={`terms[${i}].tipe`} defaultValue={6} ref={register({})} />}
								</td>
								<td>
									<button type="button" onClick={(e) => deleteAttachments(e, i)} className="btn btn-xs btn-danger"><span className="fa fa-trash"></span></button>
								</td>
						</tr>
				)
		})
	} else {
		rows_attachments = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>);
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{modalType === 'teknikal' && header.metode_evaluasi.value === 'sistem_nilai' && <Panel >
						<PanelHeader  noButton={true}>
							Detail Persyaratan
						</PanelHeader>
						{errBobotDetail && <h6 className="text-danger m-t-10"> * Total Bobot Teknis dan Bobot Komersial Tidak Sesuai </h6>}
						<div className="row m-t-10">
							<div className="col-md-12">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Metode Evaluasi </label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="metode_evaluasi" ref={register({})} className="form-control" placeholder="" defaultValue={header.metode_evaluasi.label} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Bobot Teknis </label>
										<div className="col-sm-10">
												<input type="number" readOnly={false} name="bobot_teknis" ref={register({})} className={(err_bobot_teknis || errBobotDetail) ? "form-control is-invalid" : "form-control"} defaultValue={(header.bobot_teknis !== '') ? header.bobot_teknis : 0} />
												{err_bobot_teknis && <span className="text-danger"> {`Bobot Teknis Validation Fail`} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Bobot Komersial </label>
										<div className="col-sm-10">
												<input type="number" readOnly={false} name="bobot_komersil" ref={register({})} className={(err_bobot_komersil || errBobotDetail) ? "form-control is-invalid" : "form-control"} defaultValue={(header.bobot_komersil !== '') ? header.bobot_komersil : 0} />
												{err_bobot_komersil && <span className="text-danger"> {`Bobot Komersil Validation Fail`} </span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Ambang Batas </label>
										<div className="col-sm-10">
												<input type="number" readOnly={false} name="ambang_batas" ref={register({})} className={(err_ambang_batas) ? "form-control is-invalid" : "form-control"} onKeyUp={(e) => validAmbangBatas(e)} defaultValue={(header.ambang_batas !== '') ? header.ambang_batas : 0} min={0} max={100} />
												{err_ambang_batas && <span className="text-danger"> {`Ambang Batas Validation Fail`} </span>}
										</div>
								</div>
							</div>
						</div>
					</Panel>}

					{modalType === 'teknikal' && <Panel >
						<PanelHeader  noButton={true}>
							{modalType === 'teknikal' ? 'Persyaratan Administratif dan Teknis' : 'Persyaratan'}
						</PanelHeader>
						{errTermsAdmin && <h6 className="text-danger m-t-10"> Template Is Required </h6>}
							<div className="form-group">
								<div className="form-group row m-t-10">
									<label className="col-sm-2 col-form-label">Description</label>
									<div className="col-sm-10">
											<input type="text" className={validDescriptionLampiran ? "form-control is-invalid" : "form-control"} name="attactment_description" ref={register({ required: false })} onChange={changeDeskripsiLampiran} />
											{validDescriptionLampiran && <span className="text-danger"> {"Description is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label"> &nbsp; </label>
									<div className="col-sm-10 pull-left">
											<button className="btn btn-primary btn-xs" onClick={(e) => handleAddLampiran(e)} disabled={loading || loadings.buttonUpload}>
											<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
									</div>
								</div>
								<div className="table-responsive m-t-10">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>Description</th>
												<th>Attachment ({t("required")})</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{rows_attachments}</tbody>
									</table>
								</div>
						</div>
					</Panel>}

					<Panel >
						<PanelHeader  noButton={true}>
							{modalType === 'teknikal' ? 'Aspek Teknis' : 'Pilih Template'}
						</PanelHeader>
						{errTerms && <h6 className="text-danger m-t-10"> Template Is Required </h6>}
						<div className="form-group row m-t-10">
								<label className="col-sm-2 col-form-label">Pilih Template </label>
								<div className="col-sm-10">
									<Controller
										components={animatedComponents}
										closeMenuOnSelect={true}
										as={Select} 
										placeholder={loadings.tipe ? t("Select.Sedang Memuat") : t("Select.Pilih") }
										isLoading={loadings.tipe}
										className="basic-multi-select"
										classNamePrefix="select"
										name="tipe_id"
										onChange={([selected]) => {
											handleChangeTerm(selected)
											return selected;
										}}
										styles={errors.tipe_id ? customStyles : {}}
										control={control}
										options={proposal_tender.m_template_persyaratan} 
										defaultValue={modalType === 'teknikal' ? header.tipe_template : header.tipe_template_komersil}
										rules={{ required: false }} 
										isClearable={true} />
								</div>
						</div>
						<div className="form-group">
							{errBobotTerm && <h6 className="text-danger"> * Total Bobot Tidak Sesuai </h6>}
							<div className="form-group row m-t-10">
								<label className="col-sm-2 col-form-label">Description</label>
								<div className="col-sm-10">
										<input type="text" className={validDescriptionTemplate ? "form-control is-invalid" : "form-control"} name="lampiran_description" ref={register({ required: false })} onChange={changeDeskripsiTemplate} />
										{validDescriptionTemplate && <span className="text-danger"> {"Description is required"} </span>}
								</div>
							</div>
							<div className="form-group row">
								<label className="col-sm-2 col-form-label"> &nbsp; </label>
								<div className="col-sm-10 pull-left m-b-10">
										<button className="btn btn-primary btn-xs" onClick={(e) => handleAddTemplate(e)} disabled={loading || loadings.buttonUpload}>
										<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
								</div>
							</div>
							<div className="table-responsive m-t-10">
								<table className="table table-bordered table-striped table-sm text-nowrap">
									<thead>
										<tr>
											<th>Description</th>
											<th>{modalType === 'teknikal' ? 'Bobot' : 'Attachment ('+t("required")+')'}</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>{rows}</tbody>
								</table>
							</div>
						</div>
					</Panel>

					
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} disabled={loadingBtn}>{t("currency:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={loadingBtn}> 
					{loadingBtn && <i className="fa fa-spinner fa-spin"></i>}
					Save </button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(ModalTerm);