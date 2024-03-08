import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import QuillEditor from './QuillEditor'

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { control, register, errors, handleSubmit } = useForm({});
	// let msg = props.errors;
	const onSubmit = async data => {
		props.save(data);
	};

    const onInputChangePurchasingOrg = (option, { action }) => {
		if (action === "input-change") {
			props.fetchPurchasingOrg(option)
		}
		if (action === "set-value") {
			props.fetchPurchasingOrg('')
		}
    };

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label>Title <span className="text-danger">*</span></label>
						<input className={errors.title ? "form-control is-invalid" : "form-control"} name="title" ref={register({ required: true })}  defaultValue={props.data.title || ''} disabled={props.modalType==='detail' ? true : false}/>
						{errors.title && <span className="text-danger">* This field is required</span>}
						{props.errors.title && <span className="text-danger">{props.errors.title[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("purchasingOrg:title")} <span className="text-danger">*</span></label>
						<div>
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select}
								control={control}
								isDisabled={props.modalType==='detail' ? true : (props.user.has_roles.includes("ADM001") ? false : true)}
								options={props.m_purchasing_org}
								defaultValue={props.data.purchasing_org_id}
								onInputChange={onInputChangePurchasingOrg}
								inputRef={(e) => register({ name: "purchasing_org_id", required: false })}
								name="purchasing_org_id"
								placeholder={props.loadings.purchasing_org ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
								isLoading={props.purchasing_org}
								rules={{ required: false }}
							/>
							{errors.purchasing_org && <span className="text-danger">* This field is required</span>}
							{props.errors.purchasing_org && <span className="text-danger">{props.errors.purchasing_org[0]}</span>}
						</div>
					</div>
					<div className="form-group">
						<label>Status <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
							isDisabled={props.modalType==='detail' ? true : false}
                            as={Select}
                            control={control}
                            options={[
                                {
                                    value: 'y',
                                    label: 'Active',
                                },
                                {
                                    value: 'n',
                                    label: 'Inactive',
                                },
                            ]}
                            inputRef={(e) => register({ name: "status", required: false })}
                            name="status"
							defaultValue={props.data.status || {value: 'y', label: 'Active'} }
                            placeholder={ t("common:Select.Pilih") }
                            // isLoading={props.loadings.tax}
                            rules={{ required: false }}
                        />
						{/* {errors.status && <span className="text-danger"> {errors.status.type === "required" ? "Field harus diisi" : ''}  {errors.status.message} </span>} */}
					</div>
                    <div className="form-group">
						<QuillEditor text={props.data.content} setData={props.setData} modalType={props.modalType}/>
						{errors.content && <span className="text-danger">* This field is required</span>}
						{props.errors.content && <span className="text-danger">{props.errors.content[0]}</span>}
					</div>
                    {/* <div className="form-group">
                        <label className="col-form-label">Template</label>
                        <textarea rows="8" className={errors.content ? "form-control is-invalid" : "form-control"} name="content" ref={register({ required: true })}  defaultValue={props.data.content || ''} disabled={props.modalType==='detail' ? true : false}/>
						{errors.content && <span className="text-danger"> {errors.content.type === "required" ? "Field harus diisi" : ''}  {errors.content.message} </span>}
                    </div> */}
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("templateReminder:button.close")}</button>
					{props.modalType !== 'detail' &&
						<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("templateReminder:button.update") : t("templateReminder:button.submit")}</button>
					}
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);