import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { Modal, ModalHeader } from 'reactstrap';
import MsrFormItem from './MsrFormItem'
import { fetchStorageLocation } from "../../../../store/actions/master/storageLocationsActions";
import { fetchPlant } from "../../../../store/actions/master/plantActions";
import { fetchMrpController } from "../../../../store/actions/master/mrpControllerActions";
import { fetchIncoterms } from "../../../../store/actions/master/incotermsActions";
import { fetchPurchasingOrg } from "../../../../store/actions/master/purchasingOrgActions";
import { fetchPurchasingGroup } from "../../../../store/actions/master/purchasingGroupActions";

import { fetchUom } from '../../../../store/actions/master/uomActions'
import { fetchGlAccount } from '../../../../store/actions/master/glAccountActions'
import { fetchItemCategory } from '../../../../store/actions/master/itemCategoryActions'
import { fetchMaterialServiceMaterial } from '../../../../store/actions/master/materialServiceMaterialActions'
import { fetchMaterialServiceService } from '../../../../store/actions/master/materialServiceServiceActions'
import { fetchAccAssignmentCategory } from '../../../../store/actions/master/accAssignmentCategoryActions'
import { fetchCostCenter } from '../../../../store/actions/master/costCenterActions'
import { fetchWbsProject } from '../../../../store/actions/master/wbsProjectActions'
import { fetchAssets } from '../../../../store/actions/master/assetsActions'


class ModalForm extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false
    this.state = {
      incoterms: [],
      purchasingorg: [],
      mrp: [],
      storagelocation: [],
      purchasinggroup: [],
      GlAccount: [],
      itemcategory: [],
      cost_center: [],
      wbs_element: [],
      assets: [],
      plant: [],
      uom: [],
      item_no: [],
      accAssgnCategory: [],
      loadings: {
        plant: false,
        incoterms: false,
        purchasingorg: false,
        mrp: false,
        storagelocation: false,
        purchasinggroup: false,
        uom: false,
        glaccount: false,
        itemcategory: false,
        item_no: false,
        acc_assgn_category: false,
        cost_center: false,
        wbs_element: false,
        assets: false,
      },
      paramPlant: {
        start: 0,
        length: 10,
        id: '',
        select: ''
      },
      optionsYearChoice: [
        { value: "single_year", label: "Single Year" },
        { value: "multi_year", label: "Multi Year" },
      ],
      optionsClassifikasi: [
        { value: "jasa", label: "Jasa" },
        { value: "barang", label: "Barang" },
      ],
      optionsJenisBarang: [
        { value: "pabrik", label: "Pabrik" },
        { value: "non-pabrik", label: "Non Pabrik" },
      ],
      optionsPekerjaanTambah: [
        { value: "ya", label: "Ya" },
        { value: "tidak", label: "Tidak" },
      ],
      hiddenForm: {
        hiddenItemNo: true,
      },
      disabledForm: {
        disabledDescriptionForm: true,
      }
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    if (this._isMounted) {
      if (this.props.user.has_roles.includes("REQ001") && (this.props.data.status===undefined || this.props.data.status==="d" || this.props.data.status==="r" || this.props.data.status==="")) {
        this.fetchAssets();
        this.fetchCostCenter();
        this.fetchWbsProject();
        this.fetchItemCategory();
        this.fetchIncoterms();
        // this.fetchMrpController();
        this.fetchPlant();
        this.fetchPurchasingGroup();
        this.fetchPurchasingOrg();
        // this.fetchStorageLocation();
        this.fetchUom();
        this.fetchGlAccount();
        this.fetchAccAssignmentCategory();
      }
    }
  }

  toggleClose = () => {
    this.props.toggleClose();
  };

  componentWillUnmount = () => {
    this._isMounted = false
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  toggleClose = () => {
    this.props.toggleClose()
  }

  fetchAssets = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, assets }) => ({
          loadings: { ...loadings, assets: true },
          assets: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchAssets(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +" - "+ data.description };
          });
          this.setState(({ loadings, assets }) => ({
            loadings: { ...loadings, assets: false },
            assets: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, assets: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchCostCenter = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, cost_center }) => ({
          loadings: { ...loadings, cost_center: true },
          cost_center: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchCostCenter(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id +" - "+ data.description };
          });
          this.setState(({ loadings, cost_center }) => ({
            loadings: { ...loadings, cost_center: false },
            cost_center: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, cost_center: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchWbsProject = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, wbs_element }) => ({
          loadings: { ...loadings, wbs_element: true },
          wbs_element: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, company_id: this.props.user.company_id }
          : { start: 0, length: 10, company_id: this.props.user.company_id };
      this.props
        .fetchWbsProject(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id ,label: data.id +" - "+ data.description };
          });
          this.setState(({ loadings, wbs_element }) => ({
            loadings: { ...loadings, wbs_element: false },
            wbs_element: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, wbs_element: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchPlant = (params) => {
    if (this._isMounted) {
      if (params !== undefined) {
        this.setState(({ loadings, paramPlant, mrp, storagelocation }) => ({
          loadings: { ...loadings, plant: true, storagelocation: true, mrp: true },
          paramPlant: { ...paramPlant, id: params.param_id },
          mrp: [],
          storagelocation: []
        }));
      }
      let select_params =
        (params !== undefined && params.select !== '') ?
          { start: 0, length: 10, select: params.selected, purchasing_org_id: this.props.user.purchasing_org_id }
          : { start: 0, length: 10, purchasing_org_id: this.props.user.purchasing_org_id };
      this.props
        .fetchPlant(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, plant }) => ({
            loadings: { ...loadings, plant: false },
            plant: options,
          }));
          if (this.state.paramPlant.id !== '') {
            this.fetchMrpController();
            this.fetchStorageLocation();
          }
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, plant: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchMaterialServiceMaterial = (params) => {

    this.setState(({ loadings, item_no }) => ({
      loadings: { ...loadings, item_no: true },
      item_no: [],
    }));

    let select_params =
      (params !== undefined && params.select !== '') ?
        { start: 0, length: 10, select: params.selected }
        : { start: 0, length: 10 };

    this.props
      .fetchMaterialServiceMaterial(select_params)
      .then((resp) => {
        let data = resp.data.data;
        let options = data.map((data) => {
          return { value: data.id, label: data.id + ' - ' + data.name };
        });
        let tempOptions = [{ value: "manual", label: "Manual" }];
        this.setState(({ loadings, item_no }) => ({
          loadings: { ...loadings, item_no: false },
          item_no: tempOptions.concat(options),
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, item_no: false },
        }));
        toastr.error(resp.data.status, resp.data.message);
      });
  }

  fetchMaterialServiceService = (params) => {
    this.setState(({ loadings, item_no }) => ({
      loadings: { ...loadings, item_no: true },
      item_no: [],
    }));

    let select_params =
      (params !== undefined && params.select !== '') ?
        { start: 0, length: 10, select: params.selected }
        : { start: 0, length: 10 };

    this.props
      .fetchMaterialServiceService(select_params)
      .then((resp) => {
        let data = resp.data.data;
        let options = data.map((data) => {
          return { value: data.id, label: data.id + ' - ' + data.name };
        });
        let tempOptions = [{ value: "manual", label: "Manual" }];

        this.setState(({ loadings, item_no }) => ({
          loadings: { ...loadings, item_no: false },
          item_no: tempOptions.concat(options),
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, item_no: false },
        }));
        toastr.error(resp.data.status, resp.data.message);
      });
  }

  fetchItemCategory = (newValue) => {
    this.setState(({ loadings, itemcategory }) => ({
      loadings: { ...loadings, itemcategory: true }
    }));
    this.props
      .fetchItemCategory()
      .then((resp) => {
        let data = resp.data.data;
        let options = data.map((data) => {
          return { value: data.id, label: data.symbol + ' - ' + data.name };
        });
        this.setState(({ loadings, itemcategory }) => ({
          loadings: { ...loadings, itemcategory: false },
          itemcategory: options,
        }));
      })
      .catch((resp) => {
        this.setState(({ loadings }) => ({
          loadings: { ...loadings, itemcategory: false },
        }));
        toastr.error(resp.data.status, resp.data.message);
      });
  }

  fetchStorageLocation = (newValue) => {
    // console.log(this.state.paramPlant)
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, storagelocation: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue, plant_id: this.state.paramPlant.id }
          : { start: 0, length: 10, plant_id: this.state.paramPlant.id };
      this.props
        .fetchStorageLocation(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, storagelocation }) => ({
            loadings: { ...loadings, storagelocation: false },
            storagelocation: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, storagelocation: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }


  fetchGlAccount = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, glaccount: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchGlAccount(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, glaccount }) => ({
            loadings: { ...loadings, glaccount: false },
            GlAccount: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, glaccount: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchIncoterms = (newValue) => {

    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, incoterms: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchIncoterms(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, incoterms }) => ({
            loadings: { ...loadings, incoterms: false },
            incoterms: options,
          }));

        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, incoterms: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchMrpController = (newValue) => {

    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, mrp: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue, plant_id: this.state.paramPlant.id }
          : { start: 0, length: 10, plant_id: this.state.paramPlant.id };
      this.props
        .fetchMrpController(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, mrp }) => ({
            loadings: { ...loadings, mrp: false },
            mrp: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, mrp: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }



  fetchPurchasingOrg = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasingorg: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue, id: this.props.user.purchasing_org_id }
          : { start: 0, length: 10, id: this.props.user.purchasing_org_id };
      this.props
        .fetchPurchasingOrg(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, purchasingorg }) => ({
            loadings: { ...loadings, purchasingorg: false },
            purchasingorg: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasingorg: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchPurchasingGroup = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, purchasinggroup: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchPurchasingGroup(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, purchasinggroup }) => ({
            loadings: { ...loadings, purchasinggroup: false },
            purchasinggroup: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, purchasinggroup: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchUom = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, uom: true },
      }));
      let select_params =
        newValue !== ""
          ? { start: 0, length: 10, select: newValue }
          : { start: 0, length: 10 };
      this.props
        .fetchUom(select_params)
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.code + ' - ' + data.name };
          });
          this.setState(({ loadings, uom }) => ({
            loadings: { ...loadings, uom: false },
            uom: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, uom: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  fetchAccAssignmentCategory = (newValue) => {
    if (newValue === undefined || newValue !== "") {
      this.setState(({ loadings }) => ({
        loadings: { ...loadings, acc_assgn_category: true },
      }));
      this.props
        .fetchAccAssignmentCategory()
        .then((resp) => {
          let data = resp.data.data;
          let options = data.map((data) => {
            return { value: data.id, label: data.id + ' - ' + data.name };
          });
          this.setState(({ loadings, acc_assgn_category }) => ({
            loadings: { ...loadings, acc_assgn_category: false },
            accAssgnCategory: options,
          }));
        })
        .catch((resp) => {
          this.setState(({ loadings }) => ({
            loadings: { ...loadings, acc_assgn_category: false },
          }));
          toastr.error(resp.data.status, resp.data.message);
        });
    }
  }

  showItemNumberId = (payload) => {
    if (this._isMounted) {
      this.setState(({ hiddenForm, disabledForm }) => ({
        hiddenForm: { ...hiddenForm, hiddenItemNo: payload },
        disabledForm: { ...disabledForm, disabledDescriptionForm: payload }
      })
      );
    }
  }

  render() {
    // const { t } = this.props;
    return (
      <div>
        <Modal isOpen={this.props.toggleAdd} toggle={() => this.toggleClose()}>
        <ModalHeader toggle={() => this.toggleClose()}>Modal {}</ModalHeader>
          <MsrFormItem
            optionsIncoterms={this.state.incoterms}
            optionsMrp={this.state.mrp}
            optionsPlant={this.state.plant}
            optionsPurchasingGroup={this.state.purchasinggroup}
            optionsStorageLocation={this.state.storagelocation}
            optionsPurchasingOrg={this.state.purchasingorg}
            optionsClassifikasi={this.state.optionsClassifikasi}
            optionsItemCategory={this.state.itemcategory}
            optionsJenisBarang={this.state.optionsJenisBarang}
            optionsPekerjaanTambah={this.state.optionsPekerjaanTambah}
            optionsAssets={this.state.assets}
            optionsWbs_element={this.state.wbs_element}
            optionsCost_center={this.state.cost_center}
            optionsUom={this.state.uom}
            optionsItemNo={this.state.item_no}
            optionsAccAssgnCategory={this.state.accAssgnCategory}
            optionsYearChoice={this.state.optionsYearChoice}
            optionsGlAccount={this.state.GlAccount}
            toggleClose={this.toggleClose}
            getStorageLocation={(payload) => this.fetchStorageLocation(payload)}
            getIncoterms={(payload) => this.fetchIncoterms(payload)}
            getPlant={(payload) => this.fetchPlant(payload)}
            getMrpController={(payload) => this.fetchMrpController(payload)}
            getPurchasingGroup={(payload) => this.fetchPurchasingGroup(payload)}
            getPurchasingOrg={(payload) => this.fetchPurchasingOrg(payload)}
            getGlAccount={(payload) => this.fetchGlAccount(payload)}
            getUom={(payload) => this.fetchUom(payload)}
            getMaterialServiceMaterial={(payload) => this.fetchMaterialServiceMaterial(payload)}
            getMaterialServiceService={(payload) => this.fetchMaterialServiceService(payload)}
            getAssets={(payload) => this.fetchAssets(payload)}
            getCostCenter={(payload) => this.fetchCostCenter(payload)}
            getWbsProject={(payload) => this.fetchWbsProject(payload)}
            isLoading={this.state.loadings}
            saveitems={(payload) => this.props.saveitems(payload)}
            showItemNumberId={(payload) => this.showItemNumberId(payload)}
            disableModal={this.props.disableModal}
            data={this.props.data}
            hiddenForm={this.state.hiddenForm}
            disabledForm={this.state.disabledForm}
          />
        </Modal>
      </div>
    );
  }
}
const stateToProps = state => {
  return {
    user: state.auth.user.data,
  }
}

const dispatchToProps = dispatch => {
  return {
    fetchStorageLocation: (params) => dispatch(fetchStorageLocation(params)),
    fetchPlant: (params) => dispatch(fetchPlant(params)),
    fetchCostCenter: (params) => dispatch(fetchCostCenter(params)),
    fetchWbsProject: (params) => dispatch(fetchWbsProject(params)),
    fetchAssets: (params) => dispatch(fetchAssets(params)),
    fetchMrpController: (params) => dispatch(fetchMrpController(params)),
    fetchIncoterms: (params) => dispatch(fetchIncoterms(params)),
    fetchPurchasingOrg: (params) => dispatch(fetchPurchasingOrg(params)),
    fetchPurchasingGroup: (params) => dispatch(fetchPurchasingGroup(params)),
    fetchUom: (params) => dispatch(fetchUom(params)),
    fetchGlAccount: (params) => dispatch(fetchGlAccount(params)),
    fetchItemCategory: (params) => dispatch(fetchItemCategory(params)),
    fetchMaterialServiceService: (params) => dispatch(fetchMaterialServiceService(params)),
    fetchMaterialServiceMaterial: (params) => dispatch(fetchMaterialServiceMaterial(params)),
    fetchAccAssignmentCategory: (params) => dispatch(fetchAccAssignmentCategory(params)),
  }
}

export default connect(stateToProps, dispatchToProps)((ModalForm));
