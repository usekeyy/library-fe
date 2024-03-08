import React from 'react';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const ListPesertaItemizeTeknis = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            let baris=[];
            props.data[key]['vendor'].forEach((element, i) => {
                baris.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{props.data[key]['vendor'][i]['vendor_id']}</td>
                    <td>{props.data[key]['vendor'][i]['vendor_name']}</td>
                    {props.metode_evaluasi ==="sistem_nilai" && <th>{props.data[key]['vendor'][i]['score_teknis']}</th>}
                    <td colSpan="2">{props.data[key]['vendor'][i]['evaluasi_teknis']}</td>
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
                                        <td>
                                            qty
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td align="right">
                                                {props.data[key]['qty']}
                                            </td>
                                        }

                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td align="right" colSpan="2">
                                                {props.data[key]['qty']}
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td>
                                            Harga Satuan
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td align="right">
                                                {formatNumber(props.data[key]['valuation_price'], 2)}
                                            </td>
                                        }
                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td align="right" colSpan="2">
                                                {formatNumber(props.data[key]['valuation_price'], 2)}
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td>
                                            Total
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                        <td align="right">
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
                                        {props.metode_evaluasi ==="sistem_nilai" && <th>Nilai</th>}
                                        <th colSpan="2">Status</th>
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
                <PanelHeader>Hasil Evaluasi Teknis</PanelHeader>
                <PanelBody >
                    {props.metode_evaluasi==="sistem_nilai" &&
                    <div className="row">
                        <div className="col-sm-4">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <tbody>
                                <tr>
                                    <td>Bobot Teknis</td>
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
                    {rows}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPesertaItemizeTeknis);
