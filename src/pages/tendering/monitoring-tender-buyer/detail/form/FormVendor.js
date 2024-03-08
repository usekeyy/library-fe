import React from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';
import { withTranslation } from 'react-i18next';

const FormVendor = (props) => {
    // const {data} = props;
    // console.log(data)
	// const onSubmit = async data => {
    //     console.log(data)
	// 	props.save(data)
	// };

	return (
		<div>
				<ModalBody>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-sm text-nowrap">
                            <thead>
                                    <tr>
                                        <th>Tipe File</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Aanqijzing</td>
                                    <td>Expired</td>
                                    <td><button className="btn btn-white">Lihat File</button></td>
                                </tr>
                            </tbody>
                    </table>
            </div>
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

export default withTranslation() (FormVendor);