import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';


const Klarifikasi = (props) => {

    // console.log(props)
    const { register, errors } = useFormContext();
    const [loading, setLoading] = React.useState(false)

    const onChange = (code, e) => {
        if (code === 'note') {
            props.onInputChangeKlarifikasi(code, e.target.value)
        }
        else if (code === 'file') {
            setLoading(!loading);
            if (e.target.files[0]){
                props.upload('PQPT01', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    props.onInputChangeKlarifikasi(code, resp.data.data.name)
                })
                .catch((err) => {
                    setLoading(false);
                    props.onInputChangeKlarifikasi(code, '')
                    toastr.error(err.data.message, err.data.status)
                })    
            }else{
                props.onInputChangeKlarifikasi(code, '')
                setLoading(false);
            }
        }
    }

    const onClick = (e) => {
        e.preventDefault()
        props.save()
    }

    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['note']}</td>
                    <td>{props.data[key]['due_date']}</td>
                    <td>
                        {props.data[key]['file'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data[key]['file'] )} disabled={loading}>
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

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Klarifikasi Prakualifikasi</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>User</th>
                                            <th>Klarifikasi</th>
                                            <th>Due Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    {props.data.length > 0 &&
                        <Row>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Ajukan Klarifikasi</label>
                                    <div className="col-lg-12">
                                        <textarea className="form-control" name="note" ref={register({ required: false })} onChange={e => onChange('note', e)}/>
                                        {errors.note && <span className="text-danger">* This field is required</span>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <button
                                            className="btn btn-success pull-right"
                                            onClick={(e) => onClick(e)}
                                        > Send </button>
                                        <span className="pull-right"> </span>
                                        <label className="custom-file-upload pull-right">
                                            <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={e => onChange('file', e)} disabled={loading} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> Upload
                                        </label>
                                        <span className="pull-right"> </span>
                                        <label className="pull-right">{props.data_klarifikasi_submit_vendor.file}</label>

                                    </div>
                                </div>
                            </div>                            
                        </Row>
                    }
                    {/* {props.uuid === props.workflow_user && (props.status==="y" || props.status==="p") &&
                    } */}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Klarifikasi);