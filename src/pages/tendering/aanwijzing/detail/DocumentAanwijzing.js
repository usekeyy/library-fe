import React from 'react';
import { withTranslation } from 'react-i18next';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatDate } from '../../../../helpers/formatDate';



const DocumentAanwijzing = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['attachment_type']}</td>
                    <td>{props.data[key]['attachment_description']}</td>
                    <td>{<a className="pull-right" target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}files/tendering/${props.data[key]['file']}` } > {props.data[key]['file']} </a>}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{formatDate(props.data[key]['updated_at'],true)}</td>
                    <td><input type="checkbox"  disabled={true} checked={parseInt(props.data[key]['share'])===1 ? true : false} /></td>                    
                </tr>
            )
        });
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='7'>{t("common:Tabel.empty-row")}</RowEmpty>)
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.procurment-document")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("dur:label.type-attactment")}</th>
                                            <th>{t("dur:label.description")}</th>
                                            <th>{t("dur:label.file")}</th>
                                            <th>{t("dur:label.upload-by")}</th>
                                            <th>{t("dur:label.upload-at")}</th>
                                            <th>{t("dur:label.share")}</th>
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

export default withTranslation()(DocumentAanwijzing);