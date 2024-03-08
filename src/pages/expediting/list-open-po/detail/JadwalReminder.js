import React from 'react';
import { useForm, Controller } from 'react-hook-form';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';
// import Datetime from 'react-datetime';
// import "react-datetime/css/react-datetime.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ReactLoading from "react-loading";

const animatedComponents = makeAnimated();

const JadwalReminder = (props) => {
    const { t } = props;
	const { control, register } = useForm({});
    let rows;

    const modalTemplate = (e, uuid, type) => {
		props.modalTemplate(uuid, type)
        e.preventDefault()
	}

    const save = (e) => {
        // console.log(data)
		props.save()
        e.preventDefault()
	}

    const onInputChangeTemplateReminder = (option, { action }) => {
		if (action === "input-change") {
			props.fetchTemplateReminder(option)
		}
		if (action === "set-value") {
			props.fetchTemplateReminder('')
		}
	};

    const onChangeItem = (e) => {
        props.setOptionReminder(e.value, 'item')
    } 

    const onChangeDueDate = (e) => {
        props.setOptionReminder(e.target.value, 'due-date')
    } 

    const onChangeTaskName = (e) => {
        props.setOptionReminder(e.target.value, 'task-name')
    } 

    const onChangeTemplateReminder = (e) => {
        props.setOptionReminder(e.value, 'reminder-template')
    } 

    if (props.data_reminder !== undefined) {
        rows = Object.keys(props.data_reminder).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data_reminder[key]['due_date_days']}</td>
                    <td>{props.data_reminder[key]['reminder_date'] !== null && props.data_reminder[key]['reminder_date'] !== '' ? moment(props.data_reminder[key]['reminder_date']).format("DD-MM-YYYY") : ''}</td>
                    <td>{props.data_reminder[key]['delivery_date'] !== null && props.data_reminder[key]['delivery_date'] !== '' ? moment(props.data_reminder[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                    <td>{props.data_reminder[key]['po_sap_number']} - {props.data_reminder[key]['item_no']} - {props.data_reminder[key]['item_desc']}</td>
                    <td>{props.data_reminder[key]['task_name']}</td>
                    <td>{props.data_reminder[key]['reminder_template_title']}</td>
                    <td>{props.data_reminder[key]['waiting_days']}</td>
                    <td>{props.data_reminder[key]['remindered'].toString() === '1' ? 'sent' : 'waiting'}</td>
                    <td>
                        <button className="btn btn-xs btn-success" disabled={props.loadingSubmit} onClick={(e) => modalTemplate(e, props.data_reminder[key]['uuid'], 'template-reminder-detail')} >{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  <i className="fa fa-list"></i></button>
                        {props.data_reminder[key]['remindered'].toString() === '1' && <button className="btn btn-xs btn-success" disabled={props.loadingSubmit} onClick={(e) => modalTemplate(e, props.data_reminder[key]['id'], 'history_jadwal_reminder')} >{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  <i className="fa fa-history"></i></button>}
                        {props.data.created_by === props.user.uuid &&
                            <button className="btn btn-xs btn-danger" disabled={props.loadingSubmit} onClick={(e) => props.toggleDelete(e, props.data_reminder[key]['uuid'], 'jadwal-reminder')} >{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  <i className="fa fa-trash"></i></button>
                        }
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            {props.loading_reminder && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loading_reminder === false && (
                <Panel className="margin-bot-false">
                    <PanelHeader>Jadwal Reminder</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            {props.data.created_by === props.user.uuid &&
                                <div className="col-sm-12">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Due Date</label>
                                                    <div className="col-sm-8">
                                                        <input className={props.errors.due_date_days ? "form-control is-invalid" : "form-control"} type="number" name="due_date" ref={register({ required: false })} onChange={(e) => onChangeDueDate(e)}/>
                                                        {props.errors.due_date_days && <span className="text-danger">{props.errors.due_date_days[0]}</span>}
                                                    </div>
                                                    <label className="col-sm-2 col-form-label">hari</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Ref. Item</label>
                                                    <div className="col-sm-10">
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_items}
                                                            onChange={([selected]) => {
                                                                onChangeItem(selected)
                                                                return selected;
                                                            }}
                                                            inputRef={(e) => register({ name: "po_item_id", required: false })}
                                                            name="po_item_id"
                                                            placeholder={ t("common:Select.Pilih") }
                                                            rules={{ required: false }}
                                                        />
                                                        {props.errors.po_item_id && <span className="text-danger">{props.errors.po_item_id[0]}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Task Name</label>
                                                    <div className="col-sm-8">
                                                        <input className={props.errors.task_name ? "form-control is-invalid" : "form-control"} name="task_name" ref={register({ required: false })} onChange={(e) => onChangeTaskName(e)}/>
                                                        {props.errors.task_name && <span className="text-danger">{props.errors.task_name[0]}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">Template</label>
                                                    <div className="col-sm-6">
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_template_reminder}
                                                            onInputChange={onInputChangeTemplateReminder}
                                                            onChange={([selected]) => {
                                                                onChangeTemplateReminder(selected)
                                                                return selected;
                                                            }}
                                                            inputRef={(e) => register({ name: "reminder_template_id", required: false })}
                                                            name="reminder_template_id"
                                                            placeholder={props.loadings.reminder_template_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                            isLoading={props.loadings.reminder_template_id}
                                                            rules={{ required: false }}
                                                        />
                                                        {props.errors.reminder_template_id && <span className="text-danger">{props.errors.reminder_template_id[0]}</span>}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <button disabled={props.loadingSubmit} className="btn btn-white" onClick={(e) => modalTemplate(e, '', 'template-reminder-create')} >{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  New Template</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group row">
                                                    <div className="col-sm-12">
                                                        <button className="btn btn-success pull-right" onClick={(e) => save(e)} >Create</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Count Days</th>
                                                <th>Reminder Date</th>
                                                <th>Delivery Date</th>
                                                <th>Ref. Item</th>
                                                <th>Task</th>
                                                <th>Template Reminder</th>
                                                <th>Waiting Days</th>
                                                <th>Remindered</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            )}
        </div>
    );
}

export default withTranslation()(JadwalReminder);
