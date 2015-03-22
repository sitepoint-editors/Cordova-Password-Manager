/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var master_password = "";

$(document).on("pageshow","#pageone",function(){
    master_password = "";
});

function store_master_password()
{
    master_password = document.getElementById("master_password").value;

    if(master_password == "")
    {
        navigator.notification.alert("Please enter master password");
        return;
    }

    $.mobile.changePage($("#pagetwo"), "slide", true, true);
}

function populate_list()
{
    var list = "";
    for(var key in localStorage)
    {
        list = list + "<li><a href='javascript:name_password(\"" + key + "\")'>" + key + "</a></li>";
    }
    document.getElementById("ul_list").innerHTML = list;
}

function display_list()
{
    populate_list();
    $.mobile.changePage($("#pagefour"), "slide", true, true);
}

function new_entry()
{
    var name = document.getElementById("new_name").value;
    var password = document.getElementById("new_password").value;

    if(name == "" || password == "")
    {
        navigator.notification.alert("Name and Password are Required");
        return;
    }

    var options = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
    var encrypted_password = CryptoJS.AES.encrypt(password, master_password, options);

    localStorage.setItem(name, encrypted_password);

    populate_list();

    $.mobile.changePage($("#pagefour"), "slide", true, true);
}

function name_password(name)
{
    var options = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
    var decrypted_password = CryptoJS.AES.decrypt(localStorage.getItem(name), master_password, options);

    navigator.notification.alert("Password is: " + decrypted_password.toString(CryptoJS.enc.Utf8));
}

$(document).on("pageshow","#pagefour",function(){ // When entering pagetwo
  $("#ul_list").listview("refresh");
});
