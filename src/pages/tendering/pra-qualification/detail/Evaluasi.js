import React from 'react';
import Datetime from 'react-datetime';
// import { Button, Row, Col } from 'reactstrap';
import { useForm } from 'react-hook-form';
import {toastr} from 'react-redux-toastr';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { statusName } from '../../../../helpers/statusName';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
import moment from 'moment';



const Evaluasi = (props) => {
    const { t } = props;  
    // console.log(props)
	const { register, handleSubmit, errors, setValue } = useForm({});
	const [status, setStatus] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    
    const onSubmitKlarifikasi = async data => {
		props.saveKlarifikasi(data);
	};	

	const onSubmitEvaluasi = async data => {
        data.status = status
        data.vendor_id = props.data_vendor.vendor_id
        props.saveEvaluasi(data);
	};	

    const onInputChangeDueDate = (date) => {
        props.onInputChangeDueDate(date)
	};

    const onChange = (code, data, value) => {
        // console.log(value)
        props.onInputChangeEvaluasi(code, data, value)
	};

	const ApprovalCheck = (e) => {
		setStatus('y')
	}

	const RejectCheck = (e) => {
		setStatus('r')
	}

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('PQPT01', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                // setTdpFileName('')
                setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }

    let rows_klarifikasi;
    let rows_persyaratan;

    if (props.data_persyaratan !== undefined) {
        rows_persyaratan = Object.keys(props.data_persyaratan).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data_persyaratan[key]['syarat_description']}</td>
                    <td>
                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data_persyaratan[key]['syarat_file']}`} > {props.data_persyaratan[key]['syarat_file']} </a>
                    </td>
                    <td>
                        <input type="checkbox"
                            checked={props.persyaratan.items_selected.includes(props.data_persyaratan[key]['syarat_id'] + '-' + props.data_persyaratan[key]['syarat_tipe'])} 
                            onChange={e => onChange('evaluasi_result', props.data_persyaratan[key], props.data_persyaratan[key]['syarat_id'] + '-' + props.data_persyaratan[key]['syarat_tipe'])}
                            disabled={(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by ? false : true}
                        />
                    </td>
                    <td>
                        <input className={"form-control"} name="evaluasi_note" ref={register({ required: false })}
                            onChange={e => onChange('evaluasi_note', props.data_persyaratan[key], e.target.value)}
                            defaultValue={props.data_persyaratan[key]['evaluasi_note'] || '' }
                            disabled={(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by ? false : true}
                        />
                    </td>
                </tr>
            )
        });
    }


    if (props.data_klarifikasi !== undefined) {
        rows_klarifikasi = Object.keys(props.data_klarifikasi).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data_klarifikasi[key]['created_by_name']}</td>
                    <td>{props.data_klarifikasi[key]['note']}</td>
                    <td>{props.data_klarifikasi[key]['due_date'] !== null && props.data_klarifikasi[key]['due_date'] !== '' ? moment(props.data_klarifikasi[key]['due_date']).format("DD-MM-YYYY") : ''}</td>
                    <td>
                        {props.data_klarifikasi[key]['file'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data_klarifikasi[key]['file'] )} disabled={loading}>
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                            </button>
                        }
                    </td>                    
                </tr>
            )
        });
    }

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    const toggleClose = (e) => {
        e.preventDefault()
        props.toggleClose()
    }

    return (
        <div>
            <ModalBody>
                <Panel className="margin-bot-false">
                    <PanelHeader>Header</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <td style={{width:"20%"}}>No Pendaftar</td>
                                                <td>{props.data_vendor.vendor_id}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width:"20%"}}>Nama Pendaftar</td>
                                                <td>{props.data_vendor.vendor_name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Evaluasi Persyaratan</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Persyaratan</th>
                                                <th>File</th>
                                                <th>Lolos</th>
                                                <th>Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows_persyaratan}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Klarifikasi Prakualifikasi</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>User</th>
                                                <th>Klarifikasi</th>
                                                <th>Due Date</th>
                                                <th>Lampiran</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows_klarifikasi}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>

                {(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by && 
                    <Panel className="margin-bot-false">
                        <PanelHeader>Ajukan Klarifikasi</PanelHeader>
                        <PanelBody >
                            <form id="form-klarifikasi" onSubmit={handleSubmit(onSubmitKlarifikasi)}>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Due Date <span className="text-danger">*</span></label>
                                        <Datetime
                                                onChange={onInputChangeDueDate}
                                                dateFormat="DD-MM-YYYY"
                                                timeFormat={false}
                                                // inputProps={{ placeholder: "DD-MM-YYYY" }}
                                            />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Klarifikasi <span className="text-danger">*</span></label>
                                        <textarea className="form-control" name="note" ref={register({ required: false })} />
                                        {errors.note && <span className="text-danger">* This field is required</span>}
                                    </div>
                                </div>
                                <input type="hidden" ref={register({ required: false })} name="vendor_id" value={props.data_vendor.vendor_id}/>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>File <span className="text-danger">*</span></label>
                                        <div className="form-group row">
                                            <div className="col-md-8">
                                                <input type="text" className={"form-control"} name="file_name" ref={register({required: false})} placeholder="" disabled={true} />
                                                <FileUploadInformation idFileUpload="PQPT01" />
                                            </div>
                                            {}
                                            <div className="col-md-4">
                                                <label className="custom-file-upload">
                                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="form-group">
                                        <button className="btn btn-success pull-right" type="submit" form="form-klarifikasi">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </PanelBody>
                    </Panel>
                }

            </ModalBody>
            <ModalFooter>
                {(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by &&
                    (props.data_vendor.vendor_status !== 'Active' ?
                        (props.status_catatan_evaluasi ?
                            <span className="text-danger pull-left">* Vendor tidak bisa diloloskan karena masih Applicant<br></br>* Mohon isi Catatan evaluasi apabila persyaratan tidak lolos</span> :
                            <span className="text-danger pull-left">* Vendor tidak bisa diloloskan karena masih Applicant</span>
                        ) : 
                        (props.status_catatan_evaluasi &&
                            <span className="text-danger pull-left">* Mohon isi Catatan evaluasi apabila persyaratan tidak lolos</span>
                        )
                    )
                }
                <form id="form-evaluasi" onSubmit={handleSubmit(onSubmitEvaluasi)}>
                    {(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by && 
                        <button className="btn btn-success" type="submit" disabled={props.data_vendor.vendor_status !== 'Active' ? true : false} onClick={(e) => ApprovalCheck(e)} form="form-evaluasi">Pass</button>
                    }
                    {(props.status_text === 'Open' || props.status_text === 'Active') && props.user_uuid === props.created_by && 
                        <button className="btn btn-danger" type="submit" onClick={(e) => RejectCheck(e)} form="form-evaluasi">Fail</button>
                    }
                    <button className="btn btn-white" onClick={(e) => toggleClose(e)}>{t("buyer:button.close")}</button>
                </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Evaluasi);
