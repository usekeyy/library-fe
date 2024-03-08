import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { useForm } from 'react-hook-form';

const HeaderVendor = (props) => {
    const { t } = props;
    const { register , handleSubmit } = useForm();
    const onSubmit = async data => {
        props.storeNoteAanwijzing(data)
    };

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("aanwijzing:label.note-aanwijzing")}</PanelHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group">
                                <label className="col-form-label">{t("aanwijzing:label.note-aanwijzing")}</label>
                                <textarea className={(props.errors.note_aanwijzing) ? "form-control is-invalid" :"form-control" }name="note_aanwijzing" ref={register()} defaultValue={props.note_aanwijzing}/>
                                {props.errors.note_aanwijzing && <span className="text-danger">{props.errors.note_aanwijzing[0]}</span>}
                            </div>
                        </Col>
                    </Row>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="pull-right m-t-5 m-b-5">
                                {new Date(props.date) < new Date() && props.status_aanwijzing !== "close"   &&
                                    <button
                                        disabled={props.loadings}
                                        type="submit"
                                        className="btn btn-success m-r-5">
                                            {props.loadings && <i className="fa fa-spinner fa-spin"></i> }
                                            {t("common:Button.Kirim")}
                                    </button>
                                    
                                }
                            </div>
                        </div>
                    </div>
                </PanelBody>
                </form>
            </Panel>
            <hr></hr>
        </div>
    );
}

export default withTranslation()(HeaderVendor);