import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';
// const animatedComponents = makeAnimated();



const PesertaAuction = (props) => {
    const { t } = props;
    // const { register, control } = useFormContext();
    let rows;
    // let sumTotal = 0;

    if (props.data?.length > 0 && props.header?.order_placement === "paket") {
        rows = props.data?.map((dt, i) => {
            // sumTotal += dt.total_price;
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.vendor_id}</td>
                    <td>{dt.vendor_name}</td>
                    <td>{dt.status}</td>
                    <td>{dt.is_freeze==="y" ? "Freeze" : "UnFreeze"}</td>
                    <td>
                        {/* <button type="button" disabled={(props.header?.status!=='n') ? true : false} className="btn btn-sm btn-white m-r-5">Ban</button>
                        <button type="button" disabled={(props.header?.status!=='n') ? true : false} className="btn btn-sm btn-white m-r-5">Freeze</button>
                        <button type="button" disabled={(props.header?.status!=='n') ? true : false} className="btn btn-sm btn-white m-r-5">History</button> */}
                    </td>
                </tr>
            )
        })
    } else if (props.data?.length === 0 && props.header?.order_placement === "paket") {
        rows = (<RowEmpty colSpan='6'>  {t("auction:table.row-empty")} </RowEmpty>);
    }

    if (props.data?.length > 0 && props.header?.order_placement === "itemize") {
        rows = props.data?.map((dt, i) => {
            let child = dt['vendor'].map((element, j) => {
                return (
                    <tr key={j+""+i}>
                        <td>{j + 1}</td>
                        <td>{element['vendor_id']}</td>
                        <td>{element['vendor_name']}</td>
                        <td style={{ textAlign: "right" }} >{formatNumber(element['score_teknis'], 2)}</td>
                        <td style={{ textAlign: "right" }} >{formatNumber(element['score_komersil'], 2)}</td>
                        <td style={{ textAlign: "right" }} >{formatNumber(parseFloat(element['score_teknis']) + parseFloat(element['score_komersil']), 2)}</td>
                        <td style={{ textAlign: "right" }} >{formatNumber(element['price'], 2)}</td>
                        <td>
                            <button className="btn btn-white btn-xs" type="button" onClick={() => alert('history note ready')}> History </button>
                        </td>
                    </tr>
                )
            })
            return (
                <div className="row table-responsive m-t-10" key={i}>
                    <table className="table table-bordered table-striped table-sm" key={i}>
                        <thead>
                            <tr>
                                <th rowSpan="3" align="center">{parseInt(dt['material_no'])}</th>
                                <th rowSpan="3" align="center">{dt['number_pr']}</th>
                                <th rowSpan="3" align="center" style={{ width: "30%" }} >{dt['short_text']}</th>
                                <th>QTY</th>
                                <th colSpan="4" align="right" style={{ textAlign: "right" }}>{dt['qty']}</th>
                            </tr>
                            <tr>

                                <th>{t("auction:label.unit-price")}</th>
                                <th colSpan="4" align="right" style={{ textAlign: "right" }}>{formatNumber(dt['valuation_price'])}</th>
                            </tr>
                            <tr>
                                <th>{t("auction:label.total-price")}</th>
                                <th colSpan="4" align="right" style={{ textAlign: "right" }}>{formatNumber(dt['valuation_price'] * dt['qty'])}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>No</td>
                                <td>{t("auction:label.vendor-id")}</td>
                                <td>{t("auction:label.vendor-name")}</td>
                                <td>Score Teknis</td>
                                <td>Score Komersil</td>
                                <td>{t("auction:label.total-price")}</td>
                                <td>{t("auction:label.unit-price")}</td>
                                <td>{t("auction:label.action")}</td>
                            </tr>
                            {child}
                        </tbody>
                    </table>
                </div>
            )
        })
    }

    if(props.header?.source==="free"){
        rows = props.tempVendorSelections?.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.vendor_id}</td>
                    <td>{dt.vendor_name}</td>
                    {props.header?.price_calculation==="harga_satuan" && <td align="right">{formatNumber(dt.total, 2)}</td> }
                    {/* <th align="right">{formatNumber(dt.total_price, 2)}</th> */}
                    <td align="center">
                        {dt.status!==undefined && 
                            <div>
                                {!(props.header.auction_type==="forward_auction" &&  props.header.price_calculation==="diskon") && 
                                <button type="button" 
                                    className="btn btn-xs btn-white m-r-5"
                                    onClick={()=>props.toggleOpenModalInitialBid(dt.vendor_id)}
                                    disabled={props.loadings.loading_peserta_auction }
                                >
                                    {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                                    Initial Bid
                                </button>
                                }
                                <button type="button" 
                                    className="btn btn-xs btn-danger m-r-5" 
                                    onClick={(e)=>props.toggleConfirmFreeze(e,dt.uuid)}
                                    disabled={props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false)}
                                >
                                    {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                                    {t("auction:button.delete")}
                                </button>
                            </div>
                        }
                    </td>
                    {/* <td>{dt.status}</td>
                    <td>{dt.is_freeze==="y" ? "Freeze" : "UnFreeze"}</td>
                    <td>
                        {dt.status!==undefined &&
                        <div>
                        <button type="button" className="btn btn-xs btn-white m-r-5">Ban</button>
                        <button type="button" className="btn btn-xs btn-white m-r-5">Freeze</button>
                        <button type="button" className="btn btn-xs btn-white m-r-5">History</button>
                        </div>
                        }
                    </td> */}
                </tr>
            )
        })
    } else if (props.data?.length === 0 && props.header?.source==="free" ) {
        rows = (<RowEmpty colSpan='6'> {t("auction:table.empty-row")} </RowEmpty>);
    }
    
    return (
        <div>
            {props.header?.source==="free" &&
            <Panel>
                <PanelHeader>
                    {t("auction:panel.vendor-auction")}
                </PanelHeader>
                <PanelBody>
                    <div className="row">
                    {/* {props.header?.source==="eproc" &&
                        <div className="col-sm-12">
                            {props.header?.order_placement === "paket" &&
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No Peserta</th>
                                                <th>Nama Peserta</th>
                                                <th>Status</th>
                                                <th>Freeze State</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            }
                            {props.header?.order_placement === "itemize" &&
                                <div>
                                    {rows}
                                </div>
                            }
                        </div>
                    } */}
                    {props.header?.source==="free" &&
                        <div className="col-sm-12">
                             <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>{t("auction:label.vendor-id")}</th>
                                                <th>{t("auction:label.vendor-name")}</th>
                                                {props.header?.price_calculation==="harga_satuan" && <th>Total</th> }
                                                {/* <th>{t("auction:label.total-price")}</th> */}
                                                <th align="center">{t("auction:label.action")}</th>
                                                {/* <th>Status</th>
                                                <th>Freeze State</th>
                                                <th>Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                        </div>
                    }
                    </div>
                    <div className="row pull-right">
                    {(props.access.C || props.access.U) &&
                        <button
                            type="submit"
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false)}
                        >
                            {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                            {t("auction:button.save-draft")}</button>
                    }
                        <button
                            type="button"
                            className="btn btn-white m-r-5"
                            onClick={() => props.toAuctionList()}
                            disabled={props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false)}
                        >
                            {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                            {t("auction:button.cancel")}
                    </button>
                    </div>
                </PanelBody>
            </Panel>
        }
        </div>
    );
}

export default withTranslation()(PesertaAuction);
