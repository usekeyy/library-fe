import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";

const CreateInvoice = (props) => {
    const distinctArray = (data) => {
        const var_temp = data.filter((value,index) => {
            return data.indexOf(value) === index
        })
        return var_temp;
    }

    let rows
    if (props.data.document_po_confirm.length > 0) {
        let doc = props.data.document_po_confirm
        rows = Object.keys(doc).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center">{doc[key]['po_sap_number']}</td>
                    <td style={{verticalAlign:'middle'}} align="center">{doc[key]['file'] !== null && (
                        doc[key]['file_temp'] !== null ? (
                            doc[key]['dir'] === '/tendering' ?
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/tendering/${doc[key]['file']}`)} href="/">lampiran</a> :
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${doc[key]['file']}`)} href="/">lampiran</a>
                        ) :
                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${doc[key]['file']}`)} href="/">lampiran</a>
                    )}</td>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center"></td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Invoice</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Vendor </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} name="vendor_id" className="form-control" placeholder="" defaultValue={ props.data.vendor_id + ' - ' + props.data.vendor_name || ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">PPN <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" name="with_ppn" defaultValue={props.data.with_ppn !== null && props.data.with_ppn !== null ? (props.data.with_ppn === 'n' ? 'Tidak' : 'ya') : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No Faktur Pajak <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} name="faktur_pajak_no" className="form-control" placeholder="" defaultValue={props.data.faktur_pajak_no !== undefined ? props.data.faktur_pajak_no: ''} />
                                </div>
                                <span> </span>
                                {props.data.faktur_file !== null &&
                                    <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.faktur_file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.faktur_file}`)} href="/">{props.data.faktur_file}</a>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Tanggal Faktur Pajak <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} name="faktur_tanggal" className="form-control" placeholder="" defaultValue={props.data.faktur_tanggal !== undefined && props.data.faktur_tanggal !== null ? moment(props.data.faktur_tanggal).format("DD-MM-YYYY") : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Status Scan Faktur Pajak </label>
                                <div className="col-sm-4">
                                    {!props.loadings.form &&
                                        // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} defaultValue={props.data.faktur_pajak_no} autoComplete="off"/>
                                        <input readOnly={true} type="text" name="faktur_status" className="form-control" placeholder="" defaultValue={props.data.faktur_status !== undefined && props.data.faktur_status !== null ? props.data.faktur_status: ''} />
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No Invoice <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} name="number" className="form-control" placeholder="" defaultValue={props.data.number || ''} />
                                </div>
                                <span> </span>
                                {props.data.invoice_file !== null &&
                                    <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.invoice_file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.invoice_file}`)} href="/">{props.data.invoice_file}</a>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Tanggal Invoice <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} name="invoice_date" className="form-control" placeholder="" defaultValue={props.data.invoice_date !== undefined && props.data.invoice_date !== null ? moment(props.data.invoice_date).format("DD-MM-YYYY") : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Bank <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input type="text" readOnly={true} className="form-control" name="rekening_bank_id" defaultValue={props.data.rekening_bank_nomor_rekening + ' - ' + props.data.bank_branch_name} />
                                </div>
                            </div>
                            {(props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA"))  &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Purchasing Requisition <span className="text-danger">*</span> </label>
                                    <div className="col-sm-4">
                                        <input readOnly={true} type="text" name="purchasing_requisition_number" className="form-control" placeholder="" defaultValue={(props.data.purchasing_requisition_number !== undefined && props.data.purchasing_requisition_number !== null) ? distinctArray(props.data.purchasing_requisition_number.split(", ")).join(", ") : ''} />
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Purchase Order <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>No PO SAP</th>
                                                    <th style={{textAlign: "center"}}>Document PO Confirm</th>
                                                    <th>Action</th>
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
                                <label className="col-sm-2 col-form-label">GR/SA SAP</label>
                                <div className="col-sm-4">
                                    <input readOnly={true} type="text" name="goods_receipt_number" className="form-control" placeholder="" defaultValue={(props.data.goods_receipt_number !== undefined && props.data.goods_receipt_number !== null) ? distinctArray(props.data.goods_receipt_number.split(", ")).join(", ") : ''} />
                                </div>
                                {props.data.goods_receipt_file !== null &&
                                    <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.goods_receipt_file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.goods_receipt_file}`)} href="/">{props.data.goods_receipt_file}</a>
                                }
                            </div>
                            {(props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA"))  &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">No. MVP </label>
                                    <div className="col-sm-4">
                                        <input type="text" readOnly={true} name="sap_fi" className="form-control" placeholder="" defaultValue={props.data.sap_fi || ''} />
                                    </div>
                                </div>
                            }
                            {(props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) && (props.data.status === 'posted' || props.data.status === 'sent_bendahara' || props.data.status === 'sent_bendahara' || props.data.status === 'rejected_hc_bendahara' || props.data.status === 'paid') &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Lampiran MVP <span className="text-danger">*</span> </label>
                                    <div className="col-sm-6">
                                        {props.data.mvp_file !== undefined && props.data.mvp_file !== null ?
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.mvp_file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.mvp_file}`)} href="/">{props.data.mvp_file}</a> :
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.mvp_file, `${process.env.REACT_APP_API_BASE_URL}files/temp/${props.data.mvp_file}`)} href="/">{props.data.mvp_file}</a>
                                        }
                                    </div>
                                    <input style={{display: 'none'}} readOnly={true} type="text" name="mvp_file" className="form-control" placeholder="" defaultValue={props.data.mvp_file} />
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Note </label>
                                <div className="col-sm-4">
                                    <textarea readOnly={true} name="note_vendor" className="form-control" placeholder="" defaultValue={props.data.note_vendor || ''}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(CreateInvoice);