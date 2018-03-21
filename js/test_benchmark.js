var benchmark_a=(function(){
    const width=128;
    const height=128;

    const u=new Float64Array(width*height);
    const dudt=new Float64Array(width*height);

    const c=1;
    const id=1;//inverse of dc and dy  the grid is renctangular shape
    const dt=0.1;
    const p=c*c*id*id*dt;
    var start=new Date();
    
    for(var i=0;i<width*height;i++){
        u[i]=0;
        dudt[i]=0;
    }
    
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
    }
    var end=new Date();
    var label=document.createElement("span");
    label.innerHTML="time spent while the simulation (Float64Array):"+(end.getTime()-start.getTime())+"ms";
    document.getElementById("arr32").appendChild(label);
    //
    const canvas=document.getElementById("cv32");
    canvas.width=width;
    canvas.height=200;
    const ctx=canvas.getContext("2d");
    //document.getElementById("arr32").appendChild(canvas);
    function renderArray(){
        var y=Math.floor(height/2);
        ctx.beginPath();
        ctx.moveTo(0,u[i+y*width]*100+100);
        for(var i=1;i<width;i++){
            ctx.lineTo(i,u[i+y*width]*100+100);
        }
        ctx.strokeStyle="rgb(0,0,0)";
        ctx.stroke();
    }    

    renderArray();
});
var benchmark_b=(function(){
    const width=128;
    const height=128;

    const u=new Array(width*height);
    const dudt=new Array(width*height);

    const c=1;
    const id=1;//inverse of dc and dy  the grid is renctangular shape
    const dt=0.1;
    const p=c*c*id*id*dt;
    var start=new Date();
    for(var i=0;i<width*height;i++){
        u[i]=0;
        dudt[i]=0;
    }
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
    }
    var end=new Date();
    var label=document.createElement("span");
    label.innerHTML="time spent while the simulation (Array):"+(end.getTime()-start.getTime())+"ms";
    document.getElementById("arr").appendChild(label);

    const canvas=document.getElementById("cv");
    canvas.width=width;
    canvas.height=200;
    const ctx=canvas.getContext("2d");
    function renderArray(){
        var y=Math.floor(height/2);
        ctx.beginPath();
        ctx.moveTo(0,u[i+y*width]*100+100);
        for(var i=1;i<width;i++){
            ctx.lineTo(i,u[i+y*width]*100+100);
        }
        ctx.strokeStyle="rgb(0,0,0)";
        ctx.stroke();
    }    

    renderArray();
});
benchmark_b();
benchmark_a();