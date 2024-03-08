import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import moment from 'moment';
import { formatDate } from '../../../../helpers/formatDate';

const HistoryLogEmail = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = props.data.map(function (datax, index) {
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{datax.subject}</td>
                    <td>{datax.to}</td>
                    <td>{formatDate(datax.date,2)}</td>
                    <td>{datax.status === 'd' ? 'Sending' : datax.status === 'y' ? 'Sent' : ''}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>History Update</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Subject</th>
                                                <th>To</th>
                                                <th>Timestamp</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                            {/* <tr>
                                                <td>1</td>
                                                <td>{data.subject}</td>
                                                <td>{data.to}</td>
                                                <td>{formatDate(data.date,2)}</td>
                                                <td>{data.status === 'd' ? 'Sending' : data.status === 'y' ? 'Sent' : ''}</td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                {/* <button className="btn btn-success" type="submit" onClick={() => props.save(props.param)}>Confirm</button> */}
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(HistoryLogEmail);
