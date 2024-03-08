import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import moment from 'moment';

const DetailLampiran = (props) => {
    const { t } = props;  
    // const [loading, setLoading] = React.useState(false)
		const loading = false;
    let rows;

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['no_expediting']}</td>
                    <td>{parseInt(props.data[key]['item_no'])}</td>
                    <td>{props.data[key]['material_id'] !== null && props.data[key]['material_id'] !== '' ? parseInt(props.data[key]['material_id']) : ''}</td>
                    <td>
                        {props.data[key]['file'] !== undefined && props.data[key]['file'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data[key]['file'] )} disabled={loading}>
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                            </button>
                        }
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelHeader>Lampiran</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Dokumen</th>
                                                <th>File</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
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

export default withTranslation()(DetailLampiran);
