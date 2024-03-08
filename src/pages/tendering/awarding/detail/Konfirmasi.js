import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const Konfirmasi = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['vendor_id'] + ' - ' + props.data[key]['vendor_name']}</td>
                    <td>{props.data[key]['pr_number']}</td>
                    <td>{parseInt(props.data[key]['pr_item_number'])}</td>
                    <td>{props.data[key]['no_material'] !== null && parseInt(props.data[key]['no_material'])}{props.data[key]['name_material'] !== null && ' - ' + props.data[key]['name_material']}</td>
                    <td>{props.data[key]['pr_item_description']}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Pemenang</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Vendor</th>
                                                <th>No PR</th>
                                                <th>No Item</th>
                                                <th>No Material</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                    Pemenang telah terpilih. Surat Penunjukkan Pemenang akan tergenerate secara otomatis.                
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" type="submit" onClick={() => props.approveAwarding({status: 'y'})}>Confirm</button>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Konfirmasi);
