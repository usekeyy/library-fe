import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber';
// import moment from 'moment';


const PenaltyAddCost = (props) => {

    let rows;
    if (props.data.penalty_add_cost !== undefined) {
        let penalty = props.data.penalty_add_cost
        rows = Object.keys(penalty).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{penalty[key]['goods_receipt_number']}</td>
                    <td>{penalty[key]['goods_receipt_item_no']}</td>
                    <td>{penalty[key]['conditional_type']} - {penalty[key]['conditional_type_description']}</td>
                    <td>{penalty[key]['penalty_type']}</td>
                    <td>{formatNumber(penalty[key]['amount'], 2)}</td>
                    <td>{penalty[key]['currency']}</td>
                    <td>{penalty[key]['description']}</td>
                    <td>
                        <a className="col-form-label" onClick={(e) => props.toggleOpenPreview(e, penalty[key]['file'], `${process.env.REACT_APP_API_BASE_URL}files/invoice/${penalty[key]['file']}`)} href="/">{penalty[key]['file']}</a>
                    </td>
                </tr>
            )
        });
    }

    // const onChange = (e) => {
    //     props.setOption(e.target.value, 'notes')
    // } 

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Penalty & Additional Expense (Additional Cost)</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No. GR/SA</th>
                                            <th>Line Item</th>
                                            <th>Conditional Type</th>
                                            <th>Jenis Penalty</th>
                                            <th>Nilai</th>
                                            <th>Currency</th>
                                            <th>Description</th>
                                            <th>Lampiran</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    {/* <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">Catatan</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note" ref={register({ required: false })} onChange={(e) => onChange(e)}/>
                                    {errors.note && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row> */}
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(PenaltyAddCost);