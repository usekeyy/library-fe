import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import Creatable from 'react-select/creatable';
import { components } from "react-select";

const animatedComponents = makeAnimated();

const Sync = (props) => {
		const { register, handleSubmit, setValue, control } = useForm({});
		const {t} = props;
		const errors_response = [];
		// const [loading, setLoading] = React.useState(false)
		const loading = false
		const [date_sekarang, setDateSekarang] = React.useState("")
		const [date_mulai, setDateMulai] = React.useState("")
		const [min_mulai, setMinMulai] = React.useState("")
		const [max_mulai, setMaxMulai] = React.useState("")
		const [mounted, isMounted] = React.useState(true)
		const [onLoad, setOnLoad] = React.useState(false)
		const [opsi,setOpsi] = React.useState('tanggal')

		const sekarang = new Date(localStorage.getItem('times'));
		const mulai = new Date(sekarang.getTime() - (4 * 24 * 60 * 60 * 1000));
		// const [tipeLampiran, setTipeLampiran] = React.useState("")
		// const [startDate, setStartDate] = React.useState("")
		// const [endDate, setEndDate] = React.useState("")
		// const {m_tipe_lampiran} = props.parentState;

		const Menu = props => {
			const optionSelectedLength = props.getValue().length || 0;
			return (
			  <components.Menu {...props}>
				{optionSelectedLength < 10 ? (
				  props.children
				) : (
				  <div style={{ margin: 15 }}>Max limit achieved</div>
				)}
			  </components.Menu>
			);
		  };

		React.useEffect(() => {
			if(mounted){
				let dd = sekarang.getDate();
				let mm = sekarang.getMonth()+1; //January is 0!
				let yyyy = sekarang.getFullYear();
				if(dd<10){
						dd='0'+dd
					} 
					if(mm<10){
						mm='0'+mm
					} 
	
				let dd_mulai = mulai.getDate();
				let mm_mulai = mulai.getMonth()+1; //January is 0!
				let yyyy_mulai = mulai.getFullYear();
				if(dd_mulai<10){
						dd_mulai='0'+dd_mulai
					} 
					if(mm_mulai<10){
						mm_mulai='0'+mm_mulai
					} 
	
				setDateSekarang(yyyy+'-'+mm+'-'+dd)
				setMaxMulai(yyyy+'-'+mm+'-'+dd)
				setDateMulai(yyyy_mulai+'-'+mm_mulai+'-'+dd_mulai)
				setMinMulai(yyyy_mulai+'-'+mm_mulai+'-'+dd_mulai)
				isMounted(false)
			}
		},[mulai, sekarang, mounted])

		// const customStyles = {
		// 	control: (base, state) => ({
		// 			...base,
		// 			borderColor: state.isFocused ?
		// 			'#ddd' : 'red',
		// 	})
		// }

		const onClikEndDate = (e) => {
			e.preventDefault();
			setOnLoad(true)
			console.log(e.target.value)
			const tempDate = new Date(e.target.value)
			const minDate = new Date(tempDate.getTime() - (4 * 24 * 60 * 60 * 1000));
			let dd = minDate.getDate();
			let mm = minDate.getMonth()+1; //January is 0!
			let yyyy = minDate.getFullYear();
			if(dd<10){
				dd='0'+dd
			} 
			if(mm<10){
				mm='0'+mm
			}
			
			
			let dd_mulai = tempDate.getDate();
			let mm_mulai = tempDate.getMonth()+1; //January is 0!
			let yyyy_mulai = tempDate.getFullYear();
			if(dd_mulai<10){
					dd_mulai='0'+dd_mulai
			} 
			if(mm_mulai<10){
				mm_mulai='0'+mm_mulai
			} 
			const new_start_date = yyyy+'-'+mm+'-'+dd;
			setMinMulai(new_start_date)
			setDateMulai(new_start_date)
			setMaxMulai(yyyy_mulai+'-'+mm_mulai+'-'+dd_mulai)
			setValue('start_date',yyyy+'-'+mm+'-'+dd)
			setTimeout(() => {
				setOnLoad(false)
				// console.log('yyyy-mm-dd',yyyy+'-'+mm+'-'+dd)
				// console.log('min_mulai',min_mulai)
				// console.log('max_mulai',max_mulai)
			}, 500);
		}

		const onSubmit = async data => {
			console.log(data)
			if (data.opsi.value === 'tanggal'){
				const start_date = new Date(data.start_date + " 00:00:01");
				const end_date = new Date(data.end_date + " 00:00:01");
				if (end_date > sekarang){
					toastr.error("Maksimal Tanggal Akhir Sinkron Adalah Hari Ini")
				}else if(start_date > end_date){
					toastr.error("Tanggal Awal Harus Lebih Besar Dari Tanggal Akhir")
				}else {
					const diffTime = Math.abs(end_date - start_date);
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
					console.log(diffDays)
					if (diffDays <= 5 && diffDays >= 0){
						props.sync(data)
					}else{
						toastr.error("Range Maksimal 5 Hari")
					}
				}
			}else{
				let number = ''
				if (data.number?.length > 0){
					data.number.forEach(data => {
						number === '' ? number = data.value : number = `${number};${data.value}`
					});
					props.sync({number : number})
				}else{
					toastr.error('Nomor PR Tidak Boleh Kosong')
				} 
				 
			}
		};


		const handleChangeOpsi = (opsi) => {
			setOpsi(opsi.value)
		}
		const onInputChangePr = (option, {action}) => {
			if (action === "input-change") {
				props.fetchDataPr({start : 0, length : 10, number : option})
			}
		}
		// const setData = (data) => {
		// 	data.document_type = typeof data.document_type.value !== "undefined" ? data.document_type.value : "";
		// }
		
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label>Pilih Opsi<span className="text-danger">*</span></label>
								<div>
									<Controller
										components={animatedComponents}
										closeMenuOnSelect={true}
										as={Select}
										control={control}
										options={[
											{value : "tanggal", label : "Tanggal"},
											{value : "number", label : "Nomor PR"}
										]}
										name="opsi"
										// isClearable
										// styles={props.errors.bidang_usaha_id ? customStyles : {}}
										onChange={([selected]) => {
											handleChangeOpsi(selected)
											return selected;
										}}
										defaultValue={{value : "tanggal", label : "Tanggal"}}
										// isDisabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification}
									/>
								</div>
							</div>
						</div>
				</div>
				{opsi === 'tanggal' ?
				<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label className="">{t("Label.Start Date")} <span className="text-danger">*</span></label>
								<div className="">
									{onLoad && <input type="text" name="start_datex" className={"form-control"} placeholder="" disabled={true} defaultValue={""} /> }
									{!onLoad && <input type="date" min={min_mulai} max={max_mulai} name="start_date" ref={register({required: true})} className={(errors_response.start_date || props.parentState.purchasing_requisition.errors.start_date) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={props.parentState.loadings.sync || loading} defaultValue={date_mulai}/>}
									{errors_response.start_date && <span className="text-danger"> {errors_response.start_date[0]} </span>}
									{props.parentState.purchasing_requisition.errors.start_date && <span className="text-danger">{props.parentState.purchasing_requisition.errors.start_date[0]}</span>}
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="form-group">
								<label className="">{t("Label.End Date")} <span className="text-danger">*</span></label>
								<div className="">
									<input type="date" max={date_sekarang} name="end_date" ref={register({required: true})} className={(errors_response.end_date || props.parentState.purchasing_requisition.errors.end_date) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={props.parentState.loadings.sync || loading} defaultValue={date_sekarang} onChange={(e) => onClikEndDate(e)}/>
									{errors_response.end_date && <span className="text-danger"> {errors_response.end_date[0]} </span>}
									{props.parentState.purchasing_requisition.errors.end_date && <span className="text-danger">{props.parentState.purchasing_requisition.errors.end_date[0]}</span>}
								</div>
							</div>
						</div>
				</div>
				:
				<div className="row">
						<div className="col-md-12">
							<div className="form-group">
							<label>Nomor PR <span className="text-danger">*</span></label>
							<div>
								{/* <input type="text" className={(errors.merk || props.errors.merk) ? "form-control is-invalid" : "form-control"} name="merk" ref={register()} placeholder="" defaultValue={props.data.merk} disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} /> */}
								<Controller
									components={{ Menu }}
									closeMenuOnSelect={true}
									as={Creatable}
									control={control}
									isClearable
									isMulti
									// defaultValue={props.data.merk}
									// styles={props.errors.merk ? customStyles : {}}
									options={props.parentState.m_data_pr}
									// rules={{ required:  getValues('bidang_usaha_id')?.value >=1 && getValues('bidang_usaha_id')?.value <=31}}
									onInputChange={onInputChangePr}
									// inputValue={props.inputValue}
									name="number"
									isLoading={props.parentState.loadingDataPr}
								/>
								{/* {props.errors.merk && <span className="text-danger"> {props.errors.merk[0]}  </span>} */}
							</div>
						</div>
						</div>
				</div>
				}
				{<button className="btn btn-primary m-b-10 m-l-10 pull-right" type="submit" disabled={props.parentState.loadings.sync}> 
					{props.parentState.loadings.sync && <i className="fas fa-spinner fa-pulse"></i> }
					{"Sync"}
				</button>}
			</form>
		)
}

export default withTranslation()(Sync);