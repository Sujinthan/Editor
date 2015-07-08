function showlogin() {
    var login = document.getElementById('loginCard');
    login.style.display = "block";
    var signup = document.getElementById('singupCard');
    signup.style.display = "none";
}

function showSignup() {
    var signup = document.getElementById('singupCard');
    signup.style.display = "block";
    var login = document.getElementById('loginCard');
    login.style.display = "none";
}

function ShowCancel() {
    var login = document.getElementById('loginCard');
    login.style.display = "none";
    var signup = document.getElementById('singupCard');
    signup.style.display = "none";
}

function showfilename(data) {
    var createfile = document.getElementById("newfilebg");
    createfile.style.display = "none";
    //var local_data = data;
    var filecard;
    var editorholder = document.getElementById("editorholder");
    editorholder.style.display = "none";
    var temp = document.getElementById("Userfile");
    temp.innerHTML = " ";
    for (var items in data) {
        console.log(items);
        for (var file in data[items]){
            console.log(file);
            filecard = document.createElement('div');
            filecard.className = "FileCard";
            var filelabel = document.createElement('p');
            filelabel.innerHTML = file;
            var num = document.createElement("input");
            num.type = "image";
            num.src = "/images/file.png"
            num.className = "File";
            num.id = file;
            num.value = filedata[items][file];
            console.log(filedata[items][file]);
            num.onclick = function () {
                showFileContent(this);
            }
            filecard.appendChild(num);
            filecard.appendChild(filelabel);
            temp.appendChild(filecard);
            }
    }
    temp.style.display = "block";
}

function showlangfile(data, lang) {
    var temp = document.getElementById("Userfile");
    temp.innerHTML = " ";
    console.log(lang);
    var createfile = document.getElementById("newfilebg");
    createfile.style.display = "none";
    //var local_data = data;
    var filecard;
    var editorholder = document.getElementById("editorholder");
    editorholder.style.display = "none";
    for (var items in data) {
        filecard = document.createElement('div');
        filecard.className = "FileCard";
        var filelabel = document.createElement('p');
        filelabel.innerHTML = items;
        var num = document.createElement("input");
        num.type = "image";
        num.src = "/images/file.png"
        num.className = "File";
        num.id = items;
        num.value = data[items];
        console.log(data[items]);
        num.onclick = function () {
            showFileContent(this,lang);
        }
        filecard.appendChild(num);
        filecard.appendChild(filelabel);
        temp.appendChild(filecard);
    }
    filecard = document.createElement('div');
    filecard.className = "FileCard";
    var filelabel = document.createElement('p');
    filelabel.innerHTML = "New File";
    var num = document.createElement("input");
    num.type = "image";
    num.src = "/images/Addiconlight.png"
    num.className = "File";
    num.id = 'newFile';
    num.value = 'new';
    num.onclick = function () {
        shownewFile(lang);
    }
    filecard.appendChild(num);
    filecard.appendChild(filelabel);
    temp.appendChild(filecard);
    temp.style.display = "block";
}

function shownewFile(lang) {
    var createfile = document.getElementById("newfilebg");
    createfile.style.display = "block";
    var okaybtn = document.getElementById("Okay");
    okaybtn.onclick = function(){
        showEditor(lang)
    }
    var userfile = document.getElementById("Userfile");
    userfile.style.display = "none";
}

function showEditor(lang) {
    console.log("inside showEditor");
    console.log(lang);
    var title = document.getElementById("new_name").value;
    var titlelabel = document.getElementById('titles');
    var code;
    if (lang === 'java'){
        titlelabel.innerHTML = title + ".java";
        code = "public class " + title + " {\n\tpublic static void main(String[] args) { \n \n\t} \n}";
        editor.getSession().setMode("ace/mode/java");
        editor.setValue(code);
        title = title + ".java";  
    }
   if (lang === 'python'){
        titlelabel.innerHTML = title +  ".py";
        code = "";
        editor.getSession().setMode("ace/mode/python");
        editor.setValue(code);
        title = title + ".py";
    }
    if (lang === 'csharp'){
        editor.getSession().setMode("ace/mode/csharp");
        titlelabel.innerHTML = title + ".cs";
        code = "using System \n\nnamespace " +title +"Application {\n\tclass " + title + "{\n\t\tstatic void Main(string[] args){\n \n\t\t}\n\t}\n}";
        editor.setValue(code);
        title = title + ".cs";
    }
    var elems = document.getElementsByClassName("save");
    for (var i = 0; i < elems.length; i++) {
        elems[i].id = "savenew";
    }
    var divEditor = document.getElementById("editorholder");
    divEditor.style.display = "block";
    var createfile = document.getElementById("newfilebg");
    createfile.style.display = "none";
    console.log(title);
    $("#savenew").click(function (event) {
        var content = editor.getValue();
        $.ajax({
            url: '/newfile',
            type: 'POST',
            data: { 'code': content, 'name': title, 'lang': lang },
            processData: 'false',
            success: function (data) {
                datas = JSON.stringify(data);
                console.log("This is datas" + datas);
            }
        });
        event.preventDefault();
        return false;
    });
}

function showFileContent(element,lang) {
    var data;
    console.log("This is element value");
     console.log("This is lang :");
    console.log(lang);
    console.log(element.value);
    //setEditor(codeURL);
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            data = xmlhttp.responseText;

        }
    }
    xmlhttp.open("GET", element.value, false);
    xmlhttp.send();
    var title = element.id;
    setEditor(data, title,lang);
}

function setEditor(code, name,lang) {
    var divEditor = document.getElementById("editorholder");
    var afterDot = name.substr(name.indexOf('.'));
    if(afterDot === "java"){
        editor.getSession().setMode("ace/mode/java");
    }else if(afterDot ==='py'){
        editor.getSession().setMode("ace/mode/python");
    }else{
        editor.getSession().setMode("ace/mode/csharp");
    }
    editor.setValue(code);
    var saveinput = document.createElement('input');
    saveinput.type = ""
    var titlelabel = document.getElementById('titles');
    titlelabel.innerHTML = name;
    divEditor.style.display = "block";
    var rename = document.getElementById("newfilebg");
    rename.style.display = "none";
    var Userfile = document.getElementById("Userfile");
    Userfile.style.display = "none";
    var elems = document.getElementsByClassName("save");
    for (var i = 0; i < elems.length; i++) {
        elems[i].id = "saveold";
    }
    $("#saveold").click(function (event) {
        var content = editor.getValue();
        $.ajax({
            url: '/getcode',
            type: 'POST',
            data: { 'codes': content, 'names': name, 'lang':lang },
            processData: 'false',
            success: function (data) {
                datas = JSON.stringify(data);
                console.log("This is datas" + datas);
            }
        });
        event.preventDefault();
        return false;
    });
}

function showlogin(){
    $('#content').animate({
    scrollTop: $("#joinus").offset().top},
    'slow');
}