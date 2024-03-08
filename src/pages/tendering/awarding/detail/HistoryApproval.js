import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';

const HistoryApproval = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data.list_approval).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data.list_approval[key]['nama']}</td>
                    <td>{props.data.list_approval[key]['jabatan']}</td>
                    <td>{props.data.list_approval[key]['tanggal_ttd'] !== null && props.data.list_approval[key]['tanggal_ttd'] !== '' ? moment(props.data.list_approval[key]['tanggal_ttd']).format("DD-MM-YYYY HH:mm:ss") : ''}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>
                <Panel className="margin-bot-false">
                    <PanelHeader>List Approval</PanelHeader>
                    <PanelBody >
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
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(HistoryApproval);
