import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
// import { statusName } from '../../../../../helpers/statusName';
import { formatDate } from '../../../../../helpers/formatDate';

const Schedule = (props) => {
    // const { t } = props;
    const {schedules} = props.parentState.vendor_registration_tender;
    const setStatus = (data) => {
        let mulai = new Date(`${data.start_date} ${data.start_time}`)
        let berhenti = new Date(`${data.end_date} ${data.end_time}`)
        // let sekarang = new Date();
        let sekarang = new Date(localStorage.getItem('times'));

        if (berhenti < sekarang){
            return "Done"
        }else{
            if (mulai > sekarang){
                return "Waiting"
            }else{
                return "Process"
            }
        }

    }
		
    let rows;
    if (schedules.length > 0) {
        rows = schedules.map((item, key) => {
            return (
                <tr key={key}>
                    <td>{item.jadwal_tender_name}</td>
                    <td>{formatDate(item.start_date)}</td>
                    <td>{item.start_time}</td>
                    <td>{formatDate(item.end_date)}</td>
                    <td>{item.end_time}</td>
                    <td>{item.start_date && setStatus(item)}</td>
                </tr>
            )
        });
    } else {
			rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Jadwal Tender</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Process</th>
                                            <th>Start Date</th>
                                            <th>Start Time</th>
                                            <th>End Date</th>
                                            <th>End Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Schedule);
