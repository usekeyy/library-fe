import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const DetailTender = (props) => {
    const { t } = props;
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Tender</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.procurment-method")}</label>
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
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.aanwijzing-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_aanwijzing_name !== undefined ? props.metode_aanwijzing_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.delivery-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_penyampaian_name !== undefined ? props.metode_penyampaian_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.evaluation-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_evaluasi !== undefined ? props.metode_evaluasi : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.negoitation-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_negosiasi !== undefined ? props.metode_negosiasi : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.multi-winner")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.multiwinner !== undefined ? props.multiwinner==="0" ? "Not Active" : "Active" : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("aanwijzing:label.bid-open")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.bid_bond !== undefined ? props.bid_bond==="1" ? props.bid_bond_value + " %" : "Not Active" : ''}</label>
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
