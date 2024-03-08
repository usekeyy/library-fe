import React, { Component } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { withTranslation } from "react-i18next";

import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import Pagination from "../../../../components/paginations/ReactTablePagination";
import {
  showDurVendor,
  syncrnVendorSAP,
  downloadDurVendorDocument,
  showFilterDurVendor
} from "../../../../store/actions/tendering/durActions";
import { statusVendorDur } from "../../../../helpers/statusName";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../../../containers/layout/sub/panel/panel";
import Vendor from "./Vendor";
import FilterDate from "../../../../components/filterdate/FilterDate";
// import { formatDate } from '../../../../helpers/formatDate';
import { debounce } from "../../../../helpers/debounce";
import { withRouter } from "react-router";
import TableAprrovalProposalTender from "./TableAprrovalProposalTender";
import { fetchBidangUsaha } from '../../../../store/actions/master/bidangUsahaActions';
import { fetchSubBidangUsaha } from '../../../../store/actions/master/subBidangUsahaActions';
import { fetchTipeRekanan } from '../../../../store/actions/master/tipeRekananActions';
import { fetchVendorClassification } from '../../../../store/actions/master/vendorClassificationActions';
import { fetchVendorSubClassification } from '../../../../store/actions/master/vendorSubClassificationActions';
import { fetchVendorQualification } from '../../../../store/actions/master/vendorQualificationActions';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class Table extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      options: {
        start: 0,
        length: 10,
        sorted_column: 1,
        // order: 'asc',
        page: 0,
        vendor_id: "",
        vendor_name: "",
        company_name: "",
        business_group: "",
        district_name: "",
        coi: "",
        color: "",
        vendor_status: "",
        po_outstanding: "",
        expired_tdp: "",
        sos_type: "",
        id: "",
		filter1 : this.props.arrFilter.filter1,
		filter2: this.props.arrFilter.filter2,
		filter3 :this.props.arrFilter.filter3,
		tipe_penyedia : this.props.filter_dur.tipe_penyedia
      },
      statusSearch: [
        { name: "Open", value: "o", isChecked: false },
        { name: "Reject ", value: "r", isChecked: false },
        { name: "Submit ", value: "s", isChecked: false },
        { name: "Draft ", value: "d", isChecked: false },
      ],
	  tipePenyediaOptions : [
			{ value: "general", label: "General" },
			{ value: "siujk", label: "Kontruksi" },
		],
      data: [],
      errors: [],
      total: 0,
      isConfirm: false,
      uuid: "",
      toggleAdd: false,
      loading: false,
      modalOpen: false,
      loadings: {
        loadingModal: false,
        loading_syncrn_vendor_sap: false,
      },
      modalData: {
        items: [],
        item_potext: [],
        account_assignment: [],
        serviceline: [],
      },
      vendorSelection: [],
      checkAll: false,
      optionsBidangUsaha : [],
			subBidangUsaha : [],
			optionsTipeRekanan : [],
			optionsKlasifikasi :[],
			optionsSubKlasifikasi : [],
			optionsKualifikasi : [],
			selectedOptions : {
				BidangUsahaSelected : (this.props.filter_dur.tipe_penyedia==="general") ? this.props.filter1 : []  ,
				SubBidangUsahaSelected : (this.props.filter_dur.tipe_penyedia==="general") ? this.props.filter2 : [],
				TipeRekananSelected : (this.props.filter_dur.tipe_penyedia==="general") ? this.props.filter3 : [],
				KlasifikasiSelected : (this.props.filter_dur.tipe_penyedia==="siujk") ? this.props.filter1 : [],
				SubKlasifikasiSelected : (this.props.filter_dur.tipe_penyedia==="siujk") ? this.props.filter2 : [],
				KualifikasiSelected : (this.props.filter_dur.tipe_penyedia==="siujk") ? this.props.filter3 : []
			}
    };

    this.defaultSorted = [
      {
        id: "purchasing_requisition_number",
        desc: false,
      },
    ];

    this.columns = [
      {
        Header: () => (
          <div className="pull-left m-l-30">
            <input
              type="checkbox"
              name="isCheckedAll"
              checked={this.state.checkAll}
              onChange={(event) => this.handlerCheckAll(event)}
              disabled={
                (this.props.status !== "p" &&
                  this.props.status !== "a" &&
                  this.props.status !== "y" &&
                  !(
                    this.props.pq_status === "y" &&
                    this.props.pra_qualification === "1"
                  )) ||
                this.props.access.A
                  ? false
                  : true
              }
            />
          </div>
        ),
        id: "id",
        accessor: (d) => d.vendor_id,
        filterable: false,
        sortable: false,
        className: "sticky",
        headerClassName: "sticky",
        fixed: "left",
        Cell: (d) => {
          let checkbox = "";
         
          if (
            this.props.status !== "p" &&
            this.props.status !== "a" &&
            this.props.status !== "y" &&
            !(
              this.props.pq_status === "y" &&
              this.props.pra_qualification === "1"
            ) &&
            (((
              new Date(localStorage.getItem("times")).getTime() / 1000 <
              new Date(d.original.expired_tdp).getTime() / 1000
            ) &&
              d.original.expired_tdp !== null) || d.original.lifetime==="1") &&
            d.original.status_inactive !== "1"
          ) {
            //&& props.data[key]['po_outstanding'] < 6
            // checkbox='gggggg'
            console.log(1)
            checkbox = (
              <input
                type="checkbox"
                checked={this.props.vendors.includes(d.original.vendor_id)}
                onChange={(event) =>
                  this.handleChecklist(event, d.original.vendor_id)
                }
              />
            );
          } else if (
            d.original.status_inactive !== "1" &&
            (this.props.status === "p" ||
              this.props.status === "y" ||
              (this.props.pq_status === "y" &&
                this.props.pra_qualification === "1"))
          ) {
            if (
              !(
                this.props.pq_status === "y" &&
                this.props.pra_qualification === "1"
              ) &&
              (((
                new Date(localStorage.getItem("times")).getTime() / 1000 <
                new Date(d.original.expired_tdp).getTime() / 1000
              ) &&
                d.original.expired_tdp !== null) || d.original.lifetime==="1") &&
              d.original.status_inactive !== "1"
            ) {
              console.log(2)
              checkbox = (
                <input
                  type="checkbox"
                  checked={this.props.vendors.includes(d.original.vendor_id)}
                  disabled={this.props.access.A ? false : true}
                  onChange={(event) =>
                    this.handleChecklist(event, d.original.vendor_id)
                  }
                />
              );
            } else {
              checkbox = "";
            }
          }
          
          if (
            (d.original.migration === "1" || d.status_inactive === "1") &&
            (!(this.props.status === "p" || this.props.status === "y") ||
              (this.props.pq_status === "y" &&
                this.props.pra_qualification === "1"))
          ) {
            checkbox = "";
          }

          // if((new Date(localStorage.getItem("times")).getTime() / 1000 < new Date(d.original.expired_tdp).getTime() / 1000) &&  )
          return (
            <>
              <React.Fragment>
                <div className="pull-left m-l-30">{checkbox}</div>
              </React.Fragment>
            </>
          );
        },
      },
      {
        Header: "NO",
        id: "no",
        filterable: false,
        Cell: ({ index }) => <div> &nbsp; {index + 1} </div>,
      },
      {
        Header: this.props.t("dur:label.vendor-number"),
        id: "vendor_id",
        accessor: (d) => d.vendor_id,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="vendor_id"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.vendor_id}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.vendor-name"),
        id: "vendor_name",
        accessor: (d) => d.vendor_name,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="vendor_name"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.vendor_name}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.category-company"),
        id: "company_name",
        accessor: (d) => d.company_name,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="company_name"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.company_name}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.bid-usaha"),
        id: "business_group",
        accessor: (d) => d.business_group,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="business_group"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.business_group}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.district"),
        id: "district_name",
        accessor: (d) => d.district_name,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="district_name"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.district_name}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.score-vpr"),
        id: "score_vpr",
        accessor: (d) => d.score_vpr,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="score_vpr"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.score_vpr}
          />
        ),
      },
      {
        Header: this.props.t("dur:label.coi"),
        id: "coi",
        accessor: (d) => d.coi,
        filterable: false,
      },
      {
        Header: this.props.t("dur:label.category"),
        id: "color",
        accessor: (d) => d.color,
        filterable: false,
        Cell: ({ value }) => (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: value,
            }}
          >
            {" "}
            &nbsp;{" "}
          </div>
        ),
      },
      {
        Header: this.props.t("dur:label.status"),
        id: "status_inactive",
        accessor: (d) => statusVendorDur(d.status_inactive),
        filterable: false,
      },
      {
        Header: this.props.t("dur:label.po"),
        id: "po_outstanding",
        accessor: (d) => d.po_outstanding,
        Filter: ({ filter, onChange }) => (
          <input
            type="text"
            className="form-control"
            name="po_outstanding"
            onChange={(event) => this.handleFilter(event)}
            value={this.state.options.po_outstanding}
          />
        ),
        Cell: ({ original }) => (
          <React.Fragment>
            <center>
              {original.po_outstanding > 0 && (
                <button
                  className="btn btn-xs btn-white"
                  onClick={(e) => this.props.modalPOOutstanding(e, original)}
                >
                  {original.po_outstanding}
                </button>
              )}
            </center>
          </React.Fragment>
        ),
      },
      {
        Header: this.props.t("dur:label.document-expired"),
        id: "expired_tdp",
        className: "sticky",
        headerClassName: "sticky",
        fixed: "right",
        accessor: (d) => d.expired_tdp,
        Filter: ({ filter, onChange }) => (
          <FilterDate type="expired_tdp" getDate={this.expired_tdp} />
        ),
        Cell: (d) => {
          let expired_tdp = "";
          if (d.original.expired_document > 0) {
            //&& props.data[key]['po_outstanding'] < 6
            // style={{ backgroundColor: "red", fontWeight: "bold", color: "white" }}
            expired_tdp = (
              <div>
                <a href={"/vendor/dokumen-expired/" + d.original.uuid}>
                  <button
                    className="btn btn-white btn-xs"
                    type="button"
                    onClick={(e) => this.toDocExpired(e, d.original.uuid)}
                  >
                    Detail &nbsp;
                    <label className="text-danger">
                      ({d.original.expired_document})
                    </label>
                  </button>
                </a>
              </div>
            );
          }
          // else {
          // 	expired_tdp =
          // 		<div >
          // 			<center>{formatDate(d.original.expired_tdp, false)}</center>
          // 		</div>
          // }
          return (
            <>
              <React.Fragment>{expired_tdp}</React.Fragment>
            </>
          );
        },
      },
    ];
  }

  componentDidMount = () => {
    this._isMounted = true;
    if (this._isMounted) {
		this.fetchData();
		this.getBidangUsaha();
		this.getTipeRekanan();
		this.getKlasifikasi();
		this.fetchVendorQualification();
		if(this.props.filter_dur.tipe_penyedia==="general"){
			this.getSubBidangUsaha()
		}else if(this.props.filter_dur.tipe_penyedia==="siujk") {
			this.getSubKlasifikasi()
		}
	}
  };

  componentWillUnmount() {
    this._isMounted = false;
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  debounced = debounce((text) => this.fetchData());

  asyncData = async (params) => {
    if (this._isMounted) {
      this.setState({ loading: true });
      this.props.showFilterDurVendor(this.props.uuid, params)
        .then((resp) => {
          if (this._isMounted) {
            let lengthPage = Math.ceil(
              parseInt(resp.data.recordsFiltered) / this.state.options.length
            );
            this.setState({
              loading: false,
              total: lengthPage,
              data: resp.data,
            });
            this.props.setLoading(false);
          }
        })
        .catch((resp) => {
          this.setState({ loading: false });
          toastr.error(resp.data.message);
        });
    }
  };

  handleChecklist = (e, value) => {
    this.props.handlerCheckList(value);
    if (this.state.checkAll) {
      this.setState({
        checkAll: !this.state.checkAll,
      });
    }
  };

  // handlerCheckAll =  (e) => {
  // 	this.props.handleChecklistAll()
  // 	this.fetchData()
  // 	e.preventDefault();
  // }

  handlerCheckAll = () => {
    let arr_selected = this.props.vendors;
    let payload = [];
    if (!this.state.checkAll) {
      this.state.data.data.forEach((element, i) => {
        if (
          element.status_inactive !== "1" &&
          !arr_selected.includes(element.vendor_id) &&
          this.props.status !== "p" &&
          this.props.status !== "a" &&
          this.props.status !== "y" &&
          !(
            this.props.pq_status === "y" && this.props.pra_qualification === "1"
          ) &&
          element.migration === "0" &&
          (((
            new Date(localStorage.getItem("times")).getTime() / 1000 <
            new Date(element.expired_tdp).getTime() / 1000
          ) &&
            element.expired_tdp !== null) || element.lifetime==="1")
        ) {
          if(!((element.migration === "1" || element.status_inactive === "1") &&
            (!(this.props.status === "p" || this.props.status === "y") ||
              (this.props.pq_status === "y" &&
                this.props.pra_qualification === "1")))){
                  arr_selected.push(element.vendor_id);
                }
        }

        if (
          !arr_selected.includes(element.vendor_id) &&
          (element.migration !== "1" || element.status_inactive !== "1") &&
          (this.props.status === "p" ||
            this.props.status === "y" ||
            (this.props.pq_status === "y" &&
              this.props.pra_qualification === "1")) &&
          this.props.access.A
        ) {
          if (
            !(
              this.props.pq_status === "y" &&
              this.props.pra_qualification === "1"
            ) &&
            (((
              new Date(localStorage.getItem("times")).getTime() / 1000 <
              new Date(element.expired_tdp).getTime() / 1000
            ) &&
              element.expired_tdp !== null) || element.lifetime==="1") &&
            element.status_inactive !== "1"
          ) {
            if(!((element.migration === "1" || element.status_inactive === "1") &&
            (!(this.props.status === "p" || this.props.status === "y") ||
              (this.props.pq_status === "y" &&
                this.props.pra_qualification === "1")))){
                  arr_selected.push(element.vendor_id);
                }
            
          }
        }
      });
    } else {
      arr_selected = [];
    }
    console.log(arr_selected);

    payload.checked = !this.state.checkAll;
    if (!this.state.checkAll) {
      payload.data = arr_selected;
    } else {
      payload.data = [];
    }
    this.props.handleChecklistAll(payload);
    this.setState({
      checkAll: !this.state.checkAll,
    });
    // this.fetchData()
  };

  downloadDurVendorDocument = () => {
    if (this._isMounted) {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, loading_dur_generate_document_vendor: true },
        errors: [],
      }));
      this.props
        .downloadDurVendorDocument(this.props.uuid)
        .then((resp) => {
          // this.setState(({}) => ({loadingDownload : false}));
          this.setState(({ loadings }) => ({
            loadings: {
              ...loadings,
              loading_dur_generate_document_vendor: false,
            },
            errors: [],
          }));
          const url = window.URL.createObjectURL(new Blob([resp.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Dur_Vendor_${this.props.number}.pdf`); //or any other extension
          document.body.appendChild(link);
          link.click();
          toastr.success("Success", resp.data.message);
        })
        .catch((resp) => {
          // this.setState(({}) => ({loadingDownload : false}));
          this.setState(({ loadings }) => ({
            loadings: {
              ...loadings,
              loading_dur_generate_document_vendor: false,
            },
          }));
          toastr.error("Failed Download List Dur Vendor");
        });
    }
  };

  syncrnVendorSAP() {
    if (this._isMounted) {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, loading_syncrn_vendor_sap: true },
      }));
      let pr_number_arr = [];
      this.props.items.forEach((index) => {
        pr_number_arr.push(index.number_pr);
      });
      this.props
        .syncrnVendorSAP(this.props.uuid, { pr_number: pr_number_arr })
        .then((resp) => {
          let datas = resp.data.data;
          this.setState(({ loadings }) => ({
            vendors: datas,
            loadings: { ...loadings, loading_syncrn_vendor_sap: false },
          }));
          this.fetchData();
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, loading_syncrn_vendor_sap: false },
          }));
          toastr.error(resp.data.message);
        });
    }
  }

  fetchData = () => {
    if (this._isMounted) {
      // console.log(this.state.options)
      this.asyncData(this.state.options);
    }
  };

  changePage = (perPage) => {
    if (this._isMounted) {
      let lengthPage = Math.ceil(
        parseInt(this.state.data.recordsFiltered) / this.state.options.length
      );
      let optDt = { ...this.state.options };
      let numb = 0;
      numb = perPage;
      if (numb > 0) {
        numb = perPage * this.state.options.length;
      }
      optDt.start = numb;
      optDt.page = perPage;
      // optDt.length = state;
      this.setState({ total: lengthPage, options: optDt }, () =>
        this.fetchData()
      );
    }
  };

  changePageSize = (length) => {
    if (this._isMounted) {
      let lengthPage = Math.ceil(
        parseInt(this.state.data.recordsFiltered) / this.state.options.length
      );
      let optDt = { ...this.state.options };
      optDt.start = 0;
      optDt.page = 0;
      length === "All" ? (optDt.length = 10000) : (optDt.length = length);
      this.setState({ total: lengthPage, options: optDt }, () =>
        this.fetchData()
      );
      // console.log(this.state.options.start);
    }
  };

  changeSorted = (val) => {
    if (this._isMounted) {
      let optDt = { ...this.state.options };
      optDt.column = val[0].id;
      optDt.dir = val[0].desc ? "desc" : "asc";
      this.setState({ options: optDt }, () => this.fetchData());
    }
  };

  onResetFilter = (val) => {
    this.setState(
      {
        options: val,
      },
      () => this.fetchData()
    );
  };

  handleFilter = (event) => {
    let filters = { ...this.state.options };
    filters.start = 0;
    filters.page = 0;
    filters[event.target.name] = event.target.value;
    this.setState({ options: filters }, () => {
      this.debounced();
    });
  };

  expired_tdp = (date = "") => {
    let filters = { ...this.state.options };
    filters.start = 0;
    filters.page = 0;
    if (date !== "") {
      filters.expired_tdp = date;
    } else {
      filters.expired_tdp = "";
    }
    this.setState({ options: filters }, () => {
      this.fetchData();
    });
  };

  getCheck = (check) => {
    let filters = { ...this.state.options };
    filters.start = 0;
    if (check.length > 0) {
      filters.status = check.join(";");
      this.setState({ options: filters }, () => this.fetchData());
    } else {
      filters.status = [];
      this.setState({ options: filters }, () => this.fetchData());
    }
  };

  filterCoi = () => {
    let filters = { ...this.state.options };
    let arr = [];
    this.state.data.data.forEach((element) => {
      arr.push(element.vendor_id);
    });
    filters.coi = "1";
    filters.getVendor = arr;
    this.setState({ options: filters }, () => {
      this.fetchData();
    });
  };

  toggleClose = (e, id) => {
    this.setState({ modalOpen: false });
  };

  toDocExpired(e, uuid) {
    this.props.history.push("/vendor/dokumen-expired/" + uuid);
  }
	filterby = (payload) => {
		let idFilter1=[], idFilter2 = [], idFilter3 = []
    this.props.changeFiltersTableVendor()
		if(payload==="general"){
			this.state.selectedOptions.BidangUsahaSelected.forEach(element => {
				console.log(element)
				idFilter1.push(element.value)
			});
			this.state.selectedOptions.SubBidangUsahaSelected.forEach(element => {
				idFilter2.push(element.value)
			});
			this.state.selectedOptions.TipeRekananSelected.forEach(element => {
				idFilter3.push(element.value)
			});
			setTimeout(() => {
				this.setState(({ options }) => ({
					options: { ...options, filter1 : idFilter1 , filter2 :idFilter2 , filter3 :idFilter3  }
				}), () => this.fetchData());
			}, 50);			
		}else{
			this.state.selectedOptions.KlasifikasiSelected.forEach(element => {
				idFilter1.push(element.value)
			});

			this.state.selectedOptions.SubKlasifikasiSelected.forEach(element => {
				idFilter2.push(element.value)
			});

			this.state.selectedOptions.KualifikasiSelected.forEach(element => {
				idFilter3.push(element.value)
			});
			this.setState(({ options }) => ({
				options: { ...options, filter1: idFilter1, filter2 : idFilter2, filter3 :idFilter3  }
			}), () => this.fetchData());
		}
	}

  getBidangUsaha(payload) {
	if (this._isMounted) {
		this.setState(({ loadings, isDisabled, sendData }) => ({
		loadings: { ...loadings, bidangUsaha: true },
		isDisabled: { ...isDisabled, bidangUsaha: true },
		}));
		this.props
		.fetchBidangUsaha({column: 'id',dir: 'asc'})
		.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
			return { value: data.id, label: data.id + ' - ' + data.name };
			});
			this.setState(({ loadings, isDisabled, regions, sendData }) => ({
			loadings: { ...loadings, bidangUsaha: false },
			isDisabled: { ...isDisabled, bidangUsaha: false },
			optionsBidangUsaha: options,
			}));
		})
		.catch((resp) => {
			this.setState(({ loadings, isDisabled }) => ({
			loadings: { ...loadings, bidangUsaha: false },
			isDisabled: { ...isDisabled, bidangUsaha: false },
			}));
			toastr.error(resp.data.status, resp.data.message);
		});
	}
}

	getSubBidangUsaha(payload) {
		if (this._isMounted) {
		if (payload !== null) {
			this.setState(({ loadings, isDisabled }) => ({
			loadings: { ...loadings, subBidangUsaha: true },
			isDisabled: { ...isDisabled, subBidangUsaha: true },
			}));
			let id=[]
			this.state.selectedOptions.BidangUsahaSelected.forEach(element => {
				id.push(element.value)
			});
			let params = { select : payload , bidang_usaha_id: id.join(';') ,start:0 ,length  : 10 }
			console.log(params)
			this.props
			.fetchSubBidangUsaha(params)
			.then((resp) => {
				let data = resp.data.data;
				let options = data.map((data) => {
				return { value: data.id, label: data.id + ' - ' + data.name , bidang_usaha_id : data.bidang_usaha_id };
				});
				this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, subBidangUsaha: false },
				isDisabled: { ...isDisabled, subBidangUsaha: false },
				subBidangUsaha: options,
				}));
			})
			.catch((resp) => {
				this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, subBidangUsaha: false },
				isDisabled: { ...isDisabled, subBidangUsaha: false },
				}));
				toastr.error(resp.data.status, resp.data.message);
			});
		}
		}
	}

	getTipeRekanan(payload) {
		if (this._isMounted) {
		this.setState(({ loadings, isDisabled }) => ({
			loadings: { ...loadings, tipeRakanan: true },
			isDisabled: { ...isDisabled, tipeRakanan: true },
		}));
		this.props
			.fetchTipeRekanan({column: 'id',dir: 'asc'})
			.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.id, label: data.id + ' - ' + data.name };
			});
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, tipeRekanan: false },
				isDisabled: { ...isDisabled, tipeRekanan: false },
				tipeRekanan: options,
			}));
			})
			.catch((resp) => {
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, tipeRekanan: false },
				isDisabled: { ...isDisabled, tipeRekanan: false },
			}));
			toastr.error(resp.data.status, resp.data.message);
			});
		}
	}
  
	getKlasifikasi(payload) {
		if (this._isMounted) {
		this.setState(({ loadings, isDisabled }) => ({
			loadings: { ...loadings, klasifikasi: true },
			isDisabled: { ...isDisabled, klasifikasi: true },
		}));
		this.props
			.fetchVendorClassification()
			.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.id, label: data.id + ' - ' + data.name };
			});
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, klasifikasi: false },
				isDisabled: { ...isDisabled, klasifikasi: false },
				optionsKlasifikasi : options,
			}));
			})
			.catch((resp) => {
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, klasifikasi: false },
				isDisabled: { ...isDisabled, klasifikasi: false },
			}));
			toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	getSubKlasifikasi(payload) {
		if (this._isMounted) {
		this.setState(({ loadings, isDisabled }) => ({
			loadings: { ...loadings, sub_klasifikasi: true },
			isDisabled: { ...isDisabled, sub_klasifikasi: true },
		}));
		let id = []
		this.state.selectedOptions.KlasifikasiSelected.forEach(element => {
				id.push(element.value)
			});
		this.props
			.fetchVendorSubClassification({select : payload , vendor_classification_id : id.join(';'), column: 'id',dir: 'asc' , start:0 , length: 10})
			.then((resp) => {
			let data = resp.data.data;
			let options = data.map((data) => {
				return { value: data.id, label: data.id + ' - ' + data.name , vendor_classification_id : data.vendor_classification_id};
			});
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, sub_klasifikasi: false },
				isDisabled: { ...isDisabled, sub_klasifikasi: false },
				optionsSubKlasifikasi : options,
			}));
			})
			.catch((resp) => {
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, sub_klasifikasi: false },
				isDisabled: { ...isDisabled, sub_klasifikasi: false },
			}));
			toastr.error(resp.data.status, resp.data.message);
			});
		}
	}

	fetchVendorQualification = () => {
		this.setState(({ loadings }) => ({ loadings: { ...loadings, qualification: true } }));
		this.props.fetchVendorQualification()
		.then((resp) => {
			let qualifications = resp.data.data;
			let options = qualifications.map((dt) => {
				return { value: dt.id, label: dt.id+' - '+dt.name };
			})

			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, qualification: false },
				isDisabled: { ...isDisabled, qualification: false },
				optionsKualifikasi : options,
			}));
		})
		.catch((resp) => {
			this.setState(({ loadings, isDisabled }) => ({
				loadings: { ...loadings, qualification: false },
				isDisabled: { ...isDisabled, qualification: false }
			}));
			toastr.error(resp.data.message, resp.data.status);
		});
	}

	changeTipePenyedia (payload) {
		this.setState(({ options }) => ({
			options: { ...options, tipe_penyedia: payload },
		}));
	}

	changeBidangUsaha (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, BidangUsahaSelected: payload },
		}));
		setTimeout(() => {
			this.getSubBidangUsaha()
		}, 100);
	}

	changeSubBidangUsaha (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, SubBidangUsahaSelected: payload },
		}));
		setTimeout(() => {
			this.getSubBidangUsaha()
		}, 100);
	}

	changeTipeRekanan (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, TipeRekananSelected: payload },
		}));
	}

	changeKlasifikasi (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, KlasifikasiSelected: payload },
		}));
		setTimeout(() => {
			this.getSubKlasifikasi()
		}, 100);
	}

	changeSubKlasifikasi (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, SubKlasifikasiSelected: payload },
		}));
		setTimeout(() => {
			this.getSubKlasifikasi()
		}, 100);
	}

	changeKualifikasi (payload) {
		this.setState(({ selectedOptions }) => ({
			selectedOptions: { ...selectedOptions, KualifikasiSelected: payload },
		}));
	}

  render() {
    return (
      <div>
        <Panel className="margin-bot-false">
          <PanelHeader>Vendor</PanelHeader>
          <PanelBody>
            <div className="row">
              <div className="col-sm-12">
			  <Vendor
					loadings = {this.state.loadings}
					sos_header={this.props.sos_header}
					sos_item={this.props.sos_item}
					status = {this.props.status}
					optionsFilterBy={this.state.tipePenyediaOptions}
					optionsBidangUsaha = {this.state.optionsBidangUsaha}
					optionsSubBidangUsaha = {this.state.subBidangUsaha}
					optionsTipeRekanan = {this.state.optionsTipeRekanan}
					optionsKlasifikasi = {this.state.optionsKlasifikasi}
					optionsSubKlasifikasi = {this.state.optionsSubKlasifikasi}
					filterby={(payload) => this.filterby(payload)}
					getSubBidangUsaha={(payload) => this.getSubBidangUsaha(payload)}
					changeSubBidangUsaha = {(payload) => this.changeSubBidangUsaha(payload)}
					changeBidangUsaha = {(payload) => this.changeBidangUsaha(payload)}
					changeTipeRekanan = {(payload) => this.changeTipeRekanan(payload)}
					changeKlasifikasi = {(payload) => this.changeKlasifikasi(payload)}
					changeTipePenyedia = {(payload) => this.changeTipePenyedia(payload)}
					changeSubKlasifikasi = {(payload) => this.changeSubKlasifikasi(payload)}
					getSubKlasifikasi  = {(payload) => this.getSubKlasifikasi(payload)}
					optionsKualifikasi = {this.state.optionsKualifikasi}
					changeKualifikasi = {(payload) => this.changeKualifikasi(payload)}
					selectedOptions = {this.state.selectedOptions}
					filter_dur ={this.props.filter_dur}
				/>
              </div>
			  <br></br>
            </div>
            <div className="row m-t-10">
              <div className="col-sm-12">
                <ReactTableFixedColumns
                  columns={this.columns}
                  filterable
                  loading={this.state.loading}
                  manual
                  minRows={1}
                  PaginationComponent={Pagination}
                  pageSizeOptions={[10, 20, 25, 50, 100, "All"]}
                  recordsTotal={this.state.data.recordsTotal}
                  recordsFiltered={this.state.data.recordsFiltered}
                  data={this.state.data.data}
                  showPagination={true}
                  defaultPageSize={10}
                  defaultSorted={this.defaultSorted}
                  pages={this.state.total}
                  page={this.state.options.page}
                  onSortedChange={(val) => {
                    this.changeSorted(val);
                  }}
                  onPageSizeChange={(length) => {
                    this.changePageSize(length);
                  }}
                  onPageChange={(perPage) => {
                    this.changePage(perPage);
                  }}
                  onResetFilter={(val) => this.onResetFilter(val)}
                  options={this.state.options}
                  className="-highlight"
                />
              </div>
            </div>
            <div className="row m-t-10">
              <div className="col-sm-12">
                <button
                  type="button"
                  onClick={(e) => this.filterCoi(e)}
                  className="btn btn-sm btn-white m-r-5"
                >
                  {" "}
                  Open Coi{" "}
                </button>
                <button
                  type="button"
                  onClick={(e) => this.syncrnVendorSAP()}
                  className={
                    this.state.loadings.loading_syncrn_vendor_sap
                      ? "btn btn-sm btn-white disabled m-r-5"
                      : "btn btn-sm btn-white m-r-5"
                  }
                >
                  Syncr Vendor SAP
                  {this.state.loadings.loading_syncrn_vendor_sap && (
                    <i className="fa fa-spinner fa-spin"></i>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => this.downloadDurVendorDocument(e)}
                  className={
                    this.state.loadings.loading_dur_generate_document_vendor
                      ? "btn btn-sm btn-white disabled m-r-5"
                      : "btn btn-sm btn-white m-r-5"
                  }
                >
                  {this.state.loadings.loading_dur_generate_document_vendor && (
                    <i className="fa fa-spinner fa-spin"></i>
                  )}
                  Print
                </button>
                {/* {this.props.status !== 'y' && <button type="button" onClick={(e) => this.props.submitDraft(e)} className={this.state.loadings.loading_dur_generate_document_vendor ? 'btn btn-sm btn-info disabled m-r-5' : 'btn btn-sm btn-info m-r-5'}>
									{this.state.loadings.loading_dur_generate_document_vendor && <i className="fa fa-spinner fa-spin"></i>}
									Save Draft
								</button>} */}
              </div>
            </div>
            <div className="row m-t-15">
              <div className="col-sm-12">
                <TableAprrovalProposalTender data={this.props.data_approval} />
              </div>
            </div>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

const stateToProps = (state) => {
  return {
    sidebarDt: state.sidebarDt,
    access: state.sidebarDt.access,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    // ShowDetailPurchasingRequisition: (id) => dispatch(ShowDetailPurchasingRequisition(id)),
	fetchTipeRekanan: (params) => dispatch(fetchTipeRekanan(params)),
    showDurVendor: (id, payload) => dispatch(showDurVendor(id, payload)),
    syncrnVendorSAP: (id, payload) => dispatch(syncrnVendorSAP(id, payload)),
    downloadDurVendorDocument: (id) => dispatch(downloadDurVendorDocument(id)),
	fetchBidangUsaha : (params) => dispatch(fetchBidangUsaha(params)),
	showFilterDurVendor : (id, payload) => dispatch(showFilterDurVendor(id, payload)),
	fetchSubBidangUsaha : (params) => dispatch(fetchSubBidangUsaha(params)),
	fetchVendorClassification : (params) => dispatch(fetchVendorClassification(params)),
	fetchVendorSubClassification : (params) => dispatch(fetchVendorSubClassification(params)),
	fetchVendorQualification : (params) => dispatch(fetchVendorQualification(params))
  };
};

export default withRouter(
  connect(stateToProps, dispatchToProps)(withTranslation()(Table))
);
