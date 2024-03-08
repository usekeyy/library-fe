import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import moment from 'moment';
import ReactLoading from "react-loading";

const ListProgress = (props) => {
    // const { t } = props;
    // const [loading] = React.useState(false)

    let rows;

    const modalProgress = (e, uuid, type) => {
		props.modalProgress(uuid, type)
        e.preventDefault()
	}

    // const details = (e, data) => {
    //     console.log(data)
	// 	// props.modal_item(data)
    //     e.preventDefault()
	// }

    if (props.data_progress !== undefined) {
        rows = Object.keys(props.data_progress).map(function (key, index) {
            return (
                <tr key={key}>
                    {/* <td>{index+1}</td> */}
                    <td>{props.data_progress[key]['number']}</td>
                    <td>{props.data_progress[key]['progress_date'] !== null && props.data_progress[key]['progress_date'] !== '' ? moment(props.data_progress[key]['progress_date']).format("DD-MM-YYYY") : ''}</td>
                    <td>{props.data_progress[key]['description']}</td>
                    <td>{props.data_progress[key]['planning']}</td>
                    <td>{props.data_progress[key]['realitation']}</td>
                    {((props.is_vendor && props.user_vendor.id === props.data.purchase_order.vendor_id) || props.user.uuid === props.data.created_by) ?
                        <td>
                            <button className="btn btn-xs btn-success" onClick={(e) => modalProgress(e, props.data_progress[key]['uuid'], 'detail')} ><i className="fa fa-eye"></i></button>
                            <span> </span>
                            {/* <button className="btn btn-xs btn-warning" onClick={(e) => modalProgress(e, props.data_progress[key]['uuid'], 'edit')} ><i className="fa fa-edit"></i></button>
                            <span> </span>
                            <button className="btn btn-xs btn-danger" onClick={(e) => props.toggleDelete(e, props.data_progress[key]['uuid'], 'progress')} ><i className="fa fa-trash"></i></button>
                            <span> </span> */}
                            <button className="btn btn-xs btn-success" onClick={(e) => modalProgress(e, props.data_progress[key]['uuid'], 'progress-log')} ><i className="fa fa-list"></i></button>
                        </td> : <td></td>
                    }
                </tr>
            )
        });
    }

    return (
        <div>
            {props.loading_progress && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loading_progress === false && (
                <Panel className="margin-bot-false">
                    <PanelHeader>List Progress</PanelHeader>
                    <PanelBody >
                        {/* {props.is_vendor && props.user_vendor.id === props.data.vendor_id &&
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group row">
                                        <div className="col-sm-12">
                                            <button className="btn btn-success" onClick={(e) => modalProgress(e, '', 'create')} >Input Progress</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        } */}
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>No Expediting</th>
                                                <th>Tanggal Input</th>
                                                <th>Deskripsi</th>
                                                <th>Planning (%)</th>
                                                <th>Realisasi (%)</th>
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
            )}
        </div>
    );
}

export default withTranslation()(ListProgress);
