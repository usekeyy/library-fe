import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../../components/tableoptions/TableOptions';
import ReactLoading from 'react-loading';
import { formatNumber } from '../../../../../helpers/formatNumber';
// const animatedComponents = makeAnimated();



const Score = (props) => {
    const { t } = props;
    // const { register, control } = useFormContext();
    let rows;
    // let sumTotal = 0;

    if (props.data !== undefined && props.data?.length > 0 && props.metode_penentuan_pemenang === "paket") {
        rows = props.data.map((dt, i) => {
            return (
                <tr key={i}>
                    <td>{dt.vendor_name}</td>
                    <td align="right">{formatNumber(dt.score_teknis, 2)}</td>
                    <td align="right">{formatNumber(dt.score_komersil, 2)}</td>
                    <td align="right">{formatNumber(dt.score_total, 2)}</td>
                </tr>
            )
        })
    }

    if (props.data !== undefined && props.data?.length > 0 && props.metode_penentuan_pemenang === "itemize") {
        rows = []
        props.data.forEach((dt,i)=>{
            dt['detail_bid'].forEach((child,j)=>{
                rows.push(
                    <tr key={i}>
                        <td>{child['vendor_name']}</td>
                        {j===0 && <td align="center" style={{verticalAlign: "middle"}} rowSpan={dt['detail_bid'].length}>{dt['short_text']}</td>}
                        <td align="right">{formatNumber(child['score_teknis'], 2)}</td>
                        <td align="right">{formatNumber(child['score_komersil'], 2)}</td>
                        <td align="right">{formatNumber(child['score_total'], 2)}</td>
                    </tr>
                )
            })
        })
    }

    if (props.data.score !== undefined && props.data?.score.length === 0 &&  props.metode_penentuan_pemenang === "paket") {
        rows = (<RowEmpty colSpan='4'>{t("auction:table.empty-row")} </RowEmpty>);
    }
    if (props.data.score !== undefined && props.data?.score.length === 0 &&  props.metode_penentuan_pemenang === "itemize") {
        rows = (<RowEmpty colSpan='5'>{t("auction:table.empty-row")} </RowEmpty>);
    }


    return (
        <div>
            <Panel>
                <PanelHeader>
                    {t("auction:panel.score-panel")}
                </PanelHeader>
                {props.loadings.loading_data_score &&
                    <PanelBody>
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    </PanelBody>
                }
                {!props.loadings.loading_data_score &&
                    <PanelBody>
                        <div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>{t("auction:label.vendor-name")}</th>
                                            {props.metode_penentuan_pemenang === "itemize" && <th>Description</th> }
                                            <th>Score Teknis</th>
                                            <th>Score Komersil</th>
                                            <th>Total Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(Score);
