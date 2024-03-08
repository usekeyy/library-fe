import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
import { Row, Col } from 'reactstrap';
import { formatNumber } from '../../../../helpers/formatNumber'
import { statusNameAwarding } from '../../../../helpers/statusName';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const Header = (props) => {
	const { control, register } = useForm({});
    const { t } = props;

	const handleChangePerikatan = (e) => {
		props.setPerikatan(e)
	}

    const details = (e) => {
		props.modalHistoryApproval()
        e.preventDefault()
    }
    
    const batalTender = (e) => {
		props.BatalTender()
    }

    return (
        <div>
            <Panel className="margin-bot-false">
                <PanelHeader>Header</PanelHeader>
                <PanelBody>
                    <Row>
                        <Col sm="12">
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Pelaksana</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={': ' + (props.data.created_by_name || '')}/>
                                </div>
                            </div>
                            
                            <div className="row">
                                <label className="col-sm-2 col-form-label">No Proposal Tender</label>
                                <div className="col-sm-10">
                                    <div readOnly className="form-control-plaintext">
                                        : <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_API_BASE_URL}tendering/monitoring-tender-buyer/detail/${props.data.proposal_tender_uuid}`} >{props.data.proposal_tender_no}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Description</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={': ' + (props.data.proposal_tender_title || '')} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">OE</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.data.total_value===null? ":" : ": " + formatNumber(props.data.total_value,2)} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Status</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={props.data.status===null? ":" : ": "+statusNameAwarding(props.data.status)} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Masa Sanggah</label>
                                <div className="col-sm-10">
                                    <input type="text" readOnly className="form-control-plaintext" defaultValue={': ' + (props.data.masa_sanggah || '')} />
                                </div>
                            </div>
                            <div className="row">
                                <label className="col-sm-2 col-form-label">Jenis Perikatan</label>
                                {(props.data.status === 'd' || props.data.status === 'r') && (props.data.created_by === props.user.uuid) ?
                                    <div className="col-sm-2">
                                        <Controller
                                            components={animatedComponents}
                                            closeMenuOnSelect={true}
                                            as={Select}
                                            control={control}
                                            options={props.m_jenis_perikatan}
                                            onChange={([selected]) => {
                                                handleChangePerikatan(selected)
                                                return selected;
                                            }}
                                            defaultValue={props.jenis_perikatan}
                                            inputRef={(e) => register({ name: "jenis_perikatan", required: true })}
                                            name="jenis_perikatan"
                                            placeholder={t("common:Select.Pilih")}
                                            // isLoading={props.loadings.jenis_perikatan}
                                            rules={{ required: true }}
                                        />
                                    </div> :
                                    <div className="col-sm-10">
                                        <input type="text" readOnly className="form-control-plaintext" defaultValue={': ' + (props.data.jenis_perikatan_text || '')} />
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>

                    <Row style={{paddingTop: '10px'}}>
                        <Col sm="12">
                            {(props.data.status === 'd' || props.data.status === 'r') && props.user.uuid === props.data.created_by &&
                                <button type="button" className="m-r-10 btn btn-light" value={props.data.proposal_tender_uuid} onClick={(e) => props.toggleConfirm(e, props.data.proposal_tender_uuid, 'Re-Nego')} >Re-Nego</button>
                            }
                            <button type="button" className="m-r-10 btn btn-light" onClick={(e)=> details(e)}>List Approval</button>
                            {props.data.status === 'y' && 
                                <button type="button" className="m-r-10 btn btn-light" onClick={(e)=> props.downloadBeritaAcara(e)}>Pengumuman Pemenang</button>
                            }
                            {/* {props.data.status === 'y' && 
                                <button type="button" className="m-r-10 btn btn-warning" onClick={(e)=> props.setStatusPublish(e, 'd')}>Re-Awarding</button>
                            }
                            {props.data.status === 'y' && 
                                <button type="button" className="m-r-10 btn btn-success" onClick={(e)=> props.setStatusPublish(e, 's')}>Publish</button>
                            } */}
                            {props.user.uuid === props.data.created_by &&
                                <button
                                    type="submit"
                                    className="m-r-10 btn btn-danger"
                                    onClick={(e) => batalTender(e)}
                                    disabled={props.loadingSubmit}
                                >
                                {props.loadingSubmit ? <i className="fa fa-spinner fa-spin"></i> : ''}  Batalkan Tender</button>
                            }
                        </Col>
                    </Row>
                    
                </PanelBody>
            </Panel>
        </div>
    );
}

export default withTranslation()(Header);