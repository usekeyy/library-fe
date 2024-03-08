import React from 'react';
// import { useFormContext } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const PemenangDetail = (props) => {
    const { t } = props;  
    let rows;

    if (props.data_lampiran !== undefined && props.data_lampiran.length > 0) {
        rows = Object.keys(props.data_lampiran).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data_lampiran[key]['description']}</td>
                    <td>
                        {props.data_lampiran[key]['file'] !== null && props.data_lampiran[key]['file'] !== '' &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data_lampiran[key]['file'] )}>
                                <i className="fa fa-download"></i> Preview
                            </button>
                        }
                    </td>
                </tr>
            )
        });
    }

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        console.log(url)
        window.open(url, "_blank")
    }

    return (
        <div>
            <ModalBody>

                <Panel className="margin-bot-false">
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <td><b>No Vendor</b></td>
                                                <td>{props.data.vendor_id}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Nama Vendor</b></td>
                                                <td>{props.data.vendor_name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                    <PanelHeader>Header</PanelHeader>
                    {props.loading_lampiran && (
                        <center>
                        <br />
                        <ReactLoading type="cylon" color="#0f9e3e" />
                        <br />
                        </center>
                    )}
                    {props.loading_lampiran === false && (
                        <PanelBody >
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th style={{widht:"1%"}}>No</th>
                                                    <th>Description</th>
                                                    <th>File</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    )}
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(PemenangDetail);
