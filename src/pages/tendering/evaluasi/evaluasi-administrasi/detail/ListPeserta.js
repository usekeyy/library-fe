import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const ListPeserta = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    <td>{props.data[key]['evaluasi_admin']}</td>
                    <td><button className="btn btn-xs btn-info" onClick={(e)=>props.openModal(e,props.data[key]['vendor_uuid'])}>Evaluasi</button></td>
                </tr>
            )
        });
    }    

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("evaluation:panel-title.list-participants")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("evaluation:label.number-participant")}</th>
                                            <th>{t("evaluation:label.name-participant")}</th>
                                            <th>{t("evaluation:label.status")}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row pull-right">
                        {props.isMonitoring ? 
                            <button type="button" className="m-r-10 btn btn-light" onClick={(e)=>props.back(e,'monitoring')}>{t("evaluation:button.back")}</button>
                             :   <div>
                                    <button type="button" 
                                        className="m-r-10 btn btn-info" 
                                        onClick={(e)=>props.publishEvaluasiAdmin(e)} 
                                        disabled={props.loadings.loadingPublishBtn}>  {props.loadings.loadingPublishBtn && <i className="fa fa-spinner fa-spin"></i> }  {t("evaluation:button.publish")}
                                    </button>
                                    <button type="button" className="m-r-10 btn btn-light" onClick={(e)=>props.back(e)}>{t("evaluation:button.back")}</button>
                                </div>
                        }
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPeserta);
