import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
// import ReactLoading from "react-loading";


const FormReply = (props) => {
    const { t } = props;
	const { register, handleSubmit, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)

    let rows;

	const onSubmit = async data => {
		props.save(data);
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
                setValue("attachment", resp.data.data.name)
                props.setOptionKonfirmasi(resp.data.data.name, 'attachment')
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("attachment", '')
                props.setOptionKonfirmasi('', 'attachment')
                // setTdpFileName('')
                toastr.error(err.data.message, err.data.status)
            })    
		}else{
            setLoading(false);
        }
    }

    if (props.data.reply !== undefined) {
        rows = Object.keys(props.data.reply).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data.reply[key]['comment']}</td>                    
                    <td>{props.data.reply[key]['created_by_name']}</td>
                    <td>{props.data.reply[key]['created_at']}</td>
                    <td>
                        {props.data.reply[key]['attachment'] !== undefined && props.data.reply[key]['attachment'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data.reply[key]['attachment'] )} disabled={loading}>
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                            </button>
                        }
                    </td>
                </tr>
            )
        });
    }

    // const onChange = (e) => {
    //     props.setOptionKonfirmasi(e.target.value, 'notes')
    // } 

    return (
        <div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="row">
						<div className="col-sm-12">
							<div className="table-responsive">
								<table className="table table-bordered table-striped table-sm text-nowrap">
									<thead>
										<tr>
											<th>Comment</th>
											<th>Created At</th>
											<th>Create By</th>
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
								<textarea className="form-control" name="comment" ref={register({ required: false })}/>
								{props.errors.comment && <span className="text-danger">{props.errors.comment[0]}</span>}
							</div>
						</div>
						<div className="col-sm-12">
							<div className="form-group row">
								<div className="col-sm-6">
									<label className="custom-file-upload">
										<input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
										<input type="hidden" name="attachment" ref={register({required: false})} />
										<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
									</label>
									<span> </span>
									{props.data_param.attachment !== '' && 
										<a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data_param.attachment}`} > lampiran </a>
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
        </div>
    );
}

export default withTranslation()(FormReply);