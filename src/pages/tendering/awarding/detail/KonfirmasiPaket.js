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
            if (props.data[key].is_winner === 'y')
            {
                return (
                    props.data[key].detail.map(function(d, i) {
                        return (
                            <tr key={key+'-'+i}>
                                {i === 0 && 
                                    <td rowSpan={props.data[key].detail.length} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{index+1}</td>
                                }
                                {i === 0 && 
                                    <td rowSpan={props.data[key].detail.length} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{props.data[key]['vendor_id'] + ' - ' + props.data[key]['vendor_name']}</td>
                                }
                                <td>{d['pr_number']}</td>
                                <td>{parseInt(d['pr_item_number'])}</td>
                                <td>{d['no_material'] !== null && parseInt(d['no_material'])}{d['name_material'] !== null && ' - ' + d['name_material']}</td>
                                <td>{d['pr_item_description']}</td>
                            </tr>
    
                        )
                    })
                )
            }
            else {
                return true
            }
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
