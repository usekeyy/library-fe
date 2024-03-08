import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from 'react-loading';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';

const Edoc = (props) => {
    // const { t } = props;
		// const { register } = useFormContext();
		const { t } = props;
		const {edoc} = props.parentState.proposal_tender;
		// const {header} = props.parentState.proposal_tender;
		// const {attachments} = props.parentState.proposal_tender;
		// const {uuid} = props.parentState;
		const {errors} = props.parentState.proposal_tender;
		const {loadings} = props.parentState;
		let rows;

		const handleEdit = (e, id) => {
			e.preventDefault()
			props.editEdoc(id)
		}

		const handleDelete = (e, id) => {
			e.preventDefault()
			props.deleteEdoc(id)
		}
		
		const handleShowEdoc = (e) => {
			e.preventDefault()
			props.modalsEdoc();
		}
		
		if (edoc.length > 0) {
				rows = edoc.map((dt, i) => {
						return (
								<tr key={i}>
										<td>{dt.title}</td>
										<td>{dt.created_by}</td>
										<td>{dt.created_at}</td>
										<td>
											{
												<div>
													<button className="btn btn-xs btn-warning" onClick={(e) => handleEdit(e,i)} disabled={props.parentState.loadings.button}> 
														{props.parentState.loadings.button ? 
														<i className="fa fa-spinner fa-spin"></i>
														: <i className="danger fa fa-edit"></i>} 
													</button>
													<button className="btn btn-xs btn-danger" onClick={(e) => handleDelete(e,i)} disabled={props.parentState.loadings.button}> 
														{props.parentState.loadings.button ?
														<i className="fa fa-spinner fa-spin"></i>
														: <i className="danger fa fa-trash"></i>} 
													</button>
												</div>
											}
										</td>
								</tr>
						)
				})
		} else {
			if(loadings.showItems){
				rows = (<RowEmpty colSpan='4'><i className="fas fa-spinner fa-pulse"></i>Loading</RowEmpty>);
			} else {
				rows = (<RowEmpty colSpan='4'>Tidak ada data</RowEmpty>);
			}
		}
				
    return (
			<div>
				<Panel>
					<PanelHeader>E-Document Aanwijzing</PanelHeader>
					{(loadings.edoc) && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{(!loadings.edoc) &&
					<PanelBody >
						{errors.edoc && <p className="text-danger"> * {errors.edoc[0]} </p>}
						<div className="row">
							<div className="col-sm-12">
									<div className="m-b-10">
											<button className="btn btn-primary btn-xs" onClick={(e) => handleShowEdoc(e)}>
											<i className={"fa fa-plus"} /> {t('Button.Tambah')} </button>
									</div>
									<div className="table-responsive">
											<table className="table table-bordered table-striped table-sm text-nowrap">
													<thead>
															<tr>
																	<th>Title</th>
																	<th>Created By</th>
																	<th>Created At</th>
																	<th>Action</th>
															</tr>
													</thead>
													<tbody>{rows}</tbody>
											</table>
									</div>
							</div>
						</div>
					</PanelBody>}
				</Panel>
			</div>
    );
}

export default withTranslation()(Edoc);