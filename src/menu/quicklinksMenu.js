/*
MDCM Quick Links is a chrome extension that provides an easy way to access MDCM related links.
Copyright (C) 2017 Demetrios Koziris. McGill and myMDCM have no affiliation with this software.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

A copy of the GNU General Public License is provided in the LICENSE file along with this program.  
The GNU General Public License can also be found at <https://www.gnu.org/licenses/gpl-3.0.html>.
*/

//jshint esversion: 6


let isDevVersion = !('update_url' in chrome.runtime.getManifest());
document.getElementById('version').innerText = 'MCDM Quick Links v'  + chrome.app.getDetails().version + (isDevVersion ? ' DEV' : '');