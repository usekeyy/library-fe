import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import {toastr} from 'react-redux-toastr';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const animatedComponents = makeAnimated();

const CreateInvoice = (props) => {
    const { t } = props;
    const [withPPN, setWithPPN] = React.useState(props.data.with_ppn !== undefined ? props.data.with_ppn : null);
    const [fakturFile, setFakturFile] = React.useState((props.data.faktur_file !== undefined && props.data.faktur_file !== null) ? props.data.faktur_file : null);
    const [fakturLampiran, setFakturLampiran] = React.useState(null);
    const [invoiceFile, setInvoiceFile] = React.useState((props.data.invoice_file !== undefined && props.data.invoice_file !== null) ? props.data.invoice_file : null);
    const [mvpFile, setMvpFile] = React.useState((props.data.mvp_file !== undefined && props.data.mvp_file !== null) ? props.data.mvp_file : null);
    const [grFile, setGrFile] = React.useState((props.data.goods_receipt_file !== undefined && props.data.goods_receipt_file !== null) ? props.data.goods_receipt_file : null);
    // const [fakturPajakNo, setFakturPajakNo] = React.useState((props.data.faktur_pajak_no === undefined) ? '' : props.data.faktur_pajak_no);
    const [changeFakturFile, setChangeFakturFile] = React.useState(false);
    const [changeInvoiceFile, setChangeInvoiceFile] = React.useState(false);
    const [changeGrFile, setChangeGrFile] = React.useState(false);
	let msg = props.errors;
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
                    setFakturLampiran(e.target.files[0])
                    setValue("faktur_file", resp.data.data.name)
                    setFakturFile(resp.data.data.name)
                    setChangeFakturFile(true)
                }
                else if (code === 'invoice') {
                    setValue("invoice_file", resp.data.data.name)
                    setInvoiceFile(resp.data.data.name)
                    setChangeInvoiceFile(true)
                }
                else if (code === 'po') {
                    props.setDocumentPO(resp.data.data.name, key)
                }
                else if (code === 'mvp') {
                    setValue("mvp_file", resp.data.data.name)
                    setMvpFile(resp.data.data.name)
                }
                else {
                    setValue("goods_receipt_file", resp.data.data.name)
                    setGrFile(resp.data.data.name)
                    setChangeGrFile(true)
                }
            })
            .catch((error) => {
                setLoading(false);
                if (code === 'faktur') {
                    // props.scanFakturPajak(e.target.files[0])
                    setFakturLampiran(null)
                    setValue("faktur_file", '')
                    setFakturFile(null)
                }
                else if (code === 'invoice') {
                    setValue("invoice_file", '')
                    setInvoiceFile(null)
                }
                else if (code === 'mvp') {
                    setValue("mvp_file", '')
                    setMvpFile(null)
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
            else if (code === 'mvp') {
                setValue("mvp_file", '')
                setMvpFile(null)
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
        props.scanFakturPajak(fakturLampiran)
    }

    // const onChange = (e) => {
    //     // let caret = e.target.selectionStart
    //     let element = e.target

    //     if (fakturPajakNo.length < element.value.length) {
    //         if (element.value.length === 3) {
    //             element.value += '.'
    //         }
    //         if (element.value.length === 7) {
    //             element.value += '-'
    //         }
    //         if (element.value.length === 10) {
    //             element.value += '.'
    //         }
    //     }
    //     else {
    //         // console.log(element.value.length)
    //         if (element.value.length === 3) {
    //             element.value = element.value.substr(0, 2)
    //         }
    //         if (element.value.length === 7) {
    //             element.value = element.value.substr(0, 6)
    //         }
    //         if (element.value.length === 10) {
    //             element.value = element.value.substr(0, 9)
    //         }
    //     }
    //     setFakturPajakNo(element.value)
    //     return
    // }

    // function handleKeyPress(e, evt)
    // {
    //     var key = evt.keyCode;

    //     // Left / Up / Right / Down Arrow, Backspace, Delete keys
    //     if (key === 37 || key === 38 || key === 39 || key === 40 || key === 8 || key === 46) {
    //         return;
    //     }
    //     else {
    //         if (evt.match(/[0-9]/)) {
    //             return
    //         }
    //         else {
    //             e.preventDefault()
    //         }
    //     }

    // }

    const paramPPN = (payload) => {
        let arr = {label: 'Tidak', value: 'n'}
        if (payload === 'y') {
            arr = {label: 'ya', value: 'y'}
        }
        return arr
    }

    const handleChangeKeterangan = (e, code, key) => {
        if (code === 'house-bank') {
            props.fetchSelectAccountId('')     
        }
        if (e === null) {
            e = []
            e.value = null
        }
        props.setOptionParamSAP(e, code, key)
    }

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
                            <a href="/" className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/tendering/${doc[key]['file']}`)} >{doc[key]['file']}</a> :
                            <a href="/" className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${doc[key]['file']}`)} >{doc[key]['file']}</a>
                        ) :
                        <a href="/" className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, doc[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${doc[key]['file']}`)} >{doc[key]['file']}</a>
                    )}</td>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center">
                        {(props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') && doc[key]['dir'] !== '/tendering' &&
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

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Invoice</PanelHeader>
                <PanelBody>
                    <Row>
                        {props.user.uuid === props.data.created_by && (props.data.status === 'draft' || props.data.status === 'rejected_1' || props.data.status === 'rejected_2') ?
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
                                                // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" ref={register({})} className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} autoComplete="off"/>
                                                <input readOnly={props.data.faktur_status !== null ? true : false} className="form-control" name="faktur_pajak_no" ref={register({})} placeholder="000.000-00.00000000" maxLength="19" defaultValue={props.data.faktur_pajak_no !== undefined ? props.data.faktur_pajak_no: ''} />
                                            }
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
                                                <input type="file" name="faktur_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'faktur')} disabled={loading} />
                                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                            </label>
                                            <span> </span>
                                            {fakturFile !== null && (changeFakturFile !== true ?
                                                <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, fakturFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${fakturFile}`)} href="/">{fakturFile}</a> :
                                                <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, fakturFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${fakturFile}`)} href="/">{fakturFile}</a>)
                                            }
                                        </div>
                                    </div>
                                }
                                <input style={{display: 'none'}} readOnly={true} type="text" name="faktur_file" ref={register({})} className="form-control" placeholder="" defaultValue={fakturFile} />
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
                                {withPPN === 'y' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Tanggal Faktur Pajak <span className="text-danger">*</span> </label>
                                    {!props.loadings.form &&
                                        (props.data.faktur_status !== null ?
                                            <div className="col-sm-4">
                                                <input readOnly={true} type="text" className="form-control" placeholder="" defaultValue={props.data.faktur_tanggal !== undefined && props.data.faktur_tanggal !== null ? moment(props.data.faktur_tanggal).format("DD-MM-YYYY") : ''} />
                                                <input style={{display: 'none'}} name="faktur_tanggal" ref={register({ required: false })} defaultValue={props.data.faktur_tanggal || ''}/>
                                            </div> :
                                            <div className="col-sm-4">
                                                <Datetime
                                                    defaultValue={props.data.faktur_tanggal !== undefined && props.data.faktur_tanggal !== null ? moment(props.data.faktur_tanggal).format("DD-MM-YYYY") : ''}
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
                                </div>
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
                                {withPPN === 'y' &&
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Status Scan Faktur Pajak </label>
                                    <div className="col-sm-4">
                                        {!props.loadings.form &&
                                            // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" ref={register({})} className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} defaultValue={props.data.faktur_pajak_no} autoComplete="off"/>
                                            <input readOnly={true} type="text" name="faktur_status" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.faktur_status !== undefined && props.data.faktur_status !== null ? props.data.faktur_status: ''} />
                                        }
                                    </div>
                                </div>
                                }
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
                                        {invoiceFile !== null && (changeInvoiceFile !== true ?
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, invoiceFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${invoiceFile}`)} href="/">{invoiceFile}</a> :
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, invoiceFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${invoiceFile}`)} href="/">{invoiceFile}</a>)
                                        }
                                    </div>
                                </div>
                                <input style={{display: 'none'}} readOnly={true} type="text" name="invoice_file" ref={register({})} className="form-control" placeholder="" defaultValue={invoiceFile} />
                                <input style={{display: 'none'}} readOnly={true} type="text" name="purchasing_group_id" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchasing_group_id} />
                                <input style={{display: 'none'}} readOnly={true} type="text" name="purchasing_org_id" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchasing_org_id} />
                                <input style={{display: 'none'}} readOnly={true} type="text" name="vendor_id" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.vendor_id} />
                                <input style={{display: 'none'}} readOnly={true} type="text" name="currency" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.currency} />
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
                                        <div className="col-sm-4">
                                            <Datetime
                                                defaultValue={props.data.invoice_date !== undefined && props.data.invoice_date !== null ? moment(props.data.invoice_date).format("DD-MM-YYYY") : ''}
                                                onChange={handleChangeInvoiceDate}
                                                closeOnSelect={true}
                                                dateFormat="DD-MM-YYYY"
                                                timeFormat={false}
                                                inputProps={{ placeholder: "DD-MM-YYYY" }}
                                            />
                                            <input style={{display: 'none'}} name="invoice_date" ref={register({ required: false })} defaultValue={props.data.invoice_date || ''}/>
                                        </div>
                                    }
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
                                            defaultValue={props.data.rekening_bank_id && { value: props.data.rekening_bank_id, label: props.data.rekening_bank_nomor_rekening + ' - ' + props.data.bank_name }}
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
                                <input style={{display: 'none'}} readOnly={true} type="text" name="purchasing_requisition_number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.purchasing_requisition_number !== undefined && props.data.purchasing_requisition_number !== null) ? distinctArray(props.data.purchasing_requisition_number.split(", ")).join(", ") : ''} />
                                <input style={{display: 'none'}} readOnly={true} type="text" name="purchase_order_number" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.purchase_order_number} />
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
                                </div>
                                {/* <input style={{display: 'none'}} readOnly={true} type="text" name="document_po_confirm" ref={register({})} className="form-control" placeholder="" defaultValue={poFile} /> */}
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
                                        <input readOnly={true} type="text" name="goods_receipt_number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.goods_receipt_number !== undefined && props.data.goods_receipt_number !== null) ? distinctArray(props.data.goods_receipt_number.split(", ")).join(", ") : ''} />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="custom-file-upload">
                                            <input type="file" name="goods_receipt_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'gr')} disabled={loading} />
                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                        </label>
                                        <span> </span>
                                        {grFile !== null && (changeGrFile !== true ?
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, grFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${grFile}`)} href="/">{grFile}</a> :
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, grFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${grFile}`)} href="/">{grFile}</a>)
                                        }
                                    </div>
                                </div>
                                <input style={{display: 'none'}} readOnly={true} type="text" name="goods_receipt_file" ref={register({})} className="form-control" placeholder="" defaultValue={grFile} />
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
                                    <label className="col-sm-2 col-form-label">Text <span className="text-danger">*</span>  </label>
                                    <div className="col-sm-4">
                                        {!props.loadings.form &&
                                            <textarea maxLength="50" readOnly={props.data.faktur_status !== null ? true : false} name="note_vendor" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.note_vendor || ''}/>
                                        }
                                    </div>
                                </div>
                            </Col> :
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
                                    {fakturFile !== null &&
                                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, fakturFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${fakturFile}`)} href="/">{fakturFile}</a>
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
                                            // <input type="text" minLength="19" maxLength="19" onKeyPress={(e) => handleKeyPress(e, e.key)} onChange={(e) => onChange(e)} name="faktur_pajak_no" ref={register({})} className="form-control" placeholder="000.000-00.00000000" value={fakturPajakNo} defaultValue={props.data.faktur_pajak_no} autoComplete="off"/>
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
                                    {invoiceFile !== null &&
                                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, invoiceFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${invoiceFile}`)} href="/">{invoiceFile}</a>
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
                                            <input readOnly={true} type="text" name="purchasing_requisition_number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.purchasing_requisition_number !== undefined && props.data.purchasing_requisition_number !== null) ? distinctArray(props.data.purchasing_requisition_number.split(", ")).join(", ") : ''} />
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
                                {/* <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Purchase Order <span className="text-danger">*</span> </label>
                                    <div className="col-sm-4">
                                        <input readOnly={true} type="text" name="purchase_order_number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.purchase_order_number !== undefined && props.data.purchase_order_number !== null) ? distinctArray(props.data.purchase_order_number.split(", ")).join(", ") : ''} />
                                    </div>
                                    {props.data.document_po_confirm !== null && (props.data.document_po_confirm.file !== null &&
                                        (props.data.purchase_order_number_eproc === null ?
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.document_po_confirm.file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.document_po_confirm.file}`)} href="/">{props.data.document_po_confirm.file}</a> :
                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.document_po_confirm.file, `${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data.document_po_confirm.file}`)} href="/">{props.data.document_po_confirm.file}</a>                                        
                                        )
                                    )}
                                </div> */}
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">GR/SA SAP</label>
                                    <div className="col-sm-4">
                                        <input readOnly={true} type="text" name="goods_receipt_number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.goods_receipt_number !== undefined && props.data.goods_receipt_number !== null) ? distinctArray(props.data.goods_receipt_number.split(", ")).join(", ") : ''} />
                                    </div>
                                    {grFile !== null &&
                                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, grFile, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${grFile}`)} href="/">{grFile}</a>
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
                                            {props.user.has_roles.includes("INVER2") && (props.data.status === 'posted') &&
                                                <label className="custom-file-upload">
                                                    <input type="file" name="mvp_attachment" ref={register({required: false})} placeholder=""  onChange={(e) => changeFile(e, 'mvp')} disabled={loading} />
                                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                                </label>
                                            }
                                            <span> </span>
                                            {props.data.mvp_file !== undefined && props.data.mvp_file !== null ?
                                                <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data.mvp_file, `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data.mvp_file}`)} href="/">{props.data.mvp_file}</a> :
                                                <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, mvpFile, `${process.env.REACT_APP_API_BASE_URL}files/temp/${mvpFile}`)} href="/">{mvpFile}</a>
                                            }
                                        </div>
                                        <input style={{display: 'none'}} readOnly={true} type="text" name="mvp_file" ref={register({})} className="form-control" placeholder="" defaultValue={mvpFile} />
                                    </div>
                                }
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Text <span className="text-danger">*</span> </label>
                                    <div className="col-sm-4">
                                        <textarea maxLength="50" readOnly={(props.user.has_roles.includes("INVER2") &&
                                            (props.data.status === 'submitted' || props.data.status === 'received' || props.data.status === 'approved_2'))
                                            ? false : true} onChange={(e) => handleChangeKeterangan(e, 'note_vendor')} name="note_vendor" className="form-control"
                                            ref={register({required: false})} placeholder="" defaultValue={props.data.note_vendor || ''}/>
                                    </div>
                                </div>
                            </Col>
                        }
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(CreateInvoice);