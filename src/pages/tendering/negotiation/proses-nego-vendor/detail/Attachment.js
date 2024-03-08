import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { toastr } from 'react-redux-toastr';

const Attachment = (props) => {
    const { t } = props;
		const {documents} = props.parentState.proses_nego_vendor;
		const {vendor_documents} = props.parentState.proses_nego_vendor;
		const {dataTemp} = props.parentState.proses_nego_vendor;
		const err = props.parentState.proses_nego_vendor.errors;
		// const {tempData} = props.parentState;
		// const {paramType} = props.parentState;
		const {loadings} = props.parentState;
		const [loading, setLoading] = React.useState(false)
		// const [loadingQuote, setLoadingQuote] = React.useState(false)
		const { register, setValue } = useFormContext();
		const [filelampiran, setFilelampiran] = React.useState('')
		// const [validFileLampiran, setValidFileLampiran] = React.useState(false)
		const validFileLampiran = false
		// const vendor_documents = (vendor_documents) ? vendor_documents.length > 0 ? vendor_documents : [] : [];
		React.useEffect(() => {
			if(vendor_documents.length > 0 && filelampiran === ''){
				getQuotesData()
			}
		});

		const getQuotesData = () => {
			let newArr = [...filelampiran]; 
			if(vendor_documents.length > 0){
				vendor_documents.forEach((item, i) => {
					newArr[i] = ''; 
					setFilelampiran(newArr);
				})
			}
		}

		const changeFile = (e, i) => {
			e.preventDefault()
			if (e.target.files[0] !== undefined) {
				setLoading(true);
				props.upload('VNNEGO', e.target.files[0])
				.then((resp) => {
						setLoading(false);
						let newArr = [...filelampiran]; 
						newArr[i] = resp.data.data.name; 
						setFilelampiran(newArr);
						setValue(`documents[${i}].file`, resp.data.data.name)
				})
				.catch((err) => {
						setLoading(false);
						setFilelampiran('');
						let newArr = [...filelampiran]; 
						newArr[i] = ''; 
						setFilelampiran(newArr);
						setValue(`documents[${i}].file`, '')
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

		// let show = true;
		let rows_attactment;
    if (documents.length > 0) {
			rows_attactment = documents.map((dt, i) => {
				const vendor_doc = (vendor_documents.length > 0) ? vendor_documents.filter( i => i.negotiation_doc_id === dt.id) : [];
				const vendor_doc_name = vendor_doc.length > 0 ? vendor_doc[0].file !== null ? vendor_doc[0].file : '' : '';
				
            return (
                <tr key={i}>
									<td>{i + 1}</td>
									<td>{dt.description}</td>
									<td>
										{<input type="text" className={validFileLampiran ? "form-control is-invalid" : "form-control"} name={`documents[${i}].file`} ref={register({ required: false })} disabled={true} defaultValue={filelampiran[i] === '' ? vendor_doc_name : filelampiran[i]} />}
										{<input type="hidden" className={"form-control"} name={`documents[${i}].negotiation_doc_id`} ref={register({ required: false })} disabled={true} defaultValue={dt.id} />}
										{err[`documents.${i}.file`] && <span className="text-danger"> {err[`documents.${i}.file`][0]} </span>}
										{/* {errors.documents && errors.documents[i] !== undefined && <span className="text-danger"> Dokumen Ini Mandatory * </span>} */}
									</td>
									<td>
										{dataTemp.current === props.parentState.isRole && (dataTemp.status === 'nego' || dataTemp.status_nego === 'rejected') && !props.parentState.detailNego && 
											<label className="custom-file-upload">
												<input type="file" name={`terms[${i}].files`} ref={register({ required: false })} onChange={(e) => changeFile(e, i)} />
												<i className={loading || loadings.buttonUpload ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading || loadings.buttonUpload} />  {t('Label.Unggah')}
											</label>}
											{ vendor_doc.length > 0 && vendor_doc_name !== '' &&
												<button className="custom-file-upload btn btn-primary" onClick={e => downloadLampiran(e, process.env.REACT_APP_API_BASE_URL+'files/tendering/' + vendor_doc_name )}>
														<i className="fa fa-download"></i> Preview
												</button>
											}
											{dt.file !== null && <button type="button" className="btn btn-info m-l-10"  onClick={e => downloadLampiran(e, `${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` )}><i className="fa fa-file"></i></button>}
									</td>
                </tr>
            )
        })
    } else {
        rows_attactment = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
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

export default withTranslation()(Attachment);