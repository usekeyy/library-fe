import React from 'react';
// import { useFormContext } from 'react-hook-form';
import {withTranslation} from 'react-i18next';
import {Panel, PanelHeader, PanelBody} from '../../../../containers/layout/sub/panel/panel';

const Detail = (props) => {
    // const {t} = props;
    const {header} = props.parentState.quotation;
    const show = false
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
                                    <label className=" col-form-label">: {
                                            header.metode_pengadaan !== undefined
                                                ? header.metode_pengadaan.name
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Praqualification</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.pra_qualification !== undefined
                                                ? (header.pra_qualification === "n" || header.pra_qualification === "0")
                                                    ? "Not Active"
                                                    : "Active"
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Aanwijzing</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.metode_aanwijzing !== undefined
                                                ? header.metode_aanwijzing.name
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Penyampaian</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.metode_penyampaian !== undefined
                                                ? header.metode_penyampaian.name
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Evaluasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.metode_evaluasi !== undefined
                                                ? header.metode_evaluasi
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Metode Negoisasi</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.metode_negosiasi !== undefined
                                                ? header.metode_negosiasi
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Multi Winner</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.multiwinner !== undefined
                                                ? header.multiwinner === "0"
                                                    ? "Not Active"
                                                    : "Active"
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Bid Bond</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {
                                            header.bid_bond !== undefined
                                                ? header.bid_bond === "1"
                                                    ? header.bid_bond_value
                                                    : "Not Active"
                                                : ''
                                        }</label>
                                </div>
                            </div>
                            {
                                show && <div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Order Placement</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.order_placement !== undefined
                                                            ? header.order_placement
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Incoterm</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.incotermn_id !== undefined
                                                            ? header.incotermn_id
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Visibilitas Bid Opening</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.visibilitas_bid_open !== undefined
                                                            ? header.visibilitas_bid_open
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Lokasi Pengiriman</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.delivery_location !== undefined
                                                            ? header.delivery_location
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Masa Berlaku Penawaran</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.masa_berlaku !== undefined
                                                            ? header.masa_berlaku + " Hari"
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Delivery Time</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.delivery_time !== undefined
                                                            ? header.delivery_time + " Hari"
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Lingkup Pekerjaan</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.lingkup_pekerjaan !== undefined
                                                            ? header.lingkup_pekerjaan
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Note Internal</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.note_internal !== undefined
                                                            ? header.note_internal
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3 col-form-label">Note External</label>
                                            <div className="col-sm-9">
                                                <label className=" col-form-label">: {
                                                        header.note_external !== undefined
                                                            ? header.note_external
                                                            : ''
                                                    }</label>
                                            </div>
                                        </div>
                                    </div>
                            }

                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Detail);
