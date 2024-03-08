import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';

const ConfigEdoc = (props) => {
    let rows
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['title']}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{formatDate(props.data[key]['created_at'], false) }</td>
                    <td>
                        <button className="btn btn-xs btn-warning" onClick={(e) => openModal(e, index )}><i className="fa fa-edit"></i></button>
                        {props.data[key]['uuid']==="" &&
                            <button className="btn btn-xs btn-danger" onClick={(e) => removeData(e, index )}><i className="fa fa-trash"></i></button>
                        }
                    </td>
                </tr>
            )
        });
    }

    const openModal = (e, data) => {
        props.modalEdoc(data)
        e.preventDefault()
    }
    const removeData = (e, data) => {
        props.removeEdoc(data)
        e.preventDefault()
    }
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>E-Document</PanelHeader>
                <PanelBody >
                {/* Add Button */}
                {/* <div className="row">
                    <div className="col-sm-12">
                        <button className="btn btn-sm btn-primary pull-right" onClick={()=>props.addEdoc()}> <i className="fa fa-plus"></i>
                            Add 
                        </button>
                    </div>
                </div> */}
                {/* End Add Button */}
                <div className="row m-t-10">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Title</th>
                                            <th>Create By </th>
                                            <th>Create At</th>
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

export default withTranslation()(ConfigEdoc);
