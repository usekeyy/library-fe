import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';

const Items = (props) => {
    const { t } = props;
    let rows,rows_item;
    let Total = 0; let loop = 0;let TotalPenawaran=0;

    if (props.data !== undefined) {
        rows_item = Object.keys(props.item).map(function (key, index) {
            return (
                <tr key={(key)}>
                    <td>{(index+1)}</td>
                    <td>{props.item[key]['vendor_id']}</td>
                    <td>{props.item[key]['vendor_name']}</td>
                    <td align="right">{formatNumber(props.item[key]['harga_penawaran'],2)}</td>
                    {props.metode_evaluasi==="sistem_nilai" && <td align="right">{formatNumber(props.item[key]['score_komersil'],2)}</td> }
                </tr>
            )
        })
    }

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            if (props.data[key]['tipe'] === "jasa") {
                let att = [];
                loop += key;
                att.push(<tr key={(loop)}>
                    <td>{props.data[key]['number_pr']}</td>
                    <td>{props.data[key]['item_no']}</td>
                    <td>{(props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}</td>
                    <td>{props.data[key]['short_text']}</td>
                    <td>{props.data[key]['spesifikasi']}</td>
                    <td colSpan="8"></td>
                </tr>)
                props.data[key]['jasa_detail'].forEach((element, i) => {
                    Total += element['net_value'] * (element['qty'] / element['per'])
                    TotalPenawaran += element['harga_penawaran'] * (element['qty_penawaran'] / element['per'])
                    loop += key;
                    att.push(
                        <tr key={(loop)}>
                            <td>{element['number_pr']}</td>
                            <td>{parseInt(element['item_no'])}</td>
                            <td>{element['material_no']}</td>
                            <td>{element['short_text']}</td>
                            <td></td>
                            <td>{element['currency']}</td>
                            <td>{element['uom']}</td>
                            <td>{element['per']}</td>
                            <td style={{textAlign : 'right'}}>{ formatNumber(element['qty'],2)}</td>
                            <td align="right">{formatNumber(element['net_value'], 2)}</td>
                            <td align="right">{formatNumber(element['qty_penawaran'],2)}</td>
                            <td align="right">{formatNumber(element['harga_penawaran'],2)}</td>
                            <td>{element['quote']}</td>
                        </tr>
                    )
                });
                return (
                    att
                )
            } else {
                Total += props.data[key]['valuation_price'] * (props.data[key]['qty'] / props.data[key]['per'])
                TotalPenawaran += props.data[key]['harga_penawaran'] * (props.data[key]['qty_penawaran'] / props.data[key]['per'])
                loop += key;
                return (
                    <tr key={(loop)}>
                        <td>{props.data[key]['number_pr']}</td>
                        <td>{props.data[key]['item_no']}</td>
                        <td>{parseInt(props.data[key]['material_no'])}</td>
                        <td>{props.data[key]['short_text']}</td>
                        <td>{props.data[key]['spesifikasi']}</td>
                        <td>{props.data[key]['currency']}</td>
                        <td>{props.data[key]['uom']}</td>
                        <td>{props.data[key]['per']}</td>
                        <td style={{textAlign : 'right'}}>{formatNumber(props.data[key]['qty'],2)}</td>
                        <td align="right">{formatNumber(props.data[key]['valuation_price'], 2)}</td>
                        <td align="right">{formatNumber(props.data[key]['qty_penawaran'],2)}</td>
                        <td align="right">{formatNumber(props.data[key]['harga_penawaran'],2)}</td>
                        <td>{props.data[key]['quote']}</td>
                    </tr>
                )
            }
        });

        rows.push(
            <tr key={Object.keys(props.data).length + 1}>
                <td colSpan="8" align="center">Total Harga Keseluruhan</td>
                <td align="right" colSpan="2">{formatNumber(Total, 2)}</td>
                <td align="right" colSpan="2">{formatNumber(TotalPenawaran, 2)}</td>
                <td></td>
            </tr>
        )
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Items</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-6">
                            <table className="table table-bordered table-striped table-sm">
                                <tr>
                                    <td>No. Penawaran</td>
                                    <td>{props.quotations_detail?.number}</td>
                                </tr>
                                <tr>
                                    <td>Tanggal Penawaran</td>
                                    <td>{formatDate(props.quotations_detail?.date, false)}</td>
                                </tr>
                                <tr>
                                    <td>Validity Penawaran</td>
                                    <td>{props.quotations_detail?.validity===null ? "-" :props.quotations_detail?.validity+" "} Hari</td>
                                </tr>
                            </table>
                        </div>
                        <div className="col-sm-6">
                            <table className="table table-bordered table-striped table-sm">
                                <tr>
                                    <td>Incoterm</td>
                                    <td>{props.quotations_detail?.incoterm_id !== "" ? props.quotations_detail?.incoterm_id + " - " +props.quotations_detail?.incoterm_name :""}</td>
                                </tr>
                                <tr>
                                    <td>Lokasi Pengiriman</td>
                                    <td>{props.quotations_detail?.location}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.no-pr")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.no-item")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.no-material")}</th>
                                            <th align="center" rowSpan="2"  style={{width:"15%", textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.short-text")}</th>
                                            <th align="center" rowSpan="2"  style={{width:"20%", textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.specification")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.currency")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>Uom</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>Per</th>
                                            <th align="center" colSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>OE</th>
                                            <th align="center" colSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.price-offered")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>Quote</th>
                                        </tr>
                                        <tr>
                                            <th>Qty</th>
                                            <th>{t("evaluation:label.unit-price")}</th>
                                            <th>Qty</th>
                                            <th>{t("evaluation:label.unit-price")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row m-t-20">
                        <div className="col-sm-8">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th> {t("evaluation:label.vendor-number")} </th>
                                            <th> {t("evaluation:label.vendor-name")} </th>
                                            <th> {t("evaluation:label.price-offered")} </th>
                                            {props.metode_evaluasi === "sistem_nilai" && <th> {t("evaluation:label.value-commercial")} </th> }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows_item}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Items);
