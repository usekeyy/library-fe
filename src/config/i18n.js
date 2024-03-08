import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from '../translations/en.json';
import id from '../translations/id.json';
import users_en from '../translations/utility/users_en.json';
import users_id from '../translations/utility/users_id.json';
import company_en from '../translations/master/company_en.json';
import company_id from '../translations/master/company_id.json';
import work_units_en from '../translations/master/work_units_en.json';
import work_units_id from '../translations/master/work_units_id.json';
import incoterm_en from '../translations/master/incoterm_en.json';
import incoterm_id from '../translations/master/incoterm_id.json';
import countries_en from '../translations/master/countries_en.json';
import countries_id from '../translations/master/countries_in.json';
import profileVendor_en from '../translations/vendor/profile_vendor_en.json';
import profileVendor_id from '../translations/vendor/profile_vendor_id.json';
import purchasing_group_en from '../translations/master/purchasing_group_en.json';
import purchasing_group_id from '../translations/master/purchasing_group_id.json';
import currency_en from '../translations/master/currency_en.json';
import currency_id from '../translations/master/currency_id.json';
import district_en from "../translations/master/district_en.json";
import district_id from "../translations/master/district_id.json";
import region_en from '../translations/master/region_en.json';
import region_id from '../translations/master/region_id.json';
import vendorAccGroup_en  from '../translations/master/vendorAccGroup_en.json';
import vendorAccGroup_id  from '../translations/master/vendorAccGroup_id.json';
import plant_en from '../translations/master/plant_en.json';
import plant_id from '../translations/master/plant_id.json';
import purchasing_org_en from '../translations/master/purchasing_org_en.json';
import purchasing_org_id from '../translations/master/purchasing_org_id.json';
import uom_en from '../translations/master/uom_en.json';
import uom_id from '../translations/master/uom_id.json';
import mrp_controller_en from '../translations/master/mrp_controller_en.json';
import mrp_controller_id from '../translations/master/mrp_controller_id.json';
import maint_planner_group_en from '../translations/master/maint_planner_group_en.json';
import maint_planner_group_id from '../translations/master/maint_planner_group_id.json';
import storage_location_en  from "../translations/master/storage_location_en.json";
import storage_location_id  from "../translations/master/storage_location_id.json";
import sub_ditricts_en  from "../translations/master/sub_district_en.json";
import sub_ditricts_id  from "../translations/master/sub_district_id.json";
import postal_code_en  from "../translations/master/postal_code_en.json";
import postal_code_id  from "../translations/master/postal_code_id.json";
import villages_en  from "../translations/master/villages_en.json";
import villages_id  from "../translations/master/villages_id.json";
import vendor_bidang_usaha_en from "../translations/master/vendor_bidang_usaha_en.json";
import vendor_bidang_usaha_id from "../translations/master/vendor_bidang_usaha_id.json";
import vendor_qualification_en from "../translations/master/vendor_qualification_en.json";
import vendor_qualification_id from "../translations/master/vendor_qualification_id.json";
import vendor_classification_en from "../translations/master/vendor_classification_en.json";
import vendor_classification_id from "../translations/master/vendor_classification_id.json";
import vendor_sub_classification_en from "../translations/master/vendor_sub_classification_en.json";
import vendor_sub_classification_id from "../translations/master/vendor_sub_classification_id.json";
import company_type_en from "../translations/master/company_type_en.json";
import company_type_id from "../translations/master/company_type_in.json";
import vendor_sub_bidang_usaha_en from "../translations/master/vendor_sub_bidang_usaha_en.json";
import vendor_sub_bidang_usaha_id from "../translations/master/vendor_sub_bidang_usaha_id.json";
import vendor_tipe_rekanan_en from "../translations/master/vendor_tipe_rekanan_en.json";
import vendor_tipe_rekanan_id from "../translations/master/vendor_tipe_rekanan_id.json";
import gl_account_company_en from "../translations/master/gl_account_company_en.json";
import gl_account_company_id from "../translations/master/gl_account_company_id.json";
import wbs_project_en from "../translations/master/wbs_project_en.json";
import wbs_project_id from "../translations/master/wbs_project_id.json";
import cost_center_en from "../translations/master/cost_center_en.json";
import cost_center_id from "../translations/master/cost_center_id.json";
import assets_en from "../translations/master/assets_en.json";
import assets_id from "../translations/master/assets_id.json";
import business_group_en from "../translations/master/business_group_en.json";
import business_group_id from "../translations/master/business_group_id.json";
import document_type_en from "../translations/master/document_type_en.json";
import document_type_id from "../translations/master/document_type_id.json";
import template_persyaratan_en from "../translations/master/template_persyaratan_en.json";
import template_persyaratan_id from "../translations/master/template_persyaratan_id.json";
import jadwal_tender_en from "../translations/master/jadwal_tender_en.json";
import jadwal_tender_id from "../translations/master/jadwal_tender_id.json";
import material_group_sos_header_en from "../translations/master/material_group_sos_header_en.json";
import material_group_sos_header_id from "../translations/master/material_group_sos_header_id.json";
import material_group_sos_item_en from "../translations/master/material_group_sos_item_en.json";
import material_group_sos_item_id from "../translations/master/material_group_sos_item_id.json";
import punishment_vendor_en from "../translations/vendor/punishment_vendor_en.json";
import punishment_vendor_id from "../translations/vendor/punishment_vendor_id.json";
import open_punishment_vendor_en from "../translations/vendor/open_punishment_vendor_en.json";
import open_punishment_vendor_id from "../translations/vendor/open_punishment_vendor_id.json";
import division_en from "../translations/master/division_en.json";
import division_id from "../translations/master/division_id.json";
import mapping_value_approval_en from "../translations/tendering/mapping_value_approval_en.json";
import mapping_value_approval_id from "../translations/tendering/mapping_value_approval_id.json";
import buyer_en from "../translations/master/buyer_en.json";
import buyer_id from "../translations/master/buyer_id.json";
import e_document_en from "../translations/master/e_document_en.json";
import e_document_id from "../translations/master/e_document_id.json";
import searchterms_en from "../translations/master/searchterms_en.json";
import searchterms_id from "../translations/master/searchterms_id.json";
import kelompokPeforma_en from "../translations/master/kelompok_peforma_en.json";
import kelompokPeforma_id from "../translations/master/kelompok_peforma_id.json";
import bobotPeforma_en from "../translations/master/bobot_peforma_en.json";
import bobotPeforma_id from "../translations/master/bobot_peforma_id.json";
import master_vpr_id from "../translations/master/master_vpr_id.json";
import master_vpr_en from "../translations/master/master_vpr_en.json";
import performance_report_en from "../translations/vendor/performance_report_en.json";
import performance_report_id from "../translations/vendor/performance_report_id.json";
import dur_en from "../translations/tendering/dur_en.json";
import dur_id from "../translations/tendering/dur_id.json";
import bid_opening_en from "../translations/tendering/bid_opening_en.json";
import bid_opening_id from "../translations/tendering/bid_opening_id.json";
import evaluation_en from "../translations/tendering/evaluation_en.json";
import evaluation_id from "../translations/tendering/evaluation_id.json";
import monitoring_tender_en from "../translations/tendering/monitoring_tender_en.json";
import monitoring_tender_id from "../translations/tendering/monitoring_tender_id.json";
import aanwijzing_en from "../translations/tendering/aanwijzing_en.json";
import aanwijzing_id from "../translations/tendering/aanwijzing_id.json";
import template_reminder_en from "../translations/master/template_reminder_en.json";
import template_reminder_id from "../translations/master/template_reminder_id.json";
import auction_en from "../translations/auction/auction_en.json"
import auction_id from "../translations/auction/auction_id.json"
import announcement_en from "../translations/master/announcement_en.json"
import announcement_id from "../translations/master/announcement_id.json";
import monitoring_pr_en from "../translations/tendering/monitoring_pr_en.json";
import monitoring_pr_id from "../translations/tendering/monitoring_pr_id.json";
import userguide_id from "../translations/master/userguide_id.json";
import userguide_en from "../translations/master/userguide_en.json";
import condition_type_id from "../translations/master/condition_type_id.json";
import condition_type_en from "../translations/master/condition_type_en.json";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
				common: en,
        users: users_en,
        company:company_en,
        workUnit:work_units_en,
        incoterms : incoterm_en,
        country : countries_en,
        profileVendor : profileVendor_en,
        purchasingGroup : purchasing_group_en,
        currency:currency_en,
        district:district_en,
        region:region_en,
        vendorAccGroup : vendorAccGroup_en,
        plant : plant_en,
        purchasingOrg : purchasing_org_en,
        uom:uom_en,
        mrpController : mrp_controller_en,
        maintPlannerGroup : maint_planner_group_en,
        storageLocation : storage_location_en,
        subDistrict : sub_ditricts_en,
        postalCode : postal_code_en,
        villages:villages_en,
        vendorBidangUsaha : vendor_bidang_usaha_en,
        vendorQualification : vendor_qualification_en,
        vendorClassification : vendor_classification_en,
        vendorSubClassification : vendor_sub_classification_en,
        companyType : company_type_en,
        vendorSubBidangUsaha : vendor_sub_bidang_usaha_en,
        vendorTipeRekanan : vendor_tipe_rekanan_en,
        glAccountCompany : gl_account_company_en,
        wbsProject : wbs_project_en,
        costCenter : cost_center_en,
        assets : assets_en,
        businessGroup: business_group_en,
        documentType: document_type_en,
        templatePersyaratan: template_persyaratan_en,
        jadwalTender: jadwal_tender_en,
        materialGroupSosHeader: material_group_sos_header_en,
        materialGroupSosItem: material_group_sos_item_en,
        punishmentVendor: punishment_vendor_en,
        openPunishmentVendor: open_punishment_vendor_en,
        division: division_en,
        mappingValueApproval: mapping_value_approval_en,
        buyer: buyer_en,
        eDocument: e_document_en,
        searchterms: searchterms_en,
        kelompokPeforma: kelompokPeforma_en,
        bobotPeforma : bobotPeforma_en,
        masterVpr : master_vpr_en,
        performanceReport : performance_report_en,
        dur:dur_en,
        bidOpening:bid_opening_en,
        evaluation:evaluation_en,
        monitoring_tender: monitoring_tender_en,
        aanwijzing:aanwijzing_en,
        templateReminder:template_reminder_en,
        auction : auction_en,
        announcement : announcement_en,
        monitoring_pr : monitoring_pr_en,
        userguide : userguide_en,
        conditionType : condition_type_en
      },
      id: {
				common: id,
        users: users_id,
        company:company_id,
        workUnit:work_units_id,
        incoterms : incoterm_id,
        country : countries_id,
        profileVendor : profileVendor_id,
        purchasingGroup : purchasing_group_id,
        currency:currency_id,
        district:district_id,
        region:region_id,
        vendorAccGroup : vendorAccGroup_id,
        plant : plant_id,
        purchasingOrg : purchasing_org_id,
        uom:uom_id,
        mrpController : mrp_controller_id,
        maintPlannerGroup : maint_planner_group_id,
        storageLocation : storage_location_id,
        subDistrict : sub_ditricts_id,
        postalCode : postal_code_id,
        villages:villages_id,
        vendorBidangUsaha : vendor_bidang_usaha_id,
        vendorQualification : vendor_qualification_id,
        vendorClassification : vendor_classification_id,
        vendorSubClassification : vendor_sub_classification_id,
        companyType : company_type_id,
        vendorSubBidangUsaha : vendor_sub_bidang_usaha_id,
        vendorTipeRekanan : vendor_tipe_rekanan_id,
        glAccountCompany : gl_account_company_id,
        wbsProject : wbs_project_id,
        costCenter : cost_center_id,
        assets : assets_id,
        businessGroup: business_group_id,
        documentType: document_type_id,
        templatePersyaratan: template_persyaratan_id,
        jadwalTender: jadwal_tender_id,
        materialGroupSosHeader: material_group_sos_header_id,
        materialGroupSosItem: material_group_sos_item_id,
        punishmentVendor: punishment_vendor_id,
        openPunishmentVendor: open_punishment_vendor_id,
        division: division_id,
        mappingValueApproval: mapping_value_approval_id,
        buyer: buyer_id,
        eDocument: e_document_id,
        searchterms: searchterms_id,
        kelompokPeforma: kelompokPeforma_id,
        bobotPeforma: bobotPeforma_id,
        masterVpr : master_vpr_id,
        performanceReport : performance_report_id,
        dur : dur_id,
        bidOpening:bid_opening_id,
        evaluation:evaluation_id,
        monitoring_tender:monitoring_tender_id,
        aanwijzing:aanwijzing_id,
        templateReminder:template_reminder_id,
        auction : auction_id,
        announcement : announcement_id,
        monitoring_pr : monitoring_pr_id,
        userguide : userguide_id,
        conditionType : condition_type_id
      }
    },
    fallbackLng: "id",
    debug: true,

    // have a common namespace used around the full app
    ns: ["common", "users"],
    defaultNS: "common",

    keySeparator: ".", // we use content as keys
		transSupportBasicHtmlNodes: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
