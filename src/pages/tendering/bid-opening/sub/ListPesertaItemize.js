import React from 'react';
import { formatNumber } from '../../../../helpers/formatNumber';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const ListPesertaItemize = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            let baris=[];
            props.data[key]['list_vendor_komersil'].forEach((element, i) => {
                baris.push(
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{props.data[key]['list_vendor_komersil'][i]['vendor_id']}</td>
                    <td>{props.data[key]['list_vendor_komersil'][i]['vendor_name']}</td>
                    {props.metode_evaluasi ==="sistem_nilai" && <td align="right">{formatNumber(props.data[key]['list_vendor_komersil'][i]['harga_penawaran'])}</td>}
                    <td>{props.bid_comersil===null? '*****' : props.data[key]['list_vendor_komersil'][i]['quote']}</td>
                    <td>
                        {(props.bid_comersil===null || props.data[key]['quote']==="no quote")? ''  : <button className="btn btn-xs btn-info m-r-5" value={props.data[key]['list_vendor_komersil'][i]['vendor_id']} onClick={(e) => props.detail(e, props.data[key]['list_vendor_komersil'][i]['vendor_id'],  props.data[key]['list_vendor_komersil'][i]['vendor_name'],props.data[key]['pr_item_id'])} > <i className="fa fa-info"></i> Detail</button> }
                    </td>
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
                                            {props.data[key]['item_no']}
                                        </th>
                                        <th rowSpan="3" style={{ width: "30%", textAlign: "center", verticalAlign: "middle" }}>
                                            {props.data[key]['short_text']}
                                        </th>
                                        <td>
                                            qty
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td align="right">
                                                { props.data[key]['qty']}
                                            </td>
                                        }

                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td align="right" colSpan="2">
                                                { props.data[key]['qty']}
                                            </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td>
                                            Harga Satuan
                                        </td>
                                        {props.metode_evaluasi ==="sistem_gugur" &&
                                            <td align="right">
                                                { formatNumber(props.data[key]['valuation_price'], 2)}
                                            </td>
                                        }
                                        {props.metode_evaluasi ==="sistem_nilai" &&
                                            <td align="right" colSpan="2">
                                                { formatNumber(props.data[key]['valuation_price'], 2)}
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
                                        <th>Status</th>
                                        <th></th>
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
                <PanelHeader>Bid Commercial</PanelHeader>
                <PanelBody >
                    {rows}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPesertaItemize);
