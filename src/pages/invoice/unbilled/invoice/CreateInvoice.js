import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const animatedComponents = makeAnimated();

const CreateInvoice = (props) => {
    const { t } = props;
    const [withPPN, setWithPPN] = React.useState((props.data.with_ppn !== undefined && props.data.with_ppn.value !== undefined) ? props.data.with_ppn.value : null);
    const [fakturFile, setFakturFile] = React.useState((props.data.faktur_file !== undefined && props.data.faktur_file !== '') ? props.data.faktur_file : null);
    const [fakturLampiran, setFakturLampiran] = React.useState(null);
    const [invoiceFile, setInvoiceFile] = React.useState((props.data.invoice_file !== undefined && props.data.invoice_file !== '') ? props.data.invoice_file : null);
    const [grFile, setGrFile] = React.useState((props.data.goods_receipt_file !== undefined && props.data.goods_receipt_file !== '') ? props.data.goods_receipt_file : null);
    // const [poFile, setPoFile] = React.useState((props.data.document_po_confirm !== undefined && props.data.document_po_confirm !== '') ? props.data.document_po_confirm : null);
    // const [fakturPajakNo, setFakturPajakNo] = React.useState((props.data.faktur_pajak_no === undefined) ? '' : props.data.faktur_pajak_no);
    const [inputPaste, setInputPaste] = React.useState(false);
	let msg = props.errors;
    const inputRight = {
        textAlign: 'right',
    };
    const styleLink = {
        "cursor" : "pointer",
        "color" : "green"
    }
    const [loading, setLoading] = React.useState(false)
    const { control, register, errors, setValue } = useFormContext();
    
    const changeFile = (e, code, key) => {
        e.persist()
        setLoading(!loading);
        if (e.target.files[0]){
            props.upload('INVDOC', e.target.files[0])
            .then((resp) => {
                // let name = resp.data.data.name
                setLoading(false);
                if (code === 'faktur') {
                    // props.scanFakturPajak(e.target.files[0])
                    setFakturLampiran(e.target.files[0])
                    setValue("faktur_file", resp.data.data.name)
                    setFakturFile(resp.data.data.name)
                }
                else if (code === 'invoice') {
                    setValue("invoice_file", resp.data.data.name)
                    setInvoiceFile(resp.data.data.name)
                }
                else if (code === 'po') {
                    props.setDocumentPO(resp.data.data.name, key)
                    // setValue("document_po_confirm", resp.data.data.name)
                    // setPoFile(resp.data.data.name)
                }
                else {
                    setValue("goods_receipt_file", resp.data.data.name)
                    setGrFile(resp.data.data.name)
                }
            })
            .catch((error) => {
                setLoading(false);
                if (code === 'faktur') {
                    setFakturLampiran(null)
                    setValue("faktur_file", '')
                    setFakturFile(null)
                }
                else if (code === 'invoice') {
                    setValue("invoice_file", '')
                    setInvoiceFile(null)
                }
                else if (code === 'po') {
                    props.setDocumentPO(null, key)
                }
                else {
                    setValue("goods_receipt_file", '')
                    setGrFile(null)
                }
                Object.keys(error.data.errors).map(function (key, index) {
                    toastr.error(error.data.errors[key])
                    return true
                })
                // toastr.error(err.data.message, err.data.status)
            })    
        }else{
            if (code === 'faktur') {
                setFakturLampiran(null)
                setValue("faktur_file", '')
                setFakturFile(null)
            }
            else if (code === 'invoice') {
                setValue("invoice_file", '')
                setInvoiceFile(null)
            }
            else if (code === 'po') {
                props.setDocumentPO(null, key)
            }
            else {
                setValue("goods_receipt_file", '')
                setGrFile(null)
            }
            setLoading(false);
        }
    }

    const handleChangeInvoiceDate = (e) => {
        const date = formattingDate(e)
        setValue('invoice_date', date)
	}

    const handleChangeFakturPajakDate = (e) => {
        const date = formattingDate(e)
        setValue('faktur_tanggal', date)
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

    const onInputChangeBank = (option, { action }) => {
		if (action === "input-change") {
			props.fetchBank(option)
		}
		if (action === "set-value") {
			props.fetchBank('')
		}
	};

    const changePPN = (selected) => {
        // delete props.data_item.account_category_id
        if (selected !== null) {
            props.setWithPPN(selected.value)
            setWithPPN(selected.value)
            // props.changeAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setWithPPN(null)
        }
    }

    const scanFaktur = (e) => {
        e.preventDefault()
        if (fakturLampiran === null) {
            toastr.error("mohon upload lampiran baru terlebih dahulu, sebelum melakukan scan")
            // alert("mohon upload lampiran baru terlebih dahulu, sebelum melakukan scan")
        }
        else {
            props.scanFakturPajak(fakturLampiran)
        }
    }

    const paramPPN = (payload) => {
        let arr = {label: 'Tidak', value: 'n'}
        if (payload === 'y') {
            arr = {label: 'ya', value: 'y'}
        }
        return arr
    }

    let rows
    if (props.data.document_po_confirm.length > 0) {
        let doc = props.data.document_po_confirm
        // console.log(props.data)
        rows = Object.keys(doc).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center">{doc[key]['po_sap_number']}</td>
                    <td style={{verticalAlign:'middle'}} align="center">{doc[key]['file'] !== null && (
                        doc[key]['po_id'] !== null ? 
                        <span className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/tendering/${doc[key]['file']}`)} style={styleLink}>{doc[key]['file']}</span> :
                        <span className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${doc[key]['file']}`)} style={styleLink}>{doc[key]['file']}</span>
                    )}</td>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center">
                        {doc[key]['po_id'] === null &&
                            <label className="custom-file-upload m-b-0">
                                <input type="file" name={"po_attachment-"+key} ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'po', key)} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                            </label>
                        }
                    </td>
                </tr>
            )
        });
    }

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e, code) => {
        let caret = e.target.selectionStart
        let element = e.target        
        let new_value = element.value
        let old_value = 0
        if (code !== '') {
            old_value = props.data[code]
        }

        if (inputPaste) {
            new_value = formatNumber2(replaceAll(replaceAll(new_value, '.', ''), ',', '.'), 2)
            if (caret < new_value.length) {
                caret += 1
            }
        }
        else {
            let return_calculate = calculateFormatCurrency(element.value, old_value, caret, 2)
            caret = return_calculate.caret
            new_value = return_calculate.new_value
        }

        window.requestAnimationFrame(() => {
            element.selectionStart = caret
            element.selectionEnd = caret
        })
        setInputPaste(false)
        props.setValue(new_value, code)
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

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Create Invoice</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">PPN <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onChange={([selected]) => {
                                            changePPN(selected)
                                            return selected
                                        }}
                                        options={props.param_option.m_ppn}
                                        inputRef={(e) => register({ name: "with_ppn", required: false })}
                                        name="with_ppn"
                                        defaultValue={paramPPN(props.data.with_ppn)}
                                        placeholder={ t("common:Select.Pilih") + " PPN" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                    />
                                </div>
                            </div>
                            {errors.with_ppn &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.with_ppn &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.with_ppn[0]} </span>
                                    </div>
                                </div>
                            }
                            {withPPN === 'y' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">No Faktur Pajak <span className="text-danger">*</span> </label>
                                    <div className="col-sm-4">
                                        {!props.loadings.form &&
                                            // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" ref={register({})} className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} defaultValue={props.data.faktur_pajak_no} autoComplete="off"/>
                                            <input readOnly={props.data.faktur_status !== null ? true : false} className="form-control" maxLength="19" name="faktur_pajak_no" ref={register({})} placeholder="000.000-00.00000000" defaultValue={props.data.faktur_pajak_no !== undefined ? props.data.faktur_pajak_no: ''} />
                                        }
                                        {/* <span className="text" style={{paddingTop: "8px", paddingLeft: "13px"}}> 000.000-00.00000000</span> */}
                                        <button
                                            type="button"
                                            onClick={(e) => scanFaktur(e)}
                                            disabled={props.loadingSubmit}
                                            className="btn btn-white m-t-5">{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Scan Faktur Pajak</button>
                                        <button
                                            type="button"
                                            onClick={(e) => props.resetScanFakturPajak(e)}
                                            disabled={props.loadingSubmit}
                                            className="btn btn-white m-t-5">{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Reset Hasil Scan</button>
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="custom-file-upload">
                                            <input type="file" name="faktur_attachment" ref={register({required: false})} placeholder="" onChange={(e) => changeFile(e, 'faktur')} disabled={loading} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                        </label>
                                        <span> </span>
                                        {fakturFile !== null &&
                                            <span className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, fakturFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${fakturFile}`)} style={styleLink}>{fakturFile}</span>
                                        }
                                    </div>
                                </div>
                            }
                            <input style={{display: 'none'}} type="text" className="form-control" name="faktur_file" ref={register({required: false})} disabled={true}/>
                            {errors.faktur_pajak_no &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.faktur_pajak_no &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.faktur_pajak_no[0]} </span>
                                    </div>
                                </div>
                            }
                            {errors.faktur_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.faktur_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.faktur_file[0]} </span>
                                    </div>
                                </div>
                            }
                            {withPPN === 'y' ?
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Tanggal Faktur Pajak <span className="text-danger">*</span> </label>
                                    {!props.loadings.form &&
                                        (props.data.faktur_status !== null ?
                                            <div className="col-sm-4">
                                                <input readOnly={true} type="text" className="form-control" placeholder="" defaultValue={props.data.faktur_tanggal !== undefined && props.data.faktur_tanggal !== '' ? moment(props.data.faktur_tanggal).format("DD-MM-YYYY") : ''} />
                                                <input style={{display: 'none'}} name="faktur_tanggal" ref={register({ required: false })} defaultValue={props.data.faktur_tanggal || ''}/>
                                            </div>
                                        :
                                            <div className="col-sm-4">
                                                <Datetime
                                                    value={props.data.faktur_tanggal !== undefined && props.data.faktur_tanggal !== '' ? moment(props.data.faktur_tanggal).format("DD-MM-YYYY") : ''}
                                                    onChange={handleChangeFakturPajakDate}
                                                    closeOnSelect={true}
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat={false}
                                                    inputProps={{ placeholder: "DD-MM-YYYY" }}
                                                />
                                                <input style={{display: 'none'}} name="faktur_tanggal" ref={register({ required: false })} defaultValue={props.data.faktur_tanggal || ''}/>
                                            </div>
                                        )
                                    }
                                </div> :
                                <input style={{display: 'none'}} name="faktur_tanggal" ref={register({ required: false })}/>
                            }
                            {errors.faktur_tanggal &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.faktur_tanggal &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.faktur_tanggal[0]} </span>
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Status </label>
                                
                                <div className="col-sm-4">
                                    {!props.loadings.form &&
                                        // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" ref={register({})} className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} defaultValue={props.data.faktur_pajak_no} autoComplete="off"/>
                                        <input readOnly={true} type="text" name="faktur_status" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.faktur_status !== undefined && props.data.faktur_status !== null ? props.data.faktur_status: ''} />
                                    }
                                 </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">No Invoice <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    {!props.loadings.form &&
                                        <input className="form-control" name="number" ref={register({})} placeholder="" defaultValue={props.data.number !== undefined ? props.data.number: ''} />
                                    }
                                </div>
                                <div className="col-sm-6">
                                    <label className="custom-file-upload">
                                        <input type="file" name="invoice_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'invoice')} disabled={loading} />
                                        <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                    </label>
                                    <span> </span>
                                    {invoiceFile !== null &&
                                        <span className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, invoiceFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${invoiceFile}`)} style={styleLink}>{invoiceFile}</span>
                                    }
                                </div>
                            </div>
                            <input style={{display: 'none'}} type="text" className="form-control" name="invoice_file" ref={register({required: false})} disabled={true}/>
                            {errors.number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.number[0]} </span>
                                    </div>
                                </div>
                            }
                            {errors.invoice_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.invoice_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.invoice_file[0]} </span>
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Tanggal Invoice <span className="text-danger">*</span> </label>
                                {!props.loadings.form &&
                                        (props.data.invoice_date ?
                                            <div className="col-sm-4">
                                                <input readOnly={true} type="text" className="form-control" placeholder="" defaultValue={props.data.invoice_date !== undefined && props.data.invoice_date !== '' ? moment(props.data.invoice_date).format("DD-MM-YYYY") : ''} />
                                                <input style={{display: 'none'}} name="invoice_date" ref={register({ required: false })} defaultValue={props.data.invoice_date || ''}/>
                                            </div>
                                        :
                                            <div className="col-sm-4">
                                                <Datetime
                                                    value={props.data.invoice_date !== undefined && props.data.invoice_date !== '' ? moment(props.data.invoice_date).format("DD-MM-YYYY") : ''}
                                                    onChange={handleChangeInvoiceDate}
                                                    closeOnSelect={true}
                                                    dateFormat="DD-MM-YYYY"
                                                    timeFormat={false}
                                                    inputProps={{ placeholder: "DD-MM-YYYY" }}
                                                />
                                                <input style={{display: 'none'}} name="invoice_date" ref={register({ required: false })}/>
                                            </div>) }
                            </div>
                            {errors.invoice_date &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.invoice_date &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.invoice_date[0]} </span>
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Bank <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onInputChange={onInputChangeBank}
                                        options={props.param_option.m_bank}
                                        inputRef={(e) => register({ name: "rekening_bank_id", required: false })}
                                        name="rekening_bank_id"
                                        defaultValue={props.data.rekening_bank_id || '' }
                                        placeholder={ t("common:Select.Pilih") + " Bank" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                    />
                                </div>
                            </div>
                            {errors.rekening_bank_id &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.rekening_bank_id &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.rekening_bank_id[0]} </span>
                                    </div>
                                </div>
                            }
                            <input style={{display: 'none'}} readOnly={true} type="text" name="purchasing_requisition_number" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchasing_requisition_number !== undefined ? props.data.purchasing_requisition_number: ''} />
                            {errors.purchasing_requisition_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.purchasing_requisition_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.purchasing_requisition_number[0]} </span>
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
                                <input style={{display: 'none'}} readOnly={true} type="text" name="purchase_order_number" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchase_order_number} />
                                {/* <div className="col-sm-4">
                                    <input readOnly={true} type="text" name="purchase_order_number" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchase_order_number !== undefined ? props.data.purchase_order_number: ''} />
                                </div>
                                <div className="col-sm-6">
                                    {props.data.purchase_order_eproc_number === null &&
                                        <label className="custom-file-upload">
                                            <input type="file" name="purchase_order_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'po')} disabled={loading} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                        </label>
                                    }
                                    <span> </span>
                                    {props.data.purchase_order_eproc_number !== null ?
                                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, poFile, `${process.env.REACT_APP_API_BASE_URL}files/tendering/${poFile}`)} style={styleLink}>{poFile}</a> :
                                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, poFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${poFile}`)} style={styleLink}>{poFile}</a>
                                    }
                                </div> */}
                            </div>
                            {/* <input style={{display: 'none'}} readOnly={true} type="text" name="document_po_confirm" ref={register({})} className="form-control" placeholder="" defaultValue={poFile || ''} /> */}
                            {errors.purchase_order_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.purchase_order_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.purchase_order_number[0]} </span>
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">GR/SA SAP <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} type="text" name="goods_receipt_number" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.goods_receipt_number !== undefined ? props.data.goods_receipt_number: ''} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="custom-file-upload">
                                        <input type="file" name="goods_receipt_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'gr')} disabled={loading} />
                                        <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                    </label>
                                    <span> </span>
                                    {grFile !== null &&
                                        <span className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, grFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${grFile}`)} style={styleLink}>{grFile}</span>
                                    }
                                </div>
                            </div>
                            <input style={{display: 'none'}} readOnly={true} type="text" name="goods_receipt_file" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.goods_receipt_file !== undefined ? props.data.goods_receipt_file: ''} />
                            {errors.goods_receipt_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.goods_receipt_number &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.goods_receipt_number[0]} </span>
                                    </div>
                                </div>
                            }
                            {errors.goods_receipt_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger">* This field is required</span>
                                    </div>
                                </div>
                            }
                            {msg.goods_receipt_file &&
                                <div className="form-group row">
                                    <div className="col-sm-2"></div>
                                    <div className="col-sm-4">
                                        <span className="text-danger"> {msg.faktur_file[0]} </span>
                                    </div>
                                </div>
                            }
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Text <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    {!props.loadings.form &&
                                        <textarea maxLength="50" readOnly={props.data.faktur_status !== null ? true : false} name="note_vendor" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.note_vendor || ''}/>
                                    }
                                </div>
                            </div>
                            <br></br>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Amount </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="amount" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.amount, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Additional Cost </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="total_add_cost" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.total_add_cost, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">DPP Amount </label>
                                <div className="col-sm-4">
                                    <input className="form-control" maxLength="22" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste}
                                        onChange={(e) => onChange(e, 'dpp_amount')} name={"dpp_amount"} ref={register({})} value={formatNumber2(props.data.dpp_amount, 2)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">PPN </label>
                                <div className="col-sm-4">
                                    <input className="form-control" maxLength="22" style={{textAlign: 'right', width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste}
                                        onChange={(e) => onChange(e, 'ppn_amount')} name={"ppn_amount"} ref={register({})} value={formatNumber2(props.data.ppn_amount, 2)}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Penalty & Additional Expense </label>
                                <div className="col-sm-4">
                                    {parseFloat(props.data.potongan) > 0 ?
                                        <input readOnly={true} style={{textAlign: 'right', color:"red"}} type="text" className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} /> :
                                    parseFloat(props.data.potongan) < 0 ?
                                        <input readOnly={true} style={inputRight} type="text" className="form-control" placeholder="" value={formatNumber2((props.data.potongan.toString()).substring(1), 2)} /> : 
                                        <input readOnly={true} style={inputRight} type="text" className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} />
                                    }
                                    <input type="text" readOnly={true} style={{display: 'none'}} name="potongan" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.potongan, 2)} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Total </label>
                                <div className="col-sm-4">
                                    <input readOnly={true} style={inputRight} type="text" name="total" ref={register({})} className="form-control" placeholder="" value={formatNumber2(props.data.total, 2)} />
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