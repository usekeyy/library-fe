import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const HasilEvaluasiTeknis = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td>{props.data[key]['score_teknis']}</td> }
                    <td>{props.data[key]['evaluasi_teknis']}</td>
                    <td></td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Hasil Evaluasi Teknis</PanelHeader>
                <PanelBody >
                    {props.metode_evaluasi==="sistem_nilai" &&
                    <div className="row">
                        <div className="col-sm-4">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <tbody>
                                <tr>
                                    <td>{t("evaluation:label.bobot-teknis")}</td>
                                    <td>{props.detailHasilEvalusiTeknis.bobot_teknis}</td>
                                </tr>
                                <tr>
                                    <td>Ambang Batas Teknis</td>
                                    <td>{props.detailHasilEvalusiTeknis.ambang_batas_teknis}</td>
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

export default withTranslation()(HasilEvaluasiTeknis);
