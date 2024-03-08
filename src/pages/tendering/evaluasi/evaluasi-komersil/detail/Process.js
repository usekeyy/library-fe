import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import { toastr } from 'react-redux-toastr';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
const animatedComponents = makeAnimated();



const Process = (props) => {
    const { t } = props;
    const {  errors, control } = useFormContext({});
    const handleChange = (e) => {

    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Process</PanelHeader>
                <PanelBody >
                    <div className="col-sm-12">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <Controller
                                        components={animatedComponents}
                                        closeMenuOnSelect={true}
                                        as={Select}
                                        control={control}
                                        options={props.status}
                                        onChange={([selected]) => {
                                            handleChange(selected)
                                            return selected
                                        }}
                                        name="status"
                                        defaultValue={(props.header.evaluasi_komersil==="tidak lolos") ? {value:'tidak lolos',label:'fail'} : (props.header.evaluasi_komersil==="lolos") ? {value:'lolos',label:'pass'} : null }
                                        rules={{ required: true }}
                                    />
                                    {errors.status && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                        {!props.isMonitoring &&
                        <div className="row pull-right m-t-10">
                            <button type="submit" className="m-r-10 btn btn-info" disabled={props.loadings.loadingSaveAssignment}>  {props.loadings.loadingSaveAssignment && <i className="fa fa-spinner fa-spin"></i>} {t("common:Button.Update")} </button>
                            <button type="button" className="m-r-10 btn btn-light" disabled={props.loadings.loadingSaveAssignment} onClick={(e)=>props.back(e)}>  {t("common:Button.Kembali")}</button>
                        </div>
                        }
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Process);