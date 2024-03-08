import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import QuillEditor from './QuillEditor'

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit, control } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};
	console.log(props.data)
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label >{t("eDocument:label.title")} <span className="text-danger">*</span> </label>
					<input className={(errors.title || props.errors.title) ? "form-control is-invalid" : "form-control"} name="title" ref={register({ required: true })} defaultValue={props.data.title || ''} />
					{errors.title && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.title.message} </span>}
					{props.errors.title && <span className="text-danger">{props.errors.title[0]}</span>}
				</div>
				<div>
					<QuillEditor text={props.data.content} setData={props.setData}/>
				</div>
				<div className="form-group">
					<label>Status<span className="text-danger">*</span></label>
					<div>
						<Controller
							components={animatedComponents}
							closeMenuOnSelect={true}
							as={Select}
							control={control}
							options={[
								{
									label : "Actived",
									value : "y"
								},
								{
									label : "Inactived",
									value : "n"
								}
							]}
							defaultValue={props.data.status}
							inputRef={(e) => register({ name: "status", required: true })}
							name="status"
							rules={{ required: true }}
						/>
						{errors.status?.type === "required" && <span className="text-danger">* Field harus diisi</span>}
						{props.errors.status && <span className="text-danger">{props.errors.status[0]}</span>}
					</div>
				</div>
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("eDocument:button.update") : t("eDocument:button.submit")}</button>
				</div>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);