import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const ErrorSAP = (props) => {
    const { t } = props;  
    let rows;

    if (props.param !== undefined) {
        rows = Object.keys(props.param).map(function (key, index) {
            return (
                <tr key={key}>
                    <td style={{width: '1%'}}>{index+1}</td>
                    <td>{props.param[key]['message']}</td>
                    <td>{props.param[key]['message_detail']}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Error SAP</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm text-wrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Error</th>
                                                <th>Detail</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                <span className="text-danger">
                    *Pastikan sudah memperbaiki data sesuai error yang ada, sebelum melakukan sinkron PO ke SAP
                </span>
                {props.user.uuid === props.data.created_by &&
                    <button className="btn btn-success" type="submit" onClick={() => props.save()}>Sync</button>
                }
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ErrorSAP);
