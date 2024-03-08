import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { formatNumber } from '../../../../helpers/formatNumber';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';

const ListEvaluasiTeknis = (props) => {
    const { t } = props;  
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{props.data[key]['description']}</td>
                    <td>{props.data[key]['bobot']}</td>
                </tr>
            )
        });
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>)
    }    
    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader noButton={true}>Aspek Teknis</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("dur:label.attactment")}</th>
                                            <th>Bobot</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(ListEvaluasiTeknis);