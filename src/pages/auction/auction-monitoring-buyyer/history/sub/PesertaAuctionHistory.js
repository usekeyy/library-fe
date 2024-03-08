import React from 'react';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';

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
                    <td>
                        <button className="btn btn-sm btn-white" onClick={()=> props.downloadHistoryVendorAuction(dt.vendor_id)}> Download </button>
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
                                    <th>Download</th>
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