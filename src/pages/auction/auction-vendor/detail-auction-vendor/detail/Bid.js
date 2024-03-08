import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
// import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';
// import { statusName } from '../../../../../helpers/statusName';
import ReactLoading from 'react-loading';
// import { restrictNumber } from '../../../../../helpers/restrictNumber';


const Bid = (props) => {
    // const { t } = props;
    // const [loading] = React.useState(false)
    const { register, control } = useFormContext();
    // const [unitPrice, setUnitPrice] = React.useState()
   
    // const watchAllFields = watch();
    let rows;
    let sumtotal = 0;

    const handleIncrement = (i, data) => {
        props.handleIncrement(i,data)
    }

    const handleDecrement = (i, data) => {
        props.handleDecrement(i,data)
    }

    const changedInput = (i,data) => {
        props.handleChange(i,data)
    }

		const handleUserKeyPress = e => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				// handleSubmit(onSubmit); // this won't be triggered
				props.methods.handleSubmit(props.onSubmit)()
			}
		};
    
    if (props.data?.length > 0) {  
        rows = props.data?.map((row, i) => {
            let total = parseFloat((row['settingvalue'] === undefined || row['settingvalue']=== "") ? 0 : row['settingvalue'])
            let unit_price_value =(row['unit_price']==="" || row['unit_price']===undefined) ? 0 : (row['unit_price'])
            let harga_after_discount = 0
            let price_after_discount = 0
            if(props.headers?.price_calculation==="diskon"){
                harga_after_discount = (((100 - total) / 100) * unit_price_value) 
                price_after_discount = (harga_after_discount * parseFloat(row['qty']))
            }else{
                price_after_discount = parseFloat((total * parseFloat(row['qty'])))
            }
            sumtotal += price_after_discount
            row['settingvalue'] = props.headers?.price_calculation==="diskon" ? ((row['settingvalue'] ===undefined ) ? row['diskon']==="" ? 0 : parseFloat(row['diskon']) : row['settingvalue'])  : ((row['settingvalue'] ===undefined ) ? unit_price_value : row['settingvalue']);
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{row['number_pr']}</td>
                    <td>{row['item_no']}</td>
                    <td>{row['short_text']}</td>
                    <td>{row['qty']}</td>
                    <td>{row['uom']}</td>
                    <td align="right">
                        <input type="hidden" name={`unit_price[${i}]`} ref={register()} value={harga_after_discount.toString()} />
                        <input type="hidden" name={`total_price[${i}]`} ref={register()} value={price_after_discount.toString()} />
                        {/* {props.headers?.price_calculation==="diskon" ? formatNumber(harga_after_discount,2) : formatNumber(row['unit_price'], 2)} */}
                        {formatNumber(row['unit_price'], 2)}
                    </td>
                    <td  style={{ width:"400px !important"}}>
                        {(props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket") &&
                            <input type="hidden" name={`settingvalue[${i}]`} ref={register()} value={row['settingvalue'].toString()} />
                        }
                        {!(props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket") && 
                        <Controller
                            name={`settingvalue[${i}]`}
                            control={control}
                            defaultValue={row['settingvalue']}                            
                            onValueChange={(e)=>changedInput(i,e)}
                            className="form-control"
							onKeyPress={e => handleUserKeyPress(e)}
                            disabled={(props.headers?.isFreeze==="y" || props.headers?.is_vendor_banned==="b") ? true : false}
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={2}  style={{ width:"400px !important"}}/>}
                        />
                        }
                        {props.errors[`bid.${i}.diskon`] && <span className="text-danger">{props.errors[`bid.${i}.diskon`][0]}</span>}
                    </td>

                    {(props.headers.price_calculation==="harga_satuan"  || (props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="itemize")) &&
                    <td align="center">
                        {props.headers?.auction_type === "reverse_auction" && 
                        <button type="button" className="btn btn-white btn-xs m-r-5" disabled={props.headers?.isFreeze==="y"} onClick={() => handleDecrement(i, props.headers?.increment_decrement)}>
                            - {props.headers?.increment_decrement}
                            </button>
                        }
                        {props.headers?.auction_type === "forward_auction" &&
                        <button type="button" className="btn btn-white btn-xs" disabled={props.headers?.isFreeze==="y"} onClick={() => handleIncrement(i,  props.headers?.increment_decrement)}>
                            + {props.headers?.increment_decrement}
                            </button>
                        }
                    </td>
                    } 

                    
                    {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket" &&
                    <td align="center">
                        
                    </td>
                    }
                    

                    {/* {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="itemize" &&
                    <td align="center">
                        <center>
                        {row['ranking']}
                        {row['ranking']==="1" && <span className="fa fa-gem m-l-5 text-warning"></span>} 
                        </center>
                    </td>
                    } */}

                    
                    <td align="right">{formatNumber(price_after_discount, 2)}</td>
                    {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="itemize" &&
                    <td align="center">
                        <center>
                        {row['ranking']}
                        {row['ranking']===1 && <span className="fa fa-gem m-l-5 text-warning"></span>} 
                        </center>
                    </td>
                    }
                    {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket" &&
                    <td align="center">
                        {row['rangking']}
                    </td>
                    }
                    {i===0 && props.headers.metode_penentuan_pemenang==="paket" && props.headers.price_calculation==="harga_satuan" && <td rowSpan={props.data.length}> {row['ranking']} </td>}
                    {props.headers.metode_penentuan_pemenang==="itemize" && props.headers.price_calculation==="harga_satuan" &&<td>
                        <center>
                            {row['ranking']}
                            {row['ranking']===1 && <span className="fa fa-gem m-l-5 text-warning"></span>} 
                        </center>
                    </td>}
                    <td>
                        <button type="button" className="btn btn-xs btn-white" onClick={()=> props.tongleOpenHistory(i)}>
                            History
                        </button>
                    </td>
                </tr>
            )
        })

        rows.push(
            <tr key={props.data?.length}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td align="center">
                    {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket" &&
                         <Controller
                            name={`form_discount`}
                            control={control}
                            defaultValue={(props.increment_decrement_paket_discount)}                            
                            onValueChange={(e)=>changedInput("paketdiscount",e)}
                            className="form-control"
                            onKeyPress={e => handleUserKeyPress(e)}
                            disabled={(props.headers?.isFreeze==="y" || props.headers?.is_vendor_banned==="b") ? true : false}
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={2}/>}
                        />
                    }
                </td>
                <td align="center">
                {props.headers.price_calculation==="diskon" && props.headers.metode_penentuan_pemenang==="paket" &&
                    <div>
                        {props.headers?.auction_type === "reverse_auction" && 
                        <button type="button" className="btn btn-white btn-xs m-r-5" disabled={props.headers?.isFreeze==="y"} onClick={() => handleDecrement('paket', props.headers?.increment_decrement)}>
                            - {props.headers?.increment_decrement}
                            </button>
                        }
                        {props.headers?.auction_type === "forward_auction" &&
                        <button type="button" className="btn btn-white btn-xs" disabled={props.headers?.isFreeze==="y"} onClick={() => handleIncrement('paket',  props.headers?.increment_decrement)}>
                            + {props.headers?.increment_decrement}
                            </button>
                        }
                    </div>
                    } 
                </td>
                <td align="right">{formatNumber(sumtotal, 2)}</td>
                <td>{props.akumulasi_ranking} {props.akumulasi_ranking!==null  && props.akumulasi_ranking!=="" && props.headers.metode_penentuan_pemenang!=="itemize" &&  <span className="fas fa-gem m-l-5" style={{color:"orange"}}></span>} </td>
                <td></td>
            </tr>
        )
    }

    //console.log(props.headers)
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Bid</PanelHeader>
                {props.loadings.loading_data_bid &&
                    <PanelBody>
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    </PanelBody>
                }
                {!props.loadings.loading_data_bid &&
                    <PanelBody>
                        <div className="row table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>No. PR</th>
                                        <th>Line Item</th>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Uom</th>
                                        <th>{props.headers?.price_calculation==="diskon" ? "Harga Satuan" : "Harga Sebelumnya"}</th>
                                        <th style={{ width:"400px !important"}}>{props.headers?.price_calculation==="diskon" ? "Diskon" : "Unit Price"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </th>
                                        <th>{props.headers?.auction_type==="reverse_auction" ? "Decrement" : "Increment"}</th>
                                        <th>Total</th>
                                        <th>Ranking</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                        {(props.data.status!=="s" && props.data.status!=="y" && props.data.status!=="d" ) &&
                        <div className="row m-t-10">
                            <div className="col-sm-12">
                                <button type="submit" className="pull-left btn btn-sm btn-success"
                                disabled={props.loadings.loading_submit_bid || props.headers?.isFreeze==="y" || props.headers?.is_vendor_banned==="b"}
                                >
                                    {props.loadings.loading_submit_bid && <i className="fa fa-spinner fa-spin"></i> } 
                                    BID
                            </button>
                            </div>

                        </div>
                        }
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(Bid);
