import React, { Component } from 'react'
import { Panel, PanelHeader, PanelBody } from './../../../containers/layout/sub/panel/panel';

export class ManagementVendor extends Component {
    render() {
        return (
            <div>
                <Panel loading={false}>
                    <PanelHeader>
                        Management Vendor
                    </PanelHeader>
                    <PanelBody loading={false}>
                        <div className="row">
                            <div className="col-xl-3 col-md-6">
                                <div className="widget widget-stats bg-blue">
                                    <div className="stats-icon"><i className="fa fa-gamepad"></i></div>
                                    <div className="stats-info">
                                        <h4>Assign PR To Create Proposal Tender</h4>
                                        <p>5</p>
                                    </div>
                                    <div className="stats-link">
                                        <a href="/home" >View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="widget widget-stats bg-blue">
                                <div className="stats-icon"><i className="fa fa-gamepad"></i></div>
                                    <div className="stats-info">
                                        <h4>PraQualification</h4>
                                        <p>5</p>
                                    </div>
                                    <div className="stats-link">
                                        <a href="/home" >View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="widget widget-stats bg-blue">
                                <div className="stats-icon"><i className="fa fa-gamepad"></i></div>
                                    <div className="stats-info">
                                        <h4>Create DUR</h4>
                                        <p>5</p>
                                    </div>
                                    <div className="stats-link">
                                        <a href="/home" >View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="widget widget-stats bg-blue">
                                <div className="stats-icon"><i className="fa fa-gamepad"></i></div>
                                    <div className="stats-info">
                                        <h4>Approved DuR</h4>
                                        <p>5</p>
                                    </div>
                                    <div className="stats-link">
                                        <a href="/home" >View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="widget widget-stats bg-blue">
                                <div className="stats-icon"><i className="fa fa-gamepad"></i></div>
                                    <div className="stats-info">
                                        <h4>Reject DUR</h4>
                                        <p>5</p>
                                    </div>
                                    <div className="stats-link">
                                        <a href="/home" >View Detail <i className="fa fa-arrow-alt-circle-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

export default ManagementVendor
