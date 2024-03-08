import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { statusName } from '../../../../helpers/statusName';



const PersyaratanDetail = (props) => {
    // const { t } = props;  

    const details = (e, data) => {
		props.modals(data)
        e.preventDefault()
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Persyaratan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-wrap" align="center">
                                    <thead>
                                        <tr>
                                            <th style={{width: "1%"}}>No</th>
                                            <th>Persyaratan</th>
                                            <th style={{width: "1%"}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Pra Qualification</td>
                                            <td>
                                                <button className="btn btn-xs btn-white" onClick={(e) => details(e, props.data)}>Persyaratan</button>
                                                {/* <span> </span>
                                                <button className="btn btn-xs btn-white" onClick={() => props.toggleClose()}>Detail</button> */}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(PersyaratanDetail);
