import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import moment from 'moment';


const Catatan = (props) => {

    const { register,errors } = useFormContext();
    let rows;
    if (props.data.note_list !== undefined) {
        rows = Object.keys(props.data.note_list).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data.note_list[key]['created_by_name']}</td>
                    <td>{props.data.note_list[key]['process']}</td>
                    <td>{props.data.note_list[key]['note']}</td>
                    <td>{props.data.note_list[key]['created_at'] !== null && props.data.note_list[key]['created_at'] !== '' ? moment(props.data.note_list[key]['created_at']).format("DD-MM-YYYY HH:mm:ss") : ''}</td>
                </tr>
            )
        });
    }

    // const onChange = (e) => {
    //     props.setOption(e.target.value, 'notes')
    // } 

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Catatan</PanelHeader>
                <PanelBody>
                    {(props.user.has_roles.includes("INVER1") || props.user.has_roles.includes("INVER2") || props.user.has_roles.includes("BNDHRA")) &&
                        <Row>
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th style={{width:'1%'}}>No</th>
                                                <th>Dibuat Oleh</th>
                                                <th>Proses</th>
                                                <th>Catatan</th>
                                                <th>Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
                            </div>
                        </Row>
                    }
                    <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note"
                                        ref={register({ required: ((props.data.status === 'submitted' && props.user.has_roles.includes("INVER1")) || (props.data.status === 'received' && props.user.has_roles.includes("INVER2"))) ? true : false })}
                                        required={((props.data.status === 'submitted' && props.user.has_roles.includes("INVER1")) || (props.data.status === 'received' && props.user.has_roles.includes("INVER2"))) ? true : false}/>
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Catatan);