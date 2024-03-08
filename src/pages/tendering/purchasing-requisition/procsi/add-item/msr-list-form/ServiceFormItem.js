import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
// import { toastr } from 'react-redux-toastr';
// import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';

const animatedComponents = makeAnimated();

const ServiceFormItem = (props) => {
    const { register, handleSubmit, control, errors } = useForm({});
    const { t } = props;
    const onSubmit = data => {
			const gross_value = parseFloat(data.valuation_price)*(parseFloat(data.qty)/parseFloat(data.per))
			const sendData = {
				"seq": 0,  
				"distribution": "00",
				"line_number": "0010",
				"activity_number": "00",
				"short_text": data.item_description,
				"qty": data.qty,
				"per": data.per,
				"net_value": data.valuation_price,
				"gross_value": gross_value, 
				"uom": data.uom?.value,
				"gl_account_id": null,
				"cost_center_id": null,
				"asset": null,
				"profit_center": null,
				"wbs_element": null
			}
			console.log(data)
            if(props.is_edit_service_line){
                props.updateServiceItem(props.data.uuid, sendData);
            }else{
                props.savePayload(sendData);
            }
    };
    const handleChangeUom = (selected) => {
        props.getUom(selected)
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }
		const {item_line_id} = props.parentState;
		console.log("item_line_id", item_line_id);
    return (
        <div>
            {/* <div className="col-sm-12"> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <div className="form-group">
                        <label >Description {props.hiddenForm.hiddenItemNo === false && <span className="text-danger">*</span>}</label>
                        <input type="text" defaultValue={props.data.short_text} name="item_description" ref={register({ required: true })} className={(errors.item_description) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={false} />
                        {errors.item_description && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Quantity <span className="text-danger">*</span> </label>
                        <Controller
                            name="qty"
                            control={control}
                            defaultValue={(props.data.qty === "" || props.data.qty === undefined) ? 0 : props.data.qty}
                            className="form-control"
                            as={<NumberFormat decimalSeparator={'.'} decimalScale={2}/>}
                            disabled={(props.disableModal === true) ? true : false}
                            rules={{
                                required: true, min: {
                                    value: 1,
                                    message: "Minimum Value is 0"
                                }
                            }}
                            min="1"
                            styles={errors.qty ? customStyles : {}}
                        />
					    {/* <input type="number" defaultValue={(props.data.qty === "" || props.data.qty === undefined) ? 0 : props.data.qty} disabled={false} name="qty" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.qty && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Uom <span className="text-danger">*</span></label>
                        {/* <input type="number" name="uom" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsUom}
                            onInputChange={handleChangeUom}
                            name="uom"
                            defaultValue={props.data.uom_id}
                            isClearable
                            isLoading={props.isLoading.uom}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.uom ? customStyles : {}}
                        />
                        {errors.uom && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Per</label>
                        <input type="number" disabled={(props.disableModal === true) ? true : false} name="per" ref={register({})} className="form-control" placeholder="" defaultValue={(props.data.per === "" || props.data.per === undefined) ? 0 : props.data.per}/>
                    </div>
                    <div className="form-group">
                        <label >Valuation Price <span className="text-danger">*</span> </label>
                        <Controller
                            name="valuation_price"
                            control={control}
                            defaultValue={(props.data.net_value === "" || props.data.net_value === undefined) ? 0 : props.data.net_value}
                            className="form-control"
                            as={<NumberFormat  decimalSeparator={'.'} decimalScale={2}/>}
                            disabled={(props.disableModal === true) ? true : false}
                            rules={{
                                required: true, min: {
                                    value: 1,
                                    message: "Minimum Value is 0"
                                }
                            }}
                            min="1"
                            styles={errors.valuation_price ? customStyles : {}}
                        />
                        {/* <input type="number" defaultValue={(props.data.valuation_price === "" || props.data.valuation_price === undefined) ? 0 : props.data.valuation_price} disabled={false} name="valuation_price" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.valuation_price && <span className="text-danger">{errors.valuation_price.type === "required" ? "Field harus diisi" : ''}  {errors.valuation_price.message}</span>}
                    </div>
                </ModalBody>
                {props.disableModal === false &&
                    <ModalFooter>
                        <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
                        <button className="btn btn-success" type="submit" disabled={props.loadings.loading_submit_modal}>{props.loadings.loading_submit_modal ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.is_edit_service_line ? 'Update' : 'Submit'}</button>
                    </ModalFooter>
                }
            </form>
        </div>
    );
}

export default withTranslation()(ServiceFormItem);