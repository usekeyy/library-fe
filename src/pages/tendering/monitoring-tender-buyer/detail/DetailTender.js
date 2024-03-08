import React from 'react';
// import { useFormContext } from 'react-hook-form';
import {withTranslation} from 'react-i18next';
import {Panel, PanelHeader, PanelBody} from '../../../../containers/layout/sub/panel/panel';



const DetailTender = (props) => {
    const {data} = props

    const camelcase = (str) => {
        if (str !== undefined){
            str = str.replace("_", " ");
            const words = str.split(" ");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }
            
            return words.join(" ");
        }
    }
    return (
        <div>
            <Panel>
                <PanelHeader>Detail Tender</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Pengadaan</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.metode_pengadaan_name}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Praqualification</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.pra_qualification}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Aanwijzing</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.metode_aanwijzing_name}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Penyampaian</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.metode_penyampaian_name}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Evaluasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {camelcase(data?.metode_evaluasi)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Negosiasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {camelcase(data?.metode_negosiasi)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Multi Winner</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.multiwinner}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Bid Bond</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.bid_bond}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Order Placement</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {camelcase(data?.order_placement)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Incoterm</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {camelcase(data?.incoterm)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Visibilitas Bid Opening</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {camelcase(data?.visibilitas_bid_open)}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Lokasi Pengiriman</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.delivery_location}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Masa Berlaku Penawaran</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.masa_berlaku + " Hari"}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Delivery Time</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.delivery_time + " Hari"}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Lingkup Pekerjaan</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.lingkup_pekerjaan}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Note Internal</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.note_internal}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Note External</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {data?.note_eksternal}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DetailTender);
