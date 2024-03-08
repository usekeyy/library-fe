import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../helpers/formatNumber';

const HeaderUser = (props) => {
    const { t } = props;
    // const { register } = useFormContext();

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.created-by")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-number")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.packet-title")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.start-date")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.end-date")}</label>
                                <div className="col-sm-9">
                                    <input type="text" readOnly className="form-control-plaintext" />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(HeaderUser);