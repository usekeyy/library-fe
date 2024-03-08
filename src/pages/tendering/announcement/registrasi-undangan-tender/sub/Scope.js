import React from 'react';
import {useFormContext} from 'react-hook-form';
import {withTranslation} from 'react-i18next';
import {Panel, PanelHeader, PanelBody} from '../../../../../containers/layout/sub/panel/panel';

const Scope = (props) => {
    // const {t} = props;
    const {register} = useFormContext();
    const {header} = props.parentState.vendor_registration_tender;
    const {errors} = props.parentState.vendor_registration_tender;

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Lingkup Pekerjaan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-md-12">
                            <textarea
                                name="lingkup_pekerjaan"
                                disabled={true}
                                ref={register({})}
                                className={(
                                    errors['header.lingkup_pekerjaan'])
                                    ? "form-control is-invalid"
                                    : "form-control"}
                                defaultValue={header.lingkup_pekerjaan}
                                rows="4"
                                cols="50"/> {
                                errors['header.lingkup_pekerjaan'] && <span className="text-danger">
                                        {errors['header.lingkup_pekerjaan'][0]}
                                    </span>
                            }
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Scope);
