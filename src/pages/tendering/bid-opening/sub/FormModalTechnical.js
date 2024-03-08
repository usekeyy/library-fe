import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const FormModalTechnical = (props) => {
    const { t } = props;
    let rows;
    
    if (props.data.persyaratan !== undefined) {
        rows = Object.keys(props.data.persyaratan).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data.persyaratan[key]['description']}</td>
                    <td>{<a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data.persyaratan[key]['file']}` } > {props.data.persyaratan[key]['file']} </a>}</td>               
                </tr>
            )
        });
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <table className="table table-bordered table-striped table-sm text-nowrap">
                        <tbody>
                            <tr>
                                <td>{t("bidOpening:label.vendor-number")}</td>
                                <td>{props.data.vendor_id}</td>
                            </tr>
                            <tr>
                                <td>{t("bidOpening:label.vendor-name")}</td>
                                <td>{props.data.vendor_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
            <div className="col-md-12">
                <Panel className="margin-bot-false">
                    <PanelHeader>Header</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th align="center">No</th>
                                                <th align="center">{t("bidOpening:label.description")}</th>
                                                <th align="center">File</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </div>
            </div>
        </div>
    );
}

export default withTranslation()(FormModalTechnical);
