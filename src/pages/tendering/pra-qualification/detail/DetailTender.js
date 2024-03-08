import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';


const DetailTender = (props) => {
    // const { t } = props;
    // let rows;

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Tender</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Pengadaan</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_pengadaan_name !== undefined ? props.metode_pengadaan_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Praqualification</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.pra_qualification !== undefined ? (props.pra_qualification==="n" || props.pra_qualification==="0")? "Not Active" : "Active" : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Aanwijzing</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_aanwijzing_name !== undefined ? props.metode_aanwijzing_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Penyampaian</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_penyampaian_name !== undefined ? props.metode_penyampaian_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Evaluasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_evaluasi !== undefined ? props.metode_evaluasi : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Negoisasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_negosiasi !== undefined ? props.metode_negosiasi : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Multi Winner</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.multiwinner !== undefined ? props.multiwinner==="0" ? "Not Active" : "Active" : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Bid Bond</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.bid_bond !== undefined ? props.bid_bond==="1" ? props.bid_bond_value : "Not Active" : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Order Placement</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.order_placement !== undefined ? props.order_placement: ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Incoterm</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.incotermn !== undefined ? props.incotermn : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Visibilitas Bid Opening</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.visibilitas_bid_open !== undefined ? props.visibilitas_bid_open : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Lokasi Pengiriman</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.delivery_location !== undefined ? props.delivery_location : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Masa Berlaku Penawaran</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.masa_berlaku !== undefined ? props.masa_berlaku +" Hari": ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Delivery Time</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.delivery_time !== undefined ? props.delivery_time +" Hari": ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Lingkup Pekerjaan</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.lingkup_pekerjaan !== undefined ? props.lingkup_pekerjaan : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Note Internal</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.note_internal !== undefined ? props.note_internal : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Note External</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.note_external !== undefined ? props.note_external : ''}</label>
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
