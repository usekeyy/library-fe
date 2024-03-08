import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { statusColorAuction } from '../../../../helpers/colorTransform';
import { statusPesertaAuction } from '../../../../helpers/statusName';


const Rangking = (props) => {
    // const { t } = props;
    let rows = [];

   

    if (props.data?.length > 0 && props.data!==undefined && props.header!==undefined) {        
        props.data.forEach((element, i) => {
            rows.push(
                <tr key={i}>
                    <td align="center">{i+1}</td>
                    <td>{element['vendor_id']}</td>
                    <td>{element['vendor_name']}</td>
                    <td align="center" style={{backgroundColor:statusColorAuction(element['status']==="b"? element['status'] : (element['is_vendor_aggrement']===null) ? "n" : element['is_vendor_aggrement'] ), fontWeight:"bold", color : (element['is_vendor_aggrement']==="n" || element['is_vendor_aggrement']===null) ? "black":"white"}}>
                        {statusPesertaAuction(element['status']==="b"? element['status'] : (element['is_vendor_aggrement']===null) ? "n" : element['is_vendor_aggrement'] )}
                    </td>
                    <td align="center" style={{backgroundColor:element['is_freeze']==="n" ? "green" : "red", fontWeight:"bold", color : "white"}}>
                        {element['is_freeze']==="n" ? "Normal" : "Freeze"}
                    </td>
                    <td align="center">
                        <button className="btn btn-xs btn-white m-r-5" type="button" disabled={(props.access.C || props.access.U) ? (element['is_freeze']!=="y" || (new Date(props.socket_timer) > new Date (props.header?.end_auction)) || (props.header?.status !== "p") ) ? true : false: true} onClick={(e)=> props.toggleConfirmFreeze(e, element['vendor_id'], 'n')}>
                            UNFREEZE
                        </button>
                        <button className={element['status']==="b" ? "btn btn-xs btn-success m-r-5" : "btn btn-xs btn-danger m-r-5"} type="button" disabled={(props.access.C || props.access.U) ? (props.header?.status !== "y" && props.header?.status !== "s" && (new Date(props.socket_timer) < new Date (props.header?.end_auction))) ? false: true : true } onClick={(e)=>props.toggleConfirm(e,element['vendor_id'],element['status']!=="b" ? "b" : "y")}>
                            {element['status']==="b" ? "UNBANNED" : "BAN"}
                        </button>
                        <button className="btn btn-xs btn-white m-r-5" type="button" onClick={()=>props.historyVendor(element['vendor_id'])}>
                            HISTORY
                        </button>
                        {/* {(new Date (props.socket_timer) < new Date(props.header.start_auction)) &&
                            <button className="btn btn-xs btn-white m-r-5" type="button" onClick={ () => props.penawaranVendor(element['vendor_id']) }>
                                BID
                            </button>
                        } */}
                    </td>
                </tr>
            )
        });
    }

    // const submit_freeze_vendor = (vendor_id , status) => {
    //     props.editFreezeVendor(vendor_id, {is_freeze : status})
    // }
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Peserta</PanelHeader>
                    <PanelBody>
                    {props.loadings.loading_peserta_panel &&
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    }
                    {!props.loadings.loading_peserta_panel &&
                        <div className="row table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>No Peserta</th>
                                        <th>Nama Peserta</th>
                                        <th>Status</th>
                                        <th>Freeze State</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                    }
                    </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Rangking);
