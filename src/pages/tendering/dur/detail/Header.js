import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';

const Header = (props) => {
    const { t } = props;
    const { register } = useFormContext();

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.created-by")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="created_by_name" ref={register({})} className="form-control" placeholder="" defaultValue={props.created_by_name!==undefined ? props.created_by_name : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.purchasing-group")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="purchasing_group_id" ref={register({})} className="form-control" placeholder="" defaultValue={props.purchasing_group_id!==undefined ? props.purchasing_group_id : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.number-proposal-tender")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="number" ref={register({})} className="form-control" placeholder="" defaultValue={props.number!==undefined ? props.number : ''}  />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.reference")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="document_type" ref={register({})} className="form-control" placeholder="" defaultValue={props.reference!==undefined ? props.reference : ''} />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.proposal-tender-title")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="description" ref={register({})} className="form-control" placeholder="" defaultValue={props.title!==undefined ? props.title : ''}  />
                                    {/* {errors.des    cription && <span className="text-danger">{errors.description[0]}</span>} */}
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">{t("dur:label.proposal-tender-value")}</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="description" ref={register({})} className="form-control" placeholder="" defaultValue={props.total_value!==undefined ? formatNumber(props.total_value,2) : ''} />
                                    {/* {errors .description && <span className="text-danger">{errors.description[0]}</span>} */}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);