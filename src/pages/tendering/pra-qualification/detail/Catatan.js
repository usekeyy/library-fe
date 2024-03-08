import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';


const Catatan = (props) => {

    const { register } = useFormContext();
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['process']}</td>
                    <td>{props.data[key]['created_at']}</td>
                    <td>{props.data[key]['note']}</td>                    
                </tr>
            )
        });
    }

    const onChange = (e) => {
        props.onInputChangeCatatan(e.target.value)
    }

    const onClick = (e) => {
        e.preventDefault()
        props.save()
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
                    {props.uuid === props.created_by &&
                        <Row>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Catatan</label>
                                    <div className="col-lg-12">
                                        <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChange(e)}/>
                                        {props.status_catatan === false && <span className="text-danger">* This field is required</span>}
                                    </div>
                                    <div className="form-group">
                                        <div className="col-lg-12">
                                            <button
                                                className="btn btn-success pull-right"
                                                onClick={(e) => onClick(e)}
                                            > Send </button>
                                            <span className="pull-right"> </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Row>
                    }
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Catatan);