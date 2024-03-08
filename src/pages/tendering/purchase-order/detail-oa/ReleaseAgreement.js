import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {formatNumber} from '../../../../helpers/formatNumber';
import moment from 'moment';

const ReleaseAgreement = (props) => {
    const { t } = props;  
    let rows;

    if (props.data.release_order !== undefined && props.data.release_order.length !== 0) {
        let total_qty = 0
        let total_value = 0
        rows = Object.keys(props.data.release_order).map(function (key, index) {
            total_qty += parseInt(props.data.release_order[key]['qty_po'])
            total_value += parseInt(props.data.release_order[key]['total_value'])
            return (
                <tr key={key}>
                    <td>{props.data.release_order[key]['nomor_po']}</td>
                    <td>{props.data.release_order[key]['item_po']}</td>
                    <td>{moment(props.data.release_order[key]['po_date']).format("DD-MM-YYYY")}</td>
                    <td align="right">{props.data.release_order[key]['qty_po']}</td>
                    <td>{props.data.release_order[key]['uom']}</td>
                    <td align="right">{formatNumber(props.data.release_order[key]['total_value'], 2)}</td>
                    <td>{props.data.release_order[key]['currency']}</td>
                </tr>
            )
        });
        let qty_oa = parseInt(props.data.qty_oa)
        let qty_sisa = (qty_oa - total_qty) >= 0 ? qty_oa - total_qty : 0
        for (var i = 0; i < 3; i++) {
            if (i === 0) {
                rows.push(
                    <tr key={'additioonal-'+i} style={{backgroundColor: "yellow"}}>
                        <td colSpan="3">Qty Released to Date</td>
                        <td align="right">{total_qty}</td>
                        <td>{props.data.release_order[0]['uom']}</td>
                        <td rowSpan="3" align="right"><b>{formatNumber(total_value, 2)}</b></td>
                        <td rowSpan="3">{props.data.release_order[0]['currency']}</td>
                    </tr>
                )
            }
            else if (i === 1) {
                rows.push(
                    <tr key={'additioonal-'+i} style={{backgroundColor: "yellow"}}>
                        <td colSpan="3">Target Qty</td>
                        <td align="right">{qty_oa}</td>
                        <td>{props.data.release_order[0]['uom']}</td>
                    </tr>
                )
            }
            else if (i === 2) {
                rows.push(
                    <tr key={'additioonal-'+i} style={{backgroundColor: "yellow"}}>
                        <td colSpan="3">Open Target Qty</td>
                        <td align="right">{qty_sisa}</td>
                        <td>{props.data.release_order[0]['uom']}</td>
                    </tr>
                )
            }
        }
    }else{
        rows =[]
        rows.push(
            <tr key="1000">
                <td colSpan="7" style={{textAlign:"center"}}>{t("common:Tabel.empty-row")}</td>
            </tr>
        )
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Release Order</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No PO</th>
                                                <th>Item</th>
                                                <th>Order Date</th>
                                                <th>Order Qty</th>
                                                <th>UOM</th>
                                                <th>PO Value</th>
                                                <th>Currency</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ReleaseAgreement);
