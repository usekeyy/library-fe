import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatDate } from '../../../../helpers/formatDate';
import { formatNumber2 } from '../../../../helpers/formatNumber';

const DataSAP = (props) => {

    let rows
    if (props.data.with_holding_tax.length > 0) {
        let data_tax = props.data.with_holding_tax
        rows = Object.keys(data_tax).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{width: "1%"}}>{data_tax[key]['w_tax_type']}</td>
                    <td>{data_tax[key]['w_tax_code'] || ''} - {data_tax[key]['description'] || ''}</td>
                    <td style={{width: "30%"}} align="right">{formatNumber2(data_tax[key]['w_tax_value'], 2)}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Input Data SAP</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Posting Date </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={formatDate(props.data.posting_date)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Baseline Date </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={formatDate(props.data.baseline_date)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Block </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.payment_block_code + ' - ' + props.data.payment_block_description} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Method </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.payment_method_code + ' - ' + props.data.payment_method_description} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Term of Payment </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.pay_of_term_description} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">With Holding Tax <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Tax Type</th>
                                                    <th>Tax Code</th>
                                                    <th>Base Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">House Bank </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.house_bank_code + ' - ' + props.data.house_bank_description} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Reff </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.payment_reff || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Note </label>
                                <div className="col-sm-4">
                                    <textarea readOnly={true} name="note_vendor" className="form-control" placeholder="" defaultValue={props.data.header_text || ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 1 </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.reference_1_npwp_number + ' - ' + props.data.reference_1_city|| ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 2 </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.reference_2 || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 3 </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.reference_3 || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Assignment </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.assignment || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Exchange Rate </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.exchange_rate !== null ? formatNumber2(props.data.exchange_rate) : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">GL Account </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" placeholder="" defaultValue={props.data.gl_account !== null ? props.data.gl_account + ' - ' + props.data.gl_account_name : ''} />
                                </div>
                            </div>
                         </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DataSAP);