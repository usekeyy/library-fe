import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';

const ConfigAanwijzingHeader = (props) => {
    // const { t } = props;
	// const { register } = useFormContext();
		
    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					{/* {loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading && */}
					<PanelBody>
						<Row>
							<Col sm="12">
							<div className="form-group row">
										<label className="col-sm-2 col-form-label">Created by</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="created_by_name" className="form-control" placeholder="" defaultValue={props.data.created_by_name}/>
												{/* {errors.created_by_name && <span className="text-danger">{errors.created_by_name[0]}</span>} */}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No Proposal Tender</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" className="form-control" placeholder="" defaultValue={props.data.number} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Referensi</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="reference" className="form-control" placeholder="" defaultValue={props.data.reference} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Judul Proposal Tender</label>
										<div className="col-sm-10">
                                        <input type="text" readOnly={true} name="created_by_name" className="form-control" placeholder="" defaultValue={props.data.title}/>
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Nilai Tender</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="reference" className="form-control" placeholder="" defaultValue={formatNumber(props.data.total_value,2)} />
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Status</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="reference" className="form-control" placeholder="" defaultValue="Aanwijzing" />
										</div>
								</div>
							</Col>
						</Row>
					</PanelBody>
					{/* } */}
				</Panel>
			</div>
    );
}

export default withTranslation()(ConfigAanwijzingHeader);