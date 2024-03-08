import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../helpers/formatNumber';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../helpers/formatDate';

const TdpExpired = (props) => {
    const { t } = props;  
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['vendor_id']}</td>
                    <td>{props.data[key]['vendor_name']}</td>
                    <td>{props.data[key]['nomor']}</td>
                    <td>{formatDate(props.data[key]['tanggal_berakhir'], false)}</td>
                </tr>
            )
        });
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>)
    }    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>{t("dur:label.vendor-number")}</th>
                                            <th>{t("dur:label.vendor-name")}</th>
                                            <th>TDP Number</th>
                                            <th>Expired Date</th>
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

export default withTranslation()(TdpExpired);