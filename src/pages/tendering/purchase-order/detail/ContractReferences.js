import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';

const animatedComponents = makeAnimated();

const ContractReferences = (props) => {
    const { purchase_order } = props.data
    const { t } = props;
	const { control, register } = useForm({});
    const thStyle = {
        width: '30%',
    };
    const onInputChangeDocumentType = (option, { action }) => {
		if (action === "input-change") {
			props.fetchDocumentType(option)
		}
		if (action === "set-value") {
			props.fetchDocumentType('')
		}
	};
	const handleChangeDocumentType = (e) => {
        props.setOption(e, 'tipe-po')
	}
    const onInputChangeIncoterm = (option, { action }) => {
		if (action === "input-change") {
			props.fetchIncoterms(option)
		}
		if (action === "set-value") {
			props.fetchIncoterms('')
		}
	};
	const handleChangeIncoterm = (e) => {
        props.setOption(e, 'incoterm-id')
	}
	const handleChangeIncotermDetail = (e) => {
        props.setOption(e.target.value, 'incoterm-detail')
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Contract References</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-3">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>No OA</th>
                                                    <td>{purchase_order.no_oa}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Vendor</th>
                                                    <td>{purchase_order.vendor_id} - {purchase_order.vendor_name}</td>
                                                </tr>
                                                {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by ?
                                                    <tr>
                                                        <th style={thStyle}>Incoterm <span className="text-danger">*</span></th>
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
                                                    </tr> : 
                                                    <tr>
                                                        <th style={thStyle}>Incoterm</th>
                                                        <td>{purchase_order.incoterm_id} - {purchase_order.incoterm_name}</td>
                                                    </tr>
                                                }
                                                {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by ?
                                                    <tr>
                                                        <th style={thStyle}>Deskripsi Incoterm <span className="text-danger">*</span></th>
                                                        <td>
                                                            <input type="text" onChange={(e) => handleChangeIncotermDetail(e)} name="incoterm_detail" ref={register({})} className="form-control" placeholder="" defaultValue={props.param_input.incoterm_detail} />
                                                        </td>
                                                        {/* <td>{outline_agreement.incoterm_name}</td> */}
                                                    </tr> :
                                                    <tr>
                                                        <th style={thStyle}>Deskripsi Incoterm</th>
                                                        <td>{purchase_order.incoterm_detail}</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Purch. Org</th>
                                                    <td>{purchase_order.purchasing_org_id} - {purchase_order.purchasing_org_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Purch. Group</th>
                                                    <td>{purchase_order.purchasing_group_id} - {purchase_order.purchasing_group_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Company</th>
                                                    <td>{purchase_order.company_id}</td>
                                                </tr>
                                                {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by ?
                                                    <tr>
                                                        <th style={thStyle}>Tipe PO <span className="text-danger">*</span></th>
                                                        <td>
                                                            <Controller
                                                                components={animatedComponents}
                                                                closeMenuOnSelect={true}
                                                                as={Select}
                                                                control={control}
                                                                options={props.m_document_type}
                                                                onInputChange={onInputChangeDocumentType}
                                                                onChange={([selected]) => {
                                                                    handleChangeDocumentType(selected)
                                                                    return selected;
                                                                }}
                                                                defaultValue={props.param_input.document_type_param}
                                                                inputRef={(e) => register({ name: "document_type", required: true })}
                                                                name="document_type"
                                                                placeholder={props.loadings.document_type ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                                isLoading={props.loadings.document_type}
                                                                rules={{ required: true }}
                                                            />
                                                        </td>
                                                        {/* <td>{outline_agreement.incoterm_id}</td> */}
                                                    </tr> : 
                                                    <tr>
                                                        <th style={thStyle}>Tipe PO</th>
                                                        <td>{purchase_order.tipe_po_id} - {purchase_order.tipe_po}</td>
                                                    </tr>
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Agreement Type</th>
                                                    <td>{purchase_order.agreement_type}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Agreement Date</th>
                                                    <td>{purchase_order.agreement_date !== null && purchase_order.agreement_date !== '' ? moment(purchase_order.agreement_date).format("DD-MM-YYYY") : ''}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Validity Start</th>
                                                    <td>{purchase_order.validity_start !== null && purchase_order.validity_start !== '' ? moment(purchase_order.validity_start).format("DD-MM-YYYY") : ''}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Validity end</th>
                                                    <td>{purchase_order.validity_end !== null && purchase_order.validity_end !== '' ? moment(purchase_order.validity_end).format("DD-MM-YYYY") : ''}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>Target Value</th>
                                                    <td align="right">{formatNumber(purchase_order.target_value, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Actual Value</th>
                                                    <td align="right">{formatNumber(purchase_order.actual_value, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Remaining Value</th>
                                                    <td align="right">{formatNumber(parseInt(purchase_order.target_value) - parseInt(purchase_order.actual_value), 2)}</td>
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
