import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel,  PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';
// import { statusName } from '../../../../../helpers/statusName';



const Penawaran = (props) => {
    const { t } = props;
    const { register, handleSubmit, control, watch } = useForm();
    const watchAllFields = watch();
    let rows;
    let total_price = 0

    const onSubmit = async (data) => {
        // console.log(setData(data))
        // console.log(data)
        props.storePenawaranVendor(setData(data))
    }

    const setData = (data) => {
        let arr = []
        data.auction_free_items_id.forEach((child,j)=>{
            let total_value = parseFloat(watchAllFields[`unit_price[${j}]`]===undefined ?  0 : watchAllFields[`unit_price[${j}]`].toString().replace(/\./g,'').replace(/,/g,'.'))
            arr.push({
                "auction_free_items_id": data.auction_free_items_id[j],
                "unit_price":total_value,
                "total" : parseFloat(parseFloat(data.qty[j])*total_value),
                "diskon" : parseFloat(data.discount[j])
            })
        })
        let return_data = {}
        return_data.data = arr
        if(props.header.metode_peringkat==="multivariate"){
            let arrMultivariate = []
            arrMultivariate.push({
                "tipe":"teknis",
                "bobot": data.bobot_teknis===undefined ? 0 : parseFloat(data.bobot_teknis.toString().replace(/\./g,'').replace(/,/g,'.')),
                "score": data.skor_teknis===undefined ? 0 : parseFloat(data.skor_teknis.toString().replace(/\./g,'').replace(/,/g,'.'))
            })
            arrMultivariate.push({
                "tipe":"komersil",
                "bobot": data.bobot_komersil===undefined ? 0 : parseFloat(data.bobot_komersil.toString().replace(/\./g,'').replace(/,/g,'.')),
                "score": 0
            })  
            return_data.multivariate=arrMultivariate
        }
        
        return return_data
    }

    if (props.data?.length > 0) {
        rows = props.data?.map((dt, i) => {
            let total = (parseFloat(dt.qty) * (watchAllFields[`unit_price[${i}]`]===undefined ? (dt.valuation_price==="")? 0 : parseFloat(dt.valuation_price) : parseFloat(watchAllFields[`unit_price[${i}]`]?.toString().replace(/\./g,'').replace(/,/g,'.'))))
            total_price+=total
            let default_value = (dt.valuation_price==="" || dt.valuation_price===null) ? 0 : parseFloat(dt.valuation_price)
            return (
                <tr key={i}>
                    <td>{(i+1)}</td>
                    <td>{dt.short_text}</td>
                    <td>{dt.qty}</td>                   
                    <td>{dt.uom}</td>                   
                    <td>{dt.currency}</td>                   
                    <td>
                        <Controller
                            name={`unit_price[${i}]`}
                            control={control}
                            defaultValue={default_value}                            
                            className="form-control"                           
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                        />
                    </td>                   
                    <td align="right">
                        <input type="hidden" name={`auction_free_items_id[${i}]`} ref={register()} value={(dt.id===null) ? "0" :dt.id} />
                        <input type="hidden" name={`qty[${i}]`} ref={register()} value={dt.qty} />
                        <input type="hidden" name={`discount[${i}]`} ref={register()} value={(dt.discount===null) ? "0" : dt.discount} />
                        {formatNumber(total,2)}
                    </td>                   
                </tr>
            )
        })
        rows.push(
            <tr key={props.data?.length+1}>
                <td align="center"  colSpan="6">Total</td>
                <td align="right">{formatNumber(total_price,2)}</td>
            </tr>
        )
    } else if (props.data?.length === 0) {
        rows = (<RowEmpty colSpan='7'>  {t("auction:table.empty-row")} </RowEmpty>);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {props.header.metode_peringkat==="multivariate" &&
                <Panel>
                    <PanelHeader>
                        Skor
                    </PanelHeader>
                    <PanelBody>
                        <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Bobot</th>
                                            <th>Skor</th>
                                            <th>Nilai</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Teknis</td>
                                            <td>
                                            <Controller
                                                name={`bobot_teknis`}
                                                control={control}
                                                defaultValue={(props.score_multivariate === undefined || props.score_multivariate.length===0) ? 0 : parseFloat(props.score_multivariate[0].bobot)}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                            />
                                            </td>
                                            <td>
                                            <Controller
                                                name={`skor_teknis`}
                                                control={control}
                                                defaultValue={(props.score_multivariate === undefined || props.score_multivariate.length===0 || props?.score_multivariate[0].score==="" || props?.score_multivariate[0].score===null) ? 0 : parseFloat(props.score_multivariate[0].score)}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                            />
                                            </td>
                                            <td align="center">
                                                {formatNumber( watchAllFields[`bobot_teknis`]===0 ? 0 : ((watchAllFields[`bobot_teknis`] *  watchAllFields[`skor_teknis`])/100) )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Komersial</td>
                                            <td>
                                            <Controller
                                                name={`bobot_komersil`}
                                                control={control}
                                                defaultValue={(props.score_multivariate === undefined || props.score_multivariate.length===0) ? 0 : parseFloat(props.score_multivariate[1].bobot)}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                            />
                                            </td>
                                            <td>
                                            {/* <Controller
                                                name={`skor_komersil`}
                                                control={control}
                                                defaultValue={(props.score_multivariate === undefined || props.score_multivariate.length===0) ? 0 : props.score_multivariate[1].score}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.header?.status!=='n') ? true : false} />}
                                            /> */}
                                            </td>
                                            <td>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        </div>
                    </PanelBody>
                </Panel>
                }
                <Panel>
                <PanelHeader>Penawaran</PanelHeader>
                    <PanelBody>
                    <div className="table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Uom</th>
                                        <th>Currency</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                    </div>
                    <div className="pull-right m-t-10 m-b-10">
                    <div className="col-sm-12 " >
                        <button
                            type="button"
                            onClick={ ()=>props.toggle() }
                            className="btn btn-white m-r-5"
                            disabled={props.loadings.loading_submit_unit_price}
                        >
                            {t("auction:button.cancel")}
                                </button>
                        
                        <button
                            type="submit"
                            // onClick={accept}
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_submit_bid || (props.header?.status!=='n') ? true : false}
                        >
                            {props.loadings.loading_submit_bid && <i className="fa fa-spinner fa-spin"></i>}
                                {t("auction:button.submit")}
                            </button>
                        
                        </div>
                    </div>
                    </PanelBody>
                </Panel>
            </form>
        </div>
    );
}

export default withTranslation()(Penawaran);
