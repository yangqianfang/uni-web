/* 
 by yangqianfang 时间选择规则 2019-11-05
 */

function fromDate(timestamp) {
	let date = new Date(timestamp * 1000);
	let year = date.getFullYear(),
		month = date.getMonth().toString().length == 1 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1),
		day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate();
	return year + "-" + month + "-" + day;
}


/*
 根据时间戳start end 获取所有日期
return  [ {
   label: "2019-10-05",
   value: "1572960998"
 },  {
   label: "2019-10-06",
   value: 1573047398
 },   {
   label: "2019-10-07",
   value: 1573133798
 }]
*/
function getAllDay(start, end) {
	var dayList = [];
	while ((end - start) >= 0) {
		dayList.push({
			"label": fromDate(start),
			"value": start,
			timestamp: start
		});
		start = (parseInt(start) + (24 * 60 * 60));
		if (start >= end) {
			dayList.push({
				"label": fromDate(end),
				"value": end,
				timestamp: end
			});
		}

	}
	return dayList;
}
/* 
 	start: 开始时间戳
 	end: 结束时间戳
 	step_second : 分钟间隔
	return {
		daysData:[
			{
					"label": "2019-11-06",
					"value": "11"
				},
				{
					"label": "2019-11-07",
					"value": "12"
				}
		],
		hourData:[
			[
				{
						"label": "0点",
						"value": "0"
					},
					{
						"label": "5点",
						"value": "5"
					},
			]
		],
		minuteData:[
			[
				[
					  {
							"label": "0分",
							"value": "0"
						},
						{
							"label": "5分",
							"value": "5"
						}
				]
			]
		]		
	}
  */
function getTimeData(start, end, step_second = 300) {
	let data = {};
	//start = "1573014600", end = "1578153600";
	var daysData = getAllDay(start, end);
	data.daysData = daysData;
	var hourData = [];
	for (var i = 0; i < daysData.length; i++) {
		let arr = [],
			hourStart = 0,
			hourEnd = 23;
		if (i == 0) {
			let d = new Date();
			d.setTime(daysData[i].value * 1000);
			hourStart = d.getHours();
		}
		if (i == daysData.length - 1) {
			let d = new Date();
			d.setTime(daysData[i].value * 1000);
			hourEnd = d.getHours();
		}
		for (var j = hourStart; j <= hourEnd; j++) {
			arr.push({
				"label": j + "点",
				"value": j.toString().length == 1 ? "0" + j : j
			})
		}
		hourData.push(arr)
	};
	data.hourData = hourData;
	var minuteData = [],
		step = (step_second / 60);
	for (var x = 0; x < hourData.length; x++) {
		let a2 = [];
		for (let y = 0; y < hourData[x].length; y++) {
			let a3 = [],
				m = 0,
				times = 60;
			if (y == 0 && x == 0) {
				let d = new Date(start * 1000);
				m = d.getMinutes();
			}
			times = (times - m) / step;
			/* 最后一条数据处理 */
			if (x == hourData.length - 1 && y == hourData[x].length - 1) {
				let e = new Date(end * 1000);
				m = e.getMinutes();
				times = ((m / step) + 1);
			}
			for (var t = 0; t < times; t++) {
				if (y == 0 && t == 0 && x == 0) {
					let d = new Date(start * 1000);
					m = d.getMinutes();
				}
				 
				a3.push({
					"label":  m + "分",
					"value":  m.toString().length == 1 ? "0" + m : m
				})
				m = (m + step);
			}
			a2.push(a3);
		}
		minuteData.push(a2);
	}
	data.minuteData = minuteData;
	return data;
}
 
export default getTimeData

