import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import QuillEditor from './QuillEditor';
import Select from 'react-select';
import ReactLoading from 'react-loading';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();


const RouteForm = (props) => {
	const {t} = props;
	const { errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
		props.save(data.type.value);
	};

	console.log(props.data)

	return (
		<div>
			{props.uuid!=="" && !props.loadings.loading_get_data &&
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label >Tipe Rules Auction <span className="text-danger">*</span> </label>
					<Controller
						components={animatedComponents}
						closeMenuOnSelect={true}
						as={Select}
						className={(errors.name || props.errors.name) ? "is-invalid" : ""}
						control={control}
						options={props.options} 
						// onInputChange={onInputChange}
						name="type" 
						defaultValue={props.data.type}
						rules={{ required: true }}
					/>
					{errors.type && <span className="text-danger"> {errors.type.type === "required" ? "Required" : ''}  {errors.type.message} </span>}
					{props.errors.type && <span className="text-danger">{props.errors.type[0]}</span>}
				</div>
				<div>
					<label >Rules Content<span className="text-danger">*</span> </label>
					<QuillEditor text={props.data.rule} setData={props.setData}/>
					{props.errors.rule && <span className="text-danger">{props.errors.rule[0]}</span>}
				</div>
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("eDocument:button.update") : t("eDocument:button.submit")}</button>
				</div>
			</form>
			}
			{props.uuid!=="" && props.loadings.loading_get_data &&
			<center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
			}
			{props.uuid==="" &&
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label >Tipe Rules Auction<span className="text-danger">*</span> </label>
					<Controller
						components={animatedComponents}
						closeMenuOnSelect={true}
						as={Select}
						className={(errors.name || props.errors.name) ? "is-invalid" : ""}
						control={control}
						options={props.options} 
						// onInputChange={onInputChange}
						name="type" 
						defaultValue={props.data.type}
						rules={{ required: true }}
					/>
					{errors.type && <span className="text-danger"> {errors.type.type === "required" ? "Required" : ''}  {errors.type.message} </span>}
					{props.errors.type && <span className="text-danger">{props.errors.type[0]}</span>}
				</div>
				<div>
					<label >Rules Content<span className="text-danger">*</span> </label>
					<QuillEditor text={props.data.rule} setData={props.setData}/>
					{props.errors.rule && <span className="text-danger">{props.errors.rule[0]}</span>}
				</div>
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("eDocument:button.update") : t("eDocument:button.submit")}</button>
				</div>
			</form>
			}
		</div>
	);
}

export default  withTranslation() (RouteForm);