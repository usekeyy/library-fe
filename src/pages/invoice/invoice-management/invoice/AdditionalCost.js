import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import {formatNumber2} from '../../../../helpers/formatNumber';
// import moment from 'moment';
import ReactLoading from 'react-loading';

const AdditionalCost = (props) => {
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
        let items = props.data.add_cost
        rows = Object.keys(items).map(function (key, index) {
            // items[key]['with_ppn'] = 'y'
            return (
                <tr key={key}>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_number']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['goods_receipt_item_no']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['conditional_type']} - {items[key]['condition_type_description']}</td>
                    <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(items[key]['qty'], 3)}</td>
                    <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(items[key]['net_value'], 2)}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['currency']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['vendor_id']} - {items[key]['vendor_name']}</td>
                    <td style={{verticalAlign: "middle"}} align="center">{items[key]['note']}</td>
                    <td style={{verticalAlign: "middle"}}>{(props.data.status === 'draft' || props.data.status === 'submitted' || props.data.status === 'approved_1'
                        || props.data.status === 'rejected_1' || props.data.status === 'rejected_hc' || props.data.status === 'rejected_2') ? paramPPN(items[key]['with_ppn']).label
                        :
                        (props.data.status === 'received' || props.data.status === 'rejected_hc' || props.data.status === 'approved_2' || props.data.status === 'posted' || props.data.status === 'rejected_2'
                        || props.data.status === 'sent_bendahara' || props.data.status === 'received_bendahara' || props.data.status === 'rejected_hc_bendahara' || props.data.status === 'paid') &&
                        items[key]['tax_id'] + ' - ' + items[key]['tax_description']
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
                                                <th>Qty</th>
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