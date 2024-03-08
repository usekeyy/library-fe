import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';

const Items = (props) => {
    const { t } = props;  
    let rows;
    let Total = 0; let TotalPenawaran=0; let loop = 0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            loop+=(key+1);
            if (props.data[key]['tipe'] === "jasa") {
                let att=[];
                att.push(<tr key={(loop)}>
                    <td>{props.data[key]['number_pr']}</td>
                    <td>{props.data[key]['item_no']}</td>
                    <td></td>
                    <td>{props.data[key]['short_text']}</td>
                    <td>{props.data[key]['spesifikasi']}</td>
                    <td colSpan="8"></td>
                </tr>)
                props.data[key]['jasa_detail'].forEach((element, i) => {
                    loop+=(i+1);
                    Total += element['net_value'] * (element['qty'] / element['per'])
                    TotalPenawaran += element['harga_penawaran'] * (element['qty_penawaran'] / element['per'])
                    att.push(
                        <tr key={(loop)}>
                            <td>{element['number_pr']}</td>
                            <td>{element['item_no']}</td>
                            <td>{(props.data[key]['material_no']===undefined || props.data[key]['material_no']==="" || props.data[key]['material_no']===null) ? "" : parseInt(props.data[key]['material_no'])}</td>
                            <td>{element['short_text']}</td>
                            <td>{element['spesifikasi']}</td>
                            <td>{element['currency']}</td>
                            <td>{element['uom']}</td>
                            <td>{element['per']}</td>
                            <td>{element['qty']}</td>
                            <td align="right">{formatNumber(element['net_value'], 2)}</td>
                            <td>{element['qty_penawaran']}</td>
                            <td align="right">{formatNumber(element['harga_penawaran'],2)}</td>
                            <td>
                            {props.data[key]['quote'] === 'deviate' && props.data[key]['quote']}
                            {/* {element['quote'] === 'deviate' && <a href="/" onClick={(e) => toggleDetailItem(e,element['purchasing_requisition_item_id'],element['purchasing_requisition_service_id'],"jasa")}>{element['quote']}</a>} */}
                            {element['quote'] !== 'deviate' && element['quote']}
                            </td>
                        </tr>
                    )
                });
                return (
                    att
                )
            } else {
                Total += props.data[key]['valuation_price']* (props.data[key]['qty']/props.data[key]['per'])
                TotalPenawaran += props.data[key]['harga_penawaran'] * (props.data[key]['qty_penawaran']/props.data[key]['per'])
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
                        <td>{props.data[key]['qty']}</td>
                        <td align="right">{formatNumber(props.data[key]['valuation_price'], 2)}</td>
                        <td>{props.data[key]['qty_penawaran']}</td>
                        <td align="right">{formatNumber(props.data[key]['harga_penawaran'], 2)}</td>
                        <td>
                            {props.data[key]['quote'] === 'deviate' && props.data[key]['quote']} 
                            {/* //<a href="/" onClick={(e) => toggleDetailItem(e,props.data[key]['item_no'],null,"barang")}>{props.data[key]['quote']}</a>} */}
                            {props.data[key]['quote'] !== 'deviate' && props.data[key]['quote']}
                        </td>
                    </tr>
                )
            }            
        });

        rows.push(
            <tr key={(loop + 1)}>
                <td colSpan="8" align="center">Total Harga Keseluruhan</td>
                <td align="right" colSpan="2">{formatNumber(Total, 2)}</td>
                <td align="right" colSpan="2">{formatNumber(TotalPenawaran, 2)}</td>
                <td></td>
            </tr>
        )
    }

    // const toggleDetailItem = (e, pr_item_id, pr_service_id,tipe) => {
    //     props.getEvaluasiTeknisCompare(pr_item_id, pr_service_id,tipe)
    //     e.preventDefault();
    // }

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
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>No PR</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>No Item</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>No Material</th>
                                            <th align="center" rowSpan="2" style={{width:"15%", textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.short-text")}</th>
                                            <th align="center" rowSpan="2" style={{width:"20%", textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.specification")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>{t("evaluation:label.currency")}</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>Uom</th>
                                            <th align="center" rowSpan="2" style={{textAlign:"center", verticalAlign:"middle"}}>Per</th>
                                            <th align="center" colSpan="2">OE</th>
                                            <th align="center" colSpan="2">{t("evaluation:label.price-offer")}</th>
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
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Items);
