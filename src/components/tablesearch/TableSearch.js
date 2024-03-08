import React from 'react';
import { FormGroup, CustomInput, Input } from 'reactstrap';
import { Row, Col } from "reactstrap";

const TableSearch = props => {
		let lengthPage = [10, 20, 50, 100, 200];
		let optLength;
		let singleSearch;
		if(props.lengthPage){
			if(props.lengthPage) {
					lengthPage = props.lengthPage;
			}
			const options = lengthPage.map((data, i) => (<option key={i} value={data}>{data}</option>));
			optLength = (
				<FormGroup>
					<CustomInput type="select" id="perPageSelect" name="perPageSelect" value={props.perPage} onChange={(e) => props.change(props.optionPaginate.current_page, e.target.value, props.searchVal)} >
						{options}
					</CustomInput>
				</FormGroup>
			)
		}

		// let resetBtn = <Button color="danger" size="xs" onClick={(e) => props.resetFilter()} >Reset Filter</Button>
		let resetBtn = ''

		if(props.singleSearch){
			singleSearch = (
				<FormGroup>
					<Input type="text" placeholder="Search" value={props.searchVal} onChange={(e) => props.search(1, props.optionPaginate.per_page, e.target.value)} />
				</FormGroup>
			)
		} 

    return(
        <div>
            <Row>
                <Col sm="1">
									<div className="left">
										{optLength}
									</div>
                </Col>
                <Col sm="2">
										{resetBtn}
                </Col>
								<Col sm="5"></Col>
                <Col sm="4">
										{singleSearch}
                </Col>
            </Row>
        </div>
    );
}

export default TableSearch;
