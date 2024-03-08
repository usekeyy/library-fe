import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import ReactLoading from "react-loading";


const FormReply = (props) => {
    const { t } = props;
	const { register, handleSubmit, errors, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)

    let rows;

	const onSubmit = async data => {
		props.save();
	};	

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('PRCORD', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                // console.log(resp.data.data.name)
                setValue("file_name", resp.data.data.name)
                props.setOptionKonfirmasi(resp.data.data.name, 'attachment')
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("file_name", '')
                props.setOptionKonfirmasi('', 'attachment')
                // setTdpFileName('')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['comment']}</td>                    
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['created_at']}</td>
                    <td>
                        {props.data[key]['attachment'] !== undefined && props.data[key]['attachment'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/invoice/' + props.data[key]['attachment'] )} disabled={loading}>
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                            </button>
                        }
                    </td>
                </tr>
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Comment</th>
                                                <th>Create By</th>
                                                <th>Created At</th>
                                                <th>Lampiran</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
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
                                            <input type="hidden" name="file_name" ref={register({required: false})} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                        </label>
                                        <span> </span>
                                        {props.param_konfirmasi.attachment !== '' && 
                                            <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${props.param_konfirmasi.attachment}`} > lampiran </a>
                                        }
                                    </div>
                                    <div className="col-sm-6">
                                        <button className="btn btn-success pull-right" type="submit" >Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </form>
            )}
        </div>
    );
}

export default withTranslation()(FormReply);