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
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

const animatedComponents = makeAnimated();

const ItemDetail = (props) => {
    const [accAssgCategory, setAccAssgCategory] = React.useState((props.data_item.account_assignment[0].acc_assignment_category_id === undefined) ? null : props.data_item.acc_assignment_category_id);
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
            // props.changeAccAssgCategory(selected.value)
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

	const handleChangeTax = (e) => {
		props.setTax(e)
	}

    const onChangeDeliveryDate = (e) => {
        const date = formattingDate(e)
        props.setDeliveryDate(date)
    } 

    const formattingDate = (e) => {
        let d = new Date(e),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const onChangeNote = (e) => {
        props.setNote(e.target.value)
    } 

    const onChangeSpesifikasi = (e) => {
        props.setSpesifikasi(e.target.value)
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
                    {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && 
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
                                                <td>{props.data_item.jenis_item}</td>
                                            </tr>
                                            <tr>
                                                <th>Item</th>
                                                <td>{props.data_item.item_no} - {props.data_item.description}</td>
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
                                        <textarea rows="4" disabled={(props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data.created_by === props.user.uuid ? false : true} className="form-control" name="spesifikasi" ref={register({ required: false })} onChange={(e) => onChangeSpesifikasi(e)} defaultValue={props.value_temp.spesifikasi}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="table-responsive" style={{overflow: "visible"}}>
                                    <table className="table table-bordered table-striped table-sm text-nowrap">
                                        <tbody>
                                            <tr>
                                                <th>Qty</th>
                                                <td align="right">{props.data_item.qty}</td>
                                                <th>UOM</th>
                                                <td>{props.data_item.uom} - {props.data_item.uom_desc}</td>
                                            </tr>
                                            <tr>
                                                <th>Unit Cost</th>
                                                <td align="right">{formatNumber(props.data_item.harga_satuan, 2)}</td>
                                                <th>Currency</th>
                                                <td>{props.data_item.currency}</td>
                                            </tr>
                                            <tr>
                                                <th>Additional Cost</th>
                                                <td align="right">{formatNumber(props.data_item.additional_cost, 2)}</td>
                                                <th>Delivery Date <span className="text-danger">*</span></th>
                                                <td>
                                                    {(props.data.status === 'd' || props.data.status === 'r' || props.data.status === 'c') && props.data.created_by === props.user.uuid ?
                                                        <Datetime
                                                            value={props.value_temp.delivery_date !== undefined && props.value_temp.delivery_date !== '' && props.value_temp.delivery_date !== null ? moment(props.value_temp.delivery_date).format("DD-MM-YYYY") : ''}
                                                            onChange={onChangeDeliveryDate}
                                                            closeOnSelect={true}
                                                            name="delivery_date"
                                                            dateFormat="DD-MM-YYYY"
                                                            timeFormat={false}
                                                            inputProps={{ placeholder: "Delivery Date" }}
                                                        /> :
                                                        (props.data_item.delivery_date !== null && props.data_item.delivery_date !== '' ? moment(props.data_item.delivery_date).format("DD-MM-YYYY") : '')
                                                    }

                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Total Cost</th>
                                                <td align="right">{formatNumber(props.data_item.total, 2)}</td>
                                                <th>Tax <span className="text-danger">*</span></th>
                                                <td>
                                                    {/* {(props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data.created_by === props.user.uuid ? */}
                                                    {(props.data.status === 'd' || props.data.status === 'r' || props.data.status === 'c') && props.data.created_by === props.user.uuid ?
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
                                                                defaultValue={props.value_temp.tax}
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
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="col-form-label">Item Text</label>
                                    <div className="col-lg-12">
                                        <textarea disabled={(props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data.created_by === props.user.uuid ? false : true} className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChangeNote(e)} defaultValue={props.value_temp.note}/>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </PanelBody>
                </Panel>
                <Panel className="margin-bot-false">
                    <PanelHeader>Additional Cost</PanelHeader>
                    <PanelBody >
                        <div className="row">
                            <div className="col-sm-12">
                                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && 
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
                                                            defaultValue={{value: props.data_item.uom_id, label: props.data_item.uom + ' - ' + props.data_item.uom_desc}}
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
                                                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && 
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
                                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data_item.account_assignment[0].acc_assignment_category_id === 'U' &&
                                    <form onSubmit={handleSubmit(onSubmitAccountAssignment)}>
                                        <div className="col-sm-12 row" style={{marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                                            <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                                                <div className="form-group">
                                                    <div>
                                                        <label >Account Assignment Category</label>
                                                        <Controller
                                                            components={animatedComponents}
                                                            closeMenuOnSelect={true}
                                                            as={Select}
                                                            control={control}
                                                            options={props.m_acc_assgn_category}
                                                            name="ass_category"
                                                            isLoading={props.loadings.acc_assgn_category}
                                                            onInputChange={onInputAccAssgCategory}
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

                                                {accAssgCategory === "K" &&
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
                                                        options={props.m_gl_account}
                                                        onInputChange={onInputChangeGlAccount}
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
                                                <th>{props.data_item.account_assignment.length > 0 ? (props.data_item.account_assignment[0].acc_assignment_category_name !== null ? props.data_item.account_assignment[0].acc_assignment_category_name : 'Object') : "Object"}</th>
                                                <th>GL Account</th>
                                                {/* {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data_item.account_assignment[0].acc_assignment_category_id === 'U' &&
                                                    <th>Action</th>
                                                } */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                                <tr>
                                                    <td>{props.data_item.account_assignment[0].acc_assignment_category_id !== null && props.data_item.account_assignment[0].acc_assignment_category_id + " - " + props.data_item.account_assignment[0].acc_assignment_category_name}</td>
                                                    <td>{props.data_item.account_assignment[0].acc_assignment_category_number !== null && props.data_item.account_assignment[0].acc_assignment_category_number}</td>
                                                    <td>{props.data_item.account_assignment[0].gl_account !== null && props.data_item.account_assignment[0].gl_account}</td>
                                                    {/* {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && props.data_item.account_assignment[0].acc_assignment_category_id === 'U' &&
                                                        <td>
                                                            <button className="btn btn-xs btn-danger" onClick={(e) => props.toggleDelete(e, '', 'account-assignment')} ><i className="fa fa-trash"></i></button>
                                                        </td>
                                                    } */}
                                                </tr>
										</tbody>
                                    </table>
                                    {/* {props.status_account_assignmment && (props.data.status === 'd' || props.data.status === 'r' || (props.data.status === 'c' && props.data.sap_number === null)) && 
                                        <span className="text-danger">
                                            *Wajib melengkapi Account Assignment sebelum submit PO
                                        </span>
                                    } */}
                                </div>
                            </div>
                        </Row>
                    </PanelBody>
                </Panel>
            </ModalBody>
            <ModalFooter>
            <form onSubmit={handleSubmit(onSubmitItem)}>
                <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                    {props.status_detail_item.delivery_date && "* Mohon pilih Delivery Date"}
                    {props.status_detail_item.tax && "* Mohon Pilih Tax"}
                </span>
                {props.data.created_by === props.user.uuid && (props.data.status === 'd' || props.data.status === 'r' || props.data.status === 'c') && 
                    <button className="btn btn-success" type="submit">{t("costCenter:button.update")}</button>
                }
				<button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ItemDetail);
