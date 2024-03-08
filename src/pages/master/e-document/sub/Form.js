import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import TinyEditor from '../../../tinyeditor/TinyEditor';
import QuillEditor from './QuillEditor'


const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label >Id <span className="text-danger">*</span> </label>
					<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
					{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
					{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
				</div>
				<div className="form-group">
					<label >{t("eDocument:label.title")} <span className="text-danger">*</span> </label>
					<input className={(errors.title || props.errors.title) ? "form-control is-invalid" : "form-control"} name="title" ref={register({ required: true })} defaultValue={props.data.title || ''} />
					{errors.title && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.title.message} </span>}
					{props.errors.title && <span className="text-danger">{props.errors.title[0]}</span>}
				</div>
				<div>
					<QuillEditor text={props.data.content} setData={props.setData}/>
				</div>
				<div>
					<TinyEditor text={props.data.content} setData={props.setData}/>
				</div>
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("eDocument:button.update") : t("eDocument:button.submit")}</button>
				</div>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);