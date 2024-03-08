import React from 'react';
import { withTranslation } from 'react-i18next';
// import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const TableKompetensi = (props) => {
		// const { t } = props;
		const {data} = props.parentState;
		console.log(data)
		const {loadings} = props.parentState;
		let rows;
		const deletePayload = (e, index) => {
			e.preventDefault();
			props.deletePayload(index)
		}
		
		if (data.length > 0) {
			rows = data.map((dt, i) => {
				
				const merk = (dt.merk !== null && dt.merk !== "") ? (Array.isArray(dt.merk) && dt.merk.length > 0) ? dt.merk.map((data, key) => {
					return <span key={key} className="label label-green m-r-5">{data.value || data}</span>
				}) : dt.merk : "";
				
						return (
								<React.Fragment key={i}>
									<tr>
											<td>{dt.bidang_usaha_id.label}</td>
											<td>{dt.sub_bidang_usaha_id.label}</td>
											<td>{dt.tipe_rekanan_id.label}</td>
											<td>{merk}</td>
											<td>{dt.attachment}</td>
											<td> {<button className="btn btn-xs btn-danger" onClick={(e) => deletePayload(e, i)} value={i} ><i className="danger fa fa-trash"></i></button> }</td>
									</tr>
								</React.Fragment>
						)
						
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<div className="row">
					<div className="col-sm-12">
							<div className="table-responsive">
									<table className="table table-bordered table-striped table-sm text-nowrap">
											<thead>
													<tr>
															<th>Bidang Usaha</th>
															<th>Sub Bidang Usaha</th>
															<th>Tipe Rekanan</th>
															<th>Merk/Brand</th>
															<th>Lampiran</th>
															<th>Aksi</th>
													</tr>
											</thead>
											<tbody>{rows}</tbody>
									</table>
							</div>
					</div>
				</div>
			</div>
    );
}

export default withTranslation()(TableKompetensi);