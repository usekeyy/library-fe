import React from 'react';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const ListPesertaItemize = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            let baris=[]; let teknis =0 ; let komersil=0; let total=0;
            props.data[key]['vendor'].forEach((element, i) => {
                teknis = (props.data[key]['vendor'][i]['score_teknis']===null) ? 0: parseFloat(props.data[key]['vendor'][i]['score_teknis'])
                komersil= (props.data[key]['vendor'][i]['score_komersil']===null) ? 0 : parseFloat(props.data[key]['vendor'][i]['score_komersil'])
                total =teknis + komersil
                baris.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{props.data[key]['vendor'][i]['vendor_id']}</td>
                    <td>{props.data[key]['vendor'][i]['vendor_name']}</td>
                    {props.metode_evaluasi ==="sistem_nilai" && <td>{props.data[key]['vendor'][i]['score_teknis']}</td>}
                    {props.metode_evaluasi ==="sistem_nilai" && <td>{props.data[key]['vendor'][i]['evaluasi_teknis']}</td> }
                    <td>{props.data[key]['vendor'][i]['score_komersil']}</td>
                    <td>{props.data[key]['vendor'][i]['evaluasi_komersil']}</td>
                    <td>{formatNumber(total,2)}</td>
                </tr>
                )
            })
            return (
                <div className="row" key={index}>
                    <div className="col-sm-12">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th rowSpan="3" style={{ width: "10%", textAlign: "center", verticalAlign: "middle" }}>
                                            {props.data[key]['number_pr']}
                                        </th>
                                        <th rowSpan="3" style={{ width: "15%", textAlign: "center", verticalAlign: "middle" }}>
                                            {(props.data[key]['material_no']===undefined || props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}
                                        </th>
                                        <th rowSpan="3" style={{ width: "30%", textAlign: "center", verticalAlign: "middle" }}>
                                            {props.data[key]['short_text']}
                                        </th>
                                        <td colSpan="2">
                                            qty
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td align="right" colSpan="2">
                                                {props.data[key]['qty']}
                                            </td>
                                        }

                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td align="right" colSpan="2">
                                                {props.data[key]['qty']}
                                            </td>
                                        }
                                        <td rowSpan="3"></td>

                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            Harga Satuan
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td colSpan="2" align="right">
                                                {formatNumber(props.data[key]['valuation_price'], 2)}
                                            </td>
                                        }
                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td  align="right" colSpan="2">
                                                {formatNumber(props.data[key]['valuation_price'], 2)}
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td colSpan="2">
                                            Total
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                        <td colSpan="2" align="right">
                                            {formatNumber(props.data[key]['qty'] * props.data[key]['valuation_price'], 2)}
                                        </td>}
                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                        <td align="right" colSpan="2">
                                            {formatNumber(props.data[key]['qty'] * props.data[key]['valuation_price'], 2)}
                                        </td>}
                                    </tr>
                                    <tr>
                                        <th>No</th>
                                        <th>{t("evaluation:label.number-participant")}</th>
                                        <th>{t("evaluation:label.name-participant")}</th>
                                        {props.metode_evaluasi ==="sistem_nilai" && <th>Nilai Teknis</th>}
                                        {props.metode_evaluasi ==="sistem_nilai" && <th>Status Teknis</th> }
                                        <th>Nilai Komersial</th>
                                        <th>Status Komersial</th>
                                        <th>Total Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        baris
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        });
    }
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Hasil Evaluasi</PanelHeader>
                <PanelBody >
                    {props.metode_evaluasi === "sistem_nilai" &&
                        <div className="row">
                            <div className="col-sm-4">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <tbody>
                                    <tr>
                                        <td>Bobot Teknis</td>
                                        <td>{props.headerProcessEvaluasiCommercil.bobot_teknis}</td>
                                    </tr>
                                    <tr>
                                        <td>Bobot Komersial</td>
                                        <td>{props.headerProcessEvaluasiCommercil.bobot_komersil}</td>
                                    </tr>
                                    <tr>
                                        <td>Passing Grade</td>
                                        <td>{props.headerProcessEvaluasiCommercil.ambang_batas}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-sm-8">

                            </div>
                        </div>
                    }
                    {rows}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPesertaItemize);
