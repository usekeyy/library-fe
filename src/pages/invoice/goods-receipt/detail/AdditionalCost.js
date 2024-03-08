import React from 'react';
import { useForm } from 'react-hook-form';
// import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber, formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import { Row, Col } from 'reactstrap';
// import AutosizeInput from 'react-input-autosize';

const AdditionalCost = (props) => {
	const { handleSubmit, register } = useForm({});
    const [inputPaste, setInputPaste] = React.useState(false);
    const { t } = props;  
    let rows;

	const onSubmit = async data => {
		props.save(data);
	};	

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e, data_item, key, code) => {
        let caret = e.target.selectionStart
        let element = e.target        
        let new_value = element.value
        let old_value = 0
        old_value = data_item.amount_confirm
        let decimal_length = 2
        if (code === 'qty') {
            old_value = data_item.qty_confirm
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

    if (props.data !== undefined && props.data.length > 0) {
        rows = Object.keys(props.data).map(function (key, index) {
            let amount_confirm = props.data[index]['amount_confirm'] !== undefined ? props.data[index]['amount_confirm'] : ''
            if (amount_confirm !== '' && amount_confirm !== null) {
                amount_confirm = formatNumber2(amount_confirm, 2)
            }
            return (
                <tr key={key}>
                    {/* <input type="hidden" name={"id["+index+"]"} ref={register({})}/> */}
                    <td style={{verticalAlign: 'middle'}}>{index+1}<input type="hidden" name={"id["+index+"]"} ref={register({})} value={props.data[key]['id']}/></td>
                    <td style={{verticalAlign: 'middle'}}>{props.data[key]['conditional_type']} - {props.data[key]['condition_type_description']}</td>
                    <td style={{verticalAlign: 'middle', textAlign: "right"}}>{formatNumber2(props.data[key]['qty'],3)}</td>
                    {/* <td style={{verticalAlign: 'middle', textAlign: "right"}}>
                        <div style={{width: '80px'}}>
                            <input readOnly={true} maxLength="8" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                onChange={(e) => onChange(e, props.data[key], key, 'qty')} name={"qty_confirm["+key+"]"} ref={register({ required: false })} value={formatNumber(props.data[key]['qty_confirm'], 2)}/>
                        </div>
                    </td> */}
                    {/* <td style={{verticalAlign: 'middle', textAlign: "right"}}>{formatNumber2(props.data[key]['qty_confirm'],2)}</td> */}
                    <td style={{verticalAlign: 'middle', textAlign: "right"}}>{formatNumber2(props.data[key]['amount'],2)}</td>
                    <td style={{verticalAlign: 'middle', textAlign: "right"}}>
                        {!props.isReport ?
                            <div style={{width: '140px'}}>
                                <input maxLength="22" className="col-sm-12 col-form-label form-control input-sm" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                    onChange={(e) => onChange(e, props.data[key], key, 'amount')} name={"add_cost_net_value["+key+"]"} ref={register({ required: false })} value={formatNumber2(props.data[key]['amount_confirm'], 2)}/>
                            </div> : formatNumber2(props.data[key]['amount_confirm'], 2)
                        }
                    </td>
                    <td style={{verticalAlign: 'middle'}}>{props.data[key]['currency']}</td>
                    <td style={{verticalAlign: 'middle'}}>{props.data[key]['vendor_id']}</td>
                    <td style={{verticalAlign: 'middle'}}>
                        {!props.isReport ?
                            <input className={"form-control"} name={"note["+index+"]"} ref={register({ required: false })} onChange={e => props.setOption(e.target.value, 'note', key)} defaultValue={props.data[key]['note'] || '' } /> :
                            props.data[key]['note']
                        }
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
			<form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelBody >
                            <Row>
                                <Col sm="12">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>No. PO SAP</th>
                                                            <td>{props.data_header.po_sap_number} / {props.data_header.po_item_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>No. GR</th>
                                                            <td>{props.data_header.goods_receipt_number} / {props.data_header.item_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Material</th>
                                                            <td>{props.data_header.material_no} - {props.data_header.short_text}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Qty</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber(props.data_header.qty, 2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Amount</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber2(props.data_header.amount_value, 2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="table-responsive" style={{overflow: "visible"}}>
                                                <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>Vendor</th>
                                                            <td>{props.data_header.vendor_id} - {props.data_header.vendor_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Plant</th>
                                                            <td>{props.data_header.plant}</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <th>Sloc</th>
                                                            <td>{props.data_header.sloc}</td>
                                                        </tr> */}
                                                        <tr>
                                                            <th>Delivery Note</th>
                                                            <td>{props.data_header.reference}</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <th>Bill of Lading</th>
                                                            <td>{props.data_header.bill_of_lading}</td>
                                                        </tr> */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </PanelBody>
                        <PanelHeader>Additional Cost</PanelHeader>
                        {/* {props.loading_additional_cost && (
                            <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                            </center>
                        )}
                        {props.loading_additional_cost === false && ( */}
                            <PanelBody >
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th style={{widht:"1%"}}>No</th>
                                                        <th>Conditional Type</th>
                                                        <th>Qty</th>
                                                        {/* <th>Qty Konfirmasi</th> */}
                                                        <th>Amount</th>
                                                        <th>Amount Konfirmasi</th>
                                                        <th>Curr</th>
                                                        <th>Vendor</th>
                                                        <th>Catatan</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{rows}</tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </PanelBody>
                        {/* )} */}
                    </Panel>
                </ModalBody>
                <ModalFooter>
                    {!props.isReport &&
                        <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button>
                    }
                    <button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(AdditionalCost);
