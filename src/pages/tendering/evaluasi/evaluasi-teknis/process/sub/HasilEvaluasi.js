import React from 'react';
import { withTranslation } from 'react-i18next';
import { useFormContext, Controller } from "react-hook-form";
import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../../helpers/formatNumber';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation';
import { formatDate } from '../../../../../../helpers/formatDate';
import { RowEmpty } from '../../../../../../components/tableoptions/TableOptions';
const animatedComponents = makeAnimated();

const HasilEvaluasi = (props) => {
    const { t } = props;
    const { register, watch, control, errors, setValue } = useFormContext();
    const [loadingEvaluasi, setLoadingEvaluasi] = React.useState(false)
    const watchAllFields = watch();
    let rows=[];
    let rowAttactment=[];

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    const data = props.data
    const listAttactmentHasil = props.listAttactmentHasil
    if (data !== undefined && props.metode_evaluasi === "sistem_nilai") {
        let total = 0;
        rows = data.map((key, index) => {
            const nilai = (watchAllFields[`penilaian[${index}]`] !== undefined) ? watchAllFields[`penilaian[${index}]`] : 0;
            const actual = (nilai === 0) ? 0 : ((nilai * data[index]['bobot']) / 100)
            total += actual
            return (
                <tr key={index}>
                    <td style={{verticalAlign:'middle'}} >{data[index]['description']}</td>
                    <td style={{verticalAlign:'middle'}} >{data[index]['bobot']}</td>
                    <td>
                        <input disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                        type="number" min="0" max="100" ref={register} name={`penilaian[${index}]`} className="form-control" defaultValue={data[index]['score']} />
                        <input type="hidden" ref={register} name={`proposal_tender_syarat_id[${index}]`} className="form-control" value={data[index]['proposal_tender_syarat_id']} />
                    </td>
                    <td style={{verticalAlign:'middle'}}>
                        {actual}
                    </td>
                    <td style={{verticalAlign:'middle'}}>
                        {data[index]['diproses_oleh']} <br></br> {formatDate(data[index]['updated_at'], true ) }
                    </td>
                    <td>
                        <input disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                        type="text" ref={register} name={`catatan[${index}]`} className="form-control" defaultValue={data[index]['catatan']} />
                    </td>
                </tr>
            )
        })

        rows.push([
            <tr key={data.length + 1}>
                <td colSpan="3">Total Penilaian</td>
                <td align="right">{formatNumber(total, 2)}</td>
                <td ></td>
                <td ></td>
            </tr>], [
            <tr key={data.length + 2}>
                <td colSpan="3">Total Penilaian</td>
                <td align="right">
                    {total >= props.ambang_batas ? 'lolos' : 'tidak lolos'}
                    <input disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                    type="hidden" ref={register} name="result" className="form-control" defaultValue={total >= props.ambang_batas ? 'lolos' : 'tidak lolos'} />
                </td>
                <td ></td>
                <td ></td>
            </tr>]
        )
    }
    if (data !== undefined && props.metode_evaluasi === 'sistem_gugur') {
        rows = data.map((key, index) => {
            const nilai = (watchAllFields[`penilaian[${index}]`] !== undefined) ? (watchAllFields[`penilaian[${index}]`] !== null) ? watchAllFields[`penilaian[${index}]`].value : '-' : '-';
            return (
                <tr key={index}>
                    <td style={{verticalAlign:'middle'}}>{data[index]['description']}</td>
                    <td>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            control={control}
                            options={props.penilaianOptions}
                            defaultValue={data[index]['status_evaluasi_teknis'] !== null ? data[index]['status_evaluasi_teknis'] === "lolos" ? { value: 'lolos', label: 'Lolos' } : { value: 'tidak lolos', label: 'Tidak Lolos' } : ""}
                            name={`penilaian[${index}]`}
                            isClearable
                            isDisabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?   false : true : false}
                            rules={{ required: false }}
                            styles={errors.penilaian !== undefined ? (errors.penilaian[index]!==undefined) ? errors.penilaian[index].type === "required" ? customStyles : {} : {} : {}}
                        />
                        <input type="hidden" ref={register} name={`proposal_tender_syarat_id[${index}]`} className="form-control" value={data[index]['proposal_tender_syarat_id']} />
                    </td>
                    <td style={{verticalAlign:'middle'}}>
                        {nilai}
                    </td>
                    <td>
                        {data[index]['diproses_oleh']} <br></br> {formatDate(data[index]['updated_at'], true ) }
                    </td>
                    <td>
                        <input type="text" 
                        disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                        ref={register} 
                        name={`catatan[${index}]`} 
                        className="form-control" defaultValue={data[index]['catatan']} 
                        />
                        {errors.catatan && errors.catatan[index] && <span className="text-danger"> * This field is required </span>}
                    </td>
                </tr>
            )
        })

    }

    rowAttactment = listAttactmentHasil.map((key, index) => {
        return (
            <tr key={index}>
                <td> {index + 1} </td>
                <td>
                    {listAttactmentHasil[index]['tipe_lampiran']}
                </td>
                <td align="right">
                    {listAttactmentHasil[index]['description']}
                </td>
                <td>
                    <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/` + listAttactmentHasil[index]['file']} > {t("common:Button.Download")} </a>
                </td>
                <td>
                    <button 
                    disabled={props.isMonitoring || (props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                    className="btn btn-sm btn-danger" onClick={(e, uuid) => deleteFile(e, listAttactmentHasil[index]['uuid'])} >
                        Delete
                    </button>
                </td>
            </tr>
        )
    })

    if(rowAttactment.length === 0) {
        rowAttactment = (<RowEmpty colSpan='5'>{t("common:Tabel.empty-row")}</RowEmpty>)
    }

    if(rows.length === 0) {
        rows = (<RowEmpty colSpan='5'>{t("common:Tabel.empty-row")}</RowEmpty>)
    }

    const changeFile = (e) => {

        if (e.target.files[0] !== undefined) {
            setLoadingEvaluasi(true);
            props.upload('ET0001', e.target.files[0])
                .then((resp) => {
                    setLoadingEvaluasi(false);
                    setValue("attachment", resp.data.data.name)
                })
                .catch((err) => {
                    setLoadingEvaluasi(false);
                    setValue("attachment", '')
                })
        } else {
            setValue('attachment', '')
        }
    }

    const deleteFile = (e, uuid) => {
        props.showSweetAlert(uuid)
        e.preventDefault()
    }



    const storeFile = (e) => {
        let payload = []
        if (watchAllFields['hasil_evaluasi'] === null || watchAllFields['hasil_evaluasi'] === undefined) {
            toastr.error('error', 'Silahkan Isi Tipe Lampiran')
        } else if (watchAllFields['attachment'] === "") {
            toastr.error('error', 'Mohon Lampirkan File')
        } else if (watchAllFields['description'] === "") {
            toastr.error('error', 'Mohon Lampirkan Description')
        } else {
            payload.tipe_lampiran = watchAllFields['hasil_evaluasi'].value
            payload.file = watchAllFields['attachment']
            payload.description = watchAllFields['description']
            props.storeEvaluasiTeknisAttactment(payload)
        }
        e.preventDefault()
    }


    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("evaluation:panel-title.evaluation-result")}</PanelHeader>
                {props.loadings.loading_submit_evaluasi_btn &&

                    <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                    </PanelBody>

                }

                <PanelBody >
                    <div className="row">
                        <div className="col-sm-6">
                            <label> Metode Evaluasi : {String(props.metode_evaluasi).replace("_", " ")} </label>
                        </div>
                        {props.metode_evaluasi === "sistem_nilai" &&
                            <div className="col-sm-6">
                                <label> Mekanisme : Ambang Batas  {props.ambang_batas} </label>
                            </div>
                        }
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table">
                                <table className="table table-bordered table-striped table-sm">
                                    {props.metode_evaluasi === "sistem_nilai" &&
                                        <thead>

                                            <tr>
                                                <th style={{width:"35%"}}>Item Penilaian</th>
                                                <th>Bobot</th>
                                                <th>Penilaian</th>
                                                <th>Actual Nilai</th>
                                                <th>Processed By</th>
                                                <th>Catatan</th>
                                            </tr>

                                        </thead>
                                    }

                                    {props.metode_evaluasi === "sistem_gugur" &&
                                        <thead>

                                            <tr>
                                                <th style={{width:"35%"}}>Item Penilaian</th>
                                                <th>Penilaian</th>
                                                <th>Actual Nilai</th>
                                                <th>Processed By</th>
                                                <th>Catatan</th>
                                            </tr>

                                        </thead>
                                    }
                                    <tbody>{
                                        rows
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {!props.loadings.loading_submit_evaluasi_btn &&
                        <div className="row m-t-10" >
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label >{t("evaluation:label.type-attactment")}<span className="text-danger"></span></label>
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        name="hasil_evaluasi"
                                        options={props.hasilEvaluasiOptions}
                                        isClearable
                                        isDisabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                                        styles={errors.hasil_evaluasi ? customStyles : {}}
                                    />
                                </div>
                                <div className="form-group">
                                    <label >{t("evaluation:label.description")}<span className="text-danger"></span></label>
                                    <input 
                                    disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                                    type="text" name="description" className="form-control" ref={register({ required: false })} />
                                </div>
                                <div className="form-group">
                                    <label>Attacment</label>
                                    <input 
                                    disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                                    type="type" name="attachment" className="form-control" readOnly ref={register({ required: false })} />
                                    <FileUploadInformation idFileUpload="ET0001"/>
                                    {watchAllFields['attachment'] !== "" &&
                                        <a className="" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/` + watchAllFields['attachment']} > {t("common:Button.Download")} </a>
                                    }
                                    <label>&nbsp;</label>


                                    {!props.isMonitoring && <button className="custom-file-upload pull-right m-t-5 m-l-5 btn btn-sm btn-success" onClick={(e) => storeFile(e)} disabled={(loadingEvaluasi || props.loadings.loading_submit_evaluasi_btn)}
                                    >
                                        {(loadingEvaluasi || props.loadings.loading_submit_evaluasi_btn) && <i className="fas fa-spinner fa-pulse"></i>}
                                    Upload
                                    </button>}

                                    {!props.isMonitoring && <label className="custom-file-upload btn btn-sm pull-right m-t-5">
                                        <input type="file" name="file" ref={register()} placeholder="" onChange={changeFile} 
                                        disabled={(props.assignment==="assign to evaluator") ? (props.has_roles.includes("EVA001")) ?  false : true : false}
                                        />
                                    Browse
                                    </label>}
                                </div>
                            </div>
                        </div>
                    }
                    {!props.loadings.loading_submit_evaluasi_btn &&
                        <div className="row m-t-10">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>{t("evaluation:label.type-attactment")}</th>
                                                <th>{t("evaluation:label.description")}</th>
                                                <th>File</th>
                                                <th>{t("evaluation:label.action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rowAttactment}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                </PanelBody>

            </Panel>
        </div>
    );
}

export default withTranslation()(HasilEvaluasi);
