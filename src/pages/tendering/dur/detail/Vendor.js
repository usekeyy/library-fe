import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { statusName } from '../../../../helpers/statusName';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
// import ReactLoading from 'react-loading';
// import { toastr } from 'react-redux-toastr';
// import { formatDate } from '../../../../helpers/formatDate';
// import { array } from 'yup';
const animatedComponents = makeAnimated();

const Vendor = (props) => {
    // const { t } = props;
    // const [filter, setFilter] = React.useState(null);
    const [tipe , setTipe] = React.useState(props.filter_dur.tipe_penyedia)
    // const [coi, setCoi] = React.useState(0);
    const { control , setValue , getValues } = useForm({});
    // let rows;
    var material_group = [];
    let arrSosHeader = [], arrSosItems = []

    const filterVendor = () => {
        props.filterby(tipe)
    }

    // const handleChangeFilter = (selected) => {
    //     if(selected!==null){
    //         setFilter(selected.value)
    //     }else{
    //         setFilter(null)
    //         props.filterby({sos_type:'', id:''})
    //     }
    // }

    const handleChangePenyedia = (selected) => {
        if(selected!==null){
            setTipe(selected.value)
            props.changeTipePenyedia(selected.value)
        }else{
            setTipe('general')
        }
    }

    const handleChangeBidUsaha = (selected) => {
        let arrBidUsaha = []
        let arrIdKlasifikasi = [], tempArrSubKlasifikasi = []
        if(selected!==null){
            selected.forEach(element => {
                arrBidUsaha.push({value : element.value, name : element.label})
                arrIdKlasifikasi.push(element.value)
            });

            props.changeBidangUsaha(arrBidUsaha)
            if(getValues('sub_bidang_usaha')!==null){
                getValues('sub_bidang_usaha').forEach(element=>{
                    console.log(element)
                    if(arrIdKlasifikasi.includes(element.bidang_usaha_id)){
                        tempArrSubKlasifikasi.push({value:element.value, name: element.label, label : element.label, bidang_usaha_id : element.bidang_usaha_id})
                    }
                })
            }
            setValue('sub_bidang_usaha', tempArrSubKlasifikasi)
        }else{
            setValue('sub_bidang_usaha', null)
            props.changeBidangUsaha(arrBidUsaha)
            props.changeSubBidangUsaha([])
        }
    }

    const handleChangeSubBidangUsaha = (selected) => {
        let arrSubBidUsaha = []
        if(selected!==null){
            selected.forEach(element => {
                arrSubBidUsaha.push({value:element.value, name: element.label})
            });
            props.changeSubBidangUsaha(arrSubBidUsaha)
        }else{
            setValue('sub_bidang_usaha', null)
            props.changeSubBidangUsaha(arrSubBidUsaha)
        }
    }

    const handleChangeTipeRekanan = (selected) => {
        let arrTipeRekanan = []
        if(selected!==null){
            selected.forEach(element => {
                arrTipeRekanan.push({value:element.value, name: element.label})
            });
            props.changeTipeRekanan(arrTipeRekanan)
        }else{
            props.changeTipeRekanan(arrTipeRekanan)
        }
    }

    const handleChangeKlasifikasi = (selected) => {
        let arrKlasifikasi= []
        let arrIdKlasifikasi = [], tempArrSubKlasifikasi = []
        if(selected!==null){
            selected.forEach(element => {
                arrKlasifikasi.push({value:element.value, name: element.label})
                arrIdKlasifikasi.push(element.value)
            });
            props.changeKlasifikasi(arrKlasifikasi)
            
            console.log('arr : '+ arrIdKlasifikasi)

            if(getValues('sub_klasifikasi')!==null){
                getValues('sub_klasifikasi').forEach(element=>{
                    console.log(element)
                    if(arrIdKlasifikasi.includes(element.vendor_classification_id)){
                        tempArrSubKlasifikasi.push({value:element.value, name: element.label, label : element.label, vendor_classification_id : element.vendor_classification_id})
                    }
                })
            }
            setValue('sub_klasifikasi', tempArrSubKlasifikasi)
            // console.log(getValues('sub_klasifikasi'))
        }else{
            setValue('sub_klasifikasi', null)
            props.changeSubKlasifikasi([])
            props.changeKlasifikasi(arrKlasifikasi)
        }
    }

    if (props.sos_header !== undefined) {
        // eslint-disable-next-line array-callback-return
        Object.keys(props.sos_header).map(function (key, index) {
            // sos_header += props.sos_header[key]['bidang_usaha_id'] + "-" + props.sos_header[key]['bidang_usaha_name'] + "; "
            arrSosHeader.push(props.sos_header[key]['bidang_usaha_id'])
            if (!material_group.includes(props.sos_header[key]['material_group_id'])) {
                material_group.push(props.sos_header[key]['material_group_id'])
            }
        });
    }

    if (props.sos_item !== undefined) {
        // eslint-disable-next-line array-callback-return
        Object.keys(props.sos_item).map(function (key, index) {
            // sos_item += props.sos_item[key]['sub_bidang_usaha_id'] + "-" + props.sos_item[key]['sub_bidang_usaha_name'] + "; "
            arrSosItems.push(props.sos_item[key]['sub_bidang_usaha_id'])
            if (!material_group.includes(props.sos_item[key]['material_group_id'])) {
                material_group.push(props.sos_item[key]['material_group_id'])
            }
        });
    }

    const onInputChangeSubBidangUsaha = (option, {action}) => {
        if (action === "input-change") {
            props.getSubBidangUsaha(option)
        }
        if(action === "menu-close"){
            props.getSubBidangUsaha()
        }
    }

    const handleChangeSubKlasifikasi = (selected) => {
        let arrSubBidUsaha = []
        if(selected!==null){
            selected.forEach(element => {
                arrSubBidUsaha.push({value: element.value, name : element.label , vendor_classification_id : element.vendor_classification_id})
            });
            props.changeSubKlasifikasi(arrSubBidUsaha)
        }else{            
            setValue('sub_klasifikasi', null)
            props.changeSubKlasifikasi(arrSubBidUsaha)
        }
    }

    const onInputChangeSubKlasifikasi = (option, {action}) => {
        if (action === "input-change") {
            props.getSubKlasifikasi(option)
        }
        if(action === "menu-close"){
            props.getSubKlasifikasi()
        }
    }

    const handleChangeKualifikasi = (selected) => {
        let arrKualifikasi = []
        if(selected!==null){
            selected.forEach(element => {
                arrKualifikasi.push({value:element.value, name:element.label})
            });
            props.changeKualifikasi(arrKualifikasi)
        }else{
            props.changeKualifikasi(arrKualifikasi)
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tipe Penyedia</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsFilterBy}
                                name="tipe_penyedia"
                                defaultValue={(props.filter_dur.tipe_penyedia==="") ? null : (props.filter_dur.tipe_penyedia==="siujk")  ? {value:'siujk', label: 'Kontruksi'} : {value:'general', label: 'General'} }
                                onChange={([selected]) => {
                                    handleChangePenyedia(selected)
                                    return selected;
                                }}
                                control={control}
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    {tipe==="general" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Bidang Usaha</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsBidangUsaha}
                                name="bidang_usaha"
                                isLoading={props.loadings.bidangUsaha}
                                defaultValue={props.selectedOptions.BidangUsahaSelected}
                                onChange={([selected]) => {
                                    handleChangeBidUsaha(selected)
                                    return selected;
                                }}
                                control={control}
                                isClearable
                                isMulti
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                     {tipe==="general" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Sub Bidang Usaha</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsSubBidangUsaha}
                                name="sub_bidang_usaha"
                                defaultValue={props.selectedOptions.SubBidangUsahaSelected}
                                isLoading={props.loadings.subBidangUsaha}
                                onChange={([selected]) => {
                                    handleChangeSubBidangUsaha(selected)
                                    return selected;
                                }}
                                onInputChange = {onInputChangeSubBidangUsaha}
                                control={control}
                                isClearable
                                isMulti
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                    {tipe==="general" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tipe Rekanan</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsTipeRekanan}
                                defaultValue={props.selectedOptions.TipeRekananSelected}
                                name="tipe_rekanan"
                                onChange={([selected]) => {
                                    handleChangeTipeRekanan(selected)
                                    return selected;
                                }}
                                control={control}
                                isClearable
                                isMulti
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                     {tipe==="siujk" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Klasifikasi</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsKlasifikasi}
                                name="klasifikasi"
                                defaultValue={props.selectedOptions.KlasifikasiSelected}
                                onChange={([selected]) => {
                                    handleChangeKlasifikasi(selected)
                                    return selected;
                                }}
                                control={control}
                                isClearable
                                isMulti
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                    {tipe==="siujk" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Sub Klasifikasi</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsSubKlasifikasi}
                                name="sub_klasifikasi"
                                defaultValue={props.selectedOptions.SubKlasifikasiSelected}
                                onChange={([selected]) => {
                                    handleChangeSubKlasifikasi(selected)
                                    return selected;
                                }}
                                onInputChange = {onInputChangeSubKlasifikasi}
                                control={control}
                                isClearable
                                isMulti
                                isLoading={props.loadings.sub_klasifikasi}
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                    {tipe==="siujk" && 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Kualifikasi</label>
                        <div className="col-sm-6">
                            <Controller
                                components={animatedComponents}
                                closeMenuOnSelect={true}
                                as={Select}
                                options={props.optionsKualifikasi}
                                name="kualifikasi"
                                defaultValue={props.selectedOptions.KualifikasiSelected}
                                onChange={([selected]) => {
                                    handleChangeKualifikasi(selected)
                                    return selected;
                                }}
                                control={control}
                                isClearable
                                isMulti
                                isDisabled={!(props.status === "o" || props.status === "r")}
                            />
                        </div>
                    </div>
                    }
                    <div className="form-group row">
                            <label className="col-sm-2 col-from-label"></label>
                            <div className="col-sm-6 pull-right">
                            <button
                                type="button"
                                onClick={(e) => filterVendor(e)}
                                disabled={!(props.status === "o" || props.status === "r")}
                                className="btn btn-white m-r-5 pull-right">
                                Filter
                            </button>
                            </div>
                            {/* <button
                                type="button"
                                onClick={(e) => removeFilterVendor(e)}
                                className="btn btn-danger m-r-5">
                                <i class="fa fa-window-close" aria-hidden="true"></i>
                            </button> */}
                        </div>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(Vendor);
