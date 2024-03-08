import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';

const Form = (props) => {
    const { t } = props;  
    let rows;
    let i = 1;

    if (props.data !== undefined) {
        let count_verif = 0
        rows = Object.keys(props.data).map(function (key, index) {
            if (count_verif === 1 && props.data[key]['status_text'] === 'Verification') {
                return false
            }
            if (props.data[key]['status_text'] === 'Verification') {
                count_verif ++;
            }
            return (
                <tr key={key}>
                    <td>{i++}</td>
                    <td>{props.data[key]['status_text']}</td>
                    <td>{props.data[key]['position']}</td>
                    <td>{props.data[key]['created_at'] !== null && props.data[key]['created_at'] !== '' ? moment(props.data[key]['created_at']).format("DD-MM-YYYY HH:mm:ss") : ''}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <ModalBody>
				<div className="row">
					<div className="col-sm-12">
						<div className="table-responsive">
							<table className="table table-bordered table-striped table-sm text-nowrap">
								<thead>
									<tr>
										<th>No</th>
										<th>Status</th>
										<th>By</th>
										<th>Approved At</th>
									</tr>
								</thead>
								<tbody>{rows}</tbody>
							</table>
						</div>
					</div>
				</div>
            </ModalBody>
            <ModalFooter>
                {/* <button className="btn btn-success" type="submit" onClick={() => props.save(props.param)}>Confirm</button> */}
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Form);
