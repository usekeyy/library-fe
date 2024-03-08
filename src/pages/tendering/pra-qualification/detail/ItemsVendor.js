import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../helpers/formatNumber';

const Items = (props) => {
    // const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['number_pr']}</td>
                    <td>{props.data[key]['material_id']!== null && props.data[key]['material_id'] !== '' ? parseInt(props.data[key]['material_id']) : ''}</td>
                    <td>{props.data[key]['short_text']}</td>
                    <td>{props.data[key]['qty']}</td>
                    <td>{props.data[key]['uom']}</td>
                </tr>
            )
        });
    }
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Item Terpilih</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No PR</th>
                                            <th>No Material</th>
                                            <th>Nama Material</th>
                                            <th>QTY</th>
                                            <th>Uom</th>
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

export default withTranslation()(Items);
