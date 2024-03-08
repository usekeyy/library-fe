import React from 'react';
import { withTranslation } from 'react-i18next';
import { useForm, FormContext } from "react-hook-form";
import Header from '../../evaluasi-teknis/detail/HeaderKlarifikasi'
import DetailTender from '../../evaluasi-teknis/detail/DetailTender'
import DocumentTender from '../../evaluasi-teknis/detail/DocumentTender'
import KlarifikasiVendor from './KlarifikasiVendor'

const Form = (props) => {
    // const { t } = props;
    const methods = useForm();

    const onSubmit = data => {
        // let payload = setData(data);
    };

    // const setData  = (data) => {
    //     let arr ;
    //     arr = data.penilaian.map((i, index) => {
    //         return (
    //             {proposal_tender_syarat_id : data.proposal_tender_syarat_id[index],
    //             score : parseFloat(data.penilaian[index]),
    //             status : data.result,
    //             catatan  : data.catatan[index]}
    //         )
    //     })
    //     return arr
    // }


    return (
        <div>
            <FormContext {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Header
                        proposal_tender_no={props.data.proposal_tender_no}
                        description={props.data.title}
                        vendor = {true}
                        vendor_name = {props.data.vendor_name}
                        status={props.data.assignment}
                        due_date={props.data.due_date}
                    />
                    <DetailTender
                        metode_pengadaan_name={props.data.metode_pengadaan_name}
                        pra_qualification={props.data.pra_qualification}
                        metode_aanwijzing_name={props.data.metode_aanwijzing_name}
                        metode_penyampaian_name={props.data.metode_penyampaian_name}
                        metode_evaluasi={props.data.metode_evaluasi}
                        metode_negosiasi={props.data.metode_negosiasi}
                        multiwinner={props.data.multiwinner}
                        bid_bond={props.data.bid_bond}
                    />
                    <DocumentTender
                        data={props.data.doc_tender}
                    />

                    <KlarifikasiVendor 
                         upload={props.upload}
                         loadings={props.loadings}
                         klarifikasiList={props.klarifikasiData}
                         back ={() => props.back()}
                         due_date={props.data.due_date}
                         storeEvaluasiTeknisKlarifikasi = {(payload) => props.storeEvaluasiTeknisKlarifikasi (payload)}
                    />
                </form>
            </FormContext>
        </div>
    );
}

export default withTranslation()(Form);
