import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { Panel, PanelBody, PanelHeader } from '../../../../containers/layout/sub/panel/panel';
// import { camelCase } from '../../../../helpers/camelCase';
import NumberFormat from 'react-number-format';

const animatedComponents = makeAnimated();

const Form = (props) => {
    const {t} = props;
    const { register , control, handleSubmit , setValue} = useForm({});
    const [purchasingOrg , setPurchasingOrg] = React.useState("")
    // const [auctionType , setAuctionType] = React.useState("");
		const auctionType = "";
    
    const [metodeCalc , setMetodeCalc] = React.useState([{ value: "diskon", label: "Diskon", isDisabled : (auctionType!=="forward_auction") ? false : false },
        { value: "harga_satuan", label: "Harga Satuan" }])

    const onSubmit = async data => {
        // console.log(data)
        let payload  = setData(data)
        // console.log(payload)
        props.storeFreeAuction(payload)
    };

    const setData = (data) => {
		data.auction_type= (data.auction_type===undefined || data.auction_type===null) ? "" : data.auction_type.value
		data.denominimilisasi= (data.denominimilisasi===undefined || data.denominimilisasi===null) ? "" : data.denominimilisasi.value
		data.increment_decrement =  (data.increment_decrement===undefined || data.increment_decrement===null)? "" : parseFloat(data.increment_decrement.toString().replace(/\./g,'').replace(/,/g,'.'))
		data.metode_penentuan_pemenang =  (data.metode_penentuan_pemenang===undefined || data.metode_penentuan_pemenang===null)? "" : data.metode_penentuan_pemenang.value
		data.metode_peringkat =  (data.metode_peringkat===undefined || data.metode_peringkat===null)? "" : data.metode_peringkat.value
		data.opsi_penampilan_peringkat =  (data.opsi_penampilan_peringkat===undefined || data.opsi_penampilan_peringkat===null)? "" : data.opsi_penampilan_peringkat.value
		data.opsi_penerimaan_jumlah =  (data.opsi_penerimaan_jumlah===undefined || data.opsi_penerimaan_jumlah===null)? "" : data.opsi_penerimaan_jumlah.value
		data.price_calculation =  (data.price_calculation===undefined || data.price_calculation===null)? "" : data.price_calculation.value
		data.purchasing_group_id =  (data.purchasing_group_id===undefined || data.purchasing_group_id===null)? "" : data.purchasing_group_id.value
		data.purchasing_org_id =  (data.purchasing_org_id===undefined || data.purchasing_org_id===null)? "" : data.purchasing_org_id.value
		data.jenis_auction =  (data.jenis_auction===undefined || data.jenis_auction===null)? "" : data.jenis_auction.value
		data.visibilitas_harga_terbaik =  (data.visibilitas_harga_terbaik===undefined || data.visibilitas_harga_terbaik===null)? "" : data.visibilitas_harga_terbaik.value
		data.visibilitas_peringkat_terbaik =  (data.visibilitas_peringkat_terbaik===undefined || data.visibilitas_peringkat_terbaik===null)? "" : data.visibilitas_peringkat_terbaik.value
		data.visibilitas_oe =  (data.visibilitas_oe===undefined || data.visibilitas_oe===null)? "" : data.visibilitas_oe.value
        data.freeze =(data.freeze==="" || data.freeze===undefined  ) ?  0 : parseFloat(data.freeze?.toString().replace(/\./g,'').replace(/,/g,'.'))
		return data
	}

    const handleChangePurchasingGroup = (e) => {
        if(e!==null){
            let payload = {
                id : e.value
            }
            setPurchasingOrg(e.value);
            props.fetchPurchasingGroup(payload)
        }else{
            setPurchasingOrg("")
        }
    }

    const onInputChangePurchGroup = (option, {action}) => {
        if (action === "input-change") {
            let payload = {
                id : purchasingOrg,
                name : option
            }
            props.fetchPurchasingGroup(payload)
        }
    }

    const handleChangeFilter = (select) => {
        setValue("price_calculation", null)
        if(select!==null){
            // setAuctionType(select.value)
            if(select.value==="forward_auction"){
                setMetodeCalc([{ value: "diskon", label: "Diskon", isDisabled : false },
                { value: "harga_satuan", label: "Harga Satuan" }])
            }else{
                setMetodeCalc([{ value: "diskon", label: "Diskon", isDisabled : true },
                { value: "harga_satuan", label: "Harga Satuan" }])
            }
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
           <Panel>
                <PanelHeader>
                    Detail Auction
                </PanelHeader>
                <PanelBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Simulate/Live</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.simulate}
                                name="jenis_auction"
                                // defaultValue={props.data?.jenis_auction !== null ? {label : camelCase(props.data?.jenis_auction) , value : props.data?.jenis_auction} : null }
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.jenis_auction  && <label className="text-danger"> {props.errors.jenis_auction[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Description</label>
                        <div className="col-sm-8">
                            <textarea 
                                className="form-control" 
                                name="description" 
                                ref={register({})} 
                                // defaultValue={props.data?.description}
                            />
                            {props.errors.description  && <label className="text-danger"> {props.errors.description[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Auction Type {auctionType}</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.actionType}
                                name="auction_type"
                                // defaultValue={props.data?.auction_type !== null ? {label : camelCase(props.data?.auction_type) , value : props.data?.auction_type} : null }
                                onChange={([selected]) => {
                                    handleChangeFilter(selected)
                                    return selected;
                                }}
                                control={control}
                                isClearable
                            />
                            {props.errors.auction_type  && <label className="text-danger"> {props.errors.auction_type[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Perhitungan Harga Satuan</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={metodeCalc}
                                // defaultValue={props.data?.price_calculation !== null ? {label : camelCase(props.data?.price_calculation) , value : props.data?.price_calculation} : null }
                                name="price_calculation"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.price_calculation  && <label className="text-danger"> {props.errors.price_calculation[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Purchasing Organization</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.purchasingOrg}
                                name="purchasing_org_id"
                                placeholder={props.loadings.loading_fetch_purchasing_org ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
                                isLoading={props.loadings.loading_fetch_purchasing_org}
                                // defaultValue={props.data?.purchasing_org_id !== null ? {label : props.data?.purchasing_org_id +" - " +props.data?.purchasing_org_name , value : props.data?.purchasing_org_id} : null }
                                onChange={([selected]) => {
                                    handleChangePurchasingGroup(selected)
                                    return selected;
                                }}
                                control={control}
                            />
                            {props.errors.purchasing_org_id  && <label className="text-danger"> {props.errors.purchasing_org_id[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Purchasing Group</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.purchasingGroup}
                                name="purchasing_group_id"
                                placeholder={props.loadings.loading_fetch_purchasing_group ? t("common:Select.Sedang Memuat") : t("common:Select.Pilih")}
                                isLoading={props.loadings.loading_fetch_purchasing_group}
                                // defaultValue={props.data?.purchasing_group_id !== null ? {label : props.data?.purchasing_group_id +" - " +props.data?.purchasing_group_name , value : props.data?.purchasing_group_id} : null }
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                onInputChange={onInputChangePurchGroup}
                                control={control}
                            />
                            {props.errors.purchasing_group_id  && <label className="text-danger"> {props.errors.purchasing_group_id[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Freeze Time (Minutes)</label>
                        <div className="col-sm-8">
                            {/* <input className="form-control" type="number" name="freeze" ref={register()} 
                            // defaultValue={props.data?.freeze}
                            /> */}
                            <Controller
                                name="freeze"
                                control={control}
                                // defaultValue={parseFloat(props.data?.discount)}
                                defaultValue={0}
                                className="form-control"
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} decimalScale={1} required={true}/>}
                            />
                            {props.errors.freeze  && <label className="text-danger"> {props.errors.freeze[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Metode Evaluasi Penentuan Pemenang</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.metodeEvaluasiPenantuanPemenang}
                                name="metode_penentuan_pemenang"
                                // defaultValue={props.data?.metode_penentuan_pemenang !== null ? {label : camelCase(props.data?.metode_penentuan_pemenang) , value : props.data?.metode_penentuan_pemenang} : null }
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.metode_penentuan_pemenang  && <label className="text-danger"> {props.errors.metode_penentuan_pemenang[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Metode Peringkat</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.perhitunganPeringkat}
                                // defaultValue={props.data?.metode_peringkat !== null ? {label : camelCase(props.data?.metode_peringkat) , value : props.data?.metode_peringkat} : null }
                                name="metode_peringkat"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.metode_peringkat  && <label className="text-danger"> {props.errors.metode_peringkat[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Opsi Penampilan Peringkat</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.opsiPenampilanPeringkat}
                                // defaultValue={props.data?.opsi_penampilan_peringkat !== null ? {label : camelCase(props.data?.opsi_penampilan_peringkat) , value : props.data?.opsi_penampilan_peringkat} : null }
                                name="opsi_penampilan_peringkat"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.opsi_penampilan_peringkat  && <label className="text-danger"> {props.errors.opsi_penampilan_peringkat[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Visibilitas Harga Terbaik</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.visibilitas}
                                // defaultValue={props.data?.visibilitas_harga_terbaik !== null ? {label : camelCase(props.data?.visibilitas_harga_terbaik) , value : props.data?.visibilitas_harga_terbaik} : null }
                                name="visibilitas_harga_terbaik"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.visibilitas_harga_terbaik  && <label className="text-danger"> {props.errors.visibilitas_harga_terbaik[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Visibilitas Peringkat Terbaik</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.visibilitas}
                                // defaultValue={props.data?.visibilitas_peringkat_terbaik !== null ? {label : camelCase(props.data?.visibilitas_peringkat_terbaik) , value : props.data?.visibilitas_peringkat_terbaik} : null }
                                name="visibilitas_peringkat_terbaik"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.visibilitas_peringkat_terbaik  && <label className="text-danger"> {props.errors.visibilitas_peringkat_terbaik[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Visibilitas Oe</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.visibilitas}
                                // defaultValue={props.data?.visibilitas_oe !== null ? {label : camelCase(props.data?.visibilitas_oe) , value : props.data?.visibilitas_oe} : null }
                                name="visibilitas_oe"
                                // isDisabled={(props.header?.status!=='n') ? true : false}
                                control={control}
                                isClearable
                            />
                            {props.errors.visibilitas_oe  && <label className="text-danger"> {props.errors.visibilitas_oe[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Opsi Penerimaan Jumlah diluar Rentang Tertentu</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.opsi_penerimaan_jumlah}
                                // defaultValue={props.data?.opsi_penerimaan_jumlah !== null ? {label : camelCase(props.data?.opsi_penerimaan_jumlah) , value : props.data?.opsi_penerimaan_jumlah} : null }
                                name="opsi_penerimaan_jumlah"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.opsi_penerimaan_jumlah  && <label className="text-danger"> {props.errors.opsi_penerimaan_jumlah[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Increment / Decrement</label>
                        <div className="col-sm-8">
                            <Controller
                                name="increment_decrement"
                                placeholder="Set Increment / Decrement"
                                control={control}                         
                                className="form-control"
                                as={<NumberFormat thousandSeparator={'.'} decimalSeparator={','} />}
                            />
                            {props.errors.increment_decrement  && <label className="text-danger"> {props.errors.increment_decrement[0]} </label>}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Denominasi</label>
                        <div className="col-sm-8">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.options.denominimalisasi}
                                // defaultValue={props.data?.denominimilisasi !== null ? {label : camelCase(props.data?.denominimilisasi) , value : props.data?.denominimilisasi} : null }
                                name="denominimilisasi"
                                // defaultValue={filter}
                                // onChange={([selected]) => {
                                //     handleChangeFilter(selected)
                                //     return selected;
                                // }}
                                control={control}
                                isClearable
                            />
                            {props.errors.denominimilisasi  && <label className="text-danger"> {props.errors.denominimilisasi[0]} </label>}
                        </div>
                    </div>
                    <div className="row pull-right">
                        {props.access.C && 
                        <button
                            type="submit"
                            className="btn btn-success m-r-5"
                            disabled={props.loadings.loading_store_free_auction}
                        >
                            {props.loadings.loading_store_free_auction && <i className="fa fa-spinner fa-spin"></i> } 
                            {t("auction:button.save-draft")}
                        </button>
                        }
                        <button
                            type="button"
                            className="btn btn-white m-r-5"
                            onClick={()=>props.tongleClose()}
                        >
                            {t("auction:button.cancel")}
                    </button>
                    </div>
                </PanelBody>
            </Panel>
           
        </form>
    )
}

export default withTranslation()(Form);
