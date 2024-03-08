import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


const AdditionalCost = (props) => {
    const { t } = props;
	const { control, register } = useForm({});
    const [inputPaste, setInputPaste] = React.useState(false);

    const handleChange = (payload, code, key) => {
        props.setOptionAddCost(payload, code, key)
    }

    const onInputChangeTax = (option, { action }) => {
		if (action === "input-change") {
			props.fetchTax(option)
		}
		if (action === "set-value") {
			props.fetchTax('')
		}
	};

    const paramPPN = (payload) => {
        let arr = {label: 'Tidak', value: 'n'}
        if (payload === 'y') {
            arr = {label: 'ya', value: 'y'}
        }
        return arr
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
        props.setOptionAddCost(new_value, code, key)
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

    // const { register,errors } = useFormContext();
    let rows;
    if (props.data.items !== undefined) {
        let items = props.data.add_cost
        rows = Object.keys(items).map(function (key, index) {
            // items[key]['with_ppn'] = 'y'
            return (
                <tr key={key}>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_item_no']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['conditional_type']} - {items[key]['condition_type_description']}</td>
                    {props.user.has_roles.includes("VNDR01") &&
                        <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(items[key]['qty_add_cost'], 3)}</td>
                    }
                    <td style={{verticalAlign: "middle"}} align="right">
                        {(props.user.has_roles.includes("VNDR01") && (props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') ?
                            <div style={{width: '80px'}}>
                                <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                    onChange={(e) => onChange(e, items[key], key, 'qty')} name={"add_cost_qty["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['qty'], 3)}/>
                            </div> :
                            formatNumber2(items[key]['qty'], 3))
                    }</td>
                    {/* <td style={{verticalAlign: "middle"}} align="right">{formatNumber(items[key]['qty'], 2)}</td> */}
                    {/* <td style={{verticalAlign: "middle"}}>{formatNumber(items[key]['qty'])}</td> */}
                    {props.user.has_roles.includes("INVER2") &&
                        <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(items[key]['amount_add_cost'], 2)}</td>
                    }
                    <td style={{verticalAlign: "middle"}} align="right">
                        {(props.user.has_roles.includes("INVER2") && (props.data.status === 'received' || props.data.status === 'approved_2') ?
                            <div style={{width: '140px'}}>
                                <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                    onChange={(e) => onChange(e, items[key], key, 'net_value')} name={"add_cost_net_value["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['net_value'], 2)}/>
                            </div> :
                            formatNumber2(items[key]['net_value'], 2))
                    }</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['currency']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['vendor_id']} - {items[key]['vendor_name']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['note']}</td>
                    <td style={{verticalAlign: "middle"}}>{(props.data.status === 'draft' || props.data.status === 'submitted' || props.data.status === 'approved_1'
                        || props.data.status === 'rejected_1' || props.data.status === 'rejected_hc' || props.data.status === 'rejected_2') ? (
                            ((props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && props.user.uuid === props.data.created_by) ?
                                <div style={{width:"100px"}}>
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        options={props.param_option.m_ppn}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'ppn', key)
                                            return selected;
                                        }}
                                        inputRef={(e) => register({ name: "ppn_add_cost["+key+"]", required: false })}
                                        name={"ppn["+key+"]"}
                                        defaultValue={ paramPPN(items[key]['with_ppn']) }
                                        placeholder={ t("common:Select.Pilih") + " PPN" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                    />
                                </div>
                                : paramPPN(items[key]['with_ppn']).label
                        ) :
                        (props.data.status === 'received' || props.data.status === 'rejected_hc' || props.data.status === 'approved_2' || props.data.status === 'posted' || props.data.status === 'rejected_2'
                        || props.data.status === 'sent_bendahara' || props.data.status === 'received_bendahara' || props.data.status === 'rejected_hc_bendahara' || props.data.status === 'paid') ? (
                            ((props.data.status === 'received' || props.data.status === 'approved_2') && props.user.has_roles.includes("INVER2")) ?
                                    <div style={{width:"300px"}}>
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        options={props.param_option.m_tax}
                                        onInputChange={onInputChangeTax}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'tax', key)
                                            return selected;
                                        }}
                                        inputRef={(e) => register({ name: "tax_id_add_cost["+key+"]", required: false })}
                                        name={"tax_id["+key+"]"}
                                        defaultValue={ items[key]['tax_id'] !== null ? {value: items[key]['tax_id'], label: items[key]['tax_id'] + ' - ' + items[key]['tax_description']} : ''}
                                        placeholder={ t("common:Select.Pilih") + " Tax PPN" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                    />
                                </div>
                                : items[key]['tax_id'] + ' - ' + items[key]['tax_description']
                            // items[key]['with_ppn'] === 'y' ? (
                            // ) : paramPPN(items[key]['with_ppn']).label
                        ) : ''
                    }</td>
                </tr>
            )
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
                    <PanelHeader>Additional Cost</PanelHeader>
                    <PanelBody>
                        <Row>
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No. GR</th>
                                                <th>Line Item</th>
                                                <th>Condition Type</th>
                                                {props.user.has_roles.includes("VNDR01") &&
                                                    <th>Qty (Unit Kerja)</th>
                                                }
                                                <th>Qty</th>
                                                {props.user.has_roles.includes("INVER2") &&
                                                    <th>Amount (Unit Kerja)</th>
                                                }
                                                <th>Amount</th>
                                                <th>Currency</th>
                                                <th>Vendor</th>
                                                <th>Catatan</th>
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

export default withTranslation()(AdditionalCost);