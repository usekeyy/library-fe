import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {formatNumber, formatNumber2} from '../../../../helpers/formatNumber';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();


const Items = (props) => {
    const { t } = props;
	const { control, register } = useForm({});

    const handleChange = (payload, code, key) => {
        props.setOptionItem(payload, code, key)
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

    const onChange = (e, data_item, key, code) => {
        let caret = e.target.selectionStart
        let element = e.target

        let new_value = element.value.replace(/[^0-9]/g, '')
        if (new_value.length > 2) {            
            new_value = new_value.substring(0, new_value.length - 2)
        }
        new_value = formatNumber(new_value, 2)
        let amount_confirm = formatNumber(data_item.net_value, 2)
        if (code === 'qty') {
            amount_confirm = formatNumber(data_item.qty, 2)
        }

        if (new_value.length > amount_confirm.length) {
            if (new_value.split(".").length > amount_confirm.split(".").length)
            {
                caret += 1
            }
        }

        window.requestAnimationFrame(() => {
            element.selectionStart = caret
            element.selectionEnd = caret
        })
        props.setOptionItem(e.target.value, code, key)
        // props.setOption(e.target.value, 'ppn-amount')
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
        rows = Object.keys(items).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_trans_type'] === '9' ? items[key]['goods_receipt_line_no'] : items[key]['goods_receipt_item_no']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['purchase_order_eproc_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['purchase_order_sap_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['purchase_order_item_no']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['acc_assignment_category_id']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['acc_assignment_category_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['gl_account']}</td>
                    {props.data.category.toLowerCase().includes("barang") &&
                        <td style={{verticalAlign: "middle"}}>{items[key]['material_no']}</td>
                    }
                    <td style={{verticalAlign: "middle"}}>{items[key]['short_text']}</td>
                    <td style={{verticalAlign: "middle"}} align="right">
                        {(props.user.has_roles.includes("INVER2") && (props.data.status === 'received' || props.data.status === 'approved_2') ?
                            <div style={{width: '80px'}}>
                                <input maxLength="8" disabled className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)}
                                    onChange={(e) => onChange(e, items[key], key, 'qty')} name={"qty["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['qty'], 3)}/>
                            </div> :
                            formatNumber2(items[key]['qty'], 3))
                    }</td>
                    <td style={{verticalAlign: "middle"}}>{items[key]['uom']}</td>
                    {/* <td align="right">{formatNumber(items[key]['net_value'], 2)}</td> */}
                    <td style={{verticalAlign: "middle"}} align="right">
                        {(props.user.has_roles.includes("INVER2") && (props.data.status === 'received' || props.data.status === 'approved_2') ?
                            <div style={{width: '140px'}}>
                                <input maxLength="18" disabled className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)}
                                    onChange={(e) => onChange(e, items[key], key, 'amount')} name={"net_value["+key+"]"} ref={register({ required: false })} value={formatNumber2(items[key]['net_value'], 2)}/>
                            </div> :
                            formatNumber2(items[key]['net_value'], 2))
                    }</td>
                    <td style={{verticalAlign: "middle"}}>{items[key]['currency']}</td>
                    <td style={{verticalAlign: "middle"}}>{items[key]['plant']}</td>
                    <td style={{verticalAlign: "middle"}}>
                        {(props.data.status === 'draft' || props.data.status === 'submitted' || props.data.status === 'approved_1'
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
                                        inputRef={(e) => register({ name: "ppn["+key+"]", required: false })}
                                        name={"ppn["+key+"]"}
                                        defaultValue={ paramPPN(items[key]['with_ppn']) }
                                        placeholder={ t("common:Select.Pilih") + " PPN" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                        isDisabled = {true}
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
                                        inputRef={(e) => register({ name: "tax_id["+key+"]", required: false })}
                                        name={"tax_id["+key+"]"}
                                        defaultValue={ items[key]['tax_id'] !== null ? {value: items[key]['tax_id'], label: items[key]['tax_id'] + ' - ' + items[key]['tax_description']} : ''}
                                        placeholder={ t("common:Select.Pilih") + " Tax PPN" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                        isDisabled = {true}
                                    />
                                </div>
                                : (props.data.status === 'received' && props.user.has_roles.includes("VNDR01")) ? paramPPN(items[key]['with_ppn']).label :
                                    (items[key]['tax_id'] === null ? paramPPN(items[key]['with_ppn']).label : items[key]['tax_id'] + ' - ' + items[key]['tax_description'])
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
                    <PanelHeader>Items</PanelHeader>
                    <PanelBody>
                        <Row>
                            <div className="col-sm-12" style={{overflowX: "auto"}}>
                                <div className="table-responsive" style={{overflow: "visible"}}>
                                    <table className="table table-bordered table-striped table-sm text-wrap">
                                        <thead>
                                            <tr>
                                                <th>No. GR/SA</th>
                                                <th>Line/Item No.</th>
                                                <th>No. PO (Eproc)</th>
                                                <th>No. PO (SAP)</th>
                                                <th>PO item</th>
                                                <th>Acc. Assg Category</th>
                                                <th>Acc. Assg</th>
                                                <th>GL. Account</th>
                                                {props.data.category.toLowerCase().includes("barang") &&
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