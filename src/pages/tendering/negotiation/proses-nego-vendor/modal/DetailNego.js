import React from 'react';
// import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { toastr } from 'react-redux-toastr';
import { ModalBody, ModalFooter } from 'reactstrap';


const DetailNego = (props) => {
		const { t } = props;
		// const {header} = props.parentState.proses_nego_vendor;
		// const {errors} = props.parentState.proses_nego_vendor;
		const {loadings} = props.parentState;

    return (
        <div>
					<ModalBody>
						<Panel className="margin-bot-false">
								<PanelHeader>Detail Negosiasi</PanelHeader>
								<PanelBody >
										<div className="row">
											<div className="col-sm-12">
												
												
											</div>
										</div>
								</PanelBody>
						</Panel>
					</ModalBody>
					<ModalFooter>
						<button className="btn btn-white" type="button" onClick={() => props.toggleClose()} disabled={loadings.button}>{t("currency:button.close")}</button>
					</ModalFooter>
        </div>
    );
}

export default withTranslation()(DetailNego);