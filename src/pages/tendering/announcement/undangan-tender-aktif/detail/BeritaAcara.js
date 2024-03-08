import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../../helpers/formatNumber';

const BeritaAcara = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		// const { t } = props;
		const {status_bid_opening,bid_comercil, awarding_status, visibilitas_bid_open} = props.parentState.vendor_registration_tender.header;
		// const {bid_comercil} = props.parentState.vendor_registration_tender.header;
		// const {status_aanwijzing} = props.parentState.vendor_registration_tender.header;
		const {rekapNegosiasi,beritaAcara,vendor_nego, bid_opening_bapp, attachments_aanwijzing} = props.parentState.vendor_registration_tender;
		console.log(attachments_aanwijzing)
		// const {bid_opening_bapp}  = props.parentState;
		// const {awarding} = props.parentState.vendor_registration_tender;
		// const {beritaAcara} = props.parentState.vendor_registration_tender;
		// const{pakta_integritas} = props.parentState.vendor_registration_tender;
		// let isAwarding = awarding.some(item => item.is_winner === 'y') ? true : false;
		let isAwarding = awarding_status === 'y' || awarding_status === 's' ? true : false;
		// const {awarding} = props.parentState.vendor_registration_tender;
		// awarding.length > 0 ? awarding.map((data) => {data.is_winner === "y" ? isAwarding = true : isAwarding = false}) : isAwarding = false
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.vendor_registration_tender;
		const {loadings} = props.parentState;
		const handleFile = (e,file) => {
			e.preventDefault()
			window.open(`${process.env.REACT_APP_API_BASE_URL}files/tendering/${file}`, '_blank');
			// window.location= (`${process.env.REACT_APP_API_BASE_URL}files/tendering/${file}`)
		}
		// const handleFileVendor = (e,file) => {
		// 	e.preventDefault()
		// 	window.open(`${process.env.REACT_APP_API_BASE_URL}files/vendor/${file}`, '_blank');
		// 	// window.location= (`${process.env.REACT_APP_API_BASE_URL}files/tendering/${file}`)
		// }
		let rows;

		let aanwijzing_ba = []
        props.parentState.aanwijzing_ba!==undefined && props.parentState.aanwijzing_ba.forEach((val, key) => {
            aanwijzing_ba.push(<tr key={key}>
                {/* <td>1</td> */}
                <td>{val['aanwijzing_name'] + " Versi  : " + val['versi'] }</td>
                <td>Berita Acara Aanwijzing</td>
                <td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadAanwijzing(e, val['uuid'])}><i className="fa fa-file" aria-hidden="true"></i></button></td>
                {/* <td><button className="btn btn-xs btn-danger" onClick={(e) => e.preventDefault()}>Delete</button></td> */}
                {/* <td></td>	 */}
            </tr>)
        })

		let aanwijzing_attach = []
        attachments_aanwijzing && attachments_aanwijzing.forEach((val, key) => {
            aanwijzing_attach.push(<tr key={key}>
                {/* <td>1</td> */}
                <td>Aanwijzing Attachments</td>
                <td>{val['description']}</td>
                <td className="text-center">
					<button className="btn btn-xs btn-primary" onClick={(e) => handleFile(e,val['file'])}>
						<i className="fa fa-file" aria-hidden="true"></i>
					</button>

				</td>
            </tr>)
        })

		if (beritaAcara.length > 0) {
				rows = beritaAcara.map((dt, i) => {
						return (
								<tr key={i}>
									{/* <td>{i+6}</td> */}
									<td>{dt.type}</td>
									<td>{dt.description}</td>
									<td className="text-center">
										<button className="btn btn-xs btn-primary" onClick={(e) => handleFile(e,dt.file)}>
											<i className="fa fa-file" aria-hidden="true"></i>
											{/* <a style={{color : "inherit"}} target="_blank" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}`}><i className="fa fa-file" aria-hidden="true"></i></a> */}
										</button>
									</td>     
								</tr>
						)
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='12'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='12'></RowEmpty>);
			}
		}

		const setStatus = (status) => {
            switch (status){
                case "register":
                    return "Daftar"
                case "reject":
                    return "Tidak Daftar"
                default:
                    return "Tidak Respon"
                
            }
        }
        const setStatusQ = (status) => {
            switch (status){
                case "register":
                    return "No Quote"
                case "submitted" :
                    return "Quote"
                case "reject":
                    return "Reject Quote"
                default:
                    return "Tidak Respon Quote"
            }
        }

		let status;
		if (status_bid_opening.length > 0){
			if (status_bid_opening[0].registration_status === "register"){
				status = setStatusQ(status_bid_opening[0].registration_quotation)
			}else{
				status = setStatus(status_bid_opening[0].registration_status)
			}
		}
				
    return (
			<div style={{marginBottom : "-20px"}}>
				<Panel>
					<PanelHeader>Berita Acara</PanelHeader>
					{(loadings.items) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.items) &&
					<PanelBody >
						{errors.items && <p className="text-danger"> * {errors.items[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	{/* <th>No</th> */}
																	<th>Tipe Lampiran</th>
																	<th>Description</th>
                                                                    <th>File</th>
                                                                    {/* <th>Action</th> */}
															</tr>
													</thead>
													<tbody>
														{bid_comercil === 'y' && bid_opening_bapp==="publish" && visibilitas_bid_open === "general" && <tr>
															{/* <td>1</td> */}
															<td>Bid Opening</td>
															<td>Berita Acara Bid Opening</td>
															<td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadBidOpening(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
															{/* <td><button className="btn btn-xs btn-danger" onClick={(e) => e.preventDefault()}>Delete</button></td> */}
															{/* <td></td>	 */}
														</tr>}
														
														{aanwijzing_ba?.length>0 && aanwijzing_ba}
														{aanwijzing_attach?.length>0 && aanwijzing_attach}
														{status === 'Quote' && <tr>
															{/* <td>3</td> */}
															<td>Pakta Integritas</td>
															<td>Download Pakta Integritas</td>
															<td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadPaktaIntegritas(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>    
														</tr>}
														{rekapNegosiasi && vendor_nego?.length > 0 && <tr>
															{/* <td>4</td> */}
															<td>Nego</td>
															<td>Berita Acara Hasil Nego</td>
															<td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadNego(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
															{/* <td></td>	 */}
														</tr>}
														{isAwarding && <tr>
															{/* <td>5</td> */}
															<td>Awarding</td>
															<td>Surat Pengumuman Pemenang</td>
															<td className="text-center"><button className="btn btn-xs btn-primary" onClick={(e) => props.downloadAwarding(e)}><i className="fa fa-file" aria-hidden="true"></i></button></td>
															{/* <td></td>	 */}
														</tr>}
														{rows?.length>0 && rows }
													</tbody>
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default withTranslation()(BeritaAcara);