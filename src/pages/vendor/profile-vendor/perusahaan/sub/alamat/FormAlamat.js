import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {statusName, statusVerifikasi} from '../../../../../../helpers/statusName';

const animatedComponents = makeAnimated();

const FormAlamat = (props) => {
    const  {t} = props;
	const {has_draft_verification} = props;
    const errors_response = props.vendor_address.errors;
    const {sendData} = props.vendor_address;
    const {tempData} = props.vendor_address;
    const {vendor_type_id} = props.parentState.vendor_address.sendData;
    
    const { register, control, errors, handleSubmit, setValue, getValues } = useForm({});
    const customStyles = {
      control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ?
          '#ddd' : 'red',
      })
    }
    const [disabledRegion, setDisabledRegion] = React.useState(false)
    const [disabledDistrict, setDisabledDistrict] = React.useState(false)
    const [disabledSubDistrict, setDisabledSubDistrict] = React.useState(false)
    const [disabledVillage, setDisabledVillage] = React.useState(false)
    const [disabledPostcalCode, setDisabledPostcalCode] = React.useState(false)
    // const m_country = props.vendor_address.countries;
    const onSubmit = async data => {
        // props.save(data)
        setOptions(data);
        props.save(data);
    };

    const handleChangeCountry = (e) => {
        let value = {
            country_id: e.value,
        };
        setDisabledRegion(false);
        setDisabledDistrict(true);
        setDisabledSubDistrict(true);
        setDisabledVillage(true);
        setDisabledPostcalCode(true);
        setValue("address_region_id", '')
        setValue("address_district_id", '')
        setValue("address_kecamatan_id", '')
        setValue("address_postal_code", '')
        setValue("address_village_id", '')
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
        setValue("address_kecamatan_id", '')
        setValue("address_village_id", '')
        setValue("address_postal_code", '')
        props.fetchDistrict(value)
    }

    const handleChangeDistrict = (e) => {
        let value = {
            district_id: e.value,
        };
        setDisabledSubDistrict(false);
        setDisabledVillage(true);
        setDisabledPostcalCode(true);
        setValue("address_kecamatan_id", '')
        setValue("address_village_id", '')
        setValue("address_postal_code", '')
        props.fetchSubDistrict(value)
    }

    const handleChangeVillage = (e) => {
        let value = {
            sub_district_id: e.value,
        };
        setDisabledPostcalCode(false);
        setDisabledVillage(false);
        setValue("address_postal_code", '')
        props.fetchVillages(value)
        props.fetchPostcalCode(value)
    }

    const setOptions = (data) => {
		data.address_country_id = data.address_country_id.value !== undefined ? data.address_country_id.value : "";
        data.address_region_id = data.address_region_id.value !== undefined ? data.address_region_id.value : "";
        data.address_district_id = vendor_type_id !== 3 && data.address_district_id.value !== undefined ? data.address_district_id.value : "";
        data.address_village_id = vendor_type_id !== 3 && data.address_village_id.value !== undefined ? data.address_village_id.value : "";
        data.address_kecamatan_id = vendor_type_id !== 3 && data.address_kecamatan_id.value !== undefined ? data.address_kecamatan_id.value : "";
        data.address_postal_code = vendor_type_id !== 3 ? data.address_postal_code.value !== undefined ? data.address_postal_code.value : "" : getValues('address_postal_code');
        data.type = 'nama_perusahaan';
        data.vendor_type_id = sendData.vendor_type_id;
        if(vendor_type_id === 3){
            delete data.address_village_id;
        }
        delete data.status;
	}
    console.log(vendor_type_id);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12">
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:address")} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.address_address) ? "form-control is-invalid" : "form-control"} name="address_address" ref={register({ required: false })} placeholder="" defaultValue={sendData.address_address} disabled={has_draft_verification} />
                        {errors_response.address_address && <span className="text-danger"> {errors_response.address_address[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Negara')} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
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
                                defaultValue={sendData.address_country_id}
                                onChange={([selected]) => {
                                    handleChangeCountry(selected)
                                    return selected;
                                }}
                                isOptionDisabled={(m_country) => m_country.disabled === true}
                                options={props.vendor_address.countries} 
                                rules={{ required: false }}
                                isDisabled={has_draft_verification} />
                            {errors_response.address_country_id && <span className="text-danger"> {errors_response.address_country_id[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Provinsi')} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                control={control}
                                placeholder={props.loadings.region ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={props.loadings.region}
                                className={vendor_type_id === 3 ? "basic-multi-select is-hidden" : "basic-multi-select"}
                                classNamePrefix="select"
                                name="address_region_id"
                                styles={errors_response.address_region_id ? customStyles : {}}
                                defaultValue={sendData.address_region_id}
                                onChange={([selected]) => {
                                    handleChangeRegion(selected)
                                    return selected;
                                }}
                                isDisabled={has_draft_verification}
                                options={!disabledRegion ? props.vendor_address.regions : []} 
                                rules={{ required: false }} />
                            {vendor_type_id === 3 && <input type="text" className={(errors.address_region_name) ? "form-control is-invalid" : "form-control"} name="address_region_name" ref={register({ required: false })} placeholder="" defaultValue={tempData.region_name} disabled={has_draft_verification} />}
                            {errors_response.address_region_id && <span className="text-danger"> {errors_response.address_region_id[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kota/Kabupaten')} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                control={control}
                                placeholder={props.loadings.district ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={props.loadings.district}
                                className={vendor_type_id === 3 ? "basic-multi-select is-hidden" : "basic-multi-select"}
                                classNamePrefix="select"
                                name="address_district_id"
                                styles={errors_response.address_district_id ? customStyles : {}}
                                defaultValue={sendData.address_district_id}
                                options={!disabledDistrict ? props.vendor_address.districts : []} 
                                onChange={([selected]) => {
                                    handleChangeDistrict(selected)
                                    return selected;
                                }}
                                isDisabled={has_draft_verification}
                                rules={{ required: false }} />
                            {vendor_type_id === 3 && <input type="text" className={(errors.address_district_name) ? "form-control is-invalid" : "form-control"} name="address_district_name" ref={register({ required: false })} placeholder="" defaultValue={tempData.district_name} disabled={has_draft_verification} />}
                            {errors_response.address_district_id && <span className="text-danger"> {errors_response.address_district_id[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kecamatan')} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                control={control}
                                placeholder={props.loadings.subDistrict ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={props.loadings.subDistrict}
                                className={vendor_type_id === 3 ? "basic-multi-select is-hidden" : "basic-multi-select"}
                                classNamePrefix="select"
                                name="address_kecamatan_id"
                                onChange={([selected]) => {
                                    handleChangeVillage(selected)
                                    return selected;
                                }}
                                styles={errors_response.address_subdistrict_id ? customStyles : {}}
                                defaultValue={sendData.address_subdistrict_id}
                                options={!disabledSubDistrict ? props.vendor_address.subDistricts : []} 
                                isDisabled={has_draft_verification}
                                rules={{ required: false }} />
                            {vendor_type_id === 3 && <input type="text" className={(errors.address_kecamatan_name) ? "form-control is-invalid" : "form-control"} name="address_kecamatan_name" ref={register({ required: false })} placeholder="" defaultValue={tempData.kecamatan_name} disabled={has_draft_verification} />}
                            {errors_response.address_kecamatan_id && <span className="text-danger"> {errors_response.address_kecamatan_id[0]} </span>}
                        </div>
                    </div>
                    {vendor_type_id !== 3 && <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kelurahan')} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                control={control}
                                placeholder={props.loadings.village ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={props.loadings.village}
                                className={vendor_type_id === 3 ? "basic-multi-select is-hidden" : "basic-multi-select"}
                                classNamePrefix="select"
                                name="address_village_id"
                                styles={errors_response.address_village_id ? customStyles : {}}
                                defaultValue={sendData.address_village_id}
                                options={!disabledVillage ? props.vendor_address.villages : []} 
                                isDisabled={has_draft_verification}
                                rules={{ required: false }} />
                            {errors_response.address_village_id && <span className="text-danger"> {errors_response.address_village_id[0]} </span>}
                        </div>
                    </div>}
                    {vendor_type_id !== 3 && <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label"></label>
                        <div className="col-md-7">
                            <div className="row">
                                <div className="form-group row col-md-6">
                                    <label  className="col-sm-4 col-form-label">RT</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" ref={register({ required: false })} name="address_rt" placeholder="RT" defaultValue={sendData.rt} disabled={has_draft_verification} />
                                    </div>
                                </div>
                                <div className="form-group row col-md-6">
                                    <label className="col-sm-4 col-form-label">RW</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" ref={register({ required: false })} name="address_rw" placeholder="RW" defaultValue={sendData.rw} disabled={has_draft_verification} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t('Beranda.Registrasi.Label.Kode Pos')} {vendor_type_id !== 3 && <span className="text-danger">*</span>}</label>
                        <div className="col-md-7">
                            {vendor_type_id !== 3 && <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select} 
                                control={control}
                                placeholder={props.loadings.postcalCode ? t("Select.Sedang Memuat") : t("Select.Pilih") }
                                isLoading={props.loadings.postcalCode}
                                className={vendor_type_id === 3 ? "basic-multi-select is-hidden" : "basic-multi-select"}
                                classNamePrefix="select"
                                name="address_postal_code"
                                styles={errors_response.address_postal_code ? customStyles : {}}
                                defaultValue={sendData.address_postal_code}
                                options={!disabledPostcalCode ? props.vendor_address.postcalCodes : []} 
                                isDisabled={has_draft_verification}
                                rules={{ required: false }} />}
                            {vendor_type_id === 3 && <input type="text" className={(errors.address_postal_code) ? "form-control is-invalid" : "form-control"} name="address_postal_code" ref={register({ required: false })} placeholder="" defaultValue={tempData.postal_code} disabled={has_draft_verification} />}
                            {errors_response.address_postal_code && <span className="text-danger"> {errors_response.address_postal_code[0]} </span>}
                            {errors_response.postal_code && <span className="text-danger"> {errors_response.postal_code[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:phone-number")} <span className="text-danger">*</span></label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.address_nomor_telepon) ? "form-control is-invalid" : "form-control"} name="address_nomor_telepon" ref={register({ required: false })} placeholder="" defaultValue={sendData.address_nomor_telepon} disabled={has_draft_verification} />
                            {errors_response.address_nomor_telepon && <span className="text-danger"> {errors_response.address_nomor_telepon[0]} </span>}
                        </div>
                    </div>
                    <div className="form-group row m-b-15">
                        <label className="col-md-3 col-form-label">{t("profileVendor:hp-number")}</label>
                        <div className="col-md-7">
                            <input type="text" className={(errors.nomor_hp) ? "form-control is-invalid" : "form-control"} name="address_nomor_hp" ref={register({ required: false })} placeholder="" defaultValue={sendData.nomor_hp} disabled={has_draft_verification} />
                            {errors_response.nomor_hp && <span className="text-danger"> {errors_response.nomor_hp[0]} </span>}
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
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success m-l-10" type="submit" disabled={props.vendor_address.loadingButton}> 
							{props.vendor_address.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
					</div>
                </div>
            </div>
        </form>
    )
}

export default withTranslation() (FormAlamat);