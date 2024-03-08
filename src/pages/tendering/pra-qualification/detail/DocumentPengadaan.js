import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';


const DocumentPengadaan = (props) => {
    // const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['attachment_type']}</td>
                    <td>{props.data[key]['attachment_description']}</td>
                    <td>{<a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data[key]['file']}` } > {props.data[key]['file']} </a>}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['updated_at']}</td>
                    <td><input type="checkbox"  disabled={true} checked={parseInt(props.data[key]['share'])===1 ? true : false} /></td>                    
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Document Pengadaan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Tipe Lampiran</th>
                                            <th>Description</th>
                                            <th>File</th>
                                            <th>Upload BY</th>
                                            <th>Upload At</th>
                                            <th>Share</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DocumentPengadaan);
