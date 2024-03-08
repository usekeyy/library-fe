import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { Button, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import moment from 'moment';

const DokumenPO = (props) => {
    const { t } = props;
    // console.log(props.document)

    let rows;
    // let rows_confirm;
    // let rows_approval;

    // Document PO
    if (props.document !== undefined) {
        rows = Object.keys(props.document).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.document[key]['description']}</td>
                    <td>
                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.document[key]['file']}`} > lampiran </a>
                    </td>
                    {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') && 
                        <td>
                            <button className="btn btn-xs btn-danger" value={props.document[key]['uuid']} onClick={(e) => props.toggleDelete(e, props.document[key]['uuid'], 'dokumen-po')} ><i className="fa fa-trash"></i></button>
                        </td>
                    }
                </tr>
            )
        });
    }

    // // TTD
    // if (props.data.list_approval !== undefined) {
    //     rows_approval = Object.keys(props.data.list_approval).map(function (key, index) {
    //         return (
    //             <tr key={key}>
    //                 <td>{index+1}</td>
    //                 <td>{props.data.list_approval[key]['nama']}</td>
    //                 <td>{props.data.list_approval[key]['jabatan']}</td>
    //                 <td>{moment(props.data.list_approval[key]['tanggal_ttd']).format("DD-MM-YYYY hh:mm:ss")}</td>
    //                 {/* <td>{props.data.list_approval[key]['tanggal_ttd']}</td> */}
    //             </tr>
    //         )
    //     });
    // }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Dokumen OA</PanelHeader>
                <PanelBody >
                    <h5>Dokumen OA</h5>
                    <Row>
                        {props.data.created_by === props.user.uuid && props.data.status === 'd' && 
                            <Col sm="8">
                                <div className="pull-right m-b-10">
                                    <Button color="primary" className="btn btn-sm btn-success" value='' onClick={() => props.toggleFormOpen('0')} >{t("buyer:button.add")}</Button>
                                </div>
                            </Col>
                        }
                        
                    </Row>
                    <Row>
                        <Col sm="8">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Dokumen</th>
                                            <th>File</th>
                                            {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r') && 
                                                <th>Action</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>

                    {/* {props.is_vendor === false && 
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama</th>
                                                <th>Jabatan</th>
                                                <th>Tanggal Penandatanganan</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows_approval}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    } */}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DokumenPO);
