import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const Persyaratan = (props) => {
    const { t } = props;  

    const details = (e, data) => {
        props.modalOpenPersyaratan(data)
        e.preventDefault()
    }
    

  //   const detailsTdp = (e) => {
  //       props.modalTDP()
  //       e.preventDefault()
	// }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.requirement")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Persyaratan</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Administation & Technical</td>
                                            <td><button className="btn btn-xs btn-info" onClick={(e)=>details(e,'administration')}>Detail</button></td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Commercial</td>
                                            <td><button className="btn btn-xs btn-info" onClick={(e)=>details(e,'commersial')}>Detail</button></td>
                                        </tr>
                                        {/* <tr>
                                            <td>3</td>
                                            <td>TDP Expired</td>
                                            <td><button className="btn btn-xs btn-info" onClick={(e)=>detailsTdp(e)}>Detail</button></td>
                                        </tr> */}
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

export default withTranslation()(Persyaratan);
