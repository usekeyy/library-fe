import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../../helpers/formatNumber';

const Persyaratan = (props) => {
    const { t } = props;
    let rows;
    const { register, watch, errors } = useFormContext({});
    const watchAllFields = watch();

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{props.data[key]['description']}</td>
                    <td align="center">
                        <div className="switcher">
                            <input disabled={props.isMonitoring} type="checkbox" name={`hasil.${key}`} ref={register({})} id={"switcher_checkbox_" + key} defaultChecked={(props.data[key]['hasil'] === null || props.data[key]['hasil'] === "fail") ? false : true} value="1" />
                            <label htmlFor={"switcher_checkbox_" + key}></label>
                        </div>
                        <div>
                            <label>{(watchAllFields['hasil.' + index] === "1" || props.data[key]['hasil'] === "pass") ? "Pass" : "Fail"}</label>
                        </div>
                    </td>
                    <td>
                        <input disabled={props.isMonitoring} type="text" name={`keterangan.${key}`} 
                        ref={register({required:(watchAllFields['hasil.' + index] === "1" || props.data[key]['hasil'] === "pass") ? false : true})} 
                        className="form-control" defaultValue={props.data[key]['keterangan']} />
                        <input disabled={props.isMonitoring} type="hidden" name={`proposal_tender_syarat_id.${key}`} ref={register({})} className="form-control" defaultValue={props.data[key]['proposal_tender_syarat_id']} />
                        {errors.keterangan && errors.keterangan[index] && <span className="text-danger"> * This field is required </span>}
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Persyaratan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("evaluation:label.description")}</th>
                                            <th>{t("evaluation:label.result")}</th>
                                            <th>{t("evaluation:label.note")}</th>
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

export default withTranslation()(Persyaratan);
