import React from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../../helpers/formatDate';
// import { statusNameDur } from '../../../../../helpers/statusName';

const FormHistoryJadwal = (props) => {
    const {data} = props;
    let rowspanCol = [];
    if (data.length > 0) {
        data.forEach((dt,i) => {

            if (rowspanCol.length > 0){
                    if(rowspanCol.some(x => x.name === dt.jadwal_tender_name)){
                        rowspanCol = rowspanCol.map((data,index) => {
                            if(data.name === dt.jadwal_tender_name){
                                return {
                                    name : dt.jadwal_tender_name,
                                    jumlah : data.jumlah + 1
                                }
                            }else{
                                return data
                            }
                        })
                        // rowspanCol = temp
                    }else{
                        rowspanCol.push({name : dt.jadwal_tender_name, jumlah : 1})
                    }
                    
            }else{
                rowspanCol.push({name : dt.jadwal_tender_name, jumlah : 1})
            }
        })
    }
    
    let rows;
    if (data.length > 0){
        let isRowspan = false
        let jadwal = ""
        let rowspanTemp = []
        let nomor = 0
        let subNomor = 1
        rows = data.map((dt,i) => {
            if (dt.status !== 'p' && dt.status !== 'r'){
                if (jadwal !== dt.jadwal_tender_name){
                    isRowspan = true
                    rowspanTemp = rowspanCol.filter((data) => {
                        return (data.name === dt.jadwal_tender_name)
                    })
                    nomor = nomor + 1
                    subNomor = 0
                }else{
                    isRowspan = false
                    subNomor = subNomor + 1
                }
                jadwal = dt.jadwal_tender_name
                return (
                    <tr key={i}>
                        {isRowspan ? <td>{nomor}</td> : <td>{nomor+'.'+subNomor}</td>}
                        {isRowspan && <td rowSpan={rowspanTemp[0].jumlah} style={{verticalAlign: "middle"}}>{dt.jadwal_tender_name}</td>}
                        <td>{formatDate(dt.start_date)}</td>
                        <td>{dt.start_time}</td>
                        <td>{formatDate(dt.end_date)}</td>
                        <td>{dt.end_time}</td>
                        <td>{formatDate(dt.updated_at,true)}</td>	
                        <td>{dt.name}</td>
                        {/* <td>{dt.status && statusNameDur(dt.status)}</td>		 */}
                    </tr>
                )
            }else{
                return false
            }
            
        })
    }else{
        rows = (<RowEmpty colSpan='15'>Tidak ada data</RowEmpty>);
    }

	return (
		<div>
				<ModalBody>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Process</th>
                                    <th>Start Date</th>
                                    <th>Start Time</th>
                                    <th>End Date</th>
                                    <th>End Time</th>
                                    <th>Updated At</th>
                                    <th>Updated By</th>
                                    {/* <th>Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                                {/* <tr>
                                    <td>Penumuman</td>
                                    <td>2020-12-24</td>
                                    <td>12:20:20</td>
                                    <td>2020-12-25</td>
                                    <td>12:20:20</td>
                                    <td>2020-12-24 12:20:20</td>
                                    <td>Buyer 0002</td>
                                </tr> */}
                            </tbody>
                    </table>
            </div>
				</ModalBody>
				<ModalFooter>
					{/* <button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button> */}
                    {/* <button className="btn btn-white">update</button> */}
				</ModalFooter>
		</div>
	);
}

export default withTranslation() (FormHistoryJadwal);