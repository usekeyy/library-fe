import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

import { toastr } from 'react-redux-toastr';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';

const Participant = (props) => {
	const { t } = props;
	const { register, setValue, } = useFormContext({});
	// const {errors} = props.parentState.proposal_tender;
	const {loading} = props.parentState.proposal_tender;
	const {participants} = props.parentState.proposal_tender;
	const {loadings} = props.parentState;
	const [validName, setValidName] = React.useState(false)
	const [validJabatan, setValidJabatan] = React.useState(false)
	const [validDepartment, setValidDepartment] = React.useState(false)
	const [nameparticipant, setNameparticipant] = React.useState('')
	const [jabatanparticipant, setJabatanparticipant] = React.useState('')
	const [departmentparticipant, setDepartmentparticipant] = React.useState('')

	// const onSubmit = async data => {
		
	// };

	// const setData = (data) => {

	// }

	const deleteAttachments = (e, id) => {
		e.preventDefault()
		props.deleteParticipant(id)
	}

	const changeNameParticipant = (e) => {
		setNameparticipant(e.target.value)
	}
	const changeJabatanParticipant = (e) => {
		setJabatanparticipant(e.target.value)
	}
	const changeDepartmentParticipant = (e) => {
		setDepartmentparticipant(e.target.value)
	}
	
	const handleAddLampiran = (e) => {
		e.preventDefault()
		setValidName(nameparticipant !== '' ? false : true);
		setValidJabatan(jabatanparticipant !== '' ? false : true);
		setValidDepartment(departmentparticipant !== '' ? false : true);
		if (nameparticipant === "" || jabatanparticipant === "" || departmentparticipant === "") {
				toastr.warning("Data Tidak Lengkap", "Mohon lengkapi data participant")
		} else {
				props.addParticipant({
						name: (nameparticipant === undefined) ? "" : nameparticipant,
						jabatan: (jabatanparticipant === undefined) ? "" : jabatanparticipant,
						department: (departmentparticipant === undefined) ? "" : departmentparticipant,
				})
				setValue('name', '')
				setValue('jabatan', '')
				setValue('department', '')
				setNameparticipant('')
				setJabatanparticipant('')
				setDepartmentparticipant('')
		}
	}

	let rows_participant;
	if (participants.length > 0) {
		rows_participant = participants.map((dt, i) => {
				return (
						<tr key={i}>
								<td>
									{dt.name}
									<input type="hidden" readOnly={false} name={`paticipants[${i}].name`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.name} />
								</td>
								<td>
									{dt.jabatan}
									<input type="hidden" readOnly={false} name={`paticipants[${i}].jabatan`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.jabatan} />
								</td>
								<td>
									{dt.department}
									<input type="hidden" readOnly={false} name={`paticipants[${i}].department`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.department} />
								</td>
								<td>
									<button type="button" onClick={(e) => deleteAttachments(e, i)} className="btn btn-xs btn-danger"><span className="fa fa-trash"></span></button>
								</td>
						</tr>
				)
		})
	} else {
		rows_participant = (<RowEmpty colSpan='4'>Tidak ada data</RowEmpty>);
	}

	return (
		<div>
			{<Panel >
				<PanelHeader  noButton={true}>
					Panitia Pengadaan
				</PanelHeader>
				<PanelBody>
					<div className="row">
						<div className="col-md-12">
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Nama</label>
									<div className="col-sm-10">
											<input type="text" className={validName ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} onChange={changeNameParticipant} />
											{validName && <span className="text-danger"> {"Name is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Jabatan</label>
									<div className="col-sm-10">
											<input type="text" className={validJabatan ? "form-control is-invalid" : "form-control"} name="jabatan" ref={register({ required: false })} onChange={changeJabatanParticipant} />
											{validJabatan && <span className="text-danger"> {"Jabatan is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label">Department</label>
									<div className="col-sm-10">
											<input type="text" className={validDepartment ? "form-control is-invalid" : "form-control"} name="department" ref={register({ required: false })} onChange={changeDepartmentParticipant} />
											{validDepartment && <span className="text-danger"> {"Department is required"} </span>}
									</div>
								</div>
								<div className="form-group row">
									<label className="col-sm-2 col-form-label"> &nbsp; </label>
									<div className="col-sm-10 pull-left">
											<button type="button" className="btn btn-primary btn-xs" onClick={(e) => handleAddLampiran(e)} disabled={loading || loadings.buttonUpload}>
											<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} /> {t('Button.Tambah')} </button>
									</div>
								</div>
								<div className="table-responsive m-t-10">
									<table className="table table-bordered table-striped table-sm text-nowrap">
										<thead>
											<tr>
												<th>Nama</th>
												<th>Jabatan</th>
												<th>Department</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>{rows_participant}</tbody>
									</table>
								</div>
						</div>
					</div>
					
				</PanelBody>
			</Panel>}
		</div>
	);
}

export default withTranslation()(Participant);