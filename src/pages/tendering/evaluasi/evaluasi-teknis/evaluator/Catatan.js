import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';


const Catatan = (props) => {

    const { register,errors,handleSubmit } = useForm();
    const [status, setStatus] = React.useState();

    const onSubmit = async data => {
        data.status=status
        props.saveEvaluasiTeknisPublish(data)
    };

    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['catatan']}</td>
                    <td>{props.data[key]['from']}</td>
                    <td>{props.data[key]['created_at']}</td>                
                </tr>
            )
        });
    }

    const reject = (e) => {
       setStatus('reject')
    }
    const approve = (e) => {
       setStatus('approve')
    }
    const publish = (e) => {
        setStatus('publish')
    }


    return (
        <div>
            
            <Panel className="margin-bot-false">
                <PanelHeader>Catatan</PanelHeader>
                
                {props.loadings.loadingNote &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                {!props.loadings.loadingNote && 
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Catatan</th>
                                            <th>Proses</th>
                                            <th>Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="catatan" ref={register({ required: true })} defaultValue={props.textNote}/>
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="pull-right m-t-5 m-b-5">
                            {props.proses==="Approved" &&
                                <button
                                        disabled={props.loadings.loading_button_submit_config}
                                        type="submit"
                                        className="btn btn-sm btn-success m-r-5"
                                        onClick={(e)=>publish(e)}>
                                            {props.loadings.loading_button_submit_config && <i className="fa fa-spinner fa-spin"></i> }
                                        Publish
                                </button>
                            }

                            {props.proses==="Approval Evaluasi Teknis" &&
                                <button
                                        disabled={props.loadings.loading_button_submit_config}
                                        type="submit"
                                        className="btn btn-sm btn-success m-r-5"
                                        onClick={(e)=>approve(e)}>
                                            {props.loadings.loading_button_submit_config && <i className="fa fa-spinner fa-spin"></i> }
                                        Approve
                                </button>
                            }

                            {(props.proses==="" || props.proses===null) &&
                                <button
                                        disabled={props.loadings.loading_button_submit_config}
                                        type="submit"
                                        className="btn btn-sm btn-success m-r-5"
                                        onClick={(e)=>approve(e)}>
                                            {props.loadings.loading_button_submit_config && <i className="fa fa-spinner fa-spin"></i> }
                                        Submit
                                </button>
                            }
                            
                            {(props.proses==="" ||  props.proses===null || props.proses==="Approval Evaluasi Teknis") &&
                               <button className="btn btn-sm btn-danger m-r-5" 
                                disabled={props.loadings.loading_button_submit_config}
                                onClick={(e)=>reject(e)}>
                                    {props.loadings.loading_button_submit_config && <i className="fa fa-spinner fa-spin"></i> }
                                Reject
                            </button>
                            }

                            <button type="button" disabled={props.loadings.loading_button_submit_config} className="btn btn-sm btn-info" onClick={(e)=>props.back(e)}>Back</button>
                            </div>
                        </div>
                    </div>
                    </form>
                </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(Catatan);