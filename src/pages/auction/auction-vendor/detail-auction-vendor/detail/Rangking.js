import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
// import { formatDate } from '../../../../../helpers/formatDate';
// import { statusName } from '../../../../../helpers/statusName';
import ReactLoading from 'react-loading';
// import { array } from 'yup';
import { formatNumber } from '../../../../../helpers/formatNumber';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';


const Rangking = (props) => {
    // const { t } = props;
    // const [loading] = React.useState(false)
    // const { register } = useFormContext();
    let rows = [];

    if (props.data?.length > 0 && props.data!==undefined &&  props.headers!==undefined) {
        props.data.forEach((element, i) => {
            // let total = 0
            element['detail_bid'].forEach((child, j) => {    
                if(props.headers?.metode_penentuan_pemenang==="paket"){
                    if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="tunjukan"){
                        rows.push(
                            <tr key={i+""+j}>
                                {j=== 0 && <td rowSpan={element['detail_bid']?.length} align="center">{element['ranking']}<span className="fa fa-trophy m-l-5 text-danger"></span></td> }
                                <td>{child['vendor_name']}</td>
                                <td>{child['short_text']}</td>
                                {j===0 && <td rowSpan={element['detail_bid']?.length} align="right">{
                                props.headers?.price_calculation==="diskon" ?  formatNumber(element['diskon'],2):
                                props.headers?.metode_peringkat==="multivariate" ?  formatNumber(element['score_total'],2) :
                                formatNumber(parseFloat(element['total_paket'])/parseFloat(props.headers.denominimilisasi),2)
                                }</td> }
                            </tr>
                        )
                    }else if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan"){
                        rows.push(
                            <tr key={i+""+j}>
                                {j=== 0 && <td rowSpan={element['detail_bid']?.length} align="center">{element['ranking']}<span className="fa fa-trophy m-l-5 text-danger"></span></td> }
                                <td>{child['vendor_name']}</td>
                                <td>{child['short_text']}</td>
                                {/* {j===0 && <td rowSpan={element['detail_bid']?.length} align="right">{formatNumber(element['total_paket'],2)}</td> } */}
                            </tr>
                        )
                    }else if(props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="tunjukan"){
                        rows.push(
                            <tr key={i+""+j}>
                                {/* {j=== 0 && <td rowSpan={element['detail_bid']?.length} align="center">{element['ranking']}<span className="fa fa-trophy m-l-5 text-danger"></span></td> }
                                <td>{child['vendor_name']}</td>*/}
                                <td>{child['short_text']}</td> 
                                {j===0 && <td rowSpan={element['detail_bid']?.length} align="right">{
                                props.headers?.price_calculation==="diskon" ?  formatNumber(element['diskon'],2) : (props.headers?.metode_peringkat==="multivariate" ?  formatNumber(element['score_total'],2) : formatNumber(parseFloat(element['total_paket'])/parseFloat(props.headers.denominimilisasi),2))}</td> }
                            </tr>
                        )
                    }
                }else if(props.headers?.metode_penentuan_pemenang==="itemize"){
                    if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="tunjukan"){
                        rows.push(
                            <tr key={i+""+j}>
                                <td>{child['ranking']}<span className="fa fa-trophy m-l-5 text-danger"></span></td>
                                <td>{child['vendor_name']}</td>
                                <td>{element['short_text']}</td>
                                <td align="right">{
                                props.headers?.price_calculation==="diskon" ?  formatNumber(child['diskon'],2):
                                props.headers?.metode_peringkat==="multivariate" ?  formatNumber(child['score_total'],2) :
                                formatNumber(parseFloat(child['total'])/parseFloat(props.headers.denominimilisasi),2)}
                                </td>
                            </tr>
                        )
                    }else if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan"){
                        rows.push(
                            <tr key={i+""+j}>
                                <td>{child['ranking']}<span className="fa fa-trophy m-l-5 text-danger"></span></td>
                                <td>{child['vendor_name']}</td>
                                <td>{element['short_text']}</td> 
                            </tr>
                        )
                    }else if(props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="tunjukan"){
                        if(child['ranking']===1){
                            rows.push(
                                <tr key={i+""+j}>
                                    <td>{element['short_text']}</td>
                                    <td align="right">{child['ranking']===1 && props.headers?.price_calculation==="diskon" ?  formatNumber(child['diskon'],2) : formatNumber(parseFloat(child['total'])/parseFloat(props.headers.denominimilisasi),2)}</td>
                                </tr>
                            )
                        }
                    }else if(props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan"){
                        // rows.push(
                        //     <tr key={i+""+j}>
                        //         <td></td>
                        //         <td></td>
                        //     </tr>
                        // )
                    }
                }
            })
        });
    }else{
        if(props.headers?.metode_penentuan_pemenang==="paket"){
            if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="tunjukan" ) {
                rows = (<RowEmpty colSpan='5'> Tidak ada data </RowEmpty>);
            }
            if(props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan" ) {
                rows = (<RowEmpty colSpan='3'> Tidak ada data </RowEmpty>)
            };
            if(props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="tunjukan" ) {
                rows = (<RowEmpty colSpan='2'> Tidak ada data </RowEmpty>)
            };
            if(props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan" ) {
                rows = (<RowEmpty colSpan='4'> Tidak ada data </RowEmpty>)
            };     
        }else if(props.headers?.metode_penentuan_pemenang==="itemize"){

        }
               
    }
    
    
    return (
        <div>            
            <Panel className="margin-bot-false">
                <PanelHeader>Visibilitas Nilai Terbaik</PanelHeader>
                {props.loadings.loading_data_rangking && 
                    <PanelBody>
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    </PanelBody>
                }
                {/* Tipe Paket */}
                {!props.loadings.loading_data_rangking &&
                    <PanelBody>
                        <div className="row table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">                                
                                <thead>
                                    {props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="tunjukan" && 
                                    <tr>
                                        <th>Peringkat</th> 
                                        <th>Peserta</th>
                                        <th>Description</th>
                                        <th>{props.headers?.price_calculation==="diskon" ? "Diskon": props.headers?.metode_peringkat==="multivariate" ? "Total Skor" : "Total Penawaran" }</th>
                                    </tr>
                                    }
                                    {props.headers?.visibilitas_peringkat_terbaik==="tunjukan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan" && 
                                    <tr>
                                        <th>Peringkat</th> 
                                        <th>Peserta</th>
                                        <th>Description</th>
                                    </tr>
                                    }
                                    {props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="tunjukan" && 
                                    <tr>
                                        <th>Description</th>
                                        <th>{props.headers?.price_calculation==="diskon" ? "Diskon": props.headers?.metode_peringkat==="multivariate" ? "Total Skor" : "Total Penawaran"}</th>
                                    </tr>
                                    }
                                    {props.headers?.visibilitas_peringkat_terbaik==="sembunyikan" && props.headers?.visibilitas_harga_terbaik==="sembunyikan" && 
                                    <tr>
                                        <th>Peringkat</th> 
                                        <th>Peserta</th>
                                        <th>Description</th>
                                        <th>{props.headers?.price_calculation==="diskon" ? "Diskon": props.headers?.metode_peringkat==="multivariate" ? "Total Skor" : "Total Penawaran"}</th>
                                    </tr>
                                    }
                                </thead>
                               
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(Rangking);