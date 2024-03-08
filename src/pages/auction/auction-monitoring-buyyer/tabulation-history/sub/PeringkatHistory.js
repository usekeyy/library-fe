import React from 'react';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
// import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';
// import { statusAuction } from '../../../../../helpers/statusName';


const PeringkatHistory = (props) => {
    // const { t } = props;
    let rows;

    if (props.data?.length > 0) {
        rows = props.data?.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{(i+1)}</td>
                    <td>{dt.vendor_name}</td>
                    <td align="right"> {formatNumber (dt.score_teknis,2 )}</td>
                    <td align="right"> {formatNumber (dt.score_komersil,2 )}</td>
                    <td align="right">
                        {formatNumber ((dt.score_teknis+dt.score_komersil),2 )}
                    </td>
                    <td align="right">
                        {formatNumber(dt.total_paket,2)}
                    </td>
                </tr>
            )
        })
    } else if (props.data?.length === 0) {
        rows = (<RowEmpty colSpan='6'> Tidak ada data </RowEmpty>);
    }

    return (
        <div>
            <Panel className="m-t-5">
                <PanelHeader>Peringkat</PanelHeader>
                <PanelBody>
                    <div className="row table-responsive">
                        <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead>
                                <tr>
                                    <th>Peringkat</th>
                                    <th>Ranking</th>
                                    <th>Skor Teknis</th>
                                    <th>Skor Komersil</th>
                                    <th>Total Skor</th>
                                    <th>Total Penawaran</th>
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

export default withTranslation()(PeringkatHistory);