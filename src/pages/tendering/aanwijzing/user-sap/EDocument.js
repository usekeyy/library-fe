import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';

const EDocument = (props) => {
    const {edoc} = props.data;
    const { t } = props;

    const handleEdit = (e, id) => {
        e.preventDefault()
        props.editEdoc(id)
    }

    const handleDelete = (e, id) => {
        e.preventDefault()
        props.deleteEdoc(id)
    }
    
    const handleShowEdoc = (e) => {
        e.preventDefault()
        props.modalsEdoc();
    }
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("aanwijzing:label.e-doc-aanwijzing")}</PanelHeader>
                <PanelBody>
                    <Row>
                        {props.status_document === false && 
                            <Col sm="12">
                                <div className="pull-left m-b-10">
                                    <Button className="btn btn-sm btn-success" onClick={(e) => handleShowEdoc(e)}> {t("common:Button.Tambah")} </Button>
                                </div>
                            </Col>
                        }
                    </Row>
                    <div className="row m-t-5">
                        {props.errors.document_title && <span className="text-danger">* document title : {props.errors.document_title[0]} <br></br></span> }
                    </div>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>{t("aanwijzing:label.title")}</th>
                                            <th>{t("aanwijzing:label.created-by")}</th>
                                            <th>{t("aanwijzing:label.created-at")}</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.status_document && 
                                            <tr>
                                                <td>{edoc[0].title}</td>
                                                <td>{edoc[0].created_by_name}</td>
                                                <td>{edoc[0].created_at}</td>
                                                <td>
                                                    <div>
                                                        <button className="btn btn-xs btn-warning" onClick={(e) => handleEdit(e,0)} ><i className="danger fa fa-edit"></i></button>
                                                        <button className="btn btn-xs btn-danger" onClick={(e) => handleDelete(e,0)} ><i className="danger fa fa-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(EDocument);
