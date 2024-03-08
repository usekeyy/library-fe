import React from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';

const FormRekapNegosiasi = (props) => {
    const {data} = props;
	return (
		<div>
				<ModalBody>
                    <Panel>
                        <PanelHeader>Detail Item Penawaran</PanelHeader>
                        
                        <PanelBody >
                            <div>Status Quote : <span className="text-red"><i>Deviate</i></span></div>
                            <br></br>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-wrap">
                                        <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Tender</th>
                                                    <th>Penawaran</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><b>No PR</b></td>
                                                <td>{data?.pr_number}</td>
                                                <td>{data?.pr_number}</td>
                                            </tr>
                                            <tr>
                                                <td><b>PR Item</b></td>
                                                <td>{data?.item_no}</td>
                                                <td>{data?.item_no}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Jenis Item</b></td>
                                                <td>{data?.tipe}</td>
                                                <td>{data?.tipe}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Material No</b></td>
                                                <td>{data?.material_id}</td>
                                                <td>{data?.material_id}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Spesifikasi</b></td>
                                                <td>{data?.pr_spesifikasi}</td>
                                                <td>{data?.spesifikasi}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Quantity</b></td>
                                                <td>{data?.pr_qty}</td>
                                                <td>{data?.qty}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Currency</b></td>
                                                <td>{data?.currency}</td>
                                                <td>{data?.currency}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Delivery Time</b></td>
                                                <td>{data?.delivery_time}</td>
                                                <td>{data?.delivery_time}</td>
                                            </tr>
                                            
                                        </tbody>
                                </table>
                        </div>
                        </PanelBody>
                    </Panel>
				</ModalBody>
				<ModalFooter>
					{/* <button className="btn btn-white" disabled={loading} onClick={() => props.toggleClose()}>{t("uom:button.cancel")}</button>
					<button className="btn btn-success" type="submit" disabled={loading}>
						{loading && <i className="fas fa-spinner fa-pulse"></i>}
						{props.uuid !== "" ? t("uom:button.update") : t("uom:button.submit")}
					</button> */}
                    {/* <button className="btn btn-white">update</button> */}
				</ModalFooter>
		</div>
	);
}

export default withTranslation() (FormRekapNegosiasi);