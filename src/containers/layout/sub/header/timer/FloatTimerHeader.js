import React from 'react';

class FloatTimerHeader extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		
		this.state = {
			date : new Date(localStorage.getItem("times"))
		}
    }
    

    componentDidMount() {
        this._isMounted = true
		this.startTime();		
	}

	componentWillUnmount() {
		this._isMounted = false;
    }

    startTime = () => {
		if(this._isMounted){
			const lang = localStorage.getItem("i18nextLng");
			var date = new Date(localStorage.getItem("times"));			
			var tahun = date.getFullYear();
			var bulan = date.getMonth();
			var tanggal = date.getDate();
            var h = date.getHours();
			var m = date.getMinutes();
            var s = date.getSeconds();
            var hari = date.getDay();
			m = this.checkTime(m);
            s = this.checkTime(s);	
            switch(hari) {
				case 0: hari = (lang === "en") ? "Sunday" : "Minggu"; break;
				case 1: hari = (lang === "en") ? "Monday" : "Senin"; break;
				case 2: hari = (lang === "en") ? "Tuesday" : "Selasa"; break;
				case 3: hari = (lang === "en") ? "Wenesday" : "Rabu"; break;
				case 4: hari = (lang === "en") ? "Thursday" : "Kamis"; break;
				case 5: hari = (lang === "en") ? "Friday" : "Jum'at"; break;
				case 6: hari = (lang === "en") ? "Saturday" : "Sabtu"; break;
				default: break;
			}		
			switch(bulan) {
				case 0: bulan = (lang === "en") ? "January" : "Januari"; break;
				case 1: bulan = (lang === "en") ? "February" : "Februari"; break;
				case 2: bulan = (lang === "en") ? "March" : "Maret"; break;
				case 3: bulan = (lang === "en") ? "April" : "April"; break;
				case 4: bulan = (lang === "en") ? "May" : "Mei"; break;
				case 5: bulan = (lang === "en") ? "June" : "Juni"; break;
				case 6: bulan = (lang === "en") ? "July" : "Juli"; break;
				case 7: bulan = (lang === "en") ? "August" : "Agustus"; break;
				case 8: bulan = (lang === "en") ? "September" : "September"; break;
				case 9: bulan = (lang === "en") ? "October" : "Oktober"; break;
				case 10: bulan = (lang === "en") ? "November" : "November"; break;
				case 11: bulan = (lang === "en") ? "December" : "Desember"; break;
				default: break;
			}
			var tampilTanggal = hari+", "+tanggal + " " + bulan + " " + tahun;
			document.getElementById('dateTime').innerHTML =
			tampilTanggal + " " + h + ":" + m + ":" + s;
			date.setSeconds(date.getSeconds() + 1)
			localStorage.setItem('times' , date)
			setTimeout(this.startTime, 950);
		}
    }
    loopTimes = (i) => {
		return i+1;
	}
    checkTime = (i) => {
		if(this._isMounted){
			if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
			return i;
		}
	}
    
	render() {
		return (
			<div id="float-timer">
				<p className="m-b-10 " id="dateTime"
				style={{margin:"15px", fontWeight:"bold", fontSize:"13px", color:"black"}}></p>
			</div>
		)
	}
}

export default FloatTimerHeader;