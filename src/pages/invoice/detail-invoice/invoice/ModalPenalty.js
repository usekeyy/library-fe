import React from 'react';
import { useForm, Controller } from 'react-hook-form';
// import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { formatNumber2, replaceAll, calculateFormatCurrency } from '../../../../helpers/formatNumber';

const animatedComponents = makeAnimated();

const ModalPenalty = (props) => {
    let [amount, setAmount] = React.useState(props.param_modal.amount || '0');
    let [accAssgCategory, setAccAssgCategory] = React.useState(props.param_modal.ass_category !== undefined ? props.param_modal.ass_category.value : null);
    // let [jenis_pembebanan, setPembebanan] = React.useState('Non Inventory');
		const jenis_pembebanan = 'Non Inventory';
    let [lampiranPenalty, setLampiranPenalty] = React.useState(props.param_modal.file || null);
    const [inputPaste, setInputPaste] = React.useState(false);
	// let {loadings} = props;
    const [loading, setLoading] = React.useState(false)
	const { control, register, handleSubmit, errors, setValue } = useForm({});
    const { t } = props;  

    const toggleOpenPreview = (e, file, url) => {
        // e.preventDefault()
        props.toggleOpenPreview(e, file, url)
    }

    // const changePembebanan = (selected) => {
    //     // delete props.data_item.account_category_id
    //     if (selected !== null) {
    //         setPembebanan(selected.value)
    //         if (selected.value === 'Non Inventory') {
    //             setAccAssgCategory(null)
    //             setValue("gl_account", [])
    //             setValue("ass_category", [])
    //             setValue("object", [])
    //         }
    //         // props.changeAccAssgCategory(selected.value)
    //         // alert(selected.value)
    //     } else {
    //         setPembebanan(null)
    //     }
    // }

    const changeAccAssgCategory = (selected) => {
        // delete props.data_item.account_category_id
        if (selected !== null) {
            setAccAssgCategory(selected.value)
            // props.changeAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setAccAssgCategory(null)
        }
    }

    const onInputAccAssgCategory = (option, { action }) => {
		if (action === "input-change") {
			props.fetchAccAssignmentCategory(option)
		}
		if (action === "set-value") {
			props.fetchAccAssignmentCategory('')
		}
    };

    const onInputChangeProfitCenter = (option, { action }) => {
        if (action === "input-change") {
            props.fetchProfitCenter(option)
        }
		if (action === "set-value") {
			props.fetchProfitCenter('')
		}
    };

    const onInputChangeCostCenter = (option, { action }) => {
        if (action === "input-change") {
            props.fetchCostCenter(option)
        }
		if (action === "set-value") {
			props.fetchCostCenter('')
		}
    };

    const onInputChangeGlAccount = (option, { action }) => {
		if (action === "input-change") {
			props.fetchGlAccount(option)
		}
		if (action === "set-value") {
			props.fetchGlAccount('')
		}
    };

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

	const onAddPenalty = async data => {
		props.addPenalty(data);
	};	

	const onSubmitPenalty = async data => {
        props.createPenalty(data);
	};

    const handlePaste = (event) => {
        setInputPaste(true)
    }

    const onChange = (e) => {
        let caret = e.target.selectionStart
        let element = e.target
        let new_value = element.value
        let old_value = replaceAll(amount, ',', '.')

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
        setAmount(parseFloat(replaceAll(replaceAll(new_value, '.', ''), ',', '.')).toFixed(2))
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

    const toggleClose = (e) => {
        e.preventDefault()
        props.toggleClose(e)
    }

    return (
        <div>
			<form onSubmit={handleSubmit(onAddPenalty)}>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelHeader>Add Penalty</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                <div className="col-sm-12">
                                    <input style={{display: 'none'}} name="id" ref={register({ required: false })} defaultValue={props.param_modal.id || ''} />
                                    <div className="form-group">
                                        <label>{props.param_modal.code === 'item' ? 'Item GR/SA' : 'Additional Cost'} <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_item}
                                                defaultValue={props.param_modal.invoice_item_id || []}
                                                inputRef={(e) => register({ name: "invoice_item_id", required: true })}
                                                name="invoice_item_id"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.penalty_type}
                                                rules={{ required: true }}
                                            />
                                            {errors.invoice_item_id && <span className="text-danger">{errors.invoice_item_id.type === "required" ? "Field harus diisi" : ''}  {errors.invoice_item_id.message}</span>}
                                            {props.errors.invoice_item_id && <span className="text-danger">{props.errors.invoice_item_id[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Jenis Penalty <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_penalty_type}
                                                defaultValue={props.param_modal.penalty_type || []}
                                                inputRef={(e) => register({ name: "penalty_type", required: true })}
                                                name="penalty_type"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.penalty_type}
                                                rules={{ required: true }}
                                            />
                                            {errors.penalty_type && <span className="text-danger">{errors.penalty_type.type === "required" ? "Field harus diisi" : ''}  {errors.penalty_type.message}</span>}
                                            {props.errors.penalty_type && <span className="text-danger">{props.errors.penalty_type[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Debit Credit</label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_debit_credit}
                                                defaultValue={props.param_modal.debit_credit || []}
                                                inputRef={(e) => register({ name: "debit_credit", required: false })}
                                                name="debit_credit"
                                                placeholder={ t("common:Select.Pilih") + ' Debit/Credit'}
                                                // isLoading={loadings.penalty_type}
                                                rules={{ required: false }}
                                            />
                                            {errors.debit_credit && <span className="text-danger">{errors.debit_credit.type === "required" ? "Field harus diisi" : ''}  {errors.debit_credit.message}</span>}
                                            {props.errors.debit_credit && <span className="text-danger">{props.errors.debit_credit[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Nilai <span className="text-danger">*</span></label>
                                        <input maxLength="22" className="form-control" style={{width: '100%'}} onKeyPress={(e) => handleKeyPress(e, e.key)} onPaste={handlePaste} autoComplete="off"
                                            onChange={(e) => onChange(e)} name={"amount"} ref={register({ required: false })} value={formatNumber2(amount, 2)}/>
                                        {/* <input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                            className={(errors.amount || props.errors.amount) ? "form-control is-invalid" : "form-control"} name="amount" ref={register({ required: true })}/> */}
                                        {errors.amount && <span className="text-danger"> {errors.amount.type === "required" ? "Field harus diisi" : ''}  {errors.amount.message} </span>}
                                        {props.errors.amount && <span className="text-danger">{props.errors.amount[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Curr <span className="text-danger">*</span></label>
                                        <input disabled={true} className={(errors.currency || props.errors.currency) ? "form-control is-invalid" : "form-control"} name="currency" ref={register({ required: false })} defaultValue={props.data.items.length > 0 ? props.data.items[0].currency : props.data.currency} />
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label">Deskripsi <span className="text-danger">*</span></label>
                                        <textarea className={errors.content ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })} defaultValue={props.param_modal.description || ''}/>
                                        {errors.description && <span className="text-danger">{errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message}</span>}
                                        {props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Lampiran</label>
                                        <div className="form-group row">
                                            <input type="text" style={{display: 'none'}} className="form-control" name="file_name" ref={register({required: false})} disabled={true} defaultValue={props.param_modal.file || ''}/>
                                            <div className="col-md-12">
                                                <label className="custom-file-upload">
                                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                                </label>
                                                <span> </span>
                                                {lampiranPenalty !== null &&
                                                    <a className="col-form-label" onClick={(e) => toggleOpenPreview(e, lampiranPenalty, `${process.env.REACT_APP_API_BASE_URL}files/temp/${lampiranPenalty}`)} href="/">{lampiranPenalty}</a>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Pembebanan <span className="text-danger">*</span></label>
                                        <input disabled={true} className="form-control" name="jenis_pembebanan" ref={register({ required: false })} defaultValue="Non Inventory" />
                                    </div>
                                    {/* <div className="form-group">
                                        <label>Pembebanan <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                onChange={([selected]) => {
                                                    changePembebanan(selected)
                                                    return selected
                                                }}
                                                options={props.data_option.m_jenis_pembebanan}
                                                inputRef={(e) => register({ name: "jenis_pembebanan", required: true })}
                                                name="jenis_pembebanan"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.jenis_pembebanan}
                                                rules={{ required: true }}
                                            />
                                            {errors.jenis_pembebanan && <span className="text-danger">{errors.jenis_pembebanan.type === "required" ? "Field harus diisi" : ''}  {errors.jenis_pembebanan.message}</span>}
                                            {props.errors.jenis_pembebanan && <span className="text-danger">{props.errors.jenis_pembebanan[0]}</span>}
                                        </div>
                                    </div> */}
                                    <div className="form-group">
                                        <label>G/L Account <span className="text-danger">*</span></label>
                                        <Controller
                                            components={animatedComponents}
                                            // isDisabled={jenis_pembebanan === 'Non Inventory' ? false : true}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.data_option.m_gl_account}
                                            defaultValue={props.param_modal.gl_account || []}
                                            onInputChange={onInputChangeGlAccount}
                                            name="gl_account"
                                            isClearable
                                            isLoading={props.loadings.gl_account_id}
                                            inputRef={(e) => register({ name: "gl_account", required: true })}
                                            rules={{ required: true }}
                                        />
                                        {errors.gl_account && <span className="text-danger">{errors.gl_account.type === "required" ? "Field harus diisi" : ''}  {errors.gl_account.message}</span>}
                                        {props.errors.gl_account && <span className="text-danger">{props.errors.gl_account[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Account Assignment</label>
                                        <Controller
                                            components={animatedComponents}
                                            isDisabled={jenis_pembebanan === 'Non Inventory' ? false : true}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.data_option.m_acc_assgn_category}
                                            defaultValue={props.param_modal.ass_category || []}
                                            name="ass_category"
                                            isLoading={props.loadings.acc_assgn_category}
                                            onInputChange={onInputAccAssgCategory}
                                            onChange={([selected]) => {
                                                changeAccAssgCategory(selected)
                                                return selected
                                            }}
                                            isClearable
                                            rules={{ required: false }}
                                        />
                                        {errors.ass_category && <span className="text-danger">{errors.ass_category.type === "required" ? "Field harus diisi" : ''}  {errors.ass_category.message}</span>}
                                        {props.errors.ass_category && <span className="text-danger">{props.errors.ass_category[0]}</span>}
                                    </div>
                                    {(accAssgCategory === "F" || accAssgCategory === "N" || accAssgCategory === "P" || accAssgCategory === "Q") &&
                                        <div className="form-group">
                                            <label >{(accAssgCategory === "P" || accAssgCategory === "Q") ? 'WBS Element' : 'Order'}</label>
                                            <input type="text" disabled={jenis_pembebanan === 'Non Inventory' ? false : true} name="object" ref={register({ required: accAssgCategory !== null ? true : false })} className="form-control" placeholder="" defaultValue={props.param_modal.object || ''} />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }

                                    {accAssgCategory === "T" &&
                                        <div className="form-group">
                                            <label >Profit Center</label>
                                            <Controller
                                                components={animatedComponents}
                                                isDisabled={jenis_pembebanan === 'Non Inventory' ? false : true}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_profit_center}
                                                defaultValue={props.param_modal.object || []}
                                                name="object"
                                                isLoading={props.loadings.profit_center_id}
                                                onInputChange={onInputChangeProfitCenter}
                                                isClearable
                                                rules={{ required: accAssgCategory !== null ? true : false }}
                                            />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }

                                    {accAssgCategory === "K" &&
                                        <div className="form-group">
                                            <label >Cost Center</label>
                                            <Controller
                                                components={animatedComponents}
                                                isDisabled={jenis_pembebanan === 'Non Inventory' ? false : true}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_cost_center}
                                                defaultValue={props.param_modal.object || []}
                                                name="object"
                                                isLoading={props.loadings.cost_center_id}
                                                onInputChange={onInputChangeCostCenter}
                                                isClearable
                                                rules={{ required: accAssgCategory !== null ? true : false }}
                                            />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }
                                </div>
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
                <button className="btn btn-success m-r-5" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.param_modal.id !== undefined ? t("costCenter:button.update") : t("costCenter:button.submit")}</button>
                <button className="btn btn-white m-r-5" onClick={(e) => toggleClose(e)}>{t("costCenter:button.close")}</button>
            </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ModalPenalty);
