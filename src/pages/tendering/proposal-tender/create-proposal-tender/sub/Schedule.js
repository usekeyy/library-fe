import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {statusName} from '../../../../../helpers/statusName';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

// let tomorrow = new Date();
// tomorrow.setDate(tomorrow.getDate()+1);
// const minDate = moment(tomorrow).format("MM/DD/YYYY HH:mm");

const Schedule = (props) => {
    // const { t } = props;
		const { register, setValue } = useFormContext();
		// const { t } = props.parentProps;
		const {m_jadwal_tender} = props.parentState.proposal_tender;
		// const {dateNow} = props.parentState;
		// const [openInput, setOpenInput] = React.useState([])
		// const [openInputAll, setOpenInputAll] = React.useState(true)
		// const [openTable, setOpenTable] = React.useState(false)
		const openTable = false
		const [startDatePicker, setStartDatePicker] = React.useState([])
		const [showDatePicker, setShowDatePicker] = React.useState([])
		const [errDatePicker, setErrDatePicker] = React.useState([])
		const [loadingDatePicker, setLoadingDatePicker] = React.useState([])
		const {header} = props.parentState.proposal_tender;
		const {errors} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		const {hideNav} = props.parentState;
		const {date_server} = props.parentState;
		
		let tomorrow = new Date(date_server);
		tomorrow.setDate(tomorrow.getDate()+1);
		const minDate = moment(tomorrow).format("MM/DD/YYYY HH:mm");
		let rows;
		
		useEffect(() => {
			if(m_jadwal_tender.length > 0){
				setShowDatePicker([])
				setStartDatePicker([])
				for (var i = 0; i < m_jadwal_tender.length; i++) {
					setStartDatePicker( arr => [...arr, minDate]);
					if(i === 0){
						setShowDatePicker( arr => [...arr, true]);
					} else {
						setShowDatePicker( arr => [...arr, false]);
					}
				} 
			}
		}, [m_jadwal_tender, setShowDatePicker, setStartDatePicker, minDate])

		const handleEvent = (event, picker, lll) => {
			// console.log(picker.startDate);
			// console.log(lll);
		}

		const handleCallback = (start, end, label) => {
			// console.log(start, end, label);
		}

		const handleApply = (event, picker, key, mindate) => {
			// console.log(mindate);
			
			const data_length = startDatePicker.length;
			setErrDatePicker([])
			var date1 = new Date(picker.startDate._d);
			var timeStamp = Math.round(new Date(picker.endDate._d).getTime() / 1000);
			var timeStampYesterday = timeStamp - (24 * 3600);
			var is24 = date1 >= new Date(timeStampYesterday*1000).getTime();
			const validMinDate = (new Date(startDatePicker[key]).getTime() <= new Date(picker.startDate._d).getTime())
			if(!validMinDate){
				setLoadingDatePicker([key]);
				let newErr = [...errDatePicker];
				newErr[key] = 'min date is not valid';
				setTimeout(() => {
					resetSchedule(key);
					setLoadingDatePicker([])
					setErrDatePicker(newErr)
				},100)
				return true;
			}
			
			if(is24){
				setLoadingDatePicker([key]);
				let newErr = [...errDatePicker];
				newErr[key] = 'require date must be 24 hours';
				setTimeout(() => {
					resetSchedule(key);
					setLoadingDatePicker([])
					setErrDatePicker(newErr)
				},100)
			} else {
				const startDate = moment(picker.startDate._d).format("YYYY-MM-DD");
				const startTime = moment(picker.startDate._d).format("HH:mm");
				const endDate = moment(picker.endDate._d).format("YYYY-MM-DD");
				const endTime = moment(picker.endDate._d).format("HH:mm");
				const date = `${moment(picker.startDate._d).format("DD-MM-YYYY")} ${startTime} - ${moment(picker.endDate._d).format("DD-MM-YYYY")} ${endTime} `
				const show_metode_aanwijzing = (header.metode_aanwijzing_id !== '' && header.metode_aanwijzing_id !== undefined && header.metode_aanwijzing_id !== null) ? header.metode_aanwijzing_id.value === 3 : false;
				
				setLoadingDatePicker([key+1]);
				resetSchedule(key+1)
				let newArr = [...showDatePicker];
				for (var i = 0; i < newArr.length; i++) {
					const check_aanwijzing = (show_metode_aanwijzing) ? key+1 < i && key !== 1 : key+1 < i;
					if(show_metode_aanwijzing){ resetSchedule(data_length-1) } 
					if(check_aanwijzing){
						newArr[i] = false;
						resetSchedule(i);
					} else {
						newArr[i] = true;
					}
					setShowDatePicker(newArr);
				}
				
				setTimeout(() => {
					const len = (show_metode_aanwijzing && key === 1) ? data_length-1 : key+1;
					changeStartValDatePicker(len, moment(picker.startDate._d).format("MM/DD/YYYY HH:mm"));
				 	setValue(`schedule[${key}].daterangepicker`, date);
				 	setValue(`schedule[${key}].start_date`, startDate);
				 	setValue(`schedule[${key}].start_time`, startTime);
				 	setValue(`schedule[${key}].end_date`, endDate);
				 	setValue(`schedule[${key}].end_time`, endTime);
				 	setLoadingDatePicker([])
				}, 100)

			}
		}

		const changeStartValDatePicker = (i, val) => {
			let newVal = [...startDatePicker];
			newVal[i] = val;
			setStartDatePicker(newVal)
			// setStartDatePicker([...startDatePicker][i], val);
		}

		const resetSchedule = (i) => {
			// changeStartValDatePicker(i, '')
			setValue(`schedule[${i}].daterangepicker`, '');
			setValue(`schedule[${i}].start_date`, '');
			setValue(`schedule[${i}].start_time`, '');
			setValue(`schedule[${i}].end_date`, '');
			setValue(`schedule[${i}].end_time`, '');
		}
		
		if (m_jadwal_tender.length > 0) {
				rows = m_jadwal_tender.map((dt, i) => {
					const show_metode_aanwijzing = (header.metode_aanwijzing_id !== '' && header.metode_aanwijzing_id !== undefined && header.metode_aanwijzing_id !== null) ? header.metode_aanwijzing_id.value === 3 && dt.code === 'JT003' : false;
					const validStartDate = (i === 0) ? minDate : (startDatePicker[i] !== undefined) ? startDatePicker[i] : minDate;
						if (!show_metode_aanwijzing){
							return (
									<tr key={i}>
											<td style={{ width: '350px' }}>
												{dt.name} {!show_metode_aanwijzing && <span className="text-danger">*</span>}
											</td>
											<td>
												{showDatePicker[i] && <DateRangePicker 
													style={{ width: '300px' }}
													onEvent={(e, p) => handleEvent(e, p, i, validStartDate)} 
													onCallback={handleCallback}
													onApply={(e, p) => handleApply(e, p, i, validStartDate)}
													timePicker={true}
													timePicker24Hour={true}
													minDate={moment(new Date(validStartDate))}
													locale={{
														format: "MM/DD/YYYY hh:mm"
													}}
													className="form-control"
												>
													{!loadingDatePicker.includes(i) && <input type="text" style={{ width: '300px' }} readOnly={true}  name={`schedule[${i}].daterangepicker`} ref={register({})} defaultValue="" className={errDatePicker[i] ? "form-control is-invalid" : "form-control"} />}
												</DateRangePicker>}
												<ul>
													{errDatePicker[i] && <li><span className="text-danger"> {errDatePicker[i]} </span></li>}
													{errors[`schedules.${i}.start_date`] && <li><span className="text-danger"> {errors[`schedules.${i}.start_date`][0]} </span></li>}
													{errors[`schedules.${i}.start_time`] && <li><span className="text-danger"> {errors[`schedules.${i}.start_time`][0]} </span></li>}
													{errors[`schedules.${i}.end_date`] && <li><span className="text-danger"> {errors[`schedules.${i}.end_date`][0]} </span></li>}
													{errors[`schedules.${i}.end_time`] && <li><span className="text-danger"> {errors[`schedules.${i}.end_time`][0]} </span></li>}
												</ul>
											</td>
											<td>
												<input type="hidden" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].jadwal_tender_id`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.id} />
												<input type="hidden" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].jadwal_tender_name`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.name} />
												<input type="hidden" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].jadwal_tender_code`} ref={register({})} className="form-control" placeholder="" defaultValue={dt.code} />
												<input type="text" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].start_date`} ref={register({})} className={(errors[`schedules.${i}.start_date`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue="" />
												<input type="text" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].start_time`} ref={register({})} className={(errors[`schedules.${i}.start_time`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue="" />
												<input type="text" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].end_date`} ref={register({})} className={(errors[`schedules.${i}.end_date`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue="" />
												<input type="text" style={{ display: 'none' }} readOnly={true} name={`schedule[${i}].end_time`} ref={register({})} className={(errors[`schedules.${i}.end_time`]) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue="" />
											</td>
									</tr>
							)
						}else{
							return false
						}
				})

				rows.push(
					<tr key={m_jadwal_tender.length + 1}>
							<td colSpan="2"></td>
							<td>
								<button type="button" className="btn btn-xs btn-primary" >
									History
								</button>
							</td>
					</tr>
			)
		} else {
			rows = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>);
		}
		
    return (
			<div>
				<Panel>
						<PanelHeader>Jadwal Tender</PanelHeader>
						{(loadings.jadwal_tender) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
						{(!loadings.jadwal_tender) &&
						<PanelBody >
							<div className="row">
									<div className="col-sm-12">
										{errors['schedules'] && <h6 className="text-danger"> {errors['schedules'][0]} </h6>}
											<div className={hideNav ? "table-responsive" : ""}>
													{openTable === false && <table className="table table-bordered table-striped table-sm text-nowrap">
															<thead>
																	<tr>
																			<th>Proses</th>
																			<th>Start & End <i>(Date/Time)</i></th>
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