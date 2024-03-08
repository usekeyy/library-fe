import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { toastr } from 'react-redux-toastr';
import ReactLoading from 'react-loading';
import { formatNumber } from '../../../../helpers/formatNumber';
import FileUploadInformation from '../../../../components/upload/FileUploadInformation'



const animatedComponents = makeAnimated();

const MsrForm = (props) => {
    const { register, handleSubmit, errors, control, setValue } = useForm({});
    const [loading, setLoading] = React.useState(false)
    const [tipelampiran, setTipelampiran] = React.useState()
    const [deskripsilampiran, setDeskripsilampiran] = React.useState()
    const [filelampiran, setFilelampiran] = React.useState()
    const [assign_to, setAssign_to] = React.useState("")
    const [status, setStatus] = React.useState("")
    const { t } = props;
    const onSubmit = data => {
        props.savePayload(setData(data))
    };

    const setData = (data) => {
        let datas = {
            uuid: props.uuid,
            description: data.description,
            number: data.number,
            work_unit_id: props.user.work_unit_id,
            assign_to: (data.assign_to === undefined || data.assign_to === null || data.assign_to === "") ? "" : data.assign_to.value,
            priority: (data.priority === undefined || data.priority === null || data.priority === "") ? "" : data.priority.value,
            currency_id: (data.currency_id === undefined || data.currency_id === null || data.currency_id === "") ? "" : data.currency_id.value, //data.currency_id ,
            status: status
        }
        return datas
    }

    const changeFile = (e) => {
        if (e.target.files[0] !== undefined) {
            setLoading(!loading);
            props.upload('MSR001', e.target.files[0])
                .then((resp) => {
                    setLoading(false);
                    setValue("file", resp.data.data.name)
                    setFilelampiran(resp.data.data.name);
                })
                .catch((err) => {
                    setLoading(false);
                    setFilelampiran('');
                    setValue("file", '')
                    toastr.error(err.data.message, err.data.errors.file[0])
                })
                setValue("files", '')
        } else {
            setValue('file', '')
        }
    }

    const changeAssignTo = (e) => {
        if (e[0] !== null) {
            setAssign_to(e[0].value)
        } else {
            setAssign_to("")
        }
    }

    const rejectActions = (e) => {
        // props.approveReject({'status' : 'r'})
        props.ConfirmSweetAlert({ 'status': 'r' })
        e.preventDefault()
    }

    const approveActions = (e) => {
        // props.approveReject({'status' : 'm'})
        props.ConfirmSweetAlert({ 'status': 'm' })
        e.preventDefault()
    }

    const rejectAssgnment = (e) => {
        props.ConfirmSweetAlert({ 'status': 'r' })
        e.preventDefault()
    }

    const submitActions = (e) => {
        // data.status="s";
        setStatus("a")
    }

    const draftActions = (e) => {
        setStatus("d")
    }

    const submitAssgnment = (e) => {
        props.assingTo({
            'specific_planner_id': assign_to,
            'status': 's'
        })
        e.preventDefault()
    }

    const changeTipeLampiran = (e) => {
        if (e[0] !== null) {
            setTipelampiran(e[0].value)
        }
    }

    const changeDeskripsiLampiran = (e) => {
        setDeskripsilampiran(e.target.value)
    }

    const handleClick = (e) => {
        if (deskripsilampiran === undefined || deskripsilampiran === "" || tipelampiran === undefined || tipelampiran === "" || filelampiran === undefined || filelampiran === "") {
            toastr.warning("Field Diperlukan", "Mohon lengkapi data Tipe Lampiran, Deskripsi dan File")
            e.preventDefault()
        } else {
            props.saveAttacment({
                description: (deskripsilampiran === undefined) ? "" : deskripsilampiran,
                type: (tipelampiran === undefined) ? "" : tipelampiran,
                file: (filelampiran === undefined) ? "" : filelampiran,
                uuid: ""
            })
            setTipelampiran('')
            setDeskripsilampiran('')
            setFilelampiran('')
            setValue("file", '')
            setValue("attactment_description", '')
            setValue("attactment_type", '')
            e.preventDefault();
        }

    }

    const handleChangeCurrencies = (selected) => {
        props.getCurrency(selected)
    }

    const handleDeleteLampiran = (id, e) => {
        props.deleteLampiran(id)
        e.preventDefault()
    }

    const handleShowItem = (data, e) => {
        props.modalShow(data)
        e.preventDefault()
    }

    const handleDeleteItems = (id, e) => {
        props.deleteItems(id)
        e.preventDefault()
    }

    let rows;
    let arr = [];
    let items = props.items;
    for (const [key, value] of Object.entries(items)) {
        var obj = {
            no: key,
            delivery_date: value.delivery_date,
            incoterm_description: value.incoterm_description,
            incoterm_id: value.incoterm_id,
            item_category_id: value.item_category_id,
            item_description: value.item_description,
            item_id: value.item_id,
            item_type: value.item_type,
            material_service_request_id: value.material_service_request_id,
            mrp_controller_id: value.mrp_controller_id,
            per: value.per,
            plant_id: value.plant_id,
            plant_name: value.plant_name,
            purchasing_group_id: value.purchasing_group_id,
            purchasing_org_id: value.purchasing_org_id,
            qty: value.qty,
            storage_location_id: value.storage_location_id,
            unit_price: value.unit_price,
            uom_id: value.uom_id,
            uom_code: value.uom_code,
        }
        arr.push(obj)
    }

    if (arr.length > 0) {
        let Total = 0;
        rows = arr.map((dt, i) => {
            Total += dt.unit_price * (dt.qty/dt.per)
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.item_id}</td>
                    <td>{dt.item_description}</td>
                    <td>{dt.plant_name}</td>
                    <td>{formatNumber(dt.qty,2)}</td>
                    <td>{dt.uom_code}</td>
                    <td>{dt.per}</td>
                    <td align="right">{formatNumber(dt.unit_price,2)}</td>
                    <td align="right">{formatNumber(dt.unit_price * (dt.qty/dt.per),2)}</td>
                    <td>
                       
                       {(props.data.created_uuid!==props.user.uuid || (props.data.created_uuid===props.user.uuid && (props.data.status !== "d" && props.data.status !== "r"))) && props.uuid !== "" &&
                            <button className="btn btn-xs btn-lime" onClick={(e) => handleShowItem(i, e)} value={dt.no} >
                            <i className="danger fa fa-eye"></i>
                            </button>
                        }

                        {(props.user.has_roles.includes("REQ001") && ((props.data.status === "d" || props.data.status === "r") || props.data.status === "")) && (props.data.created_uuid===props.user.uuid || props.data.created_uuid===undefined) &&
                            <div>
                                <button className="btn btn-xs btn-warning" onClick={(e) => handleShowItem(i, e)} value={dt.no} ><i className="fa fa-edit"></i></button>
                                <button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteItems(dt.no, e)} value={dt.no} ><i className="danger fa fa-trash"></i></button>
                            </div>
                        }


                    </td>
                </tr>
            )
        })

        rows.push(
            <tr key={arr.length + 1}>
                <td colSpan="8">Total Harga</td>
                <td align="right">{formatNumber(Total,2)}</td>
                <td></td>
            </tr>
        )
    } else {
        rows = (<RowEmpty colSpan='10'>Tidak ada data</RowEmpty>);
    }

    let rows_attactment;
    let arr_attactment = [];
    let items_attactment = props.attachment;
    for (const [key, value] of Object.entries(items_attactment)) {
        var objs = {
            no: key,
            description: value.description,
            type: value.type,
            file: value.file,
            uuid: value.uuid,
        }
        arr_attactment.push(objs)
    }

    if (arr_attactment.length > 0) {
        rows_attactment = arr_attactment.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.type}</td>
                    <td>{dt.description}</td>
                    <td>{(dt.uuid !== "") ? <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${dt.file}`} > {dt.file} </a> : <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/temp/${dt.file}`} > {dt.file} </a>}</td>
                    <td>
                        {(props.user.has_roles.includes("REQ001") && ((props.data.status === "d" || props.data.status === "r") || props.data.status === "") && (props.data.created_uuid===props.user.uuid || props.data.status===""))   &&
                            <button className="btn btn-xs btn-danger" onClick={(e) => handleDeleteLampiran(dt.no, e)} value={dt.no} ><i className="danger fa fa-trash"></i></button>}
                    </td>
                </tr>
            )
        })
    } else {
        rows_attactment = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} name="forms">
                <Panel >
                    <PanelHeader>
                        Header
                    </PanelHeader>
                    {props.pageload && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
                    {!props.pageload &&
                        <PanelBody >
                            <Row>
                                <Col sm="12">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Created by</label>
                                        <div className="col-sm-9">
                                            <input type="text" disabled name="created_by" ref={register({})} className="form-control" placeholder="" defaultValue={(props.uuid !== "") ? props.data.created_by : props.user.name} />
                                            {props.errors.created_by && <span className="text-danger">{props.errors.created_by[0]}</span>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">unit</label>
                                        <div className="col-sm-9">
                                            <input type="text" disabled name="work_unit_id" ref={register({})} className="form-control" placeholder="" defaultValue={(props.uuid !== "") ? props.data.unit_name : props.user.work_unit_name} />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Paket No</label>
                                        <div className="col-sm-9">
                                            <input type="text" disabled name="number" ref={register({})} className="form-control" placeholder="" defaultValue={(props.uuid !== "") ? props.data.paket_number : ''} />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Description {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>}</label>
                                        <div className="col-sm-9">
                                            <input type="text" 
                                            disabled={((props.data.status==="" || props.data.status==="d" || props.data.status==="r") && (props.data.created_uuid===props.user.uuid || props.data.status==="")) ? false : true}
                                            name="description" ref={register({})} className="form-control" placeholder="" defaultValue={(props.uuid !== "") ? props.data.description : ''} />
                                            {props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Assign To {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>} </label>
                                        <div className="col-sm-9">
                                            {/* <input type="text" name="assign_to" ref={register({ })} className="form-control" placeholder="" /> */}
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                // styles={props.errors.type ? customStyles : {}}
                                                control={control}
                                                defaultValue={props.data.assign_to}
                                                options={props.optionsGeneralPlanner}
                                                // onInputChange={props.handleInputChange}
                                                name="assign_to"
                                                isClearable
                                                isDisabled={((props.data.status==="" || props.data.status==="d" || props.data.status==="r") && (props.data.created_uuid===props.user.uuid || props.data.status==="")) ? false : true}
                                            // isLoading={props.isLoading.general_planner}
                                            // isDisabled={props.isVendor === false}
                                            />
                                            {props.errors.assign_to && <span className="text-danger">{props.errors.assign_to[0]}</span>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Priority {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>} </label>
                                        <div className="col-sm-9">
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                // styles={props.errors.type ? customStyles : {}}
                                                control={control}
                                                options={props.optionsPrioritas}
                                                // onInputChange={props.handleInputChange}
                                                name="priority"
                                                defaultValue={(props.uuid !== "") ? props.data.priority : ''}
                                                isClearable
                                                isLoading={props.isLoading.priority}

                                                isDisabled={((props.data.status==="" || props.data.status==="d" || props.data.status==="r") && (props.data.created_uuid===props.user.uuid || props.data.status==="")) ? false : true}
                                            />
                                            {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                                            {props.errors.priority && <span className="text-danger"> {props.errors.priority[0]}  </span>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Curency {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>}</label>
                                        <div className="col-sm-9">
                                            {/* <input type="text" name="currency_id" ref={register({ })} className="form-control" placeholder="" /> */}

                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                // styles={props.errors.type ? customStyles : {}}
                                                control={control}
                                                options={props.optionsCurrency}
                                                onInputChange={handleChangeCurrencies}
                                                name="currency_id"
                                                defaultValue={(props.uuid !== "") ? props.data.currency : ''}
                                                isClearable
                                                isLoading={props.isLoading.currency}
                                                isDisabled={((props.data.status==="" || props.data.status==="d" || props.data.status==="r") && (props.data.created_uuid===props.user.uuid || props.data.status==="")) ? false : true}
                                            // isDisabled={props.isVendor === false}
                                            />
                                            {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                                            {props.errors.currency_id && <span className="text-danger"> {props.errors.currency_id[0]}  </span>}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Status</label>
                                        <div className="col-sm-9 m-t-5">
                                            {props.uuid !== "" ? props.data.status_text : 'Active'}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </PanelBody>
                    }
                </Panel>

                <Panel >
                    <PanelHeader>
                        Items
                    </PanelHeader>

                    {props.pageload && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
                    {!props.pageload &&
                        <PanelBody >

                            {(props.user.has_roles.includes("REQ001") && ((props.data.status === "d" || props.data.status === "r") || props.data.status === "")) && (props.data.created_uuid===props.user.uuid || props.data.created_uuid===undefined) &&
                                <div className="row">

                                    <div className="col-sm-12">
                                        <div className="pull-right m-t-10 m-b-10">
                                            <Button color="primary" className="btn btn-sm btn-primary" value='' onClick={props.modalOpen} >{t("company:button.add")}</Button>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row">


                                {props.errors.items && <span className="text-danger"> {props.errors.items[0]}  </span>}
                                {(props.error_items && !props.errors.items) &&
                                    <ul>
                                        {props.error_items.map((data) => <li> <span className="text-danger"> {data.item + " Baris " + data.baris + " : " + data.desc_error}  </span> </li>)}
                                    </ul>
                                }
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped table-sm">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>No Material</th>
                                                    <th>Description</th>
                                                    <th>Plant</th>
                                                    <th>QTY</th>
                                                    <th>Uom</th>
                                                    <th>Per</th>
                                                    <th align="center">Harga Satuan</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </PanelBody>
                    }
                </Panel>

                <Panel >
                    <PanelHeader>
                        Lampiran
                    </PanelHeader>
                    {props.pageload && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
                    {!props.pageload &&
                        <PanelBody >
                            <Row>
                                {props.errors.attachment &&
                                    <ul>
                                        {props.attachment.map((data) => <li> <span className="text-danger"> {data[0]}  </span> </li>)}
                                    </ul>
                                }
                                <Col sm="12">
                                    {props.user.has_roles.includes("REQ001") &&
                                        <div>
                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">Tipe Lampiran {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>}</label>
                                                <div className="col-sm-10">
                                                    <Controller
                                                        components={animatedComponents}
                                                        closeMenuOnSelect={true}
                                                        as={Select}
                                                        // styles={props.errors.type ? customStyles : {}}
                                                        control={control}
                                                        options={props.optionsTipeLampiran}
                                                        // onInputChange={props.handleInputChange}
                                                        name="attactment_type"
                                                        // defaultValue={props.data.priority}
                                                        isClearable
                                                        onChange={changeTipeLampiran}
                                                    // ref="attactment_type"
                                                    // isDisabled={props.isVendor === false}
                                                    />
                                                    {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                                                    {/* {props.errors.type && <span className="text-danger"> {props.errors.type[0]}  </span>} */}
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">Description {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>}</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control" name="attactment_description" ref={register({ required: false })}
                                                        onChange={changeDeskripsiLampiran}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">Upload {props.user.has_roles.includes("REQ001") && <span className="text-danger">*</span>}</label>
                                                <div className="col-sm-5">
                                                <input type="text" className={(errors.file) ? "form-control is-invalid" : "form-control"} name="file" ref={register({ required: false })} placeholder="" disabled={true} defaultValue={filelampiran} />
                                                <FileUploadInformation idFileUpload="MSR001"/>
                                                </div>
                                                <div className="col-sm-3">
                                                    <label className="custom-file-upload">
                                                        <input type="file" name="files" ref={register({ required: false })} placeholder="" onChange={changeFile} />
                                                        <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} disabled={loading} />  browse
                                                    </label>
                                                </div>
                                                {(props.user.has_roles.includes("REQ001") && ((props.data.status === "d" || props.data.status === "r") || props.data.status === "")) &&
                                                    <div className="col-sm-2 pull -left">
                                                        <button className="btn btn-primary" onClick={handleClick} disabled={loading}>Add</button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Tipe Lampiran</th>
                                                            <th>Description</th>
                                                            <th>File</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>{rows_attactment}</tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="pull-right m-t-10 m-b-10">
                                                {(props.data.status === ""|| ((props.user.has_roles.includes("REQ001") && ((props.data.status === "d" || props.data.status === "r") || props.data.status === "")) &&  ((props.data.status==="d"||props.data.status==="r") && props.data.created_uuid===props.user.uuid))) &&
                                                    <div>
                                                        <button className="btn btn-info m-r-5" onClick={(e) => draftActions(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Draft </button>
                                                        <button className="btn btn-success" onClick={(e) => submitActions(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit </button>
                                                    </div>
                                                }

                                                {(props.user.has_roles.includes("REQ002") && props.data.status==="a" )&&
                                                    <div>
                                                        <button className="btn btn-success m-r-5" onClick={(e) => approveActions(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} approve </button>

                                                        <button className="btn btn-danger" onClick={(e) => rejectActions(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} reject </button>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </PanelBody>
                    }
                </Panel>

                {(props.user.has_roles.includes("PLNRGN") && props.data.status==="m")&&
                    <Panel >
                        <PanelHeader>
                            Assignment
                    </PanelHeader>
                        {props.pageload && <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>}
                        {!props.pageload &&
                            <PanelBody >
                                <Row>

                                    <Col sm="12">
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label">Assign To</label>
                                            <div className="col-sm-10">
                                                <Controller
                                                    components={animatedComponents}
                                                    closeMenuOnSelect={true}
                                                    as={Select}
                                                    // styles={props.errors.type ? customStyles : {}}
                                                    control={control}
                                                    options={props.optionSpecificPlanner}
                                                    // onInputChange={props.handleInputChange}
                                                    name="specific_planner_id"
                                                    // defaultValue={props.data.priority}
                                                    isClearable
                                                    onChange={changeAssignTo}
                                                // ref="attactment_type"
                                                // isDisabled={props.isVendor === false}
                                                />
                                                {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                                                {props.errors.specific_planner_id && <span className="text-danger"> {props.errors.specific_planner_id[0]}  </span>}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="pull-right m-t-10 m-b-10">
                                                    <button className="btn btn-success m-r-5" type="submit" onClick={(e) => submitAssgnment(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit </button>
                                                    <button className="btn btn-danger" type="submit" onClick={(e) => rejectAssgnment(e)} disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Reject </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                            </PanelBody>
                        }
                    </Panel>
                }
            </form>
        </div>
    );
}

export default withTranslation()(MsrForm);