import React from 'react';
// import { useFormContext} from 'react-hook-form';
import {Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import FileUploadInformation from '../../../../../components/upload/FileUploadInformation';
// import { toastr } from 'react-redux-toastr';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { Col } from 'reactstrap/lib';

// const animatedComponents = makeAnimated();

const Attachment = (props) => {
	const {data} = props;
	// const { register } = useFormContext();
	return (
		<div>
            <Panel loading={false}>
                <PanelHeader>
                    Attachment
                </PanelHeader>
                <PanelBody loading={false}>
                    <Row>
                        <Col sm="12">
                            {props?.accessCreate && (props?.statusText === 'Open' || props?.statusText === 'Rejected') &&
                            <div className="pull-right m-b-15">
                                <button className="btn-sm btn-success" onClick={(e) => props.setModalOpen("attachment",e)}>Tambah Attachment</button>
                            </div>
                            }
                            <table className="table table-bordered justify-content-center">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Deskripsi</th>
                                        <th>File</th>
                                        {props?.isRequestor && (props?.statusText === 'Open' || props?.statusText === 'Rejected') && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item,index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.description}</td>
                                            <td><a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/vendor/${item.file}` } >{item.file}</a></td>
                                            {props?.accessCreate && (props?.statusText === 'Open' || props?.statusText === 'Rejected') && <td><button className="btn-sm btn-danger " type="button" onClick={(e) => props.delete(e,item.uuid)}><i className="fa fa-trash"></i></button></td>}
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </Col>
                    </Row>

                </PanelBody>

            </Panel>
      
		</div>
	);
}

export default  withTranslation() (Attachment);