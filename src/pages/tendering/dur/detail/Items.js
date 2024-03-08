import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../helpers/formatNumber';

const Items = (props) => {
    const { t } = props;  
    let rows;
    let Total=0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            Total += props.data[key]['valuation_price']* (props.data[key]['qty']/props.data[key]['per'])
            return (
                <tr key={key}>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['number_pr']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['item_no']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{(props.data[key]['material_id']==="" || props.data[key]['material_id']=== null ) ?  "" : parseInt(props.data[key]['material_id'])}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['short_text']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['material_group_id']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['plant_id']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold', textAlign:'right'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red', textAlign:'right'}:{textAlign:'right'} }>{formatNumber(props.data[key]['qty'],2)}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['uom']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold', textAlign:'right'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red', textAlign:'right'}:{textAlign:'right'} }>{formatNumber(props.data[key]['per'],2)}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right">{formatNumber(props.data[key]['valuation_price'],2)}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right">{formatNumber(props.data[key]['valuation_price']* (props.data[key]['qty']/props.data[key]['per']),2)}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['currency']}</td>
                    <td>
                        <button className="btn btn-xs btn-lime" onClick={(e) => details(e,props.data[key]['pr_item_uuid'])} value={props.data[key]['pr_item_uuid']} ><i className="danger fa fa-eye"></i></button>
                    </td>
                </tr>
            )
        });

        rows.push(
			<tr key={Object.keys(props.data).length + 1}>
				<td colSpan="10">Total Harga</td>
				<td  align="right">{formatNumber(Total, 2)}</td>
				<td></td>
				<td></td>
			</tr>
		)
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='13'>Tidak ada data</RowEmpty>)
    }    

    const details = (e, data) => {
		props.modals(data)
        e.preventDefault()
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.item-selected")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No PR</th>
                                            <th>Line No</th>
                                            <th>No Material</th>
                                            <th>{t("dur:label.short-text")}</th>
                                            <th>Material Group</th>
                                            <th>Plant</th>
                                            <th>QTY</th>
                                            <th>Uom</th>
                                            <th>Per</th>
                                            <th align="right">{t("dur:label.unit-price")}</th>
                                            <th>Total</th>
                                            <th>{t("dur:label.currency")}</th>
                                            <th>{t("dur:label.action")}</th>
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
