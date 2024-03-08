import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {toastr} from 'react-redux-toastr';
import { Row } from 'reactstrap';
import ReactLoading from "react-loading";


const KonfirmasiExpediting = (props) => {
    // console.log(props.data_konfirm)
    const { t } = props;
    const { register, errors } = useFormContext();
    const [loading, setLoading] = React.useState(false)

    let rows;

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    const save = (e, data) => {
        // console.log(data)
		props.save(null)
        e.preventDefault()
	}

    const modalKonfirmasiExpediting = (e, data) => {
		props.modalKonfirmasiExpediting(data)
        e.preventDefault()
	}

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('PRCORD', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                // console.log(resp.data.data.name)
                props.setOptionKonfirmasi(resp.data.data.name, 'attachment')
                // setValue("file_name", resp.data.data.name)
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                props.setOptionKonfirmasi('', 'attachment')
                // setTdpFileName('')
                // setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }

    if (props.data_konfirm !== undefined) {
        let items = props.data_konfirm
        rows = Object.keys(items).map(function (key, index) {
            items[key].parent_id = items[key].id
            let data_s = []
            data_s.push(items[key])
            items[key]['reply'].forEach(element => {
                element.parent_id = items[key].id
                data_s.push(element)
            })
            return (
                data_s.map(function(d, i) {
                    if (i === 0) {
                        return (
                            <tr key={key}>
                                <td>{index+1}</td>
                                <td>{items[key]['created_by_name']}</td>
                                <td>{items[key]['comment']}</td>                    
                                <td>{items[key]['created_at']}</td>
                                <td>
                                    {items[key]['attachment'] !== undefined && items[key]['attachment'] !== null &&
                                        <>
                                        <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/invoice/' + items[key]['attachment'] )} disabled={loading}>
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i>
                                        </button>
                                        {' ' + items[key]['attachment']}
                                        </>
                                    }
                                </td>
                                <td>
                                    {i === data_s.length-1 &&
                                        ((props.user_vendor.id === props.data.purchase_order.vendor_id && props.user_vendor.uuid !== items[key]['created_by'])
                                        || (props.user.uuid === props.data.created_by && props.user.uuid !== items[key]['created_by'])) &&
                                        <button className="btn btn-xs btn-lime" onClick={(e) => modalKonfirmasiExpediting(e, items[key])} ><i className="fa fa-reply"></i>Reply</button>
                                    }
                                </td>
                            </tr>
                        )
                    }
                    else {
                        return (
                            <tr key={key+'-'+i}>
                                <td>{index+1}.{i}</td>
                                <td>{d['created_by_name']}</td>
                                <td>{d['comment']}</td>                    
                                <td>{d['created_at']}</td>
                                <td>
                                    {d['attachment'] !== undefined && d['attachment'] !== null &&
                                        <>
                                        <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/invoice/' + d['attachment'] )} disabled={loading}>
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i>
                                        </button>
                                        {' ' + d['attachment']}
                                        </>
                                    }
                                </td>
                                <td>
                                    {i === data_s.length-1 &&
                                        ((props.user_vendor.id === props.data.purchase_order.vendor_id && props.user_vendor.uuid !== d['created_by'])
                                        || (props.user.uuid === props.data.created_by && props.user.uuid !== d['created_by'])) &&
                                        <button className="btn btn-xs btn-lime" onClick={(e) => modalKonfirmasiExpediting(e, d)} ><i className="fa fa-reply"></i>Reply</button>
                                    }
                                </td>
                            </tr>
                        )
                    }
                })
            )
        });
    }

    const onChange = (e) => {
        props.setOptionKonfirmasi(e.target.value, 'notes')
    } 

    return (
        <div>
            {props.loading_konfirmasi && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loading_konfirmasi === false && (
                <Panel className="margin-bot-false">
                    <PanelHeader>Komunikasi Expediting</PanelHeader>
                    <PanelBody>
                        <Row>
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Oleh</th>
                                                <th>Catatan</th>
                                                <th>Tanggal</th>
                                                <th>lampiran</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    {/* <label className="col-form-label">Catatan</label> */}
                                    <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChange(e)}/>
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group row">
                                    <div className="col-sm-6">
                                        <label className="custom-file-upload">
                                            <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                        </label>
                                        <span> </span>
                                        {props.param_konfirmasi.attachment !== '' && 
                                            <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${props.param_konfirmasi.attachment}`} > lampiran </a>
                                        }
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-success pull-right" onClick={(e) => save(e)} >Send</button>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </PanelBody>
                </Panel>
            )}
        </div>
    );
}

export default withTranslation()(KonfirmasiExpediting);