import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';


const Catatan = (props) => {
    const {t} = props
    const { register,errors,handleSubmit } = useForm();
    const onSubmit = async data => {
        props.storeCatatan(data)
    };
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['process']}</td>
                    <td>{props.data[key]['created_at']}</td>
                    <td>{props.data[key]['note']}</td>                    
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("bidOpening:label.note")}</PanelHeader>
                
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
                                            <th>{t("bidOpening:label.name")}</th>
                                            <th>{t("bidOpening:label.process")}</th>
                                            <th>{t("bidOpening:label.date")}</th>
                                            <th>{t("bidOpening:label.note")}</th>
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
                                <label className="col-form-label">{t("bidOpening:label.note")}</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note" ref={register({ required: true })} defaultValue={props.textNote}/>
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="pull-right m-t-5 m-b-5">
                                <button
                                    disabled={props.loadings.loadingNoteBtn}
                                    type="submit"
                                    className="btn btn-success m-r-5">
                                        {props.loadings.loadingNoteBtn && <i className="fa fa-spinner fa-spin"></i> }
                                    Send
                            </button>
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