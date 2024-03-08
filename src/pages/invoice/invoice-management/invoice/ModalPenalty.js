import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import ReactLoading from 'react-loading';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { Row, Col } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { formatNumber } from '../../../../helpers/formatNumber';

const animatedComponents = makeAnimated();

const ModalPenalty = (props) => {
	const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    let [accAssgCategory, setAccAssgCategory] = React.useState(null);
    let [jenis_pembebanan, setPembebanan] = React.useState(null);
    let [lampiranPenalty, setLampiranPenalty] = React.useState(null);
	// let {loadings} = props;
    const [loading, setLoading] = React.useState(false)
	const { control, register, handleSubmit, errors, setValue } = useForm({});
    const { t } = props;  

    // const toggleOpenPreview = (e, file, url) => {
    //     // e.preventDefault()
    //     props.toggleOpenPreview(e, file, url)

    // }

    const changePembebanan = (selected) => {
        // delete props.data_item.account_category_id
        if (selected !== null) {
            setPembebanan(selected.value)
            if (selected.value === 'non_inventory') {
                setAccAssgCategory(null)
                setValue("gl_account", [])
                setValue("ass_category", [])
                setValue("asset_no", [])
                setValue("cost_center", [])
                setValue("wbs_element", [])
                setValue("order", '')
            }
            // props.changeAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setPembebanan(null)
        }
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

    const onInputChangeGlAccount = (option, { action }) => {
		if (action === "input-change") {
			props.fetchGlAccount(option)
		}
		if (action === "set-value") {
			props.fetchGlAccount('')
		}
    };

    const changeFile = (e) => {
        setLoading(!loading);
        if (e.target.files[0]){
            // let name = e.target.files[0].name
            props.upload('PRCORD', e.target.files[0])
            .then((resp) => {
                setLoading(false);
                setValue("file_name", resp.data.data.name)
                setLampiranPenalty(resp.data.data.name)
                // props.addTempLampiran(name, resp.data.data.name)
            })
            .catch((err) => {
                setLoading(false);
                setValue("file_name", '')
                setLampiranPenalty(null)
                // props.addTempLampiran('', '')
                console.log(err)
                // toastr.error(err.data.message, err.data.status)
            })    
        }else{
            // props.addTempLampiran('', '')
            setLoading(false);
        }
    }

    // const  addPenalty = (e) => {
    //     e.preventDefault()
    //     addPenalty(e)
    //     console.log('add penalty')
    //     // setValue("file_name", '')
    //     // props.addLampiranProgress()
    // }

	const onAddPenalty = async data => {
		props.addPenalty(data);
	};	

	const onSubmitPenalty = async data => {
		props.save(data);
	};	

    return (
        <div>
			<form onSubmit={handleSubmit(onAddPenalty)}>
                <ModalBody>
                    <Panel className="margin-bot-false">
                        <PanelHeader>Add Penalty</PanelHeader>
                        <PanelBody >
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Item GR/SA <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_item}
                                                inputRef={(e) => register({ name: "item_gr", required: true })}
                                                name="item_gr"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.penalty_type}
                                                rules={{ required: true }}
                                            />
                                            {errors.item_gr && <span className="text-danger">{errors.item_gr.type === "required" ? "Field harus diisi" : ''}  {errors.item_gr.message}</span>}
                                            {props.errors.item_gr && <span className="text-danger">{props.errors.item_gr[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Jenis Penalty <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_penalty_type}
                                                inputRef={(e) => register({ name: "penalty_type", required: true })}
                                                name="penalty_type"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.penalty_type}
                                                rules={{ required: true }}
                                            />
                                            {errors.penalty_type && <span className="text-danger">{errors.penalty_type.type === "required" ? "Field harus diisi" : ''}  {errors.penalty_type.message}</span>}
                                            {props.errors.penalty_type && <span className="text-danger">{props.errors.penalty_type[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Nilai <span className="text-danger">*</span></label>
                                        <input type="number" min="0" onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                                            className={(errors.amount || props.errors.amount) ? "form-control is-invalid" : "form-control"} name="amount" ref={register({ required: true })}/>
                                        {errors.amount && <span className="text-danger"> {errors.amount.type === "required" ? "Field harus diisi" : ''}  {errors.amount.message} </span>}
                                        {props.errors.amount && <span className="text-danger">{props.errors.amount[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Curr <span className="text-danger">*</span></label>
                                        <input disabled={true} className={(errors.currency || props.errors.currency) ? "form-control is-invalid" : "form-control"} name="currency" ref={register({ required: false })} defaultValue={props.data.items[0].currency} />
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label">Deskripsi <span className="text-danger">*</span></label>
                                        <textarea className={errors.content ? "form-control is-invalid" : "form-control"} name="description" ref={register({ required: true })}/>
                                        {errors.description && <span className="text-danger">{errors.description.type === "required" ? "Field harus diisi" : ''}  {errors.description.message}</span>}
                                        {props.errors.description && <span className="text-danger">{props.errors.description[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Lampiran</label>
                                        <div className="form-group row">
                                            <input type="text" style={{display: 'none'}} className="form-control" name="file_name" ref={register({required: false})} disabled={true}/>
                                            <div className="col-md-12">
                                                <label className="custom-file-upload">
                                                    <input type="file" name="file" ref={register({required: false})} placeholder="" onChange={changeFile} disabled={loading} />
                                                    <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-upload"} /> {t('Label.Unggah')}
                                                </label>
                                                <span> </span>
                                                {lampiranPenalty !== null &&
                                                    <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, lampiranPenalty, `${process.env.REACT_APP_API_BASE_URL}files/temp/${lampiranPenalty}`)} href="/">{lampiranPenalty}</a>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Pembebanan <span className="text-danger">*</span></label>
                                        <div>
                                            <Controller
                                                components={animatedComponents}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                onChange={([selected]) => {
                                                    changePembebanan(selected)
                                                    return selected
                                                }}
                                                options={props.data_option.m_jenis_pembebanan}
                                                inputRef={(e) => register({ name: "jenis_pembebanan", required: true })}
                                                name="jenis_pembebanan"
                                                placeholder={ t("common:Select.Pilih") }
                                                // isLoading={loadings.jenis_pembebanan}
                                                rules={{ required: true }}
                                            />
                                            {errors.jenis_pembebanan && <span className="text-danger">{errors.jenis_pembebanan.type === "required" ? "Field harus diisi" : ''}  {errors.jenis_pembebanan.message}</span>}
                                            {props.errors.jenis_pembebanan && <span className="text-danger">{props.errors.jenis_pembebanan[0]}</span>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>G/L Account <span className="text-danger">*</span></label>
                                        <Controller
                                            components={animatedComponents}
                                            isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.data_option.m_gl_account}
                                            onInputChange={onInputChangeGlAccount}
                                            name="gl_account"
                                            isClearable
                                            isLoading={props.loadings.gl_account_id}
                                            rules={{ required: jenis_pembebanan === 'non_inventory' ? true : false }}
                                        />
                                        {errors.gl_account && <span className="text-danger">{errors.gl_account.type === "required" ? "Field harus diisi" : ''}  {errors.gl_account.message}</span>}
                                        {props.errors.gl_account && <span className="text-danger">{props.errors.gl_account[0]}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Account Assignment <span className="text-danger">*</span></label>
                                        <Controller
                                            components={animatedComponents}
                                            isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.data_option.m_acc_assgn_category}
                                            name="ass_category"
                                            isLoading={props.loadings.acc_assgn_category}
                                            onInputChange={onInputAccAssgCategory}
                                            onChange={([selected]) => {
                                                changeAccAssgCategory(selected)
                                                return selected
                                            }}
                                            isClearable
                                            rules={{ required: jenis_pembebanan === 'non_inventory' ? true : false }}
                                        />
                                        {errors.ass_category && <span className="text-danger">{errors.ass_category.type === "required" ? "Field harus diisi" : ''}  {errors.ass_category.message}</span>}
                                        {props.errors.ass_category && <span className="text-danger">{props.errors.ass_category[0]}</span>}
                                    </div>
                                    {(accAssgCategory === "F" || accAssgCategory === "N") &&
                                        <div className="form-group">
                                            <label >Order</label>
                                            <input type="text" disabled={jenis_pembebanan === 'non_inventory' ? false : true} name="object" ref={register({ required: jenis_pembebanan === 'non_inventory' ? true : false })} className="form-control" placeholder="" />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }

                                    {accAssgCategory === "A" &&
                                        <div className="form-group">
                                            <label >Asset</label>
                                            <Controller
                                                components={animatedComponents}
                                                isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_asset}
                                                name="object"
                                                isLoading={props.loadings.asset_id}
                                                onInputChange={onInputChangeAsset}
                                                isClearable
                                                rules={{ required: jenis_pembebanan === 'non_inventory' ? true : false }}
                                            />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }

                                    {accAssgCategory === "K" &&
                                        <div className="form-group">
                                            <label >Cost Center</label>
                                            <Controller
                                                components={animatedComponents}
                                                isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_cost_center}
                                                name="object"
                                                isLoading={props.loadings.cost_center_id}
                                                onInputChange={onInputChangeCostCenter}
                                                isClearable
                                                rules={{ required: jenis_pembebanan === 'non_inventory' ? true : false }}
                                            />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }

                                    {(accAssgCategory === "P" || accAssgCategory === "Q") &&
                                        <div className="form-group">
                                            <label >WBS Element </label>
                                            <Controller
                                                components={animatedComponents}
                                                isDisabled={jenis_pembebanan === 'non_inventory' ? false : true}
                                                closeMenuOnSelect={true}
                                                as={Select}
                                                control={control}
                                                options={props.data_option.m_wbs_element}
                                                name="object"
                                                isLoading={props.loadings.wbs_element_id}
                                                onInputChange={onInputChangeWbs}
                                                isClearable
                                                rules={{ required: jenis_pembebanan === 'non_inventory' ? true : false }}
                                            />
                                            {errors.object && <span className="text-danger">{errors.object.type === "required" ? "Field harus diisi" : ''}  {errors.object.message}</span>}
                                            {props.errors.object && <span className="text-danger">{props.errors.object[0]}</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                        </PanelBody>
                    </Panel>
                </ModalBody>
            </form>
            <ModalFooter>
            <form onSubmit={handleSubmit(onSubmitPenalty)}>
                <span className="text-danger" style={{paddingRight: "10px", paddingTop: "5px"}}>
                    {/* {props.status_detail_item.delivery_date && "* Mohon pilih Delivery Date"}
                    {props.status_detail_item.tax && "* Mohon Pilih Tax"} */}
                </span>
                <button className="btn btn-success m-r-5" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} {t("costCenter:button.submit")}</button>
                <button className="btn btn-white m-r-5" onClick={(e) => props.toggleClose(e)}>{t("costCenter:button.close")}</button>
            </form>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(ModalPenalty);
