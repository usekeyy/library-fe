import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';
import NumberFormat from 'react-number-format';


const FormModal = (props) => {
    const { t } = props;
    const { register, handleSubmit, control } = useForm();

    const onSubmit = async (data) => {
        props.save(setData(data))
    }

    const setData = (data) => {
        let arr = props.data
        arr.discount = isNaN(data.discount) ? "" : data.discount
        arr.high_unit_price = parseFloat(data.high_unit_price.toString().replace(/\./g,'').replace(/,/g,'.'))
        arr.low_unit_price = parseFloat(data.low_unit_price.toString().replace(/\./g,'').replace(/,/g,'.'))
        arr.note = data.note
        return arr;
    }

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
                                                <td>No PR</td>
                                                <td>
                                                    <label>
                                                        {props.data?.number_pr}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Jenis Item</td>
                                                <td>
                                                    <label>
                                                        {props.data?.tipe}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Item</td>
                                                <td>
                                                    <label>
                                                        {props.data?.tipe}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Spesifikasi</td>
                                                <td>
                                                    <label>
                                                        {props.data?.short_text}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
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
                                                    <label>
                                                        {props.data?.uom}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Curr</td>
                                                <td>
                                                    <label>
                                                        {props.data?.currency}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Qty</td>
                                                <td align="right">
                                                    <label>
                                                        {formatNumber(props.data?.qty,2)}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Unit Cost</td>
                                                <td align="right">
                                                    <label>
                                                        {formatNumber(props.data?.valuation_price,2)}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total Cost</td>
                                                <td align="right">
                                                    <label>
                                                        {formatNumber(props.data?.total_price, 2)}
                                                    </label>
                                                    {/* <input disabled className="form-control" /> */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Unit Price Tertinggi</td>
                                                <td>
                                                    {/* <input 
                                                    defaultValue={props.data?.high_unit_price}
                                                    name="high_unit_price" type="number"  className="form-control" ref={register({})} /> */}

                                                <Controller
                                                    name="high_unit_price"
                                                    control={control}
                                                    defaultValue={parseFloat(props.data?.high_unit_price)}
                                                    className="form-control"
                                                    as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} 
                                                    disabled={(props.header?.status!=='n') ? true : false}
                                                    />}
                                                />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Unit Price Terendah</td>
                                                <td>
                                                    <Controller
                                                    name="low_unit_price"
                                                    control={control}
                                                    defaultValue={parseFloat(props.data?.low_unit_price)}
                                                    className="form-control"
                                                    required={true}
                                                    as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} 
                                                    disabled={(props.header?.status!=='n') ? true : false}
                                                    />}
                                                />
                                                </td>
                                            </tr>
                                            {props.price_calculation==="diskon" && 
                                            <tr>
                                                <td>Diskon (%) </td>
                                                <td>
                                                <Controller
                                                    name="discount"
                                                    control={control}
                                                    defaultValue={parseFloat(props.data?.discount)}
                                                    className="form-control"
                                                    required={false}
                                                    as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} 
                                                    disabled={(props.header?.status!=='n') ? true : false}
                                                    />}
                                                />
                                                </td>
                                            </tr>
                                            }
                                            <tr>
                                                <td>{t("auction:label.note")}</td>
                                                <td>
                                                    <textarea className="form-control" 
                                                        name="note"
                                                        ref={register({required : true})}
                                                        defaultValue={props.data?.note}
                                                        disabled={(props.header?.status!=='n') ? true : false}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="row pull-right">
                            {props.access.C &&
                                <button
                                    type="submit"
                                    className="btn btn-success m-r-5"
                                    disabled={props.loadings.loading_update_detail_auction || ((props.header?.status==='p') ? true : false)}
                                >
                                    {props.loadings.loading_update_detail_auction && <i className="fa fa-spinner fa-spin"></i> } 
                                    {t("auction:button.save-draft")}</button>
                            }
                            <button
                                type="button"
                                className="btn btn-white m-r-5"
                                onClick={()=>props.toggle()}
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
