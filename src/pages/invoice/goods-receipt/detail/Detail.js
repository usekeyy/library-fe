import React from 'react';
// import { useForm, FormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from './../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import { formatNumber2 } from './../../../../helpers/formatNumber';

const Detail = (props) => {

	// const methods = useForm();
	// const [status, setStatus] = React.useState('')

	// const onSubmit = data => {
    //     data.status = status
	// 	let payload = []
	// 	payload.status = status
	// 	payload.note = data.note
	// 	if (status === "o") {
	// 		props.savePurchaseOrder(payload);
	// 	}
	// };

	// const SubmitCheck = (e) => {
	// 	setStatus('o')
	// }
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
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={{width:'1%'}}>No. GR</th>
                                                    <td>{data.number}</td>
                                                </tr>
                                                <tr>
                                                    <th>Fiscal Year</th>
                                                    <td>{data.year}</td>
                                                </tr>
                                                <tr>
                                                    <th>Vendor</th>
                                                    <td>
                                                        {data.vendor_add_cost && data.vendor_add_cost.some(i => i.sto?.includes('X')) ? 
                                                            data.vendor_add_cost.map(e => `${e.vendor_id} - ${e.name}`).join(", ") :
                                                            `${data.vendor_id} - ${data.vendor_name}`
                                                        }
                                                    </td>
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
                                            <th>Add Cost</th>
                                            <th>Penalty</th>
                                            {/* {!props.isReport && } */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{
                                        data.items !== undefined && 
                                            Object.keys(data.items).map(function (key, index) {
                                                return (
                                                    <tr key={key}>
                                                        {/* <td>{(index+1)}</td> */}
                                                        <td>{data.items[key]['item_no']}</td>
                                                        <td>{data.items[key]['po_eproc_number']}</td>
                                                        <td>{data.items[key]['po_sap_number']}</td>
                                                        <td>{data.items[key]['po_item_no']}</td>
                                                        <td>{data.items[key]['acc_assignment_category_id']}</td>
                                                        <td>{data.items[key]['acc_assignment_category_number']}</td>
                                                        <td>{data.items[key]['gl_account']}</td>
                                                        <td>{data.items[key]['material_no']}</td>
                                                        <td>{data.items[key]['short_text']}</td>
                                                        <td align="right">{formatNumber2(data.items[key]['qty'], 3)}</td>
                                                        <td>{data.items[key]['uom']}</td>
                                                        <td align="right">{formatNumber2(data.items[key]['amount_value'], 2)}</td>
                                                        {/* <td align="right">{formatNumber2(data.items[key]['amount_in_lc'], 2)}</td> */}
                                                        <td>{data.items[key]['currency']}</td>
                                                        <td>{data.items[key]['plant']}</td>
                                                        {/* <td>{data.items[key]['sloc']}</td> */}
                                                        <td align="right">{formatNumber2(data.items[key]['add_cost'], 2)}</td>
                                                        <td align="right">{formatNumber2(data.items[key]['penalty'], 2)}</td>
                                                            <td>
                                                                <button className="btn btn-xs btn-white" onClick={(e) => props.modalAdditionalCost(e, data.items[key])}>Add. Cost</button>
                                                                <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenalty(e, data.items[key])}>Penalty</button>
                                                                <button className="btn btn-xs btn-white" onClick={(e) => props.modalPenaltyAdditionalCost(e, data.items[key])}>Penalty Add. Cost</button>
                                                            </td>
                                                        {/* {!props.isReport && 
                                                        } */}
                                                    </tr>
                                                )
                                            })
                                    }</tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{paddingTop: "40px"}}>
                        <Col sm="12">
                            <h5><b>Add Cost & Penalty Calculation :</b></h5>
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <td style={{width:'60%'}}>Total Amount Barang</td>
                                                    <td align="right">{formatNumber2(data.total_amount_item, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.items[0].currency !== null ? data.items[0].currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Additional Cost</td>
                                                    <td align="right">{formatNumber2(data.total_additional_cost, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.items[0].currency !== null ? data.items[0].currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Penalty</td>
                                                    <td align="right" style={{color: 'red'}}>{formatNumber2(data.total_penalty, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.items[0].currency !== null ? data.items[0].currency : 'IDR'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Keseluruhan Amount</td>
                                                    <td align="right">{formatNumber2(data.total_akhir, 2)}</td>
                                                    <td style={{width:'1%'}}>{data.items[0].currency !== null ? data.items[0].currency : 'IDR'}</td>
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
                                    {!props.isReport && <button
                                        type="submit"
                                        className="btn btn-success m-r-5"
                                        onClick={(e) => props.save({status: 'p'})}
                                        disabled={props.loadingSubmit}
                                    >
                                    {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Submit</button>}
                                    <button
                                        type="button"
                                        onClick={(e) => window.history.back()}
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