import React from 'react';
import { Button, Row, Col } from 'reactstrap';
// import { useForm, FormContext } from 'react-hook-form';
import ReactLoading from 'react-loading';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { statusName } from '../../../../helpers/statusName';



const Persyaratan = (props) => {
    const { t } = props;  
    let rows;
    let rows2
    // console.log(props.persyaratan)

    if (props.data_persyaratan !== undefined) {
        rows = Object.keys(props.data_persyaratan).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data_persyaratan[key]['description']}</td>
                    <td>
                        <input disabled={(props.created_by === props.uuid && props.pq_status_text === "Open") ? false : true} type="checkbox" checked={props.persyaratan.items_selected.includes(props.data_persyaratan[key]['code'])} onChange={(e) => props.handleChecklist(e, props.data_persyaratan[key], props.data_persyaratan[key]['code'])} />
                    </td>
                </tr>
            )
        });
    }

    if (props.persyaratan_tambahan !== undefined) {
        rows2 = Object.keys(props.persyaratan_tambahan).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.persyaratan_tambahan[key]['description']}</td>
                    <td>
                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.persyaratan_tambahan[key]['file']}`} > {props.persyaratan_tambahan[key]['file']} </a>
                    </td>
                    <td>
                        <input disabled={true} type="checkbox" checked={ (props.persyaratan_tambahan[key]['attachment']==="0" || props.persyaratan_tambahan[key]['attachment']==="n") ? false : true } />
                    </td>
                    {(props.created_by === props.uuid && props.pq_status_text === "Open") ? 
                        <td>
                            <button className="btn btn-xs btn-warning" value={props.persyaratan_tambahan[key]['uuid']} onClick={(e) => props.toggleFormOpen(e, props.persyaratan_tambahan[key]['uuid'])} ><i className="fa fa-edit"></i></button>
                            <button className="btn btn-xs btn-danger" value={props.persyaratan_tambahan[key]['uuid']} onClick={(e) => props.toggleDelete(e, props.persyaratan_tambahan[key]['uuid'])} ><i className="fa fa-trash"></i></button>
                        </td> : 
                        <td></td>
                    }
                </tr>
            )
        });
    }

    const update_persyaratan = (e) => {
        props.update_persyaratan(e)
        props.toggleClose()
	}

    return (
        <div>
            <ModalBody>
                <Panel className="margin-bot-false">
                    <PanelHeader>Detail Persyaratan</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap" style={{width: "80%"}} align="center">
                                        <thead>
                                            <tr>
                                                <th style={{width: "1%"}}>No</th>
                                                <th>Persyaratan</th>
                                                <th style={{width: "20%"}}>Required</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Persyaratan Tambahan</PanelHeader>
                    <PanelBody >
                        <Row>
                            <Col sm="6">
                            </Col>
                            {props.created_by === props.uuid && props.pq_status_text === "Open" &&
                                <Col sm="6">
                                    <div className="pull-right m-b-10">
                                        <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={(e) => props.toggleFormOpen(e, '')} >{t("buyer:button.add")}</Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                        {props.loading && (
                            <ReactLoading type="cylon" color="#0f9e3e" />
                        )}
                        {props.loading === false && (                        
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" style={{width: "80%"}} align="center">
                                            <thead>
                                                <tr>
                                                    <th style={ {width: "1%"}}>No</th>
                                                    <th>Description</th>
                                                    <th>File</th>
                                                    <th>Attachment</th>
                                                    <th style={{width: "20%"}}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows2}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("buyer:button.close")}</button>
                {props.created_by === props.uuid && props.pq_status_text === "Open" &&
                    <button className="btn btn-success" onClick={(e) => update_persyaratan(e)}>{t("buyer:button.submit")}</button>
                }
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Persyaratan);
