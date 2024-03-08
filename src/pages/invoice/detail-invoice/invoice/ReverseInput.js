import React from 'react';
import { Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
// import "./datetime-test.css";
import { formatDate } from '../../../../helpers/formatDate';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const ReverseInput = (props) => {
    const { t } = props;
    const changeReverse = (selected) => {
        if (selected !== null) {
            props.setReverse(selected.value, 'reason')
        } else {
            props.setReverse(null, 'reason')
        }
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

    const handleChangeReverseDate = (e) => {
        const date = formattingDate(e)
		props.setReverse(date, 'date')
	}

    return (
        <div className="col-sm-12 p-r-15" style={{paddingBottom: '200px'}}>
            <div className="row m-0">
                <div className="col-sm-3">
                    <Controller
                        components={animatedComponents}
                        closeMenuOnSelect={true}
                        isClearable
                        as={Select}
                        onChange={([selected]) => {
                            changeReverse(selected)
                            return selected
                        }}
                        options={props.param_option.m_reverse}
                        name="reverse"
                        placeholder={ t("common:Select.Pilih") + " alasan Reverse" }
                        rules={{ required: false }}
                    />
                </div>
                <div className="col-sm-3">
                    <Datetime
                        closeOnClickOutside={false}
                        value={props.param_reverse.posting_date !== undefined && props.param_reverse.posting_date !== null ? formatDate(props.param_reverse.posting_date, false) : ''}
                        onChange={handleChangeReverseDate}
                        closeOnSelect={true}
                        dateFormat="DD-MM-YYYY"
                        timeFormat={false}
                        inputProps={{ placeholder: "DD-MM-YYYY"}}
                    />
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(ReverseInput);