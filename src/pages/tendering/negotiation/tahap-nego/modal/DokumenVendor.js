import React from 'react';
// import { useFormContext } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const DokumenVendor = (props) => {
    const { t } = props;  
    let rows;
    let rows_nego;

    if (props.data_lampiran !== undefined && props.data_lampiran.length > 0) {
        rows = Object.keys(props.data_lampiran).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data_lampiran[key]['description']}</td>
                    <td>
                        {props.data_lampiran[key]['file'] !== null && props.data_lampiran[key]['file'] !== '' &&
                            <button className="custom-file-upload" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + props.data_lampiran[key]['file'] )}>
                                <i className="fa fa-download"></i> Preview
                            </button>
                        }
                    </td>
                </tr>
            )
        });
    }

    if (props.documents && props.documents.length > 0) {
				rows_nego = props.documents.map((dt, index) => {
					const vendor_doc = (props.vendor_documents.length > 0) ? props.vendor_documents.filter( i => i.negotiation_doc_id === dt.id) : [];
					const vendor_doc_name = vendor_doc.length > 0 ? vendor_doc[0].file !== null ? vendor_doc[0].file : '' : '';
            return (
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{dt.description}</td>
                    <td>
											{ vendor_doc.length > 0 && vendor_doc_name !== '' &&
												<button className="custom-file-upload btn btn-primary" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + vendor_doc_name )}>
														<i className="fa fa-download"></i> Preview
												</button>
											}
                        {dt.file !== null && dt.file !== '' &&
                            <button className="btn btn-info m-l-10" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + dt.file )}>
                                <i className="fa fa-file"></i>
                            </button>
                        }
                    </td>
                </tr>
            )
        });
    }

    const downloadLampiran = (e, url) => {
        e.preventDefault()
        console.log(url)
        window.open(url, "_blank")
    }

    return (
        <div>
					<ModalBody>
						<Panel className="margin-bot-false">
								<PanelBody >
										<div className="row">
												<div className="col-sm-12">
														<div className="table-responsive">
																<table className="table table-bordered table-sm text-nowrap">
																		<tbody>
																				<tr>
																						<td><b>No Vendor</b></td>
																						<td>{props.data.vendor_id}</td>
																				</tr>
																				<tr>
																						<td><b>Nama Vendor</b></td>
																						<td>{props.data.vendor_name}</td>
																				</tr>
																		</tbody>
																</table>
														</div>
												</div>
										</div>
								</PanelBody>
								<PanelHeader>Dokumen Quotation</PanelHeader>
								{props.loading_lampiran && (
										<center>
										<br />
										<ReactLoading type="cylon" color="#0f9e3e" />
										<br />
										</center>
								)}
								{props.loading_lampiran === false && (
									<PanelBody >
											<div className="row">
													<div className="col-sm-12">
															<div className="table-responsive">
																	<table className="table table-bordered table-striped table-sm text-nowrap">
																			<thead>
																					<tr>
																							<th style={{widht:"1%"}}>No</th>
																							<th>Description</th>
																							<th>File</th>
																					</tr>
																			</thead>
																			<tbody>{rows}</tbody>
																	</table>
															</div>
													</div>
											</div>
									</PanelBody>
								)}
								<PanelHeader>Dokumen Negotiation</PanelHeader>
								{props.loading_lampiran && (
										<center>
										<br />
										<ReactLoading type="cylon" color="#0f9e3e" />
										<br />
										</center>
								)}
								{props.loading_lampiran === false && (
									<PanelBody >
											<div className="row">
													<div className="col-sm-12">
															<div className="table-responsive">
																	<table className="table table-bordered table-striped table-sm text-nowrap">
																			<thead>
																					<tr>
																							<th style={{widht:"1%"}}>No</th>
																							<th>Description</th>
																							<th>File</th>
																					</tr>
																			</thead>
																			<tbody>{rows_nego}</tbody>
																	</table>
															</div>
													</div>
											</div>
									</PanelBody>
								)}
						</Panel>
					</ModalBody>
					<ModalFooter>
							<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
					</ModalFooter>
        </div>
    );
}

export default withTranslation()(DokumenVendor);
