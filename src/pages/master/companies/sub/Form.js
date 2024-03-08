import React from 'react';
import { useState } from "react"
import { useForm } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';


const RouteForm = (props) => {
	const { register, handleSubmit, errors, setValue } = useForm({});
	const [genre, setGenre] = useState('1')
	const [tahun, setTahun] = useState(2005)
	const {t} = props;
	const onSubmit = data => {
		data.genre_id  = genre;
		data.tahun  = tahun;
		console.log(data);
		props.save(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody>
					<div className="form-group">
						<label >{t("company:label.name")}  <span className="text-danger">*</span></label>
						<input className={(errors.name || props.errors.name) ? "form-control is-invalid" : "form-control"} name="name" ref={register({ required: true })} defaultValue={props.data.name || ''} />
						{errors.name && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.name.message} </span>}
						{props.errors.name && <span className="text-danger">{props.errors.name[0]}</span>}
					</div>
					<div className="form-group">
						<label >Penerbit  <span className="text-danger">*</span></label>
						<input className={(errors.penerbit || props.errors.penerbit) ? "form-control is-invalid" : "form-control"} name="penerbit" ref={register({ required: true })} defaultValue={props.data.penerbit || ''} />
						{errors.penerbit && <span className="text-danger"> {errors.name.type === "required" ? "Field harus diisi" : ''}  {errors.penerbit.message} </span>}
						{props.errors.penerbit && <span className="text-danger">{props.errors.penerbit[0]}</span>}
					</div>
					<div className="form-group">
						<label >Tahun  <span className="text-danger">*</span></label>
						<select className={(errors.tahun || props.errors.tahun) ? "form-control is-invalid" : "form-control"} name="year" id="year" style={{ marginRight: "20px" }} defaultValue={props.data.tahun || ''} 
						value={props.data.tahun} onChange={props.data.tahun}>
							{Array.from({ length: 20 }, (_, index) => 2005 + index).map(year => (
								<option key={year} value={year} selected={props.data.tahun === year}>{year}</option>
							))}
						</select>
						{errors.tahun && <span className="text-danger"> {errors.tahun.type === "required" ? "Field harus diisi" : ''}  {errors.tahun.message} </span>}
						{props.errors.tahun && <span className="text-danger">{props.errors.tahun[0]}</span>}
					</div>
					<div className="form-group">
						<label >Genre  <span className="text-danger">*</span></label>
						<select className={(errors.genre_id || props.errors.genre_id) ? "form-control is-invalid" : "form-control"} name="genre_id" id="genre_id" style={{ marginRight: "20px" }} defaultValue={props.data.genre_id || ''}
						 onChange={(event) => setGenre(event.target.value)}>
							<option key='1' value='1' selected={props.data.genre_id === 1}>Akutansi</option>
							<option key='2' value='2' selected={props.data.genre_id === 2}>Comedy</option>
							<option key='3' value='3' selected={props.data.genre_id === 3}>Horror</option>
						</select>
						{errors.genre_id && <span className="text-danger"> {errors.genre_id.type === "required" ? "Field harus diisi" : ''}  {errors.genre_id.message} </span>}
						{props.errors.genre_id && <span className="text-danger">{props.errors.genre_id[0]}</span>}
					</div>
					<div className="form-group">
						<label >Deskripsi  <span className="text-danger">*</span></label>
						<textarea className="form-control"
							name="deskripsi"
							ref={register({ required: true })}							
							defaultValue={props.data.deskripsi || ''}
						/>
						{errors.deskripsi && <span className="text-danger"> {errors.deskripsi.type === "required" ? "Field harus diisi" : ''}  {errors.deskripsi.message} </span>}
						{props.errors.deskripsi && <span className="text-danger">{props.errors.deskripsi[0]}</span>}
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