import React from 'react';
import {useFormContext, Controller} from 'react-hook-form';
import {withTranslation} from 'react-i18next';
import {Panel, PanelHeader, PanelBody} from '../../../../../containers/layout/sub/panel/panel';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const Note = (props) => {
    const {t} = props;
    const { register, control } = useFormContext();
    const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red' })}
    const {header} = props.parentState.tahap_nego;
    const {errors} = props.parentState.tahap_nego;
    const {loadings} = props.parentState;
    const m_process = [
        {value: 'nego', label: 'Proses Nego'},
        {value: 'evaluasi_oe', label: 'Evaluasi OE'},
        {value: 'awarding', label: 'Awarding'},
        {value: 'retender', label: 'Retender'},
        {value: 'batal-tender', label: 'Batal Tender'},
    ]

    const handleChange = (e) => {
        props.setMethodType(e.value)
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Resume</PanelHeader>
                <PanelBody >
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Catatan</label>
                        <div className="col-sm-10">
                            <textarea
                                name="header.note"
                                ref={register({})}
                                disabled={header.on_process}
                                className={(
                                    errors['header.note'])
                                    ? "form-control is-invalid"
                                    : "form-control"}
                                rows="4"
                                cols="50"
                                defaultValue={''}/> 
                                {errors['header.note'] && <span className="text-danger">{errors['header.note'][0]}</span>}
                            {errors['header.process_id'] && <span className="text-danger"> {errors['header.process_id'][0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Pilih Proses</label>
                        <div className="col-sm-10">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                placeholder={loadings.button ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={loadings.button}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                name={`header.status`}
                                styles={errors.status ? customStyles : {}}
                                control={control}
                                options={m_process} 
                                defaultValue={''}
                                rules={{ required: false }} 
                                isDisabled={header.on_process}
                                onChange={([selected]) => {
                                    handleChange(selected)
                                    return selected;
                                }}
                                isClearable={false} />
                            {errors['header.status'] && <span className="text-danger"> {errors['header.status'][0]} </span>}
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Note);
