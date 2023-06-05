let input_obj = document.querySelector("[paste]");
let generate = document.querySelector("[generate]");
generate.addEventListener("click", process);
let output = document.querySelector("[op]");
let reset = document.querySelector("[reset]");
reset.addEventListener("click",resetPaste);

function resetPaste(){
    input_obj.value="";
    output.value="";
    copy.innerHTML="Copy Result"
}

let copy = document.querySelector("[copy]")
copy.addEventListener("click",copyContent);

async function copyContent(){
    const text = output.value;
    console.log(text)
    await navigator.clipboard.writeText(text);
    copy.innerHTML="Copied!"
}

function process(){
    copy.innerHTML="Copy Result"
    pass_len = document.querySelector("[paste]").value.split('\n');
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
        if(k=="#" || k=="##" || k=="###" || k=="####" || k=="#####"){
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
        for(let i=0; i<(cnt_Hash>1?cnt_Hash+1:cnt_Hash); i++){
            op+= ' ';
        }
        op += `- [`+filt+`]`;
        let n=`#`;
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