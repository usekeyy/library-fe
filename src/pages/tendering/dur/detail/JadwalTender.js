import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';

const JadwalTender = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['jadwal_tender_name']}</td>
                    <td>{formatDate(props.data[key]['start_date'], false)}</td>
                    <td>{props.data[key]['start_time']}</td>
                    <td>{formatDate(props.data[key]['end_date'], false)}</td>
                    <td>{props.data[key]['end_time']}</td>
                    <td></td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.schedule-tender")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>{t("dur:label.process")}</th>
                                            <th>{t("dur:label.start-date")}</th>
                                            <th>{t("dur:label.start-time")}</th>
                                            <th>{t("dur:label.end-date")}</th>
                                            <th>{t("dur:label.end-time")}</th>
                                            <th>{t("dur:label.action")}</th>
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

export default withTranslation()(JadwalTender);
