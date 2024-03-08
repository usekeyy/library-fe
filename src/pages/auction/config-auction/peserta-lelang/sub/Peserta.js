import React from 'react';
import { withTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';



const Rangking = (props) => {
    // const { t } = props;
    // let rows = []; 
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Peserta</PanelHeader>
                    <PanelBody>
                    {props.loadings.loading_peserta_panel &&
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    }
                    {!props.loadings.loading_peserta_panel &&
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-sm text-nowrap">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>No Peserta</th>
                                        <th>Nama Peserta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>{props.data?.vendor_id}</td>
                                        <td>{props.data?.vendor_name}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Rangking);
