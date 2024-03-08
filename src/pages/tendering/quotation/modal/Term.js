import React from 'react';

const Term = (props) => {
		const {header} = props.parentState.quotation;
		const date = new Date();
		const formattedDate = date.toLocaleDateString('en-GB', {
			day: 'numeric', month: 'short', year: 'numeric'
		}).replace(/ /g, '-');
		
    return (
			<div>
				<p className="p1" style={{ textAlign: "center" }}><span className="s1"><strong>PAKTA INTEGRITAS</strong></span></p>
					<p className="p3">
					Kami yang bertanda tangan di bawah ini, masing-masing dari pihak Panitia Pengadaan {`${header?.company_name}`} dan pihak Peserta Pengadaan dalam rangka <strong>"{props.header.title}"</strong> {`${header?.company_name}`} dengan ini menyatakan dengan sebenarnya bahwa:
					</p>
				<ol>
				<li className="p3">Kami berjanji akan menyelenggarakan dan melaksanakan pengadaan tersebut di atas secara bersih, transparan dan profesional untuk memberikan hasil kerja terbaik dan tidak akan melakukan praktik Korupsi, Kolusi dan Nepotisme (KKN), baik antara pihak Panitia Pengadaan {`${header?.company_name}`} dengan Peserta Pengadaan atau sebaliknya maupun antar Peserta Pengadaan sendiri.</li>
				<li className="p3">Pihak Pelaksana Pengadaan dan Peserta Pengadaan berkomitmen untuk tidak akan melakukan atau terlibat dalam segala tindak Fraud dan menghindarkan diri dari perbuatan yang dapat mempermudah atau memberikan kesempatan kepada pihak tertentu untuk melakukan tindak Fraud serta menghindari pertentangan kepentingan (conflict of interest).</li>
				<li className="p3">Pelaksana Pengadaan tidak akan menerima sesuatu dalam bentuk apapun juga dari pihak Peserta Pengadaan dan pihak Peserta Pengadaan tidak akan memberikan sesuatu dalam bentuk apapun juga kepada pihak Panitia Pengadaan {`${header?.company_name}`}.</li>
				<li className="p3">Apabila terbukti melanggar hal-hal yang telah dinyatakan dalam PAKTA INTEGRITAS ini, maka kami bersedia dikenakan sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.</li>
				</ol>
				<p className="p3">Demikian pernyataan ini dibuat untuk digunakan sebagaimana mestinya.</p>
				<p className="p3" style={{ textAlign: "right", paddingRight: '60px' }}>Jakarta,<span className="Apple-converted-space">&nbsp; </span>{formattedDate}</p>
				<table className="t1" style={{ marginLeft: '70px' }} cellSpacing="0" cellPadding="0">
					<tbody>
							<tr>
								<td className="td1" style={{ width: "323px" }} valign="top">
										<p className="p3" style={{ textAlign: "center" }}><strong>PELAKSANA PENGADAAN</strong></p>
										<p className="p3" style={{ textAlign: "center" }}><strong>{`${header?.company_name}`}</strong></p>
								</td>
								<td className="td1" style={{ width: "323px" }} valign="top">
										<p className="p3" style={{ textAlign: "center" }}><strong>PESERTA PENGADAAN</strong></p>
										<p className="p3" style={{ textAlign: "center" }}><strong>{props.userName}</strong></p>
								</td>
							</tr>
							<tr>
								<td className="td1" style={{ width: "279px" }} valign="top">
										<p className="p2" style={{ textAlign: "center" }}></p>
										<p className="p2" style={{ textAlign: "center" }}>(_________________________)</p>
								</td>
								<td className="td1" style={{ width: "279px" }} valign="top">
										<p className="p2" style={{ textAlign: "center" }}></p>
										<p className="p2" style={{ textAlign: "center" }}>(_________________________)</p>
								</td>
							</tr>
					</tbody>
				</table>
			</div>
    )
}

export default Term;