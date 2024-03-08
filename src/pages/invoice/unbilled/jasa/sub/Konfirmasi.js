import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const Konfirmasi = (props) => {
    const { t } = props;  

    return (
        <div>
            <ModalBody>
                <center>
                    <h5>
                        Purchase Order akan dibuat bedasarkan PR Item yang terpilih.<br></br>Apakah Anda yakin?
                    </h5>
                </center>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" type="submit" onClick={() => props.save()}>Confirm</button>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>{t("costCenter:button.close")}</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(Konfirmasi);
