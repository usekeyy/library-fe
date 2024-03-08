import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import FileUploadInformation from '../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormRekeningBank = (props) => {
		const { register, handleSubmit, setValue, control, errors } = useForm({});
		const {t} = props;
		const errors_response = props.rekening_bank.errors;
		const {sendData} = props.rekening_bank;
		const {loadings} = props;
		const {has_draft_verification} = props;
		const [disabledBankBranch, setDisabledBankBranch] = React.useState(true)
		const [disabledBankBranchUpdate, setDisabledBankBranchUpdate] = React.useState(false)
		const [disabledBank, setDisabledBank] = React.useState(true)
		const [disabledCurrency, setDisabledCurrency] = React.useState(true)
		const [loading, setLoading] = React.useState(false)
		const [mounted, isMounted] = React.useState(true)

		React.useEffect(() => {
			if(mounted){
				isMounted(false)
				props.fetchCountries()
			}
		},[props, mounted])

		const customStyles = {
			control: (base, state) => ({
					...base,
					borderColor: state.isFocused ?
					'#ddd' : 'red',
			})
		}

		const onSubmit = async data => {
			setData(data);
			if(sendData.uuid !== ''){
				props.update(sendData.uuid, data)
			} else {
				props.save(data)
			}
			// console.log(data);
		};

		const changeFileRekeningBank = (e) => {
			setLoading(!loading);
			props.upload('PVRB01', e.target.files[0])
			.then((resp) => {
				setLoading(false);
				setValue("file_name", resp.data.data.name)
				// setTdpFileName(resp.data.data.name)
			})
			.catch((err) => {
				setLoading(false);
				// setTdpFileName('')
				setValue("file_name", '')
				toastr.error(err.data.message, err.data?.errors?.file[0])
			})
		}

		const setData = (data) => {
			data.file = data.file_name;
			data.currency_id = typeof data.currency_id !== "undefined" ? data.currency_id.value : "";
			data.bank_branch_id = typeof data.bank_branch_id !== "undefined" ? data.bank_branch_id.value : "";
			data.country_id = typeof data.country_id !== "undefined" ? data.country_id.value : "";
			data.bank_id = typeof data.bank_id !== "undefined" ? data.bank_id.value : "";
			delete data.file_name;
		}
		
		const handleChangeBank = (e) => {
			console.log(e)
			setDisabledBankBranch(false);
			setDisabledBankBranchUpdate(false)
			props.setBankBranch('')
			props.fetchBankBranch({ bank_id: e.value, country_id : e.country_id})
			setValue('bank_branch_id','')
			setValue('bank_address','')
			setValue('bank_district','')
		}

		const handleChangeBankBranch = (e) => {
			props.setBankBranch(e.data)
		}

		const handleChangeCountry = (e) => {
			props.fetchBank({country_id : e.value})
			props.fetchCurrencies(e.currency)
			setDisabledBank(false)
			setDisabledCurrency(false)
			setDisabledBankBranch(true)
			setDisabledBankBranchUpdate(true)
			setValue('bank_id','')
			setValue('bank_branch_id','')
			setValue('bank_address','')
			setValue('bank_district','')
		}
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				{console.log(sendData)}
				<div className="row">
					<div className="col-md-12">
					<div className="form-group row m-b-15">
						<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-country")} <span className="text-danger">*</span></label>
						<div className="col-md-7">
							<Controller
								components={animatedComponents}
								closeMenuOnSelect={true}
								as={Select} 
								placeholder={props.loadings.country ? t("Select.Sedang Memuat") : t("Select.Pilih") }
								isLoading={props.loadings.country}
								className="basic-multi-select"
								classNamePrefix="select"
								name="country_id"
								styles={errors_response.country_id ? customStyles : {}}
								control={control}
								options={props.rekening_bank.countries} 
								defaultValue={sendData.country_id}
								onChange={([selected]) => {
									handleChangeCountry(selected)
									return selected;
								}}
								// isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
								rules={{ required: false }} />
							{/* {props.loadings.country && <input type="text" name="country_name" ref={register({required: false})} className={(errors_response.country_name) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={true} />} */}
							{errors_response.country_id && <span className="text-danger"> {errors_response.country_id[0]} </span>}
						</div>
					</div>
					<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-currency")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
							{!loadings.currency && 
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.currency ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.currency}
									className="basic-multi-select"
									classNamePrefix="select"
									name="currency_id"
									styles={errors_response.currency_id ? customStyles : {}}
									control={control}
									options={props.rekening_bank.currencies} 
									defaultValue={sendData.currency_id}
									isDisabled={(sendData.uuid !== "") ? false : disabledCurrency}
									rules={{ required: false }} />
							}
							{loadings.currency && <i className="fas fa-spinner fa-pulse"></i>}
								{errors_response.currency_id && <span className="text-danger"> {errors_response.currency_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-name")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.bank ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.bank}
									className="basic-multi-select"
									classNamePrefix="select"
									name="bank_id"
									onChange={([selected]) => {
										handleChangeBank(selected)
										return selected;
									}}
									styles={errors_response.bank_id ? customStyles : {}}
									control={control}
									options={props.rekening_bank.banks} 
									defaultValue={sendData.bank_id}
									isDisabled={(sendData.uuid !== "") ? false : disabledBank}
									rules={{ required: false }} />
								{errors_response.bank_id && <span className="text-danger"> {errors_response.bank_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-cabang")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								{props.loadings.bank_branch === false && <Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.bank_branch ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.bank_branch}
									className="basic-multi-select"
									classNamePrefix="select"
									name="bank_branch_id"
									styles={errors_response.bank_branch_id ? customStyles : {}}
									control={control}
									options={props.rekening_bank.bank_branches} 
									onChange={([selected]) => {
										handleChangeBankBranch(selected)
										return selected;
									}}
									defaultValue={sendData.bank_branch_id}
									isDisabled={(sendData.uuid !== "") ? disabledBankBranchUpdate : disabledBankBranch}
									rules={{ required: false }} />}
								{props.loadings.bank_branch && <input type="text" name="bank_branch_name" ref={register({required: false})} className={(errors_response.bank_branch_name) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={true} />}
								{errors_response.bank_branch_id && <span className="text-danger"> {errors_response.bank_branch_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-address")}</label>
							<div className="col-md-7">
								{!loadings.branch && <input type="text" name="bank_address" ref={register({required: false})} className={(errors_response.bank_address) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={true} defaultValue={sendData.bank_address}  />}
								{loadings.branch && <i className="fas fa-spinner fa-pulse"></i>}
								{errors_response.bank_address && <span className="text-danger"> {errors_response.bank_address[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-kota")}</label>
							<div className="col-md-7">
								{!loadings.branch && <input type="text" name="bank_district" ref={register({required: false})} className={(errors_response.bank_district) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.bank_district} disabled={true} />}
								{loadings.branch && <i className="fas fa-spinner fa-pulse"></i>}
								{errors_response.bank_district && <span className="text-danger"> {errors_response.bank_district[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-rekening")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="number" name="nomor_rekening" ref={register({required: false})} className={(errors_response.nomor_rekening) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.nomor_rekening} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
								{errors_response.nomor_rekening && <span className="text-danger"> {errors_response.nomor_rekening[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:rekening-bank-pemegang-rekening")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="pemegang_rekening" ref={register({required: false})} className={(errors_response.pemegang_rekening) ? "form-control is-invalid" : "form-control"} defaultValue={sendData.pemegang_rekening} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}/>
								{errors_response.pemegang_rekening && <span className="text-danger"> {errors_response.pemegang_rekening[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:rekening-bank-file')}<span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.file || errors.file_name) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: true})} placeholder="" defaultValue={sendData.file} disabled={true} />
								{(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
								{(errors.file_name) && <span className="text-danger"> Field Is Required</span>}
								{(errors_response.file) && <span className="text-danger"> {errors_response.file[0]} </span>}
								<FileUploadInformation idFileUpload="PVRB01"/>
							</div>
							<div className="col-md-3">
								{props.isVendor && !has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFileRekeningBank} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success pull-right m-b-10 m-l-10" type="submit" disabled={props.rekening_bank.loadingButton}> 
							{props.rekening_bank.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
						{sendData.uuid !== '' && <button className="btn btn-danger m-b-10 m-l-10 pull-right" type="button" onClick={() => props.fetchRekeningBank()} disabled={props.rekening_bank.loadingButton}> 
							{props.rekening_bank.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Batal')}
						</button>}
					</div>
				</div>
			</form>
		)
}

export default withTranslation()(FormRekeningBank);