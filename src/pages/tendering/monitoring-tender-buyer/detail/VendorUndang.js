import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../helpers/formatNumber';

const VendorUndang = (props) => {
        const setStatus = (status) => {
            switch (status){
                case "register":
                    return "Register"
                case "reject":
                    return "Reject RFQ"
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
                    return "Register"
            }
        }
        const {bid_administrasi,bid_comersil,data} = props.data
        let rows;
        if (data?.length > 0){
			rows = data.map((dt,i) => {
                let status,alasan;
                if (dt.registration_status === "register"){
                    status = setStatusQ(dt.registration_quotation)
                    alasan = dt?.registration_quotation_note
                }else{
                    status = setStatus(dt.registration_status)
                    alasan = dt?.registration_note
                }
                if (bid_administrasi === "y" && bid_comersil === "y"){
                    return (
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{dt.no_vendor}</td>
                            <td>{dt.badan_usaha}</td>
                            <td>{dt.nama_vendor}</td>
                            <td>{status}</td>
                            <td>{alasan}</td>
                            <td>
                                {status === 'Reject RFQ' ? 
                                    <button className="btn btn-xs btn-primary">
                                        <a style={{color : "inherit"}} target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.registration_file}` } > <i className="fa fa-file" /> </a>
                                    </button>
                                    :
                                    (status === 'Reject Quote' ? <button className="btn btn-xs btn-primary"> <a style={{color : "inherit"}} target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.registration_quotation_file}` } > <i className="fa fa-file" /> </a> </button> : "")

                                }
                            </td>		
                        </tr>
                    )
                }else{
                    return (
                        <tr key={i}>
                            {/* <td><i class="fas fa-eye-slash"></i></td> */}
                            <td>{i+1}</td>
                            <td>{dt.no_vendor}</td>
                            <td>{dt.badan_usaha}</td>
                            <td>{dt.nama_vendor}</td>
                            <td>{status}</td>
                            <td>{alasan}</td>
                            <td>
                                {status === 'Reject RFQ' ? 
                                    <button className="btn btn-xs btn-primary">
                                        <a style={{color : "inherit"}} target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.registration_file}` } > <i className="fa fa-file" /> </a>
                                    </button>
                                    :
                                    (status === 'Reject Quote' ? <button className="btn btn-xs btn-primary"> <a style={{color : "inherit"}} target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.registration_quotation_file}` } > <i className="fa fa-file" /> </a> </button> : "")

                                }
                            </td>		
                        </tr>
                    )
                }
				
			})
		}else{
			rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
        }
 
    return (
			<div>
				<Panel>
					<PanelHeader>Vendor Respon Terhadap Penawaran</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
                                <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-wrap">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nomor Vendor</th>
                                                    <th>Badan Usaha</th>
                                                    <th>Nama Vendor</th>
                                                    <th>Status</th>
                                                    <th>Alasan</th>	
                                                    <th>File</th>													
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows}
                                            </tbody>
                                        </table>
                                </div>
							</div>
						</div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(VendorUndang);