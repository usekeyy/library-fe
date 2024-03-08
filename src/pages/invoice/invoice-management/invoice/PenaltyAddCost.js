import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import { formatNumber2 } from '../../../../helpers/formatNumber';
import ReactLoading from 'react-loading';

const PenaltyAddCost = (props) => {
    let rows;

    const paramDebitCredit = (payload) => {
        let arr = []
        if (payload === 'S') {
            arr = {label: 'Debit', value: 'S'}
        }
        else if (payload === 'H') {
            arr = {label: 'Credit', value: 'H'}
        }
        return arr
    }

    if (props.data.penalty_add_cost !== undefined) {
        let penalty = props.data.penalty_add_cost
        rows = Object.keys(penalty).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['goods_receipt_number']}</td>
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['goods_receipt_item_no']}</td>
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['conditional_type']}</td>
                    {!props.user.has_roles.includes("VNDR01") &&
                        <td style={{verticalAlign: "middle"}}>{penalty[key]['jenis_pembebanan'] === 'Non Inventory' && penalty[key]['gl_account'] !== null && (penalty[key]['gl_account'] + ' - ' + penalty[key]['gl_account_description'])}</td>
                    }
                    {!props.user.has_roles.includes("VNDR01") &&
                        <td style={{verticalAlign: "middle"}}>{penalty[key]['jenis_pembebanan'] === 'Non Inventory' && penalty[key]['acc_assigment_category_name']}</td>
                    }
                    {!props.user.has_roles.includes("VNDR01") &&
                        <td style={{verticalAlign: "middle"}}>{penalty[key]['jenis_pembebanan'] === 'Non Inventory' && penalty[key]['acc_assigment_category_number']}</td>
                    }
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['penalty_type']}</td>
                    <td style={{width: '100px'}}>{paramDebitCredit(penalty[key]['debit_credit']).label}</td>
                    <td style={{verticalAlign: "middle"}} align="right">{formatNumber2(penalty[key]['amount'], 2)}</td>
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['currency']}</td>
                    <td style={{verticalAlign: "middle"}}>{penalty[key]['description']}</td>
                    <td style={{verticalAlign: "middle"}}>
                        {penalty[key]['file'] !== null &&
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, penalty[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${penalty[key]['file']}`)} href="/">lampiran</a>
                        }
                    </td>
                    <td style={{verticalAlign: "middle"}}></td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Penalty & Additional Expense (Additional Cost)</PanelHeader>
                <PanelBody>
                    {(props.data.status === 'received' || props.data.status === 'approved_2') && props.user.has_roles.includes("INVER2") &&
                    <Row>
                        <div className="col-sm-12">
                        </div>
                    </Row>
                    }
                    {props.loadings.loading_list_penalty && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    {props.loadings.loading_list_penalty === false && (
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive" style={{overflow: "visible"}}>
                                <table className="table table-bordered table-striped table-sm text-wrap">
                                    <thead>
                                        <tr>
                                            <th>No. GR</th>
                                            <th>GR Item</th>
                                            <th>Conditional Type</th>
                                            {!props.user.has_roles.includes("VNDR01") &&
                                            <th>G/L Account</th>
                                            }
                                            {!props.user.has_roles.includes("VNDR01") &&
                                            <th>Ass. Category</th>
                                            }
                                            {!props.user.has_roles.includes("VNDR01") &&
                                            <th>Object</th>
                                            }
                                            <th>Jenis Penalty</th>
                                            <th>Debit/Credit</th>
                                            <th>Nilai</th>
                                            <th>Currency</th>
                                            <th>Description</th>
                                            <th>Lampiran</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    )}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(PenaltyAddCost);