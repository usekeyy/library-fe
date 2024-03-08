import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../helpers/formatDate';
// import {formatNumber} from '../../../../helpers/formatNumber';

let dataCheckbox = []

const DokumenPengadaan = (props) => {
	const {paramType} = props.parentState;
	const {jadwal_tender} = props.parentState.monitoringTender;
	const {isBuyer} = props;
	// console.log(jadwal_tender)
	const isDisabled = (paramType === 'retender');
	let endQuotation = jadwal_tender.filter((item) => {
		return (item.jadwal_tender_code === 'JT004' || item.jadwal_tender_code === 'JT006')
	})
	let sekarangTemp = new Date(localStorage.getItem('times'));
	let end_date_quotation = new Date(endQuotation[0]?.end_date + ' ' + endQuotation[0]?.end_time)
	const isDisabledQuotation = isBuyer ? (end_date_quotation < sekarangTemp ? true : false) : true
	const handleCheckBox = (e,uuid) => {
		// e.preventDefault()
		if(dataCheckbox.length === 0){
			dataCheckbox = [
				{
					uuid : uuid,
					share : e.target.checked ? "1" : "0"
				}
			]
		}else{
			if (dataCheckbox.some(dt => dt.uuid === uuid)){
				dataCheckbox = dataCheckbox.map((data,i)=>{
					if(data.uuid === uuid){
						return {
							uuid : uuid,
							share : e.target.checked
						}
					}else{
						return data
					}
				})
			}else{
				dataCheckbox.push({uuid : uuid, share: e.target.checked? "1": "0"})
			}
			
		}
		
	}

	const handleUpdate = async (e) => {
		e.preventDefault();
		let data = {
			data : dataCheckbox
		}
		await props.update(data)
	}
	
	// let [loading,setLoading] = React.useState(false)
	let {data} = props;
	let rows=""
	if (data.length > 0){
		rows = data.map((dt, i) => {
			return (
				<tr key={i}>
					<td>{(i+1)}</td>
					<td>{dt.attachment_type}</td>
					<td>{dt.attachment_description}</td>
					<td>{<a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` } > {dt.file} </a>}</td>
					<td>{dt.created_by_name}</td>
					<td>{formatDate(dt.updated_at,true)}</td>
					<td><input type="checkbox" defaultChecked={parseInt(dt.share)===1} onChange={(e)=>handleCheckBox(e,dt.uuid)} disabled={isDisabledQuotation? true :  isDisabled ? isDisabled : dt.attachment_type==="oe"? true : false}/></td>                    
				</tr>
			)
		})
	}else {
		rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
	}
				
    return (
			<div>
				<Panel>
					<PanelHeader>Dokumen Pengadaan</PanelHeader>
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>No</th>
																	<th>Tipe Lampiran</th>
																	<th>Description</th>
                                                                    <th>File</th>
                                                                    <th>Upload By</th>
                                                                    <th>Upload At</th>
                                                                    <th>Share</th>
															</tr>
													</thead>
													<tbody>
                                                        {rows}
                                                    </tbody>
											</table>
									</div>
							</div>
							<div className="col-sm-12 text-right">
								<button className="btn btn-white" onClick={(e) => handleUpdate(e)} disabled={isDisabled || isDisabledQuotation}>
									{props.loading ? <i className="fa fa-spinner fa-spin"></i>:<div>update</div>}
								</button>
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(DokumenPengadaan);