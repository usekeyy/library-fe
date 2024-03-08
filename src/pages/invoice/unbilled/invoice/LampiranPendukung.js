import React from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { useForm } from 'react-hook-form';
import {toastr} from 'react-redux-toastr';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { Row } from 'reactstrap';
import ReactLoading from "react-loading";
import { formatDate } from '../../../../helpers/formatDate';


const Penalty = (props) => {
    const { t } = props;
	const { register, setValue } = useForm({});
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

    const addLampiran = (e) => {
        e.preventDefault()
		props.save();
	};	

    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{formatDate(props.data[key]['document_date'], false)}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>
                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${props.data[key]['file']}`)} href="/">{props.data[key]['file']}</a>
                    </td>
                    <td>
                        <button className="btn btn-xs btn-danger" onClick={(e) => props.toggleDelete(e, key, 'lampiran-pendukung')} ><i className="fa fa-trash"></i></button>
                    </td>
                </tr>
            )
        });
    }

    // const onChange = (e) => {
    //     props.setOption(e.target.value, 'notes')
    // } 

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Lampiran Pendukung Vendor (Optional)</PanelHeader>
                <PanelBody >
                    {props.loadings.input_lampiran_pendukung && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    <div className="row">
                        {props.loadings.input_lampiran_pendukung === false && (
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
                                    <button className="btn btn-success" form="form-klarifikasi" onClick={(e) => addLampiran(e)}>Add</button>
                                    {props.statusLampiranVendor &&
                                        <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                                            *Mohon isi semua inputan lampiran vendor
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </PanelBody>
                <PanelBody >
                    {props.loadings.list_lampiran_pendukung && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    {props.loadings.list_lampiran_pendukung === false && (
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
            </Panel>
        </div>
    );
}

export default withTranslation()(Penalty);