function pressCheck(event, type) {
    // enter key 
    if (event.keyCode == 13) {
        parseURL(type);
    }
}

function parseURL(type) {
    if (type == 'page') {
        var url = document.getElementById('page_url').value;
    }
    else if (type == 'user') {
        var url = document.getElementById('user_url').value;
    }
    if (url == '') {
        return;
    }
    var pageName = getName(url, type);
    getJSONData(pageName, type);
}

function getName(url, type) {
    var s = url.split('/')[3];
    
    if (type == 'user' && s.search('profile.php') == 0) {
        s = s.split('?')[1].split('&')[0];
        s = s.substr(3);
    }
    else {
        var end = s.search("\\?");
        if (end != -1) {
            s = s.slice(0, end);
        }
    }
    return s;
}

function getJSONData(pageName, type) {
    var url = "http://graph.facebook.com/" + pageName;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var result = JSON.parse(xmlhttp.responseText);
            if (type == 'user') {
                userOutput(result);
            }
            else if (type == 'page') {
                pageOutput(result);
            }
        }
    }
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
}

function pageOutput(result) {
    // console.log(result.hasOwnProperty('id'));
    var rssURL = "http://www.facebook.com/feeds/page.php?format=rss20&id=" +
                 result['id'];
    result = document.getElementById("rss_link");
    result.value = rssURL;
    result.focus();
}

function userOutput(result) {
    var userURL = "http://www.facebook.com/search/" + result['id'] + "/photos-of";
    document.getElementById("user_output").innerHTML = '<p><a href=\"' + userURL + '\" target=\"_blank\">GO!</a></p>';
}
