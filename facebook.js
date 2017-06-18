document.getElementById('contentArea').textContent="";
document.getElementById('fbNotificationsJewel').style.display = "none";

// For IE<8 compatibility
if (!window.XMLHttpRequest && 'ActiveXObject' in window) {
    window.XMLHttpRequest= function() {
        return new ActiveXObject('MSXML2.XMLHttp');
    };
}

var xhr= new XMLHttpRequest();
xhr.open('GET', 'popup/index.html', true);
xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return; // or whatever error handling you want
    document.getElementById('contentArea').innerHTML= this.responseText;
};
xhr.send();