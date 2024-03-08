import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatDate} from '../../../../../helpers/formatDate';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const Schedule = (props) => {
    // const { t } = props;
		const { register, control } = useFormContext();
		// const { t } = props.parentProps;
		const {m_jadwal_tender} = props.parentState.proposal_tender;
		const {dateNow} = props.parentState;
		// const [openInput, setOpenInput] = React.useState([])
		// const [openInputAll, setOpenInputAll] = React.useState(true)
		// const [openTable, setOpenTable] = React.useState(false)
		const openInput = []
		const openInputAll = true
		const openTable = false
		const {header} = props.parentState.proposal_tender;
		const {errors} = props.parentState.proposal_tender;
		const {schedules} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		const {hideNav} = props.parentState;
		let rows;

		const validation = (currentDate) => {
			return currentDate.isAfter(moment(dateNow));
		};
		// const handleEdit = (i) => {
		// 	setOpenTable(true);
		// 	if(openInput.includes(i)){
		// 		const index = openInput.indexOf(i);
		// 		openInput.splice(index, 1);
		// 	} else {
		// 		openInput.push(i);
		// 	}
		// 	setOpenInput(openInput);
		// 	setTimeout(() => {
		// 		setOpenTable(false);
		// 	}, 1)
		// }

		// const handleEditAll = (i) => {
		// 	setOpenTable(true);
		// 	setTimeout(() => {
		// 		setOpenTable(false);
		// 		setOpenInputAll(!openInputAll)
		// 	}, 1)
		// }

		
		if (m_jadwal_tender.length > 0) {
			rows = m_jadwal_tender.map((dt, i) => {
				const show_metode_aanwijzing = (header.metode_aanwijzing_id !== '' && header.metode_aanwijzing_id !== undefined && header.metode_aanwijzing_id !== null) ? header.metode_aanwijzing_id.value === 3 && dt.code === 'JT003' : false;
				const schedules_value = schedules.length > 0 ? schedules.filter(i => i.jadwal_tender_code === dt.code) : '';
				
				const start_date_value = schedules_value !== '' && schedules_value !== null ? schedules_value[0].start_date : '';
				const start_time_value = schedules_value !== '' && schedules_value[0].start_time !== null ? schedules_value[0].start_time.split(":").slice(0, -1).join(":") : '';
				const end_date_value = schedules_value !== '' && schedules_value !== null ? schedules_value[0].end_date : '';
				const end_time_value = schedules_value !== '' && schedules_value[0].end_time !== null ? schedules_value[0].end_time.split(":").slice(0, -1).join(":") : '';
				// console.log(start_time_value);
						return (
								<tr key={i}>
										<td>
											{dt.name} {!show_metode_aanwijzing && <span className="text-danger">*</span>}
											<input type="hidden" readOnly={true} name={`schedule[${i}].jadwal_tender_id`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.id} />
											<input type="hidden" readOnly={true} name={`schedule[${i}].jadwal_tender_name`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.name} />
											<input type="hidden" readOnly={true} name={`schedule[${i}].jadwal_tender_code`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.code} />
										</td>
										<td>
											{/* <input type="date" min={dateNow} disabled={show_metode_aanwijzing} readOnly={ (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true } name={`schedule[${i}].start_date`} ref={register({})} className={(errors[`schedules.${i}.start_date`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={start_date_value} /> */}
											<Controller
												control={control}
												name={`schedule[${i}].start_date`}
												defaultValue={start_date_value !== undefined && start_date_value !== '' ? moment(start_date_value).format("DD-MM-YYYY") : ''}
												as={<Datetime
													value={start_date_value !== undefined && start_date_value !== '' ? moment(start_date_value).format("DD-MM-YYYY") : ''}
													closeOnSelect={true}
													dateFormat="DD-MM-YYYY"
													timeFormat={false}
													inputProps={{ placeholder: "dd/mm/yyyy", disabled: show_metode_aanwijzing, readOnly: (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true }}
													isValidDate={validation}
												/>}
											/>
											{errors[`schedules.${i}.start_date`] && <span className="text-danger"> {errors[`schedules.${i}.start_date`][0]} </span>}
										</td>
										<td>
											<input type="time" disabled={show_metode_aanwijzing} readOnly={ (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true } name={`schedule[${i}].start_time`} ref={register({})} className={(errors[`schedules.${i}.start_time`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={start_time_value} />
											{errors[`schedules.${i}.start_time`] && <span className="text-danger"> {errors[`schedules.${i}.start_time`][0]} </span>}
										</td>
										<td>
											{/* <input type="date" min={dateNow} disabled={show_metode_aanwijzing} readOnly={ (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true } name={`schedule[${i}].end_date`} ref={register({})} className={(errors[`schedules.${i}.end_date`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={end_date_value} /> */}
											<Controller
												control={control}
												name={`schedule[${i}].end_date`}
												defaultValue={end_date_value !== undefined && end_date_value !== '' ? moment(end_date_value).format("DD-MM-YYYY") : ''}
												as={<Datetime
													value={end_date_value !== undefined && end_date_value !== '' ? moment(end_date_value).format("DD-MM-YYYY") : ''}
													closeOnSelect={true}
													dateFormat="DD-MM-YYYY"
													timeFormat={false}
													inputProps={{ placeholder: "dd/mm/yyyy", disabled: show_metode_aanwijzing, readOnly: (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true }}
													isValidDate={validation}
												/>}
											/>
											{errors[`schedules.${i}.end_date`] && <span className="text-danger"> {errors[`schedules.${i}.end_date`][0]} </span>}
										</td>
										<td>
											<input type="time" disabled={show_metode_aanwijzing} readOnly={ (openInputAll) ? false : (openInput.indexOf(i) !== -1) ? false : true } name={`schedule[${i}].end_time`} ref={register({})} className={(errors[`schedules.${i}.end_time`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={end_time_value} />
											{errors[`schedules.${i}.end_time`] && <span className="text-danger"> {errors[`schedules.${i}.end_time`][0]} </span>}
										</td>
										<td>
											{/* {openInputAll === false && <button type="button" className={(openInput.indexOf(i) === -1) ? "btn btn-xs btn-warning" : "btn btn-xs btn-danger"} onClick={() => handleEdit(i)} disabled={loadings.button} >
												{(openInput.indexOf(i) === -1) && <i className="fa fa-edit"></i>}
												{(openInput.indexOf(i) !== -1) && <i className="fa fa-times"></i>}
											</button>} */}
										</td>
								</tr>
						)
				})

				rows.push(
					<tr key={m_jadwal_tender.length + 1}>
							<td colSpan="5"></td>
							<td>
								{/* <button type="button" className={openInputAll ? "btn btn-xs btn-danger	q	" : "btn btn-xs btn-warning" } onClick={() => handleEditAll()} disabled={loadings.button} >
									{openInputAll ? 'Batal' : 'Edit Semua'}
								</button> */}
								<button type="button" className="btn btn-xs btn-primary" >
									History
								</button>
							</td>
					</tr>
			)
		} else {
			rows = (<RowEmpty colSpan='6'>Tidak ada data</RowEmpty>);
		}
		
    return (
			<div>
				<Panel>
						<PanelHeader>Jadwal Tender</PanelHeader>
						{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
						{(!loadings.items) &&
						<PanelBody >
							<div className="row">
									<div className="col-sm-12">
										{errors['schedules'] && <h6 className="text-danger"> {errors['schedules'][0]} </h6>}
											<div className={hideNav ? "table-responsive" : ""}>
													{openTable === false && <table className="table table-bordered table-striped table-sm text-nowrap">
															<thead>
																	<tr>
																			<th>Proses</th>
																			<th>Start Date</th>
																			<th>Start Time</th>
																			<th>End Date</th>
																			<th>End Time</th>
																			<th>Action</th>
																	</tr>
															</thead>
															<tbody>{rows}</tbody>
													</table>}
											</div>
									</div>
								</div>
						</PanelBody>}
					</Panel>
			</div>
    );
}

export default Schedule;