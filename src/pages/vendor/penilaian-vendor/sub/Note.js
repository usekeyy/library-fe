import React from 'react';
import { useFormContext} from 'react-hook-form';
import { Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
// import FileUploadInformation from '../../../../components/upload/FileUploadInformation';
// import { toastr } from 'react-redux-toastr';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
import { Col } from 'reactstrap/lib';
import { formatDate } from '../../../../helpers/formatDate';
import { statusHistoryVpr } from '../../../../helpers/statusName';

// const animatedComponents = makeAnimated();

const Note = (props) => {
	// const {t} = props;
	const { register } = useFormContext();
	return (
		<div style={{marginBottom : "-20px"}}>
            <Panel loading={false}>
                <PanelHeader>
                    Notes / Catatan
                </PanelHeader>
                <PanelBody loading={false}>
                    <Row>
                        <Col sm="12">
                            <table className="table table-bordered justify-content-center">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Note</th>
                                        <th>date</th>
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.data?.note?.map((item,index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{statusHistoryVpr(item.status)}</td>
                                            <td>{item.note}</td>
                                            <td>{formatDate(item.updated_at,2)}</td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="form-group row m-b-15">
                                <label className="col-md-12 col-form-label">Note</label>
                                <div className="col-md-12">
                                    {/* <input type="text" className={(errors.number) ? "form-control is-invalid" : "form-control"} name="number" ref={register({ required: false })} defaultValue={sendData.number} placeholder="" disabled={props.has_verification.status_vendor !== 'partner' ? props.isVendor === false && has_draft_verification && (props.parentState.verification.verifyAll !== undefined ? props.parentState.verification.verifyAll === true : sendData.tipe_verifikasi === 'sudah_diverifikasi') : props.isVendor === false && has_draft_verification} />
                                    {errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>} */}
                                    <textarea className={"form-control"} name="note" ref={register({ required: false })} />
                                    {/* {errors_response.number && <span className="text-danger"> {errors_response.number[0]} </span>} */}
                                </div>
                            </div>
                        </Col>
                    </Row>

                </PanelBody>

            </Panel>
      
		</div>
	);
}

export default  withTranslation() (Note);