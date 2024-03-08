import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';

const BidCommersil = (props) => {
    const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    {/* <td>{props.bid_comersil===null? '*****' :props.data[key]['vendor_id']}</td>
                    <td>{props.bid_comersil===null? '*****' :props.data[key]['vendor_name']}</td>
                    <td align="right">{props.bid_comersil===null? '*****' :formatNumber(props.data[key]['harga_penawaran'],2)}</td> */}
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    <td align="right">{props.bid_comersil===null? '*****' :formatNumber(props.data[key]['harga_penawaran'],2)}</td>
                    <td>{props.data[key]['quote']}</td>
                    <td>{(props.bid_comersil===null || props.data[key]['quote']==="no quote")? '' : <button className="btn btn-xs btn-info" onClick={(e)=>props.detail(e,props.data[key]['vendor_id'],props.data[key]['vendor_name'])}><i className="fa fa-info"></i> Detail</button>}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Bid Commercial</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("bidOpening:label.vendor-number")}</th>
                                            <th>{t("bidOpening:label.vendor-name")}</th>
                                            <th>{t("bidOpening:label.nego")}</th>
                                            <th>Quote</th>
                                            <th>Action</th>
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

export default withTranslation()(BidCommersil);
