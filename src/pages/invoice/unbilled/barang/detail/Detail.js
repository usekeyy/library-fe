import React from 'react';
// import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from './../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { formatNumber2 } from './../../../../../helpers/formatNumber';

const Detail = (props) => {
    let data = props.data

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Goods Receipt</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={{width:'1%'}}>No. GR</th>
                                                    <td>{data.goods_receipt_number}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fiscal Year</th>
                                                    <td>{data.goods_receipt_year}</td>
                                                </tr>
                                                <tr>
                                                    <th>Vendor</th>
                                                    <td>{data.vendor_id} - {data.vendor_name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Delivery Note</th>
                                                    <td>{data.reference}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th>Bill of Landing</th>
                                                    <td>{data.bill_of_landing}</td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={{width:'1%'}}>Created By</th>
                                                    <td>{data.sap_created_by}</td>
                                                </tr>
                                                <tr>
                                                    <th>Created At</th>
                                                    <td>{data.sap_created_at !== undefined && data.sap_created_at !== null && moment(data.sap_created_at).format("DD-MM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Doc. Date</th>
                                                    <td>{data.doc_date !== undefined && data.doc_date !== null && moment(data.doc_date).format("DD-MM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Posting Date</th>
                                                    <td>{data.post_date !== undefined && data.post_date !== null && moment(data.post_date).format("DD-MM-YYYY")}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>GR Item</th>
                                            <th>No. PO (Eproc)</th>
                                            <th>No. PO (SAP)</th>
                                            <th>PO Item</th>
                                            <th>Acc. Assg Category</th>
                                            <th>Acc. Assg</th>
                                            <th>GL. Account</th>
                                            <th>No. Material</th>
                                            <th>Material Desc.</th>
                                            <th>Qty</th>
                                            <th>UOM</th>
                                            <th>Amount</th>
                                            {/* <th>Amount in LC</th> */}
                                            <th>Curr</th>
                                            <th>Plant</th>
                                            {/* <th>Sloc</th> */}
                                            {/* <th>Add Cost</th> */}
                                            <th>Penalty</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={0}>
                                            {/* <td>{(index+1)}</td> */}
                                            <td>{data['item_no']}</td>
                                            <td>{data['po_eproc_number']}</td>
                                            <td>{data['po_sap_number']}</td>
                                            <td>{data['po_item_no']}</td>
                                            <td>{data['acc_assignment_category_id']}</td>
                                            <td>{data['acc_assignment_category_number']}</td>
                                            <td>{data['gl_account']}</td>
                                            {/* <td>{data['recipient']}</td> */}
                                            <td>{data['material_no']}</td>
                                            <td>{data['short_text']}</td>
                                            <td align="right">{formatNumber2(data['qty'], 3)}</td>
                                            <td>{data['uom']}</td>
                                            <td align="right">{formatNumber2(data['amount'], 2)}</td>
                                            {/* <td align="right">{formatNumber(data['amount_in_lc'], 2)}</td> */}
                                            <td>{data['currency']}</td>
                                            <td>{data['plant']}</td>
                                            {/* <td>{data['sloc']}</td> */}
                                            {/* <td align="right">{formatNumber(data['add_cost'], 2)}</td> */}
                                            <td align="right">{formatNumber2(data['penalty'], 2)}</td>
                                            <td>
                                                {/* <button className="btn btn-xs btn-white" onClick={(e) => props.modalAdditionalCost(e, data)}>Add. Cost</button> */}
                                                <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenalty(e, data)}>Penalty</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: "40px"}}>
                        <Col sm="12">
                            <h5><b>Penalty Calculation :</b></h5>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <td style={{width:'60%'}}>Total Amount Barang</td>
                                                    <td align="right">{formatNumber2(data.amount, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td>Total Additional Cost</td>
                                                    <td align="right">{formatNumber2(data.total_additional_cost, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr> */}
                                                <tr>
                                                    <td>Total Penalty</td>
                                                    <td align="right" style={{color: 'red'}}>{formatNumber2(data.penalty, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Keseluruhan Amount</td>
                                                    <td align="right">{formatNumber2((parseFloat(data.amount) - parseFloat(data.penalty)).toFixed(2), 2)}</td>
                                                    <td style={{width:'1%'}}>{data.currency !== undefined ? data.currency : 'IDR'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <div className="pull-right m-t-5 m-b-5">
                                <div>
                                    <button
                                        type="button"
                                        onClick={(e) => window.close()}
                                        disabled={props.loadingSubmit}
                                        className="btn btn-white m-r-5">
                                        Kembali
                                        </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>

        </div>
	);
}

export default withTranslation()(Detail);