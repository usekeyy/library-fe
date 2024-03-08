import React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

import { Panel, PanelHeader, PanelBody } from '../../../layout/sub/panel/panel';

class Kontak extends React.Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
		
		this.state = {
			sendData: {},
			loading: false,
		}
	}
	
	componentDidMount(){
		this._isMounted = true;
	}

	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	render() {
		// const {t} = this.props.props
		return (
			<div className="row">
				<div className="col-md-12">
					<Panel>
						<PanelHeader>Info Kontak Pupuk Indonesia</PanelHeader>
						<PanelBody>
							<center>
                                <Row>
                                    <Col sm="6">
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT. Pupuk Indonesia</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        Gedung PUSRI Jakarta Lt. 2 Jl. Taman Anggrek, Kemanggisan Jaya Dep. Vendor Manajemen 
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        021 53654900 ext. 6911/6921 
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        vm.eproc@pupuk-indonesia.com
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <br></br>
                                        <br></br>
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT. Petrokimia Gresik</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        PT. Petrokimia Gresik Jl. Ahmad Yani Gresik - 61119 INDONESIA
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        031-3982100, 3982200 
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Fax</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        031-3981722,3982272
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Dept Pengadaan Jasa</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        ext. 2699
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        epro@petrokimia-gresik.com
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <br></br>
                                        <br></br>
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT. Pupuk Kalimantan Timur</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        Jln. Ir. James Simanjuntak No.1 Bontang Utara – Kaltim
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        0548-41202 
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Fax</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        0548-41595
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Pengadaan jasa</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        ext. 5214 (Abdul Kadir Kaola)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Pengadaan barang</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        ext. 5248 (Jaka Satria)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Jasa distribusi</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        ext. 5833 (Suryo Wildan)    
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Vendor Management</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        ext. 5218 (Rizki Ardita)
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        vendormgm@pupukkaltim.com
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </Col>
                                    <Col sm="6">
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT Pupuk Sriwijaya Palembang</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        Jl Mayor Zen, Palembang- Indonesia 30118
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        (0711) - 712222 ext 3439 
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        vendor_management@pusri.co.id
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <br></br>
                                        <br></br>
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT. Pupuk Kujang</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        Jl. Jend. A. Yani No. 39 Cikampek 41373 Kabupaten Karawang – Jawa Barat
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        (0264) 316141, 317007
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Fax</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        (0264) 314235, 314335
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        procurement@pupuk-kujang.co.id
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <br></br>
                                        <br></br>
                                        <table width="100%">
                                            <thead>
                                                <tr>
                                                    <td colSpan="3" className="text-center">
                                                        <h4>PT. Pupuk Iskandar Muda</h4>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td width="25%"><b>Alamat</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        Jl. Medan - Banda Aceh, Krueng Geukueh, Aceh Utara
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Telp</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        (0645) 56222
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Pengadaan Barang</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        +628116709885
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Pengadaan Jasa</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        +628116725747
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b></td>
                                                    <td>:</td>
                                                    <td>
                                                        eproc@pim.co.id
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </Col>
                                </Row>
                            </center>
						</PanelBody>
					</Panel>
				</div>
			</div>
		)
	}
}

export default Kontak;