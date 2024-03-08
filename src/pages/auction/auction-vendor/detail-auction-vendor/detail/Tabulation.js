import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelBody, PanelHeader } from '../../../../../containers/layout/sub/panel/panel';
import ReactLoading from "react-loading";
import { formatNumber } from '../../../../../helpers/formatNumber';
import { formatDate } from '../../../../../helpers/formatDate';


const Tabulation = (props) => {
    // const { t } = props;
    // const [loading] = React.useState(false)
    // const { register } = useFormContext();
    let rows;

    if (props.data?.length > 0) {
        rows = props.data?.map((row, i) => {
            // let peserta = [];
            return (
                <div className="row" key={i}>
                    <div className="table-responsive m-t-10">
                        <table className="table table-bordered table-striped table-sm">
                            <thead>
                                <tr style={{ backgroundColor: "grey"}}>
                                    <th style={{fontWeight:"bold"}}>No</th>
                                    <th style={{ width: "30%", fontWeight:"bold" }}>Description</th>
                                    <th style={{fontWeight:"bold"}}>Currency</th>
                                    <th style={{fontWeight:"bold"}}>Quantity</th>
                                    <th style={{fontWeight:"bold"}}>Unit Price</th>
                                    <th style={{fontWeight:"bold"}}>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{i + 1}</td>
                                    <td>{row['long_text']}</td>
                                    <td>{row['currency']}</td>
                                    <td align="right">{formatNumber(row['qty'], 2)}</td>
                                    <td align="right">{formatNumber(row['valuation_price'], 2)}</td>
                                    <td align="right">{formatNumber(row['total_price'], 2)}</td>
                                </tr>

                                <tr style={{ backgroundColor: "grey" , fontWeight:"bold"}}>
                                    <td colSpan="2">Date</td>
                                    <td>Vendor</td>
                                    <td>Quantity</td>
                                    <td>Unit Price</td>
                                    <td>Total Price</td>
                                </tr>
                                {
                                    row['peserta']?.map((element, j) => {
                                        return (
                                            <tr key={j}>
                                                <td colSpan="2">{formatDate(element['created_at'], true)}</td>
                                                <td>{element['vendor_name']}</td>
                                                <td align="right">{formatNumber(element['qty'], 2)}</td>
                                                <td align="right">{formatNumber(element['unit_price'], 2)}</td>
                                                <td align="right">{formatNumber(element['total'], 2)}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        })
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Tabulation Action</PanelHeader>
                {props.loadings.loading_data_tabulation &&
                    <PanelBody>
                        <center>
                            <br />
                            <ReactLoading type="cylon" color="#0f9e3e" />
                            <br />
                        </center>
                    </PanelBody>
                }
                {!props.loadings.loading_data_tabulation &&
                    <PanelBody>
                        {rows}
                    </PanelBody>
                }
            </Panel>
        </div>
    );
}

export default withTranslation()(Tabulation);