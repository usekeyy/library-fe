import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';


const Form = (props) => {
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const { t } = props;
	const { register, handleSubmit, errors } = useForm({});
	const onSubmit = async data => {
		props.save(data);
	};	

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >Id <span className="text-danger">*</span> </label>
						<input className={(errors.id || props.errors.id) ? "form-control is-invalid" : "form-control"} name="id" ref={register({ required: true })} defaultValue={props.data.id || ''} />
						{errors.id && <span className="text-danger">{errors.id.type === "required" ? "Field harus diisi" : ''}  {errors.id.message}</span>}
						{props.errors.id && <span className="text-danger">{props.errors.id[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("businessGroup:label.name")} <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("businessGroup:label.penjualan_min")} <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.penjualan_min || props.errors.penjualan_min) ? "form-control is-invalid" : "form-control"} name="penjualan_min" ref={register({ required: true })} defaultValue={props.data.penjualan_min || ''} />
						{errors.penjualan_min && <span className="text-danger"> {errors.penjualan_min.type === "required" ? "Field harus diisi" : ''}  {errors.penjualan_min.message} </span>}
						{props.errors.penjualan_min && <span className="text-danger">{props.errors.penjualan_min[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("businessGroup:label.penjualan_max")} <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.penjualan_max || props.errors.penjualan_max) ? "form-control is-invalid" : "form-control"} name="penjualan_max" ref={register({ required: true })} defaultValue={props.data.penjualan_max || ''} />
						{errors.penjualan_max && <span className="text-danger"> {errors.penjualan_max.type === "required" ? "Field harus diisi" : ''}  {errors.penjualan_max.message} </span>}
						{props.errors.penjualan_max && <span className="text-danger">{props.errors.penjualan_max[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("businessGroup:label.asset_min")} <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.asset_min || props.errors.asset_min) ? "form-control is-invalid" : "form-control"} name="asset_min" ref={register({ required: true })} defaultValue={props.data.asset_min || ''} />
						{errors.asset_min && <span className="text-danger"> {errors.asset_min.type === "required" ? "Field harus diisi" : ''}  {errors.asset_min.message} </span>}
						{props.errors.asset_min && <span className="text-danger">{props.errors.asset_min[0]}</span>}
					</div>
					<div className="form-group">
						<label>{t("businessGroup:label.asset_max")} <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.asset_max || props.errors.asset_max) ? "form-control is-invalid" : "form-control"} name="asset_max" ref={register({ required: true })} defaultValue={props.data.asset_max || ''} />
						{errors.asset_max && <span className="text-danger"> {errors.asset_max.type === "required" ? "Field harus diisi" : ''}  {errors.asset_max.message} </span>}
						{props.errors.asset_max && <span className="text-danger">{props.errors.asset_max[0]}</span>}
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("businessGroup:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("vendorClassification:button.update") : t("vendorClassification:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation()(Form);