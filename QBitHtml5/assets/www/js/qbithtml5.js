document.addEventListener("backbutton", backButton, false);

function setTorrentsTimer() {
	setTimeout(function() {
	    refresh();
	    setTorrentsTimer();
	}, 10000);
}

function backButton() {
	if ($('#div_dialogCommands').is(':visible'))
		$("#div_dialogCommands").hide("fast");
	else {
		if (confirm("esco?"))
			navigator.app.exitApp();
	}
}

function stop(hash) {
	sendCommand(hash,"pause");
}

function start(hash) {
	sendCommand(hash,"resume");
}

function deleteNormal(hash) {
	sendCommand(hash,"delete");
}

function deleteFromDisk(hash) {
	sendCommand(hash,"deletePerm");
}

function sendCommand(hash,cmd) {
	$.ajax({
		url: "http://" + connectionSettings.hostname + ":" + connectionSettings.port + "/command/"+cmd,
		data: { hash: hash, hashes: hash },
        success: function(data) {
        	$("#div_dialogCommands").hide("fast");
        	setTimeout(function() {
			    refresh();
			}, 3000);
        },
        error: function() {
        	$("#div_dialogCommands").hide("fast");
        	alert("Error contacting: " + connectionSettings.hostname + ":" + connectionSettings.port);
        }
    });
}

function onClickTorrent(hash,name) {
	if ($('#div_dialogCommands').is(':visible')) {
		$("#div_dialogCommands").hide("fast");
		return;
	}	
    $("#div_dialogCommands").hide("fast");
    $("#div_torrentNameOnCmdDialog").empty();
    
    $("<span>"+name+"</span><br><br>").appendTo("#div_torrentNameOnCmdDialog");
    $("#hash").val(hash);
    
    $("#div_torrentNameOnCmdDialog").show("fast");
    $("#div_dialogCommands").show("fast");
}

var connectionSettings = {};
connectionSettings.hostname = null;
connectionSettings.port = null;
connectionSettings.username = null;
connectionSettings.password = null;

var ajaxInit = false;
function refresh() {
	if (!ajaxInit) {
		$.ajaxSetup({
			type: 'POST',
			username: connectionSettings.username, 
			password: connectionSettings.password
		});
	}
	$.ajax({
		dataType: "json",
		url: "http://" + connectionSettings.hostname + ":" + connectionSettings.port + "/json/events",
		success: function(data) {
        	var items = [];
        	$.each(data,function(key,val) {
	        	var torrentStyle = "downloading";
                if (val.state == "pausedDL" || val.state == "pausedUP")
                	torrentStyle = "paused";
	        	else if (val.progress == 1)
                	torrentStyle = "finished";
                else if (val.progress < 0.01) {
                	torrentStyle = "justStarted";
                }
                var name=val.name.replace(/ /g,"_");
                var hash=val.hash;
                items.push("<div id='" + key + "' class='" + torrentStyle + "' onclick=onClickTorrent('" + hash + "','" + name + "')>" + val.name + "<br><span class='speed'>" + val.dlspeed + "</span><br>" + Math.round(val.progress*10000)/100 + "%" + "</div>");
	        });
            
	        $("#div_downloads").empty();
        	$( "<div/>", {
                html: items.join( "" )
            }).appendTo( "#div_downloads" );
//        	
//        	var $template = $('.downloading').clone();
//        	$template.find('.speed').text("nuova velocita");
//        	$('#div_downloads').append($template);
        	
        },
        error: function() {
        	alert("Error contacting: " + connectionSettings.hostname + ":" + connectionSettings.port + "/json/events");
        }
    });
}