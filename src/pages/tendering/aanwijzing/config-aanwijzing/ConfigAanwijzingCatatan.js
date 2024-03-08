import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import { formatDate } from '../../../../helpers/formatDate';

const ConfigAanwijzingCatatan = (props) => {

    // const { register,errors} = useFormContext();
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['process']}</td>
                    <td>{formatDate(props.data[key]['created_at'], true )}</td>
                    <td>{props.data[key]['note']}</td>                    
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Catatan</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Proses</th>
                                            <th>Tanggal</th>
                                            <th>Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    {/* <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note" ref={register({ required: true })} />
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row> */}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ConfigAanwijzingCatatan);