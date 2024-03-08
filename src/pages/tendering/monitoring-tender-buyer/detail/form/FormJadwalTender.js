import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const FormJadwalTender = (props) => {
    const {data} = props;
	const [startDate,setStartDate] = React.useState(data?.[0].start_date)
	const [endDate,setEndDate] = React.useState(data?.[0].end_date)
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async datax => {
		const dataa = {...datax}
		dataa.start_date = formattingDate(startDate)
		dataa.end_date = formattingDate(endDate)

		console.log(data)
		props.update(data?.[0].uuid,setData(dataa))
	};

	const handleStartDate = (e) => {
		setStartDate(e)
	}

	const handleEndDate = (e) => {
		setEndDate(e)
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

	const setData = (data) => {
		let datax = {...data}
		let start_time = data.start_time.split(":");
		let end_time = data.end_time.split(":");
		if (start_time.length === 2){
			start_time.push("00")
		}

		if (end_time.length === 2){
			end_time.push("00")
		}

		datax.start_time = start_time.join(":");
		datax.end_time = end_time.join(":");

		return datax;	
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>Start Date<span className="text-danger">*</span></label>
						<div>
							<Datetime
								value={moment(startDate).format("DD-MM-YYYY")}
								onChange={handleStartDate}
								closeOnSelect={true}
								dateFormat="DD-MM-YYYY"
								timeFormat={false}
								inputProps={{ placeholder: "Start Date", name : "start_date", ref : register({ required: true }) }}
							/>
							{/* <input type="date" step="1" className={(errors.start_date) ? "form-control is-invalid" : "form-control"} name="start_date" ref={register({ required: false })} defaultValue={data?.[0].start_date || ''} /> */}
							{errors.start_date && <span className="text-danger">* This field is required</span>}
						</div>
					</div>
                    <div className="form-group">
						<label>Start Time<span className="text-danger">*</span></label>
						<div>
							<input type="time" step="1" className={(errors.start_time) ? "form-control is-invalid" : "form-control"} name="start_time" ref={register({ required: false })} defaultValue={data?.[0].start_time || ''} />
							{errors.start_time && <span className="text-danger">* This field is required</span>}
						</div>
					</div>
                    <div className="form-group">
						<label>End Date<span className="text-danger">*</span></label>
						<div>
							<Datetime
								value={moment(endDate).format("DD-MM-YYYY")}
								onChange={handleEndDate}
								closeOnSelect={true}
								dateFormat="DD-MM-YYYY"
								timeFormat={false}
								inputProps={{ placeholder: "Start Date", name : "end_date", ref : register({ required: true }) }}
							/>
							{/* <input type="date" step="1" className={(errors.end_date) ? "form-control is-invalid" : "form-control"} name="end_date" ref={register({ required: false })} defaultValue={data?.[0].end_date || ''} /> */}
							{errors.end_date && <span className="text-danger">* This field is required</span>}
						</div>
					</div>
                    <div className="form-group">
						<label>End Time<span className="text-danger">*</span></label>
						<div>
							<input type="time" step="1" className={(errors.end_time) ? "form-control is-invalid" : "form-control"} name="end_time" ref={register({ required: false })} defaultValue={data?.[0].end_time || ''} />
							{errors.end_time && <span className="text-danger">* This field is required</span>}
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					{/* <button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button> */}
                    <button className="btn btn-white" disabled={props.loading}>
						{props.loading ? <i className="fa fa-spinner fa-spin"></i> :<div>update</div>}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormJadwalTender);