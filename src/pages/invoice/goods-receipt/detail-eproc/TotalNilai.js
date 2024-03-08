import React from 'react';
import { withTranslation } from 'react-i18next';
import { formatNumber2 } from '../../../../helpers/formatNumber';
import { Row } from 'reactstrap';
import ReactLoading from 'react-loading';

const TotalNilai = (props) => {
    let curr = props.data.items !== undefined && (props.data.items.length > 0 && props.data.items[0].currency !== null ? props.data.items[0].currency : 'IDR')
    const calculate = (code) => {
        let total = 0
        if (props.data.items !== undefined) {
            if (code !== '') {
                props.data.items.forEach(items => {
                    if (props.checklist.items_selected.includes(items.po_item_id)) {
                        if (code === 'item') {
                            if (items.jenis_item === "barang") {
                                total += parseFloat(items.amount)
                            }
                            else {
                                items.service_line.forEach(service_line => {
                                    total += parseFloat(service_line.harga_satuan) * parseFloat(service_line.qty)
                                });
                            }
                        }
                        else if (code === 'penalty') {
                            total += parseFloat(items.total_penalty)
                        }
                        else if (code === 'add_cost') {
                            items.add_cost.forEach(add_cost => {
                                total += parseFloat(add_cost.amount_confirm)
                            });
                        }
                    }
                });
            }
            else {
                let total_item = 0
                let total_add_cost = 0
                let total_penalty = 0
                props.data.items.forEach(items => {
                    if (props.checklist.items_selected.includes(items.po_item_id)) {
                        if (items.jenis_item === "barang") {
                            total_item += parseFloat(items.amount)
                            items.add_cost.forEach(add_cost => {
                                total_add_cost += parseFloat(add_cost.amount_confirm)
                            });
                        }
                        else {
                            items.service_line.forEach(service_line => {
                                total_item += parseFloat(service_line.harga_satuan) * parseFloat(service_line.qty)
                            });
                        }
                        total_penalty += parseFloat(items.total_penalty)
                    }
                });
                total = (parseFloat(total_item) + parseFloat(total_add_cost) - parseFloat(total_penalty)).toFixed(2);
            }
        }
        total = parseFloat(total).toFixed(2)
        return total
    }

    return (
        <div>
            {props.loadings.item && (
                <center>
                <br />
                <ReactLoading type="cylon" color="#0f9e3e" />
                <br />
                </center>
            )}
            {props.loadings.item === false && (
                <Row style={{paddingTop: "40px"}}>
                    <div className="col-sm-12">
                        <h5><b>Add Cost & Penalty Calculation :</b></h5>
                        {props.data.items !== undefined && props.data.items.length > 0 &&
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-sm text-nowrap" align="left">
                                            <tbody>
                                                <tr>
                                                    <td style={{width:'60%'}}>Total Amount Barang</td>
                                                    <td align="right">{formatNumber2(calculate('item'), 2)}</td>
                                                    <td style={{width:'1%'}}>{curr}</td>
                                                </tr>
                                                {props.data.items[0].jenis_item === "barang" &&
                                                    <tr>
                                                        <td>Total Additional Cost</td>
                                                        <td align="right">{formatNumber2(calculate('add_cost'), 2)}</td>
                                                        <td style={{width:'1%'}}>{curr}</td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td>Total Penalty</td>
                                                    <td align="right" style={{color: 'red'}}>{formatNumber2(calculate('penalty'), 2)}</td>
                                                    <td style={{width:'1%'}}>{curr}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Keseluruhan Amount</td>
                                                    <td align="right">{formatNumber2(calculate(''), 2)}</td>
                                                    <td style={{width:'1%'}}>{curr}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Row>
            )}
        </div>
    );
}

export default withTranslation()(TotalNilai);