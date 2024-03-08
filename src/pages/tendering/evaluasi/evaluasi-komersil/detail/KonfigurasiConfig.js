import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';


const KonfigurasiConfig = (props) => {

    // const { register,errors } = useFormContext();
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>
                        <button className="btn btn-sm btn-danger">DELETE</button>
                    </td>                    
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Konfigurasi Evaluasi Komersial</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Description</th>
                                            <th>Action</th>
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
                                <div className="row pull-right m-t-10">
                                    <button type="submit"  className="m-r-10 btn btn-info">Save</button>
                                    <button type="button" className="m-r-10 btn btn-light">Add</button>
                                </div>
                            </div>
                        </div>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(KonfigurasiConfig);