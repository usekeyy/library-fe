import React from 'react';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { statusColorAuction } from '../../../../../helpers/colorTransform';
import { statusPesertaAuction } from '../../../../../helpers/statusName';

const PesertaAuctionHistory = (props) => {
    // const { t } = props;
    let rows ;

    if (props.data?.length > 0) {
        rows = props.data?.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{(i+1)}</td>
                    <td>{dt.vendor_id}</td>
                    <td>{dt.name}</td>
                    <td align="center" style={{backgroundColor:statusColorAuction(dt.status), fontWeight:"bold", color : (dt.status==="n") ? "black":"white" }}>
                        {statusPesertaAuction(dt.status)}
                    </td>
                    <td align="center" style={{backgroundColor:dt.is_freeze==="n" ? "green" : "red", fontWeight:"bold", color : "white"}}>
                        {dt.is_freeze==="y" ?  "Freeze" : "UnFreeze"}
                    </td>
                </tr>
            )
        })
    } else if (props.data?.length === 0) {
        rows = (<RowEmpty colSpan='5'> Tidak ada data </RowEmpty>);
    }

    return (
        <div>
            <Panel className="m-t-5">
                <PanelHeader>Peserta Auction</PanelHeader>
                <PanelBody>
                    <div className="row table-responsive">
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>No Peserta</th>
                                    <th>Nama Peserta</th>
                                    <th>Status</th>
                                    <th>Freeze State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(PesertaAuctionHistory);