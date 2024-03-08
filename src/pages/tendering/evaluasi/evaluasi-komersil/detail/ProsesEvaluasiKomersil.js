import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';

const ProsesEvaluasiKomersil = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    <td align="right">{formatNumber(props.data[key]['harga_penawaran'],2)}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td>{props.data[key]['score_komersil']}</td>}
                    <td>{props.data[key]['evaluasi_komersil']}</td>
                    <td><button className="btn btn-xs btn-warning m-r-5" value={props.data[key]['vendor_id']} onClick={(e) => props.evaluasiVendor(e, props.data[key]['vendor_id'])}  >Evaluasi</button></td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Proses Evaluasi Komersial</PanelHeader>
                <PanelBody >
                    {props.metode_evaluasi==="sistem_nilai" &&
                    <div className="row">
                        <div className="col-sm-4">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <tbody>
                                <tr>
                                    <td>{t("evaluation:label.bobot-commercial")}</td>
                                    <td>{props.header.bobot_komersil}</td>
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
                                            <th>Harga Penawaran Total</th>
                                            {props.metode_evaluasi==="sistem_nilai" && <th>{t("evaluation:label.value-commercial")}</th>}
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

export default withTranslation()(ProsesEvaluasiKomersil);
