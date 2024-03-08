import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {statusName, statusVerifikasi} from '../../../../../../helpers/statusName';

const animatedComponents = makeAnimated();

const FormProfile = (props) => {
	const {t} = props;
	const errors_response = props.profile_vendor.errors;
	const {sendData} = props.profile_vendor;
	const {has_draft_verification} = props;
	const { register, control, handleSubmit } = useForm({});
	const customStyles = {
		control: (base, state) => ({
			...base,
			borderColor: state.isFocused ?
				'#ddd' : 'red',
		})
	}

	const onSubmit = async data => {
		// props.save(data);
		setOptions(data);
		props.save(data);
		console.log(data)
	};

	const setOptions = (data) => {
		data.company_type_id = typeof data.company_type_id.value !== "undefined" ? data.company_type_id.value : "";
		data.vendor_type_id = typeof data.vendor_type_id.value !== "undefined" ? data.vendor_type_id.value : "";
		data.purchasing_org_id = typeof data.purchasing_org_id.value !== "undefined" ? data.purchasing_org_id.value : "";
		data.pic_email = sendData.pic_email
		data.pic_name = sendData.pic_name
		data.pic_phone = sendData.pic_phone
		data.pic_phone_no = sendData.pic_phone
		data.status = sendData.status;
		if(data.website !== ''){ 
			data.website = data.website.includes('http') ? data.website : `http://${data.website}`;
		}
		delete data.status;
	}

	return (
		<div>
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="row">
				<div className="col-md-12">
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:tipe-vendor")}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={props.loadings.vendor_type ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.vendor_type}
								className="basic-multi-select"
								classNamePrefix="select"
								name="vendor_type_id"
								styles={errors_response.vendor_type_id ? customStyles : {}}
								// onInputChange={props.handleInputChange}
								control={control}
								options={props.profile_vendor.vendor_types} 
								defaultValue={sendData.vendor_type_id}
								isDisabled={true}
								rules={{ required: false }} />
							{errors_response.vendor_type_id && <span className="text-danger"> {errors_response.vendor_type_id[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:purchasing-organization")}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={props.loadings.purchasing_org ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.purchasing_org}
								className="basic-multi-select"
								classNamePrefix="select"
								name="purchasing_org_id"
								styles={errors_response.purchasing_org_id ? customStyles : {}}
								// onInputChange={props.handleInputChange}
								isDisabled={true}
								control={control}
								options={props.profile_vendor.purchasing_orgs} 
								defaultValue={sendData.purchasing_org_id}
								rules={{ required: false }}
								// isDisabled={has_draft_verification} 
							/>
							{errors_response.purchasing_org_id && <span className="text-danger"> {errors_response.purchasing_org_id[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:tipe-company")}<span className="text-danger">*</span></label>
						<div className="col-md-7">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={props.loadings.company_type ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.company_type}
								className="basic-multi-select"
								classNamePrefix="select"
								name="company_type_id"
								styles={errors_response.company_type_id ? customStyles : {}}
								// onInputChange={props.handleInputChange}
								control={control}
								options={props.profile_vendor.company_types} 
								defaultValue={sendData.company_type_id}
								rules={{ required: false }}
								isDisabled={has_draft_verification} />
							{errors_response.company_type_id && <span className="text-danger"> {errors_response.company_type_id[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:partner-name")} <span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" className={(errors_response.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: false })} placeholder="" defaultValue={sendData.name} disabled={has_draft_verification} />
						{errors_response.name && <span className="text-danger"> {errors_response.name[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:direktur-name")} <span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" className={(errors_response.direktur_utama) ? "form-control is-invalid" : "form-control"} name="direktur_utama" ref={register({ required: false })} placeholder="" defaultValue={sendData.direktur_utama} disabled={has_draft_verification} />
						{errors_response.direktur_utama && <span className="text-danger"> {errors_response.direktur_utama[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:email-perusahaan")} <span className="text-danger">*</span></label>
						<div className="col-md-7">
							<input type="text" className={(errors_response.email) ? "form-control is-invalid" : "form-control"} name="email" ref={register({ required: false })} defaultValue={sendData.email} disabled={has_draft_verification} />
						{errors_response.email && <span className="text-danger"> {errors_response.email[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:web-company")}</label>
						<div className="col-md-7">
							<input type="text" className={(errors_response.website) ? "form-control is-invalid" : "form-control"} name="website" ref={register({ required: false })} placeholder="http://www.example.com/" defaultValue={sendData.website} disabled={has_draft_verification} />
						{errors_response.website && <span className="text-danger"> {errors_response.website[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">Status</label>
						<div className="col-md-7">
							<div className="m-t-10"><label>{statusName(sendData.status)}</label></div>
						</div>
					</div>
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:status-verifikasi")}</label>
						<div className="col-md-7">
							<div className="m-t-10"><label>{statusVerifikasi(sendData.tipe_verifikasi) }</label></div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<div className="pull-right m-t-10 m-b-10">
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.profile_vendor.loadingButton}> 
							{props.profile_vendor.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
					</div>
				</div>
			</div>
		</form>
		</div>
	)
}

export default withTranslation() (FormProfile);