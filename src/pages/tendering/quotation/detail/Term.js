import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { toastr } from 'react-redux-toastr';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation';


const Term = (props) => {
    const { t } = props;
		const {terms, header} = props.parentState.quotation;
		const {tempData} = props.parentState;
		// const {paramType} = props.parentState;
		const {loadings} = props.parentState;
		const [loading, setLoading] = React.useState(false)
		const { register, setValue } = useFormContext();
		const [filelampiran, setFilelampiran] = React.useState('')
		// const [validFileLampiran, setValidFileLampiran] = React.useState(false)
		const getItems = Object.keys(tempData).length > 0 ? tempData.terms : [];
		// const quotesData = paramType === 'update' ? getItems : [];
		const validFileLampiran = false

		React.useEffect(() => {
			if(getItems.length > 0 && filelampiran === ''){
				getQuotesData()
			}
		});

		const getQuotesData = () => {
			let newArr = [...filelampiran]; 
			if(getItems.length > 0){
				getItems.forEach((item, i) => {
					newArr[i] = ''; 
					setFilelampiran(newArr);
				})
			}
		}

		const changeFile = (e, i) => {
			e.preventDefault()
			if (e.target.files[0] !== undefined) {
				setLoading(true);
				props.upload('QDOC01', e.target.files[0])
				.then((resp) => {
						setLoading(false);
						let newArr = [...filelampiran]; 
						newArr[i] = resp.data.data.name; 
						setFilelampiran(newArr);
						setValue(`terms[${i}].file`, resp.data.data.name)
				})
				.catch((err) => {
						setLoading(false);
						setFilelampiran('');
						let newArr = [...filelampiran]; 
						newArr[i] = ''; 
						setFilelampiran(newArr);
						setValue(`terms[${i}].file`, '')
						toastr.error(err.data.message, err.data.errors.file[0])
				})
			} else {
					setValue('file', '')
			}
		}

		const downloadLampiran = (e, url) => {
			e.preventDefault()
			window.open(url, "_blank")
		}

		let rows_attactment;
    if (terms.length > 0) {
			rows_attactment = terms.map((dt, i) => {
				const vendor_doc = getItems.length > 0 ? getItems.filter(i => i.proposal_tender_syarat_id === dt.id) : [];
				const vendor_doc_name = vendor_doc.length > 0 ? vendor_doc[0].file !== null ? vendor_doc[0].file : '' : '';
				const showAttachment = dt.tipe === "4" ?  ((header.metode_penyampaian_id==='2t' && header.current_step===2 && vendor_doc_name !=='') ? false : (dt.attachment === "1")) : (header.metode_penyampaian_id==='2t' && header.current_step===2 && vendor_doc_name !=='') ? false : true
				
            return (
                <tr key={i}>
									<td>{i + 1}</td>
									<td>{dt.description + " "} {dt.attachment==="1" &&  <span className="text-danger">*</span> }</td>
									<td>
										{<input type="text" className={validFileLampiran ? "form-control is-invalid" : "form-control"} name={`attachments[${i}].file`} ref={register({ required: false })} disabled={true} defaultValue={(header.metode_penyampaian_id==='2t' && header.current_step===2 && vendor_doc_name !=='') ? vendor_doc_name : filelampiran[i] === '' ? vendor_doc_name : filelampiran[i]} />}
										{<input type="hidden" className={"form-control"} name={`attachments[${i}].proposal_tender_syarat_id`} ref={register({ required: false })} disabled={true} defaultValue={dt.id} />}
									</td>
									<td>
										<center>
											{ showAttachment && 
												<React.Fragment>
													<label className="custom-file-upload">
														<input type="file" name={`terms[${i}].files`} ref={register({required: false})} onChange={(e) => changeFile(e, i)}/>
														<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload}/> {t('Label.Unggah')}
													</label>
												</React.Fragment>
											}
											{ vendor_doc.length > 0 && vendor_doc[0].file !== null &&
												<button className="custom-file-upload btn btn-primary" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + vendor_doc_name )}>
														<i className="fa fa-download"></i> Preview
												</button>
											}
											{ showAttachment && <FileUploadInformation idFileUpload="QDOC01" />}
										</center>
									</td>
                </tr>
            )
        })
    } else {
        rows_attactment = (<RowEmpty colSpan='4'>Tidak ada data</RowEmpty>);
		}

    return (
			<div>
				<Panel className="margin-bot-false">
					<PanelHeader>Dokumen Penawaran</PanelHeader>
					{loading === 'xxx' && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{
					<PanelBody>
					<Row>
					<Col sm="12">		
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
										<tbody>{rows_attactment}</tbody>
									</table>
								</div>
							</div>
						</div>
						</Col>
					</Row>
				</PanelBody>
				}
			</Panel>
		</div>
    );
}

export default withTranslation()(Term);