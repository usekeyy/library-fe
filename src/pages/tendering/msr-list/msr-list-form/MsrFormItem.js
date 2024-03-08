import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import { toastr } from 'react-redux-toastr';


const animatedComponents = makeAnimated();

const MsrFormItem = (props) => {
    const { register, handleSubmit, control, setValue, errors } = useForm({});
    const [classifikasi, setClassifikasi] = React.useState(props.data.classification===undefined ? null : props.data.classification.value);
    const [accAssgCategory, setAccAssgCategory] = React.useState((props.data.account_category_id === undefined) ? null : props.data.account_category_id.value);
    const [incoTerm, setIncoTerm] = React.useState((props.data.incoterm_id === undefined || props.data.incoterm_id === null) ? null : props.data.account_category_id.value);
    const [jenisbarang, setJenisBarang] = React.useState((props.data.item_type === undefined || props.data.item_type === null) ? null : props.data.item_type.value);

    const { t } = props;
    const onSubmit = data => {
        if (accAssgCategory === "U") {
            toastr.warning("Validation Account Assgment Category", "Please Choose Value Except U - Unknown");
        } else {
            props.saveitems(setData(data))
        }

    };

    const setData = (data) => {
        // console.log(data)
        let datas = {
            classification: (data.clasifikasi === undefined || data.clasifikasi === null) ? "" : data.clasifikasi.value,
            item_category_id: (data.item_categori === undefined || data.item_categori === null) ? "" : parseInt(data.item_categori.value),
            item_id: (data.item_no === undefined || data.item_no === null) ? "" : data.item_no.value,
            item_description: data.item_description,
            // eslint-disable-next-line no-useless-escape
            qty: parseFloat((data.qty.length > 3) ? data.qty.toString().replace(/\./g, '').replace(/\,/g, '.') : data.qty.toString().replace(/\,/g, '.')),
            uom_id: (data.uom === undefined || data.uom === null) ? "" : data.uom.value,
            uom_code: (data.uom === undefined || data.uom === null) ? "" : data.uom.label.split(" - ")[0],
            per: data.per,
            // eslint-disable-next-line no-useless-escape
            unit_price: parseFloat((data.unit_price.length > 3) ? data.unit_price.toString().replace(/\./g, '').replace(/\,/g, '.') : data.unit_price.toString().replace(/\,/g, '.')),
            // eslint-disable-next-line no-useless-escape
            toleransi_harga: parseFloat((data.toleransi_harga.length > 3) ? data.toleransi_harga.toString().replace(/\./g, '').replace(/\,/g, '.') : data.toleransi_harga.toString().replace(/\,/g, '.')),
            delivery_date: data.delivery_date,
            plant_id: (data.plant === undefined || data.plant === null) ? "" : data.plant.value,
            storage_location_id: (data.storage_location === undefined || data.storage_location === null) ? "" : data.storage_location.value,
            mrp_controller_id: (data.mrp === undefined || data.mrp === null) ? "" : data.mrp.value,
            incoterm_id: (data.incoterm_id === undefined || data.incoterm_id === null) ? "" : data.incoterm_id.value,
            incoterm_description: data.incoterm_description,
            purchasing_org_id: (data.purchasing_org === undefined || data.purchasing_org === null) ? "" : data.purchasing_org.value,
            purchasing_group_id: (data.purchasing_group === undefined || data.purchasing_group === null) ? "" : data.purchasing_group.value,
            item_type: data.item_type.value,
            account_category_id: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.value,
            gl_account_id: (data.gl_accont === undefined || data.gl_accont === null) ? "" : data.gl_accont.value,
            year_type: (data.year === undefined || data.year === null) ? "" : data.year.value,
            object_account: "",
            tag_number: data.tag_number,
            item_category_name: (data.item_categori === undefined || data.item_categori === null) ? "" : data.item_categori.label.split("-")[1],
            // item_type: (data.item_no === undefined || data.item_no === null) ? "" : data.item_no.label.split("-")[1],
            uom_name: (data.uom === undefined || data.uom === null) ? "" : data.uom.label.split("-")[1],
            plant_name: (data.plant === undefined || data.plant === null) ? "" : data.plant.label.split("-")[1],
            storage_location_name: (data.storage_location === undefined || data.storage_location === null) ? "" : data.storage_location.label.split("-")[1],
            mrp_controller_name: (data.mrp === undefined || data.mrp === null) ? "" : data.mrp.label.split("-")[1],
            incoterm_name: (data.incoterm_id === undefined || data.incoterm_id === null) ? "" : data.incoterm_id.label.split("-")[1],
            purchasing_org_name: (data.purchasing_org === undefined || data.purchasing_org === null) ? "" : data.purchasing_org.label.split("-")[1],
            purchasing_group_name: (data.purchasing_group === undefined || data.purchasing_group === null) ? "" : data.purchasing_group.label.split("-")[1],
            account_category_name: (data.ass_category === undefined || data.ass_category === null) ? "" : data.ass_category.label.split("-")[1],
            gl_account_name: (data.gl_accont === undefined || data.gl_accont === null) ? "" : data.gl_accont.label.split("-")[1],
            equipment: data.equipment,
            equipment_type: data.equipment_type,
            no_wo: data.no_wo,
            pekerjaan_tambah: data.pekerjaan_tambah.value,
            manufacturer: data.manufacturer,
            spesifikasi: data.spesifikasi,
            serial_number: data.serial_number,
            drawing_number: data.drawing_number,
            asset_no: (data.asset_no === undefined) ? "" : data.asset_no.value,
            asset_no_description: (data.asset_no === undefined) ? "" : data.asset_no.label.split(" - ")[1],
            wbs_element: (data.wbs_element === undefined) ? "" : data.wbs_element.value,
            wbs_project_description: (data.wbs_element === undefined) ? "" : data.wbs_element.label.split(" - ")[1],
            cost_center_id: (data.cost_center === undefined) ? "" : data.cost_center.value,
            cost_center_name: (data.cost_center === undefined) ? "" : data.cost_center.label.split(" - ")[1],
            network: "",
            order_no: "",
        }
        if (datas.item_id === "manual") {
            datas.item_no_id = data.manual_item_no_id
            datas.item_name = data.item_description
        } else {
            datas.item_no_id = ""
            datas.item_name = ""
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

    const handleChangeIncoterm = (selected) => {
        props.getIncoterms(selected)
    }

    const handleChangeInco = (selected) => {
        // console.log(selected)
        if(selected!==null){
            setIncoTerm(selected.value)
        }else{
            setIncoTerm(null)
        }
        // props.getIncoterms(selected)
    }

    
    const handleChangePlant = (e) => {
        // console.log(e)
        setValue("mrp", null)
        setValue("storage_location", null)
        if (e !== null) {
            props.getPlant({
                selected: '',
                param_id: e.value
            })
        }
    }

    const changeAccAssgCategory = (selected) => {
        // delete props.data.account_category_id
        if (selected !== null) {
            setAccAssgCategory(selected.value)
            // alert(selected.value)
        } else {
            setAccAssgCategory(null)
        }
    }

    const onInputChange = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getPlant({
                selected: option,
                param_id: ''
            })
        }
    };

    const onInputChangeItemNo = (option, { action }) => {
        if (action === "input-change") {
            if (classifikasi === "jasa") {
                props.getMaterialServiceService({
                    selected: option,
                })
            } else {
                props.getMaterialServiceMaterial({
                    selected: option,
                })
            }
        }
    };

    const onInputChangeWbs = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getWbsProject({
                selected: option,
            })
        }
    };

    const onInputChangeAsset = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getAssets({
                selected: option,
            })
        }
    };

    const onInputChangeCostCenter = (option, { action }) => {
        // console.log(classifikasi)
        if (action === "input-change") {
            props.getCostCenter({
                selected: option,
            })
        }
    };

    const handleChangePurchasingGroup = (selected) => {
        props.getPurchasingGroup(selected)
    }

    const handleChangePurchasingOrg = (selected) => {
        props.getPurchasingOrg(selected)
    }

    const handleChangegetMrpController = (selected) => {
        props.getMrpController(selected)
    }

    const handleStorageLocation = (selected) => {
        props.getStorageLocation(selected)
    }

    const handleChangeUom = (selected) => {
        props.getUom(selected)
    }

    const handleGlAccount = (selected) => {
        props.getGlAccount(selected)
    }

    const changeClassifikasi = (selected) => {
        if (selected !== null) {
            setValue("item_no", null)
            setClassifikasi(selected.value)
            if (selected.value === "jasa") {
                props.getMaterialServiceService()
            } else {
                props.getMaterialServiceMaterial()
            }
        } else {
            setClassifikasi(null)
        }
        setValue("item_description","")
    }

    const changeJenisBarang = (selected) =>{
        if(selected!==null){
            setJenisBarang(selected.value)
        }else{
            setJenisBarang(null)
        }
    }
    

    const changeItemNo = (selected) => {
        if (selected !== null) {
            if (selected.value === "manual") {
                setValue("item_description", "")
                props.showItemNumberId(false)
            } else {
                let split = selected.label.split(" - ");
                setValue("item_description", split[1])
                props.showItemNumberId(true)
            }
        }

        if(selected===null && classifikasi ==="jasa" ){
            console.log("a")
            props.getMaterialServiceService()
        }
        if(selected===null && classifikasi ==="barang" ){
            console.log("b")
            props.getMaterialServiceMaterial()
        }
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ?
                '#ddd' : 'red',
        })
    }

    return (
        <div>
            {/* <div className="col-sm-12"> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    {/* props disableModal false menampilkan Klasifikasi kalau true Hidden Classifikasi */}

                    <div className="form-group">
                        <label >Klasifikasi <span className="text-danger">*</span>  </label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsClassifikasi}
                            onChange={([selected]) => {
                                changeClassifikasi(selected)
                                return selected;
                            }}
                            // onInputChange={handleChangePurchasingOrg}
                            name="clasifikasi"
                            defaultValue={props.data.classification}
                            isClearable
                            // isLoading={props.isLoading.purchasingorg}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.clasifikasi ? customStyles : {}}
                        />
                        {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.clasifikasi && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Item Kategori <span className="text-danger">*</span> </label>
                        {/* <input type="text" name="item_categori" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsItemCategory}
                            // onInputChange={handleChangePurchasingOrg}
                            name="item_categori"
                            isDisabled={(props.disableModal === true) ? true : false}
                            defaultValue={props.data.item_category_id}
                            // isClearable
                            isLoading={props.isLoading.itemcategory}
                            rules={{ required: true }}
                            styles={errors.item_categori ? customStyles : {}}
                        />
                        {errors.item_categori && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Item No <span className="text-danger">*</span> </label>
                        {/* <input type="text" name="item_no" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsItemNo}
                            onChange={([selected]) => {
                                changeItemNo(selected)
                                return selected;
                            }}
                            onInputChange={onInputChangeItemNo}
                            name="item_no"
                            defaultValue={props.data.item_id}
                            isClearable
                            isLoading={props.isLoading.item_no}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.item_no ? customStyles : {}}
                        />
                        {errors.item_no && <span className="text-danger">This field is required</span>}
                    </div>

                    {/* {props.hiddenForm.hiddenItemNo === false &&
                        <div className="form-group">
                            <label >ITEM NO ID <span className="text-danger">*</span></label>
                            <input type="text" defaultValue={props.data.item_description} name="manual_item_no_id" ref={register({ required: true })} className={(errors.manual_item_no_id) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={(props.disableModal === true) ? true : false} />
                            {errors.manual_item_no_id && <span className="text-danger">This field is required</span>}
                        </div>
                    } */}

                    <div className="form-group">
                        <label >Description {props.hiddenForm.hiddenItemNo === false && <span className="text-danger">*</span>}</label>
                        <input type="text" defaultValue={props.data.item_description} name="item_description" ref={register({ required: true })} className={(errors.item_description) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={(props.disableModal === true || props.disabledForm.disabledDescriptionForm === true) ? true : false} />
                        {errors.item_description && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Quantity <span className="text-danger">*</span> </label>
                        <Controller
                            name="qty"
                            control={control}
                            defaultValue={(props.data.qty === "" || props.data.qty === undefined) ? 0 : props.data.qty}
                            className="form-control"
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            disabled={(props.disableModal === true) ? true : false}
                            rules={{
                                required: true, min: {
                                    value: 1,
                                    message: "Minimum Value is 0"
                                }
                            }}
                            min="1"
                            styles={errors.qty ? customStyles : {}}
                        />
                        {errors.qty && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Uom <span className="text-danger">*</span></label>
                        {/* <input type="number" name="uom" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsUom}
                            onInputChange={handleChangeUom}
                            name="uom"
                            defaultValue={props.data.uom_id}
                            isClearable
                            isLoading={props.isLoading.uom}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.uom ? customStyles : {}}
                        />
                        {errors.uom && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Per</label>
                        <input type="number" disabled={(props.disableModal === true) ? true : false} name="per" ref={register({})} className="form-control" placeholder="" value="1" />
                    </div>
                    <div className="form-group">
                        <label >Unit Price <span className="text-danger">*</span> </label>
                        <Controller
                            name="unit_price"
                            control={control}
                            defaultValue={(props.data.unit_price === "" || props.data.unit_price === undefined) ? 0 : props.data.unit_price}
                            className="form-control"
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            disabled={(props.disableModal === true) ? true : false}
                            rules={{
                                required: true, min: {
                                    value: 1,
                                    message: "Minimum Value is 0"
                                }
                            }}
                            min="1"
                            styles={errors.unit_price ? customStyles : {}}
                        />
                        {/* <input type="number" defaultValue={props.data.unit_price} disabled={(props.disableModal==true) ? true:false} name="unit_price" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.unit_price && <span className="text-danger">{errors.unit_price.type === "required" ? "Field harus diisi" : ''}  {errors.unit_price.message}</span>}
                    </div>
                    <div className="form-group">
                        <label >Toleransi Harga </label>
                        <Controller
                            name="toleransi_harga"
                            control={control}
                            defaultValue={(props.data.toleransi_harga === "" || props.data.toleransi_harga === undefined) ? 0 : props.data.toleransi_harga}
                            className="form-control"
                            as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            disabled={(props.disableModal === true) ? true : false}
                            rules={{
                                required: false
                            }}
                            styles={errors.toleransi_harga ? customStyles : {}}
                        />
                        {/* <input type="number" defaultValue={props.data.unit_price} disabled={(props.disableModal==true) ? true:false} name="unit_price" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.toleransi_harga && <span className="text-danger">{errors.toleransi_harga.type === "required" ? "Field harus diisi" : ''}  {errors.toleransi_harga.message}</span>}
                    </div>
                    <div className="form-group">
                        <label >Delivery Date <span className="text-danger">*</span> </label>
                        <input type="date" defaultValue={props.data.delivery_date} disabled={(props.disableModal === true) ? true : false} name="delivery_date" ref={register({ required: true })} className={(errors.date) ? "form-control is-invalid" : "form-control"} placeholder="" />
                        {errors.date && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >Plant <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsPlant}
                            onChange={([selected]) => {
                                handleChangePlant(selected)
                                return selected
                            }}
                            onInputChange={onInputChange}
                            name="plant"
                            defaultValue={props.data.plant_id}
                            isClearable
                            isLoading={props.isLoading.plant}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.plant ? customStyles : {}}
                        />
                        {errors.plant && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >Storage Location </label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsStorageLocation}
                            onInputChange={handleStorageLocation}
                            name="storage_location"
                            defaultValue={props.data.storage_location_id}
                            isClearable
                            isLoading={props.isLoading.storagelocation}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: false }}
                            styles={errors.storage_location ? customStyles : {}}
                        />
                        {errors.storage_location && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >MRP</label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsMrp}
                            onInputChange={handleChangegetMrpController}
                            name="mrp"
                            defaultValue={props.data.mrp_controller_id}
                            isClearable
                            isLoading={props.isLoading.mrp}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: false }}
                            styles={errors.mrp ? customStyles : {}}
                        />
                        {errors.mrp && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >Incoterm </label>
                        <div className="row">
                            <div className="col-md-6">
                                <Controller
                                    components={animatedComponents}
                                    closeMenuOnSelect={true}
                                    as={Select}
                                    // styles={props.errors.type ? customStyles : {}}
                                    control={control}
                                    options={props.optionsIncoterms}
                                    onInputChange={handleChangeIncoterm}
                                    name="incoterm_id"
                                    defaultValue={props.data.incoterm_id}
                                    isClearable
                                    onChange={([selected]) => {
                                        handleChangeInco(selected)
                                        return selected
                                    }}
                                    isLoading={props.isLoading.incoterms}
                                    isDisabled={(props.disableModal === true) ? true : false}
                                    rules={{ required: false }}
                                    styles={errors.incoterm_id ? customStyles : {}}
                                />
                                {errors.incoterm_id && <span className="text-danger">This field is required</span>}
                            </div>
                            <div className="col-md-6">
                                <input type="text" defaultValue={props.data.incoterm_description} name="incoterm_description" ref={register({ required: incoTerm===null ? false : true })} className={(errors.incoterm_description) ? "form-control is-invalid" : "form-control"} placeholder="" disabled={(props.disableModal === true) ? true : false} />
                                {errors.incoterm_description && <span className="text-danger"> This field is required</span>}
                            </div>

                        </div>
                        {/* <input type="text" className={(errors.type) ? "form-control is-invalid" : "form-control"} name="type" ref={register()} placeholder="" defaultValue={props.data.type} /> */}
                        

                    </div>
                    <div className="form-group">
                        <label >Purchasing Organizazion <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsPurchasingOrg}
                            onInputChange={handleChangePurchasingOrg}
                            name="purchasing_org"
                            defaultValue={props.data.purchasing_org_id}
                            isClearable
                            isLoading={props.isLoading.purchasingorg}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.purchasing_org ? customStyles : {}}
                        />
                        {errors.purchasing_org && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >Purchasing Group <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsPurchasingGroup}
                            onInputChange={handleChangePurchasingGroup}
                            name="purchasing_group"
                            defaultValue={props.data.purchasing_group_id}
                            isClearable
                            isLoading={props.isLoading.purchasinggroup}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.purchasing_group ? customStyles : {}}
                        />
                        {errors.purchasing_group && <span className="text-danger">This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label >Jenis Barang <span className="text-danger">*</span> </label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsJenisBarang}
                            onChange={([selected]) => {
                                changeJenisBarang(selected)
                                return selected;
                            }}
                            // onInputChange={handleChangePurchasingOrg}
                            name="item_type"
                            defaultValue={props.data.item_type}
                            isClearable
                            // isLoading={props.isLoading.purchasingorg}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.item_type ? customStyles : {}}
                        />
                        {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.item_type && <span className="text-danger">This field is required</span>}
                    </div>
                    
                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Equiopment</label>
                        <input type="text" defaultValue={props.data.equipment} disabled={(props.disableModal === true) ? true : false} name="equipment" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Type Model Equiopment</label>
                        <input type="text" defaultValue={props.data.equipment_type} disabled={(props.disableModal === true) ? true : false} name="equipment_type" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Tag Number</label>
                        <input type="number" defaultValue={props.data.tag_number} disabled={(props.disableModal === true) ? true : false} name="tag_number" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Serial Number</label>
                        <input type="text" defaultValue={props.data.serial_number} disabled={(props.disableModal === true) ? true : false} name="serial_number" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Spesifikasi</label>
                        <input type="text" defaultValue={props.data.spesifikasi} disabled={(props.disableModal === true) ? true : false} name="spesifikasi" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >Drawing Number</label>
                        <input type="text" defaultValue={props.data.drawing_number} disabled={(props.disableModal === true) ? true : false} name="drawing_number" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    { jenisbarang!=="non-pabrik" &&
                    <div className="form-group">
                        <label >No WO</label>
                        <input type="text" defaultValue={props.data.no_wo} disabled={(props.disableModal === true) ? true : false} name="no_wo" ref={register({})} className="form-control" placeholder="" />
                    </div>
                    }

                    <div className="form-group">
                        <label >Pekerjaan Tambah <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsPekerjaanTambah}
                            // onChange={([selected]) => {
                            //     changeClassifikasi(selected)
                            //     return selected;
                            // }}
                            // onInputChange={handleChangePurchasingOrg}
                            name="pekerjaan_tambah"
                            defaultValue={props.data.pekerjaan_tambah}
                            isClearable
                            // isLoading={props.isLoading.purchasingorg}
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.pekerjaan_tambah ? customStyles : {}}
                        />
                        {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                        {errors.pekerjaan_tambah && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Manurfakturer / Merk</label>
                        <input type="text" defaultValue={props.data.manufacturer} disabled={(props.disableModal === true) ? true : false} name="manufacturer" ref={register({})} className="form-control" placeholder="" />
                    </div>

                    <div className="form-group">
                        <label >Acc Ass Category <span className="text-danger">*</span></label>
                        {/* <input type="text" name="ass_category" ref={register({})} className="form-control" placeholder="" /> */}
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsAccAssgnCategory}
                            name="ass_category"
                            defaultValue={props.data.account_category_id}
                            isLoading={props.isLoading.acc_assgn_category}
                            onChange={([selected]) => {
                                changeAccAssgCategory(selected)
                                return selected
                            }}
                            // onChange={changeAccAssgCategory}
                            isClearable
                            isDisabled={(props.disableModal === true) ? true : false}
                            rules={{ required: true }}
                            styles={errors.ass_category ? customStyles : {}}
                        />
                        {errors.ass_category && <span className="text-danger">This field is required</span>}
                    </div>

                    {(accAssgCategory === "F" || accAssgCategory === "N") &&
                        <div className="form-group">
                            <label >Order<span className="text-danger">*</span></label>
                            <input type="text" defaultValue={props.data.order_no} disabled={(props.disableModal === true) ? true : false} name="order" ref={register({ required: true })} className="form-control" placeholder="" />
                            {errors.order && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    {(accAssgCategory === "U" || accAssgCategory === null) &&
                        <div className="form-group">
                            <label >Object Account Assegment<span className="text-danger">*</span></label>
                            <input type="text" defaultValue={props.data.account_assegment} disabled={(props.disableModal === true) ? true : true} name="account_assegment" ref={register({})} className="form-control" placeholder="" />
                        </div>
                    }

                    {accAssgCategory === "A" &&

                        <div className="form-group">
                            <label >Asset<span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsAssets}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeAsset}
                                name="asset_no"
                                defaultValue={props.data.asset_no}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: false }}
                                styles={errors.asset_no ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.asset_no && <span className="text-danger">This field is required</span>}
                        </div>


                    }

                    {(accAssgCategory === "K") &&
                        <div className="form-group">
                            <label >Cost Center<span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsCost_center}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeCostCenter}
                                name="cost_center"
                                defaultValue={props.data.cost_center_id}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: false }}
                                styles={errors.cost_center ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.cost_center && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    {(accAssgCategory === "P" || accAssgCategory === "Q") &&
                        <div className="form-group">
                            <label >WBS Element <span className="text-danger">*</span></label>
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                // styles={props.errors.type ? customStyles : {}}
                                control={control}
                                options={props.optionsWbs_element}
                                onChange={([selected]) => {
                                    return selected;
                                }}
                                onInputChange={onInputChangeWbs}
                                name="wbs_element"
                                defaultValue={props.data.wbs_element}
                                isClearable
                                // isLoading={props.isLoading.purchasingorg}
                                isDisabled={(props.disableModal === true) ? true : false}
                                rules={{ required: false }}
                                styles={errors.wbs_element ? customStyles : {}}
                            />
                            {/* <input type="text" name="clasifikasi" ref={register({})} className="form-control" placeholder="" /> */}
                            {errors.wbs_element && <span className="text-danger">This field is required</span>}
                        </div>
                    }

                    <div className="form-group">
                        <label >GL Account <span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsGlAccount}
                            onInputChange={handleGlAccount}
                            name="gl_accont"
                            defaultValue={props.data.gl_account_id}
                            isClearable
                            isDisabled={(props.disableModal === true || accAssgCategory === "U") ? true : false}
                            rules={{ required: true }}
                            styles={errors.gl_accont ? customStyles : {}}
                        />
                        {errors.gl_accont && <span className="text-danger">This field is required</span>}
                    </div>

                    <div className="form-group">
                        <label >Single / Multi Year<span className="text-danger">*</span></label>
                        <Controller
                            components={animatedComponents}
                            closeMenuOnSelect={true}
                            as={Select}
                            // styles={props.errors.type ? customStyles : {}}
                            control={control}
                            options={props.optionsYearChoice}
                            name="year"
                            defaultValue={props.data.year_type}
                            isClearable
                            isDisabled={(props.disableModal === true || accAssgCategory === "U") ? true : false}
                            rules={{ required: true }}
                            styles={errors.year ? customStyles : {}}
                        />
                        {errors.year && <span className="text-danger">This field is required</span>}
                    </div>
                </ModalBody>
                {props.disableModal === false &&
                    <ModalFooter>
                        <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("company:button.close")}</button>
                        <button className="btn btn-success" type="submit" disabled={props.loadingSubmit}>{props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''} Submit</button>
                    </ModalFooter>
                }
            </form>
        </div>
    );
}

export default withTranslation()(MsrFormItem);