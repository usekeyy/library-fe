import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatNumber } from '../../../../helpers/formatNumber';

const ListPeserta = (props) => {
    // const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{(props.bid_comersil!=="y" && props.bid_administrasi!=="y") ? '***' : props.data[key]['vendor_id']}</td>
                    <td>{(props.bid_comersil!=="y" && props.bid_administrasi!=="y") ? '***' : props.data[key]['vendor_name']}</td>
                    <td align="right">{(props.bid_comersil!=="y" && props.bid_administrasi!=="y") ? '***' : formatNumber(props.data[key]['valuation_price'],2)}</td>
                    <td>{props.data[key]['quote']}</td>
                    <td>{(props.bid_comersil!=="y" && props.bid_administrasi!=="y") ? '' : <button className="btn btn-xs btn-info"><i className="fa fa-info"></i> Detail</button>}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>list Peserta</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No Peserta</th>
                                            <th>Nama Peserta</th>
                                            <th>Penawaran</th>
                                            <th>Status</th>
                                            <th>Action</th>
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

export default withTranslation()(ListPeserta);
