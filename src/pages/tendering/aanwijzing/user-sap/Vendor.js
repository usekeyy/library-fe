import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Button, Row, Col } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Vendor = (props) => {
    let rows
	const { control, register, setValue } = useForm({});
    const { t } = props;

    if (props.data_vendor !== undefined) {
        let data = props.data_vendor
        rows = Object.keys(data).map(function (key, index) {
            return (
                <tr key={key}>
                    <td>
                        <input type="checkbox" checked={props.vendor_checklist.items_selected.includes(data[key]['vendor_id'])}
                            onChange={(e) => props.handleChecklist(e, data[key], data[key]['vendor_id'])} />
                    </td>
                    <td>{index+1}</td>
                    <td>{data[key]['vendor_id']}</td>
                    <td>{data[key]['company_name']}</td>
                    <td>{data[key]['vendor_name']}</td>
                    <td>{data[key]['coi']}</td>
                    <td>{data[key]['score_vpr']}</td>
                    <td>{data[key]['category']}</td>
                    <td>{data[key]['status']}</td>
                    <td>{data[key]['po_open']}</td>
                    <td>{data[key]['po_outstanding']}</td>
                    <td>{data[key]['brand']}</td>
                    <td>{data[key]['expired_document']}</td>
                </tr>
            )
        });
    }


    const handleChangeBidangUsaha = (e) =>{
		setValue('sub_bidang_usaha_id', null)
		// let selected = e.value;
        props.setBidangUsaha(e)
        props.setSubBidangUsaha('')
	}

	const handleChangeSubBidangUsaha = (e) =>{
		// let selected = e.value;
        props.setSubBidangUsaha(e)
	}

	const onInputBidangUsaha = (option, { action }) => {
		if (action === "input-change") {
			props.fetchBidangUsaha(option)
		}
		if (action === "set-value") {
			props.fetchBidangUsaha('')
		}
	};
	const onInputSubBidangUsaha = (option, { action }) => {
		if (action === "input-change") {
			props.fetchSubBidangUsaha(option)
		}
		if (action === "set-value") {
			props.fetchSubBidangUsaha('')
		}
	};

    const submit = (e) => {
        e.preventDefault()
        props.addSos()
    }

    const reset = (e) => {
        e.preventDefault()
        props.resetSos()
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Vendor</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="row">
                                <div className="col-sm-12 form-group row">
                                    <div className="col-sm-1" style={{margin:'auto'}}> SOS Header </div>
                                    <div className="col-sm-5">
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.m_bidang_usaha}
                                            // defaultValue={props.data.bidang_usaha_id}
                                            onInputChange={onInputBidangUsaha}
                                            onChange={([selected]) => {
                                                handleChangeBidangUsaha(selected)
                                                return selected;
                                            }}
                                            inputRef={(e) => register({ name: "bidang_usaha_id", required: false })}
                                            name="bidang_usaha_id"
                                            placeholder={props.loadings.bidang_usaha_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                            isLoading={props.loadings.bidang_usaha_id}
                                            rules={{ required: false }}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 form-group row">
                                    <div className="col-sm-1" style={{margin:'auto'}}> SOS Item </div>
                                    <div className="col-sm-5">
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.m_sub_bidang_usaha}
                                            // defaultValue={props.data.sub_bidang_usaha_id}
                                            onInputChange={onInputSubBidangUsaha}
                                            onChange={([selected]) => {
                                                handleChangeSubBidangUsaha(selected)
                                                return selected;
                                            }}
                                            inputRef={(e) => register({ name: "sub_bidang_usaha_id", required: false })}
                                            name="sub_bidang_usaha_id"
                                            placeholder={props.loadings.sub_bidang_usaha_id ? t("common:Select.Sedang Memuat"): t("common:Select.Pilih") }
                                            isLoading={props.loadings.sub_bidang_usaha_id}
                                            isDisabled={props.isDisabled.sub_bidang_usaha_id}
                                            rules={{ required: false }}
                                        />
                                    </div>
                                    <div className="col-sm-6 pull-left" style={{margin:'auto'}}>
                                        <Button className="btn btn-sm btn-success" value='' onClick={(e) => submit(e)}> Add</Button>
                                        <Button className="btn btn-sm btn-white" value='' onClick={(e) => reset(e)}> Reset</Button>
                                        { props.status_sos_input && <span className="text-danger"> *Mohon lengkapi SOS Header dan SOS Item terlebih dahulu </span> }
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm text-nowrap">
                                    <tbody>
                                        <tr>
                                            <th style={{width:"1%"}}>SOS Header Terpilih</th>
                                            <td>{props.data_bidang_usaha.length > 0 &&
                                                    props.data_bidang_usaha.map(function(item, index) {
                                                        return <span key={index}>{item.label}{ (props.data_bidang_usaha[index + 1] ? '; ' : '')}</span>;
                                                    })
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>SOS Item Terpilih</th>
                                            <td>{props.data_sub_bidang_usaha.length > 0 &&
                                                    props.data_sub_bidang_usaha.map(function(item, index) {
                                                        return <span key={index}>{item.label}{ (props.data_sub_bidang_usaha[index + 1] ? '; ' : '')}</span>;
                                                    })
                                                }
                                            </td>
                                        </tr>                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-sm-12">
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" checked={props.status_check_all} 
                                                onChange={(e) => props.handleCheckAll(e)} />
                                            </th>
                                            <th>No</th>
                                            <th>No Vendor</th>
                                            <th>Badan Usaha</th>
                                            <th>Nama Vendor</th>
                                            <th>COI</th>
                                            <th>Nilai VPR</th>
                                            <th>Kategori</th>
                                            <th>Status</th>
                                            <th>PO Open</th>
                                            <th>PO Outstanding</th>
                                            <th>Brand</th>
                                            <th>Expire Document</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </Row>
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Vendor);
