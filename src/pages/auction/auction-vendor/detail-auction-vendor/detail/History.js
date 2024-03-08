import React from 'react';
import { withTranslation } from 'react-i18next';
// import NumberFormat from 'react-number-format';
// import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';
// import ReactLoading from 'react-loading';


const History = (props) => {
    const { t } = props;
    let rows=[];
    rows.push(
        <tr key={0}>
            <td>1</td>
            <td>{props.headerhistory?.short_text}</td>
            <td>{props.headerhistory?.currency}</td>
            <td align="right">{formatNumber(props.headerhistory?.qty,2)}</td>
            <td align="right">{formatNumber(parseFloat(props.headerhistory?.valuation_price)/parseFloat(props.header.denominimilisasi),2)}</td>
            <td align="right">{formatNumber(parseFloat(props.headerhistory?.total_price)/parseFloat(props.header.denominimilisasi),2)}</td>
        </tr>
    )
    rows.push(
        <tr key={1} style={{backgroundColor:"#a8a8a8"}}>
            <td colSpan="3" style={{fontWeight:"bold"}}>Date</td>
            <td style={{fontWeight:"bold"}} >Kuantitas</td>
            <td style={{fontWeight:"bold"}} >Unit Price</td>
            <td style={{fontWeight:"bold"}} >Total Price</td>
        </tr>
    )

    if (props.data?.length > 0) {
        props.data.forEach((element,i) => {
            rows.push(
                <tr key={i+2}>
                    <td colSpan="3">{formatDate(element.created_at, true, true)}</td>
                    <td align="right">{formatNumber(element.qty,2)}</td>
                    <td align="right">{formatNumber(parseFloat(element.unit_price)/parseFloat(props.header.denominimilisasi),2)}</td>
                    <td align="right">{formatNumber(parseFloat(element.total)/parseFloat(props.header.denominimilisasi),2)}</td>
                </tr>
            )
        });
    }else{
        rows.push(
            <tr>
                <td colSpan="6">
                {t("common:Tabel.empty-row")}
                </td>
            </tr>
        )
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-sm text-nowrap">
                        <thead>
                            <tr style={{backgroundColor:"#a8a8a8"}}>
                                <th align="right" style={{fontWeight:"bold"}} >No</th>
                                <th align="right" style={{fontWeight:"bold"}} >Description</th>
                                <th align="right" style={{fontWeight:"bold"}} >Curr</th>
                                <th align="right" style={{fontWeight:"bold"}} >Kuantitas</th>
                                <th align="right" style={{fontWeight:"bold"}} >Initial Bid</th>
                                <th align="right" style={{fontWeight:"bold"}} >Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withTranslation()(History);