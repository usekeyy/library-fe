import React from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const Form = (props) => {
	const {t} = props;
	const { control, register, handleSubmit } = useForm({});
	let { loading } = props;
	let rows

	if (props.user_length !== undefined) {
		rows = props.user_length.map((dt, i) => {
			return(
				<div className="col-sm-11" key={i}>
				{/* <div key={i}> */}
					<input className="form-control" name={"sap_created_by["+i+"]"} ref={register({ required: false })} />
				</div>
			)
		})
	}
	
	const onSubmit = async data => {
		// console.log(data)
		// setSendData(data)
		props.save(data)
	};

	const addUser = (e) => {
		e.preventDefault()
		props.addUser()
	}

    const handleChangeStartDate = (e) => {
        const date = formattingDate(e)
        props.setOption(date, 'start-date')
	}

    const handleChangeEndDate = (e) => {
        const date = formattingDate(e)
        props.setOption(date, 'end-date')
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

	var curr = new Date();
	curr.setDate(curr.getDate());
	// var date = curr.toISOString().substr(0,10);

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<div className="row">
							<div className="col-sm-6">
								<label>From</label>
								<Datetime
									value={props.param_sync.date_from !== undefined && props.param_sync.date_from !== '' ? moment(props.param_sync.date_from).format("DD-MM-YYYY") : ''}
									onChange={handleChangeStartDate}
									control={control}
									closeOnSelect={true}
									dateFormat="DD-MM-YYYY"
									timeFormat={false}
									inputRef={register({ required: false })}
									name="date_from"
									inputProps={{ placeholder: "DD-MM-YYYY" }}
								/>
							</div>
							<div className="col-sm-6">
								<label>To</label>
								<Datetime
									value={props.param_sync.date_to !== undefined && props.param_sync.date_to !== '' ? moment(props.param_sync.date_to).format("DD-MM-YYYY") : ''}
									control={control}
									onChange={handleChangeEndDate}
									closeOnSelect={true}
									inputRef={register({ required: false })}
									dateFormat="DD-MM-YYYY"
									timeFormat={false}
									name="date_to"
									inputProps={{ placeholder: "DD-MM-YYYY" }}
								/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label>User SAP</label>
						<div className="row">
							{rows}
							{/* <div className="col-sm-11">
							</div> */}
							<div className="col-sm-1">
								<button className="btn pull-right btn-light" onClick={(e) => addUser(e)} ><i className="fa fa-plus"></i> </button>
							</div>
						</div>
						{/* <input className="form-control" name="sap_created_by" ref={register({ required: false })} /> */}
					</div>
					<div className="form-group">
						<label>PO Number</label>
						<input className="form-control" name="po_sap_number" ref={register({ required: false })} />
					</div>
				</ModalBody>
				<ModalFooter>
					{/* {!props.status_input && <span className="text-danger pull-left">* Need to fill at least 1 input field</span>} */}
					<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>} Sync
					</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (Form);