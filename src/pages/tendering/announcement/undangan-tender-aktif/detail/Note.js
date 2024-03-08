import React from 'react';
import {useFormContext} from 'react-hook-form';
import {withTranslation} from 'react-i18next';
import {Panel, PanelHeader, PanelBody} from '../../../../../containers/layout/sub/panel/panel';

const Note = (props) => {
    // const {t} = props;
    const {register} = useFormContext();
    const {header} = props.parentState.vendor_registration_tender;
    const {errors} = props.parentState.vendor_registration_tender;

    return (
        <div>
            <Panel>
                <PanelHeader>Catatan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-md-12">
                            <textarea
                                name="note"
                                ref={register({})}
                                disabled={true}
                                className={(
                                    errors['header.note'])
                                    ? "form-control is-invalid"
                                    : "form-control"}
                                rows="4"
                                cols="50"
                                defaultValue={header.note_external}/> {
                                errors['header.note'] && <span className="text-danger">
                                        {errors['header.note'][0]}
                                    </span>
                            }
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Note);
