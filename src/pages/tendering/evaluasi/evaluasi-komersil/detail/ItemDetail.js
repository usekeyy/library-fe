import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';

const ItemDetail = (props) => {
    const { t } = props;
    let rows;
    let Total = 0; let loop = 0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {            
            if (props.data[key]['tipe'] === "jasa") {
                let att=[];
                loop += key;
                att.push(<tr key={(loop)}>
                    <td>{props.data[key]['number_pr']}</td>
                    <td>{props.data[key]['item_no']}</td>
                    <td>{props.data[key]['spesifikasi']}</td>
                    <td>{props.data[key]['short_text']}</td>
                    <td>{props.data[key]['spesifikasi']}</td>
                    <td colSpan="6"></td>
                </tr>)
                props.data[key]['jasa_detail'].forEach((element, i) => {
                    Total += element['net_value'] * (element['qty'] / element['per'])
                    loop += key;
                    att.push(
                        <tr key={(loop)}>
                            <td></td>
                            <td>{element['item_no']}</td>
                            <td>{element['material_no']}</td>
                            <td>{element['short_text']}</td>
                            <td>{element['spesifikasi']}</td>
                            <td style={{textAlign : 'right'}}>{formatNumber(element['qty'],2)}</td>
                            <td>{element['uom']}</td>
                            <td>{element['per']}</td>
                            <td align="right">{formatNumber(element['net_value'], 2)}</td>
                            <td align="right">{formatNumber(element['net_value'] * (element['qty'] / element['per']), 2)}</td>
                            <td>{element['currency']}</td>
                        </tr>
                    )
                });
                return (
                    att
                )
            } else {
                Total += props.data[key]['valuation_price'] * (props.data[key]['qty'] / props.data[key]['per'])
                loop += key;
                return (
                    <tr key={(loop)}>
                        <td>{props.data[key]['number_pr']}</td>
                        <td>{props.data[key]['item_no']}</td>
                        <td>{(props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}</td>
                        <td>{props.data[key]['short_text']}</td>
                        <td>{props.data[key]['spesifikasi']}</td>
                        <td style={{textAlign : 'right'}}>{formatNumber(props.data[key]['qty'],2)}</td>
                        <td>{props.data[key]['uom']}</td>
                        <td>{props.data[key]['per']}</td>
                        <td align="right">{formatNumber(props.data[key]['valuation_price'], 2)}</td>
                        <td align="right">{formatNumber(props.data[key]['valuation_price'] * (props.data[key]['qty'] / props.data[key]['per']), 2)}</td>
                        <td>{props.data[key]['currency']}</td>

                    </tr>
                )
            }
        });
        
        rows.push(
            <tr key={Object.keys(props.data).length + 1}>
                <td colSpan="9" align="center">Total Harga Keseluruhan</td>
                <td align="right">{formatNumber(Total, 2)}</td>
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
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th align="center" >{t("evaluation:label.no-pr")}</th>
                                            <th align="center" >{t("evaluation:label.no-item")}</th>
                                            <th align="center" >{t("evaluation:label.no-material")}</th>
                                            <th align="center" style={{width:"15%"}}>{t("evaluation:label.short-text")}</th>
                                            <th align="center" style={{width:"20%"}}>{t("evaluation:label.specification")}</th>
                                            <th align="center" >Qty</th>
                                            <th align="center" >Uom</th>
                                            <th align="center" >Per</th>
                                            <th align="center" >{t("evaluation:label.unit-price")}</th>
                                            <th align="center" >Total</th>
                                            <th align="center" >{t("evaluation:label.currency")}</th>
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

export default withTranslation()(ItemDetail);
