import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';



const Items = (props) => {
    // const { t } = props;  
    let rows;
    let Total=0;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            if (props.data[key]['per'] === null || props.data[key]['per'] === 0)
            {
                props.data[key]['per'] = 1
            }
            Total += props.data[key]['pr_price']* (props.data[key]['pr_qty']/props.data[key]['pr_per'])
            return (
                <tr key={key}>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{index+1}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['pr_number']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right" >{parseInt(props.data[key]['pr_item_number'])}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['no_material'] !== null && props.data[key]['no_material'] !== '' ? parseInt(props.data[key]['no_material']) : ''}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['pr_item_description']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['spesifikasi_tender']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['pr_currency']}</td>
                    <td style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } >{props.data[key]['pr_uom']}</td>
                    <td  style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right">{props.data[key]['pr_per']}</td>
                    <td  style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right">{props.data[key]['pr_qty']}</td>
                    <td  style={(props.data[key]['is_retender_itemize']==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(props.data[key]['is_retender_itemize']==='x') ? {color:'red'}:{} } align="right">{formatNumber(props.data[key]['pr_price'],2)}</td>
                </tr>
            )
        });

        rows.push(
			<tr key={Object.keys(props.data).length + 1}>
				<td colSpan="10">Total Harga</td>
				<td  align="right">{formatNumber(Total, 2)}</td>
			</tr>
		)
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Item</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No PR</th>
                                            <th>Line No</th>
                                            <th>No Material</th>
                                            <th>Short Text</th>
                                            <th style={{width: "30%"}}>Spesifikasi</th>
                                            <th>Cur</th>
                                            <th>Uom</th>
                                            <th>Per</th>
                                            <th>Qty</th>
                                            <th>OE harga satuan</th>
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
