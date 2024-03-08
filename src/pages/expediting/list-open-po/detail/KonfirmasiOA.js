import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const Konfirmasi = (props) => {
    const { t } = props;  

    return (
        props.modalType === 'confirm-update' ?
            <div>
                <ModalBody>
                    <center>
                        <h5>
                            <b>
                                Purchase Order akan dibuat.<br></br>Apakah Anda yakin?
                            </b>
                        </h5>
                    </center>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-success" type="submit" onClick={() => props.save()}>Confirm</button>
                    <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
                </ModalFooter>
            </div>
        : 
            <div>
                <ModalBody>
                    <center>
                        <h5>
                            <b>
                                Purchase Order akan dibatalkan.<br></br>Apakah Anda yakin?
                            </b>
                        </h5>
                    </center>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-danger" type="submit" onClick={() => props.delete()}>Delete</button>
                    <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
                </ModalFooter>
            </div>
    );
}

export default withTranslation()(Konfirmasi);
