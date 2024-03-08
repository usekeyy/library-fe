import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';



const ItemsRetender = (props) => {
    // const { t } = props;  
    let rows;
    // let Total=0;

    // const details = (e, data) => {
	// 	// props.modals(data)
    //     e.preventDefault()
	// }

    if (props.data !== undefined) {
        let index = 0
        rows = props.data.map(function (data_pr, index_pr) {
            let array_item = data_pr.item
            return (
                array_item.map(function(data_item, index_item) {
                    if(data_item.is_retender === 'y') {
                        return (
                            <tr key={index_pr+'-'+index_item}>
                                <td>{index+1}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >{data_item.pr_number}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} }  align="right">{parseInt(data_item.pr_item_number)}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >{data_item.no_material !== null && data_item.no_material !== '' ? parseInt(data_item.no_material) : ''}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >{data_item.pr_item_description}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >{data_item.vendor_list[0]['pr_qty']}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >{data_item.pr_uom}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} }  align="right">{ formatNumber(((parseFloat(data_item.vendor_list[0]['pr_price'].toString().replace(',','.'))*parseFloat(data_item.vendor_list[0]['pr_qty'].toString().replace(',','.'))) / parseFloat(data_item.vendor_list[0]['pr_per'].toString().replace(',','.'))),2)}</td>
                                <td style={(data_item.is_retender_itemize==="p") ? {color:'white', backgroundColor:'red', textDecoration:'bold'}:(data_item.is_retender_itemize==='x') ? {color:'red'}:{} } >
                                    {props.status === 'd' || props.status === 'r' ?
                                        <input className={"form-control"} name="remark" onChange={e => onChange(e.target.value, data_pr.pr_number+'-'+data_item.pr_item_number)} defaultValue={data_item.remark || '' } /> :
                                        data_item.remark
                                    }
                                </td>
                            </tr>
                        )
                    }
                    else {
                        return true
                    }
                })
            )
        });
    }

    const onChange = (value, id) => {
        props.onInputChangeRemark(value, id)
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Item Retender</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No PR</th>
                                            <th>No Item</th>
                                            <th>No Material</th>
                                            <th>Short Text</th>
                                            <th>Qty</th>
                                            <th>UOM</th>
                                            <th>OE</th>
                                            <th>Remark</th>
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

export default withTranslation()(ItemsRetender);
