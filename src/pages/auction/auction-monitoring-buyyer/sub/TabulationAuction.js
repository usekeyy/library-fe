import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';
import { formatNumber } from '../../../../helpers/formatNumber';

const TabulationAuction = (props) => {
    // const { t } = props;
    let rows = [];
		const denominimilisasi = props.parentState.data?.detail?.denominimilisasi;
    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined) {
        rows = props.data?.map((row, i) => {
            // let peserta = [];
						const price = (props.header.source==="eproc") ? row['valuation_price'] : row['unit_cost'];
						const totalPerItem =( price*(row['qty']))/denominimilisasi
            return (
                <div className="row" key={i}>
                    <div className="table-responsive m-t-10">
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>No</th>
                                    <th style={{ width: "30%", fontWeight:"bold" }}>Description</th>
                                    <th style={{fontWeight:"bold"}}>Currency</th>
                                    <th style={{fontWeight:"bold"}}>Quantity</th>
                                    <th style={{fontWeight:"bold"}}>Unit Price</th>
                                    <th style={{fontWeight:"bold"}}>Total Price</th>
                                    <th style={{fontWeight:"bold"}}>Ranking</th>
                                    {/* <th style={{fontWeight:"bold"}}>Freeze</th> */}
                                    <th style={{fontWeight:"bold"}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{row['short_text']}</td>
                                    <td>{row['currency']}</td>
                                    <td align="right">{formatNumber(row['qty'], 2)}</td>
                                    <td align="right">{formatNumber(price/denominimilisasi, 2)}</td>
                                    <td align="right">{formatNumber(totalPerItem, 2)}</td>
                                    <td></td>
                                    {/* <td></td> */}
                                    <td>
                                        <button className="btn btn-xs btn-white"
                                            onClick={()=>props.historyTabulationItems(row['item_id'])}
                                        >
                                            History
                                        </button>
                                    </td>
                                </tr>

                                <tr style={{ backgroundColor: "grey" , fontWeight:"bold"}}>
                                    <td colSpan="2">Submit Date</td>
                                    <td>Vendor</td>
                                    <td>Quantity</td>
                                    <td>Unit Price</td>
                                    <td>Total Price</td>
                                    <td></td>
                                    {/* <td></td> */}
                                    <td></td>
                                </tr>
                                {
                                    row['peserta']?.map((element, j) => {
                                        return (
                                            <tr key={j}>
                                                <td colSpan="2">{formatDate(element['date'], true, true)}</td>
                                                <td>{element['vendor_name']}</td>
                                                <td align="right">{formatNumber(element['qty'], 2)}</td>
                                                <td align="right">{formatNumber(parseFloat(element['unit_price'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                                <td align="right">{formatNumber(parseFloat(element['total'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                                                <td align="center">{element['ranking']}</td>
                                                {/* <td>{element['is_freeze']==="n" ? "UnFreeze" : "Freeze"}</td> */}
                                                <td>
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

    
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Tabulation Auction</PanelHeader>
                    <PanelBody>
                    {props.loadings.loading_tabulation_panel &&
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    }
                    {!props.loadings.loading_tabulation_panel &&
                        <div className="row">
                            <div className="col-sm-12">
                                <button className="btn btn-sm btn-white pull-right" disabled={props.loadings.loading_download_history_auction} type="button" onClick={()=>props.downloadHistoryChat()}>
                                {props.loadings.loading_download_history_auction && <i className="fa fa-spinner fa-spin"></i>}
                                        History Chat
                                </button>
                                <button className="btn btn-sm btn-white pull-right" disabled={props.loadings.loading_download_history_auction} type="button" onClick={()=>props.downloadHistoryVendorAuction()}>
                                {props.loadings.loading_download_history_auction && <i className="fa fa-spinner fa-spin"></i>}
                                        History Lelang
                                </button>
                            </div>
                        </div>
                    }
                    {!props.loadings.loading_tabulation_panel &&
                        rows
                    }
                        
                    </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(TabulationAuction);