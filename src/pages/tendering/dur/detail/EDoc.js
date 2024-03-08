import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';

const EDoc = (props) => {
    const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['title']}</td>
                    <td>
                        <button className="btn btn-xs btn-lime" onClick={(e) => details(e,props.data[key]['uuid'])} value={props.data[key]['uuid']} ><i className="danger fa fa-eye"></i></button>
                    </td>
                </tr>
            )
        });
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='3'>Tidak ada data</RowEmpty>)
    }

    const details = (e, data) => {
		props.modalsEdoc(data)
        e.preventDefault()
	}

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.e-document")}</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("dur:label.title")}</th>                                         
                                            <th>{t("dur:label.action")}</th>
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

export default withTranslation()(EDoc);
