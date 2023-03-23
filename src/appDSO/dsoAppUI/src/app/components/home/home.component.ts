import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	chartOptions = {
		animationEnabled: true,
		theme: "light2",
		
		axisX:{
			valueFormatString: " HH TT ",
			crosshair: {
				enabled: true,
				snapToDataPoint: true
			}
		},
		axisY: {
			title: "Number of Visits",
			crosshair: {
				enabled: true
			}
		},
		toolTip:{
			shared:true
		},  
		legend:{
			cursor: "pointer",
			verticalAlign: "bottom",
			horizontalAlign: "right",
			dockInsidePlotArea: true,
			itemclick: function(e: any) {
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else{
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type: "line",
			showInLegend: true,
			name: "Users who produce electricity",
			lineDashType: "dash",
			markerType: "square",
			dataPoints: [
				{ x: new Date(2023,3,3,1,0), y: Math.floor(Math.random()*10230) },
				{ x: new Date(2023,3,3,2,0), y: Math.floor(Math.random()*10230) },
				{ x: new Date(2023,3,3,3,0), y: Math.floor(Math.random()*10230) },
				{ x: new Date(2023,3,3,4,0), y: Math.floor(Math.random()*10230) },
				{ x: new Date(2023,3,3,5,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,6,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,7,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,8,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,9,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,10,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,11,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,12,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,13,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,14,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,15,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,16,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,17,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,18,0), y: Math.floor(Math.random()*10230)},
        { x: new Date(2023,3,3,19,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,20,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,21,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,22,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,23,0), y: Math.floor(Math.random()*10230) },
        { x: new Date(2023,3,3,24,0), y: Math.floor(Math.random()*10230)},
				
			]
		},
		{
			type: "line",
			showInLegend: true,
			name: "Users who consume electricity",
			lineDashType: "dot",
			dataPoints: [
				{ x: new Date(2023,3,3,1,0), y: Math.floor(Math.random()*5102) },
				{ x: new Date(2023,3,3,2,0), y: Math.floor(Math.random()*5102) },
				{ x: new Date(2023,3,3,3,0), y: Math.floor(Math.random()*5102) },
				{ x: new Date(2023,3,3,4,0), y: Math.floor(Math.random()*5102)},
				{ x: new Date(2023,3,3,5,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,6,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,7,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,8,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,9,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,10,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,11,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,12,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,13,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,14,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,15,0), y: Math.floor(Math.random()*5102)},
        { x: new Date(2023,3,3,16,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,17,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,18,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,19,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,20,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,21,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,22,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,23,0), y: Math.floor(Math.random()*5102) },
        { x: new Date(2023,3,3,24,0), y: Math.floor(Math.random()*5102) },
			]
		}]
	}	
}                         

