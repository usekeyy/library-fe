import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import moment from 'moment';


const Catatan = (props) => {

    const { register,errors } = useFormContext();
    let rows;
    if (props.data.note !== undefined) {
        rows = Object.keys(props.data.note).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data.note[key]['created_by_name']}</td>
                    <td>{props.data.note[key]['note']}</td>
                    <td>{props.data.note[key]['created_at'] !== null && props.data.note[key]['created_at'] !== '' ? moment(props.data.note[key]['created_at']).format("DD-MM-YYYY") : ''}</td>
                </tr>
            )
        });
    }

	const handleChangeNote = (e) => {
        props.setOption(e.target.value, 'note')
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
                                            <th>Catatan</th>
                                            <th>Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => handleChangeNote(e)}/>
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