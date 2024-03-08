import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';


const DetailTender = (props) => {
    const { t } = props;

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("evaluation:panel-title.detail-tender")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("evaluation:label.procurment-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_pengadaan_name !== undefined ? props.metode_pengadaan_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">Praqualification</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.pra_qualification !== undefined ? (props.pra_qualification==="n" || props.pra_qualification===0)? "Not Active" : "Active" : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                            <label className="col-sm-3 col-form-label">{t("evaluation:label.aanwijzing-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_aanwijzing_name !== undefined ? props.metode_aanwijzing_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("evaluation:label.delivery-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_penyampaian_name !== undefined ? props.metode_penyampaian_name : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                            <label className="col-sm-3 col-form-label">{t("evaluation:label.evaluation-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_evaluasi !== undefined ? props.metode_evaluasi.replace("_", " ") : ''}</label>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-3 col-form-label">{t("evaluation:label.negoitation-method")}</label>
                                <div className="col-sm-9">
                                    <label className=" col-form-label">: {props.metode_negosiasi !== undefined ? props.metode_negosiasi.replace("_", " ") : ''}</label>
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
                                    <label className=" col-form-label">: {props.bid_bond !== undefined ? props.bid_bond==="1" ? props.bid_bond_value +" %" : "Not Active" : ''}</label>
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
