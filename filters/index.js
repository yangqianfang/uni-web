 export default {
	formatTime( timestamp ) {
		let date = new Date( timestamp * 1000 );
		let year = date.getFullYear(),
			month = date.getMonth().toString().length == 1 ? "0" + ( date.getMonth() + 1 ).toString() : ( date.getMonth() + 1 ),
			day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate(),
			hour = date.getHours().toString().length == 1 ? "0" + date.getHours() : date.getHours(),
			min = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes() : date.getMinutes();
			
		return year + "-" + month + "-" + day + " " + hour + ":" + min;
	},
	toThousandslsFilter( num ) {
		return ( +num || 0 ).toString().replace( /^-?\d+/g, m => m.replace( /(?=(?!\b)(\d{3})+$)/g, ',' ) );
	},
	toFixed(value){
		return  value.toFixed();
	}
}
