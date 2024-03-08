import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';



const RekapNegoisasiPaket = (props) => {
    // const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = props.data.map(function (data_pr, index_pr) {
            let total_awarding = 0
            let array_item = data_pr.item
            array_item.map(function(d, index) {
                total_awarding += d.vendor_list.length;
                return true
            })
            return (
                array_item.map(function(data_item, index_item) {
                    let array_award = data_item.vendor_list
                    let total_awarding2 = array_award.length
                    return (
                        array_award.map(function (data_award, index_award) {
                            return (
                                <tr key={index_item + '/' + index_award}>
                                    {index_item === 0 && index_award === 0 && 
                                        <td rowSpan={total_awarding} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{data_pr.pr_number}</td>
                                    }
                                    {/* {index_item === 0 && index_award === 0 && 
                                        <td rowSpan={total_awarding} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>
                                            <input disabled={props.user_uuid === props.created_by ? (props.status === 'd' || props.status === 'r' ? false : true) : true} type="checkbox" checked={props.retender.items_selected.includes(data_pr.pr_number)} onChange={(e) => props.handleChecklistRetenderPaket(e, data_pr, data_pr.pr_number)} />
                                        </td>
                                    } */}
                                    {index_award === 0 && 
                                        <td rowSpan={total_awarding2} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{data_item.pr_item_description}</td>
                                    }
                                    {index_award === 0 && 
                                        <td rowSpan={total_awarding2} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{data_item.pr_item_number}</td>
                                    }
                                    <td align="right">{data_award.ranking}</td>
                                    <td>{data_award.vendor_name}</td>
                                    <td>{data_award.currency}</td>
                                    <td align="right">{formatNumber( (data_award.harga_awal!==null )? (data_award.harga_awal.replace(",", "."))  : 0, 2)}</td>
                                    <td align="right">{data_award.qty_awal}</td>
                                    <td align="right">{formatNumber( (data_award.total_awal!==null )? (data_award.total_awal.replace(",", "."))  : 0, 2)}</td>
                                    <td align="right">{data_award.delivery_time_awal}</td>

                                    <td>{data_award.currency}</td>
                                    <td align="right">{formatNumber( (data_award.harga_akhir!==null )? (data_award.harga_akhir.toString().replace(",", "."))  : 0, 2)}</td>
                                    <td align="right">{data_award.qty_akhir}</td>
                                    <td align="right">{formatNumber( (data_award.total_akhir!==null )? (data_award.total_akhir.toString().replace(",", "."))  : 0, 2)}</td>
                                    <td align="right">{data_award.delivery_time_akhir}</td>
                                    <td align="right">{formatNumber( (data_award.selisih_oe !==null )? (data_award.selisih_oe.replace(",", "."))  : 0, 2)}</td>
                                    <td align="right">{formatNumber( (data_award.selisih_harga_total !==null )? (data_award.selisih_harga_total.replace(",", "."))  : 0, 2)}</td>
                                    <td>
                                        {data_award.quote === 'deviate' ?
                                            <a href="/" onClick={(e) => details(e, data_award)}>{data_award.quote}</a> :
                                            data_award.quote
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    )
                })
            )
        })
    }

    const details = (e, data) => {
		props.modals(data)
        e.preventDefault()
	}
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Rekap Negosiasi</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th colSpan="4" style={{textAlign: 'center'}}>Harga Tender</th>
                                            {/* <th colSpan="2"></th> */}
                                            <th></th>
                                            <th colSpan="5" style={{textAlign: 'center'}}>Harga Penawaran Awal</th>
                                            <th colSpan="8" style={{textAlign: 'center'}}>Harga Akhir</th>
                                        </tr>
                                        <tr>
                                            <th>No PR</th>
                                            {/* <th>Re-Tender</th> */}
                                            <th>Short Text</th>
                                            <th>PR Item</th>
                                            <th>Rank</th>
                                            <th>Vendor</th>
                                            <th>Curr</th>
                                            <th>Harga Satuan Awal</th>
                                            <th>Qty</th>
                                            <th>Harga Total</th>
                                            <th>Dlv. Time</th>
                                            <th>Curr</th>
                                            <th>Harga Nego</th>
                                            <th>Qty</th>
                                            <th>Nego Total</th>
                                            <th>Dlv. Time</th>
                                            <th>Selisih OE (%)</th>
                                            <th>Selisih Harga Awal (%)</th>
                                            <th>Quote</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                        {props.errors.winner && <p className='text-danger'>{props.errors.winner[0]}</p>}
                        {props.errors.retender && <p className='text-danger'>{props.errors.retender[0]}</p>}
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(RekapNegoisasiPaket);
