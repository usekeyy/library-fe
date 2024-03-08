import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { toastr } from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
const animatedComponents = makeAnimated();



const Process = (props) => {
    const { t } = props;
    const { register, errors, handleSubmit, control } = useForm({});
    const [status, setStatus] = React.useState(null)
    const [duedate, setDuedate] = React.useState(null)
    const onSubmit = async data => {
        if(status===null){
            toastr.warning("Warning", "Please Select option status Process")
        }else{
            delete data.status
            // console.log(setData(data))
            props.save(setData(data))
        }
    };

     const handleChange = (e) => {
         if(e===null){
            setStatus(e)
         }else{
            setStatus(e.value)
         }
     }

     const setData = (data) => {
        if(status==="self"){
            data.assignment = "self assignment"
            data.evaluator_id = ""
            data.due_date = ""
            data.reminder = ""
        }else{
            data.assignment = "assign to evaluator"
            data.evaluator_id = data.assignment_to===null ? "" : data.assignment_to.value;
            data.due_date = duedate
            // data.reminder = data.reminder
            delete data.assignment_to
        }
        return data
     }

    const handleChangeDueDate = (e) => {
        let due = formattingDate(e)
        setDuedate(due)
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

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Process</PanelHeader>
                <PanelBody >
                    <div className="col-sm-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label>Status <span className="text-danger">*</span></label>
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.status}
                                            onChange={([selected])=>{
                                                handleChange(selected)
                                                return selected
                                            }}
                                            name="status"
                                            isClearable
                                            rules={{ required: true }}
                                        />
                                        {errors.status && <span className="text-danger">* This field is required</span>}
                                    </div>
                                </div>
                            </div>
                            { status==='evaluator' &&
                            <div className="row">
                                    <div className="col-sm-4">
                                        <label>Assing To <span className="text-danger">*</span></label>
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.assign}
                                            name="assignment_to"
                                            isClearable
                                            rules={{ required: true }}
                                        />
                                        {errors.assignment_to && <span className="text-danger">* This field is required</span>}
                                    </div>

                                    <div className="col-sm-4">
                                        <label>Due Date  <span className="text-danger">*</span></label>
                                        <Datetime
                                            // value={props.param_input.due_date !== undefined && props.param_input.due_date !== '' ? moment(props.param_input.due_date).format("DD-MM-YYYY") : ''}
                                            onChange={handleChangeDueDate}
                                            closeOnSelect={true}
                                            name="due_date"
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat={false}
                                            inputProps={{ placeholder: "Due Date" }}
                                            ref={register({required: true})}
                                        />
                                        {/* <input type="date" className="form-control" name="due_date" ref={register({ required : true})} /> */}
                                        {errors.due_date && <span className="text-danger">* This field is required</span>}
                                    </div>
                                    <div className="col-sm-3">
                                        <label>Reminder  ({t("evaluation:label.reminder-days")}) <span className="text-danger">*</span></label>
                                        <input type="number" className="form-control" name="reminder" ref={register({required: true})} />
                                        {errors.reminder && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                            }
                            <div className="row pull-right m-t-10">
                                <button type="submit"  className="m-r-10 btn btn-info" disabled={props.loadings.loadingSaveAssignment}>  {props.loadings.loadingSaveAssignment && <i className="fa fa-spinner fa-spin"></i> } Process</button>
                                <button type="button" className="m-r-10 btn btn-light" disabled={props.loadings.loadingSaveAssignment} onClick={(e)=>props.back(e)}> Back</button>
                            </div>
                        </form>
                        { status==='evaluator' && <div>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                            </div>
                        }
                        
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Process);