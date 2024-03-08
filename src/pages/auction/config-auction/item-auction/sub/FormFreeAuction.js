import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { toastr } from 'react-redux-toastr';
const animatedComponents = makeAnimated();

const FormModal = (props) => {
    const { t } = props;
    const { register, handleSubmit, control, watch } = useForm();

    const watchAllFields = watch();

    const onSubmit = async (data) => {
        let payload = setData(data)
        // console.log(data)
        // console.log(payload)
        if(payload.low_unit_price > payload.high_unit_price && payload.high_unit_price!==""){
            toastr.warning(t("auction:alert.unit-price-not-allowed"), t("auction:alert.validation-low-ishigher-price"))
        }else{
            if(props.data?.uuid_item===undefined){
                props.save(payload)
            }else{
                payload.uuid_item = props.data?.uuid_item
                props.update(payload)
            }
        }
    }

    const setData = (data) => {
        data.currency = (data.currency===undefined || data.currency==="") ? "" : data.currency.value
        data.discount = (data.discount==="") ? "" : parseFloat(data.discount?.toString().replace(/\./g,'').replace(/,/g,'.'))
        data.high_unit_price = (data.high_unit_price==="") ? "" : parseFloat(data.high_unit_price?.toString().replace(/\./g,'').replace(/,/g,'.'))
        data.low_unit_price = (data.low_unit_price==="") ? "" : parseFloat(data.low_unit_price?.toString().replace(/\./g,'').replace(/,/g,'.'))
        data.qty =  (data.qty==="") ? "" : parseFloat(data.qty?.toString().replace(/\./g,'').replace(/,/g,'.').replace(/,/g,'').replace(/,/g,'.'))
        data.unit_cost = (data.unit_cost === "") ? "" : parseFloat(data.unit_cost?.toString().replace(/\./g,'').replace(/,/g,'.'))
        data.uom = (data.uom===undefined) ? "" : data.uom.value
        data.total_cost = isNaN(total) ? 0 : total
        return data;
    }

    const onInputChangeUom = (option, { action }) => {
		if (action === "input-change") {
			props.handleChangeUom(option)
		}
	};

    const onInputChangeCurrencies = (option, { action }) => {
		if (action === "input-change") {
			props.handleChangeCurrencies(option)
		}
	};

    let total = (parseFloat(watchAllFields['qty']?.toString().replace(/\./g,'').replace(/,/g,'.'))*parseFloat(watchAllFields['unit_cost']?.toString().replace(/\./g,'').replace(/,/g,'.')))

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Panel>
                    <PanelHeader>
                        Detail Auction
                </PanelHeader>
                    <PanelBody>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <td>No</td>
                                                <td align="right">
                                                    <label>
                                                        {props.data?.uuid_item===undefined ? (props.queue+1) : (props.urutan+1)}
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("auction:label.description")}</td>
                                                <td>
                                                    <textarea
                                                        name="short_text"
                                                        className="form-control"
                                                        ref={register({})}
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : props.data.short_text}
                                                        disabled={(props.header?.status!=='n') ? true : false}
                                                    />
                                                    {props.errors.short_text && <span className="text-danger">{props.errors.short_text[0]}</span>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <td>Uom</td>
                                                <td>
                                                <Controller
                                                    components={animatedComponents}
                                                    closeMenuOnSelect={true}
                                                    as={Select}
                                                    isDisabled={((props.header?.status!=='n') ? true : false)}
                                                    control={control}
                                                    options={props.uoms} 
                                                    onInputChange={onInputChangeUom}
                                                    name="uom" 
                                                    defaultValue={props.data?.uuid_item===undefined ? "" :  { value: props.data.uom, label: props.data.uom + ' - ' + props.data.uom_name }}
                                                    rules={{}}
                                                />
                                                {props.errors.uom && <span className="text-danger">{props.errors.uom[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("auction:label.currency")}</td>
                                                <td>
                                                <Controller
                                                    components={animatedComponents}
                                                    closeMenuOnSelect={true}
                                                    as={Select}
                                                    // className={(errors.name || props.errors.name) ? "is-invalid" : ""}
                                                    control={control}
                                                    options={props.currencies} 
                                                    onInputChange={onInputChangeCurrencies}
                                                    name="currency" 
                                                    isDisabled={(props.header?.status!=='n') ? true : false}
                                                    defaultValue={props.data?.uuid_item===undefined ? "" : { value: props.data.currency, label: props.data.currency + ' - ' + props.data.currency_name }}
                                                    rules={{}}
                                                />
                                                {props.errors.currency && <span className="text-danger">{props.errors.currency[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Qty</td>
                                                <td align="right">
                                                    <Controller
                                                        name="qty"
                                                        control={control}
                                                        className="form-control"
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : parseFloat(props.data.qty)}
                                                        as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={2} disabled={(props.header?.status!=='n') ? true : false} />}
                                                    />
                                                    {props.errors.qty && <span className="text-danger pull-left">{props.errors.qty[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("auction:label.unit-price")}</td>
                                                <td align="right">
                                                    <Controller
                                                        name="unit_cost"
                                                        control={control}
                                                        // defaultValue={parseFloat(props.data?.discount)}
                                                        className="form-control"
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : parseFloat(props.data.valuation_price)}
                                                        as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                                    />
                                                    {props.errors.unit_cost && <span className="text-danger pull-left">{props.errors.unit_cost[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{t("auction:label.total-price")}</td>
                                                <td align="right">
                                                    <label>
                                                        {formatNumber(total, 2)}
                                                    </label>
                                                    {props.errors.total_cost && <span className="text-danger">{props.errors.total_cost[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{props.price_calculation==="diskon" ? t("auction:label.high-unit-discount") : t("auction:label.high-unit-price")}</td>
                                                <td>
                                                    <Controller
                                                        name="high_unit_price"
                                                        control={control}
                                                        // defaultValue={parseFloat(props.data?.high_unit_price)}
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : parseFloat(props.data.high_unit_price)}
                                                        className="form-control"
                                                        as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                                    />
                                                    {props.errors.high_unit_price && <span className="text-danger">{props.errors.high_unit_price[0]}</span>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{props.price_calculation==="diskon" ? t("auction:label.lower-unit-discount") : t("auction:label.lower-unit-price")}</td>
                                                <td>
                                                    <Controller
                                                        name="low_unit_price"
                                                        control={control}
                                                        // defaultValue={parseFloat(props.data?.low_unit_price)}
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : parseFloat(props.data.low_unit_price)}
                                                        className="form-control"
                                                        as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                                    />
                                                    {props.errors.low_unit_price && <span className="text-danger">{props.errors.low_unit_price[0]}</span>}
                                                </td>
                                            </tr>
                                            {/* {props.price_calculation==="diskon" && 
                                            <tr>
                                                <td>{t("auction:label.discount")} (%)</td>
                                                <td>
                                                    <Controller
                                                        name="discount"
                                                        control={control}
                                                        // defaultValue={parseFloat(props.data?.discount)}
                                                        defaultValue={props.data?.uuid_item===undefined ? "" : props.data.discount}
                                                        className="form-control"
                                                        as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                                    />
                                                    {props.errors.discount && <span className="text-danger">{props.errors.discount[0]}</span>}
                                                </td>
                                            </tr>
                                            } */}
                                            <tr>
                                                <td>Note</td>
                                                <td>
                                                    <textarea className="form-control"
                                                        name="note"
                                                        ref={register({ })}
                                                        defaultValue={props.data?.note}
                                                        disabled={(props.header?.status!=='n') ? true : false}
                                                    />
                                                    {props.errors.note && <span className="text-danger">{props.errors.note[0]}</span>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row pull-right">
                            {/* {props.access.C &&
                                <button
                                    type="submit"
                                    className="btn btn-success m-r-5"
                                    disabled={props.loadings.loading_update_detail_auction}
                                >
                                    {props.loadings.loading_update_detail_auction && <i className="fa fa-spinner fa-spin"></i> } 
                                    Save Draft</button>
                            } */}

                                <button
                                    type="submit"
                                    className="btn btn-success m-r-5"
                                    disabled={props.loadings.loading_save_free_auction_item ||  ((props.header?.status!=='n') ? true : false)}
                                >
                                    {props.loadings.loading_save_free_auction_item && <i className="fa fa-spinner fa-spin"></i> } 
                                    {t("auction:button.save-draft")}
                                </button>
                            <button
                                type="button"
                                className="btn btn-white m-r-5"
                                onClick={() => props.toggle()}
                            >
                                {t("auction:button.cancel")}
                    </button>
                        </div>
                    </PanelBody>
                </Panel>
            </form>
        </div>
    );
}

export default withTranslation()(FormModal);
