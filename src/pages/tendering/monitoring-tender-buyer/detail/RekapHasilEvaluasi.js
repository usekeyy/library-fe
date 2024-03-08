import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../helpers/formatNumber';
import {camelCase} from '../../../../helpers/camelCase';

const RekapHasilEvaluasi = (props) => {
        const {type_evaluasi,data,detail} = props
        let rows;
        if (data.length > 0){
            rows = data.map((dt,i) => {
                return (
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{dt.no_vendor}</td>
                        <td>{dt.badan_usaha}</td>
                        <td>{dt.nama_vendor}</td>
                        <td>{type_evaluasi === "teknis"? dt?.status : dt?.hasil}</td>
                        {/* <td><button className="btn btn-sm btn-white" onClick={e => detail(e,type_evaluasi)}>Detail</button></td>	 */}
                    </tr>
                )
            })

            if (type_evaluasi === "komersil" || type_evaluasi === "admin"){
                
            }
        }else{
            rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
        }

        
    return (
			<div>
				<Panel>
					<PanelHeader>Rekap Hasil Evaluasi {type_evaluasi}</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
                                {type_evaluasi === "teknis" &&  
                                <div><p style={{paddingBottom : "0px", marginBottom : "0px"}}><b>Metode : {props.assignment_evatek && camelCase(props.assignment_evatek)}</b></p>
                                <p style={{paddingTop : "0px", marginTop : "0px"}}><b>Evaluator : {props.assignment_evatek && camelCase(props.tim_evaluator)}</b></p></div>}
                                {data.length > 0 && <button style={{float: 'right', marginBottom:'5px'}} className="btn btn-sm btn-success" onClick={e => detail(e,type_evaluasi)}>Detail</button>}
                                <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nomor Vendor</th>
                                                    <th>Badan Usaha</th>
                                                    <th>Nama Vendor</th>
                                                    <th>Status</th>	
                                                    {/* <th>Action</th>											 */}
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

export default withTranslation()(RekapHasilEvaluasi);