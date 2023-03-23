import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { UsersDataTable } from './UsersDataTable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dataTable = UsersDataTable;
  chartOptions = {
	  animationEnabled: true,
	  
	  axisY: {
		title: "Energy production kWh"
	  },
	  data: [{
		type: "area",     
		name: "Production of energy by hours",
		showInLegend: true,
		legendMarkerType: "square",
		color: "#FCBF49",
		markerSize: 0,            
		dataPoints: [
		  {x:new Date(2023,0,3,0,0), y: 53},
		  {x:new Date(2023,0,3,1,0), y: 68},
		  {x:new Date(2023,0,3,2,0), y: 84, indexLabel: "high",markerColor: "red", markerType: "triangle"},
		  {x:new Date(2023,0,3,3,0), y: 62},
		  {x:new Date(2023,0,3,4,0), y: 74},
		  {x:new Date(2023,0,3,5,0), y: 63},
		  {x:new Date(2023,0,3,6,0), y: 51},
		  {x:new Date(2023,0,3,7,0), y: 68},
		  {x:new Date(2023,0,3,8,0), y: 86, indexLabel: "high",markerColor: "red", markerType: "triangle"},
		  {x:new Date(2023,0,3,9,0), y: 55},
		  {x:new Date(2023,0,3,10,0), y: 67},
		  {x:new Date(2023,0,3,11,0), y: 69},         
		  {x:new Date(2023,0,3,12,0), y: 84},                
		  {x:new Date(2023,0,3,13,0), y: 48},
		  {x:new Date(2023,0,3,14,0), y: 53},
		  {x:new Date(2023,0,3,15,0), y: 71},
		  {x:new Date(2023,0,3,16,0), y: 34},
		  {x:new Date(2023,0,3,17,0), y: 59},
		  {x:new Date(2023,0,3,18,0), y: 64},
		  {x:new Date(2023,0,3,19,0), y: 32},
		  {x:new Date(2023,0,3,20,0), y: 30},
		  {x:new Date(2023,0,3,21,0), y: 32},
		  {x:new Date(2023,0,3,22,0), y: 36},
		  {x:new Date(2023,0,3,23,0), y: 57} 
		]
	  }]
  }

  chartOptions2 = {
	  animationEnabled: true,
	  
	  axisY: {
		title: "Energy production kWh"
	  },
	  data: [{
		type: "area",     
		name: "Total production of energy by hour",
		showInLegend: true,
		legendMarkerType: "square",
		color: "#026670",
		markerSize: 0,            
		dataPoints: [
		  {x:new Date(2023,0,3,0,0), y: 71},
		  {x:new Date(2023,0,3,1,0), y: 82},
		  {x:new Date(2023,0,3,2,0), y: 54},
		  {x:new Date(2023,0,3,3,0), y: 72},
		  {x:new Date(2023,0,3,4,0), y: 64},
		  {x:new Date(2023,0,3,5,0), y: 83},
		  {x:new Date(2023,0,3,6,0), y: 11},
		  {x:new Date(2023,0,3,7,0), y: 64},
		  {x:new Date(2023,0,3,8,0), y: 36},
		  {x:new Date(2023,0,3,9,0), y: 95,indexLabel: "high",markerColor: "red", markerType: "triangle"},
		  {x:new Date(2023,0,3,10,0), y: 47},
		  {x:new Date(2023,0,3,11,0), y: 19},         
		  {x:new Date(2023,0,3,12,0), y: 24},                
		  {x:new Date(2023,0,3,13,0), y: 38},
		  {x:new Date(2023,0,3,14,0), y: 23},
		  {x:new Date(2023,0,3,15,0), y: 41},
		  {x:new Date(2023,0,3,16,0), y: 84},
		  {x:new Date(2023,0,3,17,0), y: 49},
		  {x:new Date(2023,0,3,18,0), y: 84},
		  {x:new Date(2023,0,3,19,0), y: 22},
		  {x:new Date(2023,0,3,20,0), y: 50},
		  {x:new Date(2023,0,3,21,0), y: 12},
		  {x:new Date(2023,0,3,22,0), y: 36},
		  {x:new Date(2023,0,3,23,0), y: 57} 
		]
	  }]
  }

  chartOptions3 = {
	  animationEnabled: true,
	  axisY: {
		title: "Energy production kWh/day"
	  },
	  data: [{
		type: "area",     
		name: "Total production of energy by hour",
		showInLegend: true,
		legendMarkerType: "square",
		color: "#f77f00",
		markerSize: 1,            
		dataPoints: [
		  {x:new Date(2023,3,3,1,0), y: 71},
		  {x:new Date(2023,3,3,2,0), y: 86, indexLabel: "high",markerColor: "red", markerType: "triangle"},
		  {x:new Date(2023,3,3,3,0), y: 64},
      {x:new Date(2023,3,3,4,0), y: 73},
		  {x:new Date(2023,3,3,5,0), y: 78},
		  {x:new Date(2023,3,3,6,0), y: 74},
		  {x:new Date(2023,3,3,7,0), y: 82},
		  {x:new Date(2023,3,3,8,0), y: 74},
		  {x:new Date(2023,3,3,9,0), y: 73},
		  {x:new Date(2023,3,3,10,0), y: 81},
		  {x:new Date(2023,3,3,11,0), y: 74},
		  {x:new Date(2023,3,3,12,0), y: 66},
		  {x:new Date(2023,3,3,13,0), y: 56},
		  {x:new Date(2023,3,3,14,0), y: 67},
		  {x:new Date(2023,3,3,15,0), y: 69},         
		  {x:new Date(2023,3,3,16,0), y: 54},                
		  {x:new Date(2023,3,3,17,0), y: 48},
		  {x:new Date(2023,3,3,18,0), y: 53},
		  {x:new Date(2023,3,3,19,0), y: 51},
		  {x:new Date(2023,3,3,20,0), y: 34},
		  {x:new Date(2023,3,3,21,0), y: 59},
		  {x:new Date(2023,3,3,22,0), y: 44},
		  {x:new Date(2023,3,3,23,0), y: 32},
		  {x:new Date(2023,3,3,24,0), y: 30},
		        
		  
		]
	  }]
  }

  chartOptions4 = {
	  animationEnabled: true,
	 
	  axisY: {
		title: "Energy (kW h)"
	  },
	  data: [{
		type: "area",     
		name: "Total production of energy by hour",
		showInLegend: true,
		legendMarkerType: "square",
		color: "#026670",
		markerSize: 0,            
		dataPoints: [
		  {x:new Date(2013,0,1,0,0), y: 7},
		  {x:new Date(2013,0,1,1,0), y: 8},
		  {x:new Date(2013,0,1,2,0), y: 5},
		  {x:new Date(2013,0,1,3,0), y: 7},
		  {x:new Date(2013,0,1,4,0), y: 6},
		  {x:new Date(2013,0,1,5,0), y: 8},
		  {x:new Date(2013,0,1,6,0), y: 12},
		  {x:new Date(2013,0,1,7,0), y: 24},
		  {x:new Date(2013,0,1,8,0), y: 36},
		  {x:new Date(2013,0,1,9,0), y: 35},
		  {x:new Date(2013,0,1,10,0), y: 37},
		  {x:new Date(2013,0,1,11,0), y: 29},         
		  {x:new Date(2013,0,1,12,0), y: 34, label: "noon" },                
		  {x:new Date(2013,0,1,13,0), y: 38},
		  {x:new Date(2013,0,1,14,0), y: 23},
		  {x:new Date(2013,0,1,15,0), y: 31},
		  {x:new Date(2013,0,1,16,0), y: 34},
		  {x:new Date(2013,0,1,17,0), y: 29},
		  {x:new Date(2013,0,1,18,0), y: 14},
		  {x:new Date(2013,0,1,19,0), y: 12},
		  {x:new Date(2013,0,1,20,0), y: 10},
		  {x:new Date(2013,0,1,21,0), y: 8},
		  {x:new Date(2013,0,1,22,0), y: 13},
		  {x:new Date(2013,0,1,23,0), y: 11} 
		]
	  }, {
		type: "area",
		name: "Total compusing of energy by hour",
		showInLegend: true,
		legendMarkerType: "square",
		color: "#FCBF49",
		markerSize: 0,
		dataPoints: [
		  {x:new Date(2013,0,1,0,0), y: 12},
		  {x:new Date(2013,0,1,1,0), y: 10},
		  {x:new Date(2013,0,1,2,0), y: 3},
		  {x:new Date(2013,0,1,3,0), y: 5},
		  {x:new Date(2013,0,1,4,0), y: 2},
		  {x:new Date(2013,0,1,5,0), y: 1},
		  {x:new Date(2013,0,1,6,0), y: 3},
		  {x:new Date(2013,0,1,7,0), y: 6},
		  {x:new Date(2013,0,1,8,0), y: 14},
		  {x:new Date(2013,0,1,9,0), y: 15},
		  {x:new Date(2013,0,1,10,0), y: 21},
		  {x:new Date(2013,0,1,11,0), y: 24},         
		  {x:new Date(2013,0,1,12,0), y: 28},                
		  {x:new Date(2013,0,1,13,0), y: 26},
		  {x:new Date(2013,0,1,14,0), y: 17},
		  {x:new Date(2013,0,1,15,0), y: 23},
		  {x:new Date(2013,0,1,16,0), y: 28},
		  {x:new Date(2013,0,1,17,0), y: 22},
		  {x:new Date(2013,0,1,18,0), y: 10},
		  {x:new Date(2013,0,1,19,0), y: 9},
		  {x:new Date(2013,0,1,20,0), y: 6},
		  {x:new Date(2013,0,1,21,0), y: 4},
		  {x:new Date(2013,0,1,22,0), y: 12},
		  {x:new Date(2013,0,1,23,0), y: 14}
		]
	  }]
	}
}                              
  
  
  // public lineChartData: ChartConfiguration<'line'>['data'] = {
  //   labels: [
  //     'January',
  //     'February',
  //     'March',
  //     'April',
  //     'May',
  //     'June',
  //     'July'
  //   ],
  //   datasets: [
  //     {
  //       data: [  ],
  //       label: 'Production',
  //       fill: true,
  //       tension: 0.5,
  //       borderColor: 'black',
  //       backgroundColor: 'rgba(255,0,0,0.3)'
  //     }
  //   ]
  // };
  // public lineChartOptions: ChartOptions<'line'> = {
  //   responsive: false
  // };
  // public lineChartLegend = true;
  
  // public polarAreaChartLabels: string[] = [ 'Production', 'Consumption'];
  // public polarAreaChartDatasets: ChartConfiguration<'polarArea'>['data']['datasets'] = [
  //   { data: [65, 59, 90, 81, 56, 55, 40], label: 'Production' },
  //   { data: [28, 48, 40, 19, 96, 27, 100], label: 'Consumption ' }
  // ];
  // public polarAreaLegend = true;

  // public polarAreaOptions: ChartConfiguration<'polarArea'>['options'] = {
  //   responsive: false,
  // };
  // chartOptions3 = {
	//   animationEnabled: true,
	//   title:{
	// 	text: "Music Album Sales by Year"
	//   }, 
	//   axisY: {
	// 	title: "Units Sold",
	// 	valueFormatString: "#0,,.",
	// 	suffix: "M"
	//   },
	//   data: [{
	// 	type: "splineArea",
	// 	color: "rgba(54,158,173,.7)",
	// 	xValueFormatString: "YYYY",
	// 	dataPoints: [
	// 	  {x: new Date(2004,0), y: 2506000},     
	// 	  {x: new Date(2005,0), y: 2798000},     
	// 	  {x: new Date(2006,0), y: 3386000},     
	// 	  {x: new Date(2007,0), y: 6944000},     
	// 	  {x: new Date(2008,0), y: 6026000},     
	// 	  {x: new Date(2009,0), y: 2394000},     
	// 	  {x: new Date(2010,0), y: 1872000},     
	// 	  {x: new Date(2011,0), y: 2140000},     
	// 	  {x: new Date(2012,0), y: 7289000},     
	// 	  {x: new Date(2013,0), y: 4830000},     
	// 	  {x: new Date(2014,0), y: 2009000},     
	// 	  {x: new Date(2015,0), y: 2840000},     
	// 	  {x: new Date(2016,0), y: 2396000},     
	// 	  {x: new Date(2017,0), y: 1613000},     
	// 	  {x: new Date(2018,0), y: 2821000},     
	// 	  {x: new Date(2019,0), y: 2000000},     
	// 	  {x: new Date(2020,0), y: 1397000}    
	// 	]
	//   }]
	// }	
// }                              

