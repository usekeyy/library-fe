import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import ReactLoading from 'react-loading';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import {formatNumber} from '../../../../helpers/formatNumber';

const HistoryApproval = (props) => {
        
    // const {bid_administrasi,bid_comersil,data} = props.data
    const data = [
    //     {
    //         proses : 'DUR',
    //     },
    //     {
    //         proses : 'Awarding',
    //     }
    ] 

    props.pq === 'Active' && props.pq_status === 'y' && data.splice(0, 0, {proses : 'Prakualifikasi'})
    props.status_dur === "approved" && data.push({proses: 'DUR'});
    props.status_awarding === "approved" && data.push({proses: 'Awarding'});


    let rows = data.map((item,index) => {
        return (
            <tr key={index}>
                <td>{index+1}</td>
                <td>{item.proses}</td>
                <td><button className="btn btn-sm btn-default" onClick={e => props.modal(item.proses,"history_approval")}>Detail</button></td>
            </tr>
        )
    })
 
    return (
			<div>
				<Panel>
					<PanelHeader>List Approval</PanelHeader>
					
					<PanelBody >
						<div className="row">
							<div className="col-sm-12">
                                <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Proses</th>
                                                    <th>Action</th>													
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

export default withTranslation()(HistoryApproval);