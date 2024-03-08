import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import QuillEditor from './QuillEditor'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const RouteForm = (props) => {
	const {t} = props;
	const { register, errors, handleSubmit } = useForm({});
	const onSubmit = async data => {
		// console.log(data)
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label >{t("eDocument:label.title")} <span className="text-danger">*</span> </label>
					<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
					{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
					{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
				</div>
				<div>
					<CKEditor
						editor={ ClassicEditor }
						data={props.data.keterangan}
						config={{
							plugin :[

							],
							toolbar: [
								'heading',
								'|',
								'fontsize',
								'fontfamily',
								'|',
								'bold',
								'italic',
								'underline',
								'strikethrough',
								'removeFormat',
								'highlight',
								'|',
								'alignment',
								'|',
								'numberedList',
								'bulletedList',
								'|',
								'link',
								'blockquote',
								'imageUpload',
								'insertTable',
								'mediaEmbed',
								'|',
								'undo',
								'redo',
								'|',
								'comment',
								'|',
								'trackChanges'
							],
						}}
						onReady={ editor => {
							// You can store the "editor" and use when it is needed.
							console.log( 'Editor is ready to use!', editor );
						} }
						onChange={ ( event, editor ) => {
							const data = editor.getData();
							props.setData(data)
						}}
					/>
					{props.errors.keterangan && <span className="text-danger">{props.errors.keterangan[0]}</span>}
				</div>
				<div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("eDocument:button.update") : t("eDocument:button.submit")}</button>
				</div>
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);