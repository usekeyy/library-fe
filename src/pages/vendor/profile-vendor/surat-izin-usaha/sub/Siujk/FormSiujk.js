import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import FileUploadInformation from '../../../../../../components/upload/FileUploadInformation'

const animatedComponents = makeAnimated();

const FormSiujk = (props) => {
		const { register, handleSubmit, setValue, control, watch, getValues } = useForm({});
		const {t} = props;
		const errors_response = props.siujk.errors;
		const {sendData} = props.siujk;
		const {has_draft_verification} = props;
		const [loading, setLoading] = React.useState(false)
		const [classification, setClassification] = React.useState(props.siujk.selected_classification)
		const [subClassification, setSubClassification] = React.useState(props.siujk.selected_sub_classification)
		const watchMain = watch("main", sendData.main === 'y' ? true : false);

		const customStyles = {
			control: (base, state) => ({
					...base,
					borderColor: state.isFocused ?
					'#ddd' : 'red',
			})
		}

		const onSubmit = async data => {
			setData(data);
			sendData.uuid !== "" ? props.update(sendData.uuid, data) : props.save(data)
			// console.log(data);
		};
		
		const [fileErrors,setFileErrors] = React.useState([])
		const [isFileErrors,setIsFileErrors] = React.useState(false)

		const changeFileSiujk = (e) => {
			setLoading(!loading);
			setIsFileErrors(false)
			setFileErrors([])
			props.upload('PVSIU4', e.target.files[0])
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
				setIsFileErrors(true)
				setFileErrors(err.data?.errors)
			})
		}

		const setData = (data) => {
			data.file = data.file_name;
			// data.vendor_classification_id = typeof data.vendor_classification_id.value !== "undefined" ? data.vendor_classification_id.value : "";
			data.vendor_qualification_id = typeof data.vendor_qualification_id.value !== "undefined" ? data.vendor_qualification_id.value : "";
			data.main = (watchMain) ? 1 : 0;
			data.vendor_classification_id = classification;
			data.vendor_sub_classification_id = subClassification;
			delete data.file_name;
		}
		
		const handleChangeClassification = (val) => {
			// console.log(val);
			if(val !== null){
				if(val.length > 0){
					const params = [];
					const setSubParams = [];
					const setSubParamId = [];
					const vendor_sub_classification_id = getValues("vendor_sub_classification_id");
					val.map(item => {
						if(vendor_sub_classification_id !== '' && vendor_sub_classification_id !== null && vendor_sub_classification_id !== undefined) {
							if(vendor_sub_classification_id.length > 0){
								vendor_sub_classification_id.map(sub => {
									if(sub.vendor_classification_id === item.value){
										setSubParams.push(sub);
										setSubParamId.push(sub.value);
									}
									return true
								})
							}
						}
						params.push(item.value)
						return true;
					})
					setValue("vendor_sub_classification_id", setSubParams);
					setSubClassification(setSubParamId);
					setClassification(params);
					props.fetchVendorSubClassification(params, {vendor_classification_id: params.join(";")})
				} else {
					setValue("vendor_sub_classification_id", '')
					setSubClassification([]);
					props.fetchVendorSubClassification([], {})
				}
			} else {
				setValue("vendor_sub_classification_id", '')
				setSubClassification([]);
				props.fetchVendorSubClassification([], {})
			}
		}

		const handleChangeSubClassification = (val) => {
			// console.log(val);
			const params = [];
			if(val !== null && val.length > 0){
				val.map(item => {
					params.push(item.value)
					return true;
				})
			}
			setSubClassification(params);
		}

		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
					<div className="col-md-12">
						<p className="text-red">Note :  Wajib diisi untuk jasa konstruksi</p>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-number")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="number" ref={register({required: false})} className={(errors_response.number) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.number} disabled={has_draft_verification} />
								{errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t('profileVendor:siujk-file')} <span className="text-danger">*</span></label>
							<div className="col-md-5">
								<input type="text" className={(errors_response.file) ? "form-control is-invalid" : "form-control"} name="file_name" ref={register({required: false})} placeholder="" defaultValue={sendData.file} disabled={true} />
								{(sendData.uuid !== "" && sendData.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${sendData.file}` } > {t("common:Button.Download")} </a> : '' }
								{errors_response.file && <span className="text-danger"> {errors_response.file[0]} </span>}
								<FileUploadInformation idFileUpload="PVSIU4"/>
								{ isFileErrors &&
									Object.keys(fileErrors).map((item, i) => (
										<p><span className="text-danger" key={i}><b>*</b> {fileErrors[item][0]}</span></p>
									))
								}  
							</div>
							<div className="col-md-3">
								{!has_draft_verification && <label className="custom-file-upload">
									<input type="file" name="file" ref={register({required: false})} onChange={changeFileSiujk} disabled={loading} />
									<i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
								</label>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-valid-from")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="date" name="start_date" ref={register({required: false})} className={(errors_response.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.start_date} disabled={has_draft_verification} />
								{errors_response.start_date && <span className="text-danger"> {errors_response.start_date[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-valid-to")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="date" name="end_date" ref={register({required: false})} className={(errors_response.end_date) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.end_date} disabled={has_draft_verification} />
								{errors_response.end_date && <span className="text-danger"> {errors_response.end_date[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-published-by")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<input type="text" name="issued_by" ref={register({required: false})} className={(errors_response.issued_by) ? "form-control is-invalid" : "form-control"} placeholder="" defaultValue={sendData.issued_by} disabled={has_draft_verification} />
								{errors_response.issued_by && <span className="text-danger"> {errors_response.issued_by[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-clasification")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.classification ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.classification}
									className="basic-multi-select"
									classNamePrefix="select"
									name="vendor_classification_id"
									styles={errors_response.vendor_classification_id ? customStyles : {}}
									control={control}
									options={props.siujk.classifications} 
									defaultValue={sendData.vendor_classification_id}
									isDisabled={has_draft_verification}
									menuPlacement="top"
									isMulti={true}
									onChange={([selected]) => {
										handleChangeClassification(selected)
										return selected;
									}}
									rules={{ required: false }} />
								{errors_response.vendor_classification_id && <span className="text-danger"> {errors_response.vendor_classification_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-sub-clasification")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.sub_classification ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.sub_classification}
									className="basic-multi-select"
									classNamePrefix="select"
									name="vendor_sub_classification_id"
									styles={errors_response.vendor_sub_classification_id ? customStyles : {}}
									control={control}
									options={props.siujk.sub_classifications} 
									defaultValue={sendData.vendor_sub_classification_id}
									isDisabled={has_draft_verification}
									menuPlacement="top"
									onChange={([selected]) => {
										handleChangeSubClassification(selected)
										return selected;
									}}
									isMulti={true}
									rules={{ required: false }} />
								{errors_response.vendor_sub_classification_id && <span className="text-danger"> {errors_response.vendor_sub_classification_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-qualification")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.qualification ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.qualification}
									className="basic-multi-select"
									classNamePrefix="select"
									name="vendor_qualification_id"
									styles={errors_response.vendor_qualification_id ? customStyles : {}}
									control={control}
									options={props.siujk.qualifications} 
									defaultValue={sendData.vendor_qualification_id}
									isDisabled={has_draft_verification}
									menuPlacement="top"
									rules={{ required: false }} />
								{errors_response.vendor_qualification_id && <span className="text-danger"> {errors_response.vendor_qualification_id[0]} </span>}
							</div>
						</div>
						<div className="form-group row m-b-15">
							<label className="col-md-3 col-form-label">{t("profileVendor:siujk-primary")} <span className="text-danger">*</span></label>
							<div className="col-md-7">
								<div className="checkbox checkbox-css">
									<input type="checkbox" id="main" name="main" defaultChecked={sendData.main === 'y'} ref={register({required: false})} disabled={has_draft_verification} /> <label className="p-b-10" htmlFor="main">  </label>
									{errors_response.main && <span className="text-danger"> {errors_response.main[0]} </span>}
								</div>
							</div>
						</div>
						{(props.has_verification.status_vendor !== 'partner' ? props.isVendor && !has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === false : sendData.tipe_verifikasi !== 'sudah_diverifikasi') : props.isVendor && !has_draft_verification) && <button className="btn btn-success pull-right m-b-10 m-l-10" type="submit" disabled={props.siujk.loadingButton}> 
							{props.siujk.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Submit')}
						</button>}
						{sendData.uuid !== '' && <button className="btn btn-danger m-b-10 m-l-10 pull-right" type="button" onClick={() => props.fetchSiujk()} disabled={props.siujk.loadingButton}> 
							{props.siujk.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
							{t('Button.Batal')}
						</button>}
					</div>
				</div>
			</form>
		)
}

export default withTranslation()(FormSiujk);