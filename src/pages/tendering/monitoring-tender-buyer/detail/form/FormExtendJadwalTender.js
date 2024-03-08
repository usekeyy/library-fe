import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const FormExtendJadwalTender = (props) => {
    const {submit,loading_button} = props;
	const [endDate,setEndDate] = React.useState("")
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async datax => {
		const dataa = {...datax}
		dataa.end_date = formattingDate(endDate)

		submit(setData(dataa))
	};

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
		let end_time = data.end_time.split(":");

		if (end_time.length === 2){
			end_time.push("00")
		}
		datax.end_time = end_time.join(":");

		return datax;	
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
                    <div className="form-group">
						<label>End Date<span className="text-danger">*</span></label>
						<div>
							<Datetime
								// value={moment(endDate).format("DD-MM-YYYY")}
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
							<input type="time" step="1" className={(errors.end_time) ? "form-control is-invalid" : "form-control"} name="end_time" ref={register({ required: true })} />
							{errors.end_time && <span className="text-danger">* This field is required</span>}
						</div>
					</div>
                    <div className="form-group">
						<label>Note<span className="text-danger">*</span></label>
						<div>
							<textarea type="text" className={(errors.note) ? "form-control is-invalid" : "form-control"} name="note" ref={register({ required: true })} />
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
						{loading_button ? <i className="fa fa-spinner fa-spin"></i> :<div>submit</div>}
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (FormExtendJadwalTender);