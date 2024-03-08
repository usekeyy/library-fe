import React from 'react';
// import { useFormContext } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { formatNumber } from '../../../../helpers/formatNumber';

const Evaluasi = (props) => {
    // const { t } = props;  
    let rows;

    if (props.data !== undefined) {
        let data = props.data.evaluasi_vendor
        rows = Object.keys(data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>{index+1}</td>
                    <td>{data[key]['vendor_id']}</td>
                    <td>{data[key]['vendor_name']}</td>
                    {props.metode_evaluasi === 'sistem_nilai' && <td align="right">{data[key]['nilai_teknis']}</td>}
                    <td align="right">{data[key]['hasil_teknis']}</td>
                    {props.metode_evaluasi === 'sistem_nilai' && <td align="right">{data[key]['nilai_komersil']}</td>}
                    <td align="right">{data[key]['hasil_komersil']}</td>
                    {props.metode_evaluasi === 'sistem_nilai' && <td align="right">{formatNumber(data[key]['total_nilai'],2)}</td>}
                    <td>{data[key]['status']}</td>
                </tr>
            )
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Hasil Evaluasi</PanelHeader>
                <PanelBody >
                    <div className="row">
                        <div className={props.metode_evaluasi === 'sistem_nilai' ? "col-sm-8" : "col-sm-12"}>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>No Peserta</th>
                                            <th>Name Peserta</th>
                                            {props.metode_evaluasi === 'sistem_nilai' && <th>Nilai Teknis</th>}
                                            <th>Hasil Teknis</th>
                                            {props.metode_evaluasi === 'sistem_nilai' && <th>Nilai Commersial</th>}
                                            <th>Hasil Commersial</th>
                                            {props.metode_evaluasi === 'sistem_nilai' && <th>Total Nilai</th>}
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                        {props.metode_evaluasi === 'sistem_nilai' && 
                        <div className="col-sm-4">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <tbody>
                                        <tr>
                                            <td>Bobot Teknis</td>
                                            <td>{props.data !== undefined ? ( props.data.ambang_batas !== undefined && props.data.ambang_batas !== null && props.data.ambang_batas?.length > 0 ? props.data.ambang_batas.bobot_teknis : '') : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Passing Grade Teknis</td>
                                            <td>{props.data !== undefined ? ( props.data.ambang_batas !== undefined && props.data.ambang_batas !== null && props.data.ambang_batas?.length > 0 ? props.data.ambang_batas.passing_grade_teknis : '') : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Bobot Komersil</td>
                                            <td>{props.data !== undefined ? ( props.data.ambang_batas !== undefined && props.data.ambang_batas !== null && props.data.ambang_batas?.length > 0 ? props.data.ambang_batas.bobot_komersil : '') : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>Passing Grade Total</td>
                                            <td>{props.data !== undefined ? ( props.data.ambang_batas !== undefined && props.data.ambang_batas !== null && props.data.ambang_batas?.length > 0 ? props.data.ambang_batas.passing_grade : '') : ''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        }
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Evaluasi);
