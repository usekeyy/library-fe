import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';
import moment from 'moment';



const Items = (props) => {
    // const { t } = props;
    let rows;

    if (props.data.items !== undefined) {
        let items = props.data.items
        rows = Object.keys(items).map(function (key, index) {
            if (items[key]['service_line'] !== undefined) {
                let data_s = []
                data_s.push(items[key])
                items[key]['service_line'].forEach(element => {
                    data_s.push(element)
                })
                
                if (props.data.tipe === 'oa') {
                    return (
                        data_s.map(function(data_service, index_service) {
                            if (index_service === 0) {
                                return (
                                    <tr key={key}>
                                        <td>{index+1}</td>
                                        <td>{items[key]['purchasing_requisition_number']}</td>
                                        <td>{parseInt(items[key]['item_no'])}</td>
                                        <td>{props.data.no_oa}</td>
                                        <td>{parseInt(items[key]['item_oa'])}</td>
                                        {/* <td>{parseInt(items[key]['material_id'])}</td> */}
                                        <td colSpan={2}>{items[key]['description']}</td>
                                        {/* <td>{items[key]['description']}</td> */}
                                        <td>{items[key]['spesifikasi']}</td>
                                        <td align="right">{items[key]['qty']}</td>
                                        <td align="right">{items[key]['qty_oa']}</td>
                                        <td align="right">{items[key]['qty_used']}</td>
                                        <td align="right">{items[key]['qty_open']}</td>
                                        <td>{items[key]['uom']}</td>
                                        <td>{items[key]['currency']}</td>
                                        <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                                        <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td>
                                        <td align="right">{formatNumber(items[key]['total'],2)}</td>
                                        <td>{items[key]['delivery_date'] !== null && items[key]['delivery_date'] !== '' ? moment(items[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                                        <td>{items[key]['status_progress']}</td>
                                        <td>{items[key]['tax']}</td>
                                        <td>{items[key]['note']}</td>
                                        <td>
                                            <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                                                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                                            </button>
                                        </td>
                                    </tr>
                                )    
                            }
                            else {
                                return (
                                    <tr key={key+'-'+index_service}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{parseInt(data_service['item_no'])}</td>
                                        <td></td>
                                        <td colSpan={2}>{data_service['description']}</td>
                                        <td align="right">{data_service['qty']}</td>
                                        <td align="right">{data_service['qty_oa']}</td>
                                        <td align="right">{data_service['qty_used']}</td>
                                        <td align="right">{data_service['qty_open']}</td>
                                        <td>{data_service['uom']}</td>
                                        <td>{data_service['currency']}</td>
                                        <td align="right" colSpan={2}>{formatNumber(data_service['harga_satuan'],2)}</td>
                                        <td align="right">{formatNumber(data_service['total'],2)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )    
                            }
                        })
                    )
                }
                else {
                    return (
                        data_s.map(function(data_service, index_service) {
                            if (index_service === 0) {
                                return (
                                    <tr key={key}>
                                        <td>{index+1}</td>
                                        <td>{items[key]['purchasing_requisition_number']}</td>
                                        <td>{parseInt(items[key]['item_no'])}</td>
                                        <td colSpan={2}>{items[key]['description']}</td>
                                        <td>{items[key]['spesifikasi']}</td>
                                        <td colSpan={5}></td>
                                        {/* <td>{items[key]['qty']}</td>
                                        <td>{items[key]['uom']}</td>
                                        <td>{items[key]['currency']}</td>
                                        <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                                        <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td> */}
                                        <td align="right">{formatNumber(items[key]['total'],2)}</td>
                                        <td>{items[key]['delivery_date'] !== null && items[key]['delivery_date'] !== '' ? moment(items[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                                        <td>{items[key]['status_progress']}</td>
                                        <td>{items[key]['tax']}</td>
                                        <td>{items[key]['note']}</td>
                                        <td>
                                            <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                                                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }
                            else {
                                return (
                                    <tr key={key+'-'+index_service}>
                                        <td></td>
                                        <td></td>
                                        <td>{parseInt(data_service['item_no'])}</td>
                                        <td></td>
                                        <td colSpan={2}>{data_service['description']}</td>
                                        <td align="right">{data_service['qty']}</td>
                                        <td>{data_service['uom']}</td>
                                        <td>{data_service['currency']}</td>
                                        <td align="right" colSpan={2}>{formatNumber(data_service['harga_satuan'],2)}</td>
                                        <td align="right">{formatNumber(data_service['total'],2)}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )
                            }
                        })
                    )
                }
            }
            else {
                if (props.data.tipe === 'oa') {
                    return (
                        <tr key={key}>
                            <td>{index+1}</td>
                            <td>{items[key]['purchasing_requisition_number']}</td>
                            <td>{parseInt(items[key]['item_no'])}</td>
                            <td>{props.data.no_oa}</td>
                            <td>{parseInt(items[key]['item_oa'])}</td>
                            <td>{items[key]['material_id'] !== null && items[key]['material_id'] !== '' ? parseInt(items[key]['material_id']) : ''}</td>
                            <td>{items[key]['description']}</td>
                            <td>{items[key]['spesifikasi']}</td>
                            <td align="right">{items[key]['qty']}</td>
                            <td align="right">{items[key]['qty_oa']}</td>
                            <td align="right">{items[key]['qty_used']}</td>
                            <td align="right">{items[key]['qty_open']}</td>
                            <td>{items[key]['uom']}</td>
                            <td>{items[key]['currency']}</td>
                            <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                            <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td>
                            <td align="right">{formatNumber(items[key]['total'],2)}</td>
                            <td>{items[key]['delivery_date'] !== null && items[key]['delivery_date'] !== '' ? moment(items[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                            <td>{items[key]['status_progress']}</td>
                            <td>{items[key]['tax']}</td>
                            <td>{items[key]['note']}</td>
                            <td>
                                <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                                    {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                                </button>
                            </td>
                        </tr>
                    )

                }
                else {
                    return (
                        <tr key={key}>
                            <td>{index+1}</td>
                            <td>{items[key]['purchasing_requisition_number']}</td>
                            <td>{parseInt(items[key]['item_no'])}</td>
                            <td>{items[key]['material_id'] !== null && items[key]['material_id'] !== '' ? parseInt(items[key]['material_id']) : ''}</td>
                            <td>{items[key]['description']}</td>
                            <td>{items[key]['spesifikasi']}</td>
                            <td align="right">{items[key]['qty']}</td>
                            <td>{items[key]['uom']}</td>
                            <td>{items[key]['currency']}</td>
                            <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                            <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td>
                            <td align="right">{formatNumber(items[key]['total'],2)}</td>
                            <td>{items[key]['delivery_date'] !== null && items[key]['delivery_date'] !== '' ? moment(items[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                            <td>{items[key]['status_progress']}</td>
                            <td>{items[key]['tax']}</td>
                            <td>{items[key]['note']}</td>
                            <td>
                                <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                                    {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                                </button>
                            </td>
                        </tr>
                    )
                }
            }
        });
    }

    const details = (e, data) => {
		props.modalItem(data)
        e.preventDefault()
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Item Terpilih</PanelHeader>
                <PanelBody >
                    {/* <div className="row">
                        <div className="col-sm-12">
                            {props.data.sap_number === null && props.data.status === 'c' &&
                                <button type="button" style={{marginBottom: "12px"}} className="btn btn-success" value={props.proposal_tender_uuid} onClick={(e) => modal_sap(e)}>Error SAP & Re-Sync</button>
                            }
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-wrap">
                                    <thead>
                                        {props.data.tipe === 'oa' ?
                                            <tr>
                                                <th>No</th>
                                                <th>No PR</th>
                                                <th>Item PR</th>
                                                <th>No OA</th>
                                                <th>Item OA</th>
                                                <th>No Material</th>
                                                <th>Description</th>
                                                <th>Spesifikasi</th>
                                                <th>QTY PR</th>
                                                <th>QTY OA</th>
                                                <th>QTY Used</th>
                                                <th>QTY Open</th>
                                                <th>Uom</th>
                                                <th>Curr</th>
                                                <th align="right">Harga Satuan</th>
                                                <th align="right">Additional Cost</th>
                                                <th>Total</th>
                                                <th>Delivery Date</th>
                                                <th>Status Progress</th>
                                                <th>Tax</th>
                                                <th>Note</th>
                                                <th>Action</th>
                                            </tr> :
                                            <tr>
                                                <th>No</th>
                                                <th>No PR</th>
                                                <th>No Item</th>
                                                <th>No Material</th>
                                                <th>Description</th>
                                                <th>Spesifikasi</th>
                                                <th>QTY</th>
                                                <th>Uom</th>
                                                <th>Curr</th>
                                                <th align="right">Harga Satuan</th>
                                                <th align="right">Additional Cost</th>
                                                <th>Total</th>
                                                <th>Delivery Date</th>
                                                <th>Status Progress</th>
                                                <th>Tax</th>
                                                <th>Note</th>
                                                <th>Action</th>
                                            </tr>
                                        }
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
