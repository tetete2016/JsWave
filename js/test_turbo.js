(function(){
    /*
    var foo = turbojs.alloc(1e6);

    for (var i = 0; i < 1e6; i++) foo.data[i] = i;
var nFactor = 4;
  turbojs.run(foo, `void main(void) {
    commit(read() * ${nFactor}.);
  }`);
  // print first five elements
  console.log(foo.data.subarray(800, 810));*/
    const width=128;
    const height=128;

    //const u=new Float32Array(width*height);
    //const dudt=new Float32Array(width*height);
    const mem=turbojs.alloc(width*height*4);

    const c=1;
    const id=1;//inverse of dc and dy  the grid is renctangular shape
    const dt=0.1;
    const p=c*c*id*id*dt;
    var start=new Date();

    for(var i=0;i<width*height*4;i++){
        mem[i]=0;//u
        mem[i+1]=0;//dudt
    }
    for(var s=0;s<10;s++){
        mem[(Math.floor(width/2)+(Math.floor(height/2))*width)*4+1]=Math.sin(s*0.1); //dudt 
        for(var i=1;i<width-1;i++){
            for(var j=1;j<height-1;j++){
                //u[i+j*width]=0;
                mem[(i+j*width)*4+1]+=(mem[(i+1+j*width)*4]+mem[(i-1+j*width)*4] +mem[(i+(j+1)*width)*4]+mem[(i+(j-1)*width)*4]-4*mem[(i+j*width)*4])*p;
            }
        } 
        turbojs.run(mem,
                    "void main() {"
                    +"vec4 ipt = read();"
                    +"float res = ipt.r+ipt.g*"+dt+";"
                    +"commit(vec4(ipt.rg, res, 0));"
                    +"}");
    }

    /*
    for(var i=0;i<width*height;i++){
        u[i]=0;
        dudt[i]=0;
    }*/

    /*
    for(var s=0;s<1000;s++){
        dudt[Math.floor(width/2)+(Math.floor(height/2))*width]=Math.sin(s*0.1);

        for(var i=1;i<width-1;i++){
            for(var j=1;j<height-1;j++){
                //u[i+j*width]=0;
                dudt[i+j*width]+=(u[i+1+j*width]+u[i-1+j*width] +u[i+(j+1)*width]+u[i+(j-1)*width]-4*u[i+j*width])*p;
            }
        }
        for(var i=1;i<width-1;i++){
            for(var j=1;j<height-1;j++){
                u[i+j*width]+=dudt[i+j*width]*dt;
            }
        }
    }*/
    var end=new Date();
    var label=document.createElement("span");
    label.innerHTML="time spent:"+(end.getTime()-start.getTime())+"ms";
    document.body.appendChild(label);
    //
    const u=[];
    for(var i=0;i<width*height;i++){
        u.push(mem.data[i*4]);
    }
    const canvas=document.createElement("canvas");
    canvas.width=width*2;
    canvas.height=400;
    const ctx=canvas.getContext("2d");
    document.body.appendChild(canvas);
    function renderArray(){
        var y=Math.floor(height/2);
        ctx.beginPath();
        ctx.moveTo(0,u[i+y*width]*100+150);
        for(var i=1;i<width;i++){
            ctx.lineTo(i*2,u[i+y*width]*100+150);
        }
        ctx.strokeStyle="rgb(0,0,0)";
        ctx.stroke();
    }    

    renderArray();
})();