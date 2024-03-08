import React from 'react';
import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
import { formatDate } from '../../../../helpers/formatDate';


const Catatan = (props) => {

    const { register } = useFormContext();
    let rows;
    const { t } = props;
    if (props.data !== undefined) {
        // console.log(props.data)
        let datax = props.data.sort((a,b) => (a.created_at > b.created_at) ? 1 : ((b.created_at > a.created_at) ? -1 : 0))
        rows = Object.keys(datax).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{(index+1)}</td>
                    <td>{props.data[key]['created_by_name']}</td>
                    <td>{props.data[key]['process']}</td>
                    <td>{props.data[key]['note']}</td>                    
                    <td>{formatDate(props.data[key]['created_at'], true)}</td>
                </tr>
            )
        });
    }

    if(props.data !== undefined && props.data.length===0){
        rows = (<RowEmpty colSpan='5'>Tidak ada data</RowEmpty>)
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>{t("dur:panel-title.note")}</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th>{t("dur:label.no")}</th>
                                            <th>{t("dur:label.name")}</th>
                                            <th>{t("dur:label.process")}</th>
                                            <th width="50%">{t("dur:label.note")}</th>
                                            <th>{t("dur:label.date")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">{t("dur:panel-title.note")}</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="note" ref={register({ required: false })} />
                                    {props.errors.includes('note') && <span className="text-danger">* This field is required</span>}
                                </div>
                            </div>
                        </div>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Catatan);