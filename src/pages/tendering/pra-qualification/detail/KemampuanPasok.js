import React from 'react';
// import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { RowEmpty } from '../../../../components/tableoptions/TableOptions';
// import { statusName } from '../../../../helpers/statusName';
// import makeAnimated from 'react-select/animated';
// import Select from 'react-select';
// import ReactLoading from 'react-loading';
// import { toastr } from 'react-redux-toastr';
// const animatedComponents = makeAnimated();

const KemampuanPasok = (props) => {
    // const { t } = props;
    let rows;

    if (props.data_header !== undefined) {
        rows = Object.keys(props.data_header).map(function (key, index) {
            function filter_array(event) {
                return event.sub_bidang_usaha_id.slice(0, 2) === props.data_header[key]['bidang_usaha_id']
            }
            let filtered = props.data_item.filter(filter_array)
            if ( filtered.length > 0 ) {
                return (
                    filtered.map(function(item, index2) {
                        return (
                            <tr key={key+'-'+index2}>
                                {index2 === 0 &&
                                    <td rowSpan={filtered.length} style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{props.data_header[key]['bidang_usaha_id']} - {props.data_header[key]['bidang_usaha_name']}</td>
                                }
                                <td>{item.sub_bidang_usaha_id + ' - ' + item.sub_bidang_usaha_name }</td>
                            </tr>
                        )
                    })
                )
            }
            else {
                return (
                    <tr key={key+'-null'}>
                        <td style={{width:"1%", textAlign: 'center', verticalAlign: 'middle'}}>{props.data_header[key]['bidang_usaha_id']} - {props.data_header[key]['bidang_usaha_name']}</td>
                        <td></td>
                    </tr>
                )
            }
        });
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Kemampuan Pasok</PanelHeader>
                <PanelBody >
                    <div className="row m-t-10">
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Header</th>
                                            <th>Item</th>
                                        </tr>
                                        </thead>
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(KemampuanPasok);
