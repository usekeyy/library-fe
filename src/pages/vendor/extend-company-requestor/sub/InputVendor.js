import React from 'react'
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const InputVendor = (props) => {
    console.log(props)

	const {t} = props;
	const { control, register, errors } = useForm({});

	const handleChangeVendor = (e) => {
		let selected = e.value;
		props.handleChangeVendor(selected)
	}

    const onInputChangeDataVendor= (option, {action}) => {
        if (action === "input-change") {
            props.getDataVendor(option)
        }
    }

    let msg = props.errors;
	let {loadings} = props;

    return (
        <div className="form-group">
            <label>Vendor <span className="text-danger">*</span></label>
            <div>
                <Controller
                    components={animatedComponents}
                    closeMenuOnSelect={true}
                    as={Select}
                    control={control}
                    options={props.m_vendor}
                    onChange={([selected]) => {
                        handleChangeVendor(selected)
                        return selected;
                    }}
                    onInputChange={onInputChangeDataVendor}
                    inputRef={(e) => register({ name: "vendor_id", required: false })}
                    name="vendor_id"
                    placeholder={loadings.vendor ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                    isLoading={loadings.vendor}
                    rules={{ required: false }}
                />
                {errors.vendor && <span className="text-danger">* This field is required</span>}
                {msg.vendor && <span className="text-danger">{msg.vendor[0]}</span>}
            </div>
        </div>
   )
}

export default withTranslation() (InputVendor)