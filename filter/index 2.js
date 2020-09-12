const filter = {
	toThousands: function(num) {
		if(num){
			if(num.toString().lastIndexOf('.')!=-1){
				return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split('.')[0]+'.'+num.toString().split('.')[1]
			}else{
				return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split('.')[0]
			}
		}else{
			return 0
		}
		
	},
	imgUrlSplit:function(str){
		if(str){
			return str.split(',')[0]
		}
	},
	timeSplit:function(str){
		if(str){
			return str.split('.')[0]
		}
	},
	
	tradeSplit:function(str){
		if(str){
			return str.split('shandongagt-')[1]
		}
	},
	
	parseTime:function(str){
		if(str){
			let time = str.split('.')[0];
			let year = time.split(' ')[0].split('-')[0],
				month = time.split(' ')[0].split('-')[1]-1,
				day = time.split(' ')[0].split('-')[2],
				hour = time.split(' ')[1].split(':')[0],
				min = time.split(' ')[1].split(':')[1],
				sec = time.split(' ')[1].split(':')[2];
			return Date.parse(new Date(year, month, day, hour, min, sec));
		}
	},
	keepTwoNum:function(value){
		value = Number(value);
		return value.toFixed(2);
	},
	toFixed: function(num) {
		if (num) {
			return Number(num).toFixed(2)
		}
	}
}
export default filter
