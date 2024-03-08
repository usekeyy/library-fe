import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';
// const animatedComponents = makeAnimated();



const ItemsAuction = (props) => {
    const { t } = props;
    // const { register, control } = useFormContext();
    let rows;
    let sumTotal = 0;

    if (props.header?.source === "eproc") {
        if (props.data?.length > 0) {
            rows = props.data?.map((dt, i) => {
                sumTotal += parseFloat(dt.total_price)
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{dt.number_pr}</td>
                        <td>{dt.item_no}</td>
                        <td>{(dt.material_id==="" || dt.material_id === null || dt.material_id === undefined) ?  "" :  parseInt(dt.material_id) }</td>
                        <td>{dt.short_text}</td>
                        <td align="right">{formatNumber(dt.qty, 2)}</td>
                        <td>{dt.uom}</td>
                        <td>{dt.currency}</td>
                        <td align="right"> {formatNumber(dt.valuation_price, 2)} </td>
                        <td align="right">{formatNumber(dt.total_price, 2)}</td>
                        <td>
                            {props.access.U &&
                                <button className="btn btn-sm btn-white"
                                 type="button" onClick={() => props.openModals(i)}
                                 >
                                     {t("auction:button.edit")}
                        </button>
                            }
                        </td>
                    </tr>
                )
            })

            rows.push(
                <tr key={props.data?.length + 1}>
                    <td colSpan="9">Total</td>
                    <td align="right">{formatNumber(sumTotal, 2)}</td>
                    <td></td>
                </tr>
            )
        } else {
            rows = (<RowEmpty colSpan='11'>  {t("auction:table.empty-row")} </RowEmpty>);
        }
    }


    if (props.header?.source === "free") {
        if (props.data?.length > 0) {
            rows = props.data?.map((dt, i) => {
                let total =  parseFloat(dt.valuation_price*dt.qty)
                sumTotal += total
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{dt.short_text}</td>
                        <td align="right">{formatNumber(dt.qty, 2)}</td>
                        <td>{dt.uom}</td>
                        <td>{dt.currency}</td>
                        <td align="right">{formatNumber(dt.valuation_price,2)}</td>
                        <td align="right">{formatNumber(total, 2)}</td>
                        <td>
                            {/* {props.access.U &&
                               
                            } */}
                             <button className="btn btn-xs btn-warning m-r-5" type="button" 
                             onClick={()=> props.editModalFreeAuction(i)}
                             >
                                    <i className="fa fa-edit"></i>
                                </button>
                            {/* {props.access.D &&
                               
                            } */}
                             <button type="button" 
                                className="btn btn-xs  btn-danger"  
                                disabled={(props.header?.status!=='n') ? true : false}
                                onClick={(e)=> props.toggleConfirm(e,dt.uuid_item)}>
                                    <i className="fa fa-trash"></i>
                                </button>
                        </td>
                    </tr>
                )
            })

            rows.push(
                <tr key={props.data?.length + 1}>
                    <td colSpan="6">Total</td>
                    <td align="right">{formatNumber(sumTotal, 2)}</td>
                    <td></td>
                </tr>
            )
        } else {
            rows = (<RowEmpty colSpan='8'> {t("auction:table.empty-row")}  </RowEmpty>);
        }
    }

    return (
        <div>
            <Panel>
                <PanelHeader>
                    Detail Auction
                </PanelHeader>

                {props.header?.source === "eproc" &&
                    <PanelBody>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No PR</th>
                                                <th>Line Item</th>
                                                <th>No Item</th>
                                                <th>{t("auction:label.description")}</th>
                                                <th>Qty</th>
                                                <th>Uom</th>
                                                <th>Curr</th>
                                                <th>Oe</th>
                                                <th>Total</th>
                                                <th>{t("auction:label.action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row pull-right">
                            {/* {props.access.C && 
                        <button
                            type="submit"
                            className="btn btn-success m-r-5"
                            >Save Draft</button>
                        } */}
                            <button
                                type="button"
                                className="btn btn-white m-r-5"
                                onClick={() => props.toAuctionList()}
                                disabled={(props.header?.status!=='n') ? true : false}
                            >
                                {t("auction:button.cancel")}
                    </button>
                        </div>
                    </PanelBody>
                }

                {props.header?.source === "free" &&
                    <PanelBody>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>{t("auction:label.description")}</th>
                                                <th>Qty</th>
                                                <th>UOM</th>
                                                <th>Curr</th>
                                                <th>OE</th>
                                                <th>Total</th>
                                                <th>{t("auction:label.action")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <button 
                                    className="btn btn-white pull-right" 
                                    type="button"
                                    onClick={()=> props.openModalFreeAuction()}
                                    disabled={(props.header?.status!=='n') ? true : false}
                                >
                                    <i className="fa fa-plus">{t("auction:button.add")}</i>
                                </button>                                
                            </div>
                        </div>
                        <div className="row pull-right m-t-10">
                            {props.access.C && 
                            <button
                                type="submit"
                                className="btn btn-success m-r-5"
                                disabled={props.loadings.loading_update_detail_auction || ((props.header?.status!=='n') ? true : false)}
                                >
                                    {props.loadings.loading_update_detail_auction && <i className="fa fa-spinner fa-spin"></i> } 
                                    {t("auction:button.save-draft")}
                                </button>
                            }
                            <button
                                type="button"
                                className="btn btn-white m-r-5"
                                onClick={() => props.toAuctionList()}
                            >
                                {t("auction:button.cancel")}
                    </button>
                        </div>
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(ItemsAuction);
