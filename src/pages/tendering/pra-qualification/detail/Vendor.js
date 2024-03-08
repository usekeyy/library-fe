import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import { statusName } from '../../../../helpers/statusName';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
// import ReactLoading from 'react-loading';
// import { toastr } from 'react-redux-toastr';
// const animatedComponents = makeAnimated();

const Vendor = (props) => {
    // const { t } = props;
    let rows;

    const details = (e, data) => {
		props.modals(data)
        e.preventDefault()
	}

    if (props.data_vendor !== undefined) {
        rows = Object.keys(props.data_vendor).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data_vendor[key]['sap_number']}</td>
                    <td>{props.data_vendor[key]['vendor_id']}</td>
                    <td>{props.data_vendor[key]['vendor_name']}</td>
                    <td>{props.data_vendor[key]['vendor_status']}</td>
                    <td>{props.data_vendor[key]['created_at']}</td>
                    <td>{props.data_vendor[key]['evaluasi_vendor']}</td>  
                    <td>
                        <button className="btn btn-xs btn-white" onClick={(e) => details(e, props.data_vendor[key])}>Evaluasi</button>
                    </td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Vendor Pra Qualification</PanelHeader>
                <PanelBody >
                    <div className="row m-t-10">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap" style={{width: "40%"}} align="left">
                                    <tbody>
                                        <tr>
                                            <td>Jumlah Pendaftar</td>
                                            <td>{props.data !== undefined ? props.data.jumlah_pendaftar : '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>Jumlah Lolos</td>
                                            <td>{props.data !== undefined ? props.data.jumlah_lolos : '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>{props.data !== undefined ? props.data.status : '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No SAP</th>
                                            <th>Nomor Vendor</th>
                                            <th>Nama Vendor</th>
                                            <th>Status</th>
                                            <th>Tanggal Quotation</th>
                                            <th>Evaluasi</th>
                                            <th>Action</th>
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

export default withTranslation()(Vendor);
