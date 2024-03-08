import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { statusRejectBid } from '../../../../../helpers/statusName';


const HistoryAuction = (props) => {
    // const { t } = props;
    let rows ;
    let arr = []
    arr.push(props.data)
    if (arr.length > 0) {
        rows = arr.map((row, i) => {
            // let peserta = [];
            return (
                <div className="row" key={i}>
                    <div className="table-responsive m-t-10">
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>No</th>
                                    <th style={{ width: "30%", fontWeight:"bold" }}>Description</th>
                                    <th style={{fontWeight:"bold"}}>Currency</th>
                                    <th style={{fontWeight:"bold"}}>Kuantitas</th>
                                    <th style={{fontWeight:"bold"}}>Unit Price</th>
                                    <th style={{fontWeight:"bold"}}>Total Price</th>
                                    <th style={{fontWeight:"bold"}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{row['short_text']}</td>
                                    <td>{row['currency']}</td>
                                    <td align="right">{formatNumber(row['qty'], 2)}</td>
                                    <td align="right">{formatNumber(parseFloat(row['unit_cost'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                    <td align="right">{formatNumber(parseFloat(row['total_cost'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                    <td></td>
                                </tr>

                                <tr style={{ backgroundColor: "grey" , fontWeight:"bold"}}>
                                    <td colSpan="2">Date</td>
                                    <td>Vendor</td>
                                    <td>Kuantitas</td>
                                    <td>Unit Price</td>
                                    <td>Total Price</td>
                                    <td></td>
                                </tr>
                                {
                                    row['history_bid']?.map((element, j) => {
                                        return (
                                            <tr key={j}>
                                                <td colSpan="2">{formatDate(element['created_at'], true, true)}</td>
                                                <td>{element['vendor_name']}</td>
                                                <td align="right">{formatNumber(element['qty'], 2)}</td>
                                                <td align="right">{formatNumber(parseFloat(element['unit_price'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                                <td align="right">{formatNumber(parseFloat(element['total'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                                <td align="center">
                                                    <label style={{color: (element['status']==="r") ? "red" : "black", fontWeight:"bold"}}>
                                                        {statusRejectBid(element['status'])}
                                                    </label>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        })
    }

    console.log(arr)

    return (
        <div>
            <Panel className="m-t-5">
                <PanelHeader>History Auction</PanelHeader>
                <PanelBody>
                    <div className="row">
                        <div className="col-sm-12">
                            <button 
                                className="btn btn-sm btn-white pull-right" 
                                type="button" 
                                disabled={props.loadings.loading_download_history_auction}
                                onClick={()=>props.downloadHistoryVendorAuction()}>
                                    {props.loadings.loading_download_history_auction && <i className="fa fa-spinner fa-spin"></i>}
                                    PDF
                            </button>
                        </div>
                    </div>
                    {rows}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(HistoryAuction);
