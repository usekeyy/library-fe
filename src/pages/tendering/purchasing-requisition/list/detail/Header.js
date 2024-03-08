import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
import {statusName} from '../../../../../helpers/statusName';

const Header = (props) => {
    // const { t } = props;
		const { register } = useFormContext();
		const {header} = props.parentState.purchasing_requisition;
		const {errors} = props.parentState.purchasing_requisition;
		const {uuid} = props.parentState;
		const {loading} = props.parentState.purchasing_requisition;

    return (
			<div>
				<Panel>
					<PanelHeader>Header</PanelHeader>
					{loading && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
					{!loading &&
					<PanelBody>
						<Row>
							<Col sm="12">
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">No PR</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="number" ref={register({})} className="form-control" placeholder="" defaultValue={(uuid !== "") ? header.number : ''} />
										</div>
								</div>
								
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Document Type</label>
										<div className="col-sm-10">
												<input type="text" readOnly={true} name="document_type" ref={register({})} className="form-control" placeholder="" defaultValue={(uuid !== "") ? header.document_type : ''} />
										</div>
								</div>

								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Header Text</label>
										<div className="col-sm-10">
												<textarea readOnly={true} className={(errors.description) ? "form-control is-invalid" : "form-control"} rows="4" name="description" ref={register({})}  defaultValue={(uuid !== "" && header.description!==null) ? header.description.replace(/;/g, "\n"): ''} />
												{errors.description && <span className="text-danger">{errors.description[0]}</span>}
										</div>
								</div>
								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Status</label>
										<div className="col-sm-10 m-t-5">
												{uuid !== "" ? statusName(header.status) : 'Active'}
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

export default withTranslation()(Header);