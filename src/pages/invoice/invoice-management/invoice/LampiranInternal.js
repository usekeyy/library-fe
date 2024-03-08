import React from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { useFormContext } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
import {toastr} from 'react-redux-toastr';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { Row } from 'reactstrap';
import ReactLoading from "react-loading";
// import moment from 'moment';
import { formatDate } from '../../../../helpers/formatDate';


const LampiranInternal = (props) => {
    const { t } = props;
	const { register, setValue } = useFormContext();
    const [loading, setLoading] = React.useState(false)

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            let name = e.target.files[0].name
            props.upload('PQPT01', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", name)
                props.setOption(name, 'file-name')
                props.setOption(resp.data.data.name, 'file')
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                // setTdpFileName('')
                setValue("file_name", '')
                props.setOption('', 'file-name')
                props.setOption('', 'file')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            props.setOption('', 'file-name')
            props.setOption('', 'file')
            setLoading(false);
        }
    }

    const onChangeDocumentDate = (e) => {
        props.setOption(formattingDate(e), 'document-date')
        setValue('document_date', formattingDate(e))
    }

    const onChangeDescription = (e) => {
        props.setOption(e.target.value, 'description')
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

  //   const addLampiran = (e) => {
  //       e.preventDefault()
  //       // console.log('tambah')
	// 	props.save();
	// };	

    let rows;
    if (props.data_lampiran_internal !== undefined) {
        rows = Object.keys(props.data_lampiran_internal).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{formatDate(props.data_lampiran_internal[key]['document_date'], false)}</td>
                    <td>{props.data_lampiran_internal[key]['description']}</td>
                    <td>
                        {props.data_lampiran_internal[key]['id'] === undefined ?
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data_lampiran_internal[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${props.data_lampiran_internal[key]['file']}`)} href="/">{props.data_lampiran_internal[key]['file']}</a>
                            :
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data_lampiran_internal[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data_lampiran_internal[key]['file']}`)} href="/">{props.data_lampiran_internal[key]['file']}</a>
                        }
                    </td>
                    <td>
                        {/* {props.data_lampiran_internal[key]['id'] === undefined &&
                            <button className="btn btn-xs btn-danger" onClick={(e) => props.toggleDelete(e, key, 'lampiran-pendukung')} ><i className="fa fa-trash"></i></button>
                        } */}
                    </td>
                </tr>
            )
        });
    }

    // const onChange = (e) => {
    //     // console.log(e.target.value)
    //     // props.setOption(e.target.value, 'notes')
    // } 

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Lampiran Pendukung Internal (Optional)</PanelHeader>
                {((props.data.status === 'submitted' && props.user.has_roles.includes("INVER1")) || (props.data.status === 'received' && props.user.has_roles.includes("INVER2"))) &&
                    <PanelBody >
                        {props.loadings.input_lampiran_internal && (
                            <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                            </center>
                        )}
                        <div className="row">
                            {props.loadings.input_lampiran_internal === false && (
                                <div className="col-sm-8">
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Tanggal Dokumen </label>
                                        <div className="col-sm-8">
                                            <Datetime
                                                // value={props.param.document_date !== undefined && props.param.document_date !== '' && props.param.document_date !== null ? moment(props.param.document_date).format("DD-MM-YYYY") : ''}
                                                onChange={onChangeDocumentDate}
                                                closeOnSelect={true}
                                                name="document_date_temp"
                                                dateFormat="DD-MM-YYYY"
                                                timeFormat={false}
                                                inputProps={{ placeholder: "DD-MM-YYYY" }}
                                            />
                                            <input type="hidden" name="document_date" ref={register({ required: false })} defaultValue={props.param.document_date !== undefined ? props.param.document_date : ''} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">File </label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" name="file_name" ref={register({required: false})} disabled={true}/>
                                        </div>
                                        <div className="col-sm-2">
                                            <label className="custom-file-upload">
                                                <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Deskripsi </label>
                                        <div className="col-sm-8">
                                            <input type="text" name="description" ref={register({required: false})} onChange={(e) => onChangeDescription(e)} className="form-control" placeholder="" defaultValue={props.param.description || ''} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="col-sm-8">
                                <div className="form-group row">
                                    <div className="col-sm-12">
                                        {/* <button className="btn btn-success" form="form-klarifikasi" onClick={(e) => addLampiran(e)}>Add</button> */}
                                        {props.statusLampiranInternal &&
                                            <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                                                *Mohon isi semua inputan lampiran internal
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                }
                <PanelBody >
                    {props.loadings.list_lampiran_internal && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    {props.loadings.list_lampiran_internal === false && (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Tanggal Dokumen</th>
                                                <th>Deskripsi</th>
                                                <th>Lampiran</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </PanelBody>
                {/* <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChange(e)} defaultValue={props.data.note || ''}/>
                                {errors.note && <span className="text-danger">* This field is required</span>}
                            </div>
                        </div>
                    </div>
                </PanelBody> */}
            </Panel>
        </div>
    );
}

export default withTranslation()(LampiranInternal);