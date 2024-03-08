import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { Panel } from '../../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../../helpers/formatNumber';

const FormAgrement = (props) => {
    // const { t } = props;
    const { register, handleSubmit, control, watch } = useForm();
    const watchAllFields = watch();
    let rows;

    const onSubmit = async (data) => {
        // console.log({param : setData(data)})
        props.storeDetailUpdateHarga({param : setData(data)})
    }

    const setData = (data) => {
        let arr = []
        props.data.forEach((element,i) => {
            let arrParent={}
            arrParent.proposal_tender_item_id=element['proposal_tender_item_id']
            arrParent.data = []
            let b=0
            let a=0
            let totals=0;
            element['data'].forEach((child,j)=>{
                a = parseFloat(data['update_price'][i][j]===undefined ? 0 :  data['update_price'][i][j].toString().replace(/,/g,'.')).toFixed(2);
                b = parseFloat(data['total'][i][j].toString().replace(/,/g,'.')).toFixed(2)
                totals+=parseFloat(b)               
                arrParent.data.push({
                    "purchasing_requisition_service_id": child['purchasing_requisition_service_id'],
                    "update_price": parseFloat(a),
                    "total" : parseFloat(b)
                })
            })
            arrParent.sumtotal=parseFloat(totals.toFixed(2))
            arr.push(arrParent)
        })
        return arr
    }

    if (props.data?.length > 0) {
        rows = props.data?.map((row, i) => {
            // let detail = [];
            let sumtotal = 0;
            return (
                <div className="row" key={i}>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead style={{ backgroundColor: "black", color: "white", fontWeight: "bold" }}>
                                <tr>
                                    <th>No</th>
                                    <th>Short Text</th>
                                    <th>Spesifikasi</th>
                                    <th>QTY</th>
                                    <th>UOM</th>
                                    <th>Harga Satuan</th>
                                    <th>Total Penawaran</th>
                                    <th>Currency</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ fontWeight: "bold" }}>
                                    <td>{i+1}</td>
                                    <td>{row['short_text']}</td>
                                    <td>{row['specification']}</td>
                                    <td>{row['qty']}</td>
                                    <td>{row['uom']}</td>
                                    <td></td>
                                    <td align="right">{formatNumber(row['total'], 2)}</td>
                                    <td>{row['currency']}</td>
                                </tr>
                                {
                                    row['data']?.map((detail, j) => {
                                        let total = watchAllFields[`update_price[${i}][${j}]`] === undefined ? 0 : parseFloat(watchAllFields[`update_price[${i}][${j}]`].toString().replace(/\./g,'').replace(/,/g,'.') * (parseFloat(detail['qty']) / parseFloat(detail['per'])) )
                                        sumtotal+=total
                                        return (
                                            <tr key={j}>
                                                <td></td>
                                                <td colSpan="2">Service Line {detail['short_text']}</td>
                                                <td align="right">{formatNumber(detail['qty'],2)}</td>
                                                <td>{detail['uom']}</td>
                                                <td>
                                                    <Controller
                                                        name={`update_price[${i}][${j}]`}
                                                        control={control}
                                                        defaultValue={detail['update_price']}                            
                                                        className="form-control"
                                                        as={<NumberFormat decimalSeparator={','} decimalScale={2} />}
                                                    />
                                                </td>
                                                <td align="right">{formatNumber(total,2)}
                                                    <input type="hidden" name={`total[${i}][${j}]`} ref={register()} defaultValue={total} />
                                                </td>
                                                <td>{detail['currency']}</td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr key={(row['data'].length+1)}>
                                    <td></td>
                                    <td colSpan="4">Total</td>
                                    <td colSpan="2" align="right">{formatNumber(sumtotal,2)}<input type="hidden" name={`sumtotal`} ref={register()} defaultValue={sumtotal}/></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Panel>
                    <div className="row col-lg-12">
                    <p>Silahkan isikan amount di masing-masing service line item. Total amount yang dimasukkan <b> harus sama dengan</b> harga penawaran submit terakhir.</p>
                    </div>
                    <div className="col-lg-12">
                        {rows}
                    </div>
                    <div className="row pull-right m-t-10 m-b-10">
                    <div className="col-sm-12 " >
                        {/* <button
                            type="button"
                            // onClick={reject}
                            className="btn btn-succes m-r-5"
                            disabled={props.loadings.loading_submit_unit_price}
                        >
                                Cancel</button> */}
                        <button
                            type="submit"
                            // onClick={accept}
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_submit_unit_price}
                        >
                            {props.loadings.loading_submit_unit_price && <i className="fa fa-spinner fa-spin"></i>}
                                Submit
                            </button>
                        </div>
                    </div>
                </Panel>
            </form>
        </div>
    );
}

export default withTranslation()(FormAgrement);
