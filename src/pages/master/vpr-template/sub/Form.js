import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control, setValue, getValues } = useForm({});
	// let msg = props.errors;
	const [subCategory, setSubCategory] = React.useState([])

	React.useEffect(() => {
		console.log(props.uuid)
		console.log(props.propsState.subCategoryData.length)
		if(props.uuid !== "") {
			if(props.propsState.subCategoryData.length > 0){
				console.log("tes")
				let temp = props.propsState.subCategoryData.filter((data) => {
					if (getValues("category").some((datas) => datas.value === data.category_id)){
						return data
					}else{
						return false
					}
				})
				setSubCategory(temp)
			}
		}
	},[props.propsState.subCategoryData])
	
	

	const handleChangeCategory = (val) => {
		if (val !== null){
			let temp = props.propsState.subCategoryData.filter((data) => {
				if (val.some((datas) => datas.value === data.category_id)){
					return data
				}else{
					return false
				}
			})
			if (getValues("subCategory") !== "" && getValues("subCategory") !== null && getValues("subCategory") !== undefined){
				let tempDefaultSubCategory = getValues("subCategory").filter((data) => {
					if (val.some((datax) => datax.value === data.category_id)){
						return data
					}else{
						return false
					}
				})
				setValue("subCategory", tempDefaultSubCategory)
			}
			setSubCategory(temp)
		}else{
			console.log("kosong")
			setValue("subCategory", "")
			setSubCategory([])
		}
		
		// setValue("subCategory", props.propsState.subCategoryData)
		// setSubCategory(props.propsState.subCategoryData)
	}

	// const customStyles = {
	// 	control: (base, state) => ({
	// 			...base,
	// 			borderColor: state.isFocused ?
	// 			'#ddd' : 'red',
	// 	})
	// }
	const onSubmit = async data => {
		// console.log(data)
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					{/* <div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div> */}
					<div className="form-group">
						<label >{t("documentType:label.name")} <span className="text-danger">*</span> </label>
						<input className={(errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{/* {props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>} */}
					</div>
					<div className="form-group">
							<label>Category <span className="text-danger">*</span></label>
							<div>
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									placeholder={props.loadings.category ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									isLoading={props.loadings.category}
									className="basic-multi-select"
									classNamePrefix="select"
									name="category"
									// styles={errors_response.category ? customStyles : {}}
									control={control}
									options={props.propsState.categoryData} 
									defaultValue={props.data.category || ""}
									// isDisabled={has_draft_verification}
									menuPlacement="top"
									isMulti={true}
									onChange={([selected]) => {
										handleChangeCategory(selected)
										return selected;
									}}
									rules={{ required: true }} />
									{errors.category && <span className="text-danger"> {errors.category.type === "required" ? "Field harus diisi" : ''}  {errors.category.message} </span>}
								{/* {errors_response.vendor_classification_id && <span className="text-danger"> {errors_response.vendor_classification_id[0]} </span>} */}
							</div>
						</div>
						<div className="form-group">
							<label>Sub Category <span className="text-danger">*</span></label>
							<div>
							<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select} 
									// placeholder={props.loadings.category ? t("Select.Sedang Memuat") : t("Select.Pilih") }
									// isLoading={props.loadings.category}
									className="basic-multi-select"
									classNamePrefix="select"
									name="subCategory"
									// styles={errors_response.category ? customStyles : {}}
									control={control}
									options={subCategory} 
									defaultValue={props.data.sub_category_id || ""}
									// isDisabled={has_draft_verification}
									menuPlacement="bottom"
									isMulti={true}
									// onChange={([selected]) => {
									// 	handleChangeCategory(selected)
									// 	return selected;
									// }}
									rules={{ required: true }} />
									{errors.subCategory && <span className="text-danger"> {errors.subCategory.type === "required" ? "Field harus diisi" : ''}  {errors.subCategory.message} </span>}
								{/* {errors_response.vendor_classification_id && <span className="text-danger"> {errors_response.vendor_classification_id[0]} </span>} */}
							</div>
						</div>
					</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("documentType:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("documentType:button.update") : t("documentType:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);