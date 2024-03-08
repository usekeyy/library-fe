import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import ReactLoading from 'react-loading';

const DPP = (props) => {
    const [checked, setChecked] = React.useState(props.data.lock_ppn === 'y' ? true : false);
    const [inputPaste, setInputPaste] = React.useState(false);
    // const { t } = props;
    const { register } = useFormContext();
    const inputRight = {
        textAlign: 'right',
    };

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e, code) => {
        let caret = e.target.selectionStart
        let element = e.target        
        let new_value = element.value
        let old_value = 0
        if (code !== '') {
            old_value = props.data[code]
        }

        if (inputPaste) {
            new_value = formatNumber2(replaceAll(replaceAll(new_value, '.', ''), ',', '.'), 2)
            if (caret < new_value.length) {
                caret += 1
            }
        }
        else {
            let return_calculate = calculateFormatCurrency(element.value, old_value, caret, 2)
            caret = return_calculate.caret
            new_value = return_calculate.new_value
        }

        window.requestAnimationFrame(() => {
            element.selectionStart = caret
            element.selectionEnd = caret
        })
        setInputPaste(false)
        props.setValue(new_value, code)
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

	const setOption = (e) => {
        props.setOption(checked, 'checklist')
        if (checked) {
            setChecked(false)
        }
        else {
            setChecked(true)
        }
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>DPP / Amount</PanelHeader>
                <PanelBody>
                    {props.loadings.loading_dpp && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    {props.loadings.loading_dpp === false && (
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Amount </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="amount" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.amount, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Additional Cost </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="total_add_cost" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.total_add_cost, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">DPP Amount </label>
                                <div className="col-sm-4">
                                    {(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') ?
                                        <input maxLength="22" className="form-control" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                            onChange={(e) => onChange(e, 'dpp_amount')} name={"dpp_amount"} ref={register({})} value={formatNumber2(props.data.dpp_amount, 2)}/> :
                                        <input readOnly={true} style={inputRight} type="text" name="dpp_amount" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.dpp_amount, 2)} />
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">PPN </label>
                                {/* <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber2(props.data.ppn_amount, 2)}</label>
                                <input readOnly={true} style={{display: 'none'}} name="ppn_amount" ref={register({})} value={props.data.ppn_amount}/> */}
                                <div className="col-sm-4">
                                    {(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') ?
                                        <input maxLength="22" className="form-control" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                            onChange={(e) => onChange(e, 'ppn_amount')} name={"ppn_amount"} ref={register({})} value={formatNumber2(props.data.ppn_amount, 2)}/> :
                                        <input readOnly={true} style={inputRight} type="text" name="ppn_amount" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.ppn_amount, 2)} />
                                    }
                                </div>
                                {/* {!props.loadings.form && !props.loadings.update_ppn &&
                                    // <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber2(props.data.total, 2)}</label>
                                    <input className="col-sm-4 col-form-label form-control" readOnly={true} style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)}
                                        onChange={(e) => onChange(e)} name={"ppn_amount"} ref={register({ required: false })} value={formatNumber2(props.data.ppn_amount, 2)}/>
                                } */}
                                {props.user.has_roles.includes("INVER2") && (props.data.status === 'received' || props.data.status === 'approved_2') &&
                                    <div className="col-sm-4 col-form-label m-l-10">
                                        <input type="checkbox" checked={checked} onChange={(e) => setOption(e)}/>
                                        <label className="m-l-5"> Calculate Tax</label>
                                    </div>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Penalty & Additional Expense </label>
                                <div className="col-sm-4">
                                    {parseFloat(props.data.potongan) > 0 ?
                                        <input readOnly={true} style={{textAlign: 'right', color:"red"}} type="text" className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} /> :
                                    parseFloat(props.data.potongan) < 0 ?
                                        <input readOnly={true} style={inputRight} type="text" className="form-control" placeholder="" value={formatNumber2((props.data.potongan.toString()).substring(1), 2)} /> :
                                        <input readOnly={true} style={inputRight} type="text" className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} />
                                    }
                                    <input readOnly={true} type="text" style={{display: 'none'}} name="potongan" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Total </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="total" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.total, 2)} />
                                </div>
                            </div>
                         </Col>
                    </Row>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DPP);