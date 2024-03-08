import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
// import { formatNumber } from '../../../../helpers/formatNumber';

const Header = (props) => {
    // const { t } = props;
    const { register } = useFormContext();

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Created By</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="craeted_by" ref={register({})} className="form-control" placeholder="" defaultValue={props.created_by !==undefined ? props.created_by : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Source</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="source" ref={register({})} className="form-control" placeholder="" defaultValue="SAP" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Referensi</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="referensi" ref={register({})} className="form-control" placeholder="" defaultValue={props.param !== undefined ? props.param.referensi : ''} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Status</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly={true} name="status" ref={register({})} className="form-control" placeholder="" defaultValue="Aanwijzing" />
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