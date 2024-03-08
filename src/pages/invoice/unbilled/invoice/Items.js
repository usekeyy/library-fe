import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import { Row } from 'reactstrap';
// import moment from 'moment';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Items = (props) => {
    const { t } = props;
	const { control, register } = useForm({});
    const [inputPaste, setInputPaste] = React.useState(false);

    const handleChangePPN = (payload, code, key) => {
        props.setOption(payload, code, key)
    }

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e, data_item, key, code) => {
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

        if (code === 'qty') {
            if (parseFloat(replaceAll(data_item.qty_awal, '.', ',')) < parseFloat(new_value)) {
                new_value = replaceAll(data_item.qty_awal, '.', ',')
                if (e.target.selectionStart > 0) {
                    caret = parseFloat(e.target.selectionStart) - 1
                }
            }
        }

        window.requestAnimationFrame(() => {
            element.selectionStart = caret
            element.selectionEnd = caret
        })
        setInputPaste(false)
        props.setOption(new_value, code, key)
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

    const paramPPN = (payload) => {
        let arr = {label: 'Tidak', value: 'n'}
        if (payload === 'y') {
            arr = {label: 'ya', value: 'y'}
        }
        return arr
    }

    // const { register,errors } = useFormContext();
    let rows;
    if (props.data.items !== undefined) {
        let items = props.data.items
        rows = Object.keys(items).map(function (key, index) {
            if (items[key]['category'] !== 'Additional Cost') {
                return (
                    <tr key={key}>
                        <td style={{verticalAlign: "middle"}}>{items[key]['goods_receipt_number']}</td>
                        {items[key].category === 'Barang' ?
                            <td style={{verticalAlign: "middle"}}>{items[key]['item_no']}</td> :
                            <td style={{verticalAlign: "middle"}}>{items[key]['line_no']}</td>
                        }
                        <td style={{verticalAlign: "middle"}}>{items[key]['po_eproc_number']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['po_sap_number']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['po_item_no']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['acc_assignment_category_id']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['acc_assignment_category_number']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['gl_account']}</td>
                        {items[key].category === 'Barang' &&
                            <td style={{verticalAlign: "middle"}}>{items[key]['material_no']}</td>
                        }
                        <td style={{verticalAlign: "middle"}}>{items[key]['short_text']}</td>
                        {/* <td align="right">{formatNumber2(items[key]['qty'], 2)}</td> */}
                        <td style={{verticalAlign: "middle"}} align="right">
                            <div style={{width: '80px'}}>
                                <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste}
                                    onChange={(e) => onChange(e, items[key], key, 'qty')} name={"qty["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['qty'], 3)}/>
                            </div>
                        </td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['uom']}</td>
                        <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(items[key]['net_value'], 3)}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['currency']}</td>
                        <td style={{verticalAlign: "middle"}}>{items[key]['plant']}</td>
                        <td style={{verticalAlign: "middle"}}>
                            <div style={{width:"100px"}}>
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select}
                                    control={control}
                                    options={props.param_option.m_ppn}
                                    onChange={([selected]) => {
                                        handleChangePPN(selected, 'ppn', key)
                                        return selected;
                                    }}
                                    inputRef={(e) => register({ name: "ppn["+key+"]", required: false })}
                                    name={"ppn["+key+"]"}
                                    defaultValue={ paramPPN(items[key]['with_ppn']) }
                                    placeholder={ t("common:Select.Pilih") + " PPN" }
                                    isDisabled={props.data.with_ppn === 'y' ? false : true}
                                    // isLoading={props.loadings.tax}
                                    rules={{ required: false }}
                                />
                            </div>
                        </td>
                    </tr>
                )
            }
            else {
                return true
            }
        });
    }

    // const onChange = (e) => {
    //     props.setOption(e.target.value, 'notes')
    // } 

    return (
        <div>
            {props.loadings.item && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loadings.item === false && (
                <Panel className="margin-bot-false">
                    <PanelHeader>Items</PanelHeader>
                    <PanelBody>
                        <Row>
                            <div className="col-sm-12" style={{overflowX: "auto"}}>
                                <div className="table-responsive" style={{overflow: "visible"}}>
                                    <table className="table table-bordered table-striped table-sm text-wrap">
                                        <thead>
                                            <tr>
                                                <th>No. GR/SA</th>
                                                <th>Line Item</th>
                                                <th>No. PO (Eproc)</th>
                                                <th>No. PO (SAP)</th>
                                                <th>PO Item</th>
                                                <th>Acc. Assg Category</th>
                                                <th>Acc. Assg</th>
                                                <th>GL. Account</th>
                                                {props.data.items !== undefined && props.data.items.some(d => d.category === 'Barang') &&
                                                    <th>No. Material</th>
                                                }
                                                <th>Material Desc./Service</th>
                                                <th>Qty</th>
                                                <th>UOM</th>
                                                <th>Amount</th>
                                                <th>Currency</th>
                                                <th>Plant</th>
                                                <th>PPN</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </Row>
                        {/* <Row>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Catatan</label>
                                    <div className="col-lg-12">
                                        <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChange(e)}/>
                                        {errors.note && <span className="text-danger">* This field is required</span>}
                                    </div>
                                </div>
                            </div>
                        </Row> */}
                    </PanelBody>
                </Panel>
            )}
        </div>
    );
}

export default withTranslation()(Items);