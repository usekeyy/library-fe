import React from 'react';
import { withTranslation } from 'react-i18next';
import { ModalBody, ModalFooter } from 'reactstrap';

const KonfirmasiPosting = (props) => {

    return (
        <div>
            <ModalBody>
                <p>
                    Dokumen Invoice dengan nomor: {props.data.invoice_number} telah berhasil diposting ke MIRO SAP dengan nomor: {props.data.sap_mm_number}.
                </p>
            </ModalBody>
            <ModalFooter>
                <button className="btn btn-white" onClick={() => props.toggleClose()}>Close</button>
            </ModalFooter>
        </div>
    );
}

export default withTranslation()(KonfirmasiPosting);
