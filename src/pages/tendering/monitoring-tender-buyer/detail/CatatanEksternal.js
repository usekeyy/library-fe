import React from 'react';
import { withTranslation } from 'react-i18next';
import { Panel, PanelHeader, PanelBody } from '../../../../containers/layout/sub/panel/panel';
// import { Row, Col } from 'reactstrap';


const CatatanEksternal = (props) => {
        const { data } = props;

    return (
			<div>
				<Panel>
					<PanelHeader>Catatan Eksternal</PanelHeader>
					<PanelBody>
                        <div className="row">
                            <div className="col-md-12">
                                <textarea
                                    disabled={true}
                                    className="form-control"
                                    rows="4"
                                    cols="50"
                                    defaultValue={data}/>
                            </div>
                        </div>
					</PanelBody>
				</Panel>
			</div>
    );
}

export default withTranslation()(CatatanEksternal);