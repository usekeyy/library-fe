import React, {Component} from 'react';
import ReactLoading from 'react-loading';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class PaktaIntegritas extends Component {
	constructor(props) {
    super(props);
    this._isMounted = false;
	}
	
  state = {
    sendDt: {
		}
  }

  componentDidMount(){
		this._isMounted = true;
    if(this._isMounted){
			
    }
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	toggleClose = () => {
    this.props.isCancel()
	}
	
	toggleConfirm = () => {
    this.props.isConfirm()
  }
	
  render(){
    return (
      <div>
				<Modal size="xl" isOpen={this.props.toggleOpen}>
					<ModalHeader>
						{this.props.loadings.form && <b> {this.props.allProps.t("common:Label.Memproses Data")} </b>}
						{this.props.loadings.form === false && <b>Pakta Integritas <small>Syarat Dan Ketentuan</small></b>}
          </ModalHeader>
					<ModalBody>
						{this.props.loadings.form && (
							<center>
								<br/>
								<ReactLoading type="cylon" color="#0f9e3e" />
								<br/>
							</center>
						)}
						{this.props.loadings.form === false && 
						<div>
							<div>
								<ol>
									<li>
										Setiap pengguna supplier/vendor wajib mematuhi peraturan dan proses bisnis yang telah berjalan dalam aplikasi PROCSI. 
									</li>
									<li>
										Segala tindakan dan proses transaksi akan terekam oleh sistem secara otomatis.
									</li>
									<li>
										Satu perusahaan hanya memiliki 1 akun pengguna yang terdaftar aktif di aplikasi PROCSI.
									</li>
									<li>
										Setelah melakukan submit pendaftaran, wajib melakukan pengisian daftar profil vendor selambat-lambatnya 7 hari setelah proses submit pendaftaran.
									</li>
									<li>
										Pengguna yang tidak melengkapi data profil lebih dari 7 hari maka data akan dihapus oleh sistem dan wajib mengisi ulang jika ingin melanjutkan proses pendaftaran.
									</li>
									<li>
										Segala notifikasi akan dikirim melalui email perusahaan dan email PIC, oleh karena itu wajib memasukan email yang masih aktif
									</li>
									<li>
										Apabila terdapat kecurangan data dan transaksi maka akan diproses secara hukum
									</li>
								</ol>
							</div>
							<div className="text-center m-t-10 m-b-10">
								<button className="btn btn-danger m-r-10" type="button" onClick={this.toggleClose}>Tolak</button>
								<button className="btn btn-success m-l-10" type="button" onClick={this.toggleConfirm}> Setuju</button>
							</div>
						</div>
						}
					</ModalBody>
				</Modal>
			</div>
    );
  }
}

export default PaktaIntegritas;