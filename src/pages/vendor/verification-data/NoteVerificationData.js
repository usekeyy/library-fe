import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {useSelector} from 'react-redux';

const FormAkta = (props) => {
    const {t} = props;
	const { register, handleSubmit } = useForm({});
	const [status, setStatus] = React.useState('')
	const errors_response = props.data.errors;
	const {data} = props;
	let verification = useSelector(state => state.verification.verification);
	const verificationTypeOptional = [
		{
			alias : "surat_izin_lainnya",
			name : "Surat Ijin Lainnya"
		},
		{
			alias : "mesin_perusahaan",
			name : "Alat"
		},
		{
			alias : "pengalaman_vendor",
			name : "Pengalaman Kerja"
		},
		{
			alias : "laporan_keuangan_lain",
			name : "Laporan Keuangan Lainnya"
		},
		{
			alias : "dokumen_pajak_spt",
			name : "SPT Tahunan"
		},
		{
			alias : "dokumen_pajak_fiskal",
			name : "Surat Keterangan Fiskal"
		},
		{
			alias : "tenaga_ahli",
			name : "Tenaga Ahli"
		},
		{
			alias : "surat_izin_siujk",
			name : "Surat Ijin Usaha Jasa Konstruksi"
		},
		
		// {
		// 	alias : "tenaga-ahli (mandatory untuk bidang usaha jasa)"
		// }
	]

	const checkOptionalContent = () => {
		let path = verificationTypeOptional.filter((item) => {
			return (item.alias === props.path)
		})
		if (path !== '' || path !== null || path !== undefined){
			return Array.isArray(verification[path[0]?.name]?.tipe_verifikasi) ? (verification[path[0]?.name]?.tipe_verifikasi.length > 0 ? true : false) : verification[path[0]?.name]?.tipe_verifikasi !== '' ? true : false;
		}else{
			return true;
		}
	}

    const onSubmit = async data => {
			data.status = status;
			props.verification(props.verification_uuid, props.path, data)
			// console.log(data);
    };

	const handleStatus = (e, type) => {
		// e.preventDefault();
		setStatus(type)
		// console.log(type);
	}
	const isDisabledByLength = data.verifLength > 0 || props.data.loadingButton || props.verification_uuid === null;
	// console.log(isDisabledByLength);
	// console.log(data.btn_approve);
	const checkSingleOrMultiple = (data.verifyAll !== undefined) ? data.verifyAll : props.status === 'y';
	const isDisabledPartner = (props.status_vendor === 'partner' && checkSingleOrMultiple) ? false : true;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
						<div className="row">
								{isDisabledPartner && checkOptionalContent() && <div className="col-md-12">
										<textarea 
										ref={register({ required: false })} 
										className={(errors_response.note) ? "form-control is-invalid" : "form-control"} 
										name="note" 
										rows="4" 
										cols="50" 
										defaultValue={data.note} 
										placeholder="CATATAN VERIFIKASI" 
										// disabled={(props.isVerifMultiple !== undefined && props.isVerifMultiple) ? isDisabledByLength : props.status !== 'd' || props.verification_uuid === null} 
										disabled={checkSingleOrMultiple || isDisabledByLength}
										/>
										{errors_response.note && <span className="text-danger"> {errors_response.note[0]} </span>}
										<div className="pull-right m-t-10 m-b-10">
												<button
														className="btn btn-danger m-l-10"
														type="submit"
														value={"n"}
														onClick={(e) => handleStatus(e, 'n')}
														// disabled={(props.isVerifMultiple !== undefined && props.isVerifMultiple) ? data.verifyAll || isDisabledByLength : props.data.loadingButton || props.status !== 'd' || props.verification_uuid === null}
														disabled={checkSingleOrMultiple || isDisabledByLength || props?.isStatusDraftVerif}
														>
														{props.data.loadingButton &&
														<i className="fas fa-spinner fa-pulse"></i>
														} {t('Button.Tolak')}
												</button>
												<button
														className="btn btn-success m-l-10"
														type="submit"
														value={"y"}
														onClick={(e) => handleStatus(e, 'y')}
														// disabled={(props.isVerifMultiple !== undefined && props.isVerifMultiple) ? isDisabledByLength || data.btn_approve === 'n' : props.data.loadingButton || props.status !== 'd' || props.verification_uuid === null}
														disabled={checkSingleOrMultiple || isDisabledByLength || props?.isStatusDraftVerif}
														>
														{props.data.loadingButton &&
														<i className="fas fa-spinner fa-pulse"></i>
														} {t('Button.Setuju')}
												</button>
										</div>
								</div>}
						</div>
				</form>
    )
}

export default withTranslation() (FormAkta);