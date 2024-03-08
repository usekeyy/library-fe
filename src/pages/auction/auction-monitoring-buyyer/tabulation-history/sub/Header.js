import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import { statusAuction } from '../../../../../helpers/statusName';

const Header = (props) => {
    const { t } = props;
    return (
        <div>
            <Panel className="m-t-5">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.no-auction")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.auction_number !== undefined ? props.data.auction_number : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.no-proposal-tender")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.proposal_tender_no !== undefined ? props.data.proposal_tender_no : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.buyyer-name")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.created_by_name !== undefined ? props.data.created_by_name : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.description")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.auction_description !== undefined ? props.data.auction_description : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.start-date-auction")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.start_auction !== undefined ? formatDate(props.data.start_auction, true) : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.finish-date-auction")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {props.data?.end_auction !== undefined ? formatDate(props.data.end_auction, true) : ''}</label>
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-4 col-form-label">{t("auction:label.status")}</label>
                        <div className="col-sm-8">
                            <label className=" col-form-label">: {(props.data?.status !== undefined && props.data?.status !== null)? 
                                (props.data.status==="p") ? (Date.now() < new Date(props.data.start_auction)) ? "Waiting" : (Date.now() > new Date(props.data.start_auction) && Date.now() < new Date(props.data.end_auction)) ? "Live" : "Done" : 
                                statusAuction(props.data.status) : ''}
                            </label>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);