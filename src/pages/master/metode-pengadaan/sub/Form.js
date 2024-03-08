import React, { useState } from 'react';
import {useForm, Controller} from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const RouteForm = (props) => {
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const { control, register, handleSubmit, errors, watch } = useForm({});
	const [loading, setLoading] = React.useState(false)
	const watchAllFields = watch();
	const {t} = props;

	const onSubmit = data => {
		props.save(data);
	};

	const setPq = (type) => {
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
		}, 1);
	}
	

	const tender_umum = (watchAllFields[`tender_umum`] !== undefined) ? watchAllFields[`tender_umum`] : props.data.pra_qualification;
	
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >{t("company:label.name")}  <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register()} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
							<label>Company <span className="text-danger">*</span></label>
							<div>
								<Controller
									components={animatedComponents}
									closeMenuOnSelect={true}
									as={Select}
									control={control}
									options={props.m_company}
									defaultValue={props.data.company_id}
									inputRef={(e) => register({ name: "company_id", required: false })}
									name="company_id"
									placeholder={props.loadings.company_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
									isLoading={props.loadings.company_id}
									rules={{ required: false }}
								/>
								{errors.company_id && <span className="text-danger">* This field is required</span>}
								{props.errors.company_id && <span className="text-danger">{props.errors.company_id[0]}</span>}
							</div>
						</div>
					<div className="form-group">
						<label>Kuorum <span className="text-danger">*</span></label>
						<input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
							className={(errors.kuorum || props.errors.kuorum) ? "form-control is-invalid" : "form-control"} name="kuorum" ref={register({ required: true })} defaultValue={props.data.kuorum || ''} />
						{errors.kuorum && <span className="text-danger"> {errors.kuorum.type === "required" ? "Field harus diisi" : ''}  {errors.kuorum.message} </span>}
						{props.errors.kuorum && <span className="text-danger">{props.errors.kuorum[0]}</span>}
					</div>
					<div className="form-group">
						<label>Tender Umum <span className="text-danger">*</span></label>
						<div>
							<label><input type="radio" name="tender_umum" onClick={() => setPq('y')} value={'y'} ref={register({ required: true })} required defaultChecked={props.data.tender_umum && props.data.tender_umum==='y' ? true : false} /> Yes</label>
							<br></br>
							<label><input type="radio" name="tender_umum" onClick={() => setPq('n')} value={'n'} ref={register({ required: true })} required defaultChecked={props.data.tender_umum && props.data.tender_umum==='n' ? true : false} /> No</label>
						</div>
					</div>
					{!loading && <div className="form-group">
						<label>Pra Qualification <span className="text-danger">*</span></label>
						<div>
							<label><input type="radio" name="pra_qualification" value={'y'} ref={register({ required: true })} required defaultChecked={(tender_umum === 'y')} /> Yes</label>
							<br></br>
							<label><input type="radio" name="pra_qualification" value={'n'} ref={register({ required: true })} required defaultChecked={(tender_umum === 'n')} /> No</label>
						</div>
					</div>}
					<div className="form-group">
						<label>Batas Maksimal <span className="text-danger"></span></label>
						<div>
							<input type="number" name="max_limit" defaultValue={props.data.max_limit} className="form-control" ref={register()} />
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
					<button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {props.uuid !== "" ? t("company:button.update") : t("company:button.submit")}</button>
				</ModalFooter>
			</form>
		</div>
	);
}

export default withTranslation() (RouteForm);