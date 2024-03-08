import React from 'react'; // { useState } 
import { Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';
// import AutosizeInput from 'react-input-autosize';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import NumberFormat from 'react-number-format';

const Pemenang = (props) => {
    // const { t } = props;  
		const formControl = {
			display: 'block',
			width: '80px',
			// height: 'calc(1.5em + .875rem + 2px)',
			padding: '.4375rem .75rem',
			fontSize: '.75rem',
			fontWeight: '400',
			lineHeight: '1.5',
			color: '#1f2225',
			backgroundColor: '#fff',
			backgroundClip: 'padding-box',
			border: '1px solid #dfe1e4',
			borderRadius: '6px',
		}
	// const [symbolsArr] = useState(["e", "E", "+", "-",","]);
	// const { errors } = useForm({});
    let rows;
    let rows2;

    const details = (e, data) => {
		props.modalPemenangDetail(data)
        e.preventDefault()
	}

    const onChange = (e, keys) => {    
        if(e.floatValue!==undefined){
            props.setValue(e.floatValue, keys)
        }else{
            props.setValue(0, keys)
        }
    }
		
		const { loading_pemenang_terpilih, arrSelectedVendor } = props.parentState;
    if (props.data !== undefined) {
        rows = props.data.map(function (data_vendor, index_vendor) {
            console.log(data_vendor)
            let pr_price = data_vendor.pr_price.toString().replace('.','').replace(',','.');
            let pr_qty = data_vendor.pr_qty.toString().replace('.','').replace(',','.');
            let pr_per = data_vendor.pr_per.toString().replace('.','').replace(',','.');

            let total_oe = (pr_price * pr_qty)/ pr_per; 
            const defaultQtyValue = (arrSelectedVendor[""+data_vendor.pr_number+""+data_vendor.pr_item_number+""].length > 1) ? 0 : data_vendor.qty_temp !== undefined ? data_vendor.qty_temp : data_vendor.qty_akhir;
            const defaultQtyAwal = data_vendor.qty_awal !== undefined ? data_vendor.qty_awal : null;
            const showQty = (arrSelectedVendor[""+data_vendor.pr_number+""+data_vendor.pr_item_number+""].length === 1) ? parseFloat(defaultQtyAwal.toString().replace('.','').replace(',','.')) : parseFloat(defaultQtyValue.toString().replace('.','').replace(',','.'));
            console.log(arrSelectedVendor)
            console.log(showQty)
            return (
                <tr key={data_vendor.pr_number+'-'+data_vendor.pr_item_number+'-'+data_vendor.vendor_id}>
                    <td style={{verticalAlign: 'middle'}}>{data_vendor.pr_number}</td>
                    <td style={{verticalAlign: 'middle'}}>{parseInt(data_vendor.pr_item_number)}</td>
                    <td style={{verticalAlign: 'middle'}}>{data_vendor.no_material !== null && data_vendor.no_material !== '' ? parseInt(data_vendor.no_material) : ''}</td>
                    <td style={{verticalAlign: 'middle'}}>{data_vendor.pr_item_description}</td>
                    <td style={{verticalAlign: 'middle'}}>{data_vendor.vendor_name}</td>
                    {props.metode_evaluasi === 'sistem_nilai' && <td align="right" style={{verticalAlign: 'middle'}}>{data_vendor.total_nilai}</td>}
                    <td align="right" style={{verticalAlign: 'middle', minWidth: '80px'}}>
											{/* <input type="number" className="form-control" /> */}
                        {data_vendor.pr_tipe === 'jasa' ?
                            data_vendor.qty_akhir :
                            ((props.status === 'd' || props.status === 'r') && props.user_uuid === props.created_by ?
                                // <AutosizeInput
                                //     inputStyle={formControl} 
                                //     type="number" 
                                //     min="0" 
                                //     step=".01"
                                //     max={parseFloat(pr_qty)} 
                                //     onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} 
                                //     onChange={(e) => onChange(e, data_vendor.pr_number+'-'+data_vendor.pr_item_number+'-'+data_vendor.vendor_id)}
                                //     name="subnumber" 
                                //     pattern='d\+\.\d\d$'
                                //     defaultValue={showQty}
                                                               
                                // /> 
                                <Controller
                                    as={NumberFormat} 
                                    // control={control} 
                                    decimalSeparator={'.'}
                                    decimalScale={2}
                                    name="subnumber"
                                    defaultValue={showQty}
                                    // className={(errors[`items.${i}.qty`]) ? "form-control is-invalid" : "form-control"}
                                    style={formControl} 
                                    onValueChange={(e) => onChange(e, data_vendor.pr_number+'-'+data_vendor.pr_item_number+'-'+data_vendor.vendor_id)}
                                    // disabled={showGoods_qty}
                                />
                                :
                                data_vendor.qty_akhir
                            )
                        }
                        {props.parentState.errors['winner.'+index_vendor+'.qty'] && 
                        <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                            <br></br>
                            {props.parentState.errors['winner.'+index_vendor+'.qty'][0].replace('winner.'+index_vendor, "") }
                        </span>
                        }
                    </td>
                    <td style={{verticalAlign: 'middle'}} align="right">{formatNumber(total_oe,2)}</td>
                    {/* <td style={{verticalAlign: 'middle'}} align="right">{formatNumber(data_vendor.total_awal,2)}</td> */}
                    <td style={{verticalAlign: 'middle'}} align="right">{formatNumber(parseFloat(data_vendor.total_akhir.toString().replace(',','.')),2)}</td>
                    <td style={{verticalAlign: 'middle'}} align="right">{data_vendor.delivery_time_akhir}</td>
                    <td style={{textAlign: 'center', width: '1%', verticalAlign: 'middle'}}><button className="btn btn-xs btn-info" onClick={(e) => details(e, data_vendor)}><i className="fa fa-file"></i></button></td>
                </tr>
            )
        });
    }

    if (props.data !== undefined) {
        let total_awal = []
        let total_akhir = []
        props.data.map(function(data_vendor, index_vendor) {
            total_awal[data_vendor.pr_number + '-' + data_vendor.pr_item_number] = parseFloat(data_vendor.pr_qty.toString().replace('.','').replace(',','.'))
            if (data_vendor.qty_temp === undefined) {
                data_vendor.qty_temp = data_vendor.qty_akhir.toString().replace('.','').replace(',','.')
            }
            if (total_akhir[data_vendor.pr_number + '-' + data_vendor.pr_item_number]) {
                total_akhir[data_vendor.pr_number + '-' + data_vendor.pr_item_number] += parseFloat(data_vendor.qty_temp.toString().replace(',','.'))
            }
            else {
                total_akhir[data_vendor.pr_number + '-' + data_vendor.pr_item_number] = parseFloat(data_vendor.qty_temp.toString().replace(',','.'))
            }
            return true
        })

        console.log(total_awal)
        console.log(total_akhir)

        rows2 = Object.keys(total_akhir).map(function (key, index) {
            let array_key = key.split('-')
            if (total_akhir[key] > total_awal[key]) {
                return (
                    <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}} key={index}>
                        No PR {array_key[0]} line item {array_key[1]}, total qty pemenang ({total_akhir[key]}) melebihi limit qty PR ({total_awal[key]})
                        { (total_akhir.length !== (index+1) ? <br /> : '')}
                    </span>
                )
            }
            else {
                return true
            }
        })
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Pemenang Terpilih</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No PR</th>
                                            <th>no Item</th>
                                            <th>No Material</th>
                                            <th>Short Text</th>
                                            <th>Nama Peserta</th>
                                            {props.metode_evaluasi === 'sistem_nilai' && <th>Total Nilai</th>}
                                            <th>Qty</th>
                                            <th>OE</th>
                                            {/* <th>Total Penawaran</th> */}
                                            <th>Total Nego</th>
                                            <th>Delivery Time</th>
                                            <th>Lampiran</th>
                                        </tr>
                                    </thead>
                                    <tbody>
																			{(!loading_pemenang_terpilih) &&rows}
																			{(loading_pemenang_terpilih) && <RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>}
																		</tbody>
                                </table>
                            </div>
                            <div>
                                {((props.status === 'd' || props.status === 'r') && props.user_uuid === props.created_by)
                                    && rows2
                                }
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Pemenang);
