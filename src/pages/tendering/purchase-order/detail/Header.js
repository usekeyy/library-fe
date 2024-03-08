import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../helpers/formatNumber';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const Header = (props) => {
    const { t } = props;
    const [loading] = React.useState(false)
    const { register } = useFormContext();

	const handleChangeHeaderText = (e) => {
        props.setOption(e.target.value, 'header-text')
	}
    const handleChangeDueDate = (e) => {
        const date = formattingDate(e)
        props.setOption(date, 'due-date')
	}

    const handleChangeDocumentDate = (e) => {
        const date = formattingDate(e)
        props.setOption(date, 'document-date')
    }

    const formattingDate = (e) => {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const modalSap = (e) => {
		props.modalSap()
        e.preventDefault()
	}

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <div className="row">
                        <div className="col-sm-12">
                            {props.data.sap_number === null && props.data.status === 'c' &&
                                <button type="button" style={{marginBottom: "12px"}} className="btn btn-danger" value={props.proposal_tender_uuid} onClick={(e) => modalSap(e)}>Error SAP & Re-Sync</button>
                            }
                        </div>
                    </div>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No PO EPROC</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="no_po" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.eproc_number !== undefined ? props.data.eproc_number : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No PO SAP</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="no_po" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.sap_number !== undefined ? props.data.sap_number : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Header Text {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') && <span className="text-danger">*</span>}</label>
                                <div className="col-sm-10">
                                    {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') ? 
                                        <textarea onChange={(e) => handleChangeHeaderText(e)} name="header_text" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.header_text}/> : 
                                        <textarea readOnly={true} name="header_text" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.header_text}/>
                                    }
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Status</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.status_text !== undefined ? props.data.status_text : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("common:Label.document-date")}</label>
                                {(props.data.status === 'c') ? 
                                <div className="col-sm-3">
                                        {/* <input type="date" name="due_date" onChange={handleChangeDueDate} className="form-control" defaultValue={props.param_input.due_date !== undefined ? props.param_input.due_date : ''}/> */}
                                        <Datetime
                                            value={props.param_input.document_date !== undefined && props.param_input.document_date !== '' && props.param_input.document_date !== null ? moment(props.param_input.document_date).format("DD-MM-YYYY") : ''}
                                            onChange={handleChangeDocumentDate}
                                            closeOnSelect={true}
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat={false}
                                            inputProps={{ placeholder: "Document Date"}}
                                        />
                                </div> :
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="po_date" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.po_date !== undefined && props.data.po_date !== null) ? moment(props.data.po_date).format("DD-MM-YYYY") : ''} />
                                </div> 
                                }
                            </div>
                            {props.data.status === 'y' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Progress</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="progress" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.progress !== undefined && props.data.progress !== null ? props.data.progress + ' %' : ''} />
                                    </div>
                                </div>
                            }
                            {props.data.status === 'y' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Status Progress</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="status_progress" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.status_progress !== undefined ? props.data.status_progress : ''} />
                                    </div>
                                </div>
                            }
                            {(props.data.status === 'a' || props.data.status === 'n') &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Alasan Batal PO</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="note_batal_po" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.po_cancel !== undefined ? props.data.po_cancel.note : ''} />
                                    </div>
                                </div>
                            }
                            {(props.data.status === 'a' || props.data.status === 'n') &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Lampiran Batal PO</label>
                                    <div className="col-sm-10">
                                        {props.data.po_cancel !== undefined ?
                                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data.po_cancel.file )} disabled={loading}>
                                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                                            </button> :
                                            <input type="text" readOnly={true} name="lampiran" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
                                        }
                                    </div>
                                </div>
                            }
                            {props.data.status === 'n' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Catatan Approval Batal PO</label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="note_batal_po" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.po_cancel !== undefined ? props.data.po_cancel.approval_note : ''} />
                                    </div>
                                </div>
                            }
                            {props.data.status === 'o' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Batas Tanggal Review <span className="text-danger">*</span></label>
                                    <div className="col-sm-10">
                                        <input type="text" readOnly={true} name="due_date" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.due_date !== undefined ? moment(props.param_input.due_date).format("DD-MM-YYYY") : ''} />
                                    </div>
                                </div>
                            }
                            {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Batas Tanggal Review</label>
                                    <div className="col-sm-3">
                                        {/* <input type="date" name="due_date" onChange={handleChangeDueDate} className="form-control" defaultValue={props.param_input.due_date !== undefined ? props.param_input.due_date : ''}/> */}
                                        <Datetime
                                            value={props.param_input.due_date !== undefined && props.param_input.due_date !== '' ? moment(props.param_input.due_date).format("DD-MM-YYYY") : ''}
                                            onChange={handleChangeDueDate}
                                            closeOnSelect={true}
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat={false}
                                            inputProps={{ placeholder: "Due Date" }}
                                        />
                                    </div>
                                </div>
                            }
                        </Col>
                    </Row>
                    {/* <div className='row pull-right'>
                            <div className='col-sm-12 '>
                                {['c','s','y'].includes(props.data.status)===false &&
                                <button className='btn btn-sm btn-success' onClick={()=>props.modalCreateLoa()}>
                                    { props.user.has_roles.includes('KBGPNG') ? "APRROVAL LOA" : "CREATE LOA" }
                                </button>
                                }

                                {props.data.po_loa_id!==null &&
                                <button className='btn btn-sm btn-success m-l-10' onClick={()=> props.downloadGeneratePDFLOA()} disabled={props.loadings.loading_download_generate_loa}>
                                    {props.loadings.loading_download_generate_loa && <i className="fa fa-spinner fa-spin"></i>}
                                    Generate LOA
                                </button>
                                }
                            </div>
                    </div> */}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);