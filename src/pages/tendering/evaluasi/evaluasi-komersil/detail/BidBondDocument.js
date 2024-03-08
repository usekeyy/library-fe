import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';



const BidBondDocument = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td align="right">{formatNumber(props.data[key]['bidbond'],2)}</td>
                    <td>{ formatDate(props.data[key]['bidbond_validity'], false)}</td>
                    <td>{<a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data[key]['bidbond_file']}` } > {props.data[key]['bidbond_file']} </a>}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Bid Bond</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>{t("evaluation:label.bid-bond-value")}</th>
                                            <th>{t("evaluation:label.validity-bid-bond")}</th>
                                            <th>{t("evaluation:label.bid-bond-attactment")}</th>
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

export default withTranslation()(BidBondDocument);
