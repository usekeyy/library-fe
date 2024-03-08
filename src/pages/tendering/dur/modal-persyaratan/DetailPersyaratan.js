import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';

const DetailPersyaratan = (props) => {
    const { t } = props;
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader  noButton={true}>Header</PanelHeader>
                <PanelBody>
                    <div className="row">
                        <div className="col-sm-12">
                        <label>{ t("dur:label.evaluation-method") } : {props.metode_evaluasi} </label>
                        </div>
                    </div>
                    { props.metode_evaluasi!=="sistem_gugur" && 
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{ t("dur:label.bobot-teknis") }</label>
                                <div className="col-sm-10">
                                    <input type="text" disabled={true} className="form-control" placeholder="" defaultValue={props.data.bobot_teknis !== undefined ? formatNumber(props.data.bobot_teknis,2) : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{ t("dur:label.bobot-commercial") }</label>
                                <div className="col-sm-10">
                                    <input type="text" disabled={true} className="form-control" placeholder="" defaultValue={props.data.bobot_komersil !== undefined ? formatNumber(props.data.bobot_komersil,2) : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{ t("dur:label.passing-grade") }</label>
                                <div className="col-sm-10">
                                    <input type="text" disabled={true} className="form-control" placeholder="" defaultValue={props.data.ambang_batas !== undefined ? formatNumber(props.data.ambang_batas,2) : ''}  />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    }
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DetailPersyaratan);