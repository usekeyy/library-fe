import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
// import { formatDate } from '../../../../helpers/formatDate';
import { formatNumber } from '../../../../helpers/formatNumber';


const Rangking = (props) => {
    // const { t } = props;
    let rows = [];
    let freeitemize ;

    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined && props.header?.metode_evaluasi === "sistem_nilai" && props.header?.order_placement === "paket" && props.header?.source === "eproc") {     
        props.data.forEach((element, i) => {
            rows.push(
                <tr key={i}>
                   <td>{element['ranking']}</td>
                   <td>{element['vendor_name']}</td>
                   <td align="right">{formatNumber(element['score_teknis'],2)}</td>
                   <td align="right">{formatNumber(element['score_komersil'],2)}</td>
                   <td align="right">{formatNumber((parseFloat(element['score_komersil']) + parseFloat(element['score_teknis'])),2)}</td>
                   <td align="right">{formatNumber(parseFloat(element['total_paket'])/parseFloat(props.header.denominimilisasi),2)}</td>
                </tr>
            )
        });
    }

    if (props.data?.length > 0 && props.data !== undefined && props.header!==undefined && props.header?.metode_evaluasi === "sistem_gugur" && props.header?.order_placement === "paket" && props.header?.source === "eproc") { 
        props.data.forEach((element, i) => {
            rows.push(
                <tr key={i}>
                    <td align="center">{i + 1}</td>
                    <td>{element['vendor_name']}</td>
                    <td align="right">{formatNumber(parseFloat(element['total_paket'])/parseFloat(props.header.denominimilisasi),2)}</td>
                </tr>
            )
        });
    }

    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined && props.header?.metode_penentuan_pemenang === "itemize" && props.header?.source === "free") {
        freeitemize = props.data?.map((row, i) => {
            // let peserta = [];
            return (
                <div className="row" key={i}>
                    <div className="table-responsive m-t-10">
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th rowSpan="3" style={{fontWeight:"bold", textAlign:"center", verticalAlign:"middle"}}>{i+1}</th>
                                    <th rowSpan="3" style={{ width: "30%", textAlign:"center", verticalAlign:"middle", fontWeight:"bold" }}></th>
                                    <th rowSpan="3" style={{fontWeight:"bold", textAlign:"center", verticalAlign:"middle"}}>{row['short_text']}</th>
                                    <th style={{fontWeight:"bold"}}>QTY</th>
                                    <th colSpan="3" style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(row['qty'],2)}</th>
                                </tr>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>Harga Satuan</th>
                                    <th colSpan="3" style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(parseFloat(row['unit_cost'])/parseFloat(props.header.denominimilisasi),2)}</th>
                                </tr>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>Total</th>
                                    <th colSpan="3" style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(parseFloat(row['total_cost'])/parseFloat(props.header.denominimilisasi),2)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{fontWeight:"bold"}}>
                                   <td style={{textAlign:"center"}} >Ranking</td>
                                   <td>No Peserta</td>
                                   <td>Nama Peserta</td>
                                   {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td>Skor Teknis</td> }
                                   {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td>Skor Komersil</td> }
                                   {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td>Total Nilai</td> }
                                   <td align="center" colSpan={(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") ? "0" : "2"} >{props.header.price_calculation==="diskon" ?  "Diskon" : "Harga"}</td>
                                </tr>
                                {
                                    row['detail_bid']?.map((element, j) => {
                                        return (
                                            <tr key={j}>
                                               <td style={{textAlign:"center"}}>{element['ranking']}</td>
                                               <td>{element['vendor_id']}</td>
                                               <td>{element['vendor_name']}</td>
                                               {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td align="right">{formatNumber(element['skor_teknis'],2)}</td> }
                                               {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td align="right">{formatNumber(element['skor_komersil'],2)}</td> }
                                               {(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") && <td align="right">{formatNumber((parseFloat(element['skor_komersil'])+parseFloat(element['skor_teknis'])),2)}</td> }
                                               <td align="right" colSpan={(props.header.metode_evaluasi==="sistem_nilai" || props.header?.metode_peringkat === "multivariate") ? "0" : "2"}>{props.header.price_calculation==="diskon" ?  formatNumber(element['diskon'],2): formatNumber(parseFloat(element['unit_price'])/parseFloat(props.header.denominimilisasi),2)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        })
    }

    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined && props.header?.metode_penentuan_pemenang === "itemize" && props.header?.source === "eproc") {
        freeitemize = props.data?.map((row, i) => {
            // let peserta = [];
            return (
                <div className="row" key={i}>
                    <div className="table-responsive m-t-10">
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th rowSpan="3" style={{fontWeight:"bold", textAlign:"center", verticalAlign:"middle"}}>{i+1}</th>
                                    <th rowSpan="3" style={{ width: "30%", textAlign:"center", verticalAlign:"middle", fontWeight:"bold" }}></th>
                                    <th rowSpan="3" style={{fontWeight:"bold", textAlign:"center", verticalAlign:"middle"}}>{row['short_text']}</th>
                                    <th style={{fontWeight:"bold"}}>QTY</th>
                                    <th colSpan={(props.header.metode_evaluasi==="sistem_nilai") ? "3" : "2"} style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(row['qty'],2)}</th>
                                </tr>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>Harga Satuan</th>
                                    <th colSpan={(props.header.metode_evaluasi==="sistem_nilai") ? "3" : "2"} style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(parseFloat(row['unit_cost'])/parseFloat(props.header.denominimilisasi),2)}</th>
                                </tr>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>Total</th>
                                    <th colSpan={(props.header.metode_evaluasi==="sistem_nilai") ? "3" : "2"} style={{fontWeight:"bold", textAlign:"right"}} align="right">{formatNumber(parseFloat(row['total_cost'])/parseFloat(props.header.denominimilisasi),2)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{fontWeight:"bold"}}>
                                   <td style={{textAlign:"center"}} >Ranking</td>
                                   <td>No Peserta</td>
                                   <td>Nama Peserta</td>
                                   {props.header.metode_evaluasi==="sistem_nilai" && <td>Skor Teknis</td> }
                                   {props.header.metode_evaluasi==="sistem_nilai" && <td>Skor Komersil</td> }
                                   {props.header.metode_evaluasi==="sistem_nilai" && <td>Total Nilai</td> }
                                   <td align="center" colSpan={(props.header.metode_evaluasi==="sistem_nilai") ? "0" : "2"}>{props.header.price_calculation==="diskon" ?  "Diskon" : "Harga"}</td>
                                </tr>
                                {
                                    row['detail_bid']?.map((element, j) => {
                                        return (
                                            <tr key={j}>
                                               <td style={{textAlign:"center"}}>{element['ranking']}</td>
                                               <td>{element['vendor_id']}</td>
                                               <td>{element['vendor_name']}</td>
                                               {props.header.metode_evaluasi==="sistem_nilai" && <td align="right">{formatNumber(element['score_teknis'],2)}</td> }
                                               {props.header.metode_evaluasi==="sistem_nilai" && <td align="right">{formatNumber(element['score_komersil'],2)}</td> }
                                               {props.header.metode_evaluasi==="sistem_nilai" && <td align="right">{formatNumber((parseFloat(element['score_teknis'])+parseFloat(element['score_komersil'])),2)}</td> }
                                               <td align="right" colSpan={(props.header.metode_evaluasi==="sistem_nilai") ? "0" : "2"}>{props.header.price_calculation==="diskon"?  formatNumber(element['diskon'],2) : formatNumber(parseFloat(element['unit_price'])/parseFloat(props.header.denominimilisasi),2)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        })
    }

    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined && props.header?.metode_penentuan_pemenang === "paket" && props.header?.source === "free") {
        props.data.forEach((element, i) => {
            rows.push(
                <tr key={i}>
                    <td align="center">{i + 1}</td>
                    <td>
                        {element['vendor_id']}
                    </td>
                    <td>
                        {element['vendor_name']}
                    </td>
                    {props.header?.metode_peringkat === "multivariate" && <td align="right">{formatNumber(element['score_teknis'],2)}</td>  }
                    {props.header?.metode_peringkat === "multivariate" && <td align="right">{formatNumber(element['score_komersil'],2)}</td>  }
                    {props.header?.metode_peringkat === "multivariate" && <td align="right">{formatNumber(parseFloat(element['score_teknis'])+parseFloat(element['score_komersil']),2)}</td>  }
                    <td align="center" >{props.header?.price_calculation==="diskon" ? formatNumber(element['diskon'],2) : formatNumber(parseFloat(element['total_paket'])/parseFloat(props.header.denominimilisasi), 2)}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Ranking</PanelHeader>
                <PanelBody>
                    {props.loadings.loading_rangking_panel &&
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    }
                    {!props.loadings.loading_rangking_panel && (props.header?.order_placement === "paket" || props.header?.order_placement === "itemize") &&
                        <div className="row table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    {props.header?.metode_evaluasi === "sistem_gugur" && props.header?.order_placement === "paket" &&
                                        <tr>
                                            <th>Peringkat</th>
                                            <th>Nama Vendor</th>
                                            <th>Harga Penawaran</th>
                                        </tr>
                                    }
                                    { props.header?.metode_evaluasi === "sistem_nilai" && props.header?.order_placement === "paket" &&
                                        <tr>
                                            <th>Peringkat</th>
                                            <th>Nama Vendor</th>
                                            <th>Score Teknis</th>
                                            <th>Score Komersial</th>
                                            <th>Total Score</th>
                                            <th>Total Penawaran</th>
                                        </tr>
                                    }
                                    
                                    
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    }
                    {props.header?.source === "free" && props.header?.metode_penentuan_pemenang === "paket" && props.header!==undefined &&
                    <div className="row table-responsive">
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead>
                                <tr>
                                    <th>Peringkat</th>
                                    <th>No Vendor</th>
                                    <th>Nama Vendor</th>
                                    {props.header?.metode_peringkat === "multivariate" && <th>Score Teknis</th>  }
                                    {props.header?.metode_peringkat === "multivariate" && <th>Score Komersil</th>  }
                                    {props.header?.metode_peringkat === "multivariate" && <th>Total Skor</th>  }
                                    <th>{props.header?.price_calculation==="diskon" ? "Diskon" : "Harga Penawaran"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                    }
                    {!props.loadings.loading_rangking_panel && props.header?.metode_penentuan_pemenang === "itemize" && props.header?.source === "free" && freeitemize }
                    {!props.loadings.loading_rangking_panel && props.header?.metode_penentuan_pemenang === "itemize" && props.header?.source === "eproc" && freeitemize }
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Rangking);