import React from 'react';
import { useForm} from 'react-hook-form';
import { withTranslation } from 'react-i18next';

const RouteForm = (props) => {
	const { register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* <div className="form-group">
					<label >{t("eDocument:label.title")} <span className="text-danger">*</span> </label>
					<input className={(errors.title || props.errors.title) ? "form-control is-invalid" : "form-control"} name="title" ref={register({ required: true })} defaultValue={props.data.title || ''} />
					{errors.title && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.title.message} </span>}
					{props.errors.title && <span className="text-danger">{props.errors.title[0]}</span>}
				</div> */}
				<div className="form-group row m-b-15">
					<label className="col-md-3 col-form-label" style={{marginRight: '35px'}}>Buka Registrasi </label>
					<div className="col-md-7 custom-control custom-switch">
						<input  className=" custom-control-input form-control" ref={register()} defaultChecked={props.defaultStatus} type="checkbox" id="flexSwitchCheckDefault" name="status"/>
						<label className="custom-control-label" htmlFor="flexSwitchCheckDefault">OFF/ON</label>
					</div>                      
				</div>
				<div className="form-group row m-b-15">
					<label className="col-md-3 col-form-label">Note <span className="text-danger">*</span></label>
					<div className="col-md-7">
						<input type="text" className={(errors.note) ? "form-control is-invalid" : "form-control"} name="note" placeholder="" ref={register({ required: true })}/>
					</div>
				</div>
				<div className="col-md-10">
					<div className="pull-right">
						<button className="btn btn-sm btn-success" type="submit" disabled={props.loading}>{props.loading ? <i className="fa fa-spinner fa-spin"></i> : "Submit"}</button>
					</div>
				</div>
				{/* <div className="pull-right m-t-10 m-b-10">
					<button className="btn btn-success m-l-10" type="submit"> Submit </button>
				</div> */}
			</form>
		</div>
	);
}

export default  withTranslation() (RouteForm);