import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';

const FormModalCommercial = (props) => {
    const { t } = props;
    let rows;
    let Total = 0; let TotalPenawaran = 0; let loop = 0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            loop += (key + 1);
            if (props.data[key]['tipe'] === "jasa") {
                let att = [];
                att.push(<tr key={(loop)}>
                    <td>{props.data[key]['number_pr']}</td>
                    <td>{props.data[key]['item_no']}</td>
                    <td></td>
                    <td>{props.data[key]['short_text']}</td>
                    <td></td>
                    <td colSpan="7"></td>
                </tr>)
                props.data[key]['jasa_detail'].forEach((element, i) => {
                    loop += (i + 1);
                    Total += element['net_value'] * (element['qty'] / element['per'])
                    TotalPenawaran += element['harga_penawaran'] * (element['qty_penawaran'] / element['per'])
                    att.push(
                        <tr key={(loop)}>
                            <td>{element['number_pr']}</td>
                            <td>{element['item_no']}</td>
                            <td>{(props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}</td>
                            <td>{element['short_text']}</td>
                            <td>{element['spesifikasi']}</td>
                            <td>{element['currency']}</td>
                            <td>{element['uom']}</td>
                            <td>{element['per']}</td>
                            <td align="right">{formatNumber(element['qty'], 2)}</td>
                            <td align="right">{formatNumber(element['net_value'], 2)}</td>
                            <td align="right">{formatNumber(element['qty_penawaran'], 2)}</td>
                            <td align="right">{formatNumber(element['harga_penawaran'], 2)}</td>
                        </tr>
                    )
                });
                return (
                    att
                )
            } else {
                Total += props.data[key]['valuation_price'] * (props.data[key]['qty'] / props.data[key]['per'])
                TotalPenawaran += props.data[key]['harga_penawaran'] * (props.data[key]['qty_penawaran'] / props.data[key]['per'])
                return (
                    <tr key={(loop)}>
                        <td>{props.data[key]['number_pr']}</td>
                        <td>{props.data[key]['item_no']}</td>
                        <td>{(props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}</td>
                        <td>{props.data[key]['short_text']}</td>
                        <td>{props.data[key]['spesifikasi']}</td>
                        <td>{props.data[key]['currency']}</td>
                        <td>{props.data[key]['uom']}</td>
                        <td>{props.data[key]['per']}</td>
                        <td align="right">{formatNumber(props.data[key]['qty'], 2)}</td>
                        <td align="right">{formatNumber(props.data[key]['valuation_price'], 2)}</td>
                        <td align="right">{formatNumber(props.data[key]['qty_penawaran'], 2)}</td>
                        <td align="right">{formatNumber(props.data[key]['harga_penawaran'], 2)}</td>
                    </tr>
                )
            }
        });

        rows.push(
            <tr key={(loop + 1)}>
                <td colSpan="8" align="center">Total Harga Keseluruhan</td>
                <td align="right" colSpan="2">{formatNumber(Total, 2)}</td>
                <td align="right" colSpan="2">{formatNumber(TotalPenawaran, 2)}</td>
            </tr>
        )
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-bordered table-striped table-sm text-nowrap">
                        <tbody>
                            <tr>
                                <td>{t("bidOpening:label.vendor-number")}</td>
                                <td>{props.vendor_id}</td>
                            </tr>
                            <tr>
                                <td>{t("bidOpening:label.vendor-name")}</td>
                                <td>{props.vendor_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Panel className="margin-bot-false">
                        <PanelHeader>Header</PanelHeader>
                        <PanelBody >
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th align="center" rowSpan="2">No PR</th>
                                            <th align="center" rowSpan="2">No Item</th>
                                            <th align="center" rowSpan="2">No Material</th>
                                            <th align="center" rowSpan="2">Short text</th>
                                            <th align="center" rowSpan="2" width="25%">Spesifikasi</th>
                                            <th align="center" rowSpan="2">{t("bidOpening:label.currency")}</th>
                                            <th align="center" rowSpan="2">Uom</th>
                                            <th align="center" rowSpan="2">Per</th>
                                            <th align="center" colSpan="2">OE</th>
                                            <th align="center" colSpan="2">{t("bidOpening:label.offred-price")}</th>
                                        </tr>
                                        <tr>
                                            <th>Qty</th>
                                            <th>{t("bidOpening:label.unit-price")}</th>
                                            <th>Qty</th>
                                            <th>{t("bidOpening:label.unit-price")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </PanelBody>
                    </Panel>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(FormModalCommercial);
