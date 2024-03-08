import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import ReactLoading from 'react-loading';
import { Panel, PanelHeader, PanelBody } from '../../../containers/layout/sub/panel/panel';

const Preview = props => {

  return (
    <div>
			<Modal isOpen={props.open} toggle={props.toggle} className="modal-lg" >
					<ModalHeader toggle={props.toggle}>{"Preview"}</ModalHeader>
					{props.loading && (
						<center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
					)}
					<ModalBody>
						<Panel>
						<PanelHeader></PanelHeader>
							<PanelBody>
								<div className="row">
									<div className="col-md-12">
										<iframe is="x-frame-bypass" title={props.title} src={props.src} style={{ width: '100%', height: '700px', }} frameBorder="2" allowFullScreen={true}></iframe>
									</div>
								</div>
							</PanelBody>
						</Panel>
					</ModalBody>
					{/* <ModalFooter>
						<Button color="success" onClick={props.toggle}>Close</Button>
					</ModalFooter> */}
				</Modal>
    </div>
  );
}

export default Preview;