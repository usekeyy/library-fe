import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';

const Items = (props) => {
	const { register } = useForm({});
    const [inputPaste, setInputPaste] = React.useState(false);

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e, data_item, key, code, key2) => {
        let caret = e.target.selectionStart
        let element = e.target        
        let new_value = element.value
        let old_value = data_item[code]
        let decimal_length = 2
        if (code === 'qty') {
            decimal_length = 3
        }

        if (inputPaste) {
            new_value = formatNumber2(replaceAll(replaceAll(new_value, '.', ''), ',', '.'), decimal_length)
            if (caret < new_value.length) {
                caret += 1
            }
        }
        else {
            let return_calculate = calculateFormatCurrency(element.value, old_value, caret, decimal_length)
            caret = return_calculate.caret
            new_value = return_calculate.new_value
        }

        window.requestAnimationFrame(() => {
            element.selectionStart = caret
            element.selectionEnd = caret
        })

        if (code === 'qty') {
            if (parseFloat(replaceAll(replaceAll(new_value, '.', ''), ',', '.')) > parseFloat(data_item.qty_add_cost)) {
                new_value = formatNumber2(data_item.qty_add_cost, 3)
                if (parseFloat(old_value) === parseFloat(data_item.qty_add_cost)) {
                    caret = e.target.selectionStart - 1
                }
                else {
                    if (new_value.indexOf(',') === caret - 1) {
                        caret = e.target.selectionStart - 1
                    }
                }
            }
        }
        setInputPaste(false)
        if (data_item.jenis_item === "barang") {
            props.setOptionItem(new_value, code, key)
        }
        else {
            props.setOptionServiceLine(new_value, code, key, key2)
        }
    }

    function handleKeyPress(e, evt)
    {
        var key = evt.keyCode;

        // Left / Up / Right / Down Arrow, Backspace, Delete keys
        if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
            return;
        }
        else {
            if (evt.match(/[0-9]/)) {
                return
            }
            else {
                e.preventDefault()
            }
        }
    }   

    let rows;
    if (props.data.items !== undefined) {
        let items = props.data.items
        if (items[0].jenis_item === "barang") {
            rows = Object.keys(items).map(function (key, index) {
                items[key]['amount'] = (parseFloat(items[key]['qty']) * parseFloat(items[key]['harga_satuan'])).toFixed(2)
                return (
                    <tr key={key}>
                        <td>
                            <input type="checkbox" checked={props.checklist.items_selected.includes(items[key]['po_item_id']) ? true : false} 
                                onChange={(e) => props.handleChecklist(e, items[key], items[key]['po_item_id'])} />
                        </td>
                        <td>{props.data['eproc_number']}</td>
                        <td>{props.data['sap_number']}</td>
                        <td>{items[key]['po_item_no']}</td>
                        {/* <td>{items[key]['acc_assignment_category_id']}</td>
                        <td>{items[key]['acc_assignment_category_number']}</td>
                        <td>{items[key]['gl_account']}</td> */}
                        <td>{parseInt(items[key]['material_id'])}</td>
                        <td>{items[key]['description']}</td>
                        <td>
                            {props.checklist.items_selected.includes(items[key]['po_item_id']) ? 
                                <div style={{width: '100px'}}>
                                    <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                        onChange={(e) => onChange(e, items[key], key, 'qty', '')} name={"qty["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['qty'], 3)}/>
                                </div> : formatNumber2(items[key]['qty'], 3)
                            }
                        </td>
                        {/* <td align="right">{formatNumber(items[key]['qty'], 2)}</td> */}
                        <td>{items[key]['uom']}</td>
                        <td align="right">{formatNumber2(parseFloat(items[key]['amount']), 2)}</td>
                        {/* <td align="right">{formatNumber2(items[key]['amount_in_lc'], 2)}</td> */}
                        <td>{items[key]['currency']}</td>
                        <td>{items[key]['plant']}</td>
                        {/* <td>{items[key]['sloc']}</td> */}
                        <td align="right">{formatNumber2(items[key]['total_add_cost'], 2)}</td>
                        <td align="right">{formatNumber2(items[key]['total_penalty'], 2)}</td>
                        <td>
                            {props.checklist.items_selected.includes(items[key]['po_item_id']) &&
                                <div style={{width: '120px'}}>
                                    <button className="btn btn-xs btn-white" onClick={(e) => props.modalAdditionalCost(e, items[key])}>Add. Cost</button>
                                    <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenalty(e, items[key])}>Penalty</button>
                                    <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenaltyAdditionalCost(e, items[key])}>Penalty Add. Cost</button>
                                </div>
                            }
                        </td>
                    </tr>
                )
            })
        }
        else {
            rows = Object.keys(items).map(function (key, index) {
                let data_s = []
                let total = 0
                data_s.push(items[key])
                if (items[key]['service_line'] !== undefined) {
                    items[key]['service_line'].forEach(element => {
                        total += parseFloat(element.total)
                        data_s.push(element)
                    })
                }
                return (
                    data_s.map(function(data_service, index_service) {
                        return (
                            <tr key={index_service === 0 ? key : key + '-' +index_service}>
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">
                                        <input type="checkbox" checked={props.checklist.items_selected.includes(items[key]['po_item_id']) ? true : false} 
                                            onChange={(e) => props.handleChecklist(e, items[key], items[key]['po_item_id'])} />
                                    </td>
                                }
                                {/* <td>{index_service === 0 && data_service['goods_receipt_number']}</td> */}
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{props.data['eproc_number']}</td>
                                }
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{props.data['eproc_number']}</td>
                                }
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{data_service['po_item_no']}</td>
                                }
                                {/* {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{items[key]['acc_assignment_category_id']}</td>
                                }
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{items[key]['acc_assignment_category_number']}</td>
                                }
                                {index_service === 0 &&
                                    <td rowSpan={data_s.length} style={{verticalAlign: "middle"}} align="center">{data_service['gl_account']}</td>
                                } */}
                                <td>{data_service[index_service === 0 ? 'short_text' : 'description']}</td>
                                <td>{index_service !== 0 && data_service['item_no']}</td>
                                {/* <td align="right">{formatNumber2(data_service['qty'], 3)}</td> */}
                                {index_service === 0 ? <td align="right" style={{paddingRight: "22px"}}>{formatNumber2(data_service['qty'], 3)}</td>:
                                    <td>
                                        {props.checklist.items_selected.includes(items[key]['po_item_id']) ? 
                                            <div style={{width: '100px'}}>
                                                <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                                    onChange={(e) => onChange(e, data_service, index_service-1, 'qty',  key)} name={"qty["+key+"]"} ref={register({ required: false })} value={formatNumber2(data_service['qty'], 3)}/>
                                            </div> : formatNumber2(data_service['qty'], 3)
                                        }
                                    </td>
                                }
                                <td>{data_service['uom']}</td>
                                <td align="right">{index_service === 0 ?  formatNumber2(total, 2) : formatNumber2(parseFloat(data_service['total']), 2)}</td>
                                <td>{data_service['currency']}</td>
                                <td align="right">{index_service === 0 && formatNumber2(data_service['total_penalty'], 2)}</td>
                                <td>{index_service === 0 &&
                                    (props.checklist.items_selected.includes(items[key]['po_item_id']) &&
                                        <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenalty(e, items[key])}>Penalty</button>
                                    )
                                }</td>
                            </tr>
                        )
                    })
                )
            })
        }
    }

    return (
        <div>
            {props.loadings.item && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loadings.item === false && props.data.items !== undefined && (
                <Row>
                    {props.data.items.length > 0 && 
                        <div className="col-sm-12" style={{overflowX: "auto"}}>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-wrap">
                                    <thead>
                                        {props.data.items[0].jenis_item === "barang" ? 
                                            <tr>
                                                <th>
                                                    <input type="checkbox" checked={props.checklist.isCheckAll} 
                                                        onChange={(e) => props.handleCheckAll(e, props.checklist.isCheckAll)} />
                                                </th>
                                                <th>No. PO (Eproc)</th>
                                                <th>No. PO (ERP)</th>
                                                <th>PO Item</th>
                                                {/* <th>Acc. Assg Category</th>
                                                <th>Acc. Assg</th>
                                                <th>GL. Account</th> */}
                                                <th>No. Material</th>
                                                <th>Material Desc.</th>
                                                <th>Qty</th>
                                                <th>UOM</th>
                                                <th>Amount</th>
                                                <th>Curr</th>
                                                <th>Plant</th>
                                                <th>Add Cost</th>
                                                <th>Penalty</th>
                                                <th>Action</th>
                                            </tr> : 
                                            <tr>
                                                <th>
                                                    <input type="checkbox" checked={props.checklist.isCheckAll} 
                                                        onChange={(e) => props.handleCheckAll(e, props.checklist.isCheckAll)} />
                                                </th>
                                                <th>No. PO (Eproc)</th>
                                                <th>No. PO (ERP)</th>
                                                <th>PO Item</th>
                                                {/* <th>Acc. Assg Category</th>
                                                <th>Acc. Assg</th>
                                                <th>GL. Account</th> */}
                                                <th>Service Line</th>
                                                <th>Line Item</th>
                                                <th>Qty</th>
                                                <th>UOM</th>
                                                {/* <th>Gross Price</th> */}
                                                <th>Net Value</th>
                                                <th>Curr</th>
                                                {/* <th>Plant</th> */}
                                                <th>Penalty</th>
                                                <th>Action</th>
                                            </tr>
                                        }
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    }
                </Row>
            )}
        </div>
    );
}

export default withTranslation()(Items);