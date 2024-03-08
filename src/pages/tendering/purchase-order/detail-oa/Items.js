import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';



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
                
                return (
                    data_s.map(function(data_service, index_service) {
                        if (index_service === 0) {
                            return (
                                <tr key={key}>
                                    <td>{index+1}</td>
                                    <td>{items[key]['purchasing_requisition_number']}</td>
                                    <td>{parseInt(items[key]['item_number'])}</td>
                                    <td>{items[key]['account_assignment']}</td>
                                    <td>{items[key]['item_category_code']}</td>
                                    <td>{items[key]['material_id'] !== null && items[key]['material_id'] !== '' ? parseInt(items[key]['material_id']) : ''}</td>
                                    <td>{items[key]['short_text']}</td>
                                    <td>{items[key]['plant_id']}</td>
                                    <td align="right">{items[key]['qty_oa']}</td>
                                    <td align="right">{items[key]['qty_used']}</td>
                                    <td align="right">{items[key]['qty_open']}</td>
                                    <td>{items[key]['uom']}</td>
                                    <td>{items[key]['currency']}</td>
                                    <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                                    <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td>
                                    <td align="right">{formatNumber(items[key]['total'],2)}</td>
                                    <td>{items[key]['tax']}</td>
                                    <td>
                                        <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                                            {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                                        </button>
                                        <button className="btn btn-xs btn-white" onClick={(e) => detailsReleaseAgreement(e,items[key])}> Rel. Ord</button>
                                    </td>
                                </tr>
                            )    
                        }
                        else {
                            return (
                                <tr key={key+'-'+index_service}>
                                    <td></td>
                                    <td></td>
                                    <td>{parseInt(data_service['item_number'])}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={2}>{data_service['short_text']}</td>
                                    <td align="right">{data_service['qty_oa']}</td>
                                    <td align="right">{data_service['qty_used']}</td>
                                    <td align="right">{data_service['qty_open']}</td>
                                    <td>{data_service['uom']}</td>
                                    <td>{data_service['currency']}</td>
                                    <td align="right" colSpan={2}>{formatNumber(data_service['price'], 2)}</td>
                                    <td align="right">{formatNumber(data_service['total'],2)}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )    
                        }
                    })
                )

            }


            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{items[key]['purchasing_requisition_number']}</td>
                    <td>{parseInt(items[key]['item_number'])}</td>
                    <td>{items[key]['account_assignment']}</td>
                    <td>{items[key]['item_category_code']}</td>
                    <td>{items[key]['material_id'] !== null && items[key]['material_id'] !== '' ? parseInt(items[key]['material_id']) : ''}</td>
                    <td>{items[key]['short_text']}</td>
                    <td>{items[key]['plant_id']}</td>
                    <td align="right">{items[key]['qty_oa']}</td>
                    <td align="right">{items[key]['qty_used']}</td>
                    <td align="right">{items[key]['qty_open']}</td>
                    <td>{items[key]['uom']}</td>
                    <td>{items[key]['currency']}</td>
                    <td align="right">{formatNumber(items[key]['harga_satuan'],2)}</td>
                    <td align="right">{formatNumber(items[key]['additional_cost'],2)}</td>
                    <td align="right">{formatNumber(items[key]['total'],2)}</td>
                    <td>{items[key]['tax']}</td>
                    <td>
                        <button className="btn btn-xs btn-white" onClick={(e) => details(e,items[key])}>
                            {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? "Edit" : "Detail" }
                        </button>
                        <button className="btn btn-xs btn-white" onClick={(e) => detailsReleaseAgreement(e,items[key])}> Rel. Ord</button>
                    </td>
                </tr>
            )
        });
    }

    const details = (e, data) => {
        // console.log(data)
		props.modalItem(data)
        e.preventDefault()
	}

    // const modal_sap = (e) => {
	// 	props.modal_sap()
    //     e.preventDefault()
	// }

    const detailsReleaseAgreement = (e, data) => {
        // console.log(data)
		props.modalReleaseAgreement(data)
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
                                <button type="button" style={{marginBottom: "12px"}} className="btn btn-light" value={props.proposal_tender_uuid} onClick={(e) => modal_sap(e)}>Error SAP & Re-Sync</button>
                            }
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-wrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No PR</th>
                                            <th>Item PR</th>
                                            {/* <th>No OA</th>
                                            <th>Item OA</th> */}
                                            <th>AA</th>
                                            <th>IC</th>
                                            <th>No Material</th>
                                            <th>Description</th>
                                            <th>Plant</th>
                                            {/* <th>Spesifikasi</th> */}
                                            {/* <th>QTY</th> */}
                                            <th>QTY OA</th>
                                            <th>QTY Used</th>
                                            <th>QTY Open</th>
                                            {/* <th>Sloc</th> */}
                                            <th>Uom</th>
                                            <th>Curr</th>
                                            <th align="right">Harga Satuan</th>
                                            <th align="right">Additional Cost</th>
                                            <th>Total</th>
                                            {/* <th>Dlv. Date</th> */}
                                            <th>Tax</th>
                                            {/* <th>Note</th> */}
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

export default withTranslation()(Items);
