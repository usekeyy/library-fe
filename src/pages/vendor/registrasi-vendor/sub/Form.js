import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputMask from 'react-input-mask';
import {restrictNumber} from '../../../../helpers/restrictNumber';
import Kompetensi from '../kompetensi/Kompetensi';

const animatedComponents = makeAnimated();
const Form = (props) => {
		const { register, control, handleSubmit, errors, setValue, getValues } = useForm({});
		// const [loading, setLoading] = React.useState(false)

		// const loading = props.loadings.form;
		const {t} = props;
		const {errors_response} = props;
		const [errorNote, setErrorNote] = React.useState(false);
		const {data} = props;
		const {uuid} = props;
		const {isRequestor} = props;
		const {master_data} = props.parentState;
		const {tempLuarNegeri} = props.parentState;
		const [disabledRegion, setDisabledRegion] = React.useState(false)
		const [disabledDistrict, setDisabledDistrict] = React.useState(true)
		const [disabledSubDistrict, setDisabledSubDistrict] = React.useState(true)
		const [disabledPostalCode, setDisabledPostalCode] = React.useState(true)
		const [isDalamNegeri, setIsDalamNegeri] = React.useState(true)
		const customStyles = { control: (base, state) => ({ ...base, borderColor: state.isFocused ? '#ddd' : 'red', }) }
		const vendor_type = (uuid !== '') ? tempLuarNegeri.vendor_type_id === 1 : isDalamNegeri;
		const onSubmit = async data => {
			setOptions(data);
			// console.log(data);
			props.save(data);

		};
		
		const setOptions = (data) => {
			data.company_type_id = typeof data.company_type_id.value !== "undefined" ? data.company_type_id.value : "";
			data.vendor_type_id = typeof data.vendor_type_id.value !== "undefined" ? data.vendor_type_id.value : "";
			data.purchasing_org_id = typeof data.purchasing_org_id.value !== "undefined" ? data.purchasing_org_id.value : "";
			data.address_country_id = typeof data.address_country_id.value !== "undefined" ? data.address_country_id.value : "";
			data.address_region_id = isDalamNegeri && typeof data.address_region_id.value !== "undefined" ? data.address_region_id.value : "";
			// data.search_terms_id = typeof data.search_terms_id.value !== "undefined" ? data.search_terms_id.value : "";
			data.address_district_id = isDalamNegeri && data.address_district_id.value !== undefined ? data.address_district_id.value : "";
			data.address_kecamatan_id = isDalamNegeri && data.address_kecamatan_id.value !== undefined ? data.address_kecamatan_id.value : "";
			data.address_postal_code = isDalamNegeri ? data.address_postal_code.value !== undefined ? data.address_postal_code.value : "" : getValues('address_postal_code');
			data.pic_phone_no = data.address_nomor_telepon;
			data.pic_main = "y";
			if (uuid !== ""){
				data.uuid = uuid
			}
			if(!isDalamNegeri){
				delete data.address_district_id;
				delete data.address_kecamatan_id;
				delete data.address_region_id;
			}
			// data.address_country_id = "ID";
			// data.address_district_id = "253";
			// data.address_kecamatan_id = "00317106";
			// data.address_postal_code = 61172
			// data.address_region_id = 635
			// data.direktur_utama = data.pic_name;
			// data.npwp_file = 'QCmto400Pyv51rLPsCIZ7qSWZbCxu7KjaC2A4yUL.pdf';
		}

		const handleChangeCountry = (e) => {
			let value = {
				country_id: e.value,
			};
			setDisabledRegion(false);
			if(isDalamNegeri){
				setDisabledSubDistrict(true)
				setDisabledPostalCode(true)
				setDisabledDistrict(true)
				props.fetchRegions(value)
			} else {
				setDisabledSubDistrict(false)
				setDisabledPostalCode(false)
				setDisabledDistrict(false)
			}
			setValue("address_region_id", '')
			setValue("address_district_id", '')
			
		}

		const handleChangeRegion = (e) => {
			setDisabledDistrict(false);
			let value = {
				region_id: e.value,
			};

			if(isDalamNegeri){
				setDisabledSubDistrict(true)
				setDisabledPostalCode(true)
			} else {
				setDisabledSubDistrict(false)
				setDisabledPostalCode(false)
			}
			setValue("address_district_id", '')
			props.fetchDistricts(value)
		}

		const handleChangeDistrict = (e) => {
			let value = {
				district_id: e.value,
			};
			setDisabledSubDistrict(false)
			setDisabledPostalCode(true)
			props.fetchSubDistricts(value)
		}

		const handleChangeSubDistrict = (e) => {
			let value = {
				sub_district_id: e.value,
			};
			setDisabledPostalCode(false)
			props.fetchPostcalCode(value)
		}

		const handleChangeTypeVendor = (e) => {
			setValue("address_country_id", '')
			setValue("address_region_id", '')
			setValue("address_district_id", '')
			setDisabledRegion(true);
			setDisabledDistrict(true);
			props.setCountry(e.value)
			if(e.value === 3){
				setIsDalamNegeri(false);
			} else {
				setIsDalamNegeri(true)
			}
		}

		// const handleChangeSearchTerms = (e) => {
		// 	props.fetchSearchTerms(e.value)
		// }

		const onChangeNote = (e) => {
			setErrorNote(false)
			props.setNoteApproval(e.target.value)
		}

		const handleApproval = (e,status) => {
			if (status === 'n' && getValues('note') === ''){
				setErrorNote(true)
			}else{
				props.handleApproval(status)
			}
			
		}
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Purchasing Organization')} <span className="text-danger">*</span></label>
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
									control={control}
									options={props.m_purchasing_org} 
									defaultValue={data.purchasing_org_id}
									isDisabled={(uuid !== '' && !isRequestor)}
									rules={{ required: false }}  />
								{errors_response.purchasing_org_id && <span className="text-danger"> {errors_response.purchasing_org_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{"No ERP"} </label>
							<div className="col-md-7">
								<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className={(errors_response.sap_code || errors.sap_code) ? "form-control is-invalid" : "form-control"} name="sap_code" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : false } defaultValue={data.sap_code} />
								{errors_response.sap_code && <span className="text-danger"> {errors_response.sap_code[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Tipe Vendor')} <span className="text-danger">*</span></label>
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
									onChange={([selected]) => {
										handleChangeTypeVendor(selected)
										return selected;
									}}
									control={control}
									options={props.m_vendor_type} 
									defaultValue={data.vendor_type_id}
									isDisabled={(uuid !== '' && !isRequestor)}
									rules={{ required: false }}  />
								{errors_response.vendor_type_id && <span className="text-danger"> {errors_response.vendor_type_id[0]} </span>}
							</div>
						</div>
						{/* <div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{"Search Term"} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.search_terms ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.search_terms}
									className="basic-multi-select"
									classNamePrefix="select"
									name="search_terms_id"
									styles={errors_response.search_terms_id ? customStyles : {}}
									// onInputChange={props.handleInputChange}
									onChange={([selected]) => {
										handleChangeSearchTerms(selected)
										return selected;
									}}
									control={control}
									options={props.m_search_terms} 
									defaultValue={data.search_terms_id}
									isDisabled={(uuid !== '' && !isRequestor)}
									rules={{ required: false }}  />
								{errors_response.search_terms_id && <span className="text-danger"> {errors_response.search_terms_id[0]} </span>}
							</div>
						</div> */}
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Tipe Perusahaan')} <span className="text-danger">*</span></label>
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
									control={control}
									options={props.m_company} 
									defaultValue={data.company_type}
									isDisabled={(uuid !== '' && !isRequestor)}
									rules={{ required: false }}  />
								{errors_response.company_type_id && <span className="text-danger"> {errors_response.company_type_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Nama Rekanan')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.name || errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({required: false})} placeholder="" disabled={(uuid !== '' && !isRequestor)} defaultValue={data.name} />
								{errors_response.name && <span className="text-danger"> {errors_response.name[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Negara')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{!props.loadings.country && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.country ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.country}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_country_id"
									styles={errors_response.address_country_id ? customStyles : {}}
									control={control}
									options={master_data.m_country} 
									defaultValue={data.address_country_id}
									isOptionDisabled={(options) => options.disabled === true}
									isDisabled={(uuid !== '' && !isRequestor)}
									onChange={([selected]) => {
										handleChangeCountry(selected)
										return selected;
									}}
									rules={{ required: false }}  />}
									{props.loadings.country && <i className="fas fa-spinner fa-pulse"></i> }
								{errors_response.address_country_id && <span className="text-danger"> {errors_response.address_country_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Provinsi')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{vendor_type && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.province ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.province}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_region_id"
									styles={errors_response.address_region_id ? customStyles : {}}
									control={control}
									options={master_data.m_province} 
									defaultValue={data.address_region_id}
									isDisabled={((uuid !== '' && !isRequestor)) ? true : disabledRegion }
									onChange={([selected]) => {
										handleChangeRegion(selected)
										return selected;
									}}
									rules={{ required: false }}  />}
								{!vendor_type && <input type="text" className={(errors_response.address_region_name || errors.address_region_name) ? "form-control is-invalid" : "form-control"} name="address_region_name" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : disabledDistrict } defaultValue={tempLuarNegeri.address_region_name} />}
								{errors_response.address_region_id && <span className="text-danger"> {errors_response.address_region_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kota/Kabupaten')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{vendor_type && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.district}
									className={vendor_type ? "basic-multi-select" : "is-hidden basic-multi-select"}
									classNamePrefix="select"
									name="address_district_id"
									styles={errors_response.address_district_id ? customStyles : {}}
									control={control}
									options={master_data.m_district} 
									defaultValue={data.address_district_id}
									isDisabled={((uuid !== '' && !isRequestor)) ? true : disabledDistrict }
									onChange={([selected]) => {
										handleChangeDistrict(selected)
										return selected;
									}}
									rules={{ required: false }}  />}
								{!vendor_type && <input type="text" className={(errors_response.address_district_name || errors.address_district_name) ? "form-control is-invalid" : "form-control"} name="address_district_name" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : disabledDistrict } defaultValue={tempLuarNegeri.address_district_name} />}
								{errors_response.address_district_id && <span className="text-danger"> {errors_response.address_district_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kecamatan')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{vendor_type && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.sub_district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.sub_district}
									className={vendor_type ? "basic-multi-select" : "is-hidden basic-multi-select"}
									classNamePrefix="select"
									name="address_kecamatan_id"
									styles={errors_response.address_kecamatan_id ? customStyles : {}}
									control={control}
									options={master_data.m_sub_district} 
									defaultValue={data.address_kecamatan_id}
									isDisabled={((uuid !== '' && !isRequestor)) ? true : disabledSubDistrict }
									onChange={([selected]) => {
										handleChangeSubDistrict(selected)
										return selected;
									}}
									rules={{ required: false }}  />}
								{!vendor_type && <input type="text" className={(errors_response.address_kecamatan_name || errors.address_kecamatan_name) ? "form-control is-invalid" : "form-control"} name="address_kecamatan_name" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : disabledSubDistrict } defaultValue={tempLuarNegeri.address_kecamatan_name} />}
								{errors_response.address_kecamatan_id && <span className="text-danger"> {errors_response.address_kecamatan_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kode Pos')} {vendor_type && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
								{vendor_type && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.postal_code ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.postal_code}
									className={vendor_type ? "basic-multi-select" : "is-hidden basic-multi-select"}
									classNamePrefix="select"
									name="address_postal_code"
									styles={errors_response.address_postal_code ? customStyles : {}}
									control={control}
									options={master_data.m_postal_code} 
									defaultValue={data.address_postal_code}
									isDisabled={((uuid !== '' && !isRequestor)) ? true : disabledPostalCode }
									onChange={([selected]) => {
										handleChangeSubDistrict(selected)
										return selected;
									}}
									rules={{ required: false }}  />}
								{!vendor_type && <input type="text" className={(errors_response.address_postal_code || errors.address_postal_code) ? "form-control is-invalid" : "form-control"} name="address_postal_code" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : disabledPostalCode } defaultValue={tempLuarNegeri.address_postal_code} />}
								{errors_response.address_postal_code && <span className="text-danger"> {errors_response.address_postal_code[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Alamat')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<textarea type="text" className={(errors_response.address_address || errors.address_address) ? "form-control is-invalid" : "form-control"} placeholder="" name="address_address" ref={register({required: false})} disabled={(uuid !== '' && !isRequestor)} defaultValue={data.address_address} />
								{errors_response.address_address && <span className="text-danger"> {errors_response.address_address[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No Telepon')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{/* <input type="text" className={(errors_response.address_nomor_telepon || errors.address_nomor_telepon) ? "form-control is-invalid" : "form-control"} name="address_nomor_telepon" ref={register({required: false})} placeholder="" /> */}
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.address_nomor_telepon || errors.address_nomor_telepon) ? "form-control is-invalid" : "form-control"}
									mask="999999999999"
									name="address_nomor_telepon"
									defaultValue={data.address_nomor_telepon}
									disabled={(uuid !== '' && !isRequestor)}
								/>
								{errors_response.address_nomor_telepon && <span className="text-danger"> {errors_response.address_nomor_telepon[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Email Perusahaan')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.email || errors.email) ? "form-control is-invalid" : "form-control"} name="email" ref={register({required: false})} placeholder="" disabled={(uuid !== '' && !isRequestor)} defaultValue={data.email} />
								{errors_response.email && <span className="text-danger"> {errors_response.email[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Nama PIC')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.pic_name || errors.pic_name) ? "form-control is-invalid" : "form-control"} name="pic_name" ref={register({required: false})} placeholder="" disabled={(uuid !== '' && !isRequestor)} defaultValue={data.pic_name} />
								{errors_response.pic_name && <span className="text-danger"> {errors_response.pic_name[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Email PIC')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.pic_email || errors.pic_email) ? "form-control is-invalid" : "form-control"} name="pic_email" ref={register({required: false})} placeholder="" disabled={(uuid !== '' && !isRequestor)} defaultValue={data.pic_email} />
								{errors_response.pic_email && <span className="text-danger"> {errors_response.pic_email[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No NPWP')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.npwp_number || errors.npwp_number) ? "form-control is-invalid" : "form-control"}
									mask="99.999.999.9-999.999"
									name="npwp_number"
									defaultValue={data.npwp_number}
									disabled={(uuid !== '' && !isRequestor)}
								/>
								{errors_response.npwp_number && <span className="text-danger"> {errors_response.npwp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:tdp-number")} </label>
							<div className="col-md-7">
								<input type="number" min="0" onKeyPress={(e) => restrictNumber(e)} className={(errors_response.tdp_number || errors.tdp_number) ? "form-control is-invalid" : "form-control"} name="tdp_number" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : false } defaultValue={data.tdp_number} />
								{errors_response.tdp_number && <span className="text-danger"> {errors_response.tdp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:tdp-valid")} </label>
							<div className="col-md-7">
								<input type="date" className={(errors_response.tdp_date || errors.tdp_date) ? "form-control is-invalid" : "form-control"} name="tdp_date" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : false } defaultValue={data.tdp_date} />
								{errors_response.tdp_date && <span className="text-danger"> {errors_response.tdp_date[0]} </span>}
							</div>
						</div>
					</div>
				</div>
				{<Kompetensi uuid={uuid} isRequestor={isRequestor} saveItems={props.saveItems} deletePayload={props.deletePayload} />}
				<hr></hr>
				{
					(uuid !== '' && !isRequestor) &&
					<div className="row">
						<div className="col-sm-12">
							<div className="form-group row m-b-15">
								<label className="col-md-12 col-form-label"><b>Note</b></label>
								<div className="col-md-12">
									{/* <input type="text" className={(errors_response.tdp_date || errors.tdp_date) ? "form-control is-invalid" : "form-control"} name="tdp_date" ref={register({required: false})} placeholder="" disabled={((uuid !== '' && !isRequestor)) ? true : false } defaultValue={data.tdp_date} />
									{errors_response.tdp_date && <span className="text-danger"> {errors_response.tdp_date[0]} </span>} */}
									<textarea name="note" className={(errorNote) ? "form-control is-invalid" : "form-control"} type="text" ref={register({required: false})} onChange={(e) => onChangeNote(e)}/>
									{errorNote && <span className="text-danger">Note Wajib Diisi Ketika Reject</span>}
								</div>
							</div>
						</div>
					</div>

				}
				<div className="text-center m-t-10">
					<button className="btn btn-white m-r-10" type="button" onClick={(e) => window.history.back()} disabled={props.loadings.btn}>{t('Button.Batal')}</button>
					{uuid === '' && <button className="btn btn-success m-l-10" type="submit" disabled={props.loadings.btn}> 
						{props.loadings.btn && <i className="fas fa-spinner fa-pulse"></i> }
						{t('Button.Submit')}
					</button>}
					{(uuid !== '' && isRequestor) && <button className="btn btn-success m-l-10" type="submit" disabled={props.loadings.btn}> 
						{props.loadings.btn && <i className="fas fa-spinner fa-pulse"></i> }
						{t('Button.Submit')}
					</button>}
					{(uuid !== '' && !isRequestor) && <button className="btn btn-danger m-l-10" type="button" onClick={(e) => handleApproval(e,"n")} disabled={props.loadings.btn}> 
						{props.loadings.btn && <i className="fas fa-spinner fa-pulse"></i> }
						{t('Button.Tolak')}
					</button>}
					{(uuid !== '' && !isRequestor) && <button className="btn btn-success m-l-10" type="button" onClick={(e) => handleApproval(e,"y")} disabled={props.loadings.btn}> 
						{props.loadings.btn && <i className="fas fa-spinner fa-pulse"></i> }
						{t('Button.Setuju')}
					</button>}
				</div>
			</form>
		)
}

export default Form;