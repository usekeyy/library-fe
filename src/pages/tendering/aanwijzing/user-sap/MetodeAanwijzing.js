import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

const animatedComponents = makeAnimated();

const MetodeAanwijzing = (props) => {
    // const { t } = props;
    const { register, control} = useForm({});

    const handleChangeMetodeAanwijzing = (e) =>{
		let selected = e.value;
        props.setMetodeAanwijzing(selected)
	}


    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Metode Aanwijzing</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="4">
                            <div className="form-group">
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select}
                                    control={control}
                                    onChange={([selected]) => {
                                        handleChangeMetodeAanwijzing(selected)
                                        return selected;
                                    }}
                                    options={props.metode_aanwijzing}
                                    name="metode_aanwijzing_id"
                                    inputRef={(e) => register({ name: "metode_aanwijzing_id", required: true })}
                                    rules={{ required: true }}
                                />
                                {props.errors.metode_aanwijzing_id && <span className="text-danger">* This field is required</span>}
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(MetodeAanwijzing);