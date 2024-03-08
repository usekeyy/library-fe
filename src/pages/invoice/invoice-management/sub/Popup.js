import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ReactLoading from "react-loading";
import { withTranslation } from 'react-i18next';

class Popup extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      data: [],
      error: false,
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  toggleClosePopup = () => {
    this.props.toggleClosePopup();
  };

  render() {
    // const {t} = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleOpenPopup} toggle={() => this.toggleClosePopup()} className="modal-lg">
          <ModalHeader toggle={() => this.toggleClosePopup()}>INFORMASI</ModalHeader>
          {this.state.loading && (
            <center>
              <br />
              <ReactLoading type="cylon" color="#0f9e3e" />
              <br />
            </center>
          )}
					<ModalBody>
						<p className="text-center">
							VIM Fase tahap 1 - <b>PT Pupuk Indonesia (Persero)</b>
						</p>
						<ul>
							<li className="m-b-10">
								Mohon diperhatikan untuk kelengkapan dokumen invoice pada saat penagihan pembayaran yang diupload di aplikasi VIM dan hardcopy yang akan disampaikan kepada bag. penerimaan dokumen, termasuk apabila terdapat fasilitas perpajakan (misal SKB, PP23 sesuai dengan ketetapan perpajakan yang berlaku)
							</li>
							<li className="m-b-10">
								Invoice dan faktur pajak dibuat setelah diselesaikan BAPP (Berita acara penerimaan pekerjaan), bukan sebaliknya.
							</li>
							<li className="m-b-10">
							Sebagai informasi alur penagihan pembayaran:
							</li>
							<li className="m-b-10">
							Verifikasi 1 bag. Penerimaan dokumen <b className="fa fa-arrow-right"></b> Verifikasi 2 bg. Akuntansi <b className="fa fa-arrow-right"></b> Release pembayaran (bg. Keuangan)
							</li>
							<li className="m-b-10">
							Status dokumen penagihan pembayaran dapat dilihat/dimonitor di web VIM vendor.
							</li>
							<li className="m-b-10">
							Dokumen dapat dikirim pada : 
							<br />
							<table className="table table-bordered m-t-10">
								<thead>
								</thead>
								<tbody>
									<tr>
										<td>Tempat :</td>
										<td>Loket penerimaan dokumen</td>
									</tr>
									<tr>
										<td>Alamat :</td>
										<td>Gd. Pusri, Jl. Taman Anggrek kemanggisan Jaya, Jakarta Barat</td>
									</tr>
									<tr>
										<td>Waktu :</td>
										<td>Setiap hari kerja Pukul 09.00 sd. 15.00 Wib (Batas penyampaian tgl. 28 setiap bulannya)</td>
									</tr>
								</tbody>
							</table>
							</li>
						</ul>
						<p className="text-danger">
						*untuk implementasi VIM anggota holding pupuk (PKG,PKT,PKC, PIM, danPUSRI) dan  anggota holding non pupuk akan disampaikan kemudian dalam fase VIM selanjutnya.
						</p>
						<p className="text-center">
						Contact person untuk new vim tim pengadaan Group PT Pupuk Indonesia (Persero) <br />
						<b>083857582843 (WA Only)</b> <br />
						email : vm.eproc@pupuk-indonesia.com <br />
						</p>
					</ModalBody>
        </Modal>
      </div>
    );
  }
}

export default withTranslation() (Popup);
