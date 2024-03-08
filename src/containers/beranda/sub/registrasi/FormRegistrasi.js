import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {toastr} from 'react-redux-toastr';
import InputMask from 'react-input-mask';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();
const FormRegistrasi = (props) => {
		const { register, control, handleSubmit, errors, setValue, getValues } = useForm({});
		// const countryValue = watch("address_country_id", props.data.address_country_id);
		// const regionValue = watch("address_region_id", props.data.address_region_id);
		// const [country, setCountry] = React.useState([]);
		const [file, setFile] = React.useState(false);
		const [fileTdp, setFileTdp] = React.useState(false);
		const [redirectFile, setRedirectFile] = React.useState('');
		const [redirectFileTdp, setRedirectFileTdp] = React.useState('');
		const [loading, setLoading] = React.useState(false)
		const [disabledCountry, setDisabledCountry] = React.useState(true)
		const [disabledRegion, setDisabledRegion] = React.useState(true)
		const [disabledDistrict, setDisabledDistrict] = React.useState(true)
		const [disabledSubDistrict, setDisabledSubDistrict] = React.useState(true)
		const [disabledVillage, setDisabledVillage] = React.useState(true)
		const [disabledPostcalCode, setDisabledPostcalCode] = React.useState(true)
		const [isDalamNegeri, setIsDalamNegeri] = React.useState(true)
		// const [npwpFileName, setNpwpFileName] = React.useState('');
		// const [tdpFileName, setTdpFileName] = React.useState('');
		
		const {t} = props.props;
		const {errors_response} = props;
		const customStyles = {
      control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ?
          '#ddd' : 'red',
      })
		}

		// React.useEffect(() => {
		// 	register({ name: "address_country_id" });
		// }, [register]);
		
		// React.useEffect(() => {
		// 	register({ name: "address_region_id" });
		// }, [register]);
		
		const onSubmit = async data => {
			setOptions(data);
			console.log(data)
			props.showPaktaIntegritas(data);
		};
		
		const handleChangeCountry = (e) => {
			let value = {
				country_id: e.value,
			};
			setDisabledRegion(false);
			isDalamNegeri ? setDisabledDistrict(true) : setDisabledDistrict(false);
			isDalamNegeri ? setDisabledSubDistrict(true) : setDisabledSubDistrict(false);
			isDalamNegeri ? setDisabledVillage(true) : setDisabledVillage(false);
			isDalamNegeri ? setDisabledPostcalCode(true) : setDisabledPostcalCode(false);
			setValue("address_region_id", '')
			setValue("address_district_id", '')
			setValue("address_subdistrict_id", '')
			setValue("address_village_id", '')
			setValue("address_postal_code", '')
			setValue("address_kecamatan_id", '')
			props.fetchRegion(value)
		}

		const handleChangeRegion = (e) => {
			let value = {
				region_id: e.value,
			};
			setDisabledDistrict(false);
			setDisabledSubDistrict(true);
			setDisabledVillage(true);
			setDisabledPostcalCode(true);
			setValue("address_district_id", '')
			setValue("address_subdistrict_id", '')
			setValue("address_village_id", '')
			setValue("address_postal_code", '')
			setValue("address_kecamatan_id", '')
			props.fetchDistrict(value)
		}

		const handleChangeDistrict = (e) => {
			let value = {
				district_id: e.value,
			};
			setDisabledSubDistrict(false);
			setDisabledVillage(true);
			setDisabledPostcalCode(true);
			setValue("address_subdistrict_id", '')
			setValue("address_village_id", '')
			setValue("address_postal_code", '')
			setValue("address_kecamatan_id", '')
			props.fetchSubDistrict(value)
		}

		const handleChangeSubDistrict = (e) => {
			let value = {
				sub_district_id: e.value,
			};
			setDisabledVillage(false);
			setDisabledPostcalCode(false);
			setValue("address_postal_code", '')
			setValue("address_village_id", '')
			props.fetchPostcalCode(value)
			props.fetchVillage(value)
		}

		const handleChangeTypeVendor = (e) => {
			setValue("address_country_id", '')
			setValue("address_region_id", '')
			setValue("address_district_id", '')
			setValue("address_kecamatan_id", '')
			setValue("address_postal_code", '')
			setValue("address_subdistrict_id", '')
			setValue("address_village_id", '')
			setDisabledCountry(false);
			setDisabledRegion(true);
			setDisabledDistrict(true);
			setDisabledSubDistrict(true);
			setDisabledVillage(true);
			setDisabledPostcalCode(true);
			props.setCountry(e.value)
			if(e.value === 3){
				setIsDalamNegeri(false);
			} else {
				setIsDalamNegeri(true)
			}
		}

		const changeNpwpFile = (e) => {
			setLoading(!loading);
			props.props.guestUpload('VRP002', e.target.files[0])
			.then((resp) => {
				setValue("npwp_file_name", resp.data.data.name)
				setLoading(false);
				setFile(true)
				setRedirectFile(`${process.env.REACT_APP_API_BASE_URL}${resp.data.data.path}`)
			})
			.catch((err) => {
				setLoading(false);
				setFile(false)
				setRedirectFile('')
				setValue("npwp_file_name", '')
				toastr.error(err.data.message, err.data.status)
			})
		}

		const changeTdpFile = (e) => {
			setLoading(!loading);
			props.props.guestUpload('VRP003', e.target.files[0])
			.then((resp) => {
				setLoading(false);
				setValue("tdp_file_name", resp.data.data.name)
				setFileTdp(true)
				setRedirectFileTdp(`${process.env.REACT_APP_API_BASE_URL}${resp.data.data.path}`)
			})
			.catch((err) => {
				setLoading(false);
				setFileTdp(false)
				setRedirectFileTdp('')
				setValue("tdp_file_name", '')
				toastr.error(err.data.message, err.data.status)
			})
		}

		const setOptions = (data) => {
			data.company_type_id = data.company_type_id.value !== undefined ? data.company_type_id.value : "";
			data.vendor_type_id = data.vendor_type_id.value !== undefined ? data.vendor_type_id.value : "";
			data.purchasing_org_id = data.purchasing_org_id.value !== undefined ? data.purchasing_org_id.value : "";
			data.address_country_id = data.address_country_id.value !== undefined ? data.address_country_id.value : "";
			data.address_region_id = isDalamNegeri && data.address_region_id.value !== undefined ? data.address_region_id.value : "";
			data.address_district_id = isDalamNegeri && data.address_district_id.value !== undefined ? data.address_district_id.value : "";
			data.address_kecamatan_id = isDalamNegeri && data.address_kecamatan_id.value !== undefined ? data.address_kecamatan_id.value : "";
			data.address_village_id = isDalamNegeri && data.address_village_id.value !== undefined ? data.address_village_id.value : "";
			data.address_postal_code = isDalamNegeri ? data.address_postal_code.value !== undefined ? data.address_postal_code.value : "" : getValues('address_postal_code');
			data.npwp_file = data.npwp_file_name;
			data.tdp_file = data.tdp_file_name;
			if(data.website !== ''){ 
				data.website = data.website.includes('http') ? data.website : `http://${data.website}`;
			}
			if(!isDalamNegeri){
				delete data.address_region_id;
				delete data.address_district_id;
				delete data.address_kecamatan_id;
				delete data.address_village_id;
			}
			data.pic_main = "y";
		}
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-6">
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
									defaultValue={props.data.company_type}
									rules={{ required: false }}  />
								{errors_response.company_type_id && <span className="text-danger"> {errors_response.company_type_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Nama Rekanan')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.name || errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({required: false})} placeholder="" />
								{errors_response.name && <span className="text-danger"> {errors_response.name[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Direktur Utama')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.direktur_utama || errors.direktur_utama) ? "form-control is-invalid" : "form-control"} name="direktur_utama" ref={register({required: false})} placeholder="" />
								{errors_response.direktur_utama && <span className="text-danger"> {errors_response.direktur_utama[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Alamat')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<textarea type="text" className={(errors_response.address_address || errors.address_address) ? "form-control is-invalid" : "form-control"} placeholder="" name="address_address" ref={register({required: false})} />
								{errors_response.address_address && <span className="text-danger"> {errors_response.address_address[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Negara')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{!props.loadings.country && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.country ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.country}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_country_id"
									styles={errors_response.address_country_id ? customStyles : {}}
									defaultValue={props.data.address_country_id}
									isDisabled={disabledCountry}
									isOptionDisabled={(options) => options.disabled === true}
									// onChange={handleChangeCountry}
									onChange={([selected]) => {
										handleChangeCountry(selected)
										return selected;
									}}
									// onInputChange={props.handleInputChange}
									// inputRef={(e) => register({ name: "address_country_id" })}
									options={props.m_country} 
									rules={{ required: false }} />}
									{props.loadings.country && <i className="fas fa-spinner fa-pulse"></i> }
								{errors_response.address_country_id && <span className="text-danger"> {errors_response.address_country_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Provinsi')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{isDalamNegeri && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.region ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.region}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_region_id"
									styles={errors_response.address_region_id ? customStyles : {}}
									defaultValue={props.data.address_region_id}
									onChange={([selected]) => {
										handleChangeRegion(selected)
										return selected;
									}}
									isDisabled={disabledRegion}
									options={props.m_region} 
									rules={{ required: false }} />}
									{!isDalamNegeri && <input type="text" className={(errors_response.address_region_name || errors.address_region_name) ? "form-control is-invalid" : "form-control"} name="address_region_name" ref={register({required: false})} placeholder="" disabled={disabledRegion} />}
								{errors_response.address_region_id && <span className="text-danger"> {errors_response.address_region_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kota/Kabupaten')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{isDalamNegeri && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.district}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_district_id"
									styles={errors_response.address_district_id ? customStyles : {}}
									defaultValue={props.data.address_district_id}
									options={props.m_district} 
									onChange={([selected]) => {
										handleChangeDistrict(selected)
										return selected;
									}}
									isDisabled={!isDalamNegeri || disabledDistrict}
									rules={{ required: false }} />}
									{!isDalamNegeri && <input type="text" className={(errors_response.address_district_name || errors.address_district_name) ? "form-control is-invalid" : "form-control"} name="address_district_name" ref={register({required: false})} placeholder="" disabled={disabledDistrict} />}
								{errors_response.address_district_id && <span className="text-danger"> {errors_response.address_district_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kecamatan')} {<span className="text-danger">*</span>}</label>
							<div className="col-md-7">
							{isDalamNegeri && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.sub_district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.sub_district}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_kecamatan_id"
									styles={errors_response.address_kecamatan_id ? customStyles : {}}
									defaultValue={props.data.address_kecamatan_id}
									options={props.m_sub_district} 
									onChange={([selected]) => {
										handleChangeSubDistrict(selected)
										return selected;
									}}
									isDisabled={!isDalamNegeri || disabledSubDistrict}
									rules={{ required: false }} />}
								{!isDalamNegeri && <input type="text" className={(errors_response.address_kecamatan_name || errors.address_kecamatan_name) ? "form-control is-invalid" : "form-control"} name="address_kecamatan_name" ref={register({required: false})} placeholder="" disabled={disabledDistrict} />}
								{errors_response.address_kecamatan_id && <span className="text-danger"> {errors_response.address_kecamatan_id[0]} </span>}
							</div>
						</div>
						{isDalamNegeri && <div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kelurahan')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.village ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.village}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_village_id"
									styles={errors_response.address_village_id ? customStyles : {}}
									defaultValue={props.data.address_village_id}
									options={props.m_village} 
									isDisabled={!isDalamNegeri || disabledVillage}
									rules={{ required: false }} />
								{errors_response.address_village_id && <span className="text-danger"> {errors_response.address_village_id[0]} </span>}
							</div>
						</div>}
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kode Pos')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
								{isDalamNegeri && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									control={control}
									placeholder={props.loadings.postcal_code ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.postcal_code}
									className="basic-multi-select"
									classNamePrefix="select"
									name="address_postal_code"
									styles={errors_response.address_postal_code ? customStyles : {}}
									defaultValue={props.data.address_postal_code}
									options={props.m_postcal_code} 
									isDisabled={disabledPostcalCode}
									rules={{ required: false }} />}
									{!isDalamNegeri && <input type="text" className={(errors_response.address_postal_code || errors.address_postal_code) ? "form-control is-invalid" : "form-control"} name="address_postal_code" ref={register({required: false})} placeholder="" disabled={disabledDistrict} />}
								{errors_response.address_postal_code && <span className="text-danger"> {errors_response.address_postal_code[0]} </span>}
								{errors_response.postal_code && <span className="text-danger"> {errors_response.postal_code[0]} </span>}
							</div>
						</div>
					</div>
					<div className="col-md-6">
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
									defaultValue={props.data.vendor_type_id}
									rules={{ required: false }}  />
								{errors_response.vendor_type_id && <span className="text-danger"> {errors_response.vendor_type_id[0]} </span>}
							</div>
						</div>
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
									defaultValue={props.data.purchasing_org_id}
									rules={{ required: false }}  />
								{errors_response.purchasing_org_id && <span className="text-danger"> {errors_response.purchasing_org_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No Telepon')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.address_nomor_telepon || errors.address_nomor_telepon) ? "form-control is-invalid" : "form-control"}
									mask="999999999999"
									name="address_nomor_telepon"
									defaultValue={""}
								/>
								{errors_response.address_nomor_telepon && <span className="text-danger"> {errors_response.address_nomor_telepon[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Email Perusahaan')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.email || errors.email) ? "form-control is-invalid" : "form-control"} name="email" ref={register({required: false})} placeholder="" />
								{errors_response.email && <span className="text-danger"> {errors_response.email[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Nama PIC')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.pic_name || errors.pic_name) ? "form-control is-invalid" : "form-control"} name="pic_name" ref={register({required: false})} placeholder="" />
								{errors_response.pic_name && <span className="text-danger"> {errors_response.pic_name[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No HP PIC')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.pic_phone_no || errors.pic_phone_no) ? "form-control is-invalid" : "form-control"}
									mask="999999999999"
									name="pic_phone_no"
									defaultValue={""}
								/>
								{errors_response.pic_phone_no && <span className="text-danger"> {errors_response.pic_phone_no[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Email PIC')} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.pic_email || errors.pic_email) ? "form-control is-invalid" : "form-control"} name="pic_email" ref={register({required: false})} placeholder="" />
								{errors_response.pic_email && <span className="text-danger"> {errors_response.pic_email[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Website Perusahaan')}</label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.website || errors.website) ? "form-control is-invalid" : "form-control"} name="website" ref={register({required: false})} placeholder="http://www.example.com/" />
								{errors_response.website && <span className="text-danger"> {errors_response.website[0]} </span>}
							</div>
						</div>
					</div>
				</div>
				<div className="row m-t-20">
					<div className="col-md-6">
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No NPWP')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-7">
								<Controller
									as={InputMask}
									control={control}
									className={(errors_response.npwp_number || errors.npwp_number) ? "form-control is-invalid" : "form-control"}
									mask="99.999.999.9-999.999"
									name="npwp_number"
									defaultValue={""}
								/>
								{errors_response.npwp_number && <span className="text-danger"> {errors_response.npwp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.File NPWP')} {isDalamNegeri && <span className="text-danger">*</span>}</label>
							<div className="col-md-5">
								<div className="input-group">
								<div className="input-group-prepend">
									{file && <span className="input-group-text costum-input-upload" onClick={() => window.open(redirectFile)}> <i className="fas fa-eye"></i> </span>}
								</div>
									<input type="text" className={(errors_response.npwp_file_name || errors.npwp_file_name) ? "form-control is-invalid" : "form-control"} name="npwp_file_name" ref={register({required: false})} disabled={true} />
								</div>
								{errors_response.npwp_file && <span className="text-danger"> {errors_response.npwp_file[0]} </span>}
								<FileUploadInformation idFileUpload="VRP002" />
							</div>
							<div className="col-md-3">
								<label className="custom-file-upload">
									<input type="file" name="npwp_file" ref={register({required: false})} placeholder="" onChange={changeNpwpFile} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>
							</div>
						</div>
					</div>
					{isDalamNegeri && <div className="col-md-6">
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.No TDP')}</label>
							<div className="col-md-7">
								<input type="text" className={(errors_response.tdp_number || errors.tdp_number) ? "form-control is-invalid" : "form-control"} name="tdp_number" ref={register({required: false})} placeholder="" />
								{errors_response.tdp_number && <span className="text-danger"> {errors_response.tdp_number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.File TDP')}</label>
							<div className="col-md-5">
								<div className="input-group">
								<div className="input-group-prepend">
									{fileTdp && <span className="input-group-text costum-input-upload" onClick={() => window.open(redirectFileTdp)}> <i className="fas fa-eye"></i> </span>}
								</div>
									<input type="text" className={(errors_response.tdp_file || errors.tdp_file) ? "form-control is-invalid" : "form-control"} name="tdp_file_name" ref={register({required: false})} disabled={true} />
								</div>
								{errors_response.tdp_file && <span className="text-danger"> {errors_response.tdp_file[0]} </span>}
								<FileUploadInformation idFileUpload="VRP003" />
							</div>
							<div className="col-md-3">
								<label className="custom-file-upload">
									<input type="file" name="tdp_file" ref={register({required: false})} placeholder="" onChange={changeTdpFile} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>
							</div>
						</div>
					</div>}
				</div>
				<div className="text-center m-t-10">
					<button className="btn btn-white m-r-10" type="button" onClick={(e) => props.isCancel(e, 'beranda')} disabled={loading}>{t('Button.Batal')}</button>
					<button className="btn btn-success m-l-10" type="submit" disabled={loading}> 
						{loading && <i className="fas fa-spinner fa-pulse"></i> }
						{t('Button.Submit')}
					</button>
				</div>
			</form>
		)
}

export default FormRegistrasi;