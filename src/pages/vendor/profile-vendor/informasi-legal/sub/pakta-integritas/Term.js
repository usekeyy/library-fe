import React from 'react';
import { withTranslation } from 'react-i18next';

const Term = (props) => {
		const {sendData} = props.pakta_integritas;
		const {tempData} = props;
		
		const date = new Date();
		const formattedDate = date.toLocaleDateString('en-GB', {
			day: 'numeric', month: 'short', year: 'numeric'
		}).replace(/ /g, '-');
		const nama_perusahaan = (tempData !== "") ? (tempData.name !== null && tempData.name !== "") ? tempData.name : "[Nama Perusahaan]," : "[Nama Perusahaan],";
		// const nama_pic = (tempData !== "") ? (tempData.pic_name !== null && tempData.pic_name !== "") ? tempData.pic_name : "[Nama Lengkap]," : "[Nama Lengkap],";
		const jabatan = (tempData !== "") ? (tempData.direktur_utama !== null && tempData.direktur_utama !== "") ? "Direktur Utama" : "[Jabatan]," : "[Jabatan],";
		const nama_direktur = (tempData !== "") ? (tempData.direktur_utama !== null && tempData.direktur_utama !== "") ? tempData.direktur_utama : "[Nama Lengkap]," : "[Nama Lengkap],";
    return (
			<div>
				<p className="text-red" style={{marginBottom : "0px"}}>Note : {props.t("profileVendor:pakta-note")}</p>
				<p className="p1" style={{ textAlign: "center" }}><span className="s1"><strong>PAKTA INTEGRITAS</strong></span></p>
					<p className="p3">
					Saya yang bertanda tangan di bawah ini, Pimpinan Perusahaan/Direktur Utama (PT/CV/Lainnya) sebagai perwakilan perusahaan  dalam rangka <strong>Pendaftaran Rekanan Baru di Perusahaan</strong> dengan ini menyatakan dengan sesungguhnya bahwa:
					</p>
				<ol>
					<li className='p3'>
						Saya/Perusahaan saya tidak sedang dinyatakan pailit atau kegiatan usahanya tidak sedang dihentikan atau tidak sedang menjalani sanksi pidana atau sedang dalam pengawasan pengadilan.  
					</li>
					<li className='p3'>
						Saya tidak pernah dihukum berdasarkan putusan pengadilan atas tindakan yang berkaitan dengan kondite professional saya. 
					</li>
					<li className='p3'>
						Menjunjung tinggi nilai-nilai Etika Bisnis terhadap kebijakan PT. Sinergi Informatikan Semen Indonesia dan senantiasa menekankan kepatuhan terhadap nilai / norma bisnis untuk mencapai tingkat kinerja yang profesional dengan penuh tanggung jawab serta menciptakan lingkunan bisnis yang harmonis, adil, dan sehat. 
					</li>
					<li className='p3'>
						Seluruh informasi dan dokumen dalam DAFTAR LAMPIRAN yang diberikan adalah benar dan dapat dipertanggungjawabkan 
					</li>
					<li className='p3'>
						Data yang kami berikan sudah lengkap dan sesuai dengan yang dibutuhkan.
					</li>
				</ol>
				<p className="p3">Demikian pernyataan ini dibuat untuk digunakan sebagaimana mestinya.</p>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>Jakarta,<span className="Apple-converted-space">&nbsp; </span>{formattedDate}</p>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>{nama_perusahaan}<span className="Apple-converted-space">&nbsp; </span></p>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>[Ttd],<span className="Apple-converted-space">&nbsp; </span></p>
				<br/>
				<br/>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>{nama_direktur}<span className="Apple-converted-space">&nbsp; </span></p>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>{jabatan}<span className="Apple-converted-space">&nbsp; </span></p>
				{/* <table className="t1" style={{ height: "129px", width: "626px" }} cellSpacing="0" cellPadding="0">
					<tbody>
							<tr>
								<td className="td1" style={{ width: "323px" }} valign="top">
										<p className="p3" style={{ textAlign: "center" }}><strong>[Nama Perusahaan]</strong></p>
										<p className="p3" style={{ textAlign: "center" }}><strong>[TTD]</strong></p>
								</td>
							</tr>
							<tr>
								<td className="td1" style={{ width: "279px" }} valign="top">
										<p className="p2" style={{ textAlign: "center" }}>[Nama Lengkap]</p>
										<p className="p2" style={{ textAlign: "center" }}>[Jabatan]</p>
								</td>
							</tr>
					</tbody>
				</table> */}
				<center>
					<div className="col-md-6">
						{sendData.status_approval === 'setuju' && <button type="button" onClick={() => props.downloadPaktaIntegritas()} className="btn btn-primary m-r-10 m-b-20 btn-block" disabled={props.pakta_integritas.loadingButton}> 
								{props.pakta_integritas.loadingButton && <i className="fas fa-spinner fa-pulse"></i> }
								{props.t('Button.Download')}
						</button>}
					</div>
				</center>
			</div>
    )
}

export default withTranslation()(Term);