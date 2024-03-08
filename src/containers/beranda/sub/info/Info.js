import React from 'react';
import { Panel, PanelHeader, PanelBody } from '../../../layout/sub/panel/panel';
import Pengumuman from '../pengumuman/Pengumuman';
import TenderUmum from '../tender-umum/TenderUmum';

class Info extends React.Component {
	render() {
		const {t} = this.props.parentProps
		return (
			<div className="row">
				<div className="col-md-8">
					<ol className="breadcrumb float-xl-right">
						
					</ol>
					<h4 className="m-t-0 m-b-20">{t("Beranda.Informasi.Lelang")}</h4>
					<Panel>
						<PanelHeader>Tender Umum</PanelHeader>
						<PanelBody>
							<TenderUmum
								fetchTederUmum={this.props.fetchTederUmum}
								fetchPraQualificationTenderList={this.props.fetchPraQualificationTenderList}
								toggleLogin={this.props.toggleLogin}
							/>
						</PanelBody>
					</Panel>
				</div>
				<div className="col-md-4">
					<h4 className="m-t-0 m-b-20">{t("Beranda.Informasi.Pengumuman")}</h4>
					<Panel>
						<PanelHeader>List Pengumuman</PanelHeader>
						<PanelBody>
							<Pengumuman />
						</PanelBody>
					</Panel>
				</div>
			</div>
		)
	}
}

export default Info;