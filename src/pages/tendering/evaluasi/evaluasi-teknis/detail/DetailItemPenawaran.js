import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const DetailItemPenawaran = (props) => {
    const { t, tipe } = props;
    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Detail Item</PanelHeader>
                {console.log(tipe)}
                <PanelBody >
                    <div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tender</th>
                                            <th>{t("evaluation:label.offer")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{t("evaluation:label.no-pr")}</td>
                                            <td>{props.data.tender.number_pr}</td>
                                            <td>{props.data.penawaran.number_pr}</td>
                                        </tr>
                                        <tr>
                                            <td>No PR Item</td>
                                            <td>{props.data.tender.item_no}</td>
                                            <td>{props.data.penawaran.item_no}</td>
                                        </tr>
                                        <tr>
                                            <td>{t("evaluation:label.item-type")}</td>
                                            <td>{props.data.tender.short_text}</td>
                                            <td>{props.data.tender.short_text}</td>
                                        </tr>
                                        {tipe === "barang" && 
                                        <tr>
                                            <td>{t("evaluation:label.no-material")}</td>
                                            <td>{props.data.tender.material_no}</td>
                                            <td>{props.data.tender.material_no}</td>
                                        </tr>
                                        }
                                        <tr>
                                            <td>Item</td>
                                            <td>{props.data.tender.item_no}</td>
                                            <td>{props.data.penawaran.item_no}</td>
                                        </tr>
                                        {tipe === "barang" ? 
                                        <tr>
                                            <td>{t("evaluation:label.specification")}</td>
                                            <td>{props.data.tender.spesifikasi}</td>
                                            <td>{(props.data.penawaran.spesifikasi===null) ?  props.data.tender.spesifikasi: props.data.penawaran.spesifikasi}</td>
                                        </tr>
                                        :
                                        <>
                                            
                                        <tr>
                                            <td>Service Line</td>
                                            <td>{`[${props.data.tender.service_line_number}] ${props.data.tender.service_line}`}</td>
                                            <td>{`[${props.data.penawaran.service_line_number}] ${props.data.penawaran.service_line}`}</td>
                                        </tr>
                                            
                                        </> 
                                        }
                                        <tr>
                                            <td>Quantity</td>
                                            <td>{props.data.tender.qty}</td>
                                            <td>{props.data.penawaran.qty}</td>
                                        </tr>
                                        <tr>
                                            <td>{t("evaluation:label.currency")}</td>
                                            <td>{props.data.tender.currency}</td>
                                            <td>{props.data.penawaran.currency}</td>
                                        </tr>
                                        <tr>
                                            <td>{t("evaluation:label.delivery-time")}</td>
                                            <td>{props.data.tender.delivery_time}</td>
                                            <td>{props.data.penawaran.delivery_time}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(DetailItemPenawaran);
