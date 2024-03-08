import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
import { Row } from 'reactstrap';
import { formatDate } from '../../../../../helpers/formatDate';

const Catatan = (props) => {
    const { t } = props;
    const { register,  handleSubmit } = useForm({});
	const onSubmit = async data => {
        data.status='publish'
		props.storeEvaluasiCommersialPublish(data)
	};
    let rows;
    if (props.data !== undefined) {
        rows = Object.keys(props.data).map(function (key, index) {
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

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Catatan</PanelHeader>
                <PanelBody>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>{t("evaluation:label.name")}</th>
                                            <th>{t("evaluation:label.process")}</th>
                                            <th>{t("evaluation:label.date")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="col-form-label">{t("evaluation:label.note")}</label>
                                <div className="col-lg-12">
                                    <textarea className="form-control" name="catatan" ref={register({})} />
                                    {/* {errors.note && <span className="text-danger">* This field is required</span>} */}
                                </div>
                            </div>
                            <div className="form-group">
                                {!props.isMonitoring &&
                                <div className="row pull-right m-t-10">
                                    <button type="submit"  className="m-r-10 btn btn-info" disabled={props.header.is_retender_itemize.includes('p') ? true : false}>  {t("common:Button.Publish")} </button>
                                    <button type="button" className="m-r-10 btn btn-light" onClick={(e)=>props.back(e)}> {t("common:Button.Kembali")} </button>
                                </div>
                                }
                            </div>
                        </div>
                    </Row>
                    </form>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Catatan);