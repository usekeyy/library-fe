import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { formatNumber, formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';
import { toastr } from 'react-redux-toastr';

const animatedComponents = makeAnimated();

const Penalty = (props) => {
    const [loading, setLoading] = React.useState(false)
	const { control, register, handleSubmit, errors, setValue } = useForm({});
    let [lampiranPenalty, setLampiranPenalty] = React.useState(null);
    const [inputPaste, setInputPaste] = React.useState(false);
    const { t } = props;  
    let rows;

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            // let name = e.target.files[0].name
            props.upload('PRCORD', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                setLampiranPenalty(resp.data.data.name)
                // props.addTempLampiran(name, resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("file_name", '')
                setLampiranPenalty(null)
                // props.addTempLampiran('', '')
                console.log(err)
                // toastr.error(err.data.message, err.data.status)
            })    
        }else{
            // props.addTempLampiran('', '')
            setLoading(false);
        }
    }

    // const  addPenalty = (e) => {
    //     e.preventDefault()
    //     addPenalty(e)
    //     console.log('add penalty')
    //     // setValue("file_name", '')
    //     // props.addLampiranProgress()
    // }

	const onAddPenalty = async data => {
        if (data.penalty_type === undefined || data.penalty_type === null || data.penalty_type === '') {
            toastr.error('Mohon lengkapi data jenis penalty')
            return
        }
        if (parseInt(data.amount) === 0) {
            toastr.error('Nilai penalty harus lebih besar dari 0')
            return
        }

        props.addPenalty(data);
        setTimeout(() => {
            if (props.param_penalty.file === '') {
                setLampiranPenalty(null)
            }
        }, 200);
	};	

	const onSubmitPenalty = async data => {
		props.save(data);
	};	

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['penalty_type']}</td>
                    <td align="right">{formatNumber2(props.data[key]['amount'], 2)}</td>
                    <td>{props.data[key]['currency']}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>{props.data[key]['jenis_pembebanan']}</td>
                    <td>{props.data[key]['gl_account']}</td>
                    {/* <td>{props.data[key]['acc_assigment_category_number_name']}</td> */}
                    {/* <td>{props.data[key]['file']}</td> */}
                    <td>{props.data[key]['file'] !== null && props.data[key]['file'] !== '' && (
                        props.data[key]['id'] !== undefined ?
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${props.data[key]['file']}`)} href="/">lampiran</a> : 
                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, props.data[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/temp/${props.data[key]['file']}`)} href="/">lampiran</a>
                    )}
                    </td>
                    {!props.isReport &&
                        <td>
                            <button className="btn btn-xs btn-danger" value={key} onClick={(e) => props.toggleDelete(e, key, 'penalty')} ><i className="fa fa-trash"></i></button>
                        </td>
                    }
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
        old_value = props.param_penalty.amount

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
        console.log(new_value)
        props.setOption(new_value, code)
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
			<form onSubmit={handleSubmit(onAddPenalty)}>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelBody >
                            <Row>
                                <Col sm="12">
                                    <div className="form-group row">
                                        <div className="col-md-6">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>No. PO SAP</th>
                                                            <td>{props.data_header.po_sap_number} / {props.data_header.po_item_no}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>No. GR</th>
                                                            <td>{props.data_header.number_ref} / {props.data_header.item_no_ref}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Material</th>
                                                            <td>{props.data_header.material_no} - {props.data_header.short_text}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Qty</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber(props.data_header.qty, 2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Amount</th>
                                                            <td style={{textAlign: "right"}}>{formatNumber2(props.data_header.amount_value, 2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="table-responsive" style={{overflow: "visible"}}>
                                                <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{width:'1%', whiteSpace: 'nowrap'}}>Vendor</th>
                                                            <td>{props.data_header.vendor_id} - {props.data_header.vendor_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Plant</th>
                                                            <td>{props.data_header.plant}</td>
                                                        </tr>
                                                        {/* <tr>
                                                            <th>Sloc</th>
                                                            <td>{props.data_header.sloc}</td>
                                                        </tr> */}
                                                        <tr>
                                                            <th>Delivery Note</th>
                                                            <td>{props.data_header.reference}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </PanelBody>
                        <PanelHeader>Add Penalty</PanelHeader>
                        <PanelBody >
                            {!props.isReport &&
                                <div className="row">
                                    {props.loadings.loading_input_penalty && (
                                        <center>
                                        <br />
                                        <ReactLoading type="cylon" color="#0f9e3e" />
                                        <br />
                                        </center>
                                    )}
                                    {props.loadings.loading_input_penalty === false && (
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label>Jenis Penalty <span className="text-danger">*</span></label>
                                                <div>
                                                    <Controller
                                                        components={animatedComponents}
                                                        closeMenuOnSelect={true}
                                                        as={Select}
                                                        control={control}
                                                        options={props.data_option.m_penalty_type}
                                                        inputRef={(e) => register({ name: "penalty_type", required: false })}
                                                        name="penalty_type"
                                                        placeholder={ t("common:Select.Pilih") }
                                                        // isLoading={loadings.penalty_type}
                                                        rules={{ required: false }}
                                                    />
                                                </div>
                                                {errors.penalty_type && <span className="text-danger"> {errors.penalty_type.type === "required" ? "Field harus diisi" : ''}  {errors.penalty_type.message} </span>}
                                                {props.errors.penalty_type && <span className="text-danger">{props.errors.penalty_type[0]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Nilai <span className="text-danger">*</span></label>
                                                <input className="form-control" style={{width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                                    onChange={(e) => onChange(e, 'amount')} name={"amount"} ref={register({ required: false })} value={formatNumber2(props.param_penalty.amount, 2)}/>
                                                {/* <input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                                    className={(errors.amount || props.errors.amount) ? "form-control is-invalid" : "form-control"} name="amount" ref={register({ required: false })} defaultValue={props.param_penalty.amount || ''} /> */}
                                                {errors.amount && <span className="text-danger"> {errors.amount.type === "required" ? "Field harus diisi" : ''}  {errors.amount.message} </span>}
                                                {props.errors.amount && <span className="text-danger">{props.errors.amount[0]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Curr <span className="text-danger">*</span></label>
                                                <input readOnly={true} className={(errors.currency || props.errors.currency) ? "form-control is-invalid" : "form-control"} name="currency" ref={register({ required: false })} defaultValue={props.data_header.currency || ''} />
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">Deskripsi <span className="text-danger">*</span></label>
                                                <textarea className={errors.content ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: false })} defaultValue={props.param_penalty.description || ''}/>
                                                {errors.description && <span className="text-danger">{errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message}</span>}
                                                {props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Lampiran</label>
                                                <div className="form-group row">
                                                    <input type="text" style={{display: 'none'}} className="form-control" name="file_name" ref={register({required: false})} readOnly={true}/>
                                                    <div className="col-md-12">
                                                        <label className="custom-file-upload">
                                                            <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                            <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                                        </label>
                                                        <span> </span>
                                                        {lampiranPenalty !== null &&
                                                            <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, lampiranPenalty, `${process.env.REACT_APP_API_BASE_URL}files/temp/${lampiranPenalty}`)} href="/">{lampiranPenalty}</a>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="form-group">
                                                <label>Pembebanan <span className="text-danger">*</span></label>
                                                <div>
                                                    <Controller
                                                        components={animatedComponents}
                                                        defaultValue={props.param_penalty.jenis_pembebanan}
                                                        closeMenuOnSelect={true}
                                                        as={Select}
                                                        control={control}
                                                        // onChange={([selected]) => {
                                                        //     changePembebanan(selected)
                                                        //     return selected
                                                        // }}
                                                        options={props.data_option.m_jenis_pembebanan}
                                                        inputRef={(e) => register({ name: "jenis_pembebanan", required: false })}
                                                        name="jenis_pembebanan"
                                                        placeholder={ t("common:Select.Pilih") }
                                                        // isLoading={loadings.jenis_pembebanan}
                                                        rules={{ required: false }}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="form-group">
                                                <label>Pembebanan <span className="text-danger">*</span></label>
                                                <input readOnly={true} className={(errors.jenis_pembebanan || props.errors.jenis_pembebanan) ? "form-control is-invalid" : "form-control"} name="jenis_pembebanan" ref={register({ required: false })} defaultValue={"Non Inventory"} />
                                            </div>
                                            <div className="form-group">
                                                <label>GL Account <span className="text-danger">*</span></label>
                                                <input readOnly={true} className={(errors.gl_account || props.errors.gl_account) ? "form-control is-invalid" : "form-control"} name="gl_account" ref={register({ required: false })} defaultValue={props.data_header.vendor_sap_code !== null ? (props.data_header.vendor_sap_code.charAt(0) === '4' ? '419940200' : '419940100') : '419940100'} />
                                            </div>
                                            {/* <div className="form-group">
                                                <label>GL Account <span className="text-danger">*</span></label>
                                                <Controller
                                                    components={animatedComponents}
                                                    isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                                    closeMenuOnSelect={true}
                                                    as={Select}
                                                    control={control}
                                                    options={props.data_option.m_gl_account}
                                                    onInputChange={onInputChangeGlAccount}
                                                    name="gl_account"
                                                    defaultValue={props.param_penalty.gl_account}
                                                    isClearable
                                                    isLoading={props.loadings.gl_account_id}
                                                    rules={{ required: false }}
                                                />
                                            </div> */}
                                        </div>
                                    )}
                                </div>
                            }
                            {!props.isReport &&
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <button className="btn btn-success" type="submit">Add</button>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row">
                                {props.loadings.loading_list_penalty && (
                                    <center>
                                    <br />
                                    <ReactLoading type="cylon" color="#0f9e3e" />
                                    <br />
                                    </center>
                                )}
                                {props.loadings.loading_list_penalty === false &&
                                    <div className="col-sm-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th style={{widht:"1%"}}>No</th>
                                                        <th>Jenis Penalty</th>
                                                        <th>Nilai</th>
                                                        <th>Curr</th>
                                                        <th>Deskripsi</th>
                                                        <th>Pembebanan</th>
                                                        <th>GL Account</th>
                                                        {/* <th>Acc. Assgnmt</th>
                                                        <th>Obj. Acc. Assgnmt</th> */}
                                                        <th>Lampiran</th>
                                                        {!props.isReport &&
                                                            <th>Action</th>
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>{rows}</tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                            </div>
                        </PanelBody>
                    </Panel>
                </ModalBody>
            </form>
            <ModalFooter>
            <form onSubmit={handleSubmit(onSubmitPenalty)}>
                <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                    {/* {props.status_detail_item.delivery_date && "* Mohon pilih Delivery Date"}
                    {props.status_detail_item.tax && "* Mohon Pilih Tax"} */}
                </span>
                {!props.isReport &&
                    <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button>
                }
                <button className="btn btn-white" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
            </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Penalty);
