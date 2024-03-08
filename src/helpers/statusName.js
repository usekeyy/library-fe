export const statusName = (type) => {
	var data;
	switch(type) {
		case 'y': data = "Actived"; break;
		case 'n': data = "Inactived"; break;
		case 's': data = "Submitted"; break;
		case 'd': data = "Draft"; break;
		case 'a': data = "Active"; break;
		case 'r': data = "Reject"; break;
		case 'o': data = "Open"; break;
		case 'p': data = "Process"; break;
		case 'x': data = "Retender"; break;
		case 'b': data = "Batal Tender"; break;
		case 'c': data = "Cancel"; break;
		case 'i': data = "Inactive"; break;
		default: return data;
	}
	return data;
}

export const statusNameReviewBuyer = (type) => {
	var data;
	switch(type) {
		case 'a': data = "Review"; break;
		case 'h': data = "Review Harga"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusNamePraQualification = (type) => {
	var data;
	switch(type) {
		case 'Approval': data = "Approval"; break;
		case 'y': data = "Approved"; break;
		case 'n': data = "Inactived"; break;
		case 's': data = "Submitted"; break;
		case 'd': data = "Draft"; break;
		case 'r': data = "Rejected"; break;
		case 'o': data = "Open"; break;
		case 'p': data = "Active"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusNameDur = (type) => {
	var data;
	switch(type) {
		case 'y': data = "Approved"; break;
		case 'n': data = "Inactived"; break;
		case 's': data = "Submitted"; break;
		case 'd': data = "Draft"; break;
		case 'r': data = "Reject"; break;
		case 'o': data = "Open"; break;
		case 'p': data = "Approval"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusNameAwarding = (type) => {
	var data;
	switch(type) {
		case 'y': data = "Approved"; break;
		case 'n': data = "Inactived"; break;
		case 's': data = "Submitted"; break;
		case 'd': data = "Open"; break;
		case 'r': data = "Reject"; break;
		case 'p': data = "Approval"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusVerifikasi = (type) => {
	var data;
	switch(type) {
		case 'sudah_diverifikasi': data = "Sudah Diverifikasi"; break;
		case 'tolak_data': data = "Tolak Data"; break;
		case 'submit_pendaftaran': data = "Submit Pendaftaran"; break;
		case 'revisi_data': data = "Revisi Data"; break;
		case 'update_data': data = "Update Data"; break;
		case 'tambah_data': data = "Tambah Data"; break;
		case 'hapus_data': data = "Hapus Data"; break;
		case null: data = "Submit Pendaftaran"; break;
		default: data = '-'; break;
	}
	return data;
}

export const docCatName = (type) => {
	var data;
	switch(type) {
		case 'B': data = "B - PR"; break;
		case 'F': data = "F - PO"; break;
		case 'K': data = "K - Kontrak"; break;
		case 'A': data = "A - RFQ"; break;
		case 'L': data = "L - Scheduling Agreement"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusAuction = (type) => {
	var data;
	switch(type) {
		case 'n': data = "Draft"; break;
		case 'y': data = "Closed"; break;
		case 's': data = "Done  (Stop)"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusPesertaAuction = (type) => {
	var data;
	switch(type) {
		case 'n': data = "Inactived"; break;
		case 'y': data = "Actived"; break;
		case 'r': data = "Rejected"; break;
		case 'b': data = "Banned"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusRejectBid = (type) => {
	var data;
	switch(type) {
		case 'y': data = "Approve"; break;
		case 'r': data = "Rejected"; break;
		default: data = '-'; break;
	}
	return data;
}

// Array.isArray(dt.tipe_verifikasi) ? 
// 	dt.tipe_verifikasi.length > 0 ? 
// 		dt.tipe_verifikasi.map(item => {item}) : "Belum Deverifikasi" : (dt.tipe_verifikasi !== '' || dt.tipe_verifikasi !== null ? dt.tipe_verifikasi : "Belum Deverifikasi")

export const statusKonfirmasiVerifikator = (status_vendor, data) => {
	if (status_vendor !== undefined && data !== undefined){
		if (status_vendor !== 'partner'){
			if(data.status === null){
				if (data.type !== "Optional"){
					if (Array.isArray(data.tipe_verifikasi)){
						if (data.tipe_verifikasi.length > 0){
							return "Submit Pendaftaran"
						}else{
							if(data.status === null){
								return ""
							}else{
								return "Submit Pendaftaran"
							}
						}
					}else{
						return "Submit Pendaftaran"
					}
				}else{
					return ""
				}
				
			}else{
				if (data.status === 'y'){
					return "Diverifikasi"
				}else {
					return "Ditolak"
				}
			}
		}else{
			if (data.tipe_verifikasi !== null) {
				if (Array.isArray(data.tipe_verifikasi)){
					if (data.tipe_verifikasi.length > 0){
						return statusMultipleIsPartner(data)
					}else{
						if(data.status === null){
							return "Tidak Ada Perubahan"
						}else{
							if(data.status === 'y'){
								return "Sudah Diverifikasi"
							}else{
								return "Belum Diverifikasi"
							}
						}
					}
				}else{
					return statusSingleIsPartner(data)
				}
			}else{
				if(data.status === null){
					return "Tidak Ada Perubahan"
				}else{
					if(data.status === 'y'){
						return "Sudah Diverifikasi"
					}else{
						return "Belum Diverifikasi"
					}
				}
			}
		}
	}else{
		return ""
	}
}

const statusSingleIsPartner = (dt) => {
	if (dt.tipe_verifikasi === 'sudah_diverifikasi' && dt.status === null) {
		return (
			"Tidak Ada Perubahan"
		)
	} else if (dt.tipe_verifikasi === 'sudah_diverifikasi' && dt.status !== null) {
		return (
			"Tidak Ada Perubahan"
		)
	} else if (dt.tipe_verifikasi !== 'sudah_diverifikasi' && dt.status === null) {
		return (
			"Update Profile"
		)
	} else if (dt.tipe_verifikasi !== 'sudah_diverifikasi' && dt.status !== null) {
		return (
			(dt.status === 'y') ? "Sudah Diverifikasi" : "Tolak Data"
		)
	} 
}

const statusMultipleIsPartner = (dt) => {
	const tipe = dt.tipe_verifikasi.filter( i => i === "sudah_diverifikasi");
	if (dt.tipe_verifikasi.length === tipe.length && dt.status === null) {
		return (
			"Tidak Ada Perubahan"
		)
	} else if (dt.tipe_verifikasi.length !== tipe.length && dt.status === null) {
		return (
			"Update Profile"
		)
	} else if (dt.tipe_verifikasi.length !== tipe.length && dt.status !== null) {
		return (
			(dt.status === 'y') ? "Sudah Diverifikasi" : "Tolak Data"
		)
	} else if (dt.tipe_verifikasi.length === tipe.length && dt.status !== null) {
		return (
			(dt.status === 'y') ? "Sudah Diverifikasi" : "Tolak Data"
		)
	} 
}

export const statusVendorDur = (type) => {
	var data;
	switch(type) {
		case '1': data = "inactive"; break;
		case '0': data = "actived"; break;
		default: data = '-'; break;
	}
	return data;
}

export const statusHistoryVpr = (type) => {
	var data;
	switch(type) {
		case 'n': data = "Rejected"; break;
		case 'y': data = "Approved"; break;
		case 'd': data = "Submitted"; break;
		default: data = '-'; break;
	}
	return data;
}



