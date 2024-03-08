import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();
const Form = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});

  const onSubmit = async data => {
		props.save(data)
  };
	let msg = props.errors;
	let {loading} = props;
	let {loadings} = props;
	let {m_purchasing_org} = props;
	let {m_districts} = props;
	console.log(props);
  return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
					<ModalBody>
						<div className="form-group">
							<label >{t("plant:label.id")} <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.id || msg.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({required: true})} defaultValue={props.data.id || ''}/>
								{errors.id && <span className="text-danger">* This field is required</span>}
								{msg.id && <span className="text-danger"> {msg.id[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label >{t("plant:label.name")} <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.name || msg.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({required: true})} defaultValue={props.data.name || ''}/>
								{errors.name && <span className="text-danger">* This field is required</span>}
								{msg.name && <span className="text-danger"> {msg.name[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label >{t("plant:label.address")} <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.address || msg.address) ? "form-control is-invalid" : "form-control"} name="address" ref={register({required: true})} defaultValue={props.data.address || ''}/>
								{errors.address && <span className="text-danger">* This field is required</span>}
								{msg.address && <span className="text-danger"> {msg.address[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label >{t("plant:label.code-post")} <span className="text-danger">*</span></label>
							<div>
								<input className={(errors.postal_code || msg.postal_code) ? "form-control is-invalid" : "form-control"} name="postal_code" ref={register({required: true})} defaultValue={props.data.postal_code || ''}/>
								{errors.postal_code && <span className="text-danger">* This field is required</span>}
								{msg.postal_code && <span className="text-danger"> {msg.postal_code[0]} </span>}
							</div>
						</div>
						<div className="form-group">
							<label >{t("plant:label.district")} <span className="text-danger">*</span></label>
							<div>
								<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={loadings.districts ? 'Sedang Memuat ..' : 'Pilih' }
								isLoading={loadings.districts}
								className="basic-multi-select"
    						classNamePrefix="select"
								name="district_id"
								control={control}
								options={m_districts} 
								defaultValue={props.data.district_id}
								rules={{ required: true }}
								isClearable
								 />
								{errors.district_id && <span className="text-danger">* This field is required</span>}
								{msg.district_id && <span className="text-danger">{msg.district_id[0]}</span>}
							</div>
						</div>
						<div className="form-group">
							<label >{t("plant:label.purchasing-org")}<span className="text-danger">*</span></label>
							<div>
								<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={loadings.purchasing_org ? 'Sedang Memuat ..' : 'Pilih' }
								isLoading={loadings.purchasing_org}
								className="basic-multi-select"
    						classNamePrefix="select"
								name="purchasing_org_id"
								control={control}
								options={m_purchasing_org} 
								defaultValue={props.data.purchasing_org_id}
								rules={{ required: true }}
								isClearable
								 />
								{errors.purchasing_org_id && <span className="text-danger">* This field is required</span>}
								{msg.purchasing_org_id && <span className="text-danger">{msg.purchasing_org_id[0]}</span>}
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
								<button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("plant:button.cancel")}</button>
								<button className="btn btn-success" type="submit" disabled={loading}>
									{loading && <i className="fas fa-spinner fa-pulse"></i> }
									{props.uuid !== "" ? t("plant:button.update") : t("plant:button.submit")}
								</button>
					</ModalFooter>
			</form>
		</div>
  );
}

export default withTranslation() (Form);