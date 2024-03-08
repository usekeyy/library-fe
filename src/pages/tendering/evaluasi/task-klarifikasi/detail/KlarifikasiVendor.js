import React from 'react';
import { withTranslation } from 'react-i18next';
import { useFormContext } from "react-hook-form";
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../../helpers/formatNumber';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import { formatDate } from '../../../../../helpers/formatDate';
// const animatedComponents = makeAnimated();

const KlarifikasiVendor = (props) => {
    const { t } = props;
    let rows;
    const { register, watch,setValue } = useFormContext();
    const [loading, setLoading] = React.useState(false)
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

    const storeFile = (e) => {
        let payload = []
        if (watchAllFields['note'] === "") {
            toastr.error('error', 'Mohon Klarifikasi Note')
        } else {
            payload.note = watchAllFields['note']
            payload.file = watchAllFields['attachment']
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
                <td>
                    {listAttactmentHasil[index]['note']}
                </td>
                <td>
                    {formatDate(listAttactmentHasil[index]['created_at'], true)}
                </td>
                <td style={{color:'red'}}>
                    {listAttactmentHasil[index]['due_date']!==undefined && formatDate(listAttactmentHasil[index]['due_date'], false)}
                </td>
                <td>
                    {(listAttactmentHasil[index]['file'] !== "" && listAttactmentHasil[index]['file'] !== null) && <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/` + listAttactmentHasil[index]['file']} > {t("common:Button.Download")} </a>}
                </td>
            </tr>
        )
    })

    const back = (e) => {
        props.back(e)
        e.preventDefault()
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
                                    <label >{t("evaluation:label.clarification")}<span className="text-danger"></span></label>
                                    <textarea type="text" name="note" className="form-control" ref={register({ required: false })} />
                                </div>
                                <div className="form-group">
                                    <label>Attachment</label>
                                    <input type="type" name="attachment" className="form-control" readOnly ref={register({ required: false })} />
                                    {watchAllFields['attachment'] !== "" &&
                                        <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/` + watchAllFields['attachment']} > {t("common:Button.Download")} </a>
                                    }
                                    <label>&nbsp;</label>


                                    <button disabled={(props.loadings.loading_submit_klasifikasi_btn || loading || (props.due_date===null ? false : (new Date(localStorage.getItem("times")).getTime()/1000 >= new Date(props.due_date+" 23:59:59").getTime()/1000) ? true : false ))} className="custom-file-upload pull-right m-t-5 m-l-5 btn btn-sm btn-success" onClick={(e) => storeFile(e)}>
                                        {(props.loadings.loading_submit_klasifikasi_btn || loading) && <i className="fas fa-spinner fa-pulse"></i>}
                                    Send
                                </button>

                                    <label className="btn btn-sm custom-file-upload pull-right m-t-5">
                                        <input type="file" name="file" ref={register()} placeholder="" onChange={changeFile} />
                                    Browse
                                </label>
                                </div>
                            </div>
                        </div>

                        <div className="row m-t-10">
                            <div className="col-sm-12">
                                <button className="btn btn-sm btn-white pull-right m-r-5" onClick={(e) => back(e)} type="button">
                                    Back
                                </button>
                            </div>
                        </div>
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(KlarifikasiVendor);
