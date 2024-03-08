import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../../helpers/formatNumber';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import NumberFormat from 'react-number-format';
const animatedComponents = makeAnimated();


const ListPeserta = (props) => {
    const { t } = props;
    const { control, getValues } = useFormContext();
    // const [vendor, setVendor] = React.useState();
    let rows;
    if (props.data?.length > 0 && props.header?.order_placement === "paket") {
        rows = props.data?.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>
                        <input type="checkbox" checked={props.vendorsSelection.includes(dt.vendor_id)} onChange={() => props.onCheck(dt.vendor_id)} />
                    </td>
                    <td>{i + 1}</td>
                    <td>{dt.vendor_id}</td>
                    <td>{dt.vendor_name}</td>
                    {props.header.metode_evaluasi!=="sistem_gugur" && <td align="right">{formatNumber(dt.score_teknis, 2)}</td> } 
                    {props.header.metode_evaluasi!=="sistem_gugur" && <td align="right">{formatNumber(dt.score_komersil, 2)}</td> } 
                    {props.header.metode_evaluasi!=="sistem_gugur" && <td align="right">{formatNumber((parseFloat(dt.score_teknis) + parseFloat(dt.score_komersil)), 2)}</td> } 
                    <td align="right">{formatNumber(dt.harga_penawaran, 2)}</td>
                </tr>
            )
        })
    } else if (props.data?.length === 0 && props.header?.order_placement === "paket") {
        rows = (<RowEmpty colSpan={(props.header.metode_evaluasi==="sistem_gugur") ? '5' : '8' }> Tidak ada data </RowEmpty>);
    }

    if (props.data?.length > 0 && props.header?.order_placement === "itemize" && props.header?.metode_evaluasi==="sistem_nilai") {
        rows = props.data?.map((dt, i) => {
            let child = dt['vendor'].map((element,j) => {
                return (
                    <tr key={j}>
                        <td>
                            <input type="checkbox" checked={props.vendorsSelection[dt['pr_item_id']].includes(element['vendor_id'])} onChange={() => props.onCheckItemize(dt['pr_item_id'], element['vendor_id'],i)} />
                        </td>
                        <td>{j+1}</td>
                        <td>{element['vendor_id']}</td>
                        <td>{element['vendor_name']}</td>
                        <td style={{textAlign:"right"}} >{formatNumber(element['score_teknis'],2)}</td>
                        <td style={{textAlign:"right"}} >{formatNumber(element['score_komersil'],2)}</td>
                        <td style={{textAlign:"right"}} >{formatNumber(parseFloat(element['score_teknis']) + parseFloat(element['score_komersil']),2)}</td>
                        <td style={{textAlign:"right"}} >{formatNumber(element['price'],2)}</td>
                    </tr>
                )
            })
            return (
                <div className="row table-responsive m-t-10" key={i}>
                    <table className="table table-bordered table-striped table-sm" key={i}>
                        <thead>
                            <tr>
                                <th rowSpan="3">
                                   
                                </th>
                                <th rowSpan="3" align="center">{dt['material_no']==="" ? "" : parseInt(dt['material_no'])}</th>
                                <th rowSpan="3" align="center">{dt['number_pr']}</th>
                                <th rowSpan="3" align="center" style={{width:"30%"}} >{dt['short_text']}</th>
                                <th>QTY</th>
                                <th colSpan="3" align="right" style={{textAlign:"right"}}>{dt['qty']}</th>
                            </tr>
                            <tr>

                                <th>Harga Satuan</th>
                                <th colSpan="3" align="right" style={{textAlign:"right"}}>{formatNumber(dt['valuation_price'])}</th>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <th colSpan="3" align="right" style={{textAlign:"right"}}>{formatNumber(dt['valuation_price']*dt['qty'])}</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                <td>
                                    <input type="checkbox" checked={props.prKeyItem[dt['pr_item_id']]} onChange={()=>props.onCheckAllItemize(dt['pr_item_id'],i) } disabled={(props.access.C || props.access.U) ? false : true} />
                                </td>
                                <td>No</td>
                                <td>No Peserta</td>
                                <td>Nama Peserta</td>
                                <td>Score Teknis</td>
                                <td>Score Komersil</td>
                                <td>Total Nilai</td>
                                <td>Harga</td>
                            </tr>
                            {child}
                        </tbody>
                    </table>
                </div>
            )
        })
    }

     if (props.data?.length > 0 && props.header?.order_placement === "itemize") {
        rows = props.data?.map((dt, i) => {
            let child = dt['vendor'].map((element,j) => {
                return (
                    <tr key={j}>
                        <td>
                            <input type="checkbox" checked={props.vendorsSelection[dt['pr_item_id']].includes(element['vendor_id'])} onChange={() => props.onCheckItemize(dt['pr_item_id'], element['vendor_id'],i)} disabled={(props.access.C || props.access.U) ? false : true} />
                        </td>
                        <td>{j+1}</td>
                        <td>{element['vendor_id']}</td>
                        <td>{element['vendor_name']}</td>
                        {props.header?.metode_evaluasi==="sistem_nilai" && <td style={{textAlign:"right"}} >{formatNumber(element['score_teknis'],2)}</td> }
                        {props.header?.metode_evaluasi==="sistem_nilai" && <td style={{textAlign:"right"}} >{formatNumber(element['score_komersil'],2)}</td> }
                        {props.header?.metode_evaluasi==="sistem_nilai" && <td style={{textAlign:"right"}} >{formatNumber(parseFloat(element['score_teknis']) + parseFloat(element['score_komersil']),2)}</td> }
                        <td colSpan={(props.header?.metode_evaluasi==="sistem_nilai") ? "1" : "3"} style={{textAlign:"right"}} >{formatNumber(element['price'],2)}</td>
                    </tr>
                )
            })
            return (
                <div className="row table-responsive m-t-10" key={i}>
                    <table className="table table-bordered table-striped table-sm" key={i}>
                        <thead>
                            <tr>
                                <th rowSpan="3">
                                   
                                </th>
                                <th rowSpan="3" align="center">{dt['material_no']==="" ? "" : parseInt(dt['material_no'])}</th>
                                <th rowSpan="3" align="center">{dt['number_pr']}</th>
                                <th rowSpan="3" align="center" style={{width:"30%"}} >{dt['short_text']}</th>
                                <th>QTY</th>
                                <th colSpan={(props.header?.metode_evaluasi==="sistem_nilai") ?  "3" : "1"} align="right" style={{textAlign:"right"}}>{dt['qty']}</th>
                            </tr>
                            <tr>

                                <th>Harga Satuan</th>
                                <th colSpan={(props.header?.metode_evaluasi==="sistem_nilai") ?  "3" : "1"} align="right" style={{textAlign:"right"}}>{formatNumber(dt['valuation_price'])}</th>
                            </tr>
                            <tr>
                                <th>Total</th>
                                <th colSpan={(props.header?.metode_evaluasi==="sistem_nilai") ?  "3" : "1"} align="right" style={{textAlign:"right"}}>{formatNumber(dt['valuation_price']*dt['qty'])}</th>
                            </tr>
                        </thead>
                        <tbody>
                             <tr>
                                <td>
                                    <input type="checkbox" checked={props.prKeyItem[dt['pr_item_id']]} onChange={()=>props.onCheckAllItemize(dt['pr_item_id'],i)}  disabled={(props.access.C || props.access.U) ? false : true} />
                                </td>
                                <td>No</td>
                                <td>No Peserta</td>
                                <td>Nama Peserta</td>
                                {props.header?.metode_evaluasi==="sistem_nilai" && <td>Score Teknis</td> }
                                {props.header?.metode_evaluasi==="sistem_nilai" && <td>Score Komersil</td> }
                                {props.header?.metode_evaluasi==="sistem_nilai" && <td>Total Nilai</td> }
                                <td colSpan={(props.header?.metode_evaluasi==="sistem_nilai") ? "1" : "2"}>Harga</td>
                            </tr>
                            {child}
                        </tbody>
                    </table>
                </div>
            )
        })
    }

    const saveVendorSelection = (e) => {
        let data = getValues('vendor')
        if(data===undefined){
            toastr.warning('Please Select vendor',"This Value Must Selected")
        }else{
            props.addVendorSelection(data)
        }
        e.preventDefault();
	
	};

	const onInputChangeVendor = (option, { action }) => {
		if (action === "input-change") {
			props.getOptionsVendorAuction(option)
		}
	};

    return (
        <div>
            {props.header?.metode_peringkat==="multivariate" &&
            <Panel className="margin-bot-false">
                <PanelHeader>
                    SKOR
                </PanelHeader>
                <PanelBody>
                    <div className="row">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                       <td>No</td>
                                       <td>Description</td>
                                       <td>Bobot</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Bobot Teknis</td>
                                        <td>
                                            <Controller
                                                name={`bobot_teknis`}
                                                control={control}
                                                defaultValue={props.header.bobot_teknis==="" ? 0 : parseFloat(props.header.bobot_teknis)}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.access.C || props.access.U) ? (props.header?.status!=='n') ? true : false : true} />}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Bobot Komersil</td>
                                        <td>
                                            <Controller
                                                name={`bobot_komersil`}
                                                control={control}
                                                defaultValue={props.header.bobot_komersil==="" ? 0 : parseFloat(props.header.bobot_komersil)}                            
                                                className="form-control"                           
                                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} disabled={(props.access.C || props.access.U) ? (props.header?.status!=='n') ? true : false : true} />}
                                            />
                                        </td>
                                    </tr>
                                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
            }

            <Panel className="margin-bot-false">
                <PanelHeader>
                    {t("auction:panel.add-vendor-auction")}
                </PanelHeader>
                <PanelBody>
                    <div className="row">
                        {props.header?.source==="eproc" &&
                        <div className="col-sm-12">
                            {props.header?.order_placement === "paket" &&
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type="checkbox" checked={props.checkAll} onChange={(event) => props.handlerCheckAll(event)}  disabled={(props.access.C || props.access.U) ? false : true}/>
                                                </th>
                                                <th>No</th>
                                                <th> {t("auction:label.vendor-id")}</th>
                                                <th>{t("auction:label.vendor-name")}</th>
                                                {props.header.metode_evaluasi!=="sistem_gugur" && <th>Skor Teknis</th> }
                                                {props.header.metode_evaluasi!=="sistem_gugur" && <th>Skor Komersil</th> }
                                                {props.header.metode_evaluasi!=="sistem_gugur" && <th>Total Nilai</th> }
                                                <th>{t("auction:label.total-price")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            }

                            {props.header?.order_placement === "itemize" &&
                                <div>
                                    {rows}
                                </div>
                            }

                            {props.errors.vendor_id && <span className="text-danger">{props.errors.vendor_id[0]}</span>}
                        </div>
                        }
                        {props.header?.source==="free" &&
                            <div className="col-sm-12">
                                <div className="row">
                                <div className="col-sm-12">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        options={props.vendorOptions} 
                                        onInputChange={onInputChangeVendor}
                                        name="vendor" 
                                        placeholder={props.loadings.loading_vendor_options ? 'Sedang Memuat ..' : 'Pilih' }
                                        isLoading={props.loadings.loading_vendor_options}
                                        isDisabled = {(props.access.C || props.access.U) ? (props.header?.status!=='n') ? true : false : true}
                                        rules={{}}
                                    />
                                    {(props.access.C || props.access.U) && 
                                    <button className="btn btn-sm btn-white pull-right m-t-5"
                                        onClick={(e)=>saveVendorSelection(e,"click")}
                                        disabled={props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false)}
                                    >
                                        {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                                        {t("auction:button.add")}
                                    </button>
                                    }
                                    
                                    </div>
                                </div>
                            </div>
                        }
                        {props.header?.source==="eproc" &&
                        <div className="col-sm-12">
                            <div className="row pull-right">
                            {(props.access.C || props.access.U) &&
                                <button
                                    type="submit"
                                    className="btn btn-success m-r-5"
                                    disabled={(props.header?.order_placement === "itemize" && props.header?.is_retender_itemize.includes('p')) ? true : (props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false))}
                                >
                                    {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                                    {t("auction:button.save-draft")}
                                    </button>
                            }
                                <button
                                    type="button"
                                    className="btn btn-white m-r-5"
                                    disabled={props.loadings.loading_peserta_auction || ((props.header?.status!=='n') ? true : false)}
                                    onClick={() => props.toAuctionList()}
                                >
                                    {props.loadings.loading_peserta_auction && <i className="fa fa-spinner fa-spin"></i>}
                                    {t("auction:button.cancel")}
                            </button>
                            </div>
                        </div>
                        }                        
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListPeserta);
