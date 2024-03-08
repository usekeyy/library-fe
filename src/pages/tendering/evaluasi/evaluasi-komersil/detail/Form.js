import React from 'react';
import { withTranslation } from 'react-i18next';
import { useForm, FormContext } from "react-hook-form";
// import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import Header from './Header';
import DetailTender from './DetailTender';
import DocumentTender from './DocumentTender';
import Items from './Items';
import Persyaratan from './Persyaratan';
import Process from './Process';
import DocumentVendor from './DocumentVendor';
import BidBondDocument from './BidBondDocument';
// import { formatNumber } from '../../../../../helpers/formatNumber'


const Form = (props) => {
    // const { t } = props;
    const methods = useForm();

    const onSubmit = data => {
    //    console.log(setData(data))
       props.storeEvaluasiCommersialProses(setData(data))
    };

    const setData  = (data) => {
        let arr={} ;
        arr.pr_item_id = props.pr_item_id
        arr.vendor_id=props.vendor_id
        arr.evaluasi_id = props.state.data.header.evaluasi_id
        arr.process = data.status.value
        arr.score_komersil=""
        if(data.proposal_tender_syarat_id!==undefined){
            arr.evaluasi = data.proposal_tender_syarat_id.map((i, index) => {
                return (
                    {
                        proposal_tender_syarat_id : data.proposal_tender_syarat_id[index],
                        hasil : (data.hasil[index]==="1") ? 'pass' : 'fail',
                        keterangan : data.keterangan[index]
                    }
                )
            })
        }else{
            arr.evaluasi=[]
        }       

        props.state.data.harga_item_penawaran_peserta.forEach(element => {
            if(element.vendor_id===props.vendor_id){
                arr.score_komersil=(element.score_komersil===null) ? 0 : parseFloat(element.score_komersil,2);
            }
        })

        return arr
    }

    // const SubmitButton = (e) => {
    //     props.saveEvaluasiTeknisPublish()
    //     e.preventDefault()
    // }
    
    return (
        <div>
            <FormContext {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Header
                            proposal_tender_no={props.state.data.header.proposal_tender_no}
                            description={props.state.data.header.title}
                            status={props.state.data.header.status_proses}
                            assignment={props.state.data.header.assignment}
                            vendor={true}
                            vendor_name={props.state.data.header.vendor_name}
                        />
                        <DetailTender
                            metode_pengadaan_name={props.state.data.header.metode_pengadaan_name}
                            pra_qualification={props.state.data.header.pra_qualification}
                            metode_aanwijzing_name={props.state.data.header.metode_aanwijzing_name}
                            metode_penyampaian_name={props.state.data.header.metode_penyampaian_name}
                            metode_evaluasi={props.state.data.header.metode_evaluasi}
                            metode_negosiasi={props.state.data.header.metode_negosiasi}
                            multiwinner={props.state.data.header.multiwinner}
                            bid_bond={props.state.data.header.bid_bond}
                            bid_bond_value={props.state.data.header.bid_bond_value}
                        />
                        <DocumentTender
                            data={props.state.data.doc_tender}
                        />
                        <DocumentVendor
                            data={props.state.data.dokumen_vendor}
                        />
                        <BidBondDocument
                            data = {props.state.data.bidbond}
                        />
                        <Items
                            data={props.state.data.items}
                            quotations_detail = {props.state.data.quotations_detail}
                            metode_evaluasi={props.state.data.header.metode_evaluasi}
                            item={props.state.data.harga_item_penawaran_peserta}
                        />

                        <Persyaratan 
                            data={props.state.data.detail_persyaratan}
                            isMonitoring={props.state.isMonitoring}
                        />

                        <Process
                        status={props.state.statusOptions}
                        loadings={props.state.loadings}
                        header={props.state.data.header}
                        back={(e)=>props.back(e)}
                        isMonitoring={props.state.isMonitoring}
                        />
                </form>
            </FormContext>
        </div>
    );
}

export default withTranslation()(Form);
