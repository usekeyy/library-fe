import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import {formatNumber} from '../../../../helpers/formatNumber';
// import moment from 'moment';

const ModalSimulate = (props) => {
    const { t } = props;  
    let rows;
    let rows2;

    if (props.data.simulate !== undefined) {
        let simulate = props.data.simulate
        rows = Object.keys(simulate).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{simulate[key]['position']}</td>
                    <td>{simulate[key]['account_type']}</td>
                    <td>{simulate[key]['gl_account']}</td>
                    <td>{simulate[key]['description']}</td>
                    <td align="right">{formatNumber(simulate[key]['amount'], 2)}</td>
                    <td>{simulate[key]['debit_credit'] === 'H' ? 'Kredit' : simulate[key]['debit_credit'] === 'S' ? 'Debit' : ''}</td>
                    <td>{simulate[key]['currency']}</td>
                    <td>{simulate[key]['tax_code']}</td>
                    <td>{simulate[key]['vendor_sap_code']}</td>
                    <td>{simulate[key]['posting_key']}</td>
                    <td>{simulate[key]['posting_line_id']}</td>
                </tr>
            )
        });
    }

    if (props.data.message !== undefined) {
        let message = props.data.message
        rows2 = Object.keys(message).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{message[key]['type']} - {message[key]['number']}</td>
                    <td>{message[key]['id']}</td>
                    <td>{message[key]['message']}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Simulate Document Invoice</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Position</th>
                                                <th>Acc. Type</th>
                                                <th>G/L Account</th>
                                                <th>Acct/Mtrl/Asst/Vdr</th>
                                                <th>Amount</th>
                                                <th>D/C</th>
                                                <th>Curr</th>
                                                <th>Tax Code</th>
                                                <th>Vendor</th>
                                                <th>Posting Key</th>
                                                <th>Posting Line ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" align="right">Debit</label>
                                <label className="col-sm-8 form-control">{formatNumber(props.data.debit, 2)}</label>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" align="right">Credit</label>
                                <label className="col-sm-8 form-control">{formatNumber(props.data.credit, 2)}</label>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label" align="right">Balance</label>
                                <label className="col-sm-8 col-form-label form-control">{formatNumber(props.data.total_balance, 2)}</label>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group m-r-20">
                                <div align="right">{parseInt(props.data.total_balance) === 0 ?
                                    <span>OK <i className="fa fa-square" style={{color: 'green'}}/></span>
                                    : <span>NOT OK <i className="fa fa-square" style={{color: 'red'}}/></span>
                                }</div>
                            </div>
                        </div>
                    </div>
                    <PanelHeader>Return Message</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>ID</th>
                                                <th>Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows2}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                {/* <button className="btn btn-success" type="submit" onClick={() => props.save(props.param)}>Confirm</button> */}
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ModalSimulate);
