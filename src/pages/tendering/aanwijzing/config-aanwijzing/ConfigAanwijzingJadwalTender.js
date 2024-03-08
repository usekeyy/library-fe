import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';

const JadwalTender = (props) => {
    // const { t } = props;
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{props.data[key]['jadwal_tender_name']}</td>
                    <td>{props.data[key]['start_date']}</td>
                    <td>{props.data[key]['start_time']}</td>
                    <td>{props.data[key]['end_date']}</td>
                    <td>{props.data[key]['end_time']}</td>
                    <td>
                        <button className="btn btn-sm btn-white" onClick={(e)=> details(e,key)}>
                            Edit
                        </button>
                    </td>
                </tr>
            )
        });
    }

    const details = (e, data) => {
        props.openEditJadwal(data)
        e.preventDefault()
    }

    const histori = (e) => {
        props.fetchJadwalTender()
        e.preventDefault()
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
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <button className="pull-right btn btn-sm btn-white"  onClick={(e) => histori(e)}>
                                History
                            </button>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(JadwalTender);
