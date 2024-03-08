import React, {Component} from 'react';
import {connect} from 'react-redux';
import { ModalBody } from 'reactstrap';
// import {toastr} from 'react-redux-toastr';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { withTranslation } from 'react-i18next';
import { Row, Col} from 'reactstrap';
// import { Panel, PanelHeader, PanelBody } from '../../../../../containers/layout/sub/panel/panel';
// import Pagination from '../../../../../components/paginations/ReactTablePagination';
// import FilterStatus from '../../../../components/filterstatus/FilterStatus';

import {showPOOutstanding} from '../../../../../store/actions/tendering/monitoringTenderBuyerActions';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatNumber } from '../../../../../helpers/formatNumber';

class ModalPOOutstanding extends Component {
	constructor(props) {
    super(props);
		this._isMounted = false;
	
		this.state = {
			options: {
				start: 0, 
				length: 10, 
				sorted_column: 1, 
				order: 'asc', 
				keyword: '',
                page: 0,
                tipe_dokumen: '',
                number:'',
                expired_date:'',
                status:'',
                days:''
			},
			statusSearch: [
				{name: 'Expired', value: 'Expired', isChecked: false},
				{name: 'Akan Expired', value: 'Akan Expired', isChecked: false},
			],
			data: [],
			errors: [],
			total: 0,
			isConfirm: false,
			// uuid: this.props.match.params.uuid,
			toggleAdd: false,
            loading: false,
            isVendor: this.props.user.has_roles.includes("VNDR01") ? true : false,
            modalOpen : false,
            loadingButton : false,
            dataModal : {}
		}

		this.defaultSorted = [
			{
				id: "id",
				desc: false
			}
		];

		this.columns = [
			{
				Header:'No',
				id: "id",
                width : 50,
				accessor: d => d.id,
				filterable : false,
				sortable : false,
				Cell: ({index}) => (
					
					<React.Fragment>
						{/* {console.log(index)} */}
                        {index + 1 + this.state.options.start}
					</React.Fragment>
				)
            },
            {
				Header:'No PO',
				id: "no_po",
                accessor: d => d.no_po,
			},
            {
				Header:'Item PO',
				id: "item_po",
                accessor: d => d.item_po,
			},
            // {
			// 	Header:'Purc. Org',
			// 	id: "number",
            //     accessor: d => d.number,
			// },
            // {
			// 	Header:'Purc. Group',
			// 	id: "number",
            //     accessor: d => d.number,
			// },
            {
				Header:'Tanggal PO',
				id: "tgl_po",
                accessor: d => formatDate(d.tgl_po),
			},
            {
				Header:'No Material',
				id: "no_material",
                accessor: d => d.no_material,
			},
            {
				Header:'Item Description',
				id: "item_description",
                accessor: d => d.item_description,
			},
            {
				Header:'Material Group',
				id: "material_group",
                accessor: d => d.material_group,
			},
            {
				Header:'Qty',
				id: "quantity",
                accessor: d => d.quantity,
			},
            {
				Header:'Uom',
				id: "uom",
                accessor: d => d.uom,
			},
            {
				Header:'Unit Price',
				id: "unit_price",
                accessor: d => d.unit_price,
                Cell : ({value}) => (
                    <React.Fragment>
                        <div className="pull-right">{formatNumber(value,2)}</div>
                    </React.Fragment>
                )
			},
            {
				Header:'Total Value',
				id: "total_value",
                accessor: d => d.total_value,
                Cell : ({value}) => (
                    <React.Fragment>
                        <div className="pull-right">{formatNumber(value,2)}</div>
                    </React.Fragment>
                )
			},
            {
				Header:'Curr',
				id: "currency",
                accessor: d => d.currency,
			},
            {
				Header:'Still To Be Delivered (Qty)',
				id: "qty",
                accessor: d => d.qty,
			},
            {
				Header:'Still To Be Delivered (Value)',
				id: "value",
                accessor: d => d.value,
                Cell : ({value}) => (
                    <React.Fragment>
                        <div className="pull-right">{formatNumber(value,2)}</div>
                    </React.Fragment>
                )
			},
            
		]
	}
	
  componentDidMount = () => {
    this._isMounted = true;
		if(this._isMounted){
			this.fetchData();
		}
	}
	
	componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

	asyncData = async () => {
	    this.setState({loading: true})
        this.props.showPOOutstanding({
            vendor_id : this.props.data_vendor.vendor_id,
            purchasing_org : this.props.purchasing_org_id
        })
        .then((resp) => {
            console.log(resp.data.data.data)
                    if(this._isMounted){
                        let lengthPage = Math.ceil(parseInt(resp.data.recordsFiltered) / this.state.options.length);
                        this.setState({loading: false, total: lengthPage, data: resp.data.data});
                    }
                })
        .catch((resp) => {
                    this.setState({loading: false})
                    // toastr.error("error");
                    this._isMounted = false;
                });
	}

	fetchData = () => {
		if(this._isMounted){
			this.asyncData(this.state.options)
		}
	}

  render(){
    const {data_vendor,purchasing_org_id} = this.props
    return (
      <div>
          <ModalBody>
                {console.log(this.props.data_vendor)}
                <Row>
                    <Col sm="12">
                        <table>
                            <thead>
                                <tr>
                                    <td colSpan="2"><h4>{data_vendor.company_name + ' ' + data_vendor.vendor_name}</h4></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>No Vendor Eproc</td>
                                    <td> : {data_vendor.vendor_id}</td>
                                </tr>
                                <tr>
                                    <td>No Vendor SAP</td>
                                    <td> : {data_vendor.sap_code}</td>
                                </tr>
                                <tr>
                                    <td>Purchasing Organization</td>
                                    <td> : {purchasing_org_id}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <Col sm="12">
                        <ReactTable 
                            columns={this.columns} 
                            filterable loading={this.state.loading} 
                            // manual
                            minRows={1}
                            // PaginationComponent={Pagination}
                            data={this.state.data.data} 
                            className="-highlight" />
                    </Col>

                </Row>
          </ModalBody>
        </div>
    );
  }
}

const stateToProps = state => {
	return {
		sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user : state.auth.user.data,
	}
}

const dispatchToProps = dispatch => {
	return {
		showPOOutstanding: (params) => dispatch(showPOOutstanding(params)),
	}
}

export default connect(stateToProps, dispatchToProps)( withTranslation() (ModalPOOutstanding));