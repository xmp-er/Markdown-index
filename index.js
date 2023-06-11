let input_obj = document.querySelector("[paste]");
input_obj.addEventListener("input",function(){
    process(null);
})
let output = document.querySelector("[op]");
let reset = document.querySelector("[reset]");
reset.addEventListener("click",resetPaste);

function openFileUpload() {
    var fileInput = document.getElementById('fileInput');
    fileInput.click();
  }
  

let uploadButton = document.querySelector("[uploadedFile]");
uploadButton.addEventListener("click",extractText);
function resetPaste(){
    input_obj.value="";
    output.value="";
    copy.innerHTML="Copy Result"
}
function extractTextSub() {
    return new Promise(function(resolve, reject) {
      var fileInput = document.getElementById("fileInput");
  
      fileInput.onchange = function(event) {
        var file = fileInput.files[0];
        if (!file) {
          reject("No file selected.");
          return;
        }
  
        var reader = new FileReader();
  
        reader.onload = function(event) {
          var text = event.target.result;
          resolve(text);
        };
  
        reader.onerror = function(event) {
          reject(event.target.error);
        };
  
        reader.readAsText(file);
      };
    });
  }

function extractText(){
    extractTextSub().then(function(text) {
        process(text);
        input_obj.value = text;
      }).catch(function(error) {
        console.error(error);
      });
}
  

let copy = document.querySelector("[copy]")
copy.addEventListener("click",copyContent);

async function copyContent(){
    const text = output.value;
    await navigator.clipboard.writeText(text);
    copy.innerHTML="Copied!"
    setTimeout(()=>{copy.innerHTML="Copy Result"},1000);
}

let spaces =[[1,1]];

function process(fileInput){
    copy.innerHTML="Copy Result"
    pass_len = fileInput==null?document.querySelector("[paste]").value.split('\n'):fileInput.split('\n');
    // console.log(pass_len.length);
    let res = "";
    let v = [];
    for(let i=0; i<pass_len.length; i++){
        let s = pass_len[i];
        let k = "";
        let j = 0;
        for(; j<s.length-1; j++){
            if(s[j+1]==' '){
                k += s[j];
                break;
            }
            k += s[j];
        }
        let isHeading = false;
        if(/^#+$/.test(k)){
            v.push(s);
            isHeading = true;
        }
        res += s+'\n';
        if(isHeading == true){
            res += "[Index](#index)\n \n";
        }
    }
    let op = ``;
    op+= `# Index\n`;
    for(let i=0; i<v.length; i++){
        let isFirst = false;
        let filt = ``;
        for(let k=0; k<v[i].length; k++){
            if(v[i][k]!='#' && v[i][k]!=' '){
                isFirst = true;
            }
            if(isFirst == true){
                filt += v[i][k];
            }
        }
        let cnt_Hash = 0;
        for(let u=0; u<v[i].length; u++){
            if(v[i][u]=='#'){
                cnt_Hash++;
            }
            else{
                break;
            }
        }

        if(cnt_Hash<spaces[spaces.length-1][1]){
            while(cnt_Hash<spaces[spaces.length-1][1]){
                spaces.pop();
            }
        }

        let last_index_hashes = spaces[spaces.length-1][1];

        let last_index_length = spaces[spaces.length-1][0];

        if(cnt_Hash>last_index_hashes){
            spaces.push([last_index_length=last_index_length+2,cnt_Hash]);
        }



        let lengths_to_be_added_before = last_index_length;

        for(let i=0; i<lengths_to_be_added_before; i++){
            op+= ' ';
        }
        op += `- [`+filt+`]`;
        let n=``;
        for(var e=0;e<cnt_Hash;e++){n+=`#`}
        let index = 0;
        // console.log(v[i]);
        for(;index<v[i].length;index++){
            if(v[i][index]!='#' && v[i][index]!=' ') break;
        }
        while(index<v[i].length){
            while(v[i][index]!=' '){
                if(index>=v[i].length){
                    break;
                }
                if(v[i][index]>='A' && v[i][index]<='Z'){
                    n += String.fromCharCode(v[i][index].charCodeAt(0)+('a'.charCodeAt(0)-'A'.charCodeAt(0)));
                } else if(v[i][index]>='a' && v[i][index]<='z'){
                    if(index>=v[i].length){
                        break;
                    }
                    n += v[i][index];
                } else if(v[i][index]=='-' || !v[i][index].match(/[^\w\s]/)){
                    n += v[i][index];
                }
                index++;
            }
            while(index<v[i].length && !(v[i][index]>='A' && v[i][index]<='Z') && !(v[i][index]>='a' && v[i][index]<='z') && (!v[i][index].match(/[^\w\s]/))){
                index++;
            }
            if(index<v[i].length){
                n += '-';
            }
        }
        op += `(`+n+`)\n`;
    }
    op += `\n`+res;
    // console.log(1111);
    // console.log(`result is `+res);
    const parser = new DOMParser();
    const html = parser.parseFromString(op, 'text/html');
    output.value=op;
}
