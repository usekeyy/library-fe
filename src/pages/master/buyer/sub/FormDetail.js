import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { control } = useForm({});
	return (
		<div>
            <ModalBody>
                {/* <div className="form-group">
                    <label >{t("buyer:label.name")}</label>
                    <input disabled={true} className={"form-control"} name="name" defaultValue={props.data.name} />
                </div> */}
                <div className="form-group">
                    <label>{t("division:title")}</label>
                    <div>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            control={control}
                            options={props.m_division}
                            defaultValue={props.data.division_id}
                            name="division_id"
                            isDisabled={ true }
                            isLoading={false}
                            rules={{ required: true }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>{t("purchasingOrg:title")}</label>
                    <div>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            control={control}
                            options={props.m_purchasing_org}
                            defaultValue={props.data.purchasing_org_id}
                            name="purchasing_org_id"
                            isDisabled={ true }
                            isLoading={false}
                            rules={{ required: true }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>{t("purchasingGroup:title")}</label>
                    <div>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={false}
                            as={Select}
                            control={control}
                            options={props.m_purchasing_groups}
                            defaultValue={props.data.purchasing_groups}
                            name="purchasing_groups"
                            isLoading={false}
                            isDisabled={ true }
                            rules={{ required: true }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                            isClearable
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label >{t("buyer:title")}</label>
                    <div>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            control={control}
                            defaultValue={props.data.user_id}
                            options={props.m_user}
                            name="user_id"
                            isLoading={false}
                            isDisabled={ true }
                            rules={{ required: true }}
                            />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("buyer:button.close")}</button>
            </ModalFooter>
		</div>
	);
}

export default  withTranslation() (RouteForm);