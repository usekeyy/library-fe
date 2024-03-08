import React from 'react';
import { withTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';

const Attachment = (props) => {
    // const { t } = props;
		const {attachments} = props.parentState.quotation;
		// const [loading, setLoading] = React.useState(false)
		const loading = false;

		let rows_attactment;
    if (attachments.length > 0) {
        rows_attactment = attachments.map((dt, i) => {
						const row_attachments = <tr key={i}>
																			<td>{i + 1}</td>
																			<td>{dt.type}</td>
																			<td>{dt.description}</td>
																			<td>
																				{(dt.file !== "") ? <a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}` } > {dt.file} </a> : dt.file }
																			</td>
																		</tr>
						return (parseInt(dt.share) === 0) ? null : row_attachments
        })
    } else {
        rows_attactment = (<RowEmpty colSpan='4'>Tidak ada data</RowEmpty>);
		}

    return (
			<div>
				<Panel>
					<PanelHeader>Dokumen Pengadaan</PanelHeader>
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
												<th>Tipe Lampiran</th>
												<th>Description</th>
												<th>File</th>
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