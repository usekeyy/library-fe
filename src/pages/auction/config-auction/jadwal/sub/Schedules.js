import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
// const animatedComponents = makeAnimated();

const Schedules = (props) => {
    const { t } = props;
    const { register, control } = useFormContext();
		
		const times = window?.localStorage?.getItem('times');
		const header_status = props.header?.status;
		const start_date_auction = props.header?.start_auction;
		const isStartAuction = new Date(times).valueOf() > new Date(start_date_auction).valueOf();
		const isDisabled = (header_status === 'p' || header_status === 'n') 
												? (start_date_auction===null ? false : header_status==="n" ? false : isStartAuction)
												: true;
		// console.log(
		// 	new Date(times).valueOf() > new Date(start_date_auction).valueOf()
		// );
		// console.log(
		// 	new Date(start_date_auction).valueOf()
		// );
    return (
        <div>
            <Panel>
                <PanelHeader>
                    {t("auction:panel.schedule-auction")}
                </PanelHeader>
                <PanelBody>
                    <div className="row form-group">
                        <label className="col-sm-2 col-form-label">{t("auction:label.start-date-auction")}</label>
                        <div className="col-sm-10">
                        <Controller
                            name="start_auction"
                            control={control}
                            as={<Datetime 
                                dateFormat="DD-MM-YYYY"
                                // timeFormat={true}
                                timeFormat="HH:mm:ss"
                                inputProps={{ placeholder: "DD-MM-YYYY H:i:s" , disabled:(props.access.C || props.access.U) ? isDisabled : true}}                                
                            />}
                        />
                            {props.errors?.start_auction && <span className="text-danger">{props.errors?.start_auction}</span>}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-sm-2 col-form-label">{t("auction:label.finish-date-auction")}</label>
                        <div className="col-sm-10">
                        <Controller
                            name="end_auction"
                            control={control}
                            as={<Datetime 
                                dateFormat="DD-MM-YYYY"
                                // timeFormat={true}
                                timeFormat="HH:mm:ss"
                                inputProps={{ placeholder: "DD-MM-YYYY H:i:s",  disabled:(props.access.C || props.access.U) ? isDisabled :true }}
                            />}
                        />
                        {props.errors?.end_auction && <span className="text-danger">{props.errors?.end_auction}</span>}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-sm-2 col-form-label">{t("auction:label.note")}</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" 
                                name="note"
                                ref={register()}
                                disabled={(props.access.C || props.access.U) ? isDisabled : true }
                            />
                            {props.errors?.note && <span className="text-danger">{props.errors?.note}</span>}
                        </div>
                    </div>
                    <div className="row pull-right">
                        {(props.access.C || props.access.U) &&
                            <button
                                type="submit"
                                className="btn btn-success m-r-5"
                                disabled={(props.access.C || props.access.U) ? props.loadings.loading_submit_schedule || isDisabled: true}
                            >
                                {props.loadings.loading_submit_schedule && <i className="fa fa-spinner fa-spin"></i> } 
                                {isStartAuction ? t("auction:button.save-draft") : t("auction:button.edit")}
                                </button>
                        }
                        <button
                            type="button"
                            className="btn btn-white m-r-5"
                            onClick={()=>props.toAuctionList()}
                        >
                            {t("auction:button.cancel")}
                    </button>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Schedules);
