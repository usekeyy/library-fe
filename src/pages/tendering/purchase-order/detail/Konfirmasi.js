import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';

const Konfirmasi = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['purchasing_requisition_number']}</td>
                    <td>{parseInt(props.data[key]['item_no'])}</td>
                    <td>{props.data[key]['material_id'] !== null && props.data[key]['material_id'] !== '' ? parseInt(props.data[key]['material_id']) : ''}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>{props.data[key]['delivery_time']}</td>
                    <td>{props.data[key]['delivery_date'] !== null && props.data[key]['delivery_date'] !== '' ? moment(props.data[key]['delivery_date']).format("DD-MM-YYYY") : ''}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Detail Item</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No PR</th>
                                                <th>Line Item</th>
                                                <th>No Material</th>
                                                <th>Description</th>
                                                <th>Delivery Time</th>
                                                <th>Delivery Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                    Apakah sudah dilakukan penyesuaian Delivery Date?
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" type="submit" onClick={() => props.save(props.param)}>Confirm</button>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Konfirmasi);
