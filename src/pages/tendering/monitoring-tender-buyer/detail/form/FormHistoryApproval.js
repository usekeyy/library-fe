import React from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../../helpers/formatDate';

const FormHistoryApproval = (props) => {
    const {data} = props;
    
    let rows;
    if (data.length > 0){
        rows = data.map((dt,i) => {
            return (
                <tr key={i}>
                    <td>{i+1}</td>
                    {/* <td>{dt.status_text}</td> */}
                    <td>{dt.nama || dt.created_by_name}</td>
                    <td>{dt.jabatan}</td>
                    <td>{formatDate(dt.tanggal_ttd || dt.updated_at)}</td>	
                </tr>
            )
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
                                    {/* <th>Process</th> */}
                                    <th>Nama</th>
                                    <th>Jabatan</th>
                                    <th>Date</th>
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

export default withTranslation() (FormHistoryApproval);