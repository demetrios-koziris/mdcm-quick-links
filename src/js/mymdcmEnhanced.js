/*
myMDCM Enhanced is a chrome extension that improves the functionality of the myMDCM website.
Copyright (C) 2017 Demetrios Koziris

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

A copy of the GNU General Public License is provided in the LICENSE file along with this program.  
The GNU General Public License can also be found at <http://www.gnu.org/licenses/>.
*/

//jshint esversion: 6


var url = window.location.href;

let devMode = !('update_url' in chrome.runtime.getManifest());
let logForDebug = ( devMode ? console.log.bind(window.console) : function(){} );
logForDebug("myMDCM-Enhanced Debug mode is ON");

logForDebug("Running mymdcmEnhanced.js");

var mymdcmCalendarRequestCount = 0;

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.action == 'CalendarRequestInfo' && mymdcmCalendarRequestCount === 0) {
		mymdcmCalendarRequestCount++;
		logForDebug("CalendarRequestInfo message recieved!");
		logForDebug(msg.data);
		mymdcmRun(msg.data);
	}
});

function mymdcmRun(request) {
	const CalendarExportRow = document.createElement('div');
	CalendarExportRow.className = "row";
	CalendarExportRow.id = "mymdcm-enh-calendar-export";
	CalendarExportRow.innerHTML = "<div class='col col-12'> <div class='t-Region t-Region--scrollBody js-apex-region'> <div class='t-Region-header'> <div class='t-Region-headerItems t-Region-headerItems--title'> <h2 class='t-Region-title' >myMDCM Enhanced: Export Calendar Feature</h2> </div><div class='t-Region-headerItems t-Region-headerItems--buttons'><span class='js-maximizeButtonContainer'></span></div></div><div class='t-Region-bodyWrap'> <div class='t-Region-buttons t-Region-buttons--top'> <div class='t-Region-buttons-left'></div><div class='t-Region-buttons-right'></div></div><div class='t-Form-fieldContainer rel-col'> <div class='t-Form-inputContainer col'> <span class='display_only'>Important: Please note that a calendar export will not stay updated if the source calendar changes. If your MDCM calendar is subject to change, please periodically check it to make sure you do not miss any events.</span> </div></div><div class='t-Region-body'> <div class='t-Form-fieldContainer rel-col'> <div class='t-Form-labelContainer col col-2'> <label class='t-Form-label'>Date Range</label> </div><div class='t-Form-inputContainer col'> <input type='text' class='u-TF-item--datepicker datepicker' id='mymdcm-export-cal-start'> </div><div class='t-Form-labelContainer col'> <label class='t-Form-label'>to</label> </div><div class='t-Form-inputContainer col'> <input type='text' class='u-TF-item--datepicker datepicker'id='mymdcm-export-cal-end'> </div></div><div class='t-Form-fieldContainer rel-col'> <div class='t-Form-labelContainer col col-2'> <label class='t-Form-label'>Export Type</label> </div><div class='t-Form-inputContainer col'> <div class='t-Form-itemWrapper'> <select class='selectlist apex-item-select' id='mymdcm-export-cal-type'> <option value='all' selected='selected'>Export all course events to one ICS file</option> <option value='split'>Export separate ICS file for each course</option> </select> </div></div></div><br><div class='t-Form-fieldContainer rel-col' style='float: right;'> <button type='button' class='t-Button t-Button--hot col' id='mymdcm-export-cal'>Export Calendar Events to ICS file</button> <div class='t-Form-labelContainer col'><label class='t-Form-label'></label></div><a href='https://digibites.zendesk.com/hc/en-us/articles/200134792-How-do-I-import-ics-ical-csv- fileinto-Google-Calendar-' class='t-Button col'>How to import ICS files into Google Calendar</a> </div></div></div></div></div><div class='mymdcm-enh-dialog' id='mymdcm-enh-failed-request' title='Calendar Export: Failed Retrieval' style='display:none;'> <div style='padding:10px; background:#FFDAD7;'> <p>myMDCM Enhanced encountered an error while trying to retrieve your calendar events.</p><p>Please refresh the page and try again.</p><p>If the issue persists, please submit a bug report by clicking the link below to open the feedback page for myMDCM Enhanced.</p></div></div><div class='mymdcm-enh-dialog' id='mymdcm-enh-no-events' title='Calendar Export: No Events' style='display:none;'> <div style='padding:10px; background:#FFDAD7;'> <p>myMDCM Enhanced did not find any calendar events in the selected date range (Note that no events will be found if the end date is before the start date).</p><p>If there are indeed events between the start and end dates selected (inclusively), please refresh the page and try again.</p><p>If the issue persists, please submit a bug report by clicking the link below to open the feedback page for myMDCM Enhanced.</p></div></div><div class='mymdcm-enh-dialog' id='mymdcm-enh-default-error' title='Calendar Export: Error' style='display:none;'> <div style='padding:10px; background:#FFDAD7;'> <p>myMDCM Enhanced encountered an error while exporting your calendar.</p><p>Please refresh the page and try again.</p><p>If the issue persists, please submit a bug report by clicking the link below to open the feedback page for myMDCM Enhanced.</p></div></div>";
	document.getElementsByClassName("container")[0].appendChild(CalendarExportRow);
	injectScript('$(".datepicker").datepicker({dateFormat: "mm/dd/yy"});$(".datepicker").datepicker("setDate", new Date())');
	injectScript("$('.mymdcm-enh-dialog').dialog({autoOpen:!1,modal:true,position:{my:'bottom',at:'center',of:'#mymdcm-enh-calendar-export'},buttons:[{text:'OK',click:function(){$(this).dialog('close')}},{text:'Submit Bug Report',click:function(){window.location='https://demetrios-koziris.github.io/myMDCM-enhanced/support'}}]});");
	document.getElementById('mymdcm-export-cal').setAttribute('onclick', 'document.dispatchEvent(new Event("mymdcmExportCalendar"));');

	document.addEventListener('mymdcmExportCalendar', function(data) {
		logForDebug('mymdcmExportCalendar');
		logForDebug(data);

		const reqData = request.requestBody.formData;
		const exportParams = {
			type: document.getElementById('mymdcm-export-cal-type').selectedIndex,
			start: document.getElementById('mymdcm-export-cal-start').value,
			end: document.getElementById('mymdcm-export-cal-end').value
		};
		const startDate = new Date(exportParams.start);
		const endDate = new Date(exportParams.end);
		endDate.setDate(endDate.getDate() + 1);

		reqData.x02 = startDate.toISOString().slice(0,10).replace(/-/g,"");
		reqData.x03 = endDate.toISOString().slice(0,10).replace(/-/g,"");
		const reqParams = jQuery.param(reqData).replace(/%5B%5D/g,'');
		const reqURL = 'https://mymdcm.medicine.mcgill.ca/ords/wwv_flow.ajax?' + reqParams;
		logForDebug(reqURL);

		getCalendarJSON(reqURL, exportParams);
	});
}


function injectScript(code) {
	const script = document.createElement('script');
	script.innerText = code;
	(document.body || document.head).appendChild(script);
}


function getCalendarJSON(reqURL, exportParams) {
	const xmlRequestInfo = {
		method: 'GET',
		action: 'xhttp',
		url: reqURL,
	};
	chrome.runtime.sendMessage(xmlRequestInfo, generateGetCalendarJSONCallback(reqURL, exportParams));
}


function generateGetCalendarJSONCallback(reqURL, exportParams) {
	return function(data) {
		const start = document.getElementById('mymdcm-export-cal-start').value;
		const end = document.getElementById('mymdcm-export-cal-end').value;
		const failedRequest = 'myMDCM Enhanced encountered an error while trying to retrieve your calendar events.';
		const noEventsFound = 'myMDCM Enhanced did not find any calendar events from '+start+' to '+end+' (inclusively).';
		const defaultError = "myMDCM Enhanced encountered an error while exporting your calendar.";
		logForDebug(data);

		try {
			const eventsData = JSON.parse(data.responseXML);
			logForDebug(eventsData);
			
			if ('error' in eventsData) {
				console.log(failedRequest);
				injectScript("$('#mymdcm-enh-failed-request').dialog('open')");
			}
			else if (eventsData.length === 0) {
				console.log(noEventsFound);
				injectScript("$('#mymdcm-enh-no-events').dialog('open')");
			}
			else {
				if (exportParams.type === 0) {
					const eventsICS = ics();
					for (let i = 0; i < eventsData.length; i++) {
						const eventInfo = eventsData[i].title.match(/\>[^<>]+/g).map(function(e){return e.slice(1);});
						eventsICS.addEvent(eventInfo[0], eventInfo[1], eventInfo[2], eventsData[i].start, eventsData[i].end);
					}
					logForDebug(eventsICS);
					eventsICS.download("myMDCM_Calendar_"+start+"_to_"+end+"_All");
				}
				else {
					const eventsICS = {};
					for (let i = 0; i < eventsData.length; i++) {
						const eventInfo = eventsData[i].title.match(/\>[^<>]+/g).map(function(e){return e.slice(1);});
						const eventCourse = eventInfo[0].split('-')[0].replace(/\s/g,'');
						if (!(eventCourse in eventsICS)) {
							eventsICS[eventCourse] = ics();
						}
						eventsICS[eventCourse].addEvent(eventInfo[0], eventInfo[1], eventInfo[2], eventsData[i].start, eventsData[i].end);
					}
					logForDebug(eventsICS);
					for (let course in eventsICS) {
						eventsICS[course].download("myMDCM_Calendar_"+start+"_to_"+end+"_"+course);
					}
				}
			}
		}
		catch(err) {
			console.log(defaultError);
            console.log('Error: ' + err.stack);
            injectScript("$('#mymdcm-enh-default-error').dialog('open')");
        }
	};
}
