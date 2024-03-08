import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import moment from 'moment';

const FormChecklist = (props) => {
    // const styleLink = {
    //     "cursor" : "pointer",
    //     "color" : "green"
    // }
    const { t } = props;  
    const { register, errors, handleSubmit } = useForm({});
	const [status, setStatus] = React.useState('')
    let rows;
    const {items, data_header} = props.modalData

	const onSubmit = async data => {
        data.status = status
        data.uuid = data_header.uuid
        // console.log(data)
        // return
		props.save(data);
	};	

	const ApproveCheck = (e) => {
        if (data_header.status === 'sent') {
            setStatus('received')
        }
        else if (data_header.status === 'sent_bendahara') {
            setStatus('received_bendahara')
        }
	}

	const RejectCheck = (e) => {
        if (data_header.status === 'sent') {
            setStatus('rejected_hc')
        }
        else if (data_header.status === 'sent_bendahara') {
            setStatus('rejected_hc_bendahara')
        }
	}

    const toggleClose = (e) => {
        e.preventDefault()
        props.toggleClose()
    }

	const handleChecklist = (e, value, uuid) => {
		props.handleChecklist(e, value, uuid)
	}

	const handleCheckAll = (e) => {
        props.handleCheckAll(e, props.isCheckedAll)
	}

    const toggleOpenPreview = (e, file, url) => {
        e.preventDefault()
        props.toggleOpenPreview(e, file, url)

    }

    const mergeDocument = (e) => {
        e.preventDefault()
        props.mergeDocument()
    }

    if (items !== undefined) {
        rows = Object.keys(items).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{verticalAlign: 'middle'}}>{index+1}</td>
                    {/* {(data_header.status === 'approved_1' || data_header.status === 'rejected_hc' || data_header.status === 'approved_2' || data_header.status === 'rejected_hc_bendahara' || data_header.status ===  'received_bendahara' || data_header.status === 'paid') &&
                        <td>{index+1}</td>
                    } */}
                    <td style={{verticalAlign: 'middle'}}>{items[key]['nama_dokumen']}</td>
                    <td style={{verticalAlign: 'middle'}}>
                        {/* <span className="col-form-label" style={styleLink} onClick={(e) => toggleOpenPreview(e, items[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${items[key]['file']}`)} href="#">{items[key]['file']}</span> */}
                        <a onClick={(e) => toggleOpenPreview(e, items[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${items[key]['file']}`)} href="/#">{items[key]['file']}</a>
                        {/* <button type="button" className="btn btn-xs btn-info" onClick={ (e) => toggleOpenPreview(e, items[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${items[key]['file']}`)}> 
                            <span className="fa fa-file"></span>
                        </button> */}
                    </td>
                    {(data_header.status === 'sent' || data_header.status === 'sent_bendahara') ?
                        <td style={{verticalAlign: 'middle'}}>
                            <div className="switcher">
                                <input type="checkbox" name={"checklist["+key+"]"} id={"checklist["+key+"]"} checked={props.data_invoice.items_selected.includes(items[key].id)} onChange={(e) => handleChecklist(e, items[key], items[key].id)} />
                                <label htmlFor={"checklist["+key+"]"}></label>
                            </div>
                            <div>
                                {props.data_invoice.items_selected.includes(items[key].id) ? "Pass" : "Reject"}
                            </div>
                            {/* <input type="checkbox" name={"checklist["+key+"]"} id={"checklist["+key+"]"} checked={props.data_invoice.items_selected.includes(items[key].id)} onChange={(e) => handleChecklist(e, items[key], items[key].id)} /> */}
                        </td> :
                        // <td style={{verticalAlign: 'middle'}}>{(data_header.status === 'approved_1' || data_header.status === 'posting') ? 'Ready to Send' : items[key]['status_text']}</td>
                        <td style={{verticalAlign: 'middle'}}>{items[key].status === 'n' && items[key].status_text}</td>
                    }
                </tr>
            )
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelHeader>Lampiran Invoice</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                {(props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) && data_header.status !== 'sent' &&
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm text-nowrap">
                                                <tbody>
                                                    <tr>
                                                        <td style={{width: '10%'}}><b>No. MVP</b></td>
                                                        <td>{data_header.sap_fi}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th style={{width: '10%'}}>No</th>
                                                    {/* {(data_header.status === 'approved_1' || data_header.status === 'rejected_hc' || data_header.status === 'approved_2' || data_header.status === 'rejected_hc_bendahara' || data_header.status ===  'received_bendahara' || data_header.status === 'paid') &&
                                                        <th>No</th>
                                                    } */}
                                                    <th>Nama Dokumen</th>
                                                    <th>Lampiran</th>
                                                    {(data_header.status === 'sent' || data_header.status === 'sent_bendahara') ?
                                                        <th style={{width: '10%'}}><input style={{verticalAlign: 'middle'}} type="checkbox" name="isCheckedAll" checked={props.isCheckedAll} onChange={(e) => handleCheckAll(e)} /><span> </span>Status</th> : <th>Status</th>
                                                    }
                                                    {/* <th>Status</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="col-form-label">Catatan</label>
                                        <textarea className="form-control" name="note" ref={register({ required: false })}
                                            defaultValue={(data_header.status === 'rejected_hc' || data_header.status === 'rejected_hc_bendahara') ? data_header.note : ''}/>
                                        {errors.note && <span className="text-danger">* This field is required</span>}
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>
                </ModalBody>
                <ModalFooter>
                    {props.status_error &&
                        <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>{props.message_error}</span>
                    }
                    <button className="btn btn-info" onClick={(e) => mergeDocument(e)}>Lihat Semua Dokumen</button>
                    {items.length > 0 && !items.some(d => d.status === 'n') && (
                        ((props.user.has_roles.includes("INVER2") && props.user.has_roles.includes("BNDHRA")) && (data_header.status === 'sent' || data_header.status ===  'sent_bendahara')) ?
                            <button className="btn btn-success" type="submit" onClick={(e) => ApproveCheck(e)}>Terima Dokumen</button> : 
                        (props.user.has_roles.includes("INVER2") && data_header.status === 'sent') ?
                            <button className="btn btn-success" type="submit" onClick={(e) => ApproveCheck(e)}>Terima Dokumen</button> :
                        (props.user.has_roles.includes("BNDHRA") && data_header.status === 'sent_bendahara') ?
                            <button className="btn btn-success" type="submit" onClick={(e) => ApproveCheck(e)}>Terima Dokumen</button> : ''
                    )}
                    {items.length > 0 && items.some(d => d.status === 'n') && (
                        ((props.user.has_roles.includes("INVER2") && props.user.has_roles.includes("BNDHRA")) && (data_header.status === 'sent' || data_header.status ===  'sent_bendahara')) ?
                            <button className="btn btn-danger" type="submit" onClick={(e) => RejectCheck(e)}>Kembalikan Dokumen</button> :
                        (props.user.has_roles.includes("INVER2") && data_header.status === 'sent') ?
                            <button className="btn btn-danger" type="submit" onClick={(e) => RejectCheck(e)}>Kembalikan Dokumen</button> :
                        (props.user.has_roles.includes("BNDHRA") && data_header.status === 'sent_bendahara') ?
                            <button className="btn btn-danger" type="submit" onClick={(e) => RejectCheck(e)}>Kembalikan Dokumen</button> : ''
                    )}
                    <button className="btn btn-white" onClick={(e) => toggleClose(e)}>{t("costCenter:button.close")}</button>
                </ModalFooter>
            </div>
        </form>
    );
}

export default withTranslation()(FormChecklist);
