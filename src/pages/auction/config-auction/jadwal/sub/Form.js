import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Schedules from './Schedules';
import moment from 'moment';
import Header from '../../Header';

const Form = (props) => {

	const methods = useForm();

	const onSubmit = data => {
       props.storeScheduleItemAuction(setData(data))
	};

	const setData = (data) => {
		data.end_auction= formattingDate(data.end_auction)
		data.start_auction= formattingDate(data.start_auction)
		return data
	}

	const formattingDate = (e) => {
		let date = "";
		if(e!==undefined){
			let d = new Date(e)
			date=moment(d).format("YYYY-MM-DD HH:mm:ss")
		}
		return date
        // let d = new Date(e),
        //     month = '' + (d.getMonth() + 1),
        //     day = '' + d.getDate(),
        //     year = d.getFullYear();

        // if (month.length < 2) 
        //     month = '0' + month;
        // if (day.length < 2) 
        //     day = '0' + day;

        // return [year, month, day].join('-');
    }
	
	return (
		<FormContext {...methods} >
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Header
					data = {props.state.data.header}
				/>
				<Schedules
				access={props.access}
				header = {props.state.data.header}
				loadings = {props.state.loadings}
				errors = {props.state.errors}
				toAuctionList={()=>props.toAuctionList()}
				/>
			</form>
		</FormContext>
	);
}

export default withTranslation()(Form);