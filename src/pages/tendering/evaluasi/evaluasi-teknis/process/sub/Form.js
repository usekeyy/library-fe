import React from 'react';
import { withTranslation } from 'react-i18next';
import { useForm, FormContext } from "react-hook-form";
import { Panel, PanelHeader, PanelBody } from '../../../../../../containers/layout/sub/panel/panel';
import Header from '../../detail/Header'
import DetailTender from '../../detail/DetailTender'
import DocumentTender from '../../detail/DocumentTender'
import Items from '../../detail/Items'
import HasilEvaluasi from './HasilEvaluasi'
import KlarifikasiTeknis from './KlarifikasiTeknis'
// import { toastr } from 'react-redux-toastr';


const Form = (props) => {
    // const { t } = props;
    const methods = useForm();

    const onSubmit = data => {
        if (props.data.metode_evaluasi === "sistem_nilai") {
            let payload = setData(data);
            // console.log(payload)
            props.storeEvaluasiTeknisScore(payload)
        } else {
            // console.log(setDataSistemGugur(data))
            props.storeEvaluasiTeknisScore(setDataSistemGugur(data))
        }
    };

    const setData = (data) => {
        let arr;
        arr = data.penilaian.map((i, index) => {
            return (
                {
                    proposal_tender_syarat_id: data.proposal_tender_syarat_id[index],
                    score: (data.penilaian[index] === "") ? null : parseFloat(data.penilaian[index]),
                    status: data.result,
                    catatan: data.catatan[index]
                }
            )
        })
        return arr
    }

    const setDataSistemGugur = (data) => {
        let arr;
        arr = data.proposal_tender_syarat_id.map((i, index) => {
            return (
                {
                    proposal_tender_syarat_id: data.proposal_tender_syarat_id[index],
                    score: '',
                    status: (data.penilaian[index] === null || data.penilaian[index] === "") ? null : data.penilaian[index].value,
                    catatan: data.catatan[index]
                }
            )
        })
        return arr
    }

    return (
        <div>
            <FormContext {...methods} >
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Header
                        proposal_tender_no={props.data.proposal_tender_no}
                        description={props.data.title}
                        // status={props.data.assignment}
                        status={props.data.status_proses === null ? "Process" : props.data.status_proses}
                        vendor={true}
                        vendor_name={props.data.vendor_name}
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
                        bid_bond_value={props.data.bid_bond_value}
                        order_placement={props.data.order_placement}
                    />
                    <DocumentTender
                        data={props.data.dokumen_vendor}
                    />
                    <Items
                        data={props.data.items}
                        getEvaluasiTeknisCompare={(pr_item_id, pr_service_id, tipe) => props.getEvaluasiTeknisCompare(pr_item_id, pr_service_id, tipe)}
                    />


                    <KlarifikasiTeknis
                        assignment={props.data.assignment}
                        has_roles={props.has_roles}
                        upload={props.upload}
                        loadings={props.loadings}
                        klarifikasiList={props.klarifikasiList}
                        storeEvaluasiTeknisKlarifikasi={(payload) => props.storeEvaluasiTeknisKlarifikasi(payload)}
                        isMonitoring={props.isMonitoring}
                    />

                    <HasilEvaluasi
                        penilaianOptions={props.penilaianOptions}
                        hasilEvaluasiOptions={props.hasilEvaluasiOptions}
                        data={props.data.vendor}
                        metode_evaluasi={props.data.metode_evaluasi}
                        upload={props.upload}
                        loadings={props.loadings}
                        listAttactmentHasil={props.listAttactmentHasil}
                        ambang_batas={(props.data.ambang_batas === undefined || props.data.ambang_batas === null) ? 0 : props.data.ambang_batas.ambang_batas}
                        storeEvaluasiTeknisAttactment={(payload) => props.storeEvaluasiTeknisAttactment(payload)}
                        assignment={props.data.assignment}
                        showSweetAlert={(payload) => props.showSweetAlert(payload)}
                        has_roles={props.has_roles}
                        isMonitoring={props.isMonitoring}
                    />

                    {!props.isMonitoring &&
                        <Panel className="margin-bot-false">
                            <PanelHeader>Process</PanelHeader>
                            <PanelBody >
                                <div className="row pull-right m-t-10">
                                    <button type="submit" className="m-r-10 btn btn-info" disabled={props.loadings.loading_submit_evaluasi}>  {props.loadings.loading_submit_evaluasi && <i className="fa fa-spinner fa-spin"></i>} Save</button>
                                    <button type="button" className="m-r-10 btn btn-light" onClick={(e) => props.back(e)}> Back</button>
                                </div>
                            </PanelBody>
                        </Panel>}
                </form>
            </FormContext>
        </div>
    );
}

export default withTranslation()(Form);
