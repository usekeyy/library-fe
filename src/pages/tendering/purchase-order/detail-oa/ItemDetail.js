import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row } from 'reactstrap';
// import { useFormContext } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { formatNumber } from '../../../../helpers/formatNumber';
import { withTranslation } from 'react-i18next';

const animatedComponents = makeAnimated();

const ItemDetail = (props) => {
    const [accAssgCategory, setAccAssgCategory] = React.useState((props.data_item.account_assignment_category[0].account_assignment === undefined) ? null : props.data_item.account_assignment);
    const { account_assignment_category } = props.data_item
    const { t } = props;  
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
	const { control, register, handleSubmit } = useForm({});
    let rows;

	const onSubmitAdditionalCost = async data => {
		props.saveAdditionalCost(data);
	};	

	const onSubmitItem = async data => {
		props.updateItemDetail(data);
	};	

	const onSubmitAccountAssignment = async data => {
		props.updateAccountAssignment(setData(data));
	};	

    const setData = (data) => {
        // console.log(data)
        let datas = {
            account_category_id: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.value,
            object_account: "",
            gl_account_id: (data.gl_account === undefined || data.gl_account === null) ? "" : data.gl_account.value,
            account_category_name: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.label.split(" - ")[1],
            // gl_account_name: (data.gl_account === undefined || data.gl_account === null) ? "" : data.gl_account.label.split(" - ")[1],
            asset_no: (data.asset_no === undefined) ? "" : data.asset_no.value,
            // asset_no_description: (data.asset_no === undefined) ? "" : data.asset_no.label.split(" - ")[1],
            wbs_element: (data.wbs_element === undefined) ? "" : data.wbs_element.value,
            // wbs_project_description: (data.wbs_element === undefined) ? "" : data.wbs_element.label.split(" - ")[1],
            cost_center_id: (data.cost_center === undefined) ? "" : data.cost_center.value,
            // cost_center_name: (data.cost_center === undefined) ? "" : data.cost_center.label.split(" - ")[1],
            network: "",
            order_no: "",
        }
        if (accAssgCategory === "F") {
            datas.order_no = data.order
            datas.network = ""
        } else if (accAssgCategory === "N") {
            datas.network = data.order
            datas.order_no = ""
        }
        // console.log(datas)
        return datas
    }

    const changeAccAssgCategory = (selected) => {
        // delete props.data_item.account_category_id
        if (selected !== null) {
            setAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setAccAssgCategory(null)
        }
    }

    const onInputAccAssgCategory = (option, { action }) => {
		if (action === "input-change") {
			props.fetchAccAssignmentCategory(option)
		}
		if (action === "set-value") {
			props.fetchAccAssignmentCategory('')
		}
    };

    const onInputChangeAsset = (option, { action }) => {
        if (action === "input-change") {
            props.fetchAssets(option)
        }
		if (action === "set-value") {
			props.fetchAssets('')
		}
    };

    const onInputChangeCostCenter = (option, { action }) => {
        if (action === "input-change") {
            props.fetchCostCenter(option)
        }
		if (action === "set-value") {
			props.fetchCostCenter('')
		}
    };

    const onInputChangeWbs = (option, { action }) => {
        if (action === "input-change") {
            props.fetchWbsProject(option)
        }
		if (action === "set-value") {
			props.fetchWbsProject('')
		}
    };

    const onInputChangeTax = (option, { action }) => {
		if (action === "input-change") {
			props.fetchTax(option)
		}
		if (action === "set-value") {
			props.fetchTax('')
		}
	};

    const onInputChangeConditionalType = (option, { action }) => {
		if (action === "input-change") {
			props.fetchConditionType(option)
		}
		if (action === "set-value") {
			props.fetchConditionType('')
		}
	};

    const onInputChangeGlAccount = (option, { action }) => {
		if (action === "input-change") {
			props.fetchGlAccount(option)
		}
		if (action === "set-value") {
			props.fetchGlAccount('')
		}
    };

    const onInputChangeVendor = (option, { action }) => {
		if (action === "input-change") {
			props.fetchVendor(option)
		}
		if (action === "set-value") {
			props.fetchVendor('')
		}
	};

    const onInputChangeUom = (option, { action }) => {
		if (action === "input-change") {
			props.fetchUom(option)
		}
		if (action === "set-value") {
			props.fetchUom('')
		}
	};

    // const onChangeDeliveryDate = (e) => {
    //     props.setDeliveryDate(e.target.value)
    // } 

    // const onChangeNote = (e) => {
    //     props.setNote(e.target.value)
    // } 

    const handleChangeTax = (e) => {
        props.setOptionDetail(e, 'tax')
    } 

    const handleChangeSpesifikasi = (e) => {
        props.setOptionDetail(e.target.value, 'spesifikasi')
    } 

    const handleChangeQtyOA = (e) => {
        props.setOptionDetail(e.target.value, 'qty-oa')
    } 

    const handleChangePriceOA = (e) => {
        props.setOptionDetail(e.target.value, 'price-oa')
    } 

    if (props.data !== undefined) {
        rows = props.data_item.item_detail.map(function (data, key) {
            return (
                <tr key={key}>
                    <td>{data.condition_type_id} - {data.condition_type_description}</td>
                    <td align="right">{formatNumber(data.amount,2)}</td>
                    <td>{data.uom_code} - {data.uom_name}</td>
                    <td align="right">{formatNumber(data.conditional_cost,2)}</td>
                    <td>{data.vendor_id} - {data.vendor_name}</td>
                    {props.data.created_by === props.user.uuid && props.data.status === 'd' && 
                        <td>
                            <button className="btn btn-xs btn-danger" value={data.uuid} onClick={(e) => props.toggleDelete(e, data.uuid, 'additional-cost')} ><i className="fa fa-trash"></i></button>
                        </td>
                    }
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>
                <Panel className="margin-bot-false">
                    <PanelHeader>Detail Item</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <th>No PR</th>
                                                <td>{props.data_item.purchasing_requisition_number}</td>
                                            </tr>
                                            <tr>
                                                <th>Jenis Item</th>
                                                <td>{props.data_item.tipe}</td>
                                            </tr>
                                            <tr>
                                                <th>Item</th>
                                                <td>{props.data_item.item_number} - {props.data_item.short_text}</td>
                                            </tr>
                                            {/* <tr>
                                                <th>Spesifikasi</th>
                                                <td>{props.data_item.spesifikasi}</td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label" style={{paddingTop: 0}}>Spesifikasi</label>
                                    <div className="col-lg-12">
                                        <textarea rows="4" disabled={props.data.status === 'd' && props.data.created_by === props.user.uuid ? false : true} className="form-control" name="spesifikasi" ref={register({ required: false })} onChange={(e) => handleChangeSpesifikasi(e)} defaultValue={props.param_item_detail.spesifikasi}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="table-responsive" style={{overflow: "visible"}}>
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <th style={{verticalAlign: 'middle'}}>Qty OA</th>
                                                {props.data.created_by === props.user.uuid && props.data.status === 'd' ?
                                                    <td style={{width: '20%'}}>
                                                        <input type="number" min="0" onChange={(e) => handleChangeQtyOA(e)} onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                                            className={"form-control"} name="qty_oa" ref={register({ required: false })} defaultValue={props.param_item_detail.qty_oa}/>
                                                    </td> :
                                                    <td align="right" style={{verticalAlign: 'middle'}}>{formatNumber(props.data_item.qty_oa, 2)}</td>
                                                }
                                                {/* <td>{props.data_item.qty_oa}</td> */}
                                                <th style={{verticalAlign: 'middle'}}>Unit Cost</th>
                                                <td align="right" style={{verticalAlign: 'middle'}}>{formatNumber(props.data_item.harga_satuan, 2)}</td>
                                            </tr>
                                            <tr>
                                                <th>Qty Used</th>
                                                <td align="right">{props.data_item.qty_used}</td>
                                                <th>Additional Cost</th>
                                                <td align="right">{formatNumber(props.data_item.additional_cost, 2)}</td>
                                            </tr>
                                            <tr>
                                                <th>Qty Open</th>
                                                <td align="right">{props.data_item.qty_open}</td>
                                                <th>Total Cost</th>
                                                <td align="right">{formatNumber(props.data_item.total, 2)}</td>
                                            </tr>
                                            <tr>
                                                <th style={{verticalAlign: 'middle'}}>UOM</th>
                                                <td style={{verticalAlign: 'middle'}}>{props.data_item.uom} - {props.data_item.uom_desc}</td>
                                                <th style={{verticalAlign: 'middle'}}>Price OA</th>
                                                {props.data.created_by === props.user.uuid && props.data.status === 'd' ?
                                                    <td style={{width: '30%'}}>
                                                        <input type="number" min="0" onChange={(e) => handleChangePriceOA(e)} onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                                            className={"form-control"} name="price" ref={register({ required: false })} defaultValue={props.param_item_detail.price}/>
                                                    </td> :
                                                    <td align="right" style={{verticalAlign: 'middle'}}>{formatNumber(props.data_item.price, 2)}</td>
                                                }
                                            </tr>
                                            <tr>
                                                <th style={{verticalAlign: 'middle'}}>Currency</th>
                                                <td style={{verticalAlign: 'middle'}}>{props.data_item.currency}</td>
                                                <th style={{verticalAlign: 'middle'}}>Tax <span className="text-danger">*</span></th>
                                                <td>
                                                    {props.data.status === 'd' && props.data.created_by === props.user.uuid ?
                                                        <div>
                                                            <Controller
                                                                components={animatedComponents}
                                                                closeMenuOnSelect={true}
                                                                as={Select}
                                                                control={control}
                                                                options={props.m_tax}
                                                                onInputChange={onInputChangeTax}
                                                                onChange={([selected]) => {
                                                                    handleChangeTax(selected)
                                                                    return selected;
                                                                }}
                                                                defaultValue={props.param_item_detail.tax_param}
                                                                inputRef={(e) => register({ name: "tax", required: false })}
                                                                name="tax"
                                                                placeholder={props.loadings.tax ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                                isLoading={props.loadings.tax}
                                                                rules={{ required: false }}
                                                            />
                                                        </div> : 
                                                        props.data_item.tax_description
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Item Text</label>
                                    <div className="col-lg-12">
                                        <textarea disabled={props.data.status === 'd' && props.data.created_by === props.user.uuid ? false : true} className="form-control" name="note" ref={register({ required: false })}/>
                                    </div>
                                </div>
                            </div> */}
                            
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Additional Cost</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                {props.data.created_by === props.user.uuid && props.data.status === 'd' && 
                                    <form onSubmit={handleSubmit(onSubmitAdditionalCost)}>
                                        <div className="col-sm-12 row" style={{marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                                            <div className="col-sm-3" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <label>Conditional Type</label>
                                                    <div>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            onInputChange={onInputChangeConditionalType}
                                                            options={props.m_type}
                                                            name="type"
                                                            placeholder={props.loadings.type ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                            isLoading={props.loadings.type}
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <label>Amount</label>
                                                    <div>
                                                        <input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                                            className={"form-control"} name="amount" ref={register({ required: false })}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-2" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <label>UOM</label>
                                                    <div>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_uom}
                                                            onInputChange={onInputChangeUom}
                                                            defaultValue={{value: props.data_item.uom, label: props.data_item.uom + ' - ' + props.data_item.uom_desc}}
                                                            // inputRef={(e) => register({ name: "vendor_id", required: false })}
                                                            name="uom_id"
                                                            placeholder={props.loadings.vendor_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                            isLoading={props.loadings.uom_id}
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <label>Vendor</label>
                                                    <div>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_vendor}
                                                            onInputChange={onInputChangeVendor}
                                                            defaultValue={{value: props.data_item.vendor_id, label: props.data_item.vendor_sap_code + ' - ' + props.data_item.vendor_name}}
                                                            // inputRef={(e) => register({ name: "vendor_id", required: false })}
                                                            name="vendor_id"
                                                            placeholder={props.loadings.vendor_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                                            isLoading={props.loadings.vendor_id}
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 row" style={{marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                                            <div className="col-sm-12" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-success pull-right"
                                                        type="submit"
                                                        // onClick={(e) => onClick(e)}
                                                        > Add </button>
                                                    <span className="text-danger pull-right" style={{paddingRight: "10px", paddingTop: "5px"}}>
                                                        {props.status_additional_cost.type && "* Mohon pilih data Conditional Type"}
                                                        {props.status_additional_cost.amount && "* Mohon isi data Amount"}
                                                        {/* {props.status_additional_cost.uom_id && "* Mohon pilih data UOM"} */}
                                                        {props.status_additional_cost.vendor_id && "* Mohon pilih data Vendor"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                }
                                <div className="table-responsive" style={{paddingTop: "10px"}}>
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Conditional Type</th>
                                                <th>Amount</th>
                                                <th>UOM</th>
                                                <th>Conditional Cost</th>
                                                <th>Vendor</th>
                                                {props.data.created_by === props.user.uuid && props.data.status === 'd' && 
                                                    <th>Action</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                    </table>
                                </div>
							</div>
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Account Assignment</PanelHeader>
                    <PanelBody >
                        <Row>
                            <div className="col-sm-12">
                                {props.data.created_by === props.user.uuid && props.data.status === 'd' && props.data_item.account_assignment[0].acc_assignment_category_id === 'U' &&
                                    <form onSubmit={handleSubmit(onSubmitAccountAssignment)}>
                                        <div className="col-sm-12 row" style={{marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                                            <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    {/* {props.data_item.account_assignment[0].acc_assignment_category_id === 'U' &&
                                                    } */}
                                                    <div>
                                                        <label >Account Assignment Category</label>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            onInputChange={onInputAccAssgCategory}
                                                            options={props.m_acc_assgn_category}
                                                            name="ass_category"
                                                            isLoading={props.loadings.acc_assgn_category}
                                                            onChange={([selected]) => {
                                                                changeAccAssgCategory(selected)
                                                                return selected
                                                            }}
                                                            // onChange={changeAccAssgCategory}
                                                            isClearable
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* {props.data_item.account_assignment[0].acc_assignment_category_id !== 'U' ?
                                                <div className="col-sm-4" style={{paddingLeft: '0px'}}></div> :
                                            } */}
                                            <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                                                {(accAssgCategory === "F" || accAssgCategory === "N") &&
                                                    <div className="form-group">
                                                        <label >Order</label>
                                                        <input type="text" disabled={(props.disableModal === true) ? true : false} name="order" ref={register({ required: false })} className="form-control" placeholder="" />
                                                    </div>
                                                }

                                                {accAssgCategory === "A" &&

                                                    <div className="form-group">
                                                        <label >Asset</label>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_asset}
                                                            name="asset_no"
                                                            isLoading={props.loadings.asset_id}
                                                            onInputChange={onInputChangeAsset}
                                                            isClearable
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                }

                                                {(accAssgCategory === "K") &&
                                                    <div className="form-group">
                                                        <label >Cost Center</label>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_cost_center}
                                                            name="cost_center"
                                                            isLoading={props.loadings.cost_center_id}
                                                            onInputChange={onInputChangeCostCenter}
                                                            isClearable
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                }

                                                {(accAssgCategory === "P" || accAssgCategory === "Q") &&
                                                    <div className="form-group">
                                                        <label >WBS Element </label>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_wbs_element}
                                                            name="wbs_element"
                                                            isLoading={props.loadings.wbs_element_id}
                                                            onInputChange={onInputChangeWbs}
                                                            isClearable
                                                            rules={{ required: false }}
                                                        />
                                                    </div>
                                                }

                                            </div>

                                            <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <label >GL Account</label>
                                                    <Controller
                                                        components={animatedComponents}
                                                        closeMenuOnSelect={true}
                                                        as={Select}
                                                        control={control}
                                                        onInputChange={onInputChangeGlAccount}
                                                        options={props.m_gl_account}
                                                        name="gl_account"
                                                        // defaultValue={props.data_item.gl_account}
                                                        isClearable
                                                        isLoading={props.loadings.gl_account_id}
                                                        rules={{ required: false }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 row" style={{marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                                            <div className="col-sm-12" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-success pull-right"
                                                        type="submit"
                                                        // onClick={(e) => onClick(e)}
                                                        > Update </button>
                                                    <span className="text-danger pull-right" style={{paddingRight: "10px", paddingTop: "5px"}}>
                                                        {props.status_acc_asgnment.acc_assgn_category && "* Mohon pilih data Account Asssignment Category (selain 'U')"}
                                                        {props.status_acc_asgnment.gl_account && "* Mohon pilih data GL Account"}
                                                        {props.status_acc_asgnment.asset && "* Mohon pilih data Asset"}
                                                        {props.status_acc_asgnment.cost_center && "* Mohon pilih data Cost Center"}
                                                        {props.status_acc_asgnment.wbs_element && "* Mohon pilih data WBS Element"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                }

                                <div className="table-responsive" style={{paddingTop: "10px"}}>
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Account Assignment Category</th>
                                                <th>{account_assignment_category[0].account_assignment_name !== null ? account_assignment_category[0].account_assignment_name : "Object"}</th>
                                                <th>GL Account</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                <tr>
                                                    <td>{account_assignment_category[0].account_assignment !== null && account_assignment_category[0].account_assignment + " - " + account_assignment_category[0].account_assignment_name}</td>
                                                    <td>{account_assignment_category[0].account_assignment_number !== null && account_assignment_category[0].account_assignment_number}</td>
                                                    <td>{account_assignment_category[0].gl_account !== null && account_assignment_category[0].gl_account}</td>
                                                </tr>
										</tbody>
                                    </table>
                                </div>
                            </div>
                        </Row>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
            <form onSubmit={handleSubmit(onSubmitItem)}>
                <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                    {props.status_detail_item.qty_oa && "* Mohon Pilih Qty OA"}
                    {props.status_detail_item.price && "* Mohon Pilih Price OA"}
                    {props.status_detail_item.tax && "* Mohon Pilih Tax"}
                </span>
                {props.data.created_by === props.user.uuid && props.data.status === 'd' && 
                    <button className="btn btn-success" type="submit">{t("costCenter:button.update")}</button>
                }
				<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ItemDetail);
