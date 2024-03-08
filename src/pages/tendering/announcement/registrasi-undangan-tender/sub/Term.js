import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const Term = (props) => {
		// const { t } = props;
		const {terms} = props.parentState.vendor_registration_tender;
		// const {header} = props.parentState.vendor_registration_tender;
		
    let rows;
    if (terms.length > 0) {
        rows = terms.map((item, key) => {
            return (
                <tr key={key}>
                    <td>{(key+1)}</td>
                    <td>{item.description}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Requirement</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Nomor</th>
                                            <th>Description</th>                     
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

export default withTranslation()(Term);
