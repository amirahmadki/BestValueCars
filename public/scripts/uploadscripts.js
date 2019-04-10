//const aws = require("aws-sdk");
function getSign() {
  //alert("file selected");
  document.getElementById("images").onchange = () => {
    const files = document.getElementById("images").files;
    const file = files[0];
    if (file == null) {
      return alert("No file selected.");
    }
    var i = 0;
    for (i = 0; i < files.length; i++) {
      getSignedRequest(files[i]);
    }
  };
}

function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        insert(url);
      } else {
        alert("Could not upload file.");
      }
    }
  };
  xhr.send(file);
}

function insert(url) {
  // alert(url);
  var img = document.createElement("img");
  img.src = url;
  //img.width = 100px;
  img.style.width = "100px";
  img.style.marginRight = "5px";

  document.getElementById("gamediv").appendChild(img);
}
/* 
function deletfileAWS(filename, id, carid) {
  const xhr = new XMLHttpRequest();

  xhr.open("DELETE", `/s3-delete?file-name=${filename}&image-id=${id}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
      } else {
        alert("Delete Un successfull");
      }
    }
  };
  xhr.send();
} */
