import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel,  PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';



const Penawaran = (props) => {
    // const { t } = props;
    const { register, handleSubmit, control, watch } = useForm();
    const watchAllFields = watch();
    let rows;

    const onSubmit = async (data) => {
        // console.log(setData(data))
        props.storePenawaranVendor({data : setData(data)})
    }

    const setData = (data) => {
        let arr = []
        props.data.forEach((child,j)=>{
            let total_value = parseFloat(watchAllFields[`unit_price[${j}]`]===undefined ? 0 : watchAllFields[`unit_price[${j}]`].toString().replace(/\./g,'').replace(/,/g,'.'))
            arr.push({
                "auction_free_items_id": watchAllFields[`auction_free_items_id[${j}]`],
                "unit_price": total_value,
                "total" : parseFloat(parseFloat(watchAllFields[`qty[${j}]`])*total_value),
                "diskon" : parseFloat(watchAllFields[`discount[${j}]`]?.toString().replace(/\./g,'').replace(/,/g,'.'))
            })
        })
        
        return arr
    }

    if (props.data?.length > 0) {
        rows = props.data?.map((dt, i) => {
            let total = (parseFloat(dt.qty) * (watchAllFields[`unit_price[${i}]`]===undefined ? parseFloat(dt.valuation_price): parseFloat(watchAllFields[`unit_price[${i}]`]?.toString().replace(/\./g,'').replace(/,/g,'.'))))
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
                            defaultValue={parseFloat(dt.valuation_price)}                            
                            className="form-control"                           
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                        />
                    </td>                   
                    <td align="right">
                        <input type="hidden" name={`auction_free_items_id[${i}]`} ref={register()} value={(dt.id===null) ? "0" :dt.id.toString()} />
                        <input type="hidden" name={`qty[${i}]`} ref={register()} value={dt.qty.toString()} />
                        <input type="hidden" name={`discount[${i}]`} ref={register()} value={(dt.discount===null) ? "0" : dt.discount.toString()} />
                        {formatNumber(total,2)}
                    </td>                   
                </tr>
            )
        })
    } else if (props.data?.length === 0) {
        rows = (<RowEmpty colSpan='5'> Tidak ada data </RowEmpty>);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Panel>
                <PanelHeader>Peserta</PanelHeader>
                    <PanelBody>
                    <div className="col-lg-12">
                    <div className="row table-responsive">
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
                    </div>
                    <div className="row pull-right m-t-10 m-b-10">
                    <div className="col-sm-12 " >
                        <button
                            type="button"
                            onClick={ ()=>props.back() }
                            className="btn btn-white m-r-5"
                            disabled={props.loadings.loading_submit_unit_price}
                        >
                                Back</button>
                        {(new Date (props.socket_timer) < new Date(props.header.start_auction)) && 
                        <button
                            type="submit"
                            // onClick={accept}
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_submit_bid}
                        >
                            {props.loadings.loading_submit_bid && <i className="fa fa-spinner fa-spin"></i>}
                                Submit
                            </button>
                        }
                        </div>
                    </div>
                    </PanelBody>
                </Panel>
            </form>
        </div>
    );
}

export default withTranslation()(Penawaran);
