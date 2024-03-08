import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';


const animatedComponents = makeAnimated();

const Form = (props) => {
    const { register, handleSubmit, control, errors } = useForm({});
    const [accAssgCategory, setAccAssgCategory] = React.useState((props.data.account_category_id === undefined) ? null : props.data.account_category_id.value);

    const { t } = props;
    const onSubmit = data => {
        if (accAssgCategory === "U") {
            toastr.warning("Validation Account Assgment Category", "Please Choose Value Except U - Unknown");
        } else {
            props.save(setData(data))
        }

    };

    const setData = (data) => {
        // console.log(data)
        let datas = {
            account_category_id: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.value,
            object_account: "",
            gl_account_id: (data.gl_account === undefined || data.gl_account === null) ? "" : data.gl_account.value,
            account_category_name: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.label.split(" - ")[1],
            // gl_account_name: (data.gl_account === undefined || data.gl_account === null) ? "" : data.gl_account.label.split(" - ")[1],
            asset_no: (data.asset_no === undefined) ? "" : data.asset_no.value,
            // asset_no_description: (data.asset_no === undefined) ? "" : data.asset_no.label.split(" - ")[1],
            wbs_element: (data.wbs_element === undefined) ? "" : data.wbs_element.value,
            // wbs_project_description: (data.wbs_element === undefined) ? "" : data.wbs_element.label.split(" - ")[1],
            cost_center_id: (data.cost_center === undefined) ? "" : data.cost_center.value,
            // cost_center_name: (data.cost_center === undefined) ? "" : data.cost_center.label.split(" - ")[1],
            network: "",
            order_no: "",
        }
        if (accAssgCategory === "F") {
            datas.order_no = data.order
            datas.network = ""
        } else if (accAssgCategory === "N") {
            datas.network = data.order
            datas.order_no = ""
        }
        // console.log(datas)
        return datas
    }

    const changeAccAssgCategory = (selected) => {
        // delete props.data.account_category_id
        if (selected !== null) {
            setAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setAccAssgCategory(null)
        }
    }

    const onInputChangeWbs = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getWbsProject({
                selected: option,
            })
        }
    };

    const onInputChangeAsset = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getAssets({
                selected: option,
            })
        }
    };

    const onInputChangeCostCenter = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getCostCenter({
                selected: option,
            })
        }
    };

    const handleGlAccount = (selected) => {
        props.getGlAccount(selected)
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    return (
        <div>
            {/* <div className="col-sm-12"> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    {/* props disableModal false menampilkan Klasifikasi kalau true Hidden Classifikasi */}
                    <div className="form-group">
                        <label >Account Assignment Category <span className="text-danger">*</span></label>
                        {/* <input type="text" name="ass_category" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsAccAssgnCategory}
                            name="ass_category"
                            defaultValue={props.data.account_category_id}
                            isLoading={props.isLoading.acc_assgn_category}
                            onChange={([selected]) => {
                                changeAccAssgCategory(selected)
                                return selected
                            }}
                            // onChange={changeAccAssgCategory}
                            isClearable
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.ass_category ? customStyles : {}}
                        />
                        {errors.ass_category && <span className="text-danger">This field is required</span>}
                    </div>

                    {(accAssgCategory === "F" || accAssgCategory === "N") &&
                        <div className="form-group">
                            <label >Order<span className="text-danger">*</span></label>
                            <input type="text" defaultValue={props.data.account_category_number} disabled={(props.disableModal === true) ? true : false} name="order" ref={register({ required: true })} className="form-control" placeholder="" />
                            {errors.order && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    {(accAssgCategory === "U" || accAssgCategory === null) &&
                        <div className="form-group">
                            <label >Object Account Assegment<span className="text-danger">*</span></label>
                            <input type="text" defaultValue={props.data.account_assegment} disabled={(props.disableModal === true) ? true : true} name="account_assegment" ref={register({})} className="form-control" placeholder="" />
                        </div>
                    }

                    {accAssgCategory === "A" &&

                        <div className="form-group">
                            <label >Asset<span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsAssets}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeAsset}
                                name="asset_no"
                                defaultValue={props.data.account_category_number}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: true }}
                                styles={errors.asset_no ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.asset_no && <span className="text-danger">This field is required</span>}
                        </div>


                    }

                    {(accAssgCategory === "K") &&
                        <div className="form-group">
                            <label >Cost Center<span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsCost_center}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeCostCenter}
                                name="cost_center"
                                defaultValue={props.data.account_category_number}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: true }}
                                styles={errors.cost_center ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.cost_center && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    {(accAssgCategory === "P" || accAssgCategory === "Q") &&
                        <div className="form-group">
                            <label >WBS Element <span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsWbs_element}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeWbs}
                                name="wbs_element"
                                defaultValue={props.data.account_category_number}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: true }}
                                styles={errors.wbs_element ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.wbs_element && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    <div className="form-group">
                        <label >GL Account <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsGlAccount}
                            onInputChange={handleGlAccount}
                            name="gl_account"
                            defaultValue={props.data.gl_account}
                            isClearable
                            isDisabled={(props.disableModal === true || accAssgCategory === "U") ? true : false}
                            isLoading={props.isLoading.glaccount}
                            rules={{ required: true }}
                            styles={errors.gl_account ? customStyles : {}}
                        />
                        {errors.gl_account && <span className="text-danger">This field is required</span>}
                    </div>

                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
                    <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>
                </ModalFooter>
            </form>
        </div>
    );
}

export default withTranslation()(Form);