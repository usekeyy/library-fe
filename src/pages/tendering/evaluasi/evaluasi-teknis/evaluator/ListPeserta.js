import React from 'react';
// import { useFormContext } from 'react-hook-form';
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
                    <td>{props.data[key]['evaluasi_teknis']}</td>
                    <td>
                    <button className="btn btn-xs btn-warning m-r-5" value={props.data[key]['vendor_id']} onClick={(e) => props.evaluasiVendor(e, props.data[key]['vendor_id'])}  >Evaluasi</button>
                    </td>
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
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPeserta);
