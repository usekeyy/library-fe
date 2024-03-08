import React from 'react';
// import { useFormContext, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../../helpers/formatDate';
// const animatedComponents = makeAnimated();



const History = (props) => {
    const { t } = props;
    // const { register, control } = useFormContext();
    let rows;
    // let sumTotal = 0;

    if(props.data?.length > 0) {
        rows = props.data?.map((dt, i) => {
            // sumTotal+=dt.total_price;
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{dt.description}</td>
                    <td>{dt.note}</td>
                    <td>{formatDate(dt.created_at, true)}</td>
                    <td>
                        <button className="btn btn-sm btn-white" type="button" onClick={() => props.openModalHistory (i)}>
                            {t("auction:button.detail")}
                        </button>
                    </td>
                </tr>
            )
        })

    }else{
        rows = (<RowEmpty colSpan='5'>{t("auction:table.empty-row")} </RowEmpty>);
    }

    return (
        <div>
            <Panel>
                <PanelHeader>
                    {t("auction:panel.history-auction")}
                </PanelHeader>
                <PanelBody>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("auction:label.description")}</th>
                                            <th>{t("auction:label.note")}</th>
                                            <th>{t("auction:label.date")}</th>
                                            <th>{t("auction:label.action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="row pull-right">
                        {props.access.C && 
                            <button
                                type="submit"
                                className="btn btn-success m-r-5"
                                disabled={((props.header?.status!=='n') ? true : false)}
                            >{t("auction:button.save-draft")}</button>
                        }
                        <button
                            type="button"
                            className="btn btn-white m-r-5"
                            onClick={() => props.toAuctionList ()}
                        >
                            {t("auction:button.cancel")}
                    </button>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(History);
