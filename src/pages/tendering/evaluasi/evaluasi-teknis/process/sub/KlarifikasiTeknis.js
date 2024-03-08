import React from 'react';
import { withTranslation } from 'react-i18next';
import { useFormContext } from "react-hook-form";
import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../../../helpers/formatNumber';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation';
import { formatDate } from '../../../../../../helpers/formatDate';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { RowEmpty } from '../../../../../../components/tableoptions/TableOptions';

// const animatedComponents = makeAnimated();

const KlarifikasiTeknis = (props) => {
    const { t } = props;
    let rows = [];
    const { register, watch, setValue } = useFormContext();
    const [loading, setLoading] = React.useState(false)
    const [dueDate, setDueDate] = React.useState("");
    const watchAllFields = watch();

    // const customStyles = {
    //     control: (base, state) => ({
    //         ...base,
    //         borderColor: state.isFocused ?
    //             '#ddd' : 'red',
    //     })
    // }

    const changeFile = (e) => {
        if (e.target.files[0] !== undefined) {
            setLoading(true);
            props.upload('ET0002', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("attachment", resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    setValue("attachment", '')
                })
        } else {
            setValue('attachment', '')
        }
    }

    // const deleteFile = (e, uuid) => {
    //     alert('delete')
    //     e.preventDefault()
    // }



    const storeFile = (e) => {
        let payload = []
        if (watchAllFields['note'] === "" || dueDate === "" || dueDate==="NaN-NaN-NaN") {
            if(watchAllFields['note'] === "" ){
                toastr.error('error', 'Klarifikasi Note Required')
            }
            if(dueDate === "" || dueDate==="NaN-NaN-NaN"){
                toastr.error('error', 'Klarifikasi Due Required')
            }
        } else {
            payload.note = watchAllFields['note']
            payload.file = watchAllFields['attachment']
            payload.due_date = dueDate
            props.storeEvaluasiTeknisKlarifikasi(payload)
        }
        e.preventDefault()
    }
    const listAttactmentHasil = props.klarifikasiList
    rows = listAttactmentHasil.map((key, index) => {
        return (
            <tr key={index}>
                <td> {index + 1} </td>
                <td>
                    {listAttactmentHasil[index]['verifikator_name']}
                </td>
                <td align="right">
                    {listAttactmentHasil[index]['note']}
                </td>
                <td>
                    {formatDate(listAttactmentHasil[index]['created_at'], true)}
                </td>
                <td style={{ color: 'red' }}>
                    {formatDate(listAttactmentHasil[index]['due_date'], false)}
                </td>
                <td>
                    {(listAttactmentHasil[index]['file'] !== "" && listAttactmentHasil[index]['file'] !== null) && <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/` + listAttactmentHasil[index]['file']} > {t("common:Button.Download")} </a>}
                </td>
            </tr>
        )
    })

    if(rows.length === 0) {
        rows = (<RowEmpty colSpan='6'>{t("common:Tabel.empty-row")}</RowEmpty>)
    }

    const onChangeDeliveryDate = (e) => {
        const date = formattingDate(e)
        setDueDate(date)
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
                <PanelHeader>Klarifikasi Teknis</PanelHeader>

                {props.loadings.loading_submit_klasifikasi_form &&

                    <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                    </PanelBody>

                }

                {!props.loadings.loading_submit_klasifikasi_form &&
                    <PanelBody >

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                            <th>No</th>
                                            <th>User</th>
                                            <th>{t("evaluation:label.clarification")}</th>
                                            <th>{t("evaluation:label.created_at")}</th>
                                            <th>{t("evaluation:label.due-date")}</th>
                                            <th>{t("evaluation:label.attatchment")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>{
                                            rows
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="row m-t-10" >
                            <div className="col-sm-12">

                                <div className="form-group">
                                    <label >Klarifikasi<span className="text-danger"></span></label>
                                    <textarea disabled={(props.assignment === "assign to evaluator") ? (props.has_roles.includes("EVA001")) ? false : true : false}
                                        type="text" name="note" className="form-control" ref={register({ required: false })} />
                                </div>
                                <div className="form-group">
                                    <label >Due Date<span className="text-danger"></span></label>
                                    {/* <input disabled={(props.assignment === "assign to evaluator") ? (props.has_roles.includes("EVA001")) ? false : true : false}
                                        type="hidden" name="due_date" className="form-control col-lg-3" ref={register({ required: false })} /> */}

                                    <Datetime
                                        disabled={(props.assignment === "assign to evaluator") ? (props.has_roles.includes("EVA001")) ? false : true : false}
                                        closeOnSelect={true}
                                        name="due_date"
                                        dateFormat="DD-MM-YYYY"
                                        onChange={onChangeDeliveryDate}
                                        timeFormat={false}
                                        inputProps={{ placeholder: "Due Date" }}
                                        ref={register({ required: false })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Attacment</label>
                                    <input
                                        type="type" name="attachment" className="form-control" readOnly ref={register({ required: false })} />
                                    <FileUploadInformation idFileUpload="ET0002" />
                                    {watchAllFields['attachment'] !== "" &&
                                        <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/` + watchAllFields['attachment']} > {t("common:Button.Download")} </a>
                                    }
                                    <label>&nbsp;</label>


                                    {!props.isMonitoring && <button disabled={(props.loadings.loading_submit_klasifikasi_btn || loading || (props.assignment === "assign to evaluator") ? (props.has_roles.includes("EVA001")) ? false : true : false)} className="custom-file-upload pull-right m-t-5 m-l-5 btn btn-sm btn-success" onClick={(e) => storeFile(e)}>
                                        {(props.loadings.loading_submit_klasifikasi_btn || loading) && <i className="fas fa-spinner fa-pulse"></i>}
                                    Send
                                    </button>}

                                    {!props.isMonitoring && <label className="btn btn-sm custom-file-upload pull-right m-t-5">
                                        <input type="file" name="file" ref={register()} placeholder="" onChange={changeFile}
                                            disabled={(props.assignment === "assign to evaluator") ? (props.has_roles.includes("EVA001")) ? false : true : false}
                                        />
                                    Browse
                                    </label>}
                                </div>

                            </div>
                        </div>
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(KlarifikasiTeknis);
