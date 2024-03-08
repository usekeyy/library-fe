import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import {toastr} from 'react-redux-toastr';
// import { formatNumber } from '../../../helpers/formatNumber';
import { formatDate } from '../../../../helpers/formatDate';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { formatNumber } from '../../../../helpers/formatNumber';

const animatedComponents = makeAnimated();

const InputSAP = (props) => {
    const { t } = props;
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    // const [loading, setLoading] = React.useState(false)
    const { control, register, setValue } = useForm({});

  //   const fetchTaxInvoice = (e) => {
  //       e.preventDefault()
  //       // console.log('add tax')
  //       props.fetchTaxInvoice()
	// }

    const handleChange = (e, code, key) => {
        if (e === null) {
            e = []
            e.value = null
        }
        props.setOptionParamSAP(e, code, key)
    } 

    const handleChangePostingDate = (e) => {
        const date = formattingDate(e)
        props.setOptionParamSAP(date, 'posting-date')
        setValue('posting_date', date)
	}

    const handleChangeBaselineDate = (e) => {
        const date = formattingDate(e)
        props.setOptionParamSAP(date, 'baseline-date')
        setValue('baseline_date', date)
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

    const onInputChangePaymentMethod = (option, { action }) => {
		if (action === "input-change") {
			props.fetchPaymentMethod(option)
		}
		if (action === "set-value") {
			props.fetchPaymentMethod('')
		}
	};

  //   const onInputChangePaymentBlock = (option, { action }) => {
	// 	if (action === "input-change") {
	// 		props.fetchPaymentBlock(option)
	// 	}
	// 	if (action === "set-value") {
	// 		props.fetchPaymentBlock('')
	// 	}
	// };

    const onInputChangeHouseBank = (option, { action }) => {
		if (action === "input-change") {
			props.fetchSelectHouseBank(option)
		}
		if (action === "set-value") {
			props.fetchSelectHouseBank('')
		}
	};

    const onInputChangeAccountId = (option, { action }) => {
		if (action === "input-change") {
			props.fetchSelectAccountId(option)
		}
		if (action === "set-value") {
			props.fetchSelectAccountId('')
		}
	};

    const onInputChangeReferenceKey = (option, { action }) => {
		if (action === "input-change") {
			props.fetchReferenceKey(option)
		}
		if (action === "set-value") {
			props.fetchReferenceKey('')
		}
	};

    const onInputChangeTermsOfPayment = (option, { action }) => {
		if (action === "input-change") {
			props.fetchTermsOfPayment(option)
		}
		if (action === "set-value") {
			props.fetchTermsOfPayment('')
		}
	};

    let rows
    if (props.data.with_holding_tax.length > 0) {
        let data_tax = props.data.with_holding_tax
        // console.log(props.data)
        rows = Object.keys(data_tax).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{width: "1%", verticalAlign:'middle'}} align="center">{data_tax[key]['w_tax_type']}</td>
                    {props.status_edit_wh_tax ?
                        <td>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                control={control}
                                onChange={([selected]) => {
                                    handleChange(selected, 'w-tax', key)
                                    return selected;
                                }}
                                options={data_tax[key]['w_tax_code']}
                                inputRef={(e) => register({ name: "w_tax_type["+key+"]", required: false })}
                                name={"w_tax_type["+key+"]"}
                                placeholder={ t("common:Select.Pilih") + " Tax Code" }
                                isClearable
                                rules={{ required: false }}
                                isDisabled = {true}
                            />
                        </td> :
                        <td style={{verticalAlign:'middle'}} align="center">{data_tax[key]['w_tax_code']} - {data_tax[key]['description']}</td>
                    }
                    {props.status_edit_wh_tax ?
                        <td style={{width: "30%"}}>
                            <input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} onChange={(e) => handleChange(e, 'w-tax-value', key)} name={"w_tax_value["+key+"]"} ref={register({})} className="form-control" placeholder="" defaultValue={data_tax[key]['w_tax_value']}/> : 
                        </td> :
                        <td style={{width: "30%"}} align="right">{formatNumber(data_tax[key]['w_tax_value'], 2)}</td>
                    }
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Input Data SAP</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <input style={{display: 'none'}} name="doc_type" ref={register({})} defaultValue="RE"/>
                            {/* <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Document Type <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        options={props.param_option.m_document_type}
                                        inputRef={(e) => register({ name: "document_type_id", required: false })}
                                        name="document_type_id"
                                        defaultValue={props.data.document_type_id : '' }
                                        placeholder={ t("common:Select.Pilih") + " Document Type" }
                                        isLoading={props.loadings.document_type}
                                        rules={{ required: false }}
                                    />
                                </div>
                            </div> */}
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Posting Date <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Datetime
                                        value={props.data.posting_date !== undefined && props.data.posting_date !== '' ? moment(props.data.posting_date).format("DD-MM-YYYY") : ''}
                                        onChange={handleChangePostingDate}
                                        closeOnSelect={true}
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat={false}
                                        inputProps={{ placeholder: "DD-MM-YYYY", disabled : true }}
                                    />
                                    <input disabled type="hidden" name="posting_date" ref={register({ required: false })} defaultValue={props.data.posting_date !== undefined ? formattingDate(props.data.posting_date) : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Baseline Date <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Datetime
                                        value={props.data.baseline_date !== undefined && props.data.baseline_date !== '' ? formatDate(props.data.baseline_date, false) : ''}
                                        onChange={handleChangeBaselineDate}
                                        closeOnSelect={true}
                                        dateFormat="DD-MM-YYYY"
                                        timeFormat={false}
                                        inputProps={{ placeholder: "DD-MM-YYYY", disabled : true }}
                                    />
                                    <input disabled type="hidden" name="baseline_date" ref={register({ required: false })} defaultValue={props.data.baseline_date !== undefined ? formattingDate(props.data.baseline_date) : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Block <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        inputRef={(e) => register({ name: "payment_block", required: false })}
                                        name="payment_block"
                                        defaultValue={props.data.payment_block !== null ? {value: props.data.payment_block, label:props.data.payment_block_code + ' - ' + props.data.payment_block_description} : ''}
                                        placeholder={ t("common:Select.Pilih") + " Payment Block" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false, disabled : true }}
                                        isDisabled = {true}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Method <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'payment-method')
                                            return selected;
                                        }}
                                        onInputChange={onInputChangePaymentMethod}
                                        options={props.param_option.m_payment_method}
                                        inputRef={(e) => register({ name: "payment_method", required: false })}
                                        name="payment_method"
                                        defaultValue={props.data.payment_method !== null ? {value: props.data.payment_method, label:props.data.payment_method_code + ' - ' + props.data.payment_method_description} : '' }
                                        placeholder={ t("common:Select.Pilih") + " Payment Method" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                        isDisabled = {true}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Terms of Payment <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'payment-term')
                                            return selected;
                                        }}
                                        onInputChange={onInputChangeTermsOfPayment}
                                        options={props.param_option.m_pay_of_term}
                                        inputRef={(e) => register({ name: "pay_of_term", required: false })}
                                        name="pay_of_term"
                                        defaultValue={props.data.pay_of_term !== null ? {value: props.data.pay_of_term, label:props.data.pay_of_term + ' - ' + props.data.pay_of_term_description} : '' }
                                        placeholder={ t("common:Select.Pilih") + " Term of Payment" }
                                        // isLoading={props.loadings.tax}
                                        rules={{ required: false }}
                                        isDisabled = {true}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">With Holding Tax</label>
                                <div className="col-sm-6">
                                    {!props.loadings.with_holding_tax &&
                                        <div className="table-responsive" style={{overflow: "visible"}}>
                                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Tax Type</th>
                                                        <th>Tax Code</th>
                                                        <th>Base Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows}
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                </div>
                                <div className="col-sm-2">
                                    {/* <button className="btn btn-success" onClick={(e) => fetchTaxInvoice(e)} > sync</button> */}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">House Bank <span className="text-danger">*</span> </label>
                                <div className="col-sm-4">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'house-bank')
                                            return selected;
                                        }}
                                        onInputChange={onInputChangeHouseBank}
                                        options={props.param_option.m_house_bank}
                                        inputRef={(e) => register({ name: "house_bank", required: false })}
                                        name="house_bank"
                                        defaultValue={props.data.house_bank_code !== null ? {value: props.data.house_bank_code, label:props.data.house_bank_code + ' - ' + props.data.house_bank_name} : '' }
                                        placeholder={ t("common:Select.Pilih") + " House Bank" }
                                        isLoading={props.loadings.house_bank}
                                        rules={{ required: false }}
                                        isDisabled = {true}
                                    />
                                </div>
                                {!props.loadings.loading_account_id &&
                                    <div className="col-sm-4">
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            onChange={([selected]) => {
                                                handleChange(selected, 'account-id')
                                                return selected;
                                            }}
                                            onInputChange={onInputChangeAccountId}
                                            options={props.param_option.m_account_id}
                                            inputRef={(e) => register({ name: "account_id", required: false })}
                                            name="account_id"
                                            defaultValue={props.data.house_bank_acct_number !== null ? {value: props.data.house_bank_acct_number, label:props.data.house_bank_acct_number + ' - ' + props.data.house_bank_description} : '' }
                                            placeholder={ t("common:Select.Pilih") + " Account ID" }
                                            isLoading={props.loadings.account_id}
                                            rules={{ required: false }}
                                            isDisabled = {true}
                                        />
                                    </div>
                                }
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Payment Reff</label>
                                <div className="col-sm-6">
                                    <input disabled type="text" onChange={(e) => handleChange(e, 'payment-reff')} name="payment_reff" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.payment_reff || ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Text </label>
                                <div className="col-sm-6">
                                    <textarea disabled max="50" onChange={(e) => handleChange(e, 'header-text')} name="header_text" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.header_text || ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 1</label>
                                <div className="col-sm-6">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        onChange={([selected]) => {
                                            handleChange(selected, 'reference-1')
                                            return selected;
                                        }}
                                        onInputChange={onInputChangeReferenceKey}
                                        options={props.param_option.m_reference_key}
                                        inputRef={(e) => register({ name: "reference_1", required: false })}
                                        name="reference_1"
                                        defaultValue={props.data.reference_1 !== null ? {value: props.data.reference_1, label:props.data.reference_1_npwp_number + ' - ' + props.data.reference_1_city} : '' }
                                        placeholder={ t("common:Select.Pilih") + " Reference 1" }
                                        // isLoading={props.loadings.tax}
                                        isClearable
                                        rules={{ required: false }}
                                        isDisabled = {true}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 2</label>
                                <div className="col-sm-6">
                                    <input disabled type="text" onChange={(e) => handleChange(e, 'reference-2')} name="reference_2" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.reference_2 || ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Reference 3</label>
                                <div className="col-sm-6">
                                    <input disabled type="text" onChange={(e) => handleChange(e, 'reference-3')} name="reference_3" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.reference_3 || ''}/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Assignment</label>
                                <div className="col-sm-6">
                                    <input disabled type="text" onChange={(e) => handleChange(e, 'assignment')} name="assignment" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.assignment || ''}/>
                                </div>
                            </div>
                            {/* <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Partner Bank <span className="text-danger">*</span> </label>
                                <div className="col-sm-6">
                                    <input type="text" onChange={(e) => handleChange(e, 'partner-bank')} name="partner_bank" ref={register({})} className="form-control" placeholder="" defaultValue={props.data.partner_bank !== undefined ? props.data.partner_bank: ''}/>
                                </div>
                            </div> */}
                         </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(InputSAP);