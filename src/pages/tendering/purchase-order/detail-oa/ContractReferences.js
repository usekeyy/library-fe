import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const ContractReferences = (props) => {
    const { t } = props;
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const { control, register } = useForm({});
    const thStyle = {
        width: '30%',
        verticalAlign: 'middle'
    };

	const handleChangeAgreementDate = (e) => {
        props.setOption(e.target.value, 'agreement-date')
	}
	const handleChangeValidityStart = (e) => {
        props.setOption(e.target.value, 'validity-start')
	}
    const handleChangeValidityEnd = (e) => {
        props.setOption(e.target.value, 'validity-end')
	}
	const handleChangeAgreementType = (e) => {
        props.setOption(e, 'agreement-type')
	}
	const handleChangeIncoterm = (e) => {
        props.setOption(e, 'incoterm-id')
	}
	const handleChangeIncotermDetail = (e) => {
        props.setOption(e.target.value, 'incoterm-detail')
	}
	const handleChangeTargetValue = (e) => {
        props.setOption(e.target.value, 'target-value')
	}

    const onInputChangeAgreementType = (option, { action }) => {
		if (action === "input-change") {
			props.fetchDocumentType(option)
		}
		if (action === "set-value") {
			props.fetchDocumentType('')
		}
	};
    const onInputChangeIncoterm = (option, { action }) => {
		if (action === "input-change") {
			props.fetchIncoterms(option)
		}
		if (action === "set-value") {
			props.fetchIncoterms('')
		}
	};
    const { outline_agreement } = props.data

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header Detail</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-3">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Purch. Org</th>
                                                    <td>{outline_agreement.purchasing_org_id} - {outline_agreement.purchasing_org_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Purch. Group</th>
                                                    <td>{outline_agreement.purchasing_group_id} - {outline_agreement.purchasing_group_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Company</th>
                                                    <td>{outline_agreement.company_id} - {outline_agreement.company_name}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {props.data.created_by === props.user.uuid && props.data.status === 'd' ?
                                    <div className="col-md-3">
                                        <div className="table-responsive" style={{overflow: "visible"}}>
                                            <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                <tbody>
                                                    <tr>
                                                        <th style={thStyle}>Agreement Type</th>
                                                        <td>
                                                            <Controller
                                                                components={animatedComponents}
                                                                closeMenuOnSelect={true}
                                                                as={Select}
                                                                control={control}
                                                                options={props.m_agreement_type}
                                                                onInputChange={onInputChangeAgreementType}
                                                                onChange={([selected]) => {
                                                                    handleChangeAgreementType(selected)
                                                                    return selected;
                                                                }}
                                                                defaultValue={props.param_input.agreement_type_param}
                                                                inputRef={(e) => register({ name: "agreement_type", required: true })}
                                                                name="agreement_type"
                                                                placeholder={props.loadings.agreement_type ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                                isLoading={props.loadings.agreement_type}
                                                                rules={{ required: true }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Agreement Date</th>
                                                        <td>
                                                            <input type="date" data-date-format="DD/MM/YYYY" name="agreement_date" onChange={(e) => handleChangeAgreementDate(e)} className="form-control" required defaultValue={props.param_input.agreement_date}/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Validity Start</th>
                                                        <td>
                                                            <input type="date" data-date-format="DD/MM/YYYY" name="validity_start" onChange={(e) => handleChangeValidityStart(e)} className="form-control" required defaultValue={props.param_input.validity_start}/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Validity end</th>
                                                        <td>
                                                            <input type="date" data-date-format="DD/MM/YYYY" name="validity_end" onChange={(e) => handleChangeValidityEnd(e)} className="form-control" required defaultValue={props.param_input.validity_end}/>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div> :
                                    <div className="col-md-3">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                <tbody>
                                                    <tr>
                                                        <th style={thStyle}>Agreement Type</th>
                                                        <td>{outline_agreement.agreement_type + ' - ' + outline_agreement.agreement_type_description}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Agreement Date</th>
                                                        <td>
                                                            {outline_agreement.agreement_date !== null && outline_agreement.agreement_date !== '' && moment(outline_agreement.agreement_date).format("DD-MM-YYYY")}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Validity Start</th>
                                                        <td>
                                                            {outline_agreement.validity_start !== null && outline_agreement.validity_start !== '' && moment(outline_agreement.validity_start).format("DD-MM-YYYY")}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Validity end</th>
                                                        <td>
                                                            {outline_agreement.validity_end !== null && outline_agreement.validity_end !== '' && moment(outline_agreement.validity_end).format("DD-MM-YYYY")}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                                {props.data.created_by === props.user.uuid && props.data.status === 'd' ?
                                    <div className="col-md-3">
                                        <div className="table-responsive" style={{overflow: "visible"}}>
                                            <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                <tbody>
                                                    <tr>
                                                        <th style={thStyle}>Incoterm</th>
                                                        <td>
                                                            <Controller
                                                                components={animatedComponents}
                                                                closeMenuOnSelect={true}
                                                                as={Select}
                                                                control={control}
                                                                options={props.m_incoterm}
                                                                onInputChange={onInputChangeIncoterm}
                                                                onChange={([selected]) => {
                                                                    handleChangeIncoterm(selected)
                                                                    return selected;
                                                                }}
                                                                defaultValue={props.param_input.incoterm_param}
                                                                inputRef={(e) => register({ name: "incoterm", required: true })}
                                                                name="incoterm"
                                                                placeholder={props.loadings.incoterm ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                                isLoading={props.loadings.incoterm}
                                                                rules={{ required: true }}
                                                            />
                                                        </td>
                                                        {/* <td>{outline_agreement.incoterm_id}</td> */}
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Incoterm Detail</th>
                                                        <td>
                                                            <input type="text" onChange={(e) => handleChangeIncotermDetail(e)} name="incoterm_detail" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.incoterm_detail} />
                                                        </td>
                                                        {/* <td>{outline_agreement.incoterm_name}</td> */}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div> :
                                    <div className="col-md-3">
                                        <div className="table-responsive" style={{overflow: "visible"}}>
                                            <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                                <tbody>
                                                    <tr>
                                                        <th style={thStyle}>Incoterm</th>
                                                        <td>{outline_agreement.incoterm_id !== null && outline_agreement.incoterm_id !== '' && outline_agreement.incoterm_id} - {outline_agreement.incoterm_name}</td>
                                                        {/* <td>{outline_agreement.incoterm_id}</td> */}
                                                    </tr>
                                                    <tr>
                                                        <th style={thStyle}>Incoterm Detail</th>
                                                        <td>{outline_agreement.incoterm_detail}</td>
                                                        {/* <td>{outline_agreement.incoterm_name}</td> */}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                                <div className="col-md-3">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-wrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Target Value</th>
                                                    {props.data.created_by === props.user.uuid && props.data.status === 'd' ?
                                                        <td>
                                                            <input type="number" min="0" onChange={(e) => handleChangeTargetValue(e)} onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                                                className={"form-control"} name="target_value" ref={register({ required: true })} defaultValue={props.param_input.target_value}/>
                                                        </td> :
                                                        <td align="right">{formatNumber(outline_agreement.target_value, 2)}</td>
                                                    }
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Actual Value</th>
                                                    <td align="right">{formatNumber(outline_agreement.actual_value, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Remaining Value</th>
                                                    <td align="right">{formatNumber(outline_agreement.remaining_value, 2)}</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ContractReferences);
