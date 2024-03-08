import React, { Component } from 'react'
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader } from 'reactstrap';
import { showAwarding, saveAwarding, reNegoAwarding, approveAwarding, fetchLampiranAwarding, publishAwarding } from '../../../store/actions/tendering/awardingActions';
import { saveRetender } from '../../../store/actions/tendering/retenderActions';
import Form from './detail/Form'
import Konfirmasi from './detail/Konfirmasi'
import HistoryApproval from './detail/HistoryApproval'
import KonfirmasiPaket from './detail/KonfirmasiPaket'
import PemenangDetail from './detail/PemenangDetail'
import ItemDetail from './detail/ItemDetail';
import FormBatalTender from './detail/FormBatalTender'
import ReactLoading from 'react-loading';
import { Panel, PanelBody } from './../../../containers/layout/sub/panel/panel';
import { fileUpload } from '../../../store/actions/uploadActions';
import { downloadAwardingBeritaAcara } from '../../../store/actions/tendering/monitoringTenderBuyerActions';

export class DetailAwarding extends Component {
    constructor(props) {
        super(props)
        this._isMounted = false;
        this.state = {
            data: [],
            nego: [],
            param_submit_batal_tender: [],
            pemenang_terpilih: [],
            param_modal: [],
            data_lampiran: [],
            retender: {
                items: [],
                items_selected: [],
            },
            data_catatan: {
                note: '',
                awarding_id: '',
            },
            param_publish: {
                uuid: '',
                status: '',
                note: '',
            },
            jenis_perikatan: '',
            m_jenis_perikatan: [
                {
                    label: 'Purchase Order',
                    value: 'po',
                },
                {
                    label: 'Outline Agreement',
                    value: 'oa',
                }
            ],
            status_perikatan: false,
            status_retender_paket: false,
						loading_pemenang_terpilih: false,
            loadings: {
                loadingModal: true
            },
			modal: {
				item : false,
				alert : false,
				retender : false,
				batal_tender : false
			},
            loading: false,
            errors: [],
            catatan: '',
            status_catatan: false,
            loadingSubmit: false,
            loading_lampiran: true,
            modalOpen:false,
            modalConfirm:false,
            isConfirm:false,
            statusDisableOA:false,
            statusAccountAssignment:false,
            statusItemOA:false,
            uuid:'',
            alert: {
                name: '',
                btn: '',
                btn_color: '',
            },
            arrSelectedVendor : []
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getUUID()
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    toggleClose = () => {
		this.setState(({ loadings }) => ({
			loadings: { ...loadings, loadingModal:true},
			modalOpen:false,
            modalConfirm:false,
            loading_lampiran:false,
		}));
	}

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    toggleConfirm = (e, value, name) => {
        if (e !== '') {            
            e.preventDefault();
        }
        const uuid = (typeof value !== 'undefined') ? value : e.target.value;
		this.setState(({ alert }) => ({
			alert: { ...alert, name: name, btn: this.props.t("common:delete.yes") + ', ' + name, btn_color: 'success'},
            isConfirm: true,
            uuid: uuid,
		}));
    }

    toggleSweetAlert(name) {
        switch (name) {
            case 'Re-Nego':
                this.reNegoAwarding(this.state.uuid)
                break;
            case 'Re-Awarding':
                this.publishAwarding(this.state.uuid)
                break;
            case 'Publish Hasil Pemenang':
                this.publishAwarding(this.state.uuid)
                break;
            case 'cancel':
                this.setState({ isConfirm: false, uuid: '' });
                break;
            default:
                this.setState({ isConfirm: false, uuid: '' });
                break;
        }
    }

    getUUID = async () => {
        if (this._isMounted) {
            this.setState({ loading: true });
            this.props
                .showAwarding(this.props.match.params.id)
                .then((resp) => {
                    let datas = resp.data.data;
                    // datas.status = 'd'
                    if (datas.list_approval.length > 0){
                        let date1 = new Date(localStorage.getItem("times"));
                        // let date2 = new Date(localStorage.getItem("times"));
                        let date2 = new Date(datas.list_approval[datas.list_approval.length - 1].tanggal_ttd);
                        let date3 = new Date(date2.setDate(date2.getDate() + 4));
                        date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
                        date3 = new Date(date3.getFullYear(), date3.getMonth(), date3.getDate());
    
                        let datediff = 0
                        if (date1 < date3) {
                            const diffTime = Math.abs(date1 - date3);
                            datediff = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        }
                        datas.masa_sanggah = datediff + ' hari'
                    }else{
                        datas.masa_sanggah = ''
                    }

                    let nego = datas.rekap_negosiasi;
                    let jenis_perikatan = this.state.jenis_perikatan;
                    if (jenis_perikatan === '' && datas.jenis_perikatan !== null && datas.jenis_perikatan !== '' && datas.jenis_perikatan !== undefined) {
                        jenis_perikatan = {
                            value: datas.jenis_perikatan,
                            label: datas.jenis_perikatan_text
                        }
                    }
                    let TempArrSelectedItems=[]
                    if(datas.order_placement==="itemize"){
                        datas.items.forEach(element => {
                            let variableTemp = ""+element.pr_number+""+element.pr_item_number+""
                            TempArrSelectedItems[variableTemp]=[]
                        });
                        datas.pemenang_terpilih.forEach(element => {
                            let variableTemp = ""+element.pr_number+""+element.pr_item_number+""
                            TempArrSelectedItems[variableTemp].push(element.vendor_id)
                        })
                    }

                    let pemenang_terpilih = datas.pemenang_terpilih;
                    if (this.state.nego.length > 0) {
                        nego = this.state.nego;
                    }
                    // if (this.state.pemenang_terpilih.length > 0) {
                    //     pemenang_terpilih = this.state.pemenang_terpilih;
                    // }

                    this.setState({ jenis_perikatan: jenis_perikatan, loading: false, data: datas, nego: nego, pemenang_terpilih: pemenang_terpilih.sort((a,b) => a.pr_number - b.pr_number || a.pr_item_number - b.pr_item_number || a.no_material - b.no_material || a.ranking - b.ranking ), arrSelectedVendor : TempArrSelectedItems  }, () => {});
                })
                .catch((resp) => {
                    this.setState({ loading: false });
                    toastr.error(resp.data.message);
                });
        }
    }

    getLampiran = async (payload) => {
        if (this._isMounted) {
            // this.setState({ loading: true });
            this.props
                .fetchLampiranAwarding({ vendor_id: payload.vendor_id, proposal_tender_id: this.state.data.proposal_tender_id })
                .then((resp) => {
                    let datas = resp.data.data.lampiran;
                    this.setState({ loading_lampiran: false, data_lampiran: datas});
                })
                .catch((resp) => {
                    this.setState({ loading_lampiran: false });
                    toastr.error(resp.data.message);;
                });
        }
    }

    handleChecklistWinnerPaket = (e, value) => {
        let pemenang_terpilih = this.state.pemenang_terpilih;
        let index = pemenang_terpilih.findIndex(d => d.awarding_item_id+'-'+d.ranking === value);

        if (pemenang_terpilih[index]['is_winner'] === 'y') {
            pemenang_terpilih[index]['is_winner'] = 'n'
        } else {
            if (pemenang_terpilih[index].ranking.toString() !== '1') {
                this.toggleConfirm(e, [], 'winner')
                // alert('Anda memilih vendor yang bukan ranking 1')
            }
            pemenang_terpilih[index]['is_winner'] = 'y'
        }

        let no_pr = pemenang_terpilih[index].detail[0].pr_number

        // only 1 winner (uncheck other)
        pemenang_terpilih.map(function(d, index_new) {
            if (index !== index_new) {
                d.detail.forEach((element, i) => {
                    if (element.pr_number === no_pr) {
                        d.is_winner = 'n'
                    }
                })
            }
            return true
        })

        this.setState({ pemenang_terpilih: pemenang_terpilih });
    }

    handleChecklistWinnerItem = (e, value) => {
        let pemenang_terpilih = this.state.pemenang_terpilih;
        let nego = this.state.nego;
        let arr_value = value.split('-')
        let varTemp = ""+arr_value[0]+""+arr_value[1]+""

        let index = nego.findIndex(d => d.pr_number === arr_value[0]);
        let index2 = nego[index].item.findIndex(d => d.pr_item_number.toString() === arr_value[1]);
        let index3 = nego[index].item[index2].vendor_list.findIndex(d => d.vendor_id.toString() === arr_value[2]);
        if (nego[index].item[index2].vendor_list[index3].is_winner === 'y') {
            nego[index].item[index2].vendor_list[index3].is_winner = 'n'
        }
        else {
            nego[index].item[index2].vendor_list[index3].qty_temp = nego[index].item[index2].vendor_list[index3].qty_akhir
            if (nego[index].item[index2].vendor_list[index3].ranking.toString() !== '1') {
                this.toggleConfirm(e, [], 'winner')
                // alert('Anda memilih vendor yang bukan ranking 1')
            }
            nego[index].item[index2].vendor_list[index3].is_winner = 'y'
            if (this.state.data.multiwinner === '0') {
                nego[index].item[index2].vendor_list.map(function(d, i) {
                    if (d.vendor_id.toString() !== arr_value[2]) {
                        d.is_winner = 'n'
                    }
                    return true
                })
            }
        }

        let vendor_selected = nego[index].item[index2].vendor_list[index3]
        let arrTemp = []
        let status = false

        pemenang_terpilih.forEach((element, i) => {
            if (element.pr_number.toString() === arr_value[0] && element.pr_item_number.toString() === arr_value[1] && element.vendor_id.toString() === arr_value[2]) {
                status = true
            }
            else {
                if (this.state.data.multiwinner === '0') {
                    if (element.pr_number.toString() === arr_value[0] && element.pr_item_number.toString() === arr_value[1]) {
                        status = true
                        arrTemp.push(vendor_selected)
                    }
                    else {
                        arrTemp.push(element)
                    }
                }
                else {
                    arrTemp.push(element)
                }
            }
        });
        // console.log(arrTemp)
        if (pemenang_terpilih.length > 0) {
            if (status === false) {
                pemenang_terpilih.push(vendor_selected);
            }
            else {
                pemenang_terpilih=arrTemp
            }
        }
        else {
            pemenang_terpilih.push(vendor_selected);
        }
        let tempCheck = this.state.arrSelectedVendor
        console.log(tempCheck)
        let newTempVendorSelectedInItem = []

        if(tempCheck[varTemp].includes(arr_value[2])){
            tempCheck[varTemp].forEach(element=>{
                if(element!==arr_value[2]){
                    newTempVendorSelectedInItem.push(element)
                }
            })
            tempCheck[varTemp]=newTempVendorSelectedInItem
            console.log('Ada')
        }else{
            console.log('Tidak Ada')
            let tempTempArr = tempCheck[varTemp]
            tempTempArr.push(arr_value[2])
            tempCheck[varTemp]=tempTempArr
        }

        

        this.setState({ loading_pemenang_terpilih: true }, () => {
            this.setState({ nego: nego, pemenang_terpilih: pemenang_terpilih.sort((a,b) => a.pr_number - b.pr_number || a.pr_item_number - b.pr_item_number || a.no_material - b.no_material || a.ranking - b.ranking ), loading_pemenang_terpilih: false, arrSelectedVendor : tempCheck });
        })
    }

    handleChecklistRetender = (e, value) => {
        let nego = this.state.nego;
        let arr_value = value.split('-')
        console.log(arr_value)

        let index = nego.findIndex(d => d.pr_number === arr_value[0]);
        let index2 = nego[index].item.findIndex(d => d.pr_item_number.toString() === arr_value[1]);
        if (nego[index].item[index2].is_retender === 'y') {
            nego[index].item[index2].is_retender = 'n'
            nego[index].item[index2].vendor_list.forEach((arr_vendor, index_vendor) => {
                arr_vendor.is_winner = 'n'
                arr_vendor.is_retender = 'n'
            })
        }
        else {
            nego[index].item[index2].is_retender = 'y'
            nego[index].item[index2].vendor_list.forEach((arr_vendor, index_vendor) => {
                arr_vendor.is_retender = 'y'
            })
        }

        let pemenang_terpilih = this.state.pemenang_terpilih;
        let arrTemp = []

        if (nego[index].item[index2].is_retender === 'y') {
            pemenang_terpilih.forEach((element, i) => {
                if (element.pr_number === arr_value[0] && element.pr_item_number.toString() === arr_value[1]) {
                }
                else {
                    arrTemp.push(element)
                }
            });
            pemenang_terpilih=arrTemp
        }

        let tempCheck = this.state.arrSelectedVendor
        tempCheck[arr_value[1]]=[]

        this.setState({ nego: nego, pemenang_terpilih: pemenang_terpilih.sort((a,b) => a.pr_number - b.pr_number || a.pr_item_number - b.pr_item_number || a.no_material - b.no_material || a.ranking - b.ranking ), arrSelectedVendor : tempCheck });
    }
    
    handleChecklistRetenderPaket = (e, payload, pr_number) => {
        let nego = this.state.nego;
        let pemenang_terpilih = this.state.pemenang_terpilih;

        let arr = this.state.retender.items;
        let arr_selected = this.state.retender.items_selected;
        let arrTemp = []
        let arrTempSelected = []
        if(arr.includes(payload)){
            arr.forEach((element, i) => {
                if (element.pr_number!==pr_number) {
                    arrTemp.push(element)
                    arrTempSelected.push(element.pr_number)
                }
            });
            arr=arrTemp
            arr_selected=arrTempSelected
        } else {
            arr.push(payload);
            arr_selected.push(pr_number)
        }

        pemenang_terpilih.forEach((arr_pemenang, index_pemenang) => {
            arr_pemenang.is_retender = 'n'
        })

        if (!arr_selected.includes(pr_number)) {
            let index = nego.findIndex(d => d.pr_number === pr_number);
            nego[index].item.forEach((arr_item, index_item) => {
                arr_item.is_retender = 'n'
            })
        }

        arr.forEach((arr_pr, index_pr) => {
            // let index = nego.findIndex(d => d.pr_number === arr_pr.pr_number);
            nego.forEach((arr_nego, index_nego) => {
                if (arr_nego.pr_number === arr_pr.pr_number) {
                    arr_nego.item.forEach((arr_item, index_item) => {
                        arr_item.is_retender = 'y'
                    })
                }
            });

            pemenang_terpilih.forEach((arr_pemenang, index_pemenang) => {
                if (arr_pemenang.detail.some(d => d.pr_number === arr_pr.pr_number)) {
                    arr_pemenang.is_retender = 'y'
                    arr_pemenang.is_winner = 'n'
                }
            })
        });


        this.setState(({ retender }) => ({
            retender: { ...retender, items: arr.sort((a,b) => a.pr_number-b.pr_number), items_selected: arr_selected},
            nego: nego,
            pemenang_terpilih: pemenang_terpilih,
        }));
    }
    
    saveAwarding = () => {
        this.setState({ status_perikatan: false, statusDisableOA: false, statusAccountAssignment: false, statusItemOA: false })
        if (this.state.jenis_perikatan === '') {
            this.setState({ status_perikatan: true })
            return
        }

        let retender = [];
        let winner = [];

        let nego = this.state.nego;
        let pemenang_terpilih = this.state.pemenang_terpilih;
        console.log(this.state.arrSelectedVendor)

        if (this.state.data.order_placement === 'itemize') {
            let total_awal = []
            let total_akhir = []
            pemenang_terpilih.forEach((d, i) => {
                
                if (d.qty_temp === undefined || d.qty_temp===null ) {
                    d.qty_temp = d.qty_akhir.toString().replace(',','.')
                }
                let qty_a = d.qty_temp
                let qty_b = d.qty_akhir.toString().replace(',','.')
                if(qty_a===qty_b){
                    let variableTempSubmit = ""+d.pr_number+""+d.pr_item_number+""
                    d.qty_temp = (this.state.arrSelectedVendor[variableTempSubmit].length === 1) ? d.qty_awal.toString().replace(',','.') : 0
                }
                let param = {
                    proposal_tender_item_id: d.proposal_tender_item_id,
                    pr_number: d.pr_number,
                    purchasing_requisition_count_item: d.purchasing_requisition_count_item,
                    account_assignment: d.account_assignment,
                    winner_id: d.vendor_id,
                    pr_tipe: d.pr_tipe,
                    qty: parseFloat(d.qty_temp),
                    pr_qty: parseFloat(d.pr_qty.toString().replace(',','.')),
                    price: parseFloat(d.harga_akhir.toString().replace(',','.')),
                    is_winner: d.is_winner,
                }
                winner.push(param)

                total_awal[d.pr_number + '-' + d.pr_item_number] = parseFloat(d.pr_qty.replace('.','').replace(',','.'))
                if (d.qty_temp === undefined) {
                    d.qty_temp = parseFloat(d.qty_akhir.toString().replace(',','.'))
                }
                if (total_akhir[d.pr_number + '-' + d.pr_item_number]) {
                    total_akhir[d.pr_number + '-' + d.pr_item_number] += parseFloat(d.qty_temp.toString().replace(',','.'))
                }
                else {
                    total_akhir[d.pr_number + '-' + d.pr_item_number] = parseFloat(d.qty_temp.toString().replace(',','.'))
                }
            })
            let status = false
            Object.keys(total_akhir).map(function (key, index) {
                if (total_akhir[key] > total_awal[key]) {
                    status = true
                    console.log(total_akhir[key])
                }
                return true
            })
            if (status) {
                alert('QTY MELEBIHI BATAS!\n*cek keterangan di pemenang terpilih')
                return
            }
        }
        else if (this.state.data.order_placement === 'paket') {
            pemenang_terpilih.forEach((element, i) => {
                if (element.is_winner === 'y') {
                    element.detail.forEach((element2, i2) => {
                        let param = {
                            proposal_tender_item_id: element2.proposal_tender_item_id,
                            pr_number: element2.pr_number,
                            purchasing_requisition_count_item: element2.purchasing_requisition_count_item,
                            account_assignment: element2.account_assignment,
                            qty: element2.qty_akhir,
                            pr_qty: element2.pr_qty,
                            price: element2.harga_akhir,
                            winner_id: element2.vendor_id,
                            is_winner: element2.is_winner,
                        }
                        winner.push(param)
                    })
                }
            })
        }
        nego.forEach((data_nego, i_nego) => {
            data_nego.item.forEach((element, i) => {
                if (element.is_retender === 'y') {
                    if (element.remark === undefined) {
                        element.remark = null
                    }
                    let param = {
                        proposal_tender_item_id: element.vendor_list[0].proposal_tender_item_id,
                        is_retender: element.is_retender,
                        remark: element.remark,
                    }
                    retender.push(param)
                }
            })
        })
        // console.log(retender)
        // console.log(winner)
        if (this.state.jenis_perikatan.value === 'oa') {
            let no_pr = '';
            let array_count = [];
            let status_pr_oa = false;
            let status_item_oa = false;
            let status_account_assignment = false;
            winner.forEach((element, i) => {
                if (array_count[element.pr_number + '-' + element.winner_id]) {
                    array_count[element.pr_number + '-' + element.winner_id].count += 1
                }
                else {
                    array_count[element.pr_number + '-' + element.winner_id] = {
                        count: 1,
                        total_item: element.purchasing_requisition_count_item
                    }
                }
                if (i === 0) {
                    no_pr = element.pr_number
                }
                else {
                    if (no_pr !== element.pr_number) {
                        status_pr_oa = true
                    }
                }
            })
            Object.keys(array_count).map(function (key, index) {
                if (array_count[key].count < array_count[key].total_item) {
                    status_item_oa = true
                }
                return true
            })
            if (status_pr_oa) {
                this.setState({ statusDisableOA: true })
                return
            }
            if (status_item_oa) {
                this.setState({ statusItemOA: true })
                return
            }
            if (status_account_assignment) {
                this.setState({ statusAccountAssignment: true })
                return
            }
        }
        // return

        let param = {
            proposal_tender_id: this.state.data.proposal_tender_id,
            multiwinner: this.state.data.multiwinner,
            order_placement: this.state.data.order_placement,
            winner: winner,
            retender: retender,
            jenis_perikatan: this.state.jenis_perikatan.value,
            note: this.state.catatan,
        }
        console.log(param)
        this.setState({ errors: [] })
        this.props.saveAwarding(param)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.toggleClose()
                this.getUUID()
            })
            .catch(error => {
                if (error !== undefined) {
                    toastr.error(error.data.message)
                    this.setState({ errors: error.data.errors })
                } else {
                    toastr.error('Opps Somethings Wrong')
                }
            })
    }

    reNegoAwarding = (id) => {
        this.props.reNegoAwarding(id)
            .then((resp) => {
                toastr.success(resp.data.message);
                this.props.history.push('/tendering/awarding')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    approveAwarding = (payload) => {        
        if (this._isMounted) {
            this.setState({ status_catatan: false })
            if (this.state.catatan === '') {
                this.setState({ status_catatan: true })
                return 
            }

            let param = {
                status: payload.status,
                note: this.state.catatan,
            }
            // console.log(payload)
            this.props.approveAwarding(this.state.data.proposal_tender_uuid, param)
                .then((resp) => {
                    console.log(resp)
                    this.setState({ status_catatan: false }, () => {
                        this.toggleClose()
                        this.getUUID()
                        toastr.success(resp.data.message);
                    })
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    publishAwarding = (uuid) => {
        if (this._isMounted) {
            this.props.publishAwarding(uuid, this.state.param_publish)
                .then((resp) => {
                    toastr.success(resp.data.message);
                    this.toggleClose()
                    if (this.state.param_publish.status === 'd') {
                        window.location.reload();
                    }
                    else if(this.state.param_publish.status === 's') {
                        window.history.back()
                    }
                })
                .catch(error => {
                    if (error !== undefined) {
                        toastr.error(error.data.message)
                    } else {
                        toastr.error('Opps Somethings Wrong')
                    }
                })
        }
    }

    toggleBatalTender = (payload) => {
        this.setState(({ loadings}) => ({
            loadings: { ...loadings, loadingModal:false },
            param_submit_batal_tender: [],
            modalOpen:true,
            modalType:'batal-tender',
        }), () => {
            // this.fetchVendorAwarding('')
        });
    }

    saveRetender = (payload) => {
        this.setState(({ loadings }) => ({ loadings: { ...loadings, button: true } }));
        // console.log(payload)
        // console.log('aman')
        // return
		this.props.saveRetender(payload)
		.then((resp) => {
			toastr.success(resp.data.status, resp.data.message);
			this.setState(({ loadings }) => ({
                loadings: { ...loadings, button: false }
            }), () => {
                this.toggleClose()
            });
			this.props.history.push(`/tendering/retender`)
		})
		.catch((resp) => {
			this.setState(({ loadings }) => ({ loadings: { ...loadings, button: false }, errors: resp.data.errors }));
			const errors = resp.data.errors;
			if(errors){
				var msg = Object.keys(errors).map((key) => { return <li key={key}>{errors[key]}</li> });
				const toastr_msg = {component: ( <React.Fragment><ul>{msg}</ul></React.Fragment> )};
				if(typeof errors === 'string'){ toastr.error(resp.data.message, errors); } else { toastr.error(resp.data.message, toastr_msg); }
			} else {
				toastr.error(resp.data.message);
			}
		});
	}

    onInputChangeRemark = (value, id) => {
        let nego = this.state.nego;
        let arr_value = id.split('-')

        let index = nego.findIndex(d => d.pr_number === arr_value[0]);
        let index2 = nego[index].item.findIndex(d => d.pr_item_number.toString() === arr_value[1]);

        nego[index].item[index2].remark = value

        this.setState({ nego: nego })
    }

    modalConfirm = async (payload) => {
        this.setState({ status_catatan: false })
        if (this.state.catatan === '') {
            this.setState({ status_catatan: true })
            return 
        }
        if (this.state.data.order_placement === 'paket') {
            this.setState(({ loadings}) => ({
                loadings: { ...loadings, loadingModal:false},
                modalOpen:true,
                // modalConfirm:true,
                modalType:'confirm-paket',
            }));
        }
        else {
            this.setState(({ loadings}) => ({
                loadings: { ...loadings, loadingModal:false},
                modalOpen:true,
                // modalConfirm:true,
                modalType:'confirm',
            }));
        }
	}

    modalPemenangDetail = async (payload) => {
        this.getLampiran(payload)
		this.setState(({ loadings}) => ({
			loadings: { ...loadings, loadingModal:false},
            modalOpen:true,
            param_modal: payload,
            modalType:'pemenang-detail',
		}));
	}

    modalItemDetail = async (payload) => {
        let items = this.state.data.items;

        let index = items.findIndex(d => d.pr_number+'-'+d.pr_item_number === payload.pr_number+'-'+payload.pr_item_number);

		this.setState(({ loadings}) => ({
			loadings: { ...loadings, loadingModal:false},
            modalOpen:true,
            param_modal: {tender: items[index], penawaran: payload},
            modalType:'item-detail',
		}));
    }
    
    modalHistoryApproval = async () => {
		this.setState(({ loadings}) => ({
			loadings: { ...loadings, loadingModal:false},
            modalOpen:true,
            param_modal: this.state.data,
            modalType:'history-approval',
		}));
    }

    setPerikatan = (payload) => {
        this.setState({ jenis_perikatan: payload, status_perikatan: false, statusDisableOA: false, statusAccountAssignment: false })
    }

    setValue = (value, keys) => {
        if (value === '') {
            value = 0
        }
        let pemenang_terpilih = this.state.pemenang_terpilih

        let arr_value = keys.split('-')
        let index_pemenang = pemenang_terpilih.findIndex(d => d.pr_number === arr_value[0] && d.pr_item_number.toString() === arr_value[1] && d.vendor_id.toString() === arr_value[2])

        pemenang_terpilih[index_pemenang].qty_temp = value
        this.setState({ pemenang_terpilih: pemenang_terpilih })
    }

    onInputChangeCatatan = (value) => {
        if (value !== '') {
            this.setState({ status_catatan: false })
        }
        this.setState({ catatan: value })
    }

    setStatusPublish = (payload) => {
        this.setState({ status_catatan: false })
        if (this.state.catatan === '') {
            this.setState({ status_catatan: true })
            return 
        }
        let param_publish = this.state.param_publish
        param_publish.uuid =  this.state.data.proposal_tender_uuid
        param_publish.note = payload.note
        param_publish.status = payload.status
        let title = ''
        if (payload.status === 'd') {
            title = 'Re-Awarding'
        }
        else if (payload.status === 's') {
            title = 'Publish Hasil Pemenang'
        }
        this.setState({param_publish: param_publish}, () => {
            this.toggleConfirm('', this.state.data.proposal_tender_uuid, title)
        })

    }

    renderSwitchBody(param) {
        switch(param) {
          case 'history-approval':
            return <HistoryApproval
						data={this.state.data}
                        toggleClose={this.toggleClose}
						/>;
          case 'confirm':
            return <Konfirmasi
						data={this.state.pemenang_terpilih}
                        nego={this.state.nego}
                        toggleClose={this.toggleClose}
                        approveAwarding={this.approveAwarding}
						/>;
          case 'confirm-paket':
            return <KonfirmasiPaket
						data={this.state.pemenang_terpilih}
                        nego={this.state.nego}
                        toggleClose={this.toggleClose}
                        approveAwarding={this.approveAwarding}
						/>;
          case 'item-detail':
            return <ItemDetail
						data={this.state.param_modal}
                        toggleClose={this.toggleClose}
						/>;
          case 'pemenang-detail':
            return <PemenangDetail
						data={this.state.param_modal}
						loading_lampiran={this.state.loading_lampiran}
						data_lampiran={this.state.data_lampiran}
                        toggleClose={this.toggleClose}
						/>;
          case 'batal-tender':
            return <FormBatalTender
                        fileUpload={this.props.fileUpload}
                        toggleClose={() => this.toggleClose()}
                        saveRetender={this.saveRetender}
                        upload={this.props.fileUpload}
                        parentState={this.state}
						/>;
          default:
            return <Konfirmasi
						data={this.state.data.pemenang_terpilih}
						toggleClose={this.toggleClose}
                        approveAwarding={this.approveAwarding}
						/>;
        }
    }

    renderSwitchHeader(param) {
        switch(param) {
          case 'history-approval':
            return <ModalHeader toggle={() => this.toggleClose()}>History Approval</ModalHeader>;
          case 'confirm':
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
          case 'item-detail':
            return <ModalHeader toggle={() => this.toggleClose()}>Detail Item Penawaran</ModalHeader>;
          case 'pemenang-detail':
            return;
          case 'batal-tender':
            return <ModalHeader toggle={() => this.toggleClose()}>Batal Tender</ModalHeader>;
          default:
            return <ModalHeader toggle={() => this.toggleClose()}>Konfirmasi</ModalHeader>;
        }
    }

    downloadAwardingBeritaAcara = (e) => {
        // this.setState(({}) => ({loadingDownload : true}));
        e.preventDefault()
		this.props.downloadAwardingBeritaAcara(this.props.match.params.id)
		.then((resp) => {
      	// this.setState(({}) => ({loadingDownload : false}));
			const url = window.URL.createObjectURL(new Blob([resp.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `BA_Awarding_${this.props.user.name}.pdf`); //or any other extension
			document.body.appendChild(link);
			link.click();
		})
		.catch((resp) => {
      this.setState({loadingDownload : false});
			toastr.error("Failed Download Berita Acara");
			// this.setState({loading: false});
		});
	}

    render() {
        const {t} = this.props;
        return (
            <div>
                {this.state.loading &&
                    <Panel>
                        <PanelBody ><center><br /><ReactLoading type="cylon" color="#0f9e3e" /><br /></center>
                        </PanelBody>
                    </Panel>
                }
                { !this.state.loading &&
                    <Form
												parentState={this.state}
                        data={this.state.data}
                        jenis_perikatan={this.state.jenis_perikatan}
                        m_jenis_perikatan={this.state.m_jenis_perikatan}
                        setPerikatan={this.setPerikatan}
                        status_perikatan={this.state.status_perikatan}
                        nego={this.state.nego}
                        retender={this.state.retender}
                        pemenang_terpilih={this.state.pemenang_terpilih}
                        status_catatan={this.state.status_catatan}
                        status_retender_paket={this.state.status_retender_paket}
                        toggleConfirm={this.toggleConfirm}
                        handleChecklistWinnerPaket={this.handleChecklistWinnerPaket}
                        handleChecklistWinnerItem={this.handleChecklistWinnerItem}
                        handleChecklistRetender={this.handleChecklistRetender}
                        handleChecklistRetenderPaket={this.handleChecklistRetenderPaket}
                        onInputChangeRemark={this.onInputChangeRemark}
                        onInputChangeCatatan={this.onInputChangeCatatan}
                        modalConfirm={this.modalConfirm}
                        modalPemenangDetail={this.modalPemenangDetail}
                        modalItemDetail={this.modalItemDetail}
                        modalHistoryApproval={this.modalHistoryApproval}
                        saveAwarding={this.saveAwarding}
                        approveAwarding={this.approveAwarding}
                        loadingSubmit={this.state.loadingSubmit}
                        loadings={this.state.loadings}
                        user={this.props.user}
                        errors={this.state.errors}
                        setValue={this.setValue}
                        downloadAwardingBeritaAcara={this.downloadAwardingBeritaAcara}
                        statusDisableOA={this.state.statusDisableOA}
                        statusAccountAssignment={this.state.statusAccountAssignment}
                        statusItemOA={this.state.statusItemOA}
                        toggleBatalTender={this.toggleBatalTender}
                        setStatusPublish={this.setStatusPublish}
                    />
                }
                <Modal isOpen={this.state.modalOpen} toggle={() => this.toggleClose()} className="modal-lg">
                    {this.renderSwitchHeader(this.state.modalType)}
					{this.state.loadings.loadingModal ? (
                        <center>
						<br />
						<ReactLoading type="cylon" color="#0f9e3e" />
						<br />
						</center>
					) : this.renderSwitchBody(this.state.modalType)}
				</Modal>
                <SweetAlert
                    warning
                    show={this.state.isConfirm}
                    showCancel
                    confirmBtnText={this.state.alert.btn}
                    cancelBtnText={t("common:delete.cancel")}
                    confirmBtnBsStyle={this.state.alert.btn_color}
                    cancelBtnBsStyle="default"
                    title={t("common:delete.title-delete")}
                    onConfirm={() => this.toggleSweetAlert(this.state.alert.name)}
                    onCancel={() => this.toggleSweetAlert('cancel')}
                />
                <SweetAlert
                    warning
                    show={this.state.isConfirm && this.state.alert.name === 'winner'}
                    confirmBtnText={t("common:Button.Tutup")}
                    confirmBtnBsStyle="white"
                    title="Pemenang terpilih bukan ranking 1"
                    onConfirm={() => this.toggleSweetAlert(this.state.alert.name)}
                />
                {/* { this.state.modalConfirm &&
                    <ModalPersyaratanTambahan
                        fileUpload={this.props.fileUpload}
                        toggleClose={this.toggleClose}
                        errors={this.state.errors}
                        updatePersyaratanDetail={this.updatePersyaratanDetail}
                        savePersyaratanDetail={this.savePersyaratanDetail}
                        toggleAdd={this.state.modalPersyaratanTambahan}
                        showPraQualificationPersyaratanTambahan={this.props.showPraQualificationPersyaratanTambahan}
                        toggleClose={this.toggleCloseModalPersyaratanTambahan}
                        uuid={this.state.uuid_persyaratan_tambahan}
                        proposal_tender_id={this.state.data.id}
                    />
                } */}
            </div>
        )
    }
}

const stateToProps = state => {
    return {
        sidebarDt: state.sidebarDt,
        access: state.sidebarDt.access,
        user: state.auth.user.data,
    }
}

const dispatchToProps = dispatch => {
    return {
        showAwarding: (id) => dispatch(showAwarding(id)),
        saveAwarding: (payload) => dispatch(saveAwarding(payload)),
        reNegoAwarding: (id) => dispatch(reNegoAwarding(id)),
        approveAwarding: (id, payload) => dispatch(approveAwarding(id, payload)),
        fetchLampiranAwarding: (params) => dispatch(fetchLampiranAwarding(params)),
        downloadAwardingBeritaAcara: (uuid, params) => dispatch(downloadAwardingBeritaAcara(uuid, params)),
		saveRetender: (payload) => dispatch(saveRetender(payload)),
        fileUpload: (id, payload) => dispatch(fileUpload(id, payload)),
        publishAwarding: (id, payload) => dispatch(publishAwarding(id, payload)),
    }
}

export default connect(stateToProps, dispatchToProps)(withTranslation()(DetailAwarding));

