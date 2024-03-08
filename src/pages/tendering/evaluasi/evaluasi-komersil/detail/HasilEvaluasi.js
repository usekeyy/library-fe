import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';

const HasilEvaluasi = (props) => {
    const { t } = props;
    let rows;
    let teknis=0; let komersil=0; let total=0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            teknis = (props.data[key]['score_teknis']===null) ? 0: parseFloat(props.data[key]['score_teknis'])
            komersil= (props.data[key]['score_komersil']===null) ? 0 : parseFloat(props.data[key]['score_komersil'])
            total =teknis +komersil
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td>{formatNumber(teknis,2)}</td> }
                    <td>{props.data[key]['evaluasi_teknis']}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td>{formatNumber(komersil,2)}</td> }
                    <td>{(props.data[key]['evaluasi_komersil'])}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td>{formatNumber(total,2)}</td> }
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("evaluation:panel-title.result-evaluation")}</PanelHeader>
                <PanelBody >
                    {props.metode_evaluasi === "sistem_nilai" &&
                        <div className="row">
                            <div className="col-sm-4">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <tbody>
                                    <tr>
                                        <td>{t("evaluation:label.bobot-teknis")}</td>
                                        <td>{props.headerProcessEvaluasiCommercil.bobot_teknis}</td>
                                    </tr>
                                    <tr>
                                        <td>{t("evaluation:label.bobot-commercial")}</td>
                                        <td>{props.headerProcessEvaluasiCommercil.bobot_komersil}</td>
                                    </tr>
                                    <tr>
                                        <td>{t("evaluation:label.passing-grade")}</td>
                                        <td>{props.headerProcessEvaluasiCommercil.ambang_batas}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-sm-8">

                            </div>
                        </div>
                    }
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("evaluation:label.vendor-number")}</th>
                                            <th>{t("evaluation:label.vendor-name")}</th>
                                            {props.metode_evaluasi==="sistem_nilai" && <th>{t("evaluation:label.value-teknis")}</th> }
                                            <th>{t("evaluation:label.result-teknis")}</th>
                                            {props.metode_evaluasi==="sistem_nilai" && <th>{t("evaluation:label.value-commercial")}</th> }
                                            <th>{t("evaluation:label.result-commercial")}</th>
                                            {props.metode_evaluasi==="sistem_nilai" && <th>{t("evaluation:label.result-value")} </th>}
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

export default withTranslation()(HasilEvaluasi);
