import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';


const PemenangPaket = (props) => {
    // const { t } = props;  
    let rows;
    // let Total=0;

    const details = (e, data) => {
		props.modalPemenangDetail(data)
        e.preventDefault()
	}

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    {
                        props.status === 'd' || props.status === 'r' ?
                            <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle' }}>
                                <input type="checkbox" checked={props.data[key]['is_winner'] === 'y' ? true : false} 
                                    onChange={(e) => props.handleChecklistWinnerPaket(e, props.data[key]['awarding_item_id']+'-'+props.data[key]['ranking'])} 
                                    disabled={props.user_uuid === props.created_by ?
                                        (props.data[key]['is_retender'] === 'y' ? true : false) :
                                        true}
                                    />
                            </td>
                            : 
                            (props.data[key]['is_winner'] === 'y' ? 
                                <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle', backgroundColor: 'green'}}>
                                    <input type="checkbox" checked={true} disabled={true}
                                        />
                                </td> :
                                <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>
                                    <input type="checkbox" checked={false} disabled={true}
                                        />
                                </td>)
                    }
                    <td>{props.data[key]['vendor_name']}</td>
                    <td align="right">{props.data[key]['ranking']}</td>
                    {props.metode_evaluasi === 'sistem_nilai' && <td align="right">{props.data[key]['total_nilai']}</td>}
                    <td align="right">{formatNumber(props.data[key]['total_value'],2)}</td>
                    {/* <td align="right">{formatNumber(props.data[key]['total_awal'],2)}</td> */}
                    <td align="right">{formatNumber(props.data[key]['total_akhir'],2)}</td>
                    <td style={{width:'1%'}}>{Math.max.apply(Math, props.data[key]['detail'].map(function(o) { return parseInt(o.delivery_time_akhir); })) }</td>
                    <td><button className="btn btn-xs btn-info" onClick={(e) => details(e, props.data[key])}><i className="fa fa-file"></i></button></td>
                </tr>
            )
        });
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
                                            <th>Award</th>
                                            <th>Nama Peserta</th>
                                            <th>Ranking</th>
                                            {props.metode_evaluasi === 'sistem_nilai' && <th>Total Nilai</th>}
                                            <th>OE</th>
                                            {/* <th>Total Penawaran</th> */}
                                            <th>Total Nego</th>
                                            <th>Delivey Time (Terbesar)</th>
                                            <th>Lampiran</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(PemenangPaket);
