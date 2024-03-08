import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';
import ReactLoading from 'react-loading';

const DPP = (props) => {
    // const [checked, setChecked] = React.useState(true);
		const checked = true;
    // const { t } = props;
    const { register } = useFormContext();

    const onChange = (e) => {
        // console.log(keys)
        let caret = e.target.selectionStart
        let element = e.target

        let new_value = element.value.replace(/[^0-9]/g, '')
        if (new_value.length > 2) {            
            new_value = new_value.substring(0, new_value.length - 2)
        }
        new_value = formatNumber(new_value, 2)
        let amount_confirm = formatNumber(props.data.ppn_amount, 2)

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
        props.setOption(e.target.value.replace(/[^0-9]/g, ''), 'ppn-amount')
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

	// const setOption = (e) => {
  //       if (checked) {
  //           setChecked(false)
  //       }
  //       else {
  //           props.setOption(checked, 'checklist')
  //           setChecked(true)
  //       }
	// }

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
                                {!props.loadings.form &&
                                    <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(props.data.amount, 2)}</label>
                                }
                                {!props.loadings.form &&
                                    <input readOnly={true} style={{display: 'none'}} name="amount" ref={register({})} value={props.data.amount}/>
                                }
                                {props.user.has_roles.includes("INVER2") && (props.data.status === 'received' || props.data.status === 'approved_2') &&
                                    <div className="col-sm-4 col-form-label m-l-10">
                                        {/* <input type="checkbox" checked={checked} onChange={(e) => setOption(e)}/>
                                        <label className="m-l-5"> lock ppn</label> */}
                                    </div>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Additional Cost </label>
                                <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(parseFloat(props.data.total_add_cost), 2)}</label>
                                <input readOnly={true} style={{display: 'none'}} name="total_add_cost" ref={register({})} value={parseFloat(props.data.total_add_cost)}/>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">DPP Amount </label>
                                {!props.loadings.form &&
                                    <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(props.data.dpp_amount, 2)}</label>
                                }
                                {!props.loadings.form &&
                                    <input readOnly={true} style={{display: 'none'}} name="dpp_amount" ref={register({})} value={props.data.dpp_amount}/>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">PPN </label>
                                {/* <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(props.data.ppn_amount, 2)}</label>
                                <input readOnly={true} style={{display: 'none'}} name="ppn_amount" ref={register({})} value={props.data.ppn_amount}/> */}
                                {!props.loadings.form &&
                                    // <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(props.data.total, 2)}</label>
                                    <input className="col-sm-4 col-form-label form-control" readOnly={checked} style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)}
                                        onChange={(e) => onChange(e)} name={"ppn_amount"} ref={register({ required: false })} value={formatNumber(props.data.ppn_amount, 2)}/>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Penalty & Additional Expense </label>
                                {parseFloat(props.data.potongan) > 0 ?
                                    <label className="col-sm-4 col-form-label form-control" readOnly={true} style={{color:"red"}} align="right">{formatNumber(props.data.potongan, 2)}</label> :
                                    <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber((props.data.potongan.toString()).substring(1), 2)}</label>
                                }
                                <input readOnly={true} style={{display: 'none'}} name="potongan" ref={register({})} value={props.data.potongan}/>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Total </label>
                                {!props.loadings.form &&
                                    <label className="col-sm-4 col-form-label form-control" readOnly={true} align="right">{formatNumber(props.data.total, 2)}</label>
                                }
                                {!props.loadings.form &&
                                    <input readOnly={true} style={{display: 'none'}} name="total" ref={register({})} value={props.data.total}/>
                                }
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