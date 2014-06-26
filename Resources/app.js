var notifications = [];

function loadNotifications(target) {
	if(target.children[0] != null) target.remove(target.children[0]);
	
	var view = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  layout: 'vertical',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	  height: '80%',
	  width: '80%'
	});
	
	target.add(view);

	var label = Titanium.UI.createLabel({
	  color:'#999',
	  text: 'Loading notifications',
	  font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
	  textAlign: 'center',
	  width: 'auto'
    });
    
    view.add(label);
    
    if (Titanium.Network.online == true) {		
        var request = Titanium.Network.createHTTPClient();
        request.enableKeepAlive = true;
        request.setTimeout(100000000);
        request.open('GET', "http://backend-mjelen.rhcloud.com/notifications");
        request.onload = function() {
            notifications = JSON.parse(request.responseText);
            Ti.API.info(notifications);
            if(target.children[0] != null) target.remove(target.children[0]);
            
            var view = Ti.UI.createScrollView({
			  contentWidth: 'auto',
			  contentHeight: 'auto',
			  layout: 'vertical',
			  showVerticalScrollIndicator: true,
			  showHorizontalScrollIndicator: true,
			  height: '80%',
			  width: '80%'
			});
			
			target.add(view);
			
            for(n in notifications) {
				var label = Titanium.UI.createLabel({
				  color:'#999',
				  text: notifications[n].text,
				  font: { fontSize: 20, fontFamily: 'Helvetica Neue' },
				  textAlign: 'center',
				  width: 'auto'
			    });
			    view.add(label);
			}
        };
        request.send();
    }
}

Titanium.UI.setBackgroundColor('#000');

var tabGroup = Titanium.UI.createTabGroup();

var win1 = Titanium.UI.createWindow({  
    title:'Notifications',
    backgroundColor:'#fff'
});

var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Notifications',
    window: win1
});

tab1.addEventListener('focus', function(){
	loadNotifications(win1);
});

win1.addEventListener('click', function(){
	loadNotifications(win1);
});

var win2 = Titanium.UI.createWindow({  
    title:'Send notification',
    backgroundColor:'#fff'
});

var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Send notification',
    window:win2
});

var view2 = Ti.UI.createScrollView({
  contentWidth: 'auto',
  contentHeight: 'auto',
  layout: 'vertical',
  showVerticalScrollIndicator: true,
  showHorizontalScrollIndicator: true,
  height: '80%',
  width: '80%'
});

win2.add(view2);

var text = Titanium.UI.createTextField({
	color:'#999',
	hintText: 'Notification text',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

var button = Titanium.UI.createButton({
	color:'#999',
	title:'Send notification',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

button.addEventListener('click', function(){
	if (Titanium.Network.online == true) {
        var request = Titanium.Network.createHTTPClient();
        request.enableKeepAlive = true;
        request.setTimeout(100000000);
        request.open('POST', "http://backend-mjelen.rhcloud.com/notify?text=" + text.value);
        request.onload = function() {
            Ti.API.info(request.responseText);
            tabGroup.activeTab = tab1;
        };
        request.send();
    }
});

view2.add(text);
view2.add(button);

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

tabGroup.open();
