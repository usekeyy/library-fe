import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const animatedComponents = makeAnimated();

const ServiceLine = (props) => {
		const { register, handleSubmit, control } = useForm({});
    const { t } = props;  
		const {master} = props.parentState;
		const onSubmit = data => {
			const sendObj = {
					"seq": data.seq,
					"distribution": data.distribution,
					"qty": data.qty,
					"net_value": data.net_value,
					"gl_account_id": data.gl_account_id?.value,
					"cost_center_id": data.cost_center_id?.value,
					"asset": data.asset_id?.value,
					"profit_center": data.profit_center_id?.value,
					"wbs_element": data.wbs_id?.value,
					"line_number": data.line_number,
					"activity_number": data.activity_number,
					"short_text": data.short_text,
					"per": data.per,
					"gross_value": data.gross_value,
					"uom": data.uom_id?.value
			};
			// console.log(sendObj);
			props.addServiceLine(sendObj);
			props.toggleClose();
		};

		const onInputChange = (type, option, action) => {
			if (action === "input-change") {
				switch(type) {
					case 'gl_account':
						props.fetchAssets(option)
						break;
					case 'cost_center':
						props.fetchGlAccount(option)
						break;
					case 'asset':
						props.fetchCostCenter(option)
						break;
					case 'profit_center':
						props.fetchProfitCenter(option)
						break;
					case 'wbs':
						props.fetchWbsProject(option)
						break;
					case 'uom':
						props.fetchUom(option)
						break;
					default:
						// code block
				}
			}
		};

    return (
        <div>
					<form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
                <Panel className="margin-bot-false">
                    <PanelHeader>Service Line</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">

															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">Seq</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="seq" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">distribution</label>
																	<div className="col-sm-10">
																			<input type="text" readOnly={false} name="distribution" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">line_number</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="line_number" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">activity_number</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="activity_number" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">short_text</label>
																	<div className="col-sm-10">
																			<input type="text" readOnly={false} name="short_text" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">qty</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="qty" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">per</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="per" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">net_value</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="net_value" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">gross_value</label>
																	<div className="col-sm-10">
																			<input type="number" readOnly={false} name="gross_value" ref={register({})} className="form-control" placeholder="" defaultValue={''} />
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">gl_account</label>
																	<div className="col-sm-10">
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="gl_account_id" 
																				onInputChange={(props, {action}) => onInputChange('gl_account', props, action)}
																				options={master.gl_account} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">uom</label>
																	<div className="col-sm-10">
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="uom_id" 
																				onInputChange={(props, {action}) => onInputChange('uom', props, action)}
																				options={master.uom} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">cost_center</label>
																	<div className="col-sm-10">
																			{/* <input type="text" readOnly={false} name="cost_center" ref={register({})} className="form-control" placeholder="" defaultValue={''} /> */}
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="cost_center_id" 
																				onInputChange={(props, {action}) => onInputChange('cost_center', props, action)}
																				options={master.cost_center} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">asset</label>
																	<div className="col-sm-10">
																			{/* <input type="text" readOnly={false} name="asset" ref={register({})} className="form-control" placeholder="" defaultValue={''} /> */}
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="asset_id" 
																				onInputChange={(props, {action}) => onInputChange('asset', props, action)}
																				options={master.asset} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">profit_center</label>
																	<div className="col-sm-10">
																			{/* <input type="text" readOnly={false} name="profit_center" ref={register({})} className="form-control" placeholder="" defaultValue={''} /> */}
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="profit_center_id" 
																				onInputChange={(props, {action}) => onInputChange('profit_center', props, action)}
																				options={master.profit_center} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>
															<div className="form-group row">
																	<label className="col-sm-2 col-form-label">wbs_element</label>
																	<div className="col-sm-10">
																			{/* <input type="text" readOnly={false} name="wbs_element" ref={register({})} className="form-control" placeholder="" defaultValue={''} /> */}
																			<Controller
																				components={animatedComponents}
																				as={Select}
																				control={control}
																				name="wbs_id" 
																				onInputChange={(props, {action}) => onInputChange('wbs', props, action)}
																				options={master.wbs} 
																				defaultValue={''}
																				isDisabled={props.disabledForm}
																			/>
																	</div>
															</div>

                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
                <button className="btn btn-success" type="submit">{t("costCenter:button.submit")}</button>
            </ModalFooter>
					</form>
        </div>
    );
}

export default withTranslation()(ServiceLine);
