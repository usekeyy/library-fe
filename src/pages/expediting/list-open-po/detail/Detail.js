import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Detail = (props) => {
    const { purchase_order } = props.data
    const { t } = props;
	const { control, register } = useForm({});
    const thStyle = {
        width: '30%',
    };
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
                <PanelHeader>Purchase Order</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="form-group row">
                                <div className="col-md-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <th style={thStyle}>No. Tender</th>
                                                    <td>
                                                        <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}tendering/monitoring-tender-buyer/detail/${purchase_order.proposal_tender_uuid}`} >{purchase_order.proposal_tender_number}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Judul Tender</th>
                                                    <td>{purchase_order.proposal_tender_title}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>Vendor</th>
                                                    <td>{purchase_order.vendor_id} - {purchase_order.vendor_name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={thStyle}>No Quotation</th>
                                                    <td>{purchase_order.quotation_number}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="table-responsive" style={{overflow: "visible"}}>
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
                                                    <th style={thStyle}>Tipe PO</th>
                                                    <td>{purchase_order.tipe_po}</td>
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
                            </div>
                        </Col>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Detail);