import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import {toastr} from 'react-redux-toastr';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';

const PersyaratanVendor = (props) => {
    // const { t } = props;
    const [loading, setLoading] = React.useState(false)
    let rows;

    const changeFile = (e, data) => {
        setLoading(!loading);
        if (e.target.files[0]){
            // console.log(e, e.target.files[0])
            // console.log(data)
            props.upload('PQPT01', e.target.files[0])
            .then((resp) => {
                data['file'] = resp.data.data.name
                data['vendor_uuid'] = props.data_user_vendor.uuid
                props.save(data)
                setLoading(false);
                // setTdpFileName(resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                // setTdpFileName('')
                // setValue("file_name", '')
                toastr.error(err.data.message, err.data.status)
            })    
        }else{
            setLoading(false);
        }
    }

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        window.open(url, "_blank")
    }

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['syarat_description']}</td>
                    <td>
                        {props.data[key]['syarat_file'] !== null && 
                            ( props.data[key]['syarat_tipe'] === '1' ? 
                                <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${props.data[key]['syarat_file']}`} > lampiran.pdf </a>
                                :
                                <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data[key]['syarat_file']}`} > lampiran.pdf </a>                                
                            )
                        }
                    </td>
                    <td>
                        {props.data[key]['syarat_file_config'] !== null &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data[key]['syarat_file_config'] )} disabled={loading}>
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-download"}></i> Download
                            </button>
                        }
                        {props.data[key]['flag_upload'] === 'y' &&
                            <label className="custom-file-upload" style={{marginBottom:"0px"}}>
                                <input type="file" name="file" onChange={e => changeFile(e, props.data[key])} disabled={loading} />
                                <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> Upload
                            </label>
                        }
                    </td>
                </tr>
            )
        });
    }

    // const save = (e, data) => {
	// 	props.save(data)
    //     e.preventDefault()
	// }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Persyaratan</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Description</th>
                                            <th>File</th>
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

export default withTranslation()(PersyaratanVendor);
