import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import ReactLoading from 'react-loading';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Header = (props) => {
    // const { t } = props;
		const { register, control, getValues } = useFormContext();
		const {header} = props.parentState.purchasing_requisition;
		const {errors} = props.parentState.purchasing_requisition;
		const {uuid} = props.parentState;
		const {loading} = props.parentState.purchasing_requisition;
		const {master} = props.parentState;

		const submitHeader = (e) => {
			e.preventDefault();
			const sendObj = {
				number: getValues('number'),
				document_type: getValues('document_type')?.value,
				description: getValues('header_text'),
			}
			props.saveHeader(sendObj);
		}

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
												<Controller
													components={animatedComponents}
													as={Select}
													control={control}
													name="document_type" 
													defaultValue={(uuid !== "") ? {value: header.document_type, label: `${header.document_type}`} : ''}
													options={master.document_type} 
													isDisabled={props.parentState.addItem}
												/>
										</div>
								</div>

								<div className="form-group row">
										<label className="col-sm-2 col-form-label">Header Text</label>
										<div className="col-sm-10">
												<textarea readOnly={props.parentState.addItem} className={(errors.description) ? "form-control is-invalid" : "form-control"} rows="4" name="header_text" ref={register({})}  defaultValue={(uuid !== "") ? header.description : ''} />
												{errors.description && <span className="text-danger">{errors.description[0]}</span>}
										</div>
								</div>
							</Col>
							<Col sm="12">
								<div className="pull-right m-t-5 m-b-5">
									<div>
										{!props.parentState.addItem && <button type="button" onClick={(e) => submitHeader(e)} className="btn btn-success m-r-5" disabled={false}> Submit </button>}
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