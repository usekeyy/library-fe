import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';
// import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';

const KonfirmasiCetak = (props) => {
    // console.log(props)
    // const { t } = props;  

    return (
        <div>
            <ModalBody>
                <p>
                    Dokumen Invoice dengan nomor {props.data.invoice_no} berhasil submit ke Verifikator 1. Silahkan cetak form checklist dokumen hardcopy invoice untuk proses verifikasi selanjutnya.
                </p>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-success" type="submit" onClick={(e) => props.save(e)}>Print Now</button>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>Print Later</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(KonfirmasiCetak);
