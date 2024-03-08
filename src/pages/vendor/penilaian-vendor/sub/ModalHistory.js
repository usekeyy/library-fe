import React from 'react';
import { Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// import makeAnimated from 'react-select/animated';
import { Col } from 'reactstrap/lib';
import { statusHistoryVpr } from '../../../../helpers/statusName';
import { formatDate } from '../../../../helpers/formatDate';
import ReactLoading from 'react-loading';

const ModalHistory = (props) => {
	// const {t} = props;
	return (
		<div>
            <Row>
                <Col sm="12">
                    {props.loading ? <center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center> :
                    <table className="table table-bordered justify-content-center">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Note</th>
                                <th>Date</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data?.map((item,index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{statusHistoryVpr(item.status)}</td>
                                    <td>{item.note}</td>
                                    <td>{formatDate(item.updated_at, 2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </Col>
            </Row>
		</div>
	);
}

export default withTranslation() (ModalHistory);